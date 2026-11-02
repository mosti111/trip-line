# TL-016 — Repository consolidation and V1.0 baseline

28 October 2026, Europe/Istanbul. Status: consolidation complete; V1.0 candidate only.
[Task](../tasks/TL-016-v1-baseline-consolidation.md) /
[original user request](../tasks/TL-016-instructions.txt).

## A. Canonical baseline

Dedicated branch: codex/v1-baseline-consolidation.
Starting commit: d917ebd440113e31fad0eae8f9166b2a73bcbd42, preserved on
codex/trip-line-v11-mobile-recovery.
Mechanical cleanup commit: 59c462ee464d058b1ef54f227656e8fbbed79b72.
The documentation/evidence commit follows it; the final candidate is this dedicated
branch's tip. The delivery response/Git history reports the exact final commit; a
document cannot contain its own commit hash without changing that hash.

Read-only git fetch origin completed. Starting working tree was clean; one worktree.
origin/main at 89d73c3 differs by one main-only merge commit and 71 baseline-only commits;
local main at 9a717a9 is two behind origin/main. No local/remote release tags at preflight.

Baseline selected by ancestry and actual source: TL-011 mobile/map source 98c44f8,
TL-014 Full default source 1f6e453, and TL-015 no-expiry policy d917ebd. git diff
1f6e453 d917ebd -- frontend-v2 is empty. Thus the current implementation matches the
recorded reviewed motion source, with newer documentation/access authority. main and
earlier recovery branches omit these later behaviors. V1.0 is a future candidate label,
not a retroactive rewrite of historical V1.1 or V6 milestones.

## B. Cleanup results

[Full inventory](TL-016-inventory.md) classifies the complete tracked surface and gives
all removal/retention reasons. The initial repository had 3,828 tracked files; 3,242
QA files occupy 2,814,040,161 bytes. SHA256 scan found 366 identical-media groups involving
1,036 files, retained because public paths, dated proof and provenance are meaningful.

Removed only five proven unreferenced files (281 lines):

- frontend-v2/components/experience/ContextCursor.tsx
- frontend-v2/components/experience/ExperienceProvider.tsx
- frontend-v2/components/experience/JourneyChapter.tsx
- frontend-v2/components/experience/ScrollScene.tsx
- frontend-v2/components/home-v3/HomeMotion.tsx

All app/proxy-root import tracing plus whole-source/script searches found no consumers.
[Removal manifest](../qa/2026-10-28-consolidation/deleted-source.json) records original blobs.
No active import, style, route, content, motion implementation, config, dependency or
lockfile was changed. No local secrets, dependencies or caches were deleted.

Fifteen original entry docs are [archived with manifest](../archive/historical-material/pre-v1-consolidation/manifest.json):
root README/PROJECT_STATUS/AGENTS/TODO; frontend-v2 README; docs AI_HANDOFF/README/
ARCHITECTURE/DESIGN_SYSTEM/MOTION_SYSTEM/RESPONSIVE_RULES/DECISIONS/
FRONTEND_IMPLEMENTATION_PLAN; task/report indices. Original prose remains with only
relative Markdown target rebasing; Git d917ebd retains exact-byte originals.

Canonical current guides replace conflicting current-facing text. AI_HANDOFF/phase plan/
TODO remain stable pointers. Five historical entrypoints (TESTING, DEPLOYMENT, approved
direction, old new-chat handoff, orchestration README) receive clear context banners.
The report template's nonexistent placeholder link becomes an explicit instruction.
Historical tasks/reports/QA/research/provenance remain indexed at stable paths.

Added verify-baseline.mjs for repeatable settled screenshot/semantic comparison and
scripts/verify-docs.mjs for Markdown target checks. No package scripts changed.
.gitignore already covers environments/builds/dependencies/logs/tmp and needs no change.
Historical routes, styles, scripts, unused-looking platform helpers/dependencies and
media remain KEEP/INVESTIGATE as documented; no speculative pruning.

## C. Fresh validation

Baseline before source deletion: frozen install, typecheck and production build pass.
Cleaned typecheck, lint, 59 tests in four Vitest files and production build pass.
Production checks use localhost:3041; baseline used 3040. Both are local builds, not deployment.
Frozen installation was validated against the existing workspace/dependency cache, not
a destructive reinstall or clean-room clone. The cleaned production build ID is
pjeCsyxHLNDInvBkFPnmJ. No runtime application edits followed that build.

Settled Reduced viewport comparisons: all nine PNG byte hashes, titles and H1 text match
exactly between baseline and cleanup at 390×844, 768×1024, 1440×1000 across EN/AR/TR.
Representative Arabic phone, Turkish tablet and English desktop captures were visually
inspected. This certifies captured settled viewports; Full scenes are verified separately.

Public regression passes 120 localized content URLs and five functional groups, with zero
reported runtime errors. Independent sitemap/metadata/asset scan passes 120 unique paths,
lang/dir, noindex, canonical/three language alternates, robots disallow and 45 referenced
image assets returning 200.

Full V3 passes 16 functional groups and 60 captures, with zero runtime errors. Coverage
includes journey/context preparation/invalidation, keyboard reorder/removal, session/
locale persistence, navigation/history, service links, menus/focus, RTL geography,
coarse input, short height, Reduced/System, no-JS, SaveData, failed film and unavailable
WebGL. Widths include 360/390/430/768/1024/1280/1440px, plus 844×390 landscape and
1280×600 short desktop. A 4× CPU-throttled interaction completes; this is not field
performance certification.

Markdown relative-target scan passes across all tracked/non-ignored Markdown; the
[final report](../qa/2026-10-28-consolidation/doc-links.json) records exact counts.
Heading fragments/external availability are outside scanner scope. Git whitespace and new-harness syntax checks
pass. Targeted Chromium/WebKit motion verification passes all 36 fresh-mode cases,
108 scene/billboard effect checks and two fallback cases, with zero strict application/
console errors. Scope: EN/AR/TR at 320/390/768px, fresh Full defaults under both OS settings,
saved choices, actual selectors, OS changes, reload/locale persistence, native Chromium
touch versus programmatic WebKit scrolling, billboard movement/pause and media/WebGL
fallbacks. The touch-map suite passes 24 size/locale cases and 288 actual Chromium
touchscreen selections with 44px target/overflow assertions and zero runtime errors.
Its sizes are 320×740, 360×800, 375×812, 390×844, 430×932, 768×1024, 667×375 and
844×390, each in EN/TR/AR.

| Executed check | Outcome |
| --- | --- |
| pnpm install --frozen-lockfile | PASS, existing workspace/cache |
| pnpm typecheck / pnpm lint / pnpm test / pnpm build | PASS / PASS / 59 tests / PASS |
| verify-baseline.mjs, before/after with QA_COMPARE | PASS, nine exact settled viewport/semantic comparisons |
| verify-public.mjs | PASS, 120 routes / five groups / six captures |
| verify-v3.mjs | PASS, 16 groups / 60 captures |
| verify-tl014-motion.mjs | PASS, 36 modes / 108 effects / two fallbacks |
| verify-v11-map.mjs | PASS, 24 cases / 288 touch selections |
| Ad hoc sitemap/metadata/assets verifier | PASS, 120 routes / 45 image assets |
| node scripts/verify-docs.mjs; node --check on new harnesses; Git whitespace/scope | PASS |

All browser suites report zero runtime errors; the targeted motion suite also checks
console errors strictly. [Machine summary and command/environment ledger](../qa/2026-10-28-consolidation/verification-summary.json)
and [evidence index](../qa/2026-10-28-consolidation/README.md) preserve fresh results.
No application regression was discovered; no active behavior was modified to make QA pass.

Failures/tooling notes retained: the first comparison readiness predicate counted hidden
lazy images; it was corrected to visible viewport images and rerun successfully. An
initial next start attempt preceded build completion and was rerun after the build passed.
No application fix was needed for either tooling/setup failure. next start emits its
existing standalone-output warning while serving the local production checks.
No physical Safari, field FPS, complete new WCAG audit or client creative approval claim.
Physical Android is also untested. TL-011's Windows WebKit font-weight discrepancy and
source-logo resolution caveats remain discoverable; no new browser-specific typography
workaround or logo quality/relationship approval was inferred.

## D. Final organization

```text
README.md                 public entry/setup
PROJECT_STATUS.md         authoritative current state
AGENTS.md                 concise operating agreement
docs/
  START_HERE.md           onboarding
  ARCHITECTURE.md         actual source/integration boundaries
  DESIGN_SYSTEM.md        current identity and tokens
  MOTION_SYSTEM.md        current scene/preference policy
  RESPONSIVE_RULES.md     viewport/RTL/accessibility expectations
  ROUTES_LOCALIZATION.md  route/locale/metadata contract
  DECISIONS.md            concise current log + original-history link
  QA_RELEASE.md           checks and later release procedure
  DEPLOYMENTS.md          environment/retention policy
  CHANGELOG.md            candidate and historical milestones
  archive/                index + 15 preserved entry documents
  tasks/, reports/, qa/   dated scope/outcomes/evidence
frontend-v2/              active app (directory unchanged)
frontend/, backend/       preserved demo / unfinished platform
scripts/verify-docs.mjs   dependency-free link target check
```

[START_HERE](../START_HERE.md) and [PROJECT_STATUS](../../PROJECT_STATUS.md) remove the need
for previous chat context. Historical milestone instructions grant no execution authority.

## E. Release readiness

Candidate engineering verification is complete within the recorded limits; not officially released.
Client creative review, physical iPhone Safari acceptance, legal/claim/partner/media and
canonical-domain sign-off remain. Backend/CMS/server inquiries/bookings/payments/accounts
and operational infrastructure remain unfinished. No CI workflow exists.

The current TL-015 no-expiry review remains unchanged by this task. Environment bindings
are dated repository receipts, not a live provider inspection; do not claim current
availability or expiry success. No Vercel project/config/alias, automation, billing,
production deployment or indexing was changed.

## F. Retention and later operations

Keep original source branch, cleanup candidate, main and V4/V5/V6/V6.1/V1 recovery references
through approval/release. Some recovery branches are local-only. [DEPLOYMENTS](../DEPLOYMENTS.md)
lists exact references and candidates for later removal after ancestry/retrieval checks.

Old completed feature branches and superseded TL-010/TL-012/protected/generated previews
are possible future cleanup candidates, not authorized deletions. Keep TL-015 review open
until direct closure instruction. Never restore older public content to reopen an expired URL.

[QA_RELEASE](../QA_RELEASE.md) contains exact recommended unexecuted fetch/review/main merge/
tag/push operations. main has divergence; inspect/QA the proposed merge rather than assuming
fast-forward. Obtain explicit authorization for release operations and separately for any
deployment. No main merge, final tag, force-push, remote deletion or publication occurred.
