Current authorized milestone: [TL-005 Motion V4 M01 navigation](TL-005-motion-v4-m01.md); M01 only, prior hero timing blocker preserved.

# Task workflow

Current authorized milestone: [TL-004 Motion V4 homepage hero](TL-004-motion-v4-hero.md), 23 October 2026; isolated prototype, then user acceptance before further work.

Current orchestration setup: [TL-SYS-002](TL-SYS-002-orchestration.md).
System tasks may use TL-SYS identifiers. Delegated tasks use the
[worker contract](../orchestration/TASK_CONTRACT.md); their live state and status
mapping are governed by [state protocol](../orchestration/STATE_PROTOCOL.md).
The task/report conventions below remain in effect. The current frontend task
listed below is separate from orchestration setup.

Write a task BEFORE significant implementation. Use TL-###-short-description.md and
[TASK_TEMPLATE.md](TASK_TEMPLATE.md). Keep the provided TL-SYS-001 identifier for this
system task; system IDs are an explicit exception to normal numeric feature filenames.

Statuses: Planned → In Progress → Review → Complete; Superseded records replacement and reason.
Complete means acceptance criteria met and actual checks reported, not a TODO-only result.
Link the approved user outcome, authoritative documents and any dependencies.
Codex chooses HOW, never silently redefines WHAT. Report a material product/design
ambiguity before taking a dependent decision, while continuing independent authorized work.

A normal feature needs one concise task. Only long, multi-stage changes need an additional
linked execution plan with stages, dependencies and checks; no extra process for normal work.
Record material decisions in [DECISIONS.md](../DECISIONS.md), and produce a matching
[report](../reports/README.md). Update handoff/phase plan when status/scope changes.
Follow-up suggestions do not authorize new work.

Current task: [TL-002 — Bronze Journey reconstruction](TL-002-bronze-reconstruction.md).
Prior frontend task: [TL-001 — Bronze Journey continuation](TL-001-bronze-journey-continuation.md).
Prior system task: [TL-SYS-001](TL-SYS-001-agent-operating-system.md).

Current authorized frontend: [TL-003 — UX/motion recovery](TL-003-ux-motion-recovery.md); [full request](TL-003-recovery-instructions.md).

Current bounded system hardening: [TL-SYS-003](TL-SYS-003-orchestration-hardening.md).
Future execution: [five bounded runs](../orchestration/RUN_PLAN.md); preparation only, stop after hardening commit.

- [TL-003 visual closure corrections](TL-003-visual-close-corrections.md): bounded V01 and isolated P2 corrections,17October2026.
- [TL-003 final QA](TL-003-final-qa.md): authorized Q12 only,19October2026; fresh comprehensive verification and final delivery, no merge/deploy.
