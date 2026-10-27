# Trip Line

Trip Line is a Türkiye-first travel discovery and inquiry experience in English,
Arabic and Turkish, with actual Arabic RTL. Twelve Turkish destinations, nine
services and a secondary ten-country directory lead into a journey builder and
editable WhatsApp/email inquiries. The frontend does not submit messages or provide
reservations, payments, traveler accounts or a working CMS.

**V1.0 release candidate — not officially released.** Engineering verification and
client creative approval are separate; creative approval and physical iPhone Safari
acceptance remain open. The active application stays in `frontend-v2/`.

## Run locally

Use Node 24.x and pnpm 11.25.0 (declared in the application manifest). From a
checkout of [the repository](https://github.com/mosti111/trip-line), run:

```sh
cd frontend-v2
pnpm install --frozen-lockfile
pnpm dev --port 3002
```

Open [English](http://localhost:3002/en), [Arabic](http://localhost:3002/ar) or
[Turkish](http://localhost:3002/tr). Public content needs no backend or credentials.
Optional configuration is in [the environment example](frontend-v2/.env.example).
Keep local environment files private. An inherited `TRIPLINE_REVIEW_EXPIRES_AT`
can deliberately return 410; see [deployment guidance](docs/DEPLOYMENTS.md).

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start --port 3003
# In another terminal, from frontend-v2:
node scripts/verify-public.mjs
node scripts/verify-v3.mjs
```

The browser checks need Playwright browsers (`pnpm exec playwright install chromium webkit`).
See [QA and release](docs/QA_RELEASE.md) for coverage, modes and limitations.

## Stack and repository

Next.js 16.3.6 App Router, React 19.3, strict TypeScript, Tailwind CSS 4,
GSAP/ScrollTrigger and Motion. Native scrolling remains authoritative. Typed local
content powers the public site; the lockfile governs resolved dependencies.
`frontend/` is the preserved original demo. `backend/` is an unfinished Java/Spring
platform, independent of public frontend startup.

## Documentation

- [Start here](docs/START_HERE.md): onboarding and source map.
- [Project status](PROJECT_STATUS.md): authoritative baseline, gaps and next steps.
- [Agent agreement](AGENTS.md): task boundaries and completion requirements.
- [Architecture](docs/ARCHITECTURE.md), [design](docs/DESIGN_SYSTEM.md), [motion](docs/MOTION_SYSTEM.md), [routes/localization](docs/ROUTES_LOCALIZATION.md).
- [Decisions](docs/DECISIONS.md), [QA/release](docs/QA_RELEASE.md), [deployments](docs/DEPLOYMENTS.md), [changelog](docs/CHANGELOG.md).
- [Archive](docs/archive/README.md): historical milestones, evidence and recovery.

No publication, merge, final release tag or deployment is authorized by consolidation.
