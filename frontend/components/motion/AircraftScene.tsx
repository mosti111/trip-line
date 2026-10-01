"use client";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, Shape, ShapeGeometry } from "three";
export default function AircraftScene() {
  const geometry = useMemo(() => { const s = new Shape(); const points = [[0, 1.7], [.16, 1.25], [.16, .35], [1.35, -.45], [1.35, -.65], [.16, -.2], [.13, -1], [.55, -1.4], [.55, -1.55], [0, -1.3], [-.55, -1.55], [-.55, -1.4], [-.13, -1], [-.16, -.2], [-1.35, -.65], [-1.35, -.45], [-.16, .35], [-.16, 1.25]]; points.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.closePath(); return new ShapeGeometry(s); }, []);
  return <Canvas dpr={[1, 1.5]} frameloop="demand" camera={{ position: [0, 0, 6], fov: 38 }} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.2}/><directionalLight position={[2, 4, 4]} intensity={3}/><Center><mesh geometry={geometry} rotation={[0.15, -.12, -.95]}><meshStandardMaterial color="#d7aa4d" metalness={0.65} roughness={0.3} side={DoubleSide}/></mesh></Center></Canvas>;
}
