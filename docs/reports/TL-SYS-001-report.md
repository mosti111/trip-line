# TL-SYS-001 — Permanent agent operating system

Task: [approved system specification](../tasks/TL-SYS-001-agent-operating-system.md).
Date: 3 October 2026, Europe/Istanbul.

## Outcome

Completed. Documentation only; no application behavior, config, dependency or media changes.

## Summary

Established a concise agent map, explicit authority hierarchy, current product/design/
motion/responsive rules, evidence-backed decisions and reusable task/report workflow.
Separated current V3 implementation with QA in progress from historical verified V2
delivery, older V1/journal exploration and the unfinished backend/CMS platform.

## Files changed

Created (10):

- docs/PRODUCT_VISION.md
- docs/MOTION_SYSTEM.md
- docs/RESPONSIVE_RULES.md
- docs/DECISIONS.md
- docs/tasks/README.md
- docs/tasks/TASK_TEMPLATE.md
- docs/tasks/TL-SYS-001-agent-operating-system.md
- docs/reports/README.md
- docs/reports/REPORT_TEMPLATE.md
- docs/reports/TL-SYS-001-report.md

Updated (28):

- AGENTS.md, README.md, TODO.md, frontend-v2/README.md
- docs/README.md, docs/AI_HANDOFF.md, docs/FRONTEND_IMPLEMENTATION_PLAN.md
- docs/APPROVED_DESIGN_DIRECTION.md, docs/DESIGN_SYSTEM.md, docs/ARCHITECTURE.md
- docs/PRODUCT.md, docs/MASTER_SPECIFICATION.txt, docs/TESTING.md, docs/ASSETS.md
- docs/API.md, docs/DATABASE.md, docs/SECURITY.md, docs/DEPLOYMENT.md
- docs/FRONTEND_DELIVERY.md, docs/qa/2026-10-02/README.md
- docs/PUBLIC_PAGE_PREVIEW_INDEX.md
- docs/AWARD_COMPONENT_RESEARCH_2026-10-01.md
- docs/DESIGN_DIRECTION_2026-10-01.md, docs/FRESH_DESIGN_RESEARCH_2026-10-01.md
- docs/DEMO_QA.md, docs/LIVING_TRAVEL_JOURNAL.md
- docs/PROFILE_ATLAS_DIRECTION.md, docs/NUMBERS_AND_PARTNERS_SECTIONS.md

Pre-existing local changes: AI_HANDOFF.md and FRONTEND_IMPLEMENTATION_PLAN.md already
contained V3 steering/status, preserved while adding operating-system links.
frontend-v2/scripts/verify-public.mjs was modified and verify-v3.mjs was untracked
before this task. Neither script was edited by TL-SYS-001. The generated nested
frontend-v2/AGENTS.md was left byte-for-byte unchanged.

## Implementation notes

Root map remains within the requested 80–150-line range. Authority flows from current
user/task → accepted decisions → vision → approved direction → design → motion →
responsive rules → architecture → current handoff → dated delivery/QA → master
platform specification → history. Manifest versions are recorded with pins/ranges,
not called latest or fully exercised solely because installed.

Current architecture documents actual locale dispatcher, server page composition,
client islands, local content, V3 experience boundaries, GET journey context and honest
inquiry. Planned Spring/PostgreSQL/Flyway/CMS/sessions/R2/Turnstile/deployment behavior
remains preserved separately.

## Decisions made

The task establishes workflow via [TL-DEC-008](../DECISIONS.md#tl-dec-008--repository-operating-workflow).
Other seeded entries consolidate existing approval/evidence; no new product/design/
dependency decisions or feature authorization were invented.

## Contradictions resolved

- Active frontend versus historical V1/journal demos and old hosting URLs.
- Completed V2 delivery versus newer V3 implementation with QA still in progress.
- Old English-only/deferred selector requirements versus actual EN/AR/TR and Arabic RTL.
- Ten-country-first studies versus primary twelve-place Türkiye discovery.
- Early serif/gold sampling versus active bold sans-serif teal/sand/bronze tokens.
- Historical aircraft proposal versus current bronze ribbon identity.
- Source/controller/migration presence versus unverified backend runtime and CMS.
- Future persisted contact versus current prepared WhatsApp/email handoff.
- Initial preview awaiting-review/localization wording versus recorded approval and delivered localization.
- Frontend readiness versus legal/media/claim/deployment/indexing gates.

## Historical material preserved

Original master body, older milestone checklists, design research, journal/atlas studies,
profile source reasoning, reference-site benchmarks, generated-image prompts and V2 QA
remain available with status/context labels. No reference assets or historical reasoning
were deleted. Original company PDF remains an external input, not promised on a fresh clone.

## Deviations from task

The request's V2 snapshot was updated to reflect inspected V3 source and pre-existing
handoff steering, as explicitly allowed by the request's repository-first rule.
The supplied TL-SYS-001 identifier is retained as a system exception to TL-### naming.
Additional API/database/security/deployment status banners clarify source versus target.
No frontend refactor, redesign or follow-up feature was started.

## Verification performed

- Inspected repository inventory, active routes/components/lib/styles/scripts, manifest,
  all requested source documents, dated QA and existing Git status.
- From frontend-v2: `pnpm typecheck` and `pnpm lint`.
- `git -c core.safecrlf=false diff --check` and documentation diff review.
- Local Markdown-link existence checks for changed/new documentation, excluding
  external URLs and intentional task/report template example filenames.
- Contradiction searches across root/docs for status, locales, deployment, completion,
  inquiry, authority and historical instructions; matched source behavior and manifest.
- SHA-256 checks on both pre-existing QA scripts and generated nested agent rules.

## Results

Typecheck and lint passed (exit 0). Documentation checks passed; no application/config/
dependency changes introduced. Git diff includes the two pre-existing QA-script changes,
which must not be attributed to this task. No environment files, secrets, dependencies,
build output or temporary downloads were added.

Checked 194 local Markdown links across 38 changed/new documents (template example
filenames excluded); all targets exist. Root AGENTS.md is 120 lines.
All three preserved-file SHA-256 hashes matched their initial values.
Documentation scope: 10 created files and 28 updated files. Tracked-document diff versus
HEAD includes the pre-existing handoff/plan edits; the non-documentation working-tree
changes are exclusively the QA scripts that predated this task.

Tests, build and browser checks were not run for this documentation-only task.
Historical results remain explicitly dated; no new browser or deployment result is claimed.

## Visual verification

N/A: documentation only. No application rendering changed. V2 screenshots remain historical
baseline evidence; V3 visual/browser QA and physical-device/browser limitations stay open.

## Known issues

No unresolved conflict in current documentation authority was identified. External product/
publication inputs remain unresolved: final legal copy, current profile/partner claims,
media sign-off, canonical domain/deployment setup and V3 QA/visual sign-off.
V3's two concept images were unavailable per its original notes; the written storyboard
is preserved as available authority. The report does not certify them visually.

## Follow-up candidates

First finish the already in-progress V3 QA/delivery under a specific task with acceptance
criteria and new evidence. After that, a proposed first feature is a verified server-side
inquiry path preserving current context and explicit result states, only after approving
API/privacy/Turnstile/persistence scope. Neither follow-up was started here.
