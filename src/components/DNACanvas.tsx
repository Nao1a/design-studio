import React, { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DNA_MODEL_PATH = '/dnaoptimized.glb';
const DRACO_PATH = '/draco/gltf/';

try {
  useGLTF.preload(DNA_MODEL_PATH, DRACO_PATH);
} catch {
  // Ignore preload errors
}

interface SymmetricalHelicesProps {
  leftX?: number;
  rightX?: number;
}

/**
 * Dual DNA helices with side-dependent opposite movement:
 * - Left helix: frames the left side, leans inward (+Z), moves in counter-balance
 * - Right helix: frames the right side, leans inward (-Z), opposite rotation & breathing
 * - Material brightness boosted with proper roughness & envMap so models are vivid, gleaming, and never dark
 */
function SymmetricalHelices({ leftX = -6.5, rightX = 6.5 }: SymmetricalHelicesProps) {
  const { scene } = useGLTF(DNA_MODEL_PATH, DRACO_PATH);

  // Clone scenes and enhance materials so they catch light and never look dark or flat
  const { leftScene, rightScene } = useMemo(() => {
    const l = scene.clone(true);
    const r = scene.clone(true);
    [l, r].forEach((s) => {
      s.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          if (mesh.material) {
            const orig = mesh.material as THREE.MeshStandardMaterial;
            const mat = orig.clone();
            mat.roughness = 0.22;
            mat.metalness = 0.5;
            mat.envMapIntensity = 1.6;
            mesh.material = mat;
          }
        }
      });
    });
    return { leftScene: l, rightScene: r };
  }, [scene]);

  const leftGroupRef = useRef<THREE.Group>(null);
  const rightGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = 0.42;

    // Side-dependent movement
    // 1. Inward/outward breathing relative to each side
    const breathe = Math.sin(t * 0.9) * 0.18;
    // 2. Counter-phase vertical float (left rises while right descends)
    const floatLeftY = Math.sin(t * 1.1) * 0.22;
    const floatRightY = -Math.sin(t * 1.1) * 0.22;
    // 3. Side-dependent inward lean (framing the content)
    const leanLeftZ = 0.12 + Math.cos(t * 0.7) * 0.04;
    const leanRightZ = -0.12 - Math.cos(t * 0.7) * 0.04;
    // 4. Opposing pitch / roll
    const swayLeftX = Math.sin(t * 0.8) * 0.05;
    const swayRightX = -Math.sin(t * 0.8) * 0.05;
    // 5. Opposing rotations
    const rotLeftY = t * speed;
    const rotRightY = -t * speed + Math.PI;

    // Apply to left helix (anchored on left side)
    if (leftGroupRef.current) {
      leftGroupRef.current.position.x = leftX - breathe;
      leftGroupRef.current.position.y = floatLeftY;
      leftGroupRef.current.rotation.x = swayLeftX;
      leftGroupRef.current.rotation.y = rotLeftY;
      leftGroupRef.current.rotation.z = leanLeftZ;
    }

    // Apply to right helix (anchored on right side — opposite movement)
    if (rightGroupRef.current) {
      rightGroupRef.current.position.x = rightX + breathe;
      rightGroupRef.current.position.y = floatRightY;
      rightGroupRef.current.rotation.x = swayRightX;
      rightGroupRef.current.rotation.y = rotRightY;
      rightGroupRef.current.rotation.z = leanRightZ;
    }
  });

  return (
    <>
      <group ref={leftGroupRef} position={[leftX, 0, 0]}>
        <primitive object={leftScene} />
      </group>
      <group ref={rightGroupRef} position={[rightX, 0, 0]}>
        <primitive object={rightScene} />
      </group>
    </>
  );
}

/** Procedural fallback helix with opposite-side motion */
function SymmetricalHelixFallback({ leftX = -6.5, rightX = 6.5 }: SymmetricalHelicesProps) {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const floatLeftY = Math.sin(t * 1.1) * 0.22;
    const floatRightY = -Math.sin(t * 1.1) * 0.22;

    if (leftRef.current) {
      leftRef.current.position.y = floatLeftY;
      leftRef.current.rotation.y = t * 0.42;
      leftRef.current.rotation.z = 0.12;
    }
    if (rightRef.current) {
      rightRef.current.position.y = floatRightY;
      rightRef.current.rotation.y = -t * 0.42 + Math.PI;
      rightRef.current.rotation.z = -0.12;
    }
  });

  const spheres = useMemo(() => {
    const items: { pos: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 4;
      const y = (i / 28) * 3 - 1.5;
      items.push({
        pos: [Math.cos(t) * 0.5, y, Math.sin(t) * 0.5],
        color: i % 2 === 0 ? '#36bfed' : '#026aa2',
      });
      items.push({
        pos: [Math.cos(t + Math.PI) * 0.5, y, Math.sin(t + Math.PI) * 0.5],
        color: i % 2 === 0 ? '#026aa2' : '#36bfed',
      });
    }
    return items;
  }, []);

  return (
    <>
      <group ref={leftRef} position={[leftX, 0, 0]}>
        {spheres.map((s, i) => (
          <mesh key={i} position={s.pos}>
            <sphereGeometry args={[0.06, 14, 14]} />
            <meshStandardMaterial color={s.color} metalness={0.4} roughness={0.2} />
          </mesh>
        ))}
      </group>
      <group ref={rightRef} position={[rightX, 0, 0]}>
        {spheres.map((s, i) => (
          <mesh key={i} position={s.pos}>
            <sphereGeometry args={[0.06, 14, 14]} />
            <meshStandardMaterial color={s.color} metalness={0.4} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </>
  );
}

class DNAErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export interface DNADualCanvasProps {
  className?: string;
  active?: boolean;
}

/**
 * Single optimized canvas rendering both DNA helices side-by-side with
 * opposite-side symmetry, razor-sharp DPR (no blur), and rich bright lighting.
 */
export const DNADualCanvas: React.FC<DNADualCanvasProps> = ({
  className = '',
  active = true,
}) => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      if (!c.getContext('webgl') && !c.getContext('experimental-webgl')) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Razor-sharp DPR: supports full high-DPI retina display to prevent blurriness
  const dpr = useMemo<[number, number]>(() => [1.5, 2], []);

  if (!webGLSupported) return null;

  return (
    <div className={`w-full h-full select-none pointer-events-none ${className}`}>
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 18], fov: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Bright, radiant studio lighting with clinical blue bounce */}
          <ambientLight intensity={1.4} />
          <hemisphereLight color="#ffffff" groundColor="#026aa2" intensity={1.3} />
          <directionalLight position={[6, 12, 8]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-6, 6, 4]} intensity={1.3} color="#7cd4fd" />
          <pointLight position={[0, 0, 10]} intensity={0.7} color="#ffffff" />

          {/* Cached studio environment for radiant metallic reflections */}
          <Environment preset="studio" />

          {/* Opposite-side Symmetrical Dual Helices */}
          <DNAErrorBoundary fallback={<SymmetricalHelixFallback />}>
            <Suspense fallback={null}>
              <SymmetricalHelices leftX={-6.5} rightX={6.5} />
            </Suspense>
          </DNAErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
};
