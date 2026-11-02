'use client';
import {useEffect,useRef,useState,useSyncExternalStore,type CSSProperties} from 'react';
import Image from 'next/image';
import {t,type Locale} from '@/lib/i18n';
import {useTravel} from '../travel/SiteShell';
import inventory from '@/public/brand/network/inventory.json';
import optical from '@/public/brand/network/optical/provenance.json';
import '@/styles/v61-billboard.css';
const institutions=inventory.records.filter(r=>['institution','institutional-platform','trade-association'].includes(r.classification));
const commercial=inventory.records.filter(r=>!institutions.includes(r));
const subscribe=(notify:()=>void)=>{document.addEventListener('visibilitychange',notify);return()=>document.removeEventListener('visibilitychange',notify);};
const documentVisible=()=>!document.hidden;
function Logo({id,brand,institution=false}:{id:string;brand:string;institution?:boolean}){
 const asset=optical.records.find(item=>item.id===id)!;
 return <Image loading="eager" src={asset.output} alt={brand} width={asset.size[0]} height={asset.size[1]} sizes={institution?'120px':'260px'}/>;
}
export function PartnerBillboard({locale}:{locale:Locale}){
 const {calm}=useTravel();
 const windowRef=useRef<HTMLDivElement>(null),track=useRef<HTMLDivElement>(null),group=useRef<HTMLUListElement>(null);
 const animation=useRef<Animation|null>(null),runningRef=useRef(false);
 const [visible,setVisible]=useState(false),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[copies,setCopies]=useState(3);
 const shown=useSyncExternalStore(subscribe,documentVisible,()=>false);
 const running=!calm&&shown&&visible&&!paused&&!hovered&&!focused;
 useEffect(()=>{const element=windowRef.current;if(!element)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05});observer.observe(element);return()=>observer.disconnect();},[]);
 useEffect(()=>{runningRef.current=running;if(animation.current){if(running)animation.current.play();else animation.current.pause();}},[running]);
 useEffect(()=>{
  if(calm||!track.current||!group.current||!windowRef.current)return;
  const node=track.current,unit=group.current,viewport=windowRef.current;let frame=0,previous={width:0,speed:0};
  const measure=()=>{
   const width=unit.getBoundingClientRect().width,speed=matchMedia('(max-width:767px)').matches?32:52;if(!width)return;
   setCopies(Math.ceil(viewport.clientWidth/width)+2);if(previous.width===width&&previous.speed===speed)return;
   const position=previous.width?(Number(animation.current?.currentTime||0)/1000*previous.speed)%previous.width:0;
   animation.current?.cancel();
   const next=node.animate([{transform:'translate3d(0,0,0)'},{transform:`translate3d(${-width}px,0,0)`}],{duration:width/speed*1000,iterations:Infinity,easing:'linear',fill:'both'});
   next.pause();next.currentTime=position/speed*1000;animation.current=next;previous={width,speed};node.dataset.groupWidth=String(width);node.dataset.speed=String(speed);if(runningRef.current)next.play();
  };
  const resize=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);});resize.observe(unit);resize.observe(viewport);measure();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();animation.current?.cancel();animation.current=null;};
 },[calm]);
 return <section className="v6-network v61-network" data-running={running} data-user-paused={paused} aria-labelledby="network-title">
  <div className="rh-wrap v6-network-heading"><div><span className="rh-kicker">TRIP LINE / 2025</span><h2 id="network-title">{t('A world of connections.','عالم من الروابط.','Bağlantılarla dolu bir dünya.')[locale]}</h2></div><button type="button" disabled={calm} aria-pressed={!running} onClick={()=>setPaused(value=>!value)}>{calm?t('Motion reduced','الحركة مخفّضة','Hareket azaltıldı')[locale]:running?t('Pause movement','إيقاف الحركة','Hareketi durdur')[locale]:t('Resume movement','استئناف الحركة','Hareketi sürdür')[locale]}</button></div>
  <div ref={windowRef} className="v6-network-tracks v61-billboard-window" tabIndex={0} aria-label={t('Travel Network logos; focus pauses movement','شعارات شبكة السفر؛ التركيز يوقف الحركة','Seyahat ağı logoları; odak hareketi durdurur')[locale]} onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(true);}} onPointerLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
   <div ref={track} className="v6-network-track v61-billboard-track">{Array.from({length:copies},(_,copy)=><ul ref={copy===0?group:undefined} key={copy} className="v61-billboard-group" aria-hidden={copy>0?true:undefined}>{commercial.map(record=>{const asset=optical.records.find(item=>item.id===record.id)!;return <li key={record.id} data-brand={record.id} style={{'--logo-width':`${Math.max(140,Math.min(340,asset.size[0]/asset.size[1]*100))}px`} as CSSProperties}><Logo id={record.id} brand={record.brand}/></li>;})}</ul>)}</div>
  </div>
  <p className="rh-wrap v6-network-note">{t('Marks in our 2025 company profile. Current relationships and publication approval await confirmation.','علامات واردة في ملف الشركة لعام 2025. العلاقات الحالية والموافقة على النشر قيد التأكيد.','2025 şirket profilindeki markalar. Güncel ilişkiler ve yayın onayı teyit bekliyor.')[locale]}</p>
  <div className="rh-wrap v6-institutions"><p>{t('Institutional and association marks · shown separately; no endorsement implied.','علامات المؤسسات والجمعيات · تُعرض منفصلة دون ادعاء تأييد.','Kurum ve birlik işaretleri · ayrı gösterilir; onay anlamına gelmez.')[locale]}</p><ul>{institutions.map(record=><li key={record.id}><Logo id={record.id} brand={record.brand} institution/>{record.verificationStatus.startsWith('uncertain')&&<small>{t('Identification pending','الهوية قيد التأكيد','Kimlik teyit bekliyor')[locale]}</small>}</li>)}</ul></div>
 </section>;
}
