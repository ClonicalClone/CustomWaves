import { create } from 'zustand';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference' | 'laplace' | 'fourier' | 'bessel' | 'legendre' | 
  'mandelbrot' | 'julia' | 'newton' | 'barnsley' | 'lorenz' | 'rossler' | 'chua' | 'henon' | 'logistic' | 'bifurcation' | 
  'navier_stokes' | 'schrodinger' | 'maxwell' | 'einstein' | 'dirac' | 'klein_gordon' | 'wave_equation' | 'heat_equation' | 
  'poisson' | 'helmholtz' | 'burgers' | 'kdv' | 'sine_gordon' | 'nonlinear_schrodinger' | 'reaction_diffusion' | 
  'fibonacci' | 'pascal' | 'catalan' | 'euler_gamma' | 'riemann_zeta' | 'weierstrass' | 'cantor' | 'sierpinski' | 
  'mobius' | 'torus' | 'hyperbolic' | 'spherical' | 'elliptic' | 'parabolic' | 'geodesic' | 'curvature' | 
  'quantum_harmonic' | 'quantum_well' | 'hydrogen_atom' | 'phonon' | 'plasmon' | 'soliton' | 'breather' | 'kink' |
  'cellular_automata' | 'game_of_life' | 'neural_network' | 'genetic_algorithm' | 'percolation' | 'ising_model' | 'custom';
export type ColorMode = 'height' | 'velocity' | 'gradient' | 'rainbow';
export type AnimationMode = 'smooth' | 'pulse' | 'chaotic' | 'freeze';

interface SurfaceControlsState {
  // Math Function Controls
  mathFunction: MathFunction;
  amplitude: number;
  frequency: number;
  speed: number;
  complexity: number;
  
  // Visual Controls
  colorMode: ColorMode;
  pointSize: number;
  resolution: number;
  mouseInfluence: number;
  
  // Animation Controls
  animationMode: AnimationMode;
  turbulence: number;
  damping: number;
  
  // Advanced Features
  showTrails: boolean;
  showGrid: boolean;
  autoRotate: boolean;
  showEquations: boolean;
  
  // Custom Equation Editor
  customEquation: string;
  equationVariables: Record<string, number>;
  showEquationEditor: boolean;
  
  // Actions
  setMathFunction: (func: MathFunction) => void;
  setAmplitude: (value: number) => void;
  setFrequency: (value: number) => void;
  setSpeed: (value: number) => void;
  setComplexity: (value: number) => void;
  setColorMode: (mode: ColorMode) => void;
  setPointSize: (value: number) => void;
  setResolution: (value: number) => void;
  setMouseInfluence: (value: number) => void;
  setAnimationMode: (mode: AnimationMode) => void;
  setTurbulence: (value: number) => void;
  setDamping: (value: number) => void;
  setShowTrails: (value: boolean) => void;
  setShowGrid: (value: boolean) => void;
  setAutoRotate: (value: boolean) => void;
  setShowEquations: (value: boolean) => void;
  setCustomEquation: (equation: string) => void;
  setEquationVariable: (name: string, value: number) => void;
  setShowEquationEditor: (show: boolean) => void;
  reset: () => void;
  randomize: () => void;
  exportSettings: () => string;
}

const defaultValues = {
  mathFunction: 'waves' as MathFunction,
  amplitude: 2.0,
  frequency: 0.8,
  speed: 1.2,
  complexity: 1.0,
  colorMode: 'height' as ColorMode,
  pointSize: 0.08,
  resolution: 80,
  mouseInfluence: 1.5,
  animationMode: 'smooth' as AnimationMode,
  turbulence: 0.3,
  damping: 0.05,
  showTrails: false,
  showGrid: false,
  autoRotate: false,
  showEquations: true,
  customEquation: '2 * sin(x * 0.5 + t) + cos(z * 0.3 + t * 0.8)',
  equationVariables: {
    A: 2.0,
    f: 0.8,
    s: 1.2,
    c: 1.0,
    pi: Math.PI,
    e: Math.E,
    phi: 1.618033988749,
    sqrt2: Math.sqrt(2),
    sqrt3: Math.sqrt(3)
  },
  showEquationEditor: false,
};

export const useSurfaceControls = create<SurfaceControlsState>((set, get) => ({
  ...defaultValues,
  
  setMathFunction: (func) => set({ mathFunction: func }),
  setAmplitude: (value) => set({ amplitude: value }),
  setFrequency: (value) => set({ frequency: value }),
  setSpeed: (value) => set({ speed: value }),
  setComplexity: (value) => set({ complexity: value }),
  setColorMode: (mode) => set({ colorMode: mode }),
  setPointSize: (value) => set({ pointSize: value }),
  setResolution: (value) => set({ resolution: value }),
  setMouseInfluence: (value) => set({ mouseInfluence: value }),
  setAnimationMode: (mode) => set({ animationMode: mode }),
  setTurbulence: (value) => set({ turbulence: value }),
  setDamping: (value) => set({ damping: value }),
  setShowTrails: (value) => set({ showTrails: value }),
  setShowGrid: (value) => set({ showGrid: value }),
  setAutoRotate: (value) => set({ autoRotate: value }),
  setShowEquations: (value) => set({ showEquations: value }),
  setCustomEquation: (equation) => set({ customEquation: equation }),
  setEquationVariable: (name, value) => set((state) => ({
    equationVariables: { ...state.equationVariables, [name]: value }
  })),
  setShowEquationEditor: (show) => set({ showEquationEditor: show }),
  
  reset: () => set(defaultValues),
  
  randomize: () => {
    const functions: MathFunction[] = ['waves', 'sin', 'cos', 'tan', 'electric', 'ripples', 'spiral', 'interference', 'laplace', 'fourier', 'bessel', 'legendre', 
      'mandelbrot', 'julia', 'newton', 'lorenz', 'rossler', 'henon', 'navier_stokes', 'schrodinger', 'fibonacci', 'mobius', 'quantum_harmonic'];
    const colorModes: ColorMode[] = ['height', 'velocity', 'gradient', 'rainbow'];
    const animationModes: AnimationMode[] = ['smooth', 'pulse', 'chaotic'];
    
    set({
      mathFunction: functions[Math.floor(Math.random() * functions.length)],
      amplitude: 1 + Math.random() * 4,
      frequency: 0.3 + Math.random() * 2,
      speed: 0.5 + Math.random() * 3,
      complexity: 0.5 + Math.random() * 2,
      colorMode: colorModes[Math.floor(Math.random() * colorModes.length)],
      pointSize: 0.04 + Math.random() * 0.15,
      mouseInfluence: Math.random() * 2.5,
      animationMode: animationModes[Math.floor(Math.random() * animationModes.length)],
      turbulence: Math.random() * 1.5,
    });
  },
  
  exportSettings: () => {
    const state = get();
    return JSON.stringify({
      mathFunction: state.mathFunction,
      amplitude: state.amplitude,
      frequency: state.frequency,
      speed: state.speed,
      complexity: state.complexity,
      colorMode: state.colorMode,
      pointSize: state.pointSize,
      resolution: state.resolution,
      mouseInfluence: state.mouseInfluence,
      animationMode: state.animationMode,
      turbulence: state.turbulence,
      damping: state.damping,
      showTrails: state.showTrails,
      showGrid: state.showGrid,
      autoRotate: state.autoRotate,
      customEquation: state.customEquation,
      equationVariables: state.equationVariables,
    }, null, 2);
  },
}));