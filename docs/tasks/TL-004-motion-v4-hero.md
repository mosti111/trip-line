# TL-004 — Motion V4 cinematic homepage hero

Status: Partial / blocked at acceptance after two correction cycles. Direct user authorization, 23 October 2026. Creative direction: **The Journey Feels Touchable**. One milestone only; user acceptance precedes any next milestone.

## Base, authority and execution

Clean newest local baseline `feat/v3-ux-motion-recovery` at `e0d5538`; isolated branch `codex/motion-v4-hero`. No uncommitted work existed. Read AGENTS, normal product/design/motion/responsive/architecture authority, Bronze Journey and final TL-003 delivery. Current user specification authorizes hero visual changes and supersedes older hero timings/composition where needed; unrelated pages remain locked.

Root `/root` specifies, records state and independently reviews; one fresh explicitly selected `gpt-6.1-sol` worker implements and verifies. Root model is not independently attested by exposed metadata; do not invent Astra attestation or approval. No nested agents, additional QA worker or more than two correction cycles. Root administrative exception 5 (delegation is less efficient) covers only this task, task/report indexes, `docs/orchestration/state.json`, `docs/reports/TL-004-motion-v4-hero.md`, `docs/AI_HANDOFF.md`, `docs/FRONTEND_IMPLEMENTATION_PLAN.md`, `docs/DECISIONS.md` and selected durable QA metadata/captures/recordings (exact selection recorded below): a single writer avoids ownership collisions; checks are state validator, link/scope/whitespace and independent rendered review. No direct Root application edits planned.

## Worker exact write scope

- `frontend-v2/components/home-v3/HomeArrival.tsx`
- `frontend-v2/components/home-v3/HomeMotion.tsx`
- `frontend-v2/components/experience/ScrollScene.tsx`
- `frontend-v2/components/experience/BronzeJourney.tsx`
- `frontend-v2/components/experience/BronzeJourneyScene.tsx`
- `frontend-v2/styles/recovery-home.css`
- `frontend-v2/styles/recovery-motion.css`
- `frontend-v2/scripts/verify-v4-hero.mjs`
- `docs/reports/TL-004-motion-v4-worker.md`

One page family: homepage opening and its existing Service Worlds handoff only. Everything else read-only, including manifests/lockfile, ExperienceProvider, content/localization modules, other homepage chapters, mega menu, galleries, journey builder and deployment. Ask Root before any necessary scope amendment. Ignored `tmp/frontend-qa/v4-hero/` holds generated logs/captures/recordings; generated Next type paths may regenerate but are not deliberate source changes.

## Outcome and acceptance

Before application edits, start baseline frontend and capture desktop/mobile appearance. Audit HomeArrival, HomeMotion, ScrollScene, BronzeJourney/Scene, ExperienceProvider and their CSS. Diagnose missing entrance separately from import/init/fallback behavior, supported by rendered observations.

Opening photography settles 1.045→1; two whole connected headline lines reveal through masks; supporting text/actions overlap in a deliberate sequence; bronze has restrained dimensional movement. Complete main entrance in 1.3–1.6s, with usable content/actions before completion and fail-visible server HTML. No preloader, typing, bounce or generic fade-up cascade. Retain recognizable identity and source content.

Scroll photography recedes subtly, copy departs coherently, bronze mesh transforms into matched existing route without discontinuity, Service Worlds follows naturally and reverse restores states. Compare current long pin against shorter content-led transition and record chosen measured range/reason. One controller per property, using existing libraries only. Static/noJS/reduced/SaveData/touch/noWebGL states remain complete, native and useful. EN/TR/AR, connected Arabic RTL, geography/media orientation, keyboard/focus/actions/noindex and all cleanup remain intact.

## Verification and evidence

Run targeted checks during development; once frozen run from frontend-v2: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`; production preview and `node scripts/verify-public.mjs`, `node scripts/verify-v3.mjs`, plus scoped V4 verifier. Record real failures and test counts. Read bundled Next docs before code changes. No dependency changes.

Actual browser renders: 1920×1080, 1440×900, 390×844, 844×390 landscape; Arabic RTL and reduced motion. Also TR, SaveData, noJS, noWebGL and keyboard/action spot checks. Capture baseline/after stills, desktop load video, slow forward/reverse hero video and mobile video, reduced/Arabic stills. Check hydration/console errors, overflow/clipping, CLS/scroll jumps, reverse restoration, cleanup and working controls. Record browser/input/mode/dimensions, timings and artifact hashes/paths. Taste critique is contextual; Trip Line authority wins.

Deliver strict worker report (IMPLEMENTED/PARTIAL only), source/systems audit, exact replaced/repaired/retained systems, checks and evidence manifest. Root reviews actual renders/recordings and scope; technical completion is distinct from user creative acceptance. Commit checkpoint, provide SHA and preview instructions; no merge/push/deploy. Stop after this prototype is tested; next milestone remains unstarted.

## Correction R1 — connection capability guards

Final V3 QA found a real new HomeMotion failure with a connection capability exposing `saveData` but no event-listener methods. Exact correction scope: `frontend-v2/components/home-v3/HomeMotion.tsx` and worker report, same existing owner/lease, no other application changes. Guard both listener methods by actual capability, matching the retained mode controller. Targeted SaveData injection and normal/reduced checks must pass before rebuilding; rerun required final artifact browser checks. Preserve failed evidence. This is correction cycle 1 of maximum 2; no adjacent refinement authorized.

## Correction R2 — accent clearance in headline masks

Root actual native/rendered playback review found flat cut tops on Ü/İ dots; worker comparison against preserved pre-edit pixels confirmed the `.13em` upper mask clearance is insufficient. Exact correction scope: `frontend-v2/styles/recovery-motion.css`, scoped V4 clearance verification and worker report, same owner/lease. Increase safe top mask padding with equal negative margin to preserve baseline/net spacing, plus symmetric inline clearance/equal negative margins for confirmed 3px serif overhang at side edges; no type-size or unrelated motion change. Targeted EN/TR/AR native inspection precedes rebuild and final required browser gates. Preserve pre-R2 evidence. This is correction cycle 2 of maximum 2: any unresolved genuine blocking issue after this pass stops delivery with explicit gaps; no third correction or optional polish.

## Root durable evidence scope

Root alone writes `docs/qa/2026-10-23-v4-hero/` exact files: `before-desktop.png`, `before-mobile.png`, `before-observations.json`, `desktop-load-start.png`, `en-1440x900-normal-opening.png`, `en-1920x1080-normal-opening.png`, `en-390x844-normal-opening.png`, `en-844x390-normal-opening.png`, `ar-1440x900-normal-opening.png`, `ar-390x844-normal-opening.png`, `tr-390x844-normal-opening.png`, `ar-1440x900-reduced-opening.png`, `en-390x844-reduced-opening.png`, `en-1440x900-normal-service-handoff.png`, `en-1440x900-normal-reverse.png`, `desktop-load-1440x900.webm`, `en-1440x900-normal.webm`, `ar-1440x900-normal.webm`, `en-390x844-normal.webm`, `v4-report.json`, `mask-clearance.json`, `manifest.json`, `checks.json`, `root-review.json`, `cold-timing.json` and `README.md`. Administrative exception 5: copy exact frozen worker artifacts and independently record checks/hashes; no application edit or new design authority.

## Stop result

Prototype implementation and required regression checks are preserved; acceptance FAILS P1 desktop cold entrance timing. Supplemental raw events show first animation start to entry done approximately 2973ms EN 1440 and 3549ms AR 1440, versus 1502ms mobile. CSS cancel/restarts are observed; pin reparent/refresh and main-thread initialization are hypotheses, not proven causes. The 26-case V4 suite does not enforce the single uninterrupted wall-clock bound. Two corrections exhausted: STOP and commit reviewable partial result; no third repair, next milestone, merge/push/deploy or creative acceptance. A new narrowly authorized timing repair and fresh affected acceptance are required.
