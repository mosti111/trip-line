# V1.1 mobile review evidence

[Delivery report](../../reports/TL-011-v11-mobile-recovery.md) ·
[Physical iPhone checklist](IPHONE_CHECKLIST.md) · [File hashes](manifest.json).

The local release build is `YcMLV8XQrru17yorEl3yd`. User creative acceptance is
pending. WebKit is a browser-engine check, not native iPhone Safari certification.

## Before / after phones

| Language | Comparison | Current hero |
| --- | --- | --- |
| EN | [V1 → V1.1](screenshots/en-before-after.png) | [390px](screenshots/en-after-hero.png) |
| TR | [V1 → V1.1](screenshots/tr-before-after.png) | [390px](screenshots/tr-after-hero.png) |
| AR | [V1 → V1.1](screenshots/ar-before-after.png) | [390px](screenshots/ar-after-hero.png) |

[Scene overview](screenshots/scene-overview.png) ·
[Continuous scroll overview](screenshots/en-scroll-overview.png) ·
[Decoded recording frames](screenshots/recording-review.png).

## Actual browser recordings

Continuous browser touch input reaches the footer in all three languages; videos
are decoded and sampled for visual review. The final isolated release runs record
zero LongTasks in EN/TR/AR. This does not certify field FPS or physical devices.

- EN: [complete touch scroll](recordings/en-complete-touch.webm), [menu/map/billboard/planner interactions](recordings/en-touch-interactions.webm).
- TR: [complete touch scroll](recordings/tr-complete-touch.webm), [menu/map/billboard/planner interactions](recordings/tr-touch-interactions.webm).
- AR: [complete touch scroll](recordings/ar-complete-touch.webm), [menu/map/billboard/planner interactions](recordings/ar-touch-interactions.webm).

[Full Motion with system Reduce Motion enabled](recordings/full-override-touch.webm).

## Complete decoded pages

These are reduced-motion full-page captures so offscreen scroll masks do not hide
photographs in a long still. Normal-motion transformations are shown in the scene
captures and actual recordings above. Each viewport change waits for image decode.

| Locale | 320 | 360 | 375 | 390 | 430 | 768 | 667 landscape | 844 landscape |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EN | [PNG](full-pages/en-home-320x740-reduced.png) | [PNG](full-pages/en-home-360x800-reduced.png) | [PNG](full-pages/en-home-375x812-reduced.png) | [PNG](full-pages/en-home-390x844-reduced.png) | [PNG](full-pages/en-home-430x932-reduced.png) | [PNG](full-pages/en-home-768x1024-reduced.png) | [PNG](full-pages/en-home-667x375-reduced.png) | [PNG](full-pages/en-home-844x390-reduced.png) |
| TR | [PNG](full-pages/tr-home-320x740-reduced.png) | [PNG](full-pages/tr-home-360x800-reduced.png) | [PNG](full-pages/tr-home-375x812-reduced.png) | [PNG](full-pages/tr-home-390x844-reduced.png) | [PNG](full-pages/tr-home-430x932-reduced.png) | [PNG](full-pages/tr-home-768x1024-reduced.png) | [PNG](full-pages/tr-home-667x375-reduced.png) | [PNG](full-pages/tr-home-844x390-reduced.png) |
| AR | [PNG](full-pages/ar-home-320x740-reduced.png) | [PNG](full-pages/ar-home-360x800-reduced.png) | [PNG](full-pages/ar-home-375x812-reduced.png) | [PNG](full-pages/ar-home-390x844-reduced.png) | [PNG](full-pages/ar-home-430x932-reduced.png) | [PNG](full-pages/ar-home-768x1024-reduced.png) | [PNG](full-pages/ar-home-667x375-reduced.png) | [PNG](full-pages/ar-home-844x390-reduced.png) |

## Technical evidence

[984-case broad matrix](technical/matrix.json), [final96 affected cases](technical/affected.json),
[WebKit48](technical/webkit.json), [24 map configurations /288 taps](technical/map.json),
[24 menu configurations](technical/menu.json), [120 public routes](technical/public.json),
[full V3](technical/v3.json), [accessibility](technical/accessibility.json),
[Atlas resilience](technical/atlas.json), [motion modes/effects](technical/motion.json),
[continuous touch](technical/touch.json), [desktop comparison](technical/desktop-comparison.json).

Core logs: [typecheck](technical/typecheck-reviewed.log), [lint](technical/lint-reviewed.log),
[41 tests](technical/tests-reviewed.log), [build](technical/build-reviewed.log).

The broad matrix and initial desktop comparison precede the final bounded Atlas
control corrections. The frozen release repeats all affected Home/Explorer modes,
map/menu interaction, public routing, full V3 and WebKit checks. Earlier failures
and capture-tool problems are retained under initial-findings; they are not passes.

No production promotion, main merge or billing change. The existing two-day public
review window and its expiry remain intact. Preview/source receipts are in [hosted/receipt.json](hosted/receipt.json). The client
share credential is deliberately kept out of Git. The protected deployment's bare
URL may request login; use the complete client share URL from the final delivery.

## Hosted verification and visual caveat

[Source archive proof](hosted/remote-source-verification.json),
[project/production preservation](hosted/project-verification.json),
[fresh no-login access](hosted/access.json), [33 hosted pages/media](hosted/pages.json),
[48 hosted mobile cases and interactions](hosted/mobile.json),
[hosted desktop zero-pixel comparison](hosted/desktop-comparison.json).

Windows WebKit paints the variable fonts too thin even though computed heading
weight is800 and the Manrope face is loaded. Explicit wght800 did not correct
this port's rendering. This is consistent with the upstream
[Windows WebKit variable-font issue](https://github.com/microsoft/playwright/issues/43004).
It is an observed tooling/visual-verification limitation, not a native Safari pass.
Chromium reference screenshots show the intended typography. Physical iPhone
verification must compare that reference before creative approval.
