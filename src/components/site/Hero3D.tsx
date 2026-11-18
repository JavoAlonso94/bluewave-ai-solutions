import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Core() {
  const ring = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  useFrame((s, d) => {
    const dt = Math.min(d, 0.05);
    if (ring.current) { ring.current.rotation.x += dt * 0.4; ring.current.rotation.y += dt * 0.25; }
    if (ring2.current) { ring2.current.rotation.y -= dt * 0.35; ring2.current.rotation.z += dt * 0.2; }
    s.camera.position.x += (s.pointer.x * 0.8 - s.camera.position.x) * 0.05;
    s.camera.position.y += (s.pointer.y * 0.5 - s.camera.position.y) * 0.05;
    s.camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
        <Sphere args={[1.15, 96, 96]}>
          <MeshDistortMaterial color="#2f6bff" distort={0.38} speed={2.2} roughness={0.15} metalness={0.6} />
        </Sphere>
      </Float>
      <Torus ref={ring} args={[1.9, 0.035, 16, 120]}>
        <meshStandardMaterial color="#7cc4ff" emissive="#3a8bff" emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
      </Torus>
      <Torus ref={ring2} args={[2.35, 0.02, 16, 120]} rotation={[1.2, 0, 0]}>
        <meshStandardMaterial color="#a9d8ff" emissive="#5aa9ff" emissiveIntensity={0.6} />
      </Torus>
      {[[-2.4, 1.3, -0.5], [2.5, -1.1, 0.3], [1.9, 1.7, -1]].map((p, i) => (
        <Float key={i} speed={3 + i} floatIntensity={2}>
          <Icosahedron args={[0.22 + i * 0.05, 0]} position={p as [number, number, number]}>
            <meshStandardMaterial color="#4ea1ff" metalness={0.7} roughness={0.25} flatShading />
          </Icosahedron>
        </Float>
      ))}
    </>
  );
}

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.4} />
      <pointLight position={[-4, -2, 2]} intensity={20} color="#6fc3ff" />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1.2} color="#8bc4ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Core />
    </Canvas>
  );
}
