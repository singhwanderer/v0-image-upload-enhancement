import type { ExtractedAttribute } from "@/lib/gs1/types"

export type AiAttributesTableProps = {
  attributes: ExtractedAttribute[]
  category?: string
  brickName?: string
  brickCode?: string
  imageCount?: number
  imageNames?: string[]
}

// Product-level AI-extracted attribute table. Reused by the Step 3 review table and both the
// Supplier and Retailer "View AI Attributes" drawers — the data describes the whole product
// (identical across every image of that product), not one photo, so this renders once per
// product, not once per image.
export function AiAttributesTable({ attributes, category, brickName, brickCode, imageCount, imageNames }: AiAttributesTableProps) {
  if (attributes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No AI-extracted attributes have been accepted for this product yet.</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {(brickName || category) && (
          <p className="text-xs text-muted-foreground">
            Product Category:{" "}
            <span className="font-medium text-foreground">{brickName ?? category}</span>
            {brickName && brickCode && <span className="font-mono"> ({brickCode})</span>}
          </p>
        )}
        {typeof imageCount === "number" && (
          <p className="text-xs text-muted-foreground">
            Images analyzed: <span className="font-medium text-foreground">{imageCount}</span>
            {imageNames && imageNames.length > 0 && <span> ({imageNames.join(", ")})</span>}
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-foreground">Code List Name</th>
              <th className="px-3 py-2 text-left font-medium text-foreground">Attribute Value</th>
              <th className="px-3 py-2 text-left font-medium text-foreground">GS1 Code</th>
              <th className="px-3 py-2 text-left font-medium text-foreground">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, idx) => (
              <tr key={`${attr.code}-${idx}`} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{attr.codeListName}</td>
                <td className="px-3 py-2 text-foreground">{attr.attributeValue}</td>
                <td className="px-3 py-2 font-mono text-foreground">{attr.code}</td>
                <td className="px-3 py-2 text-muted-foreground">{Math.round(attr.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        AI attributes apply to all images of this product — this is a product-level attribute set, stored separately from per-image attributes.
      </p>
    </div>
  )
}
