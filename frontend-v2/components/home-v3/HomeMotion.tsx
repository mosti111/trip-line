'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
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
