# TL-011 — V1.1 mobile creative recovery

25–26 October 2026. Engineering verification, rendered review and separate Preview delivery complete. User creative acceptance remains
pending. [Task](../tasks/TL-011-v11-mobile-recovery.md),
[exact brief](../tasks/TL-011-v11-instructions.md),
[evidence](../qa/2026-10-25-v11-mobile/README.md).

Baseline9f6cfa7 is preserved on `codex/v1-before-v11-recovery`. Review branch:
`codex/trip-line-v11-mobile-recovery`; implementation checkpoint5008ced. One
implementation agent, no subagents or runtime model-switch claim. No V7, desktop
creative reconstruction, new dependency, backend feature or main merge.

## Result and motion authority

The opening uses a stronger portrait Istanbul crop, larger headline and a lower
support/action group that leaves the skyline visible. Three service intents have
varied photographic proportions and editorial text treatments. Explorer has a
full-width selected photograph, compact two-row scrollable twelve-place index,
optional geographic map and synchronized photo/title/route changes. Signature
scenes have distinct balloon-horizon, inset forest-portrait and coast-aperture
entrances rather than one scaled desktop reveal. The single measured billboard
has larger optical marks and retains pause, focus, visibility and seamless-loop
behavior. Quiet Story, Services, Process, builder and FAQ retain their useful
structure; film height and closing hierarchy were reviewed with the full scroll.
No artwork, assets or code were copied from the JAECO quality reference.

System/Full/Reduced share explicit persistent authority before paint and across
CSS, Motion and GSAP. System initially follows accessibility. Full overrides system
reduction only after active visitor selection; Reduced always reduces. The choice
is available in the menu and footer. SaveData still limits automatic video and
expensive media/3D; it no longer disables lightweight UI/scene animation. Ordinary
touch movement no longer seeks the opening to completion. Native scrolling stays
unblocked. Visual-viewport resize updates ScrollTrigger and schedules measurement
when scrolling is idle, with observer/listener/media-query context cleanup.

Touch testing exposed meaningful issues and produced corrections: a20px overflow
from the map disclosure's width plus margins; late title changes that disturbed
caption geometry; and delayed map-camera movement that shifted hit targets after
touch began. Captions now reserve a stable two-line title baseline, the index
reveals a selected item immediately, and the optional interactive map keeps its
geographic frame stationary. Route drawing, selected-marker feedback and the
photographic stage still animate. This is a control-stability decision, not a
blanket small-screen/Safari motion veto. The floating planner yields to visible
local actions and an open map. Original geography, callout anchors and photograph
orientation are preserved in Arabic.

Desktop scenes are retained. A27-capture EN/TR/AR comparison at1440px shows exact
EN/TR pixels and at most4 changed pixels per1.44M-pixel Arabic capture. Requested
motion-choice functionality also applies to desktop; no desktop creative redesign
was performed. Existing translations, twelve Turkish places, nine services,
secondary ten-country directory, routing and prepared-message inquiry remain.
Noindex, legal qualifiers and partner-logo publication restrictions remain.

## Verification

Final frozen local application build: `YcMLV8XQrru17yorEl3yd`, served on3022.
Typecheck, lint,41 unit tests and production build pass. No tests were skipped or
represented by an empty suite.

- Broad site matrix:984 cases (40 routes ×3 locales ×8 sizes in normal motion,
  plus24 reduced home cases), zero layout/media findings.
- Final affected Home/Explorer matrix:96 cases, normal/reduced EN/TR/AR at
  320×740,360×800,375×812,390×844,430×932,768×1024,667×375 and844×390;
  zero findings/errors, with all images explicitly decoded after resizing.
- Final WebKit26.6 engine:48 home cases across the same locale/size/motion matrix,
  plus three-language touch menus, twelve-place selection, map, moving/paused
  billboard, builder reordering and inquiry handoff. Zero findings/errors.
- Final map:24 configurations,288 actual touch selections, all twelve places at
  every size/locale; no forced actions and44px targets. A180-tap diagnostic first
  isolated the moving-camera problem; the final pass uses ordinary source CSS.
- Final menus:24 configurations including375px and short landscape; reachable
  contact and motion controls, Escape/focus return, body-scroll restoration and
  readable logo geometry.
- Final public regression:120 routes plus redirects, branded404, film lifecycle,
  language context, inquiry preparation and data-saving/reduced behavior pass.
- Final V3 regression:16 functional groups and60 captures pass, including keyboard,
  no-JS, data saving, four-times CPU throttling, geography and ordered context.
- Nine-surface axe scan: zero detected WCAG A/AA violations. Atlas six-configuration
  selection/failed-image retention/latest-request resilience checks also pass.
- Six explicit motion/system combinations, with SaveData enabled, resolve correctly.
  Seven major scene effects have measured visible changes during native Chromium
  touch scrolling, including Full with system reduction enabled. For example,
  service masks reveal71% of image width, Cappadocia's horizon opens32%→6%, and
  Antalya's aperture opens42%→8% during one swipe.

Complete-page screenshots and actual viewport/touch recordings were reviewed;
automated geometry alone is not creative acceptance. Initial failed evidence is
retained separately. One WebKit full-page capture timed out under concurrent QA;
the subsequent full48-case run passed. Initial EN scroll recorded one384ms long
task under concurrent QA; an isolated repeat recorded zero. The final isolated release recordings also show zero LongTasks in all three
languages (EN57.12s, TR61.32s, AR54.24s). These observations are not field FPS or
physical-device certification. Full-page capture tooling was
corrected to wait for offscreen images to decode after each viewport resize.

## Delivery boundary and remaining limits

Deploy only a separate Vercel Preview on the verified existing project
`trip-line-journal-v223` / `prj_Z7d8Fd2lrA4DEAAZz1B7ZBIR0R8O`, team
`team_l5N8qo6rdkw7ABXTnNIOx51K`, account `mostafaabdelwahab651-3920`.
Root `frontend-v2`, Next.js preset, Node24, frozen-lockfile pnpm install/build
verified through CLI and connected account. Hobby is the user's existing chosen
temporary-review account; no billing change or commercial-plan eligibility claim.
Deployed source: `98c44f8d05792f97c7324ce5dcbf12f73e4e8535`.
Preview: https://trip-line-journal-v223-10lita4c5.vercel.app/en . Bare URL retains
Vercel authentication; the complete client share URL is in the final delivery and
ignored operational state, not public Git. New provider share links last23 hours;
provider-reported expiry26October2026 at8:10:11PM. No production alias assigned.
Deployment `dpl_45Zj8VFbRQcHjmgp2fDQXF4Qa1tm` is READY, from the reviewed branch.
All285 exported files match Git blobs; all284 remotely uploaded files match the
canonical SHA256 manifest (.gitignore is excluded by upload). Actual hosted QA:
6 fresh-cookie-free access cases across Chromium/WebKit and EN/TR/AR,33 pages with
all three1280×720 films decoded,48 mobile cases plus touch planner/menu/map/billboard
flows, and3 desktop hero comparisons with zero changed RGB pixels versus V1.
Project-level runtime-error query for the last hour reports none. Production still
resolves to the exact original deployment ID. [Hosted receipt](../qa/2026-10-25-v11-mobile/hosted/receipt.json).

Physical iPhone Safari/Android remain untested. Windows WebKit paints the variable
fonts too thin despite a loaded face and computed weight800; explicit wght800 also
fails in this port. This observed discrepancy is consistent with the reported
[Playwright Windows WebKit issue](https://github.com/microsoft/playwright/issues/43004).
No browser-specific typography workaround was introduced for an unverified native
Safari issue. Chromium/local/hosted reference typography agrees; native iPhone
weight must be compared using the supplied reference before creative acceptance. WebKit engine results are distinct
from native mobile Safari. The precise [iPhone checklist](../qa/2026-10-25-v11-mobile/IPHONE_CHECKLIST.md)
requests device/iOS version, system/site motion choices, browser-toolbar behavior
and a continuous recording before any failure. Profile-derived logo resolution,
current relationship/publication approvals and final legal/client creative sign-off
remain inherited limitations. Inquiry prepares editable WhatsApp/email content;
no server submission, confirmed reservation, payment or account is implied.

The existing TL-010 production alias/deployment,27 October18:22:45 Istanbul expiry
and expiry-verification automation remain unchanged. No production promotion.
Stop at verified V1.1 for user creative review.
