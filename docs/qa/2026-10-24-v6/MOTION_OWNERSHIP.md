# V6 motion ownership and evidence

Native document scroll throughout; no pins, custom scroller or mandatory canvas.
Runtime dependencies are unchanged. GSAP/MotionPath/ScrollTrigger are existing
GSAP package modules. All controllers dispose contexts/listeners/observers/frames.

| Scene / property | Owner | Timing / trigger | Proof |
| --- | --- | --- | --- |
| Hero inner photo scale/position; two text masks; support | V6Motion GSAP entrance | ~1300ms total; masks start180ms, trace350ms, support650ms; CTAs always available | P1 recordings and measured entry mutations |
| Hero outer photo scale/clip/position | V6Motion ScrollTrigger | direct native scroll, top→bottom, no numeric scrub delay | P0/P1 departure states; P4 continuous wheel |
| Hero path/plane | V6Motion GSAP |350–1000ms; exact V5 plane path; wheel/touch/focus completes entrance | P1 video; P4 normal/reduced matrix |
| Service photo outer clip/position | V6Motion ScrollTrigger | each photo top96%→48% | P2 scene recording |
| Service plane emphasis, nested photo depth, heading and arrow | CSS only |220–480ms; hover/focus/selected touch | P2 worlds and P4 interactions |
| Atlas loaded layers and title | CSS only |photo650ms, depth/title720ms; state immediate; decode before reveal | corrected P1/media; P4 lab/interaction proof |
| Atlas marker and active conceptual route | CSS only |220ms; map physical coordinates never mirrored | P0/P1/media and P4 locale/interaction matrix |
| Mega transform/opacity/clip | Motion |550ms open/280ms close | P1 menu video, Escape/close-during-open |
| Mega incoming photo | Motion |650ms after decode; latest request only; eager requested layer | P1 verified settled-photo state |
| Native mobile dialog mask / stagger | CSS only |600ms reveal,280ms close; stagger≤270ms | P1 phone video; P4 touch |
| Threshold SVG path and nested image transform | V6Motion ScrollTrigger |direct scroll,top92%→18%; landscape edge desktop/vertical phone | P2 three states, reverse wheel |
| Signature photo wrapper / separate copy | V6Motion ScrollTrigger |direct scroll,top95%→bottom15%; small desktop perspective,2D phone | P2 three images × three states |
| Film frame clip/scale / heading | V6Motion GSAP |850ms/650ms, reversible on section entry | P2 film states; existing lifecycle regression |
| Memory photograph outer curved arrival | V6Motion GSAP MotionPath |850ms,80ms stagger; shallow phone path | P2 three states; phone overflow corrected at source |
| Memory inner hover surface | CSS only |450ms; photo rises on hover/focus | P2/P4 interaction recording |
| Network track transform | CSS only |32/28px per second; duplicated exactly; observer pauses offscreen/hidden | P0 measured track delta, P4 hover/focus/pause/static |
| Source figures | V6Motion GSAP wrapper, static numbers |700ms; no invented counters | P2 numbers/continuous recording |
| Process path/plane and mobile line progress | V6Motion ScrollTrigger |finite section traversal; no circling | P4 process states |
| Service preview follower | ServiceDirectory GSAP quickTo |400ms damping;±21px/14px, fine mouse only; resets on focus/leave | P2 directory/P4 hover/focus |
| Service incoming photo clip/opacity | Motion nested layer |650ms after decode; two-layer fallback | P2/P4 service switching |
| Journey transfer overlay | Motion |650ms, optional; selection commits before event | P2/P4 add video; no hit testing; absent in calm mode |
| Ordered itinerary rows | Motion |280ms position layout | P2/P4 add/reorder/remove and V3 regression |
| Beyond country perspective | CSS only |700ms transform/550ms opacity; buttons and keyboard, no autoplay | P2 nine-country coverage; P4 touch |
| FAQ native details content height | CSS progressive enhancement |250ms; native semantics retained | production public/V3 and accessibility checks |
| Closing photo / title / route / plane | V6Motion ScrollTrigger |direct scroll; route ends16px below real primary action, recalibrated on refresh | P4 viewport endpoint checks and continuous video |
| Featured photo-to-detail identity | React ViewTransition / browser |800ms supported; immediate static/unsupported fallback | P3 browser animation records, same image identity and back |
| Internal heading/support / service photo | PageSceneMotion GSAP |750/650/850ms; independent of shared image; cleanup on pathname | P3 four browser configurations |

Reduced motion, manual reduction and SaveData retain readable static scene states;
no image or geographic information depends on the animation. Network duplication
is aria-hidden, and reduced tracks wrap into readable unique logo lists.
The layout-affecting preference is resolved by a nonce-protected head script before
body paint; React's conservative hydration pause never controls row wrapping.
System preference/no-JS CSS also selects static layout before first paint. The shell
updates the attribute when the user changes preference. Only this deliberately
client-owned html attribute uses hydration-warning suppression. Three4x CPU
first-click cases confirm zero planner movement between pointer down/up.

P0's initial semantic-only Atlas proof missed a clipped lazy-load deadlock. Those
early captures are historical; corrected actual-image evidence lives in P1/media
and P4. Failed harness attempts and real defects are labeled in their phase folders.
Screenshots are state evidence; recordings, state sampling and trace data establish
movement. Encoding rate is never used as browser frame-rate evidence.

P4 checkpoint update: selected Atlas camera translates within6px horizontal/3px
vertical and scales1.02 after300ms over460ms; reduced/static remains still.
Process route is calibrated to actual step centers, preserving RTL reading order.
Resize refresh is deferred until scrollEnd when required; latest trace still has
one83ms long task and is pending analysis. P4 is paused, not complete.
