import { useCallback } from 'react';
import { Vector3 } from 'three';

interface UsePointCloudProps {
  positions: Float32Array;
  resolution: number;
  width: number;
  amplitude: number;
  frequency: number;
}

export function usePointCloud({ 
  positions, 
  resolution, 
  width, 
  amplitude, 
  frequency 
}: UsePointCloudProps) {
  
  const updateSurface = useCallback((
    positionArray: Float32Array,
    time: number,
    mousePosition: Vector3,
    res: number,
    w: number
  ) => {
    const spacing = w / res;
    
    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const index = (i * (res + 1) + j) * 3;
        
        const x = (i - res / 2) * spacing;
        const z = (j - res / 2) * spacing;
        
        // Base wave animation
        const waveX = Math.sin(x * frequency + time) * amplitude * 0.3;
        const waveZ = Math.sin(z * frequency + time * 1.2) * amplitude * 0.2;
        const ripple = Math.sin(Math.sqrt(x * x + z * z) * frequency - time * 2) * amplitude * 0.4;
        
        // Mouse interaction - create a circular influence
        const mouseDistance = Math.sqrt(
          Math.pow(x - mousePosition.x, 2) + 
          Math.pow(z - mousePosition.z, 2)
        );
        
        const mouseInfluence = Math.max(0, 1 - mouseDistance / 4);
        const mouseEffect = mouseInfluence * amplitude * 1.5 * Math.sin(time * 3);
        
        // Combine all effects
        let y = waveX + waveZ + ripple + mouseEffect;
        
        // Add some noise for more organic feel
        y += Math.sin(x * 0.8 + time * 0.5) * Math.cos(z * 0.6 + time * 0.7) * amplitude * 0.1;
        
        positionArray[index + 1] = y;
      }
    }
  }, [amplitude, frequency]);
  
  return {
    updateSurface
  };
}
