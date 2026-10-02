# Profile atlas direction

User direction, 1 October 2026: retain the atlas from V2, redesigned for the company profile and its countries. This supersedes the proposed floating destination photo planes and standalone panorama as the main destination-browsing component.

## Existing V2 behavior to preserve

Source: `frontend-v2/components/journal/Experience.tsx`, `Atlas()`; styles in `frontend-v2/styles/journal.css`.

Selecting a named map location or equivalent destination selector updates one synchronized photograph, title, description and destination link. Existing V2 locations are Istanbul, Cappadocia and the Turquoise Coast, on a schematic Türkiye map. The new atlas expands discovery to countries while retaining this direct selection model.

## New country set

Türkiye, Georgia, Egypt, Saudi Arabia, Oman, Qatar, UAE, Maldives, Malaysia, Indonesia. All are listed in the profile. Ordering is an editorial grouping, not company sales priority. Start on Türkiye. Selecting a country must not imply an available package or supplier inventory.

## Composition

Profile teal ocean/background, sand land, bronze rings/routes, warm light labels. Keep the profile's stacked Trip Line airplane logo. Use the actual extracted logo in implementation; generated mockups only approximate it.

One broad geographic map plus one integrated, straight destination photograph and editorial copy. No floating or tilted preview card, multiple photo-plane stack, or boxed country tiles. Use a plain country index, selection underline and visible inquiry actions. A discreet compass and limited illustrative route detail preserve the V2 atlas character.

The generated `references/design-direction/tripline-profile-atlas-v1.png` is a static composition study. Its geography, pin positions, boundaries and generated logo are not production assets. Implement the map using reliable geographic vectors and verified coordinates, with leader lines and zoom/region detail where Gulf destinations crowd together. Do not trace generated geography. Decorative routes are illustrative, not transport or commercial connectivity claims.

## Interaction and motion

- Map pins and country index select the same active country. Show selection using ring, label and underline, not color alone.
- Update photo, heading, description and inquiry context together. A short 250–400ms image crossfade and subtle pin-ring response are sufficient; no automatic country cycling or camera flights on every selection.
- Display country-relevant services only when supported by confirmed company content. Keep calls to action as exploration/inquiry until reservation capabilities are defined.
- Country selection can prefill WhatsApp/inquiry context. It does not create a reservation or promise availability.
- Phone layout: country selector first, synchronized preview next; map is an optional secondary view. Do not require tiny-pin tapping or map dragging.
- Keyboard-operable named controls and equivalent country list; visible focus, selected state and readable text. Reduced motion shows the selected state immediately.
- English, Arabic and Turkish translations. Arabic interface layout may reverse, but actual map geography stays in its geographic orientation.

Design-only deliverable; no frontend files changed.

Generated with built-in image generation. Prompt direction: adapt V2's selectable atlas to the ten profile countries with profile teal/sand/bronze, stacked airplane logo reference, geographic map, synchronized unboxed destination preview and country index.
