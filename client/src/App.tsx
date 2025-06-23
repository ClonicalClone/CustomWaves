import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { AdvancedControls } from './components/ui/AdvancedControls';
import { EditableEquation } from './components/ui/EditableEquation';
import { AdvancedEquationEditor } from './components/ui/AdvancedEquationEditor';
import { DraggablePanel } from './components/ui/DraggablePanel';
import { useSurfaceControls } from './lib/stores/useSurfaceControls';
import { Button } from './components/ui/button';
import { Settings, Calculator, FileText } from 'lucide-react';
import './index.css';

// Comprehensive Mathematical Equation Definitions - 50+ Concepts
const equations: Record<string, { title: string; equation: string; category: string; concept: string }> = {
  // Wave Theory & Harmonic Analysis
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
  waves: {
    title: "Superposition Field",
    equation: "y = A·[sin(fx + st)·0.4 + sin(fz + √2st)·0.3 + sin((x+z)f√2/2 + √3st/2)·0.25 + sin(rf - 2st)·0.35]",
    category: "Wave Mechanics",
    concept: "Demonstrates principle of superposition in multi-dimensional wave systems"
  },
  
  // Electromagnetism & Field Theory
  electric: {
    title: "Electromagnetic Field",
    equation: "y = A·[sin(√2fx + 2st)·e⁻⁰·⁰⁵|x| + cos(√3fz + 1.5st)·e⁻⁰·⁰⁵|z| + sin(rf - 3st)·e⁻⁰·⁰⁵r/2]",
    category: "Electromagnetism",
    concept: "Models wave propagation with realistic attenuation in conducting media"
  },
  maxwell: {
    title: "Maxwell Equations",
    equation: "y = A·[E₀sin(kx - ωt) + B₀cos(kx - ωt + π/2)·e⁻αz]",
    category: "Classical Field Theory",
    concept: "Unified description of electric and magnetic phenomena"
  },
  
  // Fluid Dynamics
  ripples: {
    title: "Hydrodynamic Waves",
    equation: "y = A·[sin(rf - st√5)·e⁻⁰·⁰⁸r + sin(rφf - φst)·e⁻⁰·¹²r·φ⁻¹ + cos(rf/2 - st)·e⁻⁰·¹⁵r·0.3]",
    category: "Fluid Dynamics",
    concept: "Simulates surface tension effects and wave attenuation in fluids"
  },
  navier_stokes: {
    title: "Navier-Stokes Equation",
    equation: "y = A·[∂u/∂t + u·∇u = -∇p/ρ + ν∇²u] (simplified visualization)",
    category: "Fluid Mechanics",
    concept: "Fundamental equations governing fluid motion"
  },
  
  // Quantum Mechanics
  schrodinger: {
    title: "Schrödinger Equation",
    equation: "y = A·ψ(x,z,t) = e⁻⁰·¹⁽ˣ²⁺ᶻ²⁾ cos(f(x+z) - st)",
    category: "Quantum Mechanics",
    concept: "Time-dependent quantum wave function evolution"
  },
  quantum_harmonic: {
    title: "Quantum Harmonic Oscillator",
    equation: "y = A·H₃(x)e⁻ˣ²/² cos(ωt) where H₃ is 3rd Hermite polynomial",
    category: "Quantum Physics",
    concept: "Quantized energy levels in harmonic potential"
  },
  quantum_well: {
    title: "Quantum Well",
    equation: "y = A·sin(nπx/L) for |x| < L/2, 0 elsewhere",
    category: "Quantum Confinement",
    concept: "Particle in a box - fundamental quantum problem"
  },
  hydrogen_atom: {
    title: "Hydrogen Atom Wavefunction",
    equation: "y = A·R(r)Y(θ,φ) = e⁻ʳ·r·cos(θ + st)",
    category: "Atomic Physics",
    concept: "Electron probability distribution in hydrogen"
  },
  
  // Fractals & Chaos Theory
  mandelbrot: {
    title: "Mandelbrot Set",
    equation: "z_{n+1} = z_n² + c, iterate until |z| > 2",
    category: "Fractal Geometry",
    concept: "Self-similar structures at all scales"
  },
  julia: {
    title: "Julia Set",
    equation: "z_{n+1} = z_n² + c (fixed c), dynamic parameter visualization",
    category: "Complex Dynamics",
    concept: "Connected vs disconnected fractal boundaries"
  },
  newton: {
    title: "Newton Fractal",
    equation: "Newton's method for z³ - 1 = 0 convergence basins",
    category: "Numerical Analysis",
    concept: "Visualization of root-finding algorithm convergence"
  },
  lorenz: {
    title: "Lorenz Attractor",
    equation: "dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz",
    category: "Chaos Theory",
    concept: "Sensitive dependence on initial conditions"
  },
  rossler: {
    title: "Rössler Attractor",
    equation: "dx/dt = -y-z, dy/dt = x+ay, dz/dt = b+z(x-c)",
    category: "Dynamical Systems",
    concept: "Strange attractor with simpler dynamics than Lorenz"
  },
  henon: {
    title: "Hénon Map",
    equation: "x_{n+1} = 1 - ax_n² + y_n, y_{n+1} = bx_n",
    category: "Discrete Dynamics",
    concept: "Two-dimensional chaotic map"
  },
  logistic: {
    title: "Logistic Map",
    equation: "x_{n+1} = rx_n(1 - x_n), bifurcation parameter r",
    category: "Population Dynamics",
    concept: "Route to chaos through period-doubling"
  },
  
  // Partial Differential Equations
  laplace: {
    title: "Laplace Equation",
    equation: "∇²φ = 0, solution: φ = r cos(nθ)e⁻ⁿʳ",
    category: "Elliptic PDEs",
    concept: "Steady-state problems, harmonic functions"
  },
  wave_equation: {
    title: "Wave Equation",
    equation: "∂²u/∂t² = c²∇²u, standing + traveling waves",
    category: "Hyperbolic PDEs",
    concept: "Propagation of disturbances at finite speed"
  },
  heat_equation: {
    title: "Heat Equation",
    equation: "∂u/∂t = α∇²u, diffusion with exponential decay",
    category: "Parabolic PDEs",
    concept: "Thermal diffusion and smoothing processes"
  },
  poisson: {
    title: "Poisson Equation",
    equation: "∇²φ = ρ/ε₀, electrostatic potential",
    category: "Elliptic PDEs",
    concept: "Potential theory with source terms"
  },
  helmholtz: {
    title: "Helmholtz Equation",
    equation: "∇²u + k²u = 0, wave solutions",
    category: "Wave Theory",
    concept: "Time-harmonic wave propagation"
  },
  burgers: {
    title: "Burgers' Equation",
    equation: "∂u/∂t + u∂u/∂x = ν∂²u/∂x², shock formation",
    category: "Nonlinear PDEs",
    concept: "Simplified model of turbulence"
  },
  kdv: {
    title: "Korteweg-de Vries",
    equation: "∂u/∂t + 6u∂u/∂x + ∂³u/∂x³ = 0, soliton solutions",
    category: "Integrable Systems",
    concept: "Shallow water waves, soliton theory"
  },
  sine_gordon: {
    title: "Sine-Gordon Equation",
    equation: "∂²φ/∂t² - ∂²φ/∂x² + sin(φ) = 0",
    category: "Nonlinear Waves",
    concept: "Kink solitons and breather solutions"
  },
  nonlinear_schrodinger: {
    title: "Nonlinear Schrödinger",
    equation: "i∂ψ/∂t + ∂²ψ/∂x² + |ψ|²ψ = 0",
    category: "Quantum Nonlinearity",
    concept: "Self-focusing and envelope solitons"
  },
  reaction_diffusion: {
    title: "Reaction-Diffusion",
    equation: "∂u/∂t = D∇²u + f(u), pattern formation",
    category: "Mathematical Biology",
    concept: "Turing patterns and morphogenesis"
  },
  
  // Special Functions & Number Theory
  fourier: {
    title: "Fourier Series",
    equation: "f(x) = Σ[aₙcos(nx) + bₙsin(nx)], harmonic decomposition",
    category: "Harmonic Analysis",
    concept: "Frequency domain representation"
  },
  bessel: {
    title: "Bessel Functions",
    equation: "J₀(kr)cos(ωt), cylindrical wave solutions",
    category: "Special Functions",
    concept: "Circular membrane vibrations"
  },
  legendre: {
    title: "Legendre Polynomials",
    equation: "P₂(x) = ½(3x² - 1), spherical harmonics basis",
    category: "Orthogonal Polynomials",
    concept: "Angular momentum in quantum mechanics"
  },
  fibonacci: {
    title: "Fibonacci Sequence",
    equation: "F_n = F_{n-1} + F_{n-2}, golden ratio convergence",
    category: "Number Theory",
    concept: "Natural growth patterns and recursion"
  },
  riemann_zeta: {
    title: "Riemann Zeta Function",
    equation: "ζ(s) = Σ 1/n^s, analytical continuation",
    category: "Analytic Number Theory",
    concept: "Distribution of prime numbers"
  },
  weierstrass: {
    title: "Weierstrass Function",
    equation: "Σ aⁿcos(bⁿπx), continuous but nowhere differentiable",
    category: "Real Analysis",
    concept: "Pathological function challenging intuition"
  },
  
  // Topology & Geometry
  mobius: {
    title: "Möbius Strip",
    equation: "x = (1 + v cos(u/2))cos(u), non-orientable surface",
    category: "Topology",
    concept: "Surface with only one side"
  },
  torus: {
    title: "Torus",
    equation: "x = (R + r cos(v))cos(u), donut-shaped surface",
    category: "Differential Geometry",
    concept: "Genus-1 surface, periodic boundary conditions"
  },
  hyperbolic: {
    title: "Hyperbolic Geometry",
    equation: "ds² = dx²/(1-r²) + dy²/(1-r²), negative curvature",
    category: "Non-Euclidean Geometry",
    concept: "Constant negative curvature spaces"
  },
  spherical: {
    title: "Spherical Geometry",
    equation: "ds² = R²(dθ² + sin²θ dφ²), positive curvature",
    category: "Riemannian Geometry",
    concept: "Geometry on curved surfaces"
  },
  
  // Solitons & Nonlinear Waves
  soliton: {
    title: "Soliton",
    equation: "u = A sech²(k(x - vt)), localized wave packet",
    category: "Nonlinear Waves",
    concept: "Stable, non-dispersing wave packets"
  },
  breather: {
    title: "Breather Solution",
    equation: "Oscillating localized solution, energy exchange",
    category: "Integrable Systems",
    concept: "Time-periodic, spatially localized waves"
  },
  kink: {
    title: "Kink Solution",
    equation: "u = tanh(x - vt), topological soliton",
    category: "Field Theory",
    concept: "Stable interface between vacuum states"
  },
  
  // Complex Systems & Emergence
  cellular_automata: {
    title: "Cellular Automata",
    equation: "Rule-based evolution, emergent complexity",
    category: "Complex Systems",
    concept: "Simple rules generating complex behavior"
  },
  game_of_life: {
    title: "Conway's Game of Life",
    equation: "Birth/death rules: B3/S23, gliders and oscillators",
    category: "Artificial Life",
    concept: "Emergence from simple local interactions"
  },
  neural_network: {
    title: "Neural Network",
    equation: "y = σ(Wx + b), learning through backpropagation",
    category: "Machine Learning",
    concept: "Pattern recognition and function approximation"
  },
  genetic_algorithm: {
    title: "Genetic Algorithm",
    equation: "Selection, crossover, mutation operations",
    category: "Evolutionary Computation",
    concept: "Optimization through simulated evolution"
  },
  percolation: {
    title: "Percolation Theory",
    equation: "Connected clusters, phase transition",
    category: "Statistical Physics",
    concept: "Connectivity in random media"
  },
  ising_model: {
    title: "Ising Model",
    equation: "H = -J Σ sᵢsⱼ - h Σ sᵢ, spin interactions",
    category: "Statistical Mechanics",
    concept: "Phase transitions and critical phenomena"
  },
  
  // Interference & Optics
  interference: {
    title: "Wave Interference",
    equation: "I = I₁ + I₂ + 2√(I₁I₂)cos(δ), double-slit pattern",
    category: "Wave Optics",
    concept: "Constructive and destructive interference"
  },
  
  // More Advanced Mathematics
  barnsley: {
    title: "Barnsley Fern",
    equation: "Iterated function system: probabilistic transformations",
    category: "Fractal Geometry",
    concept: "Self-similar structures generated by random iterations"
  },
  chua: {
    title: "Chua's Circuit",
    equation: "dx/dt = α(y-x-f(x)), dy/dt = x-y+z, dz/dt = -βy",
    category: "Chaos Theory",
    concept: "Electronic circuit exhibiting chaotic behavior"
  },
  bifurcation: {
    title: "Bifurcation Diagram",
    equation: "Parameter-dependent dynamical system transitions",
    category: "Dynamical Systems",
    concept: "Qualitative changes in system behavior"
  },
  einstein: {
    title: "Einstein Field Equations",
    equation: "Gμν + Λgμν = 8πTμν, spacetime curvature",
    category: "General Relativity",
    concept: "Gravity as geometry of curved spacetime"
  },
  dirac: {
    title: "Dirac Equation",
    equation: "(iγμ∂μ - m)ψ = 0, relativistic quantum mechanics",
    category: "Quantum Field Theory",
    concept: "Relativistic description of fermions"
  },
  klein_gordon: {
    title: "Klein-Gordon Equation",
    equation: "(□ + m²)φ = 0, relativistic scalar field",
    category: "Field Theory",
    concept: "Relativistic quantum field for spin-0 particles"
  },
  pascal: {
    title: "Pascal's Triangle",
    equation: "C(n,k) = C(n-1,k-1) + C(n-1,k), binomial coefficients",
    category: "Combinatorics",
    concept: "Binomial expansion and probability distributions"
  },
  catalan: {
    title: "Catalan Numbers",
    equation: "Cₙ = (1/(n+1))C(2n,n), combinatorial sequences",
    category: "Combinatorics",
    concept: "Counting problems in discrete mathematics"
  },
  euler_gamma: {
    title: "Euler's Gamma Function",
    equation: "Γ(z) = ∫₀^∞ t^(z-1)e^(-t)dt, factorial generalization",
    category: "Special Functions",
    concept: "Extension of factorial to complex numbers"
  },
  cantor: {
    title: "Cantor Set",
    equation: "Recursive ternary set construction",
    category: "Fractal Geometry",
    concept: "Perfect set with zero measure and uncountable cardinality"
  },
  sierpinski: {
    title: "Sierpiński Triangle",
    equation: "Self-similar triangular fractal",
    category: "Fractal Geometry",
    concept: "Recursive geometric construction with fractal dimension"
  },
  elliptic: {
    title: "Elliptic Geometry",
    equation: "ds² = a²(dθ² + sin²θ dφ²), positive curvature",
    category: "Non-Euclidean Geometry",
    concept: "Geometry on spherical surfaces"
  },
  parabolic: {
    title: "Parabolic Geometry",
    equation: "ds² = dx² + dy², zero curvature",
    category: "Euclidean Geometry",
    concept: "Flat geometry with parallel postulate"
  },
  geodesic: {
    title: "Geodesic Equations",
    equation: "d²xμ/dt² + Γμνρ(dxν/dt)(dxρ/dt) = 0",
    category: "Differential Geometry",
    concept: "Shortest paths on curved surfaces"
  },
  curvature: {
    title: "Riemann Curvature",
    equation: "Rμνρσ = ∂ρΓμνσ - ∂σΓμνρ + ΓμλρΓλνσ - ΓμλσΓλνρ",
    category: "Differential Geometry",
    concept: "Intrinsic measure of spacetime curvature"
  },
  phonon: {
    title: "Phonon Dispersion",
    equation: "ω(k) = √(C/M)|sin(ka/2)|, lattice vibrations",
    category: "Condensed Matter",
    concept: "Quantized lattice vibrations in crystals"
  },
  plasmon: {
    title: "Plasmon Oscillations",
    equation: "ωₚ = √(ne²/ε₀m), collective electron excitations",
    category: "Plasma Physics",
    concept: "Coherent oscillations of electron density"
  },
  
  // Custom Equation
  custom: {
    title: "Custom Equation",
    equation: "User-defined mathematical expression",
    category: "User-Defined",
    concept: "Flexible mathematical exploration tool"
  }
};

function App() {
  const [showControls, setShowControls] = useState(true);
  const [showEquationDisplay, setShowEquationDisplay] = useState(true);
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
    customEquation,
    equationVariables,
    showEquationEditor,
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
    setCustomEquation,
    setEquationVariable,
    setShowEquationEditor,
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
      
      {/* Toggle Buttons */}
      <div className="absolute top-4 left-4 flex gap-2 z-40">
        <Button
          onClick={() => setShowControls(!showControls)}
          variant="outline"
          size="sm"
          className="bg-gray-900/80 border-gray-600 text-white hover:bg-gray-800"
        >
          <Settings className="w-4 h-4 mr-1" />
          Controls
        </Button>
        <Button
          onClick={() => setShowEquationDisplay(!showEquationDisplay)}
          variant="outline"
          size="sm"
          className="bg-gray-900/80 border-gray-600 text-white hover:bg-gray-800"
        >
          <FileText className="w-4 h-4 mr-1" />
          Equations
        </Button>
      </div>

      {/* Draggable Controls Panel */}
      {showControls && (
        <DraggablePanel
          title="Mathematical Surface Controls"
          initialPosition={{ x: 20, y: 80 }}
          width={350}
          height={600}
        >
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
        </DraggablePanel>
      )}
      
      {/* Draggable Equation Display Panel */}
      {showEquationDisplay && (
        <DraggablePanel
          title="Mathematical Equation Display"
          initialPosition={{ x: typeof window !== 'undefined' ? window.innerWidth - 420 : 800, y: 80 }}
          width={400}
          height={300}
        >
          <EditableEquation
            equation={equations[mathFunction]?.equation || customEquation}
            title={equations[mathFunction]?.title || "Custom Equation"}
            category={equations[mathFunction]?.category || "User-Defined"}
            concept={equations[mathFunction]?.concept || "Custom mathematical expression"}
            onEquationChange={(newEquation: string) => {
              if (mathFunction === 'custom') {
                setCustomEquation(newEquation);
              } else {
                setMathFunction('custom');
                setCustomEquation(newEquation);
              }
            }}
          />
        </DraggablePanel>
      )}
      
      {showEquationEditor && (
        <AdvancedEquationEditor
          equation={customEquation}
          variables={equationVariables}
          onEquationChange={setCustomEquation}
          onVariableChange={setEquationVariable}
          onClose={() => setShowEquationEditor(false)}
        />
      )}
    </div>
  );
}

export default App;
