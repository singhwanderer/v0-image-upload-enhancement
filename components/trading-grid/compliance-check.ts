// Evaluates a staged image against a chosen ComplianceStandard.
//
// Dimensions/DPI/format/size rules reuse the deterministic metadata already captured by
// image-metadata.ts. Background color is sampled directly here (canvas pixel read at the
// image edges/corners — no AI involved). The AI-generated-image rule is the one signal this
// module cannot produce itself: it's supplied by the caller (from the Gemini-backed
// /api/check-ai-image route) since only the browser has the file bytes to sample, and only
// the server has the Gemini API key.

import type { MeasuredImageMetadata } from "./image-metadata"
import type { ComplianceStandard } from "./compliance-standards"
import type { UploadedFile } from "./uploaded-file"
import type { CheckAiImageResponse } from "@/app/api/check-ai-image/route"

export type ComplianceRuleResult = {
  id: string
  label: string
  // null = could not be evaluated (metadata unavailable, or AI signal not fetched yet)
  passed: boolean | null
  expected: string
  actual: string
}

export type ComplianceReport = {
  standardId: string
  rules: ComplianceRuleResult[]
  // "compliant": every evaluated rule passed. "non-compliant": at least one rule failed.
  // "pending": no rule has failed yet, but at least one is still unresolved (null).
  status: "compliant" | "non-compliant" | "pending"
}

export type AiImageSignal = {
  likelyAiGenerated: boolean
  confidence: number
  note?: string
}

const SAMPLE_STEPS: number = 5 // points sampled along each edge
const EDGE_MARGIN = 0.03 // sample just inside the border, not the outermost pixel

// Samples background color from a grid of points around the image's edges (not the whole
// canvas — an edge/corner sample approximates "background" without needing subject segmentation).
export async function sampleBackgroundColor(
  file: File,
): Promise<{ r: number; g: number; b: number } | null> {
  let bmp: ImageBitmap
  try {
    bmp = await createImageBitmap(file)
  } catch {
    return null
  }
  try {
    const canvas = document.createElement("canvas")
    canvas.width = bmp.width
    canvas.height = bmp.height
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(bmp, 0, 0)

    const points: [number, number][] = []
    for (let i = 0; i < SAMPLE_STEPS; i++) {
      const t = SAMPLE_STEPS === 1 ? 0.5 : i / (SAMPLE_STEPS - 1)
      const x = Math.round(EDGE_MARGIN * bmp.width + t * (1 - 2 * EDGE_MARGIN) * bmp.width)
      const y = Math.round(EDGE_MARGIN * bmp.height + t * (1 - 2 * EDGE_MARGIN) * bmp.height)
      points.push([x, Math.round(EDGE_MARGIN * bmp.height)]) // top edge
      points.push([x, Math.round((1 - EDGE_MARGIN) * bmp.height)]) // bottom edge
      points.push([Math.round(EDGE_MARGIN * bmp.width), y]) // left edge
      points.push([Math.round((1 - EDGE_MARGIN) * bmp.width), y]) // right edge
    }

    let r = 0
    let g = 0
    let b = 0
    for (const [x, y] of points) {
      const data = ctx.getImageData(x, y, 1, 1).data
      r += data[0]
      g += data[1]
      b += data[2]
    }
    const n = points.length
    return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) }
  } catch {
    return null
  } finally {
    bmp.close()
  }
}

function rgbDistance(actual: { r: number; g: number; b: number }, target: [number, number, number]): number {
  return Math.sqrt((actual.r - target[0]) ** 2 + (actual.g - target[1]) ** 2 + (actual.b - target[2]) ** 2)
}

function extensionOf(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? ""
}

// aiSignal: pass `undefined` while the AI check hasn't been fetched yet (renders as pending),
// or `null` when the standard doesn't require it / the check failed (renders as not applicable).
export async function evaluateCompliance(
  file: File,
  measured: MeasuredImageMetadata | undefined,
  standard: ComplianceStandard,
  aiSignal: AiImageSignal | null | undefined,
): Promise<ComplianceReport> {
  const { rules } = standard
  const results: ComplianceRuleResult[] = []
  const width = measured?.width ?? null
  const height = measured?.height ?? null

  if (rules.minWidth || rules.minHeight || rules.maxWidth || rules.maxHeight) {
    const known = width !== null && height !== null
    const passed = known
      ? (!rules.minWidth || width! >= rules.minWidth) &&
        (!rules.minHeight || height! >= rules.minHeight) &&
        (!rules.maxWidth || width! <= rules.maxWidth) &&
        (!rules.maxHeight || height! <= rules.maxHeight)
      : null
    const expectedParts: string[] = []
    if (rules.minWidth && rules.minHeight) expectedParts.push(`min ${rules.minWidth}×${rules.minHeight}px`)
    if (rules.maxWidth && rules.maxHeight) expectedParts.push(`max ${rules.maxWidth}×${rules.maxHeight}px`)
    results.push({
      id: "dimensions",
      label: "Pixel dimensions",
      passed,
      expected: expectedParts.join(", "),
      actual: known ? `${width}×${height}px` : "unknown",
    })
  }

  if (rules.aspectRatio) {
    const known = width !== null && height !== null && height! > 0
    const actualRatio = known ? width! / height! : null
    const passed = actualRatio !== null
      ? Math.abs(actualRatio - rules.aspectRatio.ratio) <= rules.aspectRatio.tolerance
      : null
    results.push({
      id: "aspectRatio",
      label: "Aspect ratio",
      passed,
      expected: `${rules.aspectRatio.ratio}:1 ±${rules.aspectRatio.tolerance}`,
      actual: actualRatio !== null ? `${actualRatio.toFixed(2)}:1` : "unknown",
    })
  }

  if (rules.minDpi) {
    const dpi = measured?.dpi ?? null
    results.push({
      id: "dpi",
      label: "Print density (DPI)",
      passed: dpi !== null ? dpi >= rules.minDpi : null,
      expected: `≥ ${rules.minDpi} DPI`,
      actual: dpi !== null ? `${dpi} DPI` : "unknown",
    })
  }

  if (rules.allowedFormats && rules.allowedFormats.length > 0) {
    const ext = extensionOf(file.name)
    results.push({
      id: "format",
      label: "File format",
      passed: rules.allowedFormats.includes(ext),
      expected: rules.allowedFormats.map(f => f.toUpperCase()).join(" / "),
      actual: ext ? ext.toUpperCase() : "unknown",
    })
  }

  if (rules.maxFileSizeBytes) {
    results.push({
      id: "fileSize",
      label: "File size",
      passed: file.size <= rules.maxFileSizeBytes,
      expected: `≤ ${(rules.maxFileSizeBytes / 1024).toFixed(0)} KB`,
      actual: `${(file.size / 1024).toFixed(0)} KB`,
    })
  }

  if (rules.background) {
    const sampled = await sampleBackgroundColor(file)
    const passed = sampled !== null ? rgbDistance(sampled, rules.background.rgb) <= rules.background.tolerance : null
    results.push({
      id: "background",
      label: "Background color",
      passed,
      expected: rules.background.label,
      actual: sampled ? `rgb(${sampled.r}, ${sampled.g}, ${sampled.b})` : "unknown",
    })
  }

  if (rules.requiresNonAiGenerated) {
    const passed = aiSignal === undefined ? null : aiSignal === null ? null : !aiSignal.likelyAiGenerated
    results.push({
      id: "aiGenerated",
      label: "Non-AI-generated image",
      passed,
      expected: "Not flagged as AI-generated",
      actual:
        aiSignal === undefined
          ? "Checking…"
          : aiSignal === null
            ? "Check unavailable"
            : aiSignal.likelyAiGenerated
              ? `Likely AI-generated (${Math.round(aiSignal.confidence * 100)}% confidence)`
              : `No AI-generation signal detected`,
    })
  }

  const hasFailure = results.some(r => r.passed === false)
  const hasPending = results.some(r => r.passed === null)
  const status: ComplianceReport["status"] = hasFailure ? "non-compliant" : hasPending ? "pending" : "compliant"

  return { standardId: standard.id, rules: results, status }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "")
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// Calls the Gemini-backed /api/check-ai-image route. Returns null (not a failure state per
// se — evaluateCompliance treats null as "check unavailable") if the request or parsing fails,
// so a flaky network call degrades the compliance panel instead of crashing it.
export async function fetchAiImageSignal(file: UploadedFile): Promise<AiImageSignal | null> {
  try {
    const imageBase64 = await fileToBase64(file.file)
    const res = await fetch("/api/check-ai-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, imageBase64, mimeType: file.type }),
    })
    if (!res.ok) return null
    const data: CheckAiImageResponse = await res.json()
    return { likelyAiGenerated: data.likelyAiGenerated, confidence: data.confidence, note: data.note }
  } catch {
    return null
  }
}
