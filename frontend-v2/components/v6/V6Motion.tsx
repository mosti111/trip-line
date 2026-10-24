'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** GSAP owns these scene wrappers only; CSS and Motion own their nested UI. */
export function V6Motion() {
  const { calm } = useTravel();
  const anchor = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.v6-home');
    if (!root) return;
    const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    root.dataset.homeMotion = calm || saveData ? 'static' : 'native';
    if (calm || saveData) return;
    let cancelled = false;
    let dispose = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const arrival = root.querySelector<HTMLElement>('.rh-arrival');
      const mobile = matchMedia('(max-width: 767px)').matches;
      let removeIntroListeners = () => {};
      const context = gsap.context(() => {
        if (arrival && !entered.current) {
          entered.current = true;
          arrival.dataset.entry = 'play';
          const intro = gsap.timeline({ onComplete: () => { arrival.dataset.entry = 'done'; } });
          intro.fromTo('.rh-photo-settle', { scale: 1.08, yPercent: 2 }, { scale: 1, yPercent: 0, duration: 1.3, ease: 'power3.out' }, 0);
          intro.fromTo('.rh-title-ink', { yPercent: 105, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, clipPath: 'inset(0 0 -20% 0)', stagger: .1, duration: .65, ease: 'power3.out' }, .18);
          intro.fromTo('.rh-support-reveal,.rh-links-reveal,.rh-arrival-foot', { y: 12, opacity: .4 }, { y: 0, opacity: 1, stagger: .06, duration: .55 }, .65);
          const path = arrival.querySelector<SVGPathElement>('[data-flight-path]');
          const plane = arrival.querySelector<SVGGElement>('[data-flight-plane]');
          if (path) {
            intro.fromTo(path, { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .65, ease: 'power2.inOut' }, .35);
            if (plane) {
              const position = { value: 0 }; const length = path.getTotalLength();
              intro.to(position, { value: .76, duration: .65, ease: 'power2.inOut', onUpdate: () => {
                const point = path.getPointAtLength(length * position.value);
                const ahead = path.getPointAtLength(Math.min(length, length * position.value + 2));
                gsap.set(plane, { x: point.x, y: point.y, rotation: Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180 / Math.PI + 45, transformOrigin: '0 0', opacity: 1 });
              } }, .35);
            }
          }
          const finish = () => { intro.progress(1); };
          arrival.addEventListener('focusin', finish);
          window.addEventListener('wheel', finish, { passive: true, once: true });
          window.addEventListener('touchmove', finish, { passive: true, once: true });
          removeIntroListeners = () => { arrival.removeEventListener('focusin', finish); window.removeEventListener('wheel', finish); window.removeEventListener('touchmove', finish); };
          if (scrollY > 40) finish();
        }
        if (arrival) {
          gsap.to('.rh-arrival-photo', { scale: mobile ? .97 : .91, yPercent: 9, clipPath: mobile ? 'inset(0 3% 0 3%)' : 'inset(0 7% 0 7%)', ease: 'none', scrollTrigger: { trigger: arrival, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
          root.querySelectorAll('.rh-world-photo').forEach((photo, index) => gsap.fromTo(photo, { clipPath: index % 2 ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)', y: mobile ? 18 : 65 }, { clipPath: 'inset(0 0 0% 0%)', y: 0, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 96%', end: 'top 48%', scrub: true, invalidateOnRefresh: true } }));
        }
        root.querySelectorAll<SVGPathElement>('.flight-trace:not(.flight-trace-arrival) [data-flight-path]').forEach(path => {
          gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('section'), start: 'top 80%', end: 'bottom 65%', scrub: true } });
        });
      }, root);
      // Recompute on layout/image changes without a continuous render loop.
      let frame = 0;
      const resize = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()); });
      resize.observe(root);
      dispose = () => { removeIntroListeners(); cancelAnimationFrame(frame); resize.disconnect(); context.revert(); };
    });
    return () => { cancelled = true; dispose(); };
  }, [calm]);
  return <span hidden ref={anchor} data-v6-motion-anchor/>;
}
