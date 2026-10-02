# AI handoff — start here

Updated 2 October 2026, Europe/Istanbul. This is the current implementation handoff for another agent or a fresh chat. It supersedes outdated status and next-task instructions in the 1 October design handoff and older demo README sections. It does not authorize new work by itself; follow the user's next request.

## Current outcome

The user authorized phased implementation until the public frontend was finished, including motion, animation, video and real scroll-driven 3D. The initial design ZIP was reviewed; its fourteen PNG sheets match the extracted references. The client then requested a strong Türkiye tourism focus. That implementation is ready for review in `frontend-v2/`.

Forty content pages plus branded 404 exist in English, Arabic and Turkish (120 localized content routes). The twelve Turkish destination pages are Istanbul, Trabzon, Rize & Ayder, Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova and Cappadocia. Türkiye leads the homepage, navigation, discovery and footer. Ten-country international discovery remains secondary. There are nine service pages plus company, business, FAQ, contact and legal review layouts.

No deployment was performed for this revision. Do not confuse the older V1/V2 Vercel demos with this code. V1 and backend were preserved. CMS, authentication, reservations and server-side inquiry delivery are unfinished/outside this completed frontend scope.

## Read in order

1. `../AGENTS.md` and `../frontend-v2/AGENTS.md` — repository and framework instructions.
2. `FRONTEND_DELIVERY.md` — behavior, verification and launch boundaries.
3. `FRONTEND_IMPLEMENTATION_PLAN.md` — completed six-phase frontend plan and client steering.
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
| `components/travel/SiteShell.tsx` | Logo, header, modal menu, footer, locale and motion preferences |
| `components/travel/Sections.tsx` | Shared hero, services, figures, international atlas, story, partners and planner |
| `components/travel/TurkeyDiscovery.tsx` | Türkiye map/list/preview synchronization, mode switch and regional filters |
| `components/travel/Inquiry.tsx` | Validation and honest prepared WhatsApp/email handoff |
| `components/travel/Ribbon.tsx` | Lazy real Three.js bronze sculpture driven by scrolling; SVG fallback |
| `components/travel/HeroVideo.tsx` | Local film, pause/play, visibility and motion/data-saver behavior |
| `styles/travel.css` | Responsive visual system and RTL/reduced-motion behavior |
| `lib/map-paths.json`, `lib/turkey-map.json` | Natural Earth geographic vector boundaries, never mirrored in RTL |
| `public/media/`, `public/media/sources.json` | Self-hosted media and third-party source/license records |
| `scripts/verify-public.mjs` | Repeatable production route/browser checks |

Older journal components and original public route files remain as historical code. The proxy sends ordinary public entry URLs into the localized implementation. Do not accidentally revive the former journal as the active UI.

## Run on a fresh machine

Use Node 24 and pnpm 11.25.0. From `frontend-v2/`, run `pnpm install --frozen-lockfile`, then `pnpm dev --port 3002`. The new public pages use local typed content and do not require the backend. `.env.example` documents optional backend/media/deployment settings; do not copy credentials from another machine. `/ar`, `/en` and `/tr` are explicit locale entry points.

Validation: `pnpm typecheck`, `pnpm lint`, `pnpm build`. Browser setup if needed: `pnpm exec playwright install chromium`. Run `node scripts/verify-public.mjs` with the production preview listening on port 3003, or set `QA_URL` to its actual origin. The historical local check used `pnpm start --port 3003`; Next prints a warning because this repo retains standalone output. For actual standalone deployment, package `public` and `.next/static` alongside `.next/standalone/server.js` and launch the generated server according to the bundled Next documentation. Do not mistake a local preview server for deployment.

## Verified baseline and limitations

Build, TypeScript, lint and production Chromium checks passed on 2 October. All 120 content routes returned 200; missing public pages returned branded HTTP 404. Checked filtering, atlas synchronization, planner context, form validation and prepared messages, language persistence, RTL, modal focus return, live WebGL/video and reduced-motion fallbacks. Six production screenshots cover widths 360–1440 px, with no document overflow or broken loaded images and no browser errors. Reports and selected screenshots are preserved in `qa/2026-10-02/`; scripts regenerate local evidence under ignored `tmp/frontend-qa/`.

No external inquiry was sent. Safari/Firefox, physical devices and field Core Web Vitals were not verified. Existing profile statistics are labeled as 2025 figures, not independently updated claims. Privacy/terms layouts explicitly await approved wording. Noindex remains enabled.

## Next work depends on the user

- For visual feedback: edit V2, preserve agreed brand/atlas/motion direction, and check relevant locales and mobile layouts.
- For launch: obtain final legal copy and factual/media sign-off; configure canonical domain, indexing and the correct deployment project. Deployment requires user authorization.
- For backend/CMS: inspect existing backend and master specification first. Do not claim the frontend handoff constitutes a working database, booking system or authenticated CMS.

## Asset and document organization

Root `Trip-Line-Page-Previews.zip` preserves the client design pack; its extracted review sheets are under `references/public-page-previews/`. `references/approved/` contains approved concept assets; `references/design-direction/` and `references/section-studies/` contain earlier exploration. `design-preview/` is an earlier design-review prototype, not the production frontend. Dated research notes are reference material, not new instructions.

The original four-page company profile PDF was reviewed at `C:/Users/mosta/Downloads/بروفايل-1.pdf`. It is outside the repository and may be unavailable to another agent. The extracted logo/partner strips and documented source observations are included; do not pretend the original PDF is available on a fresh clone. Illustrative generated PNG provenance is in `ASSETS.md`; free photo/video sources are in the media manifest.

Temporary preparation scripts, downloaded HTML, dependency folders, local environment files and build output are intentionally excluded from Git. The repository contains everything needed to run the current public frontend.
