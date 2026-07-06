# UX Audit v2: Image Data Richness — Supplier & Retailer Flows

**Author's lens:** an independent designer's walkthrough of the running product code, not a revision of the earlier audit (`ux-audit-supplier-retailer-flows.md`, kept as reference).
**North star audited against:** *suppliers can provide images to retailers with the richest possible data attached* — every image carrying as much of the 21-field spec (Appendix A of the v1 audit) **plus** the brick-scoped GS1 extended attributes as the supplier can reasonably give.
**Method:** code-level walkthrough of `app/page.tsx`, `components/trading-grid/*`, `app/api/extract-attributes/route.ts`, `lib/gs1/*`, with every finding cited as `file:line`.
**Scope note (stakeholder direction):** the retailer view is audited in full, but search/filter/faceting recommendations are explicitly **out of scope** — the retailer's job here is to *receive and read* rich data, not to query it.

---

## 1. The frame: richness is a funnel, and it leaks at every stage

Rich data doesn't fail in one place; it erodes across the pipeline. This audit walks the four stages an attribute must survive to reach a retailer:

```
CAPTURE ──► ENRICH (AI) ──► REVIEW/CONFIRM ──► HANDOFF ──► RETAILER READS IT
 wizard      extraction       step 3 +           metadata     product-media
 forms       card             post-submit        export       card + drawer
```

Measured against the full richness bar (13 wizard fields + up to ~18 brick attributes per product), the current product's *default path* — a supplier who does only what the UI requires — delivers exactly **3 image attributes** (image type, purpose, orientation) and **0 extended attributes** to the retailer. Everything else is opt-in, hidden, manual, or dropped in transit. The findings below trace where each loss happens.

A useful test throughout: **what does the laziest compliant supplier produce?** Defaults, not capabilities, determine data richness at scale.

---

## 2. What genuinely works well

Credit where due — several primitives here are better than typical enterprise upload tools, and the recommendations build on them rather than replacing them:

- **Per-file rejection with observed value + rule failed** (`image-upload-wizard.tsx:2640-2658`) — model error messaging.
- **Brick-scoped AI extraction with server-side re-validation.** The route only accepts attribute values from the curated GS1 code lists and overwrites model-returned codes with authoritative ones (`app/api/extract-attributes/route.ts:160-180, 314-348`). This is the right trust architecture for AI-generated master data.
- **The "unresolved attributes" pattern** (`image-upload-wizard.tsx:985-1017`): every brick attribute the AI couldn't determine is listed with a reason and an inline "Add manually…" picker. This is a completeness affordance most PIM tools lack — it just needs promotion (see E4).
- **Mixed-aware bulk edit**: fields that differ across selected images show as "Mixed" and only touched fields are written (`image-upload-wizard.tsx:2133-2201`). (The v1 audit's S12 "blind overwrite" finding is stale — this is now done right.)
- **Syndication acknowledgement + last-image delete warning** (`:3223-3250`, `:1876-1887`) — consequences of sharing/removing data are made explicit.
- **Copy-attributes-from-image and per-image completion indicators** in per-image mode (`:2960-2966, 2982-3003`).

---

## 3. Findings

Severity is scored against the richness goal:
**Blocker** — structurally prevents rich data from being captured or delivered · **Major** — causes systematic data loss or wrong data · **Minor** — friction/polish that suppresses richness at the margin.

### Stage 1 — CAPTURE: the wizard optimizes for the minimum record

| # | Sev | Finding |
|---|---|---|
| C1 | **Blocker** | **The richest fields ship collapsed and optional.** The 8 attributes that constitute most of the spec's richness — image style, facing, angle, clipping path, description, DPI, height, width — live behind a closed-by-default disclosure labeled "Optional attributes (8) — expand" (`image-upload-wizard.tsx:377-430`; `advancedOpen` initialized `false`, `:450`). Nothing motivates opening it: no preview of what's inside, no completeness indicator, no downstream consequence shown. Defaults are the strongest force in form design; this default produces the minimum record. The retailer card's ten blank rows (R1) are this finding, seen from the other side. |
| C2 | **Blocker** | **The product asks humans to type data the file already contains.** Height, width, and pixel density are manual `<input type="number">` fields (`:416-427`) — yet the true pixel dimensions are knowable the instant a file is staged (the code already creates object URLs and `<img>` previews from the `File`; reading `naturalWidth/Height` is free). File size is *already* auto-captured (`file.size`), proving the pattern. Manual entry here is strictly worse than automatic: it adds friction, gets skipped (→ blank), or gets typed wrong (→ false data — nothing validates a typed "2400" against actual pixels). This is the cheapest richness win in the entire product: 3+ fields filled for every image, every supplier, zero effort, perfect accuracy. |
| C3 | **Blocker** | **"Apply to all" poisons the per-shot fields.** `applyToAll` defaults `true` (`:449`) and applies one orientation/facing/angle to every image. But those three fields describe *what makes each shot different* — a product with 6 images has them precisely to show front/side/back/top. The one-click path produces 6 images all stamped `PRI-Primary`: data that is rich-looking and **wrong**, which is worse than blank for a retailer choosing a hero image. The root cause is that the attribute model doesn't distinguish **product-invariant** fields (image type, purpose, location, style) from **shot-variant** fields (orientation, facing, angle, description) — the form treats all 13 as one block, so the batch primitive that's correct for the first group corrupts the second. |
| C4 | **Major** | **Remote images (FTP/URL) are a richness dead zone.** Choosing FTP/URL replaces the file zone with a *single* location input for the whole run (`:2660-2691`; the placeholder even points at one file, `ftp://…/product.jpg`) though the spec defines `external_location` per file. With no staged binaries: no previews, no dimension capture (C2 can't help), and **no AI extraction at all** (`runExtraction` requires `uploadedFiles.length > 0`, `:625,695`) — Step 2 renders "Configure attributes for 0 uploaded images" (`:2775`). The suppliers most likely to host imagery externally — the large, sophisticated ones — get the *weakest* data-capture path. |
| C5 | **Major** | **The controlled vocabularies drift from the spec — captured richness dies in downstream validation.** Wizard offers `image_style` STD/EDI/MOD/FLT (`:226-231`) where the spec allows only **CSW/PRO**; `facing` 1–6 (`:217-224`) vs spec **1–9**; orientation includes `VBK` but lacks the spec's `VIK`/`VIS` (`:177-185`); file validation enforces 4 MB + PNG/WebP against a spec of 500 KB JPG-only — while the validation file's own header comment still claims the correct rule (`upload-validation.ts:2 vs :10-13`) and the landing page states the correct limits (`image-upload-hub.tsx:277,285`). No filename rules (unique, extension, no special characters) are checked anywhere. Every attribute submitted in a vocabulary the receiving system rejects is effort spent producing data that will be dropped or bounced. |
| C6 | **Major** | **One product per wizard run caps richness at scale.** Target selection is fixed in Step 1 (`:2429-2521`); 50 products = 50 complete runs. The richness consequence is behavioral: suppliers have a fixed effort budget, and when the *process* consumes it, the *optional data* is what gets cut. Any per-image richness improvement is multiplied — or nullified — by this loop. (The v1 audit's CSV bulk-upload design remains the right structural answer; this audit treats it as adopted context rather than re-designing it.) |
| C7 | Minor | Step-count mismatch: the landing sells a 4-step process (`image-upload-hub.tsx:126-149`), the wizard shows 3 steps (`image-upload-wizard.tsx:546-550`). Cosmetic, but it opens the session with a credibility crack in a flow that later asks the user to trust AI suggestions. |

### Stage 2 — ENRICH: the AI is aimed at the wrong end of the form, behind an expertise gate

| # | Sev | Finding |
|---|---|---|
| E1 | **Blocker** | **AI never touches the fields it's best at — the per-shot spec fields.** Extraction produces only brick-scoped *extended* attributes (`route.ts:197-234`). Orientation (front/side/back), facing, angle, image style, and free-text `image_description` — all trivially inferable by a vision model, all per-image, one of them *required and submission-gating* — remain 100 % manual (`:313-361, 377-430`). The current shape has AI filling optional product-level data while humans hand-enter the very things the camera angle shows. Auto-drafting `image_description` alone would populate the field most retailers actually read, and per-image orientation suggestions would fix C3's wrong-data problem at the source. |
| E2 | **Major** | **GS1 expertise is the entry fee for AI.** The Extract button stays disabled until the user picks a category *and* a GPC brick from dropdowns (`:2844`); the auto-default heuristic recognizes 2 of 5 categories and falls back to "Shoes" for everything else — a cotton bath towel defaults to Shoes (`getDefaultCategory`, `:576-581`; `HOME001` fixture, `:148-153`). A wrong brick silently scopes extraction to a wrong vocabulary and produces confident garbage. The classification question is inverted: the system holds the strongest evidence (the images themselves) yet asks the human first. AI should *propose* brick + category from the images; the human confirms or corrects. |
| E3 | **Blocker** | **Pending suggestions are silently destroyed at submission.** Only rows explicitly clicked "Accept" survive (`acceptedExtractedAttributes` filters `decision === "accepted"`, `:792`); every acceptance is an individual click with no accept-all; and Step 3 shows *only* accepted rows (`:3206`) with **no warning that N suggestions are still pending**. A supplier who runs extraction, skims plausible results, and clicks Next → Confirm loses every suggestion without any signal that data existed and evaporated. This is the single most direct richness leak in the product: the data was already generated, reviewed-by-glance, and then discarded by default. |
| E4 | **Major** | **Completeness is invisible.** The unresolved-attributes list (the best richness affordance in the app, `:985-1017`) sits unlabeled at the bottom of the results card with no count, and nothing anywhere answers "how rich is this product's record?" — not in Step 2, not at Review, not post-submit, not per image. What isn't measured isn't managed: a simple "11 of 18 brick attributes captured · 6 of 13 image fields filled" meter would turn richness from an invisible virtue into a visible score suppliers close out. |
| E5 | **Major** | **Enrichment ends at submission.** Post-submit, the Sparkles toolbar button only *views* an existing extraction — or an empty table if none ran (`hasExtraction ? renderAiResultsCard() : <AiAttributesTable attributes={[]} />`, `:2227-2229`). There is no way to run or re-run AI on an already-uploaded product. Combined with E3, any richness missed in the one wizard pass is missed permanently. |

### Stage 3 — REVIEW: the last checkpoint can't see the gaps

| # | Sev | Finding |
|---|---|---|
| V1 | **Major** | **Step 3 reviews 4 of 13 fields.** In apply-to-all mode the summary shows Image Type, Purpose, Orientation, Location Type only (`:3139-3164`); per-image mode shows the same 4 columns (`:3168-3200`). None of the 8 optional fields appear, so blank-ness is invisible at the exact moment the supplier attests to the record. The review step confirms *files will upload*, not *data is complete* — it should do both (this is where E4's meter belongs, with a one-click path back to fill gaps). |
| V2 | Minor | The unreachable partial-failure/retry UI (`simulateSubmission` never fails, `:1419-1442` vs retry handling `:2240-2352`) means the review→submit path has no honest failure story yet — relevant to richness only insofar as per-file *attribute* validation errors will eventually need this surface. |

### Stage 4 — HANDOFF: where the richest data actually dies

| # | Sev | Finding |
|---|---|---|
| H1 | **Blocker** | **The metadata export omits the AI extended attributes entirely.** `generateMetadataContent` writes company info, file info, and the 13 base fields — and not one accepted GS1 extended attribute (`image-upload-wizard.tsx:1312-1389`), while the download modal promises the files "contain all image attributes including … GDSN attributes" (`:1216`). The retailer-side export is thinner still: 4 image fields (`image-upload-hub.tsx:960-976`). The highest-value, hardest-won data in the product — brick-scoped GS1 attributes with confidence scores — **never leaves the system in any export**. The pipeline's whole purpose fails at the last step, and the UI claims otherwise. |
| H2 | **Major** | **A per-image `.txt` file is a machine-hostile delivery format.** Retailers ingesting at scale feed PIM/DAM systems; freeform prose-labeled text files (`:1320-1387`) cannot round-trip. The spec's own 21-field CSV is the natural export: one CSV row per image (all selected images in one file), extended attributes as additional columns or a JSON sidecar. The same artifact then serves as the supplier's re-import template — closing the loop with the v1 audit's CSV-upload design. |
| H3 | Minor | Downloads are simulated with no failure path (`handleBulkDownload`, `:1392-1398`), and no toast layer exists to report real outcomes (`hooks/use-toast.ts` present; `<Toaster>` never mounted, `toast()` never called — grep-verified). |

### Stage 5 — RETAILER: the receiving end displays the poverty, and hides the wealth

*(Per stakeholder direction: no search/filter recommendations. These findings concern how received data is presented.)*

| # | Sev | Finding |
|---|---|---|
| R1 | **Blocker** | **The retailer's image card is a wall of blanks.** Each image renders 18 attribute rows of which **10 are hardcoded empty strings** — External Location, File Size, DPI, Height, Width, Image Style, Facing, Angle, Clipping Path, Image Description (`image-upload-hub.tsx:743-761`). This is simultaneously (a) the honest downstream portrait of findings C1/C2/C3 — the default supplier path really would produce this record — and (b) a presentation failure in its own right: a wall of empty labeled rows communicates "this vendor is negligent" while burying the 8 fields that *do* have values. Empty fields need either suppression with a summary line ("10 attributes not provided by supplier") or explicit treatment as gaps. |
| R2 | **Major** | **The richest data is hidden behind an unlabeled icon.** The AI extended attributes — the product's premium payload — are reachable only via a bare Sparkles icon-button with a `title` tooltip (`:683-685`), rendered in a drawer that is a static fixture unconnected to anything a supplier submitted (`MOCK_AI_ATTRIBUTES`, `:71-80`). Attributes with confidence scores and GS1 codes deserve first-class placement on the product-media page (and inclusion in the download, per H1) — not an easter egg. |
| R3 | **Major** | **An image browser with no images until level 4.** Vendor list → selection codes → product list are all text tables; the product list shows image *counts* but no thumbnails (`:604-651`). For a flow whose subject matter is pictures, the first pixel of product imagery appears four clicks deep. A thumbnail column (even one representative image) in the product list changes the retailer's experience more than any other single change on this side. |
| R4 | **Major** | **Trust-eroding dead chrome.** The Search panel is a header with no input (`:433-439`), the Filter bar has no controls (`:581-590`), the Catalogue/Grid selector has no handler (`:568-579`), pagination is permanently disabled (`:592-602`), Export buttons have no onClick (`:427,481,539`), and the product-list row checkbox is a raw decorative `<input>` (`:626`). Recommendation scope here is *honesty*, not features: wire them or remove them — a retailer who clicks three dead controls stops believing the data too. |
| R5 | Minor | Fabricated numbers undermine the data story: selection-code product counts computed as `14 + idx * 3` (`:520`), every product resolving to the same two mock images regardless of its stated count (`:66-69`), products listing `images: 0` while sibling data shows populated screens. In a prototype meant to sell "rich, trustworthy data," the fixtures should model consistency. |
| R6 | Minor | Read-only is the right call for retailers (ownership stays with the supplier — correctly enforced, no edit/delete in the retailer toolbar `:664-687`), but there is no provenance shown: no "last updated by APEX on…", no indication whether attributes were manual or AI-accepted. Provenance is cheap richness for the receiving side. |

### Cross-cutting

| # | Sev | Finding |
|---|---|---|
| X1 | Minor | Empty-selection-means-all is documented only in a code comment (`use-media-selection.ts:3-7`); the toolbar's "All N selected" label (`:1521-1526`, hub `:673-677`) mitigates it, but per-card checkboxes appearing pre-checked without user action still surprises. |
| X2 | Minor | Hand-rolled `fixed inset-0` modals for download/lightbox (no focus trap/Esc/`aria-modal`; hub `:792-988,991-1011`) while proper `Dialog`/`Sheet` primitives are used elsewhere in the same files; mouse-only `<span onClick>` breadcrumbs and clickable `<tr>`s; `title`-only icon buttons. Standard a11y debt — noted, not the focus of this audit. |

---

## 4. Recommendations — maximize data richness per supplier-minute

Ordered by (richness gained) ÷ (supplier effort added). The theme throughout: **the system should earn richness automatically and spend human attention only on confirmation and exceptions.**

### P0.1 — Auto-capture everything the file already knows · effort S · fixes C2, feeds H1
On staging, read pixel width/height (image decode), file size (already done), file type, and DPI where present; write them into the record as read-only "measured" values with a subtle "auto-captured" affordance. Manual override only via an explicit control. Immediately fills 3–4 of the 10 blank retailer rows for **every** image with perfect accuracy at zero cost. Also validate measured values against the spec here (500 KB/JPG — with C5's limits corrected first).

### P0.2 — Split shared vs per-shot attributes; let AI draft the per-shot set · effort M · fixes C3 + E1 (jointly the wrong-data problem)
Restructure the Step 2 form into two visible groups: **Product-wide** (image type, purpose, location, style — one entry, honestly shared) and **Per-shot** (orientation, facing, angle, description — always per image, never bulk-applied blindly). Then point the existing extraction pipeline at the per-shot group: one lightweight vision pass proposes orientation/facing/angle per image and drafts a one-line description; the supplier confirms via a thumbnail strip with suggestion chips (confirm-all when confident). This converts today's most error-prone manual work into a review task, and makes the *required* field (orientation) the *easiest* one. Note the current single-`aiExtraction` product-level state (`:495`) needs a per-image companion structure.

### P0.3 — Stop the silent suggestion loss · effort S · fixes E3, feeds E4/V1
Three small changes with outsized effect: (1) "Accept all above X % confidence" on the results card; (2) a pending-count interlock at Step 3 — "7 AI suggestions are still pending review — Review / Accept all / Discard" — so discarding becomes a decision, not a default; (3) persist pending (not just accepted) suggestions into the post-submit drawer so the review can finish later (pairs with P1.2).

### P0.4 — Make the vocabularies match the spec · effort XS–S · fixes C5
Correct `IMAGE_STYLE_OPTIONS` to CSW/PRO, `FACING_OPTIONS` to 1–9, reconcile the orientation list (add VIK/VIS, resolve VBK), enforce 500 KB/JPG in `upload-validation.ts` (and fix its stale copy at `:1970, 2630`), add filename rules. *One caveat worth a stakeholder question before shipping: confirm the 500 KB/JPG spec is current — it is unusually tight for modern e-commerce imagery, and enforcing an outdated limit 8× tighter than today would hurt suppliers.* |

### P0.5 — Deliver the rich data: spec-shaped CSV export including extended attributes · effort S–M · fixes H1, H2
Replace (or accompany) per-image `.txt` with **one CSV per download**: a row per image using the 21 spec columns, plus accepted extended attributes (columns or JSON sidecar) with GS1 codes and confidence. Ship it on both the supplier and retailer download modals, and make the modal copy true. This single change is the difference between "we captured rich data" and "retailers received rich data" — the stated purpose of the product.

### P1.1 — Invert classification: AI proposes, human confirms · effort M · fixes E2
Run a lightweight brick-classification pass on the staged images (a new endpoint distinct from `/api/extract-attributes`, which stays unchanged); present "Looks like **Sneakers · Shoes** — Confirm / Change" with a searchable plain-language brick picker for corrections. Remove category/brick dropdowns as a *precondition*; keep them as the correction path. Extend `getDefaultCategory`'s hints into the prompt rather than trusting them. (The v1 audit's group-confirmation waterfall covers the multi-product/CSV case; this is its single-product core, shippable first.)

### P1.2 — Post-submit "Run AI" + completeness meter · effort S–M · fixes E5, E4, V1
The Sparkles button becomes a trigger when no extraction exists ("Run AI" instead of an empty table); results reuse the existing editable drawer. Add the completeness meter ("X of Y spec fields · N of M brick attributes") to Step 2, Step 3, and each post-submit product card — the same meter later gives retailers a data-quality signal (R6).

### P1.3 — Remote-location parity · effort M–L · fixes C4
Per-file external locations (matching the spec's per-row `external_location`), and a server-side fetch of remote images at staging so FTP/URL suppliers get previews, auto-measured dimensions (P0.1), and AI enrichment (P0.2/P1.1) like everyone else. Until fetching exists, at minimum allow N location rows and stop the "0 uploaded images" state.

### P1.4 — Retailer presentation of received data · effort S–M · fixes R1, R2, R3, R6
No filters, per direction — presentation only: (1) suppress empty attribute rows behind "10 attributes not provided by supplier," keeping filled fields prominent; (2) promote extended attributes from the unlabeled icon to a visible labeled section/tab on product media, sourced from (or clearly marked as demo standing in for) supplier submissions; (3) thumbnail column in the product list; (4) provenance line per image (updated date already exists; add source vendor + manual/AI origin). Also either wire or remove the dead chrome (R4) — honesty is a data-trust feature.

### P2 — Structural & platform
- **CSV bulk upload** for multi-product runs (adopt the v1 audit's design; C6). Every per-image improvement above compounds with it — and P0.5's export doubles as its template.
- Toast layer mounted and used for upload/download outcomes (H3, X1 feedback generally).
- Reachable failure/retry states with real per-file errors (V2).
- Dialog-primitive modals, keyboard paths, `aria-label`s (X2).
- Fixture consistency in the retailer mock (R5).

---

## 5. Priority summary

| Priority | Change | Effort | Richness mechanism |
|---|---|---|---|
| P0.1 | Auto-capture dimensions/size/type/DPI at staging | S | free, accurate data on 100 % of images |
| P0.2 | Shared vs per-shot split + AI drafts per-shot fields | M | kills wrong-data default; AI fills required fields |
| P0.3 | Accept-all + pending-loss interlock + persist pending | S | stops discarding already-generated data |
| P0.4 | Spec-true vocabularies & limits (verify 500 KB/JPG first) | XS–S | captured data survives downstream validation |
| P0.5 | CSV export incl. extended attributes, both portals | S–M | rich data actually reaches the retailer |
| P1.1 | AI-proposed brick, human-confirmed | M | removes GS1 expertise gate on enrichment |
| P1.2 | Post-submit Run AI + completeness meter | S–M | richness visible, improvable after upload |
| P1.3 | Remote-location parity (per-file, fetch, enrich) | M–L | closes the FTP/URL dead zone |
| P1.4 | Retailer: suppress blanks, promote AI attrs, thumbnails, provenance | S–M | received richness is seen and trusted |
| P2 | CSV bulk upload · toasts · real failure states · a11y · fixtures | M–L | scale multiplier + platform quality |

**The one-sentence takeaway:** the product currently treats rich data as something suppliers *may volunteer*; every P0 above re-frames it as something the system *harvests automatically and asks humans only to confirm* — and then actually delivers it to the retailer, which today it does not (H1).
