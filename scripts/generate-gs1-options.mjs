// Build-time generator: parses GS1_Extended_Attribute_Code_Lists_Fixed.csv and emits a
// TypeScript module (lib/gs1/generated-options.ts) containing the FULL set of CSV-derived
// allowed values, but only for each category's relevant Code List Names.
//
// Why build-time (not runtime):
//   - The full CSV (1,419 rows) is never shipped to the browser and never read from disk in
//     a serverless function. The generated module is tree-shaken per import site, and the
//     client only ever receives one category's options (via /api/attribute-options).
//   - Deterministic, reviewable output that is committed to the repo.
//
// Run:  node scripts/generate-gs1-options.mjs
//
// CSV columns: Code List Name, Attribute Value, Code

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const CSV_PATH = join(ROOT, "GS1_Extended_Attribute_Code_Lists_Fixed.csv")
const OUT_PATH = join(ROOT, "lib", "gs1", "generated-options.ts")

// ── Category → relevant Code List routing ───────────────────────────────────
// `display` is the clean, canonical Code List Name used throughout the app + sent to Gemini.
// `source` is the exact (sometimes OCR-mangled) Code List Name as it appears in the CSV.
const CATEGORY_ROUTING = {
  Apparel: [
    { display: "Code List for Dress Type", source: "Code List for Dress Type" },
    { display: "Sleeve Type", source: "Sleeve Type" },
    { display: "Collar/Neck Type", source: "Collar/Neck Type" },
    { display: "Closure", source: "Closure" },
    { display: "Occasion", source: "Occasion" },
    { display: "Gender", source: "Code List for Gender" },
    { display: "Code List for Fit", source: "Code List for Fit" },
    { display: "Code Type for Length Description", source: "Code Type for Length Description" },
    { display: "Primary Detail Type", source: "Primary Detail Type" },
    { display: "Primary Detail Placement", source: "Code List  Values for Primary Detail Placement" },
    { display: "Primary Detail Application", source: "Primary Detail Application" },
  ],
  Shoes: [
    { display: "Shoe Type", source: "Shoe Type" },
    { display: "Shoe Style", source: "Shoe Style" },
    { display: "Closure", source: "Closure" },
    { display: "Heel Type", source: "Code List for Heel Type" },
    { display: "Heel Height Range", source: "Code List for Heel Height Range" },
    { display: "Heel Material", source: "Code List for Heel Material" },
    { display: "Toe Shape", source: "Toe Shape" },
    { display: "Sole Type", source: "Sole Type" },
    { display: "Outsole Type", source: "Outsole Type" },
    { display: "Occasion", source: "Occasion" },
    { display: "Gender", source: "Code List for Gender" },
    { display: "Water Repellent", source: "Water Repellent" },
  ],
  Bags: [
    { display: "Bag Type", source: "Bag Type" },
    { display: "Closure", source: "Closure" },
    { display: "Lining Material", source: "Lining Material" },
    { display: "Special Embellishment", source: "Special Embellishment" },
    { display: "Primary Detail Application", source: "Primary Detail Application" },
    { display: "Primary Detail Placement", source: "Code List  Values for Primary Detail Placement" },
    { display: "Occasion", source: "Occasion" },
    { display: "Gender", source: "Code List for Gender" },
  ],
  Jewelry: [
    { display: "Jewelry Type", source: "Code List for Jewelry Type" },
    { display: "Jewelry Sets", source: "Code List for Jewelry Sets" },
    { display: "Earring Type", source: "Code List for Earring Type" },
    { display: "Necklace Type", source: "Code Value List for Necklace Type" },
    { display: "Ring Type", source: "Ring Type" },
    { display: "Bracelet Type", source: "Bracelet Type" },
    { display: "Band Type", source: "Band Type" },
    { display: "Metal", source: "Metal" },
    { display: "Closure", source: "Closure" },
    { display: "Occasion", source: "Occasion" },
    { display: "Gender", source: "Code List for Gender" },
  ],
  Beauty: [
    { display: "Beauty Area of Use", source: "Beauty Area of Use" },
    { display: "Beauty Treatment Specialty", source: "Bea uty Treatment Specialty" },
    { display: "Skin Type", source: "Skin Type" },
    { display: "Scent Type", source: "Scent Type" },
    { display: "SPF Rating", source: "SPF Rating" },
    { display: "Code List for Formulation", source: "Code List for Formulation" },
  ],
  Home: [
    { display: "Bedding Size", source: "Bedding Size" },
    { display: "Bedding Type", source: "Bedding Type" },
    { display: "Code List for Cookware Type", source: "Code List for Cookware Type" },
    { display: "Code List for Dinnerware Category", source: "Code List for Dinnerware Category" },
    { display: "Code List for Flatware Type", source: "Code List for Flatware Type" },
    { display: "Rug Type", source: "Rug Type" },
    { display: "Towel Type", source: "Towel Type" },
    { display: "Tableware Type", source: "Tableware Type" },
    { display: "Shape", source: "Shape" },
    { display: "Care Instructions Code", source: "Care Instructions Code" },
  ],
}

const CATEGORY_ORDER = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty", "Home"]

// ── CSV parsing (handles quoted fields) ─────────────────────────────────────
function parseCsv(text) {
  const rows = []
  let field = ""
  let row = []
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false }
      } else {
        field += c
      }
    } else {
      if (c === '"') { inQuotes = true }
      else if (c === ",") { row.push(field); field = "" }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = "" }
      else if (c === "\r") { /* ignore */ }
      else { field += c }
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

// Normalize a string: trim, collapse internal whitespace runs to a single space.
// This fixes CSV OCR artifacts like "Bea uty" / "Code List  Values" (double spaces) while
// keeping the value internally consistent (Gemini receives, echoes, and is validated against
// this exact normalized string).
function normalize(s) {
  return String(s).replace(/\s+/g, " ").trim()
}

// Some CSV rows have a SECOND value+code mashed into the Attribute Value cell, e.g.
//   value="Flats GM03SE TPFL Slippers", code="GM03SETPSL"
// which really represents two values: "Flats" (code GM03SETPFL) and "Slippers" (code GM03SETPSL).
// The embedded code is OCR-split with stray spaces. This expands such a row into the two real
// rows; non-artifact rows pass through unchanged. Returns an array of { value, code }.
function expandRow(value, code) {
  // Embedded code token: 2 letters, 2 digits, then 4-6 alphanumerics, possibly broken by spaces.
  const m = value.match(/^(.+?)\s+([A-Z]{2}\d{2}(?:\s?[A-Z0-9]){4,6})\s+(.+)$/)
  if (!m) return [{ value, code }]
  const valueA = m[1].trim()
  const codeA = m[2].replace(/\s+/g, "")
  const valueB = m[3].trim()
  // Guard: only split when the reconstructed code looks like a valid GS1 code.
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,6}$/.test(codeA)) return [{ value, code }]
  return [
    { value: valueA, code: codeA },
    { value: valueB, code },
  ]
}

// ── Main ────────────────────────────────────────────────────────────────────
const csvText = readFileSync(CSV_PATH, "utf8")
const rows = parseCsv(csvText)
const [, ...dataRows] = rows // drop header

// Index CSV by source Code List Name -> ordered, de-duplicated [{value, code}]
const bySource = new Map()
for (const r of dataRows) {
  if (!r || r.length < 3) continue
  const sourceName = normalize(r[0])
  const rawValue = normalize(r[1])
  const rawCode = normalize(r[2])
  if (!sourceName || !rawValue || !rawCode) continue
  if (!bySource.has(sourceName)) bySource.set(sourceName, new Map())
  const valueMap = bySource.get(sourceName)
  // Expand any mashed-together artifact rows into their real value/code pairs.
  for (const { value, code } of expandRow(rawValue, rawCode)) {
    if (value && code && !valueMap.has(value)) valueMap.set(value, code) // first occurrence wins
  }
}

// Build the per-category options using the routing map.
const categoryOptions = {}
const categoryCodeLists = {}
const stats = []

for (const category of CATEGORY_ORDER) {
  const routes = CATEGORY_ROUTING[category]
  const options = []
  const codeListNames = []
  let valueCount = 0
  for (const { display, source } of routes) {
    const valueMap = bySource.get(normalize(source))
    if (!valueMap || valueMap.size === 0) {
      throw new Error(`No CSV values found for category "${category}" code list source "${source}".`)
    }
    const values = [...valueMap.entries()].map(([value, code]) => ({ value, code }))
    options.push({ codeListName: display, values })
    codeListNames.push(display)
    valueCount += values.length
  }
  categoryOptions[category] = options
  categoryCodeLists[category] = codeListNames
  stats.push({ category, codeLists: routes.length, values: valueCount })
}

// ── Emit TypeScript ──────────────────────────────────────────────────────────
const header = `// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-options.mjs from
// GS1_Extended_Attribute_Code_Lists_Fixed.csv.
// Run \`node scripts/generate-gs1-options.mjs\` to regenerate.
//
// Contains the FULL set of CSV-derived allowed values, scoped to each category's
// relevant Code List Names only. Server-only by convention: imported by API routes,
// never by client components (the client receives a single category via the
// /api/attribute-options route).
// =============================================================================

import type { ProductCategory, CategoryOptions } from "./types"
`

const codeListsLiteral = JSON.stringify(categoryCodeLists, null, 2)
const optionsLiteral = JSON.stringify(categoryOptions, null, 2)

const body = `
// Relevant Code List Names per category (the routing used to filter the CSV).
export const CATEGORY_CODE_LISTS: Record<ProductCategory, string[]> = ${codeListsLiteral}

// Full CSV-derived allowed values per category, by Code List Name.
export const GS1_CATEGORY_OPTIONS: Record<ProductCategory, CategoryOptions> = ${optionsLiteral}

// Returns the full CSV-derived options for a category (empty array if unknown).
export function getCategoryOptions(category: string): CategoryOptions {
  return GS1_CATEGORY_OPTIONS[category as ProductCategory] ?? []
}
`

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, header + body, "utf8")

// Report
console.log("Generated", OUT_PATH)
console.log("Category | Code Lists | Attribute Values")
for (const s of stats) {
  console.log(`  ${s.category.padEnd(8)} | ${String(s.codeLists).padStart(10)} | ${s.values}`)
}
const totalValues = stats.reduce((a, s) => a + s.values, 0)
console.log(`  TOTAL across categories: ${totalValues} values (with shared lists counted per category)`)
