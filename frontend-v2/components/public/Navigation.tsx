"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
const links = [["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Contact", "/contact"]];
export function Navigation() {
  const path = usePathname(); const [scrolled, setScrolled] = useState(false); const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  function close() { dialog.current?.close(); document.body.style.overflow = ""; }
  return <><a className="skip-link" href="#main">Skip to content</a><header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><BrandLogo/><nav aria-label="Main navigation" className="desktop-nav">{links.map(([label, href]) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>)}</nav><Link className="button button-outline nav-cta" href="/contact">Contact Us <ArrowUpRight size={15}/></Link><button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => { dialog.current?.showModal(); document.body.style.overflow = "hidden"; }}><span>Menu</span><Menu size={20}/></button></header>
  <dialog ref={dialog} className="mobile-dialog" onClose={() => { document.body.style.overflow = ""; }}><div className="mobile-menu-head"><BrandLogo/><button className="icon-button" onClick={close} aria-label="Close menu"><X/></button></div><nav aria-label="Mobile navigation">{links.map(([label, href], i) => <Link key={href} href={href} onClick={close}><small>0{i + 1}</small>{label}<ArrowUpRight/></Link>)}</nav><p className="eyebrow">THE JOURNEY IN MOTION</p></dialog></>;
}

