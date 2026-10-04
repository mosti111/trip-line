# Test and acceptance plan

Status: current frontend verification procedure plus unfinished production acceptance plan.
V2 evidence is in [delivery](FRONTEND_DELIVERY.md) and [dated QA](qa/2026-10-02/README.md);
V3's current reconstruction results are in [TL-002](reports/TL-002-report.md);
[V3 delivery](V3_FRONTEND_DELIVERY.md) preserves the prior TL-001 baseline.
Backend compilation is not PostgreSQL integration or production acceptance.

## Current public frontend procedure

From frontend-v2: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
Vitest currently has three journey boundary tests in `lib/journey.test.ts`. Browser
coverage comes from the scripts below; never claim no-tests output as a pass.
For documentation-only work, typecheck/lint plus
link/consistency/diff review suffice; test/build if application/config changes.

For public changes start a production preview (e.g. `pnpm start --port 3003`),
then `node scripts/verify-public.mjs`. Set QA_URL for another origin.
For V3 flows also run `node scripts/verify-v3.mjs`; it adds planner ordering/context,
navigation, fallback and responsive checks. Run `node scripts/verify-v3-resilience.mjs`
for real WebGL loss/restoration, initialization failure, invalid video, render-idle
sampling and live preference/route cleanup. Install Chromium if needed:
`pnpm exec playwright install chromium`.
For the reconstruction, `node scripts/verify-reconstruction.mjs` checks seven
homepage chapters at the six specified sizes in EN/TR/AR. Run
`node scripts/verify-reconstruction-media.mjs` for visible film and delayed-photo
continuity. Run resilience alone to avoid contention during idle-render sampling.
`node scripts/verify-planner-throttled.mjs` checks first-click selection, removal
and order after fresh navigation under 4× CPU throttling in EN/AR/TR.
In PowerShell: `$env:QA_URL='http://localhost:3023'`, then run the scripts.
Next standalone packaging needs public and .next/static beside its generated server;
the preview procedure is not deployment. Read bundled Next docs before changing it.

Check EN/AR/TR, natural map orientation, 360/390/430/768/1024/1280/1440px as relevant,
keyboard/menu focus, prepared-message validation/context invalidation, video controls,
WebGL failure, device/explicit reduced motion and no document overflow.
Keep raw evidence under ignored root tmp/frontend-qa/ or tmp/v3-reconstruction/;
preserve selected durable,
non-sensitive results with date/revision in docs/qa/ and link from the task report.
Record actual checks and missing browser/physical-device/performance coverage.
Do not externally send inquiry test messages.

## Backend

JUnit, Spring Boot Test, Testcontainers PostgreSQL, and Spring Modulith verification. CI must require Docker-backed integration tests rather than silently skip them. Verify fresh migrations/checksums, module boundaries, session persistence and rotation, CSRF, role restrictions, disabled-user revocation, last-super-admin protection, validation, optimistic conflicts, and audit transactions.

Publication tests must demonstrate that saving draft content, ordering, visibility, SEO, gallery references, and relations does not change public responses; publish copies the aggregate atomically; unauthenticated preview fails. Media tests cover signature mismatch, invalid images, size limits, incomplete uploads, and referenced deletion. Contact tests cover validation, duplicate requests, rate limits, and Turnstile success/failure/timeout through a stubbed external boundary.

## Frontend and end-to-end

Use React Testing Library for meaningful form and interaction behavior, and Playwright against real application services for critical workflows. Public flows: homepage/navigation, service list/detail, contact validation/submission. Admin flows: valid/invalid login, edit/save/preview/publish homepage, create/publish service, upload media, view/update message status, settings, users, and role restrictions. Include two-editor stale update behavior and session expiration without lost form input.

## Visual and accessibility QA

Compare public pages against the supplied approved concept once available. Test widths 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px. Check overflow, portrait/landscape, touch targets, keyboard/focus, menu focus management, 200% text zoom, errors, contrast, reduced motion, WebGL failure, slow connections, and essential public content with JavaScript disabled. Test modern Chromium, Firefox, and WebKit; record any remaining real-device Safari coverage separately.

## Performance and SEO

Measure representative production builds with intended imagery, fonts, motion, and 3D enhancement. Targets: mobile performance 85+, desktop 90+, accessibility/SEO/best practices 90+. Field goals at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Lab measurements do not establish field INP. Check canonical metadata, sitemap published entries, robots, structured data without invented ratings, image sizing, deferred WebGL, console errors, broken links, and no indexed previews.

## CI and launch evidence

Frontend: locked install, lint, strict typecheck, tests, production build. Backend: Maven verify including PostgreSQL integration/migration tests and packaging. Critical E2E runs against the full stack. No deployment after failed checks. Record actual results and limitations; deployment, external backups, and restore evidence are separate required gates.
