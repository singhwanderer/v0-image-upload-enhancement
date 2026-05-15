"use client"

import { useState } from "react"
import { TradingGridLayout, PortalType } from "@/components/trading-grid/layout"
import { ImageUploadLanding, RetailerImageBrowser } from "@/components/trading-grid/image-upload-hub"
import { ImageUploadWizard } from "@/components/trading-grid/image-upload-wizard"

export default function ImageUploadPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [uploadLevel, setUploadLevel] = useState<"product" | "product-color" | "gtin">("product")
  const [portalType, setPortalType] = useState<PortalType>("supplier")

  return (
    <TradingGridLayout 
      activeNav={portalType === "supplier" ? "image-upload" : "vendor-list"}
      portalType={portalType}
      onPortalChange={setPortalType}
    >
      {portalType === "supplier" ? (
        // Supplier Portal: Upload flow
        !wizardOpen ? (
          <ImageUploadLanding onUploadClick={(level) => {
            setUploadLevel(level)
            setWizardOpen(true)
          }} />
        ) : (
          <ImageUploadWizard
            uploadLevel={uploadLevel}
            setUploadLevel={setUploadLevel}
            onCancel={() => setWizardOpen(false)}
            onComplete={() => setWizardOpen(false)}
            portalType={portalType}
          />
        )
      ) : (
        // Retailer Portal: Browse/View flow
        <RetailerImageBrowser />
      )}
    </TradingGridLayout>
  )
}
