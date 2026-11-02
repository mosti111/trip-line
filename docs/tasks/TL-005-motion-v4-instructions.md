# TRIP LINE — MOTION V4
## Final Design Authority & Implementation Contract

**Project:** `mosti111/trip-line`  
**Active frontend:** `frontend-v2`  
**Design status:** Creative direction and interaction specifications selected  
**Implementation strategy:** Bounded milestones, rendered review, no autonomous redesign

---

# 1. Mission

Upgrade Trip Line V3 into a significantly more cinematic, responsive and interactive travel experience using:

1. **Motion Division** for premium component interactions and transitions.
2. **Taste Skill** for selected motion choreography and rigorous visual evaluation.
3. **Existing GSAP, Lenis and Three.js** for cinematic scroll and bronze-route scenes where justified.

The creative direction is:

**THE BRONZE JOURNEY — MEDITERRANEAN EDITION**

Reference atmosphere: polished, photography-led Mediterranean hospitality, calm luxury, carefully paced cinematic transitions.

Trip Line must remain recognizably Trip Line.

This is an **interaction and motion overhaul**, not a rebuild, rebrand, or new website design.

## Immutable design constraints

Preserve:

- Original stacked Trip Line logo.
- Existing teal, ivory, sand and bronze palette.
- Existing Manrope / Noto Sans Arabic typography system.
- Existing information architecture and content hierarchy.
- Existing homepage section order.
- Existing desktop and mobile navigation structure.
- Existing asymmetric Service Worlds composition.
- Existing Türkiye Explorer with synchronized map, index and photography.
- Existing destination cards, galleries and local navigation.
- Existing JourneyBuilder, JourneyDrawer and JourneyStore behavior.
- All twelve Turkish destinations, nine services and international discovery.
- English, Turkish and Arabic RTL.
- Contact and WhatsApp/email inquiry functionality.
- Existing legal/noindex/publication restrictions.

Do not change copy, typography, page composition or navigation architecture merely to accommodate an animation.

Do not implement the experimental alternative hero concepts from previous brainstorming.

## Creative prohibitions

Do not introduce:

- Generic fade-up animations applied to every element.
- Bouncing or overshooting interface controls.
- New cursors, cursor trails or particle effects.
- Unnecessary 3D scenes.
- Universal magnetic buttons.
- Heavy glassmorphism or decorative blur.
- Additional global smooth-scrolling libraries.
- New carousels replacing working destination navigation.
- Arbitrary page transition curtains.
- Randomized aesthetic directions.
- Unrelated UI redesigns.
- New fonts, palettes or logos.

A motion effect must enhance the existing component, not replace its purpose.

---

# 2. Required Source Repositories

## Source A — Motion Division

Repository:

https://github.com/motiondivision/motion

Use the project's currently installed `motion` dependency and `motion/react` imports.

Study these reference implementations:

**Image transitions**

`dev/react/src/examples/AnimatePresence-image-gallery.tsx`

Use its enter/exit-state approach for photographic preview changes. Adapt to Trip Line's selected 420ms crossfade. Do not copy the demo's oversized displacement or two-second transition.

**Shared photographic transitions**

`dev/react/src/examples/Shared-layout-lightbox-crossfade.tsx`

Use as a reference for coherent movement between related image surfaces.

`dev/react/src/examples/Shared-layout-continuity.tsx`

Use its shared-element principles for persistent active indicators and suitable transitions.

**Journey reordering**

`dev/react/src/examples/Drag-to-reorder.tsx`

Use Motion's reorder/layout principles to animate Trip Line's existing itinerary order. Preserve native reorder buttons and keyboard accessibility.

**Hover behavior**

`dev/react/src/examples/Events-whileHover.tsx`

Use contextual hover gestures instead of writing independent pointer animation systems for every component.

**Motion API documentation**

https://motion.dev/docs/react

Do not replace a tested native or CSS solution simply because a Motion API exists.

Some reference examples use older `framer-motion` imports. Adapt them to the installed Motion version; do not copy incompatible imports.

## Source B — Taste Skill

Repository:

https://github.com/Leonxlnx/taste-skill

Read:

`skills/taste-skill/SKILL.md`

`skills/taste-skill/references/motion.md`

`skills/taste-skill/references/scenes.md`

`skills/taste-skill/references/critique.md`

`skills/taste-skill/references/imagery.md`

Use the browser-inspection workflow, including:

`skills/taste-skill/scripts/inspect.mjs`

`skills/taste-skill/scripts/scenes.mjs`

Use a pinned, recorded revision of this repository for reproducible inspection. Run its scripts only in a suitable isolated QA environment after checking their prerequisites.

### Adopted Taste Skill patterns

- Masked editorial line reveals.
- Image shutter reveals in selected large scenes.
- Restrained photographic parallax.
- Scroll-linked route progression.
- Index with hover-preview photography.
- One-time reading-order section reveals.
- Carefully bounded cinematic scroll scenes.
- Genuine browser-rendered critique and scene sampling.

### Explicit exceptions to Taste Skill

Do not apply randomized design directions or automatically replace the existing brand and layout.

Do not treat its bans on eyebrow labels, numbering, bronze accents or other existing Trip Line design elements as project requirements.

The approved Trip Line design system takes precedence over conflicting stylistic rules.

Taste Skill's visual-quality scoring is an additional review tool, not an independent claim of Awwwards quality.

---

# 3. Locked Motion Tokens

Use the following values consistently.

| Token | Value |
|---|---|
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `ease-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` |
| `ease-soft` | `cubic-bezier(0.33, 1, 0.68, 1)` |
| `press` | 140ms |
| `hover` | 180ms |
| `action` | 220ms |
| `menu-open` | 320ms |
| `menu-close` | 220ms |
| `image-preview` | 420ms |
| `card-image` | 450ms |
| `gallery` | 550ms |
| `editorial-reveal` | 700ms |
| `image-opening` | 1100ms |
| `hero-total` | 1500ms |

All normal animations must remain reversible or interruptible where relevant.

Scroll-scrubbed scenes use direct scroll-linked progression rather than independent easing that causes the visual position to drift behind the scroll position.

Do not animate layout properties unnecessarily. Favor compositor-friendly transforms and opacity.

---

# 4. Final Component Specifications

## 4.1 Header

**Existing component:** `SiteShell.tsx`

Preserve existing structure, logo, links, language controls and journey actions.

States:

**Top of page**
- Existing transparent appearance on applicable homepage scenes.
- Existing 92px height.
- Readable navigation and visible actions.

**Scrolled**
- Transition to 72px header.
- Deep teal background.
- Controlled backdrop treatment.
- 260ms transition.
- No text or navigation jumping.
- No shift in page content.

**Navigation hover**
- Thin bronze indicator.
- 180ms transition.
- Persistent current-page state.
- Keyboard focus has visible equivalent.

No replacement navigation architecture.

## 4.2 Türkiye Mega Menu

**Existing component:** `SiteShell.tsx`  
**Existing stylesheet:** `recovery-shell.css`

Preserve its two-column directory and photographic preview.

**Geometry**

- Existing full-width dropdown.
- Directory approximately 54%.
- Photographic preview approximately 46%.
- Preserve existing content groups and twelve destination links.
- Preserve existing image/copy/action composition.

**Opening**

- Duration 320ms.
- Panel settles from `translateY(-12px)` to zero.
- Opacity transitions from 0.96 to 1.
- Directory and image settle as one composition.
- No large individual link cascade.

**Closing**

- Duration 220ms.
- Short reverse transition.
- Panel stops intercepting input when dismissed.
- No visually stranded overlays.

**Destination hover/focus**

- Active text and indicator update within 180ms.
- Incoming photograph uses a 420ms crossfade.
- Incoming image settles from scale 1.035 to 1.
- Destination title settles vertically by 7px over 220ms.
- Incoming image should be ready or a stable fallback must remain visible.
- Rapid changes resolve to the latest destination.
- No accumulating transition queue.

**Keyboard**

- Focus can preview a destination.
- Escape dismisses the menu.
- Focus remains predictable.
- Standard link navigation continues working.
- No modal focus trap.

**Touch**

The desktop hover menu is not transplanted onto mobile. Existing mobile navigation is retained and upgraded independently.

## 4.3 Mobile Menu

Preserve existing native dialog semantics and content.

- Panel entrance: 300ms.
- Exit: 220ms.
- Navigation items settle over the same interval with restrained 40ms overlapping stagger.
- Preserve scroll containment, focus trapping and restoration.
- Menu is fully usable without animation.
- Safe-area and short-landscape behavior remain correct.

Do not replace the existing dialog with a custom div overlay.

## 4.4 Global Buttons and Links

**Primary bronze CTA**

- Background brightens subtly on hover.
- Arrow moves 4px in logical inline direction over 220ms.
- Press scale: 0.985 for 110–140ms.
- Preserve current geometry and label.

**Editorial link**

- Underline progresses over 260ms.
- Directional icon translates 4px.
- Label does not move.

**Journey selection**

- Selected border and background settle over 220ms.
- Plus/check state reflects the actual JourneyStore value.
- Hover does not imply selection.

**Disabled state**

- No hover movement.
- No misleading visual feedback.

No universal magnetic effect.

## 4.5 Service Worlds

**Existing component:** `ServiceWorldsV3.tsx`

Preserve the three asymmetric cards and their arrangement.

**Explore and Holiday**

- Internal image hover scale: 1.04.
- Optional pointer depth: maximum 10px.
- Duration: 450ms.

**Hajj and Umrah**

- Internal image scale: 1.025.
- No decorative rotation.
- Duration: 450ms.

**Corporate**

- Internal image scale: 1.03.
- Bronze detail responds with restrained emphasis.
- Duration: 450ms.

For all three:

- Images move inside existing frames.
- Card geometry remains stable.
- Copy and directional action react coherently.
- Selection remains separate from hover.
- Selected state survives mouse exit.
- Touch and keyboard states remain complete.

**Scroll entrance**

- Existing composition only.
- Heading settles from 18px over 700ms.
- Photographic elements become visible in reading order.
- No new long pinned scene.
- Do not take ownership of transforms already controlled by GSAP.

## 4.6 Türkiye Explorer

**Existing component:** `TurkeyDiscovery.tsx`

Preserve index, map, imagery, content and selection logic.

Motion Division pattern:

`AnimatePresence-image-gallery.tsx`

**Interaction**

- Active destination changes immediately.
- Preview photograph crossfades over 420ms.
- Incoming photo scale: 1.035 → 1.
- Destination title settles over 220ms.
- Corresponding map marker updates in the same state transaction.
- Marker visual response: 180ms.
- Repeated selections cancel superseded animations.
- No blank photography.
- No stale text or marker states.

The route to a destination remains a real localized link.

Geographic shapes are never mirrored in Arabic.

## 4.7 Signature Destination Cards

Preserve their existing editorial dimensions and asymmetry.

**Hover**

- Image scale: 1.03.
- Image translation: maximum 10px.
- Duration: 450ms.
- Arrow translation: 4px over 220ms.
- No rotation of the entire card.

**Navigation**

Use existing `DestinationPortal` support.

Validate a 450ms image-to-destination transition where supported. Fallback to normal navigation on unsupported browsers.

Do not stack competing Motion layout and React View Transition controllers on the same image.

## 4.8 JourneyBuilder and JourneyDrawer

Preserve `JourneyStore` and all current business behavior.

Motion Division references:

`Drag-to-reorder.tsx`

`Shared-layout-continuity.tsx`

**Add destination**

- Immediate JourneyStore update.
- Confirmed control state.
- New item settles into position over 280ms.
- Preview image updates over 420ms.

**Remove destination**

- Immediate state update.
- Outgoing item exits over 200ms.
- Remaining items reposition over 280ms.

**Reorder**

- Animate vertical layout displacement over 280ms.
- Maintain stable item identity.
- Keep existing accessible up/down controls.
- Do not require dragging to reorder.

**Drawer**

- Entrance: 340ms.
- Exit: 240ms.
- Existing native dialog behavior retained.
- Focus trapping and return preserved.
- Scroll contained correctly.

**Forms and submission**

- Inputs respond immediately.
- No animated delay while typing.
- Contact query values are preserved.
- Do not invent server submission or reservation behavior.

## 4.9 Global Editorial Motion

Use Taste Skill's content-specific reveal patterns.

**Headings**
- Enter from 16–24px.
- Duration: 700ms.
- Line-safe masks.
- Turkish diacritics and Arabic shaping preserved.

**Photography**
- Settling scale typically 1.04–1.00.
- Selected large openings may use a restrained shutter reveal.
- Standard reveal duration: 1100ms.

**Paragraphs**
- Small 12–16px settling.
- Duration: 550–700ms.
- Reading order respected.

**Figures**
- Animate only once when actually visible.
- No fabricated values.

**Process sections**
- Reveal items in reading order.
- Active process state must remain understandable without motion.

Do not apply the same entrance animation indiscriminately to every paragraph.

---

# 5. Locked Homepage Choreography

Preserve all fifteen existing chapters.

| Chapter | Treatment |
|---|---|
| Arrival | Existing Istanbul hero, upgraded entrance and scroll choreography |
| Service Worlds | Asymmetric photographic depth and selection feedback |
| Türkiye Threshold | Controlled photo shutter and headline reveal |
| Türkiye Explorer | Motion Division image crossfade and map synchronization |
| Signature Places | LivingImage hover depth and shared destination transitions |
| Bosphorus Film | Preserve video and poster; subtle section entrance |
| Story | Editorial reading-order reveal |
| Proof | Calm statement reveals |
| Numbers | One-time figure animation |
| Process | Progressive emphasis and bronze-route movement |
| Services | Contextual image and link interactions |
| Journey Builder | Motion layout for selected itinerary |
| Beyond Türkiye | Photographic index/hover preview behavior |
| FAQ | Smooth disclosure transitions with stable focus |
| Final Invitation | Restrained cinematic photographic opening and route endpoint |

**The hero, Türkiye discovery and final invitation are the three strongest visual moments.**

Do not give all fifteen chapters equal animation intensity.

Keep the existing bronze identity but prevent the ribbon from overpowering the headline or appearing disconnected between sections.

---

# 6. Hero Preservation and Known Defect

The existing local V4 hero prototype is a separate, partially verified checkpoint.

Its reported desktop cold-load entrance sometimes cancels and restarts, extending the total duration beyond the intended 1500ms.

Do not:

- Treat its regression-suite PASS as final hero acceptance.
- Hide the issue by changing duration assertions.
- Rewrite the bronze scene during unrelated component work.
- Reconstruct the original hero from older remote code.
- Claim the hero is complete based on CSS duration alone.

The dedicated hero milestone must establish one uninterrupted entrance, correct scroll handoff and fresh timing evidence.

The chosen hero remains:

**TÜRKİYE BEGINS HERE.**

Preserve Istanbul imagery, current main CTAs, existing copy and the bronze-route identity.

---

# 7. Responsive and Capability Policy

**Eligible desktop enhanced mode**

- Width ≥1024px.
- Height ≥800px for pinned scenes.
- Fine pointer.
- Motion not reduced.
- Data saving not requested.

Only appropriate effects receive WebGL enhancement.

**Tablet**

- Native scroll.
- No heavy hero pin.
- Reduced image movement.
- Tap-based destination selection.

**Mobile**

- Native vertical scroll.
- Intentional image crops.
- Short, controlled entrances.
- No hover-only information.
- No simulated pointer depth.

**Reduced motion**

- Complete readable final states.
- No large-scale travel, parallax or decorative loops.
- Menus, forms and journeys remain operational.

**RTL**

- Correct Arabic text shaping.
- Directional controls use logical inline movement.
- Photography, coordinates and geography retain orientation.

**WebGL failure**

- Preserve existing SVG/static visual fallback.
- No missing text or controls.

---

# 8. Animation Engine Ownership

| Engine | Exclusive responsibility |
|---|---|
| Motion for React | Hover, press, menu state, photographic previews, layout changes, itinerary |
| GSAP / ScrollTrigger | Large scroll-linked scenes, hero departures and route progression |
| React Three Fiber | Eligible bronze sculpture only |
| React View Transitions | Validated shared destination-page transitions |
| CSS | Simple colors, outlines, underlines and static fallbacks |

**One animated property must have one owner.**

Nested elements may divide responsibility. For example, GSAP moves the outer scroll stage while Motion animates an inner photographic surface.

No competing scroll clocks.

No unnecessary new dependencies.

---

# 9. Mandatory Taste Skill Review

At every visual milestone:

1. Capture browser-rendered desktop, tablet and mobile screenshots.
2. Inspect real entrance and exit motion.
3. Record meaningful hover/selection states.
4. Evaluate hierarchy, spacing, typography, image treatment and brand consistency.
5. Use the Taste Skill visual critique methodology.
6. Inspect scroll scenes at representative progress intervals.
7. Identify and correct genuine layout/motion failures.
8. Re-test affected behavior.

Use the source's design/usability/creativity/content weighting as a supplementary critique rubric.

Ignore style-only warnings that conflict with Trip Line's explicitly retained typography, editorial numbering or brand treatment.

A visually generic but technically functioning animation is not accepted.

A static screenshot is not evidence of successful animation.

---

# 10. Mandatory QA

Use actual production-preview browser rendering.

Test:

- 1920 × 1080
- 1440 × 900
- 1024 desktop threshold
- 768 × 1024 tablet
- 390 × 844 mobile
- 844 × 390 landscape
- English, Turkish and Arabic
- Keyboard and visible focus
- Reduced motion
- SaveData
- Delayed/broken image
- No WebGL
- Fast and reverse scrolling
- Rapid hover and menu interruptions
- Repeated destination selection
- Journey add/remove/reorder
- Contact inquiry preservation

Run the repository's required typecheck, lint, tests, build and public/V3 browser verification at the applicable milestone boundary.

Measure animation behavior and record test failures truthfully.

Do not assert production Core Web Vitals compliance from development screenshots.

---

# 11. Implementation Milestones

The full V4 scope is approved as an implementation direction, but the repository's existing bounded-task and review gates remain authoritative.

**M01 — Navigation and Mega Menu**

SiteShell, photographic preview, navigation hover and mobile menu.

**M02 — Global Interaction Primitives**

Buttons, editorial links, LivingImage, shared hover/focus treatment.

**M03 — Service Worlds and Scroll Handoff**

Existing asymmetric service cards and the existing transition into them.

**M04 — Türkiye Explorer and Destination Photography**

Map/list/image synchronization, signature cards, shared destination navigation.

**M05 — Journey Builder and Drawer**

Selected-item motion, reordering, drawer and preview transitions.

**M06 — Hero Motion Reliability**

Resolve the known cold entrance defect and verify the bronze/scroll lifecycle.

**M07 — Remaining Page-Family Motion**

Services, destination details, international, business, pilgrimage, About, contact, FAQ and footer.

**M08 — Final Rendered Acceptance**

Cross-page recordings, responsive review, functional regression, performance and accessibility.

Each milestone is independently reviewable.

Do not begin subsequent milestone implementation until the current milestone reaches its required acceptance state.

---

# 12. Immediate Authorized Task — M01 Only

**Start M01 now.**

## Scope

Implement only:

- Existing desktop navigation hover indicators.
- Existing header compacting transition.
- Türkiye mega-menu entrance and exit.
- Türkiye mega-menu photographic preview transition.
- Existing mobile-menu entrance and exit.

Apply the exact states, geometry, timings and responsive rules defined in sections 3, 4.1, 4.2 and 4.3.

## Permitted application paths

- `frontend-v2/components/travel/SiteShell.tsx`
- `frontend-v2/styles/recovery-shell.css`

If a small dedicated helper is strictly necessary, use:

- `frontend-v2/components/experience/MegaPreviewMotion.tsx`

Before writing a helper, confirm it avoids real duplication.

Do not modify the hero, Service Worlds, destination gallery, JourneyStore, inquiry system or other page families.

Create the required task/report and evidence files according to the existing repository protocol.

## Baseline protection

Inspect the local branch and Git status first.

Prefer the newest valid local V4 checkpoint, which may not exist on GitHub.

Never discard, reset, stash or overwrite uncommitted or unpushed work.

If the expected local baseline is absent, stop and report the exact discrepancy instead of silently starting from an older branch.

## Required M01 evidence

Capture:

- Mega menu opening at 0%, 25%, 50%, 75% and 100%.
- Mega menu closing.
- Fast transitions between at least three destinations.
- Repeated open/close interruption.
- Keyboard focus previews and Escape behavior.
- Mobile-menu entrance and closing.
- Arabic RTL navigation.
- Reduced-motion behavior.
- Existing destination navigation and Add to Journey behavior.

Check initial render, hydration, navigation and focus.

## M01 final deliverable

Report:

- Exact changed files.
- Which Motion Division examples informed the implementation.
- Taste Skill critique findings.
- Before/after screenshots.
- Actual interaction recordings.
- Test results.
- Commit SHA.
- Local preview URL.
- Any failures or unresolved limitations.

**Stop after M01.**

Do not move on to hover primitives, Service Worlds, galleries or any other page family.

Do not describe implementation as user-approved until rendered review and user acceptance occur.

---

## Final engineering instruction

**You are an implementation engineer, not the art director.**

The creative decisions have already been made.

Implement the specified interaction behavior faithfully. Preserve Trip Line's existing UI/UX and distinctive identity.

If a specified behavior is technically impossible or would break accessibility, report the exact conflict and propose the smallest viable implementation alternative. Do not invent a different design.

**The result should feel like Trip Line, beautifully brought to life—not a different website.**