# Trip Line orchestration

This layer extends the [root operating map](../../AGENTS.md); it does not replace
product/design authority. Start with [handoff](../AI_HANDOFF.md),
[product vision](../PRODUCT_VISION.md), [decisions](../DECISIONS.md) and the current
[task](../tasks/README.md), then inspect [live state](state.json). Existing
[design direction](../APPROVED_DESIGN_DIRECTION.md), [design system](../DESIGN_SYSTEM.md),
[motion](../MOTION_SYSTEM.md), [responsive](../RESPONSIVE_RULES.md),
[architecture](../ARCHITECTURE.md) and [testing](../TESTING.md) own those subjects.
Read [Bronze Journey](../V3_BRONZE_JOURNEY.md) and the phase/delivery evidence for V3.
No setup milestone authorizes reconstruction, publication or user aesthetic acceptance.

## Responsibilities and scope

Current topology: **Root Astra → one primary selected Sol implementation/QA worker
→ the same Root Astra acceptance**. Root owns decomposition, state and acceptance.
Do not create a nested Astra, outer coordinator or second review layer. One additional QA worker is
permitted only when the contract records a concrete coverage/ownership need.

The user-selected GPT-6 Astra lead interprets approved outcomes, specifies visual
intent and architecture, decomposes work, contracts, reviews actual rendered output,
issues corrections and approves milestones. This leadership operates within locked
decisions; unresolved creative/product questions require user direction before
dependent implementation. [Model routing](MODEL_ROUTING.md) records actual capability.

Explicitly selected GPT-6.1 Sol workers implement small, objectively reviewable
[contracts](TASK_CONTRACT.md): components, CSS, responsive/motion/3D behavior, tests,
content/route integration, accessibility, performance and evidence generation.
Never dispatch “improve the homepage.” Dispatch one defined outcome, such as a
specified hero parallax state or the mobile navigation transition. Read-only sharing
is permitted; [exact-file ownership](STATE_PROTOCOL.md) permits one writer per file.
Integration waits for approved dependencies. A worker cannot approve its own work.

Workers must not redesign adjacent sections, rewrite unrelated components, invent
tokens/conventions, replace established systems, alter unrelated content/architecture,
weaken required motion or silently substitute an easier design. A scope blocker is
reported before any outside-scope write; Root must create a new bounded task and
reconcile exact ownership first. Preserve dirty/untracked work; never reset, stash, delete, overwrite,
rewrite history or commit unrelated changes to make integration convenient.

## Efficient judgment checkpoints

Astra normally delegates ordinary React/CSS, repetitive pages/content/refactors,
boilerplate, basic tests, imports/exports, simple types/routes, ordinary spacing and
accessibility fixes. Reserve Astra for milestone definition, sensitive architecture,
hero/3D/motion/navigation, major system decisions, grouped rendered review and final
integration approval. Review the one bounded run at its acceptance checkpoint;
use an earlier static or high-impact gate only when the contract requires it.
Each task still needs its own evidence and recorded result; dependencies wait
for their required approval.

One milestone per run; one primary Sol by default; maximum two correction cycles,
then stop/report remaining blockers. No scope expansion without a new task. Stop
when criteria pass; optional polish is not a reason to continue. During a run read
only normal authority, the current contract and its relevant family/dependencies;
do not repeatedly inspect unrelated families or restart settled planning. Targeted
checks during implementation, broad regression once at the milestone boundary,
and full product regression only in final QA. A new material change/failure may
justify repeating affected checks; unchanged passing evidence is not rerun by habit.

The [five-run continuation plan](RUN_PLAN.md) is the next-work map. Current hardening
stops after its commit. Each future run needs user continuation and stops at its
own accepted checkpoint. Inspection completion is separate from product approval.

Direct Astra implementation has exactly five exceptions: (1) architecturally
sensitive change, (2) repeated worker failures, (3) problem cannot meaningfully be
contracted, (4) tiny fix blocks orchestration, (5) delegation is less efficient.
Before editing, record the selected exception, concrete reason, exact paths, owner,
expected check and bounded outcome in the task/report and state history. Reconcile
ownership; retain independent review where available and disclose any same-agent
review limitation. An exception never changes product authority or skips evidence.

## Execution and continuation

1. Inspect Git branch, HEAD, status and prior reports before writing. Read the
   current milestone, task contracts, locked decisions and linked evidence.
2. Run `node docs/orchestration/validate-state.mjs`. Reconcile any invalid state,
   stale lease, live old worker or unexplained local diff before new dispatch.
3. Select only the next action allowed by [state protocol](STATE_PROTOCOL.md):
   define a bounded task, dispatch a ready task, verify delivered work, review, or
   issue a narrow correction. Do not restart approved planning.
4. Root Astra, the single state writer, reserves exact paths and a live session lease before
   dispatch. Record requested model, returned handle and capability limits.
5. Worker delivers implementation plus strict report. Run the contract's checks,
   inspect scope and capture relevant rendered evidence. `IMPLEMENTED` is a delivery
   claim, not technical verification or approval.
6. Astra follows [review protocol](REVIEW_PROTOCOL.md). A failure creates a narrow
   correction contract, fresh checks/evidence and re-review, never a whole-milestone
   resend. Approval needs evidence and a recorded independent decision.
7. Persist state, significant [report](../reports/README.md), decisions and handoff
   where material. Stop at the authorized milestone boundary. Follow-ups stay
   unstarted until authorized; a completed setup never starts real reconstruction.

For “Continue Trip Line orchestration”, these steps reconstruct current authority,
approved/awaiting-review/active/blocked work, owners and next valid action from disk.
`nextAction` guides navigation but cannot override gates or grant new scope.

## Failure handling

| Failure | Required action |
| --- | --- |
| Worker crash, timeout or lost session | Preserve diff and evidence; mark blocked and reconcile the worker/lease explicitly before reassignment. |
| Test/type/lint/build failure or no tests | Record command, output and gap; fix narrowly; rerun affected checks; no approval from failed or absent coverage. |
| Visual/motion/UX failure or specification deviation | Record blocking findings and exact states; issue a bounded correction; regenerate affected evidence and re-review. |
| Browser/capture failure | Diagnose tooling/preview; record missing coverage; keep frontend approval pending until required rendered review is possible. |
| Unknown, cyclic or unapproved dependency | Block dispatch; resolve graph/approval without pretending implemented work is accepted. |
| Merge conflict, ownership collision or unexplained diff | Stop affected writes; identify authors, preserve work, reconcile explicitly; never auto-reset or overwrite. |
| Missing design/product decision | Continue independent authorized tasks; surface the precise question before dependent work. |
| Unsupported tool | Report actual limitation; use an available equivalent only if it meets the same acceptance; otherwise block the dependent gate. |
| Unsupported model routing/agents | Follow honest [fallback](MODEL_ROUTING.md); do not label inherited/unknown models as selected Astra/Sol. |
| Forbidden-file write | Stop worker; inspect and report exact diff; preserve work; reconcile with its owner and reject/recontract delivery before review. |
| Stale lease or invalid state | Fail visibly; confirm worker status, inspect diffs and record release/renewal; no automatic reassignment. |

The validator enforces structural gates, not locks on the filesystem or evidence
truth. Human/model discipline and actual review remain essential. Use its
`--self-test` for protocol regression; fixtures do not establish app acceptance.
