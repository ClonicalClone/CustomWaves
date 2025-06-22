import { useCallback } from 'react';
import { Vector3 } from 'three';

export type MathFunction = 'waves' | 'sin' | 'cos' | 'tan' | 'electric' | 'ripples' | 'spiral' | 'interference' | 'laplace' | 'fourier' | 'bessel' | 'legendre';
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
        // Pure sine wave with academic precision
        const primarySine = Math.sin(x * freq + timeSpeed) * amplitude;
        const harmonicSine = Math.sin(z * freq + timeSpeed * 0.618) * amplitude * 0.382; // Golden ratio harmonics
        const phaseSine = Math.sin((x + z) * freq * 0.5 + timeSpeed * 0.5) * amplitude * 0.236;
        return primarySine + harmonicSine + phaseSine + mouseEffect;
      
      case 'cos':
        // Cosine with mathematical elegance
        const primaryCos = Math.cos(x * freq + timeSpeed) * amplitude;
        const secondaryCos = Math.cos(z * freq + timeSpeed * 0.707) * amplitude * 0.707; // √2/2 ratio
        const modulatedCos = Math.cos(x * z * freq * 0.1 + timeSpeed) * amplitude * 0.3;
        return primaryCos + secondaryCos + modulatedCos + mouseEffect;
      
      case 'tan':
        // Sophisticated tangent with controlled periodicity
        const period = Math.PI / (freq * complexity);
        const tanX = Math.atan(Math.sin(x / period + timeSpeed)) * amplitude * 0.8;
        const tanZ = Math.atan(Math.sin(z / period + timeSpeed * 0.75)) * amplitude * 0.6;
        const crossTan = Math.atan(Math.sin((x * z) / (period * period) + timeSpeed * 0.5)) * amplitude * 0.4;
        return tanX + tanZ + crossTan + mouseEffect;
      
      case 'electric':
        // Sophisticated field equations mimicking electromagnetic phenomena
        const fieldStrength = Math.exp(-Math.abs(x) * 0.05) * Math.exp(-Math.abs(z) * 0.05);
        const waveFunction = Math.sin(x * freq * 1.414 + timeSpeed * 2) * fieldStrength;
        const fieldLines = Math.cos(z * freq * 1.732 + timeSpeed * 1.5) * fieldStrength;
        const interference = Math.sin(Math.sqrt(x*x + z*z) * freq - timeSpeed * 3) * fieldStrength * 0.5;
        return (waveFunction + fieldLines + interference) * amplitude + mouseEffect;
      
      case 'ripples':
        // Hydrodynamic wave equations with realistic dampening
        const radialDistance = Math.sqrt(x * x + z * z);
        const primaryRipple = Math.sin(radialDistance * freq - timeSpeed * 2.236) * Math.exp(-radialDistance * 0.08);
        const secondaryRipple = Math.sin(radialDistance * freq * 1.618 - timeSpeed * 1.618) * Math.exp(-radialDistance * 0.12) * 0.618;
        const surfaceTension = Math.cos(radialDistance * freq * 0.5 - timeSpeed) * Math.exp(-radialDistance * 0.15) * 0.3;
        return (primaryRipple + secondaryRipple + surfaceTension) * amplitude + mouseEffect;
      
      case 'spiral':
        // Logarithmic spiral with mathematical precision (Fibonacci spiral approximation)
        const polarAngle = Math.atan2(z, x);
        const polarRadius = Math.sqrt(x * x + z * z);
        const fibonacciSpiral = Math.sin(polarRadius * freq * 0.618 + polarAngle * 5.236 + timeSpeed);
        const goldenRatio = 1.618033988749;
        const spiralDecay = Math.exp(-polarRadius * 0.03);
        const radialModulation = Math.cos(polarAngle * goldenRatio + timeSpeed * 0.618) * 0.382;
        return (fibonacciSpiral * spiralDecay + radialModulation) * amplitude + mouseEffect;
      
      case 'interference':
        // Young's double-slit experiment mathematical model
        const sourceDistance = 6; // Distance between interference sources
        const distance1 = Math.sqrt((x - sourceDistance/2) * (x - sourceDistance/2) + z * z);
        const distance2 = Math.sqrt((x + sourceDistance/2) * (x + sourceDistance/2) + z * z);
        const pathDifference = distance2 - distance1;
        const waveNumber = freq * 2 * Math.PI;
        const interferencePattern = Math.cos(waveNumber * pathDifference / 2) * 
                                  Math.exp(-Math.min(distance1, distance2) * 0.04);
        const carrierWave = Math.sin(waveNumber * (distance1 + distance2) / 2 - timeSpeed * 2);
        return interferencePattern * carrierWave * amplitude + mouseEffect;
      
      case 'laplace':
        // Laplace equation solution in 2D (harmonic functions)
        const r = Math.sqrt(x * x + z * z);
        const theta = Math.atan2(z, x);
        const laplacian = r * Math.cos(freq * theta + timeSpeed) * Math.exp(-r * 0.1) +
                         r * Math.sin(freq * theta * 2 + timeSpeed * 0.7) * Math.exp(-r * 0.08) * 0.5;
        return laplacian * amplitude + mouseEffect;
      
      case 'fourier':
        // Fourier series representation
        let fourierSum = 0;
        for (let n = 1; n <= 5; n++) {
          const harmonic = Math.sin(n * freq * x + timeSpeed) / n + Math.sin(n * freq * z + timeSpeed * 1.2) / n;
          fourierSum += harmonic;
        }
        const fourierModulation = Math.cos(x * z * freq * 0.1 + timeSpeed * 0.5) * 0.3;
        return (fourierSum + fourierModulation) * amplitude * 0.3 + mouseEffect;
      
      case 'bessel':
        // Bessel function approximation
        const besselArg = freq * Math.sqrt(x * x + z * z) - timeSpeed;
        const besselJ0 = Math.cos(besselArg) * Math.exp(-Math.abs(besselArg) * 0.1);
        const besselJ1 = Math.sin(besselArg) * besselArg * Math.exp(-Math.abs(besselArg) * 0.1) * 0.5;
        const besselModulation = Math.sin(theta * 3 + timeSpeed * 0.8) * 0.2;
        return (besselJ0 + besselJ1 + besselModulation) * amplitude + mouseEffect;
      
      case 'legendre':
        // Legendre polynomials in normalized coordinates
        const xNorm = x / (width * 0.5);
        const zNorm = z / (width * 0.5);
        const P2x = 0.5 * (3 * xNorm * xNorm - 1);
        const P2z = 0.5 * (3 * zNorm * zNorm - 1);
        const P3x = 0.5 * xNorm * (5 * xNorm * xNorm - 3);
        const legendre = (P2x + P2z) * Math.sin(timeSpeed * freq) + P3x * Math.cos(timeSpeed * freq * 0.7) * 0.6;
        return legendre * amplitude + mouseEffect;
      
      case 'waves':
      default:
        // Complex wave superposition with mathematical sophistication
        const fundamentalFreq = freq * complexity;
        const waveX = Math.sin(x * fundamentalFreq + timeSpeed) * 0.4;
        const waveZ = Math.sin(z * fundamentalFreq + timeSpeed * 1.414) * 0.3; // √2 phase relationship
        const crossWave = Math.sin((x + z) * fundamentalFreq * 0.707 + timeSpeed * 0.866) * 0.25; // √3/2
        const radialWave = Math.sin(Math.sqrt(x * x + z * z) * fundamentalFreq - timeSpeed * 2) * 0.35;
        const harmonicModulation = Math.sin(x * fundamentalFreq * 0.5) * Math.cos(z * fundamentalFreq * 0.5) * 
                                 Math.sin(timeSpeed * 0.618) * 0.15; // Golden ratio modulation
        return (waveX + waveZ + crossWave + radialWave + harmonicModulation) * amplitude + mouseEffect;
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
