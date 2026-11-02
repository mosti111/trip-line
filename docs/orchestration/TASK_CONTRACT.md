# Worker contract and delivery

Write the contract before dispatch; use existing [task conventions](../tasks/README.md).
The contract is binding scope, not permission to reinterpret approved outcomes.
The state writer reserves its exact files and verifies approved dependencies under
[state protocol](STATE_PROTOCOL.md). A related dependency is not a writable path.

## Contract template

```text
TASK ID / TITLE:
MILESTONE / parent task:
MODEL / ROLE: Root Astra / bounded selected Sol / same Root Astra acceptance
RUN BUDGET: one primary Sol; extra QA 0 or 1 plus concrete reason; correction cycles 0..2
BOUNDED DECLARATION: bounded:true; scope maxFiles/maxPageFamilies/pageFamilies; deliveryReport
CHECK POLICY: targeted during work; broad once at milestone boundary; full product only Q12
OBJECTIVE: one objectively reviewable outcome
WHY THIS TASK EXISTS:
CURRENT STATE: implementation, known gaps, dirty files to preserve
DESIRED STATE:
AUTHORITY: approved task, locked decisions, relevant design/architecture references
BASE REVISION / branch: HEAD plus relevant uncommitted baseline/diff evidence
OWNER / SESSION / LEASE UNTIL: exact agent handle, requested model, UTC expiry
FILES ALLOWED: exact repo-relative file paths, including new files
FILES READ-ONLY: dependencies and reference paths
FILES FORBIDDEN: every other path; name sensitive adjacent paths
DEPENDENCIES: task IDs and required APPROVED status; integration sequence
DESIGN INTENT: approved composition/hierarchy/identity; no new direction
DESKTOP BEHAVIOR: widths/heights/input conditions
TABLET BEHAVIOR:
MOBILE BEHAVIOR: reflow, touch, orientation as relevant
MOTION BEHAVIOR: purpose, triggers, states, timing, interruption, fallback
INTERACTION BEHAVIOR: input, keyboard, state, focus, errors
PERFORMANCE REQUIREMENTS: bounded costs/cleanup/loading and regression checks
ACCESSIBILITY REQUIREMENTS: semantics, focus, reduced motion/static access, RTL
RISK / INTEGRATION BOUNDARIES: shared components, regressions, unresolved decisions
DO NOT: adjacent redesign, weakened motion, outside writes, dependencies/claims
ACCEPTANCE CRITERIA: concrete behavior and reviewable states
AUTOMATED VERIFICATION: exact commands, cwd, expected results, relevant tests
VISUAL EVIDENCE REQUIRED: routes/locales, viewport dimensions, modes/checkpoints
EVIDENCE METADATA: date, tested revision/diff, browser, input, artifact paths, limits
DELIVERABLES: implementation, checks, selected evidence, delivery report
REPORT FORMAT: below; no self-approval
STOP CONDITION: bounded completion/blocker; follow-ups remain unstarted
```

Do not leave irrelevant fields blank: explicitly mark documentation-only behavior
as unchanged and rendered evidence as not applicable, with reason. A non-frontend
pilot proves contract/scope/check/report/review/state operation; it cannot grant
aesthetic sign-off or resolve outstanding frontend QA. Browser captures of the
unchanged app are workflow evidence only.

Prefer a small related set of paths. Worker reads shared authority, chooses how
within the specification, and reports impossible requirements before substituting
behavior. If outside scope is essential, stop that dependent action and send the
blocking reason and proposed exact scope to the lead. An expanded scope requires a new bounded task and reconciled exact ownership
before the write. Check Git status/diff before and after work;
the shared working tree contains other authors' changes.

## Strict delivery report

```text
Task / milestone / contract:
Status: IMPLEMENTED / PARTIAL / BLOCKED (never APPROVED)
Routing: requested model/context, returned handle, actual limits; no attestation claim
Base and tested revision / relevant local diff:
Outcome: objective implemented and relevant behavior
Exact files touched: each path and purpose; scope deviation if any
Checks: exact commands/cwd/results, test counts or no-tests gap, failures
Evidence: selected paths, date/browser/viewport/locales/input/modes/checkpoints
Integration / regression considerations:
Blockers / deviations / missing coverage:
Risks / limitations:
Suggested next action: verification/review or narrow correction; not new work
```

Evidence must correspond to the delivered revision/diff. Keep raw regenerable output
in ignored temporary directories; retain concise durable summaries/selected artifacts
under [QA](../TESTING.md) and link them from the [report](../reports/README.md).
Do not claim commands not run, external submission, deployment or user acceptance.

## Narrow correction contract

Use a new related ID (for example `TL-HERO-006-R1`) linked to the rejected task and
review. Include exact blocking problems/states, required changes, files, owner/lease,
dependencies, unaffected behavior to preserve, acceptance, checks and regenerated
evidence. Reuse authority references; do not resend the milestone or add optional
enhancements. The rejected parent moves through correction/re-review under the state
protocol; a separate correction task must also pass review before parent approval.
