import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { Controls } from './components/ui/Controls';
import { useSurfaceControls } from './lib/stores/useSurfaceControls';
import './index.css';

function App() {
  const {
    mathFunction,
    amplitude,
    frequency,
    speed,
    complexity,
    setMathFunction,
    setAmplitude,
    setFrequency,
    setSpeed,
    setComplexity,
    reset
  } = useSurfaceControls();

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
      
      <Controls
        mathFunction={mathFunction}
        amplitude={amplitude}
        frequency={frequency}
        speed={speed}
        complexity={complexity}
        onMathFunctionChange={setMathFunction}
        onAmplitudeChange={setAmplitude}
        onFrequencyChange={setFrequency}
        onSpeedChange={setSpeed}
        onComplexityChange={setComplexity}
        onReset={reset}
      />
    </div>
  );
}

export default App;
