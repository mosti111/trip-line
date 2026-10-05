# TL-003-CONTENT — verified company profile locale data

Independent source-copy preparation for homepage/About phases, no current UI change.
Selected Sol worker; no unfinished dependency. Read full TL-003 authority and source
at docs/qa/2026-10-05-recovery/content-authority.md plus all4 extracted pages at
ignored tmp/v3-ux-motion-recovery/baseline/profile-text.txt and existing i18n/content.

Exact writable files:
- frontend-v2/lib/company-profile.ts (new)
- docs/orchestration/recovery/TL-003-CONTENT-delivery.md (new)
Everything else read-only. No UI integration or source-content rewrites.

Export typed `companyProfile` (Text fields using t helper) with `sourceLabel`,
`established`, `licensed`, `accreditation`, `mission`, `vision`, `partnersSource`.
Accreditation explicitly according to Company Profile2025, no independently verified
current license claim. Established2019 separate. Vision/mission faithful concise
source paraphrase, no invented timeline, claims, guarantees or client counts.

Export `profileDifferentiators`: seven {id,title:Text,body:Text} source-supported
entries Experience & Reliability, Comprehensive Services, Customized Experiences,
Professional Team, Strategic Partnerships, Attention to Detail, Quality Standards.
Use readable connected Arabic and natural Turkish, no stronger guarantee than source;
prefer attributed descriptions of profile approach rather than new commercial promises.

Export `profileFigures`: nine {id,value:number,suffix:string,label:Text,
requiresClarification?:boolean}; source verified figures from audit. `experience`
12+ must have requiresClarification:true and explicit label “Years of experience
(profile figure; not company age)” in all3. Consumers can omit pending client
confirmation. Provide four safe existing key IDs clients/tours/hotels/pilgrims for
homepage, all numbers must accompany sourceLabel. Do not add current statistics.

No tests mirroring literals; typecheck, owned-file lint and existing tests enough.
Verify allfields have en/ar/tr and exactly7 differentiators/9 figures in source
review or simple transient script. No build/browser required for currently unused
source module; actual UI later must pass rendered review. No commits or dependencies.
Report source-page mapping, exact exports/checks and limits, then stop.
