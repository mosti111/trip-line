# TRIP LINE V6.1 — CREATIVE RECONSTRUCTION
## Türkiye Atlas · Cinematic Scroll · JAECO-Level Craft · Partner Billboard

**Repository:** https://github.com/mosti111/trip-line  
**Application:** `frontend-v2`  
**Starting point:** Current local `codex/trip-line-v6` branch  
**Model:** GPT-6.1 Sol, Medium reasoning  
**Execution:** One agent, sequential verified checkpoints

## OBJECTIVE

Trip Line V6 is functional and has a working motion system, but its overall design remains too generic.

The user provided screenshots and recordings demonstrating that the current Türkiye Explorer looks like a conventional destination-selection dashboard.

The user also rejected the partner section, the weak scene transitions and several ordinary editorial layouts.

You are authorized to **substantially redesign and reimplement the specified visual components and animations**.

Do not rebuild the whole application or replace established business logic.

### Quality benchmark

https://www.jaeco.fr/

The target is JAECO's level of creative execution:

- Powerful compositions.
- Large, immersive media.
- Scroll scenes that visibly transform.
- Purposeful changes of depth, scale and position.
- Hover interactions that affect the composition.
- Strong contrast between animated and quiet sections.
- A continuously moving editorial logo billboard.
- Distinctive branded transitions.

Do not copy JAECO's code, visual identity, assets, typography, games or page layout.

Trip Line must remain an original Türkiye-first travel experience.

---

# 1. PRESERVE THE EXISTING APPLICATION

Before editing:

1. Inspect the real Git branch, HEAD and worktree.
2. Preserve tracked/untracked user work.
3. Create a recoverable checkpoint.
4. Create a dedicated `codex/trip-line-v6-creative-rework` branch, or a safely differentiated equivalent if that branch already exists.
5. Preserve existing V6 code, test evidence and assets.
6. Do not run destructive reset, clean or stash operations.
7. Do not activate the old multi-agent workflow.

Preserve:

- The original stacked Trip Line logo.
- Teal, ivory, sand and bronze identity.
- Manrope and Noto Sans Arabic.
- All twelve Turkish destinations.
- Existing geographic data.
- Nine service pages.
- EN/TR/AR localization.
- JourneyStore, itinerary ordering and inquiry preparation.
- Existing navigation and valid URLs.
- Native browser scrolling.
- Reduced-motion accessibility.
- Decoded-image loading protection.
- Existing media provenance.
- Legal/noindex and publication restrictions.

Do not introduce a new scroll engine or routing framework.

## Relevant source ownership

Inspect actual local files before editing:

- `frontend-v2/components/travel/TurkeyDiscovery.tsx`
- `frontend-v2/components/turkiye/TurkeyMap.tsx` or actual map component path
- `frontend-v2/components/home-v3/HomeArrival.tsx`
- `frontend-v2/components/home-v3/HomeJourney.tsx`
- `frontend-v2/components/home-v3/ServiceWorlds.tsx`
- `frontend-v2/components/home-v3/HomeEditorial.tsx`
- `frontend-v2/components/travel/SiteShell.tsx`
- `frontend-v2/components/v6/V6Motion.tsx`
- `frontend-v2/components/v6/TravelNetwork.tsx`
- `frontend-v2/components/v6/MemoryStack.tsx`
- `frontend-v2/components/v6/ServiceDirectory.tsx`
- `frontend-v2/components/v6/JourneyTransfer.tsx`
- `frontend-v2/styles/v6-motion.css`
- `frontend-v2/public/brand/network/inventory.json`

Some paths are based on the latest audit. Verify paths before modifying them.

---

# 2. FIRST: CONFIRM THE FULL-MOTION BASELINE

The previous audit identified a crucial issue:

The live browser was using `prefers-reduced-motion: reduce`, which intentionally activated V6's static layout.

The user has since enabled full motion and confirmed that animations now work.

Do not mistakenly classify the existing reduced-motion fallback as a runtime failure.

Record before/after evidence in both modes.

### Baseline requirements

At 1440×900 in normal motion:

- Verify effective `prefers-reduced-motion` state.
- Verify manual motion preference.
- Verify SaveData eligibility.
- Verify that GSAP ScrollTriggers initialize.
- Verify actual scroll-linked progress changes.
- Verify the current partner marquee moves.
- Verify selected destination animations.
- Record a complete normal-motion baseline.

Then repeat representative checks under reduced motion.

Do not modify system preferences or secretly override reduced motion to make the design appear animated.

Record effective preference state in QA evidence.

---

# 3. PRIORITY ONE — COMPLETE TÜRKIYE EXPLORER RECONSTRUCTION

## 3.1 Why the current design fails

The current Explorer uses three visibly disconnected columns:

1. A tall, conventional destination list.
2. A small Türkiye map dominated by numbered circles.
3. A rectangular destination photograph with text below.

This looks more like a dashboard than an immersive travel experience.

**Replace that composition.**

Keep the real data, map geography and planner interactions.

## 3.2 New concept: THE LIVING TÜRKIYE STAGE

The entire section becomes one coordinated environment.

### Desktop baseline: 1440×900

The section has three visual layers rather than three separate dashboard cards.

**Layer A — Photographic stage**

A large destination photograph occupies approximately 60–70% of the primary composition.

It must feel like the background of the experience, not an isolated card.

Use a strong source photograph for each selected destination.

The main image should occupy the middle/right stage, with dynamic crop, responsive mask and a protected area for readable content.

**Layer B — Editorial destination navigation**

Place a compact editorial destination index along the left side.

Target width: approximately 250–300px.

Maintain all twelve destinations.

Reduce unnecessary row height while keeping touch targets accessible.

Active destination:

- Larger editorial destination number.
- Bronze locator/route cue.
- More expressive typographic weight.
- An animated line extending toward the map or image stage.
- Clearly visible selection.

Inactive destinations should remain easy to scan.

Use no individual boxed backgrounds for every row.

Do not make the list consume nearly the entire visible section without any relationship to the image.

**Layer C — Geographic atlas overlay**

The actual Türkiye map becomes a meaningful part of the photographic composition.

Position a larger, cleaner geographic representation within the main stage, without obscuring the landscape's focal point.

The map should have a minimum useful visual width on desktop, determined by legibility rather than decorative scale.

Use real geographic pins.

Replace the visual dominance of large numbered circles with smaller, elegant markers.

The selected marker becomes the visual focus.

The route connects the existing active location to the newly selected location without inventing road distances, travel durations or transport availability.

Do not distort the map.

### Geographic movement

Map transitions use a bounded 2D transform.

Translate and scale only enough to make selected-region emphasis noticeable.

Maintain enough context that the shape of Türkiye remains legible.

No aggressive map spinning, distortion or fake globe rotation.

### Title placement

The selected destination title must be integrated into the photographic stage.

At 1440×900, the active destination name and main Explore action must be visible without requiring the user to scroll an additional screen.

Do not place the most important title entirely below the fold, as in the current screenshot.

Use large, confident typography.

Keep coordinates and supporting copy readable without letting them dominate.

---

# 4. TÜRKIYE EXPLORER — MOTION CONTRACT

One destination selection drives one coordinated transition.

Do not animate each visual element independently without shared sequencing.

### Stage 1: Immediate acknowledgment — 0–100ms

On destination click/activation:

- Semantic active destination changes immediately.
- List highlight begins.
- Selected map marker updates.
- Screen-reader selection feedback updates.
- Relevant journey action targets the correct destination.

### Stage 2: Geographic travel — 80–320ms

- The previous marker releases its emphasis.
- A bronze route moves toward the selected destination.
- The new location is highlighted.
- The geographic stage moves with bounded translation.

Path geometry must be based on actual destination coordinates.

Do not measure native SVG path geometry every animation frame during wheel input.

Cache paths and geometry where possible.

### Stage 3: Photographic transformation — after media readiness

Use a directional mask reveal over approximately 500–650ms.

The new photograph should feel as though it opens through the current scene.

Different transitions may use distinct directions based on the geographic relationship, but the core system must remain consistent.

Use original mask geometry rather than random wipes.

Retain the previous decoded photograph until the new one is ready.

No blank frames.

### Stage 4: Typographic arrival

Overlap the final approximately 200–300ms of the photograph transition.

- Previous title exits through a restrained editorial mask.
- New title enters through its own mask.
- Coordinates settle.
- Supporting copy and CTA become visually associated with the new photograph.

Do not split connected Arabic text into characters.

### Stage 5: Interruption

If the user selects another destination during animation:

- Latest selection wins.
- Cancel/redirect prior visual transitions.
- Do not queue stale images.
- Preserve valid focus.
- Do not allow old callbacks to commit a previous destination.
- Do not update global journey selection just because a destination was hovered.

### Hover behavior

Desktop fine-pointer hover previews the destination through a clear, lightweight response.

Actual persistent selection occurs on click/keyboard activation.

Do not cause expensive full-screen transitions on every accidental hover.

Keyboard and touch users get equivalent meaningful feedback.

### Scroll entrance

Build an authored scene entrance using actual page progress:

- Geographic layer reveals.
- Photographic stage expands into position.
- Destination index aligns with the stage.
- Flight Trace enters from the preceding chapter.

No arbitrary multi-viewport pin.

Native scroll must remain directly responsive.

When scrolling backward, the visual transformation reverses coherently.

### Reduced-motion alternative

All essential content is readable immediately.

No route flight, camera movement, perspective or masked photographic transformation.

Destination changes are still immediate and accessible.

---

# 5. PRIORITY TWO — REBUILD THE PARTNER BILLBOARD

The user explicitly wants a moving billboard like JAECO's partner section.

The current large white section with small scattered logos is rejected.

## 5.1 Actual logo inventory

Use the existing source-backed inventory in:

`frontend-v2/public/brand/network/inventory.json`

The latest audit identified:

- 16 commercial marks from the company profile.
- Three separate institutional/association/platform marks.

Preserve the exact nineteen inventory records and original source provenance.

Do not invent logos.

Do not substitute AI-generated brands.

Nusuk and Homey identification have unresolved details; preserve those uncertainties.

The company profile is from 2025, so presence in it is not independent verification of a current partnership or endorsement.

## 5.2 New layout

**ONE HORIZONTAL COMMERCIAL LOGO RAIL.**

Do not default to two rows.

Design:

- Full-width, clipped editorial strip.
- A small stationary heading above or beside it.
- Strong visual contrast.
- Large original logos with consistent optical weight.
- No card borders or individual boxes.
- No bouncing, scaling or fading as logos cross the viewport.
- No isolated logos orphaned on separate rows.
- No giant white section.

Use either warm ivory with dark marks or deep teal with light marks, selecting the treatment that preserves actual logo legibility and brand fidelity.

Do not recolor commercial marks in ways that misrepresent their official identity.

Use source-backed high-resolution logo assets if legitimately obtainable.

When original crops contain baked-in whitespace, account for the actual visible ink rather than simply increasing the container.

## 5.3 Billboard motion

The track runs continuously at constant linear speed.

Start with approximately:

- 52 CSS px/s on desktop.
- 32 CSS px/s on mobile.

Tune based on actual visual recordings.

Important:

The animation must be independent of scrolling.

Its velocity must not depend on wheel input.

No acceleration or easing at loop boundaries.

Use repeated identical groups to create seamless translation.

Measure the real width of one full group, including gaps.

Ensure repeated content covers the entire visible track through the complete cycle.

Do not assume two groups are enough at 1920px or 2560px.

The existing audit identified a possible coverage problem because a single eight-logo group was shorter than a wide desktop viewport.

Validate three full cycles at:

390px, 768px, 1024px, 1440px, 1920px and 2560px.

No blank gap.

No noticeable jump at reset.

No logo order discontinuity.

### Pause and accessibility

- Provide a persistent Pause/Play control.
- Hover/focus pause is an additional convenience.
- Do not pause merely because the pointer enters whitespace elsewhere in the section.
- Resume at the exact visual position where motion stopped.
- Document-hidden and offscreen states suspend unnecessary animation.
- The button accurately reflects actual effective motion state.
- Reduced motion displays a separately designed balanced logo layout.
- No repeated accessible duplicates.
- Institutional marks remain outside the moving commercial rail, correctly classified.
- Client publication approval remains required.

Use the existing CSS/GSAP capabilities.

No new carousel framework.

## 5.4 Partner bar acceptance

Provide:

- A 15-second normal-speed recording.
- Full three-cycle recordings or quantitative seam verification.
- Pause/resume recording.
- Desktop and mobile screenshots.
- Reduced-motion screenshot.
- Asset inventory/provenance report.

The marquee must visibly resemble a continuous billboard—not a standard logo grid.

---

# 6. PRIORITY THREE — HERO TO SERVICE WORLDS

The opening must become a connected cinematic passage.

Keep the existing Istanbul photographic subject and original logo.

Do not use a giant 3D bronze sculpture.

Do not reinstate the V4 long hero pin.

## Hero scene

Create three coordinated visual planes:

1. Istanbul photograph.
2. Original Flight Trace and small airplane.
3. Stable interactive headline and actions.

The photo can move at a different rate from the foreground decoration.

Keep controls usable from initial render.

### Departure choreography

During the first approximately 65vh of normal scroll travel:

- Istanbul photography recedes subtly.
- Hero typography departs along a restrained, readable trajectory.
- Flight Trace moves toward the Service Worlds stage.
- The next section's photographic surfaces enter through deliberate masking.

The receiving path must visually match the departing path.

No sudden line disappearance or unrelated SVG entering from nowhere.

Target endpoint alignment within approximately 8 CSS px after viewport-specific measurement.

Do not obscure actions or delay natural scrolling.

## Service Worlds composition

Rebuild the current disconnected white-card layout.

Three choices remain:

- Explore & Holiday.
- Hajj & Umrah.
- Corporate.

The three photographs should meet visually around a shared route junction.

Holiday may use the most expressive photographic transformation.

Pilgrimage should remain calm and respectful.

Corporate should communicate coordination and professionalism.

On hover/focus:

- Active photograph changes depth and scale.
- Its heading and action reposition coherently.
- Other images react with smaller supporting movement.
- Active route branch receives emphasis.
- Selection state persists independently of hover.

Keep images clipped inside stable interactive frames.

Avoid layout jumps.

Mobile uses independent touch-based composition, not hover simulation.

---

# 7. PRIORITY FOUR — SIGNATURE PLACES

The existing three destination sections feel like separate image/text blocks.

Replace them with **three visually connected photographic scenes**.

Destinations remain:

- Cappadocia.
- Rize/Ayder.
- Antalya.

## Scene A: Cappadocia

A broad cinematic horizon.

The photograph enters through a rising aperture.

Typography is integrated into the image composition.

Use shallow land/sky parallax.

Do not artificially animate static balloons as though they were independent realistic objects.

## Scene B: Rize/Ayder

A vertically expressive composition.

Use the region's mountain forms and depth.

Photographic movement travels subtly downward as the user advances.

Use a descending Flight Trace segment.

No generic repeated card transition.

## Scene C: Antalya

A wide lateral landscape.

Photographic masking reveals the coast.

Its departure moves into the next chapter without a sudden visual cut.

## Shared behavior

Suggested travel window: approximately 45–70vh per scene in normal document flow.

Readable central state: approximately 25–40vh.

Desktop perspective limits:

- RotateX: maximum approximately 4°.
- RotateY: maximum approximately 3°.
- Photo parallax: no more than about 6%.

Those are upper limits, not animation targets.

The scene should feel like real landscape depth, not rotating UI cards.

No unnecessary blank scroll spacers.

On mobile, remove perspective and use well-composed 2D photographic entrances.

Keep actual destination links and Add to Journey controls.

---

# 8. PRIORITY FIVE — FINAL INVITATION

The current ending feels like another photo banner.

Redesign it as the final destination of the visual narrative.

The user has traveled through imagery, destinations, geographic routes and planning.

The final scene should visually acknowledge that progression.

### Composition

Large Antalya coast photograph.

Confident typography.

Existing real Plan Journey and WhatsApp actions.

A final Flight Trace segment ending near the primary CTA.

### Interaction

As the section enters:

- Photograph expands toward its final composition.
- Headline settles.
- Route visibly approaches the plan action.
- The small airplane reaches its final point and stops.

Do not loop it indefinitely.

If the visitor already selected destinations, optionally show a concise, truthful summary using existing JourneyStore state.

If the journey is empty, use a general invitation.

Do not invent an itinerary or booking confirmation.

Preserve the existing prepared-inquiry behavior.

---

# 9. SUPPORTING REWORK — USE CREATIVE JUDGMENT

Inspect the following existing components after the five priority areas.

Only change them when there is a demonstrable visual improvement.

## Company Story

Current photographic collage is serviceable but generic.

Have real photographic memories arrive and assemble around one editorial anchor.

The composition should support the company's source-based story.

Do not pretend destination photographs represent actual Trip Line employees.

Use only appropriately licensed or client-approved imagery.

## Services Directory

Keep all nine existing links.

Create a sticky editorial introduction with flowing service entries where appropriate.

The active service should visibly connect to a changing photographic preview.

Use the existing decode-first protection.

Keep pointer-follow effects bounded and keyboard previews stationary.

## Navigation

Preserve all working menu and focus behavior.

Improve image-preview hierarchy, active destination typography and menu composition if current visual review justifies it.

Don't replace reliable navigation simply to add decorative animation.

## Journey Builder

Preserve all existing business logic.

Improve the empty state: it should not imply a selected destination when none exists.

Make each added stop visibly extend the itinerary.

Decorative thumbnail transfer must never delay state updates.

Retain accessible reorder controls.

## Film / FAQ / quieter sections

Do not force motion into everything.

The Bosphorus film needs strong framing and a purposeful entrance.

The FAQ should remain calm and readable.

Maintain contrast between expressive scenes and quiet information sections.

---

# 10. MOTION IMPLEMENTATION RULES

Use existing:

- GSAP / ScrollTrigger.
- Motion for React.
- SVG masks, paths and original artwork.
- CSS transform and opacity.
- Browser View Transitions where already supported.

No new smooth-scroll engine.

No mandatory WebGL.

No unnecessary runtime dependency.

Each property has one animation owner.

Keep scroll-driven transformations on separate wrappers from interactive hover transforms.

Scoped animation cleanup is mandatory.

Don't read layout or sample SVG geometry from every wheel callback.

Preserve V6's geometry caching and idle refresh improvements.

Make every important animation visible in start, midpoint and end recordings.

Do not claim an animation works merely because a GSAP instance exists.

---

# 11. CREATIVE ACCEPTANCE GATES

The next implementation must pass more than engineering QA.

## Gate A — Visual design

Review at 1440×900 normal motion:

- Atlas no longer resembles a three-column dashboard.
- Map and photograph feel part of one scene.
- Active destination commands attention.
- Destination title and actions are visible.
- Flight Trace meaningfully connects scenes.
- No major section resembles repetitive generic cards.

## Gate B — Animation

For each major scroll scene:

- Capture start.
- Capture 50% progress.
- Capture final state.
- Capture reverse direction.
- Show a continuous recording.

The midpoint must demonstrate genuine transformation, not merely a small opacity change.

## Gate C — Hover

Test real mouse movement over:

- Service Worlds.
- Destination selectors.
- Navigation previews.
- Services directory.
- Signature destinations.
- Important CTAs.

Test rapid entry/exit and focus equivalents.

## Gate D — Partners

One moving editorial rail.

All sixteen commercial marks.

Three separately classified institutional marks.

Three seamless cycles at all required widths.

Pause/resume and static modes verified.

## Gate E — Technical

Run:

`pnpm typecheck`

`pnpm lint`

`pnpm test`

`pnpm build`

Run existing V6 functional verifiers.

Verify all twelve domestic destinations, nine services, three languages, selected itineraries, routing and inquiry handoffs.

Check:

- 1920×1080.
- 1440×900.
- 1024×768.
- 768×1024.
- 390×844.
- 844×390.

EN/TR/AR.

Normal and reduced motion.

Actual native wheel scrolling and touch input.

No horizontal overflow or broken media.

No blocked controls.

No repeated hero entrance on normal reverse scrolling.

No long hero pin.

No public deployment or merging to main.

---

# 12. IMPLEMENTATION ORDER

**Checkpoint C0 — Baseline**
Preserve V6 and record actual normal-motion behavior.

**Checkpoint C1 — Türkiye Explorer**
Finish the redesigned immersive stage, map/media choreography, responsive variants and functional verification.

**Checkpoint C2 — Partner Billboard**
Create and verify the proper continuous single-rail marquee.

**Checkpoint C3 — Cinematic Journey**
Integrate hero handoff, Service Worlds, Signature Places and Final Invitation.

**Checkpoint C4 — Supporting Craft**
Improve Story, Services, navigation and Journey Builder where required.

**Checkpoint C5 — Full Acceptance**
Perform browser review, performance optimization, localization checks, functional regression and final delivery.

Use recoverable commits at verified checkpoints.

Do not begin another unrelated framework rewrite.

If one visual experiment fails, revert or isolate that experiment—not the entire verified branch.

---

# 13. FINAL DELIVERY REPORT

Return:

1. Final branch and commit SHA.
2. Safe recovery point.
3. Changed files.
4. Actual preview URL.
5. Before/after Türkiye Explorer comparison.
6. Before/after partner billboard comparison.
7. Full desktop scrolling recording.
8. Reverse-scroll proof.
9. Hover-interaction recordings.
10. Atlas interaction recording.
11. Partner three-cycle evidence.
12. Mobile and Arabic recordings.
13. Performance trace interpretation.
14. Functional test outcomes.
15. Remaining known issues.
16. Explicit readiness recommendation for creative review.

**Do not mark the creative rework complete until the rendered browser experience visibly demonstrates the intended improvements.**

## FINAL DESIGN AUTHORITY

The objective is not merely to have more GSAP animations.

The objective is to make Trip Line feel like an original, motion-directed journey through Türkiye.

Use the reference website's level of craftsmanship and expressive composition.

Keep Trip Line's identity and travel functionality intact.

**Replace generic compositions. Create memorable visual scenes. Make motion explain and connect the journey.**