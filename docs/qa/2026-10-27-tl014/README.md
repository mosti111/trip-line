# TL-014 — motion default evidence

27 October 2026. Local frozen application build `TUbZ5fNRamayg1Fs60Er0`.
[Task](../../tasks/TL-014-full-motion-default.md),
[report](../../reports/TL-014-full-motion-default.md).

- [Core command logs](core/): typecheck, full ESLint plus final verifier ESLint,
  59 passing Vitest tests and default Next Turbopack build.
- [Public regression](production-check.json): 120 routes, six captures, five groups.
- [Full V3](v3-verification.json): 60 captures, 16 groups, zero runtime errors.
- [Desktop comparison](desktop-comparison.json): settled 1440x1000 EN/AR/TR hero
  screenshots have zero changed RGB pixels against the pre-change baseline.
- [Final motion-policy matrix](motion-matrix.json): PASS, 36 fresh-mode cases,
  108 scene/billboard checks and two engine fallback cases, zero application or
  console errors. [Strict WebKit](webkit.json) passes all 18 cases. Initial passing
  Chromium phone cases are preserved in
  [the phone report](chromium-phones-with-tablet-failure.json); its later tablet
  assertion failed and is not counted as a pass. The corrected
  [tablet run](chromium-tablet.json) passes separately on the same application.
- [Selected captures](captures/) show Chromium EN hero and WebKit AR Explorer
  before/after. They were visually inspected. WebKit captures are from the separate
  diagnostic capture run, not the strict final console run.
- [Failures/diagnostics](failures/) retain the viewport target/scale-unit verifier
  failures, unsupported mobile-WebKit wheel input, and screenshot-induced CSP
  errors. The report explains their diagnosis; none was hidden by a CSP change.

Phone 320/390 and tablet 768, EN/AR/TR, both OS reduction settings are covered.
Mode histories verify that root choice/effective/layout attributes do not flip
between the prepaint bootstrap and hydration. Saved Reduced/System/Full reloads,
System OS changes, Full locale selection, menu/footer access and billboard pause
are exercised. Motion samples include hero, Explorer and all three signatures.

Chromium uses native CDP touch scrolling. Mobile WebKit uses programmatic native
scrolling plus touchscreen taps; the automation exposes no swipe/wheel dispatcher.
WebKit engine verification is not physical iPhone Safari certification. Field
performance and client creative acceptance are not established here. Raw local
captures live under ignored `tmp/frontend-qa/tl014/`.
