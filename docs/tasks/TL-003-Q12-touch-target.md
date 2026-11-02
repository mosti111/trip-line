# TL-003-Q12-R1 — mobile menu target

19 October2026. Genuine P2 discovered during final QA: mobile `.menu-button` is36×44px at AR390 (legacy max767 min-width36), below the approved practical44×44 primary-control target. Root inspected `tmp/frontend-qa/final-q12/touch-target-diagnostic.json` and native screenshot. This is an accessibility defect, not a visual redesign.

Same sole selected Sol `/root/sol_final_qa` owns exactly:

- `frontend-v2/styles/recovery-shell.css`
- `docs/orchestration/recovery/TL-003-Q12-R1-delivery.md`

Add only `min-width:44px` to the existing `.recovery-shell .menu-button` rule. Preserve height44, focus/menu behavior, desktop visibility, logo/languages, all other CSS and dependencies. Do not edit legacy V1 or broaden scope.

Acceptance: actual target at least44×44 in EN/TR/AR360/390/430 and844×390; tablet/header and 200% form/menu remain reachable; no overflow or hero/landscape regression. Capture native before/after; targeted affected production checks, then required final core/build/public/V3/resilience/media/reconstruction/throttled/contact/recovery gates against the corrected frozen artifact. Preserve first failures and baseline passing evidence with exact revision/fingerprint, never label pre-fix artifact final. Root independently reviews and accepts; maximum two correction cycles (this is cycle1). No merge/deploy/pushmain.

Root administrative exception5 scope amendment before edits: Root owns this contract and its links from the existing final-QA task/report/state. Single-writer governance makes delegation less efficient; expected checks are exact scope, state validation and independent rendered review. Sol alone implements the CSS correction.
