# Motion system — current policy and implementation

28 October 2026. Native scrolling at every breakpoint. Preserve GSAP/ScrollTrigger/
MotionPath controllers, Motion UI/layout, finite CSS entrance and SVG Flight Trace.
Current homepage imports V6Motion; no active global Lenis clock, long hero pin or
mandatory WebGL sculpture. Historical names do not change current architecture.

## Full / System / Reduced

TL-014 explicitly selected Full as first-visit default, including when the OS requests
reduction. This is a deliberate user product decision, not an accessibility recommendation
to disregard system preferences in other products. Explicit System follows OS changes;
explicit Reduced always reduces; explicit Full requests authored scenes subject to
capability/pause fallbacks. Choices remain in the menu and footer.

lib/motion-preference.ts parses tripline-motion; missing/invalid/unreadable storage
resolves to Full without writing a default. Saved System/Reduced remain authoritative.
The nonce-bearing layout bootstrap sets data-motion-choice/effective/layout before paint;
SiteShell hydration uses matching defaults. Preserve prepaint reduction guards. Do not
add an OS/Safari/SaveData veto to explicit Full scenes. SaveData remains a film/media
constraint. Evidence: [TL-014](reports/TL-014-full-motion-default.md), [decisions](DECISIONS.md)
and lib/motion-preference.test.ts.

## Ownership and choreography

- HomeArrival/current CSS own finite entrance; V6Motion owns scene progression/reversal.
- AtlasStage/discovery synchronize selection, photography, masks, routes and markers.
- Phone interactive geography stays stationary so delayed camera motion cannot displace targets (TL-011); decorative/photo motion remains.
- PartnerBillboard provides source-logo movement with user/focus/hover/visibility pause.
- Page controllers and Motion own internal reveals and UI/layout response; FlightTrace preserves identity.
- HeroVideo keeps poster, playback controls, failed-media fallback and offscreen/hidden/network handling.

Use [V6 ownership/timing](qa/2026-10-24-v6/MOTION_OWNERSHIP.md) and current source for actual
timing/amplitude. Cached geometry/idle refresh avoid repeated path/layout reads on scroll.
Clean up contexts, observers, listeners and animation work on unmount/preference changes.
Preserve native wheel/touch/keyboard/anchors, dialogs and query context. Pointer decoration
cannot gate information.

## Responsive, accessibility and fallbacks

Viewport variants tune composition/depth; they do not suppress scenes solely by browser
or viewport identity. Reduced preserves final content/actions and reduces large spatial
motion. Posters/static SVG/capability fallbacks retain content without autoplay/WebGL.
Pause and hidden/offscreen behavior remain. V3 Lenis/height thresholds are historical.

[QA/release](QA_RELEASE.md) defines policy/interaction checks. Windows Playwright WebKit
is not physical iPhone Safari; programmatic scrolling is not physical swipe certification.
Screenshot injection/provider feedback historically caused CSP noise; diagnose source
before changing CSP. Field FPS, physical touch feel and creative approval are separate.
[Historical rules](archive/historical-material/pre-v1-consolidation/docs/MOTION_SYSTEM.md)
preserve superseded context.
