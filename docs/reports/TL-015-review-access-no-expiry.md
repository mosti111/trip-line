# TL-015 — Current review access stays open

27 October 2026. Direct user: "don't expire the url unless i say".
[Task](../tasks/TL-015-review-access-no-expiry.md).

Removed `TRIPLINE_REVIEW_EXPIRES_AT` from isolated review project
`prj_Lf4M8KHEMsLrBP5YXqn9dbsspL0g`; the environment-variable listing is empty.
Rebuild the identical verified application source `1f6e453e765dc0bdb221aeeff127ed0cb9ae23ea`
as a Preview, with no login or feedback injection, then assign stable review access.
No application/design change, main merge, original production or billing change.

The existing expiry automation names only the two older TL-010/TL-012 project IDs;
it does not target this project and is unchanged. The current review must remain
open until a direct user instruction requests closure. Its original TL-014 expiry
receipts are historical and are superseded by this instruction.

Delivered stable URL: https://trip-line-tl014-motion-review.vercel.app/en .
READY Preview `dpl_4ocoadtaM2bnbguyhjqybrNc5U5P`, API target null, same reviewed
application source. Alias belongs only to the isolated review project. Its
generated URL is https://trip-line-tl014-motion-review-bkdttufhf.vercel.app/en .

The earlier generated `...-jtprphtw8.vercel.app` URL is immutable: Vercel rejected
reassignment with `alias_in_use` because it is a deployment URL. It retains the
old frozen configuration; use the new stable alias instead. No old deployment
was deleted or closed early. Future review replacements should retain the stable
alias and no-expiry policy until direct user instruction changes it.

HTTP checks: EN/AR/TR, a source-logo asset and the new generated /en URL return
200 without `X-Tripline-Review-Expires`; localized pages preserve noindex. Project
environment listing confirms no deadline variable. Browser checks: six fresh
Chromium/WebKit sessions across EN/AR/TR pass, no login, Full with OS reduction,
no expiry header and zero application/console errors. Typecheck/lint pass; the
Vercel production build passes. No application files changed. Historical full
TL-014 verification remains bound to the identical source.

Evidence: [receipt](../qa/2026-10-27-tl015/receipt.json),
[browser checks](../qa/2026-10-27-tl015/browser.json),
[HTTP checks](../qa/2026-10-27-tl015/http.json).
