# TL-SYS-003 validator delivery

Status: IMPLEMENTED, pending Root Astra acceptance; not self-approved. Direct
selected Sol /root/sol_hardening completed preserved partial validator work.
Root owns state migration, task, final report and review. No child agents spawned.

Changes: read-only Node validator preserves legacy path/alias/dependency/history/
lease/evidence/review gates and adds bounded:true/scope/deliveryReport declarations,
all pending policy2-task enforcement, current-run ownership and budgets, delivered
report existence, accepted-but-open milestone/run rejection and closed accepted
run ownership release. Archive schema1 remains compatible without fabricated fields.
Policy2 activeRun keeps original TL-003 approval history separate. CLI --state
validates archives; no package/CI change. See [schema](STATE_PROTOCOL.md).

Checks from repo root: node --check docs/orchestration/validate-state.mjs PASS;
node docs/orchestration/validate-state.mjs --self-test PASS59 synthetic tests;
live state and TL-SYS-002-approved-state archive structural PASS. Focused failures
cover pending ownerless declarations, missing delivered report/review, unsafe and
ambiguous paths, file/family ceilings, wildcard labels, missing frontend families,
accepted-open runs, ownership collisions/leases and budget excess/correction3.
No frontend checks/browser. Synthetic alias probes create no actual junctions.

Exact validator paths: validate-state.mjs, STATE_PROTOCOL.md and this delivery.
Expanded hardening paths are listed in the [combined delivery](TL-SYS-003-delivery.md)
and [commit manifest](../qa/2026-10-15-orchestration/commit-manifest.json).
Validation cannot prove evidence truth/freshness, real scope adequacy, rendered
quality, runtime models, worker liveness or total actual budget usage. No approval,
application change, commit, merge or deployment by the worker.
