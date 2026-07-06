"use client"

import { useState, useCallback } from "react"
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check,
  Trash2,
  FileImage,
  Download,
  FileText,
  CheckCircle2,
  Info,
  Pencil,
  AlertCircle,
  Sparkles,
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
import { measureImageFile } from "./image-metadata"
import type { UploadedFile } from "./uploaded-file"
import { buildImageMetadataCsv, downloadCsv, csvPreview, type ImageMetadataRow } from "./metadata-csv"
import { toast } from "@/hooks/use-toast"
import { useMediaSelection } from "./use-media-selection"
import { AiAttributesTable } from "./ai-attributes-table"
import { AiSection } from "./ai-section"
import { DownloadModal } from "./download-modal"
import { StepTwoForm, PER_SHOT_KEYS, isPerShotKey } from "./step-two-form"
import { useAiAttributes } from "./use-ai-attributes"
import {
  ORIENTATION_OPTIONS,
  ANGLE_OPTIONS,
  IMAGE_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  FACING_OPTIONS,
  IMAGE_STYLE_OPTIONS,
} from "./attribute-options"

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

  // All AI/classification state and handlers (extraction, per-shot suggestion, brick
  // classification) live in this shared hook. The whole return value is handed to <AiSection>
  // as one prop; the wizard body itself only needs the few values destructured below (file
  // deletion resets, Review-step gating, the "reset AI" action, and Step 3 summaries).
  const ai = useAiAttributes({ uploadedFiles, attributes, setAttributesByImage, getAutoPopulatedData })
  const {
    setAiCategory, setAiBrick, aiExtraction,
    setClassificationStatus, setClassificationConfidence,
    clearExtraction, clearShotSuggestions,
    isComplete, hasExtraction, acceptedExtractedAttributes,
    pendingExtractedCount, acceptAllPending,
  } = ai

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
    setClassificationStatus("idle") // re-confirm against the updated file set before re-running
    setClassificationConfidence(null)
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
    setClassificationStatus("idle") // re-confirm against the updated file set before re-running
    setClassificationConfidence(null)
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
                          setClassificationStatus("idle") // re-confirm against the replacement image
                          setClassificationConfidence(null)
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
              {/* P1.2/P1.1: the same classification-first, consolidated AI flow as Step 2 — no
                  skip affordance here (images are already submitted; nothing to skip past). */}
              {uploadedFiles.length > 0 ? <AiSection ai={ai} uploadedFiles={uploadedFiles} /> : <AiAttributesTable attributes={[]} />}
            </div>
          </SheetContent>
        </Sheet>

        <DownloadModal
          open={showDownloadModal}
          phase={downloadPhase}
          uploadedFiles={uploadedFiles}
          isChecked={media.isChecked}
          uploadLevel={uploadLevel}
          autoData={getAutoPopulatedData()}
          lastCsvPreview={lastCsvPreview}
          onClose={() => setShowDownloadModal(false)}
          onDownload={handleBulkDownload}
        />
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
                    // product context changed: drop stale product-level extraction and classification
                    clearExtraction()
                    clearShotSuggestions()
                    setAiCategory("")
                    setAiBrick(null)
                    setClassificationStatus("idle")
                    setClassificationConfidence(null)
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

            {<AiSection ai={ai} uploadedFiles={uploadedFiles} />}

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
                  flatten
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

      <DownloadModal
        open={showDownloadModal}
        phase={downloadPhase}
        uploadedFiles={uploadedFiles}
        isChecked={media.isChecked}
        uploadLevel={uploadLevel}
        autoData={getAutoPopulatedData()}
        lastCsvPreview={lastCsvPreview}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleBulkDownload}
      />
    </div>
  )
}
