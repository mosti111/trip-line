# Trip Line implementation milestones

## Current public frontend

Updated 3 October 2026. V2's six public phases are complete with dated evidence.
V3 Bronze Journey continuation is complete in frontend-v2 with the dated
[TL-001 delivery baseline](docs/V3_FRONTEND_DELIVERY.md) and explicit test/browser limitations.
See [phase status](docs/FRONTEND_IMPLEMENTATION_PLAN.md) and [handoff](docs/AI_HANDOFF.md).
The repository operating system is recorded in [TL-SYS-001](docs/reports/TL-SYS-001-report.md).
Older unchecked public-page items below do not mean the active pages are unimplemented.

## Publication/launch requirements

- Approved legal wording and current company claim/partner confirmation.
- Final media sign-off, canonical domain and correct deployment-project setup.
- Explicit publication authorization before deployment or enabling indexing.
- Record actual deployment/operational verification; old demo URLs are historical.

## Future backend/CMS platform

Existing source/migrations are unfinished platform work. PostgreSQL/Flyway integration,
authentication/session/role verification, CMS editing/publishing, R2/Turnstile,
persisted inquiries, staging/backups/restore and full-stack acceptance remain.
Active inquiry prepares WhatsApp/email messages; no server receives them.
The original detailed milestone checklist is preserved below as target-platform history.

## Historical milestones — V1/demo and platform roadmap

Status: public-site demo implemented; production V1 remains in progress. The user requested a demo first, followed by mobile layout improvements. Finish demo delivery before resuming full CMS/operations work.

## Demo delivery

- [x] Public Home, About, Services, service details, Contact and branded not-found page.
- [x] Explicit isolated sample content; no fabricated metrics, reviews or contact details.
- [x] Phone-specific typography, image composition, service cards, menu and contact layout.
- [x] Frontend TypeScript, lint and production build checks.
- [x] Browser navigation, mobile overflow and form validation checks (see docs/DEMO_QA.md).
- [ ] Full CMS, real message sending, production deployment and operational acceptance remain outstanding.

## Prerequisite — supplied visual references

- [x] Inspect actual Trip Line logo and sample its colors.
- [x] Inspect approved visual concept.
- [x] Inspect the supplied Snami Travel URL for art-direction principles.
- [x] Read and preserve the master specification.
- [x] Draft the eight required documents and this milestone plan.

All three visual references have been inspected. Originals are preserved under docs/references. Reference statistics and business claims were intentionally excluded from the demo.

## Milestone 1 — foundation

- [x] Verify current stable dependency compatibility against official sources.
- [ ] Create monorepo applications, strict tooling, lockfiles and wrappers.
- [ ] Lock sampled design tokens and scaffold local infrastructure.
- [ ] Verify local startup and update onboarding instructions.

## Milestone 2 — persistence and identity

- [ ] PostgreSQL/Flyway, module boundaries, JDBC sessions, users and fixed roles.
- [ ] Login/logout/current user/password change, CSRF, throttling, safe bootstrap.
- [ ] Pass identity, role, migration, and module verification tests.

## Milestone 3 — domain APIs

- [ ] Typed localized CMS drafts, previews, atomic publication and concurrency.
- [ ] Services/categories/relations, settings/navigation, validated R2 media lifecycle.
- [ ] Turnstile contact submission, idempotency, inbox and transactional audit.
- [ ] Verify public draft isolation, upload validation and role enforcement.

## Milestone 4 — frontend foundation

- [ ] Design tokens, fonts, custom public components, navigation/mobile menu/footer.
- [ ] Server content fetching, admin API client, CSRF/session integration.
- [ ] Responsive, keyboard-accessible base layouts.

## Milestone 5 — public pages

- [ ] Home narrative, About, service index/detail, Contact and optional sections.
- [ ] CMS-driven business content with explicit development placeholders only.
- [ ] Contact validation, durable submission and accessible result states.

## Milestone 6 — motion and dimension

- [ ] JourneyLine variants and scroll behavior, image reveals, restrained interactions.
- [ ] Lazy aircraft enhancement, static/mobile/WebGL fallback, reduced motion.
- [ ] Selective supported transitions and measured bundle/image optimization.

## Milestone 7 — administration

- [ ] Login/dashboard, structured page editing/save/preview/publish.
- [ ] Services, media picker/library/upload/reference protection, inbox.
- [ ] Global settings/SEO, users/roles, password changes and audit views.
- [ ] Loading/empty/error states, preserved edits and destructive confirmations.

## Milestone 8 — quality

- [ ] Backend integration tests, frontend interaction tests, critical full-stack E2E.
- [ ] Security, responsive, accessibility, browser and performance checks.
- [ ] Dynamic metadata, sitemap/robots, branded errors and no draft leakage.

## Milestone 9 — staging

- [ ] Dockerfiles, CI, separate Coolify resources and environment configurations.
- [ ] Cloudflare DNS/HTTPS, real R2/Turnstile integration, private persistent DB.
- [ ] Staging migration and operational smoke checks.

## Milestone 10 — launch readiness

- [ ] Production configuration and validation with approved business content/assets.
- [ ] Daily private off-VPS backups and tested retention.
- [ ] Document a successful isolated restore and measured recovery.
- [ ] Synchronize documentation and close every section-79 acceptance item.

## External inputs needed by launch

Later milestones need approved company/contact/service content, final imagery, production domain, VPS/Coolify access, Cloudflare/R2/Turnstile configuration, deployment secrets, and backup storage. Never commit credentials to this checklist.

## Backend resume notes and historical V1 contact boundary

The public frontend runs independently of the unfinished backend. Backend source includes
auth/users, content/services, settings, media, contacts and audit with Flyway migrations;
compilation is not runtime verification. No PostgreSQL, Testcontainers, R2 or Turnstile
integration is established. ADMIN UI is unfinished. Historical V1 ContactForm validates
demo input only; active V2/V3 Inquiry prepares WhatsApp/email without server delivery.

Before backend sign-off: add PostgreSQL tests, Modulith boundary checks, consistent trace IDs and optimistic-lock errors; review media reference/deletion consistency and object-storage failure recovery; add AVIF decoding support or explicitly resolve format scope; finish category/navigation/settings controls and draft previews. Do not infer completion from existing class names or planned documentation.
