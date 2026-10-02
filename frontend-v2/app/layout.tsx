import type { Metadata } from 'next';
import { Manrope, Noto_Sans_Arabic } from 'next/font/google';
import '@/styles/travel.css';
import { headers } from 'next/headers';
import { siteUrl } from '@/lib/site-url';
import { isLocale } from '@/lib/i18n';
import { SiteShell } from '@/components/travel/SiteShell';
const sans=Manrope({subsets:['latin','latin-ext'],variable:'--font-body',display:'swap'});
const arabic=Noto_Sans_Arabic({subsets:['arabic'],variable:'--font-arabic',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Trip Line — Go somewhere meaningful.',template:'%s · Trip Line'},robots:{index:false,follow:false},icons:{icon:'/brand/mark.svg'}};
export default async function RootLayout({children}:{children:React.ReactNode}){const lang=(await headers()).get('x-tripline-locale')||'en';const locale=isLocale(lang)?lang:'en';return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} className={`${sans.variable} ${arabic.variable}`}><body><SiteShell locale={locale} nonce={(await headers()).get('x-nonce')||undefined}>{children}</SiteShell></body></html>;}
