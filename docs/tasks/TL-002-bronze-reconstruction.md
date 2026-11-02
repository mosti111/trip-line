# TL-002 — Bronze Journey reconstruction

Status: Review, 4 October 2026. Authorized by the user's supplied
[full reconstruction instructions](TL-002-reconstruction-instructions.md).

Stopped at the user's explicit request to document and commit work so far without
continuing. Final V3 QA is not passing; this task is not Complete. See the report
for outstanding asset/standalone redirect failures. Resumption needs user instruction.

## Outcome and boundaries

Rebuild the rendered experience into connected travel chapters, materially different
from V2. The supplied 60-part instructions are the acceptance specification. Preserve
all twelve Turkish places, nine services, ten-country secondary directory, EN/TR/AR,
real geography, approved fonts/content, prepared-message inquiry and noindex.
No backend, deployment, publication, accounts or reservation changes.

Starting clean revision: 18e1fd3 on feat/v3-bronze-journey. V2 reference: cc374eb.
TL-001 remains dated historical engineering evidence, not acceptance of this task.

## Sequence

A. Capture V2 at 1440×1000 and 390×844 before design changes.
B. Recompose hero and departure; verify phone and desktop.
C. Interactive service worlds; verify both.
D. Türkiye entrance and dominant destination explorer; verify both.
E. Portal sequence and destination-specific arrival/chapter detail pages; verify both.
F. Asymmetric editorial story; verify both.
G. Progressive planner route and arrival resolution; verify both.
H–J. Navigation, responsive/RTL and motion/performance refinements.
K. Full production checks and matched after screenshots.

## Implementation

Evolve home-v3, experience and travel components. Reuse existing GSAP/Motion/Lenis,
R3F lifecycle, SVG map, ViewTransition and inquiry boundaries. No new dependencies.
Server composition stays readable without JS; interactive selectors are client islands.
Use the supplied teal/ivory/sand/bronze palette, superseding older active token values.
Fine-pointer depth is bounded; reduced-motion/data-saver/native touch retain composition.
Arabic uses logical layout and connected text; photographs/maps keep orientation.

## Verification and completion

Run typecheck, lint, test, build and public/V3/resilience scripts on production.
Add meaningful journey boundary tests to address the missing Vitest suite.
Check 360×800, 390×844, 430×932, 768×1024, 1280×900, 1440×1000 in EN/TR/AR,
normal/reduced motion, keyboard, touch, WebGL and static fallback. Inspect screenshots.
Keep temporary images in tmp/v3-reconstruction/{before,after}; preserve reproducible
capture scripts and report chapter composition/interaction/narrative acceptance honestly.
Record material decisions, update handoff/phase status and write TL-002 report.

Implementation revision: `13b5afe`. See the [completion report](../reports/TL-002-report.md)
for command results, chapter acceptance, before/after evidence and explicit limitations.
