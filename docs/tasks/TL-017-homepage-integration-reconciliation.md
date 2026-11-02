# TL-017 — Homepage integration reconciliation plan

## Status

Review — approved by the user 2 November 2026 ("Approve TL-017"); decisions recorded and
plan delivered in the [report](../reports/TL-017-homepage-integration-reconciliation.md).
Claude Code, single agent.
Planning and decision recording only; no application source change. Follows the
read-only Stage 2A/2B recovery audit of the same date.

## Objective

Produce an approved, evidence-backed plan for bringing the external Codex homepage work
(integration snapshot, Audit Remediation 01, Stage 2A, Stage 2B) into
`codex/v1-baseline-consolidation`, or deciding not to. Record which claimed approvals the
user confirms and resolve conflicts with the frozen boundaries before any port begins.
Authorization: user request "Draft TL-017 spec" (drafting only; execution needs approval).

## User value

The external work replaces the homepage and touches typography, inquiry and public assets.
Porting it without recorded decisions would silently override [DESIGN_SYSTEM](../DESIGN_SYSTEM.md),
the inquiry boundary and the verification harnesses. A decided plan keeps each later port
small, reviewable and reversible.

## Current state

External repository (no remote, never part of this repo):
`%USERPROFILE%\Documents\Codex\2026-10-28\product-design-plugin-product-design-openai-5\outputs\homepage-remediation-01`,
worktrees under `%USERPROFILE%\Documents\Codex\2026-10-31\product-design-plugin-product-design-openai\outputs\`.
See "Unintegrated post-baseline design work" in [PROJECT_STATUS](../../PROJECT_STATUS.md).

| Layer | External identity | Real content versus baseline 457f27c |
|---|---|---|
| Integration snapshot | `8856185` (parentless, from 7806417) | Replaced homepage: removes SignaturePlaces, explorer, film, V6Motion and ServiceWorldsV3; adds `components/integration/` (Atlas JSX app, ServiceWorlds.jsx, AtlasContext, HomeStory, JourneyBuilder, runtime), `styles/integration-*.css`, 52 `public/assets`, 18 `public/service-assets`, 277 `public/review` files |
| Remediation 01 | `ca27a2e` | 26 files: Atlas/ServiceWorlds fixes, inquiry readiness gating, isolated-style generator and checks |
| Stage 2A | `3d3b621`; same content uncommitted in the 2A worktree | 5 new files (OpeningFlight controller, geometry, test, logo artwork split, CSS); HomeJourney mount; SiteShell logo split |
| Stage 2B | uncommitted in the 2B worktree on 3d3b621 | HomeJourney threshold subtree; scoped bridge styles in `integration-flow.css` |

Of 228 shared `frontend-v2` paths, 211 are byte-identical and most others differ only by
CRLF line endings. Real shared-file changes: `.gitignore`, `AGENTS.md`, `app/layout.tsx`,
`HomeJourney.tsx`, `Inquiry.tsx`, `SiteShell.tsx`, `package.json`, `proxy.ts`, `tsconfig.json`.
No new npm packages (lockfile differs by line endings only). Package hashes match
`SOURCE-AUTHORITY.json`: Stage 2A docking ZIP `1a08c01f…1adc`, Stage 2B spec ZIP
`2aed59fb…cf5e`, Stage 2B implementation ZIP `3ddfa686…76e0`.

The external snapshot omits all `scripts/verify-*.mjs`, `.env.example`, `.vercelignore` and
`README.md`. `verify-public.mjs` and `verify-v3.mjs` reference homepage sections the
integration removes; the external work never ran them.

## Scope

1. Decision register: for each item below, record the user's confirm/reject/defer answer in
   [DECISIONS](../DECISIONS.md) with date and source. Claims from Codex session records are
   not treated as approval until confirmed here.
   - D1 Integrated homepage replaces the baseline homepage composition (Signature Places
     rejection; explorer and film removal).
   - D2 Atlas compositions accepted, including Newsreader serif inside the Atlas only,
     superseding [DESIGN_SYSTEM](../DESIGN_SYSTEM.md) line 22 for that scope; or rejection.
   - D3 Self-hosted extracted Manrope/Noto Sans Arabic woff2 versus keeping `next/font`.
   - D4 Remediation 01 inquiry changes (hydration gating, disabled fieldset, loading
     status copy in EN/AR/TR, removed `name` attributes, `method="post" action="#inquiry"`)
     against the frozen inquiry boundary.
   - D5 Istanbul imagery accepted; Rize provisional.
   - D6 Stage 2A opening flight and header-logo docking accepted; 3 px endpoint provisional.
   - D7 Stage 2B bridge: final creative approval (currently pending).
   - D8 Open audit items A05, A06, A08–A12, A14: carry as known gaps or block the port.
2. Port plan, written into this task's report, that fixes:
   - Order: integration snapshot + Remediation 01 → Stage 2A → Stage 2B (only after D7).
     Each a separate approved task, feature branch off `codex/v1-baseline-consolidation`,
     task-scoped commits. Final numbering, including any prerequisite creative task
     created by the decisions, is set in the report.
   - Method: copy normalized (LF) file content from the hash-verified packages, never
     patches or Git history from the external repository; no CRLF-only changes.
   - Exclusions: `public/review/**`, the external `.gitignore` and `AGENTS.md` edits, the
     `proxy.ts` `review/` exclusion, and QA evidence files. Keep baseline `.gitignore`
     (`.env*`, `!.env.example`, `.vercel`), `.env.example`, `.vercelignore`, `README.md`,
     generated Next.js markers and all `scripts/verify-*.mjs`.
   - Adaptations to decide per file: `tsconfig` `allowJs`, `--webpack` dev/build flags,
     `predev`/`prebuild` style generation, `proxy.ts` `assets/`/`service-assets/` exclusions,
     font loading (D3), inquiry (D4).
   - Harness plan: which assertions in `verify-public.mjs`, `verify-v3.mjs` and motion/map
     scripts must change for the new homepage, and which baseline behaviors they must keep
     proving (120 public URLs, journey flows, RTL, Full/System/Reduced, map touch).
   - Asset provenance and licensing check for the 70 new public assets and Newsreader OFL.
3. Update [PROJECT_STATUS](../../PROJECT_STATUS.md), the [task index](README.md) and
   [CHANGELOG](../CHANGELOG.md) with the decided plan; write `docs/reports/TL-017-homepage-integration-reconciliation.md`.

## Out of scope

Any change under `frontend-v2/`, `frontend/` or `backend/`; copying external files; editing,
committing, branching or cleaning the external repository or its worktrees; Stage 2C;
new creative decisions or redesign; deployment, Vercel, main merge, tags, pushes beyond an
authorized feature branch. TL-015 review URL remains open.

## Approved experience

None yet. This task records decisions; it does not define new experience. Authoritative
external direction for review: Stage 2B `approved-specification/SPECIFICATION.md` and the
Stage 2A header-docking package README (the `stage-2a-implementation/README.md` describes
an earlier revision that differs from 3d3b621).

## Desktop, tablet and mobile behavior

N/A for this task (no rendering change). The port plan must name the widths later tasks
verify: 320, 390, 767, 768, 1024, 1440, plus the baseline QA set in [QA_RELEASE](../QA_RELEASE.md).

## RTL/localization

The plan must keep EN/AR/TR, English fallback, remembered language and actual Arabic RTL,
and confirm the Stage 2B Arabic/Turkish strings and Remediation 01 loading copy as existing
or newly approved content.

## Motion behavior

The plan must confirm Stage 2A respects the TL-014 policy (Full unsaved default, saved
System follows OS, saved Reduced stays reduced) via `calm` and
`html[data-motion-effective=reduced]`, and keep pause/capability/media fallbacks.

## Accessibility

The plan must cover inquiry behavior before hydration (D4), the 44 px bridge CTA, anchor
landing at `#atlas`, Atlas wheel input ownership and DOM reading order.

## Architecture constraints

Reuse existing systems and dependencies; no new packages. Note that the integration adds a
JSX Atlas app under `allowJs` and an isolated-style generator that later tasks must keep
deterministic (`styles:check`).

## Likely files

Planning reads only: external `homepage-remediation-01` commits, the two worktrees, package
folders under `outputs\`; baseline `frontend-v2/` HomeJourney, layout, Inquiry, SiteShell,
proxy, package/tsconfig and `scripts/verify-public.mjs`, `scripts/verify-v3.mjs`.
Writes: `docs/DECISIONS.md`, this task, its report, PROJECT_STATUS, task index, CHANGELOG.

## Acceptance criteria

- D1–D8 each have a recorded user answer (confirm, reject or defer) in DECISIONS.
- The report lists every file each later port will add, change or exclude, with the
  normalized-content source and package hash.
- The harness plan names each verify assertion to change and the baseline behavior it keeps.
- `git status` shows only documentation changes; the external repository and both
  worktrees are byte-unchanged (uncommitted Stage 2A/2B edits preserved).
- No later port task is started.

## Verification

From `frontend-v2`: `pnpm typecheck`, `pnpm lint` (documentation-only rule). Relative
Markdown links resolve; `git diff --check` passes. External repository: `git status --short`
and `git log --oneline --all` match the 2 November audit snapshot before and after.

## Documentation updates

DECISIONS entries D1–D8; PROJECT_STATUS "Unintegrated post-baseline design work" and
"Next recommended steps"; task index; CHANGELOG; matching TL-017 report.
