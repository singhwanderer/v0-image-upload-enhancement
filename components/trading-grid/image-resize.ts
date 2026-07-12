import { zipSync } from "fflate"

// Client-side downscale for real image downloads. Decodes the staged File, scales it so it
// fits the requested cap (never upscales), and re-encodes in the source format. Aspect ratio
// is always preserved; PNG keeps its alpha channel through the canvas re-encode.

export type ResizedImage = {
  blob: Blob
  width: number
  height: number
  // False when the image already fit the cap and the original bytes were passed through.
  resized: boolean
}

// Formats canvas.toBlob can re-encode; anything else falls back to JPEG.
const ENCODABLE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// Scales an image to fit inside a max width × height bounding box, preserving aspect ratio and
// never upscaling. A null/≤0 axis is uncapped, so `resizeToFit(f, 1024, null)` caps width only,
// and `resizeToFit(f, L, L)` reproduces a square long-edge cap of L. When nothing needs to
// shrink, the original bytes are passed through untouched (resized: false).
export async function resizeToFit(
  file: Blob,
  maxWidth: number | null,
  maxHeight: number | null,
): Promise<ResizedImage> {
  const bitmap = await createImageBitmap(file)
  try {
    const capW = maxWidth != null && Number.isFinite(maxWidth) && maxWidth > 0 ? maxWidth : Infinity
    const capH = maxHeight != null && Number.isFinite(maxHeight) && maxHeight > 0 ? maxHeight : Infinity
    // min(...) picks the tighter axis; the trailing 1 keeps this downscale-only.
    const scale = Math.min(capW / bitmap.width, capH / bitmap.height, 1)
    if (scale >= 1) {
      return { blob: file, width: bitmap.width, height: bitmap.height, resized: false }
    }
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D context unavailable.")
    ctx.drawImage(bitmap, 0, 0, width, height)
    const type = ENCODABLE_TYPES.includes(file.type) ? file.type : "image/jpeg"
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Image re-encode failed."))), type, 0.92)
    })
    return { blob, width, height, resized: true }
  } finally {
    bitmap.close()
  }
}

// Long-edge cap = a square L×L fit box under min-ratio scaling. Thin wrapper kept for the
// supplier wizard, which resizes by a single longest-edge value.
export function downscaleImage(file: Blob, targetLongEdge: number): Promise<ResizedImage> {
  return resizeToFit(file, targetLongEdge, targetLongEdge)
}

// Packages download entries into a single ZIP blob. Image formats are already compressed,
// so their entries are stored (level 0); everything else (the CSV) gets deflated.
export function buildZip(entries: Record<string, Uint8Array>): Blob {
  const files: Parameters<typeof zipSync>[0] = {}
  for (const [name, data] of Object.entries(entries)) {
    const stored = /\.(jpe?g|png|webp)$/i.test(name)
    files[name] = [data, { level: stored ? 0 : 6 }]
  }
  return new Blob([zipSync(files) as BlobPart], { type: "application/zip" })
}

// Triggers a real browser download for a blob (same anchor-click pattern as downloadCsv).
export function saveBlob(fileName: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
