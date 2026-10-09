import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { turkeyCopy, turkishPlaces, type TurkishPlace } from '@/lib/turkiye';
import { services } from '@/lib/travel-content';
import { journeyUi } from '@/lib/journey';
import { Photo } from '../travel/Sections';
import { DestinationPortal } from '../experience/DestinationPortal';
import { AddToJourney, PlanJourney } from '../experience/JourneyActions';
import { TurkeyMap } from '../turkiye/TurkeyMap';
import { DestinationLocalNav } from '../turkiye/DestinationLocalNav';
import { DestinationMotion } from '../turkiye/DestinationMotion';
import '@/styles/recovery-destination.css';

const copy = {
 overview:t('A little closer.','نظرة أقرب.','Biraz daha yakından.'),
 locate:t('Where in Türkiye?','أين في تركيا؟','Türkiye’nin neresinde?'),
 interests:t('Make room for discovery.','امنح الاكتشاف مكاناً.','Keşfetmeye yer aç.'),
 feel:t('Stay with the view.','تمهّل مع المشهد.','Manzaranın tadını çıkar.'),
 add:t('A place on your line.','وجهة على مسارك.','Rotanda bir yer.'),
 services:t('Trip Line, along the way.','تريب لاين، معك على الطريق.','Yol boyunca Trip Line.'),
 plan:t('Begin with this place.','ابدأ بهذه الوجهة.','Bu yerden başla.'),
 continue:t('Keep discovering Türkiye.','واصل اكتشاف تركيا.','Türkiye’yi keşfetmeye devam et.'),
 final:t('Bring it into your journey.','أضفها إلى رحلتك.','Yolculuğuna kat.'),
 collection:t('Trip Line · Türkiye destination collection','تريب لاين · مجموعة وجهات تركيا','Trip Line · Türkiye destinasyonları'),
 back:t('Back to Türkiye','العودة إلى تركيا','Türkiye’ye dön'),
};
const groupLabels={city:turkeyCopy.city,'black-sea':turkeyCopy.blackSea,coast:turkeyCopy.coast,nature:turkeyCopy.nature};

export function DestinationJourney({locale,place}:{locale:Locale;place:TurkishPlace}) {
 const index=turkishPlaces.indexOf(place);
 const related=place.related.map(id=>turkishPlaces.find(item=>item.slug===id)!);
 const featured=related[0];
 const coordinate=`${place.lat.toFixed(2)}° N / ${place.lon.toFixed(2)}° E`;
 const steps=[[ui.step1,ui.step1Body],[ui.step2,ui.step2Body],[ui.step3,ui.step3Body]];
 return <div className={`recovery-destination rd-${place.group}`} data-destination={place.slug}>
  <section className="rd-arrival" data-arrival data-destination-chapter="01" aria-labelledby="destination-title">
   <div className="rd-arrival-media"><DestinationPortal slug={place.slug}><Photo file={place.image} alt={place.name[locale]} priority/></DestinationPortal></div><div className="rd-arrival-shade"/>
   <div className="rd-wrap rd-arrival-copy"><div className="rd-wayfinding"><Link href={href(locale,'destinations/turkiye')}>{copy.back[locale]}</Link><span>{String(index+1).padStart(2,'0')} / 12 · TÜRKİYE</span></div><h1 id="destination-title">{place.name[locale]}</h1><bdi className="rd-coordinate" dir="ltr">{coordinate}</bdi><p>{place.note[locale]}</p><div className="rd-actions"><AddToJourney locale={locale} id={place.slug}/><PlanJourney locale={locale} id={place.slug}/></div><a className="journey-text-link rd-discover" href="#place-overview">{ui.inspiration[locale]}<ArrowDown size={18}/></a></div>
  </section>
  <DestinationLocalNav locale={locale}/>
  <section className="rd-overview" id="place-overview" data-destination-chapter="02" data-local-chapter="overview" aria-labelledby="overview-title"><div className="rd-wrap rd-overview-layout"><div><span className="rd-kicker">02 / {groupLabels[place.group][locale]}</span><h2 id="overview-title">{copy.overview[locale]}</h2></div><div><p className="rd-source-note">{place.note[locale]}</p><span className="rd-source">{copy.collection[locale]}</span><ul className="rd-interest-index">{place.interests.map((interest,i)=><li key={interest.en}><a href={`#place-interest-${i+1}`}><span>0{i+1}</span>{interest[locale]}<ArrowDown size={16}/></a></li>)}</ul></div></div></section>
  <section className="rd-locate" id="place-locate" data-destination-chapter="03" data-local-chapter="overview" aria-labelledby="locate-title"><div className="rd-wrap rd-locate-layout"><div><span className="rd-kicker">03 / TÜRKİYE</span><h2 id="locate-title">{copy.locate[locale]}</h2><h3>{place.name[locale]}</h3><bdi className="rd-coordinate" dir="ltr">{coordinate}</bdi><Link className="journey-text-link" href={href(locale,'destinations/turkiye')}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18}/></Link></div><TurkeyMap locale={locale} active={place.slug} locator/></div></section>
  <section className="rd-experiences" id="place-experience" data-destination-chapter="04" data-local-chapter="experience" aria-labelledby="experience-title"><div className="rd-wrap"><div className="rd-heading"><span className="rd-kicker">04 / {place.name[locale]}</span><h2 id="experience-title">{copy.interests[locale]}</h2></div><div className="rd-interest-scenes">{place.interests.map((interest,i)=><article className={`rd-interest rd-interest-${i}`} id={`place-interest-${i+1}`} key={interest.en}><div className="rd-interest-photo"><Photo file={place.image} alt={place.name[locale]}/></div><div className="rd-interest-copy"><span className="rd-kicker">0{i+1} / {groupLabels[place.group][locale]}</span><h3>{interest[locale]}</h3><span className="rd-source">{place.name[locale]} · {copy.collection[locale]}</span></div></article>)}</div></div></section>
  <section className="rd-feel" id="place-feel" data-destination-chapter="05" data-local-chapter="experience" aria-labelledby="feel-title"><Photo file={place.image} alt={place.name[locale]}/><div className="rd-feel-shade"/><div className="rd-wrap"><span className="rd-kicker">05 / {place.name[locale]}</span><h2 id="feel-title">{copy.feel[locale]}</h2><bdi className="rd-coordinate" dir="ltr">{coordinate}</bdi></div></section>
  <section className="rd-add" id="place-add" data-destination-chapter="06" data-local-chapter="plan" aria-labelledby="add-title"><div className="rd-wrap rd-add-layout"><div><span className="rd-kicker">06 / {journeyUi.journey[locale]}</span><h2 id="add-title">{copy.add[locale]}</h2><p>{journeyUi.emptyBody[locale]}</p></div><div className="rd-add-place"><strong>{place.name[locale]}</strong><bdi className="rd-coordinate" dir="ltr">{coordinate}</bdi><AddToJourney locale={locale} id={place.slug}/></div></div></section>
  <section className="rd-services" id="place-services" data-destination-chapter="07" data-local-chapter="trip-line" aria-labelledby="services-title"><div className="rd-wrap rd-service-layout"><div><span className="rd-kicker">07 / TRIP LINE</span><h2 id="services-title">{copy.services[locale]}</h2><p>{ui.arrangeBody[locale]}</p></div><div className="rd-service-links">{services.filter(service=>['tours','tailor-made','flights-hotels'].includes(service.slug)).map((service,i)=><Link href={href(locale,`services/${service.slug}`)} key={service.slug}><span>0{i+1}</span><div><h3>{service.title[locale]}</h3><p>{service.summary[locale]}</p></div><ArrowUpRight size={20}/></Link>)}</div></div></section>
  <section className="rd-process" id="place-process" data-destination-chapter="08" data-local-chapter="trip-line" aria-labelledby="process-title"><div className="rd-wrap"><div className="rd-heading"><span className="rd-kicker">08 / {ui.process[locale]}</span><h2 id="process-title">{ui.processTitle[locale]}</h2></div><ol className="rd-process-line">{steps.map(([title,body],i)=><li key={title.en}><span>0{i+1}</span><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></li>)}</ol></div></section>
  <section className="rd-plan" id="place-plan" data-journey-planner data-destination-chapter="09" data-local-chapter="plan" aria-labelledby="plan-title"><div className="rd-wrap rd-plan-layout"><div><span className="rd-kicker">09 / {place.name[locale]}</span><h2 id="plan-title">{copy.plan[locale]}</h2></div><div><p>{turkeyCopy.planning[locale]}</p><PlanJourney locale={locale} id={place.slug}/><p className="rd-source">{ui.formBody[locale]}</p></div></div></section>
  <section className="rd-related" id="place-continue" data-destination-chapter="10" data-local-chapter="continue" aria-labelledby="continue-title"><div className="rd-wrap"><div className="rd-heading"><span className="rd-kicker">10 / TÜRKİYE</span><h2 id="continue-title">{copy.continue[locale]}</h2></div><div className="rd-related-layout"><Link className="rd-featured-related" data-related={featured.slug} href={href(locale,`destinations/turkiye/${featured.slug}`)}><DestinationPortal slug={featured.slug}><Photo file={featured.image} alt={featured.name[locale]}/></DestinationPortal><span><strong>{featured.name[locale]}</strong><ArrowUpRight size={24}/></span><p>{featured.note[locale]}</p></Link><div className="rd-related-links">{related.slice(1).map((item,i)=><Link data-related={item.slug} href={href(locale,`destinations/turkiye/${item.slug}`)} key={item.slug}><span>0{i+2}</span><div><h3>{item.name[locale]}</h3><p>{item.note[locale]}</p></div><ArrowUpRight size={20}/></Link>)}<Link className="journey-text-link" href={href(locale,'destinations/turkiye')}>{turkeyCopy.directory[locale]}<ArrowUpRight size={18}/></Link></div></div></div></section>
  <section className="rd-final" id="place-final" data-journey-planner data-destination-chapter="11" data-local-chapter="continue" aria-labelledby="final-title"><svg className="rd-final-route" viewBox="0 0 1440 750" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1450 80 C1100 90 1370 630 820 560 S200 290 310 690 H520"/><circle cx="520" cy="690" r="7"/></svg><div className="rd-wrap"><span className="rd-kicker">11 / {place.name[locale]}</span><h2 id="final-title">{copy.final[locale]}</h2><p>{journeyUi.session[locale]}</p><div className="rd-actions"><PlanJourney locale={locale} id={place.slug}/><Link className="journey-text-link" href={href(locale,'destinations/turkiye')}>{copy.back[locale]}<ArrowUpRight size={18}/></Link></div></div></section>
  <DestinationMotion/>
 </div>;
}
