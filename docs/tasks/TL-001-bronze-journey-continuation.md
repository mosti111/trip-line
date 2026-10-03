# TL-001 — Bronze Journey continuation

## Status

Complete. 3 October 2026, Europe/Istanbul. Authorized by the user's attached
resume request. Recovery analysis was presented before any implementation edits.

## Objective and user value

Finish and verify the existing V3 journey on `feat/v3-bronze-journey`, retaining
its cinematic route identity and usable multilingual discovery/inquiry flow.
This task covers remaining stabilization and delivery, not a new design.

## Recovered state

HEAD at recovery: `771bf2ad74116b7541d718b81e6589747c16a81a`.
`85dda51` supplied motion/3D/portal foundations and journey helpers; `2a7827c`
composed chapters and connected localized itinerary inquiry; `896f6f5` improved
static/context-loss fallback, homepage motion scope and atlas manual takeover.
Existing chapters, twelve Turkish destinations, ten-country directory, nine
services and EN/AR/TR are implemented, not future feature work.

Preserved incoming changes: modified `scripts/verify-public.mjs` and untracked
`scripts/verify-v3.mjs`. Local historical production evidence records 120 routes
and six screenshots; partial V3 evidence covers 31 responsive captures and
several interactions but lacks completion of no-JS/performance checks. These
are recovery evidence, not fresh acceptance results.

## Approved experience and boundaries

Follow [vision](../PRODUCT_VISION.md), [decisions](../DECISIONS.md),
[Bronze Journey](../V3_BRONZE_JOURNEY.md), [design](../DESIGN_SYSTEM.md),
[motion](../MOTION_SYSTEM.md) and [responsive rules](../RESPONSIVE_RULES.md).
Keep teal/sand/bronze, stacked logo, film, route continuity and existing chapters.
Preserve honest prepared WhatsApp/email messages, noindex and legal review.
No backend/CMS, accounts, payments, reservations, deployment, indexing, dependency
modernization, V1 edits or unrelated refactoring.

## Remaining phases

1. Complete — production recovery checks and focused stabilization. Inspect
   coarse-pointer motion, planner focus after mutation, short-height pinning,
   localized composition and fallback behavior; fix demonstrated defects.
2. Complete — production/visual matrix and required commands. Retain
   both incoming QA scripts, improve assertions where evidence reveals gaps.
3. Complete — durable QA evidence, report, corrected handoff/phase status and new
   scoped commits. Existing commits and TL-SYS-001 remain untouched.

## Responsive, localization and motion acceptance

- Desktop retains eligible scroll choreography and demand-rendered capped-DPR 3D;
  controls remain reachable through the full pinned sequence.
- Tablet/phone retain native vertical layouts and deliberate crops/type. Review
  360, 390, 430, 768, 1024, 1280, 1440 and short-height/landscape behavior.
- All three locales retain semantic order; Arabic is RTL with unmirrored maps
  and imagery. Query context survives locale changes.
- Coarse input never invokes pointer-follow motion. Reduced motion, data saver,
  failed WebGL/video and no-JS keep essential navigation/content available.
- Keyboard focus, Escape/return, itinerary reorder/removal, menu, form validation
  and prepared-message invalidation work without inaccessible hidden content.
- No document overflow, broken loaded images, uncaught errors or hydration errors
  in the recorded matrix. Inspect representative visuals rather than inferring
  composition quality solely from numeric assertions.

## Architecture and likely files

Reuse `frontend-v2/components/experience`, `components/home-v3`, shared travel
components, current styles and scripts. Preserve installed dependencies and
server/client boundaries. Clean up observers, listeners and animation clocks;
keep demand rendering and content independent of enhancement.

## Verification and documentation

Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`; report missing tests
as a gap. Run a local production preview, `node scripts/verify-public.mjs` and
`node scripts/verify-v3.mjs` with explicit QA_URL. Cover home, service, Turkish
destination, international discovery, inquiry, menu and 404; EN/AR/TR; normal,
reduced, keyboard and emulated touch/coarse modes. Report exact coverage and
performance observations without claiming physical-device or field metrics.

Create `docs/reports/TL-001-report.md`, `docs/V3_FRONTEND_DELIVERY.md` and durable
selected evidence. Update handoff, phase plan and task index. Record material
decisions only if this work introduces one; ordinary fixes implement existing rules.

## Completion evidence

[Report](../reports/TL-001-report.md), [delivery](../V3_FRONTEND_DELIVERY.md) and
[dated QA](../qa/2026-10-03-v3/README.md). Typecheck/lint/build pass; public, V3 and
resilience production browser scripts pass. Vitest has no test files (exit 1),
recorded as a suite gap. Browser/physical-device and publication limitations remain
explicit; no V3 feature was silently deferred and no new follow-up task was started.
