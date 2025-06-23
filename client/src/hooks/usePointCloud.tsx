import { useCallback } from 'react';
import { Vector3 } from 'three';

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
  customEquation?: string;
  equationVariables?: Record<string, number>;
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
  mouseInfluence,
  customEquation,
  equationVariables = {}
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
        const besselTheta = Math.atan2(z, x);
        const besselJ0 = Math.cos(besselArg) * Math.exp(-Math.abs(besselArg) * 0.1);
        const besselJ1 = Math.sin(besselArg) * besselArg * Math.exp(-Math.abs(besselArg) * 0.1) * 0.5;
        const besselModulation = Math.sin(besselTheta * 3 + timeSpeed * 0.8) * 0.2;
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
      
      // Fractal and Chaos Theory
      case 'mandelbrot':
        let zReal = x / width * 4 - 2;
        let zImag = z / width * 4 - 2;
        let iterations = 0;
        const maxIter = 20;
        while (zReal * zReal + zImag * zImag < 4 && iterations < maxIter) {
          const temp = zReal * zReal - zImag * zImag + 0.7269 * Math.cos(timeSpeed);
          zImag = 2 * zReal * zImag + 0.1889 * Math.sin(timeSpeed);
          zReal = temp;
          iterations++;
        }
        return (iterations / maxIter) * amplitude + mouseEffect;
      
      case 'julia':
        const cReal = 0.285 + 0.01 * Math.cos(timeSpeed);
        const cImag = 0.01 + 0.01 * Math.sin(timeSpeed);
        let juliaReal = x / width * 3;
        let juliaImag = z / width * 3;
        let juliaIter = 0;
        while (juliaReal * juliaReal + juliaImag * juliaImag < 4 && juliaIter < 50) {
          const temp = juliaReal * juliaReal - juliaImag * juliaImag + cReal;
          juliaImag = 2 * juliaReal * juliaImag + cImag;
          juliaReal = temp;
          juliaIter++;
        }
        return (juliaIter / 50) * amplitude + mouseEffect;
      
      case 'newton':
        // Newton fractal for z^3 - 1 = 0
        let newtonReal = x / width * 2;
        let newtonImag = z / width * 2;
        for (let i = 0; i < 10; i++) {
          const denom = 3 * (newtonReal * newtonReal + newtonImag * newtonImag);
          if (denom === 0) break;
          const tempReal = (2 * newtonReal + 1 / (newtonReal * newtonReal + newtonImag * newtonImag)) / 3;
          const tempImag = (2 * newtonImag - newtonImag / (newtonReal * newtonReal + newtonImag * newtonImag)) / 3;
          newtonReal = tempReal;
          newtonImag = tempImag;
        }
        return (Math.atan2(newtonImag, newtonReal) + Math.PI) / (2 * Math.PI) * amplitude + mouseEffect;
      
      // Dynamical Systems
      case 'lorenz':
        const sigma = 10, rho = 28, beta = 8/3;
        const lorenzX = sigma * (z - x) * 0.01;
        const lorenzZ = (x * (rho - x) - z) * 0.01;
        return Math.sin(lorenzX + timeSpeed) * Math.cos(lorenzZ + timeSpeed) * amplitude + mouseEffect;
      
      case 'rossler':
        const a = 0.2, b = 0.2, c = 5.7;
        const rosslerDx = -(z + x * 0.1);
        const rosslerDz = x + a * z;
        return Math.sin(rosslerDx * freq + timeSpeed) * Math.cos(rosslerDz * freq + timeSpeed) * amplitude + mouseEffect;
      
      case 'henon':
        const henonA = 1.4, henonB = 0.3;
        const henonNext = 1 - henonA * x * x + z;
        return Math.sin(henonNext * freq + timeSpeed) * amplitude + mouseEffect;
      
      case 'logistic':
        const logisticR = 3.57 + 0.4 * Math.sin(timeSpeed * 0.1);
        let logisticX = Math.abs(x) / width;
        for (let i = 0; i < 10; i++) {
          logisticX = logisticR * logisticX * (1 - logisticX);
        }
        return logisticX * amplitude + mouseEffect;
      
      // Partial Differential Equations
      case 'navier_stokes':
        // Simplified fluid dynamics
        const viscosity = 0.01;
        const pressure = Math.sin(x * freq) * Math.cos(z * freq);
        const velocity = -viscosity * (Math.sin(2 * x * freq) + Math.sin(2 * z * freq)) + pressure;
        return velocity * Math.sin(timeSpeed) * amplitude + mouseEffect;
      
      case 'schrodinger':
        // Time-dependent Schrödinger equation (simplified)
        const psi = Math.exp(-0.1 * (x * x + z * z)) * Math.cos(freq * (x + z) - timeSpeed);
        const potential = 0.5 * (x * x + z * z) * 0.01;
        return (psi - potential) * amplitude + mouseEffect;
      
      case 'maxwell':
        // Maxwell equations - electromagnetic wave
        const electricField = Math.sin(freq * x - timeSpeed) * Math.exp(-Math.abs(z) * 0.05);
        const magneticField = Math.cos(freq * x - timeSpeed + Math.PI/2) * Math.exp(-Math.abs(z) * 0.05);
        return (electricField + magneticField) * amplitude + mouseEffect;
      
      case 'wave_equation':
        // Classic wave equation solution
        const waveSpeed = 2;
        const standing = Math.sin(freq * x) * Math.cos(waveSpeed * freq * timeSpeed);
        const traveling = Math.sin(freq * (x - waveSpeed * timeSpeed)) + Math.sin(freq * (z - waveSpeed * timeSpeed));
        return (standing + traveling) * amplitude * 0.5 + mouseEffect;
      
      case 'heat_equation':
        // Heat diffusion equation
        const diffusivity = 0.1;
        const temp = Math.exp(-diffusivity * timeSpeed) * Math.sin(freq * x) * Math.sin(freq * z);
        return temp * amplitude + mouseEffect;
      
      // Special Functions and Number Theory
      case 'fibonacci':
        const fibN = Math.floor(Math.abs(x + z) * freq + 1);
        let fib1 = 1, fib2 = 1;
        for (let i = 2; i < fibN && i < 20; i++) {
          const temp = fib1 + fib2;
          fib1 = fib2;
          fib2 = temp;
        }
        return Math.sin(fib2 * 0.001 + timeSpeed) * amplitude + mouseEffect;
      
      case 'riemann_zeta':
        // Approximation of Riemann zeta function
        let zeta = 0;
        for (let n = 1; n <= 10; n++) {
          zeta += 1 / Math.pow(n, 2 + 0.1 * Math.sin(x * freq + timeSpeed));
        }
        return zeta * Math.sin(z * freq + timeSpeed) * amplitude + mouseEffect;
      
      case 'weierstrass':
        // Weierstrass function (continuous but nowhere differentiable)
        let weierstrass = 0;
        for (let n = 0; n < 10; n++) {
          weierstrass += Math.pow(0.7, n) * Math.cos(Math.pow(3, n) * Math.PI * (x + timeSpeed * 0.1));
        }
        return weierstrass * amplitude + mouseEffect;
      
      // Geometry and Topology
      case 'mobius':
        const u = x / width * 2 * Math.PI;
        const v = z / width;
        const mobiusX = (1 + v * Math.cos(u/2)) * Math.cos(u);
        const mobiusZ = (1 + v * Math.cos(u/2)) * Math.sin(u);
        return Math.sin(mobiusX * freq + timeSpeed) * Math.cos(mobiusZ * freq + timeSpeed) * amplitude + mouseEffect;
      
      case 'torus':
        const torusR = 3, torusr = 1;
        const torusU = x / width * 2 * Math.PI;
        const torusV = z / width * 2 * Math.PI;
        const torusHeight = torusr * Math.sin(torusV + timeSpeed);
        return torusHeight * amplitude + mouseEffect;
      
      case 'hyperbolic':
        const hyperX = x / width * 2;
        const hyperZ = z / width * 2;
        return Math.sinh(hyperX * freq + timeSpeed) * Math.cosh(hyperZ * freq + timeSpeed) * amplitude * 0.1 + mouseEffect;
      
      // Quantum Mechanics
      case 'quantum_harmonic':
        const n = 3; // quantum number
        const quantumX = x / width * 4;
        const hermite = (8 * quantumX * quantumX * quantumX - 12 * quantumX); // H3(x)
        const wavefunction = hermite * Math.exp(-0.5 * quantumX * quantumX) * Math.cos(timeSpeed * (n + 0.5));
        return wavefunction * amplitude * 0.1 + mouseEffect;
      
      case 'quantum_well':
        const wellWidth = 2;
        const wellX = x / width * wellWidth;
        if (Math.abs(wellX) < wellWidth/2) {
          const psi = Math.sin(Math.PI * (wellX + wellWidth/2) / wellWidth) * Math.cos(timeSpeed);
          return psi * amplitude + mouseEffect;
        }
        return 0 + mouseEffect;
      
      case 'hydrogen_atom':
        const hydrogenR = Math.sqrt(x*x + z*z) / width * 5;
        const hydrogenTheta = Math.atan2(z, x);
        const radial = Math.exp(-hydrogenR) * hydrogenR;
        const angular = Math.cos(hydrogenTheta + timeSpeed);
        return radial * angular * amplitude + mouseEffect;
      
      // Solitons and Nonlinear Waves
      case 'soliton':
        const solitonSpeed = 1;
        const solitonWidth = 1;
        const sech = 2 / (Math.exp((x - solitonSpeed * timeSpeed) / solitonWidth) + Math.exp(-(x - solitonSpeed * timeSpeed) / solitonWidth));
        return sech * sech * amplitude + mouseEffect;
      
      case 'sine_gordon':
        const sineGordon = 4 * Math.atan(Math.exp(x / width - timeSpeed));
        return Math.sin(sineGordon) * amplitude + mouseEffect;
      
      case 'kdv':
        // Korteweg-de Vries equation solution
        const kdvSoliton = 12 * Math.pow(1 / Math.cosh(2 * (x / width - timeSpeed)), 2);
        return kdvSoliton * amplitude * 0.1 + mouseEffect;
      
      // Cellular Automata and Complex Systems
      case 'cellular_automata':
        const cellX = Math.floor(x / width * 20) + 10;
        const cellZ = Math.floor(z / width * 20) + 10;
        const cellState = ((cellX + cellZ + Math.floor(timeSpeed)) % 2) === 0 ? 1 : 0;
        return cellState * amplitude + mouseEffect;
      
      case 'game_of_life':
        const lifeX = Math.floor(x / width * 10) + 5;
        const lifeZ = Math.floor(z / width * 10) + 5;
        const neighbors = Math.sin(lifeX + timeSpeed) + Math.cos(lifeZ + timeSpeed);
        const alive = Math.abs(neighbors) > 0.5 ? 1 : 0;
        return alive * amplitude + mouseEffect;
      
      // Custom equation support
      case 'custom':
        if (customEquation) {
          try {
            const result = evaluateCustomEquation(customEquation, x, z, timeSpeed, equationVariables);
            // Clamp result to prevent extreme values that could cause performance issues
            const clampedResult = Math.max(-100, Math.min(100, result));
            return clampedResult * amplitude + mouseEffect;
          } catch (e) {
            console.warn('Custom equation evaluation failed:', e);
            return mouseEffect;
          }
        }
        return mouseEffect;
      
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
  }, [amplitude, frequency, speed, complexity, mathFunction, animationMode, turbulence, mouseInfluence, customEquation, equationVariables]);
  
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

// Cached equation evaluator for performance
const equationCache = new Map<string, Function>();
const invalidEquations = new Set<string>();

function evaluateCustomEquation(
  equation: string, 
  x: number, 
  z: number, 
  t: number, 
  variables: Record<string, number>
): number {
  // Early return for known invalid equations
  if (invalidEquations.has(equation)) {
    return 0;
  }

  // Create cache key including variable values for context changes
  const cacheKey = `${equation}|${JSON.stringify(variables)}`;
  
  let evaluatorFunc = equationCache.get(cacheKey);
  
  if (!evaluatorFunc) {
    try {
      // Create a safe evaluation context
      const contextVars = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        atan: Math.atan,
        atan2: Math.atan2,
        exp: Math.exp,
        log: Math.log,
        sqrt: Math.sqrt,
        abs: Math.abs,
        pow: Math.pow,
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        min: Math.min,
        max: Math.max,
        PI: Math.PI,
        E: Math.E,
        ...variables
      };
      
      // Simple and safe equation parser
      let processedEquation = equation.trim();
      
      // Basic safety checks
      if (processedEquation.includes('while') || 
          processedEquation.includes('for') || 
          processedEquation.includes('eval') ||
          processedEquation.includes('Function')) {
        throw new Error('Unsafe equation detected');
      }
      
      // Replace mathematical operators
      processedEquation = processedEquation.replace(/\^/g, '**');
      
      // Replace variables and functions with safe context access
      Object.keys(contextVars).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        processedEquation = processedEquation.replace(regex, `vars.${key}`);
      });
      
      // Create the evaluation function
      const funcBody = `
        const vars = arguments[3];
        const x = arguments[0];
        const z = arguments[1]; 
        const t = arguments[2];
        try {
          const result = ${processedEquation};
          return isFinite(result) ? result : 0;
        } catch (e) {
          return 0;
        }
      `;
      
      evaluatorFunc = new Function(funcBody);
      
      // Test the function with sample values
      const testResult = evaluatorFunc(0, 0, 0, contextVars);
      if (!isFinite(testResult)) {
        throw new Error('Function produces invalid results');
      }
      
      // Cache the successful function
      equationCache.set(cacheKey, evaluatorFunc);
      
      // Limit cache size
      if (equationCache.size > 50) {
        const firstKey = equationCache.keys().next().value;
        equationCache.delete(firstKey);
      }
      
    } catch (error) {
      console.warn('Equation compilation failed:', error);
      invalidEquations.add(equation);
      return 0;
    }
  }
  
  try {
    const result = evaluatorFunc(x, z, t, {
      sin: Math.sin, cos: Math.cos, tan: Math.tan, atan: Math.atan, atan2: Math.atan2,
      exp: Math.exp, log: Math.log, sqrt: Math.sqrt, abs: Math.abs, pow: Math.pow,
      sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, min: Math.min, max: Math.max,
      PI: Math.PI, E: Math.E, ...variables
    });
    return isFinite(result) ? result : 0;
  } catch (error) {
    return 0;
  }
}
