// Validation rules for image uploads, per the TGC field specification:
// 500 KB max size, JPG/JPEG format only, and file-name rules (extension required,
// no special characters, unique within the product's staged set).

export type ValidationError = {
  fileName: string
  observedValue: string
  ruleFailed: string
}

const MAX_SIZE_BYTES = 500 * 1024 // 500 KB per spec

const ALLOWED_EXTENSIONS = ["jpg", "jpeg"]
const ALLOWED_MIME_PREFIXES = ["image/jpeg"]

// Spec: file_name is a unique identifier with extension, no special characters.
const FILENAME_PATTERN = /^[A-Za-z0-9._-]+$/

// Validates a single file; returns ValidationError or null if valid.
// existingNames: lower-cased names already staged (uniqueness is checked by the batch helper).
export function validateImageFile(file: File): ValidationError | null {
  // Size check
  if (file.size > MAX_SIZE_BYTES) {
    return {
      fileName: file.name,
      observedValue: `${(file.size / 1024).toFixed(0)} KB`,
      ruleFailed: `Must be ≤ 500 KB`,
    }
  }

  // Format check — jpg/jpeg only
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (
    !file.name.includes(".") ||
    !ALLOWED_EXTENSIONS.includes(ext ?? "") ||
    !ALLOWED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix))
  ) {
    return {
      fileName: file.name,
      observedValue: ext?.toUpperCase() ?? "unknown",
      ruleFailed: "Must be .jpg or .jpeg",
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
export function validateImageBatch(
  files: File[],
  existingNames: string[] = []
): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = []
  const errors: ValidationError[] = []
  const seen = new Set(existingNames.map(n => n.toLowerCase()))
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
    seen.add(f.name.toLowerCase())
    valid.push(f)
  })
  return { valid, errors }
}
