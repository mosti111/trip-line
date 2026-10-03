# AI handoff — start here

Updated 3 October 2026, Europe/Istanbul (TL-001 Bronze Journey delivery). This is the
current implementation handoff for a fresh session. It supersedes
outdated status/next-task instructions in older design/demo notes. It does not authorize
new work by itself; follow the user's current task.

## Current task — TL-002 reconstruction

The user supplied a new full reconstruction specification on 3 October 2026.
[TL-002](tasks/TL-002-bronze-reconstruction.md) is in progress on the same branch.
The prior TL-001 delivery below is historical evidence, not completion of TL-002.
The frozen V2 revision cc374eb was captured before design changes in
ignored tmp/v3-reconstruction/before. Hero/departure, service selector, Türkiye
entrance/explorer, destination chapters, editorial story, planner and arrival have
been reconstructed; production QA and visual review are in progress.

## Prior delivery outcome

The existing V3 Bronze Journey continuation is complete in `frontend-v2/` on
`feat/v3-bronze-journey`. See [V3 delivery](V3_FRONTEND_DELIVERY.md),
[TL-001 report](reports/TL-001-report.md) and [dated evidence](qa/2026-10-03-v3/README.md).
Typecheck/lint/build and three production Chromium scripts passed: 120 localized
routes, 60 V3 page/viewport cases, keyboard/RTL/touch/fallback/render-lifecycle checks.
`pnpm test` finds no Vitest files and exits 1; this is an explicit gap. Physical
devices, Safari/Firefox and field performance were not verified. No deployment
occurred; user aesthetic acceptance and publication approvals remain separate.
V2 below is the protected historical baseline, not the source of V3 verification.

TL-001 preserved both paused QA scripts and fixed no-JS hidden content, Arabic
service-track positioning, planner focus, short-height/coarse-input behavior,
departure readability and lost metallic reflections after actual WebGL restoration.
Pinning/Lenis require fine input, >=1024px width, >=800px height and no reduced-motion
or data-saver preference. Shared Ribbon is static SVG; homepage BronzeJourney owns
the lazy demand-rendered sculpture. Generic loading UI is scoped to `(public)`.

### Protected V2 baseline

The following describes the delivered V2 revision and its evidence, retained underneath
the current V3 status above. The user authorized phased implementation including motion,
video and scroll-driven 3D. The fourteen ZIP sheets matched extracted references; client
Türkiye-first steering expanded the implementation. V2 was delivered for review.

Forty content pages plus branded 404 exist in English, Arabic and Turkish (120 localized content routes). The twelve Turkish destination pages are Istanbul, Trabzon, Rize & Ayder, Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova and Cappadocia. Türkiye leads the homepage, navigation, discovery and footer. Ten-country international discovery remains secondary. There are nine service pages plus company, business, FAQ, contact and legal review layouts.

No deployment was performed for this revision. Do not confuse the older V1/V2 Vercel demos with this code. V1 and backend were preserved. CMS, authentication, reservations and server-side inquiry delivery are unfinished/outside this completed frontend scope.

## Read in order

Use the [root operating map](../AGENTS.md) for authority and conditional reads.
Baseline: this handoff, [product vision](PRODUCT_VISION.md), [decisions](DECISIONS.md)
and the specific [task](tasks/README.md). Frontend work also reads
[design system](DESIGN_SYSTEM.md), [motion](MOTION_SYSTEM.md),
[responsive rules](RESPONSIVE_RULES.md) and [architecture](ARCHITECTURE.md).
Complete significant work with a [report](reports/README.md). The list below is a
supporting source map; V2 delivery/QA is historical evidence, not V3 sign-off.

1. `../AGENTS.md` and `../frontend-v2/AGENTS.md` — repository and framework instructions.
2. `FRONTEND_DELIVERY.md` — behavior, verification and launch boundaries.
3. `FRONTEND_IMPLEMENTATION_PLAN.md` — current V3 QA status, historical V2 phases and client steering.
4. `APPROVED_DESIGN_DIRECTION.md`, `PUBLIC_PAGE_PREVIEW_INDEX.md`, and `references/public-page-previews/` — approved visual authority.
5. `MASTER_SPECIFICATION.txt`, `API.md`, `ARCHITECTURE.md` and root `TODO.md` — broader production/backend requirements if the user requests that phase.
6. `NEW_CHAT_PROJECT_HANDOFF.md` — historical company/design context only. Its “design-only” and “generate previews next” instructions are obsolete.

## Code map

| Location in `frontend-v2/` | Responsibility |
| --- | --- |
| `app/[locale]/[[...slug]]/page.tsx` | Public route dispatch, localized titles/metadata and canonical language variants |
| `app/layout.tsx`, `proxy.ts` | Fonts, document language/direction, CSP nonce, language/legacy redirects and HTTP 404 handling |
| `lib/i18n.ts` | Locale helpers, language preference and shared translated text |
| `lib/travel-content.ts` | Nine services, ten countries, FAQ, contact details and public route inventory |
| `lib/turkiye.ts` | Twelve Turkish destination records and Türkiye-first copy |
| `components/travel/Pages.tsx` | Page composition, including country and Turkish place details |
| `components/home-v3/`, `components/experience/`, `styles/experience.css` | Current Bronze Journey homepage, scroll/3D/portal enhancement and builder; see V3 notes |
| `lib/journey.ts` | Validated ordered itinerary context for prepared-message inquiry |
| `components/travel/SiteShell.tsx` | Logo, header, modal menu, footer, locale and motion preferences |
| `components/travel/Sections.tsx` | Shared hero, services, figures, international atlas, story, partners and planner |
| `components/travel/TurkeyDiscovery.tsx` | Türkiye map/list/preview synchronization, mode switch and regional filters |
| `components/travel/Inquiry.tsx` | Validation and honest prepared WhatsApp/email handoff |
| `components/travel/Ribbon.tsx` | Static shared SVG route; homepage sculpture lives in experience/BronzeJourney |
| `components/travel/HeroVideo.tsx` | Local film, pause/play, visibility and motion/data-saver behavior |
| `styles/travel.css` | Responsive visual system and RTL/reduced-motion behavior |
| `lib/map-paths.json`, `lib/turkey-map.json` | Natural Earth geographic vector boundaries, never mirrored in RTL |
| `public/media/`, `public/media/sources.json` | Self-hosted media and third-party source/license records |
| `scripts/verify-public.mjs`, `verify-v3.mjs`, `verify-v3-resilience.mjs` | Repeatable production route, V3 matrix and failure/render-lifecycle checks |

Older journal components and original public route files remain as historical code. The proxy sends ordinary public entry URLs into the localized implementation. Do not accidentally revive the former journal as the active UI.

## Run on a fresh machine

Validation requirements are in [TESTING.md](TESTING.md) and the root operating map.
Frontend changes run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`;
record missing tests honestly. Documentation-only tasks require typecheck/lint and
consistency/diff review. The production-preview procedure below remains available.

Use Node 24 and pnpm 11.25.0. From `frontend-v2/`, run `pnpm install --frozen-lockfile`, then `pnpm dev --port 3002`. The new public pages use local typed content and do not require the backend. `.env.example` documents optional backend/media/deployment settings; do not copy credentials from another machine. `/ar`, `/en` and `/tr` are explicit locale entry points.

Validation: `pnpm typecheck`, `pnpm lint`, `pnpm build`. Browser setup if needed: `pnpm exec playwright install chromium`. Run `node scripts/verify-public.mjs` with the production preview listening on port 3003, or set `QA_URL` to its actual origin. The historical local check used `pnpm start --port 3003`; Next prints a warning because this repo retains standalone output. For actual standalone deployment, package `public` and `.next/static` alongside `.next/standalone/server.js` and launch the generated server according to the bundled Next documentation. Do not mistake a local preview server for deployment.

## Historical V2 verified baseline and limitations

Build, TypeScript, lint and production Chromium checks passed on 2 October. All 120 content routes returned 200; missing public pages returned branded HTTP 404. Checked filtering, atlas synchronization, planner context, form validation and prepared messages, language persistence, RTL, modal focus return, live WebGL/video and reduced-motion fallbacks. Six production screenshots cover widths 360–1440 px, with no document overflow or broken loaded images and no browser errors. Reports and selected screenshots are preserved in `qa/2026-10-02/`; scripts regenerate local evidence under ignored `tmp/frontend-qa/`.

No external inquiry was sent. Safari/Firefox, physical devices and field Core Web Vitals were not verified. Existing profile statistics are labeled as 2025 figures, not independently updated claims. Privacy/terms layouts explicitly await approved wording. Noindex remains enabled.

## Next work depends on the user

- For visual feedback: continue the delivered V3 in frontend-v2, preserve agreed brand/atlas/motion direction, and check relevant locales and mobile layouts.
- For launch: obtain final legal copy and factual/media sign-off; configure canonical domain, indexing and the correct deployment project. Deployment requires user authorization.
- For backend/CMS: inspect existing backend and master specification first. Do not claim the frontend handoff constitutes a working database, booking system or authenticated CMS.

## Asset and document organization

Root `Trip-Line-Page-Previews.zip` preserves the client design pack; its extracted review sheets are under `references/public-page-previews/`. `references/approved/` contains approved concept assets; `references/design-direction/` and `references/section-studies/` contain earlier exploration. `design-preview/` is an earlier design-review prototype, not the production frontend. Dated research notes are reference material, not new instructions.

The original four-page company profile PDF was reviewed at `C:/Users/mosta/Downloads/بروفايل-1.pdf`. It is outside the repository and may be unavailable to another agent. The extracted logo/partner strips and documented source observations are included; do not pretend the original PDF is available on a fresh clone. Illustrative generated PNG provenance is in `ASSETS.md`; free photo/video sources are in the media manifest.

Temporary preparation scripts, downloaded HTML, dependency folders, local environment files and build output are intentionally excluded from Git. The repository contains everything needed to run the current public frontend.
