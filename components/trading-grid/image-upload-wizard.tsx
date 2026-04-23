"use client"

import { useState, useCallback } from "react"
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  ImageIcon, 
  Check,
  AlertCircle,
  ChevronDown,
  Trash2,
  Edit3,
  FileImage
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
  uploadLevel: "product" | "product-color"
  setUploadLevel: (level: "product" | "product-color") => void
  onCancel: () => void
  onComplete: () => void
}

// Mock data based on provided patterns
const MOCK_DATA = {
  selectionCodes: [
    { code: "001", description: "dresses" },
    { code: "002", description: "tops" },
    { code: "003", description: "Dresses" },
    { code: "004", description: "Womens Jeans" },
    { code: "005", description: "Footwear" },
  ],
  products: [
    { id: "TESTPROD1", description: "TESTPROD1 Desc", gtin: "00123456789012" },
    { id: "TESTPROD2", description: "Summer Floral Dress", gtin: "00123456789013" },
    { id: "B11442", description: "Boon DESERT Drying Rack", gtin: "00123456789014" },
    { id: "TESTPROD4", description: "Classic Denim Jacket", gtin: "00123456789015" },
    { id: "TESTPROD5", description: "Cotton Blend Cardigan", gtin: "00123456789016" },
  ],
  colorCodes: [
    { code: "BLK", name: "Black" },
    { code: "WHT", name: "White" },
    { code: "NVY", name: "Navy Blue" },
    { code: "RED", name: "Cardinal Red" },
    { code: "GRN", name: "Forest Green" },
  ],
}

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [applyToAll, setApplyToAll] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Form state for attributes
  const [attributes, setAttributes] = useState({
    imageType: "SI",
    purpose: "INT",
    orientation: "PRI",
    locationType: "URL",
    externalLocation: "",
    imageStyle: "",
    facing: "",
    angle: "",
    clippingPath: "",
    imageDescription: "",
  })

  const steps = [
    { number: 1, title: "Upload Level", description: "Choose assignment level" },
    { number: 2, title: "Target & Files", description: "Select target and upload files" },
    { number: 3, title: "Attributes", description: "Set image attributes" },
  ]

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
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const canProceedStep1 = uploadLevel !== undefined
  const canProceedStep2 = selectedSelectionCode && selectedProduct && uploadedFiles.length > 0 && 
    (uploadLevel === "product" || (uploadLevel === "product-color" && selectedColorCode))
  const canProceedStep3 = attributes.imageType && attributes.purpose && attributes.orientation && attributes.locationType

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowSuccess(true)
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
    
    return {
      companyName: "KIBBLES N BITS",
      accountNumber: "125103335555",
      selectionCode: selCode ? `${selCode.code} - ${selCode.description}` : "",
      description: selCode?.description || "",
      productId: product?.id || "",
      productDescription: product?.description || "",
      gtin: product?.gtin || "",
      colorCode: color ? `${color.code} - ${color.name}` : "",
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-tg-link hover:underline cursor-pointer">Data Management</span>
          <span className="text-muted-foreground">&gt;</span>
          <span className="text-tg-link hover:underline cursor-pointer">Image Upload</span>
          <span className="text-muted-foreground">&gt;</span>
          <span className="font-medium text-foreground">Upload Complete</span>
        </div>

        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded border border-border bg-card p-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-tg-success/20">
            <Check className="size-8 text-tg-success" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Successful</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {uploadedFiles.length} image{uploadedFiles.length !== 1 ? "s" : ""} uploaded successfully to{" "}
              <span className="font-medium text-foreground">{getAutoPopulatedData().productDescription}</span>
            </p>
          </div>
          
          <div className="w-full rounded border border-border bg-muted/30 p-4 text-left text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Selection Code:</span>
              <span className="text-foreground">{getAutoPopulatedData().selectionCode}</span>
              <span className="text-muted-foreground">Product:</span>
              <span className="text-foreground">{getAutoPopulatedData().productId}</span>
              {uploadLevel === "product-color" && (
                <>
                  <span className="text-muted-foreground">Color Code:</span>
                  <span className="text-foreground">{getAutoPopulatedData().colorCode}</span>
                </>
              )}
              <span className="text-muted-foreground">Images:</span>
              <span className="text-foreground">{uploadedFiles.length}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSuccess(false)
                setCurrentStep(1)
                setUploadedFiles([])
                setSelectedSelectionCode("")
                setSelectedProduct("")
                setSelectedColorCode("")
              }}
            >
              Upload More Images
            </Button>
            <Button onClick={onComplete}>
              Return to Hub
            </Button>
          </div>
        </div>
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
                Choose whether to assign images at the Product level or the Product + Color Code level.
              </p>
            </div>

            <RadioGroup
              value={uploadLevel}
              onValueChange={(value: "product" | "product-color") => setUploadLevel(value)}
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
                    Image applies to the entire product across all color variants. 
                    Best for product shots that don&apos;t vary by color.
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
                    Image applies to a specific color variant of the product. 
                    Required when showing color-specific product shots.
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
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
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
                    Color Code <span className="text-destructive">*</span>
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
            </div>

            {/* Auto-populated Info */}
            {selectedSelectionCode && selectedProduct && (
              <div className="rounded border border-border bg-tg-table-header p-3 text-sm">
                <div className="mb-2 font-medium text-foreground">Auto-populated Information</div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 md:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground">Company:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().companyName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">GTIN:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().gtin}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Description:</span>{" "}
                    <span className="text-foreground">{getAutoPopulatedData().productDescription}</span>
                  </div>
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
                          onClick={() => removeFile(file.id)}
                          className="rounded bg-destructive p-1.5 text-white hover:bg-destructive/90"
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
                onCheckedChange={(checked) => setApplyToAll(checked as boolean)}
              />
              <label htmlFor="apply-all" className="text-sm font-medium text-foreground cursor-pointer">
                Apply same attributes to all {uploadedFiles.length} images
              </label>
            </div>

            {/* Upload Level Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded bg-primary/10 px-3 py-1.5 text-sm">
              <FileImage className="size-4 text-primary" />
              <span className="font-medium text-primary">
                {uploadLevel === "product" ? "Product Level Image" : "Product + Color Code Level Image"}
              </span>
            </div>

            {/* Required Attributes */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Image Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={attributes.imageType}
                  onValueChange={(value) => setAttributes({ ...attributes, imageType: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SI">SI - Still Shot</SelectItem>
                    <SelectItem value="LI">LI - Lifestyle Image</SelectItem>
                    <SelectItem value="SW">SW - Swatch</SelectItem>
                    <SelectItem value="DT">DT - Detail Shot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Purpose <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={attributes.purpose}
                  onValueChange={(value) => setAttributes({ ...attributes, purpose: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INT">INT - Internet</SelectItem>
                    <SelectItem value="CAT">CAT - Catalog</SelectItem>
                    <SelectItem value="PRT">PRT - Print</SelectItem>
                    <SelectItem value="PKG">PKG - Packaging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Orientation <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={attributes.orientation}
                  onValueChange={(value) => setAttributes({ ...attributes, orientation: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRI">PRI - Primary</SelectItem>
                    <SelectItem value="FRO">FRO - Front</SelectItem>
                    <SelectItem value="BAC">BAC - Back</SelectItem>
                    <SelectItem value="SID">SID - Side</SelectItem>
                    <SelectItem value="ANG">ANG - Angle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">
                  Location Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={attributes.locationType}
                  onValueChange={(value) => setAttributes({ ...attributes, locationType: value })}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URL">URL</SelectItem>
                    <SelectItem value="FTP">FTP</SelectItem>
                    <SelectItem value="LOCAL">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                    <Label className="text-sm font-medium">External Location</Label>
                    <Input
                      value={attributes.externalLocation}
                      onChange={(e) =>
                        setAttributes({ ...attributes, externalLocation: e.target.value })
                      }
                      placeholder="https://..."
                      className="bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Image Style</Label>
                    <Select
                      value={attributes.imageStyle}
                      onValueChange={(value) => setAttributes({ ...attributes, imageStyle: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select style..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STD">Standard</SelectItem>
                        <SelectItem value="EDI">Editorial</SelectItem>
                        <SelectItem value="MOD">Model Shot</SelectItem>
                        <SelectItem value="FLT">Flat Lay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Facing (GDSN)</Label>
                    <Select
                      value={attributes.facing}
                      onValueChange={(value) => setAttributes({ ...attributes, facing: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select facing..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Front</SelectItem>
                        <SelectItem value="2">Back</SelectItem>
                        <SelectItem value="3">Left</SelectItem>
                        <SelectItem value="4">Right</SelectItem>
                        <SelectItem value="5">Top</SelectItem>
                        <SelectItem value="6">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Angle</Label>
                    <Select
                      value={attributes.angle}
                      onValueChange={(value) => setAttributes({ ...attributes, angle: value })}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select angle..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 degrees</SelectItem>
                        <SelectItem value="45">45 degrees</SelectItem>
                        <SelectItem value="90">90 degrees</SelectItem>
                        <SelectItem value="180">180 degrees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Clipping Path</Label>
                    <Input
                      value={attributes.clippingPath}
                      onChange={(e) =>
                        setAttributes({ ...attributes, clippingPath: e.target.value })
                      }
                      placeholder="Path name..."
                      className="bg-background"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Label className="text-sm font-medium">Image Description</Label>
                    <Input
                      value={attributes.imageDescription}
                      onChange={(e) =>
                        setAttributes({ ...attributes, imageDescription: e.target.value })
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
