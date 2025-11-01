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

function Link({ a, b, radius = 0.12, color = "#2aa9ff" }: { a: THREE.Vector3; b: THREE.Vector3; radius?: number; color?: string }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const dir = useMemo(() => b.clone().sub(a), [a, b]);
  const len = useMemo(() => dir.length(), [dir]);
  const mid = useMemo(() => a.clone().add(b).multiplyScalar(0.5), [a, b]);
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return q;
  }, [dir]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    // Pulsation de l'emissive intensity
    const material = mesh.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2;
  });

  return (
    <mesh ref={mesh} position={mid.toArray()} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, len, 20]} />
      <meshStandardMaterial color={color} emissive="#0073EC" emissiveIntensity={0.4} metalness={0.3} roughness={0.2} />
    </mesh>
  );
}

function Node({ position, size = 0.45, color = "#3ab7ff", index = 0 }: { position: THREE.Vector3; size?: number; color?: string; index?: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    if (!mesh.current || !light.current) return;
    const t = state.clock.elapsedTime;
    // Pulsation douce avec un léger décalage par nœud
    const pulse = 1 + Math.sin(t * 1.5 + index * 0.3) * 0.15;
    mesh.current.scale.setScalar(pulse);
    // Variation de l'intensité de la lumière
    light.current.intensity = 1.5 + Math.sin(t * 1.5 + index * 0.3) * 0.5;
  });

  return (
    <group position={position.toArray()}>
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8}
          metalness={0.6} 
          roughness={0.2} 
        />
      </mesh>
      <pointLight ref={light} color={color} intensity={2} distance={3} decay={2} />
    </group>
  );
}

function KafkaLogo3D() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.2;
  });

  // Positions approximant le logo Kafka
  const c = new THREE.Vector3(0, 0, 0);
  const t = new THREE.Vector3(0, 1.8, 0);
  const b = new THREE.Vector3(0, -1.8, 0);
  const rt = new THREE.Vector3(1.6, 0.9, 0);
  const rb = new THREE.Vector3(1.6, -0.9, 0);

  const nodes = [c, t, b, rt, rb];

  const links: Array<[THREE.Vector3, THREE.Vector3]> = [
    [c, t],
    [c, b],
    [c, rt],
    [c, rb],
  ];

  return (
    <group ref={group} position={[0, 0, -1]}>
      {nodes.map((p, i) => (
        <Node key={i} position={p} size={i === 0 ? 0.6 : 0.45} index={i} />
      ))}
      {links.map(([a, b], i) => (
        <Link key={`l-${i}`} a={a} b={b} />
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10" style={{ pointerEvents: 'none' }}>
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#0a0e1a"]} />
        <fog attach="fog" args={["#0a0e1a", 6, 14]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <Particles count={1200} />
        <Knot />
        <KafkaLogo3D />
      </Canvas>
    </div>
  );
}
