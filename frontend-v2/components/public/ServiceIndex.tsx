"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Document } from "@/lib/types";
import Image from "next/image";
export function ServiceIndex({ services }: { services: Document[] }) {
  const [active, setActive] = useState(0);
  return <section className="service-index light-section"><div className="index-links">{services.map((s, i) => <Link href={`/services/${s.slug}`} key={s.id} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}><span className="eyebrow">{String(i + 1).padStart(2, "0")}</span><div><h2>{s.content.title}</h2><p>{s.content.description}</p></div>{s.content.image && <div className="index-thumb"><Image src={s.content.image} alt={s.content.imageAlt || ""} fill sizes="(max-width:768px) 80vw, 150px"/></div>}<ArrowUpRight/></Link>)}</div>{services[active]?.content.image && <div className="index-preview"><Image key={services[active].id} src={services[active].content.image} alt={services[active].content.imageAlt || ""} fill sizes="40vw"/></div>}{!services.length && <p>Our services are being prepared. <Link href="/contact">Contact us</Link> to discuss your plans.</p>}</section>;
}
