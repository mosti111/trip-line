# Public demo verification

> Historical/reference record. Read [current handoff](AI_HANDOFF.md) and
> [accepted decisions](DECISIONS.md) first. Older status, exploration and next-step
> instructions below do not override the active frontend, Türkiye-first steering
> or Bronze Journey continuation. Preserve source reasoning; this is not current QA sign-off.

Scope: local Next.js public-site demo. The user requested this before the complete production product, then specifically requested a better mobile layout.

## Verified

- Frontend production build, strict TypeScript and ESLint complete successfully.
- Home, About, Services, and private-transfer detail render and navigate in the browser.
- Contact validation shows inline errors and focuses the first invalid input.
- Valid sample contact input reports that no message was sent or stored.
- Native mobile menu opens, constrains focus through the dialog, and closes on navigation.
- Home, About, Services and private-transfer detail have no document-level horizontal overflow at 360, 390 and 430px in the connected Chromium browser.
- Contact has no horizontal overflow at 360, 375, 390 and 430px; input/select heights measure 54px.
- Browser screenshots inspected for home hero, philosophy, mobile service cards, private-transfer detail and contact error state.
- No browser console errors reported during these checks.
- Production standalone build served on a temporary local port; contact validation remained interactive under the nonce-based CSP, with no console errors.
- Desktop homepage checked again at 1440px after phone changes, with no horizontal overflow.
- Small-phone About and Services headlines checked for clipping at 360px; none found.
- Reduced-motion preference was active in the connected preview; public content remained visible.

## Vercel deployment check — September 27, 2026

https://trip-line-demo.vercel.app is READY on the production target. Remote build and TypeScript passed. An unauthenticated request returned HTTP 200 with Trip Line content and noindex. The live homepage rendered at 390px without horizontal overflow; browser console contained no errors. Initial Vercel error-log query returned no logs.

## Limits

This is not a cross-browser or real-device certification. Safari/Firefox, physical phones, screen readers, 200% zoom, automated accessibility scores and Lighthouse/Core Web Vitals remain unverified. Backend compilation is separate from integration testing. CMS, uploads, authenticated draft preview and real contact submission are not part of the demo acceptance.

## Running preview

The local demo uses frontend/.env.local with TRIPLINE_DEMO=true. Main preview is http://127.0.0.1:3000. If the preview stops, run pnpm dev inside frontend. The badge, robots/noindex metadata, isolated sample content and non-sending form remain enabled in demo mode.
