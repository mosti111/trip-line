'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** Lightweight detail-only native controller; no animation framework/scene download. */
export function DestinationMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const seen = useRef(new WeakSet<Element>());
  const { calm } = useTravel();
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.recovery-destination');
    if (!root) return;
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const targets = [...root.querySelectorAll<HTMLElement>('.rd-interest-photo,.rd-feel,.rd-final-route')];
    let observer: IntersectionObserver | undefined;
    const reset = () => {
      observer?.disconnect(); observer = undefined;
      delete root.dataset.destinationMotion;
      targets.forEach(node => { delete node.dataset.destinationReveal; });
    };
    const sync = () => {
      reset();
      if (calm || connection?.saveData || typeof IntersectionObserver !== 'function') return;
      root.dataset.destinationMotion = 'enhanced';
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          node.dataset.destinationReveal = seen.current.has(node) ? 'settled' : 'visible';
          seen.current.add(node);
          observer?.unobserve(node);
        });
      }, { threshold: .12 });
      targets.forEach(node => {
        if (seen.current.has(node)) node.dataset.destinationReveal = 'settled';
        else { node.dataset.destinationReveal = 'pending'; observer?.observe(node); }
      });
    };
    sync();
    const listens = typeof connection?.addEventListener === 'function' && typeof connection?.removeEventListener === 'function';
    if (listens) connection?.addEventListener?.('change', sync);
    return () => { reset(); if (listens) connection?.removeEventListener?.('change', sync); };
  }, [calm]);
  return <span ref={anchor} hidden data-destination-motion-anchor/>;
}
