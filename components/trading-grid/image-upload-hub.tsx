"use client"

import { useState } from "react"
import { Upload, FileImage, ArrowRight, Info, Download, Package, Palette, Barcode, CheckCircle2, X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMediaSelection } from "./use-media-selection"
import { buildImageMetadataCsv, buildTableCsv, downloadCsv, csvPreview, type ImageMetadataRow } from "./metadata-csv"
import { toast } from "@/hooks/use-toast"
import { DownloadModal } from "./download-modal"
import { ImageDetailCard } from "./image-detail-card"
import { buildZip, downscaleImage, saveBlob } from "./image-resize"

// "SI-Still Shot" → "SI": the mock fixtures store display labels; the CSV carries codes.
const codeOf = (label: string): string => label.split("-")[0] ?? label

// "PRI-Primary" → "Primary": buyer-facing labels drop the standards code prefix.
// Codes stay in the CSV export, where machines need them.
const humanize = (label: string): string => (label.includes("-") ? label.split("-").slice(1).join("-") : label)

interface ImageUploadLandingProps {
  onUploadClick: (level: "product" | "product-color" | "gtin") => void
}

// Mock vendor data for retailer portal
const MOCK_VENDORS = [
  { id: "1", name: "APEX ATHLETIC FOOTWEAR", accountNumber: "125103335555", selectionCodes: 5, products: 156, gtins: 2858, images: 156, productsWithImages: 156 },
  { id: "2", name: "TRAILBLAZE FOOTWEAR", accountNumber: "127142417199", selectionCodes: 3, products: 89, gtins: 445, images: 89, productsWithImages: 89 },
  { id: "3", name: "STRIDEWORKS INC", accountNumber: "198765432100", selectionCodes: 8, products: 234, gtins: 1102, images: 908, productsWithImages: 221 },
]

const MOCK_PRODUCTS = [
  { id: "RUNCOOL-GRY-M", description: "Men's Cool Runner - Grey", createDate: "03/25/2026", lastUpdate: "05/06/2026", gtins: 1, images: 2 },
  { id: "COURT-WHT-M", description: "Men's Court Classic - White", createDate: "11/04/2025", lastUpdate: "04/13/2026", gtins: 2, images: 2 },
  { id: "TRLRUN-BLK-M", description: "Men's Trail Runner - Black", createDate: "01/20/2026", lastUpdate: "04/28/2026", gtins: 1, images: 2 },
  { id: "SLIP-NVY-W", description: "Women's Slip-On - Navy", createDate: "11/04/2025", lastUpdate: "01/20/2026", gtins: 1, images: 0 },
  { id: "HIKE-BRN-M", description: "Men's Hiking Boot - Brown", createDate: "03/09/2026", lastUpdate: "", gtins: 0, images: 0 },
  { id: "WALK-GRY-W", description: "Women's Walking Shoe - Grey", createDate: "01/27/2026", lastUpdate: "01/27/2026", gtins: 1, images: 0 },
]

// Footwear-themed selection-code metadata, shared across the selection-code table,
// product-media context, and download metadata so the description stays consistent.
const SELECTION_CODES = [
  { code: "001", description: "Spring Running Line" },
  { code: "002", description: "Trail & Outdoor Collection" },
  { code: "003", description: "Court & Lifestyle" },
  { code: "004", description: "Walking Comfort Series" },
  { code: "005", description: "Seasonal Clearance" },
]

const selectionCodeDescription = (code: string | null): string =>
  SELECTION_CODES.find(c => c.code === code)?.description ?? "Product Selection"

// Full image-detail records — same field coverage the supplier's Product Media cards show,
// so the retailer view can mirror them (read-only). Sizes/dimensions match the real files in
// /public/mock; dpi is null because these JPEGs carry no density metadata (matches supplier
// behavior for such files).
const MOCK_IMAGES = [
  {
    fileName: "sneaker-front.jpg", fileType: "JPG-JPEG", imageType: "SI-Still Shot", purpose: "INT-Internet",
    orientation: "PRI-Primary", locationType: "ACL", externalLocation: "",
    fileSizeBytes: 169841, dpi: null as number | null, width: 1600, height: 872,
    imageStyle: "PRO-Product", facing: "1-Front", angle: "1-Center, No plunge angle",
    clippingPath: "", imageDescription: "Grey running sneaker, front three-quarter view on white background",
    createDate: "Apr 7, 2026", lastUpdate: "", previewSrc: "/mock/sneaker-front.jpg",
  },
  {
    fileName: "sneaker-side.jpg", fileType: "JPG-JPEG", imageType: "SI-Still Shot", purpose: "INT-Internet",
    orientation: "SDL-Side Left", locationType: "ACL", externalLocation: "",
    fileSizeBytes: 185105, dpi: null as number | null, width: 1600, height: 872,
    imageStyle: "PRO-Product", facing: "2-Left", angle: "1-Center, No plunge angle",
    clippingPath: "", imageDescription: "Grey running sneaker, left side profile on white background",
    createDate: "Apr 13, 2026", lastUpdate: "Apr 23, 2026", previewSrc: "/mock/sneaker-side.jpg",
  },
]

// Non-GDSN product attributes (the extended/GS1 set) are intentionally absent from the
// retailer image view: they reach retailers through a separate data channel. This view is
// images plus image details only.

// Per-product media (audit R5): only products whose row actually claims images carry any —
// the rest get an honest empty state instead of impossible sneakers. The three image-bearing
// products share the same two mock photos deliberately (stakeholder call: no stylized renders).
const PRODUCT_MEDIA: Record<string, typeof MOCK_IMAGES> = {
  "RUNCOOL-GRY-M": MOCK_IMAGES,
  "COURT-WHT-M": MOCK_IMAGES,
  "TRLRUN-BLK-M": MOCK_IMAGES,
}
const mediaFor = (productId?: string) => (productId && PRODUCT_MEDIA[productId]) || []

// Bytes → human-readable, mirroring the supplier card's formatter.
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function ImageUploadLanding({ onUploadClick }: ImageUploadLandingProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-tg-link hover:underline cursor-pointer">Data Management</span>
        <span className="text-muted-foreground">&gt;</span>
        <span className="font-medium text-foreground">Image Upload</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Image Upload</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and assign product images to your catalog. Choose the assignment level that matches your needs.
          </p>
        </div>
        <div className="flex items-center gap-1 border border-border bg-card p-1">
          <button className="p-1.5 hover:bg-muted" title="Help">
            <Info className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Company Context Bar */}
      <div className="rounded border border-border bg-card p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Company Name:</span>
            <span className="ml-2 text-foreground">KIBBLES N BITS</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Account Number:</span>
            <span className="ml-2 text-foreground">125103335555</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Selection Codes:</span>
            <span className="ml-2 text-foreground">110</span>
          </div>
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="rounded border border-border bg-tg-section-header p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">How Image Upload Works</h2>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">1</span>
            <span className="text-foreground">Select Upload Level</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">2</span>
            <span className="text-foreground">Choose Target &amp; Upload Files</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">3</span>
            <span className="text-foreground">Set Image Attributes</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">4</span>
            <span className="text-foreground">Review &amp; Submit</span>
          </div>
        </div>
      </div>

      {/* Upload Level Selection */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Select Upload Level</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how you want to assign images. This determines which products or variants the images will be linked to.
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Product Level */}
          <Card 
            className="border-2 border-border hover:border-primary/60 transition-colors cursor-pointer group"
            onClick={() => onUploadClick("product")}
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Package className="size-6 text-primary" />
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Product Level</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assign images to the product itself. Best for products without color variations.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>One image set per product</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>Applies to all GTINs under product</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Start Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product + Color Code Level */}
          <Card 
            className="border-2 border-border hover:border-primary/60 transition-colors cursor-pointer group"
            onClick={() => onUploadClick("product-color")}
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Palette className="size-6 text-primary" />
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Product + Color Code</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assign images to a specific color variant. Requires selecting a 3-digit color code.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>Different images per color</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>Color code selection required</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Start Upload
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GTIN Level */}
          <Card 
            className="border-2 border-border hover:border-primary/60 transition-colors cursor-pointer group"
            onClick={() => onUploadClick("gtin")}
          >
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Barcode className="size-6 text-primary" />
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">GTIN Level</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assign images to a specific GTIN/UPC. Most granular level for item-specific images.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border pt-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>Unique images per GTIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    <span>GTIN selection required</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Start Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reference Card */}
      <div className="rounded border border-border bg-card p-4">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Supported File Formats</h3>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileImage className="size-4 text-primary" />
                JPG / JPEG
              </span>
            </div>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Max File Size</h3>
            <div className="text-sm text-muted-foreground">
              500 KB per image
            </div>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary" />
              Image best practices
            </h3>
            <a href="#" className="text-sm text-tg-link hover:underline">
              View GS1 guidelines &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded border border-border bg-card p-4">
          <div className="text-2xl font-semibold text-foreground">156</div>
          <div className="text-sm text-muted-foreground">Images uploaded this month</div>
        </div>
        <div className="rounded border border-border bg-card p-4">
          <div className="text-2xl font-semibold text-foreground">23</div>
          <div className="text-sm text-muted-foreground">Products with attributes but no images</div>
        </div>
        <div className="rounded border border-border bg-card p-4">
          <div className="text-2xl font-semibold text-foreground">98%</div>
          <div className="text-sm text-muted-foreground">GTINs/Products with physical images</div>
        </div>
      </div>
    </div>
  )
}

// Retailer Portal: Image Browser with navigation flow
type RetailerView = "vendor-list" | "selection-codes" | "product-list" | "product-media"

export function RetailerImageBrowser() {
  const [currentView, setCurrentView] = useState<RetailerView>("vendor-list")
  const [selectedVendor, setSelectedVendor] = useState<typeof MOCK_VENDORS[0] | null>(null)
  const [selectedSelectionCode, setSelectedSelectionCode] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null)
  // activeImageIndex removed — retailer product-media uses stacked list (no active selection)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadPhase, setDownloadPhase] = useState<"select" | "preparing" | "complete">("select")
  // Long-edge cap for downloaded images; null = original size (shared DownloadModal contract).
  const [downloadSize, setDownloadSize] = useState<number | null>(null)
  // "zip" = one archive with image binaries + CSV; "csv" = metadata file only.
  const [downloadPackageType, setDownloadPackageType] = useState<"zip" | "csv">("zip")
  // First lines of the most recently generated metadata CSV, shown in the Complete phase.
  const [lastCsvPreview, setLastCsvPreview] = useState("")
  // Lightbox: full-size view of a single product-media image
  const [lightboxImage, setLightboxImage] = useState<{ src: string; fileName: string } | null>(null)
  // Selection state for selective download (Retailer stays read-only — no edit/delete).
  const media = useMediaSelection()

  const openDownloadModal = (presetIds?: string[]) => {
    if (presetIds && presetIds.length > 0) media.selectOnly(presetIds[0])
    setDownloadPhase("select")
    setShowDownloadModal(true)
  }

  // Retailer download. ZIP mode fetches the selected image binaries from the mock assets
  // (downscaled to the chosen long-edge cap when one is set) and packages them with the
  // spec-shaped metadata CSV into one archive; CSV mode downloads just the metadata file.
  // Mirrors the supplier's handleBulkDownload.
  const handleRetailerDownload = async () => {
    const productMedia = mediaFor(selectedProduct?.id)
    const selected = productMedia.filter(img => media.isChecked(img.fileName))
    const productId = selectedProduct?.id ?? "product"
    setDownloadPhase("preparing")
    try {
      const outputDims = new Map<string, { width: number; height: number }>()
      const zipEntries: Record<string, Uint8Array> = {}
      if (downloadPackageType === "zip") {
        for (const img of selected) {
          const res = await fetch(img.previewSrc)
          if (!res.ok) throw new Error(`Failed to fetch ${img.fileName}`)
          let blob = await res.blob()
          if (downloadSize != null) {
            const out = await downscaleImage(blob, downloadSize)
            blob = out.blob
            if (out.resized) outputDims.set(img.fileName, { width: out.width, height: out.height })
          }
          zipEntries[img.fileName] = new Uint8Array(await blob.arrayBuffer())
        }
      }
      const rows: ImageMetadataRow[] = selected.map(img => {
        const dims = outputDims.get(img.fileName)
        return {
          action: "insert",
          image_level: "product",
          product: selectedProduct?.id ?? "",
          item_number: "",
          file_name: img.fileName,
          file_type: "JPG",
          image_type: codeOf(img.imageType),
          purpose: codeOf(img.purpose),
          orientation: codeOf(img.orientation),
          location_type: img.locationType,
          external_location: img.externalLocation,
          color_code: "",
          image_style: codeOf(img.imageStyle),
          facing: codeOf(img.facing),
          angle: codeOf(img.angle),
          file_size: String(img.fileSizeBytes),
          pixel_density: img.dpi != null ? String(img.dpi) : "",
          height: String(dims?.height ?? img.height),
          width: String(dims?.width ?? img.width),
          clipping_path: img.clippingPath,
          image_description: img.imageDescription,
        }
      })
      const csv = buildImageMetadataCsv(rows)
      if (downloadPackageType === "zip") {
        zipEntries[`${productId}_image_metadata.csv`] = new TextEncoder().encode(csv)
        saveBlob(`${productId}_images.zip`, buildZip(zipEntries))
      } else {
        downloadCsv(`${productId}_image_metadata.csv`, csv)
      }
      setLastCsvPreview(csvPreview(csv))
      setDownloadPhase("complete")
      toast({
        title: "Download complete",
        description: downloadPackageType === "zip"
          ? `${productId}_images.zip — ${selected.length} image${selected.length !== 1 ? "s" : ""} + metadata CSV.`
          : "Metadata CSV downloaded.",
      })
    } catch {
      setDownloadPhase("select")
      toast({ title: "Download failed", description: "One or more images could not be prepared. Try again or download at original size." })
    }
  }


  const handleVendorSelect = (vendor: typeof MOCK_VENDORS[0]) => {
    setSelectedVendor(vendor)
    setCurrentView("selection-codes")
  }

  const handleVendorImagesClick = (vendor: typeof MOCK_VENDORS[0], e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedVendor(vendor)
    setSelectedSelectionCode("ALL")
    setCurrentView("product-list")
  }

  const handleSelectionCodeSelect = (code: string) => {
    setSelectedSelectionCode(code)
    setCurrentView("product-list")
  }

  const handleProductSelect = (product: typeof MOCK_PRODUCTS[0]) => {
    setSelectedProduct(product)
    setCurrentView("product-media")
  }

  const renderBreadcrumb = () => {
    const crumbs: { label: string; onClick?: () => void }[] = []
    
    crumbs.push({ 
      label: "Vendor List", 
      onClick: () => {
        setCurrentView("vendor-list")
        setSelectedVendor(null)
        setSelectedSelectionCode(null)
        setSelectedProduct(null)
      }
    })
    
    if (selectedVendor && currentView !== "vendor-list" && selectedSelectionCode !== "ALL") {
      crumbs.push({ 
        label: "Selection Code List", 
        onClick: () => {
          setCurrentView("selection-codes")
          setSelectedSelectionCode(null)
          setSelectedProduct(null)
        }
      })
    }
    
    if (selectedSelectionCode && (currentView === "product-list" || currentView === "product-media")) {
      crumbs.push({ 
        label: "Product List", 
        onClick: () => {
          setCurrentView("product-list")
          setSelectedProduct(null)
        }
      })
    }
    
    if (selectedProduct && currentView === "product-media") {
      crumbs.push({ label: "Product Media" })
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground">&gt;</span>}
            {crumb.onClick ? (
              <span 
                className="text-tg-link hover:underline cursor-pointer"
                onClick={crumb.onClick}
              >
                {crumb.label}
              </span>
            ) : (
              <span className="font-medium text-foreground">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
    )
  }

  // Vendor List View
  if (currentView === "vendor-list") {
    return (
      <div className="flex flex-col gap-6">
        {renderBreadcrumb()}
        
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold text-foreground">Vendor List</h1>
          <div className="flex items-center gap-1 border border-border bg-card p-1">
            <button
              className="p-1.5 hover:bg-muted"
              title="Export vendor list as CSV"
              onClick={() => downloadCsv("vendor_list.csv", buildTableCsv(
                ["trading_partner_name", "account_number", "selection_codes", "products", "gtins", "images", "image_coverage_pct"],
                MOCK_VENDORS.map(v => [v.name, v.accountNumber, String(v.selectionCodes), String(v.products), String(v.gtins), String(v.images), `${Math.min(100, Math.round((v.images / v.gtins) * 100))}%`])
              ))}
            >
              <Download className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Vendor Table */}
        <div className="rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-tg-table-header text-left">
              <tr>
                <th className="px-3 py-2 font-medium text-foreground">Trading Partner Name</th>
                <th className="px-3 py-2 font-medium text-foreground">Account Number</th>
                <th className="px-3 py-2 font-medium text-foreground">Selection Codes</th>
                <th className="px-3 py-2 font-medium text-foreground">Products</th>
                <th className="px-3 py-2 font-medium text-foreground">GTINs</th>
                <th className="px-3 py-2 font-medium text-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-1 cursor-default underline decoration-dotted decoration-muted-foreground underline-offset-2">
                        Images
                        <Info className="size-3 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Total images · % = products with images / total products
                    </TooltipContent>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VENDORS.map((vendor) => {
                const coveragePct = Math.round((vendor.productsWithImages / vendor.products) * 100)
                return (
                  <tr
                    key={vendor.id}
                    className="border-t border-border hover:bg-muted/50"
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <td className="px-3 py-2 text-tg-link hover:underline cursor-pointer">{vendor.name}</td>
                    <td className="px-3 py-2 text-foreground">{vendor.accountNumber}</td>
                    <td className="px-3 py-2 text-tg-link cursor-pointer">{vendor.selectionCodes}</td>
                    <td className="px-3 py-2 text-foreground">{vendor.products}</td>
                    <td className="px-3 py-2 text-tg-link">{vendor.gtins.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <button
                        className="text-tg-link hover:underline"
                        onClick={(e) => handleVendorImagesClick(vendor, e)}
                      >
                        {vendor.images.toLocaleString()}
                      </button>
                      <span className="ml-2 text-xs text-muted-foreground">{coveragePct}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Selection Code List View
  if (currentView === "selection-codes") {
    return (
      <div className="flex flex-col gap-6">
        {renderBreadcrumb()}
        
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold text-foreground">Selection Code List</h1>
          <div className="flex items-center gap-1 border border-border bg-card p-1">
            <button
              className="p-1.5 hover:bg-muted"
              title="Export selection codes as CSV"
              onClick={() => downloadCsv("selection_codes.csv", buildTableCsv(
                ["selection_code", "description", "total_products"],
                SELECTION_CODES.map(({ code, description }, idx) => [code, description, String(idx === 0 ? MOCK_PRODUCTS.length : 14 + idx * 3)])
              ))}
            >
              <Download className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="rounded border border-border bg-card p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Trading Partner Name:</span>
              <span className="ml-2 text-foreground">{selectedVendor?.name}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Account Number:</span>
              <span className="ml-2 text-foreground">{selectedVendor?.accountNumber}</span>
            </div>
          </div>
        </div>

        {/* Selection Codes Table */}
        <div className="rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-tg-table-header text-left">
              <tr>
                <th className="px-3 py-2 font-medium text-foreground">Selection Code</th>
                <th className="px-3 py-2 font-medium text-foreground">Description</th>
                <th className="px-3 py-2 font-medium text-foreground">Total Products</th>
              </tr>
            </thead>
            <tbody>
              {SELECTION_CODES.map(({ code, description }, idx) => (
                <tr
                  key={code}
                  className="border-t border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSelectionCodeSelect(code)}
                >
                  <td className="px-3 py-2 text-tg-link hover:underline">{code}</td>
                  <td className="px-3 py-2 text-foreground">{description}</td>
                  <td className="px-3 py-2 text-foreground">{idx === 0 ? MOCK_PRODUCTS.length : 14 + idx * 3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Product List View
  if (currentView === "product-list") {
    return (
      <div className="flex flex-col gap-6">
        {renderBreadcrumb()}
        
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-semibold text-foreground">Product List</h1>
          <div className="flex items-center gap-1 border border-border bg-card p-1">
            <button
              className="p-1.5 hover:bg-muted"
              title="Export product list as CSV"
              onClick={() => downloadCsv("product_list.csv", buildTableCsv(
                ["product", "description", "create_date", "last_update_date", "gtins", "images"],
                MOCK_PRODUCTS.map(p => [p.id, p.description, p.createDate, p.lastUpdate, String(p.gtins), String(p.images)])
              ))}
            >
              <Download className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Context Info */}
        <div className="rounded border border-border bg-card p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Trading Partner Name:</span>
              <span className="ml-2 text-foreground">{selectedVendor?.name}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Account Number:</span>
              <span className="ml-2 text-foreground">{selectedVendor?.accountNumber}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Selection Code:</span>
              <span className="ml-2 text-tg-link">{selectedSelectionCode}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Total Products:</span>
              <span className="ml-2 text-foreground">{MOCK_PRODUCTS.length}</span>
            </div>
          </div>
        </div>

        {/* Record count — pagination chrome removed: all mock products fit one page (P1.4) */}
        <div className="flex items-center justify-end text-sm text-muted-foreground">
          <span>1-{MOCK_PRODUCTS.length} of {MOCK_PRODUCTS.length} records</span>
        </div>

        {/* Product Table — leading thumbnail: an image browser should show images (P1.4) */}
        <div className="rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-tg-table-header text-left">
              <tr>
                <th className="w-16 px-3 py-2 font-medium text-foreground">Image</th>
                <th className="px-3 py-2 font-medium text-foreground">Product</th>
                <th className="px-3 py-2 font-medium text-foreground">Description</th>
                <th className="px-3 py-2 font-medium text-foreground">Create Date</th>
                <th className="px-3 py-2 font-medium text-foreground">Last Update Date</th>
                <th className="px-3 py-2 font-medium text-foreground">GTINs</th>
                <th className="px-3 py-2 font-medium text-foreground">GTIN Filter</th>
                <th className="px-3 py-2 font-medium text-foreground">Images</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-3 py-2">
                    {mediaFor(product.id)[0] ? (
                      <img
                        src={mediaFor(product.id)[0].previewSrc}
                        alt={product.description}
                        className="size-10 rounded border border-border object-cover cursor-pointer"
                        onClick={() => handleProductSelect(product)}
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded border border-border bg-muted/30">
                        <FileImage className="size-5 text-muted-foreground/50" />
                      </div>
                    )}
                  </td>
                  <td
                    className="px-3 py-2 text-tg-link hover:underline cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product.id}
                  </td>
                  <td className="px-3 py-2 text-foreground">{product.description}</td>
                  <td className="px-3 py-2 text-foreground">{product.createDate}</td>
                  <td className="px-3 py-2 text-foreground">{product.lastUpdate}</td>
                  <td className="px-3 py-2 text-tg-link">{product.gtins}</td>
                  <td className="px-3 py-2 text-tg-link">{product.gtins}</td>
                  <td 
                    className={cn(
                      "px-3 py-2 cursor-pointer",
                      product.images > 0 ? "text-tg-link hover:underline" : "text-foreground"
                    )}
                    onClick={() => product.images > 0 && handleProductSelect(product)}
                  >
                    {product.images}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Product Media View (read-only for retailer)
  if (currentView === "product-media") {
    const productMedia = mediaFor(selectedProduct?.id)
    return (
      <div className="flex flex-col gap-6">
        {renderBreadcrumb()}

        {/* Toolbar — selection + download; read-only (no edit/delete) */}
        <div className="flex items-center gap-2 border border-border bg-card p-1 w-fit">
          {productMedia.length > 0 && (
            <label className="flex items-center gap-2 px-2 cursor-pointer select-none">
              <Checkbox
                checked={media.isAllSelected(productMedia.map(i => i.fileName))}
                onCheckedChange={(checked) =>
                  checked ? media.selectAll(productMedia.map(i => i.fileName)) : media.clear()
                }
              />
              <span className="text-xs text-muted-foreground">
                {media.selectedIds.size === 0
                  ? `All ${productMedia.length} selected`
                  : `${media.selectedIds.size} selected`}
              </span>
            </label>
          )}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Download"
              disabled={productMedia.length === 0}
              onClick={() => openDownloadModal()}
            >
              <Download className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Context Info */}
        <div className="text-sm space-y-1">
          <div><span className="font-medium text-muted-foreground">Trading Partner Name:</span> <span className="text-foreground">{selectedVendor?.name}</span></div>
          <div><span className="font-medium text-muted-foreground">Account Number:</span> <span className="text-foreground">{selectedVendor?.accountNumber}</span></div>
          <div><span className="font-medium text-muted-foreground">Selection Code:</span> <span className="text-foreground">{selectedSelectionCode}</span></div>
          <div><span className="font-medium text-muted-foreground">Description:</span> <span className="text-foreground">{selectionCodeDescription(selectedSelectionCode)}</span></div>
          <div><span className="font-medium text-muted-foreground">Product:</span> <span className="text-foreground">{selectedProduct?.id}</span></div>
          <div><span className="font-medium text-muted-foreground">Product Description:</span> <span className="text-foreground">{selectedProduct?.description}</span></div>
          <div><span className="font-medium text-muted-foreground">Images:</span> <span className="text-foreground">{selectedProduct?.images}</span></div>
          {/* Buyer-value summary: coverage + freshness, derived from the image data itself */}
          {productMedia.length > 0 && (() => {
            const views = [...new Set(productMedia.map(i => humanize(i.orientation)))]
            const latest = productMedia
              .flatMap(i => [i.lastUpdate, i.createDate].filter((d): d is string => !!d))
              .map(d => new Date(d))
              .sort((a, b) => b.getTime() - a.getTime())[0]
            return (
              <div className="pt-1 text-sm font-medium text-foreground">
                {productMedia.length} image{productMedia.length !== 1 ? "s" : ""} · {views.join(" & ")} views
                {latest ? ` · Updated ${latest.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
              </div>
            )
          })()}
        </div>

        {/* Sticky jump-to thumbnail strip — hidden when only 1 image (Acceptance #9) */}
        {productMedia.length > 1 && (
          <div className="sticky top-0 z-10 bg-card border border-border p-2 flex gap-2 overflow-x-auto shadow-sm">
            {productMedia.map((img, idx) => (
              <button
                key={idx}
                title={img.fileName}
                onClick={() => {
                  document.getElementById(`retailer-card-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className="flex-shrink-0 rounded border-2 border-border hover:border-primary/60 overflow-hidden transition-all"
              >
                <img src={img.previewSrc} alt={img.fileName} className="size-14 object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Stacked image cards — the shared supplier card, read-only: selection + download only,
            no edit/delete affordances. Full field parity with the supplier's Product Media view.
            Products without synced images get an honest empty state (audit R5). */}
        {productMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded">
            <FileImage className="size-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1">No images on this product</h3>
            <p className="text-sm text-muted-foreground">
              {selectedVendor?.name ?? "The vendor"} hasn&apos;t synced any images for {selectedProduct?.id ?? "this product"} yet.
            </p>
          </div>
        ) : (
        <div className="flex flex-col gap-3">
          {productMedia.map((img, idx) => (
            <ImageDetailCard
              key={img.fileName}
              id={`retailer-card-${idx}`}
              levelLabel="Product Level Image"
              rows={[
                { label: "Image Level:", value: "Product Level" },
                { label: "File Name:", value: img.fileName },
                { label: "File Type:", value: img.fileType },
                { label: "Image Type:", value: img.imageType, link: true },
                { label: "Purpose:", value: img.purpose, link: true },
                { label: "Orientation:", value: img.orientation },
                { label: "Location Type:", value: img.locationType },
                { label: "External Location:", value: img.externalLocation },
                { label: "File Size:", value: formatFileSize(img.fileSizeBytes) },
                { label: "Pixel Density (DPI):", value: img.dpi != null ? String(img.dpi) : "" },
                { label: "Height:", value: `${img.height} px` },
                { label: "Width:", value: `${img.width} px` },
                { label: "Image Style:", value: img.imageStyle },
                { label: "Facing (GDSN):", value: img.facing },
                { label: "Angle:", value: img.angle },
                { label: "Clipping Path:", value: img.clippingPath },
                { label: "Image Description:", value: img.imageDescription },
                { label: "Create Date:", value: img.createDate },
                { label: "Last Update Date:", value: img.lastUpdate || "" },
              ]}
              previewSrc={img.previewSrc}
              previewAlt={img.fileName}
              checked={media.isChecked(img.fileName)}
              onCheckedChange={() => media.toggle(img.fileName, productMedia.map(i => i.fileName))}
              headerActions={
                <button
                  className="p-1.5 hover:bg-muted rounded"
                  title="Download this image"
                  onClick={() => openDownloadModal([img.fileName])}
                >
                  <Download className="size-3.5 text-muted-foreground" />
                </button>
              }
              onPreviewClick={() => setLightboxImage({ src: img.previewSrc, fileName: img.fileName })}
              footer={<>From {selectedVendor?.name ?? "vendor"}</>}
            />
          ))}
        </div>
        )}

        {/* Download Modal — shared with the supplier (three-phase, ZIP/CSV picker, real files) */}
        <DownloadModal
          open={showDownloadModal}
          phase={downloadPhase}
          uploadedFiles={productMedia.map(img => ({
            id: img.fileName,
            name: img.fileName,
            size: img.fileSizeBytes,
            preview: img.previewSrc,
            measured: { width: img.width, height: img.height, dpi: img.dpi },
          }))}
          isChecked={media.isChecked}
          uploadLevel="product"
          autoData={{ productId: selectedProduct?.id ?? "", selectedGtin: "", colorCode: "" }}
          lastCsvPreview={lastCsvPreview}
          downloadSize={downloadSize}
          onDownloadSizeChange={setDownloadSize}
          packageType={downloadPackageType}
          onPackageTypeChange={setDownloadPackageType}
          onClose={() => setShowDownloadModal(false)}
          onDownload={() => { void handleRetailerDownload() }}
        />

        {/* Lightbox — full-size view of a single product-media image */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightboxImage(null)}
              title="Close"
            >
              <X className="size-6" />
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.fileName}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="absolute bottom-4 text-sm text-white/80">{lightboxImage.fileName}</span>
          </div>
        )}

      </div>
    )
  }

  return null
}
