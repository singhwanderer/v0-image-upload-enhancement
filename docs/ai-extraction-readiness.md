# AI Extended Attribute Extraction — Readiness Document

## 1. Feature overview

The image upload wizard has a new optional Step 2: **AI Extended Attribute Extraction**. After a
user uploads one or more product images, they can click "Extract Extended Attributes with AI". The
system analyses each image and suggests GS1-standard extended attributes — things like Shoe Style,
Heel Type, Closure, Occasion, or Dress Type — drawn from a controlled list of allowed values sourced
directly from the GS1 CSV.

The user stays in control throughout:

- Every suggestion arrives pre-accepted but can be individually accepted, edited (with a dropdown of
  the full allowed values), or rejected.
- Attributes that cannot be determined from the image alone (e.g. Material Composition, Care
  Instructions, Advertised Origin) are surfaced separately as "unresolved" — flagged for the user to
  fill in manually rather than guessed.
- Only accepted attributes carry forward to the Review & Confirm step, grouped by image.
- The user can skip AI extraction entirely and continue manually.

---

## 2. Data grounding

### CSV source

`GS1_Extended_Attribute_Code_Lists_Fixed.csv` — 1,419 rows, 94 Code List Names. This is the
authoritative source of all allowed Attribute Values and GS1 codes.

### Build-time generator

`scripts/generate-gs1-options.mjs` parses the CSV and emits `lib/gs1/generated-options.ts`. Run it
with:

```
pnpm generate:gs1
```

The generator:
- Normalises OCR whitespace artifacts (e.g. `"Bea uty Treatment Specialty"` → `"Beauty Treatment Specialty"`).
- Splits mashed-together rows (e.g. `"Flats GM03SE TPFL Slippers"` → two real entries: `Flats / GM03SETPFL` and `Slippers / GM03SETPSL`).
- Preserves original GS1 codes verbatim.
- Deduplicates values within each code list (first occurrence wins).

### Generated GS1 map

`lib/gs1/generated-options.ts` is the output. It is server-only by convention — never imported
directly by client components or pages. The browser receives only a single category's options at
runtime, not the whole file.

### Category routing

Each product category maps to a specific set of Code List Names in `CATEGORY_ROUTING` inside the
generator script. The full value list for each routed Code List Name is included — this is not a
hand-curated subset of values, it is the complete set from the CSV.

| Category | Code Lists | Attribute Values |
|---|---|---|
| Shoes | 12 | 264 |
| Apparel | 11 | 309 |
| Bags | 8 | 258 |
| Jewelry | 11 | 186 |
| Beauty | 6 | 79 |
| Home | 10 | 122 |

### Why Gemini receives only category-relevant Code List Names

Sending all 94 Code List Names in every prompt would waste tokens, introduce irrelevant options, and
increase the chance of model confusion. Instead, the route calls `getCategoryOptions(category)` and
injects only that category's lists. When category is Shoes, Gemini receives no mention of Bedding
Size, SPF Rating, Jewelry Type, Rug Type, or any other unrelated list.

### Why Gemini receives the full values for those relevant lists

Each Code List Name includes every allowed value from the CSV (not a ~6-value sample). This means
Gemini can match the actual product — "Sneakers", "Lace Up", "Athleisure" — instead of being
forced to pick from an artificially small subset and falling to unresolved.

---

## 3. Gemini flow

1. **Local File retained after upload.** When the user uploads images, the `File` object is kept in
   component state (`UploadedFile.file`). No re-upload or re-selection is required when extraction runs.

2. **File converted to base64.** Client-side, the `File` is read with `FileReader` and converted to
   a raw base64 string (no `data:` prefix).

3. **Server-side Gemini API route.** The client POSTs `{ imageBase64, mimeType, category }` to
   `POST /api/extract-attributes`. One request is sent per image, in parallel. A failure on one
   image marks only that image as error; the others complete independently.

4. **GEMINI_API_KEY stays server-side.** The key is read in `app/api/extract-attributes/route.ts`
   only. It has no `NEXT_PUBLIC_` prefix and is never referenced in client code.

5. **Prompt receives image + category-scoped GS1 options.** The route builds a structured prompt
   that includes the image (as inline data), the category, and the full allowed options for that
   category. Restricted attributes (e.g. Material Composition, Care Instructions, SPF Rating) are
   explicitly instructed to go to `unresolvedAttributes` unless visible in the image.

6. **Server validates output before returning.** The model's JSON response is checked against the
   generated map before it is returned. See validation rules below.

---

## 4. Validation rules

| Scenario | What happens |
|---|---|
| Unknown Code List Name in response | Dropped to `unresolvedAttributes` |
| Unknown Attribute Value in response | Dropped to `unresolvedAttributes` |
| Code mismatch (model returns wrong code for a valid value) | Code is overwritten with the authoritative code from the generated map |
| Extra fields in response | Silently ignored |
| Malformed JSON from model | Returns a clean 400 or 500 error response; client marks the image as error, not crash |
| Invalid request (bad MIME, empty image, unknown category) | 400 with a specific error message before Gemini is called |
| Missing GEMINI_API_KEY | 500 with `"GEMINI_API_KEY is not configured on the server."` |

---

## 5. AI mode

There is a single mode: real Gemini analysis. There is no mock/demo mode — the app always calls
Gemini, and any failure (network error, bad response, missing `GEMINI_API_KEY`) is surfaced as a
visible, retryable error rather than a fabricated result.

Requires `GEMINI_API_KEY` in every environment, including local development. Uses `gemini-2.5-flash`
with real image analysis.

- Sends one independent request per image (extraction sends all images together in one request;
  classification and per-shot suggestion are one request per action).
- Returns results grounded in the full CSV-derived option set.
- A single slow or failed image does not block the others in per-image flows.
- Unresolved attributes reflect genuine model uncertainty (e.g. Material Composition is correctly
  flagged as unresolvable from visual inspection alone).
- Missing or invalid `GEMINI_API_KEY`, or any other failure, shows an error card with "Try again" /
  "Continue manually" — the rest of the wizard stays usable without AI.

---

## 6. How to run

### Regenerate the GS1 options map

Run this whenever `GS1_Extended_Attribute_Code_Lists_Fixed.csv` or `CATEGORY_ROUTING` in the
generator script changes. The output is committed to the repo.

```
pnpm generate:gs1
```

### Running the AI section

```env
# .env.development.local
GEMINI_API_KEY=<your Gemini API key>
```

`GEMINI_API_KEY` is a server-side variable only. Do not prefix it with `NEXT_PUBLIC_`. It is
required in every environment — there is no mock fallback.

---

## 7. Verification results

**TypeScript:** `tsc --noEmit` exits 0, zero errors.

**Category counts:** generation produces 1,218 total attribute values across all six categories, zero
records with missing fields, zero duplicates within any code list.

**Category filtering:** verified that Shoes contains no Bedding Size, SPF Rating, Jewelry Type,
Beauty Treatment Specialty, Rug Type, or Watch Case Shape entries, and that Apparel contains no Shoe
Type, Heel Type, Bag Type, or Jewelry Type entries.

**Server-side validation — 400 paths:** malformed JSON, empty `imageBase64`, unsupported MIME
(`image/bmp`), and invalid category (`Furniture`) all return 400 with specific error messages.

**Gemini live — Shoes (sneaker image):** 10 accepted attributes (Shoe Type: Sneakers, Shoe Style:
Sneaker, Closure: Lace Up, Heel Type: No Heel, Heel Height Range: Flat 0–0.5 inch, Toe Shape:
Round, Sole Type: Synthetic, Outsole Type: Tread, Occasion: Casual, Gender: Unisex), 2 unresolved
(Heel Material, Water Repellent). All 10 codes validated against full map — no mismatches.

**Gemini live — Apparel (floral dress image):** 7 accepted attributes (Dress Type, Sleeve Type:
Sleeveless, Collar/Neck Type: Round, Occasion: Casual, Gender: Female, Fit: Relaxed, Length:
Above Knee), 4 unresolved (Closure, Primary Detail Type, Primary Detail Placement, Primary Detail
Application). All 7 codes validated — no mismatches.

**Gemini live — ambiguous image (plain cardboard box, category=Shoes):** 0 accepted attributes,
12 unresolved (all Shoes code lists flagged as indeterminate). Correct behaviour.

---

## 8. Known limitations

1. **Category routing is manual.** Adding a new Code List Name to a category requires editing
   `CATEGORY_ROUTING` in `scripts/generate-gs1-options.mjs` and re-running `pnpm generate:gs1`.

2. **No streaming UI.** Results appear per image when that image's request completes. There is no
   token-by-token or partial display.

3. **Generated map must be regenerated when the CSV or routing changes.** The output file
   `lib/gs1/generated-options.ts` is committed to the repo. It does not self-update.

---

## 9. Demo mode removal

Mock/demo mode has been removed. Previously the app defaulted to a client-side mock (gated behind
`NEXT_PUBLIC_EXTRACTION_MODE=gemini`, unset by default) that returned hardcoded, keyword-matched
suggestions instead of calling Gemini — and even in Gemini mode, any failure silently fell back to
that same mock data. Both behaviors are gone: the app now always calls Gemini, and a failure (bad
response, network error, or missing `GEMINI_API_KEY`) surfaces as a visible error card with "Try
again" / "Continue manually", in every environment including local dev. References above to "mock
mode" describe removed, historical behavior.
