# TL-003-H02 delivery — static homepage and Türkiye discovery

Date: 6 October 2026, Europe/Istanbul. Status: IMPLEMENTED; pending independent
lead production and rendered approval. Task/milestone: TL-003 phase 2, under
[H02 contract](TL-003-H02.md) and [current recovery task](../../tasks/TL-003-ux-motion-recovery.md).
No commit, merge, deployment or self-approval.

## Routing and tested source

Selected GPT-6.1 Sol worker `/root/astra_resume/sol_home_static` resumed the preserved
partial work under the lead's exact ten-file lease. Astra lead `/root/astra_resume`
remains the sole state writer/reviewer. The requested selection and returned handle
are recorded; this is not an independent model attestation. Usage interruptions were
reconciled by the lead before continuation. No planning or implementation restart.

Branch `feat/v3-ux-motion-recovery`; tested HEAD `a4a448b4bfe6bddac2d89cd79634248f7ee88ba3`
plus the nine local application files listed below. Approved F01/CONTENT modules
were read and consumed without modification. Final source/CSS frozen after the
mobile pacing, Turkish title fit and directory-photo height corrections. The dev
preview on port 3053 was stopped before the lead's coordinated production build.

## Outcome

The homepage renders fifteen ordered semantic chapters in native scroll, with one
H1 and a readable H2 in every chapter. Arrival establishes Türkiye, personal travel,
pilgrimage and groups, with Explore/Plan plus smaller Hajj and Business links. The
three intent worlds coexist in an asymmetric desktop composition and become
cinematic image chapters on mobile. Selecting a world sets the global journey type
and changes later builder/Plan context. Static bronze SVG connects the composition;
H02 mounts no ScrollScene, BronzeJourney, Lenis, parallax or pinning.

The Türkiye threshold, index/map/quick view, three source-backed signature places
and framed Istanbul film lead the company story. The film reuses existing mute,
pause/play, visibility and reduced/data-saving lifecycle behavior. Company proof
consumes the approved profile module, explicitly attributes licensing/accreditation
and the four figures to Company Profile 2025, and omits the ambiguous experience
figure. Nine services retain their Travel/Business/Pilgrimage grouping. Beyond
Türkiye is a compact secondary nine-country directory; four existing FAQs use
native details. Final Plan and WhatsApp keep the conversation/inquiry boundary.

The explorer has all twelve DOM selection buttons, a real Natural Earth map and
selected source photo/note/interests/coordinates with Explore/Add. Arabic reverses
logical presentation while geography/photos and coordinates keep their orientation.
HTML map buttons remain exactly 44×44 CSS pixels, independent of SVG scaling;
leader lines join their separated controls to accurate geographic anchors. Stored
journey IDs produce a labelled conceptual curve. No equal international tab or
competing world atlas remains. Manual selection overrides guided events until
remount. At most two preview photos remain mounted: the last successfully shown
photo stays visible while a newly selected photo loads, including rapid changes.

The shared directory presents four source groups as compact rows beside one large
changing preview, with keyboard/focus preview selection, category filters, Explore
links and global Add actions. It preserves the TurkeyDiscovery public API and
TurkeyDirectory export used by existing pages; this does not approve the later
Türkiye hub's final architecture.

The builder consumes the global journey store and exposes Where / Journey type /
When / Who. Global additions appear in its live ordered summary; accessible reorder
and remove buttons preserve useful focus. Dates/flexible and traveler count remain
local. A GET contact handoff serializes the validated ordered IDs/type, flexible
date text or entered dates, and optional bounded traveler count. Only IDs/order/type
are stored in sessionStorage. The existing contact parser and honest prepared-message
behavior were preserved. Arrival's data-arrival and the builder's existing anchor
integrate with the shell's mobile sticky-CTA suppression.

## Exact files

1. `frontend-v2/components/home-v3/HomeJourney.tsx` — preserved/completed fifteen-chapter
   composition and unique signature shared-image wrappers.
2. `frontend-v2/components/home-v3/HomeArrival.tsx` — static source Istanbul hero,
   proposition/actions/coordinates/route and shell arrival hook.
3. `frontend-v2/components/home-v3/HomeEditorial.tsx` — sourced story/proof/figures,
   process, service groups, secondary international links, native FAQ and final CTA.
4. `frontend-v2/components/home-v3/ServiceWorlds.tsx` — three concurrent visual planes
   with independent global intent selection and ordinary Explore links.
5. `frontend-v2/components/home-v3/JourneyBuilder.tsx` — global store integration,
   four planning steps, local dates/travelers and accessible ordered summary.
6. `frontend-v2/components/travel/TurkeyDiscovery.tsx` — shared explorer and grouped
   directory, global Add, manual override and last-decoded-photo continuity.
7. `frontend-v2/components/turkiye/TurkeyMap.tsx` — reusable accurate SVG geography,
   44px HTML controls/leader lines and conceptual journey route.
8. `frontend-v2/styles/recovery-home.css` — scoped static desktop/mobile/Arabic
   chapter composition, typography, imagery and route presentation.
9. `frontend-v2/styles/recovery-turkiye.css` — scoped explorer/map/directory layout
   and controls, Arabic layout and native mobile map disclosure.
10. `docs/orchestration/recovery/TL-003-H02-delivery.md` — this report.

No deliberate application writes outside those paths. Next dev regenerated
`frontend-v2/next-env.d.ts`; its generated dev-type diff was preserved for the lead's
production regeneration. Ignored executable QA/evidence under `tmp/frontend-qa/`
are local verification artifacts. All unrelated setup/lead documents were preserved.
No dependencies, source data, routing, shell, store API or old motion code changed.

## Actual checks

From `frontend-v2/`, final `pnpm typecheck` and `pnpm lint` exited 0. Final
`pnpm test` exited 0: two files, 32 tests (25 place/related tests and 7 journey tests).
`git diff --check` at repository root exited 0 after removing two extra trailing
blank lines; line-ending notices are informational. An initial typecheck was launched
from the repository root and returned missing manifest; the corrected frontend
command is the passing check recorded here.

Headless Playwright Chromium at `http://localhost:3053`, reduced-motion preference,
EN/AR/TR at 1440×1000 and 390×844 passed the final six-case matrix. Each case was
scrolled through all chapters to load photos; fonts and visible image decoding were
awaited before captures. Checked all fifteen ordered markers, one H1, H2 in each
chapter, zero document horizontal overflow, no broken rendered media and zero page
errors. Full-page captures and hero/intent/explorer/builder viewport crops exist for
every case. Actual chapter-06 bottom / chapter-15 bottom, excluding footer:

| Locale | 1440×1000 | 390×844 |
| --- | ---: | ---: |
| EN | 59.2% | 55.5% |
| AR | 59.2% | 56.4% |
| TR | 59.0% | 55.9% |

Mobile pacing was corrected from the earlier 52–53% opening share by shortening
later proof/service presentation and giving the existing Türkiye signature/film
photography more space. No blank-height spacer was added. The six final captures
correspond to the final homepage source/CSS; the later directory-photo fix affects
only the separate directory and has its own refreshed screenshot/regression run.

Final interaction run passed with zero page errors:

- Business intent updates aria-pressed, builder service and global Plan query.
- Map/signature Add synchronizes builder/header; keyboard reorder keeps boundary
  focus and removal returns focus to the matching destination checkbox.
- Contact GET carries selected Cappadocia, corporate type, flexible date text and
  traveler count 3. Session storage contains only destinations and journeyType.
- Held Yalova/Bursa image requests verify rapid Istanbul→Yalova→Bursa retains decoded
  Istanbul until Bursa loads with at most two mounted preview images.
- Manual selection ignores a later bronze-place guide event.
- Directory retains all twelve rows, focus updates preview, Coast filters to four,
  reset restores twelve, and its Add updates the global journey count.
- Turkish 360/390/430×844 hero text Range bounds all fit the title box. The earlier
  clipped long word was corrected and actual screenshots inspected.
- Sticky Plan waits until after hero and hides at builder; mobile map disclosure
  selects Antalya, all twelve pin bounds measure 44×44, with no document overflow.

## Evidence

Ignored reproducible evidence, captured 5–6 October 2026 with installed Chromium:

- `tmp/frontend-qa/h02/matrix.json` — final six-case chapter/media/overflow/share data.
- `tmp/frontend-qa/h02/{en,ar,tr}-{1440,390}-full.png` — all six full compositions.
- `tmp/frontend-qa/h02/{en,ar,tr}-{1440,390}-{hero,intent,explorer,builder}.png` — crops.
- `tmp/frontend-qa/h02/interactions.json` — final interaction/focus/44px/title bounds.
- `tmp/frontend-qa/h02/en-1440-delayed-preview.png` — decoded fallback during held loads.
- `tmp/frontend-qa/h02/en-1440-directory.png` — final compact directory/large preview.
- `tmp/frontend-qa/h02/tr-{360,390,430}-hero-fit.png` — corrected Turkish mobile title.
- `tmp/frontend-qa/h02-static.mjs` and `h02-interactions.mjs` — repeatable local checks.

Worker visually inspected final Turkish hero, Arabic mobile worlds, desktop worlds,
Arabic explorer/geography, corrected directory image, and Turkish builder crops,
plus the full EN mobile composition. This is implementation evidence, not approval.
The lead has its own production capture/review utility and independent evidence.

## Integration, remaining gates and limits

Global CSS is imported from page components as permitted by the bundled Next CSS
instructions, with distinct recovery/rh/rt scope to avoid retained-stylesheet
collisions after navigation. Shared discovery no longer creates duplicate named
DestinationPortal instances alongside signature imagery or hub directory imagery.
The map/index remain DOM-accessible; essential content does not require hover/WebGL.
The existing noindex/legal-review and prepared-message defaults remain intact.

No source blocker remains at worker freeze. The lead owns the coordinated production
build, no-JS/normal-mode production rendering, public/V3 verification as appropriate,
and independent six-case visual gate. The worker did not run pnpm build or claim
production success. Broader tablet/landscape/final route-family coverage belongs to
later contracted gates. Safari/Firefox, physical devices, assistive technologies,
field performance and physical software-keyboard behavior were not verified.
Advanced motion and subsequent phases remain unstarted by this worker.

Suggested next action: lead production/source/rendered review of this frozen static
implementation; any requested correction should remain narrowly contracted.

## H02-R1 correction delivery — 6 October 2026

Status: IMPLEMENTED; pending independent production/rendered re-review, never
self-approved. Bounded [H02-R1 contract](TL-003-H02-R1.md), same selected Sol
`/root/astra_resume/sol_home_static`; Astra lead `/root/astra_resume` reserved and
released the exact three paths before correction. Original H02 source, passing
journey behavior and static-stage constraints were preserved.

Exact correction writes:

- `frontend-v2/components/home-v3/HomeEditorial.tsx`: HomeBeyond now has natural,
  localized, count-free supporting copy about continuing to international
  destinations. Nine non-Türkiye links/source inventory remain unchanged.
- `frontend-v2/styles/recovery-home.css`: a continuous static bronze vertical line
  and three node markers join the mobile service groups using logical placement
  for Arabic. Existing nine service links keep their 47px minimum height. Mobile
  figures use explicit minmax(0,1fr) columns and fluid, unequal display sizes so
  the full unchanged values remain inside the 22px content gutters.
- `docs/orchestration/recovery/TL-003-H02-delivery.md`: this additive correction
  result; original delivery evidence and earlier review results retained.

No source data, dependencies, store, routing, test scripts or advanced motion changed.
HEAD remains `a4a448b4bfe6bddac2d89cd79634248f7ee88ba3` plus the reported H02/R1 diff.
Next dev's generated next-env type-reference change is again left for the root's
production regeneration, not treated as an authored change.

Actual final correction checks, from frontend-v2: pnpm typecheck exit0, pnpm lint
exit0 and pnpm test exit0 (two files, 32 tests). Repository git diff --check passes.
Targeted headless Chromium dev3053 checks use reduced motion and touch/mobile
emulation: EN/AR/TR at 360/390/430×844, all nine cases PASS, zero page errors and
zero document horizontal overflow. Text Range bounds of every figure value are
inside its actual .rh-wrap bounds, not merely inside the viewport. Continuous
line and all three nodes are rendered, logical side reverses in Arabic, all nine
links remain at least 44px, and Beyond retains nine country links with the new
count-free text. Worker inspected actual EN390/AR390 figures/services and TR360
Beyond captures. No motion was added.

Exact narrative opening ratios after correction, first six chapters / all fifteen:

| Locale | 360×844 | 390×844 | 430×844 |
| --- | ---: | ---: | ---: |
| EN | 54.28% | 55.51% | 55.70% |
| AR | 55.59% | 56.47% | 56.48% |
| TR | 54.54% | 55.88% | 56.40% |

Lead explicitly accepted the EN/TR360 narrow-column text-reflow variance around the
approximate 55–65% narrative target: mandated 390px and 1440px composition remains
within range; no artificial spacer/pacing change was added solely to force a metric.
Desktop composition has no R1 figure/service CSS changes because these corrections
are scoped below 768px; the lead will independently verify actual wider rendering.

Ignored fresh evidence: tmp/frontend-qa/h02-r1/review.json;
`{en,ar,tr}-{360,390,430}-{figures,services,beyond}.png` in that directory; executable
`tmp/frontend-qa/h02-r1.mjs`. In particular, lead-requested screenshots are
`tmp/frontend-qa/h02-r1/en-390-figures.png`, `ar-390-figures.png`,
`en-390-services.png` and `ar-390-services.png`. Element captures may include the
normal fixed mobile Plan overlay at the current viewport's lower edge; root
production viewport captures provide independent composition evidence.

Earlier independent root H02 typecheck/lint/32tests/build passed, with production
six-case/no-JS/planner checks also passing as recorded in the lead review. The actual
legacy verify-public run exited1 after 120 route checks, at its .ribbon-ready canvas
expectation against intentionally static H02. That full-suite failure remains an
explicit compatibility gap, not a PASS; this worker did not edit tests to conceal
it. Separate contracted QA/motion work owns future compatible verification.

Correction application files are frozen and dev3053 stopped for root's coordinated
production build/re-review. No correction-source blockers remain; independent
production and rendered acceptance are still required. No commits, deployment,
user creative acceptance or broader browser/device certification is implied.
