import { getSite } from "@/lib/server";
import { Navigation } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Footer";
import { demoEnabled } from "@/lib/demo";
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return <><Navigation/><main id="main">{children}</main><Footer site={site}/>{demoEnabled && <div className="demo-badge"><span/> DESIGN PREVIEW <span className="demo-badge-detail">— SAMPLE CONTENT & IMAGERY</span></div>}</>;
}
