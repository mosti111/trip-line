# TL-003 motion recovery verification — 7 October 2026

Status: M03/QM03 review in progress. No motion approval or full TL-003 completion.
Selected Astra reviewer `/root/astra_resume`; implementation worker
`/root/astra_resume/sol_home_motion`, QA worker `/root/astra_resume/sol_motion_qa`,
both explicitly selected GPT-6.1 Sol. Root coordinates independent production
build/core verification. Actual topology/selection is recorded, not backend attestation.

Tested base: `b89d87a5f4ab694d2ac6ecb62bfa9a0a2051a184` plus ten application files
frozen 6 October19:43UTC, exact SHA256 in
[M03 delivery](../../orchestration/recovery/TL-003-M03-delivery.md). Root independently
matched all ten hashes. No deployment/main merge. Unrelated local setup preserved.

Root production build, final typecheck, lint and32tests passed. First build failed
on an ignored dev-generated validator orphan; removing that exact generated file
and rebuilding fixed it, without application/config changes. next-env regenerated
to baseline. Local production server is root-owned port3043. Its standalone-start
warning is retained; this is a functional local preview, not deployment evidence.

[Default public report](m03-root-public.json): PASS120 localized routes, six capture
cases, five behavior groups, zero browser errors. Chromium, normal desktop/mobile/
tablet plus reduced preference, exact dimensions/routes in JSON; completed
2026-10-06T19:47:59.037Z before the requested pause stopped the server. Root then
restarted the same frozen build after explicit7October resumption.

Default V3 and auxiliary motion/resilience/media/planner/reconstruction remain
pending. First V3 stopped at Turkish focused-service visibility: intersection ratio
0.9999999403953552 versus strict1. It had five completed behavior groups, zeroerrors,
and had not reached the60-case normal matrix. The narrow verifier correction retains
full visibility with numerical tolerance and explicit viewport/header bounds. Its
failure is preserved in QA delivery/local reports, never relabeled passing.

The next V3 run passed all27 focused-service bounds across EN/AR/TR, then stopped
at the obsolete `.menu-image` hook. The approved F01 tablet menu has no such image;
it contains navigation, locale and planning controls. The verifier now positively
checks that actual structure, focus trap, Escape/return and any images actually
present. Six behavior groups and zeroerrors were recorded before this failure;
the60-case matrix had still not run. Both failures are preserved separately in the
QA worker's report and ignored evidence. Application source remains unchanged.

V3 R2 then completed all60 normal captures and3 reduced captures before a real
Save Data application failure: the partial connection API fixture exposes saveData
without event methods, and unguarded subscription threw a TypeError. OverallFAIL,
not a passing matrix suite. The narrow M03-R1 correction targets HomeMotion and
BronzeJourney subscription/cleanup capabilities. The existing fixture and error
watcher are retained. Source freeze is reopened only for those exact files, followed
by fresh required checks/default suites and outstanding auxiliary verification.

M03-R1 source froze7October01:07:54UTC after separate typeof guards for subscription
and cleanup methods. Worker typecheck/lint and bounded transpiled-source probes for
absent, partial and complete connection APIs passed. Lead inspected the two-file
correction and released source ownership; M03 is REVIEWING again. New hashes are in
the appended M03 delivery, eight other motion files unchanged. Actual rebuilt
production proof and reruns remain pending at this entry.

After the10:13UTC resume, root confirmed R1 production build PASS, then fresh final
typecheck/lint/32tests PASS and all ten current source hashes matching delivery.
[Actual rebuilt Save Data proof](m03-r1-save-data.json), Chromium EN1440×900 fine
desktop at localhost3043, passed with zero errors:
partial connection object retains oneH1/fifteen chapters/no canvas or pin/initial
film suppression; a real EventTarget completed two normal→saving cycles, creating
exactly one canvas/pin/Lenis then removing all three with readable content. This
does not claim dynamic film connection-change behavior. R1 default public/V3 and
auxiliary suites still remain pending; no approval yet.

[R1 rebuilt default public report](m03-r1-root-public.json): PASS120 routes, six
screenshots, five behavior groups and zero errors. This fresh run verifies the
two-file correction; the earlier `m03-root-public.json` remains the pre-R1 result.
Root now runs the unchanged full V3 verifier against the same frozen production
build before releasing the auxiliary window. No overall motion approval yet.

[Final R1 default V3 report](m03-r1-root-v3.json): PASS60 normal capture cases,
16 behavior groups, zero errors and30 focused-service bounds (27 normal plus3
short). Includes three reduced locales, noJS, coarse390/1280, short1280×600 EN/AR/TR
and4×CPU interaction. Exact widths/routes/modes and measured bounds are in JSON.
The three earlier failed attempts remain preserved in QM03 delivery/local evidence.
The passed V3 source SHA256 is
`dd612cfce453f751967bd0c721191b0fb023da325b78ab8e35ba80cd346ca7b6`.

Root released the exclusive auxiliary browser window to the same QA worker for
resilience→motion/legal→media→planner→reconstruction against the unchanged R1 build.
No competing browser is running. Root's actual Arabic service crop shows all nine
links, connected text and visible focus; its tablet menu image captured the entry
stagger and is transitional, not settled navigation proof. A bounded settled-menu
supplement will follow without modifying or rerunning the already passed core suite.
Overall M03 approval remains pending auxiliary and actual motion review.

[Production resilience](m03-r1-resilience.json) PASS9 groups/zero unexpected errors:
actual GL draw counts idle0/hidden0/offscreen0, real extension-driven context loss
and restoration, expected unavailable-WebGL fallback, undecodable film with actual
retry, all-dialog pause, EN/AR/TR observer-tween cleanup and resize recreation.
Observed default-scale DPR1 is below1.5; a deviceScaleFactor3 supplement will exercise
the actual cap. Expected deliberate no-WebGL errors remain in the report.

Lead inspected [lost context](m03-context-lost.png) and
[restored context](m03-context-restored.png), EN1440×1000: the static bronze route
keeps content readable during loss, and the restored3D route has bright edge/specular
reflection rather than a black material. Lead also inspected
[Arabic service keyboard state](m03-services-ar.png): nine readable grouped links,
connected RTL typography, natural photos and clear focus.

The first motion verifier run failed after five tall-camera checkpoints and52 wheel
frames because its generic graphic selector selected the prepended metallic clone,
which retains the original route class. The separate flat SVG was not measured.
The narrow QA correction selects the nonmetal route while retaining opacity>.8 and
thickness requirements, and saves sampled frame metadata before assertions. No app
change, fixture suppression or core behavior change. Its failed report/log/screens
are preserved; motion/legal rerun and remaining auxiliaries are still pending.

Preliminary dev frames/lifecycle evidence and known superseded captures are described
in M03 delivery. Final production time-stamped sequences and independent actual
rendered judgment remain mandatory. Browser/physical-device/field-performance limits
will be reported with the final gate.

## Final-source motion and media results — 7 October 2026

The corrected [motion/legal verifier](m03-r1-motion.json) PASS at10:36:11Z: two
fine-desktop cases1440×900 and1280×600, twenty fixed screenshots and89 timestamped
small-wheel frames (52 tall/37 short), zero errors. Eleven actual legal-route JS
response bodies contain no GSAP/R3F/Three/Lenis runtime markers. The earlier
selector failure remains preserved under ignored auxiliary/motion-first-failure.
Only the new motion verifier changed; passed core scripts were untouched.

Lead independently decoded all five short fixed checkpoints and selected tall/short
timed frames, including short0006/0030/0036 and tall0012/0024/0036/0045.
[Initial tall](m03-tall-initial.png), [tall camera](m03-tall-camera.png),
[initial short](m03-short-initial.png) and [short camera](m03-short-camera.png)
show readable initial hierarchy, an actual reflective foreground camera journey,
Istanbul recession and passing coordinates. [Handoff](m03-short-handoff.png) and
[threshold](m03-short-threshold.png) show the thick spatial route resolving into a
thin geographic graphic while the service controls remain in native flow.
[Timestamped tall metadata](m03-tall-sequence.json) and
[short metadata](m03-short-sequence.json) retain measured camera/target/route
changes. WebM recordings exist at raw report paths; reviewer inspected fixed and
timestamped frames, not video playback. All fixed checkpoints have scrollX0,
document width equal viewport and the header Plan action within measured bounds.

[Media continuity](m03-r1-media.json) PASS two groups/zero errors at10:38:02Z:
actual chapter06 decode/play/pause/visibility/offscreen and height-relative opening;
2500ms delayed Yalova retains the last decoded preview with at most two images.
Lead also decoded actual framed-entry and expanded-film screenshots: the first is
the chapter entrance, not a complete film comparison; the expanded frame displays
the real Bosphorus film, pause control and the following editorial chapter.
[Planner](m03-r1-planner.json) PASS all9 EN/AR/TR attempts under4×CPU, zero errors.
Reconstruction and the independent settled-menu/high-DPI/native-menu supplement
remain pending; M03/QM03 are not approved yet.

Additional actual final-build responsive review: [AR390 intent](m03-ar-mobile-intent.png)
uses a native vertical photo-led choice, connected right-aligned typography and a
clear global planning action. AR390 signature image remains naturally oriented.
[AR390 final arrival](m03-ar-mobile-arrival.png) preserves both real conversation
actions, readable copy and the thin route into the final node; sticky planning is
hidden here. [TR768 Beyond/FAQ](m03-tr-tablet-beyond.png) keeps international
discovery smaller than Türkiye, readable Turkish labels and a restrained two-column
composition with natural photos. These are actual decoded production screenshots.

[Final reconstruction](m03-r1-reconstruction.json) PASS, one uninterrupted run
15:24:39.115Z–15:35:18.955Z,18 normal cases (EN/AR/TR×360/390/430/768/1280/1440)
and3 reduced cases, all fifteen chapters, no unexpected errors. Exact heights and
input modes are in the report. The historical report file was only replaced at
completion, so intermediate capture output was not treated as overall success.
Lead decoded [Arabic reduced selection](m03-ar-reduced-services.png): native selected
business intent remains readable, the photo is natural, and the thin route continues
into Türkiye without WebGL/pinning. Root's bounded navigation supplement remains.

## Independent navigation supplement

[Root actual navigation/DPR report](m03-root-navigation.json) PASS, zero errors:
EN768×1000, AR390×844 and TR390×844 wait for every primary menu label to reach
full opacity, focus the last link, and verify Escape/focus return. Lead decoded
[AR settled menu](m03-ar-menu-settled.png) and [EN settled menu](m03-en-menu-settled.png);
all labels, language choices and contact details are legible. These replace the
transitional core screenshot as settled visual evidence without changing core tests.
At1280×600 with deviceScaleFactor3 the actual canvas ratio is1.5 and one Lenis
exists. Keyboard mega entry pauses it; native menu wheel scrolls224px while page
scroll remains unchanged; Escape resumes with focus return. Root also confirms all
five opening header bounds in1440×900 and1280×600, no horizontal scroll/overflow.

[Current app fingerprint](m03-source-fingerprint.json), [final QA fingerprint](m03-qa-freeze.json),
[root build](m03-r1-build.txt), [typecheck](m03-r1-typecheck.txt),
[lint](m03-r1-lint.txt) and [32 tests](m03-r1-test.txt) preserve the checked identity.
All results are local production Chromium lab evidence; no Safari/Firefox, physical
device, assistive-technology, software-keyboard or field-performance claim. Later
page-family work and final Q12 remain required; this is not deployment.

## Gate decision

Selected independent Astra final review on7October2026 APPROVED M03 including R1
and QM03 with no blocking corrections. See [dated review](../../reports/TL-003-reviews.md).
Pending statements above are chronological records; all phase3 mandatory checks now
pass. Later T04 through Q12 and final integration remain required.

Durable command transcript copies normalize trailing whitespace and final blank
lines only; original ignored runtime logs retain exact captured bytes.
