'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTravel } from '../travel/SiteShell';

/** Internal-page motion is deliberately shorter than the homepage story. */
export function PageSceneMotion() {
  const anchor=useRef<HTMLSpanElement>(null);
  const {calm}=useTravel();
  const pathname=usePathname();
  useEffect(()=>{
    const root=anchor.current?.closest<HTMLElement>('.recovery-destination,.recovery-services,.recovery-pilgrimage');
    if(!root||calm)return;
    let cancelled=false;let dispose=()=>{};
    void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
      if(cancelled)return;gsap.registerPlugin(ScrollTrigger);
      root.dataset.v6PageMotion='active';
      const context=gsap.context(()=>{
        const heading=root.querySelector('h1');
        const intro=gsap.timeline();
        if(heading)intro.fromTo(heading,{y:24,clipPath:'inset(0 0 95% 0)'},{y:0,clipPath:'inset(-12% 0 -20% 0)',duration:.75,ease:'power3.out'},0);
        const supporting=root.querySelectorAll('.rd-arrival-copy>p,.rd-coordinate,.rs-hero-copy>p,.rp-arrival-copy p');
        if(supporting.length)intro.fromTo(supporting,{y:14,opacity:.5},{y:0,opacity:1,duration:.65,stagger:.06,ease:'power3.out'},.15);
        const hero=root.querySelector('.rs-hero-media>.photo,.rp-arrival-photo');
        if(hero)intro.fromTo(hero,{scale:1.06,clipPath:'inset(0 12% 0 0)'},{scale:1,clipPath:'inset(0 0% 0 0)',duration:.85,ease:'power3.out'},0);
        root.querySelectorAll<HTMLElement>('.rd-interest-photo,.rs-need-dominant>.photo,.rs-inspiration .rs-place-dominant .photo').forEach((photo,index)=>{
          gsap.fromTo(photo,{y:35,clipPath:index%2?'inset(0 0 15% 0)':'inset(0 15% 0 0)'},{y:0,clipPath:'inset(0 0% 0% 0)',ease:'none',scrollTrigger:{trigger:photo,start:'top 95%',end:'top 38%',scrub:true,invalidateOnRefresh:true}});
        });
        const feel=root.querySelector('.rd-feel>.photo');
        if(feel)gsap.fromTo(feel,{scale:1.07,yPercent:-3},{scale:1,yPercent:3,ease:'none',scrollTrigger:{trigger:'.rd-feel',start:'top bottom',end:'bottom top',scrub:true}});
        root.querySelectorAll('.rd-final-route path,.rs-final .rs-route path').forEach(path=>gsap.fromTo(path,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:path.closest('section'),start:'top 85%',end:'bottom 75%',scrub:true}}));
        const finish=()=>intro.progress(1);
        root.addEventListener('focusin',finish);
        dispose=()=>{root.removeEventListener('focusin',finish);context.revert();delete root.dataset.v6PageMotion;};
      },root);
    });
    return()=>{cancelled=true;dispose();};
  },[calm,pathname]);
  return <span hidden ref={anchor} data-v6-page-motion-anchor/>;
}
