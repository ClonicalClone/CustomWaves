import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import PointCloudSurface from './PointCloudSurface';
import { GridOverlay } from './GridOverlay';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

function Scene() {
  const controlsRef = useRef();
  const { showGrid, autoRotate } = useSurfaceControls();

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
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.6}
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[0, 15, 0]} 
        intensity={0.4}
        color="#4a90e2"
      />
      <pointLight 
        position={[-10, 5, -10]} 
        intensity={0.2}
        color="#e24a90"
      />
      
      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2 + 0.5}
        minPolarAngle={0.1}
        dampingFactor={0.05}
        enableDamping={true}
      />
      
      {/* Reference Grid */}
      {showGrid && <GridOverlay size={20} divisions={20} opacity={0.15} />}
      
      {/* Main Point Cloud Surface */}
      <PointCloudSurface />
    </>
  );
}

export default Scene;
