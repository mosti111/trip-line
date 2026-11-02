# TL-SYS-003 — bounded orchestration hardening

Status: Complete — Root Astra acceptance PASS; commit and stop. Authorized by the 15 October 2026 direct user instruction.
Base: `8ac57150d006ee0996379ef20d6b34e7e2e63b09`, branch
`feat/v3-ux-motion-recovery`; application checkpoint `4b77150`.

## Outcome and boundary

Commit the proven local TL-SYS-002 setup/pilot and necessary TL-003 checkpoint
history, make the repository self-contained, and simplify future execution to one
Root Astra orchestrator → one primary selected Sol implementation/QA worker →
Root Astra acceptance. Root owns decomposition, review and Git checkpoint; no
additional Astra lead or duplicate substantive review. No application/config/package changes, frontend work,
full visual QA, merge or deployment. Stop after the hardening commit.

One bounded milestone per run; one primary Sol by default; at most one additional
QA worker only for a recorded concrete need; at most two correction cycles, then
stop/report. No scope expansion without a new task. Read only authority and the
current task's relevant page family; do not restart approved planning. Targeted
checks during implementation; broad regression once at the milestone boundary;
full product regression only at final QA. Stop when criteria pass.

Persist exactly five future bounded runs: Contact/Journey; international + FAQ +
legal; whole-product VISUAL inspection/blocker list only; exact blocker corrections
and affected re-review; final QA/report. Preparation does not dispatch them. Visual
inspection completeness may be accepted with product blockers, but product visual
approval and final QA require all blockers closed. Prevent a correction dependency
cycle by separating inspection completion from product approval.

## Validator worker contract (TL-SYS-003-VALIDATOR)

Selected `gpt-6.1-sol`, fresh context, owner to be recorded before dispatch.
Exact writable paths:

- `docs/orchestration/validate-state.mjs`
- `docs/orchestration/STATE_PROTOCOL.md`
- `docs/orchestration/TL-SYS-003-VALIDATOR-delivery.md`

Everything else is read-only, including state. Preserve the existing path/alias,
dependency, transition, lease, evidence and approval checks. Add practical bounded
scope and declared delivery existence checks, accepted-but-open milestone detection,
and a separately tracked current run without rewriting historical TL-003 approvals.
Add focused self-tests including negative cases. Use Node built-ins only. Explain
that validation cannot prove evidence truth, runtime identity or visual quality.
No frontend package-script edit is needed: document the existing lightweight CLI.
Coordinate the small schema additions with Astra before implementation. Deliver
IMPLEMENTED with exact paths, checks and limits, never self-approval.

## Initial administrative exception 5 — superseded by routing correction below

Owner `/root/astra_hardening`, selected Astra, is sole state writer. Root confirmed
the baseline; live inventory contains only root and this lead, with no retained
task owners. Delegation of routing, current authority, contract and review records
would add another coordinator without independent judgment. Direct bounded lead
documentation edits use exception 5 (delegation less efficient).

Exact editable administrative paths: `AGENTS.md`; `docs/AI_HANDOFF.md`;
`docs/DECISIONS.md`; `docs/FRONTEND_IMPLEMENTATION_PLAN.md`; `docs/README.md`;
`docs/tasks/README.md`; this task; `docs/tasks/TL-003-ux-motion-recovery.md`;
`docs/reports/README.md`; `docs/reports/TL-SYS-003-report.md`;
`docs/reports/TL-003-report.md`; `docs/orchestration/README.md`;
`docs/orchestration/MODEL_ROUTING.md`; `docs/orchestration/TASK_CONTRACT.md`;
`docs/orchestration/REVIEW_PROTOCOL.md`; `docs/orchestration/state.json`;
`docs/orchestration/RUN_PLAN.md`; the six prepared C10/QC10/I11/QI11/VISUAL/Q12
contract files plus `TL-003-VISUAL-CLOSE.md` in `docs/orchestration/recovery/`; and
`docs/qa/2026-10-15-orchestration/{checks.json,commit-manifest.json}` (two exact
files). Historical setup/pilot/evidence files are preserved, staged only when
needed for self-contained links, and are not rewritten as fresh evidence.

Checks: live and historical state validation, validator self-tests and syntax,
local-link/manifest consistency, whitespace and no application diff. No frontend
typecheck/lint/build/browser rerun is needed for this user-limited orchestration
work; recorded prior checks remain dated history. Astra independently reviews Sol
implementation. Lead-authored administrative prose has same-agent review, disclosed;
root now performs the single acceptance review. Keep all prior committed history and unrelated work.

## Acceptance and stop

Routing/budgets and five future boundaries are explicit; validator rejects concrete
bad fixtures and validates saved state; all required linked setup/evidence files are
in the exact commit manifest; TL-003 remains incomplete with 19 historical approvals
and no future owners. Hardening has its own accepted closed run record. The next
task is Contact/Journey C10 + QC10 only after a new user continuation, not now.
Report actual topology, checks, limitations and exact files for root acceptance and
commit. Stop; no optional enhancements.

## User routing correction — authoritative 15 October 2026

The user identified the current root as Astra and explicitly prohibited the extra
Astra lead. Root interrupted `/root/astra_hardening` and its Sol child before
reassignment; their partial work is preserved. Root `/root` now owns decomposition,
state and final acceptance. Required topology: Root Astra -> bounded Sol -> Root
Astra acceptance. No nested Astra, outer coordinator or second review. Historical
routing evidence is retained as history, not a dispatch rule. Root model selection
is user-provided, not independently backend-attested.

This supersedes the mechanical-root and delegated-lead clauses above. Exception 5
administrative ownership transfers to root for this task, state and final report.
A replacement direct Sol worker may implement the exact administrative paths
listed above plus the three validator paths. It may write a delivery report at
`docs/orchestration/TL-SYS-003-delivery.md`. Root retains exclusive writes to
`docs/orchestration/state.json`, this task, and `docs/reports/TL-SYS-003-report.md`.
Sol must not spawn agents, commit, modify application files, or self-approve.
