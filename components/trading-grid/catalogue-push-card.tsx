"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Database, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import type { ExtractedAttribute } from "@/lib/gs1/types"
import { AiAttributesTable } from "./ai-attributes-table"

// Post-submit catalogue card: the AI-derived attributes describe the PRODUCT (not its
// images), so they belong in the catalogue. This card lets the supplier push the accepted
// set to the catalogue database for every GTIN of the product — image details go to
// retailers via syndication; product attributes go to the catalogue via this push.
// The push is simulated client-side, consistent with the rest of the prototype, including
// one simulated value conflict the supplier resolves with Replace / Skip.
type PushStep = "confirm" | "pushing" | "conflict"

type PushResult = {
  gtinCount: number
  pushedCount: number
  conflict?: { codeListName: string; resolution: "replaced" | "skipped" }
}

export function CataloguePushCard({
  attributes,
  gtins,
  productId,
  valuesForCodeList,
  category,
  brickName,
  brickCode,
}: {
  // Accepted product attributes only — pending/rejected never reach the catalogue.
  attributes: ExtractedAttribute[]
  gtins: string[]
  productId: string
  valuesForCodeList: (codeListName: string) => { code: string; value: string }[]
  category?: string
  brickName?: string
  brickCode?: string
}) {
  const [step, setStep] = useState<PushStep | null>(null)
  const [result, setResult] = useState<PushResult | null>(null)

  const attrCount = attributes.length
  const gtinCount = gtins.length
  const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? "s" : ""}`

  // Simulated conflict: the first accepted attribute "already exists" in the catalogue with
  // a different value, mocked from the same GS1 code list where possible.
  const conflictAttr = attributes[0]
  const existingValue = conflictAttr
    ? valuesForCodeList(conflictAttr.codeListName).find(v => v.value !== conflictAttr.attributeValue)?.value ?? "Not specified"
    : ""

  const startPush = () => {
    setStep("pushing")
    setTimeout(() => setStep("conflict"), 1200)
  }

  const finishPush = (resolution: "replaced" | "skipped") => {
    const pushedCount = resolution === "skipped" ? attrCount - 1 : attrCount
    setResult({ gtinCount, pushedCount, conflict: conflictAttr ? { codeListName: conflictAttr.codeListName, resolution } : undefined })
    setStep(null)
    toast({
      title: "Pushed to catalogue",
      description: `${plural(pushedCount, "attribute")} written to ${plural(gtinCount, "GTIN")} of ${productId}. 1 conflict ${resolution}.`,
    })
  }

  return (
    <div className="rounded border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded bg-primary/10">
            <Database className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product Attributes — Catalogue</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              These AI-derived attributes describe the product, not just its images. Push them to the
              catalogue database for all GTINs of this product — currently only image details are shared
              with retailers.
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 gap-1.5"
          disabled={attrCount === 0}
          onClick={() => setStep("confirm")}
        >
          <ArrowRight className="size-4" />
          {result ? "Push again" : "Push to Catalogue"}
        </Button>
      </div>

      {result && (
        <div className="flex items-start gap-2 rounded border border-tg-success/40 bg-tg-success/5 p-3">
          <CheckCircle2 className="size-4 text-tg-success mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">
            Pushed to catalogue — {plural(result.gtinCount, "GTIN")} · {plural(result.pushedCount, "attribute")}
            {result.conflict && (
              <span className="text-muted-foreground"> (1 conflict on {result.conflict.codeListName}: {result.conflict.resolution})</span>
            )}
          </p>
        </div>
      )}

      {attrCount === 0 ? (
        <p className="text-sm text-muted-foreground">
          No AI attributes were accepted before submission, so there is nothing to push yet.
        </p>
      ) : (
        <AiAttributesTable
          attributes={attributes}
          category={category}
          brickName={brickName}
          brickCode={brickCode}
        />
      )}

      <Dialog open={step !== null} onOpenChange={(o) => { if (!o && step !== "pushing") setStep(null) }}>
        <DialogContent className="max-w-md">
          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>Push to Catalogue</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-2">
                <p className="text-sm text-muted-foreground">
                  {plural(attrCount, "attribute")} will be written to the catalogue database for{" "}
                  {gtinCount > 0 ? `all ${plural(gtinCount, "GTIN")}` : "the GTINs"} of{" "}
                  <span className="font-medium text-foreground">{productId}</span>:
                </p>
                {gtinCount > 0 && (
                  <ul className="flex flex-col gap-1 max-h-40 overflow-y-auto rounded border border-border bg-muted/20 p-2">
                    {gtins.map(g => (
                      <li key={g} className="font-mono text-sm text-foreground">{g}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setStep(null)}>Cancel</Button>
                <Button className="gap-1.5" onClick={startPush}>
                  <ArrowRight className="size-4" />
                  Push {plural(attrCount, "attribute")} to {plural(gtinCount, "GTIN")}
                </Button>
              </div>
            </>
          )}

          {step === "pushing" && (
            <>
              <DialogHeader>
                <DialogTitle>Pushing to catalogue…</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3 py-6">
                <Loader2 className="size-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Writing {plural(attrCount, "attribute")} to {plural(gtinCount, "GTIN")}…
                </p>
              </div>
            </>
          )}

          {step === "conflict" && conflictAttr && (
            <>
              <DialogHeader>
                <DialogTitle>Attribute conflict</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{conflictAttr.codeListName}</span> already
                  exists in the catalogue with a different value. Replace it, or skip this attribute and
                  push the rest?
                </p>
                <div className="rounded border border-border bg-muted/20 p-3 flex flex-col gap-1.5 text-sm">
                  <p>
                    <span className="text-muted-foreground">In catalogue:</span>{" "}
                    <span className="font-medium text-foreground">{existingValue}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Incoming:</span>{" "}
                    <span className="font-medium text-foreground">{conflictAttr.attributeValue}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => finishPush("skipped")}>Skip this attribute</Button>
                <Button onClick={() => finishPush("replaced")}>Replace with incoming</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
