"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useState } from "react";
const Scene = dynamic(() => import("./AircraftScene"), { ssr: false });
class Boundary extends Component<{ children: React.ReactNode }, { failed: boolean }> { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { return this.state.failed ? null : this.props.children; } }
export function HeroAircraft() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { if (matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches) { const timer = setTimeout(() => { try { const c = document.createElement("canvas"); if (c.getContext("webgl2")) setEnabled(true); } catch {} }, 1800); return () => clearTimeout(timer); } }, []);
  return enabled ? <div className="hero-aircraft" aria-hidden="true"><Boundary><Scene/></Boundary></div> : null;
}
