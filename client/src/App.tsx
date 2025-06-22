import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import './index.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      <Canvas
        camera={{
          position: [0, 8, 12],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false
        }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
