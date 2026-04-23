"use client"

import { useState } from "react"
import { TradingGridLayout } from "@/components/trading-grid/layout"
import { ImageUploadLanding } from "@/components/trading-grid/image-upload-hub"
import { ImageUploadWizard } from "@/components/trading-grid/image-upload-wizard"

export default function ImageUploadPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [uploadLevel, setUploadLevel] = useState<"product" | "product-color" | "gtin">("product")

  return (
    <TradingGridLayout activeNav="image-upload">
      {!wizardOpen ? (
        <ImageUploadLanding onUploadClick={() => setWizardOpen(true)} />
      ) : (
        <ImageUploadWizard
          uploadLevel={uploadLevel}
          setUploadLevel={setUploadLevel}
          onCancel={() => setWizardOpen(false)}
          onComplete={() => setWizardOpen(false)}
        />
      )}
    </TradingGridLayout>
  )
}
