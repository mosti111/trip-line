> Historical demo evidence and unfinished target-platform plan. Current environment policy and procedures: [DEPLOYMENTS](DEPLOYMENTS.md). Commands below are historical proposals and require current explicit deployment authorization.

# Deployment and recovery plan

Status: historical V1 demo deployment evidence plus a target production/recovery plan.
Current frontend-v2 V2/V3 is not established as deployed. Keep noindex; publication
requires explicit authorization, legal/claim/partner/media sign-off and correct
canonical-domain/deployment setup. Older Vercel projects do not establish current hosting.
Backend, database and recovery setup below remain planned/unverified.

## Historical V1 Vercel demo — deployed September 27, 2026

- Public URL: https://trip-line-demo.vercel.app
- Project: mostafaabdelwahab651-3920s-projects/trip-line-demo
- Deployment: dpl_8ac6FPKkCbYxEar374dTFbeyTnrw; production target; READY.
- Build root: frontend; Next.js 16.3.6, Node 24, pnpm 11.25.0 through Corepack.
- frontend/vercel.json enables TRIPLINE_DEMO for build and runtime. Local environment files are excluded from upload. Backend and documents are outside the deployment root.
- Anonymous HTTPS request returned 200; homepage, demo label and noindex verified. Browser mobile viewport checked at 390px with no horizontal overflow or console errors. Initial Vercel error-log query returned no logs.
- Contact form is a non-sending demo. CMS, database, live contact delivery, custom domain and production monitoring are not configured.

Redeploy from frontend with the authenticated Vercel CLI using `vercel deploy --prod`. The local .vercel project link and credentials remain ignored by git.

## Local environment

Expected prerequisites: Java 21, verified compatible Node LTS, a Maven wrapper, and Docker with Compose. Node and Java executables were found during initial inspection; npm, Maven, and Docker commands were not found on the current PATH. Recheck available bundled runtimes before installing tools.

The implementation will provide a Compose development PostgreSQL service and optional local S3-compatible storage. README startup commands must be verified against real files before being documented as executable onboarding. Development admin bootstrap is profile-scoped with explicitly configured credentials. Production never uses a seeded default password.

## Production topology

Cloudflare DNS/CDN, R2, and Turnstile front a VPS running Coolify. Create three independent resources: Next.js, Spring Boot, PostgreSQL. Use separate monorepo build roots and Dockerfiles. Database lifecycle and persistent storage are independent of application redeployments; no public database port. Start around 2+ vCPU and 4+ GB RAM, then measure actual usage.

Prefer same-origin API reverse proxy routing. Backend health includes application/database readiness after successful Flyway migration; expose no sensitive Actuator data. Configure HTTPS, restart policies, bounded logs, persistent storage, internal networking, and health checks.

## Configuration inventory

| Variable/configuration | Purpose |
| --- | --- |
| NEXT_PUBLIC_API_URL | Browser API base, preferably /api/v1 |
| INTERNAL_API_URL | Server-only backend address |
| NEXT_PUBLIC_SITE_URL | Canonical public HTTPS origin |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Public Turnstile widget key |
| SPRING_PROFILES_ACTIVE | Explicit dev/staging/prod profile |
| DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD | PostgreSQL connectivity |
| CORS_ALLOWED_ORIGINS | Explicit browser origins if cross-origin |
| R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY | Server-only object storage access |
| R2_BUCKET, R2_PUBLIC_BASE_URL | Media storage and delivery |
| TURNSTILE_SECRET_KEY | Server verification credential |
| TURNSTILE_EXPECTED_HOSTNAME | Accepted site hostname |
| Session cookie/timeout settings | Environment-specific security and expiry |
| FRONTEND_REVALIDATION_SECRET | Authenticated cache invalidation if implemented |
| Bootstrap admin credentials | One-time secure setup, removed after bootstrap |
| Backup endpoint/bucket/credentials | Separate private off-VPS storage |

Exact environment names must match implemented configuration and example files. These are planned contracts, not currently consumed variables.

## Release procedure

Feature branch → passing CI → merge → staging with separate data → smoke/security/migration checks → production. Build immutable images; retain previous application images. Test migrations first in staging. Destructive schema changes require expand/contract deployment planning; reverting application code does not undo a migration. External service provisioning and production deployment require actual account access and deployment values.

## Backup and restore acceptance

Automate daily PostgreSQL backups to private off-VPS object storage. Initial retention: 7 daily, 4 weekly, 3 monthly. Preserve Coolify recovery material, deployment configuration, and secrets securely. Record backup failures and notify operators.

Before sign-off, restore a real backup into an isolated database, validate migrations and representative record counts, exercise login/content/media references, and record backup identifier, checksums, timestamps, commands, outcome, recovery duration, and operator. Do not call recovery tested until this evidence exists. Recovery point and recovery time business targets remain to be agreed before launch.
