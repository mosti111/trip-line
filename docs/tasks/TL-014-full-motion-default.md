# TL-014 — Full Motion by default

27 October 2026. Direct user authority; baseline
`396ebdf4c9dd264d10499d76ec528120f6173bf9`, existing branch
`codex/trip-line-v11-mobile-recovery`. One agent, no subagents.

Correct missing/invalid preference to Full in the shared resolver, prepaint
bootstrap and hydration defaults. Preserve explicitly saved Full/System/Reduced;
audit historical storage writes before any migration. Audit active CSS/component
gates without redesign, new dependencies, layout changes or animation replacement.
Preserve native scrolling, capability/performance fallbacks and pause controls.

Acceptance: fresh Full with either OS setting; Reduced persistence; System reacts
to OS changes; Full persists through reload/locale changes; selectors in menu and
footer; meaningful mobile touch motion in hero, Explorer, signatures and billboard.
Check 320/390/768, EN/AR/TR, Chromium/WebKit; desktop preservation and unsupported
feature fallback. Run typecheck/lint/unit/build/public/V3 and targeted regressions.
Physical iPhone Safari remains separate acceptance.

After checks: commit/push existing branch, then new isolated no-login Vercel review
deployment. Preserve existing production aliases and expiry. Use the existing
27 October 2026 18:22:45 Istanbul review deadline for the new isolated deployment;
do not extend any prior review window. Record exact source/deployment and QA in
[report](../reports/TL-014-full-motion-default.md). No main merge or production promotion.
