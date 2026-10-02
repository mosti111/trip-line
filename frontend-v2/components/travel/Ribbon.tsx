'use client';
import { useId } from 'react';

/** Lightweight graphic state of the route. The homepage owns the only WebGL scene. */
export function Ribbon() {
  const id=useId();
  return <div className="ribbon" aria-hidden="true"><svg viewBox="0 0 1440 220" preserveAspectRatio="none"><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#efd3ac"/><stop offset=".4" stopColor="#bc936e"/><stop offset="1" stopColor="#775338"/></linearGradient></defs><path d="M-40 75 C240 220 430 205 660 119 S960 -35 1160 86 S1360 195 1490 100" stroke={`url(#${id})`} strokeWidth="3" fill="none"/></svg></div>;
}
