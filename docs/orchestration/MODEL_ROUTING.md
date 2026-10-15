# Model routing and capability evidence

Repository prose cannot select or switch a runtime model. Use the actual exposed
delegation interface, not model names in a prompt. Recheck capabilities each new
environment/session; retain prior evidence as dated history, not a current promise.

## Current topology — 15 October 2026

Root Astra -> bounded selected Sol -> the same Root Astra acceptance. Root owns
decomposition, contracts, state, review and Git/checkpoint work. No nested Astra,
outer coordinator or second substantive review is permitted. One primary Sol does
implementation and QA by default; at most one additional QA worker needs a concrete
recorded reason. Workers do not spawn agents.

Actual corrected hardening topology:

```text
/root                    Astra, identified by the direct user instruction
  /root/sol_hardening     explicitly selected gpt-6.1-sol, fresh context
/root                    same Astra final acceptance
```

The user identified the root as Astra. Tool-accepted Sol selection is routing
evidence, not independent backend model attestation. No additional QA worker is
needed. The earlier /root/astra_hardening and its sol_validator child were
interrupted before this reassignment; partial work was retained and ownership
explicitly reconciled. Their topology is superseded history.

The precise misleading rule below was: “In this session a delegated selected Astra
directs/specifies/reviews under the root coordinator.” Treating an unknown root
as automatically requiring another selected Astra turned dated setup evidence
into a dispatch rule. Both interpretations are superseded. A user-selected Astra
root directly contracts Sol; unknown runtime metadata is disclosed and never by
itself authorizes spawning an Astra layer. Repository prose cannot switch models.
See [budgets](README.md), [five runs](RUN_PLAN.md) and
[hardening task](../tasks/TL-SYS-003-orchestration-hardening.md).

## Historical environment — 4 October 2026

The collaboration interface exposes `spawn_agent` with explicit `model`,
`reasoning_effort` and `fork_turns`, plus messaging, status and interruption. Model
overrides are supported for fresh (`none`) or partial-context forks; full-history
forks inherit the parent and do not accept overrides. There are four concurrent
slots including the root. Do not fill them with speculative work or overlap owners.

Actual setup topology:

```text
/root                         coordinator; runtime model unverified here
  /root/astra_lead             explicitly requested gpt-6-astra
    /root/astra_lead/sol_protocol  explicitly requested gpt-6.1-sol
```

The dispatch tools accepted explicit selection and returned task handles. This is
evidence of supported explicit routing invocation, not independent backend model
attestation. The root model was neither switched nor independently identified.
The lead and worker delivery/review records persist exact requested routing and
returned handles. A later pilot is a separate contract and must be reported with
its actual handle, verification and review outcome; protocol implementation alone
does not prove that pilot.

Historical setup wording, superseded 15 October 2026: “The ideal future topology
is a user-selected Astra root with explicitly dispatched Sol workers. In this
session a delegated selected Astra directs/specifies/reviews under the root
coordinator.” That dated arrangement is not a current fallback or dispatch rule.

After two usage-limit interruptions, the prior lead/worker no longer appeared in
the live agent tree. On 4 October 2026 a fresh explicit Astra dispatch returned
`/root/astra_resume`; its fresh explicit Sol correction-verification dispatch
returned `/root/astra_resume/sol_r1`. The state writer reconciled the prior still-live
lease based on confirmed agent absence and retained all partial work. The separate
pilot uses its own dispatch recorded in the [pilot review](../reports/TL-SYS-002-pilot-review.md)
and [state history](state.json). These invocations retain the same unverified-root
and no-backend-attestation limitations as the initial topology above.

## Probe before dispatch

1. Inspect available tool documentation: agent creation, model choices, override
   constraints, context inheritance, slots, messaging and worker status/wait tools.
2. Inspect the current model only through trustworthy exposed runtime/UI metadata;
   if none is available, record it as unknown. Do not infer it from role text.
3. Confirm user selection and create a narrow approved contract. Select the exact
   model via the tool argument with supported fresh/partial context; provide all
   authority paths because a fresh worker lacks conversational assumptions.
4. Record timestamp, tool, requested model/context, returned handle, outcome and
   limitations in the task/report/state history. Accepted calls show explicit
   selection support; failures must remain failures in the record.
5. Preserve exclusive ownership and approved dependencies regardless of routing.
   Verify actual delivery and independent review; do not use routing as QA evidence.

## Supported fallback

| Available capability | Workflow and honest label |
| --- | --- |
| Explicit heterogeneous routing | User-selected Root Astra directly contracts selected Sol; same root accepts; record accepted dispatch evidence. |
| Agents but inherited/single model only | Keep contracts, ownership, evidence and independent role review; report actual inherited/unknown model and no heterogeneous routing. Enable exact routing later without changing the schema. |
| No agents, model selectable between sessions | Sequential user-selected Astra specification/review and Sol implementation sessions with persisted contracts, leases and reports; never imply concurrent delegation. |
| No agents or model selection | Sequential bounded implementation and separate review phases in the available model; disclose missing Astra/Sol selection and independent reviewer. Do not claim Astra approval in state until a selected Astra review occurs. |
| Routing request rejected or unavailable mid-task | Record failure, preserve work, reconcile ownership, and use only a supported fallback that retains acceptance. Required independent/model review remains pending. |

A fallback changes execution topology, never the design, evidence, ownership or
approval bar. Where the required Astra review cannot occur, record `BLOCKED` or
`REVIEW_REQUIRED` and the missing capability; do not forge an `APPROVED` record.
Direct lead edits still require a documented [exception](README.md).
