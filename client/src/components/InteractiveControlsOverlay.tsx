import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

export function InteractiveControlsOverlay() {
  const [isMinimized, setIsMinimized] = useState(false);
  const { 
    mathFunction, 
    animationMode, 
    colorMode,
    setMathFunction, 
    setAnimationMode, 
    setColorMode,
    randomize,
    setShowTrails,
    setShowGrid,
    showTrails,
    showGrid
  } = useSurfaceControls();

  const quickFunctions = [
    { key: 'electric', label: '⚡ Electric', color: 'from-yellow-400 to-orange-500' },
    { key: 'spiral', label: '🌀 Spiral', color: 'from-blue-400 to-purple-500' },
    { key: 'interference', label: '〰️ Waves', color: 'from-green-400 to-teal-500' },
    { key: 'ripples', label: '🎯 Ripples', color: 'from-pink-400 to-rose-500' }
  ];

  const quickAnimations = [
    { key: 'smooth', label: 'Smooth', icon: '➖' },
    { key: 'pulse', label: 'Pulse', icon: '💓' },
    { key: 'chaotic', label: 'Chaos', icon: '⚡' },
    { key: 'freeze', label: 'Freeze', icon: '❄️' }
  ];

  const quickColors = [
    { key: 'height', label: 'Height', color: '#4a90e2' },
    { key: 'velocity', label: 'Speed', color: '#e24a90' },
    { key: 'rainbow', label: 'Rainbow', color: '#90e24a' },
    { key: 'gradient', label: 'Gradient', color: '#e2904a' }
  ];

  if (isMinimized) {
    return (
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-black/80 border border-white/20 text-white hover:bg-black/90"
          size="sm"
        >
          🎮 Quick Controls
        </Button>
      </div>
    );
  }

  return (
    <Card className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 bg-black/95 border-white/20 text-white">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-blue-400">Quick Controls</h3>
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Quick Function Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Functions</label>
          <div className="grid grid-cols-2 gap-1">
            {quickFunctions.map((func) => (
              <Button
                key={func.key}
                onClick={() => setMathFunction(func.key as any)}
                className={`text-xs h-8 ${
                  mathFunction === func.key 
                    ? `bg-gradient-to-r ${func.color} text-white` 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                size="sm"
              >
                {func.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Animation Modes */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Animation</label>
          <div className="grid grid-cols-2 gap-1">
            {quickAnimations.map((anim) => (
              <Button
                key={anim.key}
                onClick={() => setAnimationMode(anim.key as any)}
                className={`text-xs h-8 ${
                  animationMode === anim.key 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                size="sm"
              >
                {anim.icon} {anim.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Color Modes */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Colors</label>
          <div className="grid grid-cols-2 gap-1">
            {quickColors.map((color) => (
              <Button
                key={color.key}
                onClick={() => setColorMode(color.key as any)}
                className={`text-xs h-8 ${
                  colorMode === color.key 
                    ? 'ring-2 ring-white' 
                    : 'hover:ring-1 hover:ring-gray-500'
                }`}
                style={{ 
                  backgroundColor: colorMode === color.key ? color.color : '#374151',
                  color: 'white'
                }}
                size="sm"
              >
                {color.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Effects Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Effects</label>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTrails(!showTrails)}
              className={`text-xs flex-1 h-8 ${
                showTrails 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
              size="sm"
            >
              ✨ Trails
            </Button>
            <Button
              onClick={() => setShowGrid(!showGrid)}
              className={`text-xs flex-1 h-8 ${
                showGrid 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
              size="sm"
            >
              🔲 Grid
            </Button>
          </div>
        </div>

        {/* Magic Button */}
        <Button
          onClick={randomize}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold"
          size="sm"
        >
          🎲 Surprise Me!
        </Button>

        {/* Current Status */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Function:</span>
            <Badge variant="outline" className="text-xs">
              {mathFunction.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Mode:</span>
            <Badge variant="outline" className="text-xs">
              {animationMode}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}