# TL-009 — V1 mobile review release

25 October2026. [Direct scope and deployment steering](../tasks/TL-009-v1-mobile-review.md).
Work branch `codex/trip-line-v1-mobile-review`; clean verified V6.1 base `3442a6b`
remains on `codex/v61-before-v1-mobile`. One current implementation agent; no
subagents or runtime model-switch claim. No V7 or desktop reconstruction.

## What changed

Phone-specific hierarchy and spacing, stable documentary hero crop, full-width
arrival actions, flowing Service Worlds and signature captions, a landscape crop
above the Explorer caption, readable copy, simpler phone masks, touch-size index
and footer targets, and 16px/52px planner controls. About's 320px min-content
overflow and service-page Cappadocia/Kapadokya overflow were corrected from actual
rendered evidence. Explorer's phone entrance now keeps captions/controls whole;
desktop retains its angled reveal. The floating planner stops covering the final
invitation. Tablet Service Worlds and Explorer spacing are separately composed.

Meaningful normal motion remains: flight route, photographic reveals, responsive
selection, native scrolling, measured moving billboard, and ordered planner
transitions. Existing reduced-motion/SaveData/manual static behavior and scoped
cleanup remain. No dependencies, content claims, source images, original logos,
routes, geography, locale persistence or inquiry contracts were replaced.

## Verification and evidence

Final results are recorded alongside the [evidence gallery](../qa/2026-10-25-v1-mobile/index.html),
[full-site matrix](../qa/2026-10-25-v1-mobile/full-site-matrix.json),
[final Atlas matrix](../qa/2026-10-25-v1-mobile/final-atlas-matrix.json),
[source freeze](../qa/2026-10-25-v1-mobile/source-freeze.json) and
[hashed manifest](../qa/2026-10-25-v1-mobile/manifest.json).
Core: typecheck, lint, 32 tests and production build PASS. Final build
`ju1ZWK5Ost95uS9acXdQG`.
Full-site sizes:320×740,360×800,390×844,430×932,768×1024,667×375,844×390;
all40 public paths ×3 locales ×7 sizes, plus homepage reduced-motion cases.
After the final caption-only animation adjustment, the complete affected
home/Explorer matrix in both motion modes, full public/V3 regression, axe and native
touch review were repeated against the final build. Individual viewport screenshots and native
video-decoder samples are used because offscreen reveal states can appear blank
in a single long screenshot. Initial failures are preserved under `corrections/`.

The full-site matrix passed861 cases with zero findings/browser errors against
build `voncCTLZpZ7demS2AuEJE`. This covers840 full-route normal-motion cases and21
homepage reduced-motion cases. The only subsequent application change is the
Explorer's caption-safe phone entrance; its final84-case home/hub matrix passes
both motion modes against build `ju1ZWK5Ost95uS9acXdQG`, including actual12-place
selections, map touch, billboard movement/pause, menu, planner reorder and inquiry
handoff in all3 locales. Independent390→768→390 check confirms the old clip is
removed and stays absent after rotation.

Three complete native-touch recordings on the final build reach the real document
bottom: EN60.12s, TR60.60s, AR80.24s. Each records zero LongTasks in the exercised
video/screenshot run. These timings are observed test conditions, not a field
performance guarantee. Final axe4.14 reports zero violations on9 surfaces. Final
public regression passes120 routes and6 captures; V3 passes16 groups/60 captures.
Six Atlas resilience configurations plus failed-image retention/latest-wins pass.
Twenty-one locale/size menu cases pass, including reachable bottom navigation,
Escape/focus return, body-scroll restoration and logo bounds at both landscape
sizes. Final normal/reduced phone screenshots, complete native touch videos and
sampled original video frames were inspected. No blocker remains in the exercised
scope. Assets/content/libraries match the V6.1 baseline unchanged.

## Preview safeguards and provenance

Verified Vercel identity: `mostafaabdelwahab651-3920`, team
`team_l5N8qo6rdkw7ABXTnNIOx51K`, existing project
`prj_Z7d8Fd2lrA4DEAAZz1B7ZBIR0R8O` / `trip-line-journal-v223`.
Future build root corrected from `.` to `frontend-v2`; Next.js, Node24,
`pnpm build`, frozen-lockfile install and existing `TRIPLINE_DEMO=true` configuration
verified. No secret/local environment file belongs in the upload. The project had
no Git connection at inspection. Preserve authentication protection and create
only a new preview; never promote or replace production aliases.

Preserved production target: `dpl_DLu3qxDJHA9d6xjBev5HqVvz7yNt`;
`trip-line-journal-v2.vercel.app` and
`trip-line-journal-v2-mostafaabdelwahab651-3920s-projects.vercel.app`.
Push only the reviewed branch. Deployment must use that exact committed Git source
or a verified immutable export, with matching SHA and source hashes. Hosted
authentication, locale/media/mobile/inquiry checks and the resulting URL/SHA belong
in the post-commit local deployment receipt and the final delivery message.

The user explicitly chose Hobby for this temporary client review after disclosure.
Vercel's [commercial-use restriction](https://vercel.com/docs/limits/fair-use-guidelines)
still requires Pro/Enterprise for commercial use; temporary duration does not
establish eligibility. No upgrade or billing change was made.

## Limits

Chromium touch emulation is actual browser rendering/input, not a physical phone.
WebKit installation succeeded but
launch failed for missing Windows `brotlicommon.dll`, `jpeg62.dll`, `jxl.dll`;
no Safari pass is claimed. No physical iOS/Android device was tested. Recorded
performance is not field FPS certification.
Profile-derived partner marks retain their source-resolution limits and pending
client relationship/publication approval. Institutions remain separate, with no
endorsement claim. Noindex/nofollow, legal-review text, and prepared WhatsApp/email
inquiry remain. Client creative acceptance and final publication remain pending.
