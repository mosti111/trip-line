# TL-SYS-002-DOCS — Implement the orchestration protocol

Milestone: [TL-SYS-002](../tasks/TL-SYS-002-orchestration.md). Contract owner:
explicitly selected GPT-6 Astra delegated lead `/root/astra_lead`.
Worker role/model: explicitly dispatch GPT-6.1 Sol (`gpt-6.1-sol`), fresh context.

## Objective, reason and state

Make the approved operating model executable by a fresh session, with bounded
delegation, exclusive file ownership, evidence-based approval and safe recovery.
Existing product/design authorities are strong and must be linked, never duplicated.
The current root coordinates; its model cannot be switched or independently
identified by these tools. The real setup topology is coordinator → explicit
Astra lead → explicit Sol worker. Explicit model dispatch is supported for fresh
or partial context, while full-history forks inherit. Record requested routing
and returned agent handles, not an unsupported backend model attestation.

## Exclusive write scope

- `docs/orchestration/README.md`
- `docs/orchestration/MODEL_ROUTING.md`
- `docs/orchestration/TASK_CONTRACT.md`
- `docs/orchestration/REVIEW_PROTOCOL.md`
- `docs/orchestration/STATE_PROTOCOL.md`
- `docs/orchestration/validate-state.mjs`

Read-only: all existing governance, this contract, `state.json`, frontend manifests,
verification scripts and task/report conventions. Forbidden writes: every other
path, including application/config/dependencies, dirty user files, state, pilot,
reports and root governance. No commits, reset, cleanup, network publication or
new design decisions. Missing scope requires a reported blocker and a revised
contract before writing. Dependencies: approved system task and current authority.

## Required behavior

Desktop/tablet/mobile, motion and interaction: documentation-only; preserve the
application. Define future frontend review gates by referencing existing motion,
responsive, design, architecture and testing authorities. No visual sign-off here.
Accessibility: readable plain Markdown, descriptive links and explicit fallback
obligations. Performance: no new infrastructure/dependencies; validator uses Node
built-ins only and does not mutate files or spawn workers.

README integrates authority, roles, strict scope, atomic tasks, Astra efficiency
and five direct-implementation exceptions, failure matrix, resumption and stop.
MODEL_ROUTING covers capability probes, current evidence, ideal user-selected Astra
root, practical delegated-lead topology and honest no-routing/no-agent fallbacks.
TASK_CONTRACT includes every field requested in the system task, plus base revision,
owner/lease, dependencies, risk and evidence metadata; includes narrow corrections
and strict worker delivery report. REVIEW_PROTOCOL covers visual, motion, responsive,
performance, accessibility and integration gates, strict review template, grouped
3–5 low-risk review checkpoints and blocking versus optional outcomes. STATE_PROTOCOL
documents this state schema, transitions, single state writer, exact-file leases,
stale ownership recovery and mapping to existing task statuses.

## State/validator requirements

Read `state.json` as the concrete schema contract. A task has id, status, kind,
contract, dependsOn, filesAllowed, owner (agent/model/session/leaseUntil or null),
evidence, review and history; history records from/to/at/actor/reason. Milestone
has equivalent status/history/evidence/review and explicit task IDs. Evidence is
an array of {kind, path, result}; review is null or {role, model, result, report,
blockingCorrections}. State includes session, baseRevision, currentMilestone,
lockedDecisions, applicationStatus and nextAction.

Validator must reject unknown/illegal statuses/transitions, duplicate task IDs,
unsafe/non-exact allowed paths, case-insensitive overlapping active ownership,
unknown/cyclic/unapproved dependencies at dispatch, stale active leases, ownerless
IN_PROGRESS and unsupported APPROVED claims. APPROVED requires nonempty passing
automated evidence, passing rendered evidence for frontend kind, a PASS or
PASS WITH FOLLOW-UP Astra review with no blocking corrections and an existing
report; milestone approval requires all its tasks approved. Validate evidence and
contract paths stay inside the repository and exist when referenced. Lease expiry
must fail visibly; no automatic reassignment or destructive recovery. BLOCKED tasks
may retain ownership; only explicit reconciliation releases it. Review and artifact
truth remain human/model checks, never proved merely by JSON structure.

Use exported validation function and CLI `node docs/orchestration/validate-state.mjs`
plus `--self-test`. Self-test operates on in-memory fixtures only and proves both
valid state and overlap, dependency, stale lease, transition, missing frontend
evidence and invalid reviewer/approval rejection. Do not use fabricated fixture
evidence to claim real app acceptance. Return nonzero on validation failure.

## Acceptance, verification and deliverables

All six allowed files complete and integrated; links resolve once pending parent
reports land. Run validator and self-test against current state, report actual
results and exact touched files. No application modifications. Parent runs requested
app checks and existing production-browser workflow separately. Lead reviews
protocol and then issues a separate tiny pilot contract; this is not that pilot.

Report: requested/returned routing; implemented scope; files touched; exact commands
and outcomes; evidence; blockers/deviations; risks/limitations; suggested next
action. Do not update state or approve your own work.
