# TRIP LINE V1.1 — MOBILE CREATIVE RECOVERY

## Objective

The current V1 mobile implementation is not creatively accepted.

We are NOT rebuilding the desktop website yet. Our immediate goal is to produce a beautiful, cinematic, responsive mobile experience that can be confidently shown to the Trip Line client.

Starting branch: `codex/trip-line-v1-mobile-review`.

Preserve the verified V1 desktop appearance, business logic, EN/TR/AR translations, journey planning, routing and original identity.

## PHASE 1 — Motion eligibility correction

The user tested the deployed website on a physical iPhone Safari.

With iOS Reduce Motion enabled, animations were largely static. When Reduce Motion was disabled, they worked.

Therefore Safari supports the effects; this is primarily motion-preference handling, not demonstrated browser incompatibility.

Inspect `SiteShell.tsx`, `V6Motion.tsx`, all CSS motion gates, partner billboard and mobile components.

Implement the following:

1. Full Motion should be the normal experience on capable browsers, regardless of desktop/mobile classification.
2. Never disable cinematic effects simply because a viewport is small, input is touch-based or the browser is Safari.
3. Respect explicit system accessibility preferences initially, but provide a clearly accessible Full Motion override that visitors can actively select, alongside System and Reduced modes.
4. Persist the visitor's explicit choice.
5. Remove overly broad motion suppression. SaveData should selectively affect expensive media/network activity rather than unnecessarily disabling all inexpensive animations.
6. Remove the behavior that abruptly completes the hero's opening choreography on the first ordinary touch movement. Allow a coherent scroll-driven departure without blocking scrolling.
7. Ensure mobile ScrollTriggers update correctly when Safari's dynamic browser toolbar changes the visual viewport.
8. Verify Safari support and provide graceful fallbacks for unsupported effects.
9. No forced smooth-scroll engine, oversized pins or scroll hijacking.
10. Maintain pause controls for continuous animations, particularly the partner billboard.

Tests must explicitly report:
- Actual effective motion mode.
- Native mobile Safari support.
- Full-motion mode.
- Reduced-motion mode.
- Touch scrolling.
- Whether major effects produce visibly meaningful transformations.

Never claim physical Safari certification based only on desktop Chromium emulation.

## PHASE 2 — Mobile-first visual reconstruction

This is a genuine art-direction task, not a generic responsive-CSS cleanup.

Use JAECO's level of composition, animation craftsmanship, originality and interaction quality as the creative benchmark.

Do not copy JAECO's artwork, brand or code.

### A. Hero

Recompose the mobile opening around a strong portrait crop of Istanbul.

Design the relationship between logo, headline, photography, route and CTAs.

The first screen must feel deliberate, not cramped or empty.

Create meaningful entrance and departure choreography.

### B. Service Worlds

Replace any awkward vertically stacked desktop-card presentation with a mobile editorial composition.

Give the three travel intents distinct photographic identities and meaningful touch feedback.

Make transition to the next section visually coherent.

### C. Türkiye Explorer

Prioritize this section.

Treat the selected destination photograph as the dominant visual stage.

Create a compact, legible destination-navigation system.

Integrate the map without allowing it to consume too much mobile height.

Use synchronized map, photo, typography and route transitions.

Preserve all twelve destinations and accurate geography.

No touch-hover dependency.

### D. Signature Places

Create mobile-specific Cappadocia, Rize/Ayder and Antalya compositions.

These must have distinct photographic entrances and visible scroll transformations.

Do not merely reuse desktop animations with smaller translate values.

### E. Partners

Keep the single moving billboard.

Improve actual optical logo size, vertical proportion, edge-to-edge appearance and pacing on narrow screens.

Ensure it loops seamlessly and has effective pause behavior.

### F. Remaining sections

Review Story, Film, Services, Process, Journey Builder, FAQ and Final Invitation.

Improve sections that feel generic, excessively long or compositionally weak.

Keep quiet sections quiet where appropriate, but no accidental dead space.

Preserve functional controls and inquiry preparation.

## PHASE 3 — Device-specific creative QA

Inspect complete mobile pages at 320, 360, 375, 390, 430 and 768px, plus short landscape screens.

Verify English, Turkish and Arabic.

Record continuous native scrolling, destination switching, menu interactions, billboard movement and planner operations.

Assess:
- Visual originality
- Portrait photography and focal points
- Typography and hierarchy
- Section rhythm and scroll depth
- Animation visibility and smoothness
- Touch comfort
- Safe areas and browser toolbar behavior
- Performance and reduced-motion handling

Keep desktop screenshots/regression tests to establish that desktop appearance was not unintentionally changed.

If physical Safari cannot be tested from the execution environment, provide an iPhone test checklist and precise evidence request rather than claiming a Safari pass.

## PHASE 4 — Preview delivery

Create a recoverable checkpoint and reviewed branch.

Run all established project checks.

Create a separate Vercel Preview deployment. Do not overwrite the existing production alias or merge to main.

Verify EN/TR/AR, correct media, desktop regression and mobile experience.

Return the exact deployed SHA, URL, before/after phone screenshots, motion recordings, technical results and unresolved device-testing limits.

## Acceptance rule

Passing automated tests is necessary but not sufficient.

The delivered mobile experience must show a meaningful visual improvement in real rendered evidence.

Desktop creative redesign is OUT OF SCOPE.

Stop at a verified mobile V1.1 release for user creative review.