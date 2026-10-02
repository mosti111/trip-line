'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useTravel } from './SiteShell';
import { t } from '@/lib/i18n';

export function HeroVideo(){
 const {locale,calm}=useTravel();const ref=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);const [paused,setPaused]=useState(false);const [requested,setRequested]=useState(false);const [failed,setFailed]=useState(false);
 useEffect(()=>{const video=ref.current;if(!video)return;const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
  if((calm||connection?.saveData)&&!requested){video.pause();return;}
  if(paused){video.pause();return;}
  let visible=true;
  const sync=()=>{if(document.hidden||!visible||paused)video.pause();else{if(!video.getAttribute('src')){video.src='/media/istanbul-ferries.mp4';video.load();}void video.play().catch(()=>{/* Poster and manual play remain available. */});}};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting||false;sync();},{threshold:.05});observer.observe(video);document.addEventListener('visibilitychange',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);video.pause();};
 },[calm,paused,requested]);
 return <><video ref={ref} className={`hero-video ${playing||paused?'is-playing':''}`} muted loop playsInline preload="none" aria-hidden="true" onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setFailed(true);}}/><button className="video-toggle" onClick={()=>{if(playing){setPaused(true);ref.current?.pause();}else{setRequested(true);setPaused(false);if(failed){setFailed(false);ref.current?.load();}void ref.current?.play().catch(()=>{});}}}>{playing?<Pause size={14}/>:<Play size={14}/>}<span>{(playing?t('Pause film','أوقف الفيديو','Videoyu duraklat'):t('Play Istanbul film','شغّل فيديو إسطنبول','İstanbul videosunu oynat'))[locale]}</span></button></>;
}
