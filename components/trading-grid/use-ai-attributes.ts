"use client"

import { useState } from "react"
import useSWR from "swr"
import type { CategoryOptions, AttributeDecision, ExtractedAttribute, UnresolvedAttribute } from "@/lib/gs1/types"
import { PRODUCT_CATEGORIES } from "@/lib/gs1/types"
import { getCategoryBricks, getBrick, type Brick } from "@/lib/gs1/generated-bricks"
import type { UploadedFile } from "./uploaded-file"

export { PRODUCT_CATEGORIES }

// Response shape from GET /api/attribute-options (declared locally so this client component
// never imports server route code). Mirrors AttributeOptionsResponse in that route.
type AttributeOptionsResponse = { category: string; options: CategoryOptions }

// ExtractionApiResponse: product-level shape returned by POST /api/extract-attributes.
// Mirrors route.ts ExtractionApiResponse without importing server code into the client bundle.
type ExtractionApiResponse = {
  category: string
  brickCode?: string
  brickName?: string
  imageCount: number
  imageNames: string[]
  attributes: Omit<ExtractedAttribute, "decision">[]
  unresolvedAttributes: UnresolvedAttribute[]
}

// ProductExtractionResult: product-level frontend state (one result for the whole product,
// not one per image). Replaces the old per-image ExtractionResult / aiExtractions Record.
export type ProductExtractionResult = {
  category: string
  brickCode?: string
  brickName?: string
  imageCount: number
  imageNames: string[]
  attributes: ExtractedAttribute[]
  unresolvedAttributes: UnresolvedAttribute[]
  status: "idle" | "extracting" | "complete" | "error"
  error?: string
}

// ── Per-image AI suggestions (Task 5) ──
// Suggestion state per image: the values the AI proposed for that image's detail fields plus a
// per-field review status. Suggested values are written straight into attributesByImage (the
// field is technically filled) but render in an unconfirmed "suggested" style until the user
// accepts them (or edits them, which drops the AI provenance).
// The key union mirrors PER_SHOT_KEYS in step-two-form.tsx (kept structural to avoid a
// cross-file coupling); clippingPath is never suggested but is in the union so callers can
// pass any image-detail key through unchanged.
export type ShotSuggestionField = "orientation" | "facing" | "angle" | "clippingPath" | "imageDescription" | "imageStyle"
export type ShotFieldStatus = "suggested" | "accepted" | "rejected"
export type ShotSuggestionEntry = {
  values: Partial<Record<ShotSuggestionField, string>>
  confidences: Partial<Record<ShotSuggestionField, number>>
  fieldStatus: Partial<Record<ShotSuggestionField, ShotFieldStatus>>
  loading: boolean
  error: string | null
}
export type ShotSuggestionState = { [imageIndex: number]: ShotSuggestionEntry }

// The product-wide + per-shot attribute record shape (matches StepTwoFormProps["currentAttrs"]
// in step-two-form.tsx). Duplicated here as a plain structural type to avoid a cross-file
// coupling for what is just a flat string record.
  export type AttributesRecord = {
  imageType: string; purpose: string; orientation: string; locationType: string;
  externalLocation: string; imageStyle: string; facing: string; angle: string;
  clippingPath: string; imageDescription: string;
  }

type UseAiAttributesParams = {
  uploadedFiles: UploadedFile[]
  // Default/fallback attribute record — acceptShotSuggestions seeds a per-image record from
  // this when the image has no per-shot record yet.
  attributes: AttributesRecord
  setAttributesByImage: React.Dispatch<React.SetStateAction<{ [key: number]: AttributesRecord }>>
  // Narrow slice of the wizard's auto-populated product context — only what classification's
  // keyword heuristics and the AI prompts need.
  getAutoPopulatedData: () => { description: string; productDescription: string }
}

// All AI/classification state and handlers for the wizard's Step 2 AI section (P0.1a/P0.2b/P1.1):
// brick classification (AI proposes, human confirms), extended-attribute extraction (product-
// level, brick-scoped), and per-shot suggestion (orientation/facing/angle/description, GDSN
// fields — deliberately independent of classification, see confirmClassification below).
export function useAiAttributes({ uploadedFiles, attributes, setAttributesByImage, getAutoPopulatedData }: UseAiAttributesParams) {
  // ── AI Extended-Attribute extraction (Step 2 sub-section, Gemini-backed) ──
  // Selected product category for extraction
  const [aiCategory, setAiCategory] = useState<string>("")
  // Selected GPC brick (leaf classification) within the category. Extraction is brick-scoped:
  // only this brick's attributes are ever suggested. Null until a brick is chosen.
  const [aiBrick, setAiBrick] = useState<Brick | null>(null)
  // Product-level extraction result (one consolidated result for all uploaded images).
  const [aiExtraction, setAiExtraction] = useState<ProductExtractionResult | null>(null)
  // The suggestion row currently being inline-edited (null = none), scoped by index only
  const [aiEditing, setAiEditing] = useState<{ index: number } | null>(null)
  // ── Per-image AI suggestions (Task 5) — orientation/facing/angle/description per image,
  // keyed by image index. Suggested values pre-fill the image's record but stay flagged
  // "suggested" until reviewed. ──
  const [shotSuggestions, setShotSuggestions] = useState<ShotSuggestionState>({})
  // ── Brick classification (P1.1) — AI proposes a brick from the images; the human confirms
  // or corrects via the manual pickers. Confirming (either way) auto-runs extraction only —
  // per-shot suggestion is a separate, independent action (see below). ──
  const [classificationStatus, setClassificationStatus] = useState<"idle" | "loading" | "proposed" | "confirmed" | "error" | "inconsistent">("idle")
  const [classificationConfidence, setClassificationConfidence] = useState<number | null>(null)
  const [classificationError, setClassificationError] = useState<string | null>(null)
  // Set when the images look like they show different products — an automated second line of
  // defense behind the same-product gate (which is just a human self-report). The image(s)
  // Gemini flagged as not matching the majority, and its short explanation. Resolved by picking
  // one image as the primary reference (see confirmPrimaryImage) or navigating back to re-upload.
  const [classificationOutliers, setClassificationOutliers] = useState<string[] | null>(null)
  const [classificationNote, setClassificationNote] = useState<string | null>(null)
  // Manual category/brick correction panel — hidden by default; "Set manually" / "Change" reveal it.
  const [showManualClassify, setShowManualClassify] = useState(false)

  // Fetch the FULL CSV-derived allowed options for the selected category from the server.
  // Only one category's options are ever sent to the client (never the whole CSV). SWR caches
  // per category, so switching back and forth is instant. Used for edit dropdowns.
  const { data: optionsData } = useSWR<AttributeOptionsResponse>(
    aiCategory ? `/api/attribute-options?category=${encodeURIComponent(aiCategory)}` : null,
    (url: string) => fetch(url).then(r => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  )
  const categoryOptions: CategoryOptions = optionsData?.options ?? []

  // Allowed values for a Code List within the currently-loaded category options (full CSV set).
  const valuesForCodeList = (codeListName: string) =>
    categoryOptions.find(o => o.codeListName === codeListName)?.values ?? []

  // ── AI extraction handlers (Gemini-backed) ──
  // bricksForCategory derives from aiCategory for the manual-correction Selects. Every path
  // that sets aiCategory (classification, the category Select, product change) already
  // resolves aiBrick explicitly itself — no reactive effect here, since one previously stomped
  // on a just-set classification brick by resetting it back to null on the same category change.
  const bricksForCategory = aiCategory ? getCategoryBricks(aiCategory) : []

  // Wired to all extract triggers. Accepts optional overrides so a just-confirmed
  // classification can be passed directly, rather than read back from aiCategory/aiBrick
  // state in the same synchronous tick they were set in (a stale-closure trap — React
  // doesn't re-render mid-handler).
  const runExtraction = (overrideCategory?: string, overrideBrick?: Brick | null) => {
    void runGeminiExtraction(overrideCategory, overrideBrick)
  }

  // Runs brick classification (P1.1): proposes a category+brick from the images (via
  // /api/suggest-brick) so the human confirms/corrects instead of picking blind from
  // dropdowns first. Only ever reaches "proposed" on success — nothing is applied until
  // confirmClassification runs. No product description is sent (image-only judgment, and the
  // human already self-reports "same product" via the upload UI's gate); the consistency check
  // below is a second, automated line of defense that compares the images to each other.
  const runClassification = async (filesOverride?: UploadedFile[]) => {
    const files = filesOverride ?? uploadedFiles
    if (files.length === 0) return
    setClassificationStatus("loading")
    setClassificationError(null)
    setClassificationOutliers(null)
    setClassificationNote(null)

    try {
      const images = await Promise.all(
        files.map(async (f) => ({ fileName: f.name, imageBase64: await fileToBase64(f.file), mimeType: f.type }))
      )
      const res = await fetch("/api/suggest-brick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error || `Classification failed (${res.status}).`)
      }
      const data = await res.json() as {
        category: string; brickCode: string; brickName: string; confidence: number
        consistent?: boolean; outlierImages?: string[]; note?: string
      }
      // A single image has nothing to be inconsistent with — only act on the signal for 2+.
      if (files.length > 1 && data.consistent === false) {
        setClassificationOutliers(Array.isArray(data.outlierImages) ? data.outlierImages : [])
        setClassificationNote(typeof data.note === "string" ? data.note : null)
        setClassificationStatus("inconsistent")
        return
      }
      const brick = getBrick(data.category, data.brickCode)
      if (!brick) throw new Error("Unknown brick returned.")
      setAiCategory(data.category)
      setAiBrick(brick)
      setClassificationConfidence(data.confidence)
      setClassificationStatus("proposed")
    } catch (err) {
      setClassificationStatus("error")
      setClassificationError(err instanceof Error ? err.message : "Classification failed. You can continue setting attributes manually.")
    }
  }

  // Resolves an "inconsistent images" warning by re-running classification scoped to just the
  // one image the user confirms as the primary product reference. Reuses the same route/prompt
  // unchanged — a single-image request is already a normal case for it.
  const confirmPrimaryImage = (fileIndex: number) => {
    const file = uploadedFiles[fileIndex]
    if (!file) return
    void runClassification([file])
  }

  // Confirms a category+brick (from the proposal chip, or a manual pick) and auto-runs
  // extraction only. Takes explicit values rather than reading aiCategory/aiBrick state, since
  // a manual pick may call this in the same tick it sets that state (stale-closure otherwise).
  const confirmClassification = (category: string, brick: Brick, confidence: number | null = null) => {
    setClassificationConfidence(confidence)
    setClassificationStatus("confirmed")
    setClassificationError(null)
    setClassificationOutliers(null)
    setClassificationNote(null)
    setShowManualClassify(false)
    runExtraction(category, brick)
    // Per-shot suggestion (orientation/facing/angle/description) is a GDSN-field accelerator
    // that never needed a brick — it must NOT be triggered here. It has its own independent
    // trigger in the AI section so it's reachable with zero classification/extraction involved.
  }

  // Convert a File to a raw base64 string (no data: prefix) for the JSON API payload.
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : ""
        const comma = result.indexOf(",")
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      }
      reader.onerror = () => reject(new Error("Failed to read image file."))
      reader.readAsDataURL(file)
    })

  // Real Gemini extraction: all uploaded images are sent together in one request,
  // producing one consolidated product-level attribute set.
  // Brick is optional — extraction can suggest from all category attributes.
  const runGeminiExtraction = async (overrideCategory?: string, overrideBrick?: Brick | null) => {
    const category = overrideCategory ?? aiCategory
    const brick = overrideBrick ?? aiBrick
    if (!category || uploadedFiles.length === 0) return
    const targets = uploadedFiles.map(f => ({ name: f.name, file: f.file, type: f.type }))
    setAiEditing(null)
    setAiExtraction({
      category,
      brickCode: brick.code,
      brickName: brick.name,
      imageCount: targets.length,
      imageNames: targets.map(f => f.name),
      attributes: [],
      unresolvedAttributes: [],
      status: "extracting",
    })

    try {
      // Convert all files to base64 in parallel
      const images = await Promise.all(
        targets.map(async (f) => ({
          fileName: f.name,
          imageBase64: await fileToBase64(f.file),
          mimeType: f.type,
        }))
      )

      const res = await fetch("/api/extract-attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, ...(brick && { brick: brick.code }), images }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error || `Extraction failed (${res.status}).`)
      }

      const data = await res.json() as ExtractionApiResponse
      setAiExtraction({
        category: typeof data.category === "string" ? data.category : category,
        brickCode: typeof data.brickCode === "string" ? data.brickCode : brick.code,
        brickName: typeof data.brickName === "string" ? data.brickName : brick.name,
        imageCount: typeof data.imageCount === "number" ? data.imageCount : targets.length,
        imageNames: Array.isArray(data.imageNames) ? data.imageNames : targets.map(f => f.name),
        attributes: (Array.isArray(data.attributes) ? data.attributes : []).map(a => ({ ...a, decision: "pending" as const })),
        unresolvedAttributes: Array.isArray(data.unresolvedAttributes) ? data.unresolvedAttributes : [],
        status: "complete",
      })
    } catch (err) {
      setAiExtraction({
        category,
        brickCode: brick.code,
        brickName: brick.name,
        imageCount: targets.length,
        imageNames: targets.map(f => f.name),
        attributes: [],
        unresolvedAttributes: [],
        status: "error",
        error: err instanceof Error ? err.message : "Extraction failed. You can continue setting attributes manually.",
      })
    }
  }

  // Set the review decision on a single suggested attribute (explicit Accept / Reject).
  const setAttributeDecision = (index: number, decision: AttributeDecision) => {
    setAiExtraction(prev => {
      if (!prev) return prev
      return { ...prev, attributes: prev.attributes.map((a, i) => i === index ? { ...a, decision } : a) }
    })
  }

  // Edit a single attribute's value or GS1 code (inline Edit). Edited rows stay accepted.
  const updateAttributeField = (index: number, field: "attributeValue" | "code", value: string) => {
    setAiExtraction(prev => {
      if (!prev) return prev
      return { ...prev, attributes: prev.attributes.map((a, i) => i === index ? { ...a, [field]: value } : a) }
    })
  }

  // Select an allowed value for a suggestion from the curated GS1 list; sets value + matching code.
  const selectAttributeValue = (index: number, value: string) => {
    setAiExtraction(prev => {
      if (!prev) return prev
      return {
        ...prev,
        attributes: prev.attributes.map((a, i) => {
          if (i !== index) return a
          const match = valuesForCodeList(a.codeListName).find(v => v.value === value)
          return { ...a, attributeValue: value, code: match?.code ?? a.code }
        }),
      }
    })
  }

  // Resolve an unresolved attribute by selecting a value from the GS1 options.
  const resolveUnresolvedAttribute = (unresolvedIndex: number, codeListName: string, value: string) => {
    const match = valuesForCodeList(codeListName).find(v => v.value === value)
    if (!match) return
    setAiExtraction(prev => {
      if (!prev) return prev
      return {
        ...prev,
        attributes: [...prev.attributes, {
          codeListName,
          attributeValue: value,
          code: match.code,
          confidence: 1.0,
          reason: "Manually added by user.",
          decision: "accepted" as const,
        }],
        unresolvedAttributes: prev.unresolvedAttributes.filter((_, i) => i !== unresolvedIndex),
      }
    })
  }

  // Clear extraction state when files change, product changes, or category changes.
  const clearExtraction = () => {
    setAiExtraction(null)
    setAiEditing(null)
  }

  // Suggestions are keyed by file index — any deletion/replacement invalidates them.
  const clearShotSuggestions = () => setShotSuggestions({})

  // Runs the suggestion pass for ONE image via /api/suggest-shot-attributes (the route accepts
  // any image array, so a single-image payload needs no server change). On success the values
  // are written into the image's record — filled but flagged "suggested" until reviewed.
  const runShotSuggestionForImage = async (index: number) => {
    const file = uploadedFiles[index]
    if (!file) return
    const blankEntry: ShotSuggestionEntry = { values: {}, confidences: {}, fieldStatus: {}, loading: false, error: null }
    setShotSuggestions(prev => ({
      ...prev,
      [index]: { ...(prev[index] ?? blankEntry), loading: true, error: null },
    }))
    try {
      const imageBase64 = await fileToBase64(file.file)
      const res = await fetch("/api/suggest-shot-attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: [{ fileName: file.name, imageBase64, mimeType: file.type }],
          productDescription: getAutoPopulatedData().productDescription,
        }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.error || `Suggestion failed (${res.status}).`)
      }
      const data = await res.json() as { suggestions: { fileName: string; orientation: string; facing: string; angle: string; imageStyle: string; confidences?: Partial<Record<string, number>> }[] }
      const s = Array.isArray(data.suggestions) ? data.suggestions.find(x => x.fileName === file.name) : undefined
      if (!s) throw new Error("AI could not read this image — set its details manually.")
      const values: ShotSuggestionEntry["values"] = {}
      if (s.orientation) values.orientation = s.orientation
      if (s.facing) values.facing = s.facing
      if (s.angle) values.angle = s.angle
      if (s.imageStyle) values.imageStyle = s.imageStyle
      const fieldStatus: ShotSuggestionEntry["fieldStatus"] = {}
      const confidences: ShotSuggestionEntry["confidences"] = {}
      ;(Object.keys(values) as ShotSuggestionField[]).forEach(k => {
        fieldStatus[k] = "suggested"
        confidences[k] = typeof s.confidences?.[k] === "number" ? s.confidences[k] : 0.5
      })
      setAttributesByImage(prev => {
        const rec = { ...(prev[index] ?? attributes) }
        ;(Object.keys(values) as ShotSuggestionField[]).forEach(k => { rec[k] = values[k]! })
        return { ...prev, [index]: rec }
      })
      setShotSuggestions(prev => ({ ...prev, [index]: { values, confidences, fieldStatus, loading: false, error: null } }))
    } catch (err) {
      setShotSuggestions(prev => ({
        ...prev,
        [index]: {
          values: {}, confidences: {}, fieldStatus: {},
          loading: false,
          error: err instanceof Error ? err.message : "Suggestion failed. You can enter image details manually.",
        },
      }))
    }
  }

  // Global "Apply all AI suggestions": parallel individual calls, one per image. Per-image
  // loading/error lands in the same per-index state, so one failed image never blocks the rest.
  const runAllShotSuggestions = async () => {
    await Promise.allSettled(uploadedFiles.map((_, i) => runShotSuggestionForImage(i)))
  }

  // Confirm one suggested field (review-table Confirm). Toggles: confirming an already-
  // accepted row reverts it to "suggested"; confirming a rejected row restores the AI value
  // (it was cleared on reject) and accepts it.
  const acceptShotField = (index: number, field: ShotSuggestionField) => {
    setShotSuggestions(prev => {
      const entry = prev[index]
      const status = entry?.fieldStatus[field]
      if (!entry || !status) return prev
      if (status === "rejected") {
        const restored = entry.values[field]
        if (restored !== undefined) {
          setAttributesByImage(p => {
            const rec = { ...(p[index] ?? attributes) }
            rec[field] = restored
            return { ...p, [index]: rec }
          })
        }
        return { ...prev, [index]: { ...entry, fieldStatus: { ...entry.fieldStatus, [field]: "accepted" } } }
      }
      const next: ShotFieldStatus = status === "suggested" ? "accepted" : "suggested"
      return { ...prev, [index]: { ...entry, fieldStatus: { ...entry.fieldStatus, [field]: next } } }
    })
  }

  // Reject one suggested field (review-table Reject): clears the value from the image's
  // record so the rejected suggestion is never submitted. Rejecting again undoes it —
  // the AI value is restored and the field returns to "suggested".
  const rejectShotField = (index: number, field: ShotSuggestionField) => {
    setShotSuggestions(prev => {
      const entry = prev[index]
      const status = entry?.fieldStatus[field]
      if (!entry || !status) return prev
      if (status === "rejected") {
        const restored = entry.values[field]
        if (restored !== undefined) {
          setAttributesByImage(p => {
            const rec = { ...(p[index] ?? attributes) }
            rec[field] = restored
            return { ...p, [index]: rec }
          })
        }
        return { ...prev, [index]: { ...entry, fieldStatus: { ...entry.fieldStatus, [field]: "suggested" } } }
      }
      setAttributesByImage(p => {
        const rec = { ...(p[index] ?? attributes) }
        rec[field] = ""
        return { ...p, [index]: rec }
      })
      return { ...prev, [index]: { ...entry, fieldStatus: { ...entry.fieldStatus, [field]: "rejected" } } }
    })
  }

  // Commit an edited value from the review table: the new value is a human decision, so the
  // row lands as "accepted" (unlike a manual form edit, which drops the row via
  // overrideShotField).
  const editShotField = (index: number, field: ShotSuggestionField, value: string) => {
    setAttributesByImage(prev => {
      const rec = { ...(prev[index] ?? attributes) }
      rec[field] = value
      return { ...prev, [index]: rec }
    })
    setShotSuggestions(prev => {
      const entry = prev[index]
      if (!entry || !entry.fieldStatus[field]) return prev
      return { ...prev, [index]: { ...entry, fieldStatus: { ...entry.fieldStatus, [field]: "accepted" } } }
    })
  }

  // Accept every still-suggested field across ALL images in one click (Stage 2 button).
  const acceptAllShotSuggestions = () => {
    setShotSuggestions(prev => {
      const next = { ...prev }
      ;(Object.keys(next) as unknown as number[]).forEach(idx => {
        const entry = next[idx]
        if (!entry) return
        const fieldStatus = { ...entry.fieldStatus }
        ;(Object.keys(fieldStatus) as ShotSuggestionField[]).forEach(k => {
          if (fieldStatus[k] === "suggested") fieldStatus[k] = "accepted"
        })
        next[idx] = { ...entry, fieldStatus }
      })
      return next
    })
  }

  // Accept every still-suggested field on one image in one click.
  const acceptShotImage = (index: number) => {
    setShotSuggestions(prev => {
      const entry = prev[index]
      if (!entry) return prev
      const fieldStatus = { ...entry.fieldStatus }
      ;(Object.keys(fieldStatus) as ShotSuggestionField[]).forEach(k => {
        if (fieldStatus[k] === "suggested") fieldStatus[k] = "accepted"
      })
      return { ...prev, [index]: { ...entry, fieldStatus } }
    })
  }

  // A manual edit replaces the AI's value — drop the field's suggestion status (and its tag).
  const overrideShotField = (index: number, field: ShotSuggestionField) => {
    setShotSuggestions(prev => {
      const entry = prev[index]
      if (!entry || !(field in entry.fieldStatus)) return prev
      const fieldStatus = { ...entry.fieldStatus }
      delete fieldStatus[field]
      return { ...prev, [index]: { ...entry, fieldStatus } }
    })
  }

  // Copying values onto an image (copy-from-image / apply-to-all) makes them manual — drop
  // that image's suggestion state entirely.
  const clearShotSuggestionEntry = (index: number) => {
    setShotSuggestions(prev => {
      if (!(index in prev)) return prev
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  // Any field on this image still awaiting review? Drives the filmstrip sparkle dot.
  const hasUnreviewedSuggestion = (index: number) =>
    Object.values(shotSuggestions[index]?.fieldStatus ?? {}).some(s => s === "suggested")

  const anyShotSuggestLoading = Object.values(shotSuggestions).some(e => e.loading)

  // Suggested-but-unreviewed field count across every image — drives the wizard header
  // button label and the Step 3 warning.
  const pendingShotFieldCount = Object.values(shotSuggestions).reduce(
    (sum, e) => sum + Object.values(e.fieldStatus).filter(s => s === "suggested").length,
    0,
  )

  // Derived status flags from the single product-level extraction result
  const isExtracting = aiExtraction?.status === "extracting"
  const isComplete = aiExtraction?.status === "complete"
  const isError = aiExtraction?.status === "error"
  const hasExtraction = aiExtraction !== null
  // Accepted suggestions at the product level (only explicit Accept clicks count)
  const acceptedExtractedAttributes = aiExtraction?.attributes.filter(a => a.decision === "accepted") ?? []
  // Suggestions still awaiting a decision — these are silently dropped at submission
  // unless accepted, so both the results card and Step 3 surface the count (P0.3).
  const pendingExtractedCount = isComplete ? (aiExtraction?.attributes.filter(a => a.decision === "pending").length ?? 0) : 0

  // Accept every still-pending suggestion in one click.
  const acceptAllPending = () => {
    setAiExtraction(prev => {
      if (!prev) return prev
      return { ...prev, attributes: prev.attributes.map(a => a.decision === "pending" ? { ...a, decision: "accepted" as const } : a) }
    })
  }

  return {
    aiCategory, setAiCategory, aiBrick, setAiBrick,
    aiExtraction, aiEditing, setAiEditing, shotSuggestions,
    classificationStatus, setClassificationStatus, classificationConfidence, setClassificationConfidence, classificationError,
    classificationOutliers, classificationNote,
    showManualClassify, setShowManualClassify,
    categoryOptions, valuesForCodeList, bricksForCategory,
    runExtraction, runClassification, confirmClassification, confirmPrimaryImage,
    setAttributeDecision, updateAttributeField, selectAttributeValue, resolveUnresolvedAttribute,
    clearExtraction, clearShotSuggestions,
    runShotSuggestionForImage, runAllShotSuggestions, acceptShotField, rejectShotField, editShotField, acceptShotImage, acceptAllShotSuggestions,
    overrideShotField, clearShotSuggestionEntry, hasUnreviewedSuggestion, anyShotSuggestLoading, pendingShotFieldCount,
    isExtracting, isComplete, isError, hasExtraction, acceptedExtractedAttributes, pendingExtractedCount, acceptAllPending,
  }
}
