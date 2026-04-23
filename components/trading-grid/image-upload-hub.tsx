"use client"

import { Upload, Search, FileImage, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ImageUploadLandingProps {
  onUploadClick: () => void
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
            Upload product images and assign them to products or product variants.
          </p>
        </div>
        {/* Toolbar Icons - matching Trading Grid style */}
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

      {/* Main Upload Card */}
      <Card className="border-2 border-primary/20 bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center gap-6 px-8 py-12">
            {/* Icon */}
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <Upload className="size-10 text-primary" />
            </div>

            {/* Title and Description */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">Upload Images</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Upload JPG, PNG, or TIFF image files with associated attributes. 
                Assign images at the Product level or Product + Color Code level.
              </p>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileImage className="size-4 text-primary" />
                <span>Drag and drop support</span>
              </div>
              <div className="flex items-center gap-2">
                <FileImage className="size-4 text-primary" />
                <span>Multiple GTINs per product</span>
              </div>
              <div className="flex items-center gap-2">
                <FileImage className="size-4 text-primary" />
                <span>Auto-detect metadata</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={onUploadClick} 
              size="lg" 
              className="mt-2 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="size-4" />
              Upload Images
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Search */}
      <div className="rounded border border-border bg-card p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Quick Access</span>
            <span className="text-xs text-muted-foreground">(Jump to product by GTIN)</span>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Enter GTIN, Product ID, or Selection Code..."
                className="h-9 pr-10"
              />
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Button variant="outline" size="default">
              Go
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a GTIN or Product ID to jump directly to the upload wizard with the target pre-filled.
          </p>
        </div>
      </div>

      {/* Recent Activity / Stats */}
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
