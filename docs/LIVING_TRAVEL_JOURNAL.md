# Trip Line — The Living Travel Journal

Research and proposed concept, September 27, 2026. User requested a more creative, extensively interactive combination of options 2 and 3, supported by online research. This is a proposal, not implemented behavior or a replacement of the live demo. The generated storyboard is illustrative: typography, logo, geography, copy and imagery require implementation review. Preserve the approved Trip Line identity.

## Creative direction

Warm ivory editorial pages, cinematic teal photographic scenes, oversized condensed display typography paired selectively with italic serif, short handwritten captions, photographic prints, restrained gold route lines. A consistent physical vocabulary: unfold for revealing detail, glide for moving between places, stamp for confirming a choice. Meaningful content remains readable at rest.

The primary journey: discover a place → save it to a personal journal → review interests → include those interests in an inquiry. The journal is a wishlist, not a confirmed itinerary or booking. Initial demo saves destination IDs locally with explicit remove/clear controls, no account needed. Personal contact fields are not persisted. Contact remains explicitly non-sending until the backend is connected.

## Component behaviors

| Component | Desktop behavior | Phone behavior | Purpose |
| --- | --- | --- | --- |
| Horizon hero | City / Sky / Sea buttons change photo, caption and destination link together; fine route redraw; subtle pointer depth on imagery only | Same visible tabs; short crossfade; fixed type, no pointer depth | Explore three themes without waiting for autoplay |
| Journey line | Decorative SVG draws within individual sections; chapter markers link to sections | Small inline chapter markers | Connect the visual narrative and provide orientation |
| Postcard gallery | Fanned prints straighten on hover/focus, arrow or optional drag changes active item; separate Open and Save controls | Native scroll-snap with visible arrows and labels; tap opens | Browse and collect destinations |
| Saved journal | Drawer with thumbnails, removable interests and Plan around these CTA; brief stamp feedback on save | Full-height accessible panel with clear close/back and safe-area spacing | Preserve choices and inform inquiry |
| Service index | Large editorial rows expand by click, show useful copy and linked photograph; plus becomes minus | Vertical accordion, content beneath each trigger | Make practical services easy to compare |
| Illustrated atlas | Named map buttons and equivalent text list select a destination preview; schematic routes explicitly not driving directions | List first; optional map view | Explain where places are |
| Navigation | Clear normal links; menu unfolds as an ivory index with contained image previews on focus/hover | Large labeled links, image thumbnails, immediate close | Reach any page quickly |
| Service detail | Existing service routes use photographic opener, chapter anchors, illustrated inclusions and FAQ; optional shared-image transition | Vertical reading order, obvious inquiry CTA | Support actual decisions beyond the homepage |
| About | Editorial photo stack, short company narrative, route drawing between meaningful sections | Single-column photo and copy sequence | Express personality without fabricated evidence |
| Contact postcard | Ordinary labeled fields framed as a postcard; saved interests prefilled as removable tags | Single column, comfortable controls, keyboard-safe submit | Make inquiry straightforward |
| Buttons and links | Arrow glides, underline draws, press responds; hit target stays stationary | Clear press feedback | Consistent feedback everywhere |
| Footer and 404 | Route resolves at contact CTA; 404 has one optional playful airplane response and direct navigation | Static illustration and clear links | Complete the site with equal care |

## Motion direction and proposed budgets

Feedback: 120–180ms. Menus, accordions and selection changes: 220–350ms. Editorial reveals: 450–650ms. Initial decorative sequence: at most roughly 900ms, overlapping and never gating controls. These are starting design targets, to tune in a running prototype.

Three larger signature moments: horizon change, postcard browsing, journal assembly. Other components get one restrained response. No long pinned sequences, required entrance screens, custom cursor replacement, auto-navigation at the page bottom, continuous text distortion, or essential information visible only on hover. Preserve native scroll. Buttons are usable immediately, and transitions can be interrupted by further input.

Respect OS reduced motion and provide a visible motion preference: replace travel, rotation and parallax with immediate state changes or brief fades. No content starts permanently hidden pending animation. All drag interactions retain clickable/tappable alternatives as well as keyboard access. Dialogs restore focus; controls expose names and state. Pause any optional ongoing background motion.

## Implementation approach

The existing frontend already includes Motion and React Three Fiber. Start with CSS, SVG and Motion for interactive states, scroll-linked paths and layout transitions. Do not add GSAP, Lenis or Rive merely to reproduce a reference's stack. Use normal Next links and readable server-rendered content. Any shared-image transition is progressive enhancement with normal routing fallback.

An optional lazy-loaded 3D gold aircraft can enhance the hero after core content loads; use an SVG fallback and suspend rendering offscreen. The design must stand on photography, type and layout without WebGL. Animate transforms and opacity preferentially; profile masks, large textures and filters. Avoid animation state updating through React every frame.

Prototype order: hero + postcard gallery + journal first, tested on phone; then extend the same behaviors into navigation, services, detail, about and contact. This validates the motion character before rebuilding every route.

## Acceptance targets (not measured results)

- Complete a service-to-inquiry journey by touch and keyboard without waiting for decorative animations.
- Inspect 360, 390, 430, 768 and 1440px layouts, long text, 200% zoom and reduced motion.
- Test real Safari/iOS and Chrome/Android where available; document gaps rather than claim certification.
- Target LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile in field data. Use lab checks during development; do not equate those to a field pass.
- Check motion smoothness separately from INP, which measures click/tap/key response rather than scrolling.
- Check saved-interest remove/clear, browser back, interruption of transitions, focus restoration, form errors and slow loading.
- Replace repeated sample imagery with a coherent, licensed or clearly labeled concept collection. No invented offers, testimonials or destination availability.

## Research and implications

Sources read September 27, 2026. These are author case studies, examples and official technical guidance, not independent performance certifications. Proposal decisions above are our synthesis.

1. [Spain Collection — Dgrees case study](https://tympanus.net/codrops/2025/12/18/spain-collection-evolving-a-luxury-website-into-a-digital-ecosystem/): modular editorial system, curated photography, familiar navigation and direct-addressable detail content. Apply coherence across pages and keep aspiration connected to inquiries.
2. [Podium — creators' case study](https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/): image-led transitions, typographic hierarchy and deliberate pacing. Apply a connected motion vocabulary; do not import its entire stack or slower pacing wholesale.
3. [Codrops menu image reveal](https://tympanus.net/codrops/2020/07/01/creating-a-menu-image-animation-on-hover/): inspiration for photographic navigation feedback. Adapt to contained previews, keyboard focus and visible mobile thumbnails.
4. [Codrops motion trails demo](https://tympanus.net/Development/MotionTrailAnimations/): considered but rejected as a site-wide effect because it would compete with travel content.
5. [Nature Beyond Technology — creator case study](https://tympanus.net/codrops/2025/12/04/crafting-nature-beyond-technology-a-project-from-roots-to-leaves/): demonstrates concept-driven WebGL and exploratory interaction. Supports selective 3D; does not establish a mobile performance guarantee.
6. [Motion React scroll animations](https://motion.dev/docs/react-scroll-animations): scroll-linked paths, image reveals and parallax can use existing Motion infrastructure.
7. [Motion reduced-motion hook](https://motion.dev/docs/react-use-reduced-motion): implement an alternative motion treatment while preserving function.
8. [W3C dragging movements, AA](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): provide single-pointer alternatives to dragging, separately from keyboard access.
9. [W3C animation from interactions, AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): voluntary motion control beyond the baseline AA target.
10. [web.dev animation performance](https://web.dev/articles/animations-guide): prefer economical animation properties and measure actual rendering work.
11. [web.dev INP](https://web.dev/articles/inp): evaluate interaction responsiveness throughout a visit, not only after loading.

The user-provided Jaéco, Meer Mohsin and Méline Gobet references remain the aesthetic benchmarks recorded in DESIGN_SYSTEM.md; this research builds on those references.
