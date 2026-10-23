'use client';
import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTravel } from '../travel/SiteShell';

const Choreography = dynamic(() => import('../experience/ScrollScene').then(module => module.ScrollScene), { ssr: false });
const ScrollingClock = dynamic(() => import('../experience/ExperienceProvider').then(module => module.ExperienceProvider), { ssr: false });
const Bronze = dynamic(() => import('../experience/BronzeJourney').then(module => module.BronzeJourney), { ssr: false });

/** Server content stays mounted while the independent controllers load. */
export function HomeMotion() {
  const { calm } = useTravel();
  const anchor = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<'static' | 'native' | 'desktop'>('static');
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  // This small eager owner starts before GSAP/Three downloads. Server HTML is final
  // and visible; only a successfully mounted island opts into the finite entrance.
  useLayoutEffect(() => {
    const arrival = anchor.current?.closest('.recovery-home')?.querySelector<HTMLElement>('.rh-arrival');
    if (!arrival) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const staticMode = () => {
      let manual = false;
      try { manual = localStorage.getItem('tripline-motion') === 'reduced'; } catch { /* System preference still applies when storage is unavailable. */ }
      return reduced.matches || manual || connection?.saveData;
    };
    const finish = () => { arrival.dataset.entry = 'done'; };
    const keyboard = (event: KeyboardEvent) => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) finish(); };
    const preference = () => { if (staticMode()) finish(); };
    const animationEnd = (event: AnimationEvent) => { if (event.animationName === 'rh-photo-arrive') finish(); };
    arrival.dataset.entry = staticMode() || scrollY > 40 ? 'done' : 'play';
    arrival.addEventListener('animationend', animationEnd);
    arrival.addEventListener('focusin', finish);
    // A fast scroll takes ownership immediately; never complete a delayed reveal
    // over departing copy or replay it when motion/input modes change.
    window.addEventListener('wheel', finish, { passive: true });
    window.addEventListener('touchmove', finish, { passive: true });
    window.addEventListener('keydown', keyboard);
    reduced.addEventListener('change', preference);
    window.addEventListener('tripline-preference', preference);
    window.addEventListener('storage', preference);
    if (typeof connection?.addEventListener === 'function') connection.addEventListener('change', preference);
    const guard = setTimeout(finish, 1600);
    return () => {
      clearTimeout(guard); arrival.removeEventListener('animationend', animationEnd); arrival.removeEventListener('focusin', finish);
      window.removeEventListener('wheel', finish); window.removeEventListener('touchmove', finish); window.removeEventListener('keydown', keyboard);
      reduced.removeEventListener('change', preference);
      window.removeEventListener('tripline-preference', preference); window.removeEventListener('storage', preference);
      if (typeof connection?.removeEventListener === 'function') connection.removeEventListener('change', preference);
      delete arrival.dataset.entry;
    };
  }, []);
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px) and (pointer: fine)');
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const update = () => {
      setMode(calm || connection?.saveData ? 'static' : desktop.matches ? 'desktop' : 'native');
      setSlot(anchor.current?.closest('.recovery-home')?.querySelector<HTMLElement>('.rh-flight-slot') ?? null);
    };
    update(); desktop.addEventListener('change', update);
    if (typeof connection?.addEventListener === 'function') connection.addEventListener('change', update);
    return () => { desktop.removeEventListener('change', update); if (typeof connection?.removeEventListener === 'function') connection.removeEventListener('change', update); };
  }, [calm]);
  return <><span ref={anchor} hidden data-home-motion-anchor />{mode !== 'static' && <Choreography mode={mode} />}{mode === 'desktop' && <ScrollingClock />}{mode === 'desktop' && slot && createPortal(<Bronze />, slot)}</>;
}
