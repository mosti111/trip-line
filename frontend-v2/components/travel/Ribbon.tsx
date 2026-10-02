'use client';

import { useEffect, useRef } from 'react';
import { useTravel } from './SiteShell';

/** Decorative bronze path. Event-driven rendering; SVG remains the no-WebGL fallback. */
export function Ribbon({sculptural=false}:{sculptural?:boolean}) {
 const host=useRef<HTMLDivElement>(null); const {calm}=useTravel();
 useEffect(()=>{
  const el=host.current;
  if(!el||!sculptural||calm) return;
  let cancelled=false; let teardown=()=>{};
  const observer=new IntersectionObserver(entries=>{
   if(!entries[0]?.isIntersecting)return; observer.disconnect();
   void import('three').then(T=>{
    if(cancelled)return;
    let renderer:InstanceType<typeof T.WebGLRenderer>;
    try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.domElement.setAttribute('aria-hidden','true');el.append(renderer.domElement);
    const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,20);
    const room=new T.Scene();room.background=new T.Color('#181a19');const cards:InstanceType<typeof T.Mesh>[]=[];
    for(const [x,y,z,w,h,r,g,b] of [[-4,3,8,16,5,4,3.3,2.6],[6,0,3,3,9,1.3,1.6,1.7],[0,-4,2,10,2,1.6,1.1,.6]]){
      const mat=new T.MeshBasicMaterial({color:new T.Color().setRGB(r,g,b),side:T.DoubleSide,toneMapped:false});const m=new T.Mesh(new T.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.lookAt(0,0,0);room.add(m);cards.push(m);
    }
    const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(room,.02);scene.environment=env.texture;
    const curve=new T.CatmullRomCurve3([new T.Vector3(-15,1.3,0),new T.Vector3(-8,-1.2,1),new T.Vector3(-3,-1.4,0),new T.Vector3(4,1.7,-1),new T.Vector3(10,.1,1),new T.Vector3(15,-.5,0)]);
    const positions:number[]=[];const indices:number[]=[];const steps=180;
    for(let i=0;i<=steps;i++){const t=i/steps,p=curve.getPointAt(t),tangent=curve.getTangentAt(t);const width=new T.Vector3(0,Math.cos(t*3-.9),Math.sin(t*3-.9)).normalize();const normal=new T.Vector3().crossVectors(tangent,width).normalize();for(const [w,d] of [[-1,-1],[1,-1],[1,1],[-1,1]]){const v=p.clone().addScaledVector(width,w*.24).addScaledVector(normal,d*.025);positions.push(v.x,v.y,v.z);}if(i<steps)for(let side=0;side<4;side++){const a=i*4+side,b=i*4+(side+1)%4;indices.push(a,b,a+4,b,b+4,a+4);}}
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const material=new T.MeshStandardMaterial({color:'#d1aa80',metalness:1,roughness:.25,envMap:env.texture,envMapIntensity:1.5,side:T.DoubleSide});const mesh=new T.Mesh(geometry,material);scene.add(mesh);const key=new T.DirectionalLight('#fff0da',4);key.position.set(-2,4,7);scene.add(key);
    let frame=0;
    const render=()=>{frame=0;if(document.hidden)return;const box=el.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;const progress=Math.max(-1,Math.min(1,box.top/innerHeight));mesh.rotation.x=progress*.32-.12;mesh.rotation.y=progress*.13;camera.position.y=progress*.65;renderer.render(scene,camera);el.classList.add('ribbon-ready');};
    const queue=()=>{if(!frame)frame=requestAnimationFrame(render);};
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z= Math.max(12,17/camera.aspect);camera.updateProjectionMatrix();queue();};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(el);window.addEventListener('scroll',queue,{passive:true});document.addEventListener('visibilitychange',queue);
    const lost=(event:Event)=>{event.preventDefault();el.classList.remove('ribbon-ready');};renderer.domElement.addEventListener('webglcontextlost',lost);
    resize();
    teardown=()=>{cancelAnimationFrame(frame);resizeObserver.disconnect();window.removeEventListener('scroll',queue);document.removeEventListener('visibilitychange',queue);geometry.dispose();material.dispose();env.dispose();pmrem.dispose();cards.forEach(c=>{c.geometry.dispose();(c.material as InstanceType<typeof T.MeshBasicMaterial>).dispose();});renderer.dispose();renderer.domElement.remove();el.classList.remove('ribbon-ready');};
   }).catch(()=>{/* Keep the source-independent static ribbon. */});
  });observer.observe(el);
  return ()=>{cancelled=true;observer.disconnect();teardown();};
 },[calm,sculptural]);
 return <div ref={host} className={`ribbon ${sculptural?'ribbon-sculpture':''}`} aria-hidden="true"><svg viewBox="0 0 1440 220" preserveAspectRatio="none"><defs><linearGradient id={sculptural?'bronze-hero':'bronze-line'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#efd3ac"/><stop offset=".4" stopColor="#bc936e"/><stop offset="1" stopColor="#775338"/></linearGradient></defs><path d="M-40 75 C240 220 430 205 660 119 S960 -35 1160 86 S1360 195 1490 100" stroke={`url(#${sculptural?'bronze-hero':'bronze-line'})`} strokeWidth={sculptural?'15':'3'} fill="none"/></svg></div>;
}
