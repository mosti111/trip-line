'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTravel } from '../travel/SiteShell';
import { turkishPlaces } from '@/lib/turkiye';

/** State commits first. This optional photograph never controls the transaction. */
export function flyToJourney(id: string, source: HTMLElement) {
  const box=source.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent('tripline-add-photo',{detail:{id,x:box.left+box.width/2,y:box.top+box.height/2}}));
}
export function JourneyTransfer() {
  const { calm }=useTravel();
  const [flight,setFlight]=useState<{key:number;image:string;x:number;y:number;tx:number;ty:number}|null>(null);
  const frame=useRef(0);
  useEffect(()=>{
    const receive=(event:Event)=>{
      if(calm)return;
      const {id,x,y}=(event as CustomEvent<{id:string;x:number;y:number}>).detail;
      const place=turkishPlaces.find(item=>item.slug===id);if(!place)return;
      cancelAnimationFrame(frame.current);
      frame.current=requestAnimationFrame(()=>{
        const target=[...document.querySelectorAll<HTMLElement>('.rh-builder-preview,.header-journey,.header-plan')].find(node=>{const b=node.getBoundingClientRect();return b.top>0&&b.bottom<innerHeight&&b.width>0;});
        if(!target)return;const box=target.getBoundingClientRect();
        setFlight({key:performance.now(),image:place.image,x:x-48,y:y-36,tx:box.left+box.width/2-48,ty:box.top+box.height/2-36});
      });
    };
    window.addEventListener('tripline-add-photo',receive);
    return ()=>{cancelAnimationFrame(frame.current);window.removeEventListener('tripline-add-photo',receive);};
  },[calm]);
  return <AnimatePresence>{!calm&&flight&&<motion.div key={flight.key} className="v6-journey-transfer" aria-hidden="true" initial={{x:flight.x,y:flight.y,scale:.45,opacity:1,rotate:-6}} animate={{x:[flight.x,(flight.x+flight.tx)/2,flight.tx],y:[flight.y,Math.min(flight.y,flight.ty)-45,flight.ty],scale:[.45,.9,.2],opacity:[1,1,0],rotate:[-6,3,0]}} exit={{opacity:0}} transition={{duration:.65,ease:[.22,1,.36,1]}} onAnimationComplete={()=>setFlight(current=>current?.key===flight.key?null:current)} style={{backgroundImage:`url('/media/${flight.image}')`}}/>}</AnimatePresence>;
}
