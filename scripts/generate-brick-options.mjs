// Build-time generator: reads brick-attributes.csv (flattened from
// `Brick to extended attributes.xlsx` by scripts/extract-brick-attributes.py) and emits a
// TypeScript module (lib/gs1/generated-bricks.ts) mapping each product category to its GPC
// bricks and, per brick, the Code List Names valid for that brick.
//
// Why build-time: deterministic, reviewable output committed to the repo. This map is small
// (names only, no CSV values) and therefore client-safe — the wizard imports it to populate the
// brick dropdown and to scope which attributes an extraction may suggest.
//
// Run:  node scripts/generate-brick-options.mjs
//
// CSV columns: category, brickCode, brickName, codeListName, requirement

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const CSV_PATH = join(ROOT, "brick-attributes.csv")
const OUT_PATH = join(ROOT, "lib", "gs1", "generated-bricks.ts")

// Category order mirrors the app's PRODUCT_CATEGORIES (Home excluded — no xlsx coverage).
const CATEGORY_ORDER = ["Shoes", "Apparel", "Bags", "Jewelry", "Beauty"]

// ── Minimal CSV parser (fields are simple, but names may contain commas → quote-aware) ──
function parseCsv(text) {
  const rows = []
  let field = "", row = [], inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false } }
      else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ",") { row.push(field); field = "" }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = "" }
      else if (c === "\r") { /* ignore */ }
      else field += c
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

const rows = parseCsv(readFileSync(CSV_PATH, "utf8"))
const [, ...dataRows] = rows // drop header

// category -> brickName -> { code, name, attrs: string[] } (order preserved from CSV)
const byCategory = new Map(CATEGORY_ORDER.map(c => [c, new Map()]))

for (const r of dataRows) {
  if (!r || r.length < 5) continue
  const [category, brickCode, brickName, codeListName] = r.map(s => String(s).trim())
  if (!category || !brickName || !codeListName) continue
  const bricks = byCategory.get(category)
  if (!bricks) throw new Error(`Unexpected category in CSV: "${category}"`)
  if (!bricks.has(brickName)) bricks.set(brickName, { code: brickCode, name: brickName, attributeCodeListNames: [] })
  const brick = bricks.get(brickName)
  if (!brick.attributeCodeListNames.includes(codeListName)) brick.attributeCodeListNames.push(codeListName)
}

const categoryBricks = {}
const stats = []
for (const category of CATEGORY_ORDER) {
  const bricks = [...byCategory.get(category).values()]
  categoryBricks[category] = bricks
  stats.push({ category, bricks: bricks.length })
}

// ── Emit TypeScript ──
const header = `// =============================================================================
// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/generate-brick-options.mjs from brick-attributes.csv
// (itself flattened from "Brick to extended attributes.xlsx" by
// scripts/extract-brick-attributes.py).
// Run \`node scripts/generate-brick-options.mjs\` to regenerate.
//
// Maps each product category to its GPC bricks. Per brick, attributeCodeListNames lists the
// Code List Names valid for that brick (a subset of the category's Code List Names, so CSV
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

const body = `
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

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, header + body, "utf8")

console.log("Generated", OUT_PATH)
for (const s of stats) console.log(`  ${s.category.padEnd(8)} | ${s.bricks} bricks`)
