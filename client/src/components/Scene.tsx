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
      controlsRef.current.autoRotateSpeed = 0.3;
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  });

  return (
    <>
      {/* Minimalist Lighting - Pale and Educational */}
      <ambientLight intensity={0.6} color="#f8f9fa" />
      <directionalLight 
        position={[20, 20, 10]} 
        intensity={0.7}
        color="#ffffff"
      />
      <directionalLight 
        position={[-10, 15, -5]} 
        intensity={0.3}
        color="#e8eaed"
      />
      
      {/* Refined Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2 + 0.4}
        minPolarAngle={0.3}
        dampingFactor={0.02}
        enableDamping={true}
        panSpeed={0.5}
        rotateSpeed={0.4}
        zoomSpeed={0.8}
      />
      
      {/* Subtle Reference Grid */}
      {showGrid && <GridOverlay size={20} divisions={20} opacity={0.08} color="#d0d0d0" />}
      
      {/* Main Mathematical Surface */}
      <PointCloudSurface />
    </>
  );
}

export default Scene;
