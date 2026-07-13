import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { CATEGORY_BRICKS, getBrick } from "@/lib/gs1/generated-bricks"

// Brick classification route (P1.1): given a product's images, propose the GS1 GPC brick —
// and, for free, its category — instead of asking the human to pick both from dropdowns
// first. This is the "AI proposes, human confirms" entry point; the manual category/brick
// selects remain only as the correction path. Server-only; GEMINI_API_KEY never reaches the
// client.
export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const GEMINI_MODEL = "gemini-3.1-flash-lite"

export type BrickSuggestionResponse = {
  category: string
  brickCode: string
  brickName: string
  confidence: number
  consistent: boolean
  outlierImages?: string[]
  note?: string
}

type ImageInput = { fileName: string; imageBase64: string; mimeType: string }

function extractJsonText(text: string): string {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fence) t = fence[1].trim()
  const first = t.indexOf("{")
  const last = t.lastIndexOf("}")
  if (first >= 0 && last > first) t = t.slice(first, last + 1)
  return t
}

function clampConfidence(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value))
  if (!Number.isFinite(n)) return 0.5
  return Math.min(1, Math.max(0, n))
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 })
  }

  let body: { images?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { images } = body
  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json({ error: "images must be a non-empty array." }, { status: 400 })
  }

  const validated: ImageInput[] = []
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
      return NextResponse.json({ error: "Unsupported image type in one or more images." }, { status: 400 })
    }
    validated.push({ fileName: fileName.trim(), imageBase64, mimeType })
  }

  // Candidate list: every category and its bricks, so the model proposes brick directly —
  // category is a derived lookup afterward (getBrick), never asked for separately.
  const candidatesText = (Object.keys(CATEGORY_BRICKS) as (keyof typeof CATEGORY_BRICKS)[])
    .map(category => {
      const bricks = CATEGORY_BRICKS[category]
      return `${category}:\n${bricks.map(b => `    • ${b.name} => ${b.code}`).join("\n")}`
    })
    .join("\n")

  const imageListText = validated.map((img, i) => `  Image ${i + 1}: ${img.fileName}`).join("\n")

  // The human already confirms "these are all one product" via the upload UI's same-product
  // gate before this route is ever called — but that's a one-click self-report, not a verified
  // check, so this still cross-checks the images against each other as a second, automated
  // line of defense. Deliberately image-only: no product description is sent (no extra input
  // tokens, and outlier detection works by comparing the images to each other, not to text).
  const prompt = `You are classifying a product's GS1 GPC brick from its images.
You have been provided with ${validated.length} image${validated.length !== 1 ? "s" : ""}:
${imageListText}

Choose exactly ONE brick from the candidates below that best matches what the images show.

Candidates (category, then brick name => code):
${candidatesText}

Before choosing, check whether all images plausibly show the same product. Different angles,
colors, or fabrics of one product type are fine. Different garment/item types, or an unrelated
item mixed in (e.g. a shirt photographed alongside a pair of earrings), are NOT — flag those as
inconsistent.

Rules:
- Pick the single best-matching brick code from the list above. Do not invent a code.
- confidence is a number between 0 and 1 reflecting how certain the match is.
- consistent is true only if all images plausibly depict the same product. If false, list the
  filenames of the image(s) that don't match the majority in outlierImages, and give a short
  reason in note (e.g. "Image 2 (earring.jpg) shows a different item than the rest.").
- Return JSON only, no markdown fences, in exactly this shape:
{ "brickCode": string, "confidence": number, "consistent": boolean, "outlierImages": string[], "note": string }`

  const imageParts = validated.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.imageBase64 } }))

  const callGemini = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
      config: { responseMimeType: "application/json", temperature: 0.1 },
    })
    return response.text ?? ""
  }

  let rawText: string
  try {
    rawText = await callGemini()
  } catch (firstErr) {
    console.warn("[suggest-brick] Gemini first attempt failed:", firstErr instanceof Error ? firstErr.message : String(firstErr))
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      rawText = await callGemini()
    } catch (retryErr) {
      console.error("[suggest-brick] Gemini retry also failed:", retryErr instanceof Error ? retryErr.message : String(retryErr))
      return NextResponse.json({ error: "AI classification failed. Please continue manually." }, { status: 500 })
    }
  }

  let parsed: { brickCode?: unknown; confidence?: unknown; consistent?: unknown; outlierImages?: unknown; note?: unknown }
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch {
    return NextResponse.json({ error: "AI returned an unreadable response." }, { status: 500 })
  }

  const brickCode = typeof parsed.brickCode === "string" ? parsed.brickCode.trim() : ""

  // Server-side authority: the proposed code must resolve to a real brick, in some category.
  // Never trust the model's own category label — derive it from the code that actually matched.
  let match: { category: string; brickCode: string; brickName: string } | null = null
  for (const category of Object.keys(CATEGORY_BRICKS) as (keyof typeof CATEGORY_BRICKS)[]) {
    const brick = getBrick(category, brickCode)
    if (brick) {
      match = { category, brickCode: brick.code, brickName: brick.name }
      break
    }
  }

  if (!match) {
    return NextResponse.json({ error: "AI proposed a brick outside the known GPC list." }, { status: 500 })
  }

  // Fail open: an unparseable/missing consistency signal shouldn't block a normal classification.
  const knownFileNames = new Set(validated.map(img => img.fileName))
  const outlierImages = Array.isArray(parsed.outlierImages)
    ? parsed.outlierImages.filter((name): name is string => typeof name === "string" && knownFileNames.has(name))
    : undefined

  return NextResponse.json<BrickSuggestionResponse>({
    category: match.category,
    brickCode: match.brickCode,
    brickName: match.brickName,
    confidence: clampConfidence(parsed.confidence),
    consistent: parsed.consistent !== false,
    ...(outlierImages && outlierImages.length > 0 ? { outlierImages } : {}),
    ...(typeof parsed.note === "string" && parsed.note.trim() ? { note: parsed.note.trim() } : {}),
  })
}
