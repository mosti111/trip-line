'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';

/** A scoped choreography: triggers created in page order, reverted on preference/route changes. */
export function ScrollScene({ children }: {children:React.ReactNode}) {
  const host=useRef<HTMLDivElement>(null);const {calm}=useTravel();
  useEffect(()=>{
    if(calm||(navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData)return;
    let cancelled=false,dispose=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(cancelled||!host.current)return;
      gsap.registerPlugin(ScrollTrigger);
      const root=host.current; const mm=gsap.matchMedia();
      const context=gsap.context(()=>{
        mm.add('(min-width: 1024px) and (min-height: 800px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
          const cleanups:(()=>void)[]=[];
          const opening=root.querySelector('.opening');const hero=root.querySelector('.home-hero');
          if(opening&&hero){
            const timeline=gsap.timeline({scrollTrigger:{trigger:opening,start:'top top',end:()=>`+=${innerHeight*1.3}`,pin:true,scrub:.7,anticipatePin:1,onUpdate:self=>window.dispatchEvent(new CustomEvent('bronze-progress',{detail:self.progress}))}});
            timeline.to(hero.querySelector('.hero-content'),{yPercent:-10,scale:.96,duration:.35,ease:'none'},.2)
              .to(hero.querySelector('.hero-content'),{opacity:0,duration:.22,ease:'none'},.42)
              .to(hero.querySelectorAll(':scope > .photo,:scope > .hero-video'),{scale:1.06,clipPath:'inset(12% 0% 12% 48%)',opacity:.35,duration:.7,ease:'none'},.2)
              .to(hero.querySelector('.bronze-journey'),{yPercent:35,scale:1.16,duration:.8,ease:'none'},.2)
              .fromTo(root.querySelector('.departure-copy'),{opacity:0,y:45},{opacity:1,y:0,duration:.35,ease:'none'},.6);
            const focus=()=>{if(timeline.scrollTrigger)window.scrollTo({top:timeline.scrollTrigger.start,behavior:'instant'});};
            hero.addEventListener('focusin',focus);cleanups.push(()=>hero.removeEventListener('focusin',focus));
          }
          const entrance=root.querySelector('.turkey-entrance');
          if(entrance){gsap.fromTo(entrance.querySelector('.entrance-route path'),{strokeDasharray:2300,strokeDashoffset:2300},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:entrance,start:'top 80%',end:'bottom 30%',scrub:.8}});gsap.fromTo(entrance.querySelector('h2'),{y:50},{y:-25,ease:'none',scrollTrigger:{trigger:entrance,start:'top bottom',end:'bottom top',scrub:.8}});}
          root.querySelectorAll('.signature-layout .photo img,.story-portrait img').forEach(image=>{gsap.fromTo(image,{y:-25,scale:1.08},{y:25,scale:1.08,ease:'none',scrollTrigger:{trigger:image.closest('.photo'),start:'top bottom',end:'bottom top',scrub:.8}});});
          const arrival=root.querySelector('.arrival-route path');if(arrival)gsap.fromTo(arrival,{strokeDasharray:2000,strokeDashoffset:2000},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:arrival.closest('section'),start:'top 80%',end:'bottom bottom',scrub:.8}});
          const atlas=root.querySelector('.turkey-atlas');
          if(atlas){let previous=-1;const stops=['istanbul','cappadocia','antalya','rize-ayder','bodrum'];ScrollTrigger.create({trigger:atlas,start:'top 70%',end:'bottom 30%',onUpdate:self=>{const index=Math.min(4,Math.floor(self.progress*5));if(index!==previous){previous=index;window.dispatchEvent(new CustomEvent('bronze-place',{detail:stops[index]}));}}});}
          const frame=root.querySelector('.film-frame');if(frame)gsap.fromTo(frame,{clipPath:'inset(8% 12% 8% 12%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:frame,start:'top 85%',end:'top 5%',scrub:.7}});
          return()=>cleanups.forEach(cleanup=>cleanup());
        });
        mm.add('(prefers-reduced-motion: no-preference)',()=>{
          root.querySelectorAll('.world-heading h2,.story-words h2,.signature-places h2,.journey-builder h2').forEach(title=>gsap.from(title,{y:28,opacity:.6,duration:.9,ease:'power3.out',scrollTrigger:{trigger:title,start:'top 92%',once:true}}));
        });
        mm.add('(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)',()=>{
          const hero=root.querySelector<HTMLElement>('.home-hero');if(!hero)return;
          const photo=hero.querySelector<HTMLElement>(':scope > .photo img');if(!photo)return;
          const move=(event:PointerEvent)=>{if(event.pointerType!=='mouse')return;const rect=hero.getBoundingClientRect();if(rect.bottom<=0)return;gsap.to(photo,{x:(event.clientX/innerWidth-.5)*20,y:(event.clientY/innerHeight-.5)*16,scale:1.03,duration:.8,overwrite:true,ease:'power2.out'});};
          const reset=()=>gsap.to(photo,{x:0,y:0,scale:1,duration:.8,overwrite:true});
          hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);
          return()=>{hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);gsap.killTweensOf(photo);gsap.set(photo,{clearProps:'transform'});};
        });
      },root);
      let refreshFrame=0;
      const refresh=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());};
      const resize=new ResizeObserver(refresh);resize.observe(root);
      void document.fonts.ready.then(()=>{if(!cancelled)refresh();});
      root.addEventListener('load',refresh,true);
      dispose=()=>{resize.disconnect();cancelAnimationFrame(refreshFrame);root.removeEventListener('load',refresh,true);mm.revert();context.revert();};
    });
    return()=>{cancelled=true;dispose();};
  },[calm]);
  return <div ref={host} className="bronze-home">{children}</div>;
}
