# Routes and localization

28 October 2026. lib/travel-content.ts defines 40 public paths per locale; lib/i18n.ts
defines EN/AR/TR; lib/turkiye.ts supplies twelve Turkish places. The result is **120
localized content URLs**. Motion Lab, framework endpoints, robots/sitemap and 404
handling are separate from that count.

| Route family (prefix /{locale}) | Count per locale |
| --- | --- |
| Homepage | 1 |
| Services hub + nine details | 10 |
| Destinations hub + ten countries | 11 |
| Twelve Türkiye place details | 12 |
| business, about, contact, faq, privacy, terms | 6 |
| Total | 40 |

app/[locale]/[[...slug]]/page.tsx dispatches the allowlist at request time, with notFound
for unknown content. These are not 120 statically prerendered pages: root headers supply
nonce/locale, and the build reports dynamic routes. app/sitemap.ts enumerates public paths
and locales with alternates. The build table also includes framework/historical preview routes.

proxy.ts prefers explicit locale paths, otherwise tripline-language cookie and supported
Accept-Language, then English. Legacy redirects retain query context. SiteShell remembers
manual language choice and resolves same-content links. Test switching, contact context
and unknown routes.

Typed local Text records supply EN/AR/TR. Arabic sets html lang=ar/dir=rtl and Noto Sans
Arabic. Maps, anchors, coordinates and photos retain physical orientation; phone/coordinate
values use directional isolation where needed. Do not split Arabic words for reveals.
Preserve IDs/order through locale changes and contact transfer.

generateMetadata supplies localized titles/descriptions, canonical paths, three language
alternates and OpenGraph metadata. lib/site-url.ts resolves NEXT_PUBLIC_SITE_URL, provider
production URL, provider deployment URL, then localhost. No final canonical production
domain is approved by consolidation. Noindex/nofollow and robots disallow remain;
sitemap presence does not authorize indexing.

Services: tours, hajj-umrah, camps, corporate, flights-hotels, tailor-made, events,
training, visa-assistance. Countries: Türkiye, Georgia, Egypt, Saudi Arabia, Oman,
Qatar, UAE, Maldives, Malaysia, Indonesia. Türkiye: Istanbul, Trabzon, Rize & Ayder,
Uzungöl, Antalya, Bodrum, Fethiye, Marmaris, Sapanca, Bursa, Yalova, Cappadocia.
Source claims stay attributed; legal pages remain pending review.

[QA/release](QA_RELEASE.md) covers HTTP/heading/language, RTL, metadata and interactions.
Separate historical evidence from fresh cleanup results.
