# Gemini Prompts Reference

This is a reference of every prompt this app sends to Gemini, transcribed verbatim from source.
There are exactly three AI-enabled features, each its own Next.js API route — confirmed via
`grep -r "GoogleGenAI|generateContent|GEMINI_MODEL"` across the repo; nothing else calls Gemini.

## Shared conventions

All three routes:
- Use `gemini-2.5-flash` via the `@google/genai` SDK.
- Require `GEMINI_API_KEY` as a **server-side-only** environment variable — never prefixed with
  `NEXT_PUBLIC_`, never referenced in client code, and the route returns a clean 500
  (`"GEMINI_API_KEY is not configured on the server."`) if it's missing.
- Call with `config: { responseMimeType: "application/json", ... }` and ask for JSON with no
  markdown fences in the prompt itself, then still defensively strip fences/isolate the first
  `{...}` block (`extractJsonText`) before `JSON.parse`.
- Retry exactly once, after a 2-second delay, if the first Gemini call throws; a second failure
  returns a clean error response rather than crashing.
- **Never trust the model's output directly.** Every response is re-validated server-side against
  an authoritative list (GS1 codes, GPC bricks, or fixed orientation/facing/angle codes) before
  anything reaches the client — unknown values are dropped or moved to an "unresolved" bucket,
  never passed through.

---

## 1. Brick classification

**File:** `app/api/suggest-brick/route.ts`
**Triggered by:** `runClassification()` / `confirmPrimaryImage()` in
`components/trading-grid/use-ai-attributes.ts` — the "Classify & extract with AI" action, and the
single-image re-run when a user resolves a mismatched-images warning.
**Model config:** `temperature: 0.1`

Proposes a single GS1 GPC brick (and, derived from it, category) from the uploaded image(s) — the
"AI proposes, human confirms" entry point that replaces picking category/brick blind from
dropdowns. As of the mismatched-images-detection feature, it also judges whether the images
plausibly show one product.

**Prompt template** (`${product}` is the wizard's auto-populated product description, omitted
entirely if empty; `${candidatesText}` is every category's full brick list, name => code;
`${imageListText}` is `Image 1: filename.jpg` per line):

```
You are classifying a product's GS1 GPC brick from its images.
${product ? `The product is described as: ${product}\n` : ""}
You have been provided with ${validated.length} image${validated.length !== 1 ? "s" : ""}:
${imageListText}

Choose exactly ONE brick from the candidates below that best matches what the images show.

Candidates (category, then brick name => code):
${candidatesText}

Before choosing, check whether all images plausibly show the same product. Different angles,
colors, or fabrics of one product type are fine. Different garment/item types, or an unrelated
item mixed in (e.g. a shirt photographed alongside a pair of earrings), are NOT — flag those as
inconsistent.

Rules:
- Pick the single best-matching brick code from the list above. Do not invent a code.
- confidence is a number between 0 and 1 reflecting how certain the match is.
- consistent is true only if all images plausibly depict the same product. If false, list the
  filenames of the image(s) that don't match the majority in outlierImages, and give a short
  reason in note (e.g. "Image 2 (earring.jpg) shows a different item than the rest.").
- Return JSON only, no markdown fences, in exactly this shape:
{ "brickCode": string, "confidence": number, "consistent": boolean, "outlierImages": string[], "note": string }
```

**Response contract:** `{ brickCode, confidence, consistent, outlierImages?, note? }`. Server-side:
`brickCode` must resolve via `getBrick()` against the real `CATEGORY_BRICKS` map in some category
(the model's own category label is never trusted — category is derived from whichever brick code
actually matched); `confidence` is clamped to `[0, 1]`; `outlierImages` entries are filtered to
only fileNames that were actually in the request; `consistent` defaults to `true` if missing or
not explicitly `false` (fail open — this is a soft warning, not a hard gate).

---

## 2. Extended attribute extraction

**File:** `app/api/extract-attributes/route.ts`
**Triggered by:** `runGeminiExtraction()` in `use-ai-attributes.ts` — runs automatically once a
brick is confirmed (from the AI proposal or a manual pick).
**Model config:** `temperature: 0.2`

Extracts GS1-style extended attributes (Shoe Style, Heel Type, Closure, Occasion, etc.) from all
of a product's images in a single call, scoped to only the attributes valid for the confirmed
brick. Does not take a `productDescription` input — only `category`, `brick`, and `images`.

**Prompt template** (`${category}`/`${brick.name}`/`${brick.code}` come from the confirmed
classification; `${imageListText}` is `Image 1: filename.jpg` per line; `${allowedOptionsText}` is
every allowed Code List Name for this brick with its full set of allowed values and exact codes,
scoped from the CSV-derived options map — never the full 94-list CSV):

```
You are extracting one product-level set of GS1-style extended attributes from multiple images of the same product.

Product category: ${category}
GPC brick (product classification): ${brick.name} (${brick.code})

Only the attributes listed below apply to this brick — do not suggest attributes for a different kind of product.

You have been provided with ${validatedImages.length} image${validatedImages.length !== 1 ? "s" : ""} of the same product:
${imageListText}

Treat all uploaded images as evidence for the same product. Return one consolidated attribute set, not separate results per image.

Allowed GS1 options (Code List Name, then allowed Attribute Values and their exact codes):
${allowedOptionsText}

Rules:
- Use only the provided allowed GS1 options.
- Do not invent Code List Names, Attribute Values, or GS1 codes.
- The returned code must match the selected Attribute Value exactly as listed above.
- If an attribute is clearly visible in any of the uploaded images, it can be suggested.
- If an attribute is not visible in any of the uploaded images, put it in unresolvedAttributes.
- If images show conflicting evidence for the same attribute, put that attribute in unresolvedAttributes and explain the conflict in the reason field.
- Visual inference is allowed for most attributes — suggest them if the product appearance in any image supports the classification.
- The following attributes require visible text on packaging, labels, or product markings and must NOT be inferred from appearance alone: Advertised Origin, Care Instructions, Water Repellent, SPF Rating, Scent Type, Material Composition. If not readable in any image, move them to unresolvedAttributes.
- Reference the image name(s) in the reason field where helpful (e.g. "Visible in Image 1: front-view.jpg").
- Confidence must be a number between 0 and 1.
- Return JSON only, with no markdown fences and no commentary.

Return JSON in exactly this shape:
{
  "category": "${category}",
  "attributes": [
    { "codeListName": string, "attributeValue": string, "code": string, "confidence": number, "reason": string }
  ],
  "unresolvedAttributes": [
    { "codeListName": string, "reason": string }
  ]
}
```

**Response contract:** `{ category, attributes[], unresolvedAttributes[] }`. Server-side: every
attribute's `codeListName` must be one of the brick's allowed Code Lists, and `attributeValue`
must be one of that list's exact allowed values — anything else is dropped into
`unresolvedAttributes` rather than trusted; the returned `code` is always overwritten with the
authoritative code from the generated GS1 map (the model's own code is never used); unresolved
entries are de-duplicated by `codeListName` (first reason wins); `confidence` clamped to `[0, 1]`.

---

## 3. Per-shot suggestions

**File:** `app/api/suggest-shot-attributes/route.ts`
**Triggered by:** `runShotSuggestions()` in `use-ai-attributes.ts` — the independent "Suggest
per-shot details with AI" action (no classification/brick required).
**Model config:** `temperature: 0.2`

Proposes the GDSN per-image fields a vision model reads directly from the shot — orientation,
facing, angle, and a one-line description — one entry per uploaded image.

**Prompt template** (`${product}` is the auto-populated product description, omitted if empty;
the image-list line renders as `Image 1: filename.jpg` per line, in upload order):

```
For each product image below, identify the camera viewpoint and draft a short description.
${product ? `The product is: ${product}\n` : ""}
Images, in order:
${validated.map((img, i) => `  Image ${i + 1}: ${img.fileName}`).join("\n")}

Allowed codes (answer ONLY with these):
- orientation: PRI (primary/hero), VF1 (front), VIK, VIS, SDL (side left), SDR (side right), VIB (bottom), VIT (top), VBK (back)
- facing: 1 (front), 2 (left), 3 (top), 7 (back), 8 (right), 9 (bottom)
- angle: 1 (center, no plunge), 2 (left, no plunge), 3 (right, no plunge), 7 (center, plunge), 8 (left, plunge), 9 (right, plunge)

Rules:
- Return one entry per image, matching fileName exactly.
- description: one concise sentence describing what the image shows.
- confidence: a number between 0 and 1 per entry.
- Return JSON only, no markdown fences, in exactly this shape:
{ "suggestions": [ { "fileName": string, "orientation": string, "facing": string, "angle": string, "description": string, "confidence": number } ] }
```

**Response contract:** `{ suggestions: [{ fileName, orientation, facing, angle, description,
confidence }] }`. Server-side: `fileName` must match one of the actually-uploaded images;
`orientation` must be one of the fixed `ORIENTATION_CODES` (a suggestion is dropped entirely if
this fails — orientation is the point of the route); `facing`/`angle` fall back to an empty string
if not one of the fixed `FACING_CODES`/`ANGLE_CODES`; `description` is trimmed and capped at 300
characters; `confidence` clamped to `[0, 1]`.
