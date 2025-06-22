import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference';

interface EquationDisplayProps {
  mathFunction: MathFunction;
  amplitude: number;
  frequency: number;
  speed: number;
  complexity: number;
}

const equations = {
  sin: {
    title: "Harmonic Sine Wave",
    equation: "y = A·sin(fx + st) + A·sin(fz + st·φ)·φ⁻¹ + A·sin((x+z)f/2 + st/2)·φ⁻²",
    description: "Pure harmonic oscillation with golden ratio phase relationships (φ = 1.618)",
    category: "Harmonic Analysis",
    concept: "Demonstrates superposition principle and harmonic series in wave theory"
  },
  cos: {
    title: "Modulated Cosine", 
    equation: "y = A·cos(fx + st) + A·cos(fz + st·√2/2)·√2/2 + A·cos(xzf/10 + st)·0.3",
    description: "Cosine waves with √2 modulation ratios and spatial cross-coupling",
    category: "Wave Modulation",
    concept: "Explores amplitude modulation and spatial frequency coupling"
  },
  tan: {
    title: "Arctangent Field",
    equation: "y = A·[atan(sin(x/T + st))·0.8 + atan(sin(z/T + st·0.75))·0.6 + atan(sin(xz/T² + st/2))·0.4]",
    description: "Bounded arctangent functions creating smooth periodic fields",
    category: "Nonlinear Dynamics",
    concept: "Demonstrates bounded periodic behavior and spatial coupling"
  },
  electric: {
    title: "Electromagnetic Field",
    equation: "y = A·[sin(√2fx + 2st)·e⁻⁰·⁰⁵|x| + cos(√3fz + 1.5st)·e⁻⁰·⁰⁵|z| + sin(rf - 3st)·e⁻⁰·⁰⁵r/2]",
    description: "Field equations with exponential decay mimicking electromagnetic phenomena",
    category: "Electromagnetism",
    concept: "Models wave propagation with realistic attenuation in conducting media"
  },
  ripples: {
    title: "Hydrodynamic Waves",
    equation: "y = A·[sin(rf - st√5)·e⁻⁰·⁰⁸r + sin(rφf - φst)·e⁻⁰·¹²r·φ⁻¹ + cos(rf/2 - st)·e⁻⁰·¹⁵r·0.3]",
    description: "Surface waves with hydrodynamic dampening and golden ratio harmonics",
    category: "Fluid Dynamics",
    concept: "Simulates surface tension effects and wave attenuation in fluids"
  },
  spiral: {
    title: "Fibonacci Spiral",
    equation: "y = A·[sin(0.618rf + 5.236θ + st)·e⁻⁰·⁰³r + cos(φθ + 0.618st)·0.382]",
    description: "Logarithmic spiral based on Fibonacci sequence and golden ratio",
    category: "Mathematical Biology",
    concept: "Demonstrates natural spiral patterns found in shells and galaxies"
  },
  interference: {
    title: "Double-Slit Interference",
    equation: "y = A·cos(k·Δd/2)·e⁻⁰·⁰⁴min(d₁,d₂)·sin(k(d₁+d₂)/2 - 2st)",
    description: "Young's double-slit experiment with realistic wave interference",
    category: "Quantum Optics",
    concept: "Models wave-particle duality and constructive/destructive interference"
  },
  waves: {
    title: "Superposition Field",
    equation: "y = A·[sin(fx + st)·0.4 + sin(fz + √2st)·0.3 + sin((x+z)f√2/2 + √3st/2)·0.25 + sin(rf - 2st)·0.35 + modulation]",
    description: "Complex superposition with mathematical constant phase relationships",
    category: "Wave Mechanics",
    concept: "Demonstrates principle of superposition in multi-dimensional wave systems"
  }
};

export function EquationDisplay({ mathFunction, amplitude, frequency, speed, complexity }: EquationDisplayProps) {
  const eq = equations[mathFunction];
  
  const getVariableExplanation = () => {
    return [
      { symbol: "A", value: amplitude.toFixed(2), description: "Amplitude" },
      { symbol: "f", value: (frequency * complexity).toFixed(2), description: "Frequency × Complexity" },
      { symbol: "s", value: speed.toFixed(2), description: "Speed" },
      { symbol: "t", value: "time", description: "Time variable" },
      { symbol: "r", value: "√(x² + z²)", description: "Radial distance" },
      { symbol: "θ", value: "atan2(z, x)", description: "Angular component" }
    ];
  };

  return (
    <Card className="absolute bottom-4 left-4 w-96 bg-black/90 border-white/20 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{eq.title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {eq.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equation */}
        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
          <p className="text-sm font-mono text-green-400 leading-relaxed">
            {eq.equation}
          </p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-300">
          {eq.description}
        </p>
        
        {/* Mathematical Concept */}
        <div className="bg-gray-800/50 p-2 rounded border border-gray-600">
          <p className="text-xs text-gray-200 leading-relaxed">
            <span className="font-semibold text-blue-300">Concept:</span> {eq.concept}
          </p>
        </div>
        
        {/* Variables */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Parameters:</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {getVariableExplanation().map((variable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-mono text-amber-300">{variable.symbol} =</span>
                <span className="text-gray-200">{variable.value}</span>
                <span className="text-gray-400 truncate">{variable.description}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}