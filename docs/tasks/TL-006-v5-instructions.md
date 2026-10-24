# TRIP LINE — V5 COMPLETE FRONTEND RECONSTRUCTION
## Single-Agent Workflow Setup + Final Art Direction + Full Implementation

**Project:** Trip Line
**Repository:** https://github.com/mosti111/trip-line
**Application:** `frontend-v2`
**Preferred model:** GPT-6.1 Sol
**Recommended reasoning effort:** Medium
**Target:** Complete the highest-quality achievable frontend by Sunday, October 25, 2026, afternoon, Istanbul time.

You have authorization to implement the complete V5 frontend, including substantial replacement of existing design and motion systems.

This task contains both the workflow configuration and the main implementation specification. Do not require a separate master prompt.

Execute sequentially within this Codex task, creating verified, recoverable checkpoints.

---

# PART A — CONFIGURE THE WORKFLOW

## A1. Replace the previous orchestration approach

The repository previously used an expensive multi-agent structure:

Root Astra → Sol worker → Root Astra review.

**Do not run that workflow for V5.**

For this task:

- One primary implementation agent: GPT-6.1 Sol.
- No automatic subagent spawning.
- No automatic Astra review loops.
- No recursive task delegation.
- No Ultra multi-agent execution.
- No repeated exhaustive audits after each minor edit.
- No autonomous model switching.
- No speculative redesign loops.

Retain the useful parts of the previous orchestration system: state tracking, checkpoint discipline, deterministic verification, evidence preservation and acceptance criteria.

Inspect the existing `AGENTS.md`, orchestration documents and active instructions.

Where earlier instructions require multi-agent execution or the superseded V4 design, document and implement an explicitly scoped V5 exception. Do not delete historical evidence or silently weaken unrelated safety, testing and approval requirements.

Create a concise V5 workflow document at:

`docs/orchestration/TRIP_LINE_V5_SOLO.md`

It should define one implementation agent, five sequential phases, evidence collection, verification gates, checkpointing and recovery instructions.

Do not implement a new orchestration framework or unnecessary automation scripts.

## A2. Safeguard the existing local work

The previous audit reported:

- Branch: `codex/motion-v4-m01`
- HEAD: `ce166e2fd5fd5c9aac37e0128c02a9bae0936c03`
- An incomplete, committed V4 hero prototype
- Uncommitted M01 navigation improvements
- Modified local reports and orchestration files
- Historical accepted V3 SHA: `6dd8a6a29efaf883619fa152e8b095773d196c29`

These are last-audited facts, not guaranteed current state.

Before editing:

1. Inspect the current branch, Git status, active worktrees and HEAD.
2. Identify tracked changes, untracked files and any newer commits.
3. Safeguard the existing work in a verified recoverable form.
4. Create a dedicated V5 implementation branch without destructive checkout behavior.
5. Preserve useful M01 navigation work.
6. Do not run reset, clean, destructive stash operations or overwrite the user's work.

Do not repeat the previous full read-only audit.

Use the known audit and inspect only what is necessary for safe implementation.

## A3. Usage-efficient execution

The goal is to preserve model allowance without sacrificing final quality.

Adopt these rules:

- Read relevant source files once per implementation phase.
- Use focused file and code searches.
- Avoid repeatedly reading entire documentation directories.
- Perform one substantive implementation pass per area, followed by focused corrections.
- Do not continuously rewrite the creative plan.
- Do not regenerate reports or screenshots unnecessarily.
- Batch related changes logically.
- Run quick checks during implementation and full checks at phase gates.
- Use real browser evidence to determine whether revisions are necessary.

Think carefully about architecture and animation ownership. Spend less analysis on straightforward CSS changes, file moves and test updates.

Maintain a concise progress record instead of producing extensive prose after every action.

Work through the complete authorized scope unless a genuine blocker prevents safe progress.

## A4. Checkpoint structure

Create five implementation checkpoints:

- V5-P1 — Art foundations and design system.
- V5-P2 — Hero, motion architecture and navigation.
- V5-P3 — Türkiye discovery and signature experiences.
- V5-P4 — Remaining homepage and internal pages.
- V5-P5 — Full QA, refinement and final delivery.

Commit verified work at the end of each phase.

Each checkpoint must contain:

- Exact Git commit SHA.
- Changed files.
- Tests performed.
- Screenshot or recording locations.
- Known remaining issues.
- Next phase instructions.

Do not label a phase complete without its verification.

Do not stop at P1 or P2 merely because the previous workflow permitted only one milestone.

---

# PART B — APPROVED FREE REPOSITORIES AND TOOLS

Use only freely available tools suitable for this commercial client project.

Do not purchase software, subscribe to premium tools, use paid templates or consume paid asset credits.

## B1. Primary project

https://github.com/mosti111/trip-line

Preserve the existing Next.js, TypeScript, React, GSAP, Motion and Playwright stack.

Do not rebuild the project using a different framework.

Do not replace the existing application with a generated one-page mockup.

## B2. Approved agent skills

### Impeccable

https://github.com/pbakaus/impeccable

Purpose: composition quality, visual critique, anti-generic design checks and polish.

Use it as a quality-review assistant, not as an independent creative director.

If it is not already installed, inspect its installation instructions and use its supported Codex project installation.

Reference installation:

`npx impeccable install --providers=codex --scope=project`

Use targeted critique and polish at major visual checkpoints rather than an automatic critique loop after every edit.

### Official GSAP Skills

https://github.com/greensock/gsap-skills

Purpose: timelines, ScrollTrigger, React integration, SVG animation and performance.

Reference installation:

`npx skills add greensock/gsap-skills -a codex`

Use official guidance when building the new motion architecture.

### Vercel Agent Skills

https://github.com/vercel-labs/agent-skills

Relevant skills:

- `vercel-react-best-practices`
- `web-design-guidelines`

Reference installation:

`npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --skill web-design-guidelines -a codex`

Use for React performance, interface correctness, accessibility and responsive behavior.

### Taste Skill

https://github.com/Leonxlnx/taste-skill

Use only as a secondary art-direction critique reference.

Prefer its stable v1 skill instead of adopting experimental rules during a deadline-critical implementation.

Do not allow Taste Skill to override Trip Line's established typography, colors, logo, content or selected composition.

## B3. Browser verification

Existing Playwright is the primary browser verification system.

Additional references:

https://github.com/microsoft/playwright-cli

https://github.com/ChromeDevTools/chrome-devtools-mcp

https://github.com/GoogleChrome/lighthouse

https://github.com/dequelabs/axe-core

Use existing testing facilities before installing anything new.

Chrome DevTools MCP is useful for performance traces but is not mandatory if Chrome's standard tooling provides the necessary evidence.

Do not block implementation on optional MCP setup.

## B4. Artwork creation

Approved free tools:

- Inkscape: https://inkscape.org
- Blender: https://www.blender.org
- Kdenlive: https://kdenlive.org

Use native SVG and CSS whenever those can reproduce the approved artwork precisely.

Blender and Kdenlive are optional offline production tools, not frontend runtime dependencies.

Remotion is not required for V5.

## B5. Photography

First review the existing Trip Line photographic assets.

When replacements are necessary, use appropriately licensed photographs from sources such as:

https://www.pexels.com

https://unsplash.com

Verify each selected asset's actual license and record its provenance.

Do not use watermarked photography, paid assets, fabricated tourist landmarks, copied competitor artwork, or AI-generated scenes misrepresented as documentary travel photographs.

## B6. Installation policy

Inspect the repository and available skills before installing anything.

Install only missing resources actually needed for execution.

Avoid cloning reference repositories into the application.

Do not introduce additional animation libraries.

Do not upgrade existing major dependencies simply because newer versions exist.

Any dependency added to the production bundle must have a clear necessity and verified license.

---

# PART C — FINAL CREATIVE DIRECTION

## C1. The concept

**THE LIVING ATLAS OF TÜRKİYE**

Trip Line must feel like an extraordinary, cinematic travel editorial experience focused primarily on Türkiye.

The visitor should experience the atmosphere of Istanbul, discover Türkiye's distinct regions, understand the company's services and easily plan a journey.

We are inspired by the craft and interaction quality of award-winning travel websites, not by copying the geography or imagery of Santorini, Greece or other Mediterranean destinations.

No generic resort aesthetic.

No universal card grid.

No glowing metallic tubes.

No unnecessary 3D scenes.

No excessive empty scrolling.

No website that looks like a collection of unrelated animation demos.

## C2. Original Trip Line identity

The client supplied the original company logo.

Reconstruct it accurately as a clean vector using the reference screenshot and the company profile cover.

The logo consists of:

- “Trip” on the first line.
- “Line” on the second line.
- Bold rounded white geometric lettering.
- A small airplane extending diagonally upward from the upper-right of “Trip.”
- Tight optical composition.

The small airplane is part of the logo itself.

Preserve the original stacked wordmark.

Produce:

- White SVG for dark backgrounds.
- Dark teal SVG for light backgrounds.
- A usable favicon derived from the airplane.
- Appropriate SVG viewBoxes and transparent backgrounds.

Do not use the earlier AI-generated, distressed logo image.

Do not add a decorative underline to the logo.

Compare the vector visually with the actual client reference at large and small sizes.

If the reference is not present locally, locate the supplied company profile first; do not invent the logo.

## C3. Brand tokens

Night teal: `#071F20`

Primary teal: `#194244`

Ivory: `#FFFDF8`

Paper: `#F8EFE0`

Sand: `#E4D7C1`

Bronze: `#C89039`

Use existing semantic variables where practical.

Typography:

- Manrope for English and Turkish.
- Noto Sans Arabic for Arabic.
- Keep Arabic shaping natural and readable.
- Do not introduce decorative serif fonts.
- Do not split Arabic glyphs into individual animated characters.

Use large editorial typography, precise alignment, disciplined spacing, photographic contrast and restrained bronze detailing.

Desktop main content maximum width: approximately 1320px.

Desktop gutters: `clamp(22px, 4.4vw, 80px)`.

Mobile gutters: approximately 20–22px.

Avoid repeated equal-width cards and repetitive fade-up components.

## C4. Signature original artwork — Flight Trace

The original logo's airplane inspires the site's signature visual graphic.

**Flight Trace** is a thin cartographic bronze line representing routes through Türkiye.

It should be:

- Original vector artwork.
- Approximately 1.5–2px in desktop presentation.
- Based on long, irregular, elegant Bézier curves.
- Free of oversized glowing markers or heavy metallic shadows.
- Positioned behind content, never over text or controls.
- Related visually to the airplane in the logo.
- Modular across major visual sections.
- Simplified for mobile.
- Static and complete under reduced-motion preferences.

Create a reusable `FlightTrace.tsx` component with authored scene variants.

Produce original SVG variants for:

1. Arrival.
2. Service Worlds.
3. Türkiye Threshold.
4. Final Invitation.

These must be designed as coherent artwork, not arbitrary generated paths.

At adjoining boundaries, ensure matching anchors, stroke appearance and intended visual continuity.

Do not use a single huge absolute-positioned SVG that appears or disappears at an animation threshold.

The geographic map uses separate real destination coordinates.

## C5. Secondary illustration language

Use a limited original graphic set:

- Airplane silhouette derived from the logo.
- Circular destination markers.
- Small latitude/longitude labels.
- Fine terrain contour lines based on Turkish geography.
- Occasional simple architectural or cultural line illustrations where appropriate.

Keep decorative graphics sparse.

Do not create random motifs solely to fill space.

---

# PART D — PHOTOGRAPHIC ART DIRECTION

## D1. Istanbul hero

A genuine cinematic Istanbul photograph.

Subject:

- Bosphorus and ferry movement.
- Recognizable mosque-lined skyline.
- Natural blue-hour or golden-hour atmosphere.
- Strong photographic depth.
- Clear negative space for the headline.

Do not place an unrelated mosque, imaginary skyline or Greek architecture into the background.

Preserve a recognizable subject in both desktop and mobile crops.

## D2. Three service audiences

**Explore & Holiday:** Cappadocia at dawn or an equally distinctive Türkiye travel scene.

**Hajj & Umrah:** Authentic imagery associated with Makkah or Madinah.

**Corporate:** A tasteful, realistic professional conference or business event in Türkiye.

Do not falsely imply these are photographs of specific Trip Line events unless source provenance supports that interpretation.

## D3. Türkiye destinations

The twelve domestic destinations retain their existing real names and source data.

Three signature photographic chapters are mandatory:

- Cappadocia: geological formations and balloon atmosphere.
- Rize/Ayder: green mountains, vernacular architecture and mist.
- Antalya: dramatic coast, sea, rock and natural light.

Other destinations should have individually suitable photography.

## D4. Film

Preserve the existing authentic Bosphorus film when suitable.

The moving image is a quiet cinematic interlude, not a heavy fullscreen video application.

Preserve its existing playback and accessibility logic.

## D5. Photography quality

Use explicit desktop and mobile crops.

No needlessly extreme scale enlargement.

No blurry large hero photographs.

No repeated image when each section requires a distinct subject.

Record original image URL, creator, license and local derivative filename for any new external assets.

---

# PART E — REPLACE THE MOTION ARCHITECTURE

## E1. Old implementation

The existing motion system contains:

- Long GSAP hero pin.
- Delayed scroll scrubbing.
- Lenis scroll synchronization.
- Large 3D bronze scene.
- Transform-heavy heading departure.
- Abrupt handoff between different bronze implementations.
- Sections with excessively long scrolling distances.

These parts failed the visual review.

**Replace them. Do not repair or preserve their choreography.**

## E2. New architecture

- Native scrolling is the default and primary scroll mechanism.
- GSAP / ScrollTrigger handles selected scroll-linked visual effects.
- Motion handles interactive component transitions and layout changes.
- CSS handles lightweight hover and focus states.
- SVG handles the decorative Flight Trace.
- No active Lenis instance on the new experience.
- No ScrollSmoother replacement.
- No scroll-jacking.
- No mandatory Three.js rendering for the homepage.
- No large additional hero pin distance.

Retain old modules only when necessary for historical recoverability or unaffected page functionality.

Preserve modal scroll-lock semantics when removing Lenis.

## E3. Motion tokens

- Button press: 120ms.
- Hover: 180–220ms.
- Menu open: 300ms.
- Menu close: 220ms.
- Photo crossfade: 420ms.
- Image hover: 450ms.
- Editorial entrance: 600–700ms.
- Hero entrance: no more than 1100ms.
- Journey layout transition: approximately 280ms.

Default ease-out:

`cubic-bezier(0.22, 1, 0.36, 1)`

Default ease-in-out:

`cubic-bezier(0.76, 0, 0.24, 1)`

Use direct scroll-linked progress rather than trailing numeric scrub delay.

No overlapping animation controllers for the same transform.

No CSS/GSAP transform collision.

Animations must clean up correctly on route changes, resizing and React lifecycle changes.

Reduced motion reveals all essential content immediately.

Do not globally hide content until JavaScript initializes.

---

# PART F — COMPLETE HOMEPAGE RECONSTRUCTION

Retain all fifteen existing content modules, but compose them as nine coherent visual acts.

## F1. Arrival — Chapter 01

Source:

`components/home-v3/HomeArrival.tsx`

Related:

`HomeMotion.tsx`, `ScrollScene.tsx`, `recovery-home.css`, `recovery-motion.css`.

Composition:

Full-viewport Istanbul photography.

Desktop headline occupies the primary readable left region for English; respect native RTL composition for Arabic.

Use the existing localized headline and supporting copy.

Preserve the working Discover Türkiye and Plan Journey actions.

Ensure they are visible without extra scrolling at representative laptop viewport heights.

Entrance:

- Initial content readable at 0ms.
- Photograph settles at 0–450ms, scale 1.025 → 1.
- Headline reveals at 120–650ms.
- Supporting content settles at 350–800ms.
- Flight Trace draws at 450–1000ms.
- All entrance motion completes by 1100ms.

No animation restart.

No automatic camera flight.

No heading flying off in opposite directions.

No giant bronze sculpture.

No extra scroll distance added to progress to the next section.

## F2. Choose Your Journey — Chapters 02–03

Sources:

`components/home-v3/ServiceWorlds.tsx`

`components/home-v3/HomeJourney.tsx`

`styles/recovery-home.css`

Service Worlds uses three asymmetrical photographic compositions.

Explore & Holiday is visually dominant.

Hajj & Umrah and Corporate occupy complementary offset compositions.

No 3D rotation.

Image hover scaling is restrained, between 1.018 and 1.035 depending on the image.

Arrow travel: approximately 4px in logical inline direction.

Preserve service selection and JourneyStore integration.

The Türkiye Threshold is a strong Rize/Ayder image chapter.

Retain existing localized destination-count information and CTA.

No pinned transition.

Ensure the Flight Trace remains coherent across the visual boundary.

## F3. Türkiye Explorer — Chapter 04

Source:

`components/travel/TurkeyDiscovery.tsx`

Related:

`components/turkiye/TurkeyMap.tsx`

`styles/recovery-turkiye.css`

This is the most important interactive destination component.

Keep all twelve existing Turkish destinations.

Design a visually refined atlas with:

- Clear destination index.
- Dominant destination photograph.
- Accurate interactive map.
- Destination information.
- Explore and Add to Journey actions.

Selection changes immediately.

Photo crossfade: 420ms.

Incoming image scale: 1.025 → 1.

The outgoing image remains until a new one is decoded or a stable fallback is available.

On rapid repeated clicks, the latest choice wins.

Do not let ScrollTrigger overwrite a user's manual destination selection.

Mobile uses a clear selector, image, descriptive content and expandable map.

Do not mirror geography for RTL.

## F4. Signature Türkiye — Chapters 05–06

Source:

`components/home-v3/HomeJourney.tsx`

Three destination experiences:

Cappadocia: wide composition.

Rize/Ayder: more intimate, vertically emphasized composition.

Antalya: wide dramatic coastline composition.

Use different layouts rather than repeating one card design.

Reduce the existing excessive blank gaps.

Retain destination links and planner controls.

Preserve compatible destination view transitions.

Follow with the Istanbul Bosphorus Film section.

Remove the old excessive film scale animation.

Use only a restrained entry transition.

Video must not block scrolling or load unnecessarily early.

## F5. Story & Proof — Chapters 07–08

Source:

`components/home-v3/HomeEditorial.tsx`

Use paper/ivory editorial layouts, compelling real photography and carefully composed typography.

Company source information:

Trip Line's 2025 profile says the business was founded in 2019.

Its business areas include tourism, pilgrimage, corporate services, flight/hotel reservations, events and travel planning.

Preserve existing accurate company content.

Do not invent testimonials, awards, accreditations or new partnerships.

Treat client-provided partner logos and accreditation references as requiring publication approval unless already approved.

No generic cards with unrelated icons.

## F6. Numbers & Process — Chapters 09–10

Source:

`components/home-v3/HomeEditorial.tsx`

Numbers should use confident typography.

Use existing source-based company figures only.

Client profile statistics must remain clearly associated with their source and require approval before publication if not already approved.

Do not invent or extrapolate metrics.

The three-step process uses a restrained Flight Trace-style route that connects the stages.

Use progressive visual emphasis rather than unnecessary counters.

## F7. Services — Chapter 11

Source:

`components/home-v3/HomeEditorial.tsx`

Preserve all nine existing service pages and their routing.

Use a distinct editorial directory rather than nine repetitive image cards.

Maintain clear groupings.

No unsupported new services or duplicate destinations.

## F8. Journey Builder & Beyond — Chapters 12–13

Sources:

`components/home-v3/JourneyBuilder.tsx`

Existing JourneyStore, JourneyActions and JourneyDrawer components.

Preserve:

- Destination add/remove.
- Accessible reordering.
- Journey type.
- Dates and flexibility.
- Travelers.
- Session state.
- Contact context.
- Prepared WhatsApp/email inquiry behavior.

No unimplemented booking promises.

Use Motion for orderly list movement and photo transitions where practical.

No animation must delay form state changes.

Beyond Türkiye remains secondary and does not visually dominate the homepage.

## F9. FAQ & Final Invitation — Chapters 14–15

Source:

`components/home-v3/HomeEditorial.tsx`

FAQ uses accessible, native disclosure behavior.

Final Invitation uses a beautiful Antalya coastline photograph.

The Flight Trace ends naturally near the main journey planning action.

No scroll pin.

No oversized decorative animation.

No unsupported claims.

The final interaction should be inviting, clear and functional.

---

# PART G — NAVIGATION AND REMAINING PAGE FAMILIES

## G1. Global shell

Sources:

`components/travel/SiteShell.tsx`

`styles/recovery-shell.css`

The previous V4 M01 changes introduced navigation animation improvements. Reuse valid working implementation where compatible.

Preserve:

- Original stacked logo.
- Correct EN/TR/AR navigation.
- Desktop mega-menu.
- Mobile native dialog.
- Language switcher.
- Journey count/action.
- Keyboard controls.
- Focus restoration.
- Escape dismissal.
- Correct scroll locking.

Use restrained menu motion with no blank image previews.

Do not reset the existing navigation to an inferior implementation.

## G2. Destination pages

Preserve all twelve existing Türkiye destination pages.

Apply consistent editorial visual treatment with genuine destination photography, strong hero compositions and reliable inquiry actions.

These pages should feel part of the same visual identity without repeating the homepage's full cinematic sequence.

## G3. Service pages

Preserve all nine service experiences.

Give them clear, differentiated photography and typographic hierarchy.

Hajj and Umrah deserve appropriate religious and geographic imagery rather than generic tourist photography.

Corporate services should feel professional and credible.

## G4. Other pages

Polish existing:

- About.
- Business.
- Contact.
- International destinations.
- FAQ.
- Legal placeholders.
- 404.
- Footer.

Retain existing routes, semantics, translation data, legal-review restrictions and noindex rules.

Do not create imaginary products, reservations or backend functionality.

---

# PART H — RESPONSIVE AND ACCESSIBILITY CONTRACT

Verify these representative viewport sizes:

- 1920×1080.
- 1440×900.
- 1024×768.
- 768×1024.
- 390×844.
- 844×390.

Verify EN, TR and AR.

On desktop, use strong photographic compositions and asymmetric editorial layouts.

On tablets, simplify image/text compositions without destroying hierarchy.

On mobile, use independently considered image crops and compact artwork.

Ensure all CTAs remain usable.

No content may require hover.

No unexpected horizontal overflow.

No interactive overlay may permanently capture the page.

Arabic text must shape correctly, and geographic maps must not be reversed.

Support keyboard access, visible focus, screen readers, reduced motion, touch input, and slow or failed image loading.

Keep existing accessibility semantics.

---

# PART I — QUALITY CONTROL

## I1. Browser evidence is mandatory

Do not rely only on typecheck or automated tests.

Start the actual application locally and inspect it in a real browser.

Capture:

- Desktop homepage screenshots.
- Mobile homepage screenshots.
- Arabic desktop and mobile screenshots.
- Türkiye Explorer selection states.
- Service selection states.
- Journey Builder interactions.
- Open and closed navigation states.
- Full continuous desktop scrolling video.
- Representative mobile scrolling/interaction recording.

The recording must use real browser input, not only programmatic `scrollIntoView`.

## I2. Smoothness verification

Use Chrome performance traces where available.

Investigate:

- Long main-thread tasks.
- Scroll-linked style recalculation.
- Expensive paint and layout work.
- Frame-time spikes.
- Unnecessary React rendering.
- Image decoding during interaction.
- Animation restarts.
- Duplicate transforms.
- Stale observer/event listeners.
- ScrollTrigger lifecycle and refresh behavior.

Do not report made-up FPS.

Do not confuse video encoding frame rate with browser rendering frame rate.

The page must respond immediately to normal scrolling and reverse naturally.

## I3. Functional verification

Verify:

- Language switching.
- Navigation.
- Menu open/close.
- Escape and focus restoration.
- Twelve Turkish destinations.
- Destination selection and map synchronization.
- Add/remove/reorder journey.
- Dates, travelers and service type.
- Session persistence.
- Contact handoff.
- WhatsApp/email prepared messages.
- Responsive behavior.
- Reduced motion.
- Unavailable WebGL.
- No visible broken images.
- No unexpected page errors.

## I4. Repository checks

Use the actual project commands:

`pnpm typecheck`

`pnpm lint`

`pnpm test`

`pnpm build`

Preserve unrelated existing regression coverage.

Replace obsolete assertions that specifically test the discarded V4 hero choreography with appropriate V5 acceptance tests.

Do not remove tests simply to make the suite pass.

## I5. Creative acceptance

Check every major section for:

- Correct Turkish geographic identity.
- Original Trip Line visual language.
- High-quality image selection and cropping.
- Strong typography.
- Intentional visual hierarchy.
- Distinctive layouts without visual clutter.
- Smooth, purposeful motion.
- No excessive blank scrolling.
- Readable and reachable controls.
- Consistency across sections and page families.

Use Impeccable and web design guidelines as secondary reviews.

Actual rendered evidence has priority over a tool's generic score.

---

# PART J — EXECUTION PHASES

## Phase 1 — Artwork and foundations

Primary priority: Faithful original identity.

Produce final logo SVG variants, Flight Trace artwork, brand tokens and source-backed photographic asset plan.

Build and visually verify the shared art components.

Checkpoint P1.

## Phase 2 — Replace hero, scrolling and navigation

Primary priority: Natural scrolling and visually outstanding arrival.

Replace the old hero choreography and scroll architecture.

Integrate original SVG artwork.

Retain working M01 navigation elements.

Verify desktop/mobile, EN/AR, cold-load entrance and real wheel scrolling.

Checkpoint P2.

## Phase 3 — Türkiye experience

Primary priority: The site's strongest travel experience.

Complete Service Worlds, Türkiye Threshold, interactive Explorer, signature destinations and Bosphorus film.

Verify fast selection, image loading, real geographic state, route continuity and imagery.

Checkpoint P3.

## Phase 4 — Complete frontend

Primary priority: Functional parity across all pages.

Complete editorial homepage chapters, Journey Builder, final invitation and remaining page families.

Verify links, forms, localization and responsive experiences.

Checkpoint P4.

## Phase 5 — Final visual and technical acceptance

Primary priority: No critical defects.

Run the full test matrix, continuous scrolling recordings and performance inspection.

Correct verified visual and functional problems.

Run production build and final tests.

Create final checkpoint P5.

---

# PART K — FINAL DELIVERY

Return a concise, evidence-based report containing:

1. V5 implementation branch.
2. Final commit SHA.
3. Previous work preservation summary.
4. Completed phase checkpoints.
5. All major created/modified components.
6. Original logo and artwork file paths.
7. New photograph sources and license documentation.
8. Verified local preview address and run instructions.
9. Desktop/mobile screenshots.
10. Continuous scrolling and interaction recording paths.
11. Performance findings.
12. EN/TR/AR QA results.
13. Typecheck, lint, test and build results.
14. Known limitations or remaining defects.
15. Whether the frontend is ready for client creative review.

Do not merge to `main`, publicly deploy, remove legal placeholders, change publication restrictions or activate any unapproved backend.

**Final instruction:**

This is a complete reconstruction, not a V4 repair task.

The visual direction, identity, architecture and primary choreography have been decided.

Do not invent a different art style.

Do not replace original Trip Line identity with a generated wordmark.

Do not let skills or repository examples override the client brief.

Do not spend the sprint building more orchestration infrastructure.

Implement the five phases sequentially, preserve recoverable checkpoints, evaluate actual browser output, and deliver the strongest complete Türkiye-first Trip Line frontend achievable within the deadline.
