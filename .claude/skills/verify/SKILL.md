# Verify skill — v0-image-upload-enhancement

## Build & run

```bash
pnpm install          # node_modules isn't committed
pnpm exec tsc --noEmit   # optional sanity check, not a substitute for driving the app
(nohup pnpm dev > /tmp/dev.log 2>&1 &) ; sleep 4
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000   # should be 200
```

Stop with `pkill -f "next dev"` when done. Revert build artifacts the dev/build commands
touch but that aren't part of your change: `git checkout -- next-env.d.ts tsconfig.tsbuildinfo`.

## Driving it (Playwright)

Chromium is pre-installed but not on the default Node resolution path — require it directly:

```js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
```

Write scripts as `.cjs` (plain `require`, no ESM import juggling) to a scratch dir and run with
plain `node script.cjs`.

### Reaching the AI section (the part with Gemini calls)

The app is a 3-step wizard (`components/trading-grid/image-upload-wizard.tsx`) reached from the
Image Upload landing page:

1. `page.goto('http://localhost:3000')`
2. Click **"Start Upload"** (first Product-Level card) → lands on "Select Target & Upload Files"
   (this is *internal* `currentStep === 1`, labeled "Step 2 of 4" in the UI).
3. Click the **"ACL"** location-type card to reveal the file input.
4. `page.locator('input[type=file]').first().setInputFiles([...])` — sample images already in
   the repo at `public/mock/sneaker-front.jpg` and `public/mock/sneaker-side.jpg` (two angles of
   the same product — good for a "consistent" case; you'll need to supply your own second image
   for a genuine mismatch case, since the repo doesn't ship one).
5. Click **"Next"** (use `{ name: 'Next', exact: true }` — Next.js dev-tools injects its own
   "Open Next.js Dev Tools" button that also matches a loose `/Next/` name).
6. Now on `currentStep === 2` ("Step 3 of 4: Set image attributes") — this is where
   `<AiSection>` renders. The "Classify & extract with AI" button triggers
   `POST /api/suggest-brick`.

### No GEMINI_API_KEY in this environment

There's no live Gemini key configured here, so real classification calls 500 with
`"GEMINI_API_KEY is not configured on the server."` — that's real, correct behavior to verify
(the fail-loud error card), not a blocker. To exercise logic that depends on a *successful*
Gemini response (e.g. the classification result shape, confidence chip, the
consistent/inconsistent branch), intercept the route at the network layer and fulfill a
synthetic JSON body:

```js
await page.route('**/api/suggest-brick', async (route) => {
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    category: 'Shoes', brickCode: '10001077', brickName: 'Shoes - General Purpose',
    confidence: 0.93, consistent: true,
  }) });
});
```
Use a **real** brick code from `lib/gs1/generated-bricks.ts` (`CATEGORY_BRICKS`) — the client
calls `getBrick(category, brickCode)` and throws "Unknown brick returned." on a made-up code.

This is browser-driven, real-app verification of the client's handling of the response contract
— it is not a substitute for testing the actual Gemini prompt/response quality, which requires a
real `GEMINI_API_KEY` and cannot be verified in this environment. Call that out explicitly in any
report that relies on mocking this route.

### Other useful selectors
- `page.getByRole('button', { name: /Classify.*extract/i })` — the classify trigger.
- `page.getByRole('button', { name: 'Upload a new set' })` — inconsistent-images warning's
  reupload action (only rendered when `onRequestReupload` is passed to `<AiSection>`).
- Thumbnails in the inconsistent-images warning are plain `<button title="filename.jpg">`.
