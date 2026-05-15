"use client"

import { useState } from "react"
import { Upload, Search, FileImage, ArrowRight, Info, ChevronDown, Filter, ZoomIn, Download, Printer, Package, Palette, Barcode, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface ImageUploadLandingProps {
  onUploadClick: (level: "product" | "product-color" | "gtin") => void
}

// Mock vendor data for retailer portal
const MOCK_VENDORS = [
  { id: "1", name: "KIBBLES N BITS", accountNumber: "125103335555", selectionCodes: 5, products: 156 },
  { id: "2", name: "2 WRZNLMWH", accountNumber: "127142417199", selectionCodes: 3, products: 89 },
  { id: "3", name: "ACME CORP", accountNumber: "198765432100", selectionCodes: 8, products: 234 },
]

const MOCK_PRODUCTS = [
  { id: "ABC_DDD", description: "ABC", createDate: "03/25/2026", lastUpdate: "05/06/2026", gtins: 1, images: 4 },
  { id: "NEWATTRIBUTESK", description: "NEWATTRIBUTESK", createDate: "11/04/2025", lastUpdate: "04/13/2026", gtins: 2, images: 1 },
  { id: "NEWPROD", description: "NewProd", createDate: "01/20/2026", lastUpdate: "04/28/2026", gtins: 1, images: 2 },
  { id: "NEWPRODD", description: "NEWPRODD Desc", createDate: "11/04/2025", lastUpdate: "01/20/2026", gtins: 1, images: 0 },
  { id: "NEWPRODE", description: "Sample MS", createDate: "03/09/2026", lastUpdate: "", gtins: 0, images: 0 },
  { id: "OUTBOUND", description: "OUTBOUND Desc", createDate: "01/27/2026", lastUpdate: "01/27/2026", gtins: 1, images: 0 },
]

const MOCK_IMAGES = [
  { fileName: "Image1.jpg", fileType: "JPG-JPEG", imageType: "SI-Still Shot", purpose: "INT-Internet", orientation: "PRI-Primary", locationType: "ACL", createDate: "Apr 7, 2026" },
  { fileName: "Image12.jpg", fileType: "JPG-JPEG", imageType: "SI-Still Shot", purpose: "INT-Internet", orientation: "PRI-Primary", locationType: "ACL", createDate: "Apr 13, 2026", lastUpdate: "Apr 23, 2026" },
]

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

      {/* Supported Formats */}
      <div className="rounded border border-border bg-card p-4">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Supported File Formats</h3>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileImage className="size-4 text-primary" />
                JPG / JPEG
              </span>
              <span className="flex items-center gap-1.5">
                <FileImage className="size-4 text-primary" />
                PNG
              </span>
              <span className="flex items-center gap-1.5">
                <FileImage className="size-4 text-primary" />
                TIFF
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Location Options</h3>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>ACL (Upload from computer)</span>
              <span>FTP (External server)</span>
              <span>URL (Web location)</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Max File Size</h3>
            <div className="text-sm text-muted-foreground">
              10 MB per image
            </div>
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
          <div className="text-sm text-muted-foreground">Products pending images</div>
        </div>
        <div className="rounded border border-border bg-card p-4">
          <div className="text-2xl font-semibold text-foreground">98%</div>
          <div className="text-sm text-muted-foreground">Image coverage rate</div>
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
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handleVendorSelect = (vendor: typeof MOCK_VENDORS[0]) => {
    setSelectedVendor(vendor)
    setCurrentView("selection-codes")
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
    
    if (selectedVendor && currentView !== "vendor-list") {
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
            <button className="p-1.5 hover:bg-muted" title="Export">
              <Download className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="rounded border border-border bg-tg-section-header p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Search className="size-4" />
            Search
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
              </tr>
            </thead>
            <tbody>
              {MOCK_VENDORS.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  className="border-t border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleVendorSelect(vendor)}
                >
                  <td className="px-3 py-2 text-tg-link hover:underline">{vendor.name}</td>
                  <td className="px-3 py-2 text-foreground">{vendor.accountNumber}</td>
                  <td className="px-3 py-2 text-tg-link">{vendor.selectionCodes}</td>
                  <td className="px-3 py-2 text-foreground">{vendor.products}</td>
                </tr>
              ))}
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
            <button className="p-1.5 hover:bg-muted" title="Export">
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
              {["001", "002", "003", "004", "005"].map((code, idx) => (
                <tr 
                  key={code} 
                  className="border-t border-border hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleSelectionCodeSelect(code)}
                >
                  <td className="px-3 py-2 text-tg-link hover:underline">{code}</td>
                  <td className="px-3 py-2 text-foreground">Selcode {code} Update</td>
                  <td className="px-3 py-2 text-foreground">{14 + idx * 3}</td>
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
            <button className="p-1.5 hover:bg-muted" title="Export">
              <Download className="size-4 text-muted-foreground" />
            </button>
            <button className="p-1.5 hover:bg-muted" title="Print">
              <Printer className="size-4 text-muted-foreground" />
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
              <span className="ml-2 text-foreground">14</span>
            </div>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">View:</span>
          <Select defaultValue="catalogue">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="catalogue">Catalogue</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter */}
        <div className="rounded border border-border bg-tg-section-header p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="size-4" />
              Filter
            </div>
            <span className="text-xs text-tg-link cursor-pointer hover:underline">Clear Filter</span>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <span>1-14 of 14 records</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>&lt;&lt;</Button>
            <Button variant="outline" size="sm" disabled>&lt;</Button>
            <span className="px-2">1</span>
            <Button variant="outline" size="sm" disabled>&gt;</Button>
            <Button variant="outline" size="sm" disabled>&gt;&gt;</Button>
          </div>
        </div>

        {/* Product Table */}
        <div className="rounded border border-border">
          <table className="w-full text-sm">
            <thead className="bg-tg-table-header text-left">
              <tr>
                <th className="w-8 px-3 py-2"></th>
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
                    <input type="checkbox" className="size-4" />
                  </td>
                  <td className="px-3 py-2 text-tg-link hover:underline cursor-pointer">
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
    const currentImage = MOCK_IMAGES[activeImageIndex]
    
    return (
      <div className="flex flex-col gap-6">
        {renderBreadcrumb()}
        
        {/* Toolbar */}
        <div className="flex items-center gap-1 border border-border bg-card p-1 w-fit">
          <button className="p-1.5 hover:bg-muted" title="Zoom">
            <ZoomIn className="size-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted" title="Download">
            <Download className="size-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted" title="Print">
            <Printer className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Context Info */}
        <div className="text-sm space-y-1">
          <div><span className="font-medium text-muted-foreground">Trading Partner Name:</span> <span className="text-foreground">{selectedVendor?.name}</span></div>
          <div><span className="font-medium text-muted-foreground">Account Number:</span> <span className="text-foreground">{selectedVendor?.accountNumber}</span></div>
          <div><span className="font-medium text-muted-foreground">Selection Code:</span> <span className="text-foreground">{selectedSelectionCode}</span></div>
          <div><span className="font-medium text-muted-foreground">Description:</span> <span className="text-foreground">Selcode {selectedSelectionCode} Update</span></div>
          <div><span className="font-medium text-muted-foreground">Product:</span> <span className="text-foreground">{selectedProduct?.id}</span></div>
          <div><span className="font-medium text-muted-foreground">Product Description:</span> <span className="text-foreground">{selectedProduct?.description}</span></div>
          <div><span className="font-medium text-muted-foreground">Images:</span> <span className="text-foreground">{selectedProduct?.images}</span></div>
        </div>

        {/* Image Grid with Attributes and Preview */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Attributes Table */}
          <div className="border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
              <button className="p-1 hover:bg-muted" title="Download">
                <Download className="size-3 text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-muted" title="Print">
                <Printer className="size-3 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium text-tg-link">Product Level Image</span>
            </div>
            
            <div className="text-sm">
              {[
                { label: "File Name:", value: currentImage?.fileName },
                { label: "File Type:", value: currentImage?.fileType },
                { label: "Image Type:", value: currentImage?.imageType, link: true },
                { label: "Purpose:", value: currentImage?.purpose, link: true },
                { label: "Orientation:", value: currentImage?.orientation, link: true },
                { label: "Location Type:", value: currentImage?.locationType },
                { label: "External Location:", value: "" },
                { label: "File Size:", value: "" },
                { label: "Pixel Density (DPI):", value: "" },
                { label: "Height:", value: "" },
                { label: "Width:", value: "" },
                { label: "Image Style:", value: "" },
                { label: "Facing (GDSN):", value: "" },
                { label: "Angle:", value: "" },
                { label: "Clipping Path:", value: "" },
                { label: "Image Description:", value: "" },
                { label: "Create Date:", value: currentImage?.createDate },
                { label: "Last Update Date:", value: currentImage?.lastUpdate || "" },
              ].map((row, idx) => (
                <div key={idx} className="flex border-b border-border last:border-b-0">
                  <div className="w-44 bg-muted/20 px-3 py-2 font-medium text-foreground">{row.label}</div>
                  <div className={cn("flex-1 px-3 py-2", row.link ? "text-tg-link" : "text-foreground")}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Preview */}
          <div className="border border-border bg-white flex flex-col">
            <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3 py-2">
              <button className="p-1 hover:bg-muted" title="Zoom">
                <ZoomIn className="size-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 min-h-[400px]">
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded">
                <FileImage className="size-24 text-primary/40 mb-4" />
                <p className="text-sm text-muted-foreground">Product Image Preview</p>
                <p className="text-xs text-muted-foreground mt-1">{currentImage?.fileName}</p>
              </div>
            </div>
            
            {/* Thumbnail Strip */}
            {MOCK_IMAGES.length > 1 && (
              <div className="border-t border-border bg-muted/20 p-2">
                <div className="flex gap-2 overflow-x-auto">
                  {MOCK_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "flex-shrink-0 rounded border-2 overflow-hidden transition-all p-2",
                        activeImageIndex === idx 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <FileImage className="size-12 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
