"use client"

import { useState, useCallback } from "react"
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check,
  ChevronDown,
  Trash2,
  FileImage,
  ZoomIn,
  Download,
  Printer,
  Package,
  FileText,
  CheckCircle2,
  Info,
  Pencil,
  RefreshCw,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { validateImageBatch, type ValidationError } from "./upload-validation"

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
    { code: "001", description: "dresses" },
    { code: "002", description: "tops" },
    { code: "003", description: "Dresses" },
    { code: "004", description: "Womens Jeans" },
    { code: "005", description: "Footwear" },
  ],
  products: [
    { 
      id: "1TESTPROD1", 
      description: "1TESTPROD1 Desc", 
      gtins: [
        { gtin: "574211012895", type: "UA" },
        { gtin: "574211012901", type: "EA" },
        { gtin: "574211012918", type: "CS" },
      ] 
    },
    { 
      id: "TESTPROD2", 
      description: "Summer Floral Dress", 
      gtins: [
        { gtin: "00123456789013", type: "UA" },
        { gtin: "00123456789023", type: "EA" },
      ] 
    },
    { 
      id: "B11442", 
      description: "Boon DESERT Drying Rack", 
      gtins: [
        { gtin: "00123456789014", type: "UA" },
      ] 
    },
    { 
      id: "TESTPROD4", 
      description: "Classic Denim Jacket", 
      gtins: [
        { gtin: "00123456789015", type: "UA" },
        { gtin: "00123456789025", type: "EA" },
        { gtin: "00123456789035", type: "CS" },
        { gtin: "00123456789045", type: "PK" },
      ] 
    },
    { 
      id: "TESTPROD5", 
      description: "Cotton Blend Cardigan", 
      gtins: [
        { gtin: "00123456789016", type: "UA" },
        { gtin: "00123456789026", type: "EA" },
      ] 
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
const ORIENTATION_OPTIONS = [
  { value: "PRI", label: "PRI-Primary" },
  { value: "SDL", label: "SDL-Side Left" },
  { value: "SDR", label: "SDR-Side Right" },
  { value: "VF1", label: "VF1-Front" },
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

const LOCATION_TYPE_OPTIONS = [
  { value: "URL", label: "URL" },
  { value: "FTP", label: "FTP" },
  { value: "ACL", label: "ACL" },
]

const FACING_OPTIONS = [
  { value: "1", label: "1-Front" },
  { value: "2", label: "2-Back" },
  { value: "3", label: "3-Left" },
  { value: "4", label: "4-Right" },
  { value: "5", label: "5-Top" },
  { value: "6", label: "6-Bottom" },
]

const IMAGE_STYLE_OPTIONS = [
  { value: "STD", label: "Standard" },
  { value: "EDI", label: "Editorial" },
  { value: "MOD", label: "Model Shot" },
  { value: "FLT", label: "Flat Lay" },
]

type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  preview: string
  status: "uploading" | "complete" | "error"
}

// Extracted attribute form used in Step 2 and Edit-attributes dialog (Change 3 / Change 7)
type StepTwoFormProps = {
  currentAttrs: {
    imageType: string; purpose: string; orientation: string; locationType: string;
    externalLocation: string; imageStyle: string; facing: string; angle: string;
    clippingPath: string; imageDescription: string; pixelDensity: string; height: string; width: string;
  }
  updateAttrs: (a: StepTwoFormProps["currentAttrs"]) => void
  advancedOpen: boolean
  setAdvancedOpen: (v: boolean) => void
  uploadLevel: "product" | "product-color" | "gtin"
  autoData: { colorCode: string; selectedGtin: string }
}

function StepTwoForm({ currentAttrs, updateAttrs, advancedOpen, setAdvancedOpen, uploadLevel, autoData }: StepTwoFormProps) {
  return (
    <div className="flex flex-col gap-4">
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

      {/* Required section header (Change 3a) */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground">Required</span>
        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">Required</span>
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

      <div className="border-t border-border" />

      {/* Optional attributes disclosure (8 fields) (Change 3a) */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded border border-border bg-muted/30 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50">
            <ChevronDown className={cn("size-4 transition-transform", advancedOpen && "rotate-180")} />
            {advancedOpen ? "Optional attributes (8) — collapse" : "Optional attributes (8) — expand"}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 grid gap-4 rounded border border-border bg-background p-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Image Style</Label>
              <Select value={currentAttrs.imageStyle} onValueChange={(v) => updateAttrs({ ...currentAttrs, imageStyle: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select style..." /></SelectTrigger>
                <SelectContent>{IMAGE_STYLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Facing (GDSN)</Label>
              <Select value={currentAttrs.facing} onValueChange={(v) => updateAttrs({ ...currentAttrs, facing: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select facing..." /></SelectTrigger>
                <SelectContent>{FACING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Angle</Label>
              <Select value={currentAttrs.angle} onValueChange={(v) => updateAttrs({ ...currentAttrs, angle: v })}>
                <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select angle..." /></SelectTrigger>
                <SelectContent>{ANGLE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Clipping Path</Label>
              <Input value={currentAttrs.clippingPath} onChange={(e) => updateAttrs({ ...currentAttrs, clippingPath: e.target.value })} placeholder="Path name..." className="bg-background" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-sm font-medium">Image Description</Label>
              <Input value={currentAttrs.imageDescription} onChange={(e) => updateAttrs({ ...currentAttrs, imageDescription: e.target.value })} placeholder="Enter description..." className="bg-background" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Pixel Density (DPI)</Label>
              <Input value={currentAttrs.pixelDensity} onChange={(e) => updateAttrs({ ...currentAttrs, pixelDensity: e.target.value })} placeholder="e.g. 300" className="bg-background" type="number" min="1" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Height (px)</Label>
              <Input value={currentAttrs.height} onChange={(e) => updateAttrs({ ...currentAttrs, height: e.target.value })} placeholder="e.g. 2400" className="bg-background" type="number" min="1" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Width (px)</Label>
              <Input value={currentAttrs.width} onChange={(e) => updateAttrs({ ...currentAttrs, width: e.target.value })} placeholder="e.g. 2400" className="bg-background" type="number" min="1" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
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
  const [selectedSelectionCode, setSelectedSelectionCode] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedColorCode, setSelectedColorCode] = useState("")
  const [selectedGtin, setSelectedGtin] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [applyToAll, setApplyToAll] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [showProductMedia, setShowProductMedia] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  // Inline validation errors from file drop/browse (Change 1)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  // Submission phase for progress card (Change 4)
  const [submissionPhase, setSubmissionPhase] = useState<"idle" | "uploading" | "complete" | "partial-failure">("idle")
  // Per-file submission status (Change 4)
  const [fileStatuses, setFileStatuses] = useState<{ [id: string]: "queued" | "uploading" | "processing" | "complete" | "failed" }>({})
  // Edit-attributes dialog state (Change 7)
  const [editAttrDialog, setEditAttrDialog] = useState<{ open: boolean; fileIndex: number; draft: typeof attributes }>({ open: false, fileIndex: 0, draft: {} as typeof attributes })
  // Replace-file dialog state (Change 7)
  const [replaceFileDialog, setReplaceFileDialog] = useState<{ open: boolean; fileIndex: number; pendingFile: File | null; confirmed: boolean }>({ open: false, fileIndex: 0, pendingFile: null, confirmed: false })
  
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
    pixelDensity: "",
    height: "",
    width: "",
  })
  
  // Per-image attributes (when applyToAll is false)
  const [attributesByImage, setAttributesByImage] = useState<{ [key: number]: typeof attributes }>({})
  const [activeAttributeImageIndex, setActiveAttributeImageIndex] = useState(0)

  const steps = [
    { number: 1, title: "Target & Files", description: "Select target and upload files" },
    { number: 2, title: "Attributes", description: "Set image attributes" },
    { number: 3, title: "Review & Confirm", description: "Review and submit" },
  ]

  // Helper function to get current attributes based on mode
  const getCurrentAttributes = () => {
    if (applyToAll) {
      return attributes
    } else {
      return attributesByImage[activeAttributeImageIndex] || attributes
    }
  }

  // Helper function to update current attributes
  const updateCurrentAttributes = (newAttrs: typeof attributes) => {
    if (applyToAll) {
      setAttributes(newAttrs)
    } else {
      setAttributesByImage(prev => ({
        ...prev,
        [activeAttributeImageIndex]: newAttrs
      }))
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Validates files and stages valid ones; appends errors for invalid ones
  const processFiles = useCallback(async (rawFiles: File[]) => {
    const { valid, errors } = await validateImageBatch(rawFiles)
    if (errors.length > 0) {
      setValidationErrors(prev => {
        const newErrors = errors.filter(e => !prev.some(p => p.fileName === e.fileName))
        return [...prev, ...newErrors]
      })
    }
    if (valid.length === 0) return
    const newFiles: UploadedFile[] = valid.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: "complete" as const,
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [processFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
    e.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // Generate metadata text content for a file
  const generateMetadataContent = (file: UploadedFile, index: number) => {
    const data = getAutoPopulatedData()
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    })
    
    let content = `IMAGE METADATA EXPORT
========================================
Export Date: ${currentDate}
Level: ${uploadLevel === "product" ? "Product Level" : uploadLevel === "gtin" ? "Item Level (GTIN)" : "Product + Color Code Level"}

COMPANY INFORMATION
----------------------------------------
Company Name:        ${data.companyName}
Account Number:      ${data.accountNumber}
Selection Code:      ${data.selectionCode}
Description:         ${data.description}
Product:             ${data.productId}
Product Description: ${data.productDescription}`

    if (uploadLevel === "gtin") {
      content += `
GTIN:                ${data.selectedGtin}
GTIN Type:           ${data.selectedGtinType}`
    }

    if (uploadLevel === "product-color") {
      content += `
Color Code:          ${data.colorCode}
Color Name:          ${data.colorName}`
    }

    // resolve per-image attrs if applicable
    const fileAttrs = applyToAll ? attributes : (attributesByImage[index] || attributes)
    const imageLevelLabel = uploadLevel === "product"
      ? "Product Level"
      : uploadLevel === "gtin"
      ? "Item Level (GTIN)"
      : "Product + Color Code Level"

    content += `

FILE INFORMATION
----------------------------------------
File Name:           ${file.name}
File Type:           ${file.type || "JPG-JPEG"}
File Size:           ${formatFileSize(file.size)}

IMAGE ATTRIBUTES
----------------------------------------
Image Level:         ${imageLevelLabel}
Color Code:          ${data.colorCode || (uploadLevel === "gtin" ? data.selectedGtin : "N/A")}
Image Type:          ${IMAGE_TYPE_OPTIONS.find(o => o.value === fileAttrs.imageType)?.label || "SI-Still Shot"}
Purpose:             ${PURPOSE_OPTIONS.find(o => o.value === fileAttrs.purpose)?.label || "INT-Internet"}
Orientation:         ${ORIENTATION_OPTIONS.find(o => o.value === fileAttrs.orientation)?.label || "Not specified"}
Location Type:       ${LOCATION_TYPE_OPTIONS.find(o => o.value === fileAttrs.locationType)?.label || "Not specified"}
External Location:   ${fileAttrs.externalLocation || "N/A"}
Pixel Density (DPI): ${fileAttrs.pixelDensity || "N/A"}
Height:              ${fileAttrs.height || "N/A"}
Width:               ${fileAttrs.width || "N/A"}
Image Style:         ${IMAGE_STYLE_OPTIONS.find(o => o.value === fileAttrs.imageStyle)?.label || "Not specified"}
Facing (GDSN):       ${FACING_OPTIONS.find(o => o.value === fileAttrs.facing)?.label || "Not specified"}
Angle:               ${ANGLE_OPTIONS.find(o => o.value === fileAttrs.angle)?.label || "Not specified"}
Clipping Path:       ${fileAttrs.clippingPath || "N/A"}
Image Description:   ${fileAttrs.imageDescription || "N/A"}

DATES
----------------------------------------
Create Date:         ${currentDate}
Last Update Date:    ${currentDate}

========================================
End of Metadata Export
`
    return content
  }

  // Handle bulk download
  const handleBulkDownload = () => {
    // Simulate download process
    setDownloadComplete(true)
  }

  // Read locationType from the active record for consistency (Change 2b)
  const isRemoteLocation = getCurrentAttributes().locationType === "FTP" || getCurrentAttributes().locationType === "URL"
  const canProceedStep2 = selectedSelectionCode && selectedProduct && getCurrentAttributes().locationType &&
    (isRemoteLocation || uploadedFiles.length > 0) &&
    (uploadLevel === "product" || 
     (uploadLevel === "product-color" && selectedColorCode) ||
     (uploadLevel === "gtin" && selectedGtin))
  // In per-image mode, require every file to have all required attrs set (Change 2a)
  const missingAttrCount = (() => {
    if (applyToAll) return 0
    return uploadedFiles.filter((_, i) => {
      const a = attributesByImage[i]
      return !a?.imageType || !a?.purpose || !a?.orientation
    }).length
  })()
  const canProceedStep3 = applyToAll
    ? !!(getCurrentAttributes().imageType && getCurrentAttributes().purpose && getCurrentAttributes().orientation)
    : missingAttrCount === 0 && uploadedFiles.length > 0

  // Simulates per-file upload progression (Change 4)
  const simulateSubmission = useCallback(() => {
    const ids = uploadedFiles.map(f => f.id)
    const failIndex = uploadedFiles.length >= 3 ? Math.floor(uploadedFiles.length / 2) : -1
    const initial: typeof fileStatuses = {}
    ids.forEach(id => { initial[id] = "queued" })
    setFileStatuses(initial)
    setSubmissionPhase("uploading")

    ids.forEach((id, i) => {
      const base = i * 800
      setTimeout(() => setFileStatuses(prev => ({ ...prev, [id]: "uploading" })), base + 100)
      setTimeout(() => setFileStatuses(prev => ({ ...prev, [id]: "processing" })), base + 400)
      setTimeout(() => {
        setFileStatuses(prev => ({ ...prev, [id]: i === failIndex ? "failed" : "complete" }))
        if (i === ids.length - 1) {
          setTimeout(() => {
            const hasFailure = failIndex >= 0
            setSubmissionPhase(hasFailure ? "partial-failure" : "complete")
            if (!hasFailure) {
              setTimeout(() => setShowProductMedia(true), 500)
            }
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

        {/* Toolbar */}
        <div className="flex items-center gap-1 border border-border bg-card p-1 w-fit">
          <button className="p-1.5 hover:bg-muted border border-border" title="View">
            <ZoomIn className="size-4 text-muted-foreground" />
          </button>
          <button 
            className="p-1.5 hover:bg-muted border border-border" 
            title="Download All"
            onClick={() => {
              setDownloadComplete(false)
              setShowDownloadModal(true)
            }}
          >
            <Download className="size-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted border border-border" title="Print">
            <Printer className="size-4 text-muted-foreground" />
          </button>
          {/* Edit attributes (Change 7) */}
          <button
            className="p-1.5 hover:bg-muted border border-border"
            title="Edit attributes"
            onClick={() => {
              const curAttrs = applyToAll ? attributes : (attributesByImage[activeImageIndex] || attributes)
              setEditAttrDialog({ open: true, fileIndex: activeImageIndex, draft: { ...curAttrs } })
            }}
          >
            <Pencil className="size-4 text-muted-foreground" />
          </button>
          {/* Replace file (Change 7) */}
          <button
            className="p-1.5 hover:bg-muted border border-border"
            title="Replace file"
            onClick={() => setReplaceFileDialog({ open: true, fileIndex: activeImageIndex, pendingFile: null, confirmed: false })}
          >
            <RefreshCw className="size-4 text-muted-foreground" />
          </button>
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

        {/* Main Content - Two Panel Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Panel - Image Attributes Table */}
          <div className="border border-border bg-card">
            {/* Panel Header */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-1 border border-border bg-card p-0.5">
                <button className="p-1 hover:bg-muted" title="Add">
                  <Download className="size-3 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted" title="Edit">
                  <FileImage className="size-3 text-muted-foreground" />
                </button>
              </div>
              <span className="text-sm font-medium text-tg-link">
                {uploadLevel === "product" 
                  ? "Product Level Image" 
                  : uploadLevel === "gtin"
                  ? "Item Level Image"
                  : "Product + Color Code Level Image"}
              </span>
            </div>

            {/* Attributes Table */}
            {(() => {
              const activeFile = uploadedFiles[activeImageIndex]
              const activeAttrs = applyToAll ? attributes : (attributesByImage[activeImageIndex] || attributes)
              const imageLevelLabel = uploadLevel === "product"
                ? "Product Level"
                : uploadLevel === "gtin"
                ? "Item Level (GTIN)"
                : "Product + Color Code Level"
              return (
                <div className="text-sm">
                  {/* Image Level - always shown, read-only derived from upload level */}
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Image Level:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{imageLevelLabel}</div>
                  </div>
                  {/* Color Code - only shown for product-color level */}
                  {uploadLevel === "product-color" && (
                    <div className="flex border-b border-border">
                      <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Color Code:</div>
                      <div className="flex-1 px-3 py-2 text-foreground">{data.colorCode}</div>
                    </div>
                  )}
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">File Name:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeFile?.name || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">File Type:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeFile?.type || "JPG-JPEG"}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">File Size:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeFile ? formatFileSize(activeFile.size) : ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-tg-link">Image Type:</div>
                    <div className="flex-1 px-3 py-2 text-tg-link">
                      {IMAGE_TYPE_OPTIONS.find(o => o.value === activeAttrs.imageType)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Purpose:</div>
                    <div className="flex-1 px-3 py-2 text-tg-link">
                      {PURPOSE_OPTIONS.find(o => o.value === activeAttrs.purpose)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Orientation:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">
                      {ORIENTATION_OPTIONS.find(o => o.value === activeAttrs.orientation)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Location Type:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">
                      {LOCATION_TYPE_OPTIONS.find(o => o.value === activeAttrs.locationType)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">External Location:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.externalLocation || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Pixel Density (DPI):</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.pixelDensity || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Height:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.height || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Width:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.width || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Image Style:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">
                      {IMAGE_STYLE_OPTIONS.find(o => o.value === activeAttrs.imageStyle)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Facing (GDSN):</div>
                    <div className="flex-1 px-3 py-2 text-foreground">
                      {FACING_OPTIONS.find(o => o.value === activeAttrs.facing)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Angle:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">
                      {ANGLE_OPTIONS.find(o => o.value === activeAttrs.angle)?.label || ""}
                    </div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Clipping Path:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.clippingPath || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Image Description:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{activeAttrs.imageDescription || ""}</div>
                  </div>
                  <div className="flex border-b border-border">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Create Date:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
                  </div>
                  <div className="flex">
                    <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">Last Update Date:</div>
                    <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Right Panel - Image Preview */}
          <div className="border border-border bg-card flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-1 border border-border bg-card p-0.5">
                <button className="p-1 hover:bg-muted" title="Zoom In">
                  <ZoomIn className="size-3 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => {
                    if (uploadedFiles[activeImageIndex]) {
                      const link = document.createElement('a')
                      link.href = uploadedFiles[activeImageIndex].preview
                      link.download = uploadedFiles[activeImageIndex].name
                      link.click()
                    }
                  }}
                  className="p-1 hover:bg-muted" 
                  title="Download current image"
                >
                  <Download className="size-3 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted" title="Edit">
                  <FileImage className="size-3 text-muted-foreground" />
                </button>
              </div>
              {uploadedFiles.length > 1 && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {activeImageIndex + 1} / {uploadedFiles.length}
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[400px] bg-white">
              {uploadedFiles[activeImageIndex] ? (
                <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                  <img 
                    src={uploadedFiles[activeImageIndex].preview} 
                    alt="Uploaded product" 
                    className="max-w-full max-h-[320px] object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded">
                  <FileImage className="size-16 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Image Preview</p>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {uploadedFiles.length > 1 && (
              <div className="border-t border-border bg-muted/20 p-2">
                <div className="flex gap-2 overflow-x-auto">
                  {uploadedFiles.map((file, idx) => (
                    <button
                      key={file.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "flex-shrink-0 rounded border-2 overflow-hidden transition-all",
                        activeImageIndex === idx 
                          ? "border-primary" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img
                        src={file.preview}
                        alt={`Image ${idx + 1}`}
                        className="size-16 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Attributes Dialog (Change 7) */}
        <Dialog open={editAttrDialog.open} onOpenChange={(o) => setEditAttrDialog(prev => ({ ...prev, open: o }))}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit attributes &mdash; {uploadedFiles[editAttrDialog.fileIndex]?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <StepTwoForm
                currentAttrs={editAttrDialog.draft}
                updateAttrs={(newAttrs) => setEditAttrDialog(prev => ({ ...prev, draft: newAttrs }))}
                advancedOpen={advancedOpen}
                setAdvancedOpen={setAdvancedOpen}
                uploadLevel={uploadLevel}
                autoData={getAutoPopulatedData()}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setEditAttrDialog(prev => ({ ...prev, open: false }))}>Cancel</Button>
              <Button onClick={() => {
                if (applyToAll) {
                  setAttributes(editAttrDialog.draft)
                } else {
                  setAttributesByImage(prev => ({ ...prev, [editAttrDialog.fileIndex]: editAttrDialog.draft }))
                }
                setEditAttrDialog(prev => ({ ...prev, open: false }))
              }}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Replace File Dialog (Change 7) */}
        <Dialog open={replaceFileDialog.open} onOpenChange={(o) => setReplaceFileDialog(prev => ({ ...prev, open: o, pendingFile: null, confirmed: false }))}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Replace file</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              {!replaceFileDialog.pendingFile ? (
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault()
                    const f = e.dataTransfer.files[0]
                    if (!f) return
                    const { errors } = await validateImageBatch([f])
                    if (errors.length) { setValidationErrors(prev => [...prev, ...errors]); return }
                    setReplaceFileDialog(prev => ({ ...prev, pendingFile: f }))
                  }}
                >
                  <Upload className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">Drop a replacement file here</p>
                  <label>
                    <input type="file" accept="image/jpeg,.jpg,.jpeg" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      const { errors } = await validateImageBatch([f])
                      if (errors.length) { setValidationErrors(prev => [...prev, ...errors]); return }
                      setReplaceFileDialog(prev => ({ ...prev, pendingFile: f }))
                    }} />
                    <Button variant="outline" size="sm" asChild><span className="cursor-pointer">Browse</span></Button>
                  </label>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-foreground">
                    Replace <span className="font-medium">{uploadedFiles[replaceFileDialog.fileIndex]?.name}</span> with{" "}
                    <span className="font-medium">{replaceFileDialog.pendingFile.name}</span>?
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setReplaceFileDialog(prev => ({ ...prev, pendingFile: null }))}>Cancel</Button>
                    <Button onClick={() => {
                      const f = replaceFileDialog.pendingFile!
                      const newFile: UploadedFile = {
                        id: uploadedFiles[replaceFileDialog.fileIndex].id,
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        preview: URL.createObjectURL(f),
                        status: "complete",
                      }
                      setUploadedFiles(prev => prev.map((u, i) => i === replaceFileDialog.fileIndex ? newFile : u))
                      setReplaceFileDialog({ open: false, fileIndex: 0, pendingFile: null, confirmed: false })
                    }}>Replace</Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowProductMedia(false)
              setCurrentStep(2)
            }}
          >
            Upload More Images
          </Button>
          <Button onClick={onComplete}>
            Return to Image Upload
          </Button>
        </div>

        {/* Download Modal */}
        {showDownloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded border border-border bg-card shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-tg-header-start to-tg-header-end px-4 py-3">
                <h2 className="text-base font-semibold text-white">Download Images with Metadata</h2>
                <button 
                  onClick={() => setShowDownloadModal(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {!downloadComplete ? (
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
                            <span className="font-medium text-foreground">{uploadedFiles.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Files to Download */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-foreground mb-3">Package Contents:</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
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
                              <div className="flex items-center gap-2 mt-0.5">
                                <FileText className="size-4 text-tg-success shrink-0" />
                                <span className="text-sm text-muted-foreground truncate">
                                  {file.name.replace(/\.[^/.]+$/, "")}_metadata.txt
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground shrink-0">
                              <div>{formatFileSize(file.size)}</div>
                              <div>~2 KB</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Info Note */}
                    <div className="mb-6 flex items-start gap-2 rounded bg-primary/5 p-3 text-sm">
                      <FileText className="size-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Metadata files (.txt)</span>
                        <span className="text-muted-foreground"> contain all image attributes including company info, product details, file properties, and GDSN attributes for each image.</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowDownloadModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBulkDownload}>
                        <Download className="size-4 mr-2" />
                        Download All ({uploadedFiles.length * 2} files)
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Download Complete State */
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
                        {uploadedFiles.map((file, index) => (
                          <div key={file.id} className="text-sm">
                            <div className="flex items-center gap-2 text-foreground">
                              <Check className="size-4 text-tg-success" />
                              <span>{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground ml-6">
                              <Check className="size-4 text-tg-success" />
                              <span>{file.name.replace(/\.[^/.]+$/, "")}_metadata.txt</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Metadata Preview */}
                    <div className="rounded border border-border bg-card p-4 mb-6 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Metadata Preview</span>
                        <span className="text-xs text-muted-foreground">
                          {uploadedFiles[0]?.name.replace(/\.[^/.]+$/, "") || "image"}_metadata.txt
                        </span>
                      </div>
                      <pre className="text-xs text-muted-foreground bg-muted/30 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto font-mono">
{uploadedFiles[0] ? generateMetadataContent(uploadedFiles[0], 0) : "No metadata available"}
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
        )}
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
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-tg-link hover:underline cursor-pointer">Data Management</span>
          <span className="text-muted-foreground">&gt;</span>
          <span className="font-medium text-foreground">Submitting</span>
        </div>
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Submitting images</h2>

            {/* Per-file status list (Change 5 error surface included) */}
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
                          setTimeout(() => setShowProductMedia(true), 500)
                        }, 800)
                      }}>Retry</Button>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Retry-all summary (Change 5) */}
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
                    setTimeout(() => setShowProductMedia(true), 500)
                  }, 1000)
                }}>retry all</button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{completedCount} of {uploadedFiles.length} complete</p>

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
            Step {currentStep} of 3: {steps[currentStep - 1].description}
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
                {currentStep > step.number ? <Check className="size-4" /> : step.number}
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
              <div className="grid gap-3 md:grid-cols-3">
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
                    JPG / JPEG &middot; Max 500 KB each &middot; 2400&ndash;4800 px &middot; 1:1 &middot; 300 ppi
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
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = file.preview
                            link.download = file.name
                            link.click()
                          }}
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

            {/* Apply to All Checkbox with badge (Change 3b) */}
            <div className="flex items-center gap-2 rounded border border-border bg-muted/30 p-3">
              <Checkbox
                id="apply-all"
                checked={applyToAll}
                onCheckedChange={(checked) => {
                  setApplyToAll(checked as boolean)
                  setActiveAttributeImageIndex(0)
                }}
              />
              <label htmlFor="apply-all" className="text-sm font-medium text-foreground cursor-pointer">
                Apply same attributes to all {uploadedFiles.length} images
              </label>
              <span className="ml-auto text-xs text-muted-foreground">
                {applyToAll
                  ? `Applied to ${uploadedFiles.length} images`
                  : `Per-image — editing ${activeAttributeImageIndex + 1} of ${uploadedFiles.length}`}
              </span>
            </div>

            {/* Two-column per-image layout (Change 3b) — only when applyToAll=false and multiple files */}
            {!applyToAll && uploadedFiles.length > 1 ? (
              <div className="flex gap-4">
                {/* Left column: thumbnail list ~25% */}
                <div className="w-1/4 flex flex-col gap-1 border border-border rounded overflow-hidden">
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
                    {/* Copy from another image dropdown */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground">Copy attributes from image:</p>
                      <Select
                        onValueChange={(val) => {
                          const srcIdx = parseInt(val)
                          const srcAttrs = attributesByImage[srcIdx] || attributes
                          setAttributesByImage(prev => ({ ...prev, [activeAttributeImageIndex]: { ...srcAttrs } }))
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

                  {/* Required section */}
                  <StepTwoForm
                    currentAttrs={getCurrentAttributes()}
                    updateAttrs={updateCurrentAttributes}
                    advancedOpen={advancedOpen}
                    setAdvancedOpen={setAdvancedOpen}
                    uploadLevel={uploadLevel}
                    autoData={getAutoPopulatedData()}
                  />
                </div>
              </div>
            ) : (
              /* applyToAll or single file: standard layout */
              <div className="flex flex-col gap-4">
                {/* Inline preview (Change 3c) — shows first file */}
                {uploadedFiles.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="size-24 shrink-0 rounded border border-border overflow-hidden bg-muted flex items-center justify-center">
                      {uploadedFiles[applyToAll ? 0 : activeAttributeImageIndex]?.preview ? (
                        <img src={uploadedFiles[applyToAll ? 0 : activeAttributeImageIndex].preview} alt="" className="size-full object-cover" />
                      ) : (
                        <FileImage className="size-8 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {applyToAll ? `Preview of first file — attributes apply to all ${uploadedFiles.length}` : `Editing: ${uploadedFiles[activeAttributeImageIndex]?.name}`}
                    </p>
                  </div>
                )}

                <StepTwoForm
                  currentAttrs={getCurrentAttributes()}
                  updateAttrs={updateCurrentAttributes}
                  advancedOpen={advancedOpen}
                  setAdvancedOpen={setAdvancedOpen}
                  uploadLevel={uploadLevel}
                  autoData={getAutoPopulatedData()}
                />
              </div>
            )}

            {/* Per-image missing attributes hint (Change 2a) */}
            {!applyToAll && missingAttrCount > 0 && (
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

            {/* Attributes Summary */}
            <div className="rounded border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Image Attributes {applyToAll ? "(Applied to all)" : "(Per-image)"}
              </h3>
              
              {applyToAll ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
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
                    <span className="text-muted-foreground">Orientation:</span>
                    <span className="font-medium text-foreground">
                      {ORIENTATION_OPTIONS.find(o => o.value === attributes.orientation)?.label || attributes.orientation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location Type:</span>
                    <span className="font-medium text-foreground">
                      {attributes.locationType || "ACL"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-foreground">File</th>
                        <th className="px-3 py-2 text-left font-medium text-foreground">Image Type</th>
                        <th className="px-3 py-2 text-left font-medium text-foreground">Purpose</th>
                        <th className="px-3 py-2 text-left font-medium text-foreground">Orientation</th>
                        <th className="px-3 py-2 text-left font-medium text-foreground">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.map((file, idx) => {
                        const imgAttrs = attributesByImage[idx] || attributes
                        return (
                          <tr key={idx} className="border-t border-border">
                            <td className="px-3 py-2 text-foreground truncate max-w-[150px]" title={file.name}>{file.name}</td>
                            <td className="px-3 py-2 text-foreground">
                              {IMAGE_TYPE_OPTIONS.find(o => o.value === imgAttrs.imageType)?.label || imgAttrs.imageType}
                            </td>
                            <td className="px-3 py-2 text-foreground">
                              {PURPOSE_OPTIONS.find(o => o.value === imgAttrs.purpose)?.label || imgAttrs.purpose}
                            </td>
                            <td className="px-3 py-2 text-foreground">
                              {ORIENTATION_OPTIONS.find(o => o.value === imgAttrs.orientation)?.label || imgAttrs.orientation}
                            </td>
                            <td className="px-3 py-2 text-foreground">
                              {imgAttrs.locationType || "ACL"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
              (currentStep === 2 && !canProceedStep3)
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
    </div>
  )
}
