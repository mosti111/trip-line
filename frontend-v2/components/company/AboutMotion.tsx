'use client';

import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** A finite decorative route; the company narrative remains server composition. */
export function AboutMotion() {
  const line = useRef<SVGSVGElement>(null);
  const seen = useRef(new WeakSet<Element>());
  const { calm } = useTravel();
  useEffect(() => {
    const artwork = line.current;
    const root = artwork?.closest<HTMLElement>('.recovery-company');
    if (!artwork || !root) return;
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const canListen = typeof connection?.addEventListener === 'function' && typeof connection?.removeEventListener === 'function';
    let observer: IntersectionObserver | undefined;
    let generation = 0;
    const reset = () => {
      generation++;
      observer?.disconnect(); observer = undefined;
      delete root.dataset.aboutMotion;
      delete artwork.dataset.aboutLine;
    };
    const sync = () => {
      reset();
      if (calm || typeof IntersectionObserver !== 'function') return;
      root.dataset.aboutMotion = 'enhanced';
      if (seen.current.has(artwork)) { artwork.dataset.aboutLine = 'settled'; return; }
      artwork.dataset.aboutLine = 'pending';
      const current = generation;
      observer = new IntersectionObserver(entries => {
        if (current !== generation || !entries.some(entry => entry.isIntersecting)) return;
        seen.current.add(artwork);
        artwork.dataset.aboutLine = 'visible';
        observer?.disconnect();
      }, { threshold: .2 });
      observer.observe(artwork);
    };
    sync();
    if (canListen) connection?.addEventListener?.('change', sync);
    return () => { reset(); if (canListen) connection?.removeEventListener?.('change', sync); };
  }, [calm]);
  return <svg ref={line} className="rc-company-route" viewBox="0 0 400 50" aria-hidden="true" focusable="false"><path pathLength="1" d="M1 35H135Q160 35 185 20T235 20Q260 35 285 35H399"/></svg>;
}
