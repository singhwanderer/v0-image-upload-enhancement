"use client"

import { useState, useCallback, useEffect } from "react"
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check,
  Trash2,
  FileImage,
  Download,
  Package,
  FileText,
  CheckCircle2,
  Info,
  Pencil,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { validateImageBatch, type ValidationError } from "./upload-validation"
import { measureImageFile, type MeasuredImageMetadata } from "./image-metadata"
import { buildImageMetadataCsv, downloadCsv, csvPreview, type ImageMetadataRow } from "./metadata-csv"
import { toast } from "@/hooks/use-toast"
import useSWR from "swr"
import type { CategoryOptions, AttributeDecision, ExtractedAttribute, UnresolvedAttribute } from "@/lib/gs1/types"
import { buildMockExtraction } from "@/lib/gs1/mock-scenarios"
import { getCategoryBricks, type Brick } from "@/lib/gs1/generated-bricks"
import { useMediaSelection } from "./use-media-selection"
import { AiAttributesTable } from "./ai-attributes-table"

// Response shape from GET /api/attribute-options (declared locally so this client component
// never imports server route code). Mirrors AttributeOptionsResponse in that route.
type AttributeOptionsResponse = { category: string; options: CategoryOptions }

interface ImageUploadWizardProps {
  uploadLevel: "product" | "product-color" | "gtin"
  setUploadLevel: (level: "product" | "product-color" | "gtin") => void
  onCancel: () => void
  onComplete: () => void
  portalType?: "supplier" | "retailer"
}

// Mock data with multiple GTINs per product and 3-digit color codes
const MOCK_DATA = {
  selectionCodes: [
    { code: "001", description: "Apparel / Dresses" },
    { code: "002", description: "Apparel / Tops" },
    { code: "003", description: "Apparel / Denim" },
    { code: "004", description: "Footwear" },
    { code: "005", description: "Bags" },
    { code: "006", description: "Jewelry" },
    { code: "007", description: "Beauty" },
    { code: "008", description: "Home" },
  ],
  products: [
    {
      id: "DRESS001",
      description: "Summer Floral Dress",
      gtins: [
        { gtin: "00123456789001", type: "UA" },
        { gtin: "00123456789011", type: "EA" },
      ],
    },
    {
      id: "TOP001",
      description: "Cotton Blouse",
      gtins: [
        { gtin: "00123456789002", type: "UA" },
        { gtin: "00123456789012", type: "EA" },
      ],
    },
    {
      id: "DENIM001",
      description: "Classic Denim Jacket",
      gtins: [
        { gtin: "00123456789003", type: "UA" },
        { gtin: "00123456789013", type: "EA" },
        { gtin: "00123456789023", type: "CS" },
      ],
    },
    {
      id: "SHOE001",
      description: "Low-Top Running Sneaker",
      gtins: [
        { gtin: "00123456789004", type: "UA" },
        { gtin: "00123456789014", type: "EA" },
        { gtin: "00123456789024", type: "CS" },
        { gtin: "00123456789034", type: "PK" },
      ],
    },
    {
      id: "BAG001",
      description: "Leather Crossbody Bag",
      gtins: [
        { gtin: "00123456789005", type: "UA" },
        { gtin: "00123456789015", type: "EA" },
      ],
    },
    {
      id: "JEWEL001",
      description: "Gold Hoop Earrings",
      gtins: [
        { gtin: "00123456789006", type: "UA" },
        { gtin: "00123456789016", type: "EA" },
      ],
    },
    {
      id: "BEAUTY001",
      description: "Hydrating Face Serum",
      gtins: [
        { gtin: "00123456789007", type: "UA" },
        { gtin: "00123456789017", type: "EA" },
      ],
    },
    {
      id: "HOME001",
      description: "Cotton Bath Towel",
      gtins: [
        { gtin: "00123456789008", type: "UA" },
        { gtin: "00123456789018", type: "EA" },
      ],
    },
    {
      id: "HOME002",
      description: "Desert Drying Rack",
      gtins: [
        { gtin: "00123456789009", type: "UA" },
      ],
    },
  ],
  // 3-digit color codes as per requirement
  colorCodes: [
    { code: "001", name: "Black" },
    { code: "002", name: "White" },
    { code: "003", name: "Navy Blue" },
    { code: "004", name: "Cardinal Red" },
    { code: "005", name: "Forest Green" },
    { code: "010", name: "Charcoal Grey" },
    { code: "015", name: "Burgundy" },
    { code: "020", name: "Ivory" },
  ],
}

// Dropdown options from screenshots
// Spec code list: PRI, VF1, VIK, VIS, SDL, SDR, VIB, VIT (VBK retained from legacy data).
// VIK/VIS display the bare code until the authoritative GDSN label list is confirmed —
// showing a code is honest; inventing a label would ship wrong data.
const ORIENTATION_OPTIONS = [
  { value: "PRI", label: "PRI-Primary" },
  { value: "VF1", label: "VF1-Front" },
  { value: "VIK", label: "VIK" },
  { value: "VIS", label: "VIS" },
  { value: "SDL", label: "SDL-Side Left" },
  { value: "SDR", label: "SDR-Side Right" },
  { value: "VIB", label: "VIB-Bottom" },
  { value: "VIT", label: "VIT-Top" },
  { value: "VBK", label: "VBK-Back" },
]

const ANGLE_OPTIONS = [
  { value: "1", label: "1-Center, No plunge angle" },
  { value: "2", label: "2-Left, No plunge angle" },
  { value: "3", label: "3-Right, No plunge angle" },
  { value: "7", label: "7-Center, Plunge angle present" },
  { value: "8", label: "8-Left, Plunge angle present" },
  { value: "9", label: "9-Right, Plunge angle present" },
]

const IMAGE_TYPE_OPTIONS = [
  { value: "SI", label: "SI-Still Shot" },
  { value: "LI", label: "LI-Lifestyle Image" },
  { value: "SW", label: "SW-Swatch" },
  { value: "DT", label: "DT-Detail Shot" },
  { value: "PK", label: "PK-Packaging" },
]

const PURPOSE_OPTIONS = [
  { value: "INT", label: "INT-Internet" },
  { value: "CAT", label: "CAT-Catalog" },
  { value: "PRT", label: "PRT-Print" },
  { value: "PKG", label: "PKG-Packaging" },
]

// Spec: ACL, FTP, LMI, URL
const LOCATION_TYPE_OPTIONS = [
  { value: "ACL", label: "ACL" },
  { value: "FTP", label: "FTP" },
  { value: "LMI", label: "LMI" },
  { value: "URL", label: "URL" },
]

// GS1 image-naming facing codes (same 1/2/3/7/8/9 scheme as the angle list below).
const FACING_OPTIONS = [
  { value: "1", label: "1-Front" },
  { value: "2", label: "2-Left" },
  { value: "3", label: "3-Top" },
  { value: "7", label: "7-Back" },
  { value: "8", label: "8-Right" },
  { value: "9", label: "9-Bottom" },
]

// Spec: CSW (Color Swatch) or PRO (Product) only.
const IMAGE_STYLE_OPTIONS = [
  { value: "CSW", label: "CSW-Color Swatch" },
  { value: "PRO", label: "PRO-Product" },
]

type UploadedFile = {
  id: string
  file: File
  name: string
  size: number
  type: string
  preview: string
  status: "uploading" | "complete" | "error"
  // Auto-captured at staging by decoding the file itself (no AI, no manual entry).
  // Absent while measurement is in flight; fields are null when unreadable.
  measured?: MeasuredImageMetadata
}

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
type ProductExtractionResult = {
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

// Product categories offered in the AI extraction card. Home is excluded — it has no GPC brick
// coverage in the brick matrix, so its attributes cannot be scoped to a single brick.
const PRODUCT_CATEGORIES = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty"] as const

// Extraction mode: "mock" (default, stable demos) or "gemini" (real /api/extract-attributes).
// Controlled by NEXT_PUBLIC_EXTRACTION_MODE; falls back to mock when unset. No UI toggle.
const EXTRACTION_MODE = process.env.NEXT_PUBLIC_EXTRACTION_MODE === "gemini" ? "gemini" : "mock"

// ── Per-shot AI suggestions (P0.2b) ──
// One proposal per image for the fields a vision model reads directly from the shot.
type ShotSuggestionRow = {
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

// P0.2a: the attribute record splits into two groups. PRODUCT-WIDE fields hold one honest
// value for every image of a product; PER-SHOT fields describe what makes each photo
// different (which is exactly why they must never be blanket-applied).
const PER_SHOT_KEYS = ["orientation", "facing", "angle", "clippingPath", "imageDescription"] as const
type PerShotKey = (typeof PER_SHOT_KEYS)[number]
const isPerShotKey = (k: string): k is PerShotKey => (PER_SHOT_KEYS as readonly string[]).includes(k)

// Attribute form used in Step 2, the Edit dialog, and Bulk edit (Change 3 / Change 7 / P0.2a)
type StepTwoFormProps = {
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
}

// Read-only summary of a file's decoded dimensions/DPI. undefined = measurement in flight.
function formatMeasured(m?: MeasuredImageMetadata): string {
  if (!m) return "Measuring…"
  const dims = m.width && m.height ? `${m.width} × ${m.height} px` : null
  const dpi = m.dpi ? `${m.dpi} DPI` : null
  if (!dims && !dpi) return "Not readable from file"
  return [dims, dpi].filter(Boolean).join(" · ")
}

function StepTwoForm({ currentAttrs, updateAttrs, uploadLevel, autoData, measuredFiles, onApplyPerShotToAll, hideProductWide }: StepTwoFormProps) {
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Product-wide attributes</span>
            <span className="text-xs text-muted-foreground">apply to every image of this product</span>
          </div>

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

          <div className="border-t border-border" />
        </>
      )}

      {/* Per-shot group: what makes each photo different — never blanket-applied */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Per-shot attributes</span>
        <span className="text-xs text-muted-foreground">describe this specific image</span>
      </div>

      {/* Measured from file — auto-captured by decoding each staged binary (no AI, no typing). */}
      {measuredFiles && measuredFiles.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Measured from file</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">Auto-captured</span>
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
            Dimensions and DPI are read directly from each image file — no manual entry needed.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Orientation <span className="text-destructive">*</span>
          </Label>
          <Select value={currentAttrs.orientation} onValueChange={(v) => updateAttrs({ ...currentAttrs, orientation: v })}>
            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select orientation..." /></SelectTrigger>
            <SelectContent>
              {ORIENTATION_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Facing (GDSN) <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
          <Select value={currentAttrs.facing} onValueChange={(v) => updateAttrs({ ...currentAttrs, facing: v })}>
            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select facing..." /></SelectTrigger>
            <SelectContent>{FACING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Angle <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
          <Select value={currentAttrs.angle} onValueChange={(v) => updateAttrs({ ...currentAttrs, angle: v })}>
            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select angle..." /></SelectTrigger>
            <SelectContent>{ANGLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Clipping Path <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
          <Input value={currentAttrs.clippingPath} onChange={(e) => updateAttrs({ ...currentAttrs, clippingPath: e.target.value })} placeholder="Path name..." className="bg-background" />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label className="text-sm font-medium">Image Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
          <Input value={currentAttrs.imageDescription} onChange={(e) => updateAttrs({ ...currentAttrs, imageDescription: e.target.value })} placeholder="Enter description..." className="bg-background" />
        </div>
      </div>

      {onApplyPerShotToAll && (
        <Button variant="outline" size="sm" className="w-fit" onClick={onApplyPerShotToAll}>
          Apply this image&apos;s per-shot values to all images
        </Button>
      )}
    </div>
  )
}

export function ImageUploadWizard({
  uploadLevel,
  setUploadLevel,
  onCancel,
  onComplete,
  portalType = "supplier",
}: ImageUploadWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSelectionCode, setSelectedSelectionCode] = useState("001")
  const [selectedProduct, setSelectedProduct] = useState("DRESS001")
  const [selectedColorCode, setSelectedColorCode] = useState("")
  const [selectedGtin, setSelectedGtin] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showProductMedia, setShowProductMedia] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadPhase, setDownloadPhase] = useState<"select" | "preparing" | "complete">("select")
  // First lines of the most recently generated metadata CSV, shown in the Complete phase.
  const [lastCsvPreview, setLastCsvPreview] = useState("")
  // Selection state for Product Media cards — drives selective download and (Supplier-only)
  // bulk edit/delete gating.
  const media = useMediaSelection()
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)
  const [bulkEditDialog, setBulkEditDialog] = useState<{
    open: boolean
    draft: typeof attributes
    touched: Partial<Record<keyof typeof attributes, boolean>>
  }>({ open: false, draft: {} as typeof attributes, touched: {} })
  const [showAiAttributesDrawer, setShowAiAttributesDrawer] = useState(false)
  // activeImageIndex removed — supplier product-media uses stacked list (no active selection)
  // Inline validation errors from file drop/browse (Change 1)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  // Submission phase for progress card (Change 4)
  const [submissionPhase, setSubmissionPhase] = useState<"idle" | "uploading" | "complete" | "partial-failure">("idle")
  // Per-file submission status (Change 4)
  const [fileStatuses, setFileStatuses] = useState<{ [id: string]: "queued" | "uploading" | "processing" | "complete" | "failed" }>({})
  // Edit dialog state — unified for attributes + replace image tabs (Task 1)
  const [editAttrDialog, setEditAttrDialog] = useState<{ open: boolean; fileIndex: number; draft: typeof attributes }>({ open: false, fileIndex: 0, draft: {} as typeof attributes })
  // editDialogTab removed — unified modal has no tabs (Task 3)
  // Pending replacement file staged inside the Replace image tab (Task 1)
  const [pendingReplaceFile, setPendingReplaceFile] = useState<File | null>(null)
  // Inline save-confirmed flash shown after saving attributes (Task 2)
  const [editSaveConfirmed, setEditSaveConfirmed] = useState(false)
  // Delete confirmation step inside the unified edit modal (Task 3)
  const [editDeleteConfirm, setEditDeleteConfirm] = useState(false)
  // "Attributes are correct" checkbox shown when a replacement is staged (Task 3)
  const [replacementAttrChecked, setReplacementAttrChecked] = useState(false)
  // Snapshot of attributes at the time the edit dialog was opened — used for dirty-check (Task 3)
  const [editAttrInitial, setEditAttrInitial] = useState<typeof attributes | null>(null)
  // Syndication acknowledgement checkbox in Step 3 — resets on Back (Task 2)
  const [syndicationAcknowledged, setSyndicationAcknowledged] = useState(false)
  // ── AI Extended-Attribute extraction (Step 2 sub-section, mock-first) ──
  // Selected product category for extraction
  const [aiCategory, setAiCategory] = useState<string>("")
  // Selected GPC brick (leaf classification) within the category. Extraction is brick-scoped:
  // only this brick's attributes are ever suggested. Null until a brick is chosen.
  const [aiBrick, setAiBrick] = useState<Brick | null>(null)
  // Whether the user explicitly skipped the AI extraction section
  const [aiSkipped, setAiSkipped] = useState(false)
  // Product-level extraction result (one consolidated result for all uploaded images).
  const [aiExtraction, setAiExtraction] = useState<ProductExtractionResult | null>(null)
  // The suggestion row currently being inline-edited (null = none), scoped by index only
  const [aiEditing, setAiEditing] = useState<{ index: number } | null>(null)
  // ── Per-shot AI suggestions (P0.2b) — proposes orientation/facing/angle/description per
  // image. Strictly optional: nothing is applied without an explicit Accept. ──
  const [shotSuggestions, setShotSuggestions] = useState<ShotSuggestionRow[] | null>(null)
  const [shotSuggestLoading, setShotSuggestLoading] = useState(false)

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
  
  // Form state for attributes
  const [attributes, setAttributes] = useState({
    imageType: "SI",
    purpose: "INT",
    orientation: "",
    locationType: "",
    externalLocation: "",
    imageStyle: "",
    facing: "",
    angle: "",
    clippingPath: "",
    imageDescription: "",
    // pixel density / height / width are NOT attributes: they are per-file facts,
    // auto-captured into UploadedFile.measured at staging (see image-metadata.ts).
  })
  
  // Per-shot attribute records, keyed by image index. Only PER_SHOT_KEYS are meaningful
  // here; product-wide keys always resolve from `attributes` (P0.2a).
  const [attributesByImage, setAttributesByImage] = useState<{ [key: number]: typeof attributes }>({})
  const [activeAttributeImageIndex, setActiveAttributeImageIndex] = useState(0)

  const steps = [
    { number: 1, title: "Target & Files", description: "Select target and upload files" },
    { number: 2, title: "Attributes", description: "Set image attributes" },
    { number: 3, title: "Review & Confirm", description: "Review and submit" },
  ]

  // Effective attributes for one image: product-wide values from `attributes`,
  // per-shot values from that image's own record.
  const effectiveAttrs = (idx: number): typeof attributes => {
    const shot = attributesByImage[idx]
    if (!shot) return attributes
    const merged = { ...attributes }
    PER_SHOT_KEYS.forEach(k => { merged[k] = shot[k] ?? "" })
    return merged
  }

  const getCurrentAttributes = () => effectiveAttrs(activeAttributeImageIndex)

  // Routes edits by key group: per-shot keys write to the active image's record only;
  // everything else is product-wide and writes once for all images.
  const updateCurrentAttributes = (newAttrs: typeof attributes) => {
    const current = getCurrentAttributes()
    const perShotChanged = PER_SHOT_KEYS.some(k => newAttrs[k] !== current[k])
    setAttributes(prev => {
      const next = { ...prev }
      ;(Object.keys(newAttrs) as Array<keyof typeof attributes>).forEach(k => {
        if (!isPerShotKey(k)) next[k] = newAttrs[k]
      })
      return next
    })
    if (perShotChanged) {
      setAttributesByImage(prev => {
        const rec = { ...(prev[activeAttributeImageIndex] ?? attributes) }
        PER_SHOT_KEYS.forEach(k => { rec[k] = newAttrs[k] })
        return { ...prev, [activeAttributeImageIndex]: rec }
      })
    }
  }

  // Explicit copy of the active image's per-shot values onto every image — a labeled,
  // deliberate action, unlike the old silent apply-to-all default.
  const applyPerShotToAll = () => {
    const source = effectiveAttrs(activeAttributeImageIndex)
    setAttributesByImage(prev => {
      const next = { ...prev }
      uploadedFiles.forEach((_, i) => {
        const rec = { ...(next[i] ?? attributes) }
        PER_SHOT_KEYS.forEach(k => { rec[k] = source[k] })
        next[i] = rec
      })
      return next
    })
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

  // Default the category once when the user first reaches Step 2 (only if not already chosen).
  useEffect(() => {
    if (currentStep === 2 && !aiCategory && uploadedFiles.length > 0) {
      setAiCategory(getDefaultCategory())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, uploadedFiles.length])

  // Keep the brick in sync with the category: reset on category change, auto-selecting when the
  // category has exactly one brick (so single-brick categories need no extra click).
  const bricksForCategory = aiCategory ? getCategoryBricks(aiCategory) : []
  useEffect(() => {
    const bricks = aiCategory ? getCategoryBricks(aiCategory) : []
    setAiBrick(bricks.length === 1 ? bricks[0] : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiCategory])

  // Dispatcher: routes to Gemini or mock based on EXTRACTION_MODE. Wired to all extract triggers.
  const runExtraction = () => {
    if (EXTRACTION_MODE === "gemini") {
      void runGeminiExtraction()
    } else {
      void runMockExtraction()
    }
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
  const runGeminiExtraction = async () => {
    if (!aiCategory || !aiBrick || uploadedFiles.length === 0) return
    const category = aiCategory
    const brick = aiBrick
    const targets = uploadedFiles.map(f => ({ name: f.name, file: f.file, type: f.type }))
    setAiSkipped(false)
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
  const runMockExtraction = async () => {
    if (!aiCategory || !aiBrick || uploadedFiles.length === 0) return
    const category = aiCategory
    const brick = aiBrick
    const imageNames = uploadedFiles.map(f => f.name)
    setAiSkipped(false)
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

  // ── Data-richness meter (P1.2 / audit E4): makes record completeness visible so richness
  // becomes a score suppliers close out, not an invisible virtue. Counts product-wide fields
  // once, per-shot fields and measured facts per image, and extended-attribute progress. ──
  const richness = (() => {
    const productWideFields = ["imageType", "purpose", "locationType", "imageStyle"] as const
    let filled = 0
    let total = 0
    productWideFields.forEach(k => { total++; if (attributes[k]) filled++ })
    uploadedFiles.forEach((f, i) => {
      const a = effectiveAttrs(i)
      PER_SHOT_KEYS.forEach(k => { total++; if (a[k]) filled++ })
      total += 3 // measured width / height / dpi
      if (f.measured?.width) filled++
      if (f.measured?.height) filled++
      if (f.measured?.dpi) filled++
    })
    const extendedTotal = isComplete && aiExtraction
      ? aiExtraction.attributes.length + aiExtraction.unresolvedAttributes.length
      : 0
    return { filled, total, extendedAccepted: acceptedExtractedAttributes.length, extendedTotal }
  })()

  const renderRichnessMeter = () => {
    const pct = richness.total > 0 ? Math.round((richness.filled / richness.total) * 100) : 0
    return (
      <div className="flex flex-wrap items-center gap-3 rounded border border-border bg-card px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground shrink-0">Data richness</span>
        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden shrink-0">
          <div
            className={cn("h-full rounded-full transition-all", pct >= 80 ? "bg-tg-success" : pct >= 40 ? "bg-tg-warning" : "bg-destructive")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-foreground">{richness.filled} of {richness.total} image fields</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-foreground">
          {richness.extendedTotal > 0
            ? `${richness.extendedAccepted} of ${richness.extendedTotal} extended attributes accepted`
            : "extended attributes not extracted yet"}
        </span>
      </div>
    )
  }

  // Idle AI controls (category + brick pickers, Extract button) — used in Step 2 and, per
  // P1.2, in the post-submit drawer so extraction can be run after upload, not only during
  // the wizard pass. showSkip hides the skip affordance where it makes no sense (drawer).
  const renderAiIdleControls = (showSkip: boolean) => (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:flex-wrap">
        <div className="flex flex-col gap-1">
          <Label htmlFor="ai-category" className="text-xs text-muted-foreground">Product category</Label>
          <Select value={aiCategory} onValueChange={(v) => { setAiCategory(v); clearExtraction() }}>
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
            onValueChange={(code) => { setAiBrick(bricksForCategory.find(b => b.code === code) ?? null); clearExtraction() }}
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
        <div className="flex items-center gap-2">
          <Button onClick={runExtraction} disabled={!aiCategory || !aiBrick || uploadedFiles.length === 0} className="gap-2">
            <Sparkles className="size-4" />
            Extract Extended Attributes with AI
          </Button>
          {showSkip && (
            <Button variant="ghost" onClick={() => setAiSkipped(true)}>
              Skip AI Extraction
            </Button>
          )}
        </div>
      </div>
      {aiCategory && bricksForCategory.length === 0 ? (
        <p className="text-xs text-tg-warning">
          No GS1 brick mapping is available for this category — continue entering attributes manually.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {!aiBrick && "Select the product brick to scope attributes to that classification. "}
          {uploadedFiles.length === 1
            ? "1 image will be analyzed for this product."
            : `${uploadedFiles.length} images will be analyzed together for this product.`}{" "}
          All uploaded images are treated as evidence for the same product.
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
            <Button variant="outline" size="sm" onClick={runExtraction}>Try again with AI</Button>
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Validates files and stages valid ones; appends errors for invalid ones.
  // Staged names are passed for the spec's file_name-uniqueness rule.
  const processFiles = useCallback((rawFiles: File[]) => {
    const { valid, errors } = validateImageBatch(rawFiles, uploadedFiles.map(f => f.name))
    if (errors.length > 0) {
      setValidationErrors(prev => {
        const newErrors = errors.filter(e => !prev.some(p => p.fileName === e.fileName))
        return [...prev, ...newErrors]
      })
    }
    if (valid.length === 0) return
    const newFiles: UploadedFile[] = valid.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: "complete" as const,
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
    // Auto-capture dimensions/DPI by decoding each staged file (deterministic, no AI).
    // Patched by id so a file deleted mid-measurement is a no-op, never resurrected.
    newFiles.forEach(({ id, file }) => {
      void measureImageFile(file).then(measured => {
        setUploadedFiles(prev => prev.map(f => (f.id === id ? { ...f, measured } : f)))
      })
    })
  }, [uploadedFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }, [processFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
    e.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    clearExtraction() // file list changed — stale product-level extraction is invalid
    clearShotSuggestions() // index-keyed — deletion shifts indices
  }

  // Removes a set of confirmed images (single or bulk) and rebuilds attributesByImage against
  // the new indices, since it's keyed by array index — without this, deleting an earlier image
  // would silently shift every later image's per-image attributes onto the wrong image.
  const deleteFilesByIds = (ids: Set<string>) => {
    const oldIndexById = new Map(uploadedFiles.map((f, i) => [f.id, i]))
    const remaining = uploadedFiles.filter(f => !ids.has(f.id))
    const nextAttrsByImage: typeof attributesByImage = {}
    remaining.forEach((f, newIdx) => {
      const oldIdx = oldIndexById.get(f.id)
      if (oldIdx !== undefined && attributesByImage[oldIdx]) nextAttrsByImage[newIdx] = attributesByImage[oldIdx]
    })
    setUploadedFiles(remaining)
    setAttributesByImage(nextAttrsByImage)
    clearExtraction() // file list changed — stale product-level extraction is invalid
    clearShotSuggestions() // index-keyed — deletion shifts indices
    media.prune(remaining.map(f => f.id))
  }

  // Opens the shared download modal. When presetIds has a single id (per-image download button),
  // the selection is set to just that image; the modal still lists everything so the user can add
  // more before confirming. With no presetIds (toolbar), the existing selection is respected.
  const openDownloadModal = (presetIds?: string[]) => {
    if (presetIds && presetIds.length > 0) media.selectOnly(presetIds[0])
    setDownloadPhase("select")
    setShowDownloadModal(true)
  }

  // Download Modal — Three-phase: Select → Preparing → Complete. Extracted into a render
  // function (rather than inline JSX) because it must be reachable from both the post-confirm
  // Product Media view and the pre-confirm Step 1 file grid, which are two separate `return`
  // statements in this component; `showDownloadModal`/`downloadPhase` are already top-level
  // state, so this is a pure JSX relocation with no behavior change.
  const renderDownloadModal = () => {
    const selectedFiles = uploadedFiles.filter(f => media.isChecked(f.id))
    return showDownloadModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-lg rounded border border-border bg-card shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-tg-header-start to-tg-header-end px-4 py-3">
            <h2 className="text-base font-semibold text-white">
              {downloadPhase === "select" && "Download Images with Metadata"}
              {downloadPhase === "preparing" && "Preparing Download"}
              {downloadPhase === "complete" && "Download Complete"}
            </h2>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Phase 1: Select */}
            {downloadPhase === "select" && (
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
                        <span className="font-medium text-foreground">{getAutoPopulatedData().productId}</span>
                      </div>
                      {uploadLevel === "gtin" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">GTIN:</span>
                          <span className="font-medium text-foreground">{getAutoPopulatedData().selectedGtin}</span>
                        </div>
                      )}
                      {uploadLevel === "product-color" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Color Code:</span>
                          <span className="font-medium text-foreground">{getAutoPopulatedData().colorCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Images:</span>
                        <span className="font-medium text-foreground">{selectedFiles.length} of {uploadedFiles.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Files to Download — reflects the selection already made on the Product Media
                    grid/toolbar; no in-modal checkboxes, to keep selection to a single control. */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Package Contents:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file) => (
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
                          {getAutoPopulatedData().productId || "product"}_image_metadata.csv
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedFiles.length} row{selectedFiles.length !== 1 ? "s" : ""} — one per image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
                  <Button variant="outline" onClick={() => setShowDownloadModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkDownload} disabled={selectedFiles.length === 0}>
                    <Download className="size-4 mr-2" />
                    Download {selectedFiles.length} image{selectedFiles.length !== 1 ? "s" : ""} + metadata CSV
                  </Button>
                </div>
              </>
            )}

            {/* Phase 2: Preparing */}
            {downloadPhase === "preparing" && (
              <div className="py-8 flex flex-col items-center justify-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Download className="size-8 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-foreground">Preparing your download</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Packaging {selectedFiles.length} images with metadata...
                  </p>
                </div>
                <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
                </div>
              </div>
            )}

            {/* Phase 3: Complete */}
            {downloadPhase === "complete" && (
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
                  <div className="text-sm font-medium text-foreground mb-3">Downloaded Files:</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-tg-success" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="size-4 text-tg-success" />
                      <span>{getAutoPopulatedData().productId || "product"}_image_metadata.csv</span>
                    </div>
                  </div>
                </div>

                {/* Metadata CSV Preview — first rows of the actually-downloaded file */}
                <div className="rounded border border-border bg-card p-4 mb-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Metadata Preview</span>
                    <span className="text-xs text-muted-foreground">
                      {getAutoPopulatedData().productId || "product"}_image_metadata.csv
                    </span>
                  </div>
                  <pre className="text-xs text-muted-foreground bg-muted/30 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto font-mono">
{lastCsvPreview || "No metadata available"}
                  </pre>
                </div>

                <Button onClick={() => setShowDownloadModal(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // One spec-shaped CSV row per image (P0.5). Measured facts come from the decoded file;
  // per-image attrs resolve exactly as the cards/exports do.
  const buildMetadataCsvRows = (files: UploadedFile[]): ImageMetadataRow[] => {
    const data = getAutoPopulatedData()
    return files.map(file => {
      const idx = uploadedFiles.indexOf(file)
      const fileAttrs = effectiveAttrs(idx)
      return {
        action: "insert",
        image_level: uploadLevel === "gtin" ? "item" : "product",
        product: data.productId,
        item_number: uploadLevel === "gtin" ? data.selectedGtin : "",
        file_name: file.name,
        file_type: "JPG",
        image_type: fileAttrs.imageType,
        purpose: fileAttrs.purpose,
        orientation: fileAttrs.orientation,
        location_type: fileAttrs.locationType,
        external_location: fileAttrs.externalLocation,
        color_code: uploadLevel === "product-color" ? data.colorCode : "",
        image_style: fileAttrs.imageStyle,
        facing: fileAttrs.facing,
        angle: fileAttrs.angle,
        file_size: String(file.size),
        pixel_density: file.measured?.dpi != null ? String(file.measured.dpi) : "",
        height: file.measured?.height != null ? String(file.measured.height) : "",
        width: file.measured?.width != null ? String(file.measured.width) : "",
        clipping_path: fileAttrs.clippingPath,
        image_description: fileAttrs.imageDescription,
      }
    })
  }

  // Handle bulk download: really generates and downloads the metadata CSV (incl. accepted
  // GS1 extended attributes), then runs the three-phase flow. Image binaries stay simulated.
  const handleBulkDownload = () => {
    const selectedFiles = uploadedFiles.filter(f => media.isChecked(f.id))
    const csv = buildImageMetadataCsv(buildMetadataCsvRows(selectedFiles), acceptedExtractedAttributes)
    downloadCsv(`${getAutoPopulatedData().productId || "product"}_image_metadata.csv`, csv)
    setLastCsvPreview(csvPreview(csv))
    setDownloadPhase("preparing")
    // Simulate preparation delay
    setTimeout(() => {
      setDownloadPhase("complete")
      toast({ title: "Download complete", description: `${selectedFiles.length} image${selectedFiles.length !== 1 ? "s" : ""} + metadata CSV downloaded.` })
    }, 1500)
  }

  // Read locationType from the active record for consistency (Change 2b)
  const isRemoteLocation = getCurrentAttributes().locationType === "FTP" || getCurrentAttributes().locationType === "URL"
  // Spec conditionality: external_location required only for FTP/URL; LMI needs neither
  // an external location nor locally staged binaries (images live in the LMI library).
  const isLmiLocation = getCurrentAttributes().locationType === "LMI"
  const canProceedStep2 = selectedSelectionCode && selectedProduct && getCurrentAttributes().locationType &&
    (isRemoteLocation || isLmiLocation || uploadedFiles.length > 0) &&
    (uploadLevel === "product" || 
     (uploadLevel === "product-color" && selectedColorCode) ||
     (uploadLevel === "gtin" && selectedGtin))
  // Every image must have its per-shot orientation set (Change 2a / P0.2a);
  // product-wide required fields are checked once.
  const missingAttrCount = uploadedFiles.filter((_, i) => !attributesByImage[i]?.orientation).length
  const canProceedStep3 = !!(attributes.imageType && attributes.purpose) &&
    (uploadedFiles.length > 0 ? missingAttrCount === 0 : !!getCurrentAttributes().orientation)

  // Simulates per-file upload progression — no artificial failures (Task 3)
  const simulateSubmission = useCallback(() => {
    const ids = uploadedFiles.map(f => f.id)
    const initial: typeof fileStatuses = {}
    ids.forEach(id => { initial[id] = "queued" })
    setFileStatuses(initial)
    setSubmissionPhase("uploading")

    ids.forEach((id, i) => {
      const base = i * 800
      setTimeout(() => setFileStatuses(prev => ({ ...prev, [id]: "uploading" })), base + 100)
      setTimeout(() => setFileStatuses(prev => ({ ...prev, [id]: "processing" })), base + 400)
      setTimeout(() => {
        setFileStatuses(prev => ({ ...prev, [id]: "complete" }))
        if (i === ids.length - 1) {
          setTimeout(() => {
            setSubmissionPhase("complete")
            toast({ title: "Upload complete", description: `${ids.length} image${ids.length !== 1 ? "s" : ""} submitted to TGC.` })
            // 300ms dwell on "Upload complete" state before advancing
            setTimeout(() => setShowProductMedia(true), 300)
          }, 300)
        }
      }, base + 800)
    })
  }, [uploadedFiles])

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      simulateSubmission()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3) setSyndicationAcknowledged(false)
      setCurrentStep(currentStep - 1)
    } else {
      onCancel()
    }
  }

  // Get auto-populated data based on selections
  const getAutoPopulatedData = () => {
    const selCode = MOCK_DATA.selectionCodes.find(s => s.code === selectedSelectionCode)
    const product = MOCK_DATA.products.find(p => p.id === selectedProduct)
    const color = MOCK_DATA.colorCodes.find(c => c.code === selectedColorCode)
    const gtinEntry = product?.gtins.find(g => g.gtin === selectedGtin)
    
    return {
      companyName: "KIBBLES N BITS",
      accountNumber: "125103335555",
      selectionCode: selCode?.code || "",
      description: selCode?.description || "",
      productId: product?.id || "",
      productDescription: product?.description || "",
      gtins: product?.gtins || [],
      colorCode: color?.code || "",
      colorName: color?.name || "",
      selectedGtin: gtinEntry?.gtin || "",
      selectedGtinType: gtinEntry?.type || "",
    }
  }

  // Product Media Display View (after upload)
  if (showProductMedia) {
    const data = getAutoPopulatedData()
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    })
    
    return (
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-tg-link hover:underline cursor-pointer">Selection Code List</span>
          <span className="text-muted-foreground">&gt;</span>
          <span className="text-tg-link hover:underline cursor-pointer">Product List</span>
          {uploadLevel === "gtin" && (
            <>
              <span className="text-muted-foreground">&gt;</span>
              <span className="text-tg-link hover:underline cursor-pointer">GTIN List</span>
            </>
          )}
          <span className="text-muted-foreground">&gt;</span>
          <span className="font-semibold text-foreground">
            {uploadLevel === "gtin" ? "Item Media" : "Product Media"}
          </span>
        </div>

        {/* Page-level toolbar — selection, bulk download/edit/delete, AI attributes; per-card Edit/Download stay inline */}
        <div className="flex items-center gap-2 border border-border bg-card p-1 w-fit">
          {uploadedFiles.length > 0 && (
            <label className="flex items-center gap-2 px-2 cursor-pointer select-none">
              <Checkbox
                checked={media.isAllSelected(uploadedFiles.map(f => f.id))}
                onCheckedChange={(checked) =>
                  checked ? media.selectAll(uploadedFiles.map(f => f.id)) : media.clear()
                }
              />
              <span className="text-xs text-muted-foreground">
                {media.selectedIds.size === 0
                  ? `All ${uploadedFiles.length} selected`
                  : `${media.selectedIds.size} selected`}
              </span>
            </label>
          )}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 hover:bg-muted border border-border"
              title="Download"
              onClick={() => openDownloadModal()}
            >
              <Download className="size-4 text-muted-foreground" />
            </button>
            <button
              className="p-1.5 hover:bg-muted border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Bulk edit selected images"
              disabled={uploadedFiles.length === 0}
              onClick={() => {
                const selectedFiles = uploadedFiles.filter(f => media.isChecked(f.id))
                const fieldKeys = Object.keys(attributes) as Array<keyof typeof attributes>
                const seed = { ...attributes }
                fieldKeys.forEach((key) => {
                  const values = new Set(selectedFiles.map(f => effectiveAttrs(uploadedFiles.indexOf(f))[key]))
                  seed[key] = values.size === 1 ? [...values][0] : ""
                })
                setBulkEditDialog({ open: true, draft: seed, touched: {} })
              }}
            >
              <Pencil className="size-4 text-muted-foreground" />
            </button>
            <button
              className="p-1.5 hover:bg-muted border border-border disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Delete selected images"
              disabled={uploadedFiles.length === 0}
              onClick={() => setBulkDeleteConfirmOpen(true)}
            >
              <Trash2 className="size-4 text-muted-foreground" />
            </button>
            <button
              className="p-1.5 hover:bg-muted border border-border"
              title={hasExtraction ? "View AI Attributes" : "Run AI"}
              onClick={() => setShowAiAttributesDrawer(true)}
            >
              <Sparkles className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Company Info Header */}
        <div className="text-sm space-y-1">
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Company Name</span>
              <span className="ml-4 text-foreground">{data.companyName}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Account Number</span>
              <span className="ml-4 text-foreground">{data.accountNumber}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Selection Code</span>
              <span className="ml-4 text-foreground">{data.selectionCode}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Description</span>
              <span className="ml-4 text-foreground">{data.description}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground text-tg-link">Product</span>
              <span className="ml-4 text-tg-link">{data.productId}</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Product Description</span>
              <span className="ml-4 text-foreground">{data.productDescription}</span>
            </div>
          </div>
          {uploadLevel === "gtin" && (
            <>
              <div className="flex gap-8">
                <div>
                  <span className="font-semibold text-foreground">GTIN</span>
                  <span className="ml-4 text-foreground">{data.selectedGtin}</span>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="font-semibold text-foreground">GTIN Type</span>
                  <span className="ml-4 text-foreground">{data.selectedGtinType}</span>
                </div>
              </div>
            </>
          )}
          <div className="flex gap-8">
            <div>
              <span className="font-semibold text-foreground">Images</span>
              <span className="ml-4 text-tg-link">{uploadedFiles.length}</span>
            </div>
          </div>
        </div>

        {/* Data-richness meter — post-submit view (P1.2) */}
        {renderRichnessMeter()}

        {/* Syndication info block — supplier post-submit only (Change 6) */}
        {portalType === "supplier" && (
          <div className="rounded border border-border bg-card p-3 flex items-start gap-3">
            <Info className="size-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-foreground">
                Submitted to TGC &mdash; visible to retailers. 7 retailers currently access selection code {data.selectionCode} where Product {data.productId}/GTINs reside.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Available to retailer subscribers on next sync.</p>
            </div>
          </div>
        )}

        {/* Sticky jump-to thumbnail strip — hidden when only 1 image (Acceptance #9) */}
        {uploadedFiles.length > 1 && (
          <div className="sticky top-0 z-10 bg-card border border-border p-2 flex gap-2 overflow-x-auto shadow-sm">
            {uploadedFiles.map((file, idx) => (
              <button
                key={file.id}
                title={file.name}
                onClick={() => {
                  document.getElementById(`supplier-card-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className="flex-shrink-0 rounded border-2 border-border hover:border-primary/60 overflow-hidden transition-all"
              >
                <img
                  src={file.preview}
                  alt={`Image ${idx + 1}`}
                  className="size-14 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Stacked image cards — one per uploaded file (Acceptance #1) */}
        {uploadedFiles.length === 0 ? (
          /* Empty state (Acceptance #10) */
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded">
            <FileImage className="size-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1">No images on this product</h3>
            <p className="text-sm text-muted-foreground mb-4">All images have been removed. Upload new images to make this product visible to retailers.</p>
            <Button onClick={() => { setShowProductMedia(false); setCurrentStep(1) }}>Upload images</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {uploadedFiles.map((file, idx) => {
              const cardAttrs = effectiveAttrs(idx)
              const imageLevelLabel = uploadLevel === "product"
                ? "Product Level"
                : uploadLevel === "gtin"
                ? "Item Level (GTIN)"
                : "Product + Color Code Level"
              const levelLabel = uploadLevel === "product"
                ? "Product Level Image"
                : uploadLevel === "gtin"
                ? "Item Level Image"
                : "Product + Color Code Level Image"
              return (
                <div key={file.id} id={`supplier-card-${idx}`} className="border border-border bg-card">
                  {/* Card header */}
                  <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={media.isChecked(file.id)}
                        onCheckedChange={() => media.toggle(file.id, uploadedFiles.map(f => f.id))}
                      />
                      <span className="text-sm font-medium text-tg-link">{levelLabel}</span>
                    </div>
                    {/* Per-card action toolbar: Edit pencil + per-card Download (Acceptance #1, #3) */}
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 hover:bg-muted rounded"
                        title="Download this image"
                        onClick={() => openDownloadModal([file.id])}
                      >
                        <Download className="size-3.5 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded"
                        title="Edit image"
                        onClick={() => {
                          const snap = { ...cardAttrs }
                          setEditAttrDialog({ open: true, fileIndex: idx, draft: snap })
                          setEditAttrInitial(snap)
                          setPendingReplaceFile(null)
                          setEditSaveConfirmed(false)
                          setEditDeleteConfirm(false)
                          setReplacementAttrChecked(false)
                        }}
                      >
                        <Pencil className="size-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  {/* Card body: attributes 60% left, preview 40% right */}
                  <div className="flex">
                    {/* Left: attribute table */}
                    <div className="w-3/5 border-r border-border text-sm">
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Image Level:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{imageLevelLabel}</div>
                      </div>
                      {uploadLevel === "product-color" && (
                        <div className="flex border-b border-border">
                          <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Color Code:</div>
                          <div className="flex-1 px-3 py-2 text-foreground">{data.colorCode}</div>
                        </div>
                      )}
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">File Name:</div>
                        <div className="flex-1 px-3 py-2 text-foreground truncate">{file.name}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">File Type:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{file.type || "JPG-JPEG"}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-tg-link shrink-0">Image Type:</div>
                        <div className="flex-1 px-3 py-2 text-tg-link">{IMAGE_TYPE_OPTIONS.find(o => o.value === cardAttrs.imageType)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Purpose:</div>
                        <div className="flex-1 px-3 py-2 text-tg-link">{PURPOSE_OPTIONS.find(o => o.value === cardAttrs.purpose)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Orientation:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{ORIENTATION_OPTIONS.find(o => o.value === cardAttrs.orientation)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Location Type:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{LOCATION_TYPE_OPTIONS.find(o => o.value === cardAttrs.locationType)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">External Location:</div>
                        <div className="flex-1 px-3 py-2 text-foreground break-all">{cardAttrs.externalLocation || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">File Size:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{formatFileSize(file.size)}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Pixel Density (DPI):</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{file.measured?.dpi ?? ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Height:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{file.measured?.height != null ? `${file.measured.height} px` : ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Width:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{file.measured?.width != null ? `${file.measured.width} px` : ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Image Style:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{IMAGE_STYLE_OPTIONS.find(o => o.value === cardAttrs.imageStyle)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Facing (GDSN):</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{FACING_OPTIONS.find(o => o.value === cardAttrs.facing)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Angle:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{ANGLE_OPTIONS.find(o => o.value === cardAttrs.angle)?.label || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Clipping Path:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{cardAttrs.clippingPath || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Image Description:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{cardAttrs.imageDescription || ""}</div>
                      </div>
                      <div className="flex border-b border-border">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Create Date:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
                      </div>
                      <div className="flex">
                        <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground shrink-0">Last Update Date:</div>
                        <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
                      </div>
                    </div>
                    {/* Right: image preview */}
                    <div className="w-2/5 flex items-center justify-center bg-white p-4 min-h-[280px]">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="max-w-full max-h-64 object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center">
                          <FileImage className="size-16 text-muted-foreground/40" />
                          <p className="text-xs text-muted-foreground">No preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Unified Edit modal — no tabs; Replace → Confirmation banner → Attributes → footer (Acceptance #4) */}
        <Dialog
          open={editAttrDialog.open}
          onOpenChange={(o) => {
            setEditAttrDialog(prev => ({ ...prev, open: o }))
            if (!o) {
              setPendingReplaceFile(null)
              setEditSaveConfirmed(false)
              setEditDeleteConfirm(false)
              setReplacementAttrChecked(false)
              setEditAttrInitial(null)
            }
          }}
        >
          <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <DialogHeader className="pb-0">
              <DialogTitle>Edit Image</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {uploadedFiles[editAttrDialog.fileIndex]?.name}
                {getAutoPopulatedData().productId ? ` \u2022 ${getAutoPopulatedData().productId}` : ""}
              </p>
            </DialogHeader>

            {editDeleteConfirm ? (
              /* ── Delete confirmation step (Acceptance #7) ── */
              <>
                <div className="flex flex-col gap-4 py-2 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Delete this image</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">{uploadedFiles[editAttrDialog.fileIndex]?.name}</span>{" "}
                    from <span className="font-medium text-foreground">{getAutoPopulatedData().productId}</span>?
                  </p>
                  {/* Last-image warning */}
                  {uploadedFiles.length === 1 ? (
                    <div className="flex items-start gap-3 rounded border border-destructive/40 bg-destructive/5 p-3">
                      <Trash2 className="size-4 text-destructive mt-0.5 shrink-0" />
                      <p className="text-sm text-destructive">
                        This is the last image on <span className="font-medium">{getAutoPopulatedData().productId}</span>. The product will have zero images after deletion. Retailer subscribers will see no images for this product on next sync.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This image will be removed from retailer subscribers on next sync.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Button variant="outline" onClick={() => setEditDeleteConfirm(false)}>
                    Back
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const idx = editAttrDialog.fileIndex
                      deleteFilesByIds(new Set([uploadedFiles[idx].id]))
                      setEditAttrDialog(prev => ({ ...prev, open: false }))
                      setEditDeleteConfirm(false)
                    }}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Delete image
                  </Button>
                </div>
              </>
            ) : (
              /* ── Main unified form ── */
              <>
                <div className="flex flex-col gap-5 overflow-y-auto flex-1 pr-1 py-2">

                  {/* 1. Replace section (Acceptance #4 — Replace at top) */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Image file</p>
                    <div className="flex items-start gap-3 rounded border border-border p-3">
                      {/* Current / staged preview thumbnail */}
                      <div className="shrink-0 size-20 border border-border overflow-hidden rounded bg-white flex items-center justify-center">
                        {pendingReplaceFile ? (
                          <img src={URL.createObjectURL(pendingReplaceFile)} alt="Replacement preview" className="size-full object-contain" />
                        ) : uploadedFiles[editAttrDialog.fileIndex]?.preview ? (
                          <img src={uploadedFiles[editAttrDialog.fileIndex].preview} alt="Current image" className="size-full object-contain" />
                        ) : (
                          <FileImage className="size-8 text-muted-foreground/40" />
                        )}
                      </div>
                      {/* Filename / size / type + replace control */}
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {pendingReplaceFile ? pendingReplaceFile.name : uploadedFiles[editAttrDialog.fileIndex]?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pendingReplaceFile
                            ? formatFileSize(pendingReplaceFile.size)
                            : uploadedFiles[editAttrDialog.fileIndex]
                              ? formatFileSize(uploadedFiles[editAttrDialog.fileIndex].size)
                              : ""}
                        </p>
                        {pendingReplaceFile && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <CheckCircle2 className="size-3" />
                            Replacement staged
                          </span>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          <label className="text-xs text-tg-link hover:underline cursor-pointer">
                            Replace image
                            <input
                              type="file"
                              accept="image/jpeg,.jpg,.jpeg"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0]
                                if (!f) return
                                // Uniqueness excludes the file being replaced — replacing under the same name is fine.
                                const otherNames = uploadedFiles.filter((_, i) => i !== editAttrDialog.fileIndex).map(u => u.name)
                                const { errors } = validateImageBatch([f], otherNames)
                                if (errors.length) { setValidationErrors(prev => [...prev, ...errors]); return }
                                setPendingReplaceFile(f)
                                setReplacementAttrChecked(false)
                              }}
                            />
                          </label>
                          {pendingReplaceFile && (
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                              onClick={() => { setPendingReplaceFile(null); setReplacementAttrChecked(false) }}
                            >
                              Undo replacement
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Max 500 KB &middot; JPG only</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Replacement confirmation banner — only when staged (Acceptance #5) */}
                  {pendingReplaceFile && (
                    <div className="rounded border border-primary/30 bg-primary/5 p-3 flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Info className="size-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">Image replaced. Confirm the attributes still apply to the new image.</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none pl-6">
                        <input
                          type="checkbox"
                          checked={replacementAttrChecked}
                          onChange={(e) => setReplacementAttrChecked(e.target.checked)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-foreground">Attributes are correct for the new image.</span>
                      </label>
                    </div>
                  )}

                  {/* 3. Attributes section (Acceptance #4 — below Replace) */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Image attributes</p>
                    <StepTwoForm
                      currentAttrs={editAttrDialog.draft}
                      updateAttrs={(newAttrs) => setEditAttrDialog(prev => ({ ...prev, draft: newAttrs }))}
                      uploadLevel={uploadLevel}
                      autoData={getAutoPopulatedData()}
                      measuredFiles={uploadedFiles[editAttrDialog.fileIndex]
                        ? [{ name: uploadedFiles[editAttrDialog.fileIndex].name, measured: uploadedFiles[editAttrDialog.fileIndex].measured }]
                        : []}
                    />
                  </div>
                </div>

                {/* Footer: Delete left | Cancel + Save right (Acceptance #4, #5, #6) */}
                <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => setEditDeleteConfirm(true)}
                  >
                    Delete this image
                  </Button>
                  <div className="flex items-center gap-2">
                    {editSaveConfirmed && (
                      <span className="flex items-center gap-1 text-xs text-tg-success">
                        <CheckCircle2 className="size-3.5" />
                        Saved
                      </span>
                    )}
                    <Button variant="outline" onClick={() => setEditAttrDialog(prev => ({ ...prev, open: false }))}>
                      Cancel
                    </Button>
                    <Button
                      disabled={(() => {
                        // Dirty check: any attribute field changed from initial? (Acceptance #6)
                        const attrDirty = editAttrInitial
                          ? (Object.keys(editAttrDialog.draft) as Array<keyof typeof attributes>).some(
                              k => editAttrDialog.draft[k] !== editAttrInitial[k]
                            )
                          : false
                        // When replacement staged: need checkbox OR attr changed (Acceptance #5)
                        if (pendingReplaceFile) return !replacementAttrChecked && !attrDirty
                        // No replacement: need at least one attr changed (Acceptance #6)
                        return !attrDirty
                      })()}
                      onClick={() => {
                        // Commit replacement if staged (Acceptance #8)
                        if (pendingReplaceFile) {
                          const f = pendingReplaceFile
                          const newFile: UploadedFile = {
                            id: uploadedFiles[editAttrDialog.fileIndex].id,
                            file: f,
                            name: f.name,
                            size: f.size,
                            type: f.type,
                            preview: URL.createObjectURL(f),
                            status: "complete",
                          }
                          setUploadedFiles(prev => prev.map((u, i) => i === editAttrDialog.fileIndex ? newFile : u))
                          // Re-measure the replacement binary — its dimensions/DPI supersede the old file's.
                          void measureImageFile(f).then(measured => {
                            setUploadedFiles(prev => prev.map(u => (u.id === newFile.id ? { ...u, measured } : u)))
                          })
                          clearExtraction() // replaced image invalidates the product-level extraction
                          clearShotSuggestions() // filename/content changed under this index
                          setPendingReplaceFile(null)
                        }
                        // Commit attribute edits (Acceptance #8): product-wide keys apply to the
                        // whole product; per-shot keys to this image only (P0.2a).
                        {
                          const draft = editAttrDialog.draft
                          setAttributes(prev => {
                            const next = { ...prev }
                            ;(Object.keys(draft) as Array<keyof typeof attributes>).forEach(k => {
                              if (!isPerShotKey(k)) next[k] = draft[k]
                            })
                            return next
                          })
                          setAttributesByImage(prev => {
                            const rec = { ...(prev[editAttrDialog.fileIndex] ?? attributes) }
                            PER_SHOT_KEYS.forEach(k => { rec[k] = draft[k] })
                            return { ...prev, [editAttrDialog.fileIndex]: rec }
                          })
                        }
                        setEditSaveConfirmed(true)
                        setTimeout(() => {
                          setEditAttrDialog(prev => ({ ...prev, open: false }))
                          setEditSaveConfirmed(false)
                          setReplacementAttrChecked(false)
                        }, 1200)
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Bulk Delete confirmation — mirrors the single-item delete step above. Uses
            media.isChecked (not raw selectedIds) so it always targets exactly what the card
            checkboxes visually show as checked, including the "nothing explicitly picked ⇒ all
            checked" default — the file list below and the "deletes every image" warning make
            that scope unambiguous before the user confirms. */}
        <Dialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            {(() => {
              const targetFiles = uploadedFiles.filter(f => media.isChecked(f.id))
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Delete {targetFiles.length} selected image{targetFiles.length !== 1 ? "s" : ""}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 py-2">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete the following image{targetFiles.length !== 1 ? "s" : ""} from{" "}
                      <span className="font-medium text-foreground">{getAutoPopulatedData().productId}</span>?
                    </p>
                    <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto rounded border border-border bg-muted/20 p-2">
                      {targetFiles.map(f => (
                        <li key={f.id} className="text-sm text-foreground truncate">{f.name}</li>
                      ))}
                    </ul>
                    {targetFiles.length === uploadedFiles.length && (
                      <div className="flex items-start gap-3 rounded border border-destructive/40 bg-destructive/5 p-3">
                        <Trash2 className="size-4 text-destructive mt-0.5 shrink-0" />
                        <p className="text-sm text-destructive">
                          This deletes every image on <span className="font-medium">{getAutoPopulatedData().productId}</span>. The product will have zero images after deletion.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button variant="outline" onClick={() => setBulkDeleteConfirmOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteFilesByIds(new Set(targetFiles.map(f => f.id)))
                        setBulkDeleteConfirmOpen(false)
                        toast({ title: "Images deleted", description: `${targetFiles.length} image${targetFiles.length !== 1 ? "s" : ""} removed from this product.` })
                      }}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete {targetFiles.length} image{targetFiles.length !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </>
              )
            })()}
          </DialogContent>
        </Dialog>

        {/* Bulk Edit — mixed-aware: fields where selected images differ show "Mixed" and are left
            untouched on Save unless the user explicitly changes them, so divergent values aren't
            silently clobbered. Manual GDSN attributes only — AI attributes are product-level and
            edited via the AI Attributes drawer instead. Targets media.isChecked, matching the
            visually-checked cards (same reasoning as Bulk Delete above). */}
        <Dialog open={bulkEditDialog.open} onOpenChange={(o) => setBulkEditDialog(prev => ({ ...prev, open: o }))}>
          <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
            {(() => {
              const targetIds = new Set(uploadedFiles.filter(f => media.isChecked(f.id)).map(f => f.id))
              return (
                <>
                  <DialogHeader>
                    <DialogTitle>Edit {targetIds.size} Selected Image{targetIds.size !== 1 ? "s" : ""}</DialogTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Per-shot fields only — product-wide attributes are edited once on the product. Fields marked "Mixed" differ across the selected images. Only fields you change here will be applied — untouched fields keep each image's existing value.
                    </p>
                  </DialogHeader>
                  <div className="overflow-y-auto flex-1 pr-1 py-2">
                    <StepTwoForm
                      currentAttrs={bulkEditDialog.draft}
                      updateAttrs={(newAttrs) => {
                        const changedKey = (Object.keys(newAttrs) as Array<keyof typeof attributes>).find(
                          k => newAttrs[k] !== bulkEditDialog.draft[k]
                        )
                        setBulkEditDialog(prev => ({
                          ...prev,
                          draft: newAttrs,
                          touched: changedKey ? { ...prev.touched, [changedKey]: true } : prev.touched,
                        }))
                      }}
                      uploadLevel={uploadLevel}
                      autoData={getAutoPopulatedData()}
                      hideProductWide
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                    <Button variant="outline" onClick={() => setBulkEditDialog(prev => ({ ...prev, open: false }))}>
                      Cancel
                    </Button>
                    <Button
                      disabled={Object.keys(bulkEditDialog.touched).length === 0}
                      onClick={() => {
                        // Bulk edit writes per-shot keys only (product-wide fields are hidden above).
                        const touchedKeys = (Object.keys(bulkEditDialog.touched) as Array<keyof typeof attributes>)
                          .filter(k => bulkEditDialog.touched[k] && isPerShotKey(k))
                        setAttributesByImage(prev => {
                          const next = { ...prev }
                          uploadedFiles.forEach((f, idx) => {
                            if (!targetIds.has(f.id)) return
                            const merged = { ...(prev[idx] || attributes) }
                            touchedKeys.forEach((k) => { merged[k] = bulkEditDialog.draft[k] })
                            next[idx] = merged
                          })
                          return next
                        })
                        setBulkEditDialog({ open: false, draft: {} as typeof attributes, touched: {} })
                        toast({ title: "Bulk edit applied", description: `Updated ${touchedKeys.length} field${touchedKeys.length !== 1 ? "s" : ""} on ${targetIds.size} image${targetIds.size !== 1 ? "s" : ""}.` })
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </>
              )
            })()}
          </DialogContent>
        </Dialog>

        {/* Action Buttons — single Done button returns to landing */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button onClick={onComplete}>
            Done
          </Button>
        </div>

        {/* View AI Attributes drawer — editable (AI is the primary editing surface, unlike
            manual GDSN attributes). Reuses the same Accept/Reject/Edit card as Step 2. */}
        <Sheet open={showAiAttributesDrawer} onOpenChange={setShowAiAttributesDrawer}>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                AI-Extracted Attributes
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4 flex flex-col gap-4">
              {/* P1.2: extraction can be run from here after upload — not only during the wizard */}
              {isExtracting && (
                <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <p className="text-sm text-foreground">Analyzing {aiExtraction?.imageCount ?? uploadedFiles.length} image{(aiExtraction?.imageCount ?? uploadedFiles.length) !== 1 ? "s" : ""} for {aiCategory} attributes…</p>
                </div>
              )}
              {isError && (
                <div className="flex flex-col gap-3 rounded border border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{aiExtraction?.error ?? "Extraction failed."}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-fit" onClick={runExtraction}>Try again</Button>
                </div>
              )}
              {isComplete && renderAiResultsCard()}
              {!hasExtraction && (
                uploadedFiles.length > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      No extraction has run for this product yet. Run it now — the images are already uploaded.
                    </p>
                    {renderAiIdleControls(false)}
                  </>
                ) : (
                  <AiAttributesTable attributes={[]} />
                )
              )}
            </div>
          </SheetContent>
        </Sheet>

        {renderDownloadModal()}
      </div>
    )
  }

  // Submission progress card (Change 4)
  if (submissionPhase === "uploading" || submissionPhase === "complete" || submissionPhase === "partial-failure") {
    const completedCount = Object.values(fileStatuses).filter(s => s === "complete").length
    const failedCount = Object.values(fileStatuses).filter(s => s === "failed").length
    const STATUS_LABELS: Record<string, string> = {
      queued: "Queued", uploading: "Uploading", processing: "Processing", complete: "Complete", failed: "Failed",
    }
    const isComplete = submissionPhase === "complete"
    const dwellData = getAutoPopulatedData()

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-tg-link hover:underline cursor-pointer">Data Management</span>
          <span className="text-muted-foreground">&gt;</span>
          <span className="font-medium text-foreground">{isComplete ? "Upload complete" : "Submitting"}</span>
        </div>
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            {/* Dynamic card header — Task 3 + Task 4 */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle2 className="size-5 text-tg-success shrink-0" />
                ) : null}
                <h2 className={cn(
                  "text-base font-semibold",
                  isComplete ? "text-tg-success" : "text-foreground"
                )}>
                  {isComplete ? "Upload complete" : "Submitting images"}
                </h2>
              </div>
              {/* Task 4: completedCount / total counter */}
              <span className="text-sm text-muted-foreground shrink-0">
                {isComplete ? "Complete" : `Uploading ${completedCount} of ${uploadedFiles.length}\u2026`}
              </span>
            </div>

            {/* Task 4: Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isComplete ? "bg-tg-success" : "bg-primary"
                )}
                style={{ width: `${uploadedFiles.length > 0 ? (completedCount / uploadedFiles.length) * 100 : 0}%` }}
              />
            </div>

            {/* Per-file status list */}
            <div className="flex flex-col gap-2">
              {uploadedFiles.map((file) => {
                const status = fileStatuses[file.id] ?? "queued"
                const isErr = status === "failed"
                return (
                  <div key={file.id} className="flex items-center gap-3 rounded border border-border px-3 py-2 text-sm">
                    {isErr && <span className="size-2 rounded-full bg-red-600 shrink-0" />}
                    <span className={cn("flex-1 truncate", isErr ? "text-destructive" : "text-foreground")}>{file.name}</span>
                    {isErr && <span className="text-xs text-destructive mr-1">Upload failed</span>}
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      status === "complete" ? "bg-tg-success/10 text-tg-success"
                        : status === "failed" ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {STATUS_LABELS[status]}
                    </span>
                    {isErr && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => {
                        setFileStatuses(prev => ({ ...prev, [file.id]: "queued" }))
                        setTimeout(() => setFileStatuses(prev => ({ ...prev, [file.id]: "uploading" })), 100)
                        setTimeout(() => setFileStatuses(prev => ({ ...prev, [file.id]: "processing" })), 400)
                        setTimeout(() => {
                          setFileStatuses(prev => ({ ...prev, [file.id]: "complete" }))
                          setSubmissionPhase(prev => prev === "partial-failure" ? "complete" : prev)
                          setTimeout(() => setShowProductMedia(true), 1500)
                        }, 800)
                      }}>Retry</Button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Retry-all summary */}
            {failedCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-destructive">{failedCount} failed</span>
                <button className="text-xs text-tg-link hover:underline" onClick={() => {
                  uploadedFiles.forEach(file => {
                    if (fileStatuses[file.id] === "failed") {
                      setFileStatuses(prev => ({ ...prev, [file.id]: "queued" }))
                      setTimeout(() => setFileStatuses(prev => ({ ...prev, [file.id]: "uploading" })), 100)
                      setTimeout(() => setFileStatuses(prev => ({ ...prev, [file.id]: "processing" })), 400)
                      setTimeout(() => setFileStatuses(prev => ({ ...prev, [file.id]: "complete" })), 800)
                    }
                  })
                  setTimeout(() => {
                    setSubmissionPhase("complete")
                    setTimeout(() => setShowProductMedia(true), 1500)
                  }, 1000)
                }}>retry all</button>
              </div>
            )}

            {/* Footer actions for partial-failure */}
            {submissionPhase === "partial-failure" && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button onClick={() => setShowProductMedia(true)}>Skip failed and continue</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-tg-link hover:underline cursor-pointer">Data Management</span>
        <span className="text-muted-foreground">&gt;</span>
        <span className="text-tg-link hover:underline cursor-pointer" onClick={onCancel}>Image Upload</span>
        <span className="text-muted-foreground">&gt;</span>
        <span className="font-medium text-foreground">Upload Wizard</span>
      </div>

      {/* Header with Cancel */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Upload Images</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {/* Landing's "Select Upload Level" is step 1 of the advertised 4-step flow,
                so the wizard's internal steps 1-3 display as 2-4. */}
            Step {currentStep + 1} of 4: {steps[currentStep - 1].description}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1 text-muted-foreground">
          <X className="size-4" />
          Cancel
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between rounded border border-border bg-card p-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                  currentStep > step.number
                    ? "bg-tg-success text-white"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? <Check className="size-4" /> : step.number + 1}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground">{step.description}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="mx-6 size-5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded border border-border bg-card p-6">
        {/* Step 1: Target & Files */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground">Select Target & Upload Files</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the product to assign images to, then drag and drop or browse for image files.
              </p>
            </div>

            {/* Target Selection */}
            <div className="grid gap-4 rounded border border-border bg-muted/30 p-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Selection Code <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedSelectionCode} onValueChange={setSelectedSelectionCode}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select code..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DATA.selectionCodes.map((code) => (
                      <SelectItem key={code.code} value={code.code}>
                        {code.code} - {code.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Product <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={selectedProduct} 
                  onValueChange={(value) => {
                    setSelectedProduct(value)
                    setSelectedGtin("")
                    // product context changed: drop stale product-level extraction and re-default category
                    clearExtraction()
                    clearShotSuggestions()
                    setAiCategory("")
                    setAiSkipped(false)
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DATA.products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.id} - {product.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {uploadLevel === "product-color" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Color Code (3-digit) <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedColorCode} onValueChange={setSelectedColorCode}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select color..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_DATA.colorCodes.map((color) => (
                        <SelectItem key={color.code} value={color.code}>
                          {color.code} - {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {uploadLevel === "gtin" && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    GTIN <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={selectedGtin} 
                    onValueChange={setSelectedGtin}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder={selectedProduct ? "Select GTIN..." : "Select product first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_DATA.products
                        .find(p => p.id === selectedProduct)
                        ?.gtins.map((g) => (
                          <SelectItem key={g.gtin} value={g.gtin}>
                            {g.gtin} ({g.type})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Auto-populated Info */}
            {selectedSelectionCode && selectedProduct && (
              <div className="rounded border border-border bg-tg-table-header p-3 text-sm">
                <div className="mb-2 font-medium text-foreground">Auto-populated Information</div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">Company:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().companyName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Description:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().productDescription}</span>
                  </div>
                  <div className="md:col-span-3">
                    <span className="text-muted-foreground">GTINs ({getAutoPopulatedData().gtins.length}):</span>{" "}
                    <span className="text-foreground">
                      {getAutoPopulatedData().gtins.map(g => `${g.gtin} (${g.type})`).join(", ")}
                    </span>
                  </div>
                  {uploadLevel === "gtin" && selectedGtin && (
                    <div className="md:col-span-3">
                      <span className="text-muted-foreground">Selected GTIN:</span>{" "}
                      <span className="font-medium text-foreground">{getAutoPopulatedData().selectedGtin}</span>
                      <span className="ml-2 text-muted-foreground">GTIN Type:</span>{" "}
                      <span className="font-medium text-foreground">{getAutoPopulatedData().selectedGtinType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Type - must be chosen before showing upload zone */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                Location Type <span className="text-destructive">*</span>
              </Label>
              <div className="grid gap-3 md:grid-cols-4">
                {LOCATION_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateCurrentAttributes({ ...getCurrentAttributes(), locationType: option.value })}
                    className={cn(
                      "flex flex-col items-start gap-1 rounded border-2 p-3 text-left transition-colors",
                      attributes.locationType === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.value === "ACL" && "Upload files from your computer"}
                      {option.value === "FTP" && "Images are on an FTP server"}
                      {option.value === "LMI" && "Images are managed in your LMI library"}
                      {option.value === "URL" && "Images are at a web URL"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Zone — only shown for ACL (computer upload) */}
            {attributes.locationType === "ACL" && (
              <div className="flex flex-col gap-4">
                <Label className="text-sm font-medium">
                  Upload Files <span className="text-destructive">*</span>
                </Label>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/20 hover:border-primary/50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Drag and drop images here
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,.jpg,.jpeg"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">Browse Files</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Max 500 KB each &middot; JPG only &middot;{" "}
                    <a href="#" className="text-tg-link hover:underline">
                      View GS1 guidelines
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Inline validation error list (Change 1) */}
            {validationErrors.length > 0 && (
              <div className="flex flex-col gap-1 rounded border border-destructive/40 bg-destructive/5 p-3">
                <p className="text-xs font-semibold text-destructive mb-1">{validationErrors.length} file{validationErrors.length !== 1 ? "s" : ""} rejected</p>
                {validationErrors.map((err, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-red-600">&#8226;</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]" title={err.fileName}>{err.fileName}</span>
                    <span className="text-muted-foreground">{err.observedValue}</span>
                    <span className="text-destructive">&mdash; {err.ruleFailed}</span>
                    <button
                      className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => setValidationErrors(prev => prev.filter((_, idx) => idx !== i))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Remote Location input — shown for FTP and URL */}
            {isRemoteLocation && (
              <div className="flex flex-col gap-4 rounded border border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3 text-sm">
                  <FileText className="size-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {attributes.locationType === "FTP" ? "FTP Location" : "URL Location"}
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      Enter the {attributes.locationType === "FTP" ? "FTP path" : "external URL"} where your image files are located.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    External Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder={attributes.locationType === "FTP" ? "ftp://server.example.com/images/product.jpg" : "https://example.com/images/product.jpg"}
                    value={attributes.externalLocation}
                    onChange={(e) => setAttributes({...attributes, externalLocation: e.target.value})}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {attributes.locationType === "FTP" 
                      ? "Enter the full FTP path including server and file path"
                      : "Enter the full URL to the image file (must be publicly accessible)"}
                  </p>
                </div>
              </div>
            )}

            {/* Uploaded Files Preview - only shown for ACL (local uploads), not for FTP/URL */}
            {!isRemoteLocation && uploadedFiles.length > 0 && (
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium">
                  Uploaded Files ({uploadedFiles.length})
                </Label>
                <div className="grid gap-3 md:grid-cols-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group relative overflow-hidden rounded border border-border bg-background"
                    >
                      <div className="aspect-square bg-muted">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => openDownloadModal([file.id])}
                          className="rounded bg-primary p-1.5 text-white hover:bg-primary/90"
                          title="Download image"
                        >
                          <Download className="size-4" />
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="rounded bg-destructive p-1.5 text-white hover:bg-destructive/90"
                          title="Delete image"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="border-t border-border p-2">
                        <p className="truncate text-xs font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      {file.status === "complete" && (
                        <div className="absolute right-2 top-2 rounded-full bg-tg-success p-1">
                          <Check className="size-3 text-white" />
                        </div>
                      )}
                      {/* Error indicator (Change 5) */}
                      {file.status === "error" && (
                        <div className="absolute right-2 top-2 size-3 rounded-full bg-red-600" title="Upload error" />
                      )}
                    </div>
                  ))}
                  {/* Add More Placeholder */}
                  <label
                    htmlFor="file-upload-more"
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-border bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <Upload className="size-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add More</span>
                    <input
                      type="file"
                      accept="image/jpeg,.jpg,.jpeg"
                      multiple
                      className="hidden"
                      id="file-upload-more"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Attributes */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground">Set Image Attributes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure attributes for {uploadedFiles.length} uploaded image{uploadedFiles.length !== 1 ? "s" : ""}.
              </p>
            </div>

            {renderRichnessMeter()}

            {/* ── Optional: Extract Extended Attributes with AI (sub-section, not a numbered step) ── */}
            <div className="rounded border border-border bg-card">
              <div className="flex items-start gap-3 border-b border-border p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded bg-primary/10">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Extract Extended Attributes with AI</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Use AI to suggest GS1-style extended attributes from uploaded product images.
                  </p>
                </div>
                {aiSkipped && (
                  <Button variant="ghost" size="sm" onClick={() => setAiSkipped(false)}>
                    Show
                  </Button>
                )}
              </div>

              {/* Skipped message — files & manual form remain available */}
              {aiSkipped && (
                <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                  <Info className="size-4 shrink-0" />
                  <span>AI extraction skipped. You can continue entering attributes manually.</span>
                </div>
              )}

              {!aiSkipped && (
                <div className="flex flex-col gap-4 p-4">
                  {/* Idle / pre-extraction controls */}
                  {!hasExtraction && renderAiIdleControls(true)}

                  {/* Loading state */}
                  {isExtracting && (
                    <div className="flex items-center gap-3 rounded border border-border bg-muted/20 p-4">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <p className="text-sm text-foreground">
                        Analyzing {aiExtraction?.imageCount ?? uploadedFiles.length} image{(aiExtraction?.imageCount ?? uploadedFiles.length) !== 1 ? "s" : ""} together for {aiCategory} attributes…
                      </p>
                    </div>
                  )}

                  {/* Error state */}
                  {isError && (
                    <div className="flex flex-col gap-3 rounded border border-destructive/30 bg-destructive/5 p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">
                          {aiExtraction?.error ?? "Extraction failed. You can continue setting attributes manually."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={runExtraction}>Try again</Button>
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

            {/* Per-shot AI suggestions (P0.2b) — optional; proposes the fields the camera angle
                shows. Nothing is written to any image without an explicit Accept. */}
            {uploadedFiles.length > 0 && (
              <div className="rounded border border-border bg-card">
                <div className="flex items-start gap-3 border-b border-border p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded bg-primary/10">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">Suggest per-shot attributes with AI</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Proposes orientation, facing, angle, and a draft description for each image. Optional — accept or dismiss per image.
                    </p>
                  </div>
                  {shotSuggestions === null && !shotSuggestLoading && (
                    <Button variant="outline" size="sm" onClick={() => void runShotSuggestions()}>
                      Suggest for {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""}
                    </Button>
                  )}
                  {shotSuggestions !== null && shotSuggestions.some(s => s.status === "pending") && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => acceptShotSuggestions(shotSuggestions.filter(s => s.status === "pending"))}>
                      <Check className="size-3.5" />
                      Accept all ({shotSuggestions.filter(s => s.status === "pending").length})
                    </Button>
                  )}
                </div>
                {shotSuggestLoading && (
                  <div className="flex items-center gap-3 p-4">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <p className="text-sm text-foreground">Analyzing {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""} for per-shot attributes…</p>
                  </div>
                )}
                {shotSuggestions !== null && !shotSuggestLoading && (
                  <div className="flex flex-col divide-y divide-border">
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
            )}

            {/* P0.2a: product-wide fields are entered once; per-shot fields are always per image.
                With multiple files, the two-column layout with the image selector is the default. */}
            {uploadedFiles.length > 1 ? (
              <div className="flex gap-4">
                {/* Left column: thumbnail list ~25% */}
                <div className="w-1/4 flex flex-col gap-1 border border-border rounded overflow-hidden">
                  {/* Summary count badge — directions: "Summary count badge" */}
                  <div className="px-2 pt-2 pb-1">
                    {missingAttrCount > 0 ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-tg-warning/15 text-tg-warning">
                        {missingAttrCount} of {uploadedFiles.length} incomplete
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-tg-success/15 text-tg-success">
                        All {uploadedFiles.length} images ready
                      </span>
                    )}
                  </div>
                  {uploadedFiles.map((file, idx) => (
                    <button
                      key={file.id}
                      onClick={() => setActiveAttributeImageIndex(idx)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-2 text-left text-xs transition-colors border-l-2",
                        activeAttributeImageIndex === idx
                          ? "border-l-primary bg-primary/5 text-foreground"
                          : "border-l-transparent hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      <span className="shrink-0 text-muted-foreground w-4 text-right">{idx + 1}</span>
                      <div className="size-10 shrink-0 rounded border border-border overflow-hidden bg-muted">
                        {file.preview ? (
                          <img src={file.preview} alt="" className="size-full object-cover" />
                        ) : (
                          <FileImage className="size-5 text-muted-foreground m-auto mt-2" />
                        )}
                      </div>
                      <span className="truncate">{file.name.slice(0, 18)}</span>
                      {/* Per-row completion indicator: per-shot orientation is what varies per image */}
                      {attributesByImage[idx]?.orientation
                        ? <Check className="size-3.5 shrink-0 ml-auto text-tg-success" />
                        : <AlertCircle className="size-3.5 shrink-0 ml-auto text-tg-warning" />}
                    </button>
                  ))}
                </div>

                {/* Right column: attribute form */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Inline preview (Change 3c) */}
                  <div className="flex items-start gap-3">
                    <div className="size-24 shrink-0 rounded border border-border overflow-hidden bg-muted flex items-center justify-center">
                      {uploadedFiles[activeAttributeImageIndex]?.preview ? (
                        <img src={uploadedFiles[activeAttributeImageIndex].preview} alt="" className="size-full object-cover" />
                      ) : (
                        <FileImage className="size-8 text-muted-foreground" />
                      )}
                    </div>
                    {/* Copy per-shot values from another image */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground">Copy per-shot attributes from image:</p>
                      <Select
                        onValueChange={(val) => {
                          const srcIdx = parseInt(val)
                          const src = effectiveAttrs(srcIdx)
                          setAttributesByImage(prev => {
                            const rec = { ...(prev[activeAttributeImageIndex] ?? attributes) }
                            PER_SHOT_KEYS.forEach(k => { rec[k] = src[k] })
                            return { ...prev, [activeAttributeImageIndex]: rec }
                          })
                        }}
                      >
                        <SelectTrigger className="w-52 h-8 text-xs bg-background">
                          <SelectValue placeholder="Select image..." />
                        </SelectTrigger>
                        <SelectContent>
                          {uploadedFiles.map((f, i) => i !== activeAttributeImageIndex && (
                            <SelectItem key={i} value={String(i)}>
                              Image {i + 1}: {f.name.slice(0, 20)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Product-wide + active image's per-shot form */}
                  <StepTwoForm
                    currentAttrs={getCurrentAttributes()}
                    updateAttrs={updateCurrentAttributes}
                    uploadLevel={uploadLevel}
                    autoData={getAutoPopulatedData()}
                    measuredFiles={uploadedFiles[activeAttributeImageIndex]
                      ? [{ name: uploadedFiles[activeAttributeImageIndex].name, measured: uploadedFiles[activeAttributeImageIndex].measured }]
                      : []}
                    onApplyPerShotToAll={applyPerShotToAll}
                  />
                </div>
              </div>
            ) : (
              /* Single file (or remote/LMI with none staged): standard layout */
              <div className="flex flex-col gap-4">
                {/* Inline preview (Change 3c) */}
                {uploadedFiles.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="size-24 shrink-0 rounded border border-border overflow-hidden bg-muted flex items-center justify-center">
                      {uploadedFiles[activeAttributeImageIndex]?.preview ? (
                        <img src={uploadedFiles[activeAttributeImageIndex].preview} alt="" className="size-full object-cover" />
                      ) : (
                        <FileImage className="size-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Editing: {uploadedFiles[activeAttributeImageIndex]?.name}
                    </p>
                  </div>
                )}

                <StepTwoForm
                  currentAttrs={getCurrentAttributes()}
                  updateAttrs={updateCurrentAttributes}
                  uploadLevel={uploadLevel}
                  autoData={getAutoPopulatedData()}
                  measuredFiles={uploadedFiles.map(f => ({ name: f.name, measured: f.measured }))}
                />
              </div>
            )}

            {/* Per-image missing attributes hint (Change 2a) */}
            {missingAttrCount > 0 && (
              <p className="text-xs text-destructive">
                {missingAttrCount} of {uploadedFiles.length} images missing required attributes.
              </p>
            )}

            {/* Required Fields Note */}
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Required Attributes
            </p>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground">Review &amp; Confirm</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your upload details before submitting. Click &quot;Confirm &amp; Upload&quot; to proceed.
              </p>
            </div>

            {renderRichnessMeter()}

            {/* Target Selection Summary */}
            <div className="rounded border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Target Selection</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selection Code:</span>
                  <span className="font-medium text-foreground">{selectedSelectionCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium text-foreground">{selectedProduct}</span>
                </div>
                {uploadLevel === "product-color" && selectedColorCode && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Code:</span>
                    <span className="font-medium text-foreground">{selectedColorCode}</span>
                  </div>
                )}
                {uploadLevel === "gtin" && selectedGtin && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GTIN:</span>
                    <span className="font-medium text-foreground">{selectedGtin}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload Level:</span>
                  <span className="font-medium text-foreground">
                    {uploadLevel === "product" ? "Product" : uploadLevel === "product-color" ? "Product + Color Code" : "GTIN"}
                  </span>
                </div>
              </div>
            </div>

            {/* Files Summary */}
            <div className="rounded border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Files to Upload</h3>
                <div className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} &bull; {(uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB total
                </div>
              </div>
              
              {/* File thumbnail grid */}
              <div className="grid grid-cols-4 gap-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="rounded border border-border bg-muted/20 p-2">
                    <div className="aspect-square rounded bg-white mb-2 flex items-center justify-center overflow-hidden">
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="object-contain w-full h-full" />
                      ) : (
                        <FileImage className="size-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attributes Summary — product-wide once, then per-shot values per image (P0.2a) */}
            <div className="rounded border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Product-wide Attributes</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Image Type:</span>
                  <span className="font-medium text-foreground">
                    {IMAGE_TYPE_OPTIONS.find(o => o.value === attributes.imageType)?.label || attributes.imageType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose:</span>
                  <span className="font-medium text-foreground">
                    {PURPOSE_OPTIONS.find(o => o.value === attributes.purpose)?.label || attributes.purpose}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location Type:</span>
                  <span className="font-medium text-foreground">
                    {attributes.locationType || "ACL"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Image Style:</span>
                  <span className="font-medium text-foreground">
                    {IMAGE_STYLE_OPTIONS.find(o => o.value === attributes.imageStyle)?.label || attributes.imageStyle || "—"}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-3">Per-shot Attributes</h3>
              <div className="max-h-48 overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-foreground">File</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Orientation</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Facing</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Angle</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedFiles.map((file, idx) => {
                      const imgAttrs = effectiveAttrs(idx)
                      return (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-3 py-2 text-foreground truncate max-w-[150px]" title={file.name}>{file.name}</td>
                          <td className="px-3 py-2 text-foreground">
                            {ORIENTATION_OPTIONS.find(o => o.value === imgAttrs.orientation)?.label || imgAttrs.orientation || "—"}
                          </td>
                          <td className="px-3 py-2 text-foreground">
                            {FACING_OPTIONS.find(o => o.value === imgAttrs.facing)?.label || imgAttrs.facing || "—"}
                          </td>
                          <td className="px-3 py-2 text-foreground">
                            {ANGLE_OPTIONS.find(o => o.value === imgAttrs.angle)?.label || imgAttrs.angle || "—"}
                          </td>
                          <td className="px-3 py-2 text-foreground truncate max-w-[180px]" title={imgAttrs.imageDescription}>
                            {imgAttrs.imageDescription || "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI-Extracted Product Attributes — product-level, shown once (not per image) */}
            {acceptedExtractedAttributes.length > 0 && aiExtraction && (
              <div className="rounded border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">AI-Extracted Product Attributes</h3>
                </div>
                <AiAttributesTable
                  attributes={acceptedExtractedAttributes}
                  category={aiExtraction.category}
                  brickName={aiExtraction.brickName}
                  brickCode={aiExtraction.brickCode}
                  imageCount={aiExtraction.imageCount}
                  imageNames={aiExtraction.imageNames}
                />
              </div>
            )}

            {/* Pending-suggestion interlock (P0.3): AI suggestions that were generated but never
                accepted are dropped at submission — make that a visible decision, not a default. */}
            {pendingExtractedCount > 0 && (
              <div className="rounded border border-tg-warning/40 bg-tg-warning/5 p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-4 text-tg-warning mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      {pendingExtractedCount} AI-suggested attribute{pendingExtractedCount !== 1 ? "s are" : " is"} still pending review
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pending suggestions will <span className="font-medium text-foreground">not</span> be submitted unless accepted. Accept them now, or go back to review them individually.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Button variant="outline" size="sm" className="gap-1" onClick={acceptAllPending}>
                    <Check className="size-3.5" />
                    Accept all {pendingExtractedCount}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    Review suggestions
                  </Button>
                </div>
              </div>
            )}

            {/* Syndication confirmation block — Task 2 */}
            {(() => {
              const d = getAutoPopulatedData()
              return (
                <div className="rounded border border-primary/30 bg-primary/5 p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Info className="size-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">Submitting will share these images with retailer subscribers</p>
                      <p className="text-sm text-foreground">
                        7 retailers currently access selection code {d.selectionCode} where Product {d.productId}/GTINs reside. Confirming will make {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""} available to those retailers on the next sync.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <Checkbox
                      id="syndication-ack"
                      checked={syndicationAcknowledged}
                      onCheckedChange={(v) => setSyndicationAcknowledged(v as boolean)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-sm text-foreground">
                      I confirm I want to share these images with the 7 subscribing retailers on selection code {d.selectionCode}.
                    </span>
                  </label>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between rounded border border-border bg-card p-4">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="gap-1">
              <ChevronLeft className="size-4" />
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !canProceedStep2) ||
              (currentStep === 2 && !canProceedStep3) ||
              (currentStep === 3 && !syndicationAcknowledged)
            }
            className="gap-1"
          >
            {currentStep === 3 ? (
              <>
                <Upload className="size-4" />
                Confirm &amp; Upload
              </>
            ) : (
              <>
                Next
                <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {renderDownloadModal()}
    </div>
  )
}
