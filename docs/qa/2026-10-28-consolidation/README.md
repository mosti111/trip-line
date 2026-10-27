# TL-016 fresh evidence — 28 October 2026

Source baseline d917ebd; cleaned branch codex/v1-baseline-consolidation.
Local production ports: 3040 before cleanup, 3041 after. No deployment.

[Report](../../reports/TL-016-v1-baseline-consolidation.md) distinguishes fresh execution
from historical TL-011/TL-014 results. [Inventory summary](inventory-summary.json) covers
the whole starting tracked surface; [deleted source](deleted-source.json) records
recoverable blobs for five removed components. Raw regenerable screenshots remain ignored
under tmp/consolidation. This directory packages the final compact results/logs:

- [Verification summary and command ledger](verification-summary.json).
- [Original viewport hashes](baseline-viewports.json), [cleaned exact matches](cleaned-viewports.json).
- [Public120](public.json), [V3 journey/responsive](journey.json).
- [Motion preferences/scenes](motion.json), [touch map](map.json).
- [Sitemap, metadata and asset checks](routes-metadata-assets.json), [executed ad hoc verifier](verify-integrity.mjs).
- [Source preservation](source-preservation.json), [Markdown relative targets](doc-links.json).
- [Typecheck](typecheck.txt), [lint](lint-final.txt), [59 unit tests](test.txt), [build](build.txt).
- [Failed initial readiness attempt](baseline-failed-attempt.txt); it was corrected in the QA harness, not counted as a product pass.

Baseline install/typecheck/build and final motion/map logs are also retained here. No
physical device or external environment change is implied by local production checks.
Packaged text logs normalize trailing whitespace/final blank lines for Git hygiene;
raw local command output remains under ignored tmp/consolidation. Result content is unchanged.

Scope limits: settled Reduced screenshots are not Full motion acceptance. Headless
Chromium/WebKit is not physical iPhone Safari; no field FPS or client creative claim.
Failed tooling/setup attempts are retained separately and never counted as product passes.
