# V1 mobile review evidence — TL-009

[Delivery report](../../reports/TL-009-v1-mobile-review.md) ·
[Local gallery](index.html) · [Manifest](manifest.json) · [Source freeze](source-freeze.json).

`full-site-matrix.json`:861 cases on the completed mobile CSS build
`voncCTLZpZ7demS2AuEJE`, all40 public paths / EN/TR/AR / seven sizes and21 reduced
homepage cases. After the final Explorer-only caption-safe entrance adjustment,
`final-atlas-matrix.json` repeats84 home/hub cases on final build
`ju1ZWK5Ost95uS9acXdQG`, with both motion modes and touch interactions.
`public.json`, `v3.json`, `accessibility.json` and `atlas-resilience.json` record the
final-build regression, nine-surface accessibility and image-failure/latest-wins
coverage. `menus.json` covers21 locale/size cases, including short landscape,
reachable last link and restored focus/body scroll. `touch-review.json` records three complete final native-touch scrolls,
their actual duration/end positions and observed LongTasks. No physical-device or
Safari pass is claimed.

`screens/`: selected final390px phone views, plus complete320px reduced-motion
pages with offscreen animation hiding disabled by the actual user preference.
`recordings/`: original native scroll and touch interaction videos, without
retiming. `recording-samples/`: browser-decoded timestamps from those originals.
Full normal-motion screenshots can contain pending offscreen reveal states; raw
sequential viewport captures and native recordings were inspected as well.
Raw861-case screenshots and broader60-capture V3 output remain in ignored
`tmp/frontend-qa/v1-mobile/`, with scoped output folders named in the reports.

`corrections/`: preserved first service-title overflow findings and About before/
after evidence. The earlier About viewport expansion escaped the initial
document-vs-innerWidth check; final checks also assert the requested physical
viewport width. No passing claim is attached to the failed run.

Hosted post-commit evidence is saved locally under
`tmp/frontend-qa/v1-mobile/hosted/` and the deployment receipt in
`tmp/v1-preview-deployment-receipt.json`. Its commit binding is verified after
deployment; writing that receipt into its own source commit would change its SHA.
The final chat delivery supplies the actual protected share URL and final SHA.
Production aliases, noindex, legal-review defaults and publication restrictions
remain. Partner marks in these files are private review material.
