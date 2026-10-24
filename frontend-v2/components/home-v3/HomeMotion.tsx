'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** Native scrolling. CSS owns the finite arrival; GSAP owns only later route strokes. */
export function HomeMotion() {
  const { calm } = useTravel();
  const anchor = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useLayoutEffect(() => {
    const arrival = anchor.current?.closest('.recovery-home')?.querySelector<HTMLElement>('.rh-arrival');
    if (!arrival) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    const requested = () => {
      let manual = false;
      try { manual = localStorage.getItem('tripline-motion') === 'reduced'; } catch { /* System preference remains authoritative. */ }
      return reduced.matches || manual || connection?.saveData;
    };
    const finish = () => { arrival.dataset.entry = 'done'; };
    if (!entered.current) {
      entered.current = true;
      // Read actual browser preference: the shell deliberately uses calm SSR HTML.
      // Its conservative hydration snapshot must not cancel a normal cold entrance.
      arrival.dataset.entry = requested() || scrollY > 40 ? 'done' : 'play';
    }
    const preference = () => { if (requested()) finish(); };
    const keyboard = (event: KeyboardEvent) => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) finish(); };
    const timer = setTimeout(finish, 1100);
    window.addEventListener('wheel', finish, { passive: true });
    window.addEventListener('touchmove', finish, { passive: true });
    window.addEventListener('keydown', keyboard);
    window.addEventListener('tripline-preference', preference);
    window.addEventListener('storage', preference);
    reduced.addEventListener('change', preference);
    connection?.addEventListener?.('change', preference);
    arrival.addEventListener('focusin', finish);
    return () => {
      clearTimeout(timer); window.removeEventListener('wheel', finish); window.removeEventListener('touchmove', finish); window.removeEventListener('keydown', keyboard);
      window.removeEventListener('tripline-preference', preference); window.removeEventListener('storage', preference); reduced.removeEventListener('change', preference);
      connection?.removeEventListener?.('change', preference); arrival.removeEventListener('focusin', finish);
    };
  }, []);
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.recovery-home');
    if (!root) return;
    root.dataset.homeMotion = calm ? 'static' : 'native';
    let cancelled = false;
    let dispose = () => {};
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!calm && !connection?.saveData) {
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          root.querySelectorAll<SVGPathElement>('.flight-trace:not(.flight-trace-arrival) [data-flight-path]').forEach(path => {
            // The line is complete in server/static HTML; enhancement never hides content.
            gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: .2 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('section'), start: 'top bottom', end: 'bottom bottom', scrub: true } });
          });
        }, root);
        dispose = () => context.revert();
      });
    }
    return () => { cancelled = true; dispose(); };
  }, [calm]);
  return <span ref={anchor} hidden data-home-motion-anchor />;
}
