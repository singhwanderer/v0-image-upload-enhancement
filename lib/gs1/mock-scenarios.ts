// Client-safe mock extraction scenarios.
//
// These are a small, FIXED set of "suggested" attributes per category for stable demos that
// work without Gemini or GEMINI_API_KEY. Seeds carry only a Code List Name + Attribute Value;
// the authoritative GS1 code is resolved at runtime against the CSV-derived options the client
// already fetched (so mock suggestions stay grounded in the same full map as Gemini + dropdowns).
//
// This module imports ONLY the shared types (no option data), so it is safe to bundle on the client.

import type { ProductCategory, CategoryOptions } from "./types"

export type MockSeed = {
  codeListName: string
  value: string
  confidence: number
  reason: string
}

export type MockUnresolved = {
  codeListName: string
  reason: string
}

export type MockExtractionResponse = {
  category: string
  attributes: {
    codeListName: string
    attributeValue: string
    code: string
    confidence: number
    reason: string
  }[]
  unresolvedAttributes: MockUnresolved[]
}

const MOCK_SCENARIOS: Record<ProductCategory, { seeds: MockSeed[]; unresolved: MockUnresolved[] }> = {
  Shoes: {
    seeds: [
      { codeListName: "Shoe Type", value: "Sandals", confidence: 0.91, reason: "Open upper with foot straps consistent with a sandal silhouette." },
      { codeListName: "Toe Shape", value: "Round", confidence: 0.8, reason: "Rounded toe box visible in the profile." },
      { codeListName: "Occasion", value: "Casual", confidence: 0.74, reason: "General styling suggests casual use." },
      { codeListName: "Gender", value: "Unisex", confidence: 0.69, reason: "Neutral colorway and last shape; verify." },
    ],
    unresolved: [
      { codeListName: "Water Repellent", reason: "Water repellency cannot be determined from an image alone." },
      { codeListName: "Heel Material", reason: "Material is not reliably identifiable from the image." },
    ],
  },
  Apparel: {
    seeds: [
      { codeListName: "Code List for Dress Type", value: "A-line", confidence: 0.87, reason: "Fitted bodice flaring toward the hem indicates an A-line dress." },
      { codeListName: "Sleeve Type", value: "Sleeveless", confidence: 0.82, reason: "No sleeve coverage visible at the shoulder." },
      { codeListName: "Code List for Fit", value: "Relaxed", confidence: 0.7, reason: "Loose drape through the body." },
      { codeListName: "Gender", value: "Female", confidence: 0.66, reason: "Silhouette suggests women's apparel; verify." },
    ],
    unresolved: [
      { codeListName: "Primary Detail Type", reason: "No distinct applied detail is clearly visible." },
      { codeListName: "Primary Detail Placement", reason: "Detail placement cannot be confirmed from the image." },
    ],
  },
  Bags: {
    seeds: [
      { codeListName: "Bag Type", value: "Satchel", confidence: 0.9, reason: "Structured body with top handles consistent with a satchel." },
      { codeListName: "Occasion", value: "Casual", confidence: 0.73, reason: "Styling suggests everyday use." },
      { codeListName: "Gender", value: "Female", confidence: 0.65, reason: "Styling suggests women's accessory; verify." },
    ],
    unresolved: [
      { codeListName: "Lining Material", reason: "Interior lining is not visible in the image." },
      { codeListName: "Special Embellishment", reason: "No distinct embellishment is clearly visible." },
    ],
  },
  Jewelry: {
    seeds: [
      { codeListName: "Jewelry Type", value: "Fashion", confidence: 0.85, reason: "Styling and materials suggest fashion jewelry." },
      { codeListName: "Earring Type", value: "Hoop", confidence: 0.8, reason: "Continuous circular loop form visible." },
      { codeListName: "Gender", value: "Female", confidence: 0.66, reason: "Styling suggests women's jewelry; verify." },
    ],
    unresolved: [
      { codeListName: "Metal", reason: "Exact metal/alloy requires a hallmark or product spec." },
      { codeListName: "Closure", reason: "Closure mechanism is not clearly visible." },
    ],
  },
  Beauty: {
    seeds: [
      { codeListName: "Beauty Area of Use", value: "Lip", confidence: 0.84, reason: "Product form and packaging indicate lip application." },
    ],
    unresolved: [
      { codeListName: "SPF Rating", reason: "SPF value requires the product label." },
      { codeListName: "Scent Type", reason: "Scent cannot be determined from an image alone." },
      { codeListName: "Skin Type", reason: "Targeted skin type requires label claims or product data." },
    ],
  },
  Home: {
    seeds: [
      { codeListName: "Bedding Type", value: "Comforter", confidence: 0.86, reason: "Quilted, padded top layer consistent with a comforter." },
      { codeListName: "Shape", value: "Rectangular", confidence: 0.78, reason: "Standard rectangular form factor visible." },
    ],
    unresolved: [
      { codeListName: "Bedding Size", reason: "Exact size requires product data, not a visible scale." },
      { codeListName: "Care Instructions Code", reason: "Requires a care label or product data." },
    ],
  },
}

// Builds a mock extraction response, grounding each seed's GS1 code in the supplied
// CSV-derived options (the same full map used by Gemini + the edit dropdowns).
// Seeds whose value can't be resolved against the options are skipped defensively.
export function buildMockExtraction(category: string, options: CategoryOptions): MockExtractionResponse {
  const scenario = MOCK_SCENARIOS[category as ProductCategory]
  if (!scenario) {
    return { category, attributes: [], unresolvedAttributes: [] }
  }

  const codeFor = (codeListName: string, value: string): string | undefined =>
    options.find(o => o.codeListName === codeListName)?.values.find(v => v.value === value)?.code

  const attributes = scenario.seeds
    .map(seed => {
      const code = codeFor(seed.codeListName, seed.value)
      if (!code) return null
      return {
        codeListName: seed.codeListName,
        attributeValue: seed.value,
        code,
        confidence: seed.confidence,
        reason: seed.reason,
      }
    })
    .filter((a): a is NonNullable<typeof a> => a !== null)

  return { category, attributes, unresolvedAttributes: scenario.unresolved }
}
