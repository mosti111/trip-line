# TL-SYS-002-DOCS-R1 — Reject filesystem aliases in ownership

Correction to [TL-SYS-002-DOCS](TL-SYS-002-DOCS.md), same task/milestone and selected
Sol worker. Original outcome/authority remain unchanged. The first delivered version
was rejected in review before approval; this contract bounds its rework.

Recovery, 4 October 2026: the second usage-limit interruption left the requested
correction present but undelivered. Selected Astra lead `/root/astra_resume`
confirmed the previous agents absent from the live tree and preserved both files.
Fresh selected Sol `/root/astra_resume/sol_r1` now verifies those existing changes
under the same two-file boundary; do not rewrite correct work. Return the exact
checks/report to the lead for recording. The original routing below is historical.

## Blocking finding

`filesystemProbe` verifies that a real path stays inside the repository, but accepts
internal symlink/junction aliases. Two textual paths to the same internal file can
therefore receive separate leases because ownership compares textual lowercased
paths. This violates the documented no-alias/single-writer contract. New files below
an aliased existing ancestor have the same risk. Review also requires the prose to
match strict FAIL/GAP approval behavior.

## Allowed correction

Worker/model: `/root/astra_lead/sol_protocol`, `gpt-6.1-sol`, prior explicit selection.
Only write `docs/orchestration/validate-state.mjs` and
`docs/orchestration/STATE_PROTOCOL.md`. Read-only: all other files including original
five protocol docs, state and reports. Every other path is forbidden. Lead alone
updates the task's state/lease. No app edits, extra infrastructure or new dependencies.

Reject noncanonical symlink/junction aliases, including an existing ancestor of a
new file, or canonicalize ownership to the same real target. Prefer matching the
already documented no-alias rule. Add a meaningful rejection fixture for internal
aliases alongside the existing escape test. Explicitly distinguish synthetic
injected-probe fixtures from actual filesystem tests; never claim the fixture creates
or exercises a real junction. Align STATE_PROTOCOL with actual strict behavior:
unresolved FAIL and mandatory automated/rendered GAP entries block approval.

## Acceptance, evidence and delivery

Original valid live state passes; existing 31 cases still pass; new alias regression
case(s) reject. Run validator, `--self-test`, `node --check` and scope/diff review.
Explain precisely how the previous bypass is blocked and report the final fixture
count. All desktop/tablet/mobile/motion/interaction behavior is unchanged; rendered
evidence is N/A for this documentation validator correction. Return IMPLEMENTED with
exact files/commands/limitations; lead re-reviews before docs approval and pilot.
