import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointsMaterial, BufferGeometry, BufferAttribute } from 'three';
import * as THREE from 'three';

interface ParticleEffectsProps {
  count?: number;
  speed?: number;
  amplitude?: number;
  color?: string;
}

export function ParticleEffects({ 
  count = 300, 
  speed = 1, 
  amplitude = 5,
  color = '#4a90e2'
}: ParticleEffectsProps) {
  const pointsRef = useRef<Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random starting positions in a sphere
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;
    }
    
    return { positions, velocities };
  }, [count, speed]);

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new PointsMaterial({
      size: 0.03,
      color: color,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
  }, [color]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
    const array = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions with velocities and orbital motion
      array[i3] += velocities[i3] * delta;
      array[i3 + 1] += velocities[i3 + 1] * delta;
      array[i3 + 2] += velocities[i3 + 2] * delta;
      
      // Add orbital motion around the surface
      const distance = Math.sqrt(array[i3] ** 2 + array[i3 + 2] ** 2);
      const angle = Math.atan2(array[i3 + 2], array[i3]);
      const newAngle = angle + time * 0.1;
      
      array[i3] = distance * Math.cos(newAngle);
      array[i3 + 2] = distance * Math.sin(newAngle);
      
      // Add vertical oscillation
      array[i3 + 1] += Math.sin(time * 2 + i * 0.1) * amplitude * 0.1;
      
      // Reset particles that go too far
      if (distance > 30) {
        array[i3] *= 0.3;
        array[i3 + 1] = Math.random() * 10 - 5;
        array[i3 + 2] *= 0.3;
      }
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}