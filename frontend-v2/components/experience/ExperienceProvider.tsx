'use client';
import { useEffect } from 'react';
import { useTravel } from '../travel/SiteShell';

/** One homepage wheel clock. Native touch, controls and every dialog stay authoritative. */
export function ExperienceProvider() {
  const { calm } = useTravel();
  useEffect(() => {
    if (calm) return;
    let cancelled = false, dispose = () => {};
    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ smoothWheel: true, syncTouch: false, anchors: true, respectReducedMotion: true,
        prevent: node => !!node.closest('dialog,input,textarea,select,[data-native-scroll]') });
      const html = document.documentElement;
      html.dataset.lenisCount = '1';
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (seconds: number) => { if (!document.hidden) lenis.raf(seconds * 1000); };
      gsap.ticker.add(tick);
      const sync = () => {
        const paused = document.hidden || !!document.querySelector('dialog[open],.turkiye-mega:not([hidden])');
        if (paused) lenis.stop(); else lenis.start();
        html.dataset.lenis = paused ? 'paused' : 'running';
      };
      // A subtree observer handles dialogs mounted after this controller, including Journey.
      const observer = new MutationObserver(records => { if (records.some(record => record.type === 'childList' || ['open','hidden'].includes(record.attributeName ?? ''))) sync(); });
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open','hidden'] });
      document.addEventListener('visibilitychange', sync); sync();
      const focusArrival = () => lenis.scrollTo(Number(document.querySelector('[data-pin-start]')?.getAttribute('data-pin-start') ?? 0), { immediate: true, force: true });
      window.addEventListener('bronze-focus-arrival', focusArrival);
      const keyboard = (event: KeyboardEvent) => {
        if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key) && !(event.target as Element)?.closest('dialog,input,textarea,select,[contenteditable=true]')) lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true });
      };
      window.addEventListener('keydown', keyboard);
      dispose = () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); window.removeEventListener('bronze-focus-arrival', focusArrival); window.removeEventListener('keydown', keyboard); gsap.ticker.remove(tick); lenis.destroy(); delete html.dataset.lenis; delete html.dataset.lenisCount; };
    });
    return () => { cancelled = true; dispose(); };
  }, [calm]);
  return null;
}
