"use client"

import { useState } from "react"
import useSWR from "swr"
import type { CategoryOptions, AttributeDecision, ExtractedAttribute, UnresolvedAttribute } from "@/lib/gs1/types"
import { buildMockExtraction } from "@/lib/gs1/mock-scenarios"
import { getCategoryBricks, getBrick, type Brick } from "@/lib/gs1/generated-bricks"
import { ORIENTATION_OPTIONS } from "./attribute-options"
import type { UploadedFile } from "./uploaded-file"

// Extraction mode: "mock" (default, stable demos) or "gemini" (real /api/extract-attributes).
// Controlled by NEXT_PUBLIC_EXTRACTION_MODE; falls back to mock when unset. No UI toggle.
export const EXTRACTION_MODE = process.env.NEXT_PUBLIC_EXTRACTION_MODE === "gemini" ? "gemini" : "mock"

// Product categories offered in the AI extraction card. Home is excluded — it has no GPC brick
// coverage in the brick matrix, so its attributes cannot be scoped to a single brick.
export const PRODUCT_CATEGORIES = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty"] as const

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
  fallbackUsed?: boolean
}

// ── Per-shot AI suggestions (P0.2b) ──
// One proposal per image for the fields a vision model reads directly from the shot.
export type ShotSuggestionRow = {
  fileIndex: number
  fileName: string
  orientation: string
  facing: string
  angle: string
  description: string
  confidence: number
  status: "pending" | "accepted" | "dismissed"
}

// Mock proposal from filename tokens (deterministic, demo-stable). Mirrors what the
// Gemini route infers from pixels; falls back to a round-robin viewpoint.
function mockShotSuggestion(name: string, index: number, productDescription: string) {
  const n = name.toLowerCase()
  let orientation = ["PRI", "SDL", "SDR"][index % 3]
  let facing = ["1", "2", "8"][index % 3]
  let confidence = 0.6
  if (/front|hero|main|primary/.test(n)) { orientation = "PRI"; facing = "1"; confidence = 0.92 }
  else if (/left/.test(n)) { orientation = "SDL"; facing = "2"; confidence = 0.9 }
  else if (/side/.test(n)) { orientation = "SDL"; facing = "2"; confidence = 0.85 }
  else if (/right/.test(n)) { orientation = "SDR"; facing = "8"; confidence = 0.9 }
  else if (/back|rear/.test(n)) { orientation = "VBK"; facing = "7"; confidence = 0.9 }
  else if (/top/.test(n)) { orientation = "VIT"; facing = "3"; confidence = 0.87 }
  else if (/bottom|sole/.test(n)) { orientation = "VIB"; facing = "9"; confidence = 0.87 }
  const label = ORIENTATION_OPTIONS.find(o => o.value === orientation)?.label ?? orientation
  const view = label.includes("-") ? label.split("-").slice(1).join("-") : label
  return {
    orientation,
    facing,
    angle: "1",
    description: productDescription ? `${productDescription} — ${view.toLowerCase()} view` : `${view} view`,
    confidence,
  }
}

// Mock brick classification (P1.1): keyword-matches brick names against the product
// description/filenames within the given category; falls back to the category's first
// brick. Deterministic and demo-stable, same style as mockShotSuggestion above.
function mockClassifyBrick(category: string, productDescription: string, fileNames: string[]): { brick: Brick; confidence: number } | null {
  const bricks = getCategoryBricks(category)
  if (bricks.length === 0) return null
  const hay = `${productDescription} ${fileNames.join(" ")}`.toLowerCase()
  const matched = bricks.find(b => hay.includes(b.name.toLowerCase()))
  return matched ? { brick: matched, confidence: 0.88 } : { brick: bricks[0], confidence: 0.62 }
}

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
  // ── AI Extended-Attribute extraction (Step 2 sub-section, mock-first) ──
  // Selected product category for extraction
  const [aiCategory, setAiCategory] = useState<string>("")
  // Selected GPC brick (leaf classification) within the category. Extraction is brick-scoped:
  // only this brick's attributes are ever suggested. Null until a brick is chosen.
  const [aiBrick, setAiBrick] = useState<Brick | null>(null)
  // Product-level extraction result (one consolidated result for all uploaded images).
  const [aiExtraction, setAiExtraction] = useState<ProductExtractionResult | null>(null)
  // The suggestion row currently being inline-edited (null = none), scoped by index only
  const [aiEditing, setAiEditing] = useState<{ index: number } | null>(null)
  // ── Per-shot AI suggestions (P0.2b) — proposes orientation/facing/angle/description per
  // image. Strictly optional: nothing is applied without an explicit Accept. ──
  const [shotSuggestions, setShotSuggestions] = useState<ShotSuggestionRow[] | null>(null)
  const [shotSuggestLoading, setShotSuggestLoading] = useState(false)
  // ── Brick classification (P1.1) — AI proposes a brick from the images; the human confirms
  // or corrects via the manual pickers. Confirming (either way) auto-runs extraction only —
  // per-shot suggestion is a separate, independent action (see below). ──
  const [classificationStatus, setClassificationStatus] = useState<"idle" | "loading" | "proposed" | "confirmed">("idle")
  const [classificationConfidence, setClassificationConfidence] = useState<number | null>(null)
  // Manual category/brick correction panel — hidden by default; "Set manually" / "Change" reveal it.
  const [showManualClassify, setShowManualClassify] = useState(false)

  // Fetch the FULL CSV-derived allowed options for the selected category from the server.
  // Only one category's options are ever sent to the client (never the whole CSV). SWR caches
  // per category, so switching back and forth is instant. Used for edit dropdowns + mock grounding.
  const { data: optionsData } = useSWR<AttributeOptionsResponse>(
    aiCategory ? `/api/attribute-options?category=${encodeURIComponent(aiCategory)}` : null,
    (url: string) => fetch(url).then(r => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 60_000 },
  )
  const categoryOptions: CategoryOptions = optionsData?.options ?? []

  // Allowed values for a Code List within the currently-loaded category options (full CSV set).
  const valuesForCodeList = (codeListName: string) =>
    categoryOptions.find(o => o.codeListName === codeListName)?.values ?? []

  // Direct fetch fallback used by mock mode when SWR hasn't populated yet (e.g. immediate click).
  const fetchCategoryOptions = async (category: string): Promise<CategoryOptions> => {
    try {
      const res = await fetch(`/api/attribute-options?category=${encodeURIComponent(category)}`)
      if (!res.ok) return []
      const data = (await res.json()) as AttributeOptionsResponse
      return Array.isArray(data.options) ? data.options : []
    } catch {
      return []
    }
  }

  // ── AI extraction handlers (mock-first) ──
  // Default category heuristic from the current product/selection-code context (item #3).
  // Not permanent — the user can still change the category manually.
  const getDefaultCategory = () => {
    const d = getAutoPopulatedData()
    const hay = `${d.description} ${d.productDescription}`.toLowerCase()
    if (/tops|dress|shirt|apparel|clothing/.test(hay)) return "Apparel"
    return "Shoes"
  }

  // bricksForCategory derives from aiCategory for the manual-correction Selects. Every path
  // that sets aiCategory (classification, the category Select, product change) already
  // resolves aiBrick explicitly itself — no reactive effect here, since one previously stomped
  // on a just-set classification brick by resetting it back to null on the same category change.
  const bricksForCategory = aiCategory ? getCategoryBricks(aiCategory) : []

  // Dispatcher: routes to Gemini or mock based on EXTRACTION_MODE. Wired to all extract triggers.
  // Accepts optional overrides so a just-confirmed classification can be passed directly,
  // rather than read back from aiCategory/aiBrick state in the same synchronous tick they
  // were set in (a stale-closure trap — React doesn't re-render mid-handler).
  const runExtraction = (overrideCategory?: string, overrideBrick?: Brick | null) => {
    if (EXTRACTION_MODE === "gemini") {
      void runGeminiExtraction(overrideCategory, overrideBrick)
    } else {
      void runMockExtraction(overrideCategory, overrideBrick)
    }
  }

  // Runs brick classification (P1.1): proposes a category+brick from the images so the
  // human confirms/corrects instead of picking blind from dropdowns first. Gemini mode calls
  // /api/suggest-brick; mock mode uses the deterministic keyword heuristic. Either way this
  // only ever reaches "proposed" — nothing is applied until confirmClassification runs.
  const runClassification = async () => {
    if (uploadedFiles.length === 0) return
    setClassificationStatus("loading")
    const productDescription = getAutoPopulatedData().productDescription
    const guessCategory = getDefaultCategory()

    if (EXTRACTION_MODE === "gemini") {
      try {
        const images = await Promise.all(
          uploadedFiles.map(async (f) => ({ fileName: f.name, imageBase64: await fileToBase64(f.file), mimeType: f.type }))
        )
        const res = await fetch("/api/suggest-brick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images, productDescription }),
        })
        if (!res.ok) throw new Error(`Classification failed (${res.status}).`)
        const data = await res.json() as { category: string; brickCode: string; brickName: string; confidence: number }
        const brick = getBrick(data.category, data.brickCode)
        if (!brick) throw new Error("Unknown brick returned.")
        setAiCategory(data.category)
        setAiBrick(brick)
        setClassificationConfidence(data.confidence)
        setClassificationStatus("proposed")
        return
      } catch {
        // Fall through to the mock heuristic so the demo never dead-ends.
      }
    }

    await new Promise(resolve => setTimeout(resolve, 600))
    const mock = mockClassifyBrick(guessCategory, productDescription, uploadedFiles.map(f => f.name))
    if (!mock) {
      // No brick coverage for this category (e.g. Home) — nothing to propose; manual path only.
      setClassificationStatus("idle")
      return
    }
    setAiCategory(guessCategory)
    setAiBrick(mock.brick)
    setClassificationConfidence(mock.confidence)
    setClassificationStatus("proposed")
  }

  // Confirms a category+brick (from the proposal chip, or a manual pick) and auto-runs
  // extraction only. Takes explicit values rather than reading aiCategory/aiBrick state, since
  // a manual pick may call this in the same tick it sets that state (stale-closure otherwise).
  const confirmClassification = (category: string, brick: Brick, confidence: number | null = null) => {
    setClassificationConfidence(confidence)
    setClassificationStatus("confirmed")
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
  const runGeminiExtraction = async (overrideCategory?: string, overrideBrick?: Brick | null) => {
    const category = overrideCategory ?? aiCategory
    const brick = overrideBrick ?? aiBrick
    if (!category || !brick || uploadedFiles.length === 0) return
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
        body: JSON.stringify({ category, brick: brick.code, images }),
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
    } catch {
      // Auto-fallback to mock/demo results when Gemini is unavailable
      const options = categoryOptions.length > 0 ? categoryOptions : await fetchCategoryOptions(category)
      const mock = buildMockExtraction(category, brick, options)
      setAiExtraction({
        category,
        brickCode: brick.code,
        brickName: brick.name,
        imageCount: targets.length,
        imageNames: targets.map(f => f.name),
        attributes: mock.attributes.map(a => ({ ...a, decision: "pending" as const })),
        unresolvedAttributes: mock.unresolvedAttributes,
        status: "complete",
        fallbackUsed: true,
      })
    }
  }

  // Mock extraction: returns one consolidated product-level result (same shape as Gemini mode).
  // Grounds GS1 codes in the same CSV-derived options used by Gemini + dropdowns.
  const runMockExtraction = async (overrideCategory?: string, overrideBrick?: Brick | null) => {
    const category = overrideCategory ?? aiCategory
    const brick = overrideBrick ?? aiBrick
    if (!category || !brick || uploadedFiles.length === 0) return
    const imageNames = uploadedFiles.map(f => f.name)
    setAiEditing(null)
    setAiExtraction({
      category,
      brickCode: brick.code,
      brickName: brick.name,
      imageCount: uploadedFiles.length,
      imageNames,
      attributes: [],
      unresolvedAttributes: [],
      status: "extracting",
    })
    // Ensure options are available (SWR cache, else direct fetch) so mock codes stay grounded.
    const options = categoryOptions.length > 0 ? categoryOptions : await fetchCategoryOptions(category)
    // Brief delay to simulate processing latency for a realistic demo feel.
    await new Promise(resolve => setTimeout(resolve, 900))
    const mock = buildMockExtraction(category, brick, options)
    setAiExtraction({
      category,
      brickCode: brick.code,
      brickName: brick.name,
      imageCount: uploadedFiles.length,
      imageNames,
      attributes: mock.attributes.map(a => ({ ...a, decision: "pending" as const })),
      unresolvedAttributes: mock.unresolvedAttributes,
      status: "complete",
    })
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

  // Per-shot suggestions are keyed by file index — any deletion/replacement invalidates them.
  const clearShotSuggestions = () => setShotSuggestions(null)

  // Runs the per-shot suggestion pass: Gemini route when configured, else the mock
  // filename heuristic. Optional accelerator only — nothing applies without Accept.
  const runShotSuggestions = async () => {
    if (uploadedFiles.length === 0) return
    setShotSuggestLoading(true)
    const productDescription = getAutoPopulatedData().productDescription
    if (EXTRACTION_MODE === "gemini") {
      try {
        const images = await Promise.all(
          uploadedFiles.map(async (f) => ({ fileName: f.name, imageBase64: await fileToBase64(f.file), mimeType: f.type }))
        )
        const res = await fetch("/api/suggest-shot-attributes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images, productDescription }),
        })
        if (!res.ok) throw new Error(`Suggestion failed (${res.status}).`)
        const data = await res.json() as { suggestions: { fileName: string; orientation: string; facing: string; angle: string; description: string; confidence: number }[] }
        const rows: ShotSuggestionRow[] = []
        uploadedFiles.forEach((f, i) => {
          const s = Array.isArray(data.suggestions) ? data.suggestions.find(x => x.fileName === f.name) : undefined
          if (s) rows.push({ fileIndex: i, fileName: f.name, orientation: s.orientation, facing: s.facing, angle: s.angle, description: s.description, confidence: s.confidence, status: "pending" })
        })
        setShotSuggestions(rows)
        setShotSuggestLoading(false)
        return
      } catch {
        // Fall through to the mock heuristic so the demo never dead-ends.
      }
    }
    await new Promise(resolve => setTimeout(resolve, 600))
    setShotSuggestions(uploadedFiles.map((f, i) => ({
      fileIndex: i,
      fileName: f.name,
      ...mockShotSuggestion(f.name, i, productDescription),
      status: "pending" as const,
    })))
    setShotSuggestLoading(false)
  }

  // Accept one or many per-shot suggestions: writes into the per-image records.
  const acceptShotSuggestions = (rows: ShotSuggestionRow[]) => {
    setAttributesByImage(prev => {
      const next = { ...prev }
      rows.forEach(r => {
        const rec = { ...(next[r.fileIndex] ?? attributes) }
        rec.orientation = r.orientation
        if (r.facing) rec.facing = r.facing
        if (r.angle) rec.angle = r.angle
        if (r.description) rec.imageDescription = r.description
        next[r.fileIndex] = rec
      })
      return next
    })
    const accepted = new Set(rows.map(r => r.fileIndex))
    setShotSuggestions(prev => prev ? prev.map(p => accepted.has(p.fileIndex) ? { ...p, status: "accepted" as const } : p) : prev)
  }

  const dismissShotSuggestion = (fileIndex: number) => {
    setShotSuggestions(prev => prev ? prev.map(p => p.fileIndex === fileIndex ? { ...p, status: "dismissed" as const } : p) : prev)
  }

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
    aiExtraction, aiEditing, setAiEditing, shotSuggestions, shotSuggestLoading,
    classificationStatus, setClassificationStatus, classificationConfidence, setClassificationConfidence,
    showManualClassify, setShowManualClassify,
    categoryOptions, valuesForCodeList, bricksForCategory,
    runExtraction, runClassification, confirmClassification,
    setAttributeDecision, updateAttributeField, selectAttributeValue, resolveUnresolvedAttribute,
    clearExtraction, clearShotSuggestions, runShotSuggestions, acceptShotSuggestions, dismissShotSuggestion,
    isExtracting, isComplete, isError, hasExtraction, acceptedExtractedAttributes, pendingExtractedCount, acceptAllPending,
  }
}
