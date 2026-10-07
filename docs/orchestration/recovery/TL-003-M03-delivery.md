# TL-003-M03 delivery — homepage motion source freeze

Task / milestone / contract: TL-003-M03 / TL-003 phase 3 / [contract](TL-003-M03.md).

Status: **IMPLEMENTED source, production verification and independent review pending**.
This is a bounded source delivery, not APPROVED or completion of TL-003. Source frozen
6 October 2026 19:43 UTC; lead owns the next production build/check window.

Routing: explicitly requested GPT-6.1 Sol implementation worker, fresh dispatch handle
`/root/astra_resume/sol_home_motion`, under selected Astra `/root/astra_resume`.
Accepted dispatch establishes requested selection support, not backend attestation.
Ownership was renewed after the usage interruption without restarting approved H02.

Base/tested revision: branch `feat/v3-ux-motion-recovery`, HEAD
`b89d87a5f4ab694d2ac6ecb62bfa9a0a2051a184`, plus the ten source files below. Shared
setup/documentation diffs and disjoint QM03 verification edits were preserved. No
commit, main merge, dependency change, external inquiry, deployment or publication.

## Outcome and architecture

The server-rendered fifteen-chapter root and planner remain mounted. HomeMotion is
a small independent client boundary: normal modes lazy-load the ScrollScene controller;
fine desktop >=1024 loads the sole Lenis clock and portals Bronze into a hero-local
slot. Heavy R3F/Three remains behind Bronze's separate eligible scene import. No
second `.bronze-home` wrapper, canvas across the site, content replacement or blank
bundle-loading state is introduced. Reduced motion and Save Data skip enhancement.

The opening reads, departs, travels and transforms over 180vh at >=900px height,
150vh at700–899,120vh below700. No800px eligibility gate. Short desktop SSR CSS
compresses type/spacing before enhancement so title, proposition and both actions
fit1280x600 in all locales. Latin/Turkish blocks and connected Arabic phrase blocks
separate; support/actions recede; Istanbul becomes a smaller receding photo plane;
source coordinates pass through the foreground. A stationary spatial bronze curve
is viewed by a camera traveling along its actual centerline, rather than an object
scale bump. Follow the line resolves at exit. Focus on hero controls resets the
actual Lenis/scroll position immediately so those controls are readable again.

The three intent planes have differentiated depth/range: travel strongest,
pilgrimage calmer, business structured. An enhanced metallic SVG representation
loses thickness and reflection/shadow weight into the existing flat route as Türkiye
enters. The threshold route/title and image transform; the explorer guide uses the
existing bronze-place events and respects its existing permanent manual override.
Map focus moves the entire geographic canvas with pins, capped1.025 and20px/12px.
Signature images receive scoped masks/parallax while existing DestinationPortal
navigation remains unchanged. Film expands from scale.84 to1.14 on desktop while
play/pause/visibility ownership stays in HeroVideo. Story rests; figures/process use
route/node progression; service groups move through native vertical scroll; builder
selection gives finite feedback; final route reaches its existing arrival node.

Native/coarse modes use the server's vertical chapters, SVG routes and small2.5D
image/plane transforms, with no long pin, Lenis or WebGL. Arabic text remains
connected; photographs/geography/bronze geometry are unmirrored. Reduced mode
reverts transforms, routes, pins and observer-created map/builder tweens. Explicit
cleanup restores original inline styles after context revert, avoiding a residual
map transform discovered during the targeted preference test.

The demand scene is cappedDPR1.5 and invalidates only for eligible visible events.
Actual context loss removes readiness and reveals the outer static rh-sculpture;
restoration recreates the PMREM generator and procedural reflection texture.
Diagnostic data reflect actual useFrame camera/target/parameter/render observations,
not an animation added for tests. All navigation and journey dialogs are observed;
any open dialog pauses the single clock. The desktop mega menu is also observed
and now has data-native-scroll. Keyboard scrolling interrupts wheel inertia without
preventing native defaults. Fonts/media/viewport refresh is debounced and bounded;
there is no root ResizeObserver/refresh feedback loop or scroll-frame React state.

## Exact intentional files touched

- `frontend-v2/components/experience/ExperienceProvider.tsx`: sole lazy desktop clock,
  all-dialog/mega pause, native keyboard/focus interruption, cleanup.
- `frontend-v2/components/experience/ScrollScene.tsx`: controller on existing DOM,
  opening/chapter choreography, observers, finite cleanup.
- `frontend-v2/components/experience/BronzeJourney.tsx`: existing lazy demand boundary;
  connection-preference subscription cleanup.
- `frontend-v2/components/experience/BronzeJourneyScene.tsx`: stationary spatial route,
  actual camera flight, visible-demand/context/reflection lifecycle.
- `frontend-v2/components/home-v3/HomeJourney.tsx`: independent HomeMotion attachment
  and scoped motion CSS import; server content/composition retained.
- `frontend-v2/components/home-v3/HomeArrival.tsx`: connected title blocks, empty scene
  slot, decorative source-coordinate/departure layers; original content/CTAs retained.
- `frontend-v2/components/home-v3/HomeMotion.tsx`: new lazy client enhancement boundary.
- `frontend-v2/components/home-v3/ServiceWorlds.tsx`: stable intent hook only.
- `frontend-v2/components/travel/SiteShell.tsx`: native-scroll hook on desktop mega.
- `frontend-v2/styles/recovery-motion.css`: new homepage-only depth/canvas/mobile/short-
  height overrides using existing tokens.
- `docs/orchestration/recovery/TL-003-M03-delivery.md`: this report.

Generated deviation: authorized next dev3053 automatically changed tracked
`frontend-v2/next-env.d.ts` from `.next/types` to `.next/dev/types`. Reported to lead;
not manually changed/reset. Its generated dev validator later had orphan syntax at
line116. Lead explicitly owns build-first regeneration/reconciliation. All intentional
writes are within the eleven reserved paths; ignored QA outputs are evidence only.

## Checks actually run

From `frontend-v2/`:

- `pnpm typecheck`: earlier implementation PASS. Latest attempt FAILED in generated
  `.next/dev/types/validator.ts`116/120, TS1005/TS1002/TS1128, after dev generation.
  This is retained as a pending check; no final current-source typecheck PASS claimed.
- `pnpm lint`: initial direct camera-position property writes triggered React
  immutability lint; changed to Three Vector3 method. Final lint PASS after observer
  cleanup/native keyboard integration (only EOF whitespace normalization followed).
- `pnpm test`: PASS,2files32tests (25Türkiye,7journey), final repeat6October22:42:48
  Istanbul time,2.65s. No absent-test claim.
- `git diff --check` on the motion source scope: PASS after removing three extra
  EOF blank lines; shared unrelated diffs were not altered.
- A few mistakenly issued pnpm commands from repository root returned no importer
  manifest; they are excluded from application validation.
- `pnpm build` and full production public/V3/media/resilience/default regressions:
  intentionally not run by this worker; root has the coordinated frozen build window
  and QM03 owns adapted tests. These remain mandatory pending acceptance coverage.

Task-owned dev process15256 was command-line verified as this checkout's Next
start-server and stopped. Port3053 listener absence was verified before root build.

## Rendered/runtime evidence and limits

Raw regenerable Chromium dev evidence is under
`tmp/frontend-qa/m03-worker/`,6October2026, Playwright headless Chromium, loopback
3053, real wheel/fine input unless stated. Dev evidence supports implementation
inspection; final production verification remains authoritative.

- `initial-{en,ar,tr}-1280.png`: actual1280x600 opening; full proposition/title and
  both CTAs visible. Measured actions bottom EN443.98/AR397.44/TR422.77px. The lead
  independently inspected these corrected initial frames.
- `wheel-en-{1440,1280}-00..44.png` and timestamped JSON: small wheel increments
  roughly1/40 of actual pin distance,140ms waits plus capture time,22 saved frames
  each. Initial→exit actual camera moves through depth while Istanbul recedes.
  Initial1440x900 and1280x600; uncommitted early motion diff, before cleanup-only fix.
- `verified-en-1440-{0,25,50,75,100}.png` / `final-smoke.json`: fresh proper settled
  opening checkpoints, actual progress0/.25/.5/.75/1 and scroll0/405/810/1215/1620.
  These include the final map/keyboard cleanup behavior.
- `final-en-{1440,1280}-*.png` and `early-en-*`: preliminary historical captures.
  **Do not use final-en-1280-0.png as initial evidence**: direct scroll during still-
  active Lenis wheel settling retained an end state. Kept honestly; initial three
  corrected locale images and later verified1440 frames supersede that label. Fresh
  production1280 full sequence is required. Early50/75 actual camera/photo frames
  were independently reviewed as promising, not accepted.
- `handoff-{1.05,0.65,0.2}.png` / `chapter-modes.json`: actual metallic→flattening→
  graphic at worlds exit. Measured widths16→8→2px (GSAP-rounded intermediate/final
  inline style), overlay opacity.85→.45→0. Lead independently inspected all three
  plus final1440 50/100; no self-approval.
- `explorer-manual.png`: Bodrum explicit selection retained after subsequent wheel
  guide events; all twelve index controls/source geography remain.
- `film-verified-810.png` / `film-verified-200.png`: proper fresh scroll9430/10040,
  frame989.18x487.20→1308.42x644.44, actual decoded film. Earlier film-810.png was
  an offscreen capture during inertia and is excluded as framed-film proof. Explicit
  Pause button produced video.paused=true.
- `services.png`, `final.png`: actual service grouping/final arrival route crops.
- `ar-390-{normal,reduced}-{arrival,worlds,threshold,film,services,final}.png` and
  `tr-768-{normal,reduced}-*.png`: touch/coarse native compositions at390x844 and
  768x1024. Both normal contexts mode=native,canvas0,pins0,overflowfalse; both reduced
  contexts have no controller/canvas/pin/overflow and film src=null. Connected AR
  worlds and natural TR threshold were decoded and visually inspected by worker.
- `lifecycle.json`, `context-lost.png`, `context-restored.png`: actual WebGL draw
  methods intercepted, not render-counter-only proof. Idle draw49→49 over1s, lost
  fallback visible and draws49, restored procedural reflection/render draw97. Both
  actual nav and Journey showModal paused the sole clock; close resumed. Hero focus
  restored scroll0/actionsopacity1. This early JSON records the map cleanup leak,
  which is superseded by the targeted final cleanup below.
- `final-smoke.json`: final preference cleanup map inline style=null,filmstyle='',
  controllerabsent; canvas/pins removed. Fresh SaveData context0canvas/0pin/noLenis/
  filmsrcnull/staticfallbackvisible,18JSresponses and no downloaded GSAP/Three code
  signatures. Fresh legal /en/privacy similarly18JSresponses/no heavy signatures,
 0canvas/0pin/noLenis. Fresh no-WebGL context0canvas/staticfallbackvisible retains
  the fine desktop SVG pin; its heavy load attempt is expected32responses and the
  context-creation failure is deliberate, not unexpected success. These dev network
  observations must be repeated against production chunks by QM03.

No claim of production browser checks, real hidden-tab draw proof, final broad
responsive matrix, Safari/Firefox, physical devices, assistive technology or field
performance. QM03 independently verifies actual context recovery/reflections,
idle/offscreen/hidden draws, DPR, network loading, dialogs, full default regressions
and fresh production sequences. Later phases4–14 remain authorized and unstarted
by this bounded worker. Source facts/state store APIs/dependencies are untouched.

## Frozen source SHA256

```text
components/experience/ExperienceProvider.tsx ff2e85727a024aadc84725a1f53fccb851005d6b24a5085b14e1e73a4c1b7c8f
components/experience/ScrollScene.tsx 466492f002c1c2ebadf56bf8d8bb209eb913d6a762e46d2aa2ea1cfc4ecaf55a
components/experience/BronzeJourney.tsx 37c662a2e4211031db7d4aca03b85c265be3ac8ef8a697591935c36b597a2140
components/experience/BronzeJourneyScene.tsx 3eb003d5aee9133a9aa5ea89afc7d6a4bc4a86bd471e597461f4cac9a5638a6d
components/home-v3/HomeJourney.tsx ded117bdfcb9bd0bdef41c3fdb000c4b02ad55174d51d451ec82c5fe067a680d
components/home-v3/HomeArrival.tsx fb3b5edb3d00d49fd209fc58f6b204e245e6e95c431f8898f8e95651c57f4d8e
components/home-v3/HomeMotion.tsx 86a39e3df917fb32c18358eafd0310ded268fc16bdb038b3ee6b7261f55c2e13
components/home-v3/ServiceWorlds.tsx 0fa2e224f455e3b1c78f0ea4fa4af4bfaf6d1be07a1d0ded811b671483237e78
components/travel/SiteShell.tsx 06c04ff47ff24c4fcba1f44f3bc69fc40763a001d8c85402f4d217d5fa40be43
styles/recovery-motion.css 0450493460735c2acd393362027efaed44dc8ba792762f9f3292fb24aaa03eaa
```

Paths above are relative to frontend-v2. Report added after source freeze. Suggested
next valid action: root production build-first/check regeneration, QM03 frozen
production verification, then independent Astra rendered/source review. No approval
or optional adjacent work inferred from this delivery.

## M03-R1 — partial connection API correction,7October2026

Contract: [TL-003-M03-R1](TL-003-M03-R1.md). Same selected Sol worker/lead,
HEAD `b89d87a5f4ab694d2ac6ecb62bfa9a0a2051a184` plus the existing preserved diff.
**IMPLEMENTED correction source, frozen7October2026 01:07:54UTC; independent
production verification/review still pending.** No server/build/commit started.

Root's actual production V3 R2 run passed60normal and3reduced captures, but its
existing partial SaveData fixture (`navigator.connection={saveData:true}`) caused
`TypeError: addEventListener is not a function` and an error boundary. That overall
V3 run remains FAILED. The earlier worker dev smoke used complete mocked methods,
so it did not cover this partial-API state and does not supersede the root failure.

Exact correction scope: HomeMotion.tsx and BronzeJourney.tsx now represent the
optional connection listener capabilities and separately check each method with
`typeof ... === 'function'` before subscription/removal. SaveData reads are unchanged;
missing connection still allows eligible desktop; a real complete EventTarget still
subscribes, responds to SaveData changes and removes its listeners. QA fixtures,
choreography, dependencies, facts and every other source path remain untouched.
This delivery report is the third exact allowed path.

Bounded checks from frontend-v2:

- `pnpm typecheck`: PASS against current generated production types.
- `pnpm lint`: PASS.
- Inline Node/TypeScript-transpiled source lifecycle probe: PASS3cases, absent
  connection, partial SaveData object, complete connection EventTarget methods.
  Executed the actual HomeMotion effect and Bronze subscribe/eligible functions with
  minimal React/media mocks. Partial SaveData selects static/ineligible without a
  TypeError; complete API SaveData toggles update eligibility and notifications;
  media+connection listener sets are empty after cleanup. No test source file added.
  This source-level probe is not a browser/rendered/production success claim.
- `git diff --check` for the two correction source paths: PASS.
- No broad dev matrix, server, build or production suite run by this worker. Root
  rebuild and fresh real SaveData film/canvas/pin/network/error proof remain pending,
  followed by required default public/V3 and serialized auxiliary suites.

New frozen source SHA256, replacing only these two entries in the6October list:

```text
frontend-v2/components/home-v3/HomeMotion.tsx 963b9ac5d74f4f45e9a86925493b63d7f02a7dfc8838d76e0cdcdc129f3775bb
frontend-v2/components/experience/BronzeJourney.tsx 4fcbfb379055cc9296ea23a4ba4eb2144d7a37b0ec4b4f58ed70274b2cda9a3b
```

Other eight motion source fingerprints remain unchanged. No self-approval;
M03's full independent motion/lifecycle/production gate and later phases remain
pending. Next action is the lead-coordinated production rebuild and fresh actual
partial-API SaveData verification, preserving the earlier failed report.
