# AI Extended Attribute Extraction — Developer Notes

## Overview

The image upload wizard includes an optional AI Extended Attribute Extraction step (Step 2 of the
3-step wizard). It extracts GS1-style extended product attributes from uploaded product images using
a full CSV-derived allow-list of Code List Names, Attribute Values, and GS1 codes (generated at build time).

Two modes are supported: **mock** (default) and **gemini** (real Gemini API).

---

## Running mock mode (recommended for stakeholder demos)

No environment variables required. Mock mode is the default when `NEXT_PUBLIC_EXTRACTION_MODE` is
not set.

```
# .env.development.local (or leave unset — mock is the default)
NEXT_PUBLIC_EXTRACTION_MODE=mock
```

Mock mode returns pre-seeded, realistic suggestions whose GS1 codes are resolved against the same
full CSV-derived options map used by Gemini mode (fetched per category via `/api/attribute-options`).
The mock is stable, fast (~0.9 s simulated delay), and requires no API key. **Use this for all
stakeholder demos.**

---

## Running Gemini mode

```
# .env.development.local
NEXT_PUBLIC_EXTRACTION_MODE=gemini
GEMINI_API_KEY=<your Gemini API key>
```

`GEMINI_API_KEY` is a **server-side only** variable. It is never referenced in client-side code and
is not prefixed with `NEXT_PUBLIC_`. It is read exclusively in `app/api/extract-attributes/route.ts`.

The route:
1. Validates the image, MIME type, and category.
2. Injects the full options for the selected category into the prompt (only that category, never all categories).
3. Calls `gemini-2.5-flash` with the image as inline data.
4. Re-validates the model's response server-side against the full category map before returning.
5. Returns `ExtractionApiResponse` — no `fileId`, `fileName`, or `status` (those are added
   client-side when the response is merged into `ExtractionResult`).

---

## Expected behavior

| Scenario | Mock | Gemini |
|---|---|---|
| Category selected, images uploaded | Runs instantly after ~0.9 s | Sends all images together in one request |
| Images clearly match category | Returns seeded suggestions, accepted by default | Returns Gemini suggestions validated against full category map |
| Images are ambiguous or unlabeled | Returns suggestions with low confidence | Returns empty attributes, all code lists in unresolvedAttributes |
| Restricted attribute attempted | Never returned (not in mock data) | Blocked by prompt rules + server-side validation |
| Extraction error | N/A (mock never errors) | Product-level error; all images fail together — user can retry |
| Missing GEMINI_API_KEY | N/A | Returns 500 with clean error message |

---

## Grounding and validation

**Gemini is grounded by the full CSV-derived values for the selected category only.**

- The route calls `getCategoryOptions(category)`, which returns only the Code List Names that have
  been explicitly routed to that category in `CATEGORY_ROUTING` (see the generator script).
- Unrelated Code List Names are **excluded entirely**. For example, when `category = Shoes`, Gemini
  receives no mention of Bedding Size, SPF Rating, Jewelry Type, Beauty Treatment Specialty, Rug Type,
  Watch Case Shape, or any other non-shoe list.
- The full CSV (all 94 Code List Names, all categories) is **never sent to Gemini**. Only the
  relevant subset for the selected category is injected into the prompt, reducing token usage and
  eliminating confusion from irrelevant lists.
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

## Options map (full CSV, build-time generated)

The allowed-options map is **generated at build time from the full CSV** — no hand-curated subset.

- **Source:** `GS1_Extended_Attribute_Code_Lists_Fixed.csv` (repo root, 1,419 rows, 94 Code List Names).
- **Generator:** `scripts/generate-gs1-options.mjs` → run `node scripts/generate-gs1-options.mjs`.
  It parses the CSV, routes each category to its relevant Code List Names, normalizes OCR artifacts,
  and emits `lib/gs1/generated-options.ts`.
- **OCR normalization:** Whitespace artifacts (e.g. `"Bea uty Treatment Specialty"`) are collapsed,
  and mashed-together rows (e.g. `"Flats GM03SE TPFL Slippers"`) are split back into their two real
  value/code pairs. Original GS1 codes are preserved verbatim.
- **Full value coverage per category:** Shoes 264, Apparel 309, Bags 258, Jewelry 186, Beauty 79,
  Home 122 (every value for the category's relevant Code List Names, not a ~6-value sample).
- **Module layout:**
  - `lib/gs1/types.ts` — client-safe types + `PRODUCT_CATEGORIES` (no option data).
  - `lib/gs1/generated-options.ts` — full options, **server-only by convention** (imported by API routes).
  - `lib/gs1/mock-scenarios.ts` — client-safe mock seeds; codes resolved at runtime against fetched options.
- **Client never receives the whole CSV:** components fetch a single category via
  `GET /api/attribute-options?category=<Category>` (used for edit dropdowns and mock-code grounding,
  cached per category with SWR). Gemini grounding (`/api/extract-attributes`) uses the full map server-side.

---

## Known limitations

1. **Category scoping, not full CSV per request.** Each category exposes only its routed Code List
   Names (full values within those lists). Adding a new Code List to a category requires editing
   `CATEGORY_ROUTING` in `scripts/generate-gs1-options.mjs` and regenerating.

2. **One consolidated result for all images.** Both mock and Gemini mode return a single product-level
   attribute set — there is no per-image breakdown of which image contributed which attribute. If
   images conflict Gemini must resolve internally; the app does not surface per-image attribution.

3. **Default category heuristic is keyword-based.** `getDefaultCategory()` matches
   `tops/dress/shirt/apparel/clothing` → Apparel, otherwise defaults to Shoes. It does not detect
   Bags, Jewelry, Beauty, or Home automatically.

4. **No streaming.** Results appear after the full request completes. There is no partial/streaming UI.

5. **Error state has no mock trigger.** In mock mode the error state is never triggered.
   To test the error UI, temporarily modify `runMockExtraction` to set `status: "error"`.

6. **Generated module is committed.** Re-run the generator whenever the CSV or routing changes;
   the output `lib/gs1/generated-options.ts` is checked into the repo.

---

## Demo recommendation

**Use mock mode for stakeholder demos.** It is instant, stable, and requires no API key. The mock
seeds are grounded against the same full CSV-derived options as Gemini mode (codes resolved from the
category options the client fetches), so the UX (per-image results, Accept/Edit/Reject, Review
summary, unresolved attributes) is fully exercisable without any real model calls.

Switch to Gemini mode only for internal engineering demos or when real image analysis is needed.

---

## Verification summary (last run)

### Files changed
| File | Role |
|---|---|
| `scripts/generate-gs1-options.mjs` | Build-time CSV parser and code generator |
| `lib/gs1/generated-options.ts` | Generated full options map (server-only by convention) |
| `lib/gs1/types.ts` | Client-safe types: `GS1AttributeOption`, `CategoryOptions`, `ProductCategory`, `isProductCategory` |
| `lib/gs1/mock-scenarios.ts` | Mock seeds, codes resolved at runtime against fetched options |
| `app/api/attribute-options/route.ts` | GET: serves single-category options to client (SWR cache) |
| `app/api/extract-attributes/route.ts` | POST: accepts `{ category, images: [...] }`, sends all images in one Gemini call, returns one product-level result |
| `components/trading-grid/image-upload-wizard.tsx` | `ProductExtractionResult` (product-level state), `aiExtraction` (singular), updated handlers and UI |
| `docs/ai-extraction.md` | This file |

### Generation approach
`scripts/generate-gs1-options.mjs` reads `GS1_Extended_Attribute_Code_Lists_Fixed.csv`, normalizes
OCR whitespace artifacts, splits mashed-together rows (e.g. `"Flats GM03SE TPFL Slippers"` →
`Flats / GM03SETPFL` + `Slippers / GM03SETPSL`), and emits `lib/gs1/generated-options.ts`. Each
category maps to a curated list of relevant Code List Names via `CATEGORY_ROUTING`; values for those
lists are taken wholesale from the CSV. Original GS1 codes are preserved verbatim.

### Category counts
| Category | Code Lists | Attribute Values | Gemini prompt (bytes) | Client JSON (bytes) |
|---|---|---|---|---|
| Shoes | 12 | 264 | 7,350 | 11,667 |
| Apparel | 11 | 309 | 8,553 | 13,520 |
| Bags | 8 | 258 | 7,156 | 11,274 |
| Jewelry | 11 | 186 | 5,141 | 8,263 |
| Beauty | 6 | 79 | 2,055 | 3,436 |
| Home | 10 | 122 | 3,597 | 5,729 |

### Test results

**`tsc --noEmit`:** exit 0, zero errors (including after product-level refactor).

**`generate:gs1`:** generates cleanly, 1,218 total values across all categories, zero missing
`codeListName`/`attributeValue`/`code` fields, zero duplicates within any category code list.

**Category filtering (Shoes):** Bedding Size, SPF Rating, Jewelry Type, Beauty Treatment Specialty,
Rug Type, Watch Case Shape, Code List for Dinnerware Category — all absent. Pass.

**Category filtering (Apparel):** Shoe Type, Heel Type, Bag Type, Jewelry Type, SPF Rating,
Bedding Size — all absent. Pass.

**Mock extraction — all six categories:** all codes grounded (`groundedInList=true`), no mismatches.
Pass.

**Server-side validation — 400 paths:** malformed JSON → 400; empty `imageBase64` → 400;
unsupported MIME (`image/bmp`) → 400; invalid category (`Furniture`) → 400. All with clean JSON
error messages. Pass.

**Gemini live — Shoes (sneaker image):** 10 accepted attributes, 2 unresolved (`Heel Material`,
`Water Repellent`). All 10 codes validated against full map — no mismatches. Pass.

**Gemini live — Apparel (floral dress image):** 7 accepted attributes, 4 unresolved (`Closure`,
`Primary Detail Type`, `Primary Detail Placement`, `Primary Detail Application`). All 7 codes
validated — no mismatches. Pass.

**Gemini live — ambiguous (plain cardboard box, category=Shoes):** 0 accepted, 12 unresolved
(all 12 Shoes code lists). Pass.

**Client bundle:** `generated-options.ts` is not imported by any client component or page. The wizard
imports only `useSWR`, `CategoryOptions` (type-only), and `buildMockExtraction` from `lib/gs1/`.
The browser receives only the selected category's options via `GET /api/attribute-options`. Pass.

**Edit dropdowns:** `valuesForCodeList(codeListName)` pulls from SWR-cached
`CategoryOptions` (full CSV values for that code list), not the old ~6-value subset. Pass.

**Mock mode (no API key):** works, no key required. Pass.
**Gemini mode (`NEXT_PUBLIC_EXTRACTION_MODE=gemini`):** works with `GEMINI_API_KEY`. Pass.
**Missing `GEMINI_API_KEY`:** route returns 500 with `"GEMINI_API_KEY is not configured on the server."`. Pass.
**Review & Confirm:** renders `acceptedExtractedAttributes` from the single `aiExtraction` state as one product-level table (not grouped by image). Pass.

**Product-level API request shape:** `POST /api/extract-attributes` now accepts `{ category, images: [{ fileName, imageBase64, mimeType }] }` and returns one `ExtractionApiResponse` with `imageCount` and `imageNames`. Pass.

**State model:** `aiExtractions: Record<string, ExtractionResult>` replaced by `aiExtraction: ProductExtractionResult | null`. `aiEditing` scope reduced from `{ fileId, index }` to `{ index }`. All call sites (`removeFile`, `clearExtraction`, category select, skip, re-run, replace-image, delete-from-dialog, product-change) updated. Zero stale references. Pass.
