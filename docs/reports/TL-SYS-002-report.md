# TL-SYS-002 — Persistent frontend orchestration

Status: Complete — SUCCESS. Final independent Astra approval: 5 October 2026,
Europe/Istanbul. Implementation and browser evidence were produced 4 October.
Scope: [authorized setup](../tasks/TL-SYS-002-orchestration.md).
Branch `feat/v3-bronze-journey`; tested application revision
`13b5afecde31cb0078c7980da2055a3b3edbaba8`. Current HEAD advanced independently to
`0ba5a97254e08d8d621dba4add4045604df5aa7a`, a TL-002 documentation-only commit.
The application trees are identical. No frontend reconstruction or deployment.

## Capability and architecture

The exposed collaboration tools support subagents and explicit different-model
selection with fresh/partial context. Full-history forks inherit their model.
Accepted dispatches: coordinator → `gpt-6-astra` lead `/root/astra_lead` →
`gpt-6.1-sol` worker `/root/astra_lead/sol_protocol`. The actual running root was
neither switched nor independently identified; dispatch acceptance is not backend
model attestation. Repeated usage-limit interruptions affected the delegated work;
the user's continuations resumed it with saved files and explicit ownership
reconciliation. The later lead is `/root/astra_resume`; routing/review records
identify its selected Sol worker. Final selected Astra `/root/astra_final` completed
the integration review on 5 October, approved TL-SYS-002 and released all ownership.
See [routing](../orchestration/MODEL_ROUTING.md) and
[actual lead review](TL-SYS-002-pilot-review.md) for dispatch and recovery evidence.

The [entry protocol](../orchestration/README.md) integrates existing authority,
atomic contracts, Sol implementation, Astra judgment checkpoints and five direct
implementation exceptions. [State protocol](../orchestration/STATE_PROTOCOL.md)
owns transitions, dependencies, exact-file leases and stale-session recovery;
[state.json](../orchestration/state.json) is the sole live ownership/status record.
[Review protocol](../orchestration/REVIEW_PROTOCOL.md) requires rendered frontend
evidence and covers motion, responsive behavior, accessibility and performance.
Corrections stay narrow; optional enhancements remain unstarted.

Fallbacks preserve contracts/evidence while reporting inherited models, unavailable
agents or sequential sessions honestly. Required Astra approval stays pending when
that reviewer is unavailable. Repository instructions cannot switch a root model.

## Files created

- `docs/tasks/TL-SYS-002-orchestration.md`: authorized setup specification.
- `docs/orchestration/README.md`, `MODEL_ROUTING.md`, `TASK_CONTRACT.md`,
  `REVIEW_PROTOCOL.md`, `STATE_PROTOCOL.md`: operating rules and reusable templates.
- `docs/orchestration/state.json`, `validate-state.mjs`: live state and read-only gate.
- `docs/orchestration/TL-SYS-002-DOCS.md`: bounded Sol implementation contract.
- `docs/orchestration/TL-SYS-002-DOCS-R1.md`: narrow alias-ownership correction.
- `docs/orchestration/pilot/TL-SYS-002-PILOT-001.md` and corresponding delivery:
  harmless resumption/ownership/approval pilot.
- This report and `docs/reports/TL-SYS-002-pilot-review.md`: results and lead review.
- `docs/qa/2026-10-04-orchestration/`: evidence README, reproducible capture script,
  capture/public/safety reports and nine selected browser screenshots.

## Files modified and preserved

Additive changes only: root `AGENTS.md` gains discoverable orchestration entry;
`docs/AI_HANDOFF.md`, `docs/FRONTEND_IMPLEMENTATION_PLAN.md` and `docs/README.md`
link the new layer without replacing prior TL-002 history; `docs/DECISIONS.md`
records TL-DEC-011; task/report indexes link system work and status conventions.

Product vision, approved design direction, design/motion/responsive systems,
architecture, frontend-v2 generated AGENTS markers and testing authority were
retained. Existing TODO, TL-002 task/report/evidence, TESTING and V3 documents were
preserved. The initial safety comparison confirmed all 18 dirty/untracked files
retained their original contents: five received additions, thirteen had identical
hashes. The later independent TL-002 documentation commit updated that baseline;
its content was preserved and all seven remaining tracked setup diffs are additive.
See the initial
[safety evidence](../qa/2026-10-04-orchestration/safety-check.json).

No application source, configuration, dependency, lockfile, V1 or backend change.
These agents performed no reset, stash, deletion, commit, branch switch or history rewrite.
The independent commit was inspected and preserved; no application paths changed.
Initial diff
and copies remain under ignored `tmp/orchestration-setup/`. Prior ignored public
verification output was backed up and restored after the fresh check.

## Pilot and review

Astra wrote the bounded protocol contract and separate harmless pilot contract;
Sol authored the protocol implementation. The first selected lead reviewed all
nine rendered captures and recorded their use and limits. The resumed selected
Astra `/root/astra_resume` independently approved the corrected protocol and
reviewed the fresh selected Sol `/root/astra_resume/sol_pilot` delivery.
The [pilot delivery](../orchestration/pilot/TL-SYS-002-PILOT-001-delivery.md)
was the worker's only written file. It passed live-state validation and 33
self-tests and demonstrated refusal/recovery for overlapping writers, stale
sessions and frontend approval without rendered evidence. Astra found no blocking
corrections. Exact evidence and the final decision belong in the
[pilot review](TL-SYS-002-pilot-review.md) and live state. This setup cannot approve
prior TL-002 aesthetics.

The first review rejected an internal filesystem-alias ownership loophole. Astra
issued R1 limited to the validator and state protocol. Sol added canonical-path
checks and two resolver regression cases; the suite now has 33 passing cases.
These are synthetic in-memory resolver tests, not actual junction creation. The
original FAIL and correction remain in state/review history; the later re-review
approved the corrected result explicitly.

The root coordinated inspection, additive discovery links, application checks,
browser capture and safety review. These are setup/integration responsibilities;
routine protocol implementation was delegated to Sol. No routine UI implementation
was undertaken by the coordinator or lead.

## Commands validated

Node v24.19.0; pnpm 11.25.0. From `frontend-v2/`:

| Command | Actual result |
| --- | --- |
| `pnpm typecheck` | Exit 0 |
| `pnpm lint` | Exit 0 |
| `pnpm test` | Exit 0; three tests in one file |
| `pnpm build` | Exit 0; production compilation and route generation |
| `pnpm start --port 3033` | Served local production preview; existing standalone warning |
| `node scripts/verify-public.mjs` with `QA_URL=http://localhost:3033` | Exit 0; 120 localized routes, six screenshots, interaction/fallback checks, zero browser errors |

From repository root: the dated capture script produced nine images at 1440×1000,
1280×800, 768×1024 and 390×844 across EN/TR/AR, desktop opening 0/25/50/75/100%,
touch and reduced motion. Assertions passed with no page errors. See the
[evidence manifest](../qa/2026-10-04-orchestration/README.md).
`git diff --exit-code -- frontend-v2 frontend backend` and `git diff --check` passed.
`node docs/orchestration/validate-state.mjs` passed with two tasks;
`node docs/orchestration/validate-state.mjs --self-test` passed all 33 cases.
Both validator and durable capture script passed `node --check`.
The final local-link check passed (see [machine result](../qa/2026-10-04-orchestration/link-check.json));
manual review confirmed authority/status boundaries, correction history and scope.
The [final safety check](../qa/2026-10-04-orchestration/final-safety-check.json)
confirms the independently updated HEAD and unchanged app. No failing mandatory
checks remain. The final selected Astra independently recorded PASS / APPROVED;
both tasks are approved and all task owners are null.

## Limits and current state

Leases and validation are repository protocol gates, not OS write locks; agents
must inspect actual diffs and obey ownership. JSON cannot prove evidence truth or
model identity. No continuous-motion timing, Safari/Firefox, physical-device or
field-performance certification. Full V3/resilience/reconstruction scripts were
not rerun for this documentation-only setup; prior TL-002 QA remains separate.
Local `next start` warns about retained standalone configuration; no deployment
packaging was changed. Screenshots demonstrate capture/review workflow only.

Setup changes are saved locally and uncommitted by these agents. Future sessions
read root AGENTS, the existing authority read order, then
[orchestration entry](../orchestration/README.md), live state and linked reports.
Do not start a reconstruction as a side effect of finishing this system task.

The saved next action is to stop until a new milestone is authorized. Recommended
next instruction in a user-selected Astra session:

> Continue Trip Line orchestration. Inspect the current approved state and define
> the first real frontend reconstruction milestone. Do not implement routine work
> directly; delegate implementation according to the repository orchestration protocol.
