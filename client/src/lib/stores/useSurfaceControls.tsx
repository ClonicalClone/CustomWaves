import { create } from 'zustand';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference' | 'laplace' | 'fourier' | 'bessel' | 'legendre';
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
  
  reset: () => set(defaultValues),
  
  randomize: () => {
    const functions: MathFunction[] = ['waves', 'sin', 'cos', 'tan', 'electric', 'ripples', 'spiral', 'interference', 'laplace', 'fourier', 'bessel', 'legendre'];
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
    }, null, 2);
  },
}));