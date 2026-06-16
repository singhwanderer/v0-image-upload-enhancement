import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { getCategoryOptions } from "@/lib/gs1/generated-options"

// Server-only route. The GEMINI_API_KEY never reaches the client.
export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_CATEGORIES = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty", "Home"] as const
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const GEMINI_MODEL = "gemini-2.5-flash"

// ExtractionApiResponse: product-level response shape returned by this route.
// Does not include status — that is a client-side lifecycle concern.
export type ExtractionApiResponse = {
  category: string
  imageCount: number
  imageNames: string[]
  attributes: {
    codeListName: string
    attributeValue: string
    code: string
    confidence: number
    reason: string
  }[]
  unresolvedAttributes: {
    codeListName: string
    reason: string
  }[]
}

// Request shape: one call per product with all images bundled together.
type ImageInput = {
  fileName: string
  imageBase64: string
  mimeType: string
}

type RawAttribute = {
  codeListName?: unknown
  attributeValue?: unknown
  code?: unknown
  confidence?: unknown
  reason?: unknown
}

type RawUnresolved = {
  codeListName?: unknown
  reason?: unknown
}

type CleanAttribute = {
  codeListName: string
  attributeValue: string
  code: string
  confidence: number
  reason: string
}

type CleanUnresolved = {
  codeListName: string
  reason: string
}

// Strip markdown code fences (```json ... ```) and isolate the first JSON object.
function extractJsonText(text: string): string {
  let t = text.trim()
  const fenceMatch = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch) t = fenceMatch[1].trim()
  const firstBrace = t.indexOf("{")
  const lastBrace = t.lastIndexOf("}")
  if (firstBrace >= 0 && lastBrace > firstBrace) t = t.slice(firstBrace, lastBrace + 1)
  return t
}

function clampConfidence(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value))
  if (!Number.isFinite(n)) return 0.5
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

export async function POST(request: Request) {
  // 1. Validate API key (server-side only)
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  // 2. Parse request body
  let body: { category?: unknown; images?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { category, images } = body

  // 3. Validate category
  if (
    typeof category !== "string" ||
    !ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])
  ) {
    return NextResponse.json(
      { error: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}.` },
      { status: 400 },
    )
  }

  // 4. Validate images array
  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "images must be a non-empty array." },
      { status: 400 },
    )
  }

  const validatedImages: ImageInput[] = []
  for (const img of images) {
    if (typeof img !== "object" || img === null) {
      return NextResponse.json({ error: "Each image must be an object." }, { status: 400 })
    }
    const { fileName, imageBase64, mimeType } = img as Record<string, unknown>
    if (typeof fileName !== "string" || !fileName.trim()) {
      return NextResponse.json({ error: "Each image must have a fileName." }, { status: 400 })
    }
    if (typeof imageBase64 !== "string" || imageBase64.length === 0) {
      return NextResponse.json({ error: "Each image must have a non-empty imageBase64." }, { status: 400 })
    }
    if (typeof mimeType !== "string" || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported image type in one or more images. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}.` },
        { status: 400 },
      )
    }
    validatedImages.push({ fileName: fileName.trim(), imageBase64, mimeType })
  }

  // 5. Load this category's GS1 options (never the full CSV, never other categories)
  const options = getCategoryOptions(category)
  if (options.length === 0) {
    return NextResponse.json<ExtractionApiResponse>({
      category,
      imageCount: validatedImages.length,
      imageNames: validatedImages.map(i => i.fileName),
      attributes: [],
      unresolvedAttributes: [],
    })
  }

  // Build validation lookups: codeListName -> (value -> code)
  const valueToCode = new Map<string, Map<string, string>>()
  for (const opt of options) {
    const m = new Map<string, string>()
    for (const v of opt.values) m.set(v.value, v.code)
    valueToCode.set(opt.codeListName, m)
  }

  // Compact allowed-options block for the prompt
  const allowedOptionsText = options
    .map(
      (o) =>
        `- ${o.codeListName}:\n` +
        o.values.map((v) => `    • "${v.value}" => ${v.code}`).join("\n"),
    )
    .join("\n")

  // Image list for prompt context (so model can reference which image provided evidence)
  const imageListText = validatedImages
    .map((img, i) => `  Image ${i + 1}: ${img.fileName}`)
    .join("\n")

  // 6. Prompt — explicitly product-level, multi-image
  const prompt = `You are extracting one product-level set of GS1-style extended attributes from multiple images of the same product.

Product category: ${category}

You have been provided with ${validatedImages.length} image${validatedImages.length !== 1 ? "s" : ""} of the same product:
${imageListText}

Treat all uploaded images as evidence for the same product. Return one consolidated attribute set, not separate results per image.

Allowed GS1 options (Code List Name, then allowed Attribute Values and their exact codes):
${allowedOptionsText}

Rules:
- Use only the provided allowed GS1 options.
- Do not invent Code List Names, Attribute Values, or GS1 codes.
- The returned code must match the selected Attribute Value exactly as listed above.
- If an attribute is clearly visible in any of the uploaded images, it can be suggested.
- If an attribute is not visible in any of the uploaded images, put it in unresolvedAttributes.
- If images show conflicting evidence for the same attribute, put that attribute in unresolvedAttributes and explain the conflict in the reason field.
- Do not infer hidden or non-visible attributes.
- Do not infer Advertised Origin, Care Instructions, Water Repellent, SPF Rating, Scent Type, or Material Composition unless visible on packaging, product label, or readable text in an image.
- Reference the image name(s) in the reason field where helpful (e.g. "Visible in Image 1: front-view.jpg").
- Confidence must be a number between 0 and 1.
- Return JSON only, with no markdown fences and no commentary.

Return JSON in exactly this shape:
{
  "category": "${category}",
  "attributes": [
    { "codeListName": string, "attributeValue": string, "code": string, "confidence": number, "reason": string }
  ],
  "unresolvedAttributes": [
    { "codeListName": string, "reason": string }
  ]
}`

  // 7. Build Gemini content parts — prompt text first, then all image inline data
  const imageParts = validatedImages.map((img) => ({
    inlineData: { mimeType: img.mimeType, data: img.imageBase64 },
  }))

  // 8. Call Gemini with all images in one request
  let rawText: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    })
    rawText = response.text ?? ""
  } catch (err) {
    console.error(
      "[extract-attributes] Gemini request failed:",
      err instanceof Error ? err.message : String(err),
    )
    return NextResponse.json(
      { error: "AI extraction failed. Please try again or continue manually." },
      { status: 500 },
    )
  }

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "AI returned an empty response. Please try again or continue manually." },
      { status: 500 },
    )
  }

  // 9. Parse defensively
  let parsed: { attributes?: unknown; unresolvedAttributes?: unknown }
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch (err) {
    console.error(
      "[extract-attributes] Failed to parse Gemini JSON:",
      err instanceof Error ? err.message : String(err),
    )
    return NextResponse.json(
      { error: "AI returned an unreadable response. Please try again or continue manually." },
      { status: 500 },
    )
  }

  // 10. Validate against the GS1 category map (server-side authority)
  const cleanAttributes: CleanAttribute[] = []
  const cleanUnresolved: CleanUnresolved[] = []

  const rawAttributes: RawAttribute[] = Array.isArray(parsed.attributes) ? parsed.attributes : []
  const rawUnresolved: RawUnresolved[] = Array.isArray(parsed.unresolvedAttributes)
    ? parsed.unresolvedAttributes
    : []

  for (const a of rawAttributes) {
    const codeListName = typeof a.codeListName === "string" ? a.codeListName.trim() : ""
    const attributeValue = typeof a.attributeValue === "string" ? a.attributeValue.trim() : ""
    const code = typeof a.code === "string" ? a.code.trim() : ""

    const codeMap = valueToCode.get(codeListName)
    if (!codeMap) {
      if (codeListName) {
        cleanUnresolved.push({
          codeListName,
          reason: "Returned a Code List Name outside the allowed options.",
        })
      }
      continue
    }
    const expectedCode = codeMap.get(attributeValue)
    if (!expectedCode) {
      cleanUnresolved.push({
        codeListName,
        reason: "Returned an Attribute Value outside the allowed options.",
      })
      continue
    }
    // Code is always overwritten with the authoritative curated code
    cleanAttributes.push({
      codeListName,
      attributeValue,
      code: expectedCode,
      confidence: clampConfidence(a.confidence),
      reason:
        typeof a.reason === "string" && a.reason.trim()
          ? a.reason.trim()
          : "Based on visible product features.",
    })
  }

  for (const u of rawUnresolved) {
    const codeListName = typeof u.codeListName === "string" ? u.codeListName.trim() : ""
    if (!codeListName) continue
    cleanUnresolved.push({
      codeListName,
      reason:
        typeof u.reason === "string" && u.reason.trim()
          ? u.reason.trim()
          : "Cannot determine from the images.",
    })
  }

  // De-duplicate unresolved by codeListName (first reason wins)
  const seen = new Set<string>()
  const dedupedUnresolved = cleanUnresolved.filter((u) => {
    if (seen.has(u.codeListName)) return false
    seen.add(u.codeListName)
    return true
  })

  // 11. Product-level response
  return NextResponse.json<ExtractionApiResponse>({
    category,
    imageCount: validatedImages.length,
    imageNames: validatedImages.map((i) => i.fileName),
    attributes: cleanAttributes,
    unresolvedAttributes: dedupedUnresolved,
  })
}
