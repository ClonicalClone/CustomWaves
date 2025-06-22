import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { EnhancedPointCloud } from './EnhancedPointCloud';
import { ParticleEffects } from './ParticleEffects';
import { FloatingElements } from './FloatingElements';
import { CinematicEffects } from './CinematicEffects';
import { GridOverlay } from './GridOverlay';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

function Scene() {
  const controlsRef = useRef();
  const { showGrid, autoRotate, mathFunction, speed, amplitude } = useSurfaceControls();

  useFrame((state, delta) => {
    if (autoRotate && controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.5;
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  });

  return (
    <>
      {/* Enhanced Atmospheric Lighting */}
      <ambientLight intensity={0.4} color="#f0f8ff" />
      <directionalLight 
        position={[15, 15, 10]} 
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[0, 20, 0]} 
        intensity={0.6}
        color="#4a90e2"
        distance={50}
        decay={2}
      />
      <pointLight 
        position={[-15, 8, -15]} 
        intensity={0.4}
        color="#e24a90"
        distance={40}
        decay={2}
      />
      <pointLight 
        position={[15, 5, 15]} 
        intensity={0.3}
        color="#90e24a"
        distance={35}
        decay={2}
      />
      
      {/* Camera Controls with smoother movement */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 + 0.6}
        minPolarAngle={0.2}
        dampingFactor={0.03}
        enableDamping={true}
        panSpeed={0.8}
        rotateSpeed={0.6}
        zoomSpeed={1.2}
      />
      
      {/* Reference Grid */}
      {showGrid && <GridOverlay size={25} divisions={25} opacity={0.2} color="#40a0ff" />}
      
      {/* Enhanced Point Cloud Surface */}
      <EnhancedPointCloud />
      
      {/* Ambient Particle Effects */}
      <ParticleEffects 
        count={200} 
        speed={speed * 0.5} 
        amplitude={amplitude} 
        color="#4a90e2"
      />
      
      {/* Dynamic Floating Elements */}
      <FloatingElements 
        count={8} 
        speed={speed} 
        mathFunction={mathFunction}
      />
      
      {/* Cinematic Effects */}
      <CinematicEffects 
        mathFunction={mathFunction}
        amplitude={amplitude}
        speed={speed}
      />
    </>
  );
}

export default Scene;
