# Trip Line frontend delivery — 2 October 2026

Historical verified V2 baseline. Current V3 source is in the same frontend-v2 workspace,
with QA in progress; see [current handoff](AI_HANDOFF.md) and
[phase status](FRONTEND_IMPLEMENTATION_PLAN.md). Results below apply to the V2 revision
checked that day, not automatically to Bronze Journey. No deployment is established.

## Implemented scope

The approved ZIP contains 14 composite sheets covering the original 29 page types. Its PNGs match the stored public-page references by SHA-256. The new frontend follows their muted teal, sand, bronze, stacked logo, environmental photography and editorial hierarchy.

The client's Türkiye focus is implemented in the homepage headline and first action, main navigation, service-world selection, default discovery atlas and footer. Twelve destination pages cover Istanbul, Trabzon, Rize & Ayder, Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova and Cappadocia. Destination selections carry into inquiry. The original ten-country directory remains in the secondary “Beyond Türkiye” discovery mode.

The final scope is 40 content pages plus branded 404 in English, Arabic and Turkish. Nine service pages, business, company, FAQ, contact and legal review layouts are included. Locale routes have localized metadata and hreflang. Browser language determines unprefixed entry; the user's explicit choice persists and preserves query context. Geography is never mirrored in RTL.

## Motion and interaction

- Actual Three.js metallic bronze ribbon, scroll-driven camera and object rotation, lazy initialization, capped pixel ratio and event-driven rendering. SVG fallback for reduced motion or WebGL failure.
- Local Istanbul ferry film with pause/play, intersection/visibility pausing, reduced-motion and data-saver poster fallback.
- Hero parallax, section reveals, count-up figures, destination photo transitions and hover responses.
- Synchronized numbered geographic pins and destination list, a single active preview, regional and service filters, native accessible disclosures and modal menu.
- Working planning selectors and validated contextual inquiry. A prepared message opens WhatsApp or email; nothing is silently submitted. Form edits invalidate the previous prepared message. External messages were not sent during verification.

## Verification completed

`pnpm build` and TypeScript passed. ESLint passed. Reproducible production browser check: `node scripts/verify-public.mjs` (defaults to port 3003; override `QA_URL`).

- All 120 localized content routes returned 200, with language attributes and main heading.
- Unknown public URLs return branded 404 with HTTP 404; unprefixed browser-language redirect checked.
- Live WebGL canvas and successful local video decoding; film pause/resume and hero scroll response.
- Türkiye atlas selection, international mode, regional filtering and inquiry handoff.
- Invalid form focus, valid prepared destination message and removal of stale result after editing.
- Language switching preserves inquiry context, cookie preference persists, Arabic uses RTL.
- Menu closes on Escape and returns focus to the trigger.
- Device and explicit reduced motion produce static ribbon and suppress automatic video loading.
- Production screenshots at 360, 390, 430, 768, 1280 and 1440 pixels: no document horizontal overflow or broken loaded images; one main heading per screen.
- Production browser error log empty.

Evidence: `tmp/frontend-qa/production-check.json`, `tmp/frontend-qa/visual-check.json` and PNG screenshots in the same directory. Chromium was verified; physical devices, Safari/Firefox and field performance data are not claimed.

## Assets

The actual source logo and fourteen partner logos are extracted from the supplied company profile. Metric claims are labeled as figures from the 2025 profile. Photo and video source URLs and license notes are in `frontend-v2/public/media/sources.json`. Geographic boundaries use public-domain Natural Earth data. Istanbul, Cappadocia and generic coast PNGs are retained illustrative generated assets, documented in `ASSETS.md` and the earlier V2 README. Regional JPGs and international country JPGs use verified free Unsplash photographs. The Istanbul video uses the Mixkit Stock Video Free License.

## Run and handoff

From `frontend-v2`: `pnpm install`, then `pnpm dev --port 3002` for local development. Production build: `pnpm build`. Set `NEXT_PUBLIC_SITE_URL` to the approved canonical domain before publication. The existing standalone output convention is retained; standalone deployment must include `public` and `.next/static` beside the generated server as required by Next.js.

V1 and the backend were not changed. No deployment was performed. Old public entry URLs redirect into the localized frontend. The previous deployment URLs in the older README do not contain this implementation.

## Inputs still required for publication

Approved legal wording, confirmation that profile claims and partner relationships are current, and final media sign-off. Legal pages clearly display their review status; they are not presented as approved policies. Search indexing remains disabled. Server-side inquiry delivery, accounts, reservations, CMS and deployment are outside this frontend task. The WhatsApp/email handoff is functional without them.
