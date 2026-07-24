import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Server-only route. The GEMINI_API_KEY never reaches the client.
export const runtime = "nodejs"
export const maxDuration = 30

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const GEMINI_MODEL = "gemini-3.1-flash-lite"

// CheckAiImageResponse: a heuristic signal, not a guarantee — Gemini is asked to judge
// visual signs of AI generation (unnatural textures, warped detail, inconsistent lighting/
// reflections, artifact patterns typical of generative models). False positives/negatives
// are expected; this is surfaced in the UI as a flag for review, not an automatic rejection.
export type CheckAiImageResponse = {
  likelyAiGenerated: boolean
  confidence: number
  note: string
  model: string
}

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
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 })
  }

  let body: { fileName?: unknown; imageBase64?: unknown; mimeType?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { fileName, imageBase64, mimeType } = body
  if (typeof fileName !== "string" || !fileName.trim()) {
    return NextResponse.json({ error: "fileName is required." }, { status: 400 })
  }
  if (typeof imageBase64 !== "string" || imageBase64.length === 0) {
    return NextResponse.json({ error: "imageBase64 is required." }, { status: 400 })
  }
  if (typeof mimeType !== "string" || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}.` },
      { status: 400 },
    )
  }

  const prompt = `Look at this product image (file name: ${fileName}) and judge whether it appears to be AI-generated (e.g. produced by a generative image model) rather than a real photograph of a physical product.

Consider: unnatural or inconsistent textures, warped or nonsensical fine detail (hands, text, seams, stitching), implausible lighting or reflections, overly smooth/plastic rendering, or other generative-model artifacts.

Return JSON only, no markdown fences, no commentary, in exactly this shape:
{
  "likelyAiGenerated": boolean,
  "confidence": number,
  "note": string
}
"confidence" is between 0 and 1 and reflects your certainty in the likelyAiGenerated call either way. "note" is one short sentence explaining the main visual signal behind the judgment.`

  const callGemini = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { inlineData: { mimeType, data: imageBase64 } }],
        },
      ],
      config: { responseMimeType: "application/json", temperature: 0.1 },
    })
    return response.text ?? ""
  }

  let rawText: string
  try {
    rawText = await callGemini()
  } catch (firstErr) {
    console.warn(
      "[check-ai-image] Gemini request failed, retrying in 2s:",
      firstErr instanceof Error ? firstErr.message : String(firstErr),
    )
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      rawText = await callGemini()
    } catch (retryErr) {
      console.error(
        "[check-ai-image] Gemini retry also failed:",
        retryErr instanceof Error ? retryErr.message : String(retryErr),
      )
      return NextResponse.json({ error: "AI-image check failed. Please try again." }, { status: 500 })
    }
  }

  if (!rawText.trim()) {
    return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 })
  }

  let parsed: { likelyAiGenerated?: unknown; confidence?: unknown; note?: unknown }
  try {
    parsed = JSON.parse(extractJsonText(rawText))
  } catch (err) {
    console.error("[check-ai-image] Failed to parse Gemini JSON:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: "AI returned an unreadable response." }, { status: 500 })
  }

  return NextResponse.json<CheckAiImageResponse>({
    likelyAiGenerated: parsed.likelyAiGenerated === true,
    confidence: clampConfidence(parsed.confidence),
    note: typeof parsed.note === "string" && parsed.note.trim() ? parsed.note.trim() : "No explanation provided.",
    model: GEMINI_MODEL,
  })
}
