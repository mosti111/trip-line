# QA and V1.0 release preparation

Use Node 24.x / pnpm 11.25.0, from frontend-v2:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start --port 3003
```

In another terminal from frontend-v2:

```sh
node scripts/verify-public.mjs
node scripts/verify-v3.mjs
```

Set QA_URL for another origin; QA_OUT selects ignored evidence output. These scripts
launch Playwright Chromium; install with pnpm exec playwright install chromium webkit.
test:e2e is only a Playwright CLI entry; no checked-in Playwright test suite/config is
established. The scripts above are the documented working browser harnesses.
Unit tests are Vitest lib/*.test.ts; an empty suite is not a pass.

## Targeted verification

| Command/script | Scope |
| --- | --- |
| verify-public.mjs | 120 localized URLs, heading/language, unknown route/redirect and core public behaviors |
| verify-v3.mjs | Journey ordering, context transfer, locale/RTL, keyboard, responsive/fallback/runtime checks |
| verify-tl014-motion.mjs | Fresh Full defaults, saved System/Reduced, OS changes, real selectors, scene effects, pause and fallback |
| verify-v11-map.mjs | 24 viewport/locale cases, twelve touch selections each, 44px targets and overflow |
| verify-baseline.mjs | Settled Reduced homepage viewport PNG hashes/semantics at 390/768/1440 × EN/AR/TR |

TL-014 defaults to port 3039; always set QA_URL for consistency. Its QA_ENGINE can
select chromium or webkit; QA_WIDTHS is a JSON array (default [320,390,768]).
The settled comparison script uses QA_COMPARE as the path to a previous report.json.
Run it against a frozen baseline before cleanup, then against the cleaned build using
that report. It certifies only the captured settled Reduced viewports. Full motion and
journey interactions require their separate harnesses. WebKit screenshot CSP injection
is a known tooling issue; TL-014 omits WebKit screenshots for strict console checks.

Production builds locally use standalone output. next start currently serves production
checks but emits a standalone warning; do not report it as deployment. A build's dynamic
catch-all is not 120 static pages: verify the sitemap inventory and actual HTTP routes.
No CI workflow is checked in. No backend/database/device acceptance is implied.

From the repository root, run `node scripts/verify-docs.mjs` to check relative Markdown
file/directory targets across tracked and non-ignored docs. Set QA_DOC_OUT for a JSON
report. Fenced examples, external URLs and anchor-only links are excluded; heading
fragment spelling and remote URL availability are not validated by this checker.

## Evidence policy and test limits

Fresh TL-016 commands, report counts and comparisons: [consolidation report](reports/TL-016-v1-baseline-consolidation.md)
and [evidence](qa/2026-10-28-consolidation/README.md). Earlier results:
[TL-011](reports/TL-011-v11-mobile-recovery.md), [TL-014](reports/TL-014-full-motion-default.md).
Never present these historical counts as fresh.

Changes to UI require rendered desktop/tablet/phone, keyboard/focus, RTL, 200% text zoom,
reduction and fallback checks appropriate to the change. Accessibility remains a quality
requirement; the cleanup is not a new complete WCAG audit. Windows Chromium/WebKit and
emulated touch are tooling-scoped. Physical iPhone fonts, browser chrome, swipe feel and
field performance remain unverified until actual device evidence exists. Client creative
approval is separate from automated engineering checks.

Use the [TL-011 iPhone checklist](qa/2026-10-25-v11-mobile/IPHONE_CHECKLIST.md) for device
acceptance. Its Windows WebKit variable-font weight caveat is historical observed tooling
evidence, not proof of a native Safari defect. Physical Android is also untested here.

## V1.0 acceptance checklist

- [x] Frozen workspace install, typecheck, lint, 59 unit tests and production build pass; tooling failures recorded. No clean-room reinstall claim.
- [x] All 120 content URLs, sitemap, localization/RTL, metadata and 45 referenced image assets checked; source asset inventory unchanged.
- [x] Navigation, journey order/contact context and editable external inquiry pass current harnesses.
- [x] Full default and saved System/Reduced, OS changes, pause/fallback checks pass.
- [x] Nine settled Reduced viewport comparisons are exact; Full interactions checked separately; surviving runtime source unchanged.
- [x] Canonical docs, relative links, archive/recovery and Git scope checked.
- [ ] Client creative approval recorded against an exact revision.
- [ ] Physical iPhone Safari acceptance completed or explicitly waived by user.
- [ ] Legal, current claims/partners and media clearance approved for publication.
- [ ] Canonical domain, commercial hosting eligibility and operational ownership resolved.
- [ ] User explicitly authorizes release merge/tag/push and any deployment/indexing change.

These engineering boxes reflect TL-016's recorded scope, not broader device/creative
certification. Actual evidence is in PROJECT_STATUS and the TL-016 report.
No official release is created by completing cleanup.

## Later Git release procedure — unexecuted

After reviewing the exact candidate and obtaining release authorization, fetch and inspect
main and the candidate. main currently has a merge commit absent from the candidate; do not
assume fast-forward. Re-run QA on the proposed merge and resolve any divergence explicitly.

```sh
git fetch origin
git status --short
git log --left-right --oneline origin/main...codex/v1-baseline-consolidation
git diff origin/main...codex/v1-baseline-consolidation
# After user approves the candidate/merge plan, in a clean checkout:
git switch main
git pull --ff-only origin main
git merge --no-ff codex/v1-baseline-consolidation
# Run the approved QA suite on the merge; then, only with release authorization:
git tag -a v1.0.0 -m "Trip Line V1.0"
git push origin main
git push origin v1.0.0
```

Check that v1.0.0 does not already exist before tagging. These commands are recommendations,
not executed operations. A reviewed GitHub PR may replace the local merge path. Deployment
needs separate explicit target/project/configuration approval; see [deployment guide](DEPLOYMENTS.md).
