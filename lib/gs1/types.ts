// Shared, client-safe GS1 types. Contains NO option data — only type definitions and the
// category list — so it can be imported by both client components and server routes without
// pulling the full (large) generated option map into the browser bundle.

export type ProductCategory = "Shoes" | "Apparel" | "Bags" | "Jewelry" | "Beauty" | "Home"

export const PRODUCT_CATEGORIES: ProductCategory[] = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty", "Home"]

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
