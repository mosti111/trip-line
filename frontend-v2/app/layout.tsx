import type { Metadata } from 'next';
import { Instrument_Serif, Manrope, Barlow_Condensed, Caveat } from 'next/font/google';
import '@/styles/journal.css';
import { connection } from 'next/server';
import { siteUrl } from '@/lib/site-url';
const serif=Instrument_Serif({weight:'400',style:['normal','italic'],subsets:['latin'],variable:'--font-display'});
const sans=Manrope({subsets:['latin'],variable:'--font-body'});
const condensed=Barlow_Condensed({weight:['600','700'],subsets:['latin'],variable:'--font-condensed'});
const hand=Caveat({weight:'400',subsets:['latin'],variable:'--font-hand'});
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Trip Line — The Living Travel Journal',template:'%s · Trip Line'},robots:{index:false,follow:false},icons:{icon:'/brand/mark.svg'}};
export default async function RootLayout({children}:{children:React.ReactNode}){await connection();return <html lang="en" className={`${serif.variable} ${sans.variable} ${condensed.variable} ${hand.variable}`}><body>{children}</body></html>;}
