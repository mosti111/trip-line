# TL-014 — Full Motion default correction

27 October 2026. [Authority and acceptance](../tasks/TL-014-full-motion-default.md).
Baseline `396ebdf4c9dd264d10499d76ec528120f6173bf9`; existing feature branch
`codex/trip-line-v11-mobile-recovery`. One implementation agent, no subagents.

## Implementation and audit

Missing/invalid saved preference now resolves to Full in the shared parser and
head bootstrap, independently of OS Reduce Motion. React's hydration/server
snapshot uses Full as well. Root-attribute synchronization reads the current
store rather than temporarily writing its server snapshot over a saved preference.
Saved Reduced is guarded in prepaint CSS as well as the hydrated shell class.
All three menu/footer options remain intact; System still tracks OS changes.

No migration or storage write is performed on initialization. Historical writes
were inspected with `git log -S` and the original `cc374eb` shell plus TL-011
`5008ced`: writes occur in selector change handlers, not initialization effects.
An existing `system` value therefore remains a deliberate choice. Reduced is
never overwritten. Invalid obsolete values fall back to Full without rewriting
storage. Blocked storage reads also use Full.

Active motion audit: `V6Motion`, `AtlasStage`, `PartnerBillboard`, page scene
controllers and MotionConfig use effective `calm`; existing CSS OS-reduction
rules exclude explicit Full. No active Safari/user-agent veto exists. Viewport
variants tune authored amplitude/composition; pointer gates apply to hover/cursor
features, not the cinematic scene system. Existing GSAP/Motion/WAAPI animations
are retained. Inactive historical HomeMotion, HeroAircraft, journal/global CSS
and old BronzeJourney eligibility are not the current V1.1 homepage controller;
they were not revived or refactored. Film SaveData/network policy, failed-media
posters, SVG/WebGL fallback, hidden/offscreen pause, billboard user/focus/hover
pause, native scrolling and viewport refresh safeguards remain.

The established public/V3 System-reduction cases now explicitly save System;
their functional assertions were retained. A new targeted browser script verifies
fresh defaults, initialization root-attribute history, saved choices, OS changes,
actual menu/footer selectors, reload/locale persistence, scene transformations,
billboard movement/pause and unsupported WebGL/failed-film fallback.

No layout, content, animation choreography, dependency or production configuration
was changed. Bundled Next pre-hydration guidance was read before altering snapshots.

## Verification

Fresh production build: `TUbZ5fNRamayg1Fs60Er0`, local port 3039.

- Typecheck and ESLint: PASS.
- Vitest: PASS, 59 tests in four files, including 22 motion-policy/bootstrap tests.
- Default Next 16.3.6 Turbopack production build: PASS.
- Public regression: PASS, 120 localized routes, six captures, five groups,
  zero reported runtime errors.
- Desktop hero preservation: 1440x1000 settled EN/AR/TR captures compared against
  the pre-change baseline build; **zero changed RGB pixels in all three**.
- Full V3: PASS, 60 captures, 16 functional groups, zero reported runtime errors.
- Targeted final matrix: PASS, 36 fresh-mode cases across Chromium/WebKit,
  320/390/768px, EN/AR/TR and both OS settings; saved modes, OS changes, selectors,
  reload/locale persistence, 108 scene/billboard checks and two engine fallback
  cases. Zero application/console errors in the final strict checks. The JSON
  aggregate identifies the valid phone/tablet/final-WebKit source reports.

The first targeted run passed twelve fresh-default cases at 320/390px, then
stopped on a verifier target mismatch at 768px: it sampled `.rt-preview-media`,
while the authored tablet animation belongs to `.rt-preview`. The viewport-specific
target was corrected in the test only; application choreography was unchanged.
The failed report is retained. A subsequent tablet measurement used raw matrix
scale (0.0374) against a pixel threshold; the test now records scale in percentage
points (3.74), alongside translation/mask units. The corrected tablet run passes
all three locales. Earlier passing phone cases remain valid on the same frozen
application build. The final aggregate identifies each source report explicitly;
failed tablet attempts are not counted as passes.

Local raw artifacts: ignored `tmp/frontend-qa/tl014/` and `tmp/tl014/`.
Durable summaries and core command logs are packaged under
`docs/qa/2026-10-27-tl014/` after final verification. `next start` emits its known
standalone-output warning; this is local production QA, not deployment evidence.

Windows Playwright WebKit is emulation, not physical iPhone Safari. Chromium uses
native CDP touch input. Playwright mobile WebKit rejected wheel input and has no
swipe dispatch API; its scene proof uses programmatic native scrolling on a
touch-enabled viewport and ordinary touchscreen taps for controls. The rejected
input attempt is retained as a tooling failure, not a product defect. This does not certify a
physical WebKit swipe or iOS toolbar behavior. No field performance/FPS claim.

All 18 WebKit fresh-mode cases and 54 scene/billboard checks completed on the first
scroll-capable run, but strict console validation failed on 30 screenshot-induced
CSP messages. A diagnostic loaded without errors and reproduced one violation
per screenshot (including `caret: initial`). Installed Playwright 1.63.0's
`inPagePrepareForScreenshots` inserts an unnonced `<style>body {}</style>` when
synchronizing WebKit animations. The strict final WebKit run omits screenshot
calls; capture evidence is preserved separately from its behavior/CSP run. No
CSP relaxation, blanket error filter or application change was made.

## Review delivery safeguards

Deploy only after local checks pass, from committed/pushed source, into a new
isolated project as a Preview with login protection disabled on that project only.
Use the existing server-enforced deadline `2026-10-27T15:22:45.000Z`
(27 October 18:22:45 Europe/Istanbul); no existing expiry extension is authorized.
No main merge, production promotion, existing alias or billing change.

Read-only preflight confirms the existing canonical production alias still maps
to `dpl_8XqhZU1J7SobhsgiifgY4Q3QAwa5`, source `1632a6b9`, project
`prj_Z7d8Fd2lrA4DEAAZz1B7ZBIR0R8O`. The old V1.1 review project is separate
`prj_9pbqRH1MGonwCvNeQ20knZhH29Zv`; do not overwrite either project's delivery.
Actual new Preview receipt and hosted verification are recorded after deployment.

Verified source commit: `1f6e453e765dc0bdb221aeeff127ed0cb9ae23ea`, pushed normally
to the existing branch. All 286 exported frontend files match Git blobs; all 285
uploaded source files match the remote SHA1 tree (`.gitignore` is excluded by the
CLI). No local environment, dependency, cache or build-output files were uploaded.

New isolated project: `trip-line-tl014-motion-review` /
`prj_Lf4M8KHEMsLrBP5YXqn9dbsspL0g`, verified Node24/Next.js, no Git connection,
no login protection. **READY Preview**, API `target: null`, aliases empty:
`dpl_12ZVv7v3gaerS6Vh342Eu38vW9HN`.
URL: https://trip-line-tl014-motion-review-jtprphtw8.vercel.app/en .

Delivery correction: CLI 60.1.3 rejected `--skip-domain` with Preview, then the
provider classified the first deployment in the brand-new project as Production
despite `--target preview`. Only that new project was affected. A second deployment
is verified as Preview; the initial new-project deployment
`dpl_EDnpw4dBYuS2DcZWc7Ub3xaNSxQc` was removed and its API lookup returns 404.
The new project now has no domains. No existing production alias was changed.
Post-delivery read-only verification confirms the original canonical deployment
still has exactly the preflight ID/source/aliases. Existing expiry/automation and
billing remain unchanged. The new Preview uses the same server deadline.

The first hosted run completed all 12 fresh-mode cases and six resource checks,
but strict console validation caught Vercel's injected Preview feedback toolbar
styles/frame being rejected by the application's CSP. Feedback injection was
disabled **only on this new review project** (`enablePreviewFeedback: false`),
then the identical source was rebuilt to apply that provider setting; the existing
deployment kept its embedded toolbar until rebuilt. A fresh check on the new
Preview has zero toolbar requests or console errors and Full active. No request
bypass, error filter or CSP change was used to hide the provider injection. The initial
hosted failure is preserved in the evidence directory.

Final hosted result: **PASS**, 12 fresh no-cookie sessions across Chromium/WebKit,
EN/AR/TR, 320/390/768px and both OS reduction settings; all resolve to Full without
saved state. Six OS-reduced sessions also verify meaningful hero/billboard motion,
billboard pause, menu selection, Reduced after reload, System OS changes and Full
after reload/actual locale selection. Six image/film/script resource checks return
200/206 with the exact unchanged expiry header. Zero application/console errors.
The superseded toolbar-bearing Preview was also removed. Final source binding,
Preview target, protection and preservation details are in
[deployment receipt](../qa/2026-10-27-tl014/deployment-receipt.json) and
[hosted result](../qa/2026-10-27-tl014/hosted-verification.json).

Delivery complete within the stated automated/browser limits. A documentation-only
receipt commit follows the source commit; it does not change or redeploy the app.

Physical iPhone Safari and client creative acceptance remain separate requirements.
