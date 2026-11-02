# V3 Bronze Journey — TL-001 evidence

3 October 2026, Europe/Istanbul. Local production Chromium, Node 24.19.0,
Next 16.3.6. Verified implementation/QA revision: `b03c2a7`.
This baseline is separate from the historical V2 evidence in `../2026-10-02/`.

## Reproduction

From `frontend-v2/`, build and start `pnpm start --port 3013`. Set
`$env:QA_URL='http://localhost:3013'` in PowerShell and run:

```text
node scripts/verify-public.mjs
node scripts/verify-v3.mjs
node scripts/verify-v3-resilience.mjs
```

The Next standalone packaging warning applies to this local preview procedure;
these files do not establish a deployment. See [delivery](../../V3_FRONTEND_DELIVERY.md)
for exact coverage, command results and limitations, including the missing Vitest suite.

## Durable results

- [Public route/interaction results](public-verification.json): 120 routes and six
  public screenshots, plus validation, media, language, menu and preference checks.
- [V3 matrix](v3-verification.json): 60 recorded page/viewport cases plus ordered
  inquiry, history, keyboard, short-height, touch, no-JS and fallback checks.
- [Resilience](resilience.json): expected WebGL failure logs separated from unexpected
  errors; actual context recovery, invalid video and draw-call observations.

Selected PNGs retain their original pixel size (phone hero images are top-of-page
crops from full-page evidence). No color treatment or compositional retouching:

- `hero-en-1440.png`, `hero-ar-390.png`, `hero-tr-360.png`: opening composition.
- `departure-refined.png`: sequential departure copy above the bronze route.
- `worlds-desktop.png`, `atlas-desktop.png`, `planner-desktop.png`: chapter layouts.
- `services-keyboard-ar.png`: final service link reached with keyboard in Arabic.
- `menu-arabic-mobile.png`, `inquiry-ar-mobile.png`: RTL controls.
- `webgl-restored.png`, `video-fallback-mobile.png`, `no-js-home.png`: recovery/static modes.

Full screenshots and intermediate diagnostics remain under ignored
`tmp/frontend-qa/`. The restored-context screenshot waits for the SVG-to-canvas
crossfade to finish; metallic reflections were also inspected visually. Artificial
failure tests are labeled as such; there were no real external inquiry sends.

These are Chromium/emulation results, not Safari/Firefox/physical-device coverage,
a full accessibility certification, field performance or client aesthetic sign-off.
