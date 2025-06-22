import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { AdvancedControls } from './components/ui/AdvancedControls';
import { EditableEquation } from './components/ui/EditableEquation';
import { useSurfaceControls } from './lib/stores/useSurfaceControls';
import './index.css';

// Equation definitions
const equations: Record<string, { title: string; equation: string; category: string; concept: string }> = {
  sin: {
    title: "Harmonic Sine Wave",
    equation: "y = A·sin(fx + st) + A·sin(fz + st·φ)·φ⁻¹ + A·sin((x+z)f/2 + st/2)·φ⁻²",
    category: "Harmonic Analysis",
    concept: "Demonstrates superposition principle and harmonic series in wave theory"
  },
  cos: {
    title: "Modulated Cosine", 
    equation: "y = A·cos(fx + st) + A·cos(fz + st·√2/2)·√2/2 + A·cos(xzf/10 + st)·0.3",
    category: "Wave Modulation",
    concept: "Explores amplitude modulation and spatial frequency coupling"
  },
  tan: {
    title: "Arctangent Field",
    equation: "y = A·[atan(sin(x/T + st))·0.8 + atan(sin(z/T + st·0.75))·0.6 + atan(sin(xz/T² + st/2))·0.4]",
    category: "Nonlinear Dynamics",
    concept: "Demonstrates bounded periodic behavior and spatial coupling"
  },
  electric: {
    title: "Electromagnetic Field",
    equation: "y = A·[sin(√2fx + 2st)·e⁻⁰·⁰⁵|x| + cos(√3fz + 1.5st)·e⁻⁰·⁰⁵|z| + sin(rf - 3st)·e⁻⁰·⁰⁵r/2]",
    category: "Electromagnetism",
    concept: "Models wave propagation with realistic attenuation in conducting media"
  },
  ripples: {
    title: "Hydrodynamic Waves",
    equation: "y = A·[sin(rf - st√5)·e⁻⁰·⁰⁸r + sin(rφf - φst)·e⁻⁰·¹²r·φ⁻¹ + cos(rf/2 - st)·e⁻⁰·¹⁵r·0.3]",
    category: "Fluid Dynamics",
    concept: "Simulates surface tension effects and wave attenuation in fluids"
  },
  spiral: {
    title: "Fibonacci Spiral",
    equation: "y = A·[sin(0.618rf + 5.236θ + st)·e⁻⁰·⁰³r + cos(φθ + 0.618st)·0.382]",
    category: "Mathematical Biology",
    concept: "Demonstrates natural spiral patterns found in shells and galaxies"
  },
  interference: {
    title: "Double-Slit Interference",
    equation: "y = A·cos(k·Δd/2)·e⁻⁰·⁰⁴min(d₁,d₂)·sin(k(d₁+d₂)/2 - 2st)",
    category: "Quantum Optics",
    concept: "Models wave-particle duality and constructive/destructive interference"
  },
  laplace: {
    title: "Laplace Equation",
    equation: "y = A·[r·cos(fθ + st)·e⁻⁰·¹r + r·sin(2fθ + 0.7st)·e⁻⁰·⁰⁸r·0.5]",
    category: "Partial Differential Equations",
    concept: "Models steady-state heat distribution and gravitational potential fields"
  },
  fourier: {
    title: "Fourier Series",
    equation: "y = A·Σₙ₌₁⁵[sin(nfx + st)/n + sin(nfz + 1.2st)/n] + A·cos(xzf/10 + st/2)·0.3",
    category: "Harmonic Analysis",
    concept: "Represents periodic functions as sum of sinusoidal components"
  },
  bessel: {
    title: "Bessel Functions",
    equation: "y = A·[J₀(fr - st)·e⁻⁰·¹|fr-st| + J₁(fr - st)·(fr-st)·e⁻⁰·¹|fr-st|·0.5 + sin(3θ + 0.8st)·0.2]",
    category: "Special Functions",
    concept: "Models vibrations in circular membranes and electromagnetic waves in cylinders"
  },
  legendre: {
    title: "Legendre Polynomials",
    equation: "y = A·[P₂(x̂)·sin(ft) + P₂(ẑ)·sin(ft) + P₃(x̂)·cos(0.7ft)·0.6]",
    category: "Orthogonal Polynomials",
    concept: "Used in spherical harmonics and quantum mechanical angular momentum"
  },
  waves: {
    title: "Superposition Field",
    equation: "y = A·[sin(fx + st)·0.4 + sin(fz + √2st)·0.3 + sin((x+z)f√2/2 + √3st/2)·0.25 + sin(rf - 2st)·0.35 + modulation]",
    category: "Wave Mechanics",
    concept: "Demonstrates principle of superposition in multi-dimensional wave systems"
  }
};

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
        <EditableEquation
          equation={equations[mathFunction]?.equation || ""}
          title={equations[mathFunction]?.title || ""}
          category={equations[mathFunction]?.category || ""}
          concept={equations[mathFunction]?.concept || ""}
          onEquationChange={(newEquation: string) => {
            // Custom equation editing logic could be implemented here
            console.log("New equation:", newEquation);
          }}
        />
      )}
    </div>
  );
}

export default App;
