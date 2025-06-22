import React from 'react';
import { Button } from './button';
import { Slider } from './slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Card, CardContent, CardHeader, CardTitle } from './card';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference';

interface ControlsProps {
  mathFunction: MathFunction;
  amplitude: number;
  frequency: number;
  speed: number;
  complexity: number;
  onMathFunctionChange: (func: MathFunction) => void;
  onAmplitudeChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onComplexityChange: (value: number) => void;
  onReset: () => void;
}

export function Controls({
  mathFunction,
  amplitude,
  frequency,
  speed,
  complexity,
  onMathFunctionChange,
  onAmplitudeChange,
  onFrequencyChange,
  onSpeedChange,
  onComplexityChange,
  onReset
}: ControlsProps) {
  return (
    <Card className="absolute top-4 right-4 w-80 bg-black/80 border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Surface Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Function Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mathematical Function</label>
          <Select value={mathFunction} onValueChange={onMathFunctionChange}>
            <SelectTrigger className="bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="waves">Waves (Mixed)</SelectItem>
              <SelectItem value="sin">Sine Wave</SelectItem>
              <SelectItem value="cos">Cosine Wave</SelectItem>
              <SelectItem value="tan">Tangent Wave</SelectItem>
              <SelectItem value="electric">Electric Current</SelectItem>
              <SelectItem value="ripples">Ripples</SelectItem>
              <SelectItem value="spiral">Spiral</SelectItem>
              <SelectItem value="interference">Wave Interference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amplitude */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amplitude: {amplitude.toFixed(1)}</label>
          <Slider
            value={[amplitude]}
            onValueChange={(value) => onAmplitudeChange(value[0])}
            min={0.1}
            max={5.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Frequency: {frequency.toFixed(1)}</label>
          <Slider
            value={[frequency]}
            onValueChange={(value) => onFrequencyChange(value[0])}
            min={0.1}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Speed: {speed.toFixed(1)}</label>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={0.1}
            max={5.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Complexity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Complexity: {complexity.toFixed(1)}</label>
          <Slider
            value={[complexity]}
            onValueChange={(value) => onComplexityChange(value[0])}
            min={0.1}
            max={3.0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Reset Button */}
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full mt-4 bg-gray-800 border-gray-600 hover:bg-gray-700"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
}