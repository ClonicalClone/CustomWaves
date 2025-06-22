import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import { Vector3, Color } from 'three';
import * as THREE from 'three';

interface CinematicEffectsProps {
  mathFunction: string;
  amplitude: number;
  speed: number;
}

export function CinematicEffects({ 
  mathFunction, 
  amplitude, 
  speed 
}: CinematicEffectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const energyRingsRef = useRef<THREE.Group>(null);
  
  // Energy orbs that react to the mathematical function
  const energyOrbs = useMemo(() => {
    const orbs = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 25;
      orbs.push({
        id: i,
        basePosition: new Vector3(
          Math.cos(angle) * radius,
          8 + i * 2,
          Math.sin(angle) * radius
        ),
        color: new Color().setHSL((i / 6), 0.8, 0.6),
        phase: i * Math.PI / 3
      });
    }
    return orbs;
  }, []);

  // Energy rings for dramatic effect
  const energyRings = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      radius: 15 + i * 8,
      height: i * 3,
      speed: 0.5 + i * 0.2
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !energyRingsRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Animate energy orbs based on math function
    groupRef.current.children.forEach((child, index) => {
      const orb = energyOrbs[index];
      if (!orb) return;
      
      let intensityMultiplier = 1;
      let movementPattern = 1;
      
      // Different behaviors based on mathematical function
      switch (mathFunction) {
        case 'electric':
          intensityMultiplier = 1.5 + Math.random() * 0.5;
          child.position.x = orb.basePosition.x + (Math.random() - 0.5) * 2;
          child.position.z = orb.basePosition.z + (Math.random() - 0.5) * 2;
          child.position.y = orb.basePosition.y + Math.sin(time * speed * 5 + orb.phase) * amplitude * 2;
          break;
          
        case 'spiral':
          const spiralAngle = time * speed + orb.phase;
          const spiralRadius = 20 + Math.sin(time * speed * 0.5) * 5;
          child.position.x = Math.cos(spiralAngle) * spiralRadius;
          child.position.z = Math.sin(spiralAngle) * spiralRadius;
          child.position.y = orb.basePosition.y + Math.sin(time * speed * 2) * amplitude;
          break;
          
        case 'interference':
          const wave1 = Math.sin(time * speed * 2 + orb.phase);
          const wave2 = Math.sin(time * speed * 3 - orb.phase);
          movementPattern = (wave1 + wave2) * 0.5;
          child.position.copy(orb.basePosition);
          child.position.y += movementPattern * amplitude * 1.5;
          break;
          
        default:
          child.position.x = orb.basePosition.x + Math.sin(time * speed + orb.phase) * 3;
          child.position.z = orb.basePosition.z + Math.cos(time * speed + orb.phase) * 3;
          child.position.y = orb.basePosition.y + Math.sin(time * speed * 2 + orb.phase) * amplitude;
      }
      
      // Scale based on intensity
      const scale = 0.5 + intensityMultiplier * 0.3;
      child.scale.setScalar(scale);
    });
    
    // Animate energy rings
    energyRingsRef.current.children.forEach((ring, index) => {
      const ringData = energyRings[index];
      if (!ringData) return;
      
      ring.rotation.y = time * ringData.speed;
      ring.rotation.x = Math.sin(time * 0.5) * 0.2;
      
      const pulsation = 1 + Math.sin(time * speed * 2 + index) * 0.2;
      ring.scale.setScalar(pulsation);
      
      // Position rings dynamically
      ring.position.y = ringData.height + Math.sin(time * speed + index) * 2;
    });
  });

  return (
    <group>
      {/* Energy Orbs */}
      <group ref={groupRef}>
        {energyOrbs.map((orb) => (
          <Sphere key={orb.id} args={[0.5, 16, 16]} position={orb.basePosition}>
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </Sphere>
        ))}
      </group>
      
      {/* Energy Rings */}
      <group ref={energyRingsRef}>
        {energyRings.map((ring) => (
          <Ring 
            key={ring.id} 
            args={[ring.radius - 1, ring.radius + 1, 32]}
            position={[0, ring.height, 0]}
          >
            <meshStandardMaterial
              color="#4a90e2"
              emissive="#4a90e2"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        ))}
      </group>
    </group>
  );
}