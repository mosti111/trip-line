# Orchestration workflow evidence — 4 October 2026

Scope: TL-SYS-002 setup validation, not TL-002 aesthetic approval or completion of
its remaining QA. Application revision `13b5afecde31cb0078c7980da2055a3b3edbaba8`;
documentation-only working changes. Node v24.19.0, pnpm 11.25.0, local production
Chromium at `http://localhost:3033`. No deployment or external inquiry sent.

During later review, an independent TL-002 documentation commit advanced HEAD to
`0ba5a97254e08d8d621dba4add4045604df5aa7a`. Its application trees are identical to
the tested revision (`git diff` for frontend-v2/frontend/backend exited 0).
The earlier [safety comparison](safety-check.json) records the initial 18-file
baseline; later independent documentation edits were preserved. The
[final comparison](final-safety-check.json) records additive setup diffs against
the new HEAD.

## Checks actually run

From `frontend-v2`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all
exit 0. Vitest: one file, three tests. `pnpm start --port 3033` served the build;
Next warns that standalone output should use its generated server for deployment.
This existing local preview path worked; it is not deployment validation.

With PowerShell `$env:QA_URL='http://localhost:3033'`,
`node scripts/verify-public.mjs` exited 0: 120 content routes, branded 404,
browser-language redirect, inquiry preparation, atlas, video/WebGL, persisted
language/RTL, keyboard menu and reduced-motion checks. Six existing-script
screenshots were generated locally. [Machine report](public-check.json).
Prior ignored public outputs were backed up and restored; this run's raw images
are under ignored `tmp/orchestration-setup/public-output/`.

## Rendered evidence

[Capture metadata](capture.json) records nine actual viewport screenshots:

| Surface | Viewport | Locale/input/mode | Evidence |
| --- | --- | --- | --- |
| Desktop opening | 1440×1000 | EN, fine, normal | [initial](desktop-0.png), [25%](desktop-25.png), [50%](desktop-50.png), [75%](desktop-75.png), [exit](desktop-100.png) |
| Laptop | 1280×800 | TR, fine, normal | [initial](laptop-0.png) |
| Tablet | 768×1024 | EN, emulated touch | [initial](tablet-0.png) |
| Mobile | 390×844 | AR RTL, emulated touch | [initial](mobile-rtl-0.png) |
| Reduced motion | 1440×1000 | EN, fine, reduced | [initial](reduced-0.png) |

The desktop series samples the current opening's 130vh scroll range at settled
states; it is not a timing/frame-rate recording. Capture asserts visible heading,
locale direction and no horizontal overflow; reduced mode additionally asserts
no pin or ribbon canvas. No page errors occurred. Astra's actual review is in
the [pilot review](../../reports/TL-SYS-002-pilot-review.md).

Reproduce from repository root with a production preview running:
`node docs/qa/2026-10-04-orchestration/capture.cjs` (optional `QA_URL`).
This dated evidence generator is pinned to the recorded revision and selectors;
for a different revision, update provenance and save evidence under a new date/task.

## Limits

No frontend change was made. The full V3/resilience/reconstruction suites were
not rerun for this documentation setup. No Safari/Firefox, physical devices,
continuous motion pacing, field performance or launch readiness is certified.
These images prove a usable capture/review path, not approval of the whole site.
