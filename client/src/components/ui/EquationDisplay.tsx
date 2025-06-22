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
    title: "Sine Wave",
    equation: "y = A × sin(fx + st) + A × sin(fz + st × 0.8) × 0.5",
    description: "Classic trigonometric sine wave with dual axis modulation",
    category: "Trigonometric"
  },
  cos: {
    title: "Cosine Wave", 
    equation: "y = A × cos(fx + st) + A × cos(fz + st × 0.7) × 0.6",
    description: "Cosine function creating smooth rolling wave patterns",
    category: "Trigonometric"
  },
  tan: {
    title: "Tangent Wave",
    equation: "y = A × [clamp(tan(fx × 0.3 + st), -2, 2) × 0.3 + clamp(tan(fz × 0.3 + st × 0.5), -2, 2) × 0.3]",
    description: "Bounded tangent function with periodic discontinuities",
    category: "Trigonometric"
  },
  electric: {
    title: "Electrical Current",
    equation: "y = A × [sin(2fx + 3st) × e^(-|x|×0.1) + cos(1.5fz + 2.5st) × e^(-|z|×0.1) + noise + sparks]",
    description: "Simulates electrical discharge with exponential decay and random noise",
    category: "Physics"
  },
  ripples: {
    title: "Concentric Ripples",
    equation: "y = A × [sin(r×f - 2st) × e^(-r×0.1) + sin(r×f×1.3 - 1.5st) × e^(-r×0.15) × 0.5]",
    description: "Radial waves emanating from center with exponential dampening",
    category: "Wave Physics"
  },
  spiral: {
    title: "Logarithmic Spiral",
    equation: "y = A × [sin(r×f + θ×3 + st) × e^(-r×0.05) + cos(θ×5 + st×0.5) × 0.3]",
    description: "Spiral pattern combining radial and angular components",
    category: "Geometry"
  },
  interference: {
    title: "Wave Interference",
    equation: "y = A × [sin(r₁×f - st) + sin(r₂×f - st)] × 0.5",
    description: "Constructive and destructive interference from two point sources",
    category: "Wave Physics"
  },
  waves: {
    title: "Complex Waves",
    equation: "y = A × [sin(fx + st) × 0.3 + sin(fz + st×1.2) × 0.2 + sin(r×f - 2st) × 0.4 + noise]",
    description: "Multi-component wave system with directional and radial components",
    category: "Complex"
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
        
        {/* Variables */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Current Values:</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {getVariableExplanation().map((variable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-mono text-yellow-400">{variable.symbol} =</span>
                <span className="text-blue-400">{variable.value}</span>
                <span className="text-gray-400 truncate">{variable.description}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}