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
      const creative = root.classList.contains('v61-home');
      const preload=creative?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.querySelectorAll('img').forEach(image=>{image.loading='eager';});preload?.unobserve(entry.target);}},{rootMargin:'1000px'}):null;
      if(preload)root.querySelectorAll('.rh-world-plane,.rh-signature').forEach(scene=>preload.observe(scene));
      const mobile = small;
      let removeIntroListeners = () => {};
      const finalPath=root.querySelector<SVGPathElement>('.flight-trace-final [data-flight-path]');
      const processPath=root.querySelector<SVGPathElement>('.flight-trace-process [data-flight-path]');
      const arrivalPath=root.querySelector<SVGPathElement>('.flight-trace-arrival [data-flight-path]');
      const arrivalPlane=root.querySelector<SVGGElement>('.flight-trace-arrival [data-flight-plane]');
      const arrivalPosition={value:entered.current ? .76 : 0,departure:0};
      const openingRoutes=()=>{
        if(!creative||!arrivalPath?.ownerSVGElement)return;
        const receiving=root.querySelector<SVGPathElement>('.flight-trace-service-worlds [data-flight-path]');
        const junction=root.querySelector<HTMLElement>('.v61-world-junction');
        const branches=root.querySelector<SVGSVGElement>('.v61-world-branches');
        if(!receiving?.ownerSVGElement||!junction||!branches)return;
        const a=arrivalPath.ownerSVGElement.getBoundingClientRect(),b=receiving.ownerSVGElement.getBoundingClientRect(),j=junction.getBoundingClientRect(),bounds=branches.getBoundingClientRect();
        // Activity/route transitions can temporarily hide a retained scene.
        // Keep its valid route until visible geometry can be measured again.
        if(![a.width,a.height,b.width,b.height,bounds.width,bounds.height].every(size=>Number.isFinite(size)&&size>0))return;
        const raw=MotionPathPlugin.getRawPath(arrivalPath.getAttribute('d')||'');
        const tip=MotionPathPlugin.getPositionOnPath(raw,1);
        const x=(a.left+tip.x/1440*a.width-b.left)/b.width*1440;
        const y=(a.top+tip.y/900*a.height-b.top)/b.height*1200;
        const jx=(j.left+j.width/2-b.left)/b.width*1440,jy=(j.top+j.height/2-b.top)/b.height*1200;
        receiving.setAttribute('d',`M${x} ${y} C${x} ${y+130} ${jx+120} ${jy-100} ${jx} ${jy}`);
        const start={x:(j.left+j.width/2-bounds.left)/bounds.width*1440,y:(j.top+j.height/2-bounds.top)/bounds.height*1200};
        branches.querySelectorAll<SVGPathElement>('[data-world-branch]').forEach((path,index)=>{
          const photo=root.querySelectorAll<HTMLElement>('.rh-world-photo')[index].getBoundingClientRect();
          if(!photo.width||!photo.height)return;
          const end={x:(photo.left+photo.width*.5-bounds.left)/bounds.width*1440,y:(photo.top+photo.height*.4-bounds.top)/bounds.height*1200};
          path.setAttribute('d',`M${start.x} ${start.y} Q${(start.x+end.x)/2} ${start.y-80} ${end.x} ${end.y}`);
        });
      };
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
        if(!bounds.width||!bounds.height)return finalPath?.getAttribute('d')||'';
        const x=(button.left+button.width/2-bounds.left)/bounds.width*1440;
        const y=(button.bottom+16-bounds.top)/bounds.height*900;
        const rtl=getComputedStyle(root).direction==='rtl';const lane=rtl?340:1100;const approach=x+(rtl?-190:190);
        return `M${rtl?0:1440} 0 C${lane} 140 ${lane} ${y-40} ${approach} ${y-50} S${x} ${y+70} ${x} ${y}`;
      };
      type RawRoute = ReturnType<typeof MotionPathPlugin.getRawPath>;
      const measuredRoutes=new WeakMap<SVGPathElement,{sx:number;sy:number;shape:string;raw:RawRoute}>();
      const measureRoute=(path:SVGPathElement)=>{
        const svg=path.ownerSVGElement;if(!svg)return;
        const bounds=svg.getBoundingClientRect(),view=svg.viewBox.baseVal;
        if(!bounds.width||!bounds.height)return;
        const shape=path.getAttribute('d')||'';
        const previous=measuredRoutes.get(path);
        const raw=previous?.shape===shape?previous.raw:MotionPathPlugin.getRawPath(shape);
        if(previous?.raw!==raw)MotionPathPlugin.cacheRawPathMeasurements(raw,24);
        measuredRoutes.set(path,{sx:bounds.width/view.width,sy:bounds.height/view.height,shape,raw});
      };
      const calibrateRoutes=()=>{
        openingRoutes();
        if(finalPath)finalPath.setAttribute('d',finalRoute());
        if(processPath)processPath.setAttribute('d',processRoute());
        root.querySelectorAll<SVGPathElement>('.flight-trace [data-flight-path]').forEach(path=>{if(path.parentElement?.querySelector('[data-flight-plane]'))measureRoute(path);});
      };
      // The route may stretch to a portrait section; the brand aircraft must not.
      const placePlane=(plane:Element,path:SVGPathElement,progress:number)=>{
        const route=measuredRoutes.get(path);if(!route)return;
        const {sx,sy,raw}=route;
        const cursor=Math.max(0,Math.min(1,progress));
        const point=MotionPathPlugin.getPositionOnPath(raw,cursor);
        const before=MotionPathPlugin.getPositionOnPath(raw,Math.max(0,cursor-.001));
        const after=MotionPathPlugin.getPositionOnPath(raw,Math.min(1,cursor+.001));
        const angle=Math.atan2((after.y-before.y)*sy,(after.x-before.x)*sx)+Math.PI/4;
        const cosine=Math.cos(angle),sine=Math.sin(angle);
        gsap.set(plane,{attr:{transform:`matrix(${cosine/sx} ${sine/sy} ${-sine/sx} ${cosine/sy} ${point.x} ${point.y})`},opacity:1});
      };
      const drawArrival=()=>{if(arrivalPath&&arrivalPlane)placePlane(arrivalPlane,arrivalPath,arrivalPosition.departure>0 ? .76+arrivalPosition.departure*.24 : arrivalPosition.value);};
      const context = gsap.context(() => {
        calibrateRoutes();
        if(finalPath)gsap.set(finalPath,{attr:{d:finalRoute()}});
        if(processPath)gsap.set(processPath,{attr:{d:processRoute()}});
        if(entered.current)drawArrival();
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
              intro.to(arrivalPosition, { value: .76, duration: .65, ease: 'power2.inOut', onUpdate: drawArrival }, .35);
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
          gsap.to('.rh-arrival-photo', { scale: mobile ? .96 : .92, yPercent: creative?5:9, clipPath: mobile ? 'inset(0 3% 0 3%)' : 'inset(0 5% 0 5%)', ease: 'none', scrollTrigger: { trigger: arrival, start: 'top top', end: creative?()=>`+=${innerHeight*.65}`:'bottom top', scrub: true, invalidateOnRefresh: true } });
          if(creative){
            gsap.to('.rh-arrival-copy',{y:mobile?-25:-55,ease:'none',scrollTrigger:{trigger:arrival,start:'top top',end:()=>`+=${innerHeight*.65}`,scrub:true,invalidateOnRefresh:true}});
            gsap.to(arrivalPosition,{departure:1,ease:'none',scrollTrigger:{trigger:arrival,start:'top top',end:()=>`+=${innerHeight*.65}`,scrub:true,invalidateOnRefresh:true},onUpdate:drawArrival});
            root.querySelectorAll('.v61-world-branches path').forEach(path=>gsap.fromTo(path,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.rh-world-stage',start:'top 85%',end:'top 25%',scrub:true}}));
          }
          root.querySelectorAll('.rh-world-photo').forEach((photo, index) => gsap.fromTo(photo, { clipPath: index % 2 ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)', y: mobile ? 18 : 65 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, ease: 'none', scrollTrigger: { trigger: photo, start: 'top 96%', end: 'top 48%', scrub: true, invalidateOnRefresh: true } }));
        }
        root.querySelectorAll<SVGPathElement>('.flight-trace:not(.flight-trace-arrival) [data-flight-path]').forEach(path => {
          gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('.rh-signature')||path.closest('section'), start: 'top 80%', end: 'bottom 65%', scrub: true } });
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
          gsap.fromTo(mask, { attr: { d: mobile ? 'M0 0 L1 0 L1 .14 L1 .28 L1 .42 L1 .56 L0 .56 Z' : 'M0 0 L.06 0 L.18 .22 L.04 .48 L.16 .72 L.06 1 L0 1 Z' } }, { attr: { d: 'M0 0 L1 0 L1 .22 L1 .48 L1 .72 L1 1 L0 1 Z' }, ease:'none', scrollTrigger:{trigger:'.rh-threshold',start:'top 92%',end:'top 18%',scrub:true,invalidateOnRefresh:true} });
          gsap.fromTo('.v6-threshold-image .photo', { scale: mobile ? 1.04 : 1.12, yPercent: mobile ? -1 : -4 }, { scale: 1, yPercent: mobile ? 1 : 3, ease:'none',scrollTrigger:{trigger:'.rh-threshold',start:'top bottom',end:'bottom top',scrub:true} });
        }
        const responsive = gsap.matchMedia();
        responsive.add({ desktop:'(min-width: 768px)', mobile:'(max-width: 767px)' }, ({conditions}) => {
          const small = conditions?.mobile;
          root.querySelectorAll<HTMLElement>('.rh-signature').forEach((scene,index) => {
            const photo=scene.querySelector('.rh-signature-image');const copy=scene.querySelector('.rh-signature-copy');
            if(creative){
              const frame=scene.querySelector('.v61-landscape-frame');
              const start=small?'inset(12% 0% 0% 0%)':index===0?'inset(48% 0% 0% 0%)':index===1?'inset(0% 0% 65% 0%)':'inset(0% 65% 0% 0%)';
              gsap.fromTo(frame,{clipPath:start,scale:small?1:.97,rotationX:small?0:index===0?3:0,rotationY:small?0:index===1?-2:0,transformPerspective:1400},{clipPath:'inset(0% 0% 0% 0%)',scale:1,rotationX:0,rotationY:0,ease:'none',scrollTrigger:{trigger:scene,start:'top 85%',end:'top 20%',scrub:true,invalidateOnRefresh:true}});
              gsap.fromTo(photo,{yPercent:index===1?-3:2},{yPercent:index===1?3:-2,ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:true}});
              gsap.fromTo(copy,{y:small?18:38},{y:0,ease:'none',scrollTrigger:{trigger:scene,start:'top 75%',end:'top 20%',scrub:true}});
              return;
            }
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
        if(final){gsap.fromTo('.rh-final>.photo',{clipPath:mobile?'inset(6% 0% 6% 0%)':creative?'inset(22% 18% 22% 18%)':'inset(15% 12% 15% 12%)',scale:creative?.98:.95},{clipPath:'inset(0% 0% 0% 0%)',scale:1,ease:'none',scrollTrigger:{trigger:final,start:'top 95%',end:'top 15%',scrub:true,invalidateOnRefresh:true}});gsap.fromTo('.rh-final h2',{y:mobile?20:creative?60:40},{y:0,ease:'none',scrollTrigger:{trigger:final,start:'top 85%',end:'top 30%',scrub:true}});}
      }, root);
      // Recompute on layout/image changes without a continuous render loop.
      let frame = 0;
      let refreshTimer = 0;
      let pendingRefresh=false;
      let width=root.clientWidth,height=root.clientHeight;
      const refreshWhenIdle=()=>{
        frame=0;
        clearTimeout(refreshTimer);
        // scrollEnd can fire inside a wheel update; never refresh in that stack.
        if(!pendingRefresh)return;
        refreshTimer=window.setTimeout(()=>{
          if(!pendingRefresh||ScrollTrigger.isScrolling())return;
          pendingRefresh=false;ScrollTrigger.refresh();
        },160);
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
      dispose = () => { removeIntroListeners();preload?.disconnect(); ScrollTrigger.removeEventListener('scrollEnd',refreshWhenIdle);ScrollTrigger.removeEventListener('refreshInit',calibrateRoutes);cancelAnimationFrame(frame);clearTimeout(refreshTimer); resize.disconnect(); context.revert(); };
    });
    return () => { cancelled = true; dispose(); };
  }, [calm,small]);
  return <span hidden ref={anchor} data-v6-motion-anchor/>;
}
