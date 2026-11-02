'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as T from 'three';

const clamp = T.MathUtils.clamp;
function Sculpture() {
  const mesh = useRef<T.Mesh>(null);
  const graphicMaterial = useRef({ value: 0 });
  const state = useRef({ progress: 0, x: 0, y: 0, lost: false, visible: true, renders: 0 });
  const { gl, invalidate, camera, size } = useThree();
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
  const original = useMemo(() => new Float32Array(geometry.getAttribute('position').array), [geometry]);
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
    material.onBeforeCompile = shader => {
      shader.uniforms.graphicCollapse = graphicMaterial.current;
      shader.fragmentShader = 'uniform float graphicCollapse;\n' + shader.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.6588235, 0.4745098, 0.1764706), graphicCollapse);');
    };
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
    const flightProgress = Math.min(progress, .78);
    const travel = clamp((flightProgress-.28)/.62,0,1), blend = T.MathUtils.smoothstep(flightProgress,.28,.52);
    const parameter = .2 + travel * .58;
    const point = curve.getPointAt(parameter), tangent = curve.getTangentAt(parameter);
    const flight = point.clone().addScaledVector(tangent,-5.5).add(new T.Vector3(0,1.8,0));
    const destination = curve.getPointAt(Math.min(.99,parameter+.1)).add(new T.Vector3(0,.35,0));
    camera.position.lerpVectors(new T.Vector3(-3,4,28),flight,blend); camera.position.add(new T.Vector3(x,y,0).multiplyScalar(1 - T.MathUtils.smoothstep(progress,.78,.92)));
    const target = new T.Vector3().lerpVectors(new T.Vector3(-3,6,-4),destination,blend);
    camera.lookAt(target); mesh.current.rotation.set(0,0,0); mesh.current.scale.set(1,1,1);
    const material = mesh.current.material as T.MeshStandardMaterial;
    // Collapse the actual four-sided ribbon onto the handoff's camera-plane cubic.
    // The SVG below the pin uses these same screen coordinates and a two-pixel width.
    const flatten = T.MathUtils.smoothstep(progress, .72, .97);
    graphicMaterial.current.value = flatten;
    camera.updateMatrixWorld();
    const positions = geometry.getAttribute('position') as T.BufferAttribute;
    const plane = (u: number, v: number) => new T.Vector3(u * 2 - 1, 1 - v * 2, .5).unproject(camera);
    const cubic = (t: number) => { const q = 1 - t; return plane(q*q*q*.64 + 3*q*q*t*.84 + 3*q*t*t*.72 + t*t*t*.72, q*q*q*.5 + 3*q*q*t*.55 + 3*q*t*t*.8 + t*t*t); };
    const pixel = plane(1 / size.width, 0).distanceTo(plane(0, 0));
    for (let i = 0; i <= 320; i++) {
      const t = i / 320, point = cubic(t), tangent = cubic(Math.min(1,t+.001)).sub(cubic(Math.max(0,t-.001))).normalize();
      const across = new T.Vector3().crossVectors(tangent, camera.getWorldDirection(new T.Vector3())).normalize();
      for (let side = 0; side < 4; side++) {
        const index = i*4+side;
        const flat = point.clone().addScaledVector(across, (side===0||side===3?-1:1)*pixel);
        const from = new T.Vector3().fromArray(original,index*3);
        if (flatten > 0) {
          // Interpolate the projected silhouette so perspective cannot postpone the
          // visible collapse until the last scroll pixel. Retain depth while it flattens.
          const behind = from.clone().applyMatrix4(camera.matrixWorldInverse).z >= -.1;
          if (behind) from.set(6,-2,.5);
          else { from.project(camera); from.x = clamp(from.x,-6,6); from.y = clamp(from.y,-6,6); from.z = clamp(from.z,-.9,.9999); }
          from.lerp(flat.project(camera),flatten).unproject(camera);
        }
        positions.setXYZ(index,from.x,from.y,from.z);
      }
    }
    positions.needsUpdate = true; geometry.computeVertexNormals();
    material.roughness = .2 + flatten*.8; material.metalness = 1-flatten;
    material.color.set('#c89039').lerp(new T.Color('#a8792d'),flatten);
    material.emissive.set('#a8792d'); material.emissiveIntensity = flatten*.35;
    const host = gl.domElement.closest<HTMLElement>('.bronze-journey')!;
    host.dataset.cameraPosition = camera.position.toArray().map(value => value.toFixed(3)).join(',');
    host.dataset.cameraTarget = target.toArray().map(value => value.toFixed(3)).join(',');
    host.dataset.routeParameter = parameter.toFixed(4); host.dataset.renderCount = String(++state.current.renders); host.classList.add('ribbon-ready');
  });
  return <mesh ref={mesh} geometry={geometry} frustumCulled={false}><meshStandardMaterial color="#c89039" metalness={1} roughness={.2} envMapIntensity={1.6} side={T.DoubleSide}/></mesh>;
}
export default function BronzeJourneyScene() {
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{ position:[-3,4,28],fov:42,near:.1,far:100 }} gl={{ alpha:true,antialias:true,powerPreference:'low-power' }}><directionalLight position={[-3,4,7]} intensity={3} color="#fff0dc"/><Sculpture/></Canvas>;
}
