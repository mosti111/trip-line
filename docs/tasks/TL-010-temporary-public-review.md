# TL-010 — Two-day public client review

25 October2026. Direct current user authority follows the request for a no-login
production URL and explicit confirmation: “it's okay make it temporary and expires
in 2 days”. This supersedes TL-009's preview-only/no-promotion boundary only for
this temporary public review, including visibility of the existing pending-logo
review content. It is not final creative or relationship approval.

Use reviewed application0a1325a on `codex/trip-line-v1-mobile-review`; preserve it
and the previous production target `dpl_DLu3qxDJHA9d6xjBev5HqVvz7yNt`.
Existing Vercel account/team/project and Hobby choice remain unchanged. No main
merge, billing change, redesign or new product functionality.

Public access must expire48 hours after this request:27 October2026 at15:22:45UTC,
18:22:45 Europe/Istanbul. Implement a server-side optional deployment expiry
guard for pages and assets, failing closed on an invalid configured deadline, so
expiry does not depend on the desktop scheduler. The absent-variable baseline
must preserve existing routing. Keep noindex/nofollow, legal/source notes and
prepared-message-only inquiry. Schedule a same-chat follow-up to verify expiry and
original protection after the deadline, guarded against unrelated newer
deployments. Do not automatically roll back to older public content, which could
reopen the client URL. Preserve that deployment and the exact pre-change receipt
for recovery, without credentials.

Verify core checks, future/expired boundaries, ordinary public routing and actual
uncookied hosted EN/TR/AR on mobile. Deploy from the tested committed source to
production; confirm source SHA, correct account/project/root, no login or sharing
token, media loading, and the exact expiry response header. Record result in
[report](../reports/TL-010-temporary-public-review.md), with expiry/recovery data
under `tmp/v1-public-review/`. One current implementation agent, no subagents.
