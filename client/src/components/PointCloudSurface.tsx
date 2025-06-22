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
    turbulence
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
        
        // Dynamic color based on color mode
        switch (colorMode) {
          case 'rainbow':
            const hue = (i + j) / (actualResolution * 2);
            colors.push(
              0.5 + 0.5 * Math.cos(hue * Math.PI * 6),
              0.5 + 0.5 * Math.cos(hue * Math.PI * 6 + 2),
              0.5 + 0.5 * Math.cos(hue * Math.PI * 6 + 4)
            );
            break;
          case 'gradient':
            const grad = Math.sqrt(x * x + z * z) / (width * 0.5);
            colors.push(1 - grad * 0.5, 0.5 + grad * 0.5, 1);
            break;
          default:
            colors.push(1, 1, 1); // White
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
    mouseInfluence
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
      transparent: false,
      alphaTest: 0.5,
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
