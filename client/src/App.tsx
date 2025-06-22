import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { AdvancedControls } from './components/ui/AdvancedControls';
import { EquationDisplay } from './components/ui/EquationDisplay';
import { StatusBar } from './components/StatusBar';
import { useSurfaceControls } from './lib/stores/useSurfaceControls';
import './index.css';

function App() {
  const {
    mathFunction,
    amplitude,
    frequency,
    speed,
    complexity,
    colorMode,
    pointSize,
    resolution,
    mouseInfluence,
    animationMode,
    turbulence,
    damping,
    showTrails,
    showGrid,
    autoRotate,
    showEquations,
    setMathFunction,
    setAmplitude,
    setFrequency,
    setSpeed,
    setComplexity,
    setColorMode,
    setPointSize,
    setResolution,
    setMouseInfluence,
    setAnimationMode,
    setTurbulence,
    setDamping,
    setShowTrails,
    setShowGrid,
    setAutoRotate,
    reset,
    randomize,
    exportSettings
  } = useSurfaceControls();

  const handleExport = () => {
    const settings = exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surface-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      
      <AdvancedControls
        mathFunction={mathFunction}
        amplitude={amplitude}
        frequency={frequency}
        speed={speed}
        complexity={complexity}
        colorMode={colorMode}
        pointSize={pointSize}
        resolution={resolution}
        mouseInfluence={mouseInfluence}
        animationMode={animationMode}
        turbulence={turbulence}
        damping={damping}
        showTrails={showTrails}
        showGrid={showGrid}
        autoRotate={autoRotate}
        onMathFunctionChange={setMathFunction}
        onAmplitudeChange={setAmplitude}
        onFrequencyChange={setFrequency}
        onSpeedChange={setSpeed}
        onComplexityChange={setComplexity}
        onColorModeChange={setColorMode}
        onPointSizeChange={setPointSize}
        onResolutionChange={setResolution}
        onMouseInfluenceChange={setMouseInfluence}
        onAnimationModeChange={setAnimationMode}
        onTurbulenceChange={setTurbulence}
        onDampingChange={setDamping}
        onShowTrailsChange={setShowTrails}
        onShowGridChange={setShowGrid}
        onAutoRotateChange={setAutoRotate}
        onReset={reset}
        onRandomize={randomize}
        onExport={handleExport}
      />
      
      {showEquations && (
        <EquationDisplay
          mathFunction={mathFunction}
          amplitude={amplitude}
          frequency={frequency}
          speed={speed}
          complexity={complexity}
        />
      )}
      
      {/* <StatusBar /> */}
    </div>
  );
}

export default App;
