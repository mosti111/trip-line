# TL-V3-RECONSTRUCTION — Trip Line “The Bronze Journey”

## Objective

Reconstruct the active Trip Line public frontend into the approved **Bronze Journey** experience.

This is a substantial frontend experience reconstruction.

This is NOT:

- V2 with extra fades
- V2 with parallax added
- V2 with a Three.js object floating over it
- V2 with renamed components
- an animation-polish task
- a QA-only task

The rendered experience must be materially different from V2.

A person unfamiliar with the code should be able to compare V2 and the finished V3 visually and immediately understand that the experience has been rebuilt.

---

# 1. PRODUCT EXPERIENCE

Trip Line should feel like the visitor is moving through a journey.

The website should behave as a sequence of cinematic travel chapters connected by a bronze route.

Core progression:

```
ARRIVAL
   ↓
THE JOURNEY BEGINS
   ↓
WAYS TO TRAVEL
   ↓
ENTER TÜRKİYE
   ↓
DESTINATION PORTALS
   ↓
STORIES / EXPERIENCE
   ↓
BUILD YOUR JOURNEY
   ↓
ARRIVAL / CONTACT
```

The entire homepage must feel intentionally connected.

Avoid the normal website rhythm:

```
Hero
↓
Section
↓
Cards
↓
Section
↓
Map
↓
Section
↓
Form
↓
Footer
```

---

# 2. DESIGN LANGUAGE

Preserve the existing Trip Line identity.

## Primary palette

Deep teal:
`#071F20`

Primary teal:
`#194244`

Ivory:
`#F8EFE0`

Warm white:
`#FFFDF8`

Sand:
`#E4D7C1`

Bronze/gold family:
`#D7AA4D`
`#C89039`
`#A8792D`

Do NOT convert Trip Line into a black/gold luxury template.

Bronze is an accent and narrative material, not the entire palette.

---

# 3. TYPOGRAPHY

The typography should behave editorially.

Use the project's current approved fonts unless the existing design system explicitly authorizes another choice.

The experience should combine:

- very large display typography
- compact editorial body copy
- generous negative space
- intentional line breaks
- asymmetrical composition

Avoid generic centered:

```
heading
paragraph
button
```

patterns throughout the page.

---

# 4. GLOBAL PAGE STRUCTURE

The homepage should be reconstructed into these experience chapters:

1. Arrival Hero
2. Transition / Departure
3. Ways to Travel
4. Türkiye Introduction
5. Türkiye Destination Explorer
6. Destination Portal Sequence
7. Trip Line Story / Philosophy
8. Journey Planning
9. Arrival CTA
10. Footer

The bronze route visually connects these chapters.

The route does not need to remain literally visible at every pixel of scrolling.

It should instead feel like the same object/language evolving through the journey.

---

# 5. CHAPTER 1 — ARRIVAL HERO

## Desktop concept

Viewport:

approximately `100svh`.

Opening state:

- cinematic Istanbul/travel media fills most or all of viewport
- deep teal atmosphere
- very large editorial Trip Line statement
- logo/navigation minimal and elegant
- bronze route starts subtly within the scene

Typography should occupy significant visual space.

Do not put the entire hero into a conventional centered content container.

Preferred composition:

```
┌─────────────────────────────────────────────────┐
│ LOGO                              MENU      LANG │
│                                                 │
│                                                 │
│     DISCOVER                                    │
│           TÜRKİYE                               │
│                 DIFFERENTLY                     │
│                                                 │
│                         cinematic moving media  │
│                                                 │
│       bronze path enters environment            │
│                                                 │
│                    SCROLL / BEGIN               │
└─────────────────────────────────────────────────┘
```

The exact headline should use approved localized content already in the project.

Do not invent new claims.

---

# 6. HERO DEPTH

Use multiple visual planes.

Example:

Plane 1:
background media

Plane 2:
subtle environmental overlay / gradient

Plane 3:
typography

Plane 4:
bronze route / spatial element

Plane 5:
small UI/navigation

Movement must be subtle.

Pointer movement on fine pointer:

media:
~1–2%

foreground/route:
slightly stronger depth response

Typography should remain stable enough to read.

Disable pointer effects for:

```
(pointer: coarse)
```

---

# 7. HERO SCROLL TRANSITION

The first scroll must be one of the strongest V3 improvements.

Do NOT simply scroll the hero upward.

Desired sequence:

### 0–20%

Hero stays largely intact.

Bronze route begins reacting.

### 20–55%

Typography shifts/scales slightly.

Background media changes framing.

Route moves forward/spatially toward next chapter.

### 55–80%

Hero content begins leaving.

Next chapter starts entering visually underneath/through it.

### 80–100%

Bronze route becomes the bridge into chapter 2.

The transition should feel like entering the journey.

No hard white-space break.

---

# 8. CHAPTER 2 — DEPARTURE

This should be a short visual breathing chapter.

Goal:

Establish the Trip Line philosophy without feeling like a regular “About” section.

Composition:

large editorial statement + smaller contextual copy.

Possible structure:

```
         Travel is not
         a list of places.

                           It is the line
                           between them.
```

Use only approved/source-compatible messaging.

If exact copy is not approved, preserve existing copy but restructure presentation.

Bronze line should pass through or alongside this chapter.

---

# 9. TEXT REVEALS

Do NOT animate every word individually.

Use:

- line clipping
- mask reveals
- block movement
- opacity + transform combinations

Suggested timing:

small UI:
180–320ms

section text:
550–800ms

major editorial reveal:
750–1100ms

large media transition:
900–1400ms

Avoid uniform durations everywhere.

---

# 10. CHAPTER 3 — WAYS TO TRAVEL

Current services must stop looking like normal cards/tabs.

This becomes an immersive service selector.

## Desktop

Use 3 primary service worlds or approved grouping from current project structure.

Possible layout:

```
┌─────────────────────────────────────────────┐

       HOW DO YOU
       WANT TO TRAVEL?

  01   LEISURE
  02   BUSINESS
  03   BESPOKE

                         [ACTIVE MEDIA]
                         [ACTIVE MEDIA]
                         [ACTIVE MEDIA]

          active description
          Explore →
└─────────────────────────────────────────────┘
```

Selection changes:

- media
- description
- bronze route behavior
- number emphasis
- typography state

Inactive options remain clearly readable.

---

# 11. SERVICE INTERACTION

On hover/focus:

Do not simply scale the card.

Instead use:

- number movement
- underline/route response
- media transition
- text weight/opacity
- directional reveal

Keyboard:

Arrow navigation may be added if appropriate.

Tab navigation must always work.

Touch:

tap selects.

No hover dependency.

---

# 12. SERVICE MEDIA TRANSITION

When changing active service:

Old media:

scale ~1 → 1.03  
opacity → 0  
optional mask exit

New media:

scale ~1.05 → 1  
opacity 0 → 1

Duration:

roughly 650–950ms.

Do not flash or fully unload layout.

---

# 13. TRANSITION INTO TÜRKİYE

This should be a major cinematic chapter shift.

Transition from service-world sand/ivory into deep teal geographical exploration.

Bronze route can:

- stretch
- curve
- travel across viewport
- become a geographic/navigation motif

Large typography:

```
ENTER
TÜRKİYE
```

or equivalent approved localized content.

Türkiye should feel like the central Trip Line story.

---

# 14. CHAPTER 4 — TÜRKİYE INTRODUCTION

Do not immediately show map + controls.

Give Türkiye an entrance.

Suggested structure:

full or near-full viewport chapter.

Large:

```
12 PLACES
ONE JOURNEY
```

or existing approved content.

Use:

- environmental image
- route movement
- large scale typography
- place names appearing subtly

Then transition into discovery interface.

---

# 15. CHAPTER 5 — TÜRKİYE EXPLORER

This should be a signature Trip Line interaction.

Existing twelve places remain:

1. Istanbul
2. Trabzon
3. Rize & Ayder
4. Uzungöl
5. Antalya
6. Bodrum
7. Fethiye
8. Marmaris
9. Sapanca
10. Bursa
11. Yalova
12. Cappadocia

Do not remove any.

---

# 16. DESKTOP TÜRKİYE LAYOUT

Preferred composition:

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  01 Istanbul                       large destination  │
│  02 Trabzon                        media              │
│  03 Rize & Ayder                                      │
│  04 Uzungöl                      ┌────────────────┐   │
│  05 Antalya                     │                │   │
│  06 Bodrum        MAP           │ DESTINATION    │   │
│  ...              /ROUTE        │ IMAGE/VIDEO    │   │
│                                 │                │   │
│                                 └────────────────┘   │
│                                                       │
│             destination description        Explore → │
└──────────────────────────────────────────────────────┘
```

This is not a literal required grid.

It describes hierarchy.

The active destination must dominate.

---

# 17. DESTINATION SELECTION RESPONSE

When the user selects another destination:

1. current media transitions away
2. map/pin state changes
3. destination number/title moves
4. new media enters
5. description updates
6. bronze route subtly responds

Target overall response:

~700–1100ms.

It must feel cinematic but responsive.

---

# 18. DESTINATION PORTAL

The active destination image should feel like a portal.

Possible implementation:

- oversized clipped media
- subtle perspective/depth
- mask transition
- controlled zoom

Do not use cheesy radial portal graphics.

“Portal” means visual entry into destination.

Not science-fiction UI.

---

# 19. MAP

Keep real geographic correctness.

Never mirror in RTL.

Map interaction:

active destination clearly highlighted.

Inactive destinations:

visible but quiet.

Map should feel integrated into design rather than embedded software.

No generic map-control UI unless necessary.

---

# 20. DESTINATION PAGE TRANSITION

When the user enters a destination page:

prefer a visual relationship between selected destination and detail page.

If feasible within current routing architecture:

active destination media can expand/transition conceptually into detail hero.

Do not block navigation waiting for animation.

Accessibility and browser fallback first.

---

# 21. DESTINATION DETAIL PAGE

Do NOT leave destination pages as conventional hero + sections.

Use a destination-specific chapter structure.

Suggested:

1. Destination arrival
2. place identity
3. signature experiences
4. atmosphere / large media
5. practical context
6. Trip Line service connection
7. inquiry

Maintain content truth.

No invented hotels, prices or tours.

---

# 22. DESTINATION HERO

Example:

```
              01

          ISTANBUL

 Europe                 Asia

        [huge cinematic media]

 "where continents meet"
```

Use actual approved/localized content instead of invented factual claims if unavailable.

Bronze route can connect location metadata to imagery.

---

# 23. INTERNATIONAL DISCOVERY

International discovery remains secondary.

It should visually feel intentional but clearly below Türkiye in hierarchy.

Do not give international directory equal homepage dominance.

Transition language can shift from:

```
Türkiye
↓
Beyond Türkiye
```

---

# 24. CHAPTER 6 — EDITORIAL STORY

This chapter creates pacing.

Use asymmetry.

Example:

```
┌─────────────────────────────────────────────────┐

             [vertical photograph]

                     We don't sell
                     destinations.

     small copy      We design
                     the way you
                     experience them.

└─────────────────────────────────────────────────┘
```

Again, preserve approved copy.

Composition—not invented wording—is the requirement.

---

# 25. MEDIA TREATMENT

Avoid putting every image inside the same rounded rectangle.

Use variety:

- full bleed
- tall portrait
- narrow cinematic crop
- masked edge
- controlled overlap
- wide landscape
- occasional off-grid placement

Border radius should be restrained.

Avoid app-dashboard visual language.

---

# 26. SCROLL DEPTH

Use subtle image parallax.

Typical maximum relative movement:

30–80px depending on size.

Do not create giant parallax offsets.

Never let foreground/background separation cause content collision.

---

# 27. BRONZE ROUTE ARCHITECTURE

The route should have multiple manifestations.

### Hero

spatial / sculptural introduction

### Transition

guides eye downward

### Services

reacts to selection

### Türkiye

becomes geographic connection language

### Story

becomes a quiet graphic line

### Planner

converges toward final destination

### Final CTA

resolves

This creates continuity without forcing one WebGL canvas over the entire site.

---

# 28. 3D STRATEGY

Do NOT build the entire site in WebGL.

Use R3F only where dimensionality adds value.

Recommended:

Hero / transitional bronze ribbon:
R3F

Normal UI:
DOM/CSS/Motion

Map:
existing SVG/geographic implementation

Destination media:
DOM/CSS/Motion unless 3D is justified

This keeps accessibility and performance strong.

---

# 29. RENDERING STRATEGY

Three.js scene:

- lazy-load
- bounded DPR, preferably max 1.5–2 depending on device
- no unnecessary always-on high-frequency loop
- invalidate/render on demand where suitable
- stop/pause offscreen
- dispose resources
- clean listeners
- handle WebGL failure

---

# 30. MOBILE HERO

Mobile must NOT be desktop hero shrunk down.

For 360–430px:

Suggested composition:

```
┌──────────────────┐
│ LOGO        MENU │
│                  │
│ DISCOVER         │
│ TÜRKİYE          │
│ DIFFERENTLY      │
│                  │
│ small intro      │
│                  │
│        bronze    │
│        route     │
│                  │
│   destination   │
│   media         │
│                  │
└──────────────────┘
```

Media may occupy lower half.

Bronze route simplified.

No tiny overlapping typography.

---

# 31. MOBILE MOTION

Preserve:

- chapter reveals
- image transitions
- service selection movement
- destination transitions
- route progression

Reduce:

- camera complexity
- pointer movement
- heavy parallax
- costly 3D
- long pinned sequences

Mobile must still feel designed.

---

# 32. TABLET

Tablet receives its own composition pass.

Especially test:

768–1024px.

Do not let:

desktop split layout collapse awkwardly.

Review:

- type scale
- map
- service selector
- planner
- navigation
- destination media

---

# 33. CHAPTER 7 — JOURNEY PLANNER

The planner/inquiry should feel like the journey is converging.

Not a normal contact form.

Suggested visual flow:

```
YOUR JOURNEY

Where?
When?
For whom?
What kind of experience?

                 ↓

            YOUR TRIP LINE

            [summary]

         Continue on WhatsApp →
```

Use only currently supported input fields/data.

Do not invent booking infrastructure.

---

# 34. PLANNER INTERACTION

Selection should feel progressive.

For example:

each completed step causes:

- route to advance
- summary to build
- next step to become prominent

Avoid wizard UX if it makes current behavior unnecessarily complex.

The existing inquiry implementation may remain structurally intact if the new presentation wraps it appropriately.

---

# 35. FINAL CTA — ARRIVAL

The ending should visually resolve Bronze Journey.

Possible composition:

large teal/sand cinematic chapter.

Bronze line reaches its endpoint.

Typography:

large final invitation.

Existing approved contact CTA remains authoritative.

Footer should emerge naturally rather than abruptly begin.

---

# 36. NAVIGATION

Navigation needs premium interaction.

Desktop:

minimal top navigation.

On scroll:

may shift appearance/contrast but should remain calm.

Menu opening:

should feel editorial/spatial.

Not a generic side drawer.

Possible full-screen menu:

```
01 Türkiye
02 Services
03 Beyond Türkiye
04 About
05 Plan Your Journey

AR / EN / TR
```

Use actual route labels.

---

# 37. MENU MOTION

Menu opening:

background/overlay:
350–500ms

navigation items:
stagger ~40–80ms

media/decorative element:
optional

Closing should be slightly faster.

Focus trap/restoration remains correct.

Escape closes.

---

# 38. BUTTONS / LINKS

Avoid generic pill buttons everywhere.

Use combination of:

- editorial text CTA
- arrow interactions
- outlined CTA where suitable
- solid CTA where hierarchy requires

Hover motion:

arrow translate:
~4–8px

underline/route:
animate

Avoid large scaling.

---

# 39. CURSOR

Do NOT automatically build a custom cursor.

Only introduce one if it materially improves media exploration and does not harm usability.

Default pointer behavior is acceptable.

---

# 40. LOADING

Do not add a long cinematic preloader.

The website should show meaningful content quickly.

If assets need loading:

use graceful progressive reveal.

No forced 3–5 second intro.

---

# 41. REDUCED MOTION

When `prefers-reduced-motion: reduce`:

Remove or greatly reduce:

- parallax
- camera travel
- continuous route movement
- dramatic mask motion
- auto-running decorative video if appropriate

Keep:

- composition
- hierarchy
- imagery
- color
- content
- simple state changes

Reduced motion must still look premium.

---

# 42. RTL

Arabic:

- true RTL text/layout
- logical properties where appropriate
- typography composition adapted
- controls correctly ordered where semantically appropriate

Never mirror:

- Türkiye
- geographic maps
- destination coordinates
- photography

Bronze route may adapt compositionally but must not imply incorrect geography.

---

# 43. CONTENT

Reuse existing current localized content.

Do NOT fabricate:

- prices
- hotels
- tours
- testimonials
- review scores
- awards
- partner relationships
- inventory
- availability

If design needs additional short labels, derive them only from existing approved content.

---

# 44. IMPLEMENTATION STRUCTURE

Before rebuilding, inspect current components.

Prefer evolving existing architecture rather than duplicating everything.

Potential structure could become:

```
components/travel/v3/

BronzeJourney.tsx
BronzeRouteScene.tsx
JourneyChapter.tsx
ArrivalHero.tsx
DepartureChapter.tsx
ServiceWorlds.tsx
TurkeyJourney.tsx
DestinationPortal.tsx
EditorialStory.tsx
JourneyPlanner.tsx
ArrivalCTA.tsx
```

This is guidance.

If existing components already provide appropriate boundaries, reuse them.

Do NOT create this directory merely to satisfy the example.

---

# 45. MOTION PRIMITIVES

Centralize common motion behavior where beneficial.

Potential primitives:

```
Reveal
MaskedMedia
ParallaxMedia
ChapterTransition
RouteProgress
MagneticLink
```

Do not abstract single-use behavior prematurely.

---

# 46. CSS

Preserve the existing design system.

Prefer CSS variables for:

- surfaces
- spacing
- type scale
- motion timing
- easing
- layout width

Do not scatter magic values unnecessarily.

---

# 47. EASING

Use restrained cinematic easing.

Examples:

`cubic-bezier(0.22, 1, 0.36, 1)`

or equivalent project motion curves.

Do not make every animation springy.

Use springs mainly for direct interaction where physical response helps.

---

# 48. PERFORMANCE TARGETS

Avoid:

- render loops while scene is invisible
- giant uncompressed video
- hydration for static content
- scroll event handlers running unnecessary state updates
- React rerendering every scroll frame
- enormous DOM layers for decoration

Prefer:

- IntersectionObserver
- Motion values
- requestAnimationFrame where appropriate
- CSS transforms
- server-rendered static structure
- lazy client islands

---

# 49. BEFORE/AFTER PROOF

This is mandatory.

Create screenshots of V2 baseline and final reconstruction.

Same viewport.

Same approximate journey stage.

At minimum:

## 1440 desktop

- hero
- services
- Türkiye explorer
- planner
- final CTA

## 390 mobile

- hero
- service experience
- Türkiye experience
- planner

Store locally under:

```
tmp/v3-reconstruction/
  before/
  after/
```

Do not commit temporary screenshot output unless current repository conventions explicitly require it.

---

# 50. VISUAL ACCEPTANCE TEST

For each major chapter answer:

### Composition changed?

YES / NO

### Interaction changed?

YES / NO

### Motion narrative changed?

YES / NO

### Still recognizable as V2 section with animation added?

YES / NO

If the last answer is YES for most chapters:

V3 is not complete.

---

# 51. QA VIEWPORTS

At minimum:

```
360×800
390×844
430×932
768×1024
1280×900
1440×1000
```

---

# 52. QA LOCALES

Test:

- EN
- TR
- AR

Arabic must receive explicit visual review.

---

# 53. QA MODES

Test:

- normal motion
- reduced motion
- keyboard-only navigation
- coarse-pointer/mobile behavior
- WebGL available
- static/WebGL fallback

---

# 54. TECHNICAL QA

Run:

```
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Then run the relevant browser verification scripts.

No task completion with known build/type/lint failures.

---

# 55. BROWSER QA

Check:

- console errors
- hydration warnings
- layout shifts
- horizontal overflow
- broken images
- missing translations
- incorrect directionality
- stuck animations
- stale observers
- navigation after route transitions
- WebGL remount/disposal issues
- video pause/resume
- focus restoration
- Escape behavior

---

# 56. DO NOT CHANGE

Do NOT modify:

- backend
- CMS
- authentication
- payment
- reservation architecture
- current inquiry truth
- deployment
- indexing
- destination inventory
- locale inventory

unless required for an explicit frontend compatibility fix.

---

# 57. GIT STRATEGY

Work on the existing:

`feat/v3-bronze-journey`

Do not rewrite previous commits.

Make logical reconstruction commits, for example:

```
feat: reconstruct Bronze Journey hero and chapter flow

feat: rebuild service and Türkiye discovery experiences

feat: compose destination portals and planner journey

fix: refine responsive RTL and reduced-motion behavior

test: finalize Bronze Journey visual verification
```

Commit naming may differ if repository convention requires.

---

# 58. IMPLEMENTATION ORDER

Follow this sequence.

## PHASE A

Visual baseline + before screenshots.

NO design implementation before baseline.

## PHASE B

Hero + transition into journey.

Verify desktop/mobile immediately.

## PHASE C

Service world reconstruction.

## PHASE D

Türkiye transition + explorer reconstruction.

## PHASE E

Destination portal behavior.

## PHASE F

Editorial story chapter.

## PHASE G

Planner + arrival CTA.

## PHASE H

Navigation + micro-interaction consistency.

## PHASE I

Mobile/tablet/RTL reconstruction.

## PHASE J

Reduced motion + performance.

## PHASE K

Full QA and after screenshots.

Do not postpone all responsive work until the very end.

Each phase must be checked at phone + desktop before continuing.

---

# 59. AUTONOMY BOUNDARY

You MAY independently decide:

- component file boundaries
- hooks
- DOM structure
- CSS implementation details
- animation orchestration implementation
- how to reuse existing components
- how to optimize scene lifecycle
- minor breakpoint tuning
- testing helpers

You MAY NOT independently decide:

- a different design direction
- a different information hierarchy
- replacing Bronze Journey
- preserving a generic V2 composition because it is easier
- dropping major chapters
- turning the experience into cards/grids
- changing product scope
- changing localization scope
- changing service/destination hierarchy
- weakening the visual acceptance criteria

If a technical constraint makes the specified experience impossible, document the constraint and implement the closest faithful solution rather than quietly changing the concept.

---

# 60. COMPLETION DEFINITION

The task is finished only when ALL of the following are true:

### Visual

The frontend looks materially reconstructed compared with V2.

### Narrative

The homepage feels like connected travel chapters rather than stacked sections.

### Bronze Journey

The bronze route functions as a recurring narrative device.

### Türkiye

Türkiye discovery is a signature interactive experience.

### Motion

Motion is purposeful and choreographed.

### Mobile

Mobile feels deliberately art-directed.

### RTL

Arabic looks intentional.

### Accessibility

The experience remains usable with keyboard and reduced motion.

### Performance

The visual reconstruction does not create obvious runtime degradation.

### Technical

Typecheck, lint, tests and build pass.

### Proof

Before/after visual evidence exists.

The project must not be marked complete merely because the code builds.

The final question is:

> If the user opens the site without reading the Git history, will they immediately see the Bronze Journey reconstruction?

If the answer is not clearly YES, continue working.