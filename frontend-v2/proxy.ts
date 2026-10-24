import { NextResponse, type NextRequest } from "next/server";
import { isLocale, preferredLocale } from './lib/i18n';
import { publicPaths } from './lib/travel-content';
export function proxy(request: NextRequest) {
  const path=request.nextUrl.pathname;
  const segment=path.split('/')[1];
  const locale=isLocale(segment)?segment:preferredLocale(request.cookies.get('tripline-language')?.value,request.headers.get('accept-language'));
  const unlocalized=!isLocale(segment)&&!path.startsWith('/preview')&&!path.startsWith('/admin');
  const suffix=isLocale(segment)?path.slice(segment.length+1):path;
  const legacy:Record<string,string>={'/journeys':'/destinations','/journeys/istanbul':'/destinations/turkiye','/journeys/cappadocia':'/destinations/turkiye','/journeys/turquoise-coast':'/destinations/turkiye','/services/private-transfers':'/services/tailor-made','/services/private-tours':'/services/tours','/services/curated-stays':'/services/flights-hotels'};
  if(unlocalized||legacy[suffix]){const url=request.nextUrl.clone();url.pathname=`/${locale}${legacy[suffix]||(suffix==='/'?'':suffix)}`;const response=NextResponse.redirect(url,307);response.headers.set('Vary','Accept-Language, Cookie');return response;}
  const nonce = btoa(crypto.randomUUID());
  const media = process.env.MEDIA_ORIGIN || "";
  const policy = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}; style-src 'self' ${process.env.NODE_ENV === "development" ? "'unsafe-inline'" : `'nonce-${nonce}'`}; style-src-attr 'unsafe-inline'; img-src 'self' data: blob: ${media}; media-src 'self'; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
  const headers = new Headers(request.headers); headers.set('x-tripline-locale',locale);headers.set("x-nonce", nonce); headers.set("Content-Security-Policy", policy);
  const unknownPublicPage=isLocale(segment)&&suffix!=='/motion-lab'&&!publicPaths.includes(suffix.replace(/^\//,''));
  const response = unknownPublicPage ? NextResponse.rewrite(new URL('/_not-found',request.url), { status:404, request:{headers} }) : NextResponse.next({ request: { headers } }); response.headers.set("Content-Security-Policy", policy);
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/preview")) {
    response.headers.set("Cache-Control", "private, no-store"); response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand/|images/|media/|robots.txt|sitemap.xml).*)"] };
