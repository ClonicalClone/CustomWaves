import { create } from 'zustand';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference';

interface SurfaceControlsState {
  mathFunction: MathFunction;
  amplitude: number;
  frequency: number;
  speed: number;
  complexity: number;
  
  // Actions
  setMathFunction: (func: MathFunction) => void;
  setAmplitude: (value: number) => void;
  setFrequency: (value: number) => void;
  setSpeed: (value: number) => void;
  setComplexity: (value: number) => void;
  reset: () => void;
}

const defaultValues = {
  mathFunction: 'waves' as MathFunction,
  amplitude: 2.0,
  frequency: 0.5,
  speed: 1.0,
  complexity: 1.0,
};

export const useSurfaceControls = create<SurfaceControlsState>((set) => ({
  ...defaultValues,
  
  setMathFunction: (func) => set({ mathFunction: func }),
  setAmplitude: (value) => set({ amplitude: value }),
  setFrequency: (value) => set({ frequency: value }),
  setSpeed: (value) => set({ speed: value }),
  setComplexity: (value) => set({ complexity: value }),
  reset: () => set(defaultValues),
}));