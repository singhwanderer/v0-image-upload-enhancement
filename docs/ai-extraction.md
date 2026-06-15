# AI Extended Attribute Extraction — Developer Notes

## Overview

The image upload wizard includes an optional AI Extended Attribute Extraction step (Step 2 of the
3-step wizard). It extracts GS1-style extended product attributes from uploaded product images using
a curated allow-list of Code List Names, Attribute Values, and GS1 codes.

Two modes are supported: **mock** (default) and **gemini** (real Gemini API).

---

## Running mock mode (recommended for stakeholder demos)

No environment variables required. Mock mode is the default when `NEXT_PUBLIC_EXTRACTION_MODE` is
not set.

```
# .env.development.local (or leave unset — mock is the default)
NEXT_PUBLIC_EXTRACTION_MODE=mock
```

Mock mode returns pre-seeded, realistic suggestions drawn from the same curated GS1 options map
used by Gemini mode. The mock is stable, instant (~1.2 s simulated delay), and does not require a
network call or API key. **Use this for all stakeholder demos.**

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
2. Injects only the curated options for the selected category into the prompt (never the full CSV).
3. Calls `gemini-2.5-flash` with the image as inline data.
4. Re-validates the model's response server-side against the curated map before returning.
5. Returns `ExtractionApiResponse` — no `fileId`, `fileName`, or `status` (those are added
   client-side when the response is merged into `ExtractionResult`).

---

## Expected behavior

| Scenario | Mock | Gemini |
|---|---|---|
| Category selected, images uploaded | Runs instantly after ~1.2 s | Sends one request per image in parallel |
| Image clearly matches category | Returns curated suggestions, accepted by default | Returns Gemini suggestions validated against curated map |
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

## Curated options map

`lib/gs1-attribute-options.ts` — a static, hand-curated subset of `GS1_Extended_Attribute_Code_Lists_Fixed.csv`.

- **Source:** `GS1_Extended_Attribute_Code_Lists_Fixed.csv` (repo root, 1,419 rows, 94 Code List Names).
- **Curated:** 6–12 Code List Names per category, ~6 values each. Not a full CSV import.
- **OCR normalization:** Spacing artifacts from the CSV (e.g. `"Bea uty Treatment Specialty"`) have been fixed; original GS1 codes are preserved verbatim.
- **Categories:** Shoes (12 lists), Apparel (11), Bags (8), Jewelry (11), Beauty (6), Home (10).
- **Not loaded at runtime:** The CSV file is never parsed, bundled, or sent to the model.

---

## Known limitations

1. **Curated subset only.** Each code list exposes ~6 values. Values outside the curated subset cannot
   be suggested or validated; they fall to `unresolvedAttributes`. To expand coverage, update
   `lib/gs1-attribute-options.ts` with additional values from the CSV.

2. **Same suggestions for all images in a batch (mock only).** In mock mode every image receives
   identical suggestions because the mock is category-keyed, not image-keyed. Gemini mode sends one
   real request per image and returns per-image results.

3. **Default category heuristic is keyword-based.** `getDefaultCategory()` matches
   `tops/dress/shirt/apparel/clothing` → Apparel, otherwise defaults to Shoes. It does not detect
   Bags, Jewelry, Beauty, or Home automatically.

4. **No streaming.** Results appear per image on request completion. There is no partial/streaming UI.

5. **Error state has no mock trigger.** In mock mode the error state (`anyError`) is never triggered.
   To test the error UI, temporarily modify `runMockExtraction` to set `status: "error"` for one image.

6. **No runtime CSV parser.** The curated map must be maintained manually in sync with the CSV.

---

## Demo recommendation

**Use mock mode for stakeholder demos.** It is instant, stable, and requires no API key or network
access. The mock suggestions are drawn from the same curated GS1 map as Gemini mode, so the UX
(per-image results, Accept/Edit/Reject, Review summary, unresolved attributes) is fully exercisable
without any real model calls.

Switch to Gemini mode only for internal engineering demos or when real image analysis is needed.
