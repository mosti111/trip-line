# TL-003-DATA — curated related Türkiye destinations

Independent typed-data preparation for phase5; no currently rendered behavior changes.
Selected fresh GPT-6.1 Sol worker. No dependencies on unfinished shell/homepage.
Read root/frontend AGENTS, current TL-003 full spec, turkiye source and normal authority.

Exact files allowed:
- frontend-v2/lib/turkiye.ts
- frontend-v2/lib/turkiye.test.ts (new)
- docs/orchestration/recovery/TL-003-DATA-delivery.md
All other files read-only, particularly journey.ts/tests and UI (owned by others).

Add required `related:string[]` to TurkishPlace and explicit three editorial IDs per
record. Preserve all existing fields/copy/order/images/coordinates and turkeyCopy.
Curate using existing source interests/groups; no travel-time, convenience or transport
claim. Suggested accepted editorial mapping (may point out source inconsistency before
changing): Istanbul→Bursa,Cappadocia,Sapanca; Trabzon→Rize-Ayder,Uzungol,Istanbul;
Rize-Ayder→Trabzon,Uzungol,Sapanca; Uzungol→Rize-Ayder,Trabzon,Yalova;
Antalya→Fethiye,Marmaris,Bodrum; Bodrum→Marmaris,Fethiye,Antalya;
Fethiye→Antalya,Marmaris,Bodrum; Marmaris→Bodrum,Fethiye,Antalya;
Sapanca→Yalova,Bursa,Uzungol; Bursa→Istanbul,Cappadocia,Yalova;
Yalova→Sapanca,Bursa,Istanbul; Cappadocia→Bursa,Istanbul,Rize-Ayder.
Use actual existing lowercase slug IDs. Mapping is editorial discovery only.

Meaningful Vitest validates every one of12 has exactly3 unique known nonself related
IDs; protects coordinate/geography sanity and complete source12 if useful. Do not
write tests simply mirroring all literal mapping choices. Run pnpm typecheck and
pnpm test; lint owned file or full if safe. No build needed for unused data addition.
No visual output changes: rendered gate N/A for this preparatory data integration;
phase5 template's independent rendered review remains mandatory when consumed.
No commit/dependency/copy redesign. Deliver report with exact diff/checks/limits;
never self-approve, stop bounded task.
