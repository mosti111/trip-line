'use client';
import { useEffect, useRef } from 'react';
import { useTravel } from '../travel/SiteShell';
import { ContextCursor } from './ContextCursor';

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
            timeline.to(hero.querySelector('.hero-content'),{yPercent:-18,opacity:0,scale:.94,duration:.35,ease:'none'},0)
              .to(hero.querySelectorAll(':scope > .photo,:scope > .hero-video'),{scale:.83,yPercent:-5,opacity:.55,duration:1,ease:'none'},0)
              .fromTo(root.querySelector('.departure-copy'),{opacity:0,y:45},{opacity:1,y:0,duration:.25,ease:'none'},.35);
            const focus=()=>{if(timeline.scrollTrigger)window.scrollTo({top:timeline.scrollTrigger.start,behavior:'instant'});};
            hero.addEventListener('focusin',focus);cleanups.push(()=>hero.removeEventListener('focusin',focus));
          }
          root.querySelectorAll('.world-plane').forEach((plane,i)=>{if(i!==1)gsap.from(plane,{y:65,rotationY:i===0?4:-4,scrollTrigger:{trigger:plane,start:'top 95%',end:'top 40%',scrub:.8}});});
          const atlas=root.querySelector('.turkey-atlas');
          if(atlas){let previous=-1;const stops=['istanbul','cappadocia','antalya','rize-ayder','bodrum'];ScrollTrigger.create({trigger:atlas,start:'top 70%',end:'bottom 30%',onUpdate:self=>{const index=Math.min(4,Math.floor(self.progress*5));if(index!==previous){previous=index;window.dispatchEvent(new CustomEvent('bronze-place',{detail:stops[index]}));}}});}
          const frame=root.querySelector('.film-frame');if(frame)gsap.fromTo(frame,{clipPath:'inset(8% 12% 8% 12%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:frame,start:'top 85%',end:'top 5%',scrub:.7}});
          const services=root.querySelector<HTMLElement>('.services-journey');const track=root.querySelector<HTMLElement>('.services-track');
          if(services&&track){
            services.classList.add('horizontal-enhanced');
            const distance=()=>Math.max(0,track.scrollWidth-services.clientWidth);
            const tween=gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:services,start:'top top',end:()=>`+=${distance()*.7}`,pin:true,scrub:.6,invalidateOnRefresh:true}});
            // Keyboard focus scrolls the vertical timeline to the focused link's position.
            const focus=(event:FocusEvent)=>{const item=(event.target as HTMLElement).closest<HTMLElement>('.service-milestone');const st=tween.scrollTrigger;if(item&&st){const progress=Math.min(1,Math.max(0,(item.offsetLeft-70)/Math.max(1,distance())));window.scrollTo({top:st.start+(st.end-st.start)*progress,behavior:'instant'});}};
            track.addEventListener('focusin',focus);
            cleanups.push(()=>{services.classList.remove('horizontal-enhanced');track.removeEventListener('focusin',focus);});
          }
          return()=>cleanups.forEach(cleanup=>cleanup());
        });
      },root);
      const refresh=()=>ScrollTrigger.refresh();
      void document.fonts.ready.then(()=>{if(!cancelled)refresh();});
      root.addEventListener('load',refresh,true);
      dispose=()=>{root.removeEventListener('load',refresh,true);mm.revert();context.revert();};
    });
    return()=>{cancelled=true;dispose();};
  },[calm]);
  return <div ref={host} className="bronze-home">{children}<ContextCursor/></div>;
}
