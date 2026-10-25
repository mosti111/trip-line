'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { journeyCopy } from '@/lib/journey';
import { turkeyCopy as copy, turkishPlaces } from '@/lib/turkiye';
import { AddToJourney } from '../experience/JourneyActions';
import { useJourney } from '../experience/JourneyStore';
import { useTravel } from '../travel/SiteShell';
import { Photo } from '../travel/Sections';
import { TurkeyMap } from '../turkiye/TurkeyMap';
import '@/styles/v61-atlas.css';

export function AtlasStage({ locale, full=false, guided=false }: {locale:Locale;full?:boolean;guided?:boolean}) {
  const {calm}=useTravel();
  const {destinations}=useJourney();
  const [active,setActive]=useState(0);
  const [from,setFrom]=useState('istanbul');
  const [media,setMedia]=useState({requested:'istanbul',shown:'istanbul',previous:'',failed:''});
  const manual=useRef(false),host=useRef<HTMLElement>(null),mediaHost=useRef<HTMLDivElement>(null);
  const place=turkishPlaces[active];
  const origin=turkishPlaces.find(item=>item.slug===from)!;
  const dx=place.lon-origin.lon,dy=place.lat-origin.lat;
  const direction=Math.abs(dx)>=Math.abs(dy)?dx>=0?'east':'west':dy>=0?'north':'south';
  const shown=turkishPlaces.find(item=>item.slug===media.shown)!;
  const previous=turkishPlaces.find(item=>item.slug===media.previous);
  function select(id:string) {
    const next=turkishPlaces.findIndex(item=>item.slug===id);
    if(next<0)return;
    manual.current=true;
    if(next!==active)setFrom(place.slug);
    setActive(next);setMedia(old=>({...old,requested:id,failed:''}));
  }
  useEffect(()=>{
    const image=mediaHost.current?.querySelector<HTMLImageElement>(`[data-place="${media.requested}"] img`);
    if(!image?.complete||!image.naturalWidth)return;
    let cancelled=false;
    void image.decode().then(()=>{if(!cancelled)setMedia(old=>old.requested!==media.requested||old.shown===old.requested?old:{...old,previous:old.shown,shown:old.requested,failed:''});}).catch(()=>{});
    return()=>{cancelled=true;};
  },[media.requested]);
  useEffect(()=>{
    if(!guided)return;
    const guide=(event:Event)=>{
      if(manual.current)return;
      const id=(event as CustomEvent<string>).detail,index=turkishPlaces.findIndex(item=>item.slug===id);
      if(index>=0){if(active!==index)setFrom(turkishPlaces[active].slug);setActive(index);setMedia(old=>({...old,requested:id,failed:''}));}
    };
    window.addEventListener('bronze-place',guide);return()=>window.removeEventListener('bronze-place',guide);
  },[guided,active]);
  useEffect(()=>{
    if(calm||!host.current)return;
    let cancelled=false,dispose=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(cancelled||!host.current)return;
      gsap.registerPlugin(ScrollTrigger);
      const context=gsap.context(()=>{
        const timeline=gsap.timeline({scrollTrigger:{trigger:host.current,start:'top 92%',end:'top 18%',scrub:true,invalidateOnRefresh:true}});
        timeline.fromTo('.rt-preview',{clipPath:'polygon(9% 8%,100% 0,100% 100%,9% 92%)',scale:.93},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',scale:1,ease:'none'},0);
        timeline.fromTo('.rt-index',{y:18},{y:0,ease:'none'},0);
        timeline.fromTo('.rt-desktop-map',{y:28,opacity:.3},{y:0,opacity:1,ease:'none'},0);
      },host);
      dispose=()=>context.revert();
    });return()=>{cancelled=true;dispose();};
  },[calm]);
  return <section ref={host} className={`rt-explorer atlas-stage ${full?'rt-explorer-full':''}`} id="turkiye" aria-label={copy.choose[locale]} data-direction={direction} data-calm={calm}>
    <div className="rt-wrap"><div className="rt-explorer-layout" dir="ltr">
      <div className="rt-index" dir={locale==='ar'?'rtl':'ltr'} role="group" aria-label={copy.choose[locale]}>
        <p className="atlas-index-heading"><bdi>12 / TÜRKİYE</bdi><span>{copy.choose[locale]}</span></p>
        {turkishPlaces.map((item,index)=><button key={item.slug} aria-pressed={active===index} onClick={()=>select(item.slug)}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.name[locale]}</strong><ArrowUpRight size={16}/></button>)}
      </div>
      <div className="rt-preview" dir={locale==='ar'?'rtl':'ltr'}>
        <div className="atlas-frame-rule" aria-hidden="true"/>
        <div ref={mediaHost} className="rt-preview-media" data-requested={media.requested} data-shown={media.shown}>
          {turkishPlaces.filter(item=>[media.requested,media.shown,media.previous].includes(item.slug)).map(item=><div className="rt-preview-image" key={item.slug} data-place={item.slug} data-active={item.slug===media.shown} data-previous={item.slug===media.previous} aria-hidden={item.slug!==media.shown} onLoadCapture={event=>{
            const image=event.target;if(!(image instanceof HTMLImageElement))return;
            void image.decode().then(()=>setMedia(old=>old.requested!==item.slug||old.shown===item.slug?old:{...old,previous:old.shown,shown:item.slug,failed:''})).catch(()=>setMedia(old=>old.requested===item.slug?{...old,failed:item.slug}:old));
          }} onErrorCapture={()=>setMedia(old=>old.requested===item.slug?{...old,failed:item.slug}:old)}><Photo file={item.image} eager={item.slug===media.requested} alt={item.name[locale]} sizes="(max-width:767px) 100vw,75vw"/></div>)}
          <div className="atlas-photo-shade"/>
          {media.failed&&<span className="rt-photo-status" role="status">{t('Photo unavailable. Previous destination remains visible.','الصورة غير متاحة. تظهر صورة الوجهة السابقة.','Fotoğraf yüklenemedi. Önceki destinasyon gösteriliyor.')[locale]}</span>}
        </div>
        <div className="rt-desktop-map"><TurkeyMap locale={locale} active={place.slug} previous={from} stage onSelect={select} selectedIds={destinations}/></div>
        <div className="rt-preview-content">
          <div className="atlas-place-meta"><bdi className="rt-coordinate" dir="ltr">{place.lat.toFixed(2)}° N / {place.lon.toFixed(2)}° E</bdi><span className="atlas-current-number"><bdi>{String(active+1).padStart(2,'0')}</bdi><span>/ 12</span></span></div>
          <h3><span className="sr-only">{place.name[locale]}</span>{previous&&<span className="atlas-title-previous" key={'old-'+media.shown} aria-hidden="true">{previous.name[locale]}</span>}<span className="atlas-title-incoming" key={media.shown} aria-hidden="true">{shown.name[locale]}</span></h3>
          <p>{place.note[locale]}</p>
          <div className="rt-preview-actions"><Link className="journey-text-link" href={href(locale,`destinations/turkiye/${place.slug}`)} aria-label={`${t('Explore destination','اكتشف الوجهة','Destinasyonu keşfet')[locale]}: ${place.name[locale]}`}>{t('Explore destination','اكتشف الوجهة','Destinasyonu keşfet')[locale]}<ArrowUpRight size={18}/></Link><AddToJourney id={place.slug} locale={locale}/></div>
          <div className="rt-step-controls"><button type="button" aria-label={journeyCopy.previous[locale]} onClick={()=>select(turkishPlaces[(active+11)%12].slug)}><ArrowLeft size={18}/></button><button type="button" aria-label={journeyCopy.next[locale]} onClick={()=>select(turkishPlaces[(active+1)%12].slug)}><ArrowRight size={18}/></button></div>
        </div>
        <span className="atlas-selection-status sr-only" role="status">{place.name[locale]}</span>
      </div>
    </div><details className="rt-mobile-map"><summary>{t('Locate in Türkiye','الموقع داخل تركيا','Türkiye’deki konumu')[locale]}</summary><TurkeyMap locale={locale} active={place.slug} previous={from} stage onSelect={select} selectedIds={destinations}/></details>
      <div className="rt-explorer-foot"><Link className="journey-text-link" href={href(locale,'destinations/turkiye#places')}>{copy.directory[locale]}<ArrowUpRight size={18}/></Link><Link className="rt-secondary-link" href={href(locale,'destinations')}>{copy.international[locale]}<ArrowUpRight size={14}/></Link></div>
    </div>
  </section>;
}
