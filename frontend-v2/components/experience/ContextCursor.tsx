'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** A local caption over destination photography; the system cursor stays visible. */
export function ContextCursor() {
  const ref=useRef<HTMLDivElement>(null);const {calm}=useTravel();
  useEffect(()=>{
    const el=ref.current;if(!el||calm)return;
    const move=(event:PointerEvent)=>{
      const target=(event.target as HTMLElement).closest<HTMLElement>('[data-cursor-label]');
      const enabled=matchMedia('(min-width:1280px) and (pointer:fine)').matches;
      el.hidden=!target||!enabled;
      if(target&&enabled){el.textContent=target.dataset.cursorLabel||'';el.style.transform=`translate(${event.clientX+18}px,${event.clientY+18}px)`;}
    };
    const hide=()=>{el.hidden=true;};
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',hide,{passive:true});window.addEventListener('blur',hide);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('scroll',hide);window.removeEventListener('blur',hide);hide();};
  },[calm]);
  return <div ref={ref} className="context-cursor" aria-hidden="true" hidden/>;
}
