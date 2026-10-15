# Trip Line decisions

## TL-DEC-011 — Persistent Astra/Sol orchestration

Date: 2026-10-04. Status: Authorized by the current TL-SYS-002 user request.

Decision: extend the existing operating map with Astra-led specification and
review, narrowly scoped Sol implementation, exclusive ownership, durable state
and mandatory rendered frontend acceptance. Existing product/design authorities
stay in force; creative leadership does not grant permission to replace them.
Reason: maintain quality across sessions while reserving Astra for judgment.
Consequences: routine work is delegated; implementation and approval are distinct;
failed review produces a narrow correction contract. The setup does not authorize
frontend reconstruction, user aesthetic acceptance or publication. Runtime model
capabilities and honest fallback belong in [model routing](orchestration/MODEL_ROUTING.md).
Evidence: [authorized setup task](tasks/TL-SYS-002-orchestration.md),
[protocol](orchestration/README.md), [pilot review](reports/TL-SYS-002-pilot-review.md).

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

## TL-DEC-010 — Full Bronze Journey reconstruction

Date: 2026-10-03. Status: Authorized by the current user's supplied instructions.

Decision: replace the earlier V2-derived V3 composition with cinematic travel chapters.
Use #071F20 / #194244 teal, #F8EFE0 / #FFFDF8 ivory, #E4D7C1 sand and
#D7AA4D / #C89039 / #A8792D bronze. These explicit current values supersede the
older active token values in DESIGN_SYSTEM.md. Manrope/Noto Sans Arabic remain.
The supplied task's approved grouping maps to existing Türkiye travel, Hajj/Umrah
and business/group service worlds, preserving source content rather than inventing
Leisure/Business/Bespoke categories.

Consequences: the three service panels and horizontal nine-card sequence become a
stateful editorial selector and an accessible nine-link directory. Türkiye gets an
entrance and dominant selected media; detail pages have distinct place chapters.
One desktop opening pin remains; other chapters use native scroll with bounded
reveals/parallax. Existing reduced-motion, input, noindex, geography and inquiry
boundaries remain. The old vertical fallback decision applies to enhancement
eligibility, not preservation of the superseded composition.

Evidence: [full user specification](tasks/TL-002-reconstruction-instructions.md),
[task](tasks/TL-002-bronze-reconstruction.md). TL-001 is a historical engineering
baseline; it does not establish aesthetic approval of this reconstruction.

## TL-DEC-012 — Full UX and Bronze Journey recovery

Date: 2026-10-05. Status: Authorized by explicit current user request.

Decision: execute all phases 0–14 on feat/v3-ux-motion-recovery from 0ba5a97;
static final homepage must pass rendered review before advanced motion. Current
[exact specification](tasks/TL-003-recovery-instructions.md) replaces the TL-002
restrained selector/section composition with fifteen ordered homepage chapters,
spatial service worlds, flagship Türkiye hub/details and session-wide journey.
The earlier stop/wait instructions remain historical; this is new authorization.

New explicit direction supersedes prior conflicting defaults: editorial Newsreader
and connected Arabic display alongside existing UI fonts; no 800px minimum-height
desktop enhancement gate; short fine-pointer desktop uses compressed travel;
Türkiye explorer never uses equal international tabs. Global sessionStorage retains
only validated destination IDs/order and journey type, never personal contact data.
Preserve source facts, nine services, twelve places, three locales, secondary
international directory, noindex and honest prepared-message handoff. No merge or
deployment. The source audit reads the actual available four-page Company Profile
2025; all figures retain attribution and 12+ experience is never company age.

Evidence: [TL-003 task](tasks/TL-003-ux-motion-recovery.md),
[content audit](qa/2026-10-05-recovery/content-authority.md),
[live report](reports/TL-003-report.md). Creative acceptance remains with the user.

## TL-DEC-013 — bounded execution and corrected root routing

Date:2026-10-15. Status: authorized by direct user instruction.
Decision: Root Astra owns decomposition, state and single acceptance; one primary
selected Sol implements and verifies. No nested Astra or outer coordinator. At
most one additional QA worker needs a concrete recorded need. One milestone per
run, maximum two correction cycles, no scope expansion without a new task; targeted
checks during work, broad once at milestone boundary, full product only final QA.
Reason: the historical delegated Astra rule and unknown-root fallback created an
unrequested lead layer and repeated checks. User identifies root as Astra; this
is not backend model attestation. Preserve old routing as dated history.
Consequences: five prepared runs separate VISUAL inspection completeness from
VISUAL-CLOSE zero-blocker product approval; no dependency deadlock or weakened QA.
Current hardening stops after commit; no frontend work is dispatched.
Evidence: [task](tasks/TL-SYS-003-orchestration-hardening.md),
[routing](orchestration/MODEL_ROUTING.md), [run plan](orchestration/RUN_PLAN.md).
