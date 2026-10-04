# Trip Line V3 — The Bronze Journey

2 October 2026; updated by TL-002 on 3 October. Active frontend: `frontend-v2/`.
Branch: `feat/v3-bronze-journey`. Current evidence: [V3 delivery](V3_FRONTEND_DELIVERY.md).

## Current reconstruction — TL-002, 3 October 2026

The [new user specification](tasks/TL-002-reconstruction-instructions.md) supersedes
TL-001's visual composition. Implementation lives in the same active frontend.

- HomeJourney composes arrival/departure, ServiceWorlds, a Türkiye entrance,
  the existing geographic explorer with dominant crossfading media, sequential
  destination portals, film, EditorialStory, source-attributed proof, JourneyBuilder
  and the final route endpoint. Only existing localized content is used.
- ServiceWorlds is a client selector with persistent crossfading media, focus/arrow/
  touch selection and a native disclosure exposing all nine service links. This
  replaces both the three panels and the long horizontal pinned service sequence.
- DestinationJourney composes all twelve detail pages from source place identity,
  interests, imagery, practical planning, service connections and contextual inquiry.
  It reuses DestinationPortal for ordinary shared-image navigation.
- ScrollScene retains one eligible desktop opening pin. Later titles reveal as blocks;
  media parallax stays within 50px. Route drawing connects the Türkiye entrance and
  final arrival. Native touch keeps chapter/state motion without pinning.
- Departure is visible by default. Only an initialized eligible opening gains the
  class that positions it inside the pinned sequence. No-JS, data saver and reduced
  motion therefore retain the actual departure chapter.
- Explorer keeps only active/previous destination images mounted, retains real map
  coordinates and respects manual selection over guided scroll updates.
- JourneyBuilder retains the same GET handoff and reorder controls; supported field
  state now feeds a live summary, stop count, selected photo and route progress.
- The menu keeps native modal/Escape behavior and explicitly cycles Tab within its
  controls. It includes the secondary international directory. No custom cursor.

No dependency, backend, deployment or indexing boundary changed. The current
palette is recorded in [TL-DEC-010](DECISIONS.md#tl-dec-010--full-bronze-journey-reconstruction).
Current completion evidence belongs to [TL-002](reports/TL-002-report.md), not the historical snapshot below.

## Historical TL-001 implementation snapshot

The following preserves the previous implementation's reasoning and verification.
Its horizontal service track and prior layouts are superseded by TL-002.

## Intent and content authority

Follow the line: sculpture → service routes → graphic proof → geography → selected itinerary → inquiry. All twelve Türkiye destinations, nine services, three locales, secondary ten-country directory and existing source notes survive. No prices, inventory, reviews or claims were added. Existing local images and licensed Istanbul film are reused; no new media rights are required by this implementation. The two V3 concept images described in the request were not attached in this chat; implementation follows the supplied written storyboard and repository brand authority.

## Architecture

- `components/experience/ExperienceProvider.tsx`: one Lenis instance on eligible desktop routes; GSAP ticker in seconds advances Lenis in milliseconds. Native touch, keyboard and anchors. Dialog open state pauses Lenis. Nested controls are excluded. Preference changes and route unmount destroy the instance and ticker callback.
- `ScrollScene.tsx`: homepage-scoped GSAP/ScrollTrigger choreography, created top to bottom, with context and media-query cleanup. Desktop opening pins for 130vh of additional scrolling; film expands and the services sequence translates horizontally from vertical progress. Hero copy fades before departure copy; hero keyboard focus restores the opening. Keyboard focus advances the services timeline to its link. Pinning/Lenis require fine input, width >=1024px, height >=800px and no reduced-motion/data-saver preference. Other modes retain vertical layout.
- `BronzeJourney.tsx` / `BronzeJourneyScene.tsx`: client-only dynamic R3F scene, initialized on intersection for eligible fine-pointer screens >=1024px; a twisted, four-sided ribbon mesh along a Catmull–Rom curve. Synthetic reflection cards, no HDR download. `frameloop="demand"`, DPR ≤1.5. Progress/mouse changes invalidate; offscreen and hidden documents do not request renders. Static SVG is always present; the scene crossfades over it. Context loss restores SVG; restoration regenerates reflection render-target pixels. No coarse-input, reduced-motion or data-saver scene. Shared `travel/Ribbon.tsx` is static SVG, as committed in `896f6f5`.
- `DestinationPortal.tsx`: React ViewTransition matching source destination IDs to arrival hero. Bundled Next 16 documentation explicitly supports this without a feature flag. Ordinary Next links keep modified clicks, back/forward and unsupported-browser navigation intact. Shared morph is 450ms; reduced motion disables it. A cold route may use ordinary arrival instead of a shared morph when it suspends.
- `JourneyChapter.tsx`: semantic chapter labels with a graphic route handoff. The homepage remains HTML and useful before JS.
- `ContextCursor.tsx`: optional localized photo caption, desktop fine pointer only, does not hide the system cursor.
- `components/home-v3/`: homepage composition, editorial destination links, three service worlds, film, nine service milestones and journey builder.
- `styles/experience.css`: scoped V3 composition and responsive behavior; original tokens remain in `travel.css`.
- Generic loading UI is scoped to the historical `(public)` route group. Localized public content renders directly and remains visible with JavaScript disabled.

## Journey builder

Destination checkboxes append in selection order. Each selected stop can move earlier/later or be removed using labeled keyboard buttons. A GET form serializes `journey`, primary `destination`, `service`, optional `dates` and `travelers`. There is no account, storage or submission. Contact validates/deduplicates at most twelve known IDs, uses localized names to prefill an editable message, and preserves the established WhatsApp/email preparation flow. Dates are length-bounded; travelers must be 1–999. Relevant form edits clear prepared output. Query context survives locale switching.

Reordering retains usable focus at either boundary; removal returns to the destination
checkbox. A localized live status exposes the ordered route. Controls are at least
44px wide. The no-JS baseline provides content/navigation and direct contact links;
interactive planner state and message preparation require JavaScript.

## Responsive and accessibility behavior

- ≥1280: full hero depth; eligible tall/fine-input screens add pinning, spatial service planes and horizontal services. Contextual photo caption requires a mouse/fine pointer.
- 1024–1279: same route with smaller composition; no contextual caption.
- 768–1023: native scrolling, static bronze route, editorial service panels, two-column services.
- 360–767: native vertical chapters, SVG hero, stacked destination links, connected service milestones, single-column planner and full-screen menu. No essential action requires hover/drag.
- Arabic preserves connected text, logical spacing and RTL controls. Maps, photographs and the geographic line retain their orientation. Horizontal service DOM order is unchanged and each item retains RTL text.
- Reduced-motion: native scroll, no pin/camera flight, static route, final figures, no automatic film download and no shared-image motion. All content and actions remain in the same reading order.
- Existing dialog, Escape, focus return, skip link, explicit film controls, visibility pause, form error focus, noindex and legal review states remain authoritative.

## Baseline and QA procedure

V2 baseline: frozen install, typecheck, lint and build passed. First browser run encountered transient duplicate inquiry controls following navigation; repeat passed all 120 routes, six screenshots and all assertions with zero browser errors. Both outputs retained under ignored `tmp/frontend-qa/v3-baseline*.json`. Port 3003 was occupied, so this work uses a separate production preview.

Run from `frontend-v2/`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`;
start a production preview, then run `verify-public.mjs`, `verify-v3.mjs` and
`verify-v3-resilience.mjs` from `scripts/` with `QA_URL=http://localhost:3013`
(PowerShell uses `$env:QA_URL`). Vitest currently finds no tests; report this gap.
Generated files remain under ignored `tmp/frontend-qa/`; selected durable evidence
and exact coverage are linked from `V3_FRONTEND_DELIVERY.md`.

No deployment is authorized. Legal approval, current claim/partner confirmation and media sign-off remain publication requirements.
