# State, ownership and recovery

[state.json](state.json) is the single orchestration status/ownership record; task
specifications own outcomes, [decisions](../DECISIONS.md) own accepted authority and
reports own dated evidence. Only `stateWriter` changes state. Workers report delivery
to that writer; concurrent writers, automatic reassignment and implied approval are
forbidden. Update state deliberately after inspecting live agents and shared Git diff,
then run `node docs/orchestration/validate-state.mjs` before dispatch and after changes.
The validator is read-only, uses Node built-ins and exits nonzero for invalid state.
`--self-test` tests in-memory fixtures, never application acceptance.

## Schema version 1

Top-level fields: `schemaVersion: 1`, `session` (current session ID), `baseRevision`
(full Git SHA), `currentMilestone`, `stateWriter` (agent), `lockedDecisions`
(repository file path), `applicationStatus` (explicit boundaries), `nextAction`
(next bounded action), `milestone`, `tasks`. Optional `historyTimeConvention`
explains recording-time reconstruction where actual early event timestamps were
not captured; never present reconstructed recording times as measured event times.

Milestone: `id`, `kind` (`documentation`, `frontend`, `verification` or `integration`),
`status`, `contract`, `taskIds`, `evidence`, `review`, `history`. Use `frontend` for any
task/milestone changing public frontend behavior or presentation, including frontend
integration; other kinds cannot be used to evade rendered approval.

Task: `id`, `kind`, `status`, `contract`, `dependsOn` (task IDs), `filesAllowed`
(exact case-insensitive repository-relative file paths), `owner`, `evidence`,
`review`, `history`. Contracts, evidence and review paths must be safe existing files
inside the repository; new allowed files may be absent. Use forward slashes, no glob,
absolute path, traversal, directory, alias or symlink escaping the repository.
The filesystem probe compares each existing target or nearest existing ancestor
with its resolved real path. Internal symlink/junction aliases are rejected as well
as external escapes, so aliases cannot obtain separate textual ownership leases.

`owner` is null or `{agent, model, session, leaseUntil}` with explicit agent handle,
requested model, current session and ISO UTC expiry. `IN_PROGRESS` requires an owner;
only `IN_PROGRESS` and `BLOCKED` may retain one. Every retained owner reserves all its
allowed paths, including blocked work, and needs a live lease. Path equality and
ancestor/descendant collisions are rejected case-insensitively. Empty write scope is
valid for a verification-only task. Lease is a protocol reservation, not an OS lock.

`evidence` is an array of `{kind, path, result}`: kinds `automated`, `rendered`,
`scope`, `routing` or `other`; results `PASS`, `FAIL` or `GAP`. A linked manifest/report
records exact commands, tested revision/local diff, date, browser, dimensions, locales,
input, modes/checkpoints and limitations. Metadata belongs in that artifact to keep
state small. Passing evidence is required for approval; any `FAIL` or automated/
rendered `GAP` blocks approval, never hidden by another passing entry. Preserve
resolved older failures in dated reports rather than current acceptance evidence.
Other evidence gaps require an explicit non-mandatory explanation in review.

`review` is null or `{role, model, result, report, blockingCorrections}`. Required
approval role is `Astra lead/reviewer`, model `gpt-6-astra`, result `PASS` or
`PASS WITH FOLLOW-UP`, existing report path and an empty blocking-corrections array.
The report identifies reviewer agent/session and checks independence from the worker.
Structural validation does not attest models or inspect report truth.

`history` is a nonempty continuous chronological array of
`{from, to, at, actor, reason}`. First event is `null → PLANNED`; each next `from`
equals the prior `to`; the last `to` equals current status. Record UTC timestamps,
explicit actor and specific reason, including dispatch handle, release, correction or
exception details. Same-status entries can record lease renewal/reconciliation;
they do not bypass gates. Keep previous evidence/review in reports when invalidated.

## Policy version 2 and bounded current runs

Keep schemaVersion:1; policyVersion:2 is the explicit additive migration. Archived
schema-v1 records without policyVersion remain valid historical records. Do not
rewrite old approvals to invent scope or delivery evidence. In policy2 every
non-APPROVED task, every retained owner and every activeRun.taskIds task must
declare bounded:true. Existing approved historical tasks are exempt until reopened through explicit graph reconciliation.
A bounded declaration is never proof that the declared scope is sufficient or true.

Each bounded task adds scope:{maxFiles,maxPageFamilies,pageFamilies} and
deliveryReport. Caps are nonnegative safe integers; filesAllowed and finite unique
case-insensitive page-family labels cannot exceed them. Frontend scope requires
nonempty pageFamilies. A documentation task can declare zero families; verification
contracts enumerate the actual inspected families even when application is read-only.
No wildcard, unbounded label, directory or ambiguous new extensionless path is
accepted. State limits cannot prove semantic completeness: Root reviews contracts
and actual Git changes. A new task is required for expanded scope.

The declared deliveryReport is a safe exact path. It may be absent before delivery;
it must exist in IMPLEMENTED, REVIEW_REQUIRED, REVIEWING, APPROVED or
CHANGES_REQUESTED. Evidence and review references always require existing files.
Passing review on a milestone/run while it is still open is invalid.

Policy2 requires activeRun, separate from currentMilestone/milestone. It uses the
normal milestone fields and taskIds, plus closed and budget. Budget is
{primaryWorkers:1,additionalQaWorkers:0,additionalQaJustification:null,
maxCorrectionCycles:2,correctionCycles:0}. Additional QA may be1 only with a
concrete justification; correctionCycles is0..2. closed is true exactly when
status is APPROVED. Closed runs retain no owners; all retained workers belong to
the current run and their distinct handles cannot exceed its worker budget.
This structural count cannot establish total historical dispatches or actual models.

Root-only migration: preserve original milestone.taskIds, 19 historical approvals,
reviews/history and archived setup; add policyVersion2; declare bounded fields for
all future/current tasks; add the separate VISUAL-CLOSE task outside the original
25-ID milestone; make Q12 depend on VISUAL-CLOSE; change VISUAL to verification
inspection with an explicit reason; create the current hardening activeRun with
its task IDs and open budget. Release owners on delivery; after Root acceptance
advance legal task/run histories to APPROVED, attach passing existing evidence
and review, set closed:true, validate, save checkpoint and stop. Do not mark the
unfinished TL-003 milestone accepted. Future runs replace activeRun after preserving
its completed record in the dated report/history.

Lightweight repository-root CLI (Node built-ins, no package/CI change):

```sh
node --check docs/orchestration/validate-state.mjs
node docs/orchestration/validate-state.mjs --self-test
node docs/orchestration/validate-state.mjs
node docs/orchestration/validate-state.mjs --state docs/orchestration/recovery/TL-SYS-002-approved-state.json
```

The validator cannot attest runtime identity, worker liveness, evidence truth or
freshness, declared scope adequacy, actual rendered quality or real budget usage.
It does not inspect or mutate Git, dispatch workers or write state.

## Legal transitions and existing task mapping

| Current | Allowed next statuses | Existing task status |
| --- | --- | --- |
| PLANNED | READY, BLOCKED | Planned |
| READY | IN_PROGRESS, BLOCKED | Planned |
| IN_PROGRESS | IMPLEMENTED, BLOCKED | In Progress |
| BLOCKED | READY, IN_PROGRESS | In Progress (blocked explicitly) |
| IMPLEMENTED | REVIEW_REQUIRED, BLOCKED | Review |
| REVIEW_REQUIRED | REVIEWING, BLOCKED | Review |
| REVIEWING | APPROVED, CHANGES_REQUESTED, BLOCKED | Review |
| CHANGES_REQUESTED | READY, IN_PROGRESS, BLOCKED | In Progress |
| APPROVED | CHANGES_REQUESTED | Complete |

Same-status history is allowed for metadata events. Reopening approved work needs
explicit authorized correction/reason, cleared approval and fresh evidence/re-review;
do not edit approved outputs silently. Existing `Superseded` task documentation is
not an orchestration status: retain history and point to replacement; never silently
delete or relabel approval. `IMPLEMENTED` is never `APPROVED`.

Dispatch from `READY` (or a bounded correction) requires a written contract, approved
authority, all dependencies `APPROVED`, acyclic known dependency graph, inspected Git
baseline, valid current owner/session/lease and no overlapping owned paths. Dependencies
remain approved throughout delivery/review; if reopened, downstream work is blocked for
reconciliation. Integration occurs only after its dependencies are approved.
Release owner after implementation handoff; reserve again before correction writes.
`APPROVED` requires passing automated evidence, passing rendered evidence for frontend,
a passing independent Astra review with no blocking corrections and an existing report.
Milestone approval additionally requires all its explicit task IDs `APPROVED`, its own
evidence and final integration review. Unknown states/illegal history cannot pass.

## Stale-session recovery

1. Inspect current state, Git status/HEAD/diff, contracts, evidence/reports and available
   live-agent status. A changed session or expired lease does not imply a dead worker.
2. Stop affected dispatch/writes. Contact or interrupt the prior worker using available
   coordination; confirm it is quiescent. Preserve its partial changes and all unrelated
   dirty/untracked work. If liveness cannot be established, keep ownership blocked and
   record the unresolved risk rather than starting another writer.
3. The state writer records what was found, exact paths/diff, prior agent/session,
   timestamp, reason and reconciliation outcome in history/report. Renew a confirmed
   worker's lease explicitly, or release ownership only after confirmed quiescence and
   preserved handoff. Updating session IDs alone is not recovery.
4. Reinspect dependencies/contract/base, reserve a fresh current-session owner/lease
   for an explicitly dispatched worker, validate state and resume bounded work.

Self-tests include simulated resolver cases for an internal file alias and an aliased
ancestor of a new file. These are in-memory regression fixtures, not actual filesystem
symlink/junction tests; report any separate real filesystem checks independently.

The validator visibly rejects stale retained leases and ownership collisions; it never
releases them, renews a lease, writes state or spawns workers. A blocked retained owner
still prevents concurrent writing. No forceful cleanup/reset is part of recovery.
Scope, evidence freshness, rendered judgment and real worker liveness remain explicit
lead checks beyond JSON. See [failure handling](README.md) for corrective actions.
