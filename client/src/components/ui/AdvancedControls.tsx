import React from 'react';
import { Button } from './button';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference' | 'laplace' | 'fourier' | 'bessel' | 'legendre';
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
  return (
    <Card className="absolute top-4 right-4 w-80 max-h-[90vh] overflow-y-auto bg-black/95 border-white/20 text-white rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Mathematical Surface Control</CardTitle>
          <Badge variant="outline" className="text-xs rounded-full">
            Advanced
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Mathematical Function */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-400">Mathematical Function</h3>
          <Select value={mathFunction} onValueChange={onMathFunctionChange}>
            <SelectTrigger className="bg-gray-800 border-gray-600 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 rounded-xl">
              <SelectItem value="waves">Superposition Waves</SelectItem>
              <SelectItem value="sin">Harmonic Sine</SelectItem>
              <SelectItem value="cos">Modulated Cosine</SelectItem>
              <SelectItem value="tan">Arctangent Field</SelectItem>
              <SelectItem value="electric">Electromagnetic Field</SelectItem>
              <SelectItem value="ripples">Hydrodynamic Waves</SelectItem>
              <SelectItem value="spiral">Fibonacci Spiral</SelectItem>
              <SelectItem value="interference">Double-Slit Interference</SelectItem>
              <SelectItem value="laplace">Laplace Equation</SelectItem>
              <SelectItem value="fourier">Fourier Series</SelectItem>
              <SelectItem value="bessel">Bessel Functions</SelectItem>
              <SelectItem value="legendre">Legendre Polynomials</SelectItem>
            </SelectContent>
          </Select>
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
    </Card>
  );
}