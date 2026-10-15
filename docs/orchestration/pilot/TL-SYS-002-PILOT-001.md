# TL-SYS-002-PILOT-001 — Prove safe orchestration resumption

## Task, milestone and role

Task ID: TL-SYS-002-PILOT-001. Milestone: TL-SYS-002.
Contract owner/reviewer: `/root/astra_resume`, explicitly selected `gpt-6-astra`,
successor to `/root/astra_lead` after the recorded usage-limit interruption.
Worker: fresh explicitly selected `gpt-6.1-sol` at
`/root/astra_resume/sol_pilot`, dispatched only after protocol approval.

## Objective and reason

Produce one concrete resumption walkthrough proving that a worker can obey a
narrow contract, execute checks and deliver reviewable evidence. The current
system rules are the input; the result must help a fresh orchestrator find the
next authorized action without granting itself new product scope.

Current state: protocol implemented and awaiting lead review when this contract
was written. Desired state: protocol approved, pilot implemented, verified and
reviewed; setup approval still waits for parent's app/browser and scope results.
Base application revision: `13b5afecde31cb0078c7980da2055a3b3edbaba8`.

## Scope and dependencies

Only write `docs/orchestration/pilot/TL-SYS-002-PILOT-001-delivery.md`.
Read-only: all repository files; notably `../state.json`, `../README.md`,
`../STATE_PROTOCOL.md`, `../validate-state.mjs` and this contract.
Forbidden writes: every other file, all app/source/config, state, protocol,
governance, reports, user changes and external systems. No commits or cleanup.
Dependency: TL-SYS-002-DOCS must be APPROVED before dispatch. Lead alone reserves
and releases this exact path and records state transitions.

## Design and device behavior

Design intent: concise readable Markdown with concrete current IDs and decisions.
Desktop, tablet, mobile, motion and interactions: unchanged; this pilot is
documentation-only. Parent exercises existing rendered browser workflow separately.
Accessibility: meaningful headings and links; no color-only status information.
Performance: run built-in-only validator and in-memory self-tests; no dependencies.
Do not modify visual output, invent a defect to repair, approve yourself or call
the previous TL-002 frontend aesthetically accepted.

## Acceptance and verification

1. Record the exact current milestone/task statuses, app revision and your owner.
2. State the next valid action now and after setup approval. After approval, stop
   until new user authorization; a suggested future milestone remains unstarted.
3. Work through three concrete failures: a proposed second writer on this delivery
   path, a lease from an interrupted prior session, and frontend approval missing
   rendered evidence. Explain refusal and the precise authorized recovery.
4. Run `node docs/orchestration/validate-state.mjs` and
   `node docs/orchestration/validate-state.mjs --self-test` from repository root;
   record actual exit/result and tested rejection cases. No fabricated pass.
5. Inspect `git status --short`; list only your own delivered file, distinguish
   concurrent parent/lead writes, and state that no other file was modified by you.
6. Include requested model, dispatch handle, limitations, evidence, deviations and
   blocking corrections (if any). Link state, contract and applicable protocol.

Visual evidence required: N/A for this documentation-only task. Parent's separate
browser screenshots prove the verification path; they do not confer frontend
design acceptance. Automated evidence is this exact delivery plus CLI results.

## Deliverable/report

One Markdown delivery with result, routing, current-state snapshot, concrete
walkthrough, commands/results, files touched, evidence, blockers and limitations.
Lead inspects it and owns review/state. Return the delivery path and exact command
results; do not continue into real frontend work.
