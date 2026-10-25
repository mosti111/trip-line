# TL-010 — Temporary public client review

25 October2026. [Authority](../tasks/TL-010-temporary-public-review.md): the user
explicitly approved a no-login production release for two days after the original
protected share link was unsuitable in incognito. This is a time-bounded exception
to TL-009's preview-only rule, not final creative or partner relationship approval.

The reviewed V1 UI/content is unchanged from0a1325a. Added only an optional
deployment request deadline: `TRIPLINE_REVIEW_EXPIRES_AT=2026-10-27T15:22:45Z`.
At or after that instant, public pages, media, brand assets, scripts, image
optimization, API paths, robots and sitemap receive HTTP410/no-store/noindex.
Invalid configured deadlines fail closed; deployments without the variable retain
their ordinary routing. Existing locale/CSP routing is preserved for page requests
and remains bypassed for asset/API paths before expiry. This guard runs on Vercel,
so it does not depend on this computer or Codex staying awake.

Expiry: **27 October2026 at18:22:45 Europe/Istanbul** (15:22:45UTC),48 hours after
the recorded user request. Noindex, legal/source notices, prepared-message-only
inquiry and pending-logo qualifications remain intact. No redesign, main merge,
dependency replacement or billing change. The user-selected Hobby limitation
already disclosed under TL-009 remains; no plan eligibility is asserted.

Verification: typecheck/lint,37 tests (32 existing +5 deadline boundary cases) and
production build `ZT48Su8VDgum6y8W08TfQ` pass. All128 active/expired route/resource
cases and the ordinary public120-route/six-capture regression pass, with zero
exercised browser errors. [Expiry proof](../qa/2026-10-25-public-window/expiry-verification.json)
and [public regression](../qa/2026-10-25-public-window/public.json) are retained.
Final deployment URL/SHA, uncookied hosted checks and exact prior
production/protection snapshot are saved in `tmp/v1-public-review/state.json`.

The restoration follow-up `expire-trip-line-public-client-review` is scheduled in
this chat at the deadline. It first restores prior protection and then the previous
production mapping `dpl_DLu3qxDJHA9d6xjBev5HqVvz7yNt`, provided the temporary
deployment is still current; unrelated newer releases must not be overwritten.
The hard HTTP410 expiry remains effective independently of that follow-up.

Source deployment status is bound after commit in the operational state receipt;
the final chat delivery gives the verified public URL. Original reviewed commit,
old production deployment and prior evidence remain recoverable.
