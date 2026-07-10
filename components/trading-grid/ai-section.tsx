"use client"

import { useState } from "react"
import {
  Check,
  Info,
  AlertCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getCategoryBricks } from "@/lib/gs1/generated-bricks"
import type { UploadedFile } from "./uploaded-file"
import { useAiAttributes, PRODUCT_CATEGORIES } from "./use-ai-attributes"
import { SuggestionReviewTable, type SuggestionRow } from "./suggestion-review-table"
import { ORIENTATION_OPTIONS, FACING_OPTIONS } from "./attribute-options"
import type { UnresolvedAttribute } from "@/lib/gs1/types"

// ── Searchable combobox for picking a GS1 code-list value ───────────────────────
// Used both to resolve an unresolved attribute (no current value → "Set value") and to
// edit an extracted attribute's value in place (shows the current value in the trigger).
// Every option renders as `CODE — value` and is searchable by either.
function ValueCombobox({
  options,
  value,
  onSelect,
  placeholder = "Set value",
  triggerClassName,
  fullWidth,
}: {
  options: { code: string; value: string }[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  triggerClassName?: string
  fullWidth?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const selected = value ? options.find((o) => o.value === value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-between gap-1 px-2 text-xs font-normal",
            !value && "text-muted-foreground",
            fullWidth && "w-full",
            triggerClassName,
          )}
        >
          <span className="truncate">{value ? value : placeholder}</span>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search code or value…"
            value={search}
            onValueChange={setSearch}
            className="h-8 text-xs"
          />
          <CommandList className="max-h-52">
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.code}
                  value={`${o.code} ${o.value}`}
                  onSelect={() => {
                    onSelect(o.value)
                    setOpen(false)
                    setSearch("")
                  }}
                  className="text-xs"
                >
                  <Check className={cn("mr-1 size-3", selected?.code === o.code ? "opacity-100" : "opacity-0")} />
                  <span className="font-mono text-muted-foreground mr-2">{o.code}</span>
                  {o.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ── Collapsible unresolved attributes section ────────────────────────────────────
function UnresolvedSection({
  unresolvedAttributes,
  valuesForCodeList,
  resolveUnresolvedAttribute,
}: {
  unresolvedAttributes: UnresolvedAttribute[]
  valuesForCodeList: (name: string) => { code: string; value: string }[]
  resolveUnresolvedAttribute: (index: number, codeListName: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const count = unresolvedAttributes.length

  return (
    <div className="flex flex-col rounded border border-border bg-muted/20 mt-1 overflow-hidden">
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
        )}
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Unresolved Attributes ({count})
        </p>
      </button>

      {open && (
        <ul className="flex flex-col gap-2 px-3 pb-3">
          {unresolvedAttributes.map((u, i) => {
            const options = valuesForCodeList(u.codeListName)
            return (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="size-3.5 text-tg-warning mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground">{u.codeListName}: </span>
                  <span className="text-muted-foreground">{u.reason}</span>
                </div>
                {options.length > 0 && (
                  <ValueCombobox
                    options={options}
                    onSelect={(value) => resolveUnresolvedAttribute(i, u.codeListName, value)}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// Consolidated AI section (P1.1): one card, one entry point. Classification proposes a
// brick from the images; the human confirms (or corrects via the manual panel); confirming
// runs the extended-attribute extraction pass. Per-image detail suggestions live in the
// Image Details section, not here — this card covers Product Attributes only.
// The entire useAiAttributes return value is passed as a single `ai` prop rather than
// threading ~35 individual props — the render code reads state and calls handlers off it
// exactly as it did when it lived inline in the wizard closure.
type AiSectionProps = {
  ai: ReturnType<typeof useAiAttributes>
  uploadedFiles: UploadedFile[]
  // Lets the "inconsistent images" warning send the user back to re-upload. Omitted at render
  // sites with no upload step to return to (e.g. the post-submit view).
  onRequestReupload?: () => void
}

export function AiSection({ ai, uploadedFiles, onRequestReupload }: AiSectionProps) {
  const {
    aiCategory, setAiCategory, aiBrick, setAiBrick,
    aiExtraction, aiEditing, setAiEditing,
    classificationStatus, setClassificationStatus, classificationConfidence, setClassificationConfidence, classificationError,
    classificationOutliers, classificationNote,
    showManualClassify, setShowManualClassify,
    valuesForCodeList, bricksForCategory,
    runExtraction, runClassification, confirmClassification, confirmPrimaryImage,
    setAttributeDecision, updateAttributeField, selectAttributeValue, resolveUnresolvedAttribute,
    clearExtraction, clearShotSuggestions,
    isExtracting, isComplete, isError, acceptedExtractedAttributes, pendingExtractedCount, acceptAllPending,
  } = ai

  // Same-product gate (Task 2): with 2+ images, "Classify & extract" first asks the user to
  // confirm all images show the same product — the extraction prompt treats them as one
  // product, so mixed sets produce averaged, wrong attributes.
  const [gateOpen, setGateOpen] = useState(false)

  // Manual category+brick correction panel — the fallback path when the AI proposal (or its
  // absence) isn't right. Picking a brick here confirms classification directly (see the
  // Selects' onValueChange below) and auto-runs the extraction pass, same as accepting a proposal.
  const renderAiIdleControls = () => (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="flex flex-col gap-1">
          <Label htmlFor="ai-category" className="text-xs text-muted-foreground">Product category</Label>
          <Select value={aiCategory} onValueChange={(v) => {
            setAiCategory(v)
            clearExtraction()
            clearShotSuggestions()
            const bricks = getCategoryBricks(v)
            // A single-brick category fully determines classification on its own — confirm
            // it directly (passing values explicitly avoids reading stale state this tick).
            if (bricks.length === 1) {
              setAiBrick(bricks[0])
              confirmClassification(v, bricks[0])
            } else {
              setAiBrick(null)
              setClassificationStatus("idle")
              setClassificationConfidence(null)
            }
          }}>
            <SelectTrigger id="ai-category" className="w-56 bg-background">
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* GPC classification (brick) — attributes are scoped to this single classification */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="ai-brick" className="text-xs text-muted-foreground">Classification (GPC)</Label>
          <Select
            value={aiBrick?.code ?? ""}
            onValueChange={(code) => {
              const brick = bricksForCategory.find(b => b.code === code) ?? null
              setAiBrick(brick)
              clearExtraction()
              clearShotSuggestions()
              // Picking a brick fully determines classification — confirm and auto-run
              // extraction, same as accepting an AI-proposed brick.
              if (brick) confirmClassification(aiCategory, brick)
              else { setClassificationStatus("idle"); setClassificationConfidence(null) }
            }}
            disabled={!aiCategory || bricksForCategory.length === 0}
          >
            <SelectTrigger id="ai-brick" className="w-72 bg-background">
              <SelectValue placeholder={aiCategory ? "Select a classification..." : "Select a category first"} />
            </SelectTrigger>
            <SelectContent>
              {bricksForCategory.map(b => (
                <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {aiCategory && bricksForCategory.length === 0 ? (
        <p className="text-xs text-tg-warning">
          No GS1 classification mapping is available for this category — continue entering attributes manually.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {!aiBrick
            ? "Set it yourself if you already know the category and classification, or if the AI's guess looks wrong — extended attribute extraction runs automatically once both are set."
            : "Picking a different classification re-runs extraction for this product."}
        </p>
      )}
    </>
  )

  // Editable AI results card: every suggested attribute in one flat review table, sorted
  // riskiest-first (ascending confidence) — the bar color carries the attention signal.
  // Also shown post-confirm in the "View AI Attributes" drawer.
  const renderAiResultsCard = () => {
    if (!isComplete || !aiExtraction) return null
    return (
      <div className="flex flex-col gap-4">
        {/* Results header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-foreground">
              {aiExtraction.brickName ? (
                <>
                  Product Category: <span className="font-medium">{aiExtraction.brickName}</span>
                  {aiExtraction.brickCode && <span className="font-mono text-xs text-muted-foreground"> ({aiExtraction.brickCode})</span>}
                </>
              ) : (
                <>Product Category: <span className="font-medium">{aiExtraction.category}</span></>
              )}
              <span className="text-muted-foreground">
                {" "}· {acceptedExtractedAttributes.length} attribute{acceptedExtractedAttributes.length !== 1 ? "s" : ""} accepted
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {aiExtraction.imageCount === 1
                ? "1 image analyzed"
                : `${aiExtraction.imageCount} images analyzed together`}
              {aiExtraction.imageNames.length > 0 && (
                <span> — {aiExtraction.imageNames.join(", ")}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded bg-muted/30 p-2">
          <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">AI suggestions apply to all images of this product. Review each before saving.</p>
        </div>

        {/* Product-level attribute review table — flat, riskiest suggestions first */}
        <div className="flex flex-col gap-3">
          {aiExtraction.attributes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No extended attributes were suggested for this category.</p>
          ) : (
            <SuggestionReviewTable
              rows={aiExtraction.attributes.map((attr, idx): SuggestionRow => ({
                id: String(idx),
                label: attr.codeListName,
                sublabel: attr.code,
                value: attr.attributeValue,
                helper: attr.reason,
                confidence: attr.confidence,
                status: attr.decision,
              }))}
              onConfirm={(id) => {
                const idx = Number(id)
                const attr = aiExtraction.attributes[idx]
                if (attr) setAttributeDecision(idx, attr.decision === "accepted" ? "pending" : "accepted")
              }}
              onReject={(id) => {
                const idx = Number(id)
                const attr = aiExtraction.attributes[idx]
                if (attr) setAttributeDecision(idx, attr.decision === "rejected" ? "pending" : "rejected")
              }}
              editingId={aiEditing ? String(aiEditing.index) : null}
              onEditToggle={(id) => setAiEditing(id === null ? null : { index: Number(id) })}
              renderEditor={(row, close) => {
                const idx = Number(row.id)
                const attr = aiExtraction.attributes[idx]
                if (!attr) return null
                const allowed = valuesForCodeList(attr.codeListName)
                return allowed.length > 0 ? (
                  <ValueCombobox
                    fullWidth
                    options={allowed}
                    value={allowed.some(v => v.value === attr.attributeValue) ? attr.attributeValue : undefined}
                    onSelect={(v) => { selectAttributeValue(idx, v); close() }}
                    placeholder="Select a value…"
                  />
                ) : (
                  <Input
                    value={attr.attributeValue}
                    onChange={(e) => updateAttributeField(idx, "attributeValue", e.target.value)}
                    onBlur={close}
                    onKeyDown={(e) => { if (e.key === "Enter") close() }}
                    className="h-8 bg-background"
                    autoFocus
                  />
                )
              }}
              headerAction={pendingExtractedCount > 0 ? (
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={acceptAllPending}>
                  <Check className="size-3" /> Accept all ({pendingExtractedCount})
                </Button>
              ) : undefined}
            />
          )}

          {/* Unresolved attributes — product level, collapsible */}
          {aiExtraction.unresolvedAttributes.length > 0 && (
            <UnresolvedSection
              unresolvedAttributes={aiExtraction.unresolvedAttributes}
              valuesForCodeList={valuesForCodeList}
              resolveUnresolvedAttribute={resolveUnresolvedAttribute}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded border border-border bg-card">
      <div className="flex items-start gap-3 border-b border-border p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded bg-primary/10">
          <Sparkles className="size-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Analyze this product&apos;s images with AI</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">Optional — AI proposes, you confirm.</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4">
          {/* ── Product attributes (extended, non-GDSN) — genuinely needs a brick to scope its
              vocabulary, so classification gates this pass only. ── */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product attributes</h4>

            {classificationStatus === "idle" && (
              <div className="flex flex-col gap-3">
                {gateOpen ? (
                  /* Same-product gate (Task 2): inline confirmation before the images are sent
                     to AI as one product. Multi-image only — a single image has nothing to mix. */
                  <div className="flex flex-col gap-3 rounded border border-primary/30 bg-primary/5 p-3">
                    <p className="text-sm text-foreground">
                      You&apos;re about to analyze <span className="font-medium">{uploadedFiles.length} images</span> together as one product.
                      Confirm they are all images of the same product.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {uploadedFiles.map((f) => (
                        <div key={f.id} title={f.name} className="size-12 shrink-0 overflow-hidden rounded border border-border bg-muted">
                          {f.preview && <img src={f.preview} alt={f.name} className="size-full object-cover" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" className="gap-1" onClick={() => { setGateOpen(false); void runClassification() }}>
                        <Check className="size-3.5" /> Yes, same product — analyze
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setGateOpen(false)}>
                        Let me review
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() => (uploadedFiles.length > 1 ? setGateOpen(true) : void runClassification())}
                      disabled={uploadedFiles.length === 0}
                      className="gap-2"
                    >
                      <Sparkles className="size-4" />
                      Classify &amp; extract with AI
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowManualClassify(v => !v)}>
                      {showManualClassify ? "Hide manual entry" : "Set category & classification manually"}
                    </Button>
                  </div>
                )}
                {showManualClassify && !gateOpen && renderAiIdleControls()}
              </div>
            )}

            {classificationStatus === "loading" && (
              <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                <Loader2 className="size-5 animate-spin text-primary" />
                <p className="text-sm text-foreground">Classifying your product…</p>
              </div>
            )}

            {/* Proposed: confirm chip — human confirms or corrects before extraction runs */}
            {classificationStatus === "proposed" && aiBrick && (
              <div className="flex flex-col gap-3">
                {classificationConfidence != null && classificationConfidence < 0.4 ? (
                  <div className="flex flex-col gap-3 rounded border border-tg-warning/40 bg-tg-warning/5 p-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-4 text-tg-warning mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Low confidence classification ({Math.round(classificationConfidence * 100)}%)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          The AI is uncertain about this product. Review carefully before confirming, or set the classification manually.
                        </p>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Suggested:</span> {aiBrick.name} · {aiCategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pl-7">
                      <Button size="sm" className="gap-1" onClick={() => confirmClassification(aiCategory, aiBrick, classificationConfidence)}>
                        <Check className="size-3.5" /> Confirm anyway
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowManualClassify(true)}>Classify manually</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 rounded border border-primary/30 bg-primary/5 p-3">
                    <p className="text-sm text-foreground">
                      Looks like <span className="font-medium">{aiBrick.name}</span> · {aiCategory}
                      {classificationConfidence != null && ` (${Math.round(classificationConfidence * 100)}%)`}
                    </p>
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" className="gap-1" onClick={() => confirmClassification(aiCategory, aiBrick, classificationConfidence)}>
                        <Check className="size-3.5" /> Confirm
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowManualClassify(true)}>Change</Button>
                    </div>
                  </div>
                )}
                {showManualClassify && renderAiIdleControls()}
              </div>
            )}

            {/* Automated second line of defense (in addition to the same-product gate, which is
                just a human self-report): Gemini flagged one or more images as not matching the
                rest. Multi-image only — a single image is never "inconsistent" with itself. */}
            {classificationStatus === "inconsistent" && (
              <div className="rounded border border-tg-warning/40 bg-tg-warning/5 p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-4 text-tg-warning mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      We noticed these images seem to show different products.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To ensure accurate product classification, please confirm which image represents the primary product you want to catalog, or upload a new set.
                    </p>
                    {classificationNote && (
                      <p className="text-xs text-muted-foreground">{classificationNote}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-7">
                  {uploadedFiles.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => confirmPrimaryImage(i)}
                      title={f.name}
                      className={cn(
                        "size-9 shrink-0 rounded border overflow-hidden bg-muted transition-colors",
                        classificationOutliers?.includes(f.name) ? "border-tg-warning" : "border-border hover:border-primary"
                      )}
                    >
                      {f.preview && <img src={f.preview} alt="" className="size-full object-cover" />}
                    </button>
                  ))}
                  {onRequestReupload && (
                    <Button variant="outline" size="sm" onClick={onRequestReupload}>Upload a new set</Button>
                  )}
                </div>
              </div>
            )}

            {classificationStatus === "error" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 rounded border border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">
                      {classificationError ?? "Classification failed. You can continue setting attributes manually."}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => void runClassification()}>Try again</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowManualClassify(true)}>Continue manually</Button>
                  </div>
                </div>
                {showManualClassify && renderAiIdleControls()}
              </div>
            )}

            {classificationStatus === "confirmed" && (
              <div className="flex flex-col gap-3">
                {/* No "Classified as …" chip here — the results card's Product Category
                    line is the single source; while extracting, the confirmed classification
                    shows as an inline loading line instead of a separate box. */}
                <div className="flex items-center justify-between gap-2">
                  {isExtracting ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                      <span>
                        <span className="font-medium text-foreground">{aiBrick?.name ?? aiCategory}</span>
                        {" "}confirmed — extracting attributes from {aiExtraction?.imageCount ?? uploadedFiles.length} image{(aiExtraction?.imageCount ?? uploadedFiles.length) !== 1 ? "s" : ""}…
                      </span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setShowManualClassify(v => !v)}>
                    {showManualClassify ? "Hide" : "Change classification"}
                  </Button>
                </div>
                {showManualClassify && renderAiIdleControls()}
                {isError && (
                  <div className="flex flex-col gap-3 rounded border border-destructive/30 bg-destructive/5 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">
                        {aiExtraction?.error ?? "Extraction failed. You can continue setting attributes manually."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => runExtraction()}>Try again</Button>
                      <Button variant="ghost" size="sm" onClick={() => { clearExtraction(); setClassificationStatus("idle"); setClassificationConfidence(null) }}>
                        Continue manually
                      </Button>
                    </div>
                  </div>
                )}
                {renderAiResultsCard()}
              </div>
            )}
          </div>

          {/* Per-image AI suggestions moved to the Image Details section (Task 5) — this card
              is Product Attributes only. */}
        </div>
    </div>
  )
}
