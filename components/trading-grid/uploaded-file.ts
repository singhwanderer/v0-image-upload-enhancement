import type { MeasuredImageMetadata } from "./image-metadata"

// A staged image file in the wizard — shared between the main component (staging, edit,
// delete, CSV export) and the AI hook (extraction/classification/per-shot suggestion, all of
// which operate over the staged file list).
export type UploadedFile = {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview: string
  status: "uploading" | "complete" | "error"
  // Auto-captured at staging by decoding the file itself (no AI, no manual entry).
  // Absent while measurement is in flight; fields are null when unreadable.
  measured?: MeasuredImageMetadata
}
