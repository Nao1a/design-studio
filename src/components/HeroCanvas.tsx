import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Center, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DRACO_PATH = '/draco/gltf/';
const MODEL_PATH = '/out.glb';

try {
  useGLTF.preload(MODEL_PATH, DRACO_PATH);
} catch {
  // Ignore preload errors if any
}

/** Procedural fallback in case model file has issues */
function ProceduralFallback() {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.7, 1.4, 32, 64]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} envMapIntensity={1.2} />
      </mesh>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.82, 1.2, 32, 1, true]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} wireframe />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusGeometry args={[0.76, 0.08, 24, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <torusGeometry args={[0.76, 0.08, 24, 64]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function GLTFModel() {
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  return <primitive object={scene} castShadow receiveShadow />;
}

class ModelErrorBoundary extends React.Component<
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

function ModelContent() {
  return (
    <ModelErrorBoundary fallback={<ProceduralFallback />}>
      <Suspense fallback={null}>
        <GLTFModel />
      </Suspense>
    </ModelErrorBoundary>
  );
}

export const HeroCanvas: React.FC = () => {
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

  const dprRange = useMemo<[number, number]>(() => [1, 1.5], []);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing select-none relative">
      <Canvas
        dpr={dprRange}
        camera={{ position: [0, 0, 3.6], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#fed7aa" />
          <directionalLight position={[0, -3, 3]} intensity={0.25} color="#e2e8f0" />
          <Environment preset="studio" />

          {/* Model */}
          <group position={[0, 0, 0]} scale={0.95}>
            <Center>
              <ModelContent />
            </Center>
          </group>

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={6.5}
            blur={2.4}
            far={4}
            color="#334155"
          />

          {/* OrbitControls enables the user to rotate the model with inertia, gentle idle movement on its axis, no zoom/pan hijack */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.06}
            rotateSpeed={1.85}
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
            autoRotate={true}
            autoRotateSpeed={1.65}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
