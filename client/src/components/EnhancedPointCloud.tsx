import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, BufferGeometry, BufferAttribute, Points, PointsMaterial, Color } from 'three';
import * as THREE from 'three';
import { usePointCloud } from '../hooks/usePointCloud';
import { useSurfaceControls } from '../lib/stores/useSurfaceControls';

interface EnhancedPointCloudProps {
  width?: number;
  height?: number;
  resolution?: number;
}

export function EnhancedPointCloud({ 
  width = 20, 
  height = 20, 
  resolution = 80
}: EnhancedPointCloudProps) {
  const pointsRef = useRef<Points>(null);
  const trailsRef = useRef<Points>(null);
  const { mouse } = useThree();
  const mousePosition = useRef(new Vector3(0, 0, 0));
  const targetMousePosition = useRef(new Vector3(0, 0, 0));
  const [heightHistory, setHeightHistory] = useState<Float32Array[]>([]);
  
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
    showTrails
  } = useSurfaceControls();
  
  const actualResolution = resolution || storeResolution;
  
  // Generate enhanced point cloud data with dynamic colors and trails
  const { positions, colors, trailPositions } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const trailPositions: number[] = [];
    
    const spacing = width / actualResolution;
    
    for (let i = 0; i <= actualResolution; i++) {
      for (let j = 0; j <= actualResolution; j++) {
        const x = (i - actualResolution / 2) * spacing;
        const z = (j - actualResolution / 2) * spacing;
        const y = 0;
        
        positions.push(x, y, z);
        
        // Create trail positions (multiple layers)
        for (let t = 0; t < 5; t++) {
          trailPositions.push(x, y - t * 0.2, z);
        }
        
        // Enhanced color modes
        let r = 1, g = 1, b = 1;
        
        switch (colorMode) {
          case 'rainbow':
            const hue = (i + j) / (actualResolution * 2);
            r = 0.5 + 0.5 * Math.cos(hue * Math.PI * 6);
            g = 0.5 + 0.5 * Math.cos(hue * Math.PI * 6 + 2);
            b = 0.5 + 0.5 * Math.cos(hue * Math.PI * 6 + 4);
            break;
            
          case 'gradient':
            const distance = Math.sqrt(x * x + z * z) / (width * 0.5);
            r = 1 - distance * 0.5;
            g = 0.3 + distance * 0.7;
            b = 0.8 + distance * 0.2;
            break;
            
          case 'velocity':
            // Will be updated dynamically
            r = 0.2; g = 0.8; b = 1.0;
            break;
            
          default: // height-based
            r = 1; g = 1; b = 1;
        }
        
        colors.push(r, g, b);
      }
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      trailPositions: new Float32Array(trailPositions)
    };
  }, [width, actualResolution, colorMode]);
  
  // Custom hook for enhanced point cloud management
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
  
  // Create geometries and materials
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    geom.setAttribute('color', new BufferAttribute(colors, 3));
    return geom;
  }, [positions, colors]);
  
  const trailGeometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(trailPositions, 3));
    return geom;
  }, [trailPositions]);
  
  const material = useMemo(() => {
    return new PointsMaterial({
      size: pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.1,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
  }, [pointSize]);
  
  const trailMaterial = useMemo(() => {
    return new PointsMaterial({
      size: pointSize * 0.5,
      color: new Color(0x4a90e2),
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
  }, [pointSize]);
  
  // Enhanced animation loop with trails and dynamic colors
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Smooth mouse position interpolation
    targetMousePosition.current.x = (mouse.x * width) / 2;
    targetMousePosition.current.z = (mouse.y * height) / 2;
    mousePosition.current.lerp(targetMousePosition.current, 0.05);
    
    // Update main surface
    const positionAttribute = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
    const colorAttribute = pointsRef.current.geometry.getAttribute('color') as BufferAttribute;
    const posArray = positionAttribute.array as Float32Array;
    const colorArray = colorAttribute.array as Float32Array;
    
    updateSurface(posArray, time, mousePosition.current, actualResolution, width);
    
    // Update dynamic colors based on height and velocity
    if (colorMode === 'height' || colorMode === 'velocity') {
      for (let i = 0; i <= actualResolution; i++) {
        for (let j = 0; j <= actualResolution; j++) {
          const index = (i * (actualResolution + 1) + j) * 3;
          const colorIndex = index;
          
          if (colorMode === 'height') {
            const height = posArray[index + 1];
            const normalizedHeight = (height + amplitude) / (amplitude * 2);
            
            colorArray[colorIndex] = 0.2 + normalizedHeight * 0.8; // Red
            colorArray[colorIndex + 1] = 0.4 + Math.sin(normalizedHeight * Math.PI) * 0.6; // Green
            colorArray[colorIndex + 2] = 1.0 - normalizedHeight * 0.3; // Blue
          } else if (colorMode === 'velocity') {
            const prevHeight = heightHistory[0] ? heightHistory[0][index + 1] : 0;
            const currentHeight = posArray[index + 1];
            const velocity = Math.abs(currentHeight - prevHeight);
            
            colorArray[colorIndex] = velocity * 2; // Red for high velocity
            colorArray[colorIndex + 1] = 0.5 + Math.sin(velocity * 10) * 0.5; // Green oscillation
            colorArray[colorIndex + 2] = 1.0 - velocity; // Blue for low velocity
          }
        }
      }
      colorAttribute.needsUpdate = true;
    }
    
    // Update trails if enabled
    if (showTrails && trailsRef.current) {
      const trailPositionAttribute = trailsRef.current.geometry.getAttribute('position') as BufferAttribute;
      const trailArray = trailPositionAttribute.array as Float32Array;
      
      for (let i = 0; i <= actualResolution; i++) {
        for (let j = 0; j <= actualResolution; j++) {
          const mainIndex = (i * (actualResolution + 1) + j) * 3;
          const currentY = posArray[mainIndex + 1];
          
          // Update trail positions
          for (let t = 0; t < 5; t++) {
            const trailIndex = ((i * (actualResolution + 1) + j) * 5 + t) * 3;
            const delay = t * 0.1;
            const trailY = currentY - Math.sin(time - delay) * amplitude * 0.2;
            
            trailArray[trailIndex + 1] = trailY - t * 0.3;
          }
        }
      }
      trailPositionAttribute.needsUpdate = true;
    }
    
    // Store height history for velocity calculations
    if (time % 0.1 < 0.016) { // Store every ~100ms
      const newHistory = new Float32Array(posArray);
      setHeightHistory(prev => [newHistory, ...prev.slice(0, 4)]);
    }
    
    positionAttribute.needsUpdate = true;
    
    // Add rotation effect for certain animation modes
    if (animationMode === 'chaotic') {
      pointsRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <group>
      {/* Main point cloud */}
      <points ref={pointsRef} geometry={geometry} material={material} />
      
      {/* Trail effects */}
      {showTrails && (
        <points ref={trailsRef} geometry={trailGeometry} material={trailMaterial} />
      )}
    </group>
  );
}