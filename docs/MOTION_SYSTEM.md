Current V6 uses native scrolling, scoped GSAP/ScrollTrigger/MotionPath for scene motion, Motion for UI state/layout and CSS for bounded interaction. No new scroller, mandatory WebGL or runtime dependency. [V6 ownership/timings](qa/2026-10-24-v6/MOTION_OWNERSHIP.md) and [delivery](reports/TL-007-v6.md) supersede conflicting historical choreography below.

Current V5: native scroll at all breakpoints; no active Lenis, long hero pin or mandatory homepage Three scene. Read [TL-006](tasks/TL-006-v5.md), [solo workflow](orchestration/TRIP_LINE_V5_SOLO.md) and [verification](reports/TL-006-v5.md). CSS owns finite arrival, GSAP selected direct route strokes, Motion interactions/list layout. Older implementation snapshots below remain historical.

# Trip Line motion system

Authority for future motion work, consolidated 3 October 2026 from the approved identity,
[delivery baseline](FRONTEND_DELIVERY.md) and [Bronze Journey](V3_BRONZE_JOURNEY.md).
These are requirements; code existence does not certify performance or browser QA.
Motion creates continuity, hierarchy, anticipation, depth and narrative progression.

## Layer 1 — ambient motion

Keep environmental movement very low intensity: hero media, subtle object drift,
slow spatial movement and controlled media parallax. Never compete with text.
Film retains a poster, explicit pause/play, visibility pausing and motion/data-saver
fallback. Do not block first meaningful content or require autoplay to explain it.

## Layer 2 — scroll narrative

Use mask/text reveals, route progression, spatial transformations, section transitions
and controlled parallax to explain relationships. Coordinate section rhythm rather than
animating every element independently. Content is readable in DOM order before enhancement
and remains coherent without pinning or horizontal timelines.

Current V3 uses homepage-scoped GSAP/ScrollTrigger and one eligible desktop Lenis instance.
Eligibility requires width >=1024px, height >=800px, fine input and no reduced-motion
or data-saver preference; other modes keep the native vertical composition.
Native touch, keyboard, anchors and nested inputs remain authoritative; opening the modal
pauses smooth scrolling. Clean up media-query contexts, observers, listeners and ticker
callbacks on route/preference changes and unmount. See [V3 architecture](V3_BRONZE_JOURNEY.md);
do not install another scrolling clock or casually replace Motion/GSAP/Lenis.

## Layer 3 — interaction response

Buttons, links, destination/service selectors, image previews, menu and atlas selection
respond quickly and with restraint. Hover and focus communicate meaningful state;
no essential information depends on hover. Keep practical touch targets and keyboard operation.
Shared destination-image transitions preserve ordinary navigation, modified clicks
and unsupported-browser fallback; they must not delay actions.

Earlier timing references (650–850ms reveals, 900–1200ms image reveals, small lifts/arrow
shifts) are tuning guidance, not a mandatory animation for every element. Current
destination portals specify 450ms shared morphs, disabled for reduced motion.

## Layer 4 — 3D

Three.js/R3F is a storytelling layer. The bronze route/ribbon connects opening,
services, geography and inquiry; preserve it as identity.

- Dynamically load client scenes and lazily initialize expensive work.
- Cap DPR (current V3 cap: 1.5); reuse/dispose geometry and materials appropriately.
- Use demand rendering; stop unnecessary rendering when idle/offscreen/document hidden.
- Supply static SVG/poster fallback and restore it on WebGL/context failure.
- Keep content and navigation independent of WebGL.
- Avoid huge environments, unnecessary textures, heavy post-processing and shadows.

Current V3 BronzeJourney keeps SVG present and initializes on intersection at ≥1024px
with fine input unless motion is reduced or data-saving is requested. Restored
WebGL contexts regenerate reflection textures. Shared Ribbon is static SVG.
Do not assume every route uses the homepage scene.

## Motion accessibility

Device reduced motion and the site's explicit reduction preference meaningfully reduce
parallax, large camera movement, repeated object movement, elaborate reveals, scroll pins
and shared-image motion. Suppress automatic film loading where appropriate. Show final
text/figures and preserve content, reading order and actions.

## Input awareness

Avoid pointer-follow effects on coarse pointers. Touch must not rely on hover or precise
pointer movement. The current contextual caption is optional and retains the system cursor.
Simplify effects on smaller screens without losing the narrative.

## Performance and verification

Prefer transforms/opacity for common motion. Motion never justifies blocking first content,
permanent high-frequency idle rendering, huge media, scroll jank, layout thrashing or
client hydration without value. Clean up all observers/listeners/animation loops.
Test full/reduced motion, mobile/tablet, fine/coarse input, keyboard, Arabic and WebGL
failure against production. Record results and limitations; V2 QA does not sign off V3.
