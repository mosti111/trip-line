# Trip Line V3 — The Bronze Journey

2 October 2026. Active frontend: `frontend-v2/`. Branch: `feat/v3-bronze-journey`.

## Intent and content authority

Follow the line: sculpture → service routes → graphic proof → geography → selected itinerary → inquiry. All twelve Türkiye destinations, nine services, three locales, secondary ten-country directory and existing source notes survive. No prices, inventory, reviews or claims were added. Existing local images and licensed Istanbul film are reused; no new media rights are required by this implementation. The two V3 concept images described in the request were not attached in this chat; implementation follows the supplied written storyboard and repository brand authority.

## Architecture

- `components/experience/ExperienceProvider.tsx`: one Lenis instance on eligible desktop routes; GSAP ticker in seconds advances Lenis in milliseconds. Native touch, keyboard and anchors. Dialog open state pauses Lenis. Nested controls are excluded. Preference changes and route unmount destroy the instance and ticker callback.
- `ScrollScene.tsx`: homepage-scoped GSAP/ScrollTrigger choreography, created top to bottom, with context and media-query cleanup. Desktop opening pins for 130vh of additional scrolling; film expands and the services sequence translates horizontally from vertical progress. Keyboard focus advances the services timeline to its link. Layout is vertical before enhancement and at mobile/tablet sizes.
- `BronzeJourney.tsx` / `BronzeJourneyScene.tsx`: client-only dynamic R3F scene; a twisted, four-sided ribbon mesh along a Catmull–Rom curve. Synthetic reflection cards, no HDR download. `frameloop="demand"`, DPR ≤1.5. Progress/pointer changes invalidate; offscreen and hidden documents do not request renders. Static SVG is always present; the scene crossfades over it. Context loss restores SVG. No mobile or data-saver scene.
- `DestinationPortal.tsx`: React ViewTransition matching source destination IDs to arrival hero. Bundled Next 16 documentation explicitly supports this without a feature flag. Ordinary Next links keep modified clicks, back/forward and unsupported-browser navigation intact. Shared morph is 450ms; reduced motion disables it. A cold route may use ordinary arrival instead of a shared morph when it suspends.
- `JourneyChapter.tsx`: semantic chapter labels with a graphic route handoff. The homepage remains HTML and useful before JS.
- `ContextCursor.tsx`: optional localized photo caption, desktop fine pointer only, does not hide the system cursor.
- `components/home-v3/`: homepage composition, editorial destination links, three service worlds, film, nine service milestones and journey builder.
- `styles/experience.css`: scoped V3 composition and responsive behavior; original tokens remain in `travel.css`.

## Journey builder

Destination checkboxes append in selection order. Each selected stop can move earlier/later or be removed using labeled keyboard buttons. A GET form serializes `journey`, primary `destination`, `service`, optional `dates` and `travelers`. There is no account, storage or submission. Contact validates/deduplicates at most twelve known IDs, uses localized names to prefill an editable message, and preserves the established WhatsApp/email preparation flow. Dates are length-bounded; travelers must be 1–999. Relevant form edits clear prepared output. Query context survives locale switching.

## Responsive and accessibility behavior

- ≥1280: full hero depth, short pin, spatial service planes, horizontal services, contextual photo caption.
- 1024–1279: same route with smaller composition; no contextual caption.
- 768–1023: native scrolling, static bronze route, editorial service panels, two-column services.
- 360–767: native vertical chapters, SVG hero, stacked destination links, connected service milestones, single-column planner and full-screen menu. No essential action requires hover/drag.
- Arabic preserves connected text, logical spacing and RTL controls. Maps, photographs and the geographic line retain their orientation. Horizontal service DOM order is unchanged and each item retains RTL text.
- Reduced-motion: native scroll, no pin/camera flight, static route, final figures, no automatic film download and no shared-image motion. All content and actions remain in the same reading order.
- Existing dialog, Escape, focus return, skip link, explicit film controls, visibility pause, form error focus, noindex and legal review states remain authoritative.

## Baseline and QA procedure

V2 baseline: frozen install, typecheck, lint and build passed. First browser run encountered transient duplicate inquiry controls following navigation; repeat passed all 120 routes, six screenshots and all assertions with zero browser errors. Both outputs retained under ignored `tmp/frontend-qa/v3-baseline*.json`. Port 3003 was occupied, so this work uses a separate production preview.

Run from `frontend-v2/`: `pnpm typecheck`, `pnpm lint`, `pnpm build`; start a production preview, then `QA_URL=http://localhost:3013 node scripts/verify-public.mjs` (PowerShell uses `$env:QA_URL`). Extended V3 script adds planner, navigation, fallback and responsive evidence. Generated files remain under ignored `tmp/frontend-qa/`. Final results and actual browser coverage belong in `V3_FRONTEND_DELIVERY.md`.

No deployment is authorized. Legal approval, current claim/partner confirmation and media sign-off remain publication requirements.
