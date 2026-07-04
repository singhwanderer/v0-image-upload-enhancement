// Deterministic image metadata measurement — NO AI involved.
//
// Reads facts that are literally stored in the file: pixel dimensions via the
// browser's own decoder, and print density (DPI) via byte-level parsing of the
// JPEG JFIF/EXIF and PNG pHYs header fields. Decoding, not inference: values are
// either exact or absent (null) — never guessed. See
// docs/p0.1-auto-capture-technical-note.md for the full rationale and format tables.
//
// Client-safe module: browser APIs only, zero dependencies, nothing leaves the browser.

export type MeasuredImageMetadata = {
  width: number | null
  height: number | null
  dpi: number | null
}

// Only the header region is needed for density metadata; avoids buffering huge files.
const HEADER_SCAN_BYTES = 128 * 1024

const CM_PER_INCH = 2.54
const METERS_PER_INCH = 0.0254

// Measures a staged image file. Never throws and never invents values:
// any field that cannot be read resolves to null.
export async function measureImageFile(file: File): Promise<MeasuredImageMetadata> {
  const [dimensions, dpi] = await Promise.all([readDimensions(file), readDpi(file)])
  return { ...dimensions, dpi }
}

// ── Pixel dimensions: ask the decoder (the same one that renders the preview) ──

async function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  // Preferred path: decode without touching the DOM.
  try {
    const bmp = await createImageBitmap(file)
    const result = { width: bmp.width, height: bmp.height }
    bmp.close()
    return result
  } catch {
    // Fall through to the <img> path (older engines / formats createImageBitmap rejects).
  }

  try {
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return { width: img.naturalWidth || null, height: img.naturalHeight || null }
    } finally {
      URL.revokeObjectURL(url)
    }
  } catch {
    return { width: null, height: null }
  }
}

// ── Print density (DPI): parse the header fields directly ──

async function readDpi(file: File): Promise<number | null> {
  try {
    const buf = await file.slice(0, HEADER_SCAN_BYTES).arrayBuffer()
    const view = new DataView(buf)
    if (view.byteLength >= 4 && view.getUint16(0) === 0xffd8) return jpegDpi(view)
    if (view.byteLength >= 8 && view.getUint32(0) === 0x89504e47) return pngDpi(view)
    // WebP (and anything else) carries no standard print-density field — honest null.
    return null
  } catch {
    return null
  }
}

// Walk JPEG segments looking for EXIF APP1 (preferred — richer unit info) then JFIF APP0.
function jpegDpi(view: DataView): number | null {
  let jfifDpi: number | null = null
  let offset = 2 // past SOI
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break
    const marker = view.getUint8(offset + 1)
    if (marker === 0xda || marker === 0xd9) break // SOS / EOI — no more metadata segments
    const length = view.getUint16(offset + 2) // includes the 2 length bytes
    if (length < 2 || offset + 2 + length > view.byteLength) break
    const payload = offset + 4
    const payloadLen = length - 2

    if (marker === 0xe1) {
      const exif = exifDpi(view, payload, payloadLen)
      if (exif !== null) return exif
    } else if (marker === 0xe0 && jfifDpi === null) {
      jfifDpi = jfifDensity(view, payload, payloadLen)
    }
    offset += 2 + length
  }
  return jfifDpi
}

// JFIF APP0 payload: "JFIF\0" (5) + version (2) + units (1) + Xdensity (2) + Ydensity (2).
function jfifDensity(view: DataView, payload: number, payloadLen: number): number | null {
  if (payloadLen < 12) return null
  if (!matchesAscii(view, payload, "JFIF\0")) return null
  const units = view.getUint8(payload + 7)
  const xDensity = view.getUint16(payload + 8)
  if (xDensity === 0) return null
  if (units === 1) return xDensity // dots per inch
  if (units === 2) return Math.round(xDensity * CM_PER_INCH) // dots per cm → dpi
  return null // units=0: aspect ratio only, not a physical density
}

// EXIF APP1 payload: "Exif\0\0" + TIFF header (endianness, IFD0 offset), then IFD0
// entries; tags 0x011A XResolution (RATIONAL) and 0x0128 ResolutionUnit (2=inch, 3=cm).
function exifDpi(view: DataView, payload: number, payloadLen: number): number | null {
  if (payloadLen < 14) return null
  if (!matchesAscii(view, payload, "Exif\0\0")) return null
  const tiff = payload + 6
  const order = view.getUint16(tiff)
  const little = order === 0x4949 // "II"; "MM" (0x4d4d) is big-endian
  if (!little && order !== 0x4d4d) return null
  if (view.getUint16(tiff + 2, little) !== 0x002a) return null

  const ifdOffset = view.getUint32(tiff + 4, little)
  const ifd = tiff + ifdOffset
  if (ifd + 2 > view.byteLength) return null
  const entryCount = view.getUint16(ifd, little)

  let xResolution: number | null = null
  let resolutionUnit = 2 // TIFF default: inches
  for (let i = 0; i < entryCount; i++) {
    const entry = ifd + 2 + i * 12
    if (entry + 12 > view.byteLength) return null
    const tag = view.getUint16(entry, little)
    if (tag === 0x011a) {
      // RATIONAL: value field holds an offset to numerator/denominator uint32 pair
      const valueOffset = tiff + view.getUint32(entry + 8, little)
      if (valueOffset + 8 > view.byteLength) continue
      const numerator = view.getUint32(valueOffset, little)
      const denominator = view.getUint32(valueOffset + 4, little)
      if (denominator !== 0 && numerator !== 0) xResolution = numerator / denominator
    } else if (tag === 0x0128) {
      resolutionUnit = view.getUint16(entry + 8, little)
    }
  }

  if (xResolution === null) return null
  if (resolutionUnit === 2) return Math.round(xResolution)
  if (resolutionUnit === 3) return Math.round(xResolution * CM_PER_INCH)
  return null // unit=1: no absolute unit — not a physical density
}

// PNG pHYs chunk: pixels-per-metre X (4) + Y (4) + unit (1, 1=metre).
function pngDpi(view: DataView): number | null {
  let offset = 8 // past PNG signature
  while (offset + 8 <= view.byteLength) {
    const length = view.getUint32(offset)
    const isPhys = matchesAscii(view, offset + 4, "pHYs")
    if (isPhys) {
      if (length < 9 || offset + 8 + 9 > view.byteLength) return null
      const ppmX = view.getUint32(offset + 8)
      const unit = view.getUint8(offset + 16)
      if (unit === 1 && ppmX > 0) return Math.round(ppmX * METERS_PER_INCH)
      return null
    }
    if (matchesAscii(view, offset + 4, "IDAT")) return null // pHYs must precede IDAT
    offset += 8 + length + 4 // length + type + data + CRC
  }
  return null
}

function matchesAscii(view: DataView, offset: number, text: string): boolean {
  if (offset + text.length > view.byteLength) return false
  for (let i = 0; i < text.length; i++) {
    if (view.getUint8(offset + i) !== text.charCodeAt(i)) return false
  }
  return true
}
