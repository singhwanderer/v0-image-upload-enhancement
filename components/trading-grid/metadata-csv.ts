// Spec-shaped CSV metadata export (P0.5).
//
// One row per image, columns in the authoritative 21-field specification order, plus one
// column per accepted GS1 extended attribute (product-level, so identical on every row,
// rendered as "value (GS1CODE)"). This is the machine-readable artifact retailers can feed
// into a PIM/DAM — and it doubles as a re-import template for a future CSV bulk-upload path.
//
// Client-safe module: string building + Blob download only, no server round-trip.

import type { ExtractedAttribute } from "@/lib/gs1/types"

export type ImageMetadataRow = {
  action: string
  image_level: string
  product: string
  item_number: string
  file_name: string
  file_type: string
  image_type: string
  purpose: string
  orientation: string
  location_type: string
  external_location: string
  color_code: string
  image_style: string
  facing: string
  angle: string
  file_size: string
  pixel_density: string
  height: string
  width: string
  clipping_path: string
  image_description: string
}

// Column order is the 21-field spec order — do not reorder.
const SPEC_COLUMNS: (keyof ImageMetadataRow)[] = [
  "action", "image_level", "product", "item_number", "file_name", "file_type",
  "image_type", "purpose", "orientation", "location_type", "external_location",
  "color_code", "image_style", "facing", "angle", "file_size", "pixel_density",
  "height", "width", "clipping_path", "image_description",
]

// RFC 4180-style escaping: quote when the value contains comma/quote/newline; double quotes.
function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function buildImageMetadataCsv(
  rows: ImageMetadataRow[],
  extendedAttributes: ExtractedAttribute[] = [],
): string {
  const header = [...SPEC_COLUMNS, ...extendedAttributes.map(a => a.codeListName)]
  const lines = [header.map(csvEscape).join(",")]
  for (const row of rows) {
    const cells = SPEC_COLUMNS.map(c => csvEscape(row[c] ?? ""))
    for (const attr of extendedAttributes) cells.push(csvEscape(`${attr.attributeValue} (${attr.code})`))
    lines.push(cells.join(","))
  }
  return lines.join("\r\n") + "\r\n"
}

// Triggers a real browser download of the CSV.
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// First N lines of a CSV, for on-screen preview after download.
export function csvPreview(csv: string, lineCount = 6): string {
  return csv.split("\r\n").filter(Boolean).slice(0, lineCount).join("\n")
}
