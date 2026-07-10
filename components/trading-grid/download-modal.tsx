"use client"

import { useState } from "react"
import {
  X,
  Check,
  Download,
  Package,
  FileImage,
  FileText,
  CheckCircle2,
  Ruler,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { MeasuredImageMetadata } from "./image-metadata"

// Minimal file shape the modal needs — the supplier's UploadedFile satisfies it structurally,
// and the retailer browser maps its mock images into it (no File binary required here; the
// caller's onDownload owns fetching/producing the actual bytes).
export type DownloadModalFile = {
  id: string
  name: string
  size: number
  preview?: string
  measured?: MeasuredImageMetadata
}

// Three-phase download modal (Select → Preparing → Complete). Shared by the supplier wizard
// (post-confirm Product Media view and pre-confirm Step 1 grid) and the retailer browser's
// read-only Product Media view.
type DownloadModalProps = {
  open: boolean
  phase: "select" | "preparing" | "complete"
  uploadedFiles: DownloadModalFile[]
  // Selection is owned by the Product Media grid/toolbar; the modal only reads it.
  isChecked: (id: string) => boolean
  uploadLevel: "product" | "product-color" | "gtin"
  autoData: { productId: string; selectedGtin: string; colorCode: string }
  lastCsvPreview: string
  // Long-edge cap for the downloaded images; null = original size. Downscale only.
  downloadSize: number | null
  onDownloadSizeChange: (size: number | null) => void
  // "zip" (default): one {product}_images.zip with the image binaries + metadata CSV.
  // "csv": just the metadata CSV, no binaries.
  packageType: "zip" | "csv"
  onPackageTypeChange: (t: "zip" | "csv") => void
  onClose: () => void
  onDownload: () => void
}

// Long-edge presets; only those actually smaller than the largest selected image are offered.
const SIZE_PRESETS = [2048, 1024, 512]

// Local copy of the wizard's trivial pure size formatter (kept in both places rather than
// coupling the modal to the wizard's internals for three lines).
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function DownloadModal({ open, phase, uploadedFiles, isChecked, uploadLevel, autoData, lastCsvPreview, downloadSize, onDownloadSizeChange, packageType, onPackageTypeChange, onClose, onDownload }: DownloadModalProps) {
  // Free-typed custom long edge; empty/0/invalid means "no custom cap" (Original).
  const [customSize, setCustomSize] = useState("")
  if (!open) return null
  const selectedFiles = uploadedFiles.filter(f => isChecked(f.id))
  // Largest long edge across the selection — presets at or above it can't downscale anything.
  // Unknown dimensions (measurement pending/failed) keep all presets; downscale never upscales.
  const longEdges = selectedFiles
    .map(f => Math.max(f.measured?.width ?? 0, f.measured?.height ?? 0))
    .filter(n => n > 0)
  const maxLongEdge = longEdges.length > 0 ? Math.max(...longEdges) : null
  const visiblePresets = maxLongEdge != null ? SIZE_PRESETS.filter(p => p < maxLongEdge) : SIZE_PRESETS
  const customActive = downloadSize != null && !SIZE_PRESETS.includes(downloadSize)
  const applyCustom = (raw: string) => {
    setCustomSize(raw)
    const n = Number.parseInt(raw, 10)
    if (!Number.isFinite(n) || n <= 0) {
      if (customActive) onDownloadSizeChange(null)
      return
    }
    // Clamp to the largest original long edge — larger values can only mean "original".
    onDownloadSizeChange(maxLongEdge != null ? Math.min(n, maxLongEdge) : n)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded border border-border bg-card shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-tg-header-start to-tg-header-end px-4 py-3">
          <h2 className="text-base font-semibold text-white">
            {phase === "select" && "Download Images with Metadata"}
            {phase === "preparing" && "Preparing Download"}
            {phase === "complete" && "Download Complete"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Phase 1: Select */}
          {phase === "select" && (
            <>
              {/* Download Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Package className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Download Package</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadLevel === "product"
                        ? "Product Level"
                        : uploadLevel === "gtin"
                        ? "Item Level (GTIN)"
                        : "Product + Color Code Level"} images
                    </p>
                  </div>
                </div>

                <div className="rounded border border-border bg-muted/20 p-4">
                  <div className="text-sm space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Product:</span>
                      <span className="font-medium text-foreground">{autoData.productId}</span>
                    </div>
                    {uploadLevel === "gtin" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GTIN:</span>
                        <span className="font-medium text-foreground">{autoData.selectedGtin}</span>
                      </div>
                    )}
                    {uploadLevel === "product-color" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Color Code:</span>
                        <span className="font-medium text-foreground">{autoData.colorCode}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Images:</span>
                      <span className="font-medium text-foreground">{selectedFiles.length} of {uploadedFiles.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package choice — one ZIP with everything, or just the metadata CSV */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Package:</h4>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    aria-pressed={packageType === "zip"}
                    onClick={() => onPackageTypeChange("zip")}
                    className={cn(
                      "flex items-start gap-3 rounded border p-3 text-left transition-colors",
                      packageType === "zip" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30",
                    )}
                  >
                    <Package className={cn("mt-0.5 size-4 shrink-0", packageType === "zip" ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm">
                      <span className="font-medium text-foreground">ZIP package</span>
                      <span className="block text-xs text-muted-foreground">
                        {autoData.productId || "product"}_images.zip — {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""} + metadata CSV in one file
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={packageType === "csv"}
                    onClick={() => onPackageTypeChange("csv")}
                    className={cn(
                      "flex items-start gap-3 rounded border p-3 text-left transition-colors",
                      packageType === "csv" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30",
                    )}
                  >
                    <FileText className={cn("mt-0.5 size-4 shrink-0", packageType === "csv" ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm">
                      <span className="font-medium text-foreground">Metadata CSV only</span>
                      <span className="block text-xs text-muted-foreground">Just the metadata file — no image binaries</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Files to Download — reflects the selection already made on the Product Media
                  grid/toolbar; no in-modal checkboxes, to keep selection to a single control. */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Package Contents:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {packageType === "zip" && selectedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 rounded border border-border bg-card p-3">
                      <div className="flex size-10 items-center justify-center rounded bg-muted">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt=""
                            className="size-10 rounded object-cover"
                          />
                        ) : (
                          <FileImage className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileImage className="size-4 text-primary shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <div>{formatFileSize(file.size)}</div>
                      </div>
                    </div>
                  ))}
                  {/* Single machine-readable metadata artifact for the whole selection */}
                  <div className="flex items-center gap-3 rounded border border-border bg-card p-3">
                    <div className="flex size-10 items-center justify-center rounded bg-muted">
                      <FileText className="size-5 text-tg-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate block">
                        {autoData.productId || "product"}_image_metadata.csv
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedFiles.length} row{selectedFiles.length !== 1 ? "s" : ""} — one per image
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image dimensions — long-edge cap, downscale only (aspect ratio preserved).
                  Irrelevant when only the CSV is downloaded. */}
              {packageType === "zip" && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                  <Ruler className="size-4 text-primary" />
                  Image dimensions
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Images larger than the chosen size are downscaled to it (longest edge, aspect ratio kept). Smaller images download at their original size — never upscaled.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={downloadSize === null ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    aria-pressed={downloadSize === null}
                    onClick={() => { onDownloadSizeChange(null); setCustomSize("") }}
                  >
                    Original
                  </Button>
                  {visiblePresets.map(p => (
                    <Button
                      key={p}
                      variant={downloadSize === p ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3 text-xs"
                      aria-pressed={downloadSize === p}
                      onClick={() => { onDownloadSizeChange(p); setCustomSize("") }}
                    >
                      {p} px
                    </Button>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={maxLongEdge ?? undefined}
                      placeholder="Custom"
                      value={customSize}
                      onChange={(e) => applyCustom(e.target.value)}
                      className={cn("h-8 w-24 bg-background text-xs", customActive && "border-primary")}
                      aria-label="Custom longest edge in pixels"
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                  </div>
                </div>
                {downloadSize != null && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Downloading at up to <span className="font-medium text-foreground">{downloadSize} px</span> on the longest edge.
                  </p>
                )}
              </div>
              )}

              {/* Info Note */}
              <div className="mb-6 flex items-start gap-2 rounded bg-primary/5 p-3 text-sm">
                <FileText className="size-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Metadata file (.csv)</span>
                  <span className="text-muted-foreground"> contains one row per image with all attributes in the standard field layout — including measured file properties and accepted GS1 extended attributes — ready for PIM/DAM import.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onDownload} disabled={selectedFiles.length === 0}>
                  <Download className="size-4 mr-2" />
                  {packageType === "zip"
                    ? `Download ZIP (${selectedFiles.length} image${selectedFiles.length !== 1 ? "s" : ""} + CSV)`
                    : "Download metadata CSV"}
                </Button>
              </div>
            </>
          )}

          {/* Phase 2: Preparing */}
          {phase === "preparing" && (
            <div className="py-8 flex flex-col items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Download className="size-8 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-foreground">Preparing your download</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {packageType === "zip"
                    ? `Packaging ${selectedFiles.length} image${selectedFiles.length !== 1 ? "s" : ""} + metadata into one ZIP...`
                    : "Preparing metadata CSV..."}
                </p>
              </div>
              <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {/* Phase 3: Complete */}
          {phase === "complete" && (
            <div className="text-center py-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-tg-success/10 mx-auto mb-4">
                <CheckCircle2 className="size-8 text-tg-success" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Download Complete</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your images and metadata files have been downloaded successfully.
              </p>

              {/* Downloaded Files Summary */}
              <div className="rounded border border-border bg-muted/20 p-4 mb-6 text-left">
                <div className="text-sm font-medium text-foreground mb-3">
                  {packageType === "zip" ? "Downloaded ZIP:" : "Downloaded File:"}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {packageType === "zip" ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-tg-success" />
                        <span className="font-medium">{autoData.productId || "product"}_images.zip</span>
                      </div>
                      {selectedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                          <FileImage className="size-3.5" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                        <FileText className="size-3.5" />
                        <span>{autoData.productId || "product"}_image_metadata.csv</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="size-4 text-tg-success" />
                      <span>{autoData.productId || "product"}_image_metadata.csv</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata CSV Preview — first rows of the actually-downloaded file */}
              <div className="rounded border border-border bg-card p-4 mb-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Metadata Preview</span>
                  <span className="text-xs text-muted-foreground">
                    {autoData.productId || "product"}_image_metadata.csv
                  </span>
                </div>
                <pre className="text-xs text-muted-foreground bg-muted/30 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto font-mono">
{lastCsvPreview || "No metadata available"}
                </pre>
              </div>

              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
