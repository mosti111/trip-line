'use client';
import { useEffect } from 'react';

/** Controller only: it enhances the existing server DOM and never wraps/remounts content. */
export function ScrollScene({ mode }: { mode: 'desktop' | 'native' }) {
  useEffect(() => {
    let cancelled = false, dispose = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      const root = document.querySelector<HTMLElement>('.recovery-home');
      if (cancelled || !root) return;
      gsap.registerPlugin(ScrollTrigger);
      root.dataset.homeMotion = mode;
      const cleanup: (() => void)[] = [];
      const context = gsap.context(() => {
        const arrival = root.querySelector<HTMLElement>('.rh-arrival')!;
        const pathDraw = (selector: string, trigger: Element, start = 'top 80%', end = 'bottom 30%') => {
          root.querySelectorAll<SVGPathElement>(selector).forEach(path => {
            const length = path.getTotalLength();
            gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length * .9 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger, start, end, scrub: mode === 'desktop' ? .35 : true } });
          });
        };
        if (mode === 'desktop') {
          arrival.classList.add('rh-arrival-pinned');
          const range = () => innerHeight * (innerHeight >= 900 ? 1.05 : innerHeight >= 700 ? .95 : .85);
          const progress = (value: number) => {
            arrival.dataset.motionProgress = value.toFixed(4);
            arrival.dataset.motionStage = value < .2 ? 'arrive' : value < .45 ? 'depart' : value < .7 ? 'travel' : 'transform';
            window.dispatchEvent(new CustomEvent('bronze-progress', { detail: value }));
          };
          const timeline = gsap.timeline({ onUpdate: function() { progress(this.progress()); }, scrollTrigger: { trigger: arrival, start: 'top top', end: () => `+=${range()}`, pin: true, scrub: .35, anticipatePin: 1,
            onRefresh: self => { arrival.dataset.pinStart = String(self.start); arrival.dataset.pinEnd = String(self.end); } } });
          timeline.to({}, { duration: 1 })
            .to('.rh-arrival-copy > .rh-kicker', { y: -22, opacity: .25, duration: .28, ease: 'none' }, .16)
            .to('.rh-arrival-copy > p,.rh-arrival-copy > .rh-actions,.rh-small-links', { y: -75, opacity: 0, duration: .23, ease: 'none' }, .22)
            .to('.rh-title-block:first-child', { y: -48, opacity: 0, duration: .3, ease: 'none' }, .32)
            .to('.rh-title-block:last-child', { y: -48, opacity: 0, duration: .3, ease: 'none' }, .35)
            .to('.rh-arrival-photo', { scale: .97, duration: .22, ease: 'none' }, .2)
            .to('.rh-arrival-photo', { scale: .91, yPercent: -5, opacity: .32, duration: .32, ease: 'none' }, .42)
            .to('.rh-arrival-shade', { opacity: .35, duration: .3, ease: 'none' }, .4)
            .to('.rh-arrival-foot', { y: 50, opacity: 0, duration: .2, ease: 'none' }, .25)
            .fromTo('.rh-departure', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .18, ease: 'none' }, .72);
          root.querySelectorAll<HTMLElement>('.rh-flight-coordinates bdi').forEach((coordinate, index) => {
            timeline.fromTo(coordinate, { opacity: 0, scale: .4, x: index % 2 ? 260 : -220, y: -60 }, { opacity: .9, scale: 1, x: 0, y: 0, duration: .12, ease: 'none' }, .38 + index * .1)
              .to(coordinate, { opacity: 0, scale: 2.8, x: index % 2 ? -450 : 520, y: 90, duration: .18, ease: 'none' }, .5 + index * .1);
          });
          // SVG takes the same sweeping departure if WebGL is unavailable or lost.
          timeline.to('.rh-sculpture', { xPercent: -42, yPercent: -18, scale: 2.4, rotation: -24, duration: .48, ease: 'none' }, .25)
            .to('.rh-sculpture', { opacity: .4, duration: .2, ease: 'none' }, .8);
          const focus = () => { const trigger = timeline.scrollTrigger; if (trigger && trigger.progress > .16) { window.dispatchEvent(new CustomEvent('bronze-focus-arrival')); window.scrollTo({ top: trigger.start, behavior: 'instant' }); gsap.set('.rh-arrival-copy', { visibility: 'visible' }); } };
          arrival.querySelector('.rh-arrival-copy')?.addEventListener('focusin', focus);
          cleanup.push(() => { arrival.querySelector('.rh-arrival-copy')?.removeEventListener('focusin', focus); arrival.classList.remove('rh-arrival-pinned'); ['motionProgress','motionStage','pinStart','pinEnd'].forEach(key => delete arrival.dataset[key]); window.dispatchEvent(new CustomEvent('bronze-progress', { detail: 0 })); });
          progress(0);
        } else {
          gsap.to('.rh-sculpture', { xPercent: -14, yPercent: -12, rotation: -8, ease: 'none', scrollTrigger: { trigger: arrival, start: 'top top', end: 'bottom top', scrub: true } });
        }
        const worlds = root.querySelector<HTMLElement>('.rh-worlds')!;
        const spatial = mode === 'desktop';
        [0,1,2].forEach(index => {
          const plane = root.querySelector(`.rh-world-${index}`)!;
          gsap.fromTo(plane, { y: spatial ? [110,55,85][index] : 24, rotationY: spatial ? [-9,5,-6][index] : 0, z: spatial ? [-70,-130,-40][index] : 0 }, { y: spatial ? [-70,-20,-45][index] : -12, rotationY: spatial ? [5,-2,3][index] : 0, z: spatial ? [80,-20,40][index] : 0, ease: 'none', scrollTrigger: { trigger: plane, start: 'top bottom', end: 'bottom 15%', scrub: spatial ? .4 : true } });
        });
        const threshold = root.querySelector<HTMLElement>('.rh-threshold')!;
        if (spatial) {
          // One measured centerline crosses both section boundaries. It is never mirrored.
          const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
          const line = document.createElementNS(svg.namespaceURI,'path');
          svg.classList.add('rh-continuous-route'); svg.setAttribute('aria-hidden','true');
          line.setAttribute('fill','none'); line.setAttribute('stroke','#a8792d'); line.setAttribute('stroke-width','2');
          svg.append(line); root.append(svg);
          const layout = () => {
            const origin = root.getBoundingClientRect().top + scrollY;
            const end = threshold.getBoundingClientRect().top + scrollY - origin;
            const h = arrival.offsetHeight, w = root.clientWidth;
            const pinEnd = Number(arrival.dataset.pinEnd ?? 0);
            const a = pinEnd - origin;
            const b = worlds.getBoundingClientRect().top + scrollY - origin;
            const height = end + threshold.offsetHeight;
            svg.setAttribute('viewBox',`0 0 ${w} ${height}`); svg.style.height = `${height}px`;
            line.setAttribute('d',`M${w*.64} ${a+h*.5} C${w*.84} ${a+h*.55} ${w*.72} ${a+h*.8} ${w*.72} ${a+h} C${w*.72} ${b+220} ${w*.88} ${b+360} ${w*.8} ${b+650} S${w*.2} ${end-250} ${w*.3} ${end} C${w*.4} ${end+250} ${w*.88} ${end+300} ${w*.73} ${end+500} S${w*.12} ${end+650} ${w*.23} ${height}`);
          };
          const update = () => {
            const p = Number(arrival.dataset.motionProgress ?? 0);
            // Geometric substitution at the fully collapsed endpoint; no opacity mask.
            svg.style.visibility = p >= .999 ? 'visible' : 'hidden';
            worlds.dataset.handoffState = p >= .999 ? 'graphic' : p >= .78 ? 'flattening' : 'metallic';
          };
          const observer = new MutationObserver(update); observer.observe(arrival,{attributes:true,attributeFilter:['data-motion-progress']});
          ScrollTrigger.addEventListener('refresh',layout); layout(); update();
          cleanup.push(() => { observer.disconnect(); ScrollTrigger.removeEventListener('refresh',layout); svg.remove(); delete worlds.dataset.handoffState; });
        } else {
          pathDraw('.rh-threshold-route path', threshold, 'top bottom', 'center 35%');
          pathDraw('.rh-world-route path', worlds);
        }
        gsap.fromTo('.rh-threshold h2', { y: spatial ? 60 : 20 }, { y: spatial ? -35 : -10, ease: 'none', scrollTrigger: { trigger: threshold, start: 'top bottom', end: 'bottom top', scrub: .4 } });
        if (spatial) gsap.fromTo('.rh-threshold > .photo img', { scale: 1.12, y: -25 }, { scale: 1, y: 25, ease: 'none', scrollTrigger: { trigger: threshold, start: 'top bottom', end: 'bottom top', scrub: .4 } });
        const explorer = root.querySelector('.rt-explorer')!;
        let previous = -1;
        const stops = ['istanbul','cappadocia','antalya','rize-ayder','bodrum'];
        if (spatial) ScrollTrigger.create({ trigger: explorer, start: 'top 65%', end: 'bottom 35%', onUpdate: self => { const index = Math.min(4, Math.floor(self.progress * 5)); if (index !== previous) { previous = index; window.dispatchEvent(new CustomEvent('bronze-place', { detail: stops[index] })); } } });
        const map = root.querySelector<HTMLElement>('.rt-desktop-map');
        if (map) {
          const canvas = map.querySelector<HTMLElement>('.rt-map-canvas');
          const initialStyle = canvas?.getAttribute('style') ?? null;
          const focusMap = () => context.add(() => {
            const active = map.querySelector<SVGGElement>('.rt-map-pin[aria-pressed=true],[data-active=true]');
            if (!active) return;
            const bounds = active.getBoundingClientRect(), container = map.getBoundingClientRect();
            gsap.to(map.querySelector('.rt-map-canvas'), { scale: 1.025, x: Math.max(-20, Math.min(20, (container.x + container.width / 2 - bounds.x) * .04)), y: Math.max(-12, Math.min(12, (container.y + container.height / 2 - bounds.y) * .04)), duration: .5, overwrite: true, ease: 'power2.out' });
          });
          const observer = new MutationObserver(focusMap); observer.observe(map, { subtree: true, attributes: true, attributeFilter: ['aria-pressed','data-active'] }); cleanup.push(() => { observer.disconnect(); if (canvas) { gsap.killTweensOf(canvas); if (initialStyle === null) canvas.removeAttribute('style'); else canvas.setAttribute('style', initialStyle); } });
        }
        root.querySelectorAll('.rh-signature-image').forEach((image, index) => {
          gsap.fromTo(image.querySelector('img'), { scale: 1.08, yPercent: spatial ? -5 : -2 }, { scale: 1.02, yPercent: spatial ? 5 : 2, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: .4 } });
          if (spatial) gsap.fromTo(image, { clipPath: `inset(0 ${index % 2 ? 0 : 8}% 0 ${index % 2 ? 8 : 0}%)` }, { clipPath: 'inset(0 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: image, start: 'top 85%', end: 'top 25%', scrub: .4 } });
        });
        const film = root.querySelector('.rh-film-frame')!;
        gsap.fromTo(film, { scale: spatial ? .84 : .96, borderRadius: '4px' }, { scale: spatial ? 1.14 : 1, borderRadius: 0, ease: 'none', scrollTrigger: { trigger: film, start: 'top 90%', end: 'center 42%', scrub: .4 } });
        // Story intentionally rests. Proof/process receive only their route progression.
        pathDraw('.rh-figure-route path', root.querySelector('.rh-numbers')!);
        root.querySelectorAll('.rh-process-node').forEach(node => gsap.fromTo(node, { borderColor: '#a8792d', backgroundColor: '#f8efe0' }, { backgroundColor: '#c89039', duration: .5, scrollTrigger: { trigger: node, start: 'top 75%', once: true } }));
        const services = root.querySelector('.rh-services')!;
        if (spatial) root.querySelectorAll('.rh-service-group').forEach((group, index) => gsap.fromTo(group, { x: (index - 1) * 36, y: 65 }, { x: (1 - index) * 18, y: -25, ease: 'none', scrollTrigger: { trigger: services, start: 'top 85%', end: 'bottom 35%', scrub: .4 } }));
        const builder = root.querySelector('.rh-builder-route');
        if (builder) {
          const styles = new Map<HTMLElement, string | null>();
          const observer = new MutationObserver(() => context.add(() => { const latest = builder.querySelector<HTMLElement>('li:last-child'); if (latest) { if (!styles.has(latest)) styles.set(latest, latest.getAttribute('style')); gsap.fromTo(latest, { backgroundColor: '#c8903928' }, { backgroundColor: 'transparent', duration: .65, overwrite: true }); } }));
          observer.observe(builder, { childList: true, subtree: true });
          cleanup.push(() => { observer.disconnect(); styles.forEach((style, node) => { gsap.killTweensOf(node); if (style === null) node.removeAttribute('style'); else node.setAttribute('style', style); }); });
        }
        const final = root.querySelector('.rh-final')!;
        pathDraw('.rh-final-route path', final, 'top 85%', 'center 45%');
        gsap.fromTo('.rh-final-route circle', { scale: .35, transformOrigin: 'center', opacity: .25 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: final, start: 'top 50%', end: 'center 45%', scrub: .3 } });
      }, root);
      let refreshFrame = 0, refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const refresh = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => { refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh()); }, 100); };
      // Bounded fonts/load/viewport refresh, never a root ResizeObserver feedback loop.
      void document.fonts.ready.then(() => { if (!cancelled) refresh(); });
      root.addEventListener('load', refresh, true); window.addEventListener('resize', refresh);
      dispose = () => { clearTimeout(refreshTimer); cancelAnimationFrame(refreshFrame); root.removeEventListener('load', refresh, true); window.removeEventListener('resize', refresh); context.revert(); cleanup.forEach(fn => fn()); delete root.dataset.homeMotion; };
    });
    return () => { cancelled = true; dispose(); };
  }, [mode]);
  return null;
}
