import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { getCategoryOptions } from "@/lib/gs1/generated-options"

// Server-only route. The GEMINI_API_KEY never reaches the client.
export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_CATEGORIES = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty", "Home"] as const
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const GEMINI_MODEL = "gemini-2.5-flash"

// ExtractionApiResponse: the shape returned by this route.
// It intentionally does NOT include fileId, fileName, or status — those are added
// by the client (runGeminiExtraction) when it merges the response into ExtractionResult.
export type ExtractionApiResponse = {
  category: string
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
  // Remove leading/trailing markdown fences if present
  const fenceMatch = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch) {
    t = fenceMatch[1].trim()
  }
  // If there is leading/trailing prose, isolate the outermost JSON object.
  const firstBrace = t.indexOf("{")
  const lastBrace = t.lastIndexOf("}")
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1)
  }
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

  // Parse request body defensively
  let body: { imageBase64?: unknown; mimeType?: unknown; category?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { imageBase64, mimeType, category } = body

  // 2. Validate image payload
  if (typeof imageBase64 !== "string" || imageBase64.length === 0) {
    return NextResponse.json({ error: "imageBase64 is required." }, { status: 400 })
  }

  // 3. Validate mime type
  if (typeof mimeType !== "string" || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}.` },
      { status: 400 },
    )
  }

  // 4. Validate category
  if (typeof category !== "string" || !ALLOWED_CATEGORIES.includes(category as (typeof ALLOWED_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}.` },
      { status: 400 },
    )
  }

  // 5. Load ONLY this category's curated GS1 options (never the full CSV)
  const options = getCategoryOptions(category)
  if (options.length === 0) {
    return NextResponse.json({ category, attributes: [], unresolvedAttributes: [] })
  }

  // Build validation lookups: codeListName -> (value -> code)
  const valueToCode = new Map<string, Map<string, string>>()
  for (const opt of options) {
    const m = new Map<string, string>()
    for (const v of opt.values) m.set(v.value, v.code)
    valueToCode.set(opt.codeListName, m)
  }

  // Compact allowed-options block for the prompt (only names, values, codes for this category)
  const allowedOptionsText = options
    .map(
      (o) =>
        `- ${o.codeListName}:\n` +
        o.values.map((v) => `    • "${v.value}" => ${v.code}`).join("\n"),
    )
    .join("\n")

  // 6. Prompt
  const prompt = `You are extracting GS1-style extended product attributes from a product image.

Product category: ${category}

Allowed GS1 options (Code List Name, then allowed Attribute Values and their exact codes):
${allowedOptionsText}

Rules:
- Use only the provided allowed GS1 options.
- Do not invent Code List Names.
- Do not invent Attribute Values.
- Do not invent GS1 codes.
- The returned code must match the selected Attribute Value exactly as listed above.
- If unsure, return the item in unresolvedAttributes.
- Do not infer hidden or non-visible attributes.
- Do not infer Advertised Origin, Care Instructions, Water Repellent, SPF Rating, Scent Type, or Material Composition unless visible on packaging, product label, or readable text.
- Return JSON only, with no markdown fences and no commentary.
- Confidence must be a number between 0 and 1.
- Reason should be short and based on visible evidence.

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

  // 7. Call Gemini
  let rawText: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    })
    rawText = response.text ?? ""
  } catch (err) {
    console.error("[extract-attributes] Gemini request failed:", err instanceof Error ? err.message : String(err))
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

  // 8. Parse defensively
  let parsed: { attributes?: unknown; unresolvedAttributes?: unknown }
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch (err) {
    console.error("[extract-attributes] Failed to parse Gemini JSON:", err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: "AI returned an unreadable response. Please try again or continue manually." },
      { status: 500 },
    )
  }

  // 9. Validate against the curated map
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
    // Unknown code list name -> drop with reason
    if (!codeMap) {
      if (codeListName) {
        cleanUnresolved.push({ codeListName, reason: "Returned a Code List Name outside the allowed options." })
      }
      continue
    }
    // Value not in curated map -> move to unresolved
    const expectedCode = codeMap.get(attributeValue)
    if (!expectedCode) {
      cleanUnresolved.push({ codeListName, reason: "Returned an Attribute Value outside the allowed options." })
      continue
    }
    // Code mismatch -> correct it to the curated code (keep the valid value)
    const finalCode = code === expectedCode ? code : expectedCode

    cleanAttributes.push({
      codeListName,
      attributeValue,
      code: finalCode,
      confidence: clampConfidence(a.confidence),
      reason: typeof a.reason === "string" && a.reason.trim() ? a.reason.trim() : "Based on visible product features.",
    })
  }

  for (const u of rawUnresolved) {
    const codeListName = typeof u.codeListName === "string" ? u.codeListName.trim() : ""
    if (!codeListName) continue
    cleanUnresolved.push({
      codeListName,
      reason: typeof u.reason === "string" && u.reason.trim() ? u.reason.trim() : "Cannot determine from the image.",
    })
  }

  // De-duplicate unresolved by codeListName (first reason wins)
  const seen = new Set<string>()
  const dedupedUnresolved = cleanUnresolved.filter((u) => {
    if (seen.has(u.codeListName)) return false
    seen.add(u.codeListName)
    return true
  })

  // 10. Clean response — typed as ExtractionApiResponse (no fileId/fileName/status)
  return NextResponse.json<ExtractionApiResponse>({
    category,
    attributes: cleanAttributes,
    unresolvedAttributes: dedupedUnresolved,
  })
}
