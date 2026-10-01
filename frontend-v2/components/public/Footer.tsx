import Link from "next/link";
import type { Site } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
export function Footer({ site }: { site: Site }) {
  return <footer className="site-footer"><div className="footer-top"><BrandLogo/><p>{site.tagline}</p><nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/services">Services</Link><Link href="/contact">Contact</Link></nav><div>{site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}{site.phone && <a href={`tel:${site.phone}`}>{site.phone}</a>}{site.address && <p>{site.address}</p>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.companyName}. {site.footerText}</span><div>{site.socials.map(s => <a key={s.url} href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a>)}</div><span className="eyebrow">A NEW PERSPECTIVE</span></div></footer>;
}
