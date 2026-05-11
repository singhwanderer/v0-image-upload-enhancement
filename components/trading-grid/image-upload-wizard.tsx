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
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
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
import { cn } from "@/lib/utils"

interface ImageUploadWizardProps {
  uploadLevel: "product" | "product-color" | "gtin"
  setUploadLevel: (level: "product" | "product-color" | "gtin") => void
  onCancel: () => void
  onComplete: () => void
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

export function ImageUploadWizard({
  uploadLevel,
  setUploadLevel,
  onCancel,
  onComplete,
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
  })
  
  // Per-image attributes (when applyToAll is false)
  const [attributesByImage, setAttributesByImage] = useState<{ [key: number]: typeof attributes }>({})
  const [activeAttributeImageIndex, setActiveAttributeImageIndex] = useState(0)

  const steps = [
    { number: 1, title: "Upload Level", description: "Choose assignment level" },
    { number: 2, title: "Target & Files", description: "Select target and upload files" },
    { number: 3, title: "Attributes", description: "Set image attributes" },
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/")
    )
    
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: "complete" as const,
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      file => file.type.startsWith("image/")
    )
    
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: "complete" as const,
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
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

    content += `

FILE INFORMATION
----------------------------------------
File Name:           ${file.name}
File Type:           JPG-JPEG
File Size:           ${formatFileSize(file.size)}

IMAGE ATTRIBUTES
----------------------------------------
Image Type:          ${IMAGE_TYPE_OPTIONS.find(o => o.value === attributes.imageType)?.label || "SI-Still Shot"}
Purpose:             ${PURPOSE_OPTIONS.find(o => o.value === attributes.purpose)?.label || "INT-Internet"}
Orientation:         ${ORIENTATION_OPTIONS.find(o => o.value === attributes.orientation)?.label || "Not specified"}
Location Type:       ${LOCATION_TYPE_OPTIONS.find(o => o.value === attributes.locationType)?.label || "Not specified"}
External Location:   ${attributes.externalLocation || "N/A"}
Pixel Density (DPI): 300
Height:              1200
Width:               800
Image Style:         ${IMAGE_STYLE_OPTIONS.find(o => o.value === attributes.imageStyle)?.label || "Not specified"}
Facing (GDSN):       ${FACING_OPTIONS.find(o => o.value === attributes.facing)?.label || "Not specified"}
Angle:               ${ANGLE_OPTIONS.find(o => o.value === attributes.angle)?.label || "Not specified"}
Clipping Path:       ${attributes.clippingPath || "N/A"}
Image Description:   ${attributes.imageDescription || "N/A"}

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

  const canProceedStep1 = uploadLevel !== undefined
  const canProceedStep2 = selectedSelectionCode && selectedProduct && uploadedFiles.length > 0 && 
    (uploadLevel === "product" || 
     (uploadLevel === "product-color" && selectedColorCode) ||
     (uploadLevel === "gtin" && selectedGtin))
  const canProceedStep3 = attributes.imageType && attributes.purpose && attributes.orientation && attributes.locationType

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowProductMedia(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
            <div className="text-sm">
              {uploadLevel === "product-color" && (
                <div className="flex border-b border-border">
                  <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Color Code:</div>
                  <div className="flex-1 px-3 py-2 text-foreground">{data.colorCode}</div>
                </div>
              )}
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">File Name:</div>
                <div className="flex-1 px-3 py-2 text-foreground">{uploadedFiles[activeImageIndex]?.name || "testMS.jpeg"}</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">File Type:</div>
                <div className="flex-1 px-3 py-2 text-foreground">JPG-JPEG</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-tg-link">Image Type:</div>
                <div className="flex-1 px-3 py-2 text-tg-link">
                  {IMAGE_TYPE_OPTIONS.find(o => o.value === attributes.imageType)?.label || "SI-Still Shot"}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Purpose:</div>
                <div className="flex-1 px-3 py-2 text-tg-link">
                  {PURPOSE_OPTIONS.find(o => o.value === attributes.purpose)?.label || "INT-Internet"}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Orientation:</div>
                <div className="flex-1 px-3 py-2 text-foreground">
                  {ORIENTATION_OPTIONS.find(o => o.value === attributes.orientation)?.label || "SDR-Side Right"}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Location Type:</div>
                <div className="flex-1 px-3 py-2 text-foreground">
                  {LOCATION_TYPE_OPTIONS.find(o => o.value === attributes.locationType)?.label || "ACL"}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">External Location:</div>
                <div className="flex-1 px-3 py-2 text-foreground">{attributes.externalLocation || ""}</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">File Size:</div>
                <div className="flex-1 px-3 py-2 text-foreground">{uploadedFiles[activeImageIndex] ? formatFileSize(uploadedFiles[activeImageIndex].size) : ""}</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Pixel Density (DPI):</div>
                <div className="flex-1 px-3 py-2 text-foreground">300</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Height:</div>
                <div className="flex-1 px-3 py-2 text-foreground">1200</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Width:</div>
                <div className="flex-1 px-3 py-2 text-foreground">800</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Image Style:</div>
                <div className="flex-1 px-3 py-2 text-foreground">
                  {IMAGE_STYLE_OPTIONS.find(o => o.value === attributes.imageStyle)?.label || ""}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Facing (GDSN):</div>
                <div className="flex-1 px-3 py-2 text-foreground">
                  {FACING_OPTIONS.find(o => o.value === attributes.facing)?.label || ""}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Angle:</div>
                <div className="flex-1 px-3 py-2 text-foreground">
                  {ANGLE_OPTIONS.find(o => o.value === attributes.angle)?.label || ""}
                </div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Clipping Path:</div>
                <div className="flex-1 px-3 py-2 text-foreground">{attributes.clippingPath || ""}</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Image Description:</div>
                <div className="flex-1 px-3 py-2 text-foreground">{attributes.imageDescription || ""}</div>
              </div>
              <div className="flex border-b border-border">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Create Date</div>
                <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
              </div>
              <div className="flex">
                <div className="w-40 bg-muted/20 px-3 py-2 font-medium text-foreground">Last Update Date</div>
                <div className="flex-1 px-3 py-2 text-foreground">{currentDate}</div>
              </div>
            </div>
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
        {/* Step 1: Upload Level */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground">Select Upload Level</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose whether to assign images at the Product, Product + Color Code, or individual Item (GTIN) level.
              </p>
            </div>

            <RadioGroup
              value={uploadLevel}
              onValueChange={(value: "product" | "product-color" | "gtin") => setUploadLevel(value)}
              className="gap-4"
            >
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded border p-4 transition-colors",
                  uploadLevel === "product"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="product" className="mt-1" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Product Level</span>
                  <span className="text-sm text-muted-foreground">
                    Image applies to the entire product across all color variants and GTINs. 
                    Best for product shots that don&apos;t vary by color or pack size.
                  </span>
                </div>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded border p-4 transition-colors",
                  uploadLevel === "product-color"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="product-color" className="mt-1" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Product + Color Code Level</span>
                  <span className="text-sm text-muted-foreground">
                    Image applies to a specific color variant (3-digit code) of the product. 
                    Required when showing color-specific product shots.
                  </span>
                </div>
              </label>

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded border p-4 transition-colors",
                  uploadLevel === "gtin"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value="gtin" className="mt-1" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Item Level (GTIN)</span>
                  <span className="text-sm text-muted-foreground">
                    Image applies to a specific GTIN (trade item) — e.g., a particular pack size
                    or configuration. Use when imagery differs by GTIN Type (UA, EA, CS, PK).
                  </span>
                </div>
              </label>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Target & Files */}
        {currentStep === 2 && (
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

            {/* File Upload Zone */}
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
                  accept="image/jpeg,image/png,image/tiff"
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
                  JPG, PNG, TIFF - Max 10 MB each
                </p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
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
                      accept="image/jpeg,image/png,image/tiff"
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

        {/* Step 3: Attributes */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-foreground">Set Image Attributes</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure attributes for {uploadedFiles.length} uploaded image{uploadedFiles.length !== 1 ? "s" : ""}.
              </p>
            </div>

            {/* Apply to All Checkbox */}
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
            </div>

            {/* Per-Image Tabs (when not applying to all) */}
            {!applyToAll && uploadedFiles.length > 1 && (
              <div className="flex gap-2 border-b border-border overflow-x-auto">
                {uploadedFiles.map((file, idx) => (
                  <button
                    key={file.id}
                    onClick={() => setActiveAttributeImageIndex(idx)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                      activeAttributeImageIndex === idx
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Image {idx + 1}: {file.name.slice(0, 20)}
                  </button>
                ))}
              </div>
            )}

            {/* Upload Level Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded bg-primary/10 px-3 py-1.5 text-sm">
              <FileImage className="size-4 text-primary" />
              <span className="font-medium text-primary">
                {uploadLevel === "product" 
                  ? "Product Level Image" 
                  : uploadLevel === "gtin"
                  ? "Item Level Image"
                  : "Product + Color Code Level Image"}
              </span>
            </div>

            {/* Required Attributes */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Image Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={getCurrentAttributes().imageType}
                  onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), imageType: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Purpose <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={getCurrentAttributes().purpose}
                  onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), purpose: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Orientation <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={getCurrentAttributes().orientation}
                  onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), orientation: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select orientation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ORIENTATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Location Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={getCurrentAttributes().locationType}
                  onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), locationType: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select location type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* External Location - conditional */}
            {(getCurrentAttributes().locationType === "FTP" || getCurrentAttributes().locationType === "URL") && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  External Location <span className="text-destructive">**</span>
                </Label>
                <Input
                  value={getCurrentAttributes().externalLocation}
                  onChange={(e) => updateCurrentAttributes({ ...getCurrentAttributes(), externalLocation: e.target.value })}
                  placeholder={getCurrentAttributes().locationType === "FTP" ? "ftp://..." : "https://..."}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  ** Required when Location Type is FTP or URL
                </p>
              </div>
            )}

            {/* Auto-detected Metadata */}
            {uploadedFiles.length > 0 && (
              <div className="rounded border border-border bg-tg-table-header p-3 text-sm">
                <div className="mb-2 font-medium text-foreground">Auto-detected from File</div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 md:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">File Type:</span>{" "}
                    <span className="text-foreground">JPG-JPEG</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">DPI:</span>{" "}
                    <span className="text-foreground">300</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height:</span>{" "}
                    <span className="text-foreground">1200px</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Width:</span>{" "}
                    <span className="text-foreground">800px</span>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Attributes (Collapsible) */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded border border-border bg-muted/30 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50">
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      advancedOpen && "rotate-180"
                    )}
                  />
                  Advanced Attributes (Optional)
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 grid gap-4 rounded border border-border bg-background p-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Image Style</Label>
                    <Select
                      value={getCurrentAttributes().imageStyle}
                      onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), imageStyle: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select style..." />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_STYLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Facing (GDSN)</Label>
                    <Select
                      value={getCurrentAttributes().facing}
                      onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), facing: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select facing..." />
                      </SelectTrigger>
                      <SelectContent>
                        {FACING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Angle</Label>
                    <Select
                      value={getCurrentAttributes().angle}
                      onValueChange={(value) => updateCurrentAttributes({ ...getCurrentAttributes(), angle: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select angle..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ANGLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Clipping Path</Label>
                    <Input
                      value={getCurrentAttributes().clippingPath}
                      onChange={(e) =>
                        updateCurrentAttributes({ ...getCurrentAttributes(), clippingPath: e.target.value })
                      }
                      placeholder="Path name..."
                      className="bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Label className="text-sm font-medium">Image Description</Label>
                    <Input
                      value={getCurrentAttributes().imageDescription}
                      onChange={(e) =>
                        updateCurrentAttributes({ ...getCurrentAttributes(), imageDescription: e.target.value })
                      }
                      placeholder="Enter description..."
                      className="bg-background"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Required Fields Note */}
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Required Attributes
            </p>
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
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2) ||
              (currentStep === 3 && !canProceedStep3)
            }
            className="gap-1"
          >
            {currentStep === 3 ? (
              <>
                <Upload className="size-4" />
                Upload {uploadedFiles.length} Image{uploadedFiles.length !== 1 ? "s" : ""}
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
