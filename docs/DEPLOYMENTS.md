# Deployment context and retention recommendations

28 October 2026. Consolidation makes **no Vercel changes and no deployment**.
Project/deployment details below are dated repository receipts from 25–27 October,
not a live provider-control-plane inspection or guarantee of current endpoint availability.
Do not redeploy merely to update V1.0 naming.

## Current review policy

[TL-015](reports/TL-015-review-access-no-expiry.md) records stable review access:
[English review](https://trip-line-tl014-motion-review.vercel.app/en),
[Arabic review](https://trip-line-tl014-motion-review.vercel.app/ar),
[Turkish review](https://trip-line-tl014-motion-review.vercel.app/tr).
Keep it open without automatic expiry until explicit user closure. No old expiry
instruction may be applied to this project.

| Environment | Recorded binding | Scope / retention |
| --- | --- | --- |
| TL-015 current review | project prj_Lf4M8KHEMsLrBP5YXqn9dbsspL0g; Preview dpl_4ocoadtaM2bnbguyhjqybrNc5U5P; source 1f6e453 | No deadline/login; retain current stable alias/project |
| TL-014 old generated review | Same isolated project; earlier generated URL ends jtprphtw8 | Frozen old deadline/config; superseded by TL-015 alias, do not reuse |
| TL-012 older public V1.1 | prj_9pbqRH1MGonwCvNeQ20knZhH29Zv; dpl_DQF8DKuSvtPMpdALsL1f37UcYrh5; source 98c44f8 | Recorded 27 Oct 18:22:45 Istanbul deadline; separate older automation |
| TL-010 original journal production review | prj_Z7d8Fd2lrA4DEAAZz1B7ZBIR0R8O; dpl_8XqhZU1J7SobhsgiifgY4Q3QAwa5; source 1632a6b | Same older deadline; preserve recovery/protection evidence |
| Original V1 demo | trip-line-demo, frontend root | Historical separate project; never relink active app to it |
| Earlier protected V1.1 Preview | dpl_45Zj8VFbRQcHjmgp2fDQXF4Qa1tm; source 98c44f8 | Historical protected delivery, not preferred current review |

Receipts: [TL-015](qa/2026-10-27-tl015/receipt.json), [TL-014](reports/TL-014-full-motion-default.md),
[TL-012](reports/TL-012-v11-public-client-review.md), [TL-010](reports/TL-010-temporary-public-review.md).
Old deadline dates have elapsed; no current expiry success is asserted without a fresh
inspection. Ignored tmp operational files may exist locally; durable receipts/reports
remain the fresh-clone references. Do not publish secrets/share tokens from local state.

## Actual configuration

Active build root frontend-v2; Next.js/Node24/pnpm11.25.0. vercel.json specifies frozen
install/build and TRIPLINE_DEMO=true to avoid backend API rewrites. next.config.ts sets
standalone output locally and provider-managed output under VERCEL. .vercelignore excludes
local environments, dependencies, builds, logs and test output. Local provider links are
ignored and do not authorize changing production.

Read-only local-link inspection during TL-016 found frontend-v2/.vercel/project.json
still bound to trip-line-journal-v2 / prj_Z7d8Fd2lrA4DEAAZz1B7ZBIR0R8O, while frontend
is bound to the original trip-line-demo project. These machine-local links were left
untouched. They are not the isolated TL-015 target: a future CLI deploy from the active
checkout must not silently use the existing link. No credentials were copied into docs.

TRIPLINE_REVIEW_EXPIRES_AT is optional server-enforced expiry in proxy.ts; expired values
return 410 for pages/assets. TL-015 removed it from its isolated review environment.
Do not set it there. MEDIA_ORIGIN and INTERNAL_API_URL affect images/API rewrites.
NEXT_PUBLIC_SITE_URL determines canonical metadata when supplied. Keep noindex/legal
defaults until authorized. See [routes](ROUTES_LOCALIZATION.md).

## Branch retention

Keep codex/trip-line-v11-mobile-recovery at d917ebd, the new cleanup branch, main and the
V6.1/V1/V1.1 recovery references through creative/device/release approval. Preserve:
codex/v61-before-v1-mobile (3442a6b), codex/v1-before-v11-recovery (9f6cfa7),
codex/v5-before-v6 (a499c50), codex/v6-before-v6-1 (229a7a2),
codex/pre-v5-preserved and codex/motion-v4-m01 (5ae07b2), plus the V4 timing prototype
ce166e2. Some are local-only; do not describe them as remotely protected.

After approved release and independent recovery verification, old completed feature
branches may be candidates for removal: turkiye-frontend-handoff, feat/v3-bronze-journey,
feat/v3-ux-motion-recovery, and older V1 review branches. First verify ancestry, unique
commits, downstream references and snapshot recovery, then obtain explicit deletion
authorization. Do not delete branches/tags automatically.

## Later environment cleanup — requires approval

After release and user authorization, inspect live aliases, current deployments, protection,
environment variables and automation targets. Superseded TL-010/TL-012 and old protected/
generated previews may be candidates for retirement, after preserving durable receipts and
checking no active client use. Keep original demo/recovery as agreed. Never roll back old
public content to reopen an expired client URL. TL-015 current review remains open until
explicit closure. No project deletion, alias change, billing change or automation change
was performed here.

## Later deployment procedure

First obtain explicit publication/target approval, legal/media/claim/canonical-domain
sign-off and hosting-plan suitability. Inspect live project bindings/protection/expiry,
export only the approved committed frontend root without local secrets/builds, deploy to
the approved isolated target, verify reported source hashes and build target, then check
anonymous locales/resources, CSP, noindex/metadata and Full/System/Reduced. Promote or
enable indexing only with separate explicit authorization. Prior reports describe provider
first-deployment/feedback-injection pitfalls; do not treat a CLI flag as target proof.

The broader Coolify/backend/database/R2/Turnstile recovery plan in [DEPLOYMENT](DEPLOYMENT.md)
is unfinished platform history, not an executable current release runbook.
