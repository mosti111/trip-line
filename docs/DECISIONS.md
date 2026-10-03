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

## Questions still open

Legal wording, current business/partner claims, media sign-off, canonical domain/deployment
configuration and V3 visual/QA sign-off remain open. V3 notes say two concept images were
not attached; the written storyboard is the available authority. Do not claim comparison
against missing images or silently invent answers.
