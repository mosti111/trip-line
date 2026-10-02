'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTravel } from '../travel/SiteShell';

/** One scrolling clock. Native touch, keyboard, links, nested controls and dialogs remain authoritative. */
export function ExperienceProvider() {
  const { calm } = useTravel();
  const pathname = usePathname();
  useEffect(() => {
    if (calm || !/^\/(en|ar|tr)\/?$/.test(pathname)) return;
    const media = matchMedia('(min-width: 1024px) and (pointer: fine)');
    let dispose = () => {};
    let cancelled = false;
    async function setup() {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'), import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(media.media, () => {
        const lenis = new Lenis({ smoothWheel: true, syncTouch: false, anchors: true,
          respectReducedMotion: true, prevent: node => !!node.closest('dialog,input,textarea,select,[data-native-scroll]') });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const dialog = document.querySelector('dialog');
        const syncDialog = () => dialog?.open ? lenis.stop() : lenis.start();
        const observer = new MutationObserver(syncDialog);
        if (dialog) observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
        syncDialog();
        return () => { observer.disconnect(); gsap.ticker.remove(tick); lenis.destroy(); };
      });
      dispose = () => mm.revert();
    }
    void setup();
    return () => { cancelled = true; dispose(); };
  }, [calm, pathname]);
  return null;
}
