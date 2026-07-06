import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Per-shot attribute suggestion route (P0.2b): given a product's images, propose the
// per-image spec fields a vision model reads directly from the shot — orientation,
// facing, angle, and a one-line description. Strictly optional: the manual per-shot
// form is complete without this. Server-only; GEMINI_API_KEY never reaches the client.
export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const GEMINI_MODEL = "gemini-2.5-flash"

// Kept in sync with the wizard's option lists (image-upload-wizard.tsx). The model may
// only answer with these codes; anything else is dropped server-side.
const ORIENTATION_CODES = ["PRI", "VF1", "VIK", "VIS", "SDL", "SDR", "VIB", "VIT", "VBK"]
const FACING_CODES = ["1", "2", "3", "7", "8", "9"]
const ANGLE_CODES = ["1", "2", "3", "7", "8", "9"]

export type ShotSuggestion = {
  fileName: string
  orientation: string
  facing: string
  angle: string
  description: string
  confidence: number
}

export type ShotSuggestionsResponse = { suggestions: ShotSuggestion[] }

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

  let body: { images?: unknown; productDescription?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { images, productDescription } = body
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

  const product = typeof productDescription === "string" ? productDescription.trim() : ""

  const prompt = `For each product image below, identify the camera viewpoint and draft a short description.
${product ? `The product is: ${product}\n` : ""}
Images, in order:
${validated.map((img, i) => `  Image ${i + 1}: ${img.fileName}`).join("\n")}

Allowed codes (answer ONLY with these):
- orientation: PRI (primary/hero), VF1 (front), VIK, VIS, SDL (side left), SDR (side right), VIB (bottom), VIT (top), VBK (back)
- facing: 1 (front), 2 (left), 3 (top), 7 (back), 8 (right), 9 (bottom)
- angle: 1 (center, no plunge), 2 (left, no plunge), 3 (right, no plunge), 7 (center, plunge), 8 (left, plunge), 9 (right, plunge)

Rules:
- Return one entry per image, matching fileName exactly.
- description: one concise sentence describing what the image shows.
- confidence: a number between 0 and 1 per entry.
- Return JSON only, no markdown fences, in exactly this shape:
{ "suggestions": [ { "fileName": string, "orientation": string, "facing": string, "angle": string, "description": string, "confidence": number } ] }`

  const callGemini = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{
        role: "user",
        parts: [{ text: prompt }, ...validated.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.imageBase64 } }))],
      }],
      config: { responseMimeType: "application/json", temperature: 0.2 },
    })
    return response.text ?? ""
  }

  let rawText: string
  try {
    rawText = await callGemini()
  } catch {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      rawText = await callGemini()
    } catch {
      return NextResponse.json({ error: "AI suggestion failed. Please continue manually." }, { status: 500 })
    }
  }

  let parsed: { suggestions?: unknown }
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch {
    return NextResponse.json({ error: "AI returned an unreadable response." }, { status: 500 })
  }

  // Server-side authority: only known file names and allowed codes survive.
  const knownNames = new Set(validated.map(i => i.fileName))
  const clean: ShotSuggestion[] = []
  for (const s of Array.isArray(parsed.suggestions) ? parsed.suggestions : []) {
    if (typeof s !== "object" || s === null) continue
    const { fileName, orientation, facing, angle, description, confidence } = s as Record<string, unknown>
    if (typeof fileName !== "string" || !knownNames.has(fileName)) continue
    const cleanOrientation = typeof orientation === "string" && ORIENTATION_CODES.includes(orientation) ? orientation : ""
    if (!cleanOrientation) continue // orientation is the point of this route
    clean.push({
      fileName,
      orientation: cleanOrientation,
      facing: typeof facing === "string" && FACING_CODES.includes(facing) ? facing : "",
      angle: typeof angle === "string" && ANGLE_CODES.includes(angle) ? angle : "",
      description: typeof description === "string" ? description.trim().slice(0, 300) : "",
      confidence: clampConfidence(confidence),
    })
  }

  return NextResponse.json<ShotSuggestionsResponse>({ suggestions: clean })
}
