'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { services, email, whatsapp } from '@/lib/travel-content';
import { journeyMessage, journeyUi } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';
import { useTravel } from '../travel/SiteShell';

const subscribe = () => () => {};
const ready = () => true;
const notReady = () => false;
const objectives = [
  { id: 'corporate', title: t('Corporate','الشركات','Kurumsal') },
  { id: 'events', title: t('Events','الفعاليات','Etkinlikler') },
  { id: 'camps', title: t('Camps & Conferences','المخيمات والمؤتمرات','Kamplar ve Konferanslar') },
  { id: 'training', title: t('Training','التدريب','Eğitim') },
];
const copy = {
  objective: t('Objective','الهدف','Amaç'), organization: t('Organization','المؤسسة','Kurum'),
  purpose: t('Purpose','الغرض','Hedef'), participants: t('Participants','المشاركون','Katılımcılar'),
  location: t('Preferred location','الموقع المفضل','Tercih edilen yer'), dates: ui.dates,
  prepare: t('Prepare planning message','جهّزوا رسالة التخطيط','Planlama mesajını hazırla'),
  required: t('Choose an objective to prepare your message.','اختاروا هدفاً لتجهيز الرسالة.','Mesajı hazırlamak için bir amaç seçin.'),
  type: t('Current journey type','نوع الرحلة الحالي','Mevcut yolculuk türü'),
  empty: t('No Türkiye places added yet.','لم تُضف وجهات في تركيا بعد.','Henüz Türkiye’den yer eklenmedi.'),
};
type Field = 'organization' | 'purpose' | 'participants' | 'location' | 'dates';

/** Only objective selection and the native, memory-only brief are client state. */
export function BusinessBrief({ locale, children }: { locale: Locale; children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, ready, notReady);
  const { calm } = useTravel();
  const line = useRef<SVGSVGElement>(null);
  const seenLines = useRef(new WeakSet<Element>());
  useEffect(() => {
    const artwork = line.current;
    const root = artwork?.closest<HTMLElement>('.recovery-business');
    if (!artwork || !root) return;
    const connection = (navigator as Navigator & { connection?: Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>> & { saveData?: boolean } }).connection;
    const canListen = typeof connection?.addEventListener === 'function' && typeof connection?.removeEventListener === 'function';
    let observer: IntersectionObserver | undefined;
    let generation = 0;
    const reset = () => {
      generation++;
      observer?.disconnect(); observer = undefined;
      delete root.dataset.businessMotion;
      delete artwork.dataset.businessLine;
    };
    const sync = () => {
      reset();
      if (calm || connection?.saveData || (connection && !canListen) || typeof IntersectionObserver !== 'function') return;
      root.dataset.businessMotion = 'enhanced';
      if (seenLines.current.has(artwork)) { artwork.dataset.businessLine = 'settled'; return; }
      artwork.dataset.businessLine = 'pending';
      const current = generation;
      observer = new IntersectionObserver(entries => {
        if (generation !== current || !entries.some(entry => entry.isIntersecting)) return;
        seenLines.current.add(artwork);
        artwork.dataset.businessLine = 'visible';
        observer?.disconnect();
      }, { threshold: .2 });
      observer.observe(artwork);
    };
    sync();
    if (canListen) connection?.addEventListener?.('change', sync);
    return () => { reset(); if (canListen) connection?.removeEventListener?.('change', sync); };
  }, [calm]);
  const { destinations, journeyType } = useJourney();
  const [objective, setObjective] = useState('');
  const shown = objectives.find(o => o.id === objective) || objectives[0];
  const service = services.find(s => s.slug === shown.id)!;
  const [fields, setFields] = useState<Record<Field, string>>({ organization: '', purpose: '', participants: '', location: '', dates: '' });
  const [error, setError] = useState<'objective' | 'participants' | ''>('');
  const [prepared, setPrepared] = useState('');
  const [hasPrepared, setHasPrepared] = useState(false);
  const [preparationCount, setPreparationCount] = useState(0);
  const result = useRef<HTMLDivElement>(null);
  const key = JSON.stringify({ destinations, journeyType });
  const [previous, setPrevious] = useState(key);
  // Clear on each observed global edit, even when the previous value is restored.
  if (previous !== key) { setPrevious(key); if (hasPrepared) { setPrepared(''); setHasPrepared(false); } }
  useEffect(() => { if (preparationCount) result.current?.focus(); }, [preparationCount]);
  function choose(id: string) { setObjective(id); setPrepared(''); setHasPrepared(false); setError(''); }
  function edit(field: Field, value: string) { setFields(current => ({ ...current, [field]: value })); setPrepared(''); setHasPrepared(false); setError(''); }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!objective) { setError('objective'); document.querySelector<HTMLButtonElement>('[data-business-objective]')?.focus(); return; }
    if (fields.participants && !/^[1-9]\d{0,2}$/.test(fields.participants)) { setError('participants'); document.getElementById('business-participants')?.focus(); return; }
    setError('');
    setHasPrepared(true);
    setPreparationCount(count => count + 1);
    setPrepared([
      `${ui.inquiry[locale]} — Trip Line`, `${copy.objective[locale]}: ${shown.title[locale]}`,
      `${ui.service[locale]}: ${service.title[locale]}`,
      `${copy.type[locale]}: ${services.find(s => s.slug === journeyType)!.title[locale]}`,
      journeyMessage(destinations, locale) || copy.empty[locale],
      ...(['organization', 'purpose', 'participants', 'location', 'dates'] as Field[]).filter(f => fields[f].trim()).map(f => `${copy[f][locale]}: ${fields[f].trim()}`),
      '', ui.nextStepsBody[locale],
    ].join('\n'));
  }
  return <>
    <section className="rb-objectives" id="business-objectives" data-business-chapter="objectives"><div className="rb-wrap"><span className="rb-kicker">01 / {copy.objective[locale]}</span><div className="rb-objective-heading"><h2>{t('What brings your people together?','ما الذي يجمع فريقكم؟','Ekibinizi ne bir araya getiriyor?')[locale]}</h2><p>{t('Start with the objective. Choose a route, then share the details that shape your plans.','ابدأوا بالهدف. اختاروا المسار، ثم شاركوا التفاصيل التي تشكل خططكم.','Amaçla başlayın. Bir yol seçin, ardından planınızı şekillendiren ayrıntıları paylaşın.')[locale]}</p></div><div className="rb-objective-layout"><div className="rb-objective-list" role="group" aria-label={copy.objective[locale]}>{objectives.map((o, i) => <div key={o.id}>{hydrated ? <button type="button" data-business-objective={o.id} aria-pressed={objective === o.id} aria-describedby={error === 'objective' ? 'business-objective-error' : undefined} onClick={() => choose(o.id)}><span>0{i + 1}</span><strong>{o.title[locale]}</strong><ArrowUpRight size={20}/></button> : <Link href={href(locale, `services/${o.id}`)}><span>0{i + 1}</span><strong>{o.title[locale]}</strong><ArrowUpRight size={20}/></Link>}</div>)}</div><div className="rb-objective-preview" data-business-selected={shown.id}><div className="photo"><Image src={`/media/${service.image}`} alt={service.title[locale]} fill sizes="(max-width: 760px) 100vw, 55vw" quality={85}/></div><div aria-live="polite"><span className="rb-kicker">{service.title[locale]}</span><h3>{service.headline[locale]}</h3><p data-business-summary>{service.summary[locale]}</p><Link className="journey-text-link" data-business-service-link={shown.id} href={href(locale, `services/${shown.id}`)}>{ui.more[locale]}<ArrowUpRight size={17}/></Link></div></div></div></div></section>
    <section className="rb-capabilities" data-business-chapter="capabilities" data-business-service={shown.id}><div className="rb-wrap rb-capabilities-layout"><div><span className="rb-kicker">02 / {ui.arrangements[locale]}</span><h2>{service.intro[locale]}</h2><p>{service.brief[locale]}</p></div><div><ol data-business-points>{service.points.map((p, i) => <li key={i}><span>0{i + 1}</span><p>{p[locale]}</p></li>)}</ol><details><summary>{service.question[locale]}</summary><p>{service.answer[locale]}</p></details></div></div></section>
    {children}
    <section className="rb-plan" id="business-plan" data-business-chapter="plan" data-journey-planner><div className="rb-wrap rb-plan-layout"><div><svg ref={line} className="rb-structural-line" viewBox="0 0 380 56" aria-hidden="true" focusable="false"><path pathLength="1" d="M1 45H95V12H215V45H379"/></svg><span className="rb-kicker">05 / {ui.planning[locale]}</span><h2>{t('Your objective. Your brief.','هدفكم. ملخص خططكم.','Amacınız. Planlama özetiniz.')[locale]}</h2><p>{t('This brief stays on this page. Prepare a message, review it, then send it in your chosen app.','يبقى هذا الملخص في هذه الصفحة. جهّزوا الرسالة وراجعوها، ثم أرسلوها عبر التطبيق الذي تختارونه.','Bu özet bu sayfada kalır. Mesajı hazırlayın, inceleyin ve seçtiğiniz uygulamadan gönderin.')[locale]}</p><div className="rb-context" data-business-journey={destinations.join(',')} data-business-journey-type={journeyType}><span>{journeyUi.journey[locale]}</span><p>{journeyMessage(destinations, locale) || copy.empty[locale]}</p><p>{copy.type[locale]}: {services.find(s => s.slug === journeyType)!.title[locale]}</p></div><Link className="journey-text-link" href={href(locale, 'contact')}>{ui.contact[locale]}<ArrowUpRight size={17}/></Link></div><div><form onSubmit={prepare} className="rb-form" hidden={!hydrated} noValidate><p className="rb-form-objective">{copy.objective[locale]}: <strong>{objective ? shown.title[locale] : t('Choose above','اختاروا أعلاه','Yukarıdan seçin')[locale]}</strong></p>{error === 'objective' && <p id="business-objective-error" className="rb-error" role="alert">{copy.required[locale]}</p>}<div className="rb-fields">{(['organization', 'purpose', 'participants', 'location', 'dates'] as Field[]).map(f => <label key={f} htmlFor={`business-${f}`}>{copy[f][locale]} <small>({ui.optional[locale]})</small>{f === 'purpose' ? <textarea id={`business-${f}`} name={f} rows={3} maxLength={1000} value={fields[f]} onChange={e => edit(f, e.target.value)}/> : <input id={`business-${f}`} name={f} inputMode={f === 'participants' ? 'numeric' : undefined} maxLength={f === 'participants' ? 3 : 150} value={fields[f]} aria-invalid={f === 'participants' && error === 'participants'} aria-describedby={f === 'participants' && error === 'participants' ? 'business-participants-error' : undefined} onChange={e => edit(f, e.target.value)}/>}</label>)}</div>{error === 'participants' && <p id="business-participants-error" className="rb-error" role="alert">{ui.invalidTravelers[locale]}</p>}<button className="journey-action journey-action-primary" type="submit" data-business-prepare>{copy.prepare[locale]}<ArrowUpRight size={18}/></button></form>{!hydrated && <p>{t('Use Contact to share your objective, organization, participants, location and dates.','انتقلوا إلى صفحة التواصل وشاركوا الهدف والمؤسسة والمشاركين والموقع والمواعيد.','İletişim sayfasında amacınızı, kurumunuzu, katılımcıları, yeri ve tarihleri paylaşın.')[locale]}</p>}{hasPrepared && <div className="rb-prepared" data-business-prepared data-prepared-service={objective} ref={result} tabIndex={-1}><h3>{ui.ready[locale]}</h3><p>{ui.readyBody[locale]}</p><label htmlFor="business-message">{ui.message[locale]}<textarea id="business-message" data-business-message rows={12} value={prepared} onChange={e => setPrepared(e.target.value)}/></label><div className="rb-prepared-actions"><a data-business-whatsapp className="journey-action journey-action-primary" href={whatsapp(prepared)} target="_blank" rel="noopener noreferrer">WhatsApp<ArrowUpRight size={18}/></a><a data-business-email className="journey-text-link" href={`mailto:${email}?subject=${encodeURIComponent(ui.inquiry[locale] + ' — Trip Line')}&body=${encodeURIComponent(prepared)}`}><Mail size={18}/>{ui.sendEmail[locale]}</a></div></div>}</div></div></section>
  </>;
}
