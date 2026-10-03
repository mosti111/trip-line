'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { Photo, Action } from '../travel/Sections';

export function ServiceWorldsV3({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const worlds = [
    { title: turkeyCopy.domestic, body: ui.travelBody, image: 'cappadocia.png', path: 'destinations/turkiye' },
    { title: ui.pilgrimage, body: ui.pilgrimageBody, image: 'saudi-arabia.jpg', path: 'services/hajj-umrah' },
    { title: ui.business, body: ui.businessBody, image: 'business.jpg', path: 'business' },
  ];
  const world = worlds[active];
  return <section className="service-worlds sand" id="service-worlds" data-world={active}>
    <div className="wrap">
      <div className="world-heading"><span className="eyebrow">03 / {ui.services[locale]}</span><h2>{ui.worldsTitle[locale]}</h2><p>{ui.worldsBody[locale]}</p></div>
      <div className="world-stage">
        <div className="world-choices" role="group" aria-label={ui.services[locale]}>
          {worlds.map((item, i) => <button key={item.path} aria-pressed={active === i} aria-controls="world-description"
            onClick={() => setActive(i)} onFocus={() => setActive(i)} onPointerEnter={e => { if (e.pointerType === 'mouse') setActive(i); }}
            onKeyDown={e => { if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) { e.preventDefault(); const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowDown'?1:2))%3; e.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus(); } }}>
            <span className="world-number">0{i + 1}</span><span>{item.title[locale]}</span><ArrowUpRight aria-hidden="true"/>
          </button>)}
        </div>
        <div className="world-media" aria-hidden="true">{worlds.map((item,i)=><div className="world-image" data-active={i===active} key={item.image}><Photo file={item.image}/></div>)}<span className="world-media-number">0{active+1}</span></div>
        <div id="world-description" className="world-description" aria-live="polite" aria-atomic="true"><p key={world.path}>{world.body[locale]}</p><Action locale={locale} path={world.path} secondary>{ui.more[locale]}</Action></div>
        <svg className="world-route" viewBox="0 0 1000 500" aria-hidden="true"><path d="M-20 420 H350 C550 420 400 50 680 80 S850 450 1020 360"/></svg>
      </div>
      <details className="service-route-directory services-journey"><summary>{ui.allServices[locale]}<span aria-hidden="true">09 ↗</span></summary><div>{services.map((s,i)=><Link className="service-milestone" key={s.slug} href={href(locale,`services/${s.slug}`)}><span className="index">{String(i+1).padStart(2,'0')}</span><span>{s.title[locale]}</span><ArrowUpRight size={20}/></Link>)}</div></details>
    </div>
  </section>;
}
