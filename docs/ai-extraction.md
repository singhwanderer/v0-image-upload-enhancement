# AI Extended Attribute Extraction — Developer Notes

## Overview

The image upload wizard includes an optional AI Extended Attribute Extraction step (Step 2 of the
3-step wizard). It extracts GS1-style extended product attributes from uploaded product images using
a full master-code-list-derived allow-list of Code List Names, Attribute Values, and GS1 codes
(generated at build time from the GPC matrix CSVs + `gs1_extended_attribute_master_code_list.csv`).

There is a single extraction path: the real Gemini API. There is no mock/demo mode — every
classification, extraction, and per-shot suggestion call goes to Gemini, and any failure (including
a missing API key) surfaces as a visible, retryable error in the UI rather than being silently
substituted with fake data.

---

## Running Gemini

```
# .env.development.local
GEMINI_API_KEY=<your Gemini API key>
```

`GEMINI_API_KEY` is required in every environment, including local development — there is no
fallback. Without it, the AI section's calls will fail with a clear error message and a "Try again" /
"Continue manually" option; the rest of the wizard remains fully usable without AI.

`GEMINI_API_KEY` is a **server-side only** variable. It is never referenced in client-side code and
is not prefixed with `NEXT_PUBLIC_`. It is read in each of `app/api/extract-attributes/route.ts`,
`app/api/suggest-brick/route.ts`, and `app/api/suggest-shot-attributes/route.ts`.

The route:
1. Validates the image, MIME type, and category.
2. Injects the full options for the selected category into the prompt (only that category, never all categories).
3. Calls `gemini-2.5-flash` with the image as inline data.
4. Re-validates the model's response server-side against the full category map before returning.
5. Returns `ExtractionApiResponse` — no `fileId`, `fileName`, or `status` (those are added
   client-side when the response is merged into `ExtractionResult`).

---

## Expected behavior

| Scenario | Behavior |
|---|---|
| Category selected, images uploaded | Sends all images together in one request |
| Images clearly match category | Returns Gemini suggestions validated against full category map |
| Images are ambiguous or unlabeled | Returns empty attributes, all code lists in unresolvedAttributes |
| Restricted attribute attempted | Blocked by prompt rules + server-side validation |
| Extraction/classification/shot-suggestion error | Surfaced as a visible error card with "Try again" / "Continue manually" — never silently replaced with fake data |
| Missing GEMINI_API_KEY | Route returns 500 with a clean error message, shown directly in the error card |

---

## Grounding and validation

**Gemini is grounded by the full master-list values for the selected category only.**

- The route calls `getCategoryOptions(category)`, which returns only the Code List Names used by
  that category's GPC bricks — derived from the E/R marks in the category's matrix CSVs
  (Clothing.csv, Footwear.csv, …), not hand-curated.
- Unrelated Code List Names are **excluded entirely**. For example, when `category = Shoes`, Gemini
  receives no mention of SPF Rating, Jewelry Type, Beauty Treatment Specialty, Watch Case Shape,
  or any other non-shoe list.
- The full master code list (all 128 Code List Names, all categories) is **never sent to Gemini**.
  Only the relevant subset for the selected category is injected into the prompt, reducing token
  usage and eliminating confusion from irrelevant lists.
- **Server-side validation is authoritative.** After the model responds, the route re-validates every
  suggested attribute: unknown Code List Names are dropped to `unresolvedAttributes`; unknown
  Attribute Values are dropped to `unresolvedAttributes`; the GS1 code is always overwritten with the
  authoritative value from the generated map (Gemini's returned code is not trusted); extra fields
  are ignored; malformed JSON returns a 400 with a clean error message.

---

## Guardrails — restricted attributes

The following attributes are **never returned** in `attributes` unless visible on product packaging,
label, or readable text in the image. If Gemini suggests them without evidence, the route moves
them to `unresolvedAttributes`:

- Advertised Origin
- Care Instructions Code
- Water Repellent
- SPF Rating
- Scent Type
- Material Composition

These restrictions are enforced both in the Gemini prompt and in the server-side validation step.

---

## Type boundary

| Type | Location | Purpose |
|---|---|---|
| `ExtractionApiResponse` | `app/api/extract-attributes/route.ts` | Shape returned by the route — includes `category`, `imageCount`, `imageNames`, `attributes`, `unresolvedAttributes` |
| `ExtractionApiResponse` | `image-upload-wizard.tsx` (client-side copy) | Mirrors the route type without importing server code |
| `ProductExtractionResult` | `image-upload-wizard.tsx` | Product-level frontend state — extends the API response with `status` and `error`; replaces the old per-image `ExtractionResult` / `aiExtractions` record |
| `ExtractedAttribute` | `image-upload-wizard.tsx` | Single suggestion row, adds `accepted: boolean` |

---

## Options map (build-time generated from the reference CSVs)

The bricks map and allowed-options map are **generated at build time from exactly two kinds of
reference files** — no hand-curated routing, no xlsx:

- **Sources:**
  - `gs1_extended_attribute_master_code_list.csv` (repo root, 1,987 rows, 128 Code List Names) —
    every Code List Value and its authoritative GS1 code.
  - The per-category GPC matrix CSVs (`Clothing.csv`, `Footwear.csv`, `Sleepwear.csv`, …) — one
    sheet per GPC family; columns are bricks, rows are attributes, and an `E`/`R` cell marks the
    attribute as expected/required for that brick.
- **Generator:** `scripts/generate-gs1-data.mjs` → run `node scripts/generate-gs1-data.mjs` (or
  `npm run generate:gs1`). It parses the matrix sheets into bricks, resolves each E/R-marked
  attribute row to a master Code List (skipping free-text attributes like Brand Name with a logged
  warning), and emits both `lib/gs1/generated-bricks.ts` and `lib/gs1/generated-options.ts`.
- **OCR normalization:** Whitespace artifacts are collapsed, and mashed-together master rows
  (e.g. `"Flats GM03SE TPFL Slippers"`) are split back into their two real value/code pairs.
  Original GS1 codes are preserved verbatim.
- **Full value coverage per category:** Clothing 913, Shoes 441, Bags 385, Jewelry 370, Beauty 163,
  Accessories 534 (every value for the category's relevant Code List Names).
- **Module layout:**
  - `lib/gs1/types.ts` — client-safe types + `PRODUCT_CATEGORIES` (no option data).
  - `lib/gs1/generated-bricks.ts` — category → GPC bricks → Code List Names (names only, client-safe).
  - `lib/gs1/generated-options.ts` — full options, **server-only by convention** (imported by API routes).
- **Client never receives the whole master list:** components fetch a single category via
  `GET /api/attribute-options?category=<Category>` (used for edit dropdowns), cached per category
  with SWR. Gemini grounding (`/api/extract-attributes`) uses the full map server-side.

---

## Known limitations

1. **Category scoping, not full master list per request.** Each category exposes only the Code
   List Names its bricks use (full values within those lists). Adding a new attribute to a category
   means marking it `E`/`R` in the category's matrix CSV (and, if it's a new list, adding its values
   to the master code list), then regenerating.

2. **One consolidated result for all images.** Extraction returns a single product-level attribute
   set — there is no per-image breakdown of which image contributed which attribute. If images
   conflict Gemini must resolve internally; the app does not surface per-image attribution.

3. **No streaming.** Results appear after the full request completes. There is no partial/streaming UI.

4. **Generated modules are committed.** Re-run the generator whenever any matrix CSV or the master
   code list changes; the outputs `lib/gs1/generated-options.ts` and `lib/gs1/generated-bricks.ts`
   are checked into the repo.

---

## Verification summary (last run)

### Files changed
| File | Role |
|---|---|
| `scripts/generate-gs1-data.mjs` | Build-time parser for the matrix CSVs + master code list; generates both modules below |
| `lib/gs1/generated-bricks.ts` | Generated category → bricks → Code List Names map (client-safe) |
| `lib/gs1/generated-options.ts` | Generated full options map (server-only by convention) |
| `lib/gs1/types.ts` | Client-safe types: `AttributeOptionValue`, `CategoryOptions`, `ProductCategory`, `isProductCategory` |
| `app/api/attribute-options/route.ts` | GET: serves single-category options to client (SWR cache) |
| `app/api/extract-attributes/route.ts` | POST: accepts `{ category, images: [...] }`, sends all images in one Gemini call, returns one product-level result |
| `components/trading-grid/image-upload-wizard.tsx` | `ProductExtractionResult` (product-level state), `aiExtraction` (singular), updated handlers and UI |
| `docs/ai-extraction.md` | This file |

### Generation approach
`scripts/generate-gs1-data.mjs` reads the per-category GPC matrix CSVs and
`gs1_extended_attribute_master_code_list.csv`, normalizes OCR whitespace artifacts, splits
mashed-together master rows (e.g. `"Flats GM03SE TPFL Slippers"` → `Flats / GM03SETPFL` +
`Slippers / GM03SETPSL`), resolves each brick's E/R-marked attribute rows to master Code Lists,
and emits `lib/gs1/generated-bricks.ts` + `lib/gs1/generated-options.ts`. Original GS1 codes are
preserved verbatim; there is no hand-authored routing.

### Category counts
| Category | Bricks | Code Lists | Attribute Values |
|---|---|---|---|
| Clothing | 28 | 47 | 913 |
| Shoes | 10 | 16 | 441 |
| Bags | 3 | 10 | 385 |
| Jewelry | 14 | 12 | 370 |
| Beauty | 82 | 9 | 163 |
| Accessories | 5 | 14 | 534 |

### Test results

**`tsc --noEmit`:** exit 0, zero errors (including after product-level refactor).

**`generate:gs1`:** generates cleanly; zero missing `codeListName`/`attributeValue`/`code` fields,
zero duplicates within any category code list; free-text matrix rows (no master Code List) are
skipped with logged warnings.

**Category filtering (Shoes):** SPF Rating, Jewelry Type, Beauty Treatment Specialty,
Watch Case Shape — all absent. Pass.

**Category filtering (Clothing):** Shoe Type, Heel Height Range, Bag Type, Jewelry Type, SPF Rating
— all absent. Pass.

**Server-side validation — 400 paths:** malformed JSON → 400; empty `imageBase64` → 400;
unsupported MIME (`image/bmp`) → 400; invalid category (`Furniture`) → 400. All with clean JSON
error messages. Pass.

**Gemini live — Shoes (sneaker image):** 10 accepted attributes, 2 unresolved (`Heel Material`,
`Water Repellent`). All 10 codes validated against full map — no mismatches. Pass.

**Gemini live — Clothing (floral dress image, ran as "Apparel" pre-rename):** 7 accepted attributes, 4 unresolved (`Closure`,
`Primary Detail Type`, `Primary Detail Placement`, `Primary Detail Application`). All 7 codes
validated — no mismatches. Pass.

**Gemini live — ambiguous (plain cardboard box, category=Shoes):** 0 accepted, 12 unresolved
(all 12 Shoes code lists). Pass.

**Client bundle:** `generated-options.ts` is not imported by any client component or page. The
browser receives only the selected category's options via `GET /api/attribute-options`. Pass.

**Edit dropdowns:** `valuesForCodeList(codeListName)` pulls from SWR-cached
`CategoryOptions` (full CSV values for that code list), not the old ~6-value subset. Pass.

**Missing `GEMINI_API_KEY`:** route returns 500 with `"GEMINI_API_KEY is not configured on the server."`. Pass.
**Review & Confirm:** renders `acceptedExtractedAttributes` from the single `aiExtraction` state as one product-level table (not grouped by image). Pass.

**Product-level API request shape:** `POST /api/extract-attributes` now accepts `{ category, images: [{ fileName, imageBase64, mimeType }] }` and returns one `ExtractionApiResponse` with `imageCount` and `imageNames`. Pass.

**State model:** `aiExtractions: Record<string, ExtractionResult>` replaced by `aiExtraction: ProductExtractionResult | null`. `aiEditing` scope reduced from `{ fileId, index }` to `{ index }`. All call sites (`removeFile`, `clearExtraction`, category select, skip, re-run, replace-image, delete-from-dialog, product-change) updated. Zero stale references. Pass.

---

## Demo mode removal

Mock/demo mode (the `NEXT_PUBLIC_EXTRACTION_MODE` toggle, `lib/gs1/mock-scenarios.ts`, and the
silent catch-and-substitute-fake-data fallback in `runClassification`/`runGeminiExtraction`/
`runShotSuggestions`) has been removed. The app now always calls real Gemini; any failure (network
error, bad response, missing `GEMINI_API_KEY`) surfaces as a visible error card with "Try again" /
"Continue manually" instead of a fabricated result. This applies uniformly in every environment,
including local dev — there is no dev/prod behavior split. All references above to "mock mode" or
mock test results are historical and describe behavior that no longer exists.
