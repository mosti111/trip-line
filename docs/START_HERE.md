# Start here — Trip Line V1.0 release candidate

Read [current status](../PROJECT_STATUS.md), then [working rules](../AGENTS.md).
V1.0 is the forward-looking candidate label; historical V1.1/V6 names stay accurate.
Use [root setup commands](../README.md) to run `frontend-v2` with Node 24 and pnpm
11.25.0. Public content runs without backend access. No root package/workspace install
is defined. Do not rename the app directory or link it to an old deployment project.

| Need | Read | Source under frontend-v2 |
| --- | --- | --- |
| Current scope/evidence | [Status](../PROJECT_STATUS.md), [tasks](tasks/README.md), [reports](reports/README.md) | TL-016 consolidation |
| Product/boundaries | [Vision](PRODUCT_VISION.md), [decisions](DECISIONS.md) | Typed content; prepared inquiries |
| App/state | [Architecture](ARCHITECTURE.md) | `app/[locale]/[[...slug]]/page.tsx`, `components/travel/Pages.tsx` |
| Identity/responsive | [Design](DESIGN_SYSTEM.md), [responsive](RESPONSIVE_RULES.md) | `styles/v5-foundations.css`, V1.1 overrides |
| Motion policy/scenes | [Motion](MOTION_SYSTEM.md) | `lib/motion-preference.ts`, `components/v6/V6Motion.tsx` |
| Languages/URLs | [Routes/localization](ROUTES_LOCALIZATION.md) | `lib/i18n.ts`, `travel-content.ts`, `turkiye.ts`, `proxy.ts` |
| Checks/release gates | [QA/release](QA_RELEASE.md) | `scripts/verify-public.mjs`, `verify-v3.mjs`, `verify-tl014-motion.mjs` |
| Review environments | [Deployments](DEPLOYMENTS.md) | Dated receipts and no-expiry instruction |
| Milestones/recovery | [Changelog](CHANGELOG.md), [archive](archive/README.md) | Original branches, tasks, reports and QA |

Read source before changing it. Local `.env` and `.vercel` files are private machine
configuration, not onboarding prerequisites. Never copy secrets into docs. Regenerable
QA output belongs in ignored root `tmp/`; durable selected summaries belong in dated
`docs/qa/` directories.

Inspect branch/status/worktrees and task authority. Write one concise task for significant
work; identify frozen behavior and acceptance. Implement approved scope, verify the rendered
result where relevant, then report and update status. Use [TASK_TEMPLATE](tasks/TASK_TEMPLATE.md).
Historical orchestration grants no new execution permission. Release operations need
explicit user authorization.

The original demo, journal/preview routes, V3 sculpture and Lenis eligibility are historical.
Old expiry receipts do not close TL-015's current review. Native scrolling and explicit
motion choices remain current. Prepared inquiries are never bookings or submitted leads.
Backend/platform plans remain unfinished. Engineering checks do not imply creative
approval or physical Safari acceptance.
