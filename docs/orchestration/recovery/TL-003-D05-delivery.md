# TL-003-D05 delivery — twelve destination experiences

8 October 2026. Status: IMPLEMENTED — static gate passed, bounded native enhancement
and worker dev evidence complete; independent production acceptance remains pending.
Contract: [D05](TL-003-D05.md),
phase 5 of [TL-003](../../tasks/TL-003-ux-motion-recovery.md).

## Routing and source

Same explicitly selected GPT-6.1 Sol handle `/root/astra_hub_resume/sol_hub`;
Astra `/root/astra_hub_resume` directs/reviews and is sole state writer. Actual
selection/handle is delegation evidence, not backend model attestation. Lease was
reconciled after the user resumed; approved hub work remains preserved. No commit,
merge, deployment, state write or self-approval.

Branch `feat/v3-ux-motion-recovery`, HEAD
`cc2197762cf1bbf46cb462e945e9b0b71d4a6f29` plus the owned source below.
All shared source/data/QA and unrelated setup/governance changes are read-only.

## Static implementation

- `frontend-v2/components/home-v3/DestinationJourney.tsx`: eleven ordered server
  chapters across all twelve source records. Source name/note/coordinates, Add and
  contextual Plan, back link, Understand, early approved TurkeyMap locator, three
  unequal source-interest scenes, immersive photo, global Add, three existing
  relevant services, honest three-step process, contextual Plan, three curated
  related IDs in source order and final local CTA. Four group compositions/crops;
  one source image is deliberately reused without claiming new interest-specific
  photographs. One H1. Hero portal only for current ID; featured related portal
  only for a different ID, avoiding duplicate transition names.
- `frontend-v2/components/turkiye/DestinationLocalNav.tsx`: five native desktop
  anchors, mobile chapter select only after JS mounts, and five native links as
  the default mobile/no-JS navigation. A one-pixel IntersectionObserver reading
  line evaluates all current physical section rectangles on every crossing,
  keeping active state correct in long sections, reverse scrolling and jumps.
  Rebuilds on resize; disconnects/removes listener on unmount. No scroll-frame
  React state loop or focus calls.
- `frontend-v2/styles/recovery-destination.css`: scoped responsive/RTL static
  composition, explicit selected bronze locator styling, sticky nav top 72px and
  native anchor clearance 155/165px alongside existing document padding.
- `frontend-v2/components/turkiye/DestinationMotion.tsx`: lightweight detail-only
  client controller added after Astra's independent rendered static gate. Native
  IntersectionObserver starts eligible scenes on arrival; WeakSet records each
  target once. No heavy framework/scene import or new dependency.
- This report is the fifth reserved path. No Pages or shared source writes.

## Checks and evidence

`pnpm typecheck` and `pnpm lint`, cwd `frontend-v2/`: PASS initially, after static
nav/CSS corrections, and on final enhanced source. `pnpm test`: PASS, 2 files,
32 tests (25 Türkiye / 7 journey), final run 19:47 UTC. `git diff --check` on the
tracked DestinationJourney diff: PASS (LF/CRLF notice only). Worker did not run a
build or production verifier; root owns one coordinated final build/core/default
public/V3 run after both app and QD05 source freeze. No approved baseline replay.

Ignored dev evidence `tmp/frontend-qa/d05-worker/`, Playwright Chromium on owned
Next dev `http://localhost:3053`, 8 October 2026:

- `static-worker.json`: initial 64 normal native viewport captures for EN Istanbul,
  Rize/Ayder, Antalya and Cappadocia at 1440x900/390x844; AR Istanbul 390x844 and TR
  Rize/Ayder 1280x800. All twelve English routes match exact source note, three
  interests, curated three-related order, eleven chapters and locator active ID.
  Zero unexpected page errors, canvas or captured document overflow. These source
  fingerprints precede the narrowly corrected locator/nav states below.
- `locator-fix-worker.json` / `static-corrected-*-locator.png`: repeat only the ten
  locator cases after explicit selected bronze correction. Computed background
  `rgb(200,144,57)`; geographic transform remains the shared `translate(-50%,-50%)`.
- Initial native nav probe expected exact scroll-margin and timed out because
  document padding also contributes. `nav-first-attempt.json` is preserved.
  `nav-worker.json` preserves valid EN/AR native Plan states from 15:01 UTC; TR
  then demonstrated a stale heading-only observer. Those historical active-nav
  frames are superseded by the corrected evidence below, not relabeled as final.
- `static-final-worker.json`, 19:39:49–19:40:26 UTC: all ten physical sections
  forward/reverse in EN 1440, AR 390 and TR 1280 (60 states), plus five native
  keyboard/select anchors each (15 states), PASS. Actual header bottom 72px;
  sticky nav top 72px/bottom 137 desktop and 143 mobile; anchor targets about 243px
  EN/TR and 253px AR, clear of both bars. No focus is moved by implementation.
- `static-final-en-istanbul-1440-{feel,add,process-complete,related-complete}.png`
  show full missing composition: immersive photo, global Add, all three honest
  process steps, and all three curated links. These supplemental section captures
  use viewport height extended to section height +320px; section heights are
  760/402/955/1042px, recorded explicitly. No ordinary mobile-height claim.
- `static-final-{en-istanbul-1440,ar-istanbul-390,tr-rize-ayder-1280}-{native-plan,native-services}.png`
  are ordinary native viewport states with corrected active chapters.
- `static-final-{en,ar}-390-nojs-plan.png`: hidden inert selector, five usable native
  anchors and ordinary Plan navigation. Page has no JS-only navigation dependency.

All earlier captures are preserved. Selected group compositions, Arabic hero,
corrected locator and complete supplementary scenes were actually decoded and
inspected by this worker. These are dev implementation evidence, not final
production approval or deployment.

Static source fingerprints corresponding to final supplement and Astra's internal
static gate (historical; two files subsequently received authorized motion only):

```text
components/home-v3/DestinationJourney.tsx 90c4e4f8d1176371ec937f02b1a396481cc83f1d6723988aef498dacc4041996
components/turkiye/DestinationLocalNav.tsx 0b12e8f4eb7aeda6a856e8e01d019d54c9c46fd7b423b3e107d4701273071e85
styles/recovery-destination.css 5cb4f1b72466baf549f0f738716c4009e3e483094997a120c8f57decdb321784
```

## Native enhancement and actual evidence

Root `.recovery-destination[data-destination-motion=enhanced]` is eligible only
with non-calm preference, non-SaveData and available IntersectionObserver. Targets
`.rd-interest-photo`, `.rd-feel`, `.rd-final-route` carry
`data-destination-reveal=pending|visible|settled`. Intersection threshold .12 starts
finite native CSS once. `rd-image-mask` reveals the last 8% of each interest image
over 850ms; child `rd-image-depth` scales 1.035→1 over 850ms. Feel depth is 950ms.
Normalized SVG `rd-route-arrive` draws once over 1100ms; `rd-node-arrive` runs 300ms
after a 950ms delay, complete at 1250ms. Text/actions never become animation
targets, and image orientation/geography stay unchanged in RTL. There is no pin,
WebGL, GSAP, Lenis, scroll-frame state or heavy enhancement download. Native CSS
was equally simple and followed the lead's preference; lightweight controller is
route-scoped, while scene work begins lazily through the observer.

Cleanup disconnects the observer and deletes eligibility/reveal attributes, so
static artwork is the default. Calm/system-reduced/site-reduced and SaveData leave
final content visible. Seen targets return `settled` after re-enabling, avoiding
replay. Connection change subscription requires both add/remove functions;
partial/add-only APIs still honor initial saveData without an unremovable listener.

`tmp/frontend-qa/d05-worker/motion-worker.json`, **19:49:58–19:50:56 UTC**, PASS:
9 cases, 21 saved captures, zero page errors, exact initial/final four-file hashes.
EN Istanbul 1440x900 and AR Istanbul 390x844 each have initial/running/settled
requestAnimationFrame samples for interest, Feel and final route (49–98 actual
frames per scene), change/settled viewport screenshots and full recorded normal
scroll videos. Actual final computed image scale is 1, route offset 0 and node
opacity 1; animations report finite finished 850/950/1100/1250ms states. Screenshot
timestamps are actual completion timestamps, not claims of exact animation age.

- EN video: `motion-video/page@49535058d3533fa7b2a8b880b6bb3cd4.webm`.
- AR video: `motion-video/page@6cbd057f1e6372cb764b3d0bc461a09e.webm`.
- `motion-{en-1440,ar-390}-{interest-photo,feel,final-route}-{change,settled}.png`
  and `motion-{en-1440,ar-390}-site-reduced-final.png` record actual normal and
  runtime site preference states.
- `motion-ar-390-{system-reduced,saved-site-reduced,save-data-partial,save-data-event,add-only-partial,no-connection,no-intersection-observer}-final.png`
  record the seven initial capability/preference cases. Reduced/SaveData/no-IO
  cases have no eligibility/reveal attributes or animations, complete final route
  and visible node. Add-only API registers zero listeners.
- Runtime site/SaveData disable/restore clears active animations and returns seen
  targets settled without replay. Route unmount to Contact balances 5 adds / 5
  removes with zero remaining connection listeners in each normal locale case.
- Request logs are retained: zero URL-named GSAP/Lenis/Three/WebGL requests; source
  confirms no heavy imports. This URL filter alone is not a general bundle audit.

`motion-first-attempt.json` preserves a failed cleanup probe that navigated to the
hub, whose valid separate controller creates its own listener. The final probe
isolates unmount by navigating to Contact; no application defect was inferred or
fixed from that harness error. Earlier static evidence remains preserved.
Normal interest, AR settled route and system-reduced final captures were actually
decoded and inspected by the worker; parent performs independent motion judgment.

## Final source freeze and integration

Four application files frozen on 8 October 2026; no further application edits:

```text
components/home-v3/DestinationJourney.tsx b39170c98ef5cc75cf72e9209bd1b814edfffce0cc1f90f862b1bdb7a9180791
components/turkiye/DestinationLocalNav.tsx 0b12e8f4eb7aeda6a856e8e01d019d54c9c46fd7b423b3e107d4701273071e85
components/turkiye/DestinationMotion.tsx 1270e1974da89776baa8967d6a9187107608a3cbdcaad067806cfe7b885e05cf
styles/recovery-destination.css 6e80450b1d83e70fab9f27d743df4b7ebd9d6140724ab08df270f8273d8eccb0
```

Owned dev3053 PID24416 was verified as this workspace's Next start-server and
stopped after evidence. Port3053 has no listener; successful browser finally
closed all contexts, and no Playwright headless process remained on the final
check. Browser/runtime ownership released to root. Report is the only subsequent
owned write. Root production checks and QD05 independent acceptance remain required;
IMPLEMENTED is not APPROVED. No source facts, dependencies,
inquiry boundary, noindex or legal defaults changed. Global Add/Plan reuse the
approved session store and validated Contact serialization. No external messages
were sent. No Safari/Firefox, physical-device, assistive-technology or field
performance certification is claimed.
