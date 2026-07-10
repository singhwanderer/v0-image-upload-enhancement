// Client-side downscale for real image downloads. Decodes the staged File, scales it so its
// long edge fits the requested cap (never upscales), and re-encodes in the source format.
// Aspect ratio is always preserved; PNG keeps its alpha channel through the canvas re-encode.

export type ResizedImage = {
  blob: Blob
  width: number
  height: number
  // False when the image already fit the cap and the original bytes were passed through.
  resized: boolean
}

// Formats canvas.toBlob can re-encode; anything else falls back to JPEG.
const ENCODABLE_TYPES = ["image/jpeg", "image/png", "image/webp"]

export async function downscaleImage(file: Blob, targetLongEdge: number): Promise<ResizedImage> {
  const bitmap = await createImageBitmap(file)
  try {
    const longEdge = Math.max(bitmap.width, bitmap.height)
    if (!Number.isFinite(targetLongEdge) || targetLongEdge <= 0 || longEdge <= targetLongEdge) {
      return { blob: file, width: bitmap.width, height: bitmap.height, resized: false }
    }
    const scale = targetLongEdge / longEdge
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
