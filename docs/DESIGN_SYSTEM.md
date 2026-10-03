# Design system

Current active design system, consolidated 3 October 2026. The October approved direction
and Bronze Journey continuation govern `frontend-v2/`. Older V1 token/type references
below are preserved as historical reasoning, not instructions to revert active styles.

## Active identity and tokens

Preserve actual stacked Trip Line logo, muted teal, ivory/sand, bronze/gold accents,
cinematic travel media, bold editorial typography, spatial/asymmetric layouts,
generous whitespace and the route/ribbon language.
Base tokens are in `frontend-v2/styles/travel.css`; the current TL-002 public palette
is scoped to `.travel-site` in `styles/experience.css`. The user explicitly selected
these values in the [reconstruction specification](tasks/TL-002-reconstruction-instructions.md).

| Active token | Value |
| --- | --- |
| teal | #194244 |
| deep / night | #071F20 |
| sand / paper / ivory | #E4D7C1 / #F8EFE0 / #FFFDF8 |
| bronze / ink | #C89039 / #194244 |
| maximum composition | 1320px |
| gutter | clamp(22px, 4.4vw, 80px) |

Current layout loads Manrope and Noto Sans Arabic via next/font. Bold sans-serif headings
and connected Arabic typography supersede the early Instrument Serif default.
Use active semantic tokens and inspect actual component CSS before editing.
Source-derived stacked logo lives at `public/media/logo-source.png`; an earlier compact
flight-mark approximation is not authority to replace that identity.

## Composition rules

Prefer editorial asymmetry, purposeful overlapping layers, controlled bleed, large type,
spatial depth, varied section rhythm, deliberate negative space and narrative media.
Avoid repeating the same grid in every section, excessive bordered cards, unnecessary
containers, generic icon-feature rows and visual clutter.

Reusable components maintain consistent language while allowing different editorial
compositions; reuse must not make every page visually identical.

## Interaction and accessibility

Hover/focus states are purposeful. Essential information never depends only on hover.
Keyboard focus stays visible; labels, semantic landmarks, native menu/disclosures and
form errors remain accessible. Target WCAG 2.2 AA, practical 44px touch targets and 200%
text zoom. These are requirements, not a claim that a complete audit has passed.
Read [motion](MOTION_SYSTEM.md) and [responsive rules](RESPONSIVE_RULES.md) for those
authoritative behaviors. Preserve real geography and photo orientation in Arabic.

## Required references

The supplied Trip Line logo and approved visual concept are preserved in docs/references. The supplied [Snami Travel reference](https://www.snamitravel.com/) was reviewed on 2026-09-27 through rendered browser views and page content. Snami informs editorial confidence, whitespace, photography, typography, and pacing only; do not copy its assets, composition, fonts, code, or branding.

Observed principles: the opening uses immersive edge-to-edge imagery and oversized, spare display type. The following story section pairs a tall atmospheric photograph with a spacious dark text area and a compact paragraph. Content proceeds from identity and philosophy into services and destinations, with photography carrying much of the narrative. Trip Line should apply the confidence in scale, selective emphasis, and breathing room through its own teal/ivory palette, specified fonts, gold flight path, and approved composition. No reference assets were downloaded or incorporated. The review does not establish the reference site's accessibility, performance, or cross-device quality.

## User quality benchmarks — September 27, 2026

The user explicitly identified these as the design standard they want in every design:

- https://www.jaeco.fr/ — distinctive brand presence, immersive opening media, bold navigation and coordinated visual details.
- https://www.meermohsin.me/ — expressive typography, immersive visual storytelling and ambition in interactive/3D presentation. Initial browser review reached its textured red typographic entry screen; the full motion experience has not been audited.
- https://www.melinegobet.fr/ — refined editorial serif typography, generous whitespace, restrained warm colors and custom illustrative details.

Apply this quality bar to subsequent Trip Line work: deliberate composition throughout every page, careful type scale and line breaks, consistent spacing, original brand details, and purposeful motion. Design phone layouts as complete compositions with the same care as desktop. Check actual rendered pages and interactions before claiming completion; preserve readable content, keyboard operation, reduced-motion support and fast loading.

These references inspire craft and quality, never templates to copy. Trip Line retains
its own teal/sand/bronze identity. Their historical review does not certify current
frontend quality, reference-site performance or full motion behavior.

## Historical V1 identity reasoning

Creative concept: The Journey in Motion. The gold curved flight line expresses connection, departure, arrival, and discovery. Use restrained teal, ivory, cinematic photography, editorial serif typography, asymmetry, and generous space. Avoid generic travel grids, SaaS styling, blue-and-white palettes, luxury clichés, and excessive gold or blur.

## Historical V1 initial tokens — superseded for active V2

| Token | Initial value |
| --- | --- |
| teal-950 | #071F20 |
| teal-900 | #0D3334 |
| teal-800 | #194244 |
| teal-700 | #285454 |
| ivory | #F8EFE0 |
| warm-white | #FFFDF8 |
| sand | #E4D7C1 |
| gold | #D7AA4D |
| gold-light | #EAC56F |
| gold-dark | #A8792D |
| text-dark | #102A2B |
| text-light | #F5EFE4 |

Logo sampling: lower-left background clustered around RGB(25,66,68) / #194244; lettering sampled RGB(248,239,224) / #F8EFE0; shaded gold sampled RGB(200,144,57) / #C89039. The photographed logo has lighting variation, so gold remains the specified #D7AA4D midtone with lighter/darker semantic companions. CSS uses these colors and deeper teal surfaces for text contrast. Production contrast auditing remains required.

Phone composition: three-line home headline sized for 360–430px, quiet teal copy area over a separate lower photograph with a soft mask, simplified flight path below the copy, 14px body text, image-first service cards on ivory, 50px form controls, and native modal navigation. The sample metrics and contact details visible in the reference concept are not rendered.

## Historical V1 typography and layout

Instrument Serif display and Manrope body/UI through next/font, minimal weights. Fluid typography: hero clamp(4.2rem, 7.5vw, 8.5rem), editorial statement clamp(3.5rem, 6vw, 7rem), H2 clamp(2.5rem, 4vw, 4.5rem). Mobile composition needs its own line breaks and scale. Use CSS logical properties for future RTL.

Desktop content approximately 1280px, maximum composition 1440px, 12-column grid, 48–72px gutters, and 100–160px section spacing. Tablet gutters 32px; mobile 20px with 64–96px section spacing. Use controlled bleed and varied editorial compositions.

## Historical timing guidance and accessibility intent

Reveal: opacity and 24–36px translation over 650–850ms. Images: mask reveal and scale 1.05 to 1 over 900–1200ms. Hover: at most -3px lift, 1.025 image scale, and 4px arrow shift. Pointer depth capped at ±2 degrees X and ±3 degrees Y.

Reduced motion disables route drawing, parallax, pointer tilt, camera and object movement; content stays visible. JourneyLine supports start/end/aircraft markers, static/scroll modes, dark/light variants, and solid/gradient gold. Use selectively in hero, philosophy, process, and final CTA.

Target WCAG 2.2 AA: keyboard access, visible focus, semantic landmarks, labeled forms, error summaries, contrast, 200% text zoom, practical 44px targets, and no hover-only information. Admin uses a teal sidebar and calm ivory workspace, without cinematic effects.
