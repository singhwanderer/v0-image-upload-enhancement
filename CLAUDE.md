# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this is

A **prototype** of OpenText **Trading Grid Catalogue (TGC)** image upload & syndication, built
with v0 (`v0.app`) and deployed on Vercel. It demonstrates two portals in a single Next.js page:

- **Supplier portal** — a 3-step wizard for staging product images, attaching spec-mandated
  image attributes, checking retailer/GS1 compliance, running AI attribute extraction, and
  submitting/downloading.
- **Retailer portal** — a read-only browser (vendors → selection codes → products → product
  media) for viewing and downloading supplier images plus their metadata CSV.

**Everything except the Gemini calls is a prototype.** There is no database, no auth, no real
upload backend. Product/vendor/GTIN data lives in `MOCK_*` constants; submission and catalogue
push are simulated client-side with timeouts. The GS1 reference data and the four Gemini API
routes are the parts that are real.

## Commands

```bash
pnpm install                 # node_modules is not committed
pnpm dev                     # http://localhost:3000
pnpm build                   # next build
pnpm exec tsc --noEmit       # typecheck (see caveat below)
pnpm run generate:gs1        # regenerate lib/gs1/generated-*.ts from the CSVs
```

Caveats that will bite you:

- **`pnpm lint` is broken and always has been.** `eslint` is not a dependency and there is no
  `eslint.config.js`; the script exits 2. Don't treat a lint failure as something your change
  caused, and don't "fix" it by adding an ESLint setup unless asked.
- **`tsc --noEmit` reports 6 pre-existing errors**, all `'brick' is possibly 'null'` in
  `components/trading-grid/use-ai-attributes.ts`. `next.config.mjs` sets
  `typescript.ignoreBuildErrors: true`, so the build passes regardless. Baseline the count
  before and after your change rather than assuming a clean run.
- **`tsconfig.tsbuildinfo` is committed** and gets rewritten by any `tsc`/`next` run. Revert it
  unless it is genuinely part of your change:
  `git checkout -- tsconfig.tsbuildinfo next-env.d.ts`.
- Both `pnpm-lock.yaml` and `package-lock.json` are committed. **pnpm is the working package
  manager** (`pnpm-workspace.yaml` sets `allowBuilds` for `@google/genai`, `protobufjs`,
  `sharp`). Keep `pnpm-lock.yaml` in sync when you touch dependencies.

### Environment

The only app env var is **`GEMINI_API_KEY`** — server-side only, read in the four
`app/api/*/route.ts` files. It is never prefixed `NEXT_PUBLIC_` and must never be referenced
from client code. When it's absent the AI routes return a clean 500
(`"GEMINI_API_KEY is not configured on the server."`) and the UI shows a retryable error card.
That is intended behavior, not a bug to paper over.

### Verifying changes

`.claude/skills/verify/SKILL.md` is the driving guide for this app: how to boot it, reach the AI
section with Playwright (Chromium is pre-installed at `/opt/pw-browsers/chromium`), and mock
`/api/suggest-brick` when no Gemini key is available. Read it before doing browser verification.
Sample images live at `public/mock/sneaker-front.jpg` and `public/mock/sneaker-side.jpg`.

## Layout

```
app/
  page.tsx                    single page; toggles Supplier ⇄ Retailer portal
  layout.tsx                  fonts, metadata, Toaster, prod-only Vercel Analytics
  globals.css                 the live theme (Tailwind v4, @theme inline + oklch tokens)
  api/
    attribute-options/        GET  — one category's allowed values (no Gemini)
    suggest-brick/            POST — classify GPC brick from images + same-product cross-check
    extract-attributes/       POST — product-level GS1 extended attribute extraction
    suggest-shot-attributes/  POST — per-image shot attributes (orientation, facing, angle, …)
    check-ai-image/           POST — heuristic "is this AI-generated?" signal for compliance
components/
  trading-grid/               ALL product code lives here
  ui/                         shadcn/ui (new-york, neutral) — generated, don't hand-edit
lib/gs1/
  types.ts                    client-safe types + the 6 ProductCategory values
  generated-bricks.ts         GENERATED: category → bricks → applicable Code List Names
  generated-options.ts        GENERATED: category → Code List Names → values + GS1 codes
scripts/generate-gs1-data.mjs build-time generator for both generated files
docs/                         audits, readiness docs, prompt transcripts (see "Docs" below)
*.csv (repo root)             GS1 source data — inputs to the generator only
```

`styles/globals.css` is **dead** — nothing imports it. `app/globals.css` is the real stylesheet.
Don't edit `styles/globals.css` and expect a visual change.

`hooks/use-toast.ts` + `hooks/use-mobile.ts` are the canonical copies; `components/ui/use-toast.ts`
and `components/ui/use-mobile.tsx` are shadcn duplicates. Import from `@/hooks/*`.

## GS1 data pipeline (read this before touching categories, bricks, or attributes)

The root CSVs are **build-time inputs, never runtime reads**:

1. `gs1_extended_attribute_master_code_list.csv` — master code list
   (Code List Name, Code List Value, Code).
2. Per-category GPC matrix sheets (`Clothing.csv`, `Footwear.csv`, `Jewelry.csv`, …) — columns
   are GPC bricks (8-digit code + name), rows are attributes, `E`/`R` cells mark
   expected/required. `Sheet1.csv` is an index and is ignored.

`scripts/generate-gs1-data.mjs` maps sheets → the six categories (**Clothing, Shoes, Bags,
Jewelry, Beauty, Accessories**; sleepwear/swimwear/underwear fold into Clothing per the GPC
family) and emits two committed TypeScript modules.

Rules:

- **Never hand-edit `lib/gs1/generated-*.ts`.** Change a CSV or the generator's
  `CATEGORY_SHEETS` / `ATTRIBUTE_ALIASES` / `DISPLAY_NAME_FIXES` tables, then run
  `pnpm run generate:gs1` and commit the regenerated output.
- Only code-list-backed attributes are emitted. Free-text/numeric rows (Brand Name, Country of
  Origin, package dimensions) are skipped and reported as generator warnings.
- **`generated-options.ts` is server-only by convention** — it's large and must not reach the
  browser bundle. Client code gets one category at a time via
  `GET /api/attribute-options?category=…` (SWR-cached). `generated-bricks.ts` (names only) and
  `types.ts` are client-safe.

## AI architecture and its non-negotiables

Four Gemini routes, all `runtime = "nodejs"`, all on `gemini-3.1-flash-lite` via `@google/genai`.
Each route: validates its input, builds the prompt, calls Gemini (extraction retries once
silently after 2s), strips markdown fences from the response, then **re-validates the model's
output against the authoritative GS1 map** — model-supplied codes are always overwritten with
the curated code, and any Code List Name or value outside the allow-list is demoted to
`unresolvedAttributes` rather than accepted.

Invariants to preserve:

- **AI is always optional and always explicit.** Nothing calls Gemini on mount, on staging, or
  in the background. Every call originates from a button the user clicks. The wizard can be
  completed end to end with every attribute filled in and zero AI calls.
- **AI proposes, the human confirms.** Suggestions arrive `decision: "pending"` and require an
  explicit Accept. Accept and Reject are always shown as separate actions.
- **Fail loud, never silently.** There is no mock/demo AI mode (the old `lib/gs1/mock-scenarios.ts`
  was deleted). Failures — including a missing key — surface as visible, retryable error cards.
- **Honest metadata only.** The UI shows the real model name, measured wall-clock duration, and
  completion time. Don't invent labels: `attribute-options.ts` deliberately renders bare codes
  (`VIK`, `VIS`) where the authoritative GDSN label isn't confirmed.
- **The server is the authority on codes.** Never trust a model-returned GS1 code.

## Deterministic (non-AI) subsystems

Keep these AI-free — that's the point of them.

- `image-metadata.ts` — width/height via the browser decoder, DPI via byte-level JPEG
  JFIF/EXIF and PNG `pHYs` parsing. Decoding, not inference: values are exact or `null`, never
  guessed. Captured at staging into `UploadedFile.measured`.
- `upload-validation.ts` — the global upload gate: ≤ 500 KB, JPG/JPEG only, filename must match
  `/^[A-Za-z0-9._-]+$/` and be unique in the staged set.
- `compliance-check.ts` — evaluates a file against a `ComplianceStandard`. Dimensions/DPI/format/
  size come from measured metadata; background color is sampled from canvas edge pixels. The
  only AI input is the `/api/check-ai-image` signal, passed in by the caller.
- `compliance-standards.ts` — GS1 + two illustrative retailer profiles. **These thresholds are
  sample values, not real spec figures** — that's documented in the file and should stay
  documented if you change them.
- `image-resize.ts` — canvas downscale-to-fit (never upscales, preserves aspect ratio, keeps PNG
  alpha) + `fflate` zipping.
- `metadata-csv.ts` — the 21-column spec-order CSV, one row per image, plus one column per
  accepted extended attribute rendered as `value (GS1CODE)`. RFC 4180 escaping, CRLF endings.

## Component map (`components/trading-grid/`)

| File | Role |
|---|---|
| `layout.tsx` | Chrome + sidebar nav; owns the Supplier/Retailer `PortalType` switch |
| `image-upload-hub.tsx` | Supplier landing cards **and** `RetailerImageBrowser` (4 views: vendor-list → selection-codes → product-list → product-media) |
| `image-upload-wizard.tsx` | The 3-step supplier wizard (~2.5k lines) — the app's center of gravity |
| `step-two-form.tsx` | Attribute form; defines `PER_SHOT_KEYS` |
| `ai-section.tsx` | Classify → extract → review UI, driven by `use-ai-attributes` |
| `use-ai-attributes.ts` | All AI client state: classification status, extraction, per-shot suggestions, edit/accept/reject |
| `suggestion-review-table.tsx`, `ai-attributes-table.tsx` | Per-shot and product-level result tables |
| `compliance-*.ts(x)` | Standards, evaluation, results modal |
| `download-modal.tsx` | Shared by both portals: box-dimension resize, images/CSV toggles |
| `use-media-selection.ts` | Supplier selection state — **empty set means "all"** for download, but bulk edit/delete must gate on a non-empty set |
| `catalogue-push-card.tsx` | Post-submit simulated push of accepted attributes to the catalogue |
| `uploaded-file.ts`, `attribute-options.ts`, `image-detail-card.tsx` | Shared types, GDSN dropdown lists, card renderer |

### Wizard model worth knowing

- Internal `currentStep` is 1–3 but the UI labels it "Step N+1 of 4" (the landing page is step 1).
  Expect this mismatch when writing selectors or reading step logic.
- Attributes split into **product-wide** (stored in `attributes`, applied to every image) and
  **per-shot** (`PER_SHOT_KEYS`: orientation, facing, angle, clippingPath, imageDescription,
  imageStyle — stored in `attributesByImage[index]`). `effectiveAttrs(idx)` merges them;
  `updateCurrentAttributes` routes each edit to the right bucket. Adding an attribute means
  deciding which bucket it belongs in.
- Width/height/DPI are **not** attributes — they are per-file facts on `UploadedFile.measured`.
- Compliance checking is **on demand** (the "Check Compliance" button), never automatic, and
  results render in a modal shared by Step 1 and Step 3. Gemini AI-image signals are cached per
  file id so re-checking doesn't re-hit the API.

## Conventions

- **Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4** (CSS-first: `@theme inline`
  in `app/globals.css`, no `tailwind.config.js`).
- Client components need `"use client"` — nearly all of `trading-grid/` is client-side.
- Imports use the `@/*` alias. shadcn aliases are in `components.json`; icons are `lucide-react`.
- Client modules **must not import server route code**. Response shapes are re-declared locally
  in client files (see the mirrored `ExtractionApiResponse` in `use-ai-attributes.ts`) —
  intentional duplication; if you change a route's response shape, update the client mirror too.
- **Comment style is load-bearing here.** Most modules open with a comment explaining *why* the
  design is what it is (server-only, no-AI, trust boundaries, business rules). Match that: when
  you change behavior a header comment describes, update the comment in the same edit.
- Toasts via `@/hooks/use-toast` / `sonner`. Images are unoptimized (`next.config.mjs`).

## Docs

`docs/` holds design and audit material, not API reference. Some of it is **explicitly historical**
and its file:line citations are stale:

| File | Status |
|---|---|
| `ai-extraction.md` | Developer notes on the extraction pipeline — largely current |
| `ai-extraction-readiness.md` | Stakeholder readiness write-up; describes per-image parallel calls (extraction is now a single product-level call) |
| `gemini-prompts.md` | Verbatim prompt transcripts — **stale**: says `gemini-2.5-flash` and "exactly three routes"; there are now four routes on `gemini-3.1-flash-lite` |
| `p0.1-auto-capture-technical-note.md` | Why auto-capture needs no AI; line refs predate later edits |
| `ux-audit-supplier-retailer-flows.md` | Self-labeled historical snapshot (pre-GS1-rebuild) |
| `ux-audit-v2-image-data-richness.md` | Later audit; the source of the P0.x recommendation numbering used in code comments |

Read the code as the source of truth and treat doc line references as approximate. If you change
prompts or routes, `docs/gemini-prompts.md` is the file that should be refreshed.

## Working in this repo

- v0 pushes commits to `main` directly and every merge to `main` auto-deploys to Vercel. Expect
  machine-generated commits interleaved with hand-written ones.
- Do development on the assigned feature branch, never on `main`.
- Prefer small, surgical edits to `image-upload-wizard.tsx` — it's large and heavily
  state-coupled; a rewrite is almost never the right move.
- Don't add tests infrastructure, ESLint, or a CI setup unless asked — none exists today, and
  verification here is browser-driven per the verify skill.
