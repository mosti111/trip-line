# TL-016 — Repository inventory and disposition

28 October 2026. Starting tree: d917ebd440113e31fad0eae8f9166b2a73bcbd42,
3,828 tracked files. [Machine summary](../qa/2026-10-28-consolidation/inventory-summary.json)
records every top-level/subtree group, counts, bytes, duplicate scan and orphan candidates.
All tracked paths were enumerated; source imports, manifests, tooling, routes, docs links
and media hashes were inspected. This is not a line-by-line backend/security audit.

## Classification of the complete tracked surface

| Surface | Starting files | Class | Disposition |
| --- | ---: | --- | --- |
| Root README/status/AGENTS/TODO | 4 | CONSOLIDATE / ARCHIVE | Replace competing active text; archive original prose with blob/path manifest |
| Root preview ZIP | 1 | KEEP | Original approved design pack, not disposable temporary download |
| Root .gitignore, skills-lock.json, .impeccable config | 3 | KEEP | Existing local-output/skill provenance policy is sufficient |
| frontend-v2 app routes | 17 | KEEP | Includes historical route groups/preview; consumers exist |
| frontend-v2 components | 66 | KEEP / DELETE / INVESTIGATE | Delete five proven orphans; preserve remaining current/historical consumers |
| frontend-v2 lib | 20 | KEEP / INVESTIGATE | Includes tests/current content; api.ts/metadata.ts future-platform scaffolding retained |
| frontend-v2 styles | 25 | KEEP / INVESTIGATE | Cascade/dynamic selectors make absence of a simple literal insufficient deletion proof |
| frontend-v2 public | 84 | KEEP / INVESTIGATE | Source-backed media, dynamic filename use and historical image consumers retained |
| frontend-v2 scripts | 58 | KEEP / INVESTIGATE | Primary public/V3/TL-014/mobile harnesses retained; dated capture/package scripts indexed as historical |
| Other frontend-v2 config/docs | 16 | KEEP / CONSOLIDATE | README refreshed; package/lock/generated markers and config untouched |
| frontend (original demo) | 50 | KEEP | Historical implementation/recovery, not active release root |
| backend | 34 | KEEP | Unfinished source/migrations; no cleanup proof or production acceptance inferred |
| docs/qa | 3,242 | KEEP | 2,814,040,161 bytes of dated proof including important failures, not application build output |
| docs/references | 28 | KEEP | Approved/source assets and original visual evidence |
| docs/design-preview | 12 | ARCHIVE in place | Historical prototype with relative media/script consumers |
| docs/orchestration | 79 | ARCHIVE in place | Preserve state/contracts/history; no current execution authority |
| docs/tasks, docs/reports | 59 | KEEP / CONSOLIDATE | Original scope/outcomes retained; indices rewritten |
| Other docs | 30 | CONSOLIDATE / ARCHIVE / KEEP | Canonical guides refreshed; unique historical research/contracts explicitly indexed |

The machine summary has precise group breakdowns; counts above describe the starting
tree before new docs/harness and five deletions. ARCHIVE in place means historical,
clearly indexed material kept at stable paths to protect references, not physical moves.

## DELETE — actual removals

All five files were unreachable from every app/proxy entry in a static relative/alias
import graph, then checked with whole-source/script reference searches: declarations only,
no consumers, no file-based routes or public URL contract. No export barrel/package export
was found. Current HomeJourney imports V6Motion, not HomeMotion.

- frontend-v2/components/experience/ContextCursor.tsx
- frontend-v2/components/experience/ExperienceProvider.tsx
- frontend-v2/components/experience/JourneyChapter.tsx
- frontend-v2/components/experience/ScrollScene.tsx
- frontend-v2/components/home-v3/HomeMotion.tsx

Total: 281 source lines removed. [Deleted-file manifest](../qa/2026-10-28-consolidation/deleted-source.json)
records byte sizes and original Git blobs. Recover any listed file with
`git show d917ebd:frontend-v2/components/home-v3/HomeMotion.tsx` (substitute its path).
No media, dependency, local environment, cache, remote branch/tag or Vercel resource deleted.

## CONSOLIDATE / ARCHIVE — actual changes

15 previous entry documents are preserved under
[pre-v1-consolidation](../archive/historical-material/pre-v1-consolidation/manifest.json).
Original prose/dates/commit references remain; relative Markdown links were rebased.
Current README/PROJECT_STATUS/START_HERE/AGENTS and architecture/design/motion/responsive/
routes/QA/deployment/decision/changelog guides form the active system. AI_HANDOFF,
phase plan and TODO remain short compatibility pointers. Historical task/report indices
are preserved before replacing them. No dated QA JSON or image was rewritten/relocated.

## KEEP / INVESTIGATE — intentionally retained

- Static scan found 366 identical-media hash groups involving 1,036 tracked files.
  Identical bytes do not make a public URL, dated QA capture or approved preview expendable.
  Dynamic place/country filenames, provenance and historical consumers prevent safe bulk
  deduplication. All are retained; no storage reduction is claimed.
- lib/api.ts and lib/metadata.ts, unused-looking public components and old globals/journal/
  mobile/recovery-motion CSS are retained as INVESTIGATE. They are historical/platform
  scaffolding; removing the whole family needs explicit contract/asset review.
- HeroAircraft and BronzeJourney have actual imports from retained modules. Three/R3F/Drei
  therefore cannot be removed on the basis of the current homepage having no canvas.
- TanStack Query has no literal application import in this audit; it remains INVESTIGATE,
  linked to future platform intent. Lenis is superseded at runtime but has historical script/
  dependency context. No dependency or lockfile change is necessary for low-risk consolidation.
  React DOM is required by the framework despite no direct source import.
- Existing capture/review/package scripts may hardcode historical ports/selectors. Keep as
  dated evidence tooling; use only commands listed in QA_RELEASE for current default QA.
  They are not all re-certified by this task.
- No tracked node_modules/.next/target cache was found. Tracked docs/qa logs are intentional
  verification evidence. Existing ignores already cover caches, environments, local tools and tmp.
  Ignored local caches/downloads were not swept because they can contain recovery/session state.
- Existing journal/preview APIs are not proof of functioning backend/CMS. Routing was preserved.
- No checked-in .github workflow exists. Adding CI is a separately scoped recommendation.

## Follow-up candidates, unstarted

If repository transfer/storage becomes a problem, approve a dedicated evidence packaging
plan with manifest, checksum and tested retrieval before removing any QA recordings.
If dependency reduction becomes useful, approve a separate source/route/bundle audit and
frozen-install validation. Neither is needed to identify the V1.0 candidate safely.
