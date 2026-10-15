# TL-SYS-003 orchestration hardening report

Status: APPROVED by Root Astra; hardening commit is the final action. Branch `feat/v3-ux-motion-recovery`; base checkpoint
`8ac57150d006ee0996379ef20d6b34e7e2e63b09`; application checkpoint `4b77150`.
Contract: [hardening task](../tasks/TL-SYS-003-orchestration-hardening.md).

## Routing correction and preserved work

The initial root dispatch repeated the historical arrangement in MODEL_ROUTING.md:
“In this session a delegated selected Astra directs/specifies/reviews under the
root coordinator.” Combined with the fallback requiring selected Astra review
when root identity was unknown, this was incorrectly used as a current dispatch
rule. The old rule did not require a nested lead when the root is already Astra.
The user explicitly identified the root as Astra and rejected the extra layer.

Root interrupted `/root/astra_hardening` and its child
`/root/astra_hardening/sol_validator`; their task, partial validator and protocol
changes were preserved. Root recorded the ownership transfer before resuming.
The direct fresh-context `gpt-6.1-sol` dispatch returned `/root/sol_hardening`.
The resulting topology is **Root Astra → bounded Sol worker → Root Astra
acceptance**. No new Astra was spawned after the correction. Root owns the single
acceptance review, state and commit. The worker cannot approve its own delivery.
Root identity is user-provided; tool selection acceptance is not backend model
attestation. The interrupted extra layer is disclosed, not recast as compliant.

## Scope and checks

Only orchestration documentation, validator, historical setup/pilot evidence,
checkpoint history and future contracts are in scope. Application source/config,
packages, build output, production preview and visual QA remain untouched.
The historical TL-SYS-002 screenshots are being committed as dated evidence;
they were not regenerated or newly visually approved.

The current user expressly limits checks to orchestration. Required fresh checks:
Node syntax, validator self-tests, live/historical JSON structural validation,
local-link/manifest consistency, Git whitespace and unchanged application trees.
No frontend typecheck, lint, tests, build or browser regression is claimed here.
The existing CLI is sufficient; no package or CI tooling expansion is necessary.

## Next boundary

STOP after this hardening commit. Exact next product run is **TL-003-C10 Contact /
Journey**, with **TL-003-QC10** scoped verification owned by the primary Sol unless
an additional QA worker is concretely justified. Implement, visually review,
targeted QA, root acceptance, then stop. Do not start International/FAQ/Legal in
that run. The remaining [five-run plan](../orchestration/RUN_PLAN.md) separates
visual inspection and blocker recording from corrections and final full QA.

## Limitations

Validation checks declarations, paths, leases, dependencies and evidence presence;
it cannot prove report truth, model identity, actual file ownership, rendered
quality or real worker liveness. Existing approvals remain revision-bound.
No deployment, merge, launch approval or whole-product creative acceptance occurs.
Root-authored task/state/report administration has same-agent review; Sol's
implementation receives root's independent acceptance review.

## Root acceptance — 2026-10-15T11:28:03.219Z

Reviewer: /root, user-identified Astra, role Astra lead/reviewer. Result: PASS.
I reviewed Sol's validator/schema, routing and budget rules, five-run dependencies,
future contracts, exact manifest and delivery/check evidence. The Run4 dependency
trap was corrected during implementation: old approvals stay revision-bound and
new correction tasks carry fresh approval. No blockers or optional work remain.

Fresh root checks passed: Node syntax; all59 synthetic validator tests; live27-task
state and historical2-task archive; Git whitespace; unchanged frontend-v2/frontend/
backend. Sol's focused clone-closure check passed314 Markdown links and166 state
references across54 files, and verified all19 approved objects match the About
snapshot. Evidence: [checks](../qa/2026-10-15-orchestration/checks.json),
[exact committed-file manifest](../qa/2026-10-15-orchestration/commit-manifest.json),
[delivery](../orchestration/TL-SYS-003-delivery.md).

Validator now enforces declared file/page caps, pending-task bounds, delivery and
review file existence, active-run membership/ownership budget, correction ceiling,
and accepted-run closure with released owners. CLI adds --state for archived JSON.
Legacy approvals remain untouched; declarations are not truth attestations.

The direct Sol worker hit a usage limit, was confirmed errored/quiescent, and
resumed under the same exact renewed lease after user continuation. No replacement
Astra or additional QA worker was dispatched. Historical extra-layer dispatches
remain disclosed. Worker writes stopped before root acceptance and ownership release.

Application code/configuration is unchanged. No frontend check/build, visual QA,
merge, deployment or Contact implementation occurred. Close activeRun, commit exact
manifest, and STOP. Full TL003 remains incomplete.
