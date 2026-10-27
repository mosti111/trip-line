# Trip Line — technical and design handoff

Latest motion-policy work: [TL-014](docs/reports/TL-014-full-motion-default.md),
27 October 2026. Full is now the unsaved default, including with OS reduction;
saved System/Reduced choices remain authoritative. See that report for fresh
verification and the isolated review deployment receipt. TL-013 below records
the preceding synchronization audit, not the new application change.

Audited 27 October 2026 (Europe/Istanbul), task [TL-013](docs/tasks/TL-013-github-sync-handoff.md).
This is a synchronization and documentation audit; application code and deployments
were not changed. Start here, then read [AGENTS.md](AGENTS.md), the newest entries
in [AI_HANDOFF](docs/AI_HANDOFF.md) and the relevant task/report. Older dated entries
in those documents preserve history and may describe superseded implementations.

## Repository and completion status

- Repository: https://github.com/mosti111/trip-line
- Active branch: `codex/trip-line-v11-mobile-recovery`.
- Pre-audit HEAD: `c55863de2ddc3b3f7720d7f041d1252170cfcfca`.
- Latest reviewed application source: `98c44f8d05792f97c7324ce5dcbf12f73e4e8535`.
  Later commits before this audit document deployment/access verification.
- Initial fetch found active local/remote HEADs equal, with no modified, added,
  deleted or untracked nonignored files. No application work was stranded locally.
- V1.1 is engineering verified within the recorded browser envelope and delivered
  for client review. Client creative acceptance is pending. This is a travel
  discovery/inquiry frontend, not a completed booking or CMS platform.
- Feature history is intentionally separate from `main`; this task does not merge,
  reset, force push, deploy or change production. Use the active branch for review.

## Architecture, stack and directory map

`frontend-v2/` is the active Next.js App Router application. Server-rendered route
dispatch and typed local content compose pages; client islands own menus,
selection, journey state, inquiry and motion. The public experience runs without
the backend. Existing API/admin-preview helpers do not establish operational CMS.

Manifest versions: Next.js/eslint-config-next 16.3.6, React/React DOM 19.3.0,
TypeScript ^5.9.2, Tailwind/PostCSS ^4.1.13, Motion 13.4.4, GSAP ^3.15.0,
Lenis ^1.3.26, Three.js ^0.180.0, R3F 9.8.1, Drei 10.7.9,
React Hook Form ^7.62.0, Zod ^4.1.0, TanStack Query ^5.90.0,
Vitest ^3.2.4 and Playwright ^1.55.0. These are manifest declarations, not claims
of latest releases. Node 24.x and pnpm 11.25.0 are declared; lockfiles govern installs.

| Directory/file | Responsibility |
| --- | --- |
| `frontend-v2/app/[locale]/[[...slug]]/page.tsx` | Localized public route dispatch, metadata and query context |
| `frontend-v2/app/[locale]/motion-lab/` | Isolated localized motion demonstration routes |
| `frontend-v2/app/layout.tsx`, `proxy.ts` | Fonts, locale/direction, redirects, CSP and optional review-expiry gate |
| `frontend-v2/lib/{i18n,travel-content,turkiye,company-profile}.ts` | Translations, route inventory and source-based content |
| `frontend-v2/lib/{journey,motion-preference,review-window}.ts` | Validated journey context, explicit motion resolution and expiry logic |
| `frontend-v2/components/home-v3/` | Current homepage composition, arrival, editorial scenes, services, signatures and builder; directory name is historical |
| `frontend-v2/components/v6/` | Scoped scene motion, photographic network/Atlas, billboard, transitions, carousel and Motion Lab |
| `frontend-v2/components/travel/` | Shell, route composition, Türkiye discovery, inquiry, video and reusable sections |
| `frontend-v2/components/{turkiye,services,company,contact,secondary,experience}/` | Dedicated page families and interaction islands |
| `frontend-v2/styles/` | Layered shared, recovery, V6 and V6.1 styles; inspect imports before editing |
| `frontend-v2/public/media/` | Self-hosted film/photos/logo derivatives and source provenance |
| `frontend-v2/scripts/`, `lib/*.test.ts` | Production-browser verification, capture/evidence helpers and unit tests |
| `frontend/` | Preserved historical frontend; not the active public implementation |
| `backend/` | Incomplete Java 21/Spring Boot modular platform source and Flyway migrations |
| `docs/tasks/`, `reports/`, `qa/`, `orchestration/` | Authority, dated deliveries, durable QA and historical/current state |
| `docs/references/`, root preview ZIP | Source/design references, not runtime routes |
| `tmp/`, `.tools/`, `.agents/`, `.codex/` | Ignored local evidence, tooling or advisory skills; unavailable on a fresh clone |

Backend `pom.xml` declares Spring Boot 4.1.1, Spring Modulith 2.1.1, JPA,
Security, JDBC sessions, PostgreSQL/Flyway, S3 and test dependencies. Source and
configuration exist; database operations, authenticated CMS, media storage,
Turnstile submission and production acceptance remain unfinished/unverified.
No backend build/runtime claim is made by this audit.

## Implemented routes and working behavior

The `publicPaths` inventory contains 40 content paths per locale (120 localized
content URLs), plus localized Motion Lab and branded missing-page handling:

- `/en`, `/ar`, `/tr`: cinematic Türkiye-first homepage.
- `/{locale}/services` and nine `services/{slug}` details, including dedicated
  Hajj/Umrah presentation; `/{locale}/business` for corporate/group needs.
- `/{locale}/destinations` and ten country entries: Türkiye, Georgia, Egypt,
  Saudi Arabia, Oman, Qatar, UAE, Maldives, Malaysia and Indonesia.
- Twelve `destinations/turkiye/{slug}` pages: Istanbul, Trabzon, Rize & Ayder,
  Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova and Cappadocia.
- `about`, `contact`, `faq`, `privacy`, `terms`; legal pages retain review qualifiers.
- Locale/legacy redirects and an allowlisted route resolver. Historical journal,
  preview and route-group files survive; they are not additional proof of active
  CMS capabilities or the intended current public design.

Working frontend flows include map/list/photo selection, regional discovery,
service exploration, journey selection/reordering with button alternatives,
validated context transfer to contact, language persistence, modal keyboard/focus
handling, film lifecycle controls and billboard pause. Inquiry validates and
prepares editable WhatsApp/email messages; the visitor sends through their app.
There is no server submission, inventory, reservation, payment or traveler account.
Journey persistence is validated destination/order/type context, not personal
contact-data storage. Do not interpret a prepared message as a confirmed booking.

## Desktop, tablet, mobile, localization and motion

The approved identity is the source-faithful stacked Trip Line logo,
teal/ivory/sand/bronze, Manrope/Noto Sans Arabic, geographic discovery,
photographic storytelling and thin route/Flight Trace continuity. Türkiye leads;
the international directory is secondary. No invented prices, reviews, partners
or statistics. Source-profile figures retain 2025 attribution; 12+ experience
must not be recast as company age. See [decisions](docs/DECISIONS.md),
[direction](docs/APPROVED_DESIGN_DIRECTION.md) and [assets](docs/ASSETS.md).

V5 replaced the old homepage pin/Lenis/sculpture composition with native scrolling.
V6 added scoped scene controllers; V6.1 connected the scenes, introduced the
photographic Atlas/geographic overlay and a single partner billboard. Active
`HomeJourney` imports `V6Motion`, `TravelNetwork` and V6/V6.1 CSS. GSAP/ScrollTrigger,
Motion, finite CSS and SVG traces own scoped effects. Cached MotionPath geometry
and idle refresh reduce path/layout work during scrolling. Installed Lenis/R3F
and older 3D modules remain as historical/reusable source; their presence does not
mean the current homepage uses a global smooth scroller or WebGL sculpture.

V1 polished phone/tablet behavior; V1.1 deliberately recomposed phones while
preserving desktop scenes, content and functions. Phone framing, caption space,
reachable menus and an optional map are implemented. Touch QA corrected map
overflow, changing caption geometry and camera motion that displaced hit targets.
The map frame stays stationary while decorative routes/selection animate. Tablet,
short landscape and 320px phones have recorded coverage; desktop preservation
has historical image comparisons. This audit makes no new visual-acceptance claim.

EN/AR/TR use typed local text, English fallback and remembered manual language
selection. Arabic is actual RTL; maps, photos and geographic anchors retain their
physical orientation. Context and semantic order survive locale changes.

Current motion authority is **System / Full / Reduced**, persisted under
`tripline-motion` with a prepaint bootstrap. TL-014 makes Full the default when
no valid choice is saved. System follows OS reduction; explicit
Full or Reduced overrides it. V1.1 supersedes older unconditional system/SaveData
motion suppression; SaveData remains relevant to media loading. Reduced mode
preserves readable final content and usable controls. Do not apply historical
V3 eligibility thresholds blindly to the current native-scroll implementation.

Safari evidence is Windows Playwright WebKit 26.6, not physical Safari. Recorded
WebKit interaction checks pass, but Windows WebKit font-weight rendering has a
documented caveat. Physical iPhone font metrics, dynamic browser chrome, touch
feel and real-device performance remain unverified; use the TL-011 device checklist.

## Development history after V3 / TL-003

| Checkpoint | Outcome and authoritative evidence |
| --- | --- |
| TL-003, final 21 Oct | Original 25 tasks closed with follow-up; application `6dd8a6a`, final branch checkpoint `e0d5538`. [Final delivery](docs/reports/TL-003-final-delivery-2026-10-19.md) |
| TL-004 V4 hero | Partial prototype, desktop entrance cancel/restart timing blocker; `ce166e2`. Historical failure, not a current V1.1 reproduced bug. [Report](docs/reports/TL-004-motion-v4-hero.md) |
| TL-005 V4 M01 | Navigation work preserved at `5ae07b2`, then superseded by V5; no implication all V4 milestones completed. |
| TL-006 V5, 24 Oct | Native-scroll reconstruction and Living Atlas; checkpoint `a499c50`. [Report](docs/reports/TL-006-v5.md) |
| TL-007 V6, 25 Oct | Motion Lab, scene system and engineering closure; recovery `229a7a2`. [Report](docs/reports/TL-007-v6.md) |
| TL-008 V6.1, 25 Oct | Photographic Atlas, one billboard and continuous scenes; app `ae05ab5`, checkpoint `3442a6b`. [Report](docs/reports/TL-008-v61.md) |
| TL-009 V1 mobile | Mobile/tablet polish `0a1325a`, retained V6.1 recovery. [Report](docs/reports/TL-009-v1-mobile-review.md) |
| TL-010 public review | Optional server expiry guard `1632a6b`, operational handoff `9f6cfa7`. [Report](docs/reports/TL-010-temporary-public-review.md) |
| TL-011 V1.1, 26 Oct | Phone compositions and explicit motion choice; checkpoint `5008ced`, reviewed app `98c44f8`, hosted receipt `5fc26b3`. [Report](docs/reports/TL-011-v11-mobile-recovery.md) |
| TL-012, 26 Oct | Isolated public review access, same application source; documentation `c55863d`. [Report](docs/reports/TL-012-v11-public-client-review.md) |

Recovery branches include `codex/v61-before-v1-mobile`, `codex/v1-before-v11-recovery`,
`codex/v5-before-v6` and `codex/v6-before-v6-1`. Preserve them and the failed QA
evidence; they do not grant authorization to restart old tasks.

## Deployments: recorded bindings, not live health certification

Deployment information below comes from checked-in TL-010/011/012 receipts and
reports. This audit performs no deployment or production mutation and does not
refresh hosted health. A Git push does not prove a deployment occurred.

| URL | Recorded relationship |
| --- | --- |
| https://trip-line-journal-v2.vercel.app/en | Existing V1 temporary production review, app `1632a6b`, deployment `dpl_8XqhZU1J7SobhsgiifgY4Q3QAwa5`; older than active V1.1 |
| https://trip-line-journal-v223-10lita4c5.vercel.app/en | Separate protected V1.1 Preview, app `98c44f8`, deployment `dpl_45Zj8VFbRQcHjmgp2fDQXF4Qa1tm`; historical share access is time-limited |
| https://trip-line-v11-client-review.vercel.app/en | Separate TL-012 no-login review project, same `98c44f8`, deployment `dpl_DQF8DKuSvtPMpdALsL1f37UcYrh5`; manual isolated deployment, report records no Git connection |

Both public review windows have recorded server expiry **27 October 2026,
18:22:45 Europe/Istanbul (15:22:45 UTC)**. Depending on read time, HTTP 410 is
expected rather than proof of a broken frontend. Do not reopen access, change
aliases, roll back to older public content or alter expiry under this task.
The existing expiry audit is outside this synchronization task. Noindex/legal
defaults remain. Private share links and recovery/protection data stay in ignored
`tmp/`; project/deployment IDs in reports are identifiers, not credentials.
Hobby was explicitly chosen for temporary review after disclosure; no billing
change or commercial-plan eligibility is established by this handoff.

## Verification and remaining limitations

Fresh TL-013 typecheck, lint, 41 unit tests and production build passed, as did
the 120-route public regression and full V3 regression (60 captures, 16 groups,
zero reported runtime errors). Compact JSON evidence is in
[the fresh QA index](docs/qa/2026-10-27-sync/README.md); exact scope and limitations
are recorded in [the synchronization report](docs/reports/TL-013-github-sync-handoff.md).
Do not treat the historical results below as freshly executed by this audit.

TL-011 records typecheck/lint/build and **41 unit tests** passing on its frozen
build `YcMLV8XQrru17yorEl3yd`, plus:

- 984 broad site cases; final 96 affected home/explorer configurations at
  320x740, 360x800, 375x812, 390x844, 430x932, 768x1024, 667x375 and 844x390.
- 48 WebKit home cases and localized touch flows; 24 map configurations / 288
  actual selections; 24 menu configurations.
- Public 120-route regression; V3 16 functional groups / 60 captures; nine axe
  surfaces with zero detected A/AA violations; six Atlas resilience configurations.
- Explicit motion/system combinations with SaveData; isolated native Chromium
  touch recordings with zero LongTasks in three locales. These are lab samples,
  not field FPS/Core Web Vitals or physical-device certification.

TL-012 records six fresh-cookie-free Chromium/WebKit access sessions, 33 hosted
pages, locale touch flows and seven page/media requests. Its unchanged layout
matrix was intentionally skipped; an empty cases array is not a layout pass.
Durable evidence: [V1.1](docs/qa/2026-10-25-v11-mobile/README.md),
[public review](docs/qa/2026-10-26-v11-public/README.md), plus linked reports.
Some raw recordings/operational data live only in ignored local directories.

Known gaps/risks: physical Safari/Android and Firefox acceptance, field performance,
client creative acceptance, Windows WebKit typography caveat, pending legal/media/
partner clearance, and incomplete backend/CMS/booking operations. No currently
reproduced blocking V1.1 visual defect is established by this documentation audit.
Historical failed QA remains labeled; passing automation does not prove visual
approval. Layered legacy modules/styles and long append-only handoffs increase
maintenance risk; inspect imports/authority before future cleanup.

## Reproduce and continue

From `frontend-v2/`: `pnpm install --frozen-lockfile`, then `pnpm dev --port 3002`.
Public content needs no backend credentials. `.env.example` contains optional
configuration placeholders; use local secrets rather than committing them.
Required checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
Production verification: `pnpm start --port 3003`, then
`node scripts/verify-public.mjs` and `node scripts/verify-v3.mjs`;
set `QA_URL` to override the origin. Browser installation may require
`pnpm exec playwright install chromium`. Next standalone output needs proper
public/static packaging for deployment; `next start` is a local QA procedure.

Recommended priorities (proposals, not authorization):

1. Obtain client creative feedback on V1.1 and verify physical iPhone Safari and
   Android, including fonts, toolbar changes, map targets and Full/Reduced motion.
2. Inspect the existing expiry audit and live access state under appropriate
   operational authority; decide the next review window without silently reopening it.
3. Complete legal, factual, logo/partner and media clearance and decide launch
   domain/hosting plan before public release or indexing.
4. Specify and verify the backend/CMS milestone independently: reproducible Java
   build, database/migrations, auth, media and protected inquiry persistence.
5. Establish repeatable CI for core/browser checks and plan narrow cleanup of
   inactive animation modules and stale documentation after review acceptance.
