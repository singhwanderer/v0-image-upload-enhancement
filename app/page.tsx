"use client"

import { useState } from "react"
import { TradingGridLayout } from "@/components/trading-grid/layout"
import { ImageUploadHub } from "@/components/trading-grid/image-upload-hub"
import { ImageUploadWizard } from "@/components/trading-grid/image-upload-wizard"

export default function ImageUploadPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [uploadLevel, setUploadLevel] = useState<"product" | "product-color">("product")

  return (
    <TradingGridLayout activeNav="image-upload">
      {!wizardOpen ? (
        <ImageUploadHub onUploadClick={() => setWizardOpen(true)} />
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
