"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
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

// P0.2a: the attribute record splits into two groups. PRODUCT-WIDE fields hold one honest
// value for every image of a product; PER-SHOT fields describe what makes each photo
// different (which is exactly why they must never be blanket-applied).
export const PER_SHOT_KEYS = ["orientation", "facing", "angle", "clippingPath", "imageDescription"] as const
export type PerShotKey = (typeof PER_SHOT_KEYS)[number]
export const isPerShotKey = (k: string): k is PerShotKey => (PER_SHOT_KEYS as readonly string[]).includes(k)

// Attribute form used in Step 2, the Edit dialog, and Bulk edit (Change 3 / Change 7 / P0.2a)
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
  // Explicit, labeled copy action for per-shot values — a deliberate copy, not a silent default.
  onApplyPerShotToAll?: () => void
  // Bulk edit targets per-shot fields only; product-wide values are edited once in the main form.
  hideProductWide?: boolean
  // Single-image upload: the product-wide vs per-shot distinction is meaningless with one shot,
  // so render every field as one flat list (drop the two group headers and the divider). The
  // measured-from-file block still shows.
  flatten?: boolean
  // AI Task 2 (opt-in, per image): a pending suggestion for THIS image's Image Details. Fields
  // stay empty; the suggested value renders as a click-to-apply chip beside the field so the
  // human stays in control. Applying a chip fills the field via updateAttrs.
  shotSuggestion?: { orientation: string; facing: string; angle: string; description: string; confidence: number } | null
  // Trigger to request an AI suggestion for this specific image, plus its loading flag.
  onSuggestShot?: () => void
  shotSuggestLoading?: boolean
}

// Tiny provenance tag shown once an AI-suggested value has been confirmed by the user.
function AiAppliedTag() {
  return (
    <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs text-muted-foreground">
      <Sparkles className="size-3 text-primary" />
      AI suggested
    </span>
  )
}

// Read-only summary of a file's decoded dimensions/DPI. undefined = measurement in flight.
export function formatMeasured(m?: MeasuredImageMetadata): string {
  if (!m) return "Measuring…"
  const dims = m.width && m.height ? `${m.width} × ${m.height} px` : null
  const dpi = m.dpi ? `${m.dpi} DPI` : null
  if (!dims && !dpi) return "Not readable from file"
  return [dims, dpi].filter(Boolean).join(" · ")
}

export function StepTwoForm({ currentAttrs, updateAttrs, uploadLevel, autoData, measuredFiles, onApplyPerShotToAll, hideProductWide, flatten, shotSuggestion, onSuggestShot, shotSuggestLoading }: StepTwoFormProps) {
  // Image Description is optional and rarely filled — hide it behind a toggle to reduce form
  // weight. Pre-expand it if the field already has a value (e.g. populated by AI suggestion).
  const [showDescription, setShowDescription] = useState(() => !!currentAttrs.imageDescription)
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

          {/* Product-wide group: one value for every image of this product */}
          {!flatten && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Product Attributes</span>
              <span className="text-xs text-muted-foreground">shared across all images</span>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Image Type <span className="text-destructive">*</span>
              </Label>
              <Select value={currentAttrs.imageType} onValueChange={(v) => updateAttrs({ ...currentAttrs, imageType: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IMAGE_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Purpose <span className="text-destructive">*</span>
              </Label>
              <Select value={currentAttrs.purpose} onValueChange={(v) => updateAttrs({ ...currentAttrs, purpose: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Location Type read-only */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Location Type</Label>
              <Input value={LOCATION_TYPE_OPTIONS.find(o => o.value === currentAttrs.locationType)?.label || ""} readOnly className="bg-muted/30 text-foreground cursor-default" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Image Style <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Select value={currentAttrs.imageStyle} onValueChange={(v) => updateAttrs({ ...currentAttrs, imageStyle: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select style..." /></SelectTrigger>
                <SelectContent>{IMAGE_STYLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
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

          {!flatten && <div className="border-t border-border" />}
        </>
      )}

      {/* Per-shot group: what makes each photo different — never blanket-applied */}
      {!flatten && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Image Details</span>
          <span className="text-xs text-muted-foreground">specific to this photo</span>
          {onSuggestShot && (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-7 gap-1 px-2 text-xs"
              onClick={onSuggestShot}
              disabled={shotSuggestLoading}
            >
              <Sparkles className="size-3" />
              {shotSuggestLoading ? "Suggesting…" : "Suggest with AI"}
            </Button>
          )}
        </div>
      )}

      {/* Measured from file — auto-captured by decoding each staged binary (no AI, no typing). */}
      {measuredFiles && measuredFiles.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Technical Specs</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">Auto-detected</span>
          </div>
          <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto">
            {measuredFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="truncate max-w-[220px] text-muted-foreground" title={f.name}>{f.name}</span>
                <span className="font-medium text-foreground">{formatMeasured(f.measured)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Width, height, and pixel density are automatically read from each uploaded file — no manual entry required.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Orientation — required. When a pending AI suggestion exists the Select is pre-filled
            with the suggested value and rendered with a dashed border to signal "unconfirmed".
            Changing or re-selecting any value locks the field (removes the dashed state and shows
            the provenance tag). This matches the spec: field is technically filled but shown as
            unconfirmed until the human acts. */}
        {(() => {
          const suggested = shotSuggestion?.orientation ?? ""
          // Field is in an "unconfirmed suggestion" state when the value comes from AI and the user
          // hasn't yet touched it (we detect this by checking if it equals the raw suggestion).
          const isSuggested = !!suggested && currentAttrs.orientation === suggested && !currentAttrs.orientationConfirmed
          const isConfirmed = !!currentAttrs.orientation && (!suggested || currentAttrs.orientationConfirmed || currentAttrs.orientation !== suggested)
          return (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Orientation <span className="text-destructive">*</span>
              </Label>
              <Select
                value={currentAttrs.orientation || (suggested ? suggested : "")}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, orientation: v, orientationConfirmed: true })}
              >
                <SelectTrigger className={cn("w-full bg-background", isSuggested && "border-dashed border-primary/60")}>
                  <SelectValue placeholder="Select orientation..." />
                </SelectTrigger>
                <SelectContent>
                  {ORIENTATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {isSuggested && (
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3 text-primary" />
                  <span className="text-xs text-muted-foreground">AI suggested — select to confirm or change</span>
                </div>
              )}
              {isConfirmed && suggested && <AiAppliedTag />}
            </div>
          )
        })()}
        {(() => {
          const suggested = shotSuggestion?.facing ?? ""
          const isSuggested = !!suggested && currentAttrs.facing === suggested && !currentAttrs.facingConfirmed
          const isConfirmed = !!currentAttrs.facing && (!suggested || currentAttrs.facingConfirmed || currentAttrs.facing !== suggested)
          return (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Facing (GDSN) <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Select
                value={currentAttrs.facing || (suggested ? suggested : "")}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, facing: v, facingConfirmed: true })}
              >
                <SelectTrigger className={cn("w-full bg-background", isSuggested && "border-dashed border-primary/60")}>
                  <SelectValue placeholder="Select facing..." />
                </SelectTrigger>
                <SelectContent>{FACING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
              {isSuggested && (
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3 text-primary" />
                  <span className="text-xs text-muted-foreground">AI suggested — select to confirm or change</span>
                </div>
              )}
              {isConfirmed && suggested && <AiAppliedTag />}
            </div>
          )
        })()}
        {(() => {
          const suggested = shotSuggestion?.angle ?? ""
          const isSuggested = !!suggested && currentAttrs.angle === suggested && !currentAttrs.angleConfirmed
          const isConfirmed = !!currentAttrs.angle && (!suggested || currentAttrs.angleConfirmed || currentAttrs.angle !== suggested)
          return (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Angle <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
              <Select
                value={currentAttrs.angle || (suggested ? suggested : "")}
                onValueChange={(v) => updateAttrs({ ...currentAttrs, angle: v, angleConfirmed: true })}
              >
                <SelectTrigger className={cn("w-full bg-background", isSuggested && "border-dashed border-primary/60")}>
                  <SelectValue placeholder="Select angle..." />
                </SelectTrigger>
                <SelectContent>{ANGLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
              {isSuggested && (
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3 text-primary" />
                  <span className="text-xs text-muted-foreground">AI suggested — select to confirm or change</span>
                </div>
              )}
              {isConfirmed && suggested && <AiAppliedTag />}
            </div>
          )
        })()}
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Clipping Path <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
          <Input value={currentAttrs.clippingPath} onChange={(e) => updateAttrs({ ...currentAttrs, clippingPath: e.target.value })} placeholder="Path name..." className="bg-background" />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          {showDescription ? (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Image Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
                {!currentAttrs.imageDescription && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setShowDescription(false)}
                  >
                    Hide
                  </button>
                )}
              </div>
              <Input value={currentAttrs.imageDescription} onChange={(e) => updateAttrs({ ...currentAttrs, imageDescription: e.target.value })} placeholder="Enter description..." className="bg-background" />
            </>
          ) : (
            <button
              type="button"
              className="w-fit text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground"
              onClick={() => setShowDescription(true)}
            >
              + Add image description (optional)
            </button>
          )}
        </div>
      </div>

      {onApplyPerShotToAll && (
        <Button variant="outline" size="sm" className="w-fit" onClick={onApplyPerShotToAll}>
          Apply to all images
        </Button>
      )}
    </div>
  )
}
