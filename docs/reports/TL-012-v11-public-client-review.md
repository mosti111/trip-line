# TL-012 — Public V1.1 client review delivery

Completed 26 October 2026 under the direct public-access instruction.

Client URL: https://trip-line-v11-client-review.vercel.app/en
No login, share token or existing cookies required. EN/TR/AR are available.
The separate temporary project leaves the existing Trip Line site unchanged.

Reviewed application SHA: `98c44f8d05792f97c7324ce5dcbf12f73e4e8535`.
Branch: `codex/trip-line-v11-mobile-recovery`; no main merge or source change.
Deployment: `dpl_DQF8DKuSvtPMpdALsL1f37UcYrh5`, READY, project
`prj_9pbqRH1MGonwCvNeQ20knZhH29Zv`. Root `frontend-v2`, Next.js/Node24,
existing user-selected Hobby team, no Git connection or billing change.
Authentication is disabled only on this new review project. All285 exported
application files match the reviewed Git source; deployment SHA metadata matches.

Server-enforced expiry remains **27 October2026 at18:22:45 Europe/Istanbul**
(15:22:45UTC). Pages and assets carry the exact deadline. Existing expiry audit
`expire-trip-line-public-client-review` now verifies both public review projects;
its one-shot schedule is unchanged. It must never restore older public content.
Noindex, legal/source/logo qualifications and inquiry-only behavior remain.

## Verification

- Six fresh no-cookie phone sessions: Chromium and WebKit, EN/TR/AR, bare URLs,
  HTTP200 with no login redirect or query token.
- All33 hosted pages pass at320px with noindex and media checks. All three locale
  films decode at1280x720.
- EN/TR/AR touch interactions pass: menu, all twelve destinations, optional map,
  moving billboard/pause, journey selections/reordering/dates/travelers and contact
  handoff. Three local touch recordings retained under ignored
  `tmp/frontend-qa/v11/public-interactions/`. The unchanged layout matrix was
  deliberately skipped in this access-only run; its cases array is empty.
- Seven uncookied page/image/video/logo/script requests return200 and the exact
  expiry header.
- Existing canonical production remains `dpl_8XqhZU1J7SobhsgiifgY4Q3QAwa5`,
  source `1632a6b9b2fec2d7cb620c5280f1fe2772fe3b76`, with unchanged aliases.
- Prior source verification remains in [TL-011](TL-011-v11-mobile-recovery.md):
  typecheck, lint,41 tests, build and comprehensive mobile/rendered regression.
  No application code changed for TL-012, so that suite was not repeated.

Evidence: [receipt and screenshots](../qa/2026-10-26-v11-public/README.md).
Physical iPhone Safari remains untested; WebKit is emulation. The previously
recorded Windows WebKit font-weight limitation and native-device checklist remain.
Client creative acceptance is still pending. Stop at this delivery.
