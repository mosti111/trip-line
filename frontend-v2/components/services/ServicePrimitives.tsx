'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { journeyHref, journeyUi } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** A service override is URL context, without replacing the visitor's saved journey type. */
export function ServicePlan({ locale, service }: { locale: Locale; service: string }) {
  const { destinations, closeJourney } = useJourney();
  return <Link className="journey-action journey-action-primary" data-service-plan={service} href={journeyHref(locale, destinations, service)} onClick={closeJourney}>{journeyUi.plan[locale]}<ArrowUpRight size={18}/></Link>;
}

/** Native once-only artwork enhancement, scoped to the mounted service page. */
export function ServiceMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const seen = useRef(new WeakSet<Element>());
  const { calm } = useTravel();
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.recovery-services');
    if (!root || root.classList.contains('rs-pilgrimage')) return;
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const targets = [...root.querySelectorAll<HTMLElement>('.rs-need-dominant>.photo,.rs-inspiration .rs-place-dominant .photo,.rs-final .rs-route')];
    let observer: IntersectionObserver | undefined;
    let generation = 0;
    const reset = () => {
      generation++;
      observer?.disconnect(); observer = undefined;
      delete root.dataset.serviceMotion;
      targets.forEach(node => { delete node.dataset.serviceReveal; });
    };
    const sync = () => {
      reset();
      if (calm || connection?.saveData || typeof IntersectionObserver !== 'function') return;
      root.dataset.serviceMotion = 'enhanced';
      const current = generation;
      observer = new IntersectionObserver(entries => {
        if (current !== generation) return;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          node.dataset.serviceReveal = seen.current.has(node) ? 'settled' : 'visible';
          seen.current.add(node);
          observer?.unobserve(node);
        });
      }, { threshold: .12 });
      targets.forEach(node => {
        if (seen.current.has(node)) node.dataset.serviceReveal = 'settled';
        else { node.dataset.serviceReveal = 'pending'; observer?.observe(node); }
      });
    };
    sync();
    const listens = typeof connection?.addEventListener === 'function' && typeof connection?.removeEventListener === 'function';
    if (listens) connection?.addEventListener?.('change', sync);
    return () => { reset(); if (listens) connection?.removeEventListener?.('change', sync); };
  }, [calm]);
  return <span ref={anchor} hidden data-service-motion-anchor/>;
}
