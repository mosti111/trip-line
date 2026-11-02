# TL-003-QC10 delivery — production verification complete, review pending

Date:16 October2026 Istanbul. Worker `/root/sol_contact`, explicitly selected GPT-6.1 Sol, sole primary C10 implementation/QA worker. Root `/root` is sole Astra reviewer/state writer. No selfapproval, commit, merge, deployment or external send.

## Result and exact boundary

Full fresh default production verification PASS: **37 cases,18 full-page captures,zero browser errors,zero non-GET requests**. Command from `frontend-v2/`:

```powershell
$env:QA_URL='http://localhost:3043'
$env:QA_CONTACT_STAGE='production'
node scripts/verify-recovery-contact.mjs
```

No case/section filters. Started2026-10-15T22:05:54.122Z, finished22:07:07.769Z. Tested Git HEAD `2989f28e006c1c2284ee36d53d03f5ee1452aa1d` plus frozen five-file C10 application diff and scoped verifier diff. Same compiled production artifact supplied by Root; no worker rebuild/repeat core/public/V3. Initial/final source/helper fingerprints are identical in the raw report.

Exact raw report: `tmp/frontend-qa/recovery-contact/2026-10-15T22-05-54.122Z/report.json`. Actual production native viewport evidence:12 PNGs in its `native/` directory, `{en390,ar390,ar768}-{top,summary,form,prepared}.png`; manifest records dimensions, timestamps and hashes. Full-page captures cover EN and full AR1440x900,1280x600,768x1024,390x844; TR1280x800, EN360x800, AR430x932; errors/keyboard and prepared states; AR390 noJS. Worker inspected actual final AR390 form PNG; Root owns final rendered acceptance and durable promotion.

## Verified behavior

Ordered source names/media, summary before mobile form, desktop split, three groups, true RTL/natural image orientation, document/control bounds, one H1/noindex and absence of Contact canvas/video/pin/iframe. Error focus clears sticky header; native focus outline checked. Query precedence covers valid/conflicting/unknown/duplicate/empty/invalid/repeated/absent journey,destination,service; stored stops never resurrect explicit invalid context. Separate country and full itinerary serialize once in decoded identical WhatsApp/mailto bodies; country removal clears result and preserves Turkish stops.

Actual drawer notifications leave explicit query intact; real global reorder/remove updates non-detached itinerary, invalidates preparation and preserves query-service override. Personal edits do not detach itinerary. Local add-only selection, keyboard reorder/removal and focus restoration, deliberate local detach, later global action invalidation, global-owned service type propagation and local override all pass. Cross-route destination Add→reorder→Plan→Contact preserves full order.

Name,email,phone,method,service,dates,flexible,travelers,organization,message,consent and itinerary changes invalidate outputs; change-and-restore does not revive them. Relevant email or phone validation, traveler bounds, independent free message, no personal storage and allowlisted session keys verified. Actual delayed clipboard success after edit/restore cannot revive stale output; older rejection cannot overwrite a newer preparation; current copy succeeds. No outbound links activated.

Pointer EN→AR→TR locale/query preservation, browser back/forward, all three serialized flexible labels, noJS useful query summary/direct links, reduced motion, SaveData, storage unavailable, live in-memory Add→native Contact while storage fails, and earliest mounted edits pass. No infinite animations observed in reduced/SaveData modes.

## Diagnosed failures preserved

1. First full production run `tmp/frontend-qa/recovery-contact/2026-10-15T22-02-01.872Z/`:23 cases/17 captures/0errors, then local keyboard-focus assertion failed. Native event trace shows Contact correctly focuses enabled Move later Sapanca, then pending JourneyDrawer close `requestAnimationFrame` restores header focus. Application remained frozen. Raw scripts/logs/screens in `tmp/frontend-qa/contact-dev/focus-production*` and `focus-ready*`; logs have UTC file timestamps and native performance event times. Initial simple hidden-dialog/header-focus predicate still saw native immediate return before queued handler; strengthened helper requires expected header focus after two rendering frames that flush the identified close callback. Final local focus assertion unchanged; no blanket delay. Affected case PASS in `focus-ready-frames-events.log`.
2. Full retry `tmp/frontend-qa/recovery-contact/2026-10-15T22-04-11.356Z/`:27 cases/17 captures/0errors, then locale fixture expected a query after newly inserted global-service test intentionally moved to no-query Contact. Corrected only fixture setup to navigate explicit original query before locale transitions. Query assertions retained.
3. Development failures and preliminary evidence remain described in [C10 delivery](TL-003-C10-delivery.md). None are silently treated as passes. Final37-case run passes after both narrow verifier corrections; application hashes unchanged.

## Scope and checks

Only QC10 helper/report changed after application freeze. Narrow public/V3 Contact assertions were prepared before freeze: old free-text route assumptions now check visible ordered names, then decoded full itinerary exactly once in prepared WhatsApp/email. Existing language/query, primary service/stop, error focus, route inventory, journey and stale-result coverage retained. No public/V3 changes during production diagnosis.

Worker final helper `pnpm exec eslint scripts/verify-recovery-contact.mjs`, `node --check scripts/verify-recovery-contact.mjs` and owned whitespace checks PASS. Root reported default build/typecheck/full lint/32 tests/public120routes6screens5groups0errors and V3 PASS60screens16groups0errors (V3 finished2026-10-15T17:09:00.827Z) against frozen application; worker references those results without claiming to have run them. No Q12/full product suite or next family work.

## Limitations / handoff

Chromium headless/native browser only. No Safari/Firefox/physical-device/assistive-technology/field-performance certification. Bundle URL observation does not prove opaque bundle internals. Synthetic same-route absent→repeated-array client URL cannot be emitted by existing public links: source JSON presence key, direct repeated cases, actual native client Contact navigation and back/forward were reviewed/tested; no synthetic router fixture added. Earliest mounted input is covered; prehydration uncontrolled DOM interaction is outside the mounted-local-edit guarantee.

All worker browsers closed on completion; development3053 remains stopped. Root owns production3043 and final rendered decision/state/evidence/checkpoint. C10 remains frozen at hashes below. No approval or full TL-003 completion claimed.

```json
{
  "components/travel/Inquiry.tsx": "b1b194c9dda1187e07da31d1e3d4243b80e6de341eeabc540c2eb7b303a89ae2",
  "components/travel/Pages.tsx": "1b658cddb2c45ce9abaf56325a980ebf83fcc79cc7735529b0f5d0d38a2fbba6",
  "components/contact/ContactExperience.tsx": "2370a49186a6ba0c84ecf20a64a2fbbb5031be29f6fd1e668728d8a7c918896f",
  "styles/recovery-contact.css": "017cf11a006a73bb1d41aae5ca596a5dd01ae1eaee2da9f3876597fcbe114f44",
  "app/[locale]/[[...slug]]/page.tsx": "ad17177c7ba19da3d207dd81df158a66e97685954bd1551fa49db457575d5651",
  "scripts/verify-recovery-contact.mjs": "aa0dfd1f9be74c288df387407abae5fad3b67068cfcd0ebf67c94ae34b1710f9",
  "scripts/verify-public.mjs": "bd4f7a674e35ab4bffb29bf3fd00ddc96d4d029fe88497178e276f0da7b4c65a",
  "scripts/verify-v3.mjs": "0740c846252f4bcec43860f9ae002d39aa8035921bdcdb5bb59ea6af56473833",
  "lib/journey.ts": "5620fa5e93176442011af12cf6aef50ee55e7634d469ee5760b5fbc42db0427e",
  "components/experience/JourneyStore.tsx": "cebec5bc60bc4ba56ac1deabf9a6db38b8bc94ded0e82c74c7b3e5fa7da50f7d"
}
```
