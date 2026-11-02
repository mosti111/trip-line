# TL-017 report — Homepage integration reconciliation plan

2 November 2026. Task: [TL-017](../tasks/TL-017-homepage-integration-reconciliation.md).
Status: Review. Documentation only; no application source, external repository or
worktree was modified. Decisions: [TL-DEC-026](../DECISIONS.md).

## What changed

- Recorded the user's answers D1–D8 in DECISIONS (TL-DEC-026).
- Wrote this port plan; updated the task index, PROJECT_STATUS and CHANGELOG.

## Decision outcome

Confirmed: D1 (integrated homepage replaces baseline composition). Rejected: D2 (Newsreader
in the Atlas). Chosen: D3 (keep `next/font`). Deferred: D2b ivory Atlas scene, D4 inquiry,
D5 imagery, D6 Stage 2A, D8 audit items. Pending: D7 Stage 2B. Newly raised: D9 generated
Atlas images.

Consequence: no port can start as a straight copy. The integrated Atlas declares Newsreader
in `components/integration/atlas/styles.css`, `mobile-atlas.css` and their generated
`atlas-css/*.css.json` transports, so D2 requires an Atlas typography adaptation first.
That is creative work and needs its own approved task.

## Sources (hash-verified 2 November 2026)

External repository `homepage-remediation-01` (no remote): `8856185` integration snapshot,
`ca27a2e` Remediation 01, `3d3b621` Stage 2A. Stage 2B is uncommitted in the
`stage-2b-implementation\Source` worktree. Packages: Stage 2A docking ZIP
`1a08c01f39bc4d1d0140d96238ed81990a10e4670870dc7eb5b323ec6c231adc`; Stage 2B specification ZIP
`2aed59fb2e599b3450e1135292f2f01549c6ba55ee385f652a1fde36e509cf5e`; Stage 2B implementation
ZIP `3ddfa68655f6192b3eaede9877156f2e421d092b165cf7fa57a95504453f76e0`.

Port method for every later task: copy file content from `3d3b621` (or the Stage 2B
worktree) normalized to LF. Never cherry-pick, apply patches or import external Git history.
Files that differ from baseline only by line endings are not touched.

## Port sequence

| Task | Content | Precondition |
| --- | --- | --- |
| TL-018 | Atlas typography adaptation design (Manrope/Noto replaces Newsreader) | Approved creative scope; D2b answered |
| TL-019 | Integration layer port (snapshot + Remediation 01, minus inquiry) | TL-018 accepted; D5, D8, D9 answered or explicitly waived |
| TL-020 | Stage 2A opening flight | TL-019 complete; D6 confirmed |
| TL-021 | Stage 2B bridge | TL-020 complete; D7 approved |
| — | Remediation 01 inquiry changes | D4 confirmed; separate small task |

Each task: feature branch off `codex/v1-baseline-consolidation`, task-scoped commits, its own
report. No main merge, deployment or Vercel change.

## File plan

### Integration layer (TL-019)

Add (from `3d3b621`): `components/integration/` — `AtlasContext.tsx`, `HomeStory.tsx`,
`JourneyBuilder.tsx`, `ServiceWorlds.jsx`, `service-worlds.css`, `service-css.json`,
`runtime/navigation.ts`, `runtime/Travel.ts`, `atlas/` (`App.jsx`, `AtlasWheel.jsx`,
`FixedAtlasMedia.jsx`, `MobileAtlas.jsx`, `main.jsx`, `mobile-main.jsx`, `mediaRegistry.js`,
`destinations.json`, `styles.css`, `mobile-atlas.css`, `wheel.css`, `embedded.css`,
`completion.css`, `approved-imagery.css`, `fixed-atlas-media.css`, `targeted-corrections.css`,
`fonts.css`) and the matching nine `atlas-css/*.css.json`; `styles/integration-flow.css`;
`scripts/isolated-styles.mjs`, `scripts/isolated-styles.check.mjs`,
`scripts/contact-ssr.check.mjs`.

Add public assets (subject to D5/D9 and provenance review): `public/assets/` atlas masks,
outline, contours, ridge, Rize layers, `editorial-terrain-frame.svg`, `trip-line.svg`,
`mobile/`, `destinations/` (14), `atlas-approved/` (3), `atlas-complete/` (9),
`extraction-provenance.json`; `public/service-assets/` images, logo and provenance JSON.

Change: `components/home-v3/HomeJourney.tsx` (integrated composition, without
`<OpeningFlight/>` until TL-020); `package.json` scripts (`styles:*`, `predev`/`prebuild`,
`test:integration-styles`, `test:contact-ssr`); `tsconfig.json` `allowJs: true`,
`checkJs: false`; `proxy.ts` exclusion of `assets/` and `service-assets/` only.

Adapt rather than copy: Atlas CSS sources and regenerated transports (TL-018 typography);
`fonts.css` and font references to the `next/font` variables `--font-body`/`--font-arabic`.

Decide in TL-019 with evidence: `--webpack` on `dev`/`build` (external work only built with
webpack; baseline uses the default bundler).

Exclude: `public/review/**` (277 QA files), `proxy.ts` `review/` exclusion, external
`.gitignore` and `AGENTS.md` edits, `REMEDIATION.md` (record its content in the TL-019
report instead), `styles/integration-fonts.css`, `styles/integration-arabic.css`, all
extracted `*.woff2` in `public/assets` and `public/service-assets`, `Newsreader*.ttf` and
`Newsreader-OFL.txt`, the `app/layout.tsx` font change, `components/travel/Inquiry.tsx`.

Keep from baseline: `.gitignore` (`.env*`, `!.env.example`, `.vercel`), `.env.example`,
`.vercelignore`, `README.md`, generated Next.js markers in `AGENTS.md`/`CLAUDE.md`, every
`scripts/verify-*.mjs`, `next/font` loading in `app/layout.tsx`.

### Stage 2A (TL-020)

Add: `components/experience/OpeningFlight.tsx`, `lib/opening-flight.ts`,
`lib/opening-flight.test.ts`, `lib/trip-line-artwork.ts`, `styles/opening-flight.css`.
Change: `HomeJourney.tsx` mount; `components/travel/SiteShell.tsx` logo split into
`logoTextPath`/`logoAircraftPath` with `data-logo-aircraft`. Route knots are tuned to the
integrated layout; re-verify after TL-018 typography changes alter text geometry.

### Stage 2B (TL-021)

Change: `HomeJourney.tsx` threshold subtree; append the scoped bridge block to
`styles/integration-flow.css`. Source: uncommitted Stage 2B worktree, cross-checked against
`STAGE-2B.patch` in the implementation package.

## Harness plan

The integrated homepage removes selectors the required harnesses assert. Update in TL-019:

| Script | Current assertion | Replacement must still prove |
| --- | --- | --- |
| `verify-v3.mjs:66` | `.rh-signature-image` click reaches Cappadocia | A homepage destination entry (Atlas link) reaches a localized destination page |
| `verify-v3.mjs:135` | `.rh-film-frame video` error shows photo fallback | Media-error fallback on the remaining homepage video/photo surface, or a documented removal with reason |
| `verify-public.mjs:48` | Reduced System has no `.rh-film-frame video` src | Reduced System loads no autoplay media on the homepage |
| `verify-tl014-motion.mjs:15` | `.v6-home` `data-home-motion` native/static | Same contract on the integrated root (it keeps `v6-home` and sets `data-home-motion="native"`; confirm static under Reduced) |
| `verify-tl014-motion.mjs:74-76,142-143` | Signature landscape frames and film fallback | Equivalent Full/System/Reduced effects on the integrated sections |

Unchanged obligations: 120 public URLs, journey selection/order, EN/AR/TR with actual RTL,
Full/System/Reduced matrix, map touch selection, metadata/sitemap. Add to `pnpm test` or the
QA guide: `styles:check`, `test:integration-styles`, `test:contact-ssr`.

## Verification of this task

2 November 2026, from `frontend-v2` via `corepack pnpm` (pnpm 11.25.0; `pnpm` is not on
PATH in this shell): `typecheck` exit 0, `lint` exit 0 (pnpm's pre-run dependency check
reported "Already up to date"). Relative Markdown links in all changed files resolve;
`git diff --check` passes; `git status` shows only the six documentation files.
External repository: `git log --oneline --all` still shows `3d3b621`, `ca27a2e`, `8856185`;
Stage 2A worktree still lists 35 uncommitted entries; Stage 2B worktree still lists
`HomeJourney.tsx` and `integration-flow.css` modified. Test, build and browser checks were
not run (no source change).

## Remaining risks and required user decisions

- D2b, D4, D5, D6, D8 deferred; D7 pending; D9 not yet asked. TL-018 cannot be scoped until
  D2b is answered.
- D9: Atlas imagery is registered as generated prototype images. Publishing them as
  destination photography conflicts with the no-invented-content and media-clearance gates
  unless explicitly approved.
- Audit items A05, A06, A08–A12, A14 were not reviewed in this task; their content is in
  the external sitewide-audit package.
- External evidence covers only browser emulation at 7–9 fps; physical Safari/Android,
  200% zoom and field performance remain unverified.
- No port, creative adaptation or harness change has started.
