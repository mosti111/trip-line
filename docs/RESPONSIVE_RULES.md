Current V6 engineering verification: six required sizes × EN/TR/AR × normal/reduced pass, with selected internal-page, coarse-input, short-height, no-JS and SaveData checks. Native scrolling at all sizes; lighter phone depth and geographic orientation retained. Exact coverage/limitations: [TL-007 delivery](reports/TL-007-v6.md).

Current V5 uses native scrolling at every width and no height-dependent hero pin. Final six-size EN/TR/AR matrix is in [TL-006 report](reports/TL-006-v5.md). Keep the mobile/RTL/accessibility principles below; historical Lenis/3D eligibility describes superseded homepage implementation.

# Trip Line responsive rules

Desktop, tablet and phone are related compositions, not mechanically scaled copies.
These are expectations, not a completed QA claim. Read [V3 notes](V3_BRONZE_JOURNEY.md)
for current enhancement thresholds.

## Small phones

Review 360–430px widths, including long translations. Require no document-level horizontal
overflow, intentional headline line breaks, readable type, appropriate content order,
usable controls and no clipped critical UI. Avoid giant desktop spacing reduced without
considering rhythm. Preserve destination/service/inquiry access.

## Height handling

Use svh/dvh for fullscreen heroes/menus where they solve mobile browser chrome issues;
do not blindly rely on legacy 100vh. Judge actual short-height and landscape behavior.
Current styles use svh film/hero and dvh dialog sizing; menu content remains reachable.

## Touch

Aim for practical 44px targets and sufficient spacing; primary current controls generally
use 48px or more. No essential action depends on hover, drag or precise pointer movement.
Planner ordering has labeled button alternatives.

## Tablet and desktop

Review navigation, atlas, split layouts, image proportions, typography, sticky elements
and 3D independently. Current V3 uses native scrolling/static bronze below 1024px;
768–1023px has a split service selector and explorer; phones use vertical chapters,
a twelve-place index in two columns, and a single-column planner. At ≥1024px eligible desktop enhancement can apply; ≥1280px has
fuller depth and optional contextual caption. Pinning/Lenis additionally require
height >=800px, fine input and no data-saver/reduced-motion preference; coarse input
keeps the static ribbon and vertical chapters. These describe current composition rather
than universal breakpoints. Review 1024px separately from 768px and 1440px.

## RTL/localization

Arabic uses actual RTL and logical CSS properties where appropriate, connected text and
suitable line height. Do not mirror maps, geographic shapes, photographs or directional
content whose meaning would change. Isolate coordinates/phone values where needed.
Preserve semantic order, labels, keyboard access and query context across locale switches.
Do not split Arabic words for reveals.

## Media

Art direction can require phone-specific crop, focal point or aspect ratio. Do not blindly
reuse desktop focal points. Important text remains HTML, separate from imagery/video.

## Motion

Simplify depth/motion for screen size, input and performance while preserving narrative.
Reduced-motion, data-saving and WebGL-failure modes retain essential content and actions.

## Safe areas and verification

Account for device safe-area insets where fixed/floating controls conflict with browser/device
UI. Test landscape/short-height menus, floating contact controls and keyboard/form states.
Check focus, 200% text zoom, clipping and overflow across relevant routes/locales. Record
actual coverage and physical-device limitations; V2 screenshots are not new V3 verification.
