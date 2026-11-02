# TL-016 — Repository consolidation and V1.0 release candidate

Date: 28 October 2026. Status: Complete (consolidation); candidate awaits client/release approval.
Authority: current user request, preserved verbatim in [instructions](TL-016-instructions.txt).

## Scope and acceptance

Audit the whole tracked repository; select an evidence-backed baseline; create a dedicated
cleanup branch; remove only proven unreferenced material; consolidate onboarding, status,
architecture, design, motion, localization, QA and release/deployment guidance. Preserve
historical dates, decisions, evidence, source provenance and recovery references. Work solo;
this administrative cleanup supersedes historical delegated milestone execution rules.

Starting baseline: `d917ebd440113e31fad0eae8f9166b2a73bcbd42` on
`codex/trip-line-v11-mobile-recovery`; cleanup branch `codex/v1-baseline-consolidation`.
Full Motion source `1f6e453e765dc0bdb221aeeff127ed0cb9ae23ea` is its ancestor. The starting
tree is clean. Remote fetch is read-only; no tags exist locally or on origin at preflight.
`origin/main` differs by 1 main-only merge commit and 71 baseline-only commits.

V1.0 is the forward-looking product release candidate name, not a claim that historical
V1.1/V6 milestones were V1.0. No release/client acceptance is inferred. Preserve frontend-v2,
visuals, routing, content, motion semantics and inquiry behavior. Keep current TL-015 review
access open; no Vercel changes, deployment, merge, final tag or remote deletion. Existing
workflow permits feature-branch pushes; this request conditionally authorizes that workflow.

## Verification

Frozen dependency install; typecheck; lint; unit tests; production build; public 120-route
regression; V3 journey/localization/RTL/runtime checks; targeted Full/System/Reduced browser
checks; baseline-versus-cleaned rendered comparisons; docs links and Git whitespace/scope.
Record exact fresh results separately from historical proof. No physical Safari or creative
approval claim. Report under [TL-016 report](../reports/TL-016-v1-baseline-consolidation.md).

## Risks and approach

Use existing architecture and dependencies. Directory renaming, mass evidence relocation and
asset deduplication offer little benefit against consumer/provenance regression risk. Keep
ambiguous source and scripts as INVESTIGATE. Archive old entrypoint documents with a path
manifest and repaired relative links. Separate mechanical source cleanup from documentation
commits. Public/production resources and local secrets/dependencies/caches stay untouched.
