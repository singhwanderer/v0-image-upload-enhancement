// Build-time generator for ALL GS1 reference data. Reads exactly two kinds of reference files
// (nothing else — no xlsx, no hand-authored routing):
//
//   1. gs1_extended_attribute_master_code_list.csv — the master GS1 code list
//      (columns: Code List Name, Code List Value, Code).
//   2. The per-category GPC matrix CSVs (Clothing.csv, Footwear.csv, Sleepwear.csv, …) — one
//      sheet per GPC family. Each sheet is a matrix: columns are GPC bricks (8-digit codes +
//      names), rows are attribute names, and an "E"/"R" cell marks that attribute as expected/
//      required for that brick.
//
// Emits two TypeScript modules (committed to the repo — the runtime source of truth):
//   - lib/gs1/generated-bricks.ts   category -> GPC bricks -> applicable Code List Names
//   - lib/gs1/generated-options.ts  category -> Code List Names -> allowed values + GS1 codes
//
// Why build-time (not runtime): the CSVs are never shipped to the browser and never read from
// disk in a serverless function. Output is deterministic and reviewable. The client only ever
// receives one category's options (via /api/attribute-options).
//
// Only code-list-backed attributes are emitted: matrix rows whose name does not resolve to a
// master Code List (free-text/numeric attributes like Brand Name, Country of Origin, package
// dimensions) are skipped and reported as warnings.
//
// Run:  node scripts/generate-gs1-data.mjs   (or: npm run generate:gs1)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const MASTER_CSV = join(ROOT, "gs1_extended_attribute_master_code_list.csv")
const OUT_BRICKS = join(ROOT, "lib", "gs1", "generated-bricks.ts")
const OUT_OPTIONS = join(ROOT, "lib", "gs1", "generated-options.ts")

// ── Category → matrix sheet routing ─────────────────────────────────────────
// Every brick and attribute the app knows about comes from these sheets; sheet order within a
// category determines brick order in the UI dropdown. Sheet1.csv is an index sheet — ignored.
// GPC groups sleepwear/swimwear/underwear under the Clothing family, so they fold into Clothing.
const CATEGORY_SHEETS = {
  Clothing: ["Clothing.csv", "Sleepwear.csv", "Swimwear.csv", "Underwear.csv"],
  Shoes: ["Footwear.csv"],
  Bags: ["Handbags.csv"],
  Jewelry: ["Jewelry.csv"],
  Beauty: [
    "Cosmetics-Makeup Products.csv",
    "Fragrances.csv",
    "Nail Care.csv",
    "Skin Care.csv",
    "Hair Care.csv",
    "Hair Removal.csv",
    "Body Washing.csv",
    "Sunscreen-Tanning.csv",
  ],
  Accessories: ["Accessories.csv"],
}

const CATEGORY_ORDER = ["Clothing", "Shoes", "Bags", "Jewelry", "Beauty", "Accessories"]

// ── Matrix attribute name → master Code List Name aliases ──────────────────
// The canonical resolution is `<attribute name> Code List` (optionally stripping a trailing
// " Code" first). These aliases cover the remaining naming drift between the matrix sheets and
// the master list. Keys and values are whitespace-normalized.
const ATTRIBUTE_ALIASES = {
  "Collar Type": "Collar/Neck Type Code List",
  "Collar/Neck Type": "Collar/Neck Type Code List",
  "Shoe Style": "Sho Style Code List", // master file typo — display name is fixed below
  "Hat Type": "Hat Code List",
  "Raw Materials Certifications": "Raw Materials Certifications", // no " Code List" suffix in master
  "Panty/Swim Back Coverage": "Panty Back Coverage Code List",
  "Swim Coverup Type": "Swim Cover Up Type Code List",
  "Swim One-piece Type": "Swim One-Piece Type Code List",
  "Heel Height": "Heel Height Range Code List", // master carries heel height as a range list
}

// Master list names whose derived display name needs a spelling fix.
const DISPLAY_NAME_FIXES = {
  "Sho Style": "Shoe Style",
  Hat: "Hat Type",
}

// ── CSV parsing (quote-aware) ───────────────────────────────────────────────
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

// Normalize: strip BOM, trim, collapse internal whitespace runs to a single space. The
// normalized string is what Gemini receives, echoes, and is validated against.
function normalize(s) {
  return String(s).replace(/^﻿/, "").replace(/\s+/g, " ").trim()
}

// Some master rows have a SECOND value+code mashed into the value cell, e.g.
//   value="Flats GM03SE TPFL Slippers", code="GM03SETPSL"
// This expands such a row into its two real value/code pairs; clean rows pass through.
function expandRow(value, code) {
  const m = value.match(/^(.+?)\s+([A-Z]{2}\d{2}(?:\s?[A-Z0-9]){4,6})\s+(.+)$/)
  if (!m) return [{ value, code }]
  const valueA = m[1].trim()
  const codeA = m[2].replace(/\s+/g, "")
  const valueB = m[3].trim()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,6}$/.test(codeA)) return [{ value, code }]
  return [
    { value: valueA, code: codeA },
    { value: valueB, code },
  ]
}

// ── 1. Parse the master code list ───────────────────────────────────────────
// masterListName -> ordered, de-duplicated Map(value -> code); first occurrence wins.
const masterLists = new Map()
{
  const [, ...dataRows] = parseCsv(readFileSync(MASTER_CSV, "utf8"))
  for (const r of dataRows) {
    if (!r || r.length < 3) continue
    const listName = normalize(r[0])
    const rawValue = normalize(r[1])
    const rawCode = normalize(r[2])
    if (!listName || !rawValue || !rawCode) continue
    if (!masterLists.has(listName)) masterLists.set(listName, new Map())
    const valueMap = masterLists.get(listName)
    for (const { value, code } of expandRow(rawValue, rawCode)) {
      if (value && code && !valueMap.has(value)) valueMap.set(value, code)
    }
  }
}

// Resolve a matrix attribute row name to a master Code List Name (or null if none exists —
// i.e. the attribute is free-text/numeric and is intentionally skipped).
function resolveMasterListName(attrName) {
  const candidates = [
    ATTRIBUTE_ALIASES[attrName],
    attrName,
    `${attrName} Code List`,
    `${attrName.replace(/ Code$/, "")} Code List`,
  ]
  for (const c of candidates) {
    if (c && masterLists.has(c)) return c
  }
  return null
}

// Display name shown in the app + sent to Gemini: master name minus the " Code List" suffix.
function displayName(masterListName) {
  const base = masterListName.replace(/ Code List$/, "")
  return DISPLAY_NAME_FIXES[base] ?? base
}

// ── 2. Parse each matrix sheet into bricks ──────────────────────────────────
// A sheet's layout varies slightly (banner rows, GPC Class rows), so locate the brick-code row
// by content: the first row containing an 8-digit cell. The next row holds brick names.
function parseMatrixSheet(fileName) {
  const rows = parseCsv(readFileSync(join(ROOT, fileName), "utf8"))
  const codeRowIdx = rows.findIndex(r => r.some(c => /^\d{8}$/.test(normalize(c))))
  if (codeRowIdx === -1 || codeRowIdx + 1 >= rows.length) {
    throw new Error(`${fileName}: could not locate the GPC brick-code row.`)
  }
  const codeRow = rows[codeRowIdx].map(normalize)
  const nameRow = rows[codeRowIdx + 1].map(normalize)

  // Columns that carry a brick code; code-less trailing columns are dropped.
  const brickCols = []
  for (let i = 1; i < codeRow.length; i++) {
    if (/^\d{8}$/.test(codeRow[i])) {
      if (!nameRow[i]) throw new Error(`${fileName}: brick ${codeRow[i]} has no name.`)
      brickCols.push({ col: i, code: codeRow[i], name: nameRow[i] })
    }
  }

  const bricks = brickCols.map(b => ({ code: b.code, name: b.name, attrNames: [] }))
  for (const r of rows.slice(codeRowIdx + 2)) {
    const attrName = normalize(r[0])
    if (!attrName || attrName === "Totals") continue
    brickCols.forEach((b, idx) => {
      const mark = normalize(r[b.col] ?? "").toUpperCase()
      if (mark === "E" || mark === "R") bricks[idx].attrNames.push(attrName)
    })
  }
  return bricks
}

// ── 3. Assemble categories ──────────────────────────────────────────────────
const categoryBricks = {}
const categoryOptions = {}
const categoryCodeLists = {}
const skippedAttrNames = new Map() // attrName -> occurrence count (no master list — expected for free-text)
const emptyBricks = []

for (const category of CATEGORY_ORDER) {
  const bricks = []
  const codeListOrder = [] // first-use order of display names across the category's bricks

  for (const sheet of CATEGORY_SHEETS[category]) {
    for (const parsed of parseMatrixSheet(sheet)) {
      const attributeCodeListNames = []
      for (const attrName of parsed.attrNames) {
        const masterName = resolveMasterListName(attrName)
        if (!masterName) {
          skippedAttrNames.set(attrName, (skippedAttrNames.get(attrName) ?? 0) + 1)
          continue
        }
        const display = displayName(masterName)
        if (!attributeCodeListNames.includes(display)) attributeCodeListNames.push(display)
        if (!codeListOrder.includes(display)) codeListOrder.push(display)
      }
      if (attributeCodeListNames.length === 0) emptyBricks.push(`${category} / ${parsed.name} (${parsed.code})`)
      bricks.push({ code: parsed.code, name: parsed.name, attributeCodeListNames })
    }
  }

  // Options: every code list used by this category's bricks, values straight from the master.
  const displayToMaster = new Map()
  for (const listName of masterLists.keys()) {
    const d = displayName(listName)
    if (!displayToMaster.has(d)) displayToMaster.set(d, listName)
  }
  const options = codeListOrder.map(display => {
    const valueMap = masterLists.get(displayToMaster.get(display))
    return {
      codeListName: display,
      values: [...valueMap.entries()].map(([value, code]) => ({ value, code })),
    }
  })

  categoryBricks[category] = bricks
  categoryOptions[category] = options
  categoryCodeLists[category] = codeListOrder
}

// ── 4. Emit lib/gs1/generated-bricks.ts ─────────────────────────────────────
const bricksHeader = `// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-data.mjs from the per-category GPC matrix
// CSVs (Clothing.csv, Footwear.csv, …) and gs1_extended_attribute_master_code_list.csv.
// Run \`node scripts/generate-gs1-data.mjs\` to regenerate.
//
// Maps each product category to its GPC bricks. Per brick, attributeCodeListNames lists the
// Code List Names valid for that brick (a subset of the category's Code List Names, so master
// values + GS1 codes remain available via generated-options.ts). Names only → client-safe.
// =============================================================================

import type { ProductCategory } from "./types"

// One GPC brick (leaf classification) and the Code List Names that apply to it.
export type Brick = {
  code: string
  name: string
  attributeCodeListNames: string[]
}
`

const bricksBody = `
export const CATEGORY_BRICKS: Record<ProductCategory, Brick[]> = ${JSON.stringify(categoryBricks, null, 2)}

// All bricks for a category (empty array if unknown).
export function getCategoryBricks(category: string): Brick[] {
  return CATEGORY_BRICKS[category as ProductCategory] ?? []
}

// Look up a single brick by category + code (undefined if not found).
export function getBrick(category: string, code: string): Brick | undefined {
  return getCategoryBricks(category).find(b => b.code === code)
}
`

// ── 5. Emit lib/gs1/generated-options.ts ────────────────────────────────────
const optionsHeader = `// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-gs1-data.mjs from the per-category GPC matrix
// CSVs (Clothing.csv, Footwear.csv, …) and gs1_extended_attribute_master_code_list.csv.
// Run \`node scripts/generate-gs1-data.mjs\` to regenerate.
//
// Contains the FULL set of master-list allowed values, scoped to each category's
// relevant Code List Names only. Server-only by convention: imported by API routes,
// never by client components (the client receives a single category via the
// /api/attribute-options route).
// =============================================================================

import type { ProductCategory, CategoryOptions } from "./types"
`

const optionsBody = `
// Relevant Code List Names per category (derived from the category's brick matrices).
export const CATEGORY_CODE_LISTS: Record<ProductCategory, string[]> = ${JSON.stringify(categoryCodeLists, null, 2)}

// Full master-list allowed values per category, by Code List Name.
export const GS1_CATEGORY_OPTIONS: Record<ProductCategory, CategoryOptions> = ${JSON.stringify(categoryOptions, null, 2)}

// Returns the full master-list options for a category (empty array if unknown).
export function getCategoryOptions(category: string): CategoryOptions {
  return GS1_CATEGORY_OPTIONS[category as ProductCategory] ?? []
}
`

mkdirSync(dirname(OUT_BRICKS), { recursive: true })
writeFileSync(OUT_BRICKS, bricksHeader + bricksBody, "utf8")
writeFileSync(OUT_OPTIONS, optionsHeader + optionsBody, "utf8")

// ── 6. Report ───────────────────────────────────────────────────────────────
console.log("Generated", OUT_BRICKS)
console.log("Generated", OUT_OPTIONS)
console.log("\nCategory    | Bricks | Code Lists | Attribute Values")
for (const category of CATEGORY_ORDER) {
  const values = categoryOptions[category].reduce((a, o) => a + o.values.length, 0)
  console.log(
    `  ${category.padEnd(11)}| ${String(categoryBricks[category].length).padStart(6)} | ${String(categoryCodeLists[category].length).padStart(10)} | ${values}`,
  )
}

if (skippedAttrNames.size > 0) {
  console.log("\nSkipped attribute rows with no master Code List (free-text/numeric — expected):")
  for (const [name, count] of [...skippedAttrNames.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name}  (${count} brick${count === 1 ? "" : "s"})`)
  }
}

if (emptyBricks.length > 0) {
  console.log("\nWARNING: bricks with ZERO resolved code lists:")
  for (const b of emptyBricks) console.log(`  ${b}`)
}
