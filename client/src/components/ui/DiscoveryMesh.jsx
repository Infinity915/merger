import { useMemo, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Sphere, MeshDistortMaterial, Stars, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

function ConnectionLine({ start, end }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color="#06b6d4" transparent opacity={0.2} linewidth={1} />
    </line>
  );
}

function StudentNode({ position, name, score }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group position={position}>
        <Sphere args={[0.2, 32, 32]}>
          <MeshDistortMaterial color="#06b6d4" speed={3} distort={0.4} emissive="#06b6d4" emissiveIntensity={0.5} />
        </Sphere>
        <Text position={[0, 0.4, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
          {`${name}\n${score}%`}
        </Text>
      </group>
    </Float>
  );
}

export default function DiscoveryMesh({ suggestions = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglError, setWebglError] = useState(false);

  // Use MOCK DATA if suggestions are empty so you can see it working immediately
  const displayData = suggestions.length > 0 ? suggestions : [
    { user: { id: '1', fullName: 'Deepak Sharma' }, score: 92, pos: [3, 2, -2] },
    { user: { id: '2', fullName: 'Ananya Gupta' }, score: 85, pos: [-3, -1, -3] },
    { user: { id: '3', fullName: 'Rahul Verma' }, score: 74, pos: [2, -3, 2] }
  ];

  // Handle WebGL context lost/restored
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event) => {
      console.warn('WebGL context lost');
      event.preventDefault();
      setWebglError(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setWebglError(false);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    // Dispose of Three.js resources when component unmounts
    const canvas = canvasRef.current;
    return () => {
      if (canvas) {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context');
          if (loseContext) loseContext.loseContext();
        }
      }
    };
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-[600px] bg-[#050505] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold mb-4">WebGL Context Lost</p>
          <p className="text-sm text-slate-400 mb-4">The graphics context was lost. Refreshing may help.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-[#050505] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
      <Canvas ref={canvasRef} camera={{ position: [0, 0, 10], fov: 50 }} onCreated={(state) => {
        // Enable proper error handling for the renderer
        state.gl.debug.checkShaderErrors = true;
      }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
        
        {/* Background Visuals to prove it's working */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, -5, 0]} />

        {/* Central 'YOU' Node */}
        <group>
          <Sphere args={[0.4, 64, 64]}>
            <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2} />
          </Sphere>
          <Text position={[0, 0.7, 0]} fontSize={0.3} color="#ec4899" fontWeight="bold">YOU</Text>
        </group>

        {/* Dynamic Nodes and Connections */}
        {displayData.map((peer, i) => (
          <group key={peer.user.id || i}>
            <StudentNode 
              position={peer.pos || [Math.sin(i) * 5, Math.cos(i) * 3, -2]} 
              name={peer.user.fullName} 
              score={peer.score} 
            />
            <ConnectionLine start={[0, 0, 0]} end={peer.pos || [Math.sin(i) * 5, Math.cos(i) * 3, -2]} />
          </group>
        ))}

        <OrbitControls enableZoom={true} enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>
    </div>
  );
}
