# Trip Line

## Current project — 2 October 2026

**Active frontend: [`frontend-v2/`](frontend-v2/).** The approved Türkiye-focused public frontend is implemented and ready for review: 40 content pages in Arabic, English and Turkish, all 12 client-requested Turkish destinations, interactive geographic discovery, video, scroll-driven Three.js and contextual WhatsApp/email inquiries. Build, lint and production browser checks passed. This revision has not been deployed; backend/CMS and publication work remain.

**For a new agent, start with [AGENTS.md](AGENTS.md) and [AI handoff](docs/AI_HANDOFF.md).** See the [delivery report](docs/FRONTEND_DELIVERY.md), [completed phase plan](docs/FRONTEND_IMPLEMENTATION_PLAN.md), [documentation index](docs/README.md) and [saved QA evidence](docs/qa/2026-10-02/README.md).

Run the active frontend with Node 24 and pnpm 11.25.0: from `frontend-v2`, run `pnpm install --frozen-lockfile` and `pnpm dev --port 3002`. Open `/ar`, `/en` or `/tr`. Public content runs without the backend. Keep local `.env` files out of Git.

## Historical V1 demo notes

The sections below describe the preserved V1 demo and broader backend roadmap, not the latest V2 implementation. Older hosted demo links do not show this revision.

Production website and CMS requested in the [master specification](docs/MASTER_SPECIFICATION.txt).

**Current state: working public-site demo; production V1 is unfinished.** At the user's request, public-site preview delivery takes priority over completing the CMS and deployment. The supplied logo, approved visual concept, and Snami Travel reference have been reviewed. Backend source and migrations are retained for the next implementation phase.

## Run the demo

Use a current supported Node.js release and pnpm 11.25.0. From `frontend`, run `pnpm install --frozen-lockfile`, copy `.env.example` to `.env.local`, and set `TRIPLINE_DEMO=true`. Run `pnpm dev` and open http://localhost:3000.

The current workspace already has `.env.local` configured for the demo. This file is ignored by git. Public routes include Home, About, Services, three example service details, Contact, and a branded not-found page. The contact form validates sample input but does not send or store messages. Demo content and generated imagery are clearly labeled, isolated in `frontend/lib/demo.ts`, and excluded when demo mode is false. Demo pages request noindex and robots disallows crawling.

The public demo is live at https://trip-line-demo.vercel.app (Vercel production target, deployed September 27, 2026). Turning demo mode off requires a working Spring/PostgreSQL backend with published content; there is no silent fallback to demo data.

## Verification and next phase

`pnpm typecheck`, `pnpm lint`, and `pnpm build` check the frontend. Browser checks and known gaps are recorded in `docs/DEMO_QA.md`. The backend currently compiles with Java 21/Maven, but has not been validated against a running PostgreSQL database. Do not deploy it as production-ready.

Next: PostgreSQL/Flyway integration tests and module verification, complete backend security/media contracts, build the authenticated CMS, connect contact submission/Turnstile, then staging, deployment, backups and restore verification. See `TODO.md` for the complete milestone list.

## Documents

- [Product](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [API contract plan](docs/API.md)
- [Database plan](docs/DATABASE.md)
- [Deployment and recovery](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)
- [Testing and acceptance](docs/TESTING.md)
- [Milestone checklist](TODO.md)

The intended stack is Next.js App Router, strict TypeScript, Java 21/Spring Boot modular monolith, PostgreSQL/Flyway, JDBC sessions, R2 media, and Turnstile. Deployment uses separate frontend/backend/database Coolify resources. These choices remain aligned with the supplied specification.

Production setup, migrations, admin bootstrap, R2, deployment and recovery procedures remain planned until verified. The demo never establishes production readiness.
