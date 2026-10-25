'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy } from '@/lib/turkiye';
import { useJourney } from '../experience/JourneyStore';
import { FlightTrace } from '../experience/FlightTrace';
import { Photo } from '../travel/Sections';

export function ServiceWorldsV3({ locale, creative=false }: { locale: Locale; creative?:boolean }) {
  const { journeyType, setJourneyType } = useJourney();
  const [engaged, setEngaged] = useState('');
  const worlds = [
    { id: 'tours', title: t('Explore & holiday', 'اكتشاف وعطلات', 'Keşif ve tatil'), body: turkeyCopy.homeBody, image: 'cappadocia-v5.jpg', path: 'destinations/turkiye' },
    { id: 'hajj-umrah', title: ui.pilgrimage, body: ui.pilgrimageBody, image: 'saudi-arabia.jpg', path: 'services/hajj-umrah' },
    { id: 'corporate', title: ui.business, body: ui.businessBody, image: 'corporate-v5.jpg', path: 'business' },
  ];
  return <section className="rh-worlds" id="service-worlds" data-chapter="02" aria-labelledby="worlds-title"><FlightTrace scene="service-worlds"/><div className="rh-wrap">
    <div className="rh-section-heading"><span className="rh-kicker">02 / {ui.services[locale]}</span><h2 id="worlds-title">{t('What brings you here?', 'ما الذي يدعوك للسفر؟', 'Seni buraya getiren ne?')[locale]}</h2><p>{ui.worldsBody[locale]}</p></div>
    <div className="rh-world-stage">
      {creative&&<><span className="v61-world-junction" aria-hidden="true"/><svg className="v61-world-branches" viewBox="0 0 1440 1200" preserveAspectRatio="none" aria-hidden="true">{[0,1,2].map(index=><path key={index} data-world-branch={index} pathLength="1" d="M800 560 Q600 400 400 350"/>)}</svg></>}
      {worlds.map((world, i) => <article className={`rh-world-plane rh-world-${i}`} key={world.id} data-intent={world.id} data-selected={journeyType === world.id} data-engaged={(engaged || journeyType) === world.id} onPointerEnter={event => { if(event.pointerType === 'mouse')setEngaged(world.id); }} onPointerLeave={() => setEngaged('')} onFocusCapture={() => setEngaged(world.id)} onBlur={event => { if(!event.currentTarget.contains(event.relatedTarget))setEngaged(''); }}>
        <div className="rh-world-photo"><div className="v6-world-depth"><Photo file={world.image} alt={world.title[locale]} /></div><span className="rh-world-number" aria-hidden="true">0{i + 1}</span></div>
        <div className="rh-world-copy"><h3>{world.title[locale]}</h3><p>{world.body[locale]}</p><div className="rh-world-controls"><button type="button" className="rh-intent" aria-pressed={journeyType === world.id} onClick={() => setJourneyType(world.id)}>{t('Select this journey', 'اختر هذه الرحلة', 'Bu yolculuğu seç')[locale]}{journeyType === world.id ? <Check size={16}/> : <span aria-hidden="true">+</span>}</button><Link className="journey-text-link" href={href(locale, world.path)}>{t('Explore', 'اكتشف', 'Keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></div>
      </article>)}
    </div>
  </div></section>;
}
