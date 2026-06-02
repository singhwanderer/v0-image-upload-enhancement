// Validation rules for image uploads

export type ValidationError = {
  fileName: string
  observedValue: string
  ruleFailed: string
}

const MAX_SIZE_BYTES = 500 * 1024 // 500 KB
const MIN_DIM = 2400
const MAX_DIM = 4800
const TARGET_DPI = 300

// Reads image dimensions via createImageBitmap
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap
  bitmap.close()
  return { width, height }
}

// Reads DPI from EXIF (JFIF / APP0 or Exif APP1); returns null if not readable
async function getExifDpi(file: File): Promise<number | null> {
  try {
    const buffer = await file.arrayBuffer()
    const view = new DataView(buffer)
    // Must start with FFD8 (JPEG SOI)
    if (view.getUint16(0) !== 0xffd8) return null
    let offset = 2
    while (offset < view.byteLength - 4) {
      const marker = view.getUint16(offset)
      const segLen = view.getUint16(offset + 2)
      // APP0 (JFIF): marker 0xFFE0
      if (marker === 0xffe0) {
        // JFIF density unit: byte at offset+11; x-density: uint16 at offset+12
        const unit = view.getUint8(offset + 11)
        const xDensity = view.getUint16(offset + 12)
        if (unit === 1 && xDensity > 0) return xDensity // dots per inch
        return null
      }
      offset += 2 + segLen
    }
    return null
  } catch {
    return null
  }
}

// Validates a single file; returns ValidationError or null if valid
export async function validateImageFile(file: File): Promise<ValidationError | null> {
  // Size check
  if (file.size > MAX_SIZE_BYTES) {
    return {
      fileName: file.name,
      observedValue: `${(file.size / 1024).toFixed(0)} KB`,
      ruleFailed: `Must be ≤ 500 KB`,
    }
  }

  // Format check — only .jpg / .jpeg
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!["jpg", "jpeg"].includes(ext ?? "") || !file.type.includes("jpeg")) {
    return {
      fileName: file.name,
      observedValue: ext?.toUpperCase() ?? "unknown",
      ruleFailed: "Must be .jpg or .jpeg",
    }
  }

  // Dimension + aspect ratio check
  let dims: { width: number; height: number }
  try {
    dims = await getImageDimensions(file)
  } catch {
    return {
      fileName: file.name,
      observedValue: "unreadable",
      ruleFailed: "Could not read image dimensions",
    }
  }

  const { width, height } = dims

  if (width !== height) {
    return {
      fileName: file.name,
      observedValue: `${width}×${height}`,
      ruleFailed: "Aspect ratio must be 1:1 (square)",
    }
  }

  if (width < MIN_DIM || width > MAX_DIM) {
    return {
      fileName: file.name,
      observedValue: `${width}×${height}`,
      ruleFailed: `Dimensions must be ${MIN_DIM}–${MAX_DIM} px`,
    }
  }

  // DPI check — skip silently if not readable
  const dpi = await getExifDpi(file)
  if (dpi !== null && dpi !== TARGET_DPI) {
    return {
      fileName: file.name,
      observedValue: `${dpi} ppi`,
      ruleFailed: `Resolution must be ${TARGET_DPI} ppi`,
    }
  }

  return null
}

// Validates a batch; returns { valid: File[], errors: ValidationError[] }
export async function validateImageBatch(
  files: File[]
): Promise<{ valid: File[]; errors: ValidationError[] }> {
  const results = await Promise.all(files.map((f) => validateImageFile(f)))
  const valid: File[] = []
  const errors: ValidationError[] = []
  results.forEach((err, i) => {
    if (err) errors.push(err)
    else valid.push(files[i])
  })
  return { valid, errors }
}
