'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { companyProfile } from '@/lib/company-profile';
import { services, email, whatsapp, type Service } from '@/lib/travel-content';
import { journeyMessage, journeyUi } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';
import { Photo } from '../travel/Sections';
import { useTravel } from '../travel/SiteShell';
import { ServicePlan } from './ServicePrimitives';
import { PageSceneMotion } from '../v6/PageSceneMotion';
import '@/styles/recovery-pilgrimage.css';

const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const copy = {
  hajj: t('Hajj','الحج','Hac'), umrah: t('Umrah','العمرة','Umre'),
  choice: t('Which journey are you considering?','أي رحلة تفكر فيها؟','Hangi yolculuğu düşünüyorsun?'),
  chosen: t('Conversation intent','موضوع الرحلة','Görüşmenin konusu'),
  coordinates: t('Careful coordination.','تنسيق بعناية.','Özenli koordinasyon.'),
  need: t('Begin with what matters to you.','ابدأ بما يهمك.','Senin için önemli olanla başla.'),
  trust: t('The company behind your journey.','الشركة التي ترافق رحلتك.','Yolculuğunun ardındaki şirket.'),
  brief: t('Your planning brief.','ملخص التخطيط لرحلتك.','Yolculuk planlama özeti.'),
  local: t('This brief stays on this page. Prepare a message, review it, then send it in your chosen app.','يبقى هذا الملخص في هذه الصفحة. جهّز رسالة وراجعها، ثم أرسلها عبر التطبيق الذي تختاره.','Bu özet bu sayfada kalır. Mesajı hazırla, incele ve seçtiğin uygulamadan gönder.'),
  nojs: t('Use Contact and tell us whether you are considering Hajj or Umrah, your preferred dates and traveler numbers.','انتقل إلى صفحة التواصل وأخبرنا إن كنت تفكر في الحج أو العمرة، ومواعيدك المفضلة وعدد المسافرين.','İletişim sayfasında hac mı umre mi düşündüğünü, tercih ettiğin tarihleri ve yolcu sayısını paylaş.'),
  empty: t('No Türkiye places added. You can still begin a pilgrimage discussion.','لم تُضف وجهات في تركيا. يمكنك بدء الحديث عن رحلتك الإيمانية.','Türkiye’den yer eklenmedi. Hac veya umre görüşmesine yine de başlayabilirsin.'),
};

/** Full source content renders on first HTML; preparation is memory-only native UI. */
export function PilgrimageExperience({ locale, service: s }: { locale: Locale; service: Service }) {
  const hydrated = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  const root = useRef<HTMLDivElement>(null);
  const seen = useRef(new WeakSet<Element>());
  const { calm } = useTravel();
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const targets = [...host.querySelectorAll<HTMLElement>('.rp-choice .rp-kicker,.rp-coordination .rp-kicker,.rp-needs .rp-kicker,.rp-process .rp-kicker,.rp-trust .rp-kicker')];
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    let observer: IntersectionObserver | undefined;
    let generation = 0;
    const reset = () => {
      generation++;
      observer?.disconnect(); observer = undefined;
      delete host.dataset.pilgrimageMotion;
      targets.forEach(node => { delete node.dataset.pilgrimageReveal; });
    };
    const sync = () => {
      reset();
      if (calm || connection?.saveData || typeof IntersectionObserver !== 'function') return;
      host.dataset.pilgrimageMotion = 'enhanced';
      const current = generation;
      observer = new IntersectionObserver(entries => {
        if (current !== generation) return;
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          node.dataset.pilgrimageReveal = seen.current.has(node) ? 'settled' : 'visible';
          seen.current.add(node);
          observer?.unobserve(node);
        });
      }, { threshold: .12 });
      targets.forEach(node => {
        if (seen.current.has(node)) node.dataset.pilgrimageReveal = 'settled';
        else { node.dataset.pilgrimageReveal = 'pending'; observer?.observe(node); }
      });
    };
    sync();
    const listens = typeof connection?.addEventListener === 'function' && typeof connection?.removeEventListener === 'function';
    if (listens) connection?.addEventListener?.('change', sync);
    return () => { reset(); if (listens) connection?.removeEventListener?.('change', sync); };
  }, [calm]);
  const { destinations, journeyType } = useJourney();
  const [intent, setIntent] = useState<'hajj'|'umrah'>('hajj');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('');
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState('');
  const journeyKey = JSON.stringify({ destinations, journeyType });
  const [previousJourney, setPreviousJourney] = useState(journeyKey);
  // Invalidate permanently on any global edit, even if the visitor restores the old order.
  if (previousJourney !== journeyKey) {
    setPreviousJourney(journeyKey);
    if (prepared) setPrepared('');
  }
  const selected = copy[intent][locale];
  const route = journeyMessage(destinations, locale);
  function choose(value: 'hajj'|'umrah') { setIntent(value); setPrepared(''); }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (travelers && !/^[1-9]\d{0,2}$/.test(travelers)) { setError(ui.invalidTravelers[locale]); document.getElementById('pilgrimage-travelers')?.focus(); return; }
    setError('');
    setPrepared([
      `${ui.inquiry[locale]} — Trip Line`,
      `${ui.service[locale]}: ${s.title[locale]}`,
      `${copy.chosen[locale]}: ${selected}`,
      ...(route ? [route] : []),
      ...(dates.trim() ? [`${ui.dates[locale]}: ${dates.trim()}`] : []),
      ...(travelers ? [`${ui.travelers[locale]}: ${travelers}`] : []),
      '', ui.nextStepsBody[locale],
    ].join('\n'));
  }
  return <div ref={root} className="recovery-pilgrimage" data-service={s.slug} data-pilgrimage-intent={intent}>
    <section className="rp-arrival" data-pilgrimage-chapter="hero"><div className="rp-wrap"><Link className="rp-back" href={href(locale,'services')}>{ui.services[locale]}<ArrowUpRight size={17}/></Link><div className="rp-arrival-copy"><div><span className="rp-kicker">{s.title[locale]}</span><h1>{s.headline[locale]}</h1></div><div><p data-pilgrimage-summary>{s.summary[locale]}</p><a className="journey-action journey-action-primary" href="#pilgrimage-choice">{journeyUi.plan[locale]}<ArrowUpRight size={18}/></a></div></div><Photo file={s.image} alt={s.title[locale]} priority className="rp-arrival-photo"/></div></section>
    <section className="rp-choice" id="pilgrimage-choice" data-pilgrimage-chapter="choice"><div className="rp-wrap"><span className="rp-kicker">01 / {s.title[locale]}</span><h2>{s.intro[locale]}</h2><div className="rp-choice-controls" hidden={!hydrated}><fieldset><legend>{copy.choice[locale]}</legend><div className="rp-intents">{(['hajj','umrah'] as const).map((value,i)=><label key={value} data-pilgrimage-option={value}><span><input type="radio" name="pilgrimage-intent" value={value} checked={intent===value} onChange={()=>choose(value)}/><strong>{copy[value][locale]}</strong></span><p>{s.points[i][locale]}</p></label>)}</div></fieldset><p className="rp-choice-status" role="status">{copy.chosen[locale]}: <strong>{selected}</strong></p><a className="journey-text-link" href="#pilgrimage-plan">{journeyUi.continue[locale]}<ArrowUpRight size={17}/></a></div>{!hydrated&&<div className="rp-choice-static"><p>{s.points[0][locale]}</p><p>{s.points[1][locale]}</p></div>}</div></section>
    <section className="rp-coordination" data-pilgrimage-chapter="coordination"><div className="rp-wrap rp-coordination-layout"><div><span className="rp-kicker">02 / {ui.arrangements[locale]}</span><h2>{copy.coordinates[locale]}</h2><p>{ui.arrangeBody[locale]}</p></div><ol data-pilgrimage-points>{s.points.map((point,i)=><li key={i}><span>0{i+1}</span><p>{point[locale]}</p></li>)}</ol></div></section>
    <section className="rp-needs" data-pilgrimage-chapter="needs"><div className="rp-wrap rp-needs-layout"><div><span className="rp-kicker">03 / {ui.planning[locale]}</span><h2>{copy.need[locale]}</h2></div><div><p className="rp-source-brief" data-pilgrimage-source-brief>{s.brief[locale]}</p><h3>{s.question[locale]}</h3><p data-pilgrimage-answer>{s.answer[locale]}</p></div></div></section>
    <section className="rp-process" data-pilgrimage-chapter="process"><div className="rp-wrap"><div className="rp-process-heading"><span className="rp-kicker">04 / {ui.process[locale]}</span><h2>{ui.processTitle[locale]}</h2></div><ol>{[[ui.step1,ui.step1Body],[ui.step2,ui.step2Body],[ui.step3,ui.step3Body]].map(([title,body],i)=><li key={i}><span>0{i+1}</span><div><h3>{title[locale]}</h3><p>{body[locale]}</p></div></li>)}</ol></div></section>
    <section className="rp-trust" data-pilgrimage-chapter="trust"><div className="rp-wrap rp-trust-layout"><div><span className="rp-kicker">05 / {companyProfile.sourceLabel[locale]}</span><h2>{copy.trust[locale]}</h2></div><div data-pilgrimage-trust><p>{companyProfile.licensed[locale]}</p><p>{companyProfile.accreditation[locale]}</p><p>{companyProfile.established[locale]}</p><small>{companyProfile.sourceLabel[locale]}</small></div></div></section>
    <section className="rp-plan" id="pilgrimage-plan" data-pilgrimage-chapter="plan" data-journey-planner><div className="rp-wrap rp-plan-layout"><div><span className="rp-kicker">06 / {s.title[locale]}</span><h2>{copy.brief[locale]}</h2><p>{copy.local[locale]}</p><div className="rp-journey-context" data-pilgrimage-journey={destinations.join(',')}><span>{journeyUi.journey[locale]}</span><p>{route || copy.empty[locale]}</p></div><ServicePlan locale={locale} service="hajj-umrah"/></div><div><form className="rp-brief-form" onSubmit={prepare} hidden={!hydrated}><p className="rp-form-intent">{copy.chosen[locale]}: <strong>{selected}</strong></p><div className="rp-fields"><label htmlFor="pilgrimage-dates">{ui.dates[locale]} ({ui.optional[locale]})<input id="pilgrimage-dates" name="dates" value={dates} maxLength={150} onChange={event=>{setDates(event.target.value);setPrepared('');}}/></label><label htmlFor="pilgrimage-travelers">{ui.travelers[locale]} ({ui.optional[locale]})<input id="pilgrimage-travelers" name="travelers" inputMode="numeric" value={travelers} maxLength={3} aria-invalid={!!error} aria-describedby={error?'pilgrimage-travelers-error':undefined} onChange={event=>{setTravelers(event.target.value);setPrepared('');setError('');}}/>{error&&<span className="rp-error" id="pilgrimage-travelers-error" role="alert">{error}</span>}</label></div><button className="journey-action journey-action-primary" type="submit" data-pilgrimage-prepare>{ui.prepare[locale]}<ArrowUpRight size={18}/></button></form>{!hydrated&&<p className="rp-nojs">{copy.nojs[locale]}</p>}{prepared&&<div className="rp-prepared" data-pilgrimage-prepared data-prepared-service="hajj-umrah" data-prepared-journey={destinations.join(',')}><h3>{ui.ready[locale]}</h3><p>{ui.readyBody[locale]}</p><pre dir="auto">{prepared}</pre><div className="rp-prepared-actions"><a className="journey-action journey-action-primary" data-pilgrimage-whatsapp href={whatsapp(prepared)} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={18}/></a><a className="journey-text-link" data-pilgrimage-email href={`mailto:${email}?subject=${encodeURIComponent(ui.inquiry[locale]+' — Trip Line')}&body=${encodeURIComponent(prepared)}`}><Mail size={18}/>{ui.sendEmail[locale]}</a></div></div>}</div></div></section>
    <section className="rp-continue" data-pilgrimage-chapter="continue"><div className="rp-wrap rp-continue-layout"><div><span className="rp-kicker">TRIP LINE</span><h2>{ui.related[locale]}</h2></div><div>{s.related.map(id=>{const related=services.find(item=>item.slug===id)!;return <Link key={id} data-related-service={id} href={href(locale,`services/${id}`)}><span>{related.title[locale]}</span><ArrowUpRight size={21}/></Link>;})}<a className="journey-text-link" href="#pilgrimage-plan">{journeyUi.plan[locale]}<ArrowUpRight size={18}/></a></div></div></section>
    <PageSceneMotion/>
  </div>;
}
