# Architecture — implemented V1.0 candidate

28 October 2026. Active root: `frontend-v2/`. Current source and unfinished
production platform are separate. [Historical architecture/target plan](archive/historical-material/pre-v1-consolidation/docs/ARCHITECTURE.md)
preserve earlier reasoning. Cleanup keeps the application directory and approved stack.

## Rendering and routing

Next.js 16.3.6 App Router, React/React DOM 19.3.0, strict TypeScript and Tailwind 4.
Node 24.x / pnpm 11.25.0 are manifest requirements; pnpm-lock.yaml governs installation.
The root layout loads Manrope/Noto Sans Arabic, CSS, a nonce-bearing motion bootstrap
and SiteShell. proxy.ts resolves locale/cookie/legacy redirects, sets CSP nonce/locale
headers, handles unknown public URLs and optionally gates requests with the deployment
review deadline. Preserve its media/API routing exclusions.

app/[locale]/[[...slug]]/page.tsx dispatches allowlisted public content and metadata.
components/travel/Pages.tsx composes server-visible content; client islands own controls
and enhancements. Motion Lab is separate from the 120 content URLs. Historical (public)/
preview files survive; they do not establish a working CMS. The old loading boundary
stays scoped to (public) so localized main content remains server-visible.

## Source map

| Source under frontend-v2 | Responsibility |
| --- | --- |
| lib/i18n.ts, travel-content.ts, turkiye.ts | Typed EN/AR/TR, 40-path allowlist, nine services, ten countries, twelve places |
| components/travel/SiteShell.tsx | Global travel context, shell/menu, locale and motion choice |
| components/experience/JourneyStore.tsx | Validated session journey IDs/order/type; no personal contact-data persistence |
| components/experience/JourneyDrawer.tsx, JourneyActions.tsx | Shared journey actions and button alternatives |
| components/home-v3/HomeJourney.tsx, HomeArrival.tsx, HomeEditorial.tsx | Current native-scroll homepage; historical names retained |
| components/travel/TurkeyDiscovery.tsx, components/v61/AtlasStage.tsx | Synchronized place/index/photo/map discovery and stable phone controls |
| components/v6/V6Motion.tsx, page motion controllers | Scoped GSAP scenes, cached MotionPath geometry and idle refresh |
| components/v6/TravelNetwork.tsx, components/v61/PartnerBillboard.tsx | Source-derived billboard and pause behavior |
| components/home-v3/JourneyBuilder.tsx, components/contact/ContactExperience.tsx, components/travel/Inquiry.tsx | Journey to editable WhatsApp/email inquiry |
| components/services/, turkiye/, company/, secondary/ | Internal page families and scoped motion |
| public/media/, public/brand/ | Self-hosted media, source records and identity |
| styles/travel.css, experience.css, recovery-*, v5-*, v6-*, v61-*, v1-*, v11-* | Layered implemented styles; trace actual import/cascade before edits |

Local content needs no backend. Journey context crosses to contact through validated
query parameters; ordinary navigation, keyboard and no-WebGL access remain functional.
Native scroll is current. Installed Lenis/R3F/Three and historical modules do not imply
a current global smooth scroller or mandatory homepage sculpture.

## Dependencies and integration boundaries

GSAP ^3.15 / Motion 13.4.4 own scene/UI motion. React Hook Form/resolvers, Zod and
lucide-react support forms/icons. Three ^0.180, R3F 9.8.1/Drei 10.7.9, Lenis ^1.3.26
and TanStack Query ^5.90 remain declared; some serve historical modules/platform scaffolding.
See [inventory](reports/TL-016-inventory.md) before pruning. Vitest/Playwright provide checks.
These are manifest versions/ranges, not claims about globally latest releases.

next.config.ts uses standalone output locally and provider output when VERCEL is set;
optional MEDIA_ORIGIN restricts remote images. API rewrites target INTERNAL_API_URL
unless TRIPLINE_DEMO=true. Public content needs neither API nor demo mode. Vercel config
enables that flag to suppress backend rewrites. No .github CI workflow exists at preflight.

frontend/ preserves the original demo. backend/ contains unfinished Java 21/Spring source
and migrations; database/auth/CMS/media/Turnstile/operations are not production accepted.
[Platform](PRODUCT.md), [API](API.md), [database](DATABASE.md), [security](SECURITY.md)
and [target deployment](DEPLOYMENT.md) remain conditional references.
