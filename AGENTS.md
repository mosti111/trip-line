# Trip Line — agent operating map

## Role

Codex acts primarily as an implementation engineer here. Follow approved product,
UX, visual and architecture outcomes. Choose implementation details within those
boundaries; do not independently redesign an approved experience for convenience.
The repository is shared memory; established decisions must not require chat history.

## Read order

For all meaningful work, read these before editing:

1. [Current handoff](docs/AI_HANDOFF.md).
2. [Product vision](docs/PRODUCT_VISION.md).
3. [Decisions](docs/DECISIONS.md).
4. The current task specification in [docs/tasks/](docs/tasks/README.md).

For frontend work, also read:

- [Approved direction](docs/APPROVED_DESIGN_DIRECTION.md),
  [design system](docs/DESIGN_SYSTEM.md), [motion](docs/MOTION_SYSTEM.md),
  [responsive rules](docs/RESPONSIVE_RULES.md) and [architecture](docs/ARCHITECTURE.md).
- [frontend-v2/AGENTS.md](frontend-v2/AGENTS.md). Preserve its generated markers;
  read bundled `node_modules/next/dist/docs/` before framework behavior changes.
- [Phase plan](docs/FRONTEND_IMPLEMENTATION_PLAN.md) and relevant delivery/QA evidence.
- [Bronze Journey](docs/V3_BRONZE_JOURNEY.md) for current V3 experience work.

For backend/CMS work, inspect existing source, the [master specification](docs/MASTER_SPECIFICATION.txt),
[product contract](docs/PRODUCT.md), [API](docs/API.md), [database](docs/DATABASE.md),
[security](docs/SECURITY.md), [testing](docs/TESTING.md) and [deployment](docs/DEPLOYMENT.md).
Use the [documentation index](docs/README.md) for conditional/reference reads.

## Authority, highest first

1. Direct current user instruction / current approved task specification.
2. `docs/DECISIONS.md` — explicit accepted decisions with evidence.
3. `docs/PRODUCT_VISION.md` — current experience intent.
4. `docs/APPROVED_DESIGN_DIRECTION.md` — approved visual baseline and later steering.
5. `docs/DESIGN_SYSTEM.md`.
6. `docs/MOTION_SYSTEM.md`.
7. `docs/RESPONSIVE_RULES.md`.
8. `docs/ARCHITECTURE.md` — current versus target boundaries.
9. `docs/AI_HANDOFF.md` — current status, not new authorization.
10. Current delivery/QA documentation — dated evidence for the revision checked.
11. Master specification — broader unfinished production contract.
12. Historical research/exploration — context, never silent overrides.

Use the newest explicit approved decision if documents conflict. Record material
conflicts/resolutions in `DECISIONS.md`, citing evidence. Do not invent a resolution
to an unresolved product question or turn implemented code into approval.

## Repository boundaries

- `frontend-v2/`: active public frontend, including V3 Bronze Journey work.
  V2 delivery is a verified historical baseline; V3 QA remains in progress.
- `frontend/`: preserved historical V1 demo. Do not overwrite it during V2 work.
- `backend/`: existing incomplete platform source; not production-complete.
- `docs/references/`: approved assets and labeled historical studies.
- `docs/design-preview/`: earlier design-review prototype, not the active site.
- `docs/qa/2026-10-02/`: durable V2 baseline; `tmp/frontend-qa/` is ignored local evidence.
- Older Vercel links show earlier demos. Do not infer current deployment or link V2
  to the V1 deployment project. No launch/indexing assumption is permitted.

## Product invariants

- Türkiye first; preserve all twelve Turkish destinations and nine source-based services.
- Retain the ten-country international directory as secondary discovery.
- EN / AR / TR, preferred-language fallback to English and remembered manual selection.
- Actual Arabic RTL; geography is never mirrored. Preserve photo orientation/meaning.
- Actual stacked logo, teal/sand/bronze, geographic atlas and route/ribbon identity.
- Preserve meaningful video, animation and scroll-driven 3D with static fallbacks.
- No invented prices, reviews, inventory, partner claims or company statistics.
- Inquiry prepares WhatsApp/email messages only; never claim server submission.
- Reservations, payments, accounts and CMS are not implied as implemented.
- Keep noindex and legal-review defaults until publication is explicitly authorized.

## Engineering invariants

- Inspect structure, source and Git status before modifying; preserve unrelated local work.
- Reuse suitable components; avoid duplicate abstractions and unrelated changes.
- Do not replace dependencies casually; manifest/lockfile govern actual versions.
- No placeholder or TODO-only implementation presented as completion.
- Keep secrets, environment files, dependency/build output and temporary downloads out of Git.
- Preserve keyboard access, visible focus, semantic content and accessible static fallbacks.
- Respect reduced motion, data-saving behavior and input capabilities.
- Verify mobile and relevant RTL flows; essential information cannot require hover/WebGL.

## Definition of done

For relevant frontend changes, from `frontend-v2/`, run:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

If a test command finds no tests, record that gap; it is not a passing suite.
For public behavior changes, run a production preview and
`node scripts/verify-public.mjs`; default port 3003, `QA_URL` overrides it.
For V3 flows also run `node scripts/verify-v3.mjs`. Use Playwright/available browser
verification for visual/interaction changes. Fresh machines may need
`pnpm exec playwright install chromium`. Record actual widths, locales and modes.
For documentation-only work, typecheck/lint and link/diff consistency checks suffice;
run tests/build as well if application source/config is touched.
Never claim checks that were not run or treat local preview as deployment.

## Task and handoff discipline

Significant work starts with a spec under [docs/tasks/](docs/tasks/README.md),
written before implementation. A normal feature needs one concise task file;
only long multi-stage work needs an additional linked execution plan.
Codex chooses how to implement, not silently what the approved task should achieve.
Report material product/design ambiguity before taking a dependent decision.
Every completed significant task has a report under [docs/reports/](docs/reports/README.md).
Record material product/design/architecture decisions in `docs/DECISIONS.md`.
Update handoff and phase plan when scope/status changes, preserve historical reasoning,
and leave follow-up suggestions unstarted unless the user authorizes them.
