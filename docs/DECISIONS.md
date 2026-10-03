# Trip Line decisions

Lightweight accepted-decision log, consolidated 3 October 2026. Record material changes to
product direction, information architecture, visual identity, architecture, dependency strategy,
localization, motion, API boundaries, deployment, security or data model. Skip trivial details.
Each entry needs date, status, decision, reason, consequences and evidence.
Dates below refer to recorded steering, not newly invented approval. Newer explicit approval
wins; unresolved questions remain unresolved.

## TL-DEC-001 — Active frontend and platform boundaries

Date: 2026-10-02. Status: Accepted.

Decision: frontend-v2 is active; frontend preserves historical V1. Backend/CMS remains
separate and unfinished. Reason: approved multilingual public implementation replaced the
earlier demo direction. Consequences: target V2 for public tasks; preserve V1/backend and
never infer database, reservations, authentication or CMS completion.
Evidence: [handoff](AI_HANDOFF.md), [delivery](FRONTEND_DELIVERY.md).

## TL-DEC-002 — Türkiye first, international retained

Date: 2026-10-02. Status: Accepted.

Decision: twelve requested Turkish destinations lead discovery; ten-country international
directory is secondary; nine source-based services remain. Reason: explicit client steering.
Consequences: ten-country-first studies cannot override current homepage/navigation/atlas emphasis.
Evidence: [phase-plan client steering](FRONTEND_IMPLEMENTATION_PLAN.md),
frontend-v2/lib/turkiye.ts and frontend-v2/lib/travel-content.ts.

## TL-DEC-003 — Three locales and natural geography

Date: 2026-10-02. Status: Accepted.

Decision: EN/AR/TR, browser preference with English fallback, remembered manual choice,
actual Arabic RTL and unmirrored geography. Reason: confirmed scope and atlas usability.
Consequences: master's English-only launch/deferred selector instructions are superseded
for the active frontend. Evidence: [approved scope](APPROVED_DESIGN_DIRECTION.md),
[delivery](FRONTEND_DELIVERY.md), frontend-v2/proxy.ts and lib/i18n.ts.

## TL-DEC-004 — Approved brand and page baseline

Date: 2026-10-01; page baseline approved 2026-10-02. Status: Accepted.

Decision: actual stacked logo, teal/sand/bronze, bold editorial headings, cinematic imagery,
spatial composition and geographic atlas. Reason: user selected the October direction and
approved the initial pack. Consequences: reference sites inspire craft, not copying;
generated claims/policies/logos/maps are not production truth. Earlier serif/gold tokens
are historical sampling context rather than active CSS authority.
Evidence: [approval record](APPROVED_DESIGN_DIRECTION.md), [preview index](PUBLIC_PAGE_PREVIEW_INDEX.md).

## TL-DEC-005 — Bronze Journey continuation and motion boundaries

Date: 2026-10-02. Status: Accepted direction; implementation QA in progress.

Update 2026-10-03: TL-001 completed the engineering continuation/QA baseline;
see [V3 delivery](V3_FRONTEND_DELIVERY.md). The original status above records the
2 October decision state, not the current task backlog.

Decision: V3 continues in frontend-v2, preserving bronze route, film, atlas, content and
accessible static/reduced-motion fallbacks. Reason: newer authorized written storyboard
builds on V2. Consequences: V2 is historical verified evidence; do not call V3 fully verified.
Current choreography uses existing Motion plus GSAP/ScrollTrigger/Lenis and R3F;
do not casually replace/add systems.
Evidence: [V3 handoff](V3_BRONZE_JOURNEY.md), [phase status](FRONTEND_IMPLEMENTATION_PLAN.md).
The master's conditional GSAP restriction does not describe the current installed stack;
it remains guidance against unnecessary additions.

## TL-DEC-006 — Prepared-message inquiry boundary

Date: 2026-10-02. Status: Accepted.

Decision: validate context and prepare WhatsApp/email messages; no backend submission.
Reason: usable contact path without implying unfinished server delivery. Consequences:
edits invalidate output; visitor sends in the external app. Persisted/Turnstile submission
needs a separate specified task. Evidence: [delivery](FRONTEND_DELIVERY.md),
frontend-v2/components/travel/Inquiry.tsx. V3 context: [Bronze Journey](V3_BRONZE_JOURNEY.md).

## TL-DEC-007 — Publication and integrity gates

Date: 2026-10-02. Status: Accepted.

Decision: keep noindex/legal-review defaults; no current V2/V3 deployment is established.
Publication needs explicit authorization, approved legal wording, current claim/partner/media
confirmation and deployment setup. Reason: frontend completion is not launch readiness.
Consequences: older hosted demos are historical; retain 2025 attribution and invent no claims,
prices, inventory or reviews. Evidence: [delivery inputs](FRONTEND_DELIVERY.md),
frontend-v2/app/layout.tsx, app/robots.ts and [V3 boundaries](V3_BRONZE_JOURNEY.md).

## TL-DEC-008 — Repository operating workflow

Date: 2026-10-03. Status: Accepted by current TL-SYS-001 request.

Decision: root map defines authority; significant work starts with a task and ends with a
truthful report; material decisions persist here. Reason: fresh sessions need shared memory.
Consequences: lean files, conditional reads, dated evidence and labeled history;
ordinary features do not need extra plans.
Evidence: [system task](tasks/TL-SYS-001-agent-operating-system.md).

## TL-DEC-009 — V3 resilient rendering and enhancement eligibility

Date: 2026-10-03. Status: Implemented within the authorized TL-001 continuation.

Decision: retain the existing vertical composition on coarse pointers, data saver
and viewports shorter than 800px; desktop pinning/Lenis require width >=1024px,
height >=800px and fine input. The homepage sculpture initializes on intersection
for fine input at >=1024px; touch retains SVG. Shared Ribbon is static SVG.
Reason: production QA found an offscreen Arabic services track and a pinned section
taller than a 600px viewport. The track now keeps a physical left origin with RTL
text, preserving geographic orientation and semantic service order.

The generic loading boundary now belongs to the historical `(public)` route group,
not the root: the root boundary left localized main content hidden without JS.
Localized pages render their local content directly while client enhancements stay
lazy. This changes loading scope, not the product or dependency architecture.

Evidence: [continuation task](tasks/TL-001-bronze-journey-continuation.md),
[report](reports/TL-001-report.md), bundled Next loading-file convention and fresh
Chromium checks. Existing motion/accessibility rules authorize these refinements;
this entry does not claim new user visual approval or publication authorization.

## Questions still open

Legal wording, current business/partner claims, media sign-off, canonical domain/deployment
configuration and user aesthetic acceptance remain open. V3 engineering QA now has
the dated TL-001 baseline and explicit limitations. V3 notes say two concept images were
not attached; the written storyboard is the available authority. Do not claim comparison
against missing images or silently invent answers.
