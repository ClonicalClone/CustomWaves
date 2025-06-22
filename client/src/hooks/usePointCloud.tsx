import { useCallback } from 'react';
import { Vector3 } from 'three';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference';
export type ColorMode = 'height' | 'velocity' | 'gradient' | 'rainbow';
export type AnimationMode = 'smooth' | 'pulse' | 'chaotic' | 'freeze';

interface UsePointCloudProps {
  positions: Float32Array;
  resolution: number;
  width: number;
  amplitude: number;
  frequency: number;
  speed: number;
  complexity: number;
  mathFunction: MathFunction;
  animationMode: AnimationMode;
  turbulence: number;
  mouseInfluence: number;
}

export function usePointCloud({ 
  positions, 
  resolution, 
  width, 
  amplitude, 
  frequency,
  speed,
  complexity,
  mathFunction,
  animationMode,
  turbulence,
  mouseInfluence
}: UsePointCloudProps) {
  
  const calculateMathFunction = useCallback((
    x: number,
    z: number,
    time: number,
    mouseInfluence: number,
    mouseEffect: number
  ): number => {
    const timeSpeed = time * speed;
    const freq = frequency * complexity;
    
    switch (mathFunction) {
      case 'sin':
        return Math.sin(x * freq + timeSpeed) * amplitude + 
               Math.sin(z * freq + timeSpeed * 0.8) * amplitude * 0.5 + mouseEffect;
      
      case 'cos':
        return Math.cos(x * freq + timeSpeed) * amplitude + 
               Math.cos(z * freq + timeSpeed * 0.7) * amplitude * 0.6 + mouseEffect;
      
      case 'tan':
        // Clamp tan to prevent extreme values
        const tanX = Math.max(-2, Math.min(2, Math.tan(x * freq * 0.3 + timeSpeed) * 0.3));
        const tanZ = Math.max(-2, Math.min(2, Math.tan(z * freq * 0.3 + timeSpeed * 0.5) * 0.3));
        return (tanX + tanZ) * amplitude + mouseEffect;
      
      case 'electric':
        // Simulate electrical current with random spikes and smooth flows
        const electricNoise = (Math.random() - 0.5) * 0.1;
        const current = Math.sin(x * freq * 2 + timeSpeed * 3) * Math.exp(-Math.abs(x) * 0.1);
        const discharge = Math.cos(z * freq * 1.5 + timeSpeed * 2.5) * Math.exp(-Math.abs(z) * 0.1);
        const spark = mouseInfluence > 0.5 ? Math.random() * 2 - 1 : 0;
        return (current + discharge + electricNoise + spark) * amplitude + mouseEffect;
      
      case 'ripples':
        const distance = Math.sqrt(x * x + z * z);
        const ripple1 = Math.sin(distance * freq - timeSpeed * 2) * Math.exp(-distance * 0.1);
        const ripple2 = Math.sin(distance * freq * 1.3 - timeSpeed * 1.5) * Math.exp(-distance * 0.15);
        return (ripple1 + ripple2 * 0.5) * amplitude + mouseEffect;
      
      case 'spiral':
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z);
        const spiral = Math.sin(radius * freq + angle * 3 + timeSpeed) * Math.exp(-radius * 0.05);
        const twist = Math.cos(angle * 5 + timeSpeed * 0.5) * 0.3;
        return (spiral + twist) * amplitude + mouseEffect;
      
      case 'interference':
        // Two wave sources creating interference patterns
        const wave1 = Math.sin(Math.sqrt((x - 3) * (x - 3) + z * z) * freq - timeSpeed);
        const wave2 = Math.sin(Math.sqrt((x + 3) * (x + 3) + z * z) * freq - timeSpeed);
        const interference = (wave1 + wave2) * 0.5;
        return interference * amplitude + mouseEffect;
      
      case 'waves':
      default:
        const waveX = Math.sin(x * freq + timeSpeed) * 0.3;
        const waveZ = Math.sin(z * freq + timeSpeed * 1.2) * 0.2;
        const ripple = Math.sin(Math.sqrt(x * x + z * z) * freq - timeSpeed * 2) * 0.4;
        const wavesNoise = Math.sin(x * 0.8 + timeSpeed * 0.5) * Math.cos(z * 0.6 + timeSpeed * 0.7) * 0.1;
        return (waveX + waveZ + ripple + wavesNoise) * amplitude + mouseEffect;
    }
  }, [amplitude, frequency, speed, complexity, mathFunction, animationMode, turbulence, mouseInfluence]);
  
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
        
        // Mouse interaction - create a circular influence
        const mouseDistance = Math.sqrt(
          Math.pow(x - mousePosition.x, 2) + 
          Math.pow(z - mousePosition.z, 2)
        );
        
        const mouseInfluenceRadius = Math.max(0, 1 - mouseDistance / 4);
        let mouseEffect = mouseInfluenceRadius * amplitude * mouseInfluence * Math.sin(time * speed * 3);
        
        // Apply animation mode effects
        let animationMultiplier = 1;
        switch (animationMode) {
          case 'pulse':
            animationMultiplier = 0.5 + 0.5 * Math.sin(time * 2);
            break;
          case 'chaotic':
            animationMultiplier = 0.7 + 0.3 * Math.random();
            break;
          case 'freeze':
            animationMultiplier = 0;
            break;
        }
        
        mouseEffect *= animationMultiplier;
        
        // Calculate Y position based on selected mathematical function
        let y = calculateMathFunction(x, z, time, mouseInfluenceRadius, mouseEffect);
        
        // Add turbulence effect
        if (turbulence > 0) {
          const turbulenceEffect = (Math.random() - 0.5) * turbulence * amplitude * 0.3;
          y += turbulenceEffect;
        }
        
        positionArray[index + 1] = y;
      }
    }
  }, [calculateMathFunction]);
  
  return {
    updateSurface
  };
}
