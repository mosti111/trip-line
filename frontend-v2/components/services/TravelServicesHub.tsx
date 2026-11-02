import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { services } from '@/lib/travel-content';
import { turkeyCopy } from '@/lib/turkiye';
import { Photo } from '../travel/Sections';
import { ServiceInspiration } from './ServiceExperience';
import { ServiceMotion, ServicePlan } from './ServicePrimitives';
import '@/styles/recovery-services.css';

const needs = [
  {id:'tailor-made',label:t('I want a complete trip','أريد رحلة متكاملة','Eksiksiz bir yolculuk istiyorum')},
  {id:'tours',label:t('I want tours & experiences','أريد جولات وتجارب','Turlar ve deneyimler istiyorum')},
  {id:'flights-hotels',label:t('I need flights & a hotel','أحتاج إلى طيران وفندق','Uçuş ve otel gerekiyor')},
  {id:'visa-assistance',label:t('I need visa help','أحتاج إلى مساعدة في التأشيرة','Vize desteği gerekiyor')},
];
const copy={title:t('Your journey. Your starting point.','رحلتك. نقطة بدايتك.','Yolculuğun. Başlangıç noktan.'),needs:t('What would you like to arrange?','ما الترتيبات التي تحتاجها؟','Neleri düzenlemek istersin?'),travel:t('Travel, shaped around you.','سفر يناسبك.','Sana göre şekillenen seyahat.'),other:t('More ways to connect.','مسارات أخرى للتواصل.','Buluşmanın başka yolları.'),context:t('Continue with','تابع مع','Buradan devam et'),final:t('Bring your ideas.','شاركنا أفكارك.','Fikirlerini paylaş.')};

export function TravelServicesHub({ locale, audience }: { locale: Locale; audience?: string }) {
 const requested=['travel','business','pilgrimage'].includes(audience||'')?audience:undefined;
 const family=requested==='business'?ui.business:requested==='pilgrimage'?ui.pilgrimage:ui.travel;
 const travel=services.find(service=>service.slug==='tailor-made')!;
 const pilgrimage=services.find(service=>service.slug==='hajj-umrah')!;
 return <div className="recovery-services rs-hub" data-requested-audience={requested}>
  <section className="rs-hero" data-service-chapter="hero"><div className="rs-hero-media"><Photo file="cappadocia-v5.jpg" alt={turkeyCopy.domestic[locale]} priority/></div><div className="rs-hero-shade"/><div className="rs-wrap rs-hero-copy"><span className="rs-kicker">{ui.services[locale]} / TÜRKİYE</span><h1>{copy.title[locale]}</h1><p>{travel.summary[locale]}</p><div className="rs-actions"><a className="journey-action journey-action-primary" href="#service-directory">{copy.needs[locale]}<ArrowUpRight size={18}/></a><Link className="journey-text-link" href={href(locale,'destinations/turkiye')}>{turkeyCopy.domestic[locale]}<ArrowUpRight size={18}/></Link></div>{requested&&<a className="rs-audience-context" data-audience-context={requested} href={`#services-${requested}`}><span>{copy.context[locale]}</span><strong>{family[locale]}</strong><ArrowUpRight size={18}/></a>}</div></section>
  <section className="rs-needs" id="service-directory" data-service-chapter="needs"><div className="rs-wrap"><div className="rs-section-heading"><span className="rs-kicker">01 / {ui.travel[locale]}</span><h2>{copy.needs[locale]}</h2></div><div className="rs-needs-layout" id="services-travel"><Link className="rs-need-dominant" data-need="tailor-made" data-service-link="tailor-made" href={href(locale,'services/tailor-made')}><Photo file={travel.image} alt={travel.title[locale]}/><div><span className="rs-kicker">01 / {travel.title[locale]}</span><h3>{needs[0].label[locale]}</h3><p>{travel.summary[locale]}</p><ArrowUpRight size={27}/></div></Link><div className="rs-need-rows">{needs.slice(1).map((need,i)=>{const service=services.find(s=>s.slug===need.id)!;return <Link key={need.id} data-need={need.id} data-service-link={need.id} href={href(locale,`services/${need.id}`)}><span>0{i+2}</span><div><h3>{need.label[locale]}</h3><span className="rs-service-title">{service.title[locale]}</span><p>{service.summary[locale]}</p></div><ArrowUpRight size={22}/></Link>;})}</div></div></div></section>
  <ServiceInspiration locale={locale}/>
  <section className="rs-other" data-service-chapter="secondary"><div className="rs-wrap"><div className="rs-section-heading"><span className="rs-kicker">TRIP LINE</span><h2>{copy.other[locale]}</h2></div><div className="rs-other-layout"><article id="services-pilgrimage" data-service-family="pilgrimage" data-requested={requested==='pilgrimage'||undefined}><span className="rs-kicker">{ui.pilgrimage[locale]}</span><h3>{pilgrimage.headline[locale]}</h3><p>{pilgrimage.summary[locale]}</p><Link className="journey-text-link" data-service-link={pilgrimage.slug} href={href(locale,`services/${pilgrimage.slug}`)}>{pilgrimage.title[locale]}<ArrowUpRight size={18}/></Link></article><article id="services-business" data-service-family="business" data-requested={requested==='business'||undefined}><span className="rs-kicker">{ui.business[locale]}</span><h3>{t('Start with your purpose.','ابدأوا بهدفكم.','Amacınızla başlayın.')[locale]}</h3><div className="rs-business-rows">{services.filter(s=>s.audience==='business').map(service=><Link key={service.slug} data-service-link={service.slug} href={href(locale,`services/${service.slug}`)}><span>{service.title[locale]}</span><ArrowUpRight size={19}/></Link>)}</div><Link className="journey-text-link" href={href(locale,'business')}>{ui.business[locale]}<ArrowUpRight size={18}/></Link></article></div></div></section>
  <section className="rs-final" data-service-chapter="final" data-journey-planner><svg className="rs-route" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-40 540 C260 540 170 95 550 120 S890 650 1100 360 S1250 130 1480 60"/><circle cx="1100" cy="360" r="7"/></svg><div className="rs-wrap"><span className="rs-kicker">{ui.travel[locale]}</span><h2>{copy.final[locale]}</h2><p>{ui.nextStepsBody[locale]}</p><ServicePlan locale={locale} service="tailor-made"/></div></section>
  <ServiceMotion/>
 </div>;
}
