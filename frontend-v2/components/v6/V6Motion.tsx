'use client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useTravel } from '../travel/SiteShell';

const smallViewport=()=>matchMedia('(max-width: 767px)').matches;
const observeViewport=(notify:()=>void)=>{const query=matchMedia('(max-width: 767px)');query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);};

/** GSAP owns these scene wrappers only; CSS and Motion own their nested UI. */
export function V6Motion() {
  const { calm } = useTravel();
  const small=useSyncExternalStore(observeViewport,smallViewport,()=>false);
  const anchor = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.v6-home');
    if (!root) return;
    const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    root.dataset.homeMotion = calm || saveData ? 'static' : 'native';
    if (calm || saveData) return;
    let cancelled = false;
    let dispose = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/MotionPathPlugin')]).then(([{ gsap }, { ScrollTrigger }, { MotionPathPlugin }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      const arrival = root.querySelector<HTMLElement>('.rh-arrival');
      const mobile = small;
      let removeIntroListeners = () => {};
      const finalPath=root.querySelector<SVGPathElement>('.flight-trace-final [data-flight-path]');
      const processPath=root.querySelector<SVGPathElement>('.flight-trace-process [data-flight-path]');
      const processRoute=()=>{
        const bounds=processPath?.ownerSVGElement?.getBoundingClientRect();
        const nodes=[...root.querySelectorAll<HTMLElement>('.rh-process-node')];
        if(!bounds?.width||!bounds.height||nodes.length!==3)return processPath?.getAttribute('d')||'';
        const points=nodes.map(node=>{const b=node.getBoundingClientRect();return{x:(b.left+b.width/2-bounds.left)/bounds.width*1200,y:(b.top+b.height/2-bounds.top)/bounds.height*200};});
        const [a,b,c]=points;
        return `M${a.x} ${a.y} C${a.x+(b.x-a.x)/3} ${a.y-55} ${b.x-(b.x-a.x)/3} ${b.y+55} ${b.x} ${b.y} S${c.x-(c.x-b.x)/3} ${c.y-55} ${c.x} ${c.y}`;
      };
      const finalRoute=()=>{
        const svg=finalPath?.ownerSVGElement;const action=root.querySelector<HTMLElement>('.rh-final .rh-actions .journey-action-primary');
        if(!svg||!action)return finalPath?.getAttribute('d')||'';
        const bounds=svg.getBoundingClientRect();const button=action.getBoundingClientRect();
        const x=(button.left+button.width/2-bounds.left)/bounds.width*1440;
        const y=(button.bottom+16-bounds.top)/bounds.height*900;
        const rtl=getComputedStyle(root).direction==='rtl';const lane=rtl?340:1100;const approach=x+(rtl?-190:190);
        return `M${rtl?0:1440} 0 C${lane} 140 ${lane} ${y-40} ${approach} ${y-50} S${x} ${y+70} ${x} ${y}`;
      };
      const calibrateRoutes=()=>{if(finalPath)finalPath.setAttribute('d',finalRoute());if(processPath)processPath.setAttribute('d',processRoute());};
      // The route may stretch to a portrait section; the brand aircraft must not.
      const placePlane=(plane:Element,path:SVGPathElement,progress:number)=>{
        const svg=path.ownerSVGElement;if(!svg)return;
        const bounds=svg.getBoundingClientRect();const view=svg.viewBox.baseVal;
        if(!bounds.width||!bounds.height)return;
        const sx=bounds.width/view.width,sy=bounds.height/view.height,length=path.getTotalLength();
        const point=path.getPointAtLength(length*progress);
        const before=path.getPointAtLength(Math.max(0,length*progress-1));
        const after=path.getPointAtLength(Math.min(length,length*progress+1));
        const angle=Math.atan2((after.y-before.y)*sy,(after.x-before.x)*sx)+Math.PI/4;
        const cosine=Math.cos(angle),sine=Math.sin(angle);
        gsap.set(plane,{attr:{transform:`matrix(${cosine/sx} ${sine/sy} ${-sine/sx} ${cosine/sy} ${point.x} ${point.y})`},opacity:1});
      };
      const context = gsap.context(() => {
        if(finalPath)gsap.set(finalPath,{attr:{d:finalRoute()}});
        if(processPath)gsap.set(processPath,{attr:{d:processRoute()}});
        if (arrival && !entered.current) {
          entered.current = true;
          arrival.dataset.entry = 'play';
          const intro = gsap.timeline({ onComplete: () => { arrival.dataset.entry = 'done'; } });
          intro.fromTo('.rh-photo-settle', { scale: 1.08, yPercent: 2 }, { scale: 1, yPercent: 0, duration: 1.3, ease: 'power3.out' }, 0);
          intro.fromTo('.rh-title-ink', { yPercent: 105, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, clipPath: 'inset(0 0 -20% 0)', stagger: .1, duration: .65, ease: 'power3.out' }, .18);
          intro.fromTo('.rh-support-reveal,.rh-links-reveal,.rh-arrival-foot', { y: 12, opacity: .4 }, { y: 0, opacity: 1, stagger: .06, duration: .55 }, .65);
          const path = arrival.querySelector<SVGPathElement>('[data-flight-path]');
          const plane = arrival.querySelector<SVGGElement>('[data-flight-plane]');
          if (path) {
            intro.fromTo(path, { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: .65, ease: 'power2.inOut' }, .35);
            if (plane) {
              const position = { value: 0 };
              intro.to(position, { value: .76, duration: .65, ease: 'power2.inOut', onUpdate: () => {
                placePlane(plane,path,position.value);
              } }, .35);
            }
          }
          const finish = () => { intro.progress(1); };
          arrival.addEventListener('focusin', finish);
          window.addEventListener('wheel', finish, { passive: true, once: true });
          window.addEventListener('touchmove', finish, { passive: true, once: true });
          removeIntroListeners = () => { arrival.removeEventListener('focusin', finish); window.removeEventListener('wheel', finish); window.removeEventListener('touchmove', finish); };
          if (scrollY > 40) finish();
        }
        if (arrival) {
          gsap.to('.rh-arrival-photo', { scale: mobile ? .97 : .91, yPercent: 9, clipPath: mobile ? 'inset(0 3% 0 3%)' : 'inset(0 7% 0 7%)', ease: 'none', scrollTrigger: { trigger: arrival, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
          root.querySelectorAll('.rh-world-photo').forEach((photo, index) => gsap.fromTo(photo, { clipPath: index % 2 ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)', y: mobile ? 18 : 65 }, { clipPath: 'inset(0 0 0% 0%)', y: 0, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 96%', end: 'top 48%', scrub: true, invalidateOnRefresh: true } }));
        }
        root.querySelectorAll<SVGPathElement>('.flight-trace:not(.flight-trace-arrival) [data-flight-path]').forEach(path => {
          gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('section'), start: 'top 80%', end: 'bottom 65%', scrub: true } });
          const plane = path.parentElement?.querySelector('[data-flight-plane]');
          if (plane && !(mobile && path.closest('.flight-trace-process'))) {
            const position = { value: 0 };
            gsap.to(position, { value: 1, ease: 'none', scrollTrigger: { trigger: path.closest('section'), start: 'top 70%', end: 'bottom 65%', scrub: true }, onUpdate: () => {
              placePlane(plane,path,position.value);
            } });
          }
        });
        const mask = root.querySelector('[data-threshold-mask]');
        if (mask) {
          gsap.set('.v6-threshold-image', { clipPath: 'url(#v6-threshold-reveal)' });
          gsap.fromTo(mask, { attr: { d: mobile ? 'M0 0 L1 0 L1 .04 L1 .08 L1 .12 L1 .16 L0 .16 Z' : 'M0 0 L.06 0 L.18 .22 L.04 .48 L.16 .72 L.06 1 L0 1 Z' } }, { attr: { d: 'M0 0 L1 0 L1 .22 L1 .48 L1 .72 L1 1 L0 1 Z' }, ease:'none', scrollTrigger:{trigger:'.rh-threshold',start:'top 92%',end:'top 18%',scrub:true,invalidateOnRefresh:true} });
          gsap.fromTo('.v6-threshold-image .photo', { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 3, ease:'none',scrollTrigger:{trigger:'.rh-threshold',start:'top bottom',end:'bottom top',scrub:true} });
        }
        const responsive = gsap.matchMedia();
        responsive.add({ desktop:'(min-width: 768px)', mobile:'(max-width: 767px)' }, ({conditions}) => {
          const small = conditions?.mobile;
          root.querySelectorAll<HTMLElement>('.rh-signature').forEach((scene,index) => {
            const photo=scene.querySelector('.rh-signature-image');const copy=scene.querySelector('.rh-signature-copy');
            const timeline=gsap.timeline({scrollTrigger:{trigger:scene,start:'top 95%',end:'bottom 15%',scrub:true,invalidateOnRefresh:true}});
            timeline.fromTo(photo,{y:small?28:90,rotationX:small?0:8,rotationY:small?0:index%2?-6:6,rotation:small?0:index%2?1.5:-1.5,scale:small?1:.94,transformPerspective:1200},{y:0,rotationX:0,rotationY:0,rotation:0,scale:1,duration:.65,ease:'none'},0);
            timeline.to(photo,{y:small?-12:-40,rotationX:small?0:-4,scale:small?1:.98,duration:.35,ease:'none'},.65);
            timeline.fromTo(copy,{y:24},{y:-12,duration:1,ease:'none'},0);
          });
        });
        const frame=root.querySelector('.rh-film-frame');
        if(frame){const film=gsap.timeline({scrollTrigger:{trigger:'.rh-film',start:'top 80%',toggleActions:'play reverse play reverse'}});film.fromTo(frame,{clipPath:mobile?'inset(0 3% round 20px)':'inset(0 9% round 48px)',scale:.94},{clipPath:'inset(0 0% round 0px)',scale:1,duration:.85,ease:'power3.out'},0);film.fromTo('.rh-film h2',{y:25},{y:0,duration:.65},.1);}
        root.querySelectorAll<HTMLElement>('.v6-memory').forEach((photo,index) => {
          gsap.fromTo(photo,{rotation:mobile?0:(index-1)*9},{motionPath:{path:[{x:(index-1)*(mobile?6:60),y:mobile?20:60},{x:(index-1)*(mobile?2:22),y:-12},{x:0,y:0}],curviness:1.3},rotation:0,duration:.85,delay:index*.08,ease:'power3.out',scrollTrigger:{trigger:'.rh-story',start:'top 80%',toggleActions:'play reverse play reverse'}});
        });
        root.querySelectorAll<HTMLElement>('.rh-figure').forEach((figure,index)=>gsap.fromTo(figure,{y:35},{y:0,duration:.7,delay:index*.08,ease:'power3.out',scrollTrigger:{trigger:'.rh-numbers',start:'top 78%',toggleActions:'play reverse play reverse'}}));
        const process=root.querySelector<HTMLElement>('.v6-process-stage');
        if(process)gsap.fromTo(process,{'--route-progress':0},{'--route-progress':1,ease:'none',scrollTrigger:{trigger:'.rh-process',start:'top 75%',end:'bottom 65%',scrub:true}});
        const final=root.querySelector('.rh-final');
        if(final){gsap.fromTo('.rh-final>.photo',{clipPath:mobile?'inset(8% 5% 8% 5%)':'inset(15% 12% 15% 12%)',scale:.95},{clipPath:'inset(0% 0% 0% 0%)',scale:1,ease:'none',scrollTrigger:{trigger:final,start:'top 95%',end:'top 15%',scrub:true,invalidateOnRefresh:true}});gsap.fromTo('.rh-final h2',{y:40},{y:0,ease:'none',scrollTrigger:{trigger:final,start:'top 85%',end:'top 30%',scrub:true}});}
      }, root);
      // Recompute on layout/image changes without a continuous render loop.
      let frame = 0;
      let pendingRefresh=false;
      let width=root.clientWidth,height=root.clientHeight;
      const refreshWhenIdle=()=>{
        frame=0;
        if(!pendingRefresh||ScrollTrigger.isScrolling())return;
        pendingRefresh=false;ScrollTrigger.refresh();
      };
      const resize = new ResizeObserver(([entry]) => {
        const next=entry.contentRect;
        if(Math.abs(next.width-width)<.5&&Math.abs(next.height-height)<.5)return;
        width=next.width;height=next.height;pendingRefresh=true;
        cancelAnimationFrame(frame);frame=requestAnimationFrame(refreshWhenIdle);
      });
      resize.observe(root);
      ScrollTrigger.addEventListener('refreshInit',calibrateRoutes);
      ScrollTrigger.addEventListener('scrollEnd',refreshWhenIdle);
      dispose = () => { removeIntroListeners(); ScrollTrigger.removeEventListener('scrollEnd',refreshWhenIdle);ScrollTrigger.removeEventListener('refreshInit',calibrateRoutes);cancelAnimationFrame(frame); resize.disconnect(); context.revert(); };
    });
    return () => { cancelled = true; dispose(); };
  }, [calm,small]);
  return <span hidden ref={anchor} data-v6-motion-anchor/>;
}
