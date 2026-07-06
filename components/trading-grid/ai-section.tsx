"use client"

import {
  X,
  Check,
  Info,
  Pencil,
  AlertCircle,
  Sparkles,
  Loader2,
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
import { cn } from "@/lib/utils"
import { getCategoryBricks } from "@/lib/gs1/generated-bricks"
import type { UploadedFile } from "./uploaded-file"
import { useAiAttributes, EXTRACTION_MODE, PRODUCT_CATEGORIES } from "./use-ai-attributes"
import { ORIENTATION_OPTIONS, FACING_OPTIONS } from "./attribute-options"

// Consolidated AI section (P1.1): one card, one entry point. Classification proposes a
// brick from the images; the human confirms (or corrects via the manual panel); confirming
// runs the extended-attribute extraction pass. The per-shot pass is fully independent below.
// The entire useAiAttributes return value is passed as a single `ai` prop rather than
// threading ~35 individual props — the render code reads state and calls handlers off it
// exactly as it did when it lived inline in the wizard closure.
type AiSectionProps = {
  ai: ReturnType<typeof useAiAttributes>
  uploadedFiles: UploadedFile[]
  // Hides the "Skip AI" affordance where it doesn't make sense (post-submit drawer).
  showSkip: boolean
}

export function AiSection({ ai, uploadedFiles, showSkip }: AiSectionProps) {
  const {
    aiCategory, setAiCategory, aiBrick, setAiBrick, aiSkipped, setAiSkipped,
    aiExtraction, aiEditing, setAiEditing, shotSuggestions, shotSuggestLoading,
    classificationStatus, setClassificationStatus, classificationConfidence, setClassificationConfidence,
    showManualClassify, setShowManualClassify,
    valuesForCodeList, bricksForCategory,
    runExtraction, runClassification, confirmClassification,
    setAttributeDecision, updateAttributeField, selectAttributeValue, resolveUnresolvedAttribute,
    clearExtraction, clearShotSuggestions, runShotSuggestions, acceptShotSuggestions, dismissShotSuggestion,
    isExtracting, isComplete, isError, acceptedExtractedAttributes, pendingExtractedCount, acceptAllPending,
  } = ai

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
        {/* GPC brick — attributes are scoped to this single classification */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="ai-brick" className="text-xs text-muted-foreground">Product brick (GPC)</Label>
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
              <SelectValue placeholder={aiCategory ? "Select a brick..." : "Select a category first"} />
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
          No GS1 brick mapping is available for this category — continue entering attributes manually.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {!aiBrick
            ? "Select a category and brick — extended attribute extraction runs automatically once both are set."
            : "Picking a different brick re-runs extraction for this product."}
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
              Category: <span className="font-medium">{aiExtraction.category}</span>
              {aiExtraction.brickName && (
                <>
                  {" · "}Brick: <span className="font-medium">{aiExtraction.brickName}</span>
                  {aiExtraction.brickCode && <span className="font-mono text-xs text-muted-foreground"> ({aiExtraction.brickCode})</span>}
                </>
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
                Accept all pending ({pendingExtractedCount})
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearExtraction}>
              Re-run
            </Button>
          </div>
        </div>
        {/* Fallback banner when Gemini was unavailable */}
        {aiExtraction.fallbackUsed && (
          <div className="flex items-center justify-between rounded border border-primary/30 bg-primary/5 px-3 py-2">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-primary shrink-0" />
              <p className="text-sm text-foreground">AI service unavailable — showing demo results.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => runExtraction()}>Try again with AI</Button>
          </div>
        )}
        <div className="flex items-start gap-2 rounded bg-muted/30 p-2">
          <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">AI-generated attributes should be reviewed before saving. All images were analyzed together to produce this single product-level attribute set. AI attributes apply to all images of this product.</p>
        </div>

        {/* Product-level attribute cards */}
        <div className="flex flex-col gap-3 rounded border border-border p-3">
          {aiExtraction.attributes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No extended attributes were suggested for this category.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {aiExtraction.attributes.map((attr, idx) => {
                const editing = aiEditing?.index === idx
                return (
                  <div
                    key={`${attr.code}-${idx}`}
                    className={cn(
                      "flex flex-col gap-2 rounded border p-3",
                      attr.decision === "accepted" ? "border-tg-success/40 bg-card"
                        : attr.decision === "rejected" ? "border-border bg-muted/30 opacity-70"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">{attr.codeListName}</span>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                            attr.decision === "accepted" ? "bg-tg-success/15 text-tg-success"
                              : attr.decision === "rejected" ? "bg-muted text-muted-foreground"
                              : "bg-tg-warning/15 text-tg-warning"
                          )}
                        >
                          {attr.decision === "accepted" ? <Check className="size-3" />
                            : attr.decision === "rejected" ? <X className="size-3" />
                            : <AlertCircle className="size-3" />}
                          {attr.decision === "accepted" ? "Accepted" : attr.decision === "rejected" ? "Rejected" : "Pending review"}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          attr.confidence >= 0.85 ? "bg-tg-success/15 text-tg-success"
                            : attr.confidence >= 0.75 ? "bg-tg-warning/15 text-tg-warning"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {Math.round(attr.confidence * 100)}%
                      </span>
                    </div>
                    {editing ? (
                      (() => {
                        const allowed = valuesForCodeList(attr.codeListName)
                        return (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs text-muted-foreground">Attribute Value</Label>
                              {allowed.length > 0 ? (
                                <Select
                                  value={allowed.some(v => v.value === attr.attributeValue) ? attr.attributeValue : undefined}
                                  onValueChange={(v) => selectAttributeValue(idx, v)}
                                >
                                  <SelectTrigger className="h-8 bg-background">
                                    <SelectValue placeholder="Select a value…" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {allowed.map(v => (
                                      <SelectItem key={v.code} value={v.value}>{v.value}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  value={attr.attributeValue}
                                  onChange={(e) => updateAttributeField(idx, "attributeValue", e.target.value)}
                                  className="h-8 bg-background"
                                  autoFocus
                                />
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label className="text-xs text-muted-foreground">GS1 Code</Label>
                              <Input
                                value={attr.code}
                                onChange={(e) => updateAttributeField(idx, "code", e.target.value)}
                                readOnly={allowed.length > 0}
                                className={cn("h-8 bg-background font-mono", allowed.length > 0 && "text-muted-foreground")}
                              />
                            </div>
                            <Button size="sm" variant="outline" className="h-7 w-fit gap-1 px-2 text-xs" onClick={() => setAiEditing(null)}>
                              <Check className="size-3" /> Done
                            </Button>
                          </div>
                        )
                      })()
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">{attr.attributeValue}</p>
                        <p className="text-xs text-muted-foreground">GS1 Code: <span className="font-mono text-foreground">{attr.code}</span></p>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground">{attr.reason}</p>
                    <div className="flex items-center gap-1 pt-1">
                      {/* Explicit review actions: Accept and Reject are always shown as
                          separate buttons; the active decision is highlighted. Suggestions
                          start "pending" and only count once Accept is clicked. */}
                      <Button
                        variant={attr.decision === "accepted" ? "default" : "outline"}
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        aria-pressed={attr.decision === "accepted"}
                        onClick={() => setAttributeDecision(idx, attr.decision === "accepted" ? "pending" : "accepted")}
                      >
                        <Check className="size-3" /> Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-7 gap-1 px-2 text-xs",
                          attr.decision === "rejected"
                            ? "border-destructive/50 bg-destructive/10 text-destructive"
                            : "text-muted-foreground hover:text-destructive"
                        )}
                        aria-pressed={attr.decision === "rejected"}
                        onClick={() => setAttributeDecision(idx, attr.decision === "rejected" ? "pending" : "rejected")}
                      >
                        <X className="size-3" /> Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() => setAiEditing(editing ? null : { index: idx })}
                      >
                        <Pencil className="size-3" /> Edit
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Unresolved attributes — product level */}
          {aiExtraction.unresolvedAttributes.length > 0 && (
            <div className="flex flex-col gap-2 rounded border border-border bg-muted/20 p-3 mt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unresolved attributes</p>
              <ul className="flex flex-col gap-2">
                {aiExtraction.unresolvedAttributes.map((u, i) => {
                  const options = valuesForCodeList(u.codeListName)
                  return (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="size-3.5 text-tg-warning mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="text-foreground">{u.codeListName}: </span>
                        <span className="text-muted-foreground">{u.reason}</span>
                      </div>
                      {options.length > 0 && (
                        <select
                          className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) resolveUnresolvedAttribute(i, u.codeListName, e.target.value)
                          }}
                        >
                          <option value="" disabled>Add manually…</option>
                          {options.map(o => (
                            <option key={o.code} value={o.value}>{o.value}</option>
                          ))}
                        </select>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
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
          <p className="mt-0.5 text-sm text-muted-foreground">
            Two independent, optional passes: classify &amp; extract extended attributes, and/or suggest per-shot details for each image.
          </p>
        </div>
        {EXTRACTION_MODE === "mock" && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Demo mode — simulated results
          </span>
        )}
        {aiSkipped && (
          <Button variant="ghost" size="sm" onClick={() => setAiSkipped(false)}>
            Show
          </Button>
        )}
      </div>

      {aiSkipped && (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0" />
          <span>AI analysis skipped. You can continue entering attributes manually.</span>
        </div>
      )}

      {!aiSkipped && (
        <div className="flex flex-col gap-5 p-4">
          {/* ── Product attributes (extended, non-GDSN) — genuinely needs a brick to scope its
              vocabulary, so classification gates this pass only. ── */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product attributes</h4>

            {classificationStatus === "idle" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => void runClassification()} disabled={uploadedFiles.length === 0} className="gap-2">
                    <Sparkles className="size-4" />
                    Classify &amp; extract with AI
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowManualClassify(v => !v)}>
                    {showManualClassify ? "Hide manual entry" : "Set category & brick manually"}
                  </Button>
                  {showSkip && (
                    <Button variant="outline" size="sm" onClick={() => setAiSkipped(true)}>
                      Skip AI
                    </Button>
                  )}
                </div>
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
                {showManualClassify && renderAiIdleControls()}
                {showSkip && (
                  <Button variant="outline" size="sm" className="w-fit" onClick={() => setAiSkipped(true)}>Skip AI</Button>
                )}
              </div>
            )}

            {classificationStatus === "confirmed" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Classified as <span className="font-medium text-foreground">{aiBrick?.name}</span> · {aiCategory}
                  </p>
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
                      <Button variant="ghost" size="sm" onClick={() => { clearExtraction(); setAiSkipped(true) }}>
                        Continue manually
                      </Button>
                    </div>
                  </div>
                )}
                {renderAiResultsCard()}
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* ── Per-shot attributes (orientation/facing/angle/description — GDSN spec fields).
              Fully independent of the classification pass above: runShotSuggestions never
              reads aiCategory/aiBrick, and this section is reachable regardless of
              classificationStatus — getting GDSN help here never requires brick classification. ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Per-shot attributes</h4>
              {shotSuggestions === null && !shotSuggestLoading && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => void runShotSuggestions()} disabled={uploadedFiles.length === 0}>
                  <Sparkles className="size-3.5" />
                  Suggest per-shot details with AI
                </Button>
              )}
              {shotSuggestions !== null && shotSuggestions.some(s => s.status === "pending") && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => acceptShotSuggestions(shotSuggestions.filter(s => s.status === "pending"))}>
                  <Check className="size-3.5" />
                  Accept all ({shotSuggestions.filter(s => s.status === "pending").length})
                </Button>
              )}
            </div>
            {shotSuggestions === null && !shotSuggestLoading && (
              <p className="text-xs text-muted-foreground">
                Optional — proposes orientation, facing, angle, and a draft description per image. No classification needed.
              </p>
            )}
            {shotSuggestLoading && (
              <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                <Loader2 className="size-5 animate-spin text-primary" />
                <p className="text-sm text-foreground">Analyzing {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""} for per-shot attributes…</p>
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
        </div>
      )}
    </div>
  )
}
