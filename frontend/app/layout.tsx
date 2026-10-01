import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/mobile.css";
import { demoEnabled } from "@/lib/demo";
import { connection } from "next/server";
import { siteUrl } from "@/lib/site-url";
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: "Trip Line", template: "%s · Trip Line" }, description: "", icons: { icon: "/brand/mark.svg" }, ...(demoEnabled ? { robots: { index: false, follow: false } } : {}) };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // A fresh request is required for the CSP nonce used by Next's hydration scripts.
  await connection();
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body>{children}</body></html>;
}
