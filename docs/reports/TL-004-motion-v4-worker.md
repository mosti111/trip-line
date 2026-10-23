# TL-004 Motion V4 hero — worker delivery

Status: **PARTIAL — P1 desktop entrance timing acceptance fails**. Final public/V3/V4 suites pass, but the supplemental cold-load observation exposes desktop cancel/restarts and timing beyond the specified bound. Both correction cycles are exhausted; the application remains frozen. No worker approval or user creative acceptance. Scope: [TL-004](../tasks/TL-004-motion-v4-hero.md), baseline `e0d5538`, branch `codex/motion-v4-hero`. Root `/root` specifies/reviews; one explicitly selected Sol worker `/root/sol_v4_hero` implements and verifies. No nested agents, dependency changes, commits, merge, push or deployment.

## Audit and implementation

Reading: premium travel discovery, retaining Trip Line's cinematic editorial identity. Taste principles were applied contextually to motion motivation, whole-line typography, hierarchy, focus and fallback resilience; approved Trip Line assets, palette, fonts, content and existing chapter composition govern.

Before application edits, Chromium captured EN desktop 1440×900/fine and mobile 390×844/touch on the already-running dev server `http://localhost:3002` (PID28724). Initial uncut recordings and timed observations showed no photo or headline entrance. ScrollScene initialized its scroll-only opening; R3F subsequently reached `contextState=ready`, renderCount1. No page errors. This was absent timed choreography plus independent lazy startup, not a broken import/init or an active fallback being mistaken for full motion. The dev desktop samples show desktop mode at approximately4763ms and ready R3F at7096ms from navigation; these dev observations are not production timing claims.

Audited systems:

| System | Finding / treatment |
| --- | --- |
| HomeArrival | Retained source content/photo/links/coordinates; nested whole-line ink and photo surfaces, grouped existing SVG paths. Exactly two connected lines, never word/letter splitting. |
| HomeMotion | Retained mode and dynamic-controller boundaries; small eager layout effect opts into a finite entrance before GSAP/Three downloads, with final visible SSR defaults. Focus, wheel/touch/scroll-key intent or a reduction finishes it immediately; preference changes never replay it. Cleanup removes its listeners/timer/data. |
| ScrollScene | Retained one opening pin and existing reversible route/camera progress; reduced travel, coherent same-direction copy departure and restrained photo recession. All later chapter choreography remains unchanged. |
| BronzeJourney / Scene | Read-only retained eligibility, SVG fallback, lazy intersection, synthetic reflection environment, existing demand-rendered mesh/camera flight, measured cubic collapse, context restoration and cleanup. No second 3D clock or model. |
| ExperienceProvider | Read-only retained single Lenis owner, modal/native-input behavior, ticker and lifecycle cleanup. |
| CSS | Entrance owns inner photo/ink/group transforms and copy/action clip paths; GSAP owns outer scroll transforms/opacity. No competing owner of one property/surface. Added 350ms canvas/SVG enhancement crossfade. |

Configured finite entrance (not an unconditional observed desktop completion claim): photo 1.045→1 over 1500ms; first complete connected line1050ms with60ms offset; second1050ms with200ms offset; supporting copy/action/secondary links overlap from400/540/660ms; SVG bronze group settles over1450ms. No preloader, bounce, typing or global fade-up cascade. Final styles remain the default if JavaScript, lazy imports or animation initialization fail. NoJS/reduced/SaveData keep the server composition. Reduced motion is gated both by media preference and current shell preference.

Measured chosen pin range:1.05×viewport height at≥900px, .95× at700–899, .85× below700. At1440×900 this is945px instead of1620px; at1920×1080 it is1134px instead of1944px. This removes approximately42% of the long opening hold while leaving the existing full0→1 route/collapse progression and native service sequence intact. Photo recedes to.91 rather than becoming a.55-sized rotating card. Existing matched mesh-to-route screen cubic and reverse logic remain unchanged.

Mobile EN and Arabic retain two whole display lines. Turkish's longer first line uses a smaller responsive display size to remain one whole line; this is the deliberate tradeoff, verified by actual text Range rectangles rather than wrapper count. Geography and media retain their existing orientation.

## Verification and evidence

Final application freeze: five source files, exact SHA256 values in ignored `tmp/frontend-qa/v4-hero/correction2-app-freeze.json`. Final R2 default Turbopack build `hI7nYfD8fZMLt9uxc68g_`; production preview3003 (PID29744). The pre-existing dev server was not deliberately modified by the worker; Root confirmed only the owned production preview remained at resumption. Preview is local, not deployment.

- `pnpm typecheck`: PASS, including final intent-listener version.
- `pnpm lint`: PASS; final targeted eslint for HomeMotion and V4 verifier PASS.
- `pnpm test`: PASS,32tests in2files; unchanged tests remain valid after the bounded listener refinement.
- `pnpm build`: PASS; final exact build above.
- Final public: **PASS**, 120 routes, six captures, five check groups, zero errors. `tmp/frontend-qa/v4-hero/resumed-public/production-check.json` and `resumed-public.log`.
- Final V3: **PASS**, 60 reported captures, 16 check groups, zero errors. `resumed-v3/verification.json` and `resumed-v3.log`. Includes the corrected minimal SaveData object, context loss, noJS, touch, short-height focus restoration, geography, media fallback and 4× CPU planner. The latter sample was 3127ms including navigation/waits, not an INP or field score.
- Frozen final V4: **PASS**, 26 cases, 96 media artifacts (92 PNGs/four WebMs), zero unexpected errors. `after/report.json` and `correction2-v4.log`. Chromium 153.0.8010.12. Six deliberately injected WebGL console entries are separately labeled stimulus across three noWebGL cases. Maximum initial CLS 0.000862818144705397; normal EN samples were zero.
- Supplemental cold timing: **FAIL acceptance**, separate from suite PASS. `correction2-cold-timing.json` and `correction2-cold-timing.log`; exact observations below.
- Final verifier eslint: PASS (`final-verifier-lint.log`). Final source whitespace/scope/freeze checks pass; application hashes match `correction2-app-freeze.json`.

Earlier provisional builds `2N2Ae32xN4D-JMnMgIORM` and `Ek6RMRLa0XbEtTmV5FH_y` public PASS120routes/6screens/5groups/0errors are historical, not final artifact acceptance. Its V3 run was stopped explicitly after the final listener refinement; partial evidence/log preserved and no PASS claimed. Targeted dev V4 completed ENdesktop/ARmobile before a TR snapshot failed because a fixed1800ms-from-load wait preceded late dev hydration. The verifier now waits for the observed finite entrance to complete and retains its actual timing trace; application timing was not weakened.

Before evidence provenance: Root copied the original pre-edit PNGs/observations to `docs/qa/2026-10-23-v4-hero/before-*`. A mistaken second invocation of the temporary baseline capture overwrote only ignored working copies after edits; those replacements were moved to ignored `dev-after/` and originals restored from Root's already-saved durable copies. Original baseline recordings at01:08Istanbul remain `page@08851c38ac2e63e241a1e266ca009df2.webm` (desktop) and `page@cd3e184130f0309be5fdc1a8cbe14f3f.webm` (mobile). Accidental after recordings at01:10 remain separately identifiable; they are not claimed as baseline.

Raw evidence stays under ignored `tmp/frontend-qa/v4-hero/`. Final V4 verifier records browser/input/locale/viewport/mode, actual unbroken line count, timings/paint traces, CLS, console/page errors, measured forward/reverse states, screenshot/video paths, byte sizes and SHA256 manifest. Root owns selected durable evidence and independent rendered review.

## Two bounded corrections

1. **R1 — connection capability guard.** The existing V3 SaveData fixture supplies only `{saveData:true}`. New entrance listener setup initially assumed methods existed and produced a client error boundary. Method-existence guards now match the existing mode controller. `correction1-targeted.json` records healthy SaveData-without-methods, normal and system-reduced renders with no errors; targeted typecheck/lint and rebuild passed. The failed full V3 log/report remains under `final-v3/` (60 matrix captures plus reduced cases completed before SaveData failure), never relabeled as PASS. Final V4 intentionally uses the minimal connection object to cover the correction.
2. **R2 — actual glyph-mask clearance.** Root's native review found cut English diacritic tops. Enlarged pixel inspection confirmed the defect. Increasing top clearance restored dots; an actual masked-vs-unclipped comparison then detected 54 lateral overhang pixels, addressed within the same mask-boundary correction using symmetric inline padding/equal negative margins. Final clearance is .26em above, .19em below and .08em inline, with equal negative margins preserving text position/net spacing. `correction2-targeted-complete/report.json` records six native cases (EN1440/1920, TR1440/390, AR1440/390), all one text line per mask and **zero differing pixels** versus the unclipped reference across accents, serifs, edges and Arabic descenders. Actual before/after crops and each reference PNG are preserved. Root inspected corrected native samples and found no remaining targeted visual blocker. Pre-R2 V4 captures/recordings remain under `pre-r2-after/`; the final `after/` paths are recreated from the exact R2 build.

Both correction cycles are used. No further application edits or scope expansion are authorized in this run. Final production suites passed after the user-requested usage pause; the interrupted public attempt was preserved and replaced by the complete resumed run. The unchanged V4 run was not repeated.

## Remaining P1 — desktop cold entrance timing

Root classified the read-only supplemental observation as a genuine acceptance blocker: the brief requires the main entrance in 1.3–1.6 seconds. The desktop photo CSS animation cancels/restarts during initialization. No third application correction was made or authorized.

All values below are milliseconds from each navigation's performance time origin. `startTime` is the animation timeline value; callback timestamps can be delayed by main-thread work and must not be confused with compositor completion.

| Fresh sample | First contentful paint | Photo start timeline(s) | Cancel elapsed duration(s) | End callback / CSS elapsed | First entry=`done` | First start→done |
| --- | ---: | --- | --- | --- | ---: | ---: |
| EN 1440×900 | 612 | 893.869; 1627.169 | 283.331 | 3883.8 / 1500 | 3867 | 2973.131 |
| EN 390×844 touch | 524 | 773.084 | none observed | 2274.4 / 1500 | 2274.6 | 1501.516 |
| AR 1440×900 | 556 | 977.7; 1627.667; 1911 | 283.3; 100 | 4541.9 / 1500 | 4527 | 3549.3 |

First photo start minus FCP was 281.869ms / 249.084ms / 421.7ms respectively. Every sample reports the configured duration as 1500ms, zero page errors and final entry=`done`, photo/ink transforms=`none`, no running animations. Those final states do **not** establish the required desktop wall-clock bound. The mobile sample observed one natural 1500ms animation; desktop observed cancel/restart plus a later natural end event. The earlier strict helper assumed an `animationend` event and failed when none was observed in that sample; it was replaced only with honest start/cancel/end/state observation, never a fabricated timing PASS.

**Cause inference, not established causation:** GSAP pin setup/refresh can remove/reinsert the pinned section, plausibly restarting descendant CSS animations. Installed ScrollTrigger source contains `_swapPinOut`/`_swapPinIn` and `insertBefore(pin, spacer)`/`spacer.appendChild(pin)`; ScrollScene runs initial pin setup and bounded font/load refreshes. Lazy R3F startup/main-thread scheduling may also delay callback delivery. No implementation was changed to test those hypotheses after the correction budget was exhausted.

**Verifier weakness:** V4 asserts that the entrance played and eventually reached `done`, plus clear final properties, reduced/static behavior and forward/reverse restoration. Its RAF/paint trace samples play states but does not assert an absolute single uninterrupted 1.3–1.6-second wall-clock entrance. That is why V4 PASS coexists with this supplemental timing FAIL. No assertion was weakened to disguise the discrepancy.

Raw timing schema: top-level `status: OBSERVED`, browser/version and timestamps; per sample locale/viewport/errors, `paints` (`name`, `time`), all `events` (`type`, animation `name`, callback `now`, CSS `elapsedTime`, available timeline `startTime` and configured `duration`, target), observed data-entry `states` (`now`, old/new values), final computed photo/ink/running states and derived first-start/FCP/done differences. The ignored helper source is `cold-timing.mjs`; it executes through stdin from frontend-v2 so existing Playwright resolves correctly. No application mutation was used for this timing observation.

## Final coverage and evidence paths

Normal V4 captures: EN/AR/TR at 1920×1080, 1440×900 (fine mouse), 390×844 and 844×390 (coarse/touch). Each locale also has reduced, SaveData and noJS at 390×844 plus noWebGL at 1440×900. Extra reduced samples cover AR 1440×900 and EN 844×390. Real text Range line counts, hero image decode, overflow, visible local actions, keyboard focus during entrance, shorter measured pin, seven forward checkpoints, service handoff, reverse restoration and preference/route cleanup are recorded. R2's six native masked/unclipped comparisons cover actual glyph pixels separately.

Stable final recordings, each hashed in `after/report.json`:

- `after/desktop-load-1440x900.webm` — dedicated initial load.
- `after/en-1440x900-normal.webm` — initial load plus slow forward/reverse and action/cleanup checks.
- `after/ar-1440x900-normal.webm` — connected RTL forward/reverse, unmirrored route.
- `after/en-390x844-normal.webm` — touch/native mobile load and scrolling.

Root owns selected durable copies under `docs/qa/2026-10-23-v4-hero/` and the independent rendered verdict. Worker touched exactly five application files, the additive V4 verifier and this report. BronzeJourney/Scene and ExperienceProvider remain unchanged. All five source SHA256s are in `correction2-app-freeze.json`; final HomeMotion is `dfc622ad94f7594e00feebaf7cbb369531200eebda7c8e80299987c24f904955`, final motion CSS is `e1f46bf069535224d07ff166186b1ff8c3e16941b817cc99848da63ab02d59f2`.

## Limitations and stop boundary

Chromium desktop emulation only; no physical-device/Safari/Firefox or field-performance certification. SSR content stays visible until the eager hydrated island opts into the entrance. Actual desktop startup timing fails the requested bound as described above; code duration alone is not acceptance evidence. Lazy R3F may enhance after the finite text/photo entrance;350ms crossfade softens that replacement, with complete SVG remaining available. Existing publication/legal/media/company-claim gates remain, including noindex and prepared-message inquiry boundaries.

Final worker status is **PARTIAL**, never APPROVED or production-quality completion. The reviewable prototype and passing regression evidence remain preserved with the open P1 timing blocker. Root independently owns acceptance/state/checkpoint; no worker commit, merge, push, deployment or third repair occurred. Production preview remains on port 3003 (owned PID 29744). Stop after this report; no next milestone or new work started.
