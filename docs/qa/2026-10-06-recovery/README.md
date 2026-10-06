# TL-003 static homepage recovery evidence — 5–6 October 2026

Current gate: H02 including R1 and QH02 APPROVED by selected Astra on6October2026.
This is the phase2 static homepage checkpoint, not final recovery/motion acceptance.
Application revision is a4a448b plus the exact nine H02 files, including bounded R1;
[source fingerprint](h02-source-fingerprint.json) identifies frozen file bytes.
Branch feat/v3-ux-motion-recovery. No main merge, deployment or user creative approval.

## Review and production checks

Selected Sol implemented H02/R1. Selected Astra /root/astra_resume independently
reviewed source and actual browser screenshots; root independently executed checks
and captured production3043. Requested explicit routing is supported tool evidence,
not backend model attestation. Lead did not author application implementation.

Root R1 pnpm typecheck, lint, test (32 tests/two files), build and diff check PASS.
Production preview warned that standalone output normally uses its standalone
server entrypoint; the local preview responded and was tested, not deployed.
Full logs remain ignored under tmp/v3-ux-motion-recovery/static-review/r1-*.

Final Chromium production captures cover EN/AR/TR1440×1000 and390×844, fine desktop
and emulated touch mobile, ordinary motion preference with static native content.
All15ordered chapters, oneH1, no horizontal overflow, no broken loaded image or page
error passed. Fonts and lazy media were loaded before capture. The helper waits150ms
after positioned scroll; the earlier un-settled builder sticky overlay was capture
timing, not an app defect. [Six-case metrics](h02-final-capture-review.json).

Firstsix Türkiye chapters account for approximately59% desktop and55–56% mobile
at primary widths. Worker additional360/430 cases record EN36054.28%, TR36054.54%,
AR36055.59%; small narrow-text reflow variance is accepted against the approximate
55–65% intent without adding blank spacers. Primary1440/390 remains inside range.

Root [figure bounds](h02-final-figure-bounds.json) PASS all12 EN/AR/TR360/390/430/1440
cases, measuring text Range against actual content gutter. Hero bounds PASS9 mobile
cases360/390/430. Root separate planner PASS3locales covers corporate intent,
orderedstops, keyboard reorder/removal focus, flexible-date clearing/serialization,
traveler handoff and session-only IDs/type. NoJS PASS3locales15H2/12index/9services/form.
Raw detailed helpers/reports remain ignored in the same static-review directory.

## Actual rendered evidence

- [English arrival1440](h02-final-arrival-en-1440.png) — clear company proposition,
  primary Türkiye and secondary planning, Istanbul image and bronze identity.
- [English intent worlds1440](h02-final-worlds-en-1440.png) — three simultaneous,
  unequal spatial planes; stronger motion is intentionally deferred until phase3.
- [Arabic explorer1440](h02-final-explorer-ar-1440.png) — index/map/preview hierarchy,
  connected Arabic and natural LTR geographic orientation.
- [Arabic builder390](h02-final-builder-ar-390.png) — visible ordered planning steps,
  readable controls and no overlapping sticky action while planner is in view.
- [English services390](h02-final-services-en-390.png) — corrected vertical bronze
  route/node progression, readable service links and compact mobile pacing.
- [Arabic figures390](h02-final-figures-ar-390.png) — corrected gutters, unequal type
  hierarchy and explicit Company Profile2025 source attribution.
- [Turkish arrival390](h02-final-arrival-tr-390.png) — complete long headline and
  both calls to action fit;360/430 text bounds also passed.

Lead additionally inspected actual English1440/Arabic390 quiet story, proof,
process, Beyond, FAQ and final arrival crops in ignored lead-production; Turkish
worlds/explorer and selected hero/signature/film/directory states were inspected
across worker/root/lead captures. These judgments concern static composition only.

## Corrections and historical failures

Pre-R1 [services](h02-before-services-en-390.png) lacked the required bronze connector.
Pre-R1 [Arabic figures](h02-before-figures-ar-390.png) intruded into22px gutters,
although measured text remained within viewport. Both are resolved in final images.
Beyond now uses count-free localized copy appropriate to nine secondary countries,
rather than reusing the ten-country total-directory description.

The actual old default verify-public run failed its .ribbon-ready canvas assertion
after120routes/lang/H1/404/redirect passed: [historical output](h02-legacy-public-failure.txt).
That default full-mode failure is not renamed a PASS. Separately contracted QH02
adds an explicit QA_STAGE=static adapter to verify-public/verify-v3 while preserving
default motion assertions verbatim. The static stage positively requires no canvas
or pin and tests relocated film/planning/navigation/fallback behavior. Its final
execution and independent repeat results are recorded below.

Root independently ran the final frozen-source public static entrypoint on6October
14:23UTC: PASS,120routes,7groups,11cases/11screens,zero unexpected errors. The
[authoritative public report](qh02-root-public-static.json) retains199 narrowly
classified expected browser cancellations. All three syntax checks and final lint
also pass. Helper SHA2562600a4f91f733368c492eca3c2878a3646b0aa6d09c7e741e812f93768329857.
Root independently ran the final-source V3 static entrypoint: PASS,8groups,23cases,
17screens,zero unexpected errors and441 retained expected cancellations. The
[authoritative V3 report](qh02-root-v3-static.json) records exact modes/results.
Prior worker overall watcher failures are not relabelled passing runs. The final
verified-destination classifier includes normalized non-RSC query and only destinations
with actual URL/H1 evidence in that fresh context; film exceptions require actual
paused/decoded/no-MediaError snapshots, with asynchronous inspections drained.
No mandatory static-stage gap remains. See the independent final review in
[TL-003 reviews](../../reports/TL-003-reviews.md).

No Safari/Firefox, physical device/software keyboard, assistive technology or field
performance certification is claimed. Phase3 real camera-route travel and all later
page-family/responsive/performance gates remain mandatory authorized work.
