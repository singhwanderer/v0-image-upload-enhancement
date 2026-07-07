# UX Audit: Supplier & Retailer Image Upload Flows

**Scope:** End-to-end user flows for suppliers (image upload wizard) and retailers (image browser) in the Trading Grid Catalogue prototype.
**Goal audited against:** Let users add images and related attributes as easily as possible, at scale.
**Method:** Code-level walkthrough of both flows (`app/page.tsx`, `components/trading-grid/*`, `app/api/*`), with findings cited as `file:line`. Revised across two stakeholder review rounds; the CSV bulk-upload design follows the authoritative 21-field specification (Appendix A).

---

## 1. Current-state flow maps

### Supplier

```
Landing (ImageUploadLanding, image-upload-hub.tsx:82)
  └─ pick upload level card (Product / Product+Color / GTIN)
       └─ Wizard (ImageUploadWizard, image-upload-wizard.tsx:435) — 3 steps
            1. Target & Files   — selection code + product (+ color/GTIN),
                                  location type (ACL/FTP/URL), drag-drop files
            2. Attributes       — optional AI extraction (category + GPC brick →
                                  per-suggestion accept/reject), then required
                                  Image Type / Purpose / Orientation per image
                                  (apply-to-all or per-image)
            3. Review & Confirm — summaries + syndication acknowledgement
       └─ Post-submit Product Media view — bulk select / edit / delete / download
```

### Retailer

```
RetailerImageBrowser (image-upload-hub.tsx:323) — 4-level drill-down
  Vendor list → Selection codes → Product list → Product media
                                                   ├─ download (simulated)
                                                   ├─ lightbox zoom
                                                   └─ read-only AI attributes drawer
```

There is no other path to any image: every sidebar link is `href="#"` (`layout.tsx:229-231`).

---

## 2. What works well (supplier)

- Clear step gating with per-step validation; users cannot submit incomplete metadata (`image-upload-wizard.tsx:1408-1417`).
- Multi-file drag-and-drop with per-file rejection reasons shown inline — observed value plus the rule that failed (`image-upload-wizard.tsx:2640-2658`).
- Good batch-entry primitives: "Apply same attributes to all N images" toggle, per-image mode with completion checks, and "Copy attributes from image" (`image-upload-wizard.tsx:2903-2920`, `2982-3003`).
- AI suggestions are individually accept/reject with inline editing against curated GS1 code lists, server-side re-validation of model output, and a visible error state with retry if extraction fails (`components/trading-grid/use-ai-attributes.ts`).
- Post-submit media view has real bulk operations (select-all, bulk edit, bulk delete).

---

## 3. Findings

Severity: **Critical** = blocks the at-scale goal or misleads users · **Major** = significant friction or dead UX · **Minor** = quality/polish.

### Supplier flow

| # | Severity | Finding | Evidence |
|---|---|---|---|
| S1 | Critical | **One product per wizard run.** Upload level, selection code, and product are fixed before files are added; images for 50 products require 50 full wizard runs. No cross-product batch path exists. | `image-upload-wizard.tsx:2419-2767` |
| S2 | Critical | **No spreadsheet/CSV entry path.** Every attribute is entered through browser dropdowns; suppliers at scale work from PIM/Excel exports. | Step 2, `image-upload-wizard.tsx:2769-3059` |
| S3 | Critical | **Validation contradicts the spec and the landing copy.** Spec: 500 KB, JPG only. Code enforces **4 MB** and accepts **PNG/WebP** (`upload-validation.ts:10-13`); wizard copy repeats "Max 4 MB · JPG, PNG, or WebP" (`image-upload-wizard.tsx:1970`, `2630`). The landing (500 KB, JPG/JPEG — `image-upload-hub.tsx:277`, `285`) is the only correct surface. Users are told different rules in different places, and the product accepts files 8× over spec. | as cited |
| S4 | Major | **Users are asked questions with only one valid answer.** Per spec, `image_type` is hardcoded `SI` and `purpose` hardcoded `INT`, yet both are required dropdowns on every image. Prefilling and locking them cuts required manual entry from 3 fields to 1 (orientation). | `image-upload-wizard.tsx:313-361` |
| S5 | Major | **AI fills the optional fields, not the blocking ones.** Extraction suggests GS1 *extended* attributes, while the required fields that gate submission (orientation, notably) stay manual — and are what vision models detect well. Users must also hand-pick the GPC brick, importing GS1 taxonomy knowledge the product could infer from the already-selected product. | `image-upload-wizard.tsx:2779-2900` |
| S6 | Major | **AI suggestion review doesn't scale visually.** The suggestion table occupies roughly half the step; every suggestion needs an individual Accept click; more attributes ⇒ proportionally more mess. | `image-upload-wizard.tsx:2779-2900` |
| S7 | Major | **Step-count mismatch.** The landing advertises a 4-step process (`image-upload-hub.tsx:126-149`); the wizard shows a 3-step tracker (`image-upload-wizard.tsx:546-550`) because "Select Upload Level" happened on the landing card. Users who just read "4 steps" can't tell whether they skipped one. | as cited |
| S8 | Major | **`LMI` location type missing.** Spec allows ACL/FTP/LMI/URL; wizard offers ACL/FTP/URL. | `image-upload-wizard.tsx` Step 1 |
| S9 | Major | **Hierarchy model diverges from spec.** Landing sells three levels (Product / Product+Color / GTIN); the spec defines two (`image_level` = product \| item) with color as optional `color_code` on product rows, and calls the granular level `item`/`item_number`, not GTIN. | `image-upload-hub.tsx:158-266` |
| S10 | Minor | **Unreachable failure UI.** `partial-failure` phase and retry handling exist but the simulated submission never produces failures. | `image-upload-wizard.tsx:468`, `1419` |
| S11 | Minor | **No filename validation** at staging (spec: unique, extension required, no special characters); only size/extension are checked. | `upload-validation.ts` |
| S12 | Minor | Bulk edit blind-overwrites all selected images with no visibility into existing differing values and no impact preview. | `image-upload-wizard.tsx:1540-1552` |
| S13 | Major | **No AI trigger after images are already uploaded.** The post-submit Product Media view's toolbar button only views an existing extraction, or shows an empty table if none ran — there is no way to invoke AI without re-uploading through the wizard. | `image-upload-wizard.tsx:1567`, `2227-2229` |

### Retailer flow

| # | Severity | Finding | Evidence |
|---|---|---|---|
| R1 | Critical | **Discovery is non-functional chrome.** "Search" is a header with no input or handler; "Filter" has no inputs; the Catalogue/Grid view selector has no `onValueChange`; pagination buttons are permanently disabled; Export buttons have no onClick. | `image-upload-hub.tsx:434-439`, `582-590`, `568-579`, `592-602`, `427/481/538` |
| R2 | Critical | **Attributes never power discovery.** The entire payoff of capturing GS1 attributes — attribute-based filtering — is absent; attributes are only visible after drilling to a single product's media. | `image-upload-hub.tsx:1013-1031` |
| R3 | Major | **Selection model is unintuitive.** The rule *empty selection = everything selected* is invisible state users cannot predict; the raw checkbox in the product list is unlabeled. | `use-media-selection.ts:20-22`, `image-upload-hub.tsx:626` |
| R4 | Major | **Download modal is noisy.** Metadata/attribute preview panes appear in both the Select and Complete phases; retailers know what they are downloading. Download itself is simulated with no failure path. | `image-upload-hub.tsx:791-988` |
| R5 | Major | **Static data regardless of selection.** Every product shows the same two mock images; products listed with 0 images still reach a populated media screen; there are no empty states. | `image-upload-hub.tsx:66-69`, `628-644` |
| R6 | Minor | Fabricated counts (selection-code product totals computed as `14 + idx * 3`) and vendor counts that don't reconcile with downstream screens. | `image-upload-hub.tsx:520`, `38-42` |

### Cross-cutting

| # | Severity | Finding | Evidence |
|---|---|---|---|
| X1 | Major | **Mouse-only navigation.** Breadcrumbs are `<span onClick>`; drill-down rows are clickable `<tr>` with no `role`, `tabIndex`, or key handlers. | `image-upload-hub.tsx:403-408`, `459` |
| X2 | Major | **Hand-rolled modals.** Lightbox and download modals are `fixed inset-0` divs with no focus trap, Esc handling, or `aria-modal`, while accessible `Dialog`/`Sheet` primitives exist in the repo (and are used correctly for the AI drawer). | `image-upload-hub.tsx:792`, `991` vs `1014` |
| X3 | Major | **No feedback layer.** Toast infrastructure exists (`hooks/use-toast.ts`, `components/ui/toaster.tsx`) but no `<Toaster>` is mounted and nothing calls `toast()`. | grep-verified |
| X4 | Minor | Not responsive: fixed `w-56` sidebar, fixed grid columns, no breakpoints; `use-mobile` hook unused. | `layout.tsx:211`, `image-upload-hub.tsx:547` |
| X5 | Minor | Icon buttons rely on `title` with no `aria-label`; image alt text is the filename. | `image-upload-hub.tsx:731-737`, `781` |

---

## 4. Recommendations

### P0 — Make attribute entry scale (supplier)

#### P0.1 CSV bulk upload (per the field spec in Appendix A) — effort L

The `action` column (insert/update/delete) makes this a batch *operations* file, not a metadata import: updates and deletes need no binaries, and FTP/LMI/URL inserts resolve via `external_location`. Entry point: a **Bulk CSV Upload** path on the landing alongside the level cards (rows carry their own `image_level`, so no pre-selection).

**Example user flow** — a merchandiser has 42 new images, 10 corrections, and 3 removals for the Spring Running Line:

1. **Template.** Downloads the CSV template: hardcoded columns pre-filled (`file_type=JPG`, `image_type=SI`, `purpose=INT`), `action` defaulted to `insert`, a reference row documenting valid codes (orientation `PRI/VF1/VIK/VIS/SDL/SDR/VIB/VIT`, location `ACL/FTP/LMI/URL`, image_style `CSW/PRO`, facing `1–9`). Fills it in Excel or maps a PIM export.
2. **Row validation.** Uploads the CSV. Every row is checked: mandatory fields present; conditionals enforced (`product` when `image_level=product`, `item_number` when `item`, `external_location` when FTP/URL); enums valid; `file_name` unique, extension present, no special characters; hardcoded fields exactly `JPG`/`SI`/`INT`. Result panel: *"55 rows valid · 5 rows with errors"* with line numbers and a **Download error report** (the same CSV with an error column appended) — fixes happen in Excel, never re-typed in the browser.
3. **Attach binaries only where needed.** Only `action=insert` + `location_type=ACL` rows require local files. The screen lists the expected filenames; she drags the JPGs in and gets a reconciliation: *"38 of 42 files matched · 4 missing."* Each file is validated (≤ 500 KB, JPG, filename matches a row).
4. **Categorize & extract — optional, not a gate.** The CSV spec has no category field, and extraction is brick-scoped — see **P0.1a** for the classification waterfall and group-confirmation UX. This step is one of two entry points into that waterfall, not a requirement: a merchandiser can skip straight to step 5, submit rows as-is, and run AI classification/extraction later, per product, via the post-upload trigger (**P0.1c**). Wherever triggered, extraction runs per confirmed group in parallel.
5. **Review & submit, grouped by action.** *"42 inserts · 10 updates · 3 deletes"* — deletes listed explicitly and confirmed separately. Submission returns per-row results; failed rows download as a CSV to fix and resubmit. This gives the currently unreachable `partial-failure` retry UI (S10) a real job.

One CSV covers many products and items in a single run and pushes error-fixing into the user's native tool. This **subsumes** a separate "multi-product batch upload" feature — rows self-describe their targets. (Filename-convention auto-assign for the interactive wizard, e.g. `SKU_COLOR_ANGLE.jpg`, drops to P2.)

#### P0.1a Category mapping for CSV bulk upload — effort M (prerequisite for AI extraction, whichever entry point triggers it)

**The problem.** AI attribute extraction is strictly brick-scoped — the API requires a `category` and a `brick` (`app/api/extract-attributes/route.ts:109-127`) — but the 21-field CSV spec carries **no category or classification field**. A 100-item CSV can span multiple categories. Asking users to supply classification codes fails on two fronts: most suppliers don't know GPC codes (88 bricks across 5 categories — `lib/gs1/generated-bricks.ts`: Shoes 9, Apparel 9, Bags 2, Jewelry 13, Beauty 55), and a wrong brick silently scopes extraction to the wrong attribute vocabulary, producing garbage suggestions.

**Revised assumption: assume the worst case.** GPC/classification codes are barely populated on supplier product records today — master-data lookup cannot be the primary lever. The design below no longer depends on it; it is only ever a bonus signal when it happens to exist.

**Core reframe: users confirm groups; they never classify items.** Category assignment is the system's job; humans handle only the exception boundary, in plain language, at group level.

**Two entry points, one waterfall.** The classification/confirmation flow below isn't bound to the CSV upload step — it's reachable in two places, and when (or whether) to run it is the user's call: (1) **inline**, right after row validation and file attachment, before final submit — for a merchandiser who wants attributes captured in the same sitting; (2) **later, per product**, via the post-upload trigger (**P0.1c**) — for a merchandiser who wants images live first and attributes layered on afterward, or who wants to batch classification across several CSV runs at once. CSV submission (insert/update/delete) never blocks on classification.

**Tier 0 — structural dedup (free, and now the single biggest lever).** A product or item cannot belong to two categories — every image under the same `product`/`item_number` shares one classification by definition. So classification should run **once per unique product/item, not once per image.** A 100-row CSV might reference only 15–25 distinct products; that is the real unit count the system needs to resolve, not 100. This collapses the problem before AI or humans are ever involved, and it holds regardless of GPC availability.

**Two-tier classification waterfall (per unique product/item, not per image):**

1. **Weak text priors (free, non-authoritative).** Since GPC can't be assumed present, treat product description/name (if the supplier's catalog exposes it independent of GPC), selection-code description ("Apparel / Dresses"), and filename tokens as *hints fed into the AI prompt*, not as a resolving lookup. The existing keyword heuristic (`getDefaultCategory`, `image-upload-wizard.tsx:576-581`) currently detects only 2 of 5 categories and is a starting point for this, but it should inform the AI call, not stand in for it. If a `category` CSV column is later added (see guardrails), it plugs in here too — still just a prior, never trusted blindly.

2. **AI classification pass — now the primary engine, not a supplement, and it targets brick, not category.** In this domain, **brick is the standard GS1/GPC classification unit that must actually be resolved.** This app's 5 categories (Shoes/Apparel/Bags/Jewelry/Beauty) are just an internal grouping over bricks (`CATEGORY_BRICKS: Record<ProductCategory, Brick[]>`, `lib/gs1/generated-bricks.ts:22`) — since every brick belongs to exactly one category in that partition, **resolving brick automatically yields category for free** (a one-time reverse lookup, brick code → category). So the classification pass proposes a **brick** directly, not a category with brick as an afterthought: one `gemini-2.5-flash` call per unique product/item (batching a handful of products' representative images per request), using **all available images for that product together** plus whatever text hints exist, returning `{brickCode, confidence}` — category is derived from the resolved brick, not asked for separately. Reusing multiple images of the same product in one call materially raises confidence over a single-image guess. The existing Gemini transport already batches images per call and is prompt-agnostic (`route.ts:236-257`) — the retry/parse plumbing is reusable as-is; the prompt may narrow candidates using weak text priors purely as an internal optimization (smaller candidate set → shorter prompt), but the object the user ultimately confirms is always "proposed brick," never a separate category approval. Mock mode: the keyword heuristic (extended per Tier 1) picks a category to seed brick candidates from (`lib/gs1/mock-scenarios.ts:101-144` is category-keyed).

**This is a new AI action, distinct from today's extraction button.** The existing "Extract Extended Attributes with AI" button (`image-upload-wizard.tsx:2844-2846`) only runs *attribute extraction* — it's disabled until category **and** brick are already chosen manually via dropdowns (`disabled={!aiCategory || !aiBrick || ...}`, same line) and does not classify anything. Today, AI never runs automatically anywhere in the app: extraction requires this explicit click, "Skip AI Extraction" (`:2849`) opts out entirely and is reversible via a "Show" button later in the same step (`:2791-2794`), and any file/category/brick change clears prior results and forces an explicit re-run (`clearExtraction()`, e.g. `:2053, 2459`) — never a silent re-extraction. The classification pass above is a **new, separate action** (image(s) → brick) that must be built; it feeds its resolved brick into the existing, unchanged extraction call as a prerequisite step, not a replacement for it.

**Group-level human confirmation, plain language only.** A **Categorize** stage in the CSV flow, grouped by **proposed brick** across all products (not per-product), with category shown alongside as the derived label: *"18 products (72 images) → Sneakers · Shoes — confirm? · 5 products (18 images) → Handbags · Bags — confirm? · 4 products (10 images) need review."* The user confirms/corrects at the group level via chips, opening a searchable brick picker (plain names/synonyms — "sneakers" finds the brick; the GPC code is secondary metadata) only for the review tray. Low-confidence products sit in that tray — reviewed **once per product**, never per image. Never bare codes, never per-image forms.

**Example flow — 100 images, worst case (no GPC on file):** 100 images resolve to ~22 unique products via Tier 0. The AI pass proposes a brick for all 22 (using each product's own images together) — say 15 land above the brick-confidence threshold (fewer than a category-only pass would clear, since 88-way is a harder call than 5-way — the correct tradeoff, not a regression), 7 don't. The Categorize screen shows 3 confirmed-pending brick groups covering the 15, plus a 7-product review tray. The user confirms the 3 groups (three clicks covering 15 products) and resolves the 7 individually via the brick picker. Total human decisions: **10**, not 100, and not 22 — because grouping by brick, not by product, is what the confirmation screen shows first.

**Product-management guardrails:**
- *Error-cost asymmetry:* wrong brick → wrong vocabulary → garbage extraction → lost trust. Brick auto-assigns only above a high confidence threshold; everything else goes to the tray for explicit confirmation — precision over coverage. (Category needs no separate threshold — it's derived, not decided.)
- *Cost/latency:* one call per unique product (not per image) keeps volume low even at 100+ images; negligible next to extraction itself.
- *Optional `category` CSV column* (plain-language, fuzzy-validated) as a **spec-change proposal** for suppliers whose PIM does know it — optional, never required, narrows brick candidates as a Tier 1 prior only.
- *Supplier memory:* log corrections per product; most suppliers ship one or two categories repeatedly, so the tray shrinks fast after the first few batches even without any GPC data ever appearing.
- *Rollout:* v1 = brick auto-assign only above a high confidence threshold, everything else confirmed; v2 = lower the threshold once acceptance data justifies it. Instrument: % of products resolved by Tier 0 alone (should approach 100% — it's arithmetic, not ML), brick-classification acceptance rate, brick-correction rate, human decisions per 100 images.
- *Escape hatch:* "Skip AI for this group" always available — manual attribute entry exactly as today. Skipping the whole Categorize stage at upload time is equally valid: the same classification runs later via the post-upload trigger (P0.1c), so nothing is lost by deferring.

**Engineering notes.** Current extraction is one consolidated call with a single category+brick and a single `aiExtraction` state object, run per-image-batch rather than per-product. Needed changes: (a) a grouping step keyed by `product`/`item_number` before any AI call, (b) the classification call described above (new, lightweight endpoint returning brick+confidence — distinct from `/api/extract-attributes`, which is unchanged), (c) one extraction request per confirmed brick group (parallel POSTs or a route accepting `groups: [{category, brick, images}]`, category populated from the derived lookup), and (d) wizard/CSV-flow state moving from a single `aiExtraction` object to a collection keyed by group.

#### P0.1c Post-upload AI trigger at product level — effort S (reuses P0.1a classification + P0.3 review)

**Finding (S13, Major).** Once images are already uploaded and submitted, there is no way to invoke AI at all. The post-submit Product Media view's toolbar button (`image-upload-wizard.tsx:1567`) only opens a **"View AI Attributes"** drawer that shows whatever extraction ran during the original wizard session — or, if none did, an empty table (`hasExtraction ? renderAiResultsCard() : <AiAttributesTable attributes={[]} />`, `:2227-2229`). A supplier who skipped AI originally, or wants to reclassify, has no path back to it without re-uploading through the wizard.

**Recommendation.** Turn that button into a real trigger, reusing components from P0.1a/P0.3 rather than inventing new ones:
- When `hasExtraction` is false, the Sparkles button reads **"Run AI"** instead of "View AI Attributes."
- Clicking it runs the same classification pass from P0.1a, scoped to just this one product's already-uploaded images — simpler than the batch case, since there's no cross-product grouping to do; the product is already fixed by context.
- High-confidence result: an inline confirm chip — *"Classified as Sneakers · Shoes — Confirm / Change"* — using the same searchable brick picker as the bulk flow's review tray. Low confidence: that picker opens directly.
- Once brick is confirmed, the existing (unchanged) extraction call runs automatically, and results render via the compact review pattern from **P0.3** inside the existing drawer.

**Open consideration (flagged, not resolved here):** the syndication banner already states images are "visible to retailers... available to retailer subscribers on next sync" (`:1643-1645`). Accepting new AI attributes after that point changes data retailers may already have — this needs an engineering answer on re-sync/versioning, not a silent assumption that it's handled.

#### P0.2 Apply the spec's hardcoded fields to the manual wizard — effort S

Prefill and lock `image_type=SI`, `purpose=INT`, `file_type=JPG` (fixes S4); add the missing `LMI` location type (S8); map the "Product + Color Code" card to product level + prefilled `color_code`, and align "GTIN" terminology with `item`/`item_number` (S9).

#### P0.3 Compact AI review with Accept-all — effort S–M

Solve density first, then add bulk accept (addresses S5/S6):
- High-confidence suggestions collapse to a one-line summary chip: *"11 of 14 suggestions high-confidence — Accept all."*
- Only low-confidence/unresolved rows render expanded, in a fixed-height scrollable exceptions list.
- The full table moves to the existing `Sheet` drawer (already used for "View AI Attributes") for users who want every row.
- Extend extraction to prefill **orientation** (the remaining required field) and auto-suggest the GPC brick from the selected product.

The inline footprint shrinks from ~50% of the step to a few rows and stays constant as suggestion count grows.

#### P0.4 Trust fixes — effort XS

- `upload-validation.ts:10`: `MAX_SIZE_BYTES = 500 * 1024`; restrict extensions/MIME to JPG/JPEG; update the stale header comment.
- Fix wizard copy at `image-upload-wizard.tsx:1970` and `2630` to "Max 500 KB · JPG".
- Fix step numbering (S7): badge landing cards "Step 1 of 4" and number wizard steps 2–4, or retitle the landing strip to 3 steps.
- Add filename character validation at staging (S11).

### P1 — Make the retailer side real

#### P1.1 "Browse Images" as a first-class, self-explanatory nav item + faceted search — effort M–L

Today the only path to any image is the 4-click drill-down, and a plain search box bolted onto the Vendor List page wouldn't fix that — sitting above a vendor table, it would read as a filter on that table, not as a global search across every vendor's products. (This is a distinct capability from **Advanced Search**, an existing power-user nav entry that stays untouched and out of scope here.)

Instead, add a dedicated left-nav item — supplier: **Media Library**, retailer: **Browse Images** — made unmistakable through three reinforcing signals rather than relying on the label alone: (1) paired with the same `ImageIcon` the supplier's "Image Upload" nav item already uses, so an image glyph sits next to the word "Images"; (2) placed first in the Catalogue nav section, above "Vendor List"/"Selection Code List," signaling it's the primary way in, not a buried extra; (3) the destination page itself states its scope the instant it loads — a one-line subtitle under the page title ("Search images by product or GTIN, across all vendors") plus a search input whose placeholder says the same thing directly ("Search by product, GTIN, or SKU..."). It lands on a searchable, attribute-faceted grid across vendors and products; the drill-down remains the secondary, account-oriented path. This is where captured attributes finally earn their keep as facets (fixes R1/R2).

The Vendor List's own inline search chrome stays scoped narrowly to filtering the vendor table by name/account number — it never tries to double as this cross-vendor image search. Two boxes, two unambiguous scopes.

**Results are always product-grouped — with or without a query.** Browse Images renders one card per product, never a flat interleaved image grid. Landing on the page with nothing typed or faceted shows every product as a card — that alone is the answer to "let me just view everything without searching"; there's no separate browse mode, only the unfiltered state of the same grid. Each card shows a single representative thumbnail (preferring the image marked Primary/PRI orientation, since that field already exists in the data), the product ID + description, a vendor tag (results span all vendors), and an image-count badge, plus a **"View all N images"** action. Clicking it navigates into the same Product Media screen the drill-down already uses (`image-upload-hub.tsx:658-1020` — lightbox, AI attributes drawer, download modal, selection bar, all reused as-is), with a breadcrumb reading `Browse Images > [Product]` so back returns to the filtered grid, not to Vendor List. Search and facets narrow which product cards surface but reset once inside a product's own view — opening a product always shows its full image set regardless of which facet got you there, keeping the model simple: facets are for finding the product, not for filtering once you're looking at it. (Flagged, not solved here: at real scale the zero-filter landing grid needs pagination/infinite scroll and a default sort — recency is the natural default.)

**Example user flow** — a buyer needs front-facing shots from APEX for the spring reset:

1. Clicks **Browse Images** in the left nav (image icon, top of Catalogue) → lands on a page subtitled "Search images by product or GTIN, across all vendors," with every product shown as a card by default.
2. Types "apex running" into the search box (placeholder: "Search by product, GTIN, or SKU..."); applies facets *Image Type = Product Image*, *Orientation = Front (PRI)*, *Selection Code = 001 Spring Running Line* → the grid narrows to 4 matching product cards.
3. Clicks **"View all 6 images"** on the Cool Runner card → navigates to that product's Product Media screen (same lightbox/selection/download primitives as the drill-down today), now showing its full image set.
4. Selects via visible checkboxes; a persistent bar reads *"6 of 6 selected · Clear · Download."* Download → single confirm ("Download 6 images") with one optional toggle *"Include metadata file"* → progress and completion as a toast. Done.

#### P1.2 Selection, download, and feedback fixes — effort S–M

- Retire *empty set = all selected* (`use-media-selection.ts:20-22`); use explicit selection: checkbox visible on hover / persistent once checked, explicit Select All, persistent count bar with Clear (fixes R3).
- Strip the download modal to a one-step confirm + optional "include metadata" toggle; drop the metadata/attribute preview panes from Select and Complete phases (fixes R4).
- Make the existing **Export** buttons functional — export-to-catalogue is the retailer outcome; no new save/favorite actions.
- Mount `<Toaster>` and use toasts for download progress/completion (fixes X3).
- Wire up or remove the fake Search/Filter/view-selector/pagination chrome (R1).

Deliberately **out of scope** (stakeholder decision): connecting supplier submissions to the retailer view — portals stay independent mocks to keep the prototype simple. Cheap demo-continuity alternative: have retailer fixtures echo the supplier demo scenario.

#### P1.3 Bulk edit improvements — effort M

- Per-field **"Mixed"** state when selected images differ (Figma-style multi-select); only fields the user touches get written (fixes S12).
- Impact preview before apply: *"Will update Orientation on 12 images (3 already PRI)."*
- Later: a spreadsheet-style grid (rows = images, columns = attributes, inline edit, copy-down, paste from Excel) — the true at-scale editor and the natural round-trip surface for CSV import/export.

### P2 — Production quality

- Filename-convention auto-assign in the interactive wizard (largely subsumed by CSV).
- Keyboard operability for the drill-down; replace hand-rolled modals with `Dialog` primitives; `aria-label` on icon buttons (X1/X2/X5).
- Responsive layout (X4).
- Real upload progress and a reachable failure/retry path (S10).

---

## 5. Priority summary

| Priority | Recommendation | Effort | Serves |
|---|---|---|---|
| P0 | CSV bulk upload per spec (validate → attach ACL binaries → categorize → review by action → per-row results) | L | scale |
| P0 | Category mapping for CSV batches (dedup by product/item → AI brick classification → group confirmation, category derived; available inline during upload or later per-product — user's choice) | M | scale + ease |
| P0 | Post-upload AI trigger at product level (S13) | S | ease |
| P0 | Prefill/lock SI · INT · JPG in manual wizard; add LMI; align level model to product/item + color_code | S | ease |
| P0 | Compact AI review (summary + exceptions) with Accept-all; AI prefills orientation; auto-suggest brick | S–M | ease |
| P0 | 500 KB + JPG-only validation, copy fixes, 4-vs-3 step numbering, filename character check | XS | trust |
| P1 | Media Library / Browse Images: dedicated, icon-led nav item (first in Catalogue) + self-describing landing page + product-grouped, attribute-faceted grid (view-all-N-images per card, no query required) — distinct from Advanced Search | M–L | retailer value |
| P1 | Explicit selection model, simplified download modal, functional Export, mounted toasts | S–M | retailer value |
| P1 | Bulk edit: mixed-value states + impact preview (grid editor later) | M | scale |
| P2 | Filename-convention auto-assign in interactive wizard | M | scale |
| P2 | Keyboard/a11y, Dialog primitives, responsive layout, real failure/retry states | M | quality |

The one code fix to make immediately regardless of roadmap is P0.4: the product currently accepts files 8× over spec, in formats the spec forbids, and tells users the wrong limit inside the wizard.

---

## Appendix A — CSV field specification (authoritative)

| Field Name | Mandatory | Description |
|---|---|---|
| action | Yes | Database operation: insert, update, or delete. |
| image_level | Yes | Hierarchy level: product or item. |
| product | Conditional | Required if image_level is product. |
| item_number | Conditional | Required if image_level is item (GTIN). |
| file_name | Yes | Unique identifier with extension (e.g., .jpg). No special characters. |
| file_type | Yes | Must be hardcoded as JPG. |
| image_type | Yes | Must be hardcoded as SI (Still Shot). |
| purpose | Yes | Must be hardcoded as INT (Internet). |
| orientation | Yes | Camera-facing side (e.g., PRI, VF1, VIK, VIS, SDL, SDR, VIB, VIT). |
| location_type | Yes | Hosting method: ACL, FTP, LMI, or URL. |
| external_location | Conditional | Required if location_type is FTP or URL. |
| color_code | No | Used for Product-level images to specify color via NRF code. |
| image_style | No | Presentation type: CSW (Color Swatch) or PRO (Product). |
| facing | No | GDSN standard viewing direction (1–9). |
| angle | No | Horizontal rotation and plunge value. |
| file_size | No | Compressed file size. |
| pixel_density | No | Resolution in DPI. |
| height | No | Pixel height. |
| width | No | Pixel width. |
| clipping_path | No | Name of the embedded path outlining the subject. |
| image_description | No | Free-form text description of image contents. |
