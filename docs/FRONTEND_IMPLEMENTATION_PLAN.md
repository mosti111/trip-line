# Trip Line frontend implementation

Authorized 2 October 2026: plan the work in phases and continue until the frontend is finished.

## Current reconstruction — 3 October 2026

[TL-002](tasks/TL-002-bronze-reconstruction.md) supersedes the earlier V3 composition
for the current task. Phases A–G have phone/desktop captures; H–K are undergoing
production, responsive/RTL and resilience verification. See the task's full source
instructions for visual acceptance; build success alone is insufficient.

## Scope and authority

Implement the approved 29-page public design set in `frontend-v2`, using the existing Next.js/React/Motion/Three stack. Preserve V1 and the backend. `APPROVED_DESIGN_DIRECTION.md` and `PUBLIC_PAGE_PREVIEW_INDEX.md` supersede the older exploratory handoff. Accounts, reservations, CMS/backend implementation and deployment are separate phases outside this frontend task.

## Phases

1. **Foundation and assets** — inspect the existing V2 and approved sheets; establish faithful logo, brand tokens, geographic vectors, media provenance and typed English/Arabic/Turkish content.
2. **Shared experience and homepage** — responsive header/menu/footer, language selection and persistence, approved hero, service worlds, numbers, atlas, story, process, partners and inquiry invitation.
3. **Complete public sitemap** — nine services, atlas and ten countries, business, about, contact, FAQ, privacy/terms layouts, branded 404. Preserve old entry links with redirects.
4. **Interactions and motion** — contextual inquiry with validation and honest WhatsApp/email handoff, service filtering, synchronized atlas, accessible disclosures/menu, bronze 3D route, reduced-motion/static fallbacks.
5. **Localization and responsive refinement** — complete translated content, preferred-browser language with English fallback, manual persistence, Arabic RTL without mirrored geography, small phones/tablet/desktop.
6. **Verification and delivery** — type/lint/build, route and browser interaction checks, keyboard/reduced-motion/RTL/overflow, visual review against approved sheets, asset and integration handoff.

## Completion criteria

- All 40 content pages and branded 404 render, with working internal links and contextual inquiry, in three languages.
- Approved teal/sand/bronze composition, actual stacked logo and ten-country atlas are retained.
- Every service/country has specific content rather than invented packages or inventory.
- Inquiry clearly opens a prepared message; no false claim that a backend received it.
- Mobile and keyboard use work, language survives navigation, reduced motion is respected.
- Build and checks pass; any externally dependent launch inputs are documented precisely.

## Status

### Repository operating system — TL-SYS-001 (3 October 2026)

Documentation-only operating map, authority/decisions, product/design/motion/responsive
rules and task/report workflow established. See [system task](tasks/TL-SYS-001-agent-operating-system.md)
and [report](reports/TL-SYS-001-report.md). This does not complete V3 QA or authorize deployment.

### V3 — The Bronze Journey (authorized 2 October 2026)

- Baseline: complete; frozen install/type/lint/build and repeated production browser verification passed. Feature branch `feat/v3-bronze-journey` protects the baseline.
- Motion foundation, hero/departure, service worlds, proof, atlas, destination portals, film/services route and journey builder: complete within the authorized V3 scope.
- Shared compositions, responsive/RTL layouts, menu and fallback stabilization: complete under TL-001 (3 October 2026).
- Engineering QA/delivery baseline: complete. Typecheck/lint/build and production Chromium public, V3 and resilience scripts passed. `pnpm test` finds no tests (exit 1), not a passing suite. No physical-device/Safari/Firefox/field-performance certification or client aesthetic approval is implied. See [V3 delivery](V3_FRONTEND_DELIVERY.md), [task](tasks/TL-001-bronze-journey-continuation.md), [report](reports/TL-001-report.md) and [evidence](qa/2026-10-03-v3/README.md). No deployment occurred.

### Historical V2 completion

- Phase 1: complete — ZIP sheets verified against all 14 extracted references; source logo and partner strips recovered; local licensed media and geographic vectors documented.
- Phase 2: complete — approved shared composition and homepage, with client-directed Türkiye emphasis.
- Phase 3: complete — 40 public content pages and branded 404, including all 12 requested Turkish destinations.
- Phase 4: complete — working contextual forms, synchronized geographic atlas, filters, local Istanbul film, scroll-driven Three.js bronze sculpture, parallax and reveals.
- Phase 5: complete — English, Arabic RTL and Turkish, browser preference/cookie persistence and reduced motion.
- Phase 6: complete — production build, TypeScript and lint; 120 localized routes; browser interaction and responsive checks. Evidence and launch boundaries: `FRONTEND_DELIVERY.md`.

## Client steering — Türkiye first

During implementation, the client requested a stronger focus on tourism in Türkiye, specifically Istanbul, Trabzon, Rize & Ayder, Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova and Cappadocia. Expand the public frontend with twelve destination detail pages. Make Türkiye discovery the default atlas/home/tours experience; retain the ten-country international scope as a secondary discovery mode. Preserve the approved visual and motion direction. New public page coverage: 40 content pages plus branded 404, in three languages.

## External launch inputs

Final policy text, current company claim/partner approval, final media sign-off and any server-side inquiry delivery are external to frontend completion. Implement source-based content and usable contact handoffs; retain review/noindex defaults until launch approval.
