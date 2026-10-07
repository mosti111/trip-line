'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as T from 'three';

const clamp = T.MathUtils.clamp;
function Sculpture() {
  const mesh = useRef<T.Mesh>(null);
  const state = useRef({ progress: 0, x: 0, y: 0, lost: false, visible: true, renders: 0 });
  const { gl, invalidate, camera } = useThree();
  const curve = useMemo(() => new T.CatmullRomCurve3([
    new T.Vector3(-15,-5,2), new T.Vector3(-8,-4,1), new T.Vector3(0,-3,0),
    new T.Vector3(6,-1,-3), new T.Vector3(7,3,-8), new T.Vector3(1,4,-15),
    new T.Vector3(-4,0,-23), new T.Vector3(2,-3,-33), new T.Vector3(4,1,-46),
  ], false, 'catmullrom', .5), []);
  const geometry = useMemo(() => {
    const vertices: number[] = [], indices: number[] = [], steps = 320;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, point = curve.getPointAt(t), tangent = curve.getTangentAt(t);
      const across = new T.Vector3().crossVectors(tangent, new T.Vector3(0,1,.2)).normalize();
      across.applyAxisAngle(tangent, Math.sin(t * Math.PI * 3) * .7);
      const normal = new T.Vector3().crossVectors(tangent, across).normalize();
      for (const [width, depth] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
        const vertex = point.clone().addScaledVector(across, width * .24).addScaledVector(normal, depth * .045);
        vertices.push(vertex.x, vertex.y, vertex.z);
      }
      if (i < steps) for (let side = 0; side < 4; side++) { const a = i*4+side, b=i*4+(side+1)%4; indices.push(a,b,a+4,b,b+4,a+4); }
    }
    const result = new T.BufferGeometry(); result.setAttribute('position',new T.Float32BufferAttribute(vertices,3)); result.setIndex(indices); result.computeVertexNormals(); return result;
  }, [curve]);
  useEffect(() => {
    const host = gl.domElement.closest<HTMLElement>('.bronze-journey')!;
    const room = new T.Scene(); room.background = new T.Color('#172d2c');
    const cards: T.Mesh<T.PlaneGeometry,T.MeshBasicMaterial>[] = [];
    for (const [x,y,z,width,height,power] of [[-4,5,4,14,3,5],[7,0,2,3,12,3],[0,-5,1,14,2,2],[-6,1,-5,4,9,2]]) {
      const card = new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({ color: new T.Color(power,power*.86,power*.62), side:T.DoubleSide }));
      card.position.set(x,y,z); card.lookAt(0,0,0); room.add(card); cards.push(card);
    }
    let generator = new T.PMREMGenerator(gl), environment = generator.fromScene(room,.02);
    const material = mesh.current!.material as T.MeshStandardMaterial;
    material.envMap = environment.texture; material.needsUpdate = true;
    host.dataset.contextState = 'ready';
    state.current.progress = Number(host.closest('.rh-arrival')?.getAttribute('data-motion-progress') ?? 0);
    const refresh = () => { if (state.current.visible && !document.hidden && !state.current.lost) invalidate(); };
    const progress = (event: Event) => { state.current.progress = clamp((event as CustomEvent<number>).detail,0,1); refresh(); };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !state.current.visible || document.hidden) return;
      const bounds = host.getBoundingClientRect(); if (event.clientY < bounds.top || event.clientY > bounds.bottom) return;
      state.current.x = (event.clientX / innerWidth - .5) * .18; state.current.y = (event.clientY / innerHeight - .5) * .1; refresh();
    };
    const lost = (event: Event) => { event.preventDefault(); state.current.lost = true; host.dataset.contextState = 'lost'; host.classList.remove('ribbon-ready'); };
    let restoreFrame = 0;
    const restored = () => {
      restoreFrame = requestAnimationFrame(() => {
        environment.dispose(); generator.dispose(); generator = new T.PMREMGenerator(gl); environment = generator.fromScene(room,.02);
        material.envMap = environment.texture; material.needsUpdate = true;
        state.current.lost = false; host.dataset.contextState = 'restored'; refresh();
      });
    };
    const observer = new IntersectionObserver(entries => { state.current.visible = entries[0]?.isIntersecting ?? false; host.dataset.sceneVisible = String(state.current.visible); refresh(); }); observer.observe(host);
    window.addEventListener('bronze-progress', progress); window.addEventListener('pointermove', pointer, { passive: true }); document.addEventListener('visibilitychange', refresh);
    gl.domElement.addEventListener('webglcontextlost', lost); gl.domElement.addEventListener('webglcontextrestored', restored); refresh();
    return () => {
      observer.disconnect(); cancelAnimationFrame(restoreFrame); window.removeEventListener('bronze-progress', progress); window.removeEventListener('pointermove', pointer); document.removeEventListener('visibilitychange', refresh);
      gl.domElement.removeEventListener('webglcontextlost', lost); gl.domElement.removeEventListener('webglcontextrestored', restored); host.classList.remove('ribbon-ready');
      environment.dispose(); generator.dispose(); cards.forEach(card => { card.geometry.dispose(); card.material.dispose(); });
    };
  }, [gl,invalidate]);
  useFrame(() => {
    if (!mesh.current || state.current.lost || document.hidden || !state.current.visible) return;
    const { progress,x,y } = state.current;
    // A stationary route in world space. The viewer moves along its actual centerline.
    const travel = clamp((progress-.28)/.62,0,1), blend = T.MathUtils.smoothstep(progress,.28,.52);
    const parameter = .2 + travel * .58;
    const point = curve.getPointAt(parameter), tangent = curve.getTangentAt(parameter);
    const flight = point.clone().addScaledVector(tangent,-5.5).add(new T.Vector3(0,1.8,0));
    const destination = curve.getPointAt(Math.min(.99,parameter+.1)).add(new T.Vector3(0,.35,0));
    camera.position.lerpVectors(new T.Vector3(-3,4,28),flight,blend); camera.position.add(new T.Vector3(x,y,0));
    const target = new T.Vector3().lerpVectors(new T.Vector3(-3,6,-4),destination,blend);
    camera.lookAt(target); mesh.current.rotation.set(0,0,0); mesh.current.scale.set(1,1,1);
    const material = mesh.current.material as T.MeshStandardMaterial;
    material.roughness = .2 + clamp((progress-.85)/.15,0,1)*.25;
    const host = gl.domElement.closest<HTMLElement>('.bronze-journey')!;
    host.dataset.cameraPosition = camera.position.toArray().map(value => value.toFixed(3)).join(',');
    host.dataset.cameraTarget = target.toArray().map(value => value.toFixed(3)).join(',');
    host.dataset.routeParameter = parameter.toFixed(4); host.dataset.renderCount = String(++state.current.renders); host.classList.add('ribbon-ready');
  });
  return <mesh ref={mesh} geometry={geometry}><meshStandardMaterial color="#c89039" metalness={1} roughness={.2} envMapIntensity={1.6} side={T.DoubleSide}/></mesh>;
}
export default function BronzeJourneyScene() {
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{ position:[-3,4,28],fov:42,near:.1,far:100 }} gl={{ alpha:true,antialias:true,powerPreference:'low-power' }}><directionalLight position={[-3,4,7]} intensity={3} color="#fff0dc"/><Sculpture/></Canvas>;
}
