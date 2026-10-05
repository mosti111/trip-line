# TL-003-CONTENT delivery

5 October 2026. Status: IMPLEMENTED; independent lead review pending.
Contract: [TL-003-CONTENT](TL-003-CONTENT.md).
Branch: `feat/v3-ux-motion-recovery`.
HEAD at delivery: `0ba5a97254e08d8d621dba4add4045604df5aa7a`.
No commit, dependency change, deployment or merge.

Worker: `/root/astra_recovery/sol_related`, continuing the explicitly selected
GPT-6.1 Sol dispatch under the selected Astra lead. Selection is recorded;
independent backend model attestation is not claimed.

## Exact delivered scope and exports

Only two new files: `frontend-v2/lib/company-profile.ts` and this report.
No UI integration, existing content rewrites or changes to other owned scopes.

The module exports `companyProfile` with seven `Text` fields: `sourceLabel`,
`established`, `licensed`, `accreditation`, `mission`, `vision`, `partnersSource`.
It also exports `profileDifferentiators` with seven `{id,title,body}` entries
and `profileFigures` with nine `{id,value,suffix,label,requiresClarification?}`
entries. `CompanyProfile`, `ProfileDifferentiator` and `ProfileFigure` types
are exported. All translated fields use the existing `t` helper and `Text` type.

License and TÜRSAB accreditation explicitly attribute their statements to
Company Profile 2025. Following lead-directed R1 refinement, mission/vision and
differentiator bodies use concise public-facing source paraphrases; the section
source label supplies their 2025 attribution. They avoid new guarantees,
statistics and pricing claims. Establishment in 2019 remains separate from the
experience figure. Existing partner media and contacts are untouched.

The `experience` figure has `requiresClarification: true`; all three labels
explicitly identify it as a profile figure distinct from company age. Consumers
may omit it pending client confirmation. The existing homepage-compatible IDs
`clients`, `tours`, `hotels`, `pilgrims` are retained. Every rendered figure
must accompany `companyProfile.sourceLabel`; the module documents this consumer
requirement. No current statistics are introduced.

## Source review and page mapping

Read the complete four-page extracted source at ignored
`tmp/v3-ux-motion-recovery/baseline/profile-text.txt`, and the durable
[content authority audit](../../qa/2026-10-05-recovery/content-authority.md).
The client PDF is `C:/Users/mosta/Downloads/بروفايل-1.pdf`; this worker read its
extracted text, not new rendered PDF captures. Root's rendered source audit is
identified separately in the authority record.

- Page 1 identifies Company Profile 2025, used in `sourceLabel` and attribution.
- Page 3 supplies 2019 establishment, Turkish tourism license, TÜRSAB
  accreditation, mission, vision and booking-system/hotel partnership context.
- Page 4 supplies all seven differentiators: Experience & Reliability,
  Comprehensive Services, Customized Experiences, Professional Team, Strategic
  Partnerships, Attention to Detail and Quality Standards. Its separate
  “over five years” phrasing reinforces the unresolved experience chronology;
  the module does not reconcile it into a company-age claim.
- Page 2 supplies all nine figures below. These are historical client-profile
  statements, not independent current business verification.

| Figure ID | Source value | Source description |
| --- | --- | --- |
| `pilgrims` | 5,000+ | Pilgrims and Umrah travelers |
| `partnerships` | 2,000+ | Strategic partnerships |
| `tours` | 15,000+ | Tours |
| `clients` | 25,000+ | Satisfied clients |
| `experience` | 12+ | Years of experience; clarification required |
| `entertainment` | 10,000+ | Entertainment programs |
| `visas` | 18,000+ | Visa applications |
| `hotels` | 10,000+ | Hotel bookings |
| `events` | 200+ | Events and conferences |

## Initial delivery checks and limitations

Commands run from `frontend-v2/` on the shared working tree:

| Check | Result |
| --- | --- |
| `pnpm typecheck` | PASS, exit 0 |
| `pnpm test` | PASS, exit 0: 2 files / 32 tests |
| `pnpm exec eslint lib/company-profile.ts` | PASS, exit 0 |
| Transient Node/TypeScript module shape check, no saved test file | PASS: 7 profile fields, 7 differentiators, 9 figures; 30 Text objects / 90 nonempty EN/AR/TR strings; unique IDs, positive integer values, plus suffixes, safe four IDs, experience clarification |
| Owned-path whitespace/diff check | PASS |

No new tests duplicate profile literals. The existing passing suite is regression
evidence, not independent factual verification. Source review verified values and
meaning against the page mapping above. Full-repository lint was not run by this
worker; the contract permits owned-file lint. Build and browser checks were not
run because the contract exempts this currently unused source module.

Rendered review is N/A for this preparation: no UI consumes the module yet.
Later homepage/About integration must preserve attribution/clarification and pass
its independent rendered review. This delivery does not approve those page phases,
the profile's current commercial claims, publication or user creative acceptance.
Stopped at the exact two-file contract boundary; lead owns state and review.

## Lead-directed CONTENT-R1 refinement

5 October 2026. [R1 contract](TL-003-CONTENT-R1.md) replaces the repetitive
source-analysis phrasing with natural public-facing copy. This is the lead's
refinement of the original attribution approach, not a factual source change.
Only mission, vision and the seven differentiator bodies changed, in all three
locales. Mission and vision remain stated ambitions. The other copy describes
the same experience, service breadth, individual interests, team care,
relationships, detail and quality priorities as the profile.

`sourceLabel`, establishment, explicit license/accreditation attribution,
`partnersSource`, all IDs/titles/types, all nine figures and the experience
clarification were preserved. A transient SHA-256 comparison of source with
only the nine permitted copy blocks masked confirmed the remaining module was
unchanged. No UI integration or unrelated file changes.

R1 checks actually run from `frontend-v2/`:

| Check | Result |
| --- | --- |
| `pnpm typecheck` | PASS, exit 0; started before interruption, completion retrieved after resumption |
| `pnpm exec eslint lib/company-profile.ts` | PASS, exit 0; started before interruption, completion retrieved after resumption |
| Source preservation outside nine permitted copy blocks | PASS |
| Report whitespace/diff check | PASS |

The 32-test result and transient locale-shape result above belong to the initial
delivery; this worker did not rerun them for R1. No worker build/dev/browser
process was started. Root owns the coordinated full application checks/build;
their outcome is not claimed in this worker report. After the resumed lead
instruction, only this report was updated. R1 implementation is delivered and
stopped for independent lead approval; later consuming UI still needs rendered
review.
