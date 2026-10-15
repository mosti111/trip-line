# Completion reports

Orchestration setup: [TL-SYS-002 report](TL-SYS-002-report.md) and
[Astra pilot review](TL-SYS-002-pilot-review.md). System reports may use TL-SYS
identifiers. Worker deliveries and review artifacts link from the
[live orchestration state](../orchestration/state.json); they do not replace
the significant-task completion report.

Every completed significant task creates/updates TL-###-report.md using
[REPORT_TEMPLATE.md](REPORT_TEMPLATE.md), paired with its [task](../tasks/README.md).
Preserve the supplied TL-SYS-001 identifier for the system report.
Report Completed / Partial / Blocked honestly. Record exact commands actually run and
separate current results from historical evidence. Never hide deviations or claim
unrun tests, browser coverage, deployment or completion from source alone.

Link durable QA evidence; regenerable output belongs in ignored tmp/frontend-qa/.
Keep secrets/customer data out of reports. Material decisions belong in
[DECISIONS.md](../DECISIONS.md), linked rather than duplicated. Suggestions remain
unstarted until authorized.

First report: [TL-SYS-001](TL-SYS-001-report.md).
Current frontend reconstruction: [TL-002](TL-002-report.md).
Prior frontend delivery: [TL-001 — Bronze Journey continuation](TL-001-report.md).

Current recovery: [TL-003 live report](TL-003-report.md).

Current bounded system hardening: [TL-SYS-003](TL-SYS-003-report.md).
Future execution: [five bounded runs](../orchestration/RUN_PLAN.md); preparation only, stop after hardening commit.
