'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as T from 'three';

function Sculpture() {
  const mesh = useRef<T.Mesh>(null);
  const state = useRef({progress:0,x:0,y:0,lost:false});
  const {gl, invalidate, camera} = useThree();
  const geometry = useMemo(() => {
    const curve=new T.CatmullRomCurve3([new T.Vector3(-14,-1,1),new T.Vector3(-7,-2,2),new T.Vector3(-2,0,0),new T.Vector3(3,2,-3),new T.Vector3(6,0,0),new T.Vector3(12,-1,3)]);
    const vertices:number[]=[],indices:number[]=[]; const steps=220;
    for(let i=0;i<=steps;i++) {
      const t=i/steps,p=curve.getPointAt(t),tangent=curve.getTangentAt(t);
      const width=new T.Vector3(0,Math.cos(t*5-1),Math.sin(t*5-1)).normalize();
      const normal=new T.Vector3().crossVectors(tangent,width).normalize();
      for(const [w,d] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {const v=p.clone().addScaledVector(width,w*.22).addScaledVector(normal,d*.035);vertices.push(v.x,v.y,v.z);}
      if(i<steps)for(let j=0;j<4;j++){const a=i*4+j,b=i*4+(j+1)%4;indices.push(a,b,a+4,b,b+4,a+4);}
    }
    const result=new T.BufferGeometry(); result.setAttribute('position',new T.Float32BufferAttribute(vertices,3));result.setIndex(indices);result.computeVertexNormals();return result;
  },[]);
  useEffect(()=>{
    const room=new T.Scene(); room.background=new T.Color('#222a29');
    const cards:T.Mesh<T.PlaneGeometry,T.MeshBasicMaterial>[]=[];
    for(const [x,y,z,w,h,power] of [[-4,4,7,14,4,4],[5,1,4,3,9,2],[0,-4,4,12,2,1.5]]) {
      const card=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(power,power*.84,power*.66),side:T.DoubleSide}));card.position.set(x,y,z);card.lookAt(0,0,0);room.add(card);cards.push(card);
    }
    const generator=new T.PMREMGenerator(gl);let env=generator.fromScene(room,.03);
    const material=mesh.current?.material as T.MeshStandardMaterial;
    material.envMap=env.texture;material.needsUpdate=true;
    const host=gl.domElement.closest('.bronze-journey');
    let visible=true;
    const refresh=()=>{if(visible&&!document.hidden&&!state.current.lost)invalidate();};
    const progress=(event:Event)=>{state.current.progress=(event as CustomEvent<number>).detail;refresh();};
    const pointer=(event:PointerEvent)=>{if(event.pointerType!=='mouse'||!matchMedia('(pointer: fine)').matches)return;state.current.x=(event.clientX/innerWidth-.5)*.035;state.current.y=(event.clientY/innerHeight-.5)*.025;refresh();};
    const lost=(event:Event)=>{event.preventDefault();state.current.lost=true;host?.classList.remove('ribbon-ready');};
    const restored=()=>{
      // Render-target pixels are lost with the context; rebuild the reflection cards.
      const previous=env;env=generator.fromScene(room,.03);material.envMap=env.texture;material.needsUpdate=true;previous.dispose();
      state.current.lost=false;refresh();
    };
    const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;refresh();}); if(host)observer.observe(host);
    window.addEventListener('bronze-progress',progress);window.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('visibilitychange',refresh);gl.domElement.addEventListener('webglcontextlost',lost);gl.domElement.addEventListener('webglcontextrestored',restored);
    invalidate();
    return()=>{observer.disconnect();window.removeEventListener('bronze-progress',progress);window.removeEventListener('pointermove',pointer);document.removeEventListener('visibilitychange',refresh);gl.domElement.removeEventListener('webglcontextlost',lost);gl.domElement.removeEventListener('webglcontextrestored',restored);host?.classList.remove('ribbon-ready');env.dispose();generator.dispose();cards.forEach(c=>{c.geometry.dispose();c.material.dispose();});};
  },[gl,invalidate]);
  useFrame(()=>{
    if(!mesh.current||state.current.lost)return;
    const {progress,x,y}=state.current;
    mesh.current.rotation.set(-.14+progress*.48+y,progress*-.28+x,progress*.08);
    mesh.current.scale.setScalar(1+progress*.22);
    camera.position.set(progress*1.8,progress*.7,17-progress*3);camera.lookAt(0,0,0);
    gl.domElement.closest('.bronze-journey')?.classList.add('ribbon-ready');
  });
  return <mesh ref={mesh} geometry={geometry}><meshStandardMaterial color="#c89c70" metalness={1} roughness={.24} envMapIntensity={1.4} side={T.DoubleSide}/></mesh>;
}
export default function BronzeJourneyScene() {
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[0,0,17],fov:38}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}><directionalLight position={[-3,4,7]} intensity={3} color="#fff0dc"/><Sculpture/></Canvas>;
}
