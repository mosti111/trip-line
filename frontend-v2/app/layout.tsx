import type { Metadata } from 'next';
import { Manrope, Noto_Sans_Arabic } from 'next/font/google';
import '@/styles/travel.css';
import '@/styles/experience.css';
import '@/styles/recovery-shell.css';
import '@/styles/v5-foundations.css';
import '@/styles/v6-motion.css';
import '@/styles/v1-mobile-review.css';
import '@/styles/v11-mobile-recovery.css';
import { headers } from 'next/headers';
import { siteUrl } from '@/lib/site-url';
import { isLocale } from '@/lib/i18n';
import { motionBootstrap } from '@/lib/motion-preference';
import { SiteShell } from '@/components/travel/SiteShell';
const sans=Manrope({subsets:['latin','latin-ext'],variable:'--font-body',display:'swap'});
const arabic=Noto_Sans_Arabic({subsets:['arabic'],variable:'--font-arabic',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Trip Line — Go somewhere meaningful.',template:'%s · Trip Line'},robots:{index:false,follow:false},icons:{icon:'/brand/mark.svg'}};
// Resolve layout-affecting preferences before body paint. The conservative React
// hydration snapshot may pause motion, but must never expand/collapse logo rows.

export default async function RootLayout({children}:{children:React.ReactNode}){
 const requestHeaders=await headers();
 const lang=requestHeaders.get('x-tripline-locale')||'en';
 const locale=isLocale(lang)?lang:'en';
 const nonce=requestHeaders.get('x-nonce')||undefined;
 return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} className={`${sans.variable} ${arabic.variable}`} suppressHydrationWarning>
  <head><script id="tripline-motion-layout" nonce={nonce} dangerouslySetInnerHTML={{__html:motionBootstrap}}/></head>
  <body><SiteShell locale={locale} nonce={nonce}>{children}</SiteShell></body>
 </html>;
}
