# TL-003-QH02 delivery — explicit static-stage verification

Worker: explicitly dispatched gpt-6.1-sol `/root/astra_resume/sol_static_qa` under
selected Astra lead `/root/astra_resume`. Dispatch selection is tool evidence,
not independent backend model attestation. Date: 6 October 2026, Europe/Istanbul.
Branch `feat/v3-ux-motion-recovery`, HEAD `a4a448b4bfe6bddac2d89cd79634248f7ee88ba3`
plus retained local H02/R1 and orchestration changes. No commits or dependencies.

## Exact scope

Only the three contracted QA scripts and this delivery file were written. App
source, state, existing ignored review helpers and unrelated dirty setup remain
read-only. The existing `verify-public.mjs` and `verify-v3.mjs` each gain one
four-line `QA_STAGE === 'static'` dispatch. Every default full-mode assertion is
preserved verbatim; full motion adaptation/execution remains a later phase gate.
The shared verifier records suite identity, exact cases, checks, screenshots,
errors, failure and stage under ignored `tmp/frontend-qa/recovery-static/{public,v3}`.
Each independent case gets fresh context/storage; persistence is checked only
within the journey case where it is expected.

Public static coverage: 120 HTTP routes, H1/lang, branded404/language redirect;
fifteen chapters/three simultaneous intents/Türkiye/Beyond; index/map quickview,
Explore/global Add; grouped regional filtering and existing PlanningBrief GET;
name/email/consent focus and prepared WhatsApp destination/stale edits; locale
query/cookie; separately scoped mobile menu and journey drawer Escape/focus;
decoded relocated film/play/pause/resume/hidden/offscreen; six existing public
template sizes/locales with screenshots/H1/overflow/loaded images; reduced motion,
saveData and no-JS three-locale semantics. Positive no-canvas/no-pin assertions.

V3 static coverage: keyboard activation of all three global intents; ordered three
stops/reorder boundary/remove focus; service/flexible dates/travelers GET/contact;
localized prepared-message order and stale invalidation; unknown/duplicate IDs and
invalid travelers; signature navigation/back/forward/refresh; all nine service links
keyboard-activated to their actual pages in all locales; manual map/index selection
survives guide events; 2500ms delayed Yalova retains the last decoded image with at
most two mounted; session stores only destination IDs/type and revisit restores
only those; six 1440/390 EN/AR/TR screenshots with 55–65% opening chapter ratio;
nonempty identical geographic path data, LTR maps and no photograph/geography flip;
hero glyph bounds/figure gutters at360/430 in all locales; touch390/1280 checkbox,
390 mobile menu and1280 desktop Türkiye menu taps; native no-pin/no-canvas;
short1280×600 native static; reduced/saveData/no-JS.
360/430 ratios are recorded without a strict55% lower bound at360, following the
lead's explicit acceptance of narrow-column reflow near the approximate target.

## Checks and execution

`node --check` on all three final scripts: PASS. Final `pnpm lint` from frontend-v2:
exit0. Both were repeated after the final bounded cancellation classification.
`git diff --check` for existing modified entrypoints: PASS. Their diff is exactly
eight added adapter lines. New source is also syntax-checked.

Production preview: root-owned frozen H02-R1 `http://localhost:3043`; this worker
did not start a build/server or write app source. Commands used from frontend-v2:
`QA_STAGE=static QA_URL=http://localhost:3043 node scripts/verify-public.mjs` and
the same environment with `node scripts/verify-v3.mjs` (PowerShell environment
assignments in actual execution).

Public worker full run: exit0, 120 routes, seven check groups, eleven cases/screens,
zero unexpected errors and212 retained expected cancellations. Actual last run
2026-10-06T07:57:04.439Z–07:57:59.214Z. Earlier public PASS at21:40:23Z on5October
is retained context, not a claim about the final helper. The last public run was
before the final small verified-navigation classification refinement.

V3 worker last full run: all eight behavioral groups passed, with23 cases and17
screens, but overall exit1 at the additional network watcher. Actual run
2026-10-06T07:54:08.266Z–07:56:13.734Z. Its only unexpected record was a delayed
same-origin GET/fetch RSC cancellation for `/en` after successful history restoration;
no page/console errors or media failures. **Do not label this overall run PASS.**

Per lead/root instruction, after the final small event-order fix the worker ran
targeted proof instead of repeating both expensive full matrices again. Actual
Chromium link→Cappadocia/reload/back/forward checks PASS, with two exact RSC aborts
correctly identified: one during explicit real-link activation, one callback after
the operation ended, retaining its request-initiation/history evidence. The verified
destinations were exactly `/en` and `/en/destinations/turkiye/cappadocia`; an unknown
destination remained unclassified. Targeted film decode/offscreen checks at390×844,
1280×900 and1280×600 PASS: each paused=true, videoWidth1280, MediaError=null.
The film abort itself did not recur in those targeted checks; earlier full-run
records plus the read-only HeroVideo lifecycle inspection are retained evidence.

The extra watcher now records expected cancellations separately, under exact
conditions: same-origin GET speculative RSC prefetch abort; same-origin GET/fetch
RSC abort during explicit harness navigation/disposal, or for a destination whose
URL/H1 was already verified in that fresh context (including normalized non-RSC
query); exact Istanbul film abort only during deliberate offscreen scanning/disposal
with actual paused/decoded/no-MediaError state; and static script CSP blocking only
in explicitly JavaScript-disabled contexts. Other errors remain fatal. Async film
inspection promises are drained before page disposal and the final error assertion;
disposal uses a snapshot obtained before closing the context.

Preserved exploratory failures under ignored evidence:
`public/report-first-abort-classification.json`,
`v3/report-first-helper-failure.json`, `v3/report-second-network-classification.json`
and `v3/report-third-event-ordering.json`. The first V3 helper also attempted a
mobile-menu tap at1280; read-only source confirmed the deliberately visible desktop
navigation, and the corrected test positively taps its Türkiye menu. A first
targeted navigation reproduction lacked a URL wait and timed out; its corrected
production flow and the final targeted classification proof passed. These are
helper/tooling corrections, with no application changes to make checks pass.

Final script SHA256:
`2600A4F91F733368C492ECA3C2878A3646B0AA6D09C7E741E812F93768329857`.
Source is frozen for the root's independent execution of **both final static
entrypoints** and rendered review. Final full-stage static acceptance is pending
those independent runs; no worker self-approval or final full V3 PASS is claimed.

## Limits

Only the explicit static stage is adapted. The prior legacy public canvas failure
remains historical evidence; no default motion requirement is deleted. This does
not approve phase3 motion, user creative acceptance, deployment, or main merge.
Chromium emulation is not physical-device, Safari/Firefox, assistive-technology
certification or field performance evidence. Build/typecheck/tests belong to the
root's coordinated frozen production checks and must be reported separately.
