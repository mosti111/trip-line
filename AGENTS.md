# Trip Line — working agreement

## Context and authority

Read [PROJECT_STATUS](PROJECT_STATUS.md), [START_HERE](docs/START_HERE.md),
[product vision](docs/PRODUCT_VISION.md), [decisions](docs/DECISIONS.md) and the
[current task index](docs/tasks/README.md) before meaningful changes. For frontend
work also read [architecture](docs/ARCHITECTURE.md), [design](docs/DESIGN_SYSTEM.md),
[motion](docs/MOTION_SYSTEM.md), [responsive rules](docs/RESPONSIVE_RULES.md),
[localization](docs/ROUTES_LOCALIZATION.md) and [frontend rules](frontend-v2/AGENTS.md).
Preserve generated Next.js markers; read applicable bundled Next documentation
under `frontend-v2/node_modules/next/dist/docs/` before framework behavior changes.

Direct current user instruction and the approved task take precedence, then explicit
accepted decisions, product vision, design/motion/responsive rules, architecture,
current status, dated verification and historical plans. Resolve conflicts using
newest explicit authority and record material resolutions in decisions. Historical
implementation or QA does not establish client approval.

## Execution

Inspect Git status, worktrees and relevant source first. Preserve local changes,
recovery branches and source provenance. Significant work starts with a concise
`docs/tasks/TL-###-*.md` specification and finishes with a matching report; update
PROJECT_STATUS and CHANGELOG when scope/status changes. Reuse existing systems;
avoid unrelated refactors, dependencies or directory renames.

TL-016 consolidation runs with one agent and no subagents. Historical milestone,
lease and model-routing instructions in `docs/orchestration/` are archived workflow
context, not authority to resume tasks, create workers or change runtime models.
Future delegation requires current user authority or an applicable approved task.
No new orchestration framework is required.

## Frozen product and design boundaries

- Active app: `frontend-v2/`; preserve `frontend/` and unfinished `backend/`.
- Türkiye first: twelve places, nine source services, ten-country secondary directory.
- EN/AR/TR, English fallback, remembered language and actual Arabic RTL. Never mirror geography or photo meaning.
- Source-faithful stacked identity, teal/sand/bronze, Manrope/Noto Sans Arabic and native-scroll route/Flight Trace narrative.
- Inquiry prepares editable external-app messages; no server submission, booking, payment or account claims.
- No invented prices, reviews, partners, inventory or company statistics. Retain 2025 attribution and legal/noindex defaults.
- Full is the unsaved motion default even with OS reduction (TL-014). Saved System follows OS; saved Reduced stays reduced. Keep pause/capability/media fallbacks.
- Keep TL-015's current review URL open without automatic expiry until explicit user closure. Older TL-010/TL-012 deadlines are separately scoped.

Creative redesign, motion-policy changes, routing/content/inquiry changes and stack
replacement require approved scope. Never rewrite/force-push history, merge main,
create a final release tag, delete remote resources, deploy/promote/reconfigure Vercel,
or change billing without explicit authorization. Prior delivery exceptions do not
carry forward as standing deployment permission. Task-scoped commits and feature-branch
pushes are allowed when the current user request authorizes that workflow.
Keep secrets, local environments, dependencies, downloads and build output out of Git.

## Verification and completion

From `frontend-v2`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
An empty suite is a gap. Public changes also require a production server and
`node scripts/verify-public.mjs`; journey flows require `node scripts/verify-v3.mjs`.
Default QA origin is port 3003; set QA_URL for other ports. Use the
[QA guide](docs/QA_RELEASE.md) for targeted motion/mobile checks.

Inspect rendered desktop/tablet/phone and Arabic flows for visual/interaction changes.
Verify keyboard/focus, native scrolling, reductions and static fallbacks where relevant.
Record actual commands, widths, locales, modes, failures and limitations. Compilation,
headless WebKit and screenshots do not establish creative approval, physical Safari
or field performance. Documentation-only work may use typecheck/lint plus links/diff
checks; TL-016 explicitly requires broader baseline verification.

Reports state what changed, actual verification, remaining risks and required user
decisions. Proposed follow-ups remain unstarted until authorized.
