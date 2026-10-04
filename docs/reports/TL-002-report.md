# TL-002 — Bronze Journey reconstruction

Task: [approved reconstruction specification](../tasks/TL-002-bronze-reconstruction.md).
Started: 2026-10-03. Stopped at the user's request: 2026-10-04, Europe/Istanbul.

## Outcome

Partial: implementation is committed, but final V3 verification is not passing.
Work stopped on the user's explicit instruction to document and commit progress
without continuing. Latest application revision: `13b5afe`.
Reconstruction visual baseline and earlier completed checks: `b1a0bcc`.

This close-out documents the existing TL-002 work only. Separate uncommitted
TL-SYS-002 orchestration work is preserved and excluded from this task's commit.
No orchestration state, model-routing claim or independent Astra approval is changed.

## Summary

The homepage now opens with an oversized editorial arrival and a sequenced departure,
then moves through a stateful service selector, a full-height Türkiye entrance,
geographic explorer with dominant destination imagery, large destination portals,
film, asymmetric company story, live itinerary summary and a coastal arrival CTA.
The twelve Turkish detail routes have their own arrival, identity, atmosphere,
planning and onward-discovery chapters. This changes the rendered composition and
discovery interactions rather than adding motion to the V2 layout.

Türkiye remains primary. All twelve Turkish places, nine source-based services,
the secondary ten-country directory and EN/TR/AR remain. Inquiry still prepares
an editable WhatsApp/email message; it does not submit to a server. Noindex and
legal-review defaults remain. No deployment was performed.

## Files changed

- `frontend-v2/components/home-v3/`: new ServiceWorlds and DestinationJourney;
  reconstructed HomeJourney and JourneyBuilder.
- `frontend-v2/components/travel/`: destination dispatch, hero typography, explorer
  image continuity and keyboard/modal navigation.
- `frontend-v2/components/experience/ScrollScene.tsx` and `styles/experience.css`:
  chapter composition, responsive/RTL styling and bounded motion orchestration.
- `frontend-v2/lib/journey.test.ts`: three source-data/order/message boundary tests.
- `frontend-v2/scripts/`: reproducible baseline/after capture, phase inspection,
  reconstruction matrix and delayed-media regression checks; updated existing V3
  checks for the reconstructed behavior.
- Task, decision, system, architecture and handoff documents. The starting tree
  was clean at `18e1fd3`; no unrelated local changes were overwritten.

## Implementation notes and decisions

See [TL-DEC-010](../DECISIONS.md#tl-dec-010--full-bronze-journey-reconstruction).
Existing dependencies, content, assets, GSAP/Lenis and the demand-rendered bronze
sculpture are reused. There is one opening pin, limited to fine input at widths
of at least 1024px and heights of at least 800px with normal motion/data settings.
Other chapters remain native scrolling. Departure is readable by default; its
overlay presentation applies only after the eligible opening scene initializes.

The service selector accepts focus, arrow keys, hover and touch; all nine service
links remain available through a native disclosure. Explorer manual selection
overrides scroll guidance. Only active/previous destination photos mount, and the
previous photo remains until the replacement loads. Arabic changes UI order and
typographic composition without flipping geography or photographs.

Planner choices retain their existing order/reorder/remove and GET handoff contract,
with an added visual summary of destination, service, dates and traveler context.
All destination detail pages retain source content rather than invented experiences.
Final CPU-throttled QA reproduced a missed checkbox click. Pointer-event traces
showed a 40px layout shift between pointer-down and pointer-up: the initial reduced
motion class used different mobile departure padding from the hydrated normal mode.
Mobile padding is now consistent across both states. The checkbox handler also
captures `checked` immediately, but that hardening alone did not resolve the shift.
A dedicated nine-case EN/AR/TR regression checks selection, deselection and preserved
ordering under 4× CPU throttling.

## Deviations from task

No scope or design-direction substitution. Existing source-based service groups
are used as authorized by the specification. Baseline V2 has a planning explanation,
not an interactive planner: its `.process` chapter is the honest comparison for
the reconstructed `.journey-builder`. The V2 screenshot harness used isolated
Tailwind source scanning/Turbopack root configuration to run the archived revision;
its visual source was not changed. Temporary screenshots remain ignored as requested.

## Verification performed

Commands ran from `frontend-v2/` on Windows, Node 24.19.0 / pnpm 11.25.0,
with a fresh production build and `QA_URL=http://localhost:3023`.

| Command | Result |
| --- | --- |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed |
| `pnpm test` | Passed: one file, three meaningful journey tests |
| `pnpm build` | Passed: Next 16.3.6 production build |
| `node scripts/verify-public.mjs` | Passed: 120 localized routes, six screenshots, inquiry/language/media checks, no browser errors |
| `node scripts/verify-v3-resilience.mjs` | Passed: seven lifecycle/fallback checks; zero unexpected errors |
| `node scripts/verify-reconstruction-media.mjs` | Passed: visible film, opening sequence and delayed-photo continuity |
| `node scripts/capture-reconstruction.mjs` | Passed: ten final matched captures |
| `node scripts/verify-v3.mjs` | Not passed on final revision: interrupted/failed attempts described below; latest standalone run hit a redirect loop |
| `node scripts/verify-reconstruction.mjs` | Passed: 18 exact viewport/locale combinations plus three reduced-motion cases; no errors |
| `node scripts/verify-planner-throttled.mjs` | Passed: nine fresh-navigation selection/deselection/order cases at 4× CPU throttling, no errors |

Typecheck, lint, unit tests and production build passed after the final layout fix.
The V3 rerun, throttled regression and matched after captures target `13b5afe`.
Public, resilience, media and reconstruction matrix passed on `b1a0bcc`; the later fix changes
initial mobile departure spacing and checkbox event handling without changing the
settled normal-motion composition. These evidence revisions are kept explicit.

See [dated machine-readable evidence](../qa/2026-10-03-reconstruction/README.md).
One earlier final V3 run was interrupted by Chromium `ERR_NETWORK_IO_SUSPENDED`
while navigating to `/tr`; the server immediately returned HTTP 200 and the
interrupted run had no application/browser error events. Its partial output was
not treated as passing. An earlier concurrent resilience run timed out awaiting
preference teardown; isolated final verification passed EN/AR/TR without weakening
the assertions.
Another V3 attempt stalled on the preview process's optimized 1920px Rize WebP
request. The source image and direct image conversion worked; restarting the same
production server restored HTTP 200 in about 1.4 seconds without a source change.
That partial attempt was also not treated as passing.
A later run completed all 60 page/viewport cases and behavior assertions, including
the throttled planner, but failed its final zero-error assertion after intermittent
500 responses for JavaScript chunks. Those same URLs subsequently returned 200.
This is not a passing run and the cause remains unresolved.

To investigate, generated standalone output, public assets and static chunks were
copied outside OneDrive to `%TEMP%/tripline-qa-13b5afe`, without source/config changes.
Copied Windows package junctions did not resolve `next`; setting `NODE_PATH` to the
existing repository dependencies allowed the local preview to start. Its V3 run
at `http://127.0.0.1:3033` stopped with `ERR_TOO_MANY_REDIRECTS` at `/en/not-a-page`.
A read-only probe observed a rewrite to `http://localhost:3033/_not-found` followed
by repeated `/en/_not-found` redirects. Host normalization is a hypothesis to
investigate, not an implemented fix. Standalone portability is not verified.

The latest failed V3 JSON is retained as evidence. Further diagnosis, a clean full
V3 pass and final acceptance remain unstarted after the user's stop instruction.
An intermediate clean build encountered a OneDrive `EPERM` on a generated `.next`
artifact. The generated directory was preserved under ignored temporary evidence;
a fresh production build passed. No build configuration or dependencies changed.

## Visual verification

The V2 baseline is `cc374eb`. Matched before/after captures use 1440×1000 and
390×844 for hero, services, Türkiye explorer, planning and arrival. Phase captures
also cover portals, destination detail and editorial story. Evidence lives in
ignored `tmp/v3-reconstruction/{before,after,phases,qa}`.

| Chapter | Composition changed? | Interaction changed? | Narrative changed? | Still V2 plus motion? |
| --- | --- | --- | --- | --- |
| Arrival / departure | Yes: staggered monumental title, reframed media and separate departure | Yes: staged opening, bounded pointer depth, focus restores arrival | Yes: arrival resolves into departure before discovery | No |
| Service worlds | Yes: editorial index with dominant active scene | Yes: synchronized focus/hover/touch, arrow navigation, directory disclosure | Yes: one travel intention at a time | No |
| Türkiye entrance | Yes: landscape environment, scale and route-led entry | Yes: native-scroll route/title choreography | Yes: distinct threshold into Türkiye | No |
| Destination explorer | Yes: map/index beside dominant continuous media | Yes: loaded-image continuity and guided/manual selection | Yes: one destination leads the chapter | No |
| Portals / destination pages | Yes: sequential image portals and destination-specific chapters | Yes: shared transitions retained within new portal flow | Yes: place arrival, identity, atmosphere and next destination | No |
| Editorial story | Yes: asymmetric portrait, statement and offset copy | No: reading remains native; bounded parallax supports it | Yes: a quiet company chapter after destination/film discovery | No |
| Planner | Yes: inputs and photographic route summary | Yes: live visual context alongside existing ordering controls | Yes: inspiration becomes an editable journey | No |
| Final arrival / footer | Yes: coastal environment, large localized invitation and route endpoint | No: existing inquiry/navigation actions remain | Yes: the route resolves into contact | No |

The story and final CTA do not need a new interaction model to establish their
new composition. The footer's information remains familiar and usable. The paired
desktop and phone captures were visually inspected, including the final playing
film and departure. Earlier phase reviews also inspected Arabic phone/tablet/desktop
composition, Turkish phone/tablet layout, portal/detail pages, story and planner.
Final Arabic phone hero/selected planner, tablet services, desktop explorer and
Turkish phone selected planner were also inspected after the media fixes.

## Known limits

Browser verification uses local production Chromium with emulated sizes/input and
preferences. Physical devices, Safari/Firefox, full assistive-technology certification,
field performance and production hosting were not tested. CPU-throttled timing is a
local observation, not a field-performance score. The three unit tests cover journey
data boundaries, not the whole application. User aesthetic acceptance remains separate
from this engineering and visual evaluation.

## Follow-up candidates

Physical-device/cross-browser review and production/legal launch work require their
own authorized scope. None was started by this task.
