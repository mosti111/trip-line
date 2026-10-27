# Trip Line — current project status

28 October 2026, Europe/Istanbul. **V1.0 release candidate; not officially released.**
This is the authoritative current-state document. Begin onboarding at [START_HERE](docs/START_HERE.md).
Engineering verification, client creative approval and physical-device acceptance are separate.

## Canonical baseline

Cleanup branch: codex/v1-baseline-consolidation.
Starting commit: d917ebd440113e31fad0eae8f9166b2a73bcbd42, preserved on
codex/trip-line-v11-mobile-recovery and origin's matching branch at preflight.
Application behavior baseline: 1f6e453e765dc0bdb221aeeff127ed0cb9ae23ea (TL-014),
descendant of TL-011 mobile recovery 98c44f8. Later d917ebd records no-expiry TL-015.

Selected because this ancestry includes the reviewed phone/map work, Full default correction
and latest access authority. main does not contain these changes: after fetch, origin/main
89d73c3 differs by one main-only merge commit and 71 baseline-only commits. Local main
9a717a9 is two commits behind origin/main. No local or remote tags existed at preflight.
No main merge/rebase/tag was performed. The original working tree was clean.

V1.0 is the forward-looking candidate label; old V1.1/V6 names remain accurate history.
The frontend package already declares 1.0.0/private; it was not republished or version-bumped.
Final cleanup commit is the branch tip; exact committed checkpoints and verification are
recorded in [TL-016 report](docs/reports/TL-016-v1-baseline-consolidation.md).

## Implemented systems

Active app frontend-v2: Next App Router, React, strict TypeScript, typed EN/AR/TR content,
40 public paths per locale (120 URLs), actual Arabic RTL, twelve Turkish destinations,
nine services and ten-country secondary discovery. Local public startup needs no backend.
Native-scroll cinematic scenes, source-faithful identity, photographic Atlas, source-based
billboard, responsive phone compositions, journey selection/order, keyboard alternatives,
locale persistence and prepared editable WhatsApp/email inquiry are implemented.

Full is the unsaved motion default even with OS reduction; saved System follows OS and
saved Reduced remains reduced. Menu/footer choices, native scrolling, media/capability/
pause fallbacks remain. No intended visual/function change is part of consolidation.

## Verification and cleanup status

Historical TL-014 evidence: 59 unit tests, public120, V3, 36 mode cases and hosted checks
on the unchanged source. These are dated evidence, not fresh TL-016 claims.
Fresh TL-016 verification passes: frozen workspace install, typecheck, lint, 59 unit
tests, production build, public120, full V3 (16 groups/60 captures), 36 Chromium/WebKit
motion cases/108 effects/two fallbacks, 24 map cases/288 touch selections, 120 sitemap/
metadata paths and 45 image assets. Nine settled Reduced homepage comparisons are exact
PNG/semantic matches. All Markdown relative targets resolve; Git whitespace checks pass.
Exact widths/modes, retained tooling failures and comparison limits are recorded in
[TL-016 report](docs/reports/TL-016-v1-baseline-consolidation.md) and
[evidence](docs/qa/2026-10-28-consolidation/README.md).

Cleanup removes five proven unreferenced components, preserves all remaining runtime
source/config/assets/dependencies and replaces competing current-facing docs with canonical
guides. Fifteen old entry documents are archived; important historical QA/research stays
indexed at stable paths. [Inventory](docs/reports/TL-016-inventory.md) records classifications
and retained INVESTIGATE items. No storage/media/dependency purge is claimed.

## Remaining limitations and approval blockers

- Client creative approval remains pending; engineering QA is not aesthetic acceptance.
- Physical iPhone Safari typography, dynamic browser chrome, actual swipe feel and field
  performance are unverified. Windows Playwright WebKit is not a physical-device test.
- TL-011 records a Windows WebKit variable-font weight discrepancy and source-derived
  logo-resolution limits. No native-Safari workaround or new logo-quality approval was
  inferred. Physical Android was not tested either; use the recorded device checklist.
- Legal text, current business/partner claims, media clearance and final canonical domain
  need publication sign-off. Noindex/legal qualifiers remain.
- Backend/database/authenticated CMS, real server inquiries, booking/payments/accounts,
  media service, Turnstile and operational recovery remain unfinished/unverified.
- No checked-in CI workflow; historical QA scripts beyond the documented active harnesses
  are retained but not all re-certified.
- Candidate release operations and publication need explicit authorization.

## Deployment status

Consolidation does not deploy or modify Vercel. Repository TL-015 receipts record the
current [review URL](https://trip-line-tl014-motion-review.vercel.app/en), source 1f6e453,
Preview dpl_4ocoadtaM2bnbguyhjqybrNc5U5P in its isolated project.
Keep it open without automatic expiry until explicit user closure. Older TL-010/TL-012
deadlines are separately scoped. Historical binding/URL receipts are not a current provider
state guarantee; see [DEPLOYMENTS](docs/DEPLOYMENTS.md). No production alias, protection,
automation or billing setting was changed.

## Next recommended steps — not started

Review the current candidate creatively and on physical iPhone Safari; resolve launch
content/legal/media/domain/hosting approvals. Then explicitly approve a reviewed main
merge/final tag and separately scoped deployment. [QA_RELEASE](docs/QA_RELEASE.md) provides
the unexecuted Git procedure; [DEPLOYMENTS](docs/DEPLOYMENTS.md) provides retention and
environment cleanup recommendations. Do not resume historical phases or redesign.
