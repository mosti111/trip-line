'use client';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy } from '@/lib/turkiye';
import { useJourney } from '../experience/JourneyStore';
import { Photo } from '../travel/Sections';

export function ServiceWorldsV3({ locale }: { locale: Locale }) {
  const { journeyType, setJourneyType } = useJourney();
  const worlds = [
    { id: 'tours', title: t('Explore & holiday', 'اكتشاف وعطلات', 'Keşif ve tatil'), body: turkeyCopy.homeBody, image: 'cappadocia.png', path: 'destinations/turkiye' },
    { id: 'hajj-umrah', title: ui.pilgrimage, body: ui.pilgrimageBody, image: 'saudi-arabia.jpg', path: 'services/hajj-umrah' },
    { id: 'corporate', title: ui.business, body: ui.businessBody, image: 'business.jpg', path: 'business' },
  ];
  return <section className="rh-worlds" id="service-worlds" data-chapter="02" aria-labelledby="worlds-title"><div className="rh-wrap">
    <div className="rh-section-heading"><span className="rh-kicker">02 / {ui.services[locale]}</span><h2 id="worlds-title">{t('What brings you here?', 'ما الذي يدعوك للسفر؟', 'Seni buraya getiren ne?')[locale]}</h2><p>{ui.worldsBody[locale]}</p></div>
    <div className="rh-world-stage"><svg className="rh-world-route" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true"><path d="M-30 180 C270 10 650 310 640 530 S1190 870 1240 690"/></svg>
      {worlds.map((world, i) => <article className={`rh-world-plane rh-world-${i}`} key={world.id} data-intent={world.id} data-selected={journeyType === world.id}>
        <div className="rh-world-photo"><Photo file={world.image} alt={world.title[locale]} /><span className="rh-world-number" aria-hidden="true">0{i + 1}</span></div>
        <div className="rh-world-copy"><h3>{world.title[locale]}</h3><p>{world.body[locale]}</p><div className="rh-world-controls"><button type="button" className="rh-intent" aria-pressed={journeyType === world.id} onClick={() => setJourneyType(world.id)}>{t('Select this journey', 'اختر هذه الرحلة', 'Bu yolculuğu seç')[locale]}{journeyType === world.id ? <Check size={16}/> : <span aria-hidden="true">+</span>}</button><Link className="journey-text-link" href={href(locale, world.path)}>{t('Explore', 'اكتشف', 'Keşfet')[locale]}<ArrowUpRight size={18}/></Link></div></div>
      </article>)}
    </div>
  </div></section>;
}
