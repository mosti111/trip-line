'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { useTravel } from '../travel/SiteShell';
const Scene = dynamic(() => import('./BronzeJourneyScene'), { ssr: false });
function subscribe(callback: () => void) {
  const query = matchMedia('(min-width: 1024px) and (pointer: fine)'); query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function eligible() {
  return matchMedia('(min-width: 1024px) and (pointer: fine)').matches && !(navigator as Navigator & {connection?:{saveData?:boolean}}).connection?.saveData;
}
class SceneBoundary extends Component<{children: React.ReactNode}, {failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? null : this.props.children; }
}
export function BronzeJourney() {
  const {calm} = useTravel(); const enabled = useSyncExternalStore(subscribe,eligible,()=>false); const id=useId();
  const host = useRef<HTMLDivElement>(null); const [entered,setEntered] = useState(false);
  useEffect(()=>{
    if(!enabled||calm||entered||!host.current)return;
    const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){setEntered(true);observer.disconnect();}});
    observer.observe(host.current);return()=>observer.disconnect();
  },[enabled,calm,entered]);
  return <div ref={host} className="bronze-journey ribbon ribbon-sculpture" aria-hidden="true">
    <svg viewBox="0 0 1440 420" preserveAspectRatio="none"><defs><linearGradient id={id} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#f2d9b5"/><stop offset=".4" stopColor="#a07e63"/><stop offset=".7" stopColor="#e2bb91"/><stop offset="1" stopColor="#72513b"/></linearGradient></defs><path d="M-100 240 C220 460 330 390 600 180 S860 20 960 150 S1050 400 1510 160" fill="none" stroke={`url(#${id})`} strokeWidth="14"/></svg>
    {enabled&&!calm&&entered&&<SceneBoundary><Scene/></SceneBoundary>}
  </div>;
}
