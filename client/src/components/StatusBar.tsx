import React from 'react';
import { Badge } from './ui/badge';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

export function StatusBar() {
  const { 
    mathFunction, 
    amplitude, 
    frequency, 
    speed, 
    resolution,
    animationMode 
  } = useSurfaceControls();

  const getPerformanceStatus = () => {
    const pointCount = (resolution + 1) * (resolution + 1);
    if (pointCount > 8000) return { status: 'High Load', color: 'destructive' };
    if (pointCount > 5000) return { status: 'Medium Load', color: 'secondary' };
    return { status: 'Optimized', color: 'default' };
  };

  const performance = getPerformanceStatus();

  return (
    <div className="absolute bottom-4 right-4 flex flex-wrap gap-2 bg-black/90 p-3 rounded border border-white/20">
      <Badge variant="outline" className="text-xs">
        Function: {mathFunction.toUpperCase()}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Points: {((resolution + 1) * (resolution + 1)).toLocaleString()}
      </Badge>
      <Badge variant={performance.color as any} className="text-xs">
        {performance.status}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Mode: {animationMode}
      </Badge>
      <Badge variant="outline" className="text-xs">
        A:{amplitude.toFixed(1)} F:{frequency.toFixed(1)} S:{speed.toFixed(1)}
      </Badge>
    </div>
  );
}