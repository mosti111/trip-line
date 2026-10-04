# TL-002 reconstruction evidence

3–4 October 2026, Europe/Istanbul. Reconstruction baseline `b1a0bcc`, final
planner/hydration fix `13b5afe`, on `feat/v3-bronze-journey`.
Node 24.19.0, pnpm 11.25.0, Next 16.3.6.
Local production Chromium at port 3023; no deployment or publication.

Stopped on 4 October at the user's request. Final V3 verification is **not passed**.
The latest failed standalone attempt used `http://127.0.0.1:3033` and encountered
an unknown-route redirect loop. Earlier final-source attempts encountered transient
asset failures. See the task report; these are not successful verification results.

## Reproduction

From `frontend-v2/`:

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start --port 3023
```

Then in a separate terminal:

```powershell
$env:QA_URL='http://localhost:3023'
node scripts/verify-v3-resilience.mjs
node scripts/verify-reconstruction-media.mjs
node scripts/verify-public.mjs
node scripts/verify-v3.mjs
node scripts/verify-reconstruction.mjs
node scripts/verify-planner-throttled.mjs
$env:QA_STAGE='after'
node scripts/capture-reconstruction.mjs
```

Run resilience in isolation: it measures idle rendering and live scene teardown.
An earlier concurrent run timed out awaiting preference teardown; isolated final
verification passed all three locales. Next emits a standalone packaging warning
for `next start`; this procedure is a local preview, not a hosting recipe.

## Results

Typecheck, lint, three Vitest tests and production build passed. The unit suite
covers source-validated ordered journey data, bounded input and localized messages.
It is not a comprehensive application unit suite.

Public, resilience, media and six-size reconstruction results below are
from `b1a0bcc`. V3, final after captures and the throttled planner regression target `13b5afe`; typecheck,
lint, unit tests and build also passed on the final application source. The final
fix prevents a 40px mobile layout shift during motion-preference hydration. A
pointer trace reproduced the lost click before the fix; all nine throttled cases
passed afterward. Settled normal-motion screenshots remain visually applicable.

- `public-verification.json`: localized routes, public interactions and screenshots.
- `v3-verification.json`: latest **failed/partial** standalone V3 run, retained
  for diagnosis; it does not establish complete V3 coverage or a passing suite.
- `reconstruction-verification.json`: all seven main homepage chapters across
  360×800, 390×844, 430×932, 768×1024, 1280×900 and 1440×1000 in EN/TR/AR,
  plus reduced-motion checks for each locale.
- `resilience.json`: actual WebGL context loss/recovery, unavailable WebGL,
  undecodable film, live preferences and route cleanup. Deliberate WebGL errors
  are separated from unexpected errors. Idle/hidden/offscreen draw deltas were zero.
- `media.json`: visibly decoded hero film, staged opening and delayed destination
  image continuity with only two photos mounted.
- `captures.json`: matched final screenshot names and local preview origin.
- `planner-throttled.json`: nine fresh-navigation cases at 4× CPU throttling,
  checking selection, deselection and ordered state in EN/AR/TR.

## Visual evidence

Ignored `tmp/v3-reconstruction/before` contains the V2 `cc374eb` captures made
before reconstruction. `after` contains final `13b5afe` captures. Each includes
hero, services, Türkiye, planning and arrival at 1440×1000 and 390×844.
`tmp/v3-reconstruction/COMPARISON.md` links the pairs on the authoring machine.
The V2 planning view is its process explanation, not a working planner. The
desktop explorer's selected place can differ because the reconstruction responds
to guided scrolling; both captures show the same discovery chapter.

`phases` records intermediate phone/desktop composition checks. `qa` includes
EN/TR/AR chapter captures at 390, 768 and 1440, selected planner summaries,
reduced-motion services and the staged opening. The matching report documents
the [chapter acceptance evaluation](../../reports/TL-002-report.md#visual-verification).

## Limits

Chromium emulation is not physical-device, Safari/Firefox or assistive-technology
certification. Local CPU-throttled timing is observational, not a field score.
No temporary PNGs, dependencies, build output or secrets are committed.
The earlier [TL-001 evidence](../2026-10-03-v3/README.md) remains a separate
historical baseline and is not used as proof of this reconstruction.
