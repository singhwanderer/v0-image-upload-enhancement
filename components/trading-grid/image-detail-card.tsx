"use client"

import { FileImage } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Shared stacked image-detail card: label/value rows on the left, preview on the right,
// selection checkbox + level label in the header. Used by the supplier Product Media view
// (with Edit/Download header actions) and the retailer browser (read-only — no actions
// beyond what the caller passes). Extracted so the two portals can't diverge in field
// coverage again.
export type ImageDetailRow = {
  label: string
  value: string
  // Renders the value in link styling (matches the legacy Image Type / Purpose treatment).
  link?: boolean
}

export function ImageDetailCard({
  id,
  levelLabel,
  rows,
  previewSrc,
  previewAlt,
  checked,
  onCheckedChange,
  headerActions,
  onPreviewClick,
  footer,
}: {
  // DOM id for jump-to-thumbnail scrolling.
  id?: string
  levelLabel: string
  rows: ImageDetailRow[]
  previewSrc?: string
  previewAlt: string
  checked: boolean
  onCheckedChange: () => void
  // Per-card action buttons (download/edit/…). Omit for a read-only card.
  headerActions?: React.ReactNode
  // When set, the preview becomes a zoom button (retailer lightbox).
  onPreviewClick?: () => void
  // Optional trailing line under the rows (e.g. "From {vendor}").
  footer?: React.ReactNode
}) {
  const preview = previewSrc ? (
    <img src={previewSrc} alt={previewAlt} className="max-w-full max-h-64 object-contain" />
  ) : (
    <div className="flex flex-col items-center gap-2 text-center">
      <FileImage className="size-16 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground">No preview</p>
    </div>
  )

  return (
    <div id={id} className="border border-border bg-card">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <span className="text-sm font-medium text-tg-link">{levelLabel}</span>
        </div>
        {headerActions && <div className="flex items-center gap-1">{headerActions}</div>}
      </div>
      {/* Card body: attributes 60% left, preview 40% right */}
      <div className="flex">
        <div className="w-3/5 border-r border-border text-sm">
          {rows.map((row, idx) => (
            <div key={row.label} className={cn("flex", (idx < rows.length - 1 || footer) && "border-b border-border")}>
              <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">{row.label}</div>
              <div className={cn("flex-1 px-3 py-2 break-words", row.link ? "text-tg-link" : "text-foreground")}>
                {row.value}
              </div>
            </div>
          ))}
          {footer && <div className="px-3 py-2 text-xs text-muted-foreground">{footer}</div>}
        </div>
        {onPreviewClick ? (
          <button
            type="button"
            className="w-2/5 flex items-center justify-center bg-white p-4 min-h-[280px] cursor-zoom-in hover:opacity-90 transition-opacity"
            title="Click to view full size"
            onClick={onPreviewClick}
          >
            {preview}
          </button>
        ) : (
          <div className="w-2/5 flex items-center justify-center bg-white p-4 min-h-[280px]">{preview}</div>
        )}
      </div>
    </div>
  )
}
