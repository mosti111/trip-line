import { getPage, getSite } from "@/lib/server";
import { demoEnabled } from "@/lib/demo";
import { documentMetadata } from "@/lib/metadata";
import { EditorialImage } from "@/components/public/Editorial";
import { ContactForm } from "@/components/public/ContactForm";
import { JourneyLine } from "@/components/motion/JourneyLine";
import { Mail, MapPin, Phone } from "lucide-react";
export async function generateMetadata() { return documentMetadata(await getPage("contact"), "/contact"); }
export default async function Contact() { const [page, site] = await Promise.all([getPage("contact"), getSite()]); const c = page.content; return <section className="contact-page"><EditorialImage src={c.image} alt={c.imageAlt} className="contact-background"/><div className="contact-shade"/><div className="contact-copy"><p className="eyebrow">{c.eyebrow}</p><h1>{c.title}</h1><p>{c.description}</p><div className="contact-details">{site.phone && <a href={`tel:${site.phone}`}><Phone size={18}/>{site.phone}</a>}{site.email && <a href={`mailto:${site.email}`}><Mail size={18}/>{site.email}</a>}{site.address && <p><MapPin size={18}/>{site.address}</p>}</div><JourneyLine staticMode aircraft={false}/></div><ContactForm demo={demoEnabled}/></section>; }
