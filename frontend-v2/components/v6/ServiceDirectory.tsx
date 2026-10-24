'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { services } from '@/lib/travel-content';
import { journeyCopy } from '@/lib/journey';
import { useTravel } from '../travel/SiteShell';

export function ServiceDirectory({ locale }: { locale: Locale }) {
  const { calm } = useTravel();
  const [active, setActive] = useState(services[0]);
  const [settled, setSettled] = useState(services[0]);
  const [ready, setReady] = useState('');
  const root = useRef<HTMLElement>(null);
  const latest = useRef(active.slug);
  useEffect(() => { latest.current = active.slug; }, [active.slug]);
  useEffect(() => {
    const node = root.current;
    if (!node || calm || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let cancelled = false; let dispose = () => {};
    void import('gsap').then(({ gsap }) => {
      if (cancelled) return;
      const follow = node.querySelector('.v6-directory-follow');
      const context = gsap.context(() => {
        const xTo = gsap.quickTo(follow, 'x', { duration: .4, ease: 'power3.out' });
        const yTo = gsap.quickTo(follow, 'y', { duration: .4, ease: 'power3.out' });
        const move = (event: PointerEvent) => { if (event.pointerType !== 'mouse') return; const box = node.getBoundingClientRect(); xTo((event.clientX - box.left - box.width / 2) / box.width * 42); yTo((event.clientY - box.top - box.height / 2) / box.height * 28); };
        const reset = () => { xTo(0); yTo(0); };
        node.addEventListener('pointermove', move);node.addEventListener('pointerleave', reset);node.addEventListener('focusin', reset);
        dispose = () => { node.removeEventListener('pointermove', move);node.removeEventListener('pointerleave', reset);node.removeEventListener('focusin', reset);context.revert(); };
      }, node);
    });
    return () => { cancelled = true; dispose(); };
  }, [calm]);
  function select(service: typeof services[number]) { if (active.slug === service.slug) return; setReady('');setActive(service); }
  return <section ref={root} className="rh-services v6-directory" data-chapter="11" aria-labelledby="services-title"><div className="rh-wrap">
    <div className="rh-section-heading"><span className="rh-kicker">11 / {ui.services[locale]}</span><h2 id="services-title">{journeyCopy.services[locale]}</h2></div>
    <div className="v6-directory-layout"><ol className="v6-service-index">{services.map((service, i) => <li key={service.slug} data-active={active.slug === service.slug}><Link href={href(locale, `services/${service.slug}`)} onPointerEnter={() => select(service)} onFocus={() => select(service)}><span className="v6-service-number">{String(i + 1).padStart(2, '0')}</span><strong>{service.title[locale]}</strong><ArrowUpRight size={24}/></Link></li>)}</ol>
      <div className="v6-directory-stage"><div className="v6-directory-follow"><div className="v6-directory-photo" data-active-service={active.slug} data-settled-service={settled.slug}>
        <Image src={`/media/${settled.image}`} alt="" fill sizes="40vw"/>
        <motion.div key={active.slug} className="v6-directory-incoming" initial={{ clipPath: calm ? 'inset(0)' : 'inset(0 100% 0 0)', opacity: 0 }} animate={{ clipPath: ready === active.slug ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)', opacity: ready === active.slug ? 1 : 0 }} transition={{ duration: calm ? 0 : .65, ease: [.22,1,.36,1] }} onAnimationComplete={() => { if (ready === active.slug && latest.current === active.slug) setSettled(active); }}>
          <Image src={`/media/${active.image}`} alt={active.title[locale]} fill loading="eager" sizes="(max-width:767px) 100vw,40vw" onLoad={event => { const image=event.currentTarget;void image.decode().then(() => { if(latest.current===active.slug)setReady(active.slug); }).catch(() => {}); }}/>
        </motion.div><span aria-hidden="true">{String(services.indexOf(active) + 1).padStart(2,'0')} / 09</span>
      </div><div className="v6-directory-caption" aria-live="polite"><h3>{active.title[locale]}</h3><p>{active.summary[locale]}</p></div></div></div>
    </div>
  </div></section>;
}
