import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

function Particles({ count = 1500 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX - window.innerWidth / 2;
      mouse.current.y = e.clientY - window.innerHeight / 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // random position in a sphere
      const r = 8 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.set([x, y, z], i * 3);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.05;
    points.current.rotation.x += delta * 0.02;
    // subtle parallax
    points.current.position.x = THREE.MathUtils.lerp(
      points.current.position.x,
      mouse.current.x * 0.002,
      0.05
    );
    points.current.position.y = THREE.MathUtils.lerp(
      points.current.position.y,
      -mouse.current.y * 0.002,
      0.05
    );
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3ab7ff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function Knot() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.15;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -2]}>
      <torusKnotGeometry args={[1.3, 0.35, 200, 32]} />
      <meshPhongMaterial color="#0073EC" emissive="#003a75" wireframe opacity={0.5} transparent />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#0a0e1a", 6, 14]} />
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <group>
          <Particles count={1600} />
          <Knot />
        </group>
      </Canvas>
    </div>
  );
}
