# Review, evidence and approval

Use existing [testing](../TESTING.md), [design direction](../APPROVED_DESIGN_DIRECTION.md),
[design system](../DESIGN_SYSTEM.md), [motion](../MOTION_SYSTEM.md),
[responsive](../RESPONSIVE_RULES.md) and [architecture](../ARCHITECTURE.md).
Newer accepted [decisions](../DECISIONS.md) win. This protocol defines the acceptance
gate; it does not create a competing aesthetic direction or performance standard.

## Bounded acceptance and check budget

Root Astra reviews the direct Sol delivery and owns the single acceptance decision.
No nested Astra or outer coordinator adds a second review. One primary Sol handles
implementation and QA by default; an additional QA worker needs a recorded concrete
need. Maximum two correction cycles, then stop/report. Use targeted checks during
implementation and broad regression once on the frozen milestone boundary; only
final Q12 runs full product regression. Do not repeat unchanged passing checks by
habit or continue optional polish after acceptance. The current orchestration-only
hardening uses Node/state/link/manifest/scope checks, without frontend checks.

VISUAL inspection completion may be APPROVED with an explicit product-blocker
register; it approves coverage and judgment completeness only. Product visual
approval belongs to the separate forward-dependent
[VISUAL-CLOSE gate](recovery/TL-003-VISUAL-CLOSE.md). No final Q12 until that gate
has zero blockers and approved affected re-reviews. Never label inspection
completion a product PASS.

## Verification before judgment

Inspect the contract, base/current revision and relevant uncommitted diff. Check exact
write scope, dependency integration and worker report. Run required checks with exact
results: frontend `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`; no-tests
output is a gap. Use production preview and existing `verify-public.mjs`; V3 also
uses `verify-v3.mjs` at the single applicable milestone boundary. The full
resilience/reconstruction/media/planner suite belongs to final Q12; earlier runs
use only targeted affected checks required by their contracts.
Read `frontend-v2/AGENTS.md` and bundled Next docs before framework changes.
Tests do not establish visual quality. Failure or missing mandatory coverage blocks
approval. Production preview is not deployment.

Capture a small useful set of actual browser-rendered evidence at the tested revision:
desktop 1440×900, laptop 1280×800, tablet 768×1024 and mobile 390×844 by default;
use the contract and existing QA matrix for additional 360/430/1024 widths,
short-height/landscape cases and relevant EN/TR/AR. Record exact dimensions, browser,
input and mode. Include Arabic RTL, natural geography/photo orientation, keyboard,
touch/coarse input, reduced motion, static/WebGL failure and data saving where affected.
Static work needs representative screenshots; motion work needs initial, 25%, 50%,
75% and exit or equivalent interaction states plus live browser playback/interaction
or a recording sufficient to judge timing and interruption. Screenshots alone cannot
prove pacing. Compare relevant before/after states when evaluating regressions.

Keep dated revision/diff metadata, commands/results and selected durable artifacts;
raw capture archives may stay ignored. A state evidence entry links the manifest or
artifact actually inspected; do not cite inaccessible/missing files as acceptance.
Do not produce a massive archive that obscures the relevant judgment.

## Astra acceptance gates

The selected Astra reviewer examines actual evidence and integration, not just source.
Do not approve solely because a build/typecheck passes, a component/animation exists,
the layout fits, console is quiet or a screenshot roughly resembles the specification.
Approval requires intended composition, hierarchy, art direction, atmosphere, depth,
consistency, brand and interaction quality; technically competent generic output fails
the approved Trip Line intent.

| Gate | Review questions |
| --- | --- |
| Visual / hierarchy / UX | Does composition, typography, media, spacing, reading order, depth and brand match the approved intent? Are state changes and inquiry behavior clear? |
| Motion | Purpose/storytelling, timing, pacing, easing, hierarchy, spatial continuity, scroll relationship, transitions, interruption, feedback, mobile adaptation, reduced motion, performance and visual weight. |
| Responsive | Device composition and hierarchy, restructuring/reflow, type, touch targets, 3D fallback, motion adaptation, media loading, navigation, section heights, overflow, changed input and relevant orientation. Mobile preserves the concept through deliberate composition. |
| Performance | Layout shift, animation/main-thread cost, duplicate observers, unnecessary renders, media size, 3D/mobile GPU cost, lazy and route loading, animation/listener cleanup, console errors and broken assets. Measure relevant production behavior; lab results are not field proof. |
| Accessibility / locale | Semantic content, keyboard/focus/return, visible focus, errors, contrast/zoom, touch access, essential static/no-JS access, actual RTL and unmirrored geography. |
| Architecture / integration | Existing boundaries/tokens/dependencies, cleanup/lifecycle, dependency results, shared-route regressions, source claims, prepared-message/noindex/legal defaults and scope integrity. |

Use project-appropriate evidence rather than sacrificing the experience to arbitrary
numbers. Report browser/physical-device/field-performance coverage limits honestly;
mandatory contract coverage still blocks approval if absent.

Group 3–5 related low-risk tasks at one Astra checkpoint; produce an explicit finding
and evidence mapping for each. Hero, major 3D/motion/navigation, sensitive architecture
and major design-system work warrant immediate review. Non-blocking polish is optional,
not an endless correction loop. Implementation and automated checks remain distinct
from rendered review. Frontend approval does not mean user aesthetic acceptance or
publication. Documentation-only review marks aesthetic/motion gates not applicable;
a harmless non-frontend pilot approves only its contracted workflow proof.

## Strict review template

```text
REVIEW
Task/Milestone / contract:
Reviewer: role Astra lead/reviewer, explicitly selected model, agent/session
Result: PASS / FAIL / PASS WITH FOLLOW-UP
Tested revision / relevant diff / date:
Visual fidelity:
Motion:
Hierarchy:
UX:
Responsive:
Performance:
Accessibility:
Architecture:
Regression risk:
Problems: numbered concrete states/widths/locales, impact and authority
Required corrections: numbered blocking changes and acceptance
Optional improvements: non-blocking, unstarted suggestions
Evidence reviewed: exact artifact paths and commands/results; live motion method
Missing coverage / capability limits:
Final decision: approve, request narrow corrections or retain pending review
```

`PASS WITH FOLLOW-UP` has zero blocking corrections; optional suggestions do not
authorize implementation. `FAIL` moves to `CHANGES_REQUESTED` and a narrow
[correction contract](TASK_CONTRACT.md). Fix, rerun affected checks, refresh relevant
evidence and re-review. Do not approve while corrections or mandatory gates remain.
Approval requires the independent selected Astra review report to exist, passing
automated evidence and (for frontend) passing rendered evidence. Milestone approval
also requires every listed task approved and an integration review of the combined
revision. [State validation](STATE_PROTOCOL.md) checks record structure; the reviewer
is responsible for truthful results and evidence freshness.
