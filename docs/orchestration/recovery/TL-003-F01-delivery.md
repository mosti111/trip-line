# TL-003-F01 delivery — global navigation and session journey

Date: 5 October 2026. Status: IMPLEMENTED, pending independent lead production/rendered approval.
Worker: `/root/astra_recovery/sol_foundation`, selected GPT-6.1 Sol. No commit,
deployment, main change or self-approval. Scope: the exact nine reserved paths below.

## Result and integration

The global shell has the requested five-item desktop order, direct Türkiye link,
dedicated Hajj/Umrah link, language controls, conditional Journey count and bronze
Plan action. Home starts at 92px; scroll changes it to 72px translucent deep teal
with a 2px progress line. Secondary pages use a readable solid 72px header.
At 1280px all five labels fit alongside language, Journey and Plan; below 1280px
the native menu exposes all nine requested routes in their specified order.

Türkiye discovery has four existing source categories, all twelve places, featured
places, a changing large source photo, Explore/Add actions and secondary Beyond
Türkiye. The direct link remains ordinary navigation; the separate disclosure
button supports pointer/keyboard, Escape and visible focus.

`JourneyProvider` wraps the public shell. `useJourney()` exports `destinations`
(ordered source-ID strings), `journeyType` (known service slug, default `tours`),
`addDestination(id)`, `removeDestination(id)`, `moveDestination(id, offset)`,
`setJourneyType(type)`, `drawerOpen`, `openJourney()` and `closeJourney()`.
Hydration reads `sessionStorage['tripline-journey']` before any write. Only validated
IDs/order and journey type are persisted; malformed or unavailable storage falls
back to usable in-memory state. Dates, travelers and personal data are never stored.

`JourneyActions` exports `AddToJourney({id, locale, className?})` and
`PlanJourney({locale, id?, children?, className?})`. Add is idempotent and has
destination-specific accessible text plus `aria-pressed`. Plan serializes validated
`service`, `journey` and first `destination` through `journeyHref()` to the existing
localized contact/query parser. Existing `parseJourney`, `journeyMessage` and copy
exports remain. Existing homepage builder/contact components have not been rewritten
in F01; later workers must consume the global context through the contracted API.

The native journey dialog is 440px on desktop and a bottom sheet below 768px, with
contained scrolling, live ordered count, labeled reorder/remove buttons, useful empty
discovery, journey type and Continue planning. Escape/Tab/focus return are preserved,
including removal of the final stop and return from the mobile menu. Mobile sticky
Plan becomes View journey · N after the opening and hides for menu, drawer, visible
builder/inquiry, footer and a shrunken visual viewport indicating the keyboard.

Newsreader Latin/Turkish and Noto Naskh Arabic display fonts are loaded through
bundled Next font guidance with existing Manrope/Noto Sans Arabic controls/body.
`recovery-shell.css` supplies scoped display/control tokens, 1440/1280 widths,
logical gutters, 44px controls and shell styling. Existing page-family CSS is intact.
Photos/geography are not mirrored. Shell display styling does not overwrite all
existing page headings; later page families can use `--display-type`/`recovery-display`.

Per the appended contract staging refinement, `SiteShell` intentionally does not
mount `ExperienceProvider` yet. Phase 3 must explicitly activate the final enhancement
and fix its eligibility/all-dialog observation. No F01 advanced homepage choreography
was introduced; protected existing homepage/ScrollScene source remains untouched.

## Exact authored paths

- `frontend-v2/components/travel/SiteShell.tsx`
- `frontend-v2/components/experience/JourneyStore.tsx` (new)
- `frontend-v2/components/experience/JourneyDrawer.tsx` (new)
- `frontend-v2/components/experience/JourneyActions.tsx` (new)
- `frontend-v2/lib/journey.ts`
- `frontend-v2/lib/journey.test.ts`
- `frontend-v2/app/layout.tsx`
- `frontend-v2/styles/recovery-shell.css` (new)
- `docs/orchestration/recovery/TL-003-F01-delivery.md` (new)

Unrelated lead/parallel work was preserved, including related-destination source/tests,
profile module and orchestration documents. `next dev` regenerated `next-env.d.ts`
to dev type imports; this was not a deliberate authored scope edit. The lead owns
the coordinated build regeneration. No dependency or lockfile changes.

## Verification actually run

From `frontend-v2/`, `pnpm typecheck`, `pnpm lint`, and `pnpm test` all passed twice,
including the final run after implementation changes (all exit 0). The final suite
reports 32 tests: 7 journey tests (three retained plus four meaningful storage/reorder/
URL boundary tests) and 25 independently owned Turkish-place tests. `git diff --check`
passed; line-ending notices were informational.

Chromium dev verification at `http://localhost:3053`, reduced-motion mode, passed:

- EN/TR/AR at 1440×900: 92px header, all five primary links, twelve mega-menu places,
  focus preview, Add/count, desktop drawer, Escape and focus return.
- EN/TR/AR at 390×844: mobile header, menu, sheet, explicit Tab trap, Escape and no
  document horizontal overflow.
- Turkish at 1280×600: all five labels, Journey count and Plan fit without overlap.
  Navigation ends at x867.95; tools begin at x883.95 and end at x1216.
- Two destinations, accessible reorder/focus, journey-type change, session reload,
  contact-prefilled destination/service/ordered message, and language query retention.
- Sticky journey CTA after opening and suppression for drawer, builder and footer.
- Invalid JSON storage fallback; unavailable sessionStorage still supports Add.
- Direct pointer disclosure, destination-specific Add label, removal of last stop,
  empty state and fallback focus; 72px secondary/scrolled header and progress.
- Both clean main and final-regression runs report zero page errors.

Ignored local evidence:
`tmp/frontend-qa/f01/report.json`, `final-regression.json`, and
`{en,tr,ar}-{1440-header,1440-mega,1440-drawer,390-header,390-menu,390-sheet}.png`;
also `tr-1280x600-header.png` and `en-empty-drawer.png`. Temporary executable checks
are `tmp/frontend-qa/f01-shell-qa.mjs` and `f01-final-regression.mjs`.
Worker visually inspected TR desktop header/mobile menu, EN drawer, AR mega menu
and AR sheet; source photo orientation, connected Arabic, readable controls and
complete route access were visible. This is implementation evidence, not approval.

The first cold development compilation emitted one `Invalid or unexpected token`
page error. An early screenshot also mutated caret styling before late hydration;
captures were changed to preserve caret styling and wait for decoded mega photos.
The subsequent complete matrix and final regression passed with zero page errors.
This transient development observation is retained rather than concealed.

## Remaining gates

The worker did not run `pnpm build` or production verification: the lead coordinated
the preserved baseline/build output and now owns independent build and production
rendered review. No claim of production success or deployment is made here.
The current screenshots include the protected earlier homepage beneath the new
shell; they are not phase-2 homepage acceptance.

Physical keyboard/visualViewport behavior, Safari/Firefox, assistive technologies,
physical devices and field performance were not tested. The visualViewport suppression
is implemented; the automated mobile checks covered menu/drawer/builder/footer instead
of opening a physical software keyboard. Broader widths/modes/full route scripts,
normal-motion review and final page-family integration belong to lead/later gates.

All application editing has stopped for the lead's independent checks. Later work
is unstarted by this worker.
