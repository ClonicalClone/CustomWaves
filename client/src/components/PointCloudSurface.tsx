import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, BufferGeometry, BufferAttribute, Points, PointsMaterial } from 'three';
import * as THREE from 'three';
import { usePointCloud } from '../hooks/usePointCloud';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

interface PointCloudSurfaceProps {
  width?: number;
  height?: number;
  resolution?: number;
}

function PointCloudSurface({ 
  width = 20, 
  height = 20, 
  resolution = 80
}: PointCloudSurfaceProps) {
  const pointsRef = useRef<Points>(null);
  const { mouse } = useThree();
  const mousePosition = useRef(new Vector3(0, 0, 0));
  const targetMousePosition = useRef(new Vector3(0, 0, 0));
  
  // Get controls from store
  const { 
    mathFunction, 
    amplitude, 
    frequency, 
    speed, 
    complexity, 
    colorMode,
    pointSize,
    resolution: storeResolution,
    mouseInfluence,
    animationMode,
    turbulence,
    customEquation,
    equationVariables
  } = useSurfaceControls();
  
  const actualResolution = resolution || storeResolution;
  
  // Generate point cloud data with dynamic colors
  const { positions, colors } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    const spacing = width / actualResolution;
    
    for (let i = 0; i <= actualResolution; i++) {
      for (let j = 0; j <= actualResolution; j++) {
        const x = (i - actualResolution / 2) * spacing;
        const z = (j - actualResolution / 2) * spacing;
        const y = 0; // Start flat, will be animated
        
        positions.push(x, y, z);
        
        // Sophisticated pale color scheme based on mathematical properties
        switch (colorMode) {
          case 'height':
            // Subtle grayscale based on theoretical height variation
            const heightFactor = Math.sin(x * 0.2) * Math.cos(z * 0.2);
            const grayValue = 0.7 + heightFactor * 0.3;
            colors.push(grayValue, grayValue, grayValue);
            break;
          case 'gradient':
            // Pale blue-to-white gradient representing mathematical distance
            const distance = Math.sqrt(x * x + z * z) / (width * 0.5);
            const paleBlue = 0.85 + distance * 0.15;
            colors.push(paleBlue * 0.95, paleBlue * 0.97, paleBlue);
            break;
          case 'velocity':
            // Monochromatic with slight variations
            colors.push(0.8, 0.82, 0.85);
            break;
          default:
            // Pure academic white
            colors.push(0.9, 0.9, 0.9);
        }
      }
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, [width, actualResolution, colorMode]);
  
  // Custom hook for point cloud management
  const { updateSurface } = usePointCloud({
    positions,
    resolution: actualResolution,
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
    equationVariables
  });
  
  // Create geometry and material
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    geom.setAttribute('color', new BufferAttribute(colors, 3));
    return geom;
  }, [positions, colors]);
  
  const material = useMemo(() => {
    return new PointsMaterial({
      size: pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.1,
      sizeAttenuation: true
    });
  }, [pointSize]);
  
  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Smooth mouse position interpolation
    targetMousePosition.current.x = (mouse.x * width) / 2;
    targetMousePosition.current.z = (mouse.y * height) / 2;
    
    mousePosition.current.lerp(targetMousePosition.current, 0.05);
    
    // Update surface based on time and mouse position
    const time = state.clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
    
    updateSurface(
      positionAttribute.array as Float32Array, 
      time, 
      mousePosition.current,
      actualResolution,
      width
    );
    
    positionAttribute.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

export default PointCloudSurface;
