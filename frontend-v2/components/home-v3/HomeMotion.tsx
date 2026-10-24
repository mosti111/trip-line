'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** Native scrolling. CSS owns the finite arrival; GSAP owns only later route strokes. */
export function HomeMotion() {
  const { calm } = useTravel();
  const anchor = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.recovery-home');
    const arrival = root?.querySelector<HTMLElement>('.rh-arrival');
    if (!root || !arrival) return;
    root.dataset.homeMotion = calm ? 'static' : 'native';
    if (!entered.current) {
      entered.current = true;
      arrival.dataset.entry = calm || scrollY > 40 ? 'done' : 'play';
    }
    const finish = () => { arrival.dataset.entry = 'done'; };
    if (calm) finish();
    const timer = setTimeout(finish, 1100);
    window.addEventListener('wheel', finish, { passive: true, once: true });
    window.addEventListener('touchmove', finish, { passive: true, once: true });
    arrival.addEventListener('focusin', finish);
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
    return () => { cancelled = true; dispose(); clearTimeout(timer); window.removeEventListener('wheel', finish); window.removeEventListener('touchmove', finish); arrival.removeEventListener('focusin', finish); };
  }, [calm]);
  return <span ref={anchor} hidden data-home-motion-anchor />;
}
