"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MeasuredImageMetadata } from "./image-metadata"
import {
  ORIENTATION_OPTIONS,
  ANGLE_OPTIONS,
  IMAGE_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  FACING_OPTIONS,
  IMAGE_STYLE_OPTIONS,
} from "./attribute-options"

// P0.2a: the attribute record splits into two groups. PRODUCT attributes hold one honest
// value for every image of a product; IMAGE DETAIL fields describe what makes each photo
// different (which is exactly why they must never be blanket-applied).
export const PER_SHOT_KEYS = ["orientation", "facing", "angle", "clippingPath", "imageDescription", "imageStyle"] as const
export type PerShotKey = (typeof PER_SHOT_KEYS)[number]
export const isPerShotKey = (k: string): k is PerShotKey => (PER_SHOT_KEYS as readonly string[]).includes(k)

// Attribute form used in the wizard's combined page (split into its two halves via
// hidePerShot/hideProductWide), the Edit dialog, and Bulk edit (Change 3 / Change 7 / P0.2a)
export type StepTwoFormProps = {
  currentAttrs: {
    imageType: string; purpose: string; orientation: string; locationType: string;
    externalLocation: string; imageStyle: string; facing: string; angle: string;
    clippingPath: string; imageDescription: string;
  }
  updateAttrs: (a: StepTwoFormProps["currentAttrs"]) => void
  uploadLevel: "product" | "product-color" | "gtin"
  autoData: { colorCode: string; selectedGtin: string }
  // Auto-captured per-file facts (dimensions/DPI) shown read-only. Omitted in bulk edit,
  // where no single file is in context — measured facts are never bulk-editable.
  measuredFiles?: { name: string; measured?: MeasuredImageMetadata }[]
  // Bulk edit / Image Details panel target image-detail fields only; product attributes are
  // edited once in the Product Attributes section.
  hideProductWide?: boolean
  // Product Attributes section renders only the product-wide half (Task 1).
  hidePerShot?: boolean
  // Single-image upload: the product-wide vs per-image distinction is meaningless with one shot,
  // so render every field as one flat list (drop the two group headers and the divider). The
  // measured-from-file block still shows.
  flatten?: boolean
}


export function StepTwoForm({ currentAttrs, updateAttrs, uploadLevel, autoData, measuredFiles, hideProductWide, hidePerShot, flatten }: StepTwoFormProps) {
  // Group headers only make sense when both halves render in one form (Edit dialog); the
  // wizard's combined page provides its own section headings.
  const showGroupHeaders = !flatten && !hideProductWide && !hidePerShot

  return (
    <div className="flex flex-col gap-4">
      {!hideProductWide && (
        <>
          {/* Auto-populated fields (read-only) */}
          {(uploadLevel === "product-color" || uploadLevel === "gtin") && (
            <div className="grid gap-4 md:grid-cols-2">
              {uploadLevel === "product-color" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Color Code</Label>
                  <Input value={autoData.colorCode} readOnly className="bg-muted/30 text-foreground cursor-default" />
                </div>
              )}
              {uploadLevel === "gtin" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">GTIN</Label>
                  <Input value={autoData.selectedGtin} readOnly className="bg-muted/30 text-foreground cursor-default" />
                </div>
              )}
            </div>
          )}

          {/* Product group: one value for every image of this product */}
          {showGroupHeaders && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Product Attributes</span>
              <span className="text-xs text-muted-foreground">apply to every image of this product</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Image Type <span className="text-destructive">*</span>
              </Label>
              <Input value="SI-Still Shot" readOnly className="bg-muted/30 text-foreground cursor-default" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Purpose <span className="text-destructive">*</span>
              </Label>
              <Input value="INT-Internet" readOnly className="bg-muted/30 text-foreground cursor-default" />
            </div>

            {/* Location Type read-only */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Location Type</Label>
              <Input value={LOCATION_TYPE_OPTIONS.find(o => o.value === currentAttrs.locationType)?.label || ""} readOnly className="bg-muted/30 text-foreground cursor-default" />
            </div>
          </div>

          {(currentAttrs.locationType === "FTP" || currentAttrs.locationType === "URL") && (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">External Location <span className="text-destructive">*</span></Label>
              <Input
                value={currentAttrs.externalLocation}
                onChange={(e) => updateAttrs({ ...currentAttrs, externalLocation: e.target.value })}
                placeholder={currentAttrs.locationType === "FTP" ? "ftp://..." : "https://..."}
                className="bg-background"
              />
            </div>
          )}

          {showGroupHeaders && <div className="border-t border-border" />}
        </>
      )}

      {!hidePerShot && (
        <>
          {/* Image details group: what makes each photo different — never blanket-applied */}
          {showGroupHeaders && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Image Details</span>
              <span className="text-xs text-muted-foreground">describe this specific image</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Dimension fields — auto-populated from EXIF, user-editable as override.
                `measured` is undefined while in-flight, null-field means file has no metadata. */}
            {measuredFiles && measuredFiles.length > 0 && (() => {
              const f = measuredFiles[0]
              const inFlight = f.measured === undefined
              // Width
              const widthVal = inFlight ? "" : (f.measured?.width != null ? String(f.measured.width) : "")
              const widthPlaceholder = inFlight ? "Measuring…" : "Not available"
              // Height
              const heightVal = inFlight ? "" : (f.measured?.height != null ? String(f.measured.height) : "")
              const heightPlaceholder = inFlight ? "Measuring…" : "Not available"
              // DPI — null means file carries no density metadata, which is very common
              const dpiVal = inFlight ? "" : (f.measured?.dpi != null ? String(f.measured.dpi) : "")
              const dpiPlaceholder = inFlight ? "Measuring…" : "Not in file"
              return (
                <>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5 text-sm font-medium">
                      Width (px)
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Auto-detected</span>
                    </Label>
                    <Input
                      defaultValue={widthVal}
                      placeholder={widthPlaceholder}
                      className="bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5 text-sm font-medium">
                      Height (px)
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Auto-detected</span>
                    </Label>
                    <Input
                      defaultValue={heightVal}
                      placeholder={heightPlaceholder}
                      className="bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1.5 text-sm font-medium">
                      Pixel Density (DPI)
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">Auto-detected</span>
                    </Label>
                    <Input
                      defaultValue={dpiVal}
                      placeholder={dpiPlaceholder}
                      className="bg-background"
                    />
                  </div>
                  {/* Spacer to keep grid balanced when DPI is the third field */}
                  <div className="hidden md:block" />
                </>
              )
            })()}

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                Orientation <span className="text-destructive">*</span>
              </Label>
              <Select
                value={currentAttrs.orientation}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, orientation: v })}
              >
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select orientation..." /></SelectTrigger>
                <SelectContent>
                  {ORIENTATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">Facing (GDSN) <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Select
                value={currentAttrs.facing}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, facing: v })}
              >
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select facing..." /></SelectTrigger>
                <SelectContent>{FACING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">Angle <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Select
                value={currentAttrs.angle}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, angle: v })}
              >
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select angle..." /></SelectTrigger>
                <SelectContent>{ANGLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                Image Style <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Select
                value={currentAttrs.imageStyle}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, imageStyle: v })}
              >
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select style..." /></SelectTrigger>
                <SelectContent>{IMAGE_STYLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Clipping Path <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Input value={currentAttrs.clippingPath} onChange={(e) => updateAttrs({ ...currentAttrs, clippingPath: e.target.value })} placeholder="Path name..." className="bg-background" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">Image Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Input
                value={currentAttrs.imageDescription}
                onChange={(e) => updateAttrs({ ...currentAttrs, imageDescription: e.target.value })}
                placeholder="Enter description..."
                className="bg-background"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
