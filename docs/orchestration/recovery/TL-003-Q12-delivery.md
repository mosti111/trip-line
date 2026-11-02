# TL-003-Q12 delivery candidate — 21 October 2026 Istanbul

Worker verification is complete; independent Root acceptance is pending. Contract: [final QA](../../tasks/TL-003-final-qa.md) and [Q12 coverage](TL-003-Q12.md). Root Astra directs and accepts. Original explicitly selected Sol `/root/sol_final_qa` was interrupted; sequential replacement explicitly selected Sol `/root/sol_final_resume` completed the same exact scope, with no concurrent additional QA worker or nested lead. Tool-accepted model routing is not backend attestation. Correction cycle 1 of 2 is the [44px menu target](../../tasks/TL-003-Q12-touch-target.md).

## Artifact and scope

Tested base HEAD: `40ac8b9ca46ab1a4fcde8b956f511cb9de0d3a6b`. Corrected production build: `SoQy-aoR26IuNSvso9BsX`. The sole application change is `min-width:44px` in the existing `.recovery-shell .menu-button` rule in `frontend-v2/styles/recovery-shell.css`. All 153 tracked non-verifier frontend files are frozen in `tmp/frontend-qa/final-q12/corrected/application-frozen.json`; the replacement verified zero hash mismatches before restarting the same built artifact on local port 3043 and again at completion (`corrected/final-freeze-check.json`). No rebuild or application change was made by the replacement. Freeze-manifest SHA256: `9950b855c6554b377e5dda7a4b093510ede2d28961dd7ae70cbf31e2cdb4771d`. CSS SHA256: `e4aae0120062057286103e5a1fb9c4096fe97429cfdb4ddffeec7a9bad28cea5`. All seven remaining phase reports record the same application-diff SHA256 `4ccb5b1150a7508db7815f75da01138e396dd6202dc33e4b06c21e0483ca02c9` and Chromium `153.0.8010.12`.

Verifier changes retain meaningful coverage while adapting selectors to approved TL-003 behavior, add output-directory overrides, isolate throttled empty-state cases from intentional persistence cases, and expect the approved Arabic left-arrow message separator. New `verify-recovery.mjs` supplies the final matrix, journey, motion, integrity, brief, fallback, accessibility, target and resource checks. The existing read-only motion helper is reused; no new shared helper or dependency was added.

## Corrected completed gates

All paths below are relative to `tmp/frontend-qa/final-q12/corrected/`. Completed reports were preserved through interruptions and not repeated by the replacement.

| Gate | Result and evidence |
| --- | --- |
| Core | `pnpm typecheck`, `pnpm lint`, 32 unit tests, default `pnpm build` passed: `typecheck.log`, `lint.log`, `tests.log`, `build-clean.log` |
| Public | 120 localized routes, 6 screenshots, 5 assertion groups, zero unexpected errors: `public/production-check.json` |
| V3 | 60 screenshots, 16 assertion groups, zero unexpected errors: `v3/verification.json` |
| Resilience | 9 groups, zero unexpected errors; actual context loss/restore, both dialogs, preference/route/resize cleanup, film fallback; idle/hidden/offscreen WebGL draws all 0, measured DPR 1: `resilience/resilience.json` |
| Media | 2 groups including delayed-image continuity, zero unexpected errors: `media/media.json` |
| Reconstruction | 21 cases covering all 15 chapters across 18 normal states and 3 reduced-motion states, zero unexpected errors: `reconstruction/report.json` |
| Throttled planner | 9 isolated cases plus 3 explicit session-persistence cases at 4× CPU, zero unexpected errors: `throttled/planner-throttled.json` |
| Contact | 37 cases, 18 screenshots, zero unexpected errors: `contact/2026-10-19T22-35-20.580Z/report.json` |
| R1 targets | 15 cases, 30 native screenshots, zero unexpected errors: `recovery/targets/2026-10-19T13-25-12.464Z/report.json` |
| Accessibility | 7 cases, 12 native screenshots, zero unexpected errors: `recovery/accessibility/2026-10-19T13-26-26.981Z/report.json` |
| Final verifier lint/syntax | Replacement `pnpm lint` passed before and after the timer helper correction: `lint-final-resume.log`, `lint-final-timer-fixed.log`; final verifier Node syntax checks passed |

## Completed final phases

Each row below is a passed `report.json` under `corrected/recovery/<phase>/<timestamp>/`. All have zero unexpected errors. The matrix is entirely fresh: no pre-R1 or interrupted-run inheritance. Resources explicitly reads `corrected/public/production-check.json`.

| Phase | Cases / captures | Timestamp directory |
| --- | --- | --- |
| Matrix | 165 / 276 | `matrix/2026-10-20T17-15-54.527Z` |
| Journey | 6 / 3 | `journey/2026-10-20T17-26-42.402Z` |
| Motion | 4 / 68, plus 4 continuous WebM recordings | `motion/2026-10-20T17-27-29.956Z` |
| Integrity | 5 / 4 | `integrity/2026-10-20T17-30-09.030Z` |
| Briefs | 21 / 0 | `briefs/2026-10-20T17-30-52.318Z` |
| Fallbacks | 15 / 15 | `fallbacks/2026-10-20T22-15-51.434Z` |
| Resources | 13 / 0 | `resources/2026-10-20T22-16-56.017Z` |

Matrix covers EN/TR/AR home at 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×900, 1440×900, 1280×600 and 844×390; fourteen representative route families at 390/1440, and nine at 768×1024/1280×600. Journey exercises explorer Add, drawer reorder/remove, detail Add, reload, builder, Contact, equal prepared WhatsApp/mailto messages, invalidation and back/forward in each locale, plus malformed/blocked/empty storage and last removal. Motion records forward/reverse wheels at EN/AR1440×900 and EN/TR1280×600, with requested 0/25/50/75/100% opening captures and 3D→graphic handoff. Integrity includes unmirrored map/photo, decoded Antalya delivery, modified links, keyboard mega/local/footer navigation, attributed 2019/2025 facts, directory/legal states, sticky-action suppression and visible Arabic left-arrow message equality. Briefs cover business/pilgrimage validation and stale invalidation in normal/reduced/SaveData for all locales plus all twelve source-exact related-destination arrays.

Fallbacks cover no-JS, reduced motion, SaveData, touch and injected unavailable WebGL in all locales, retaining content/navigation and the applicable planner checks. Injected renderer errors are separately recorded as expected. Resources records all 120 server heading outlines: **zero routes with skipped heading levels**, one H1 each. It also verifies locale fallback/manual-cookie/query preservation, legal chunks without homepage engines, DOM-first home and FAQ five-category native keyboard/no-JS disclosures. Command logs are `corrected/recovery-<phase>-resume.log` for matrix through briefs, and `corrected/recovery-<phase>-timer-fixed.log` for fallback/resources.

Continuous recordings under `motion/2026-10-20T17-27-29.956Z/recordings/`: EN1440 `page@6df6f440ce1790aef04b76439f77717a.webm`; AR1440 `page@661dc44d07a2092541bafae36123b535.webm`; EN1280×600 `page@424cbf2a3e823ba57a60fb5abc068b08.webm`; TR1280×600 `page@178ec428fa859289f66980f67a337646.webm`. Browser ownership was released to Root after the last resource check; preview 3043 remains running for Root review. No further worker browser activity is scheduled.

## Preserved failures and limits

Two initial corrected-build attempts hit generated-output unlink `EPERM`; logs `build.log` and `build-retry1.log` remain. After checking resolved workspace paths, partial generated output was moved reversibly into ignored `tmp/frontend-qa/final-q12/prefix-build-output`; the clean default build passed. No source/configuration workaround was used.

Earlier harness failures remain preserved: mobile hidden desktop header selection, multiple valid noindex tags on the branded 404, and density-adjusted Antalya `naturalWidth`. Assertions now inspect the visible control, require every robots declaration to retain noindex, and inspect the actual decoded bitmap (1600×2400, optimized request w1920/q85). Accepted original Antalya source softness remains a nonblocking limitation. Pre-R1 reports outside `corrected/` are historical baseline evidence and do not establish final acceptance.

The first replacement fallback attempt stalled on its first no-JS case because `sweep` scheduled a page timer, which the JS-disabled context suppresses. Its directory `corrected/recovery/fallbacks/2026-10-20T17-31-35.623Z`, original `recovery-fallbacks-resume.log`, exact stopped process list `fallback-stalled-processes.json` and bounded `fallback-nojs-timer-diagnostic.json` are preserved. The diagnostic confirmed synchronous DOM/native scroll work while a 30ms page timer did not fire within 2000ms. Only that verifier and descendant browser tree were stopped. Root approved moving the same 30ms waits to the verifier, retaining every 700px native scroll step, final 300ms settle and image/overflow assertion. Only the incomplete fallback/resources phases were resumed; application/build and completed suite evidence remained unchanged.

Chromium lab verification only. Physical devices, Safari, Firefox, field performance and assistive technology remain unverified; 200% text and keyboard viewport tests are lab enlargement/simulation. No actual inquiry send, merge, push, deployment, publication or worker self-approval occurred. Noindex and pending legal review remain. Root must independently inspect rendered captures and continuous motion and record acceptance.
