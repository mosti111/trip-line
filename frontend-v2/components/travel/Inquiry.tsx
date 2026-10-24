'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, Mail, Phone, X } from 'lucide-react';
import { href, t, ui, type Locale } from '@/lib/i18n';
import { countries, services, email, phone, whatsapp } from '@/lib/travel-content';
import { turkishPlaces, turkeyCopy } from '@/lib/turkiye';
import { journeyCopy, moveJourneyDestination, parseJourney } from '@/lib/journey';
import { useJourney } from '../experience/JourneyStore';
import { WhatsAppIcon } from './SiteShell';

export type QueryPresence = Partial<Record<'service'|'destination'|'journey'|'dates'|'travelers', boolean>>;
export type InquiryProps = {locale:Locale;service?:string;destination?:string;journey?:string;orderedIds?:string[];message?:string;dates?:string;travelers?:string;queryPresence?:QueryPresence};
const copy = {
  about:t('About you','عن نفسك','Hakkınızda'),
  extra:t('Anything else','تفاصيل إضافية','Başka bir şey'),
  flexible:t('My dates are flexible','مواعيدي مرنة','Tarihlerim esnek'),
  method:t('Preferred contact method','طريقة التواصل المفضلة','Tercih edilen iletişim yöntemi'),
  phone:t('Phone / WhatsApp','الهاتف / واتساب','Telefon / WhatsApp'),
  invalidPhone:t('Enter a phone number with 7–15 digits.','أدخل رقم هاتف من ٧ إلى ١٥ رقماً.','7–15 rakam içeren bir telefon numarası girin.'),
  country:t('Requested country','الدولة المطلوبة','Talep edilen ülke'),
  add:t('Add a stop','أضف محطة','Durak ekle'),
  selectStop:t('Choose a destination','اختر وجهة','Bir destinasyon seçin'),
  summary:t('A starting point, shaped by you.','بداية ترسمها اختياراتك.','Sizinle şekillenen bir başlangıç.'),
  empty:t('No stops chosen yet. Tell us where you have in mind, or begin with a conversation.','لم تختر محطات بعد. أخبرنا بالوجهة التي تفكر بها، أو ابدأ بالحوار.','Henüz durak seçilmedi. Aklınızdaki yeri anlatın veya bir görüşmeyle başlayın.'),
  context:t('Your choices are a request for discussion. Nothing is booked or sent by this form.','اختياراتك طلب للنقاش. لا يحجز هذا النموذج شيئاً ولا يرسل أي معلومات.','Seçimleriniz görüşme talebidir. Bu form rezervasyon yapmaz veya bilgi göndermez.'),
};
const flexibleValues=Object.values(copy.flexible);
type Fields={name:string;email:string;phone:string;method:'email'|'phone';service:string;message:string;dates:string;flexible:boolean;travelers:string;organization:string;consent:boolean};
type Owner='query'|'global'|'local';
const subscribeMounted=()=>()=>{};
const mountedSnapshot=()=>true;
const serverMountedSnapshot=()=>false;
export function Inquiry({locale,service,destination,journey,orderedIds,message='',dates='',travelers='',queryPresence}:InquiryProps) {
  const global=useJourney();
  const mounted=useSyncExternalStore(subscribeMounted,mountedSnapshot,serverMountedSnapshot);
  const present=(key:keyof QueryPresence)=>queryPresence?.[key]??({service,destination,journey,dates:dates||undefined,travelers:travelers||undefined}[key]!==undefined);
  const [ids,setIds]=useState(()=>parseJourney((orderedIds??(present('journey')?parseJourney(journey):turkishPlaces.some(p=>p.slug===destination)?[destination!]:[])).join(',')));
  const [country,setCountry]=useState(()=>countries.find(c=>c.slug===destination&&c.slug!=='turkiye')?.slug??'');
  const [fields,setFields]=useState<Fields>({name:'',email:'',phone:'',method:'email',service:services.some(s=>s.slug===service)||service==='unsure'?service!:'',message:message.slice(0,2500),dates:flexibleValues.includes(dates)?'':dates.slice(0,150),flexible:flexibleValues.includes(dates),travelers:/^[1-9]\d{0,2}$/.test(travelers)?travelers:'',organization:'',consent:false});
  const itineraryOwner=useRef<Owner>(present('journey')||present('destination')?'query':'global');
  const serviceOwner=useRef<Owner>(present('service')?'query':'global');
  const baseline=useRef<{ids:string;service:string}|null>(null);
  const generation=useRef(0);
  const [errors,setErrors]=useState<Partial<Record<keyof Fields,string>>>({});
  const [prepared,setPrepared]=useState('');const [copyStatus,setCopyStatus]=useState('');const result=useRef<HTMLDivElement>(null);
  function invalidate(){generation.current++;setPrepared('');setCopyStatus('');}
  useEffect(()=>{
    // Both this sentinel and JourneyProvider use a server snapshot during SSR.
    // Once mounted, provider subscriptions have hydrated its live snapshot. No
    // timeout or empty-array heuristic can swallow an early real journey action.
    if(!mounted)return;
    const next=global.destinations.join(',');
    if(!baseline.current){
      baseline.current={ids:next,service:global.journeyType};
      if(itineraryOwner.current==='global')setIds(parseJourney(next));
      if(serviceOwner.current==='global')setFields(f=>({...f,service:global.journeyType}));
      return;
    }
    const old=baseline.current;
    baseline.current={ids:next,service:global.journeyType};
    if(next!==old.ids){if(itineraryOwner.current!=='local')setIds(parseJourney(next));invalidate();}
    if(global.journeyType!==old.service&&serviceOwner.current==='global'){setFields(f=>({...f,service:global.journeyType}));invalidate();}
  },[mounted,global.destinations,global.journeyType]);
  function update<K extends keyof Fields>(key:K,value:Fields[K]){if(key==='service')serviceOwner.current='local';setFields(f=>({...f,[key]:value}));setErrors(e=>({...e,[key]:undefined}));invalidate();}
  function editIds(next:string[],focus?:{id:string;offset:number}|true){itineraryOwner.current='local';setIds(next);invalidate();if(focus)requestAnimationFrame(()=>{if(focus===true)document.getElementById("inquiry-destination")?.focus();else{const row=document.querySelector(`[data-contact-edit-stop="${focus.id}"]`);(row?.querySelector<HTMLButtonElement>(`[data-move="${focus.offset}"]:not(:disabled)`)||row?.querySelector<HTMLButtonElement>("button:not(:disabled)"))?.focus();}});}
  const places=ids.map(id=>turkishPlaces.find(p=>p.slug===id)!);
  const requestedCountry=countries.find(c=>c.slug===country);
  const route=places.map(p=>p.name[locale]).join(locale==='ar'?' ← ':' → ');
  const selectedService=services.find(s=>s.slug===fields.service)?.title[locale]||ui.unsure[locale];
  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const issues:typeof errors={};
    if(!fields.name.trim())issues.name=ui.required[locale];
    if(fields.method==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))issues.email=ui.invalidEmail[locale];
    if(fields.method==='phone'&&!/^[+\d\s().-]+$/.test(fields.phone.trim()))issues.phone=copy.invalidPhone[locale];
    if(fields.method==='phone'&&(fields.phone.replace(/\D/g,'').length<7||fields.phone.replace(/\D/g,'').length>15))issues.phone=copy.invalidPhone[locale];
    if(!fields.service)issues.service=ui.required[locale];
    if(!fields.message.trim())issues.message=ui.required[locale];
    if(!fields.consent)issues.consent=ui.required[locale];
    if(fields.travelers&&(!/^\d+$/.test(fields.travelers)||Number(fields.travelers)<1||Number(fields.travelers)>999))issues.travelers=ui.invalidTravelers[locale];
    setErrors(issues);invalidate();
    if(Object.keys(issues).length){document.getElementById(`inquiry-${Object.keys(issues)[0]}`)?.focus();return;}
    const lines=[`${ui.inquiry[locale]} — Trip Line`,`${ui.name[locale]}: ${fields.name.trim()}`,`${fields.method==='email'?ui.email[locale]:copy.phone[locale]}: ${fields[fields.method].trim()}`,`${ui.service[locale]}: ${selectedService}`,
      ...(route?[`${journeyCopy.route[locale]}: ${route}`]:[]),...(requestedCountry?[`${copy.country[locale]}: ${requestedCountry.name[locale]}`]:[]),
      ...(fields.flexible?[`${ui.dates[locale]}: ${copy.flexible[locale]}`]:fields.dates?[`${ui.dates[locale]}: ${fields.dates}`]:[]),
      ...(['travelers','organization'] as const).filter(k=>fields[k]).map(k=>`${ui[k][locale]}: ${fields[k]}`),'',fields.message.trim()];
    setPrepared(lines.join('\n'));requestAnimationFrame(()=>{result.current?.focus();result.current?.scrollIntoView({behavior:'instant',block:'nearest'});});
  }
  const error=(key:keyof Fields)=>errors[key]&&<span id={`${key}-error`} className="field-error">{errors[key]}</span>;
  const field=(key:'name'|'email'|'phone'|'dates'|'travelers'|'organization',required=false)=><label htmlFor={`inquiry-${key}`}>{key==='phone'?copy.phone[locale]:ui[key][locale]}{required?' *':` (${ui.optional[locale]})`}<input id={`inquiry-${key}`} name={key} value={fields[key]} onChange={e=>update(key,e.target.value)} type={key==='email'?'email':key==='phone'?'tel':'text'} inputMode={key==='travelers'?'numeric':undefined} autoComplete={key==='name'?'name':key==='email'?'email':key==='phone'?'tel':key==='organization'?'organization':'off'} dir={key==='email'||key==='phone'?'ltr':undefined} maxLength={key==='travelers'?4:150} disabled={key==='dates'&&fields.flexible} aria-required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key]?`${key}-error`:undefined}/>{error(key)}</label>;
  return <section className="contact-section sand rc-contact" id="inquiry" data-contact-ready={mounted?true:undefined}><div className="wrap contact-layout">
    <aside className="contact-details rc-journey-summary" aria-label={journeyCopy.selected[locale]}>
      <span className="rc-contact-kicker">01 / {journeyCopy.selected[locale]}</span><h2>{copy.summary[locale]}</h2>
      <div className="rc-contact-media"><Image src={`/media/${places[0]?.image||(requestedCountry?requestedCountry.slug+'.jpg':'cappadocia-v5.jpg')}`} alt={places[0]?.name[locale]||requestedCountry?.name[locale]||turkishPlaces.find(p=>p.slug==='cappadocia')!.name[locale]} fill sizes="(max-width: 767px) 100vw, 40vw" priority/></div>
      {places.length?<ol className="rc-contact-stops" data-contact-journey>{places.map((p,i)=><li data-contact-stop={p.slug} key={p.slug}><span>{String(i+1).padStart(2,'0')}</span><strong>{p.name[locale]}</strong></li>)}</ol>:<p data-contact-journey>{copy.empty[locale]}</p>}
      {requestedCountry&&<p data-contact-country>{copy.country[locale]}: <strong>{requestedCountry.name[locale]}</strong></p>}
      <dl className="rc-contact-facts"><div><dt>{ui.service[locale]}</dt><dd>{selectedService}</dd></div><div><dt>{ui.dates[locale]}</dt><dd>{fields.flexible?copy.flexible[locale]:fields.dates||ui.unsure[locale]}</dd></div><div><dt>{ui.travelers[locale]}</dt><dd>{fields.travelers||ui.unsure[locale]}</dd></div></dl><p className="rc-contact-note">{copy.context[locale]}</p>
      <div className="rc-contact-direct"><h3>{ui.direct[locale]}</h3><a href={whatsapp(ui.plan[locale])}><WhatsAppIcon size={20}/><span>WhatsApp <bdi>+90 554 107 22 02</bdi></span><ArrowUpRight size={18}/></a><a href={`mailto:${email}`}><Mail size={20}/><bdi>{email}</bdi><ArrowUpRight size={18}/></a><a href={`tel:${phone}`}><Phone size={20}/><bdi>+90 554 107 22 02</bdi><ArrowUpRight size={18}/></a><p>{ui.location[locale]}</p></div>
    </aside>
    <div className="form-panel"><form onSubmit={submit} noValidate>
      <fieldset><legend><span>01</span>{journeyCopy.selected[locale]}</legend>
        {places.length>0&&<ol className="rc-contact-edit-stops">{places.map((p,i)=><li key={p.slug} data-contact-edit-stop={p.slug}><span>{i+1}. {p.name[locale]}</span><div><button type="button" data-move="-1" disabled={i===0} aria-label={`${journeyCopy.earlier[locale]}: ${p.name[locale]}`} onClick={()=>editIds(moveJourneyDestination(ids,p.slug,-1),{id:p.slug,offset:-1})}><ArrowUp size={16}/></button><button type="button" data-move="1" disabled={i===places.length-1} aria-label={`${journeyCopy.later[locale]}: ${p.name[locale]}`} onClick={()=>editIds(moveJourneyDestination(ids,p.slug,1),{id:p.slug,offset:1})}><ArrowDown size={16}/></button><button type="button" aria-label={`${journeyCopy.remove[locale]}: ${p.name[locale]}`} onClick={()=>editIds(ids.filter(id=>id!==p.slug),true)}><X size={16}/></button></div></li>)}</ol>}
        <div className="form-grid"><label htmlFor="inquiry-destination">{copy.add[locale]}<select id="inquiry-destination" name="destination" value="" onChange={e=>{const value=e.target.value;if(turkishPlaces.some(p=>p.slug===value)){if(!ids.includes(value))editIds([...ids,value]);}else{itineraryOwner.current='local';setCountry(value);invalidate();}}}><option value="">{copy.selectStop[locale]}</option><optgroup label={turkeyCopy.domestic[locale]}>{turkishPlaces.map(p=><option key={p.slug} value={p.slug} disabled={ids.includes(p.slug)}>{p.name[locale]}</option>)}</optgroup><optgroup label={turkeyCopy.international[locale]}>{countries.filter(c=>c.slug!=='turkiye').map(c=><option key={c.slug} value={c.slug}>{c.name[locale]}</option>)}</optgroup></select></label>
        <label htmlFor="inquiry-service">{ui.service[locale]} *<select id="inquiry-service" name="service" value={fields.service} onChange={e=>update('service',e.target.value)} aria-required="true" aria-invalid={!!errors.service} aria-describedby={errors.service?'service-error':undefined}><option value="">{ui.select[locale]}</option><option value="unsure">{ui.unsure[locale]}</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title[locale]}</option>)}</select>{error('service')}</label>{field('dates')}{field('travelers')}</div>
        <label className="consent rc-flexible" htmlFor="inquiry-flexible"><input id="inquiry-flexible" type="checkbox" checked={fields.flexible} onChange={e=>update('flexible',e.target.checked)}/><span>{copy.flexible[locale]}</span></label>
        {requestedCountry&&<button className="text-link" type="button" onClick={()=>{setCountry('');invalidate();}}>{journeyCopy.remove[locale]}: {requestedCountry.name[locale]}<X size={16}/></button>}
      </fieldset>
      <fieldset><legend><span>02</span>{copy.about[locale]}</legend><div className="form-grid">{field('name',true)}<label htmlFor="inquiry-method">{copy.method[locale]}<select id="inquiry-method" value={fields.method} onChange={e=>update('method',e.target.value as Fields['method'])}><option value="email">{ui.email[locale]}</option><option value="phone">{copy.phone[locale]}</option></select></label>{field(fields.method,true)}{field('organization')}</div></fieldset>
      <fieldset><legend><span>03</span>{copy.extra[locale]}</legend><label htmlFor="inquiry-message">{ui.message[locale]} *<textarea id="inquiry-message" name="message" rows={5} maxLength={2500} value={fields.message} onChange={e=>update('message',e.target.value)} aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message?'message-error':undefined}/>{error('message')}</label></fieldset>
      <label className="consent" htmlFor="inquiry-consent"><input type="checkbox" id="inquiry-consent" checked={fields.consent} onChange={e=>update('consent',e.target.checked)} aria-required="true" aria-invalid={!!errors.consent} aria-describedby={errors.consent?'consent-error':undefined}/><span>{ui.consent[locale]} <Link href={href(locale,'privacy')}>{ui.privacy[locale]}</Link>.</span></label>{error('consent')}{Object.values(errors).some(Boolean)&&<p role="alert" className="field-error">{ui.formHelp[locale]}</p>}<p className="rc-contact-note">{copy.context[locale]}</p><button className="button dark-button" type="submit">{ui.prepare[locale]}<ArrowUpRight size={18}/></button>
    </form>
    {prepared&&<div className="inquiry-result" ref={result} tabIndex={-1}><Check/><h3>{ui.ready[locale]}</h3><p>{ui.readyBody[locale]}</p><div className="actions"><a href={whatsapp(prepared)} className="button dark-button" target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{ui.whatsapp[locale]}</a><a href={`mailto:${email}?subject=${encodeURIComponent(ui.inquiry[locale]+' — Trip Line')}&body=${encodeURIComponent(prepared)}`} className="text-link"><Mail size={18}/>{ui.sendEmail[locale]}</a></div><details><summary>{ui.message[locale]}</summary><pre>{prepared}</pre></details><button className="text-link" type="button" onClick={async()=>{const version=generation.current;const current=prepared;try{await navigator.clipboard.writeText(current);if(generation.current===version)setCopyStatus(ui.copied[locale]);}catch{if(generation.current===version)setCopyStatus(ui.copyFailed[locale]);}}}><Copy size={16}/>{ui.copy[locale]}</button><p role="status">{copyStatus}</p></div>}
    </div></div></section>;
}
