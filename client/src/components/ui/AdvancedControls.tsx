import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { useSurfaceControls } from '../../lib/stores/useSurfaceControls';
import { Calculator, Edit3, Minus, Maximize2 } from 'lucide-react';

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

interface AdvancedControlsProps {
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
  
  // Actions
  onMathFunctionChange: (func: MathFunction) => void;
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onComplexityChange: (value: number) => void;
  onColorModeChange: (mode: ColorMode) => void;
  onPointSizeChange: (value: number) => void;
  onResolutionChange: (value: number) => void;
  onMouseInfluenceChange: (value: number) => void;
  onAnimationModeChange: (mode: AnimationMode) => void;
  onTurbulenceChange: (value: number) => void;
  onDampingChange: (value: number) => void;
  onShowTrailsChange: (value: boolean) => void;
  onShowGridChange: (value: boolean) => void;
  onAutoRotateChange: (value: boolean) => void;
  onReset: () => void;
  onRandomize: () => void;
  onExport: () => void;
}

export function AdvancedControls({
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
  onMathFunctionChange,
  onAmplitudeChange,
  onFrequencyChange,
  onSpeedChange,
  onComplexityChange,
  onColorModeChange,
  onPointSizeChange,
  onResolutionChange,
  onMouseInfluenceChange,
  onAnimationModeChange,
  onTurbulenceChange,
  onDampingChange,
  onShowTrailsChange,
  onShowGridChange,
  onAutoRotateChange,
  onReset,
  onRandomize,
  onExport
}: AdvancedControlsProps) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('input') || e.target.closest('[role="slider"]'))) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 350, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragStart.y));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  const { setShowEquationEditor } = useSurfaceControls();
  
  return (
    <div 
      ref={cardRef}
      className="absolute w-80 z-20"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <Card className="bg-black/95 border-white/20 text-white rounded-2xl backdrop-blur-sm">
        <CardHeader 
          className="pb-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              Mathematical Surface Control
              <Badge variant="outline" className="text-xs rounded-full">
                Advanced
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 hover:bg-gray-700"
            >
              {isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        
        {/* Mathematical Function */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-400">Mathematical Function</h3>
          <Select value={mathFunction} onValueChange={onMathFunctionChange}>
            <SelectTrigger className="bg-gray-800 border-gray-600 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 rounded-xl max-h-64 overflow-y-auto">
              {/* Wave Theory & Harmonic Analysis */}
              <SelectItem value="waves">Superposition Waves</SelectItem>
              <SelectItem value="sin">Harmonic Sine</SelectItem>
              <SelectItem value="cos">Modulated Cosine</SelectItem>
              <SelectItem value="tan">Arctangent Field</SelectItem>
              <SelectItem value="fourier">Fourier Series</SelectItem>
              
              {/* Electromagnetism & Fields */}
              <SelectItem value="electric">Electromagnetic Field</SelectItem>
              <SelectItem value="maxwell">Maxwell Equations</SelectItem>
              
              {/* Fluid Dynamics */}
              <SelectItem value="ripples">Hydrodynamic Waves</SelectItem>
              <SelectItem value="navier_stokes">Navier-Stokes</SelectItem>
              
              {/* Quantum Mechanics */}
              <SelectItem value="schrodinger">Schrödinger Equation</SelectItem>
              <SelectItem value="quantum_harmonic">Quantum Harmonic</SelectItem>
              <SelectItem value="quantum_well">Quantum Well</SelectItem>
              <SelectItem value="hydrogen_atom">Hydrogen Atom</SelectItem>
              
              {/* Fractals & Chaos */}
              <SelectItem value="mandelbrot">Mandelbrot Set</SelectItem>
              <SelectItem value="julia">Julia Set</SelectItem>
              <SelectItem value="newton">Newton Fractal</SelectItem>
              <SelectItem value="lorenz">Lorenz Attractor</SelectItem>
              <SelectItem value="rossler">Rössler Attractor</SelectItem>
              <SelectItem value="henon">Hénon Map</SelectItem>
              <SelectItem value="logistic">Logistic Map</SelectItem>
              
              {/* PDEs */}
              <SelectItem value="laplace">Laplace Equation</SelectItem>
              <SelectItem value="wave_equation">Wave Equation</SelectItem>
              <SelectItem value="heat_equation">Heat Equation</SelectItem>
              <SelectItem value="poisson">Poisson Equation</SelectItem>
              <SelectItem value="helmholtz">Helmholtz Equation</SelectItem>
              <SelectItem value="burgers">Burgers' Equation</SelectItem>
              <SelectItem value="kdv">Korteweg-de Vries</SelectItem>
              <SelectItem value="sine_gordon">Sine-Gordon</SelectItem>
              <SelectItem value="nonlinear_schrodinger">Nonlinear Schrödinger</SelectItem>
              <SelectItem value="reaction_diffusion">Reaction-Diffusion</SelectItem>
              
              {/* Special Functions */}
              <SelectItem value="bessel">Bessel Functions</SelectItem>
              <SelectItem value="legendre">Legendre Polynomials</SelectItem>
              <SelectItem value="fibonacci">Fibonacci Sequence</SelectItem>
              <SelectItem value="riemann_zeta">Riemann Zeta</SelectItem>
              <SelectItem value="weierstrass">Weierstrass Function</SelectItem>
              
              {/* Geometry & Topology */}
              <SelectItem value="mobius">Möbius Strip</SelectItem>
              <SelectItem value="torus">Torus</SelectItem>
              <SelectItem value="hyperbolic">Hyperbolic Geometry</SelectItem>
              <SelectItem value="spherical">Spherical Geometry</SelectItem>
              
              {/* Solitons & Nonlinear Waves */}
              <SelectItem value="soliton">Soliton</SelectItem>
              <SelectItem value="breather">Breather Solution</SelectItem>
              <SelectItem value="kink">Kink Solution</SelectItem>
              
              {/* Complex Systems */}
              <SelectItem value="cellular_automata">Cellular Automata</SelectItem>
              <SelectItem value="game_of_life">Game of Life</SelectItem>
              <SelectItem value="neural_network">Neural Network</SelectItem>
              <SelectItem value="genetic_algorithm">Genetic Algorithm</SelectItem>
              <SelectItem value="percolation">Percolation Theory</SelectItem>
              <SelectItem value="ising_model">Ising Model</SelectItem>
              
              {/* Interference & Optics */}
              <SelectItem value="interference">Wave Interference</SelectItem>
              <SelectItem value="spiral">Fibonacci Spiral</SelectItem>
              
              {/* Custom */}
              <SelectItem value="custom">Custom Equation</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Equation Editor Button */}
          <Button
            onClick={() => setShowEquationEditor(true)}
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 bg-purple-900/20 border-purple-500/30 hover:bg-purple-800/30"
          >
            <Calculator className="w-4 h-4" />
            Open Equation Editor
          </Button>
        </div>

        {/* Wave Parameters */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-green-400">Wave Parameters</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Amplitude: {amplitude.toFixed(1)}</label>
            <Slider
              value={[amplitude]}
              onValueChange={(value) => onAmplitudeChange(value[0])}
              min={0.1}
              max={8.0}
              step={0.1}
              className="w-full rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Frequency: {frequency.toFixed(1)}</label>
            <Slider
              value={[frequency]}
              onValueChange={(value) => onFrequencyChange(value[0])}
              min={0.1}
              max={5.0}
              step={0.1}
              className="w-full rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Speed: {speed.toFixed(1)}</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              min={0.0}
              max={8.0}
              step={0.1}
              className="w-full rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Complexity: {complexity.toFixed(1)}</label>
            <Slider
              value={[complexity]}
              onValueChange={(value) => onComplexityChange(value[0])}
              min={0.1}
              max={5.0}
              step={0.1}
              className="w-full rounded-xl"
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Visual Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-purple-400">Visual Settings</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Color Mode</label>
            <Select value={colorMode} onValueChange={onColorModeChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 rounded-xl">
                <SelectItem value="height">Height-based</SelectItem>
                <SelectItem value="velocity">Velocity-based</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="rainbow">Rainbow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Point Size: {pointSize.toFixed(2)}</label>
            <Slider
              value={[pointSize]}
              onValueChange={(value) => onPointSizeChange(value[0])}
              min={0.02}
              max={0.3}
              step={0.01}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Resolution: {resolution}</label>
            <Slider
              value={[resolution]}
              onValueChange={(value) => onResolutionChange(value[0])}
              min={40}
              max={120}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Mouse Influence: {mouseInfluence.toFixed(1)}</label>
            <Slider
              value={[mouseInfluence]}
              onValueChange={(value) => onMouseInfluenceChange(value[0])}
              min={0.0}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Animation Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-orange-400">Animation</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Animation Mode</label>
            <Select value={animationMode} onValueChange={onAnimationModeChange}>
              <SelectTrigger className="bg-gray-800 border-gray-600 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 rounded-xl">
                <SelectItem value="smooth">Smooth</SelectItem>
                <SelectItem value="pulse">Pulse</SelectItem>
                <SelectItem value="chaotic">Chaotic</SelectItem>
                <SelectItem value="freeze">Freeze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Turbulence: {turbulence.toFixed(1)}</label>
            <Slider
              value={[turbulence]}
              onValueChange={(value) => onTurbulenceChange(value[0])}
              min={0.0}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Damping: {damping.toFixed(2)}</label>
            <Slider
              value={[damping]}
              onValueChange={(value) => onDampingChange(value[0])}
              min={0.01}
              max={0.1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Advanced Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-cyan-400">Advanced Features</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Motion Trails</label>
            <Switch checked={showTrails} onCheckedChange={onShowTrailsChange} />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Reference Grid</label>
            <Switch checked={showGrid} onCheckedChange={onShowGridChange} />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">Auto Rotate</label>
            <Switch checked={autoRotate} onCheckedChange={onAutoRotateChange} />
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onRandomize}
              variant="outline"
              className="text-xs bg-blue-600 hover:bg-blue-700 border-gray-600 rounded-xl"
            >
              Randomize
            </Button>
            <Button 
              onClick={onExport}
              variant="outline"
              className="text-xs bg-green-600 hover:bg-green-700 border-gray-600 rounded-xl"
            >
              Export
            </Button>
          </div>
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full text-xs bg-gray-800 border-gray-600 hover:bg-gray-700 rounded-xl"
          >
            Reset All
          </Button>
        </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}