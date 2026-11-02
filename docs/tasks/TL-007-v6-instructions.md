# TRIP LINE V6 — MOTION MAXXED TÜRKIYE
## Final creative authority, motion prototypes, partner marquee and complete frontend implementation

**Repository:** https://github.com/mosti111/trip-line  
**Application:** `frontend-v2`  
**Starting point:** Verified V5 branch `codex/trip-line-v5`  
**Last reported V5 application SHA:** `ed4e231fb7233d47a9d45d378492fbe1621c55c7`  
**Model:** GPT-6.1 Sol  
**Recommended effort:** Medium  
**Agent execution:** One agent, sequential milestones, no automatic multi-agent orchestration

## Mission

Upgrade the existing Trip Line V5 frontend into **V6 — Motion Maxxed Türkiye**, a distinctive, cinematic, interactive travel website.

The target standard is the originality, visual craftsmanship, interaction density, animation coordination and attention to detail demonstrated by https://www.jaeco.fr/.

Do not copy JAECO's branding, artwork, code, layouts or proprietary assets.

Use its execution quality as a benchmark, not as a template.

**V5 is the functional foundation. V6 is the creative and interaction overhaul.**

Do not rebuild the business logic, routes, translations, planner or content model from scratch.

Do not repeat V4's delayed scrolling, oversized 3D ribbon or long, unresponsive hero pin.

## 1. Preserve the existing V5 implementation

Before modifications:

- Inspect actual current Git status, branch, HEAD and worktrees.
- Preserve all tracked and untracked changes.
- Create a recoverable V5 checkpoint and a new V6 development branch.
- Preserve all existing V5 artwork, photography provenance, functional tests and QA evidence.
- Retain existing Türkiye destinations, nine services, EN/TR/AR localization, maps, prepared inquiry logic and responsive layouts.
- Do not reset or clean uncommitted work.
- Do not deploy, merge to main or remove existing legal/noindex restrictions.

Use a single implementation agent. Do not activate the historical Astra → Sol → Astra workflow.

## 2. Creative identity

### The concept

**THE LIVING ATLAS OF TÜRKIYE — NOW IN MOTION**

Trip Line must feel like a crafted, cinematic interactive journey through Türkiye.

The user should encounter meaningful visual transformations rather than ordinary scrolling through cards.

The site must be rich with responsive motion, but never confusing or slow to operate.

### Existing brand assets

Use the faithful V5 reconstruction of the original stacked Trip Line logo and its airplane symbol.

Preserve:

- Night teal `#071F20`
- Brand teal `#194244`
- Ivory `#FFFDF8`
- Paper `#F8EFE0`
- Sand `#E4D7C1`
- Bronze `#C89039`

Typography remains Manrope and Noto Sans Arabic.

Do not introduce decorative serif typography.

Do not use the generated V6 collage images as production UI or as authoritative layout geometry.

### Original artwork

Preserve and evolve the V5 Flight Trace, but give it actual animation roles:

- Introduce the airplane in the opening.
- Connect photographic scenes.
- Reveal route progress within the Türkiye Atlas.
- Link process stages.
- Resolve at the closing invitation.

Do not use a glowing decorative line across every section.

The airplane may travel along a path, but the path must stay restrained, correctly positioned and visually connected to the brand.

Only use original SVG and suitable licensed assets.

---

# 3. Motion architecture

Retain the native scrolling that V5 made smooth.

Use:

- GSAP and ScrollTrigger for scroll-linked timelines.
- Motion for React for React UI state and layout transitions.
- SVG masks and paths for graphic transitions.
- CSS transforms, opacity and clip-path for lightweight visual effects.
- Existing Three.js only for an explicitly justified, measurable benefit.

No new smooth-scroll engine.

No mandatory continuous WebGL rendering.

No paid GSAP plugins or trial-only packages.

No independently running scroll engines.

No uncontrolled automatic animations after the page has settled.

All substantial animations must be interruptible and reversible, where interaction demands it.

### Motion ownership

Each transform, clip-path or opacity animation must have one clear owner.

Do not animate the same element's transform simultaneously through CSS, GSAP and Motion.

Use nested wrappers when multiple independent motions are genuinely necessary.

Use proper GSAP React cleanup/scoping and cleanly dispose of observers, listeners and animation frames.

### Timing system

- Tap / press feedback: 120–160ms.
- Ordinary hover response: 180–250ms.
- Image hover transformation: 350–500ms.
- Menu reveal: 500–650ms.
- Photo change: 550–750ms.
- Mask transition: 650–950ms.
- Main hero cinematic entrance: approximately 1100–1500ms, with content usable immediately.
- Staged editorial reveal: 600–900ms.
- Shared image-to-page transition: approximately 700–950ms.

Use measured spring or eased motion only where suitable.

Scroll-linked motion should be directly responsive to wheel movement, not delayed by long numeric scrub smoothing.

Do not infer performance from the video recording's encoding frame rate.

---

# 4. Phase V6-P0 — Real interactive motion prototypes

**This phase is mandatory before applying V6 animation across the full website.**

Create an isolated preview route or development-only Motion Lab within the existing Next.js application.

Do not treat a static composition, generated image or presentation board as a completed prototype.

Build three working, full-size browser experiences using actual Trip Line content and assets.

## Prototype A — Cinematic Istanbul Arrival

At 1440×900:

- Full-bleed authentic Istanbul photograph.
- Existing stacked logo and navigation.
- Existing localized primary message.
- Strong, deliberately composed headline in Manrope.
- Visible Discover Türkiye and Plan Journey actions.
- Layered photographic depth.
- Original animated airplane and Flight Trace.
- A truly designed visual transition into Service Worlds.

### Entrance choreography

Stage 1, 0–180ms:

Background already visible; headline and actions remain accessible.

Stage 2, 180–650ms:

Headline lines reveal through two coordinated text masks.

Background settles through subtle camera-like scale and position changes.

Stage 3, 350–950ms:

Flight Trace begins drawing; the small airplane travels along a limited path.

Stage 4, 650–1300ms:

Supporting typography and decorative elements complete the arrival.

No prolonged loading screen.

No need for the user to scroll before the main actions become available.

### Scroll departure

The hero transitions into the next scene.

As the hero approaches its lower boundary:

- Background photograph subtly recedes.
- A designed photographic panel separates from the scene.
- Service World photographs appear through controlled directional masking.
- The Flight Trace connects the visual sequence.

The entire transition remains responsive to real scroll movement.

Avoid a long full-screen pin. Use section-boundary visual continuity, natural flow, and only the necessary scroll distance.

Desktop and mobile must have separately designed choreography.

## Prototype B — Interactive Türkiye Atlas

This is the flagship V6 interaction.

Use the actual twelve destination records and the existing geographic map.

At desktop size:

- Destination directory sits in a clear editorial index.
- Active destination photograph is visually dominant.
- Geographic Türkiye map and active route form part of the same composition.
- Destination title, coordinates and description change with selection.
- The map route animates toward the active destination.
- Marker emphasis follows the destination state.
- The next photograph appears through a cinematic mask transition.

### Destination selection timeline

At selection:

**0ms:** State and semantic labels update to the new destination.

**0–220ms:** Active marker and route progress animate.

**80–650ms:** Incoming photographic composition reveals through an authored mask.

**180–720ms:** Headline changes through a controlled text transition.

**300–760ms:** Map camera settles, with translation and scale kept restrained.

The latest selection always wins.

Previous animations must be cancelled or redirected correctly.

A slow image must not leave the visual stage blank.

Arrow navigation, touch, keyboard, mobile map and Journey actions continue to work.

Do not mirror geographic coordinates for Arabic.

## Prototype C — Moving Travel Network

Create a real, infinitely looping marquee with **every applicable logo appearing in the client's company profile**.

The original reference is the PDF named `بروفايل-1.pdf`, supplied with the project.

Inspect:

- Cover page: institutional, travel-agency and aviation-related marks.
- Page four: hotel, travel supplier and booking-related logos.

Do not use AI-generated logos.

Do not invent logos such as Pegasus, IATA, banks or hotels just because they appeared in generated concept imagery.

Build a logo inventory from the original PDF, individually identifying each mark that can be reliably recognized.

For each record store:

- Brand name.
- Profile page.
- Classification.
- Official source if a higher-resolution legitimate logo is used.
- Local asset path.
- Verification status.
- Publication approval status.

### Marquee design

Position the commercial Travel Network display in the homepage's story/proof area, before Numbers/Process.

Visually it should feel like a premium editorial strip, not a stock sponsor carousel.

Use:

- Deep teal or warm paper background.
- Original logos in their correct proportions.
- An appropriately consistent optical height.
- Two coordinated tracks where the number of logos warrants it.
- Smooth continuous motion with no visible reset.
- Different durations/directions for two tracks when beneficial.
- Gentle visual emphasis on hover.
- Pause when hovered or keyboard focus is within the interactive region.
- Static, fully readable presentation under reduced motion.

Suggested speed: approximately 25–35px per second on desktop, adjusted for legibility.

Use seamless content duplication for animation, with duplicated accessibility content hidden from assistive technology.

No keyboard trap.

No automatic movement of the browser's scrollbar.

**Important classification rule:** Do not present official institutions, government marks or accreditation symbols as ordinary commercial partners. Group and label these separately where their relationship is supported.

Do not imply a verified endorsement or current partnership merely because a mark appears in the 2025 company profile.

Unapproved or uncertain marks may appear in internal review, but must not be published as verified relationships without client clearance.

### P0 delivery gate

Produce actual browser screenshots and interaction recordings for:

- Hero desktop.
- Hero mobile.
- Scroll transition.
- Atlas switching between at least three destinations.
- Partner marquee in motion.
- Reduced-motion alternatives.
- Arabic layouts.

Show these as real browser output.

Do not proceed by reproducing the earlier AI collages.

Refine P0 until these three scenes demonstrate actual motion depth, distinctive art direction, legible content and responsive interaction.

The P0 result must be available as a local browser route for creative review.

---

# 5. Phase V6-P1 — Hero and navigation integration

Once the Motion Lab prototypes are technically and visually validated, integrate their actual components into production.

### Hero

Use the approved P0 arrival design.

Preserve both CTAs, correct localization, image provenance and the original logo.

Create an authored image transition into Service Worlds.

Do not return to the previous static V5 entrance.

### Navigation

Use the existing functional SiteShell implementation.

Upgrade its visual choreography:

- Full-screen mobile menu uses a masked editorial reveal.
- Menu links enter in a controlled stagger.
- Desktop mega-menu reveals destinations with a coordinated image stage.
- Switching hover targets changes the preview photograph with depth and soft masking.
- The previous image remains until the new one is ready.
- Repeated pointer movement must not create a backlog of image transitions.
- Closing during opening must work.
- Escape, focus restoration, scrolling and actual routing must remain correct.

For desktop navigation, prefer a quick but expressive sequence, approximately 500–650ms.

Do not create a long blocking animation for ordinary navigation.

---

# 6. Phase V6-P2 — Motion Maxxed homepage

## Service Worlds

Rebuild hover choreography so the components physically respond.

When hovering Explore & Holiday:

- The dominant photograph expands subtly within its layout.
- The image gains depth and perspective.
- Its heading moves into an emphasized position.
- Its arrow moves in the direction of travel.
- Other service photographs react in a coordinated but quieter way.
- Selection persists correctly through JourneyStore.

Hajj & Umrah and Corporate get their own proportional choreography rather than identical effects.

For touch users, selected state drives the corresponding visual response.

For keyboard users, focus triggers an equivalent discoverable presentation.

No uncontrolled layout shifting.

## Türkiye Threshold

Build a cinematic photographic transition into Rize/Ayder.

Use a scene-specific SVG mask or sectional image reveal inspired by:

https://tympanus.net/Tutorials/SVGMaskScrollTransition/

The mask must communicate the visual arrival in a different region of Türkiye.

Do not merely fade the whole section upward.

No obligatory long pin.

The transition must work in reverse when scrolling upward.

## Signature Places

Use scroll-driven photographic perspective.

Reference:

https://tympanus.net/Development/RotatingOnScrollAnimations/

Cappadocia, Rize/Ayder and Antalya should pass through a carefully staged photographic sequence.

Use perspective and transform depth, not expensive real-time 3D unless profiling demonstrates a clear advantage.

Limit image rotation to a tasteful range.

Use separate text and image layers.

The next destination takes prominence as the previous one recedes.

Keep photographs large and geographically accurate.

Don't build a giant dead scrolling area solely for the effect.

Mobile uses a simplified 2D transition.

## Bosphorus Film

Design a cinematic framed-film entry:

- The frame initially appears inset.
- Its visual width expands toward the editorial content bounds.
- Corner treatments resolve as it settles.
- The film and surrounding typography move in a coordinated sequence.

Use an approximately 650–900ms scene entrance.

Preserve playback, visibility and data-saving rules.

## Company Story

Use the memory-photograph language of the original company profile.

Photographs are positioned in overlapping but intentional arrangements.

As the section enters, they travel along shallow curved paths into a finished composition.

On hover, the selected photograph rises and becomes visually dominant.

Ensure captions remain readable and no important text becomes obstructed.

Do not create fake photographs of the company's team or events.

## Proof and Travel Network

Integrate the P0 partner marquee into the proof area.

The marquee and adjacent editorial content must be visually coordinated.

Use clear labels and client-verifiable relationship claims.

## Numbers and Process

Numbers receive expressive typography rather than generic counters.

Only source-backed, approved data.

The process steps use a short animated route that advances as the viewer reaches each stage.

The airplane may travel between those actual illustrated steps.

Do not animate a permanently circling airplane.

## Services Directory

Create a premium typographic service directory.

Desktop hover behavior:

- Active service name gains emphasis.
- A real service-relevant photograph emerges near the pointer or in a fixed adjacent image stage.
- The photograph follows pointer movement with controlled damping.
- Preview changes fluidly on the next service hover.
- Arrow and chapter indicator respond.

Disable pointer-following behavior on touch.

Maintain keyboard equivalents using a stationary preview region.

No change to service URLs.

## Journey Builder

Keep all existing functionality.

Improve state-change choreography:

- Destination thumbnail visually moves toward the itinerary on addition.
- A selected route point activates.
- Ordered stops reflow with Motion.
- Removing and reordering remain fast and predictable.
- The form never delays actual state updates for animation purposes.

The animation is an enhancement, not the primary interaction.

Do not require dragging.

## Beyond Türkiye

Create a restrained, draggable or button-operated photographic perspective carousel.

All existing countries remain reachable.

This section remains secondary to Türkiye.

On touch and keyboard, navigation must work without hover.

## FAQ

Refine the existing native disclosure design.

Smooth height presentation is acceptable if it does not damage accessibility, semantics or content responsiveness.

Do not turn FAQ into a gimmick.

## Final Invitation

Create a truly memorable closing transition.

An Antalya coast photograph expands into the final composition.

The Flight Trace resolves near the final planning action.

Use coordinated typography, image framing and route movement.

The final section should feel like the destination reached at the end of a long journey.

Avoid another independent hero unrelated to the visual story.

---

# 7. Phase V6-P3 — Destination and page transitions

Use the existing Next.js routing and ViewTransition-compatible components where practical.

When selecting a featured destination:

- Preserve the selected image identity.
- Transition it into the destination-page hero where technically supported.
- Animate supporting text separately.
- Keep the back-navigation experience coherent.
- Provide an immediate fallback where shared transitions are unsupported.
- Do not add a separate router or heavy page-transition framework.

Apply an appropriate level of V6 motion to destination and service pages.

Preserve page-specific content, links, localization, business logic and accessibility.

Do not duplicate the full homepage choreography on internal pages.

---

# 8. Hover interaction coverage

Every meaningful interactive component must have a designed state:

- Main CTA.
- Secondary CTA.
- Text links.
- Navigation items.
- Menu preview images.
- Service Worlds.
- Destination cards.
- Atlas entries.
- Map markers.
- Signature gallery controls.
- Service directory.
- Journey selection and itinerary actions.
- Partner marquee where applicable.
- Footer navigation.

This does not mean adding dramatic effects to every control.

Use a coherent hierarchy:

**Micro:** Arrow travel, underline movement, surface elevation.

**Medium:** Image crop, preview transition, text emphasis.

**Major:** Scene transformation, gallery motion, page image transition.

Test hover entry, exit, rapid pointer changes, keyboard focus and touch behavior.

---

# 9. Motion reference library

Study these for implementation patterns:

**Primary inspiration**

https://www.jaeco.fr/

**GSAP fundamentals**

https://gsap.com/docs/v3/Plugins/ScrollTrigger/

https://github.com/greensock/gsap-skills

**Scene transitions**

https://tympanus.net/Tutorials/SVGMaskScrollTransition/

https://github.com/Hiro-kiii/Scroll-Transition

**Perspective photography**

https://tympanus.net/Development/RotatingOnScrollAnimations/

https://github.com/codrops/RotatingOnScrollAnimations

**Photographic grid choreography**

https://tympanus.net/Tutorials/StickyGridScroll/

https://github.com/theoplawinski/codrops-sticky-grid-scroll

**Interactive route/maps**

https://tympanus.net/Tutorials/ScrollMap/

**Photographic motion paths**

https://tympanus.net/Tutorials/MotionPathTransition/

**Navigation choreography**

https://tympanus.net/Development/EaseReverseClipMenu/

**Creative motion principles**

https://github.com/Tejashmakwana/motionmaxxing

These are references, not mandatory dependencies.

Review licensing before copying implementation code.

For paid or proprietary demonstrations, recreate the interaction concept using independent original code and licensed assets.

Do not copy their original artwork, branding, or nonlicensed source code.

Do not install premium plugins or trial-only software into the commercial build.

---

# 10. Performance and responsiveness

Do not sacrifice the newly achieved V5 scrolling quality.

All major effects must be profiled in the real browser.

Use transform and opacity where possible.

Avoid unnecessary continuous animation and offscreen rendering.

SVG masks and clip-path effects must have lighter mobile and reduced-motion alternatives.

Lazy-load costly media and noncritical modules.

Do not start major animations before essential content can be rendered.

Scroll-linked triggers must handle resize, reverse scroll, dynamic content height and route transitions.

Verify all six viewport classes:

1920×1080  
1440×900  
1024×768  
768×1024  
390×844  
844×390

Test EN/TR/AR and reduced motion.

Keep geographic maps unmirrored in RTL.

Test real wheel and touch input.

Do not use screenshots alone as evidence of animation quality.

---

# 11. Creative QA: mandatory proof

A successful production build is not a design acceptance.

Record the following:

1. Full desktop homepage scroll using real wheel input.
2. Hero-to-Service Worlds transition in both scroll directions.
3. Real atlas destination switching.
4. Signature Places photographic scroll choreography.
5. Service Worlds hover interactions.
6. Navigation opening, preview changes and closing.
7. Services directory cursor preview.
8. Journey Builder add, remove and reorder.
9. Partner marquee at normal speed, hover pause and reduced motion.
10. Mobile scrolling and interaction behavior.

Capture screenshots at the start, midpoint and end of each signature animation.

Compare those states against the locked creative contract.

Document actual timeline durations and CSS/GSAP animation ownership.

Profile real frame intervals, long tasks, layout/paint costs and animation instability.

Do not invent FPS figures.

Do not report that an animation exists simply because code or a CSS class exists. Prove that it visibly runs.

---

# 12. Functional protection

No regression is acceptable in:

- All twelve Türkiye destinations.
- Nine services.
- Three languages.
- Journey planner selections.
- Journey ordering and persistence.
- Dates and travelers.
- Contact/WhatsApp/email preparation.
- Header/menu focus behavior.
- Reduced-motion accessibility.
- Real destination geography.
- Original logo rendering.
- Source-backed client data.

Run:

`pnpm typecheck`

`pnpm lint`

`pnpm test`

`pnpm build`

Run production browser verification with Playwright.

Keep working V5 tests and extend motion-specific QA.

---

# 13. Execution and checkpoints

Use these milestones:

**V6-P0 — Motion Lab**
Build actual hero, atlas and partner marquee prototypes. Capture evidence and refine.

**V6-P1 — Cinematic Opening**
Integrate the hero, navigation, transitions and Flight Trace.

**V6-P2 — Motion Maxxed Homepage**
Implement all homepage-specific motion systems.

**V6-P3 — Internal Pages**
Apply consistent motion and destination-page transitions.

**V6-P4 — Complete QA**
Test, profile, optimize, record and correct.

Create recoverable commits after verified phases.

Do not repeat large general research phases after the references have been selected.

Do not create a new generic design direction.

Do not substitute a static composition for the working implementation.

---

# 14. Final delivery

Provide:

- Implementation branch and SHA.
- Working local preview.
- Motion Lab preview route.
- All five phase checkpoints.
- Actual screenshots.
- Full continuous scrolling recordings.
- Hover and interaction recordings.
- Performance traces.
- Partner logo inventory and provenance.
- EN/TR/AR responsive matrix.
- Build, lint, typecheck and test outcomes.
- Known limitations.
- Explicit statement of what is ready for creative review.

Do not deploy or merge without permission.

## Final instruction

The user rejected V5 because it was generic and lacked substantial motion.

Do not repeat that failure.

Deliver a visually extraordinary, motion-rich, Türkiye-first Trip Line experience, with JAECO-level creative ambition, original brand artwork, expressive animation, technically sound interaction, and preserved functional quality.

**Make the experience move beautifully—not just the page scroll smoothly.**