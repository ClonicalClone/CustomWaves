import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface GridOverlayProps {
  size?: number;
  divisions?: number;
  color?: string;
  opacity?: number;
}

export function GridOverlay({ 
  size = 20, 
  divisions = 20, 
  color = '#333333', 
  opacity = 0.3 
}: GridOverlayProps) {
  const lines = useMemo(() => {
    const lineGeometries = [];
    const step = size / divisions;
    const halfSize = size / 2;

    // Create grid lines
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      
      // Vertical lines
      lineGeometries.push([
        new THREE.Vector3(pos, 0, -halfSize),
        new THREE.Vector3(pos, 0, halfSize)
      ]);
      
      // Horizontal lines
      lineGeometries.push([
        new THREE.Vector3(-halfSize, 0, pos),
        new THREE.Vector3(halfSize, 0, pos)
      ]);
    }

    return lineGeometries;
  }, [size, divisions]);

  return (
    <group>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={color}
          lineWidth={1}
          transparent
          opacity={opacity}
        />
      ))}
    </group>
  );
}