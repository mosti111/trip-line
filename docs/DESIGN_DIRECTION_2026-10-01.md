# Trip Line: design direction

Date: 2026-10-01. Status: design exploration; no frontend rebuild or deployment authorized by this document. The user's current request authorizes design, style, and direction work. Earlier implementation hold remains in effect.

## Intent

Build a distinctive, brand-led travel experience around connection and dependable coordination. The company serves personal travelers, Hajj and Umrah pilgrims, and business/group organizers. Türkiye anchors its identity; the profile names ten international destinations. The website must communicate all three service worlds clearly and lead to inquiries today, with external-API reservations later.

Working creative concept: A World Connected. A continuous route becomes the visual thread between immersive destination media, service chapters, company evidence, and inquiry. Use it to express the Trip Line name rather than as repeated decoration.

The earlier mostly ivory postcard mockup is superseded. The user found it generic and now requires stronger brand-color presence, comparable to V1, and greater ambition in video, animation, depth, and scroll choreography.

## Reference interpretation

- https://www.jaeco.fr/: reviewed live desktop opening and successive scroll positions on 2026-10-01. Observed full-screen Vimeo background media, oversized sans-serif headings, compact prominent contact controls, distinctive section compositions, and media-led project panels. Borrow coordinated art direction and pacing. Do not copy assets, branding, layouts, or playful agency-specific interactions. A viewport override did not produce a trustworthy phone-sized screenshot, so responsive quality is not independently established.
- https://studyfans.com/en: reviewed the live metrics section; counters advanced to 400,000 consultations, 100,000 admissions in Turkey, 20,000 in Malaysia, and 30,000 in Cyprus. Borrow the concise count-up proof mechanism, not its palette, shapes, wording, or numbers.
- frontend/styles/globals.css: V1 establishes brand dominance through dark teal foundations and photographic atmosphere. Carry forward that strength. Its gold tokens do not override the newly supplied profile's warm bronze accent.
- Source: C:/Users/mosta/Downloads/بروفايل-1.pdf, four pages, 2025 edition. Treat profile facts as company-supplied claims, not independent verification.

## Palette and distribution

Approximate sRGB colors sampled from the rendered PDF, not certified original brand tokens:

| Role | Color | Application |
| --- | --- | --- |
| Brand teal | #406764 | Large identity surfaces, navigation transitions, service chapters |
| Deep teal | #1F3E41 | Main text, dramatic contrast sections, footer |
| Night teal, proposed tonal extension | #0E2729 | Video overlays and deepest background areas |
| Bronze | #A07E63 | Route line, small accents, numbering; avoid small text on ivory |
| Sand | #E8D9C6 | Reading breaks, select controls on deep teal |
| Paper | #EDE9E6 | Photo borders and secondary surfaces |
| Ivory, proposed surface | #F7F5EF | Text on teal, forms, reading areas |

Aim for approximately 55-65% teal-family interface surfaces, 25-35% ivory/sand, and sparse bronze accents, excluding natural colors inside photography. This is an art-direction guide, not a pixel quota. Use broad color fields; avoid applying teal only to buttons. No bright-gold substitution.

Measured color-pair contrast: ivory on brand teal 5.76:1; ivory on deep teal 10.56:1; deep teal on sand 8.32:1. Bronze on ivory 3.40:1, unsuitable for ordinary small text. Audit actual typography, controls, and overlays during implementation.

## Typography and graphic language

Use confident, large sans-serif display typography as the dominant identity; use the V2 editorial serif selectively for quiet human phrases. Body and controls use a highly readable sans-serif. No oversized serif headlines in every section. Final font selection must support English/Turkish and pair convincingly with an Arabic family; test real glyphs and line breaks, not simulated Arabic.

Use a deliberate grid, numbered chapters, a single route motif, restrained architectural framing, and documentary destination photography. Postcard styling is a small supporting detail rather than the dominant layout. Avoid repeated three-card grids and decorative airport labels without practical meaning.

Logo: only the wordmark within the profile is available. Inspect its embedded asset/vector structure before extraction. If unsuitable, faithfully reconstruct the lettering, stacked arrangement, and aircraft detail for review. Concept art does not establish an approved replacement logo.

## Navigation and future integration

Desktop: logo; Services; Destinations; Business & Groups; About; language selector; WhatsApp; menu/contact action. Avoid crowding: subsidiary links live in an accessible expanded menu. Header transitions from integrated dark branding to a compact solid surface on scroll.

Languages: English, Arabic, Turkish. Arabic receives full RTL layouts and appropriate type, icon direction, numerals, text expansion, and bidi handling. Preserve selected language across navigation and contact flows. Do not mirror geographical maps or video footage.

Prepare menu/header space for separate Customer sign-in and Partner access. Display live entry points only when real destinations exist. Customer reservations and B2B workspace share branding but use task-focused interfaces without cinematic scroll scenes.

Later reservations come from an external B2B platform API. Do not invent available inventory, prices, checkout rules, or B2C capabilities. API documentation and integration terms determine booking UI. Credentials remain on the backend. Public website design can proceed independently.

## Homepage sequence

1. Arrival: a teal-dominant opening with an oversized headline, cinematic travel reel inside a deliberate media frame, and visible inquiry/WhatsApp actions. Proposed headline: The world. With you. Supporting copy names holidays, Hajj and Umrah, and business travel. The poster and text render immediately; video never gates access.
2. Connection: the hero media frame moves into depth over a short scroll interval while a route line connects three readable chapters: Travel & Holidays; Hajj & Umrah; Business & Groups. Each chapter has its own photograph and actionable service link. All paths are also available through direct navigation.
3. Proof: a distinct sand/ivory section with four large counters, aligned labels, thin rules, and a quiet route graphic. Suggested 2025-profile figures: 25,000+ satisfied clients; 15,000+ tours; 10,000+ hotel bookings; 5,000+ pilgrims and Umrah travelers. Show profile-year provenance in the design review; confirm definitions/current figures before public launch. Exclude the disputed 12+ years and ambiguous 2,000+ partnerships. Do not total potentially overlapping figures.
4. Destinations: an asymmetric photographic atlas, with real country labels and a visible list including all ten profile destinations. Feature Türkiye, Saudi Arabia, Maldives, and Georgia as illustrative editorial choices, not sales-priority claims. A map, if used, must use correct geography; cards and links remain usable without it.
5. Coordination: a quieter company/story section showing how consultation, arrangements, and travel support connect. Establishment in 2019 can be expressed without deriving an experience statistic.
6. Business capability: a dedicated composed panel for corporate travel, conferences, events, camps, and training. Clear Business & Groups inquiry action. Pilgrimage chapter uses respectful visual pacing and accurate service information.
7. Confidence: verified licensing information and authorized relationship logos, correctly labeled. No invented testimonials or badges. Empty optional evidence does not render.
8. Conversation: large teal closing composition, a short service-aware inquiry, direct WhatsApp, and useful contact details. Footer includes service access, languages, and future account/partner destinations when available.

## Service hierarchy

- Travel & Holidays: Domestic & International Tours; Tailor-made Planning; Flights & Hotels; Visa Assistance.
- Hajj & Umrah: dedicated overview with distinct sections and service-specific questions.
- Business & Groups: Corporate Travel; Conferences & Events; Summer Camps & Training Programs, with individual discoverability.

Service detail composition: purpose and audience; arrangements offered; how planning works; useful questions; contextual inquiry and WhatsApp. Do not imply a fixed package includes everything listed as an available service.

## Motion storyboard

| Scene | Desktop behavior | Mobile and reduced-motion behavior |
| --- | --- | --- |
| Arrival | Muted inline video, subtle headline entrance, static visible actions; short optional pause control | Purpose-cropped poster first; lighter reel when appropriate; reduced motion uses poster |
| Departure into depth | One short pinned transition, approximately 100-140vh, camera perspective on layered media and a route/object traveling through depth | No extended pin; three vertical chapters with modest reveals; static chapters for reduced motion |
| Service chapters | Photographic planes settle into legible scenes, active chapter label updates; pointer depth only as enhancement | Direct taps and links; no hover dependency or drag-only navigation |
| Counters | Count once over roughly 900-1400ms as section enters; final values reserved at full width | Same readable values in a 2x2 layout; final values immediately for reduced motion |
| Destinations | Selected image mask transition, restrained hover/pointer depth | Vertical layout or accessible snap browsing with explicit controls |
| Closing | Route resolves into inquiry area; short text reveal | Direct visible inquiry and WhatsApp |

Primary 3D proposal: one original scene with photographic panels, a thin route ribbon, and a restrained aircraft form derived from the logo. Real perspective, camera movement, occlusion, and lighting must be demonstrated in a working motion study before claiming 3D. A static image or SVG aircraft is not evidence of a 3D implementation. Avoid endless globes, excessive particles, or a whole page dependent on WebGL.

Use native page scrolling. Motion follows scroll progress without intercepting wheel/touch input. Text stays in semantic DOM; no text-only canvas. No sound autoplay. Provide pause for ongoing media/motion, static fallbacks, reduced-motion behavior, and keyboard access. Load the 3D scene progressively and recover to a usable static composition if rendering fails.

## Video and media requirements

Storyboard a concise licensed or company-supplied reel: Türkiye arrival/city; a travel landscape; respectful pilgrimage architecture; professional group/venue setting. Smooth continuity and consistent grade matter more than rapid cuts. Begin with a strong poster; do not depend on a long loading intro. Supply mobile crops, optimized encodes, poster frames, and documented rights. Do not download reference-site video or reuse reference assets.

Generated design imagery is illustrative and cannot establish the company's actual team, trips, partnerships, property inventory, or package availability.

## WhatsApp and inquiry

WhatsApp remains a recognizable labeled action, styled within Trip Line's palette; platform recognition comes from the icon and wording rather than an unrelated bright-green site accent. Show it in the header/menu, relevant service sections, closing inquiry, and a discreet mobile shortcut clear of controls. The profile lists +905541072202; confirm ownership/current use before public launch.

Prefill inquiry service/destination from context. Keep initial fields short; dates/group size/company are optional as relevant. No booking or account promise in inquiry wording.

## Design deliverables and acceptance

Award reference research and the selected component/motion system are documented in [AWARD_COMPONENT_RESEARCH_2026-10-01.md](./AWARD_COMPONENT_RESEARCH_2026-10-01.md). Use its evidence levels and priority decisions when developing the contained motion study.

First visual concept: new desktop homepage composition and motion intent. Then create a contained, separately reviewable motion study of arrival-to-service transition, counters, video behavior, and mobile fallback. A generated still cannot validate motion, responsiveness, accessibility, or performance.

Review actual English, Arabic, and Turkish header/hero/form compositions. Verify phone widths 360/390/430, tablet, and desktop; RTL; keyboard; reduced motion; video pause; 200% zoom; rendering-failure fallback. Public templates require distinctive compositions, while future account/booking surfaces prioritize clarity.

No edits to frontend or frontend-v2 are part of this design-direction document. No deployment, API integration, or invented booking functionality. The next design work can use these decisions without asking the user to select each individual color, layout, or animation.
