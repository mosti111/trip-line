# Frontend verification baseline — 2 October 2026

Historical verified V2 revision. These outputs do not sign off later V3 changes in the
same workspace. Read [current status](../../AI_HANDOFF.md) before choosing next work.

These are saved outputs from verification of the Türkiye-focused frontend. No personal customer data is present; form checks used synthetic QA input and did not send a message.

- `production-check.json`: 120 localized content routes, six responsive views, interaction checks and empty browser error log.
- `visual-check.json`: initial eight-view browser pass, including services, Hajj/Umrah and contact.
- `home-final.png`, `turkiye-desktop.png`, `rize-mobile.png`: representative reviewed production screenshots.

The other full screenshots and temporary preparation files remain local and are regenerable. Run `node scripts/verify-public.mjs` from `frontend-v2/` against a running production preview to create fresh evidence in ignored `tmp/frontend-qa/`. Default origin is `http://localhost:3003`; set `QA_URL` to override. Install the Playwright Chromium binary on a fresh machine if necessary.

The saved reports describe the earlier successful run. They are not a claim that checks automatically run on every commit. See [delivery limitations](../../FRONTEND_DELIVERY.md) for unverified browsers and publication dependencies.
