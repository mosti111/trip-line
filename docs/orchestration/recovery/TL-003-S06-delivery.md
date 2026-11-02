# TL-003-S06 delivery — travel services

9 October 2026. Status: IMPLEMENTED — independent rendered static gate passed;
contracted native enhancement, worker dev evidence and source freeze complete.
Root production checks and QS06 independent acceptance remain pending.
Contract: [S06](TL-003-S06.md), phase 6 of [TL-003](../../tasks/TL-003-ux-motion-recovery.md).

## Routing, scope and source

Same explicitly selected GPT-6.1 Sol handle `/root/astra_hub_resume/sol_hub`;
selected Astra `/root/astra_hub_resume` directs/reviews and is sole state writer.
Selection/returned handle records tool routing, not independent backend model
attestation. Lease reconciled after user continuation; all source/evidence preserved.
Branch `feat/v3-ux-motion-recovery`, HEAD
`973a904db9532f7107c0a64bcad9243474b3182d` plus only the six reserved paths.
No commit, state write, approval, merge or deployment.

- `components/services/TravelServicesHub.tsx`: server-rendered travel-first hero,
  four need links (tailor-made/tours/flights-hotels/visa-assistance), dominant source
  coast media plus compact unequal rows, source Türkiye inspiration and secondary
  pilgrimage/business families. All nine service links remain reachable. Valid
  audience context has a prominent native anchor to its always-visible family;
  selected secondary family has a bronze border. No auto-focus or JS prerequisite.
- `components/services/ServiceExperience.tsx`: all nine service records supply exact
  hero/headline/summary, For / We can discuss / Start with summary, three points,
  planning brief, service-specific question/answer and source-related order. Source
  three-step process; compact related rows; contextual final Plan. Leisure and
  business receive source Türkiye inspiration with Explore/Add; visa and pilgrimage
  omit it. Inspiration claims no venues, inventory or logistical convenience.
  Existing latitude/longitude produce fixed numeric LTR coordinates.
- `components/services/ServicePrimitives.tsx`: small client ServicePlan island calls
  approved `journeyHref` with ordered global destination IDs and explicit service.
  Saved journey type is not overwritten; drawer closes using the existing API.
  The route-scoped lightweight ServiceMotion island starts eligible native artwork
  on intersection, with preference/connection/unmount cleanup and once-only state.
- `components/travel/Pages.tsx`: only ServicesPage/ServicePage delegate to the new
  server compositions, with two required imports. Other page families unchanged.
- `styles/recovery-services.css`: scoped editorial travel/detail layouts, deliberate
  mobile composition, connected Arabic, native anchors and visible focus.
- This report is the sixth reserved path. Data, routing inventory, dependencies,
  shell/store, existing verifiers and unrelated governance work remain read-only.

Visa's no-guarantee answer and passport-scan warning, training's accreditation
boundary and pilgrimage's online-availability boundary are copied from source.
No new travel facts, prices, availability, packages, certification or claims.
Pilgrimage remains respectful and usable pending its separate phase 7 contract.

## Static checks and evidence

From `frontend-v2/`: `pnpm typecheck` PASS, `pnpm lint` PASS, `pnpm test` PASS
(2 files / 32 tests: 25 Türkiye, 7 journey) on static source, then again on final
enhanced source (11:38 UTC). Pages `git diff --check` PASS with LF/CRLF notice only.
Other-family exports after DestinationsPage match HEAD after line-ending
normalization. No worker production build or production verifier run.

Ignored dev `tmp/frontend-qa/s06-worker/static-worker.json`, actual
**01:17:09–01:18:41 UTC**, Playwright Chromium, owned `http://localhost:3053`:
PASS, 17 cases / 123 captures / 17 source audits / zero page errors.

- Ordinary EN 1440x900 and 390x844: hub, tours, visa-assistance, corporate details.
  AR 390x844: hub and visa detail. TR 1280x800: hub and corporate detail.
  Each chapter has a clean native viewport state; tall chapters receive a separate
  lower viewport state, retaining complete controls/rows rather than giant images.
  Zero document overflow and service canvas. Source image load state recorded.
- English runtime audit visits all nine service routes, with exact summary/three
  points/quick summary/brief/answer/related order. Contextual Plan URLs preserve
  seeded `antalya,istanbul` order and explicit chosen service. Visa/pilgrimage have
  no unrelated Türkiye inspiration.
- Three valid audience native keyboard anchors reach their family with header
  clearance, retaining all primary and secondary links.
- Actual tours Plan→Contact carries ordered itinerary/service while sessionStorage
  journeyType remains `camps`.
- AR visa no-JS Plan capture retains all three points, contextual links, planning
  information and honest answer. Full server content remains readable without JS;
  interactive Add/session personalization requires JS.

Worker actually decoded EN hub need composition, AR visa quick summary including
passport warning, and mobile corporate hero. Astra independently reviews actual
saved composition before any motion. These are dev evidence, not production
approval, deployment or the user's creative acceptance.

After continuation, one supplementary Arabic native 390×844 need viewport closes
a crop gap without application changes: `static-ar-middle-worker.json` and
`static-supplement-ar-hub-390-needs-middle.png`, 11:35:18–11:35:23 UTC, PASS.
Full primary label top154.78/bottom213.28px and second heading407.06–448.66px
clear the 72px header. All five source hashes still match the original manifest;
the 123 earlier captures are unchanged. Worker decoded the supplement.

Historical static five-application-file hashes, unchanged through recovered and
supplementary evidence, forming Astra's internal rendered gate:

```text
components/services/TravelServicesHub.tsx a5314c0f7ab73a9221c59c593795a8ed3a460725467eadc9f74fff5bcf027911
components/services/ServiceExperience.tsx 705a4ef40c027b30ec8f82f2e49309f545809021806acfb589ee5723ca542985
components/services/ServicePrimitives.tsx 120d1f389d3e990eb126562ffe1bf4232c452679ed7efacbef8ff7e15a788968
components/travel/Pages.tsx b91dfc445fac1e16a63e0053fb631fbb38d6045d260e9177aaf6e5e764b2d659
styles/recovery-services.css 8f0d02f980785d8a08e2ec31c3a19df89f68b9af8cafd00f628a2d475c3acf56
```

## Native enhancement and actual evidence

After the independent rendered static gate, only approved finite native effects
were added. `.recovery-services[data-service-motion=enhanced]` marks eligibility;
targets `.rs-need-dominant>.photo`, `.rs-inspiration .rs-place-dominant .photo`,
`.rs-final .rs-route` carry `data-service-reveal=pending|visible|settled`.
`rs-photo-mask` reveals the last 6% of an image over 700ms; child img
`rs-photo-depth` scales 1.02→1 over 700ms. SVG pathLength 1 `rs-route-arrive` draws once
over 950ms; `rs-node-arrive` lasts 300ms after 750ms delay (complete 1050ms).
Eligible link arrows respond by 2px vertically over 120ms to hover/visible focus.
No text, actions, geography or photo orientation transforms; essential content is
never hidden. There are no service pins, WebGL, Lenis, GSAP or heavy imports.
Scene work begins through native IntersectionObserver (.12), not scroll-frame state.

Calm/system-reduced/site-reduced, SaveData and unavailable observer retain complete
static artwork. WeakSet prevents replay after preference re-enable; generation
guards discard stale observer callbacks. Cleanup disconnects observers and deletes
eligibility/reveal attributes. Connection change subscription requires both add and
remove functions; add-only/partial objects still honor initial saveData. Pilgrimage
opts out before registering any observer/connection listener and retains static
respectful content pending phase 7.

`tmp/frontend-qa/s06-worker/motion-worker.json`, actual
**11:39:31–11:40:34 UTC**, PASS: 11 cases / 27 captures / zero page errors, exact initial and
final five-app hashes. EN hub 1440×900, AR hub 390×844 and EN tours 1440×900 have actual
requestAnimationFrame initial/running/settled samples (53–97 frames per scene),
change/settled viewport screenshots and full recorded normal scroll sequences.
Final computed image scale 1, route offset 0 and node opacity 1, with finite finished
700/950/1050ms animation states. Screenshot timestamps are actual completion times,
not exact animation-age promises.

- EN hub video `motion-video/page@5d87fcd95c732687551ada209a77ce4e.webm`.
- AR hub video `motion-video/page@1fdf9e6dc48fc30e85ea631a491ec381.webm`.
- EN tours video `motion-video/page@b95a311bfd98b76fc9ab12ff3a6ccf1c.webm`.
- `motion-{en-hub-1440,ar-hub-390,en-tours-1440}-*-{change,settled}.png` and
  corresponding site-reduced-final states capture the actual normal sequences.
- `motion-ar-390-{system-reduced,saved-site-reduced,save-data-partial,save-data-event,add-only-partial,no-connection,no-intersection-observer,pilgrimage-static}-final.png`
  record eight initial modes. Reduced/SaveData/no-IO/pilgrimage artwork is final,
  with no eligibility/reveal attrs or animations. Add-only API registers 0 listeners.
- Runtime site/SaveData disable/restore clears active artwork motion and restores
  seen targets settled without replay. Contact unmount balances 5 adds / 5 removes,
  remaining 0 connection listeners, in all three normal cases.
- Request logs retain zero URL-named GSAP/Lenis/Three/WebGL requests. Source also
  confirms no heavy imports; the URL filter alone is not a general bundle audit.
- `arrow-focus-worker.json`, 11:40:58–11:41:04 UTC, PASS normal/reduced desktop:
  solid visible keyboard focus in both; normal transform Y −2px / 120ms, reduced none.

Worker decoded AR normal need, EN tours settled final route and AR pilgrimage
static final captures. Parent independently judges motion using actual evidence.
Earlier 123 static captures and the one clean Arabic supplement remain preserved.

## Final freeze and remaining integration

Five application paths frozen on 9 October 2026, no subsequent application writes:

```text
components/services/TravelServicesHub.tsx e4b7012a5a37129223b9462b7144cfcb7388e8ab944c96235bddeb69a5f547c8
components/services/ServiceExperience.tsx 64046a513858bd2fe014bb2c2e009bb328304a38cb8b8465e3f3d20d6a33d739
components/services/ServicePrimitives.tsx 217f443001017bd413f4ffafd01b8be2b040d451bf218f7f853ad525c3f511eb
components/travel/Pages.tsx b91dfc445fac1e16a63e0053fb631fbb38d6045d260e9177aaf6e5e764b2d659
styles/recovery-services.css bc2969b9e68894e94da47ee6b2c2d3da47790081717b58065bf03b3e0ff4a4df
```

Owned dev3053 PID9392 was verified as workspace Next start-server then stopped.
No 3053 listener or Playwright headless process remained; all capture contexts closed.
Runtime/browser ownership released to root. Only this owned report was written
after application freeze; automatic Next generated next-env.d.ts remains read-only
for normal root build reconciliation. No manual out-of-scope write.

Root owns one final production build/core/public/V3; QS06 receives its exclusive
production window afterward. IMPLEMENTED is not APPROVED. No duplicate intermediate
build or old approved baseline replay.
No Safari/Firefox, physical-device, assistive-technology or field-performance
verification claimed. No external messages sent; prepared-message inquiry/noindex
and legal defaults remain unchanged.
