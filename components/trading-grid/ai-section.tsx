"use client"

import { useState } from "react"
import {
  X,
  Check,
  Info,
  Pencil,
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
import { ORIENTATION_OPTIONS, FACING_OPTIONS } from "./attribute-options"
import type { UnresolvedAttribute, ExtractedAttribute } from "@/lib/gs1/types"

// Attributes at or above this confidence are treated as "looks good" and collapsed by default;
// below it they surface in the "Needs your attention" band. Review-by-exception: the human's
// eye goes to the uncertain items first, but every attribute stays fully editable.
const ATTENTION_THRESHOLD = 0.9

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

// ── Compact, review-by-exception product attribute card ─────────────────────────
// One tight row: confidence dot + label + Accept/Reject/Edit. The value sits below; the
// GS1 code and AI reasoning are hidden behind a "Details" disclosure so the supplier can
// scan values fast and only dig in when something looks off. Every card — regardless of
// confidence — keeps Accept / Reject / Edit (human-in-the-loop on all values).
function ProductAttributeCard({
  attr,
  idx,
  editing,
  options,
  onEditToggle,
  onDecision,
  onSelectValue,
  onFieldChange,
}: {
  attr: ExtractedAttribute
  idx: number
  editing: boolean
  options: { code: string; value: string }[]
  onEditToggle: () => void
  onDecision: (decision: "accepted" | "rejected" | "pending") => void
  onSelectValue: (value: string) => void
  onFieldChange: (field: "attributeValue" | "code", value: string) => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const pct = Math.round(attr.confidence * 100)
  const dotColor =
    attr.confidence >= 0.9 ? "bg-tg-success"
      : attr.confidence >= 0.75 ? "bg-tg-warning"
      : "bg-destructive"

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded border p-2.5",
        attr.decision === "accepted" ? "border-tg-success/40 bg-card"
          : attr.decision === "rejected" ? "border-border bg-muted/30 opacity-70"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={cn("size-2 shrink-0 rounded-full", dotColor)} title={`${pct}% confidence`} />
          <span className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{attr.codeListName}</span>
          {attr.decision === "accepted" && <Check className="size-3 shrink-0 text-tg-success" />}
          {attr.decision === "rejected" && <X className="size-3 shrink-0 text-muted-foreground" />}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant={attr.decision === "accepted" ? "default" : "ghost"}
            size="icon"
            className="size-7"
            aria-label="Accept"
            aria-pressed={attr.decision === "accepted"}
            onClick={() => onDecision(attr.decision === "accepted" ? "pending" : "accepted")}
          >
            <Check className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-7", attr.decision === "rejected" ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:text-destructive")}
            aria-label="Reject"
            aria-pressed={attr.decision === "rejected"}
            onClick={() => onDecision(attr.decision === "rejected" ? "pending" : "rejected")}
          >
            <X className="size-3.5" />
          </Button>
          <Button
            variant={editing ? "secondary" : "ghost"}
            size="icon"
            className="size-7 text-muted-foreground"
            aria-label="Edit"
            aria-pressed={editing}
            onClick={onEditToggle}
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 pt-0.5">
          {options.length > 0 ? (
            <ValueCombobox
              fullWidth
              options={options}
              value={options.some(v => v.value === attr.attributeValue) ? attr.attributeValue : undefined}
              onSelect={onSelectValue}
              placeholder="Select a value…"
            />
          ) : (
            <Input
              value={attr.attributeValue}
              onChange={(e) => onFieldChange("attributeValue", e.target.value)}
              className="h-8 bg-background"
              autoFocus
            />
          )}
          <Button size="sm" variant="outline" className="h-7 w-fit gap-1 px-2 text-xs" onClick={onEditToggle}>
            <Check className="size-3" /> Done
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">{attr.attributeValue}</p>
          <button
            type="button"
            className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowDetails(v => !v)}
            aria-expanded={showDetails}
          >
            {showDetails ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            Details
          </button>
          {showDetails && (
            <div className="flex flex-col gap-1 pl-4">
              <p className="text-xs text-muted-foreground">
                GS1 Code: <span className="font-mono text-foreground">{attr.code}</span>
                <span className="ml-2">Confidence: {pct}%</span>
              </p>
              {attr.reason && <p className="text-xs text-muted-foreground">{attr.reason}</p>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Consolidated AI section (P1.1): one card, one entry point. Classification proposes a
// brick from the images; the human confirms (or corrects via the manual panel); confirming
// runs the extended-attribute extraction pass. The per-shot pass is fully independent below.
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
    aiExtraction, aiEditing, setAiEditing, shotSuggestions, shotSuggestLoading, shotSuggestError,
    classificationStatus, setClassificationStatus, classificationConfidence, setClassificationConfidence, classificationError,
    classificationOutliers, classificationNote,
    showManualClassify, setShowManualClassify,
    valuesForCodeList, bricksForCategory,
    runExtraction, runClassification, confirmClassification, confirmPrimaryImage,
    setAttributeDecision, updateAttributeField, selectAttributeValue, resolveUnresolvedAttribute,
    clearExtraction, clearShotSuggestions, runShotSuggestions, acceptShotSuggestions, dismissShotSuggestion,
    isExtracting, isComplete, isError, acceptedExtractedAttributes, pendingExtractedCount, acceptAllPending, acceptPendingByIndex,
  } = ai

  // Collapse state for the high-confidence ("Looks good") band — collapsed by default so
  // review-by-exception keeps the uncertain items front and center.
  const [looksGoodOpen, setLooksGoodOpen] = useState(false)

  // Same-product confirmation gate. AI Task 1 analyzes every uploaded image together as one
  // product; if a supplier accidentally mixes products the result is blended/garbage. For
  // multi-image uploads we ask them to confirm the batch is a single product before the call.
  const [showSameProductGate, setShowSameProductGate] = useState(false)
  const startClassification = () => {
    if (uploadedFiles.length > 1) setShowSameProductGate(true)
    else void runClassification()
  }

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

  // Editable AI results card — the same Accept/Reject/Edit UI used in Step 2, extracted into a
  // render function so it can also be shown post-confirm in the "View AI Attributes" drawer
  // (AI attributes are the primary editing surface, so that drawer stays editable, unlike the
  // Retailer's read-only equivalent).
  const renderAiResultsCard = () => (
    isComplete && aiExtraction && (
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
          <div className="flex items-center gap-1 shrink-0">
            {pendingExtractedCount > 0 && (
              <Button variant="outline" size="sm" className="gap-1" onClick={acceptAllPending}>
                <Check className="size-3.5" />
                Accept All
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 rounded bg-muted/30 p-2">
          <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">AI suggestions apply to all images of this product. Review each before saving.</p>
        </div>

        {/* Product-level attribute cards — no wrapper box; bands lay flat inside the results card */}
        <div className="flex flex-col gap-3">
          {aiExtraction.attributes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No extended attributes were suggested for this category.</p>
          ) : (
            (() => {
              const withIdx = aiExtraction.attributes.map((attr, idx) => ({ attr, idx }))
              const needsAttention = withIdx.filter(({ attr }) => attr.confidence < ATTENTION_THRESHOLD)
              const looksGood = withIdx.filter(({ attr }) => attr.confidence >= ATTENTION_THRESHOLD)
              const looksGoodPending = looksGood.filter(({ attr }) => attr.decision === "pending").map(({ idx }) => idx)
              const renderCard = ({ attr, idx }: { attr: ExtractedAttribute; idx: number }) => (
                <ProductAttributeCard
                  key={`${attr.code}-${idx}`}
                  attr={attr}
                  idx={idx}
                  editing={aiEditing?.index === idx}
                  options={valuesForCodeList(attr.codeListName)}
                  onEditToggle={() => setAiEditing(aiEditing?.index === idx ? null : { index: idx })}
                  onDecision={(d) => setAttributeDecision(idx, d)}
                  onSelectValue={(v) => selectAttributeValue(idx, v)}
                  onFieldChange={(f, v) => updateAttributeField(idx, f, v)}
                />
              )
              return (
                <div className="flex flex-col gap-3">
                  {/* Needs attention band — low confidence, always expanded */}
                  {needsAttention.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 text-tg-warning" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-tg-warning">
                          Needs your attention ({needsAttention.length})
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {needsAttention.map(renderCard)}
                      </div>
                    </div>
                  )}

                  {/* Looks good band — high confidence, collapsed by default */}
                  {looksGood.length > 0 && (
                    <div className="flex flex-col overflow-hidden rounded border border-border bg-muted/20">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <button
                          type="button"
                          className="flex flex-1 items-center gap-2 text-left"
                          onClick={() => setLooksGoodOpen(v => !v)}
                          aria-expanded={looksGoodOpen}
                        >
                          {looksGoodOpen
                            ? <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                            : <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
                          <Check className="size-3.5 shrink-0 text-tg-success" />
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {looksGood.length} attribute{looksGood.length !== 1 ? "s" : ""} look good
                          </p>
                        </button>
                        {looksGoodPending.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 shrink-0 gap-1 px-2 text-xs"
                            onClick={() => acceptPendingByIndex(looksGoodPending)}
                          >
                            <Check className="size-3" /> Accept all
                          </Button>
                        )}
                      </div>
                      {looksGoodOpen && (
                        <div className="grid grid-cols-1 gap-2 px-3 pb-3 md:grid-cols-2">
                          {looksGood.map(renderCard)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()
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
  )

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
                {showSameProductGate ? (
                  <div className="flex flex-col gap-3 rounded border border-border bg-muted/20 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-foreground">
                          Are all {uploadedFiles.length} images of the same product?
                        </p>
                        <p className="text-xs text-muted-foreground">
                          AI analyzes them together as one product. Mixing different products produces inaccurate attributes.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        className="gap-2"
                        onClick={() => { setShowSameProductGate(false); void runClassification() }}
                      >
                        <Sparkles className="size-4" />
                        Yes, analyze together
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowSameProductGate(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={startClassification} disabled={uploadedFiles.length === 0} className="gap-2">
                      <Sparkles className="size-4" />
                      Classify &amp; extract with AI
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowManualClassify(v => !v)}>
                      {showManualClassify ? "Hide manual entry" : "Set category & classification manually"}
                    </Button>
                  </div>
                )}
                {showManualClassify && renderAiIdleControls()}
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

            {classificationStatus === "inconsistent" && uploadedFiles.length > 1 && (
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

            {/* Single-image case: the mismatch is against the selected Product's description,
                not against other images — "these images"/"primary image"/"a new set" copy above
                doesn't apply when there's only one file. */}
            {classificationStatus === "inconsistent" && uploadedFiles.length <= 1 && (
              <div className="flex flex-col gap-3">
                <div className="rounded border border-tg-warning/40 bg-tg-warning/5 p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-4 text-tg-warning mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">
                        This image doesn't seem to match the selected product.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {classificationNote ?? "AI flagged a mismatch between the image and the product description."} Double-check the Product selected in Step 1, or continue with AI's best guess below.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-7">
                    <Button variant="outline" size="sm" onClick={() => void runClassification()}>Try again</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowManualClassify(true)}>Continue manually</Button>
                    {onRequestReupload && (
                      <Button variant="ghost" size="sm" onClick={onRequestReupload}>Go back to Target &amp; Files</Button>
                    )}
                  </div>
                </div>
                {showManualClassify && renderAiIdleControls()}
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
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowManualClassify(v => !v)}>
                    {showManualClassify ? "Hide" : "Change classification"}
                  </Button>
                </div>
                {showManualClassify && renderAiIdleControls()}
                {isExtracting && (
                  <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <p className="text-sm text-foreground">
                      Analyzing {aiExtraction?.imageCount ?? uploadedFiles.length} image{(aiExtraction?.imageCount ?? uploadedFiles.length) !== 1 ? "s" : ""} together for {aiCategory} attributes…
                    </p>
                  </div>
                )}
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

          {/* Per-shot attributes only apply with 2+ images — a single shot has no
              product-wide-vs-per-shot distinction, and its orientation/facing/angle are entered
              directly in the (flattened) attribute form below. */}
          {uploadedFiles.length > 1 && (
          <>
          <div className="border-t border-border" />

          {/* ── Per-shot attributes (orientation/facing/angle/description — GDSN spec fields).
              Fully independent of the classification pass above: runShotSuggestions never
              reads aiCategory/aiBrick, and this section is reachable regardless of
              classificationStatus — getting GDSN help here never requires brick classification. ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Image Details</h4>
              {shotSuggestions === null && !shotSuggestLoading && !shotSuggestError && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => void runShotSuggestions()} disabled={uploadedFiles.length === 0}>
                  <Sparkles className="size-3.5" />
                  Suggest image details with AI
                </Button>
              )}
              {shotSuggestions !== null && shotSuggestions.some(s => s.status === "pending") && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => acceptShotSuggestions(shotSuggestions.filter(s => s.status === "pending"))}>
                  <Check className="size-3.5" />
                  Accept all ({shotSuggestions.filter(s => s.status === "pending").length})
                </Button>
              )}
            </div>
            {shotSuggestions === null && !shotSuggestLoading && !shotSuggestError && (
              <p className="text-xs text-muted-foreground">
                Optional — proposes orientation, facing, angle, and a draft description for each image. No classification needed.
              </p>
            )}
            {shotSuggestLoading && (
              <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                <Loader2 className="size-5 animate-spin text-primary" />
                <p className="text-sm text-foreground">Analyzing {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""} for image details…</p>
              </div>
            )}
            {shotSuggestError && !shotSuggestLoading && (
              <div className="flex flex-col gap-3 rounded border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{shotSuggestError}</p>
                </div>
                <Button variant="outline" size="sm" className="w-fit" onClick={() => void runShotSuggestions()}>Try again</Button>
              </div>
            )}
            {shotSuggestions !== null && !shotSuggestLoading && (
              <div className="flex flex-col divide-y divide-border rounded border border-border">
                {shotSuggestions.map((s) => (
                  <div key={s.fileIndex} className={cn("flex items-center gap-3 px-4 py-2", s.status === "dismissed" && "opacity-50")}>
                    <div className="size-9 shrink-0 rounded border border-border overflow-hidden bg-muted">
                      {uploadedFiles[s.fileIndex]?.preview && (
                        <img src={uploadedFiles[s.fileIndex].preview} alt="" className="size-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{s.fileName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {ORIENTATION_OPTIONS.find(o => o.value === s.orientation)?.label ?? s.orientation}
                        {s.facing && ` · Facing ${FACING_OPTIONS.find(o => o.value === s.facing)?.label ?? s.facing}`}
                        {s.description && ` · “${s.description}”`}
                      </p>
                    </div>
                    <span className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      s.confidence >= 0.85 ? "bg-tg-success/15 text-tg-success" : "bg-tg-warning/15 text-tg-warning"
                    )}>
                      {Math.round(s.confidence * 100)}%
                    </span>
                    {s.status === "accepted" ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-tg-success">
                        <Check className="size-3.5" /> Accepted
                      </span>
                    ) : s.status === "dismissed" ? (
                      <span className="text-xs text-muted-foreground shrink-0">Dismissed</span>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs" onClick={() => acceptShotSuggestions([s])}>
                          <Check className="size-3" /> Accept
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs text-muted-foreground" onClick={() => dismissShotSuggestion(s.fileIndex)}>
                          <X className="size-3" /> Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
          )}
        </div>
    </div>
  )
}
