Current V6 adds isolated localized Motion Lab routes and scoped scene/UI controllers under components/v6. V5 routing, content, translations, planner, inquiry and native scroll remain. Existing Motion/GSAP only; cached MotionPath geometry and idle layout refresh avoid native path reads during scroll. [TL-007 delivery](reports/TL-007-v6.md) records verified scope; no backend/deployment change.

Current V5 homepage architecture: native scroll, server-visible localized content, thin SVG FlightTrace, finite CSS entrance, scoped GSAP decorative strokes and Motion interaction/layout. Old homepage Lenis/pin/sculpture modules are inactive historical recovery source. Stack/API/inquiry/publication boundaries stay unchanged. [TL-006 delivery](reports/TL-006-v5.md).

# Architecture

Updated 3 October 2026. Current source and target production architecture are separate.
Read [handoff](AI_HANDOFF.md) for status and [decisions](DECISIONS.md) for authority.

## Current architecture

`frontend-v2/` is the active Next App Router frontend. V2 has dated delivery evidence;
V3 Bronze Journey has a [TL-001 delivery baseline](V3_FRONTEND_DELIVERY.md), with
explicit browser/test limitations. V1 `frontend/` is preserved.

| Boundary | Actual responsibility |
| --- | --- |
| `app/[locale]/[[...slug]]/page.tsx` | Server route dispatch, content allowlist, localized metadata/canonical/hreflang, query context |
| `app/layout.tsx`, `proxy.ts` | Server layout/fonts, locale/direction headers, CSP nonce, preference/legacy redirects and unknown-route handling |
| `lib/i18n.ts`, `travel-content.ts`, `turkiye.ts` | Typed local EN/AR/TR text, nine services, ten-country directory, twelve Turkish places and 40-path public inventory |
| `components/travel/Pages.tsx` | Server page composition; homepage delegates to HomeJourney |
| `components/travel/SiteShell.tsx` | Client shell/context, menu, preferences and navigation; inspect actual client boundaries before extending |
| `components/travel/` | Client interaction islands for atlas, selectors, inquiry, film and ribbon; shared editorial sections |
| `components/home-v3/`, `components/experience/` | Reconstructed homepage, interactive worlds/planner, place-detail chapters, scroll choreography, portals and lazy client 3D |
| `styles/travel.css`, `experience.css` | Active brand tokens, responsive/RTL and V3 composition; older journal CSS is historical |
| `public/media/`, `sources.json` | Self-hosted photos/film, provenance and source notes |
| `scripts/verify-public.mjs`, `verify-v3.mjs`, `verify-v3-resilience.mjs` | Production browser checks; generated evidence under ignored root `tmp/frontend-qa/` |

Server Components dispatch and compose content; client islands own state and enhancement.
Do not assume the desired future server/client split is already implemented everywhere.
Public localized content uses local modules without backend requests. Older journal/API
helpers and preview routes survive; they do not prove a working authenticated CMS.
The loading boundary is scoped to historical `(public)` routes; localized main content
renders directly without depending on client JS to reveal a streamed hidden segment.
Locale routes are explicit /en, /ar, /tr, with English fallback, remembered selection
and RTL Arabic; geography keeps its orientation. See [responsive rules](RESPONSIVE_RULES.md).

Inquiry validates client-side and prepares WhatsApp/email links. JourneyBuilder uses a
GET context handoff (known/deduplicated destinations, ordered itinerary, dates/travelers);
it is not booking, storage, payment or backend submission.
Homepage motion uses existing GSAP/ScrollTrigger/Lenis, Motion and lazy demand-rendered
R3F, with SVG fallback. Follow [motion rules](MOTION_SYSTEM.md) and
[V3 architecture](V3_BRONZE_JOURNEY.md) for visibility, cleanup and eligibility.

### Manifest versions at inspection

Source: `frontend-v2/package.json`, 3 October 2026. These are manifest pins/ranges,
not a claim that every range resolves to its minimum or that versions are globally latest.
Node 24.x; pnpm 11.25.0.

| Package | Manifest |
| --- | --- |
| Next / eslint-config-next | 16.3.6 |
| React / React DOM | 19.3.0 |
| TypeScript | ^5.9.2 |
| Motion | 13.4.4 |
| Three.js | ^0.180.0 |
| React Three Fiber / Drei | 9.8.1 / 10.7.9 |
| GSAP / Lenis | ^3.15.0 / ^1.3.26 |
| TanStack Query | ^5.90.0 |
| React Hook Form / resolvers | ^7.62.0 / ^5.2.0 |
| Zod | ^4.1.0 |
| Tailwind / Tailwind PostCSS | ^4.1.13 / ^4.1.13 |
| Vitest / Playwright test | ^3.2.4 / ^1.55.0 |

Preserve dependencies unless a task authorizes a justified change. Use the lockfile for
resolved versions and bundled Next documentation before framework changes.

## Target production platform — unfinished

The sections below preserve the broader production plan. Backend source and Flyway files
exist, but PostgreSQL/runtime integration, authenticated CMS and operational acceptance
remain unverified/unfinished. They do not describe the active public inquiry implementation.

### System

Use a monorepo with `frontend`, `backend`, `infra`, `docs`, and `.github/workflows`. Frontend is Next.js App Router with strict TypeScript and primarily Server Components. Backend is a Java 21 Spring Boot modular monolith. PostgreSQL holds content, identity, JDBC sessions, audit events, and contact submissions. Cloudflare R2 holds media binaries. Cloudflare Turnstile protects contact submission. Separate Coolify resources host frontend, backend, and database.

The requested Spring Boot 4.1.x and React 19.3+ stable availability and mutual compatibility must be verified against official sources before pinning dependencies. Use Spring dependency management and lock frontend dependencies; do not silently substitute prereleases or change the requested stack.

### Backend ownership

Under `com.tripline.platform`, modules are `auth`, `users`, `content`, `services`, `media`, `contacts`, `settings`, and `audit`. Each owns its domain, repositories, application services, and controllers. `shared` contains only narrowly scoped infrastructure contracts and configuration. Cross-module work goes through explicit interfaces or domain events, never another module's repository. Spring Modulith verification enforces boundaries. Keep audit writes in the same transaction as successful business mutations where practical.

### Target frontend boundaries

Server Components own public page shells, content fetches, metadata, static navigation structure, and footer. Client islands own menus, forms, motion, hover previews, 3D, and admin interaction. Admin server state uses TanStack Query; forms use React Hook Form and Zod. Use TanStack Table where tabular behavior warrants it and restricted TipTap only for formatted long text.

### Target routing and sessions

Prefer same-origin `/api/v1` reverse proxy routing to Spring, with an internal backend URL for server fetches. This keeps browser session and CSRF behavior straightforward. Forward authenticated cookies only for explicit admin/preview requests. Public cached fetches never include session credentials. If an API subdomain is selected at deployment, document and test its explicit CORS, credentials, and cookie configuration.

### Target publishing and concurrency

Maintain separate draft and published snapshots, including visibility, ordering, localization, relations, and SEO. Check optimistic versions on edits and publication; conflicts return 409. Publish a complete aggregate in one database transaction. Public reads use published snapshots exclusively. Preview uses no-store authenticated reads. Use a short public cache window and authenticated targeted invalidation after publishing; invalidation failure must not roll back committed content or leave content stale indefinitely.

### Historical aircraft enhancement proposal

JourneyLine is reusable SVG. Hero aircraft is a dynamically imported R3F enhancement with static fallback, bounded DPR, demand rendering, reduced motion, and graceful WebGL failure. Only use supported stable transition APIs. Core content and navigation remain functional without these enhancements.

This aircraft direction is historical; current public identity uses the bronze ribbon.
Retain its fallback/performance principles without replacing the approved active sculpture.
