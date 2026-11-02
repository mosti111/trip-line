# Motion V4 hero evidence — 23 October 2026

**PARTIAL: acceptance fails P1 desktop entrance timing.** Regression suites pass; raw desktop animation cancel/restarts violate the requested 1.3–1.6s completion. Mobile observed 1502ms; desktop EN 2973ms / AR 3549ms from first start to entry done. Two correction cycles exhausted; checkpoint only, no next milestone.

Build `hI7nYfD8fZMLt9uxc68g_`, branch `codex/motion-v4-hero`, base `e0d5538`. Chromium 153.0.8010.12 desktop/touch emulation. Raw regenerable/failure history remains in ignored `tmp/frontend-qa/v4-hero/`. These selected copies are durable and hashed.

- [Root report](../../reports/TL-004-motion-v4-hero.md), [worker report](../../reports/TL-004-motion-v4-worker.md).
- [Checks and full public/V3 metadata](checks.json), [V4 report](v4-report.json), [manifest/frozen source](manifest.json), [Root rendered verdict](root-review.json).
- [Cold timing events and states](cold-timing.json), [six masked/unclipped pixel comparisons](mask-clearance.json).
- Before: [desktop](before-desktop.png), [mobile](before-mobile.png), [observations](before-observations.json).
- After: [1920×1080](en-1920x1080-normal-opening.png), [1440×900](en-1440x900-normal-opening.png), [390×844](en-390x844-normal-opening.png), [844×390 landscape](en-844x390-normal-opening.png).
- Arabic: [desktop](ar-1440x900-normal-opening.png), [mobile](ar-390x844-normal-opening.png), [reduced motion](ar-1440x900-reduced-opening.png). [Turkish mobile](tr-390x844-normal-opening.png), [English reduced motion](en-390x844-reduced-opening.png).
- [Early entrance](desktop-load-start.png), [service boundary](en-1440x900-normal-service-handoff.png), [reverse restoration](en-1440x900-normal-reverse.png).
- Recordings: [desktop load](desktop-load-1440x900.webm), [English slow forward/reverse](en-1440x900-normal.webm), [Arabic forward/reverse](ar-1440x900-normal.webm), [mobile](en-390x844-normal.webm).

The V4 suite verifies played/final states and does not enforce the uninterrupted duration; its PASS is separate from the timing FAIL. Physical devices, Safari/Firefox and field performance were not verified. Root model identity is unverified; no selected-Astra or user creative approval is asserted.
