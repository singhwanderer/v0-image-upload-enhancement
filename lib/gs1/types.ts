// Shared, client-safe GS1 types. Contains NO option data — only type definitions and the
// category list — so it can be imported by both client components and server routes without
// pulling the full (large) generated option map into the browser bundle.

// Categories mirror the GPC matrix sheets in the repo root (Clothing.csv, Footwear.csv, …);
// sleepwear/swimwear/underwear fold into Clothing per the GPC Clothing family. Only categories
// with brick coverage in those sheets are listed — AI extraction is scoped to their code lists.
export type ProductCategory = "Clothing" | "Shoes" | "Bags" | "Jewelry" | "Beauty" | "Accessories"

export const PRODUCT_CATEGORIES: ProductCategory[] = ["Clothing", "Shoes", "Bags", "Jewelry", "Beauty", "Accessories"]

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as string[]).includes(value)
}

// A single allowed value within a Code List, with its authoritative GS1 code.
export type AttributeOptionValue = {
  value: string
  code: string
}

// All allowed values for one Code List Name.
export type CodeListOptions = {
  codeListName: string
  values: AttributeOptionValue[]
}

// The full set of relevant Code Lists (and their values) for one product category.
export type CategoryOptions = CodeListOptions[]

// AI extended-attribute extraction types, shared between the Supplier upload wizard and the
// Retailer browser (so both can render the same attribute table/drawer against the same shape).
// `decision` is tri-state: suggestions arrive "pending" and require an explicit Accept click to
// count (Accept and Reject are shown as separate actions on every card).
export type AttributeDecision = "pending" | "accepted" | "rejected"

export type ExtractedAttribute = {
  codeListName: string
  attributeValue: string
  code: string
  confidence: number
  reason: string
  decision: AttributeDecision
}

export type UnresolvedAttribute = {
  codeListName: string
  reason: string
}
