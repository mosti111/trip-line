> Resumed 23 October 2026 at 03:28 Istanbul after confirming the usage reset. The pause preserved the frozen R2 source and V4 results; the same Sol completed the remaining checks.

# Motion V4 — homepage hero prototype

23 October 2026 (Istanbul). **PARTIAL — acceptance blocked by P1 desktop cold entrance timing.** Required regression suites pass; the 1.3–1.6s desktop entrance target does not. Both correction cycles are exhausted; this is a reviewable prototype checkpoint, not production-quality completion.

## Authorization and baseline

[Task and exact scope](../tasks/TL-004-motion-v4-hero.md). Direct user authorization: first cinematic homepage hero prototype, then stop for user acceptance. Branch `codex/motion-v4-hero`, base `e0d5538` on the newest local `feat/v3-ux-motion-recovery`. Initial working tree clean; no uncommitted work discarded. Older local branches were inspected and were older than this baseline. No fetch, merge, push or deployment implied.

Root `/root` owns task/state/review/Git. One explicit fresh-context `gpt-6.1-sol` dispatch accepted as `/root/sol_v4_hero`, implementation plus QA. No nested lead or extra QA worker. Tool acceptance establishes requested worker routing, not backend model attestation. Root model identity is unverified by exposed metadata; independent Root rendered review will not be labeled attested Astra approval. Root administrative exception 5 and exact paths/checks are recorded before writes in the task and live state. Application is worker-owned.

## Baseline audit

Baseline HomeArrival is server-rendered and visible. HomeMotion initially selects static mode, then chooses static/native/desktop based on travel motion preference, data saving and pointer/width; motion/clock/bronze load dynamically. ScrollScene imports GSAP/ScrollTrigger and constructs a scroll-driven opening timeline. It contains no timed hero entrance choreography. Photography/headline resting states therefore remain still at scroll progress zero. BronzeJourney lazily intersects before dynamically loading the demand-rendered R3F scene; the scene redraws for scroll/pointer/visibility rather than running an idle loop. SVG fallback and capability policy can legitimately yield static bronze. Missing entrance, initialization latency/failure and intended fallback must be reported separately after actual browser inspection.

Unchanged baseline browser captures confirm this diagnosis: 1440×900 fine input remains at identity photo/headline transforms; desktop mode initializes at about 4.76s and R3F becomes ready about 7.10s after navigation in this development capture, with zero page errors. Pin range is 1620px (1.8×900). Native 390×844 touch has no entrance either. These timings include development compilation/navigation and are not production performance claims. Existing frontend was already running at port 3002 (PID 28724); a port 3053 attempt stopped on the existing Next dev lock, without killing the existing server. Before files: `tmp/frontend-qa/v4-hero/baseline/desktop.png`, `mobile.png`, `observations.json` and two recordings. Root inspected the actual native desktop capture and live IAB fallback rendering at 1440×900. Core hierarchy, readable contrast, original photo orientation and usable actions provide the preservation baseline; no unrelated redesign is needed.

## Before / after assessment

Before: the large photographic opening was readable but at rest until scroll. Mobile English occupied three headline lines, placing the actions lower. Desktop held the opening for 1620px of extra travel at 1440×900.

After: the same travel composition gains a 1500ms photo settle, two connected masked headline lines and overlapping supporting copy/actions. A restrained 1450ms bronze SVG settle begins before the heavier WebGL enhancement. Normal mobile English uses two lines and brings actions higher; Turkish uses a smaller display size to fit its longer connected first line. Arabic remains connected and RTL; photos and geographic route keep their orientation. Desktop photo recession is .91 scale instead of .55 with rotation; the two headline lines now depart in the same direction. The 945px pin at 1440×900 is approximately 42% shorter, with the existing full bronze collapse progression preserved before Service Worlds. Native touch uses the existing vertical flow. This is a bounded evolution of Trip Line's approved identity, not a new site design.

Root inspected actual baseline/current native renders at 1440,1920,390 and844landscape, plus EN/AR/TR and targeted mask comparisons. Pre-R2 timed playback at 0.86, 5.51, 12.02, 19.65 and 25.77 seconds showed coherent departure, route endpoint and reverse return; the accent clipping found in that review prevented acceptance until corrected. Final recordings and native images were also inspected after both corrections: accents/serifs and Arabic remain intact, route handoff and reverse restore coherently. Supplemental cold timing then revealed cancel/restarts that block acceptance despite those valid rendered outcomes.

## Animation systems

| Treatment | Exact system |
| --- | --- |
| Added | HomeMotion eager finite entrance opt-in; CSS inner photo/ink/SVG transforms and copy/action clip paths. Final visible server DOM is the default; focus or input/reduction finishes the sequence. |
| Replaced | ScrollScene's opposing rotated headline exits with coordinated upward exits; dramatic photo card shrink/rotation with restrained recession; long pin with measured shorter range. |
| Repaired | Headline masks now retain accents/descenders/serif overhang; listener methods are capability-guarded. A 350ms canvas/SVG opacity transition softens late enhancement. |
| Retained | Existing GSAP/ScrollTrigger owner of outer scroll transforms/opacity; ExperienceProvider's single Lenis clock; BronzeJourney and Scene's lazy eligibility, demand-rendered R3F mesh/camera flight, measured cubic collapse, context restoration and disposal. Existing Motion for React elsewhere remains unchanged. |

No dependency, content, route, navigation, inquiry, builder, menu or unrelated page change. Entrance and scroll use different surfaces/properties. [Worker report](TL-004-motion-v4-worker.md) gives exact five application files, timing and ownership details.

## Corrections and evidence integrity

Two allowed correction cycles were used. R1: final V3 SaveData injected a connection object without listener methods; the new eager controller called a missing method and reached the client error boundary. Actual capability guards fixed it; targeted normal/reduced/SaveData cases passed before rebuilding. R2: Root rendered review found cut Ü/İ dots; pixel comparison confirmed insufficient top and side clearance. Matched padding/negative margins retain the baseline and net spacing. Six EN/TR/AR masked-versus-unclipped comparisons have zero differing pixels across glyph extents. No third correction or scope expansion is authorized.

Earlier interrupted/pre-correction runs are preserved, never counted as final PASS. Baseline provenance: originals were copied to durable `before-*` files before an accidental helper invocation overwrote ignored working copies; replacements were moved to labeled development evidence and originals restored. Original recordings remain separately identified in the worker report.

## Final verification and delivery

Frozen build: `hI7nYfD8fZMLt9uxc68g_`, five application SHA256s match the final R2 freeze. `pnpm typecheck`, `pnpm lint` plus final affected/verifier lint, `pnpm test` (32 tests) and default `pnpm build`: PASS. Final production `verify-public.mjs`: 120 routes, 6 captures, 5 groups, 0 errors. `verify-v3.mjs`: 60 captures, 16 groups, 0 errors. `verify-v4-hero.mjs`: 26 cases, 96 media artifacts, 0 unexpected errors; 6 injected WebGL messages labeled separately. Chromium 153.0.8010.12; max observed initial CLS 0.000862818 (EN normal 0). V4 covers all 3 locales at 1920×1080, 1440×900, 390×844 and 844×390, plus reduced/SaveData/noJS/noWebGL and keyboard/preference/navigation cleanup.

**Additional timing acceptance: FAIL.** Raw cold events observe photo animation cancel/restarts on desktop. First timeline start→first entry done: EN 1440 **2973.131ms**, AR 1440 **3549.3ms**, EN 390 touch **1501.516ms**. Configured CSS duration 1500ms and eventual final styles do not prove wall-clock compliance. First start follows FCP by 282ms/422ms/249ms respectively in these fresh samples. The V4 suite verifies that entrance played and eventually settled; it does not enforce a single uninterrupted duration, so its PASS does not close this P1. Pin setup/refresh reparenting and lazy initialization scheduling are plausible causes, explicitly unproven. No third repair was attempted.

Durable [checks](../qa/2026-10-23-v4-hero/checks.json), [manifest](../qa/2026-10-23-v4-hero/manifest.json), [cold timing events](../qa/2026-10-23-v4-hero/cold-timing.json), [Root review](../qa/2026-10-23-v4-hero/root-review.json), selected before/after/reduced/Arabic stills and all 4 recordings are under [QA evidence](../qa/2026-10-23-v4-hero/README.md). Exact commands/logs, resolved failures and raw sources are linked there and in the worker report. Checkpoint SHA is supplied in the closing response to avoid self-reference.

Local preview: from `frontend-v2`, `pnpm start --port 3003`; visit `http://localhost:3003/en`, `/ar` or `/tr`. If rebuilding first, run `pnpm build`. Preview is local, not deployment; an existing dev server at 3002 was preserved.

## Limitations and next milestone

Chromium desktop/touch emulation is the browser boundary; physical devices, Safari/Firefox and field-performance certification remain unverified. The eager entrance starts with hydration and deliberately preserves visible server content before that point. Late WebGL replaces the complete SVG through a 350ms transition; it is not required for reading or actions. This milestone does not optimize the whole site's asset loading or redesign later chapters. Noindex, legal/media/company-claim gates and prepared-message inquiry behavior remain.

Stop after this partial prototype checkpoint because the repository's two-correction budget is exhausted. User creative acceptance is pending and the hero is not ready for acceptance while P1 remains. Next action requires a narrowly authorized desktop startup timing repair, a duration assertion that detects cancel/restart, and fresh affected rendered/timing acceptance. After that, evaluate real-device pacing and loading before extending the motion vocabulary. Mega menu, galleries, builder and site-wide rollout require separate authorization. Root model identity is not independently attested, so the live state must not forge the protocol's selected-Astra approval.
