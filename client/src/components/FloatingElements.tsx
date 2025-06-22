import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Octahedron } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface FloatingElementsProps {
  count?: number;
  speed?: number;
  mathFunction?: string;
}

export function FloatingElements({ 
  count = 12, 
  speed = 1,
  mathFunction = 'waves'
}: FloatingElementsProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const elements = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const position = new Vector3(
        (Math.random() - 0.5) * 30,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 30
      );
      
      const rotation = new Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      const scale = 0.2 + Math.random() * 0.3;
      const type = Math.floor(Math.random() * 4);
      const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      
      items.push({
        id: i,
        position,
        rotation,
        scale,
        type,
        color,
        speed: 0.5 + Math.random() * 1.5,
        amplitude: 1 + Math.random() * 3
      });
    }
    return items;
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, index) => {
      const element = elements[index];
      if (!element) return;
      
      // Orbital motion around the surface
      const baseRadius = 15 + Math.sin(time * element.speed * 0.3) * 5;
      const angle = time * element.speed * 0.2 + index;
      
      child.position.x = Math.cos(angle) * baseRadius;
      child.position.z = Math.sin(angle) * baseRadius;
      child.position.y = 5 + Math.sin(time * element.speed + index) * element.amplitude;
      
      // Complex rotation based on math function
      switch (mathFunction) {
        case 'electric':
          child.rotation.x += 0.02 * element.speed;
          child.rotation.y += 0.03 * element.speed;
          child.rotation.z += 0.01 * element.speed;
          break;
        case 'spiral':
          child.rotation.y = time * element.speed * 0.5;
          child.rotation.x = Math.sin(time * element.speed) * 0.3;
          break;
        default:
          child.rotation.x = time * element.speed * 0.3;
          child.rotation.y = time * element.speed * 0.4;
          child.rotation.z = time * element.speed * 0.2;
      }
    });
  });

  const renderElement = (element: any) => {
    const commonProps = {
      scale: [element.scale, element.scale, element.scale],
    };

    const material = (
      <meshStandardMaterial 
        color={element.color}
        transparent
        opacity={0.7}
        emissive={element.color}
        emissiveIntensity={0.2}
      />
    );

    switch (element.type) {
      case 0:
        return <Sphere key={element.id} {...commonProps} args={[1, 16, 16]}>{material}</Sphere>;
      case 1:
        return <Box key={element.id} {...commonProps} args={[1, 1, 1]}>{material}</Box>;
      case 2:
        return <Torus key={element.id} {...commonProps} args={[1, 0.4, 16, 32]}>{material}</Torus>;
      case 3:
        return <Octahedron key={element.id} {...commonProps} args={[1]}>{material}</Octahedron>;
      default:
        return <Sphere key={element.id} {...commonProps} args={[1, 8, 8]}>{material}</Sphere>;
    }
  };

  return (
    <group ref={groupRef}>
      {elements.map(renderElement)}
    </group>
  );
}