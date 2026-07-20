// Validation rules for image uploads, per the TGC field specification:
// 5 MB max per image, 50 MB max per product, JPG/JPEG/PNG formats, and file-name rules
// (extension required, no special characters, unique within the product's staged set).

export type ValidationError = {
  fileName: string
  observedValue: string
  ruleFailed: string
}

const MAX_SIZE_PER_IMAGE = 5 * 1024 * 1024 // 5 MB per image
const MAX_SIZE_PER_PRODUCT = 50 * 1024 * 1024 // 50 MB per product

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"]
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"]

// Spec: file_name is a unique identifier with extension, no special characters.
const FILENAME_PATTERN = /^[A-Za-z0-9._-]+$/

// Validates a single file; returns ValidationError or null if valid.
// existingNames: lower-cased names already staged (uniqueness is checked by the batch helper).
export function validateImageFile(file: File): ValidationError | null {
  // Size check — 5 MB per image
  if (file.size > MAX_SIZE_PER_IMAGE) {
    return {
      fileName: file.name,
      observedValue: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      ruleFailed: `Must be ≤ 5 MB`,
    }
  }

  // Format check — jpg, jpeg, or png
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (
    !file.name.includes(".") ||
    !ALLOWED_EXTENSIONS.includes(ext ?? "") ||
    !ALLOWED_MIME_TYPES.includes(file.type)
  ) {
    return {
      fileName: file.name,
      observedValue: ext?.toUpperCase() ?? "unknown",
      ruleFailed: "Must be .jpg, .jpeg, or .png",
    }
  }

  // Filename character check — spec: no special characters
  if (!FILENAME_PATTERN.test(file.name)) {
    return {
      fileName: file.name,
      observedValue: file.name,
      ruleFailed: "File name may only contain letters, numbers, dot, dash, underscore",
    }
  }

  return null
}

// Validates a batch; returns { valid: File[], errors: ValidationError[] }.
// existingNames: names already staged on this product — spec requires file_name uniqueness,
// so duplicates against staged files AND within the batch itself are rejected.
// Also validates product-level size limit (50 MB total across all files in the batch + existing files).
export function validateImageBatch(
  files: File[],
  existingNames: string[] = [],
  existingFileSizes: number[] = []
): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = []
  const errors: ValidationError[] = []
  const seen = new Set(existingNames.map(n => n.toLowerCase()))
  
  // Calculate current product size (existing files + newly validated files)
  let totalProductSize = existingFileSizes.reduce((a, b) => a + b, 0)
  
  files.forEach((f) => {
    const err = validateImageFile(f)
    if (err) {
      errors.push(err)
      return
    }
    
    if (seen.has(f.name.toLowerCase())) {
      errors.push({
        fileName: f.name,
        observedValue: f.name,
        ruleFailed: "File name must be unique for this product",
      })
      return
    }
    
    // Check product-level size limit
    if (totalProductSize + f.size > MAX_SIZE_PER_PRODUCT) {
      errors.push({
        fileName: f.name,
        observedValue: `${((totalProductSize + f.size) / (1024 * 1024)).toFixed(1)} MB total`,
        ruleFailed: `Product total would exceed 50 MB limit`,
      })
      return
    }
    
    seen.add(f.name.toLowerCase())
    totalProductSize += f.size
    valid.push(f)
  })
  return { valid, errors }
}
