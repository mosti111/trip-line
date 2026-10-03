# Trip Line — active public frontend

**Current local implementation (3 October 2026):** active Türkiye-first public frontend;
40 content pages, twelve Turkish destinations, nine services, EN/AR/TR and Arabic RTL.
V2 [delivery evidence](../docs/FRONTEND_DELIVERY.md) is historical;
V3 [Bronze Journey](../docs/V3_BRONZE_JOURNEY.md) is implemented with QA in progress.
See [phase status](../docs/FRONTEND_IMPLEMENTATION_PLAN.md), [agent map](../AGENTS.md)
and [documentation index](../docs/README.md). Current deployment is not established.

Use Node 24 and pnpm 11.25.0: `pnpm install --frozen-lockfile`, then
`pnpm dev --port 3002`; open /en, /ar or /tr. Current typed public content does not
require backend or TRIPLINE_DEMO. Optional environment settings are in .env.example;
keep secrets out of Git. Read [verification](../docs/TESTING.md) for commands and evidence.

The following notes document the **earlier journal demo**, not the current local implementation.

Public demo: https://trip-line-journal-v2.vercel.app

Independent frontend copy for The Living Travel Journal. The original frontend directory and https://trip-line-demo.vercel.app remain unchanged. Vercel project: trip-line-journal-v2. Never link this folder to trip-line-demo.

## Historical journal local preview

Use Node 24 and pnpm 11.25.0. Install with `pnpm install --frozen-lockfile`, set `TRIPLINE_DEMO=true` in .env.local, and run `pnpm dev --port 3002`. The current local preview runs on http://127.0.0.1:3002.

## Implemented

- Separate redesign for Home, About, Services, three service details, Journeys, three destination details and Contact.
- City/Sky/Sea hero with coordinated image, caption and link changes, decorative scroll-drawn SVG flight path and subtle pointer depth.
- Spring-animated postcard browsing using arrows, destination selectors, touch swipes or optional mouse drags.
- Browser-local journal with validated destination IDs, save/remove/clear, reload persistence and prefilled removable inquiry interests. No account or booking implication.
- Service accordions, selectable schematic atlas, photo-preview navigation, contact postcard and responsive page layouts.
- Native modal dialogs, keyboard focus, visible interaction states and System/Full/Reduced motion options. System is the default. Reduced motion keeps all content visible.
- Design demo explicitly labeled; contact validates sample inputs only. No message is sent or stored. Images and service copy are illustrative.

## Verification — September 27, 2026

- Production build, strict TypeScript and ESLint passed. Final remote deployment READY: dpl_DLu3qxDJHA9d6xjBev5HqVvz7yNt.
- Anonymous HTTP requests to both public aliases returned 200.
- Original alias inspected: it still points to dpl_8ac6FPKkCbYxEar374dTFbeyTnrw, the previous demo deployment.
- Desktop homepage reviewed at 1280px; mobile homepage, postcard gallery and contact reviewed at 390px. Services, service detail, About and Journeys/atlas checked at 360px. No document horizontal overflow in those checks.
- Hero destination selection, postcard arrows, journal save/open, journal-to-inquiry navigation, menu open/close/navigation, service accordion and detail link, map selection tested in connected Chromium.
- Contact invalid input focuses the first invalid field; valid sample input shows the non-sending confirmation. Saved interests carried into the form.
- Production browser journal save, reload persistence and clear tested; final production browser error log empty. Initial Vercel error-log query returned no logs.
- Both system reduced-motion state and explicit Full choice exercised. A full animation/performance audit, physical touch-device testing, Safari/Firefox and field Core Web Vitals remain unverified. Mouse-drag behavior is implemented but was not independently exercised during browser checks.

## Boundaries

This is a working frontend demo, not the complete backend/CMS. Content remains isolated sample data. The aircraft is an SVG illustration, not a new 3D scene; shared-image route transitions are not implemented. Browser-local journal entries persist, but personal form fields do not. Local storage failure falls back to in-memory journal state.

## New image provenance

public/images/coast.png generated with the built-in image-generation tool for this version; retained original at C:/Users/mosta/.codex/generated_images/01a0dfc5-4c97-7862-9860-e6a6c254049a/exec-fa9d6bbc-0a14-460f-8c2c-221dfebd5b62.png.

Prompt: Create a cinematic premium editorial travel photograph, landscape 3:2 composition: bird's-eye oblique aerial view of a spectacular turquoise cove on the Turkish Mediterranean coast, rugged forested limestone peninsula curling into vividly clear teal water, one small elegant white sailboat near the center-right, sunlit rocky shore and pine trees, late-afternoon warm sunlight, richly detailed realistic natural texture, refined color grading with deep teal shadows and warm ivory rock. Dominant water negative space on right half, coastline diagonal from upper left to lower center. Photoreal travel-magazine photography, calm and aspirational, no text, no typography, no logo, no border, no people closeup. This is a website hero image, not a website mockup.

Other images are copied from the original demo; their provenance remains in ../docs/ASSETS.md. No third-party reference site assets were copied.
