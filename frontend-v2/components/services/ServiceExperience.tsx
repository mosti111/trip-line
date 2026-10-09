import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { services, type Service } from '@/lib/travel-content';
import { turkishPlaces, turkeyCopy } from '@/lib/turkiye';
import { AddToJourney } from '../experience/JourneyActions';
import { Photo } from '../travel/Sections';
import { ServiceMotion, ServicePlan } from './ServicePrimitives';
import '@/styles/recovery-services.css';

const copy = {
  for: t('For','لمن','Kimler için'),
  discuss: t('We can discuss','ما يمكننا مناقشته','Neleri konuşabiliriz'),
  start: t('Start with','ابدأ بـ','Başlangıç noktası'),
  places: t('Türkiye, a starting point.','تركيا، نقطة بداية.','Türkiye, bir başlangıç noktası.'),
  scope: t('Discuss the arrangements','ناقش الترتيبات','Düzenlemeleri konuşalım'),
};

/** Inspiration uses source place notes, never promised venues or service inventory. */
export function ServiceInspiration({ locale, business = false }: { locale: Locale; business?: boolean }) {
  const ids = business ? ['istanbul','bursa','sapanca'] : ['cappadocia','rize-ayder','antalya'];
  const places = ids.map(id => turkishPlaces.find(place => place.slug === id)!);
  return <section className="rs-inspiration" id="service-inspiration" data-service-inspiration><div className="rs-wrap"><div className="rs-section-heading"><span className="rs-kicker">TÜRKİYE / 12</span><h2>{copy.places[locale]}</h2><p>{turkeyCopy.intro[locale]}</p></div><div className="rs-place-layout"><div className="rs-place-dominant" data-inspiration-place={places[0].slug}><Link href={href(locale,`destinations/turkiye/${places[0].slug}`)}><Photo file={places[0].image} alt={places[0].name[locale]}/><h3>{places[0].name[locale]}<ArrowUpRight size={25}/></h3></Link><p>{places[0].note[locale]}</p><AddToJourney id={places[0].slug} locale={locale}/></div><div className="rs-place-rows">{places.slice(1).map(place=><article key={place.slug} data-inspiration-place={place.slug}><span className="rs-kicker"><bdi dir="ltr">{`${place.lat.toFixed(2)}° N / ${place.lon.toFixed(2)}° E`}</bdi></span><Link href={href(locale,`destinations/turkiye/${place.slug}`)}><h3>{place.name[locale]}</h3><ArrowUpRight size={22}/></Link><p>{place.note[locale]}</p><div className="rs-actions"><Link className="journey-text-link" href={href(locale,`destinations/turkiye/${place.slug}`)}>{ui.more[locale]}<ArrowUpRight size={16}/></Link><AddToJourney id={place.slug} locale={locale}/></div></article>)}<Link className="journey-text-link rs-all-places" href={href(locale,'destinations/turkiye')}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18}/></Link></div></div></div></section>;
}

export function ServiceExperience({ locale, service: s }: { locale: Locale; service: Service }) {
  const inspiration = s.audience !== 'pilgrimage' && s.slug !== 'visa-assistance';
  return <div className={`recovery-services rs-detail rs-${s.audience}`} data-service={s.slug}>
    <section className="rs-hero" data-service-chapter="hero"><div className="rs-hero-media"><Photo file={s.image} alt={s.title[locale]} priority/></div><div className="rs-hero-shade"/><div className="rs-wrap rs-hero-copy"><Link className="rs-back" href={href(locale,'services')}>{ui.services[locale]}<ArrowUpRight size={17}/></Link><span className="rs-kicker">{String(services.indexOf(s)+1).padStart(2,'0')} / {s.title[locale]}</span><h1>{s.headline[locale]}</h1><p data-service-summary>{s.summary[locale]}</p><div className="rs-actions"><ServicePlan locale={locale} service={s.slug}/><a className="journey-text-link" href="#service-understand">{ui.arrangements[locale]}<ArrowUpRight size={18}/></a></div></div></section>
    <section className="rs-summary" id="service-understand" data-service-chapter="summary"><div className="rs-wrap"><span className="rs-kicker">01 / {ui.services[locale]}</span><dl className="rs-quick-summary" data-service-quick-summary>{[[copy.for,s.intro],[copy.discuss,s.summary],[copy.start,s.brief]].map(([label,value],i)=><div key={i}><dt>{label[locale]}</dt><dd>{value[locale]}</dd></div>)}</dl></div></section>
    <section className="rs-arrangements" data-service-chapter="points"><div className="rs-wrap rs-points-layout"><div className="rs-section-heading"><span className="rs-kicker">02 / {ui.arrangements[locale]}</span><h2>{s.intro[locale]}</h2><p>{ui.arrangeBody[locale]}</p></div><ol className="rs-point-list" data-service-points>{s.points.map((point,i)=><li key={i}><span>0{i+1}</span><p>{point[locale]}</p></li>)}</ol></div></section>
    {inspiration&&<ServiceInspiration locale={locale} business={s.audience==='business'}/>}
    <section className="rs-process" data-service-chapter="process"><div className="rs-wrap rs-process-layout"><div className="rs-section-heading"><span className="rs-kicker">{ui.process[locale]}</span><h2>{ui.processTitle[locale]}</h2></div><ol>{[[ui.step1,ui.step1Body],[ui.step2,ui.step2Body],[ui.step3,ui.step3Body]].map(([title,body],i)=><li key={i}><span>0{i+1}</span><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></li>)}</ol></div></section>
    <section className="rs-brief" id="service-plan" data-service-chapter="plan" data-journey-planner><div className="rs-wrap rs-brief-layout"><div><span className="rs-kicker">{copy.start[locale]}</span><h2>{ui.planning[locale]}</h2><p data-service-brief>{s.brief[locale]}</p><ServicePlan locale={locale} service={s.slug}/><small>{ui.formBody[locale]}</small></div><div className="rs-service-answer"><h3>{s.question[locale]}</h3><p>{s.answer[locale]}</p></div></div></section>
    <section className="rs-related" data-service-chapter="related"><div className="rs-wrap rs-related-layout"><div><span className="rs-kicker">TRIP LINE</span><h2>{ui.related[locale]}</h2></div><div data-service-related>{s.related.map((id,i)=>{const related=services.find(service=>service.slug===id)!;return <Link key={id} data-related-service={id} href={href(locale,`services/${id}`)}><span>0{i+1}</span><div><h3>{related.title[locale]}</h3><p>{related.summary[locale]}</p></div><ArrowUpRight size={22}/></Link>;})}</div></div></section>
    <section className="rs-final" data-service-chapter="final" data-journey-planner><svg className="rs-route" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-40 540 C260 540 170 95 550 120 S890 650 1100 360 S1250 130 1480 60"/><circle cx="1100" cy="360" r="7"/></svg><div className="rs-wrap"><span className="rs-kicker">{s.title[locale]}</span><h2>{copy.scope[locale]}</h2><p>{ui.nextStepsBody[locale]}</p><ServicePlan locale={locale} service={s.slug}/></div></section>
    <ServiceMotion/>
  </div>;
}
