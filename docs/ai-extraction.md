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
| Category selected, images uploaded | Runs instantly after ~1.2 s | Sends one request per image in parallel |
| Image clearly matches category | Returns seeded suggestions, accepted by default | Returns Gemini suggestions validated against full category map |
| Image is ambiguous or unlabeled | Returns suggestions with low confidence | Returns empty attributes, all code lists in unresolvedAttributes |
| Restricted attribute attempted | Never returned (not in mock data) | Blocked by prompt rules + server-side validation |
| Error on one image | N/A (mock never errors) | Only that image is marked error; others complete independently |
| Missing GEMINI_API_KEY | N/A | Returns 500 with clean error message |

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
| `ExtractionApiResponse` | `app/api/extract-attributes/route.ts` | Shape returned by the route (no lifecycle fields) |
| `ExtractionApiResponse` | `image-upload-wizard.tsx` (client-side copy) | Mirrors the route type without importing server code |
| `ExtractionResult` | `image-upload-wizard.tsx` | Per-image frontend state — extends the API response with `fileId`, `fileName`, `status`, `error` |
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

2. **Same suggestions for all images in a batch (mock only).** In mock mode every image receives
   identical suggestions because the mock is category-keyed, not image-keyed. Gemini mode sends one
   real request per image and returns per-image results.

3. **Default category heuristic is keyword-based.** `getDefaultCategory()` matches
   `tops/dress/shirt/apparel/clothing` → Apparel, otherwise defaults to Shoes. It does not detect
   Bags, Jewelry, Beauty, or Home automatically.

4. **No streaming.** Results appear per image on request completion. There is no partial/streaming UI.

5. **Error state has no mock trigger.** In mock mode the error state (`anyError`) is never triggered.
   To test the error UI, temporarily modify `runMockExtraction` to set `status: "error"` for one image.

6. **Generated module is committed.** Re-run the generator whenever the CSV or routing changes;
   the output `lib/gs1/generated-options.ts` is checked into the repo.

---

## Demo recommendation

**Use mock mode for stakeholder demos.** It is instant, stable, and requires no API key. The mock
seeds are grounded against the same full CSV-derived options as Gemini mode (codes resolved from the
category options the client fetches), so the UX (per-image results, Accept/Edit/Reject, Review
summary, unresolved attributes) is fully exercisable without any real model calls.

Switch to Gemini mode only for internal engineering demos or when real image analysis is needed.
