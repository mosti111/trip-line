# TL-003-VISUAL — Sol evidence delivery

Delivered 17 October 2026, UTC. Inspection only; application, CSS, content, routes, tests and tracked verifier behavior unchanged. Worker `/root/sol_visual`, explicitly selected Sol under the same Root Astra. No agents spawned, fixes, tests/build, final QA, external fact checking, commit, merge or deployment. **Recommended product verdict: FAIL — correction pass required**, because the continuous bronze handoff remains visually broken. This is a worker finding, not self-approval or Root acceptance.

## Frozen runtime and evidence

Revision `ed67d53a0743acdc94291a5e644b0feca6abdb7e`, existing production build at `http://localhost:3043`. Native Chromium screenshots, default full motion, DPR1, fine pointer at1440/1280/1024; touch/coarse at768/430/390/360/844landscape. Locale routes EN/AR/TR; AR actual RTL. Each manifest records timestamps, viewport, locale, input, motion and scroll position. Raw evidence is ignored local material, not durable until Root selects/copies it.

Evidence root: `tmp/frontend-qa/visual-inspection/`.

| Manifest | Evidence and actual coverage |
| --- | --- |
| `manifest.json` | Original351captures, including five complete homepage wheel sequences: EN1440x900,1280x600,390x844; AR1440x900,390x844. Also initial EN page captures. Preserve this evidence unchanged. |
| `resume-2026-10-17/manifest.json` | **280 completed route cases,1040screenshots**:17routes ×7sizes ×EN/AR; four relevant landscape routes ×EN/AR; all17routes in TR1440/390. Top, useful body and fullpage compositions. |
| `supplement3-2026-10-17/manifest.json` |133native captures,18locale/size modes: settled menu, actual explorer add, detail carry, two-stop drawer and reorder. Six complete EN/AR1440/390/844 paths through Builder, Contact and preparation. No errors in this final helper. |
| `journey-message-2026-10-17/manifest.json` |76native captures; six repeated real flows needed for expanded prepared-message/ordered Builder evidence, plus native About source headers/figures/partners. Finished2026-10-17T02:44:09.335Z;0 errors. |
| `mega-short-2026-10-17/manifest.json` |Targeted EN/AR1280x600 scrolled mega-menu reachability, final original-versus-current172 file SHA256 comparison and Git snapshot. `sourceUnchanged:true`. |

The17routes are homepage, Türkiye hub, Istanbul, Cappadocia, Rize & Ayder, Antalya, Services hub, tours, Hajj & Umrah, **/business**, About, Contact, global destinations, Georgia, FAQ, privacy, terms. Legal has two routes; menu and Journey overlays complete the requested18surfaces. Seven sizes are1440x900,1280x600,1024x768,768x1024,430x932,390x844,360x800. Landscape844x390 covers homepage/Hajj/Business/Contact plus menu/drawer and actual Journey. TR parity includes all17route tops at390 and captures at1440.

## Actual worker visual inspection, separate from capture count

The worker personally opened readable native images, not merely generated them. Representative review covered opening/service/threshold/explorer/portal/film/final motion frames; EN1280/1024/768 and360/430 compositions; AR1440/1280/1024/768 and360/390/430 compositions; all17TR390route tops; selected TR drawer/partner evidence. The worker did **not** manually inspect every one of the1600primary raw images. Root independently reviews the complete coverage and accepts inspection completeness separately from product quality.

Native review references below use the evidence-root-relative directory names above. Fullpage images are useful composition references; they are resized in tool display and do not establish readable text review. Initial fullpage captures can contain unrevealed offscreen elements; settled native About partner captures prove that the apparently blank initial partner region is a capture-state artifact.

| Family | Personally observed composition/evidence |
| --- | --- |
| Homepage | Türkiye dominates hero/navigation; EN360 and AR430 intentionally stacked controls; original EN1440steps000,005–008,010,015,030,033,057 and EN1280steps006/007; AR1440steps007/008. Strong departure/depth but discontinuous handoffs. |
| Türkiye hub | EN768top and EN/AR768body5: dominant geography and twelve-place directory, grouped rows, substantial selected media, secondary international link. TR390top readable. |
| Four domestic details | EN360Istanbul top; AR1280Cappadocia,1024Rize,1440Antalya tops; all four TR390tops. Clear local identity, coordinates remainLTR, actions grouped. AR1280Cappadocia CTA requires scrolling beyond first600px. |
| Services hub | EN/AR768body2: featuredCappadocia image plus supportingRize/Antalya textrows, Türkiye cross-link and no equal-country tab treatment. TR390top readable. |
| Tours | AR430top, EN/AR768body4, TR390top: inspirational image arrival and calm three-step process. |
| Hajj | EN1024/360top, AR360top, EN/AR768body4, TR390top: respectful copy/imagery, quiet linear steps and inquiry action. |
| Business | EN1280/360top, AR360top, EN/AR768body3, TR390top: purposeful professional opening, adequate action hierarchy, related planning process. |
| About | EN1024/430top, AR768top; EN/AR1440source header/figures, EN1440partners, AR390partners; TR390top. Editorial source-led composition, established2019 visibly separate.2025source attribution present.12+ figure is intentionally absent, not presented as company age; source confirms clarification-required figure filtered. |
| Contact/Journey | AR768top/360body0 and six actual carried/prepared paths; EN/AR390drawer and orderedBuilder. OrderedCappadocia→Istanbul preserved and visibly numbered. Honest prepared-result text states nothing sent. |
| Global directory | EN360top and EN/AR768body1; TR390top: twelveTürkiye places lead, nine international entries are secondary plain directory rows. |
| Georgia | AR390top, EN/AR768body1, TR390top: modest secondary-country scale, unmirrored photo andLTRcoordinates, clear planning action. |
| FAQ | AR390top and EN/AR768body3; TR390top: contents/semantic disclosure groups retain readable hierarchy. |
| Legal | AR360privacy and allTR390privacy/terms tops: pending-review status prominent, intentionally plain. Initial fullpage EN/AR legal compositions retained; no policy completeness claim. |
| Menu/drawer | Settled supplement3EN1024 and EN844lower; EN/AR390reordered drawers; EN844drawer. Shortmega supplemental lower captures show every lower group and actions reachable by panel scroll. |

## Findings sorted by severity

No P0 observed in reviewed evidence. Recommendations only; Root determines final table.

| Priority / scope | Page, viewport, locale, exact observation | Expected / likely area / recommended correction |
| --- | --- | --- |
| **P1, homepage motion shared across enhanced locales** | Original `motion-en-1440x900-006.png` to`-008.png`: broad bronze ribbon clips at hard teal/sand boundary, while the sand intro has no joiningstroke; a separate lower route appears behind the worlds. At worlds exit, the thick route terminates separately from the thin Türkiye threshold path. EN1280steps006/007 and AR1440steps007/008 corroborate. | Make the approved3Dbronze→2Droute transformation visibly continuous at hero→worlds→Türkiye. Likely `components/home-v3/HomeMotion.tsx`, `components/experience/BronzeJourney.tsx`, scene/scroll controller, `ServiceWorlds.tsx`, related motionCSS. Contract only handoff geometry/timing/layering; retain approved page/story and working departure/depth. |
| **P2, homepage responsive** | `resume-2026-10-17/en-844x390-home-top.png` and Arabic equivalent: header~92px, large scenic topgap; headline starts around315–355px and is cut by the first390pxfold; primaryactions absent firstscreen. | Compress landscape copy offset/hero spacing so meaningful heading and next action appear sooner. Likely `HomeArrival.tsx` and recovery-home responsiveCSS. No usabilityP0: native scrolling reaches content. |
| **P2, homepage media quality** | Original `motion-en-1440x900-030.png`: Antalya signature photo enlarged across~1125px is noticeably softer/blockier than surrounding editorial typography and other lead media. Same source is used in coastal arrival/final imagery. | Review source resolution, image sizing/crop and delivered quality; use an adequately resolved approved same-place asset or reduce upscale. Likely `HomeJourney.tsx` SignaturePlaces/Photo/media source. Preserve content identity; do not silently replace approved assets. |
| **P2 candidate, Arabic prepared-message only** | `journey-message-2026-10-17/ar-390x844-prepared-message.png`: numbered visualjourney and underlying order areCappadocia,Istanbul, but the shared right-arrow separator points opposite the RTL reading path. | Use locale-aware direction or neutral numbered separation in prepared text; preserve stored order. Likely `components/travel/Inquiry.tsx` route join. This is a directional polish issue, not lost journey data. |

AR1280Cappadocia first-screen actions belowfold is a responsive polish observation, not an additional confirmed delivery blocker; consider with bounded short-height tuning. LiteralTÜRKİYE branding in Arabic is not treated as a blocker. Settled menu link opacity is correct; earlier250ms captures caught the intended entry stagger.

## Homepage motion judgment

Actual moderate wheel input, not jumps, produced sequential nativeframes and timestamped samples in the original manifest. Wheel delta is~33%viewport height with360ms settling; screenshot time is included in actual elapsed, so filenames are **step numbers, not seconds**. Full sequences reach document bottom: EN1440at46.446s/y17058of17059; EN1280at50.080s/y15897of15897; EN390at28.371s/y17493; AR1440at49.642s/y16897; AR390at28.089s/y16989. No continuous video file is claimed.

The first~10seconds show departure and foreground bronze travel on fine pointer desktop; short laptop does not fall back to the old static-height gate. Service planes are staggered spatial compositions, not tabs; mobile keeps a vertical bronze language and native scrolling. Türkiye entrance is a large immersive arrival; destination portals lead into calmer film and source/editorial/process chapters; final route has a visible endpoint. High-intensity opening alternates with calm usable content rather than constant movement. The **transition continuity** failure remainsP1 even though motion existence/depth pass. Film imagery and moving-frame changes are visible in sequential capture; no field performance or cinematic user approval is asserted.

## Journey continuity and honest content

Actual flow: TürkiyeexplorerAddIstanbul →native destinationdetail →relatedCappadocia →Add →drawer →moveCappadocia earlier →close →nativehomepage →Builder →Contact →validate/prepare →expandmessage. Six EN/AR desktop/mobile/landscape flows all preserve `['cappadocia','istanbul']` and service`tours` in session state, Builder and Contact; logs include actualorder. No outbound WhatsApp/email link was invoked. Both numbered summaries and prepared text are visible in supplement3 and journey-message evidence. Mobile uses menuViewJourney to reach the drawer where compactheader hides the desktop count button.

ShortmegaENscrollHeight730/clientHeight506, scrollTop224; AR742/506, scrollTop236. Native lower screenshots prove all groups/Beyond/Explore/Add are reachable; this is not a clippingblocker. About2025figures/partners visibly attributed. Source deliberately excludes the12+ clarification-required figure; established2019 is rendered. Legal pending status remains clear. No external claims were checked.

## Tooling failures and limits

Original and resumed browser work were interrupted by session/usage limits; retained evidence was resumed incrementally. Resume's one hidden-desktopmenu selector at1024 timed out, then was corrected to visiblemenu selection and completed. `supplement-2026-10-17/` and `supplement2-2026-10-17/` preserve capture helper failures: premature Next navigation readiness, `.brand` strictness, mobile header button invisibility. These are not product failures; final supplement3 and message runs finish with0 errors. Some repeated EN1440/1280 captures exist in separate resumes and are not represented as additional unique coverage.

Chromium emulation only; no physical device/Safari/Firefox/assistive technology certification. No formal document overflow assertions were run in this inspection; conclusions concern visually inspected samples. No comprehensive regression, test/build or final QA. Capture coverage is not equivalent to all images personally reviewed, product acceptance or user creative approval.

## Release and recommended next milestone

Original172 tracked frontend SHA256 fingerprints equal final fingerprints, recorded in `mega-short-2026-10-17/manifest.json`; revision remainsed67d53. Git scope shows only Root administrative files before this worker report; worker tracked write is this delivery file only. Exact source filenames/hashes are retained in manifests. All browser contexts/processes launched by the worker are closed; ownership can be released.

Recommend a new narrowly contracted homepage continuity correction for theP1 handoffs, then affected EN/AR1440/1280/mobile rendered re-review. P2 landscape/media and Arabic prepared separator need explicit inclusion in the next approved correction scope; no work started. Preserve workingTürkiyepriority, page families, source content, journey order, accessibility fallbacks and noindex. Root owns inspection completeness/product verdict/checkpoint and STOP; noQ12release.
