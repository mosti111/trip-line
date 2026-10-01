"use client";
import { useId, useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
export function JourneyLine({ staticMode = false, variant = "dark", aircraft = true, gradient = true }: { staticMode?: boolean; variant?: "dark" | "light"; aircraft?: boolean; gradient?: boolean }) {
  const ref = useRef<HTMLDivElement>(null); const id = useId().replace(/:/g, ""); const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return <div ref={ref} className={`journey-line journey-${variant}`} aria-hidden="true"><svg viewBox="0 0 1000 650" width="100%" height="100%" fill="none"><defs><linearGradient id={id}><stop stopColor="var(--color-gold-dark)"/><stop offset=".5" stopColor="var(--color-gold-light)"/><stop offset="1" stopColor="var(--color-gold)"/></linearGradient></defs><motion.path d="M-30 615C165 626 404 578 481 433S453 167 745 138" stroke={gradient ? `url(#${id})` : "var(--accent)"} strokeWidth="2" style={staticMode || reduced ? {} : { pathLength: scrollYProgress }}/><circle cx="25" cy="615" r="4" fill="var(--accent)"/><circle cx="745" cy="138" r="4" fill="var(--accent)"/>{aircraft && <path d="m741 112 10 14 26-1 9 6-28 6-8 19-5-2 2-18-15-5-6 3-3-3 8-8 12 3-6-13z" fill="var(--accent)" stroke="var(--color-gold-light)"/>}</svg></div>;
}

