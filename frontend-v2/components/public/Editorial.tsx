import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Content, Document, Section } from "@/lib/types";
import { JourneyLine } from "../motion/JourneyLine";
import { HeroAircraft } from "../motion/HeroAircraft";
import { Reveal } from "../motion/Reveal";

export function EditorialImage({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return src ? <div className={`editorial-image ${className}`}><Image src={src} alt={alt || ""} fill sizes="(max-width: 768px) 100vw, 60vw" priority={priority}/></div> : <div className={`editorial-image image-empty ${className}`} aria-hidden="true"/>;
}
export function Action({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link href={href || "/contact"} className={`button ${secondary ? "button-outline" : "button-gold"}`}>{children}<ArrowRight size={17}/></Link>;
}
export function Hero({ content: c, home = false }: { content: Content; home?: boolean }) {
  const lines = c.title.split("\n");
  return <section className={`hero ${home ? "hero-home" : "hero-inner"}`}><EditorialImage src={c.image} alt={c.imageAlt} className="hero-background" priority/><div className="hero-shade"/><div className="section-rail" aria-hidden="true"><span>01</span><i/><i/><i/><span>EXPLORE</span></div><div className="hero-copy"><p className="eyebrow">{c.eyebrow}</p><h1>{lines.map((line, i) => <span key={i} className={home && i === lines.length - 1 ? "accent-text" : ""}>{line}{i < lines.length - 1 && <br/>}</span>)}</h1>{c.description && <p className="hero-description">{c.description}</p>}<div className="hero-actions">{c.ctaLabel && <Action href={c.ctaUrl}>{c.ctaLabel}</Action>}{home && <Link className="text-link" href="/contact">Contact Us <ArrowUpRight size={15}/></Link>}</div></div>{home && <><JourneyLine staticMode/><HeroAircraft/><a href="#journey" className="scroll-cue"><span><ArrowDown size={15}/></span>Scroll to explore</a><p className="hero-caption">A CHANGE OF SCENE.<br/>A NEW PERSPECTIVE.</p></>}</section>;
}
export function ServiceCards({ services }: { services: Document[] }) {
  return <div className="service-cards">{services.map((s, i) => <Link className="service-card" key={s.id} href={`/services/${s.slug}`}><EditorialImage src={s.content.image} alt={s.content.imageAlt}/><div className="service-card-copy"><span className="service-number">0{i + 1}</span><h3>{s.content.title}</h3><p>{s.content.description}</p><span className="round-arrow"><ArrowUpRight size={18}/></span></div></Link>)}</div>;
}
export function Sections({ sections, services = [] }: { sections: Section[]; services?: Document[] }) {
  return <div id="journey">{sections.filter(s => s.enabled).map((s, i) => {
    if (["metrics", "team", "partners", "values", "highlights", "faq", "gallery", "related"].includes(s.type) && !s.items.length) return null;
    if (s.type === "services") return services.length ? <section className="services-section" key={s.key}><div className="section-intro"><p className="eyebrow">0{i + 2} — {s.eyebrow}</p><h2>{s.title}</h2><p>{s.body}</p>{s.ctaLabel && <Action href={s.ctaUrl}>{s.ctaLabel}</Action>}</div><ServiceCards services={services.filter(x => x.content.featured).slice(0, 3)}/></section> : null;
    if (s.type === "cta") return <section className="final-cta" key={s.key}><JourneyLine staticMode aircraft={false}/><Reveal><p className="eyebrow">{s.eyebrow}</p><h2>{s.title}</h2><p>{s.body}</p><div className="cta-actions">{s.ctaLabel && <Action href={s.ctaUrl}>{s.ctaLabel}</Action>}<Action href="/contact" secondary>Contact Us</Action></div></Reveal></section>;
    if (s.type === "story" && s.image) return <section className="feature-story" key={s.key}><EditorialImage src={s.image} alt={s.imageAlt}/><Reveal><p className="eyebrow">{s.eyebrow}</p><h2>{s.title}</h2><p>{s.body}</p></Reveal></section>;
    if (s.type === "faq") return <section className="light-section faq-section" key={s.key}><p className="eyebrow">{s.eyebrow}</p><h2>{s.title}</h2>{s.items.map((item, n) => <details key={n}><summary>{item.title}</summary><p>{item.body}</p></details>)}</section>;
    return <section className={`light-section editorial-section section-${s.type}`} key={s.key}><Reveal className="editorial-copy"><p className="eyebrow">0{i + 2} — {s.eyebrow}</p><h2>{s.title}</h2>{s.body && <p className="body-copy">{s.body}</p>}{s.ctaLabel && <Link className="text-link" href={s.ctaUrl || "/about"}>{s.ctaLabel}<span className="round-arrow"><ArrowRight size={16}/></span></Link>}</Reveal>{s.image && <Reveal className="editorial-visual"><EditorialImage src={s.image} alt={s.imageAlt} className="arch-image"/><span className="vertical-caption">PEOPLE · PLACES · POSSIBILITIES</span></Reveal>}{s.items.length > 0 && <div className={`section-items ${s.type === "process" ? "process-items" : ""}`}>{s.items.map((item, n) => <article key={n}>{item.image && <EditorialImage src={item.image} alt={item.imageAlt}/>}<span className="eyebrow">0{n + 1}</span><h3>{item.title}</h3><p>{item.body}</p>{item.url && <Link className="text-link" href={item.url}>Discover <ArrowUpRight size={16}/></Link>}</article>)}</div>}</section>;
  })}</div>;
}
