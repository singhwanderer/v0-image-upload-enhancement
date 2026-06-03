// Validation rules for image uploads
// Only two rules: 500 KB max size, JPG/JPEG format only.

export type ValidationError = {
  fileName: string
  observedValue: string
  ruleFailed: string
}

const MAX_SIZE_BYTES = 500 * 1024 // 500 KB

// Validates a single file; returns ValidationError or null if valid
export function validateImageFile(file: File): ValidationError | null {
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

  return null
}

// Validates a batch; returns { valid: File[], errors: ValidationError[] }
export function validateImageBatch(
  files: File[]
): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = []
  const errors: ValidationError[] = []
  files.forEach((f) => {
    const err = validateImageFile(f)
    if (err) errors.push(err)
    else valid.push(f)
  })
  return { valid, errors }
}
