# Bronze Journey — V3 delivery

3 October 2026, Europe/Istanbul. Active frontend: `frontend-v2/`.
Task: [TL-001](tasks/TL-001-bronze-journey-continuation.md).
Report: [recovery and implementation](reports/TL-001-report.md).

Status: completed engineering delivery baseline; all three production browser
scripts pass with zero unexpected errors. No deployment or publication.
Verified application/QA revision: `b03c2a7`; delivery documentation follows separately.

## Result

The existing Bronze Journey has been stabilized without replacing its approved
teal/sand/bronze identity or chapters. The opening sculpture and departure dissolve,
service worlds, proof, geographic discovery, destination portals, film, service
milestones, ordered itinerary and contextual inquiry remain one connected journey.
Twelve Turkish destinations lead; ten-country discovery and nine services remain.
All content routes retain EN/AR/TR and Arabic RTL without mirrored geography/images.

The continuation corrected no-JS rendering, Arabic service-track positioning,
short-height/coarse-input enhancement, planner focus and WebGL reflection recovery.
Departure copy now follows the hero message instead of competing with it. Details
and architecture rationale are in [TL-DEC-009](DECISIONS.md#tl-dec-009--v3-resilient-rendering-and-enhancement-eligibility).

## Verification

Node 24.19.0, installed Next 16.3.6/Playwright Chromium on Windows.
Commands run from `frontend-v2/`:

| Check | Result |
| --- | --- |
| `pnpm typecheck` | Pass |
| `pnpm lint` | Pass |
| `pnpm build` | Pass |
| `pnpm test` | Exits 1: no Vitest test files. Missing suite, not a passing suite |
| `node scripts/verify-public.mjs` | 120 localized routes, six screenshots and public interactions |
| `node scripts/verify-v3.mjs` | 60 page/viewport cases plus interaction/fallback checks |
| `node scripts/verify-v3-resilience.mjs` | Render-idle measurement, real context recovery, unavailable WebGL, invalid video, live preference/route cleanup |

Browser commands use `$env:QA_URL='http://localhost:3013'` against
`pnpm start --port 3013`. The retained standalone configuration emits a warning
for this local preview procedure. No deployment packaging was claimed or changed.
Durable JSON and selected screenshots: [dated V3 evidence](qa/2026-10-03-v3/README.md).

### Actual Chromium coverage

- Every one of the 120 localized content URLs returns 200 with one main heading.
  Missing pages return branded HTTP 404. Noindex and language redirect remain.
- Homepage in **EN/AR/TR at 360, 390, 430, 768, 1024, 1280, 1440px**.
- Türkiye discovery, Rize & Ayder, Hajj/Umrah, international directory, inquiry and
  404 in **all three locales at 390 and 1440px**. Additional tablet cases: English
  business, Turkish Antalya and Arabic inquiry at 768px.
- Landscape Arabic home 844×390; short-height 1280×600 in all three locales.
  Touch/coarse emulation at 390 and 1280px includes planner and modal use.
- Device reduced motion in all locales at 1440px; explicit remembered preference
  and live preference changes; data saver; no-JS homepage in all locales plus
  representative service/destination/contact content.
- Ordered itinerary selection/reordering/removal, localized query handoff, invalid
  traveler/unknown destination sanitization, form validation and prepared-message
  invalidation. No external inquiry was sent.
- All nine pinned-service links visible on focus in every locale; hero focus restores
  its readable state; menu Escape/focus return and short-height footer reachability.
- Manual atlas choice survives guided updates. EN/AR geographic path and transform
  equality checked. Portal links, refresh and browser back/forward checked; a shared
  morph is enhancement and is not guaranteed on every cold navigation/browser.
- Local film decoding and pause/resume; simulated hidden-document/offscreen pausing;
  undecodable film poster/manual-play fallback. Actual WebGL context loss/restoration
  and initial WebGL unavailability leave content and navigation working.

Expected 404 resource diagnostics and deliberately induced WebGL initialization
errors are distinguished from unexpected browser errors. The failure-injection
test records expected renderer errors separately. No production CSP was relaxed.

### Visual review and performance

Viewport captures were inspected for hero type/crops, departure readability, service
planes, atlas orientation, Arabic service sequence, planner, final CTA/footer and
mobile menu/contact layouts. This review found and fixed the overlapping departure
message and lost metallic reflections after real context restoration. Automated
page captures check heading count, overflow and broken loaded images; these checks
alone do not certify aesthetic quality.

Measured **zero WebGL draw calls** over sampled idle, hidden-document and offscreen
intervals. Mouse input invalidates the scene; touch does not. Preference changes
and homepage exit remove pins and scrolling enhancement. A 4× CPU-throttled mobile
navigation plus planner selection completed; elapsed time is recorded in JSON as a
local observation, not a benchmark, frame-rate guarantee or Core Web Vitals result.
No new dependency, HDR asset or permanent WebGL render loop was added.

## Limitations and publication boundary

No known V3 feature is left behind a completed implementation label. The Vitest
suite is absent. Safari/Firefox, physical phones, field performance and a full
assistive-technology/200% text-zoom audit were not verified. A limited enlarged-base-
text probe and emulated touch do not establish physical-device accessibility.
The original two missing V3 concept images were not claimed as inspected. User
aesthetic acceptance remains separate from this engineering delivery baseline.

Legal wording, current claims/partners, media sign-off, canonical domain/deployment
configuration and explicit publication/indexing authorization remain launch inputs.
Noindex/legal-review defaults are retained. Inquiry prepares editable WhatsApp/email
messages only; backend/CMS, server persistence, reservations, accounts and payments
remain outside this work.
