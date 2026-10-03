# TL-001 — Bronze Journey continuation

Task: [continuation specification](../tasks/TL-001-bronze-journey-continuation.md).
Date: 3 October 2026, Europe/Istanbul.

## Outcome

Completed. The existing V3 implementation was recovered, stabilized and verified
within the recorded coverage; no redesign, backend work or deployment was performed.
Implementation and repeatable QA commit: `b03c2a7`. The following documentation
commit records this exact application baseline; earlier V3/TL-SYS-001 commits
were not rewritten. Both incoming QA files are included in the implementation commit.

## Recovery

Started at `771bf2ad74116b7541d718b81e6589747c16a81a` on
`feat/v3-bronze-journey`, with exactly the two reported pending QA files.
The recovery report was presented before implementation edits, followed by TL-001.

- `85dda51`: motion/3D/portal foundations and localized journey utilities.
- `2a7827c`: chapters, shared compositions/menu and itinerary-to-inquiry wiring.
- `896f6f5`: homepage motion scope, guided atlas/manual takeover, static shared
  ribbon and WebGL context-loss recovery. Inspected actual diffs, not just titles.
- Preserved modified `verify-public.mjs` and untracked `verify-v3.mjs`. The latter's
  previous partial report ended before no-JS/throttled checks. A fresh run reproduced
  hidden no-JS content, confirming that the old partial evidence was not a full pass.

## Implemented changes

- Moved root loading UI to the historical `(public)` route group. Localized main
  content now renders visibly without client JS, rather than remaining in a streamed
  hidden segment behind a loading status.
- Corrected the Arabic horizontal track's physical origin while preserving RTL
  copy. Every service link remains reachable by keyboard in all three locales.
- Coarse input, data saver and short-height windows use native vertical chapters.
  Pinning/Lenis require >=1024px width, >=800px height and fine input.
- Sculpture initializes on intersection, retains demand rendering/DPR cap and
  ignores touch pointer events. Optional cursor captions also ignore touch. Actual
  context restoration regenerates the environment render target: visual review
  caught lost metallic reflections even though the canvas had returned successfully.
- Sequenced hero and departure messages so they no longer compete; repositioned
  departure text above the ribbon. Focusing hero controls restores the readable
  initial state. Listeners are removed with the motion context.
- Planner reordering retains focus when the moved button becomes disabled; removal
  returns focus to its destination checkbox. Live status includes the ordered
  localized route. Ordering/removal targets are at least 44px wide.
- Added safe-area padding to the scrollable menu and right-side hero transform
  origin for Arabic. Brand, image orientation and geographic vectors are preserved.
- Extended incoming QA with locale/width, keyboard, fallback and explicit run-status
  assertions. Added a focused resilience script for actual WebGL loss, unavailable
  WebGL, invalid video, render-idle measurement and preference/route cleanup.

## Files changed

Application: `frontend-v2/app/loading.tsx` moved to `(public)/loading.tsx`;
`components/experience/{BronzeJourney,BronzeJourneyScene,ContextCursor,ExperienceProvider,ScrollScene}.tsx`;
`components/home-v3/JourneyBuilder.tsx`; `styles/experience.css`.

QA: the two incoming scripts were retained and finalized; new
`frontend-v2/scripts/verify-v3-resilience.mjs`. No dependency changes.
Documentation: task/report, V3 delivery/evidence, decision entry, operating handoff,
phase plan, architecture/motion/responsive descriptions and indexes.

## Decisions and deviations

[TL-DEC-009](../DECISIONS.md#tl-dec-009--v3-resilient-rendering-and-enhancement-eligibility)
records loading scope and enhancement eligibility. These implement existing approved
accessibility/responsive rules, not new product direction. No scope deviations.
The static shared Ribbon was already committed in `896f6f5`; stale descriptions
claiming it was still a live Three.js component were corrected.

## Verification performed

From `frontend-v2/`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
Production preview: `pnpm start --port 3013`; the retained standalone configuration
prints a packaging warning. This is a local preview, not deployment.
With `QA_URL=http://localhost:3013`, ran:

```text
node scripts/verify-public.mjs
node scripts/verify-v3.mjs
node scripts/verify-v3-resilience.mjs
```

Typecheck/lint/build pass. **`pnpm test` exits 1 because no Vitest test files exist.**
This is a recorded missing-suite gap, not a passing test suite. Browser scripts
provide the functional verification for this continuation.

During QA, the additional test harness required two corrections: treating a CSS
identity matrix as an untransformed element, and dispatching synthetic pointer
events from an element rather than Window. A base-text probe also initially used
an inline style tag blocked by the existing CSP; it now sets test-only DOM style
properties. Production CSP was not weakened. These intermediate failures are not
reported as application regressions or concealed as successful runs.

Final browser results and selected evidence: [V3 delivery](../V3_FRONTEND_DELIVERY.md).
All three production browser scripts passed on the final application source:
120 localized routes, 60 V3 page/viewport cases, zero unexpected browser errors,
and zero measured WebGL draws during sampled idle/hidden/offscreen intervals.
The final 4× CPU mobile navigation/selection sample was 1,851ms; this local
observation is not a field metric or performance guarantee.

## Visual verification

Reviewed readable viewport captures of desktop hero/departure, service worlds,
Türkiye atlas, Arabic horizontal services, mobile EN/AR/TR heroes, tablet chapters,
planner/arrival, representative service/destination/contact pages and menus.
The hero/departure overlap was found through rendered inspection and corrected.
The matrix checks overflow, loaded images, heading count and direction; it does not
replace human composition review. Selected captures are in the dated V3 QA folder.

## Known issues and limits

No known unfinished V3 feature is intentionally deferred by this task. Missing
Vitest coverage remains explicit. Chromium desktop/emulated touch was checked;
physical phones, Safari, Firefox, assistive-technology certification, full 200%
browser text-zoom audit and field Core Web Vitals were not. The enlarged-base-text
probe is limited and is not equivalent to a complete text-zoom audit.
Destination transition appearance can vary on cold navigation/browser support;
ordinary navigation remains available. Missing original V3 concept images were
not invented or claimed as reviewed. Client aesthetic acceptance remains separate.

## External launch blockers and unstarted work

Legal wording, current factual/partner claims, media sign-off, canonical domain,
deployment configuration and explicit publication/indexing authorization remain
external. Noindex/legal-review defaults remain. Inquiry only prepares messages;
no external message was sent. Backend/CMS, persisted inquiry, accounts, bookings,
reservations and payments remain separate, unstarted tasks.
