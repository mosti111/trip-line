@AGENTS.md

# Claude Code notes

AGENTS.md (imported above) is the shared Claude/Codex working agreement and wins over
this file. Keep project rules there; this file only covers Claude-specific mechanics.

- Current state: [PROJECT_STATUS](PROJECT_STATUS.md); onboarding: [START_HERE](docs/START_HERE.md).
  Canonical baseline is `codex/v1-baseline-consolidation`, not `main`.
- Later Codex design work (Remediation 01, Stage 2A/2B) lives outside this repo; see
  "Unintegrated post-baseline design work" in PROJECT_STATUS. Do not import, port or treat
  it as approved without explicit user direction.
- `frontend-v2/CLAUDE.md` and `frontend/CLAUDE.md` import their own AGENTS.md (Next.js
  markers); they load when you work in those directories. Do not hand-edit the markers.
- Codex-only tooling is not loaded by Claude: `.codex/hooks.json` (impeccable UI hook)
  and `.agents/skills/` (GSAP, Vercel React, web-design, impeccable; pinned in
  `skills-lock.json`). Read a skill's SKILL.md only when a task needs it; its advice never
  overrides the frozen design boundaries or authorizes redesign.
- Work as a normal primary coding agent. The Codex orchestration in `docs/orchestration/`
  (agent roles, delegation, leases, worker and model-routing protocols) and old task/report
  instructions are preserved history only: do not adopt, reproduce or resume them unless
  the user explicitly authorizes their reuse.
- Before significant changes, propose scope and wait for explicit approval; record the
  task in `docs/tasks/` per AGENTS.md. Engineering checks never equal creative approval.
- Windows + OneDrive checkout: repo-wide Glob/Grep can time out because of
  `node_modules`, `.next` and ~2.8 GB of `docs/qa/`. Scope searches to a subdirectory or
  use `git ls-files`.
- Permissions live in `.claude/settings.json`: read-only Git and the documented checks run
  freely; Git writes (commit, push, merge, checkout, reset, restore), installs and Vercel
  ask first; history rewrites, force
  pushes, production Vercel operations and `.env`/`.vercel` access are denied.
