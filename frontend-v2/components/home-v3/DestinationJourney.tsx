import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces, type TurkishPlace } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { Action, Eyebrow, Photo, PlanningBrief, Reveal, WhatsApp } from '../travel/Sections';
import { DestinationPortal } from '../experience/DestinationPortal';

export function DestinationJourney({ locale, place }: { locale: Locale; place: TurkishPlace }) {
  const index = turkishPlaces.indexOf(place);
  const next = turkishPlaces[(index + 1) % turkishPlaces.length];
  const context = `service=tours&destination=${place.slug}`;
  return <div className={`destination-journey destination-${place.group}`}>
    <section className="destination-arrival hero">
      <DestinationPortal slug={place.slug}><Photo file={place.image} alt={place.name[locale]} priority/></DestinationPortal>
      <div className="destination-arrival-copy wrap"><div className="place-wayfinding"><Link href={href(locale,'destinations/turkiye')}>{turkeyCopy.domestic[locale]}</Link><span>{String(index+1).padStart(2,'0')} / 12</span></div><h1>{place.name[locale]}</h1><div className="place-arrival-note"><p>{place.note[locale]}</p><a className="text-link" href="#place-identity">{ui.inspiration[locale]}<ArrowDown size={18}/></a></div></div>
      <span className="place-coordinate" dir="ltr">{place.lat}° N / {place.lon}° E</span>
    </section>
    <section className="place-identity sand" id="place-identity"><div className="wrap">
      <div className="place-identity-heading"><Eyebrow>02 / {place.name[locale]}</Eyebrow><h2>{ui.inspiration[locale]}</h2><p>{ui.inspirationNote[locale]}</p></div>
      <div className="place-experiences">{place.interests.map((interest,i)=><Reveal key={i} className="place-experience"><span className="index">0{i+1}</span><h3>{interest[locale]}</h3><span className="experience-point" aria-hidden="true"/></Reveal>)}</div>
    </div></section>
    <section className="place-atmosphere"><Photo file={place.image} alt={place.name[locale]}/><div><span className="eyebrow">03 / {place.name[locale]}</span><p>{place.note[locale]}</p><span dir="ltr">{place.lat}° N / {place.lon}° E</span></div></section>
    <div className="place-practical"><PlanningBrief locale={locale} text={turkeyCopy.planning} context={context}/></div>
    <section className="place-connections sand"><div className="wrap"><Eyebrow>05 / Trip Line</Eyebrow><div className="place-connection-layout"><h2>{ui.related[locale]}</h2><div>{services.filter(s=>['tours','tailor-made','flights-hotels'].includes(s.slug)).map((service,i)=><Link key={service.slug} href={href(locale,`services/${service.slug}`)}><span className="index">0{i+1}</span><span><h3>{service.title[locale]}</h3><p>{service.summary[locale]}</p></span><ArrowUpRight/></Link>)}</div></div></div></section>
    <section className="place-inquiry"><div className="wrap"><span className="eyebrow">06 / {place.name[locale]}</span><h2>{ui.ctaTitle[locale]}</h2><p>{ui.ctaBody[locale]}</p><div className="actions"><Action locale={locale} path={`contact?${context}`}>{ui.plan[locale]}</Action><WhatsApp locale={locale} context={place.name[locale]}/></div></div></section>
    <section className="place-next sand"><div className="wrap"><span className="eyebrow">{turkeyCopy.domestic[locale]}</span><Link className="next-place-portal" href={href(locale,`destinations/turkiye/${next.slug}`)}><DestinationPortal slug={next.slug}><Photo file={next.image} alt={next.name[locale]}/></DestinationPortal><span>{next.name[locale]}<ArrowUpRight/></span></Link><div className="place-other-links">{turkishPlaces.filter(p=>p.slug!==place.slug&&p.slug!==next.slug).map(p=><Link key={p.slug} href={href(locale,`destinations/turkiye/${p.slug}`)}>{p.name[locale]}</Link>)}</div></div></section>
  </div>;
}
