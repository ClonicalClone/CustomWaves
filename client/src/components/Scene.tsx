import React from 'react';
import { OrbitControls } from '@react-three/drei';
import PointCloudSurface from './PointCloudSurface';

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight 
        position={[0, 10, 0]} 
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* Camera Controls */}
      <OrbitControls
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
      
      {/* Main Point Cloud Surface */}
      <PointCloudSurface />
    </>
  );
}

export default Scene;
