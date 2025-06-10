import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CarbonEmissionParticlesProps {
  emissionSources: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'factory' | 'vehicle' | 'building';
  }>;
  windDirection?: [number, number, number];
  animationSpeed?: number;
}

const CarbonEmissionParticles: React.FC<CarbonEmissionParticlesProps> = ({
  emissionSources,
  windDirection = [1, 0.2, 0],
  animationSpeed = 1
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const { positions, colors, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const sourceIndex = Math.floor(Math.random() * emissionSources.length);
      const source = emissionSources[sourceIndex];
      
      // Initial position near emission source
      positions[i * 3] = source.position[0] + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = source.position[1] + Math.random() * 1;
      positions[i * 3 + 2] = source.position[2] + (Math.random() - 0.5) * 2;
      
      // Velocity based on wind and emission intensity
      velocities[i * 3] = windDirection[0] * (0.5 + Math.random() * 0.5) * source.intensity;
      velocities[i * 3 + 1] = windDirection[1] * (0.3 + Math.random() * 0.4) + 0.1;
      velocities[i * 3 + 2] = windDirection[2] * (0.5 + Math.random() * 0.5);
      
      // Color based on emission type
      const color = source.type === 'factory' ? [0.8, 0.2, 0.1] :
                   source.type === 'vehicle' ? [0.6, 0.3, 0.2] :
                   [0.4, 0.4, 0.4];
      
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
      
      // Random lifetime
      lifetimes[i] = Math.random() * 10 + 5;
    }
    
    return { positions, colors, velocities, lifetimes };
  }, [emissionSources]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const colorAttribute = pointsRef.current.geometry.attributes.color;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Update position based on velocity
      positions[i3] += velocities[i3] * delta * animationSpeed;
      positions[i3 + 1] += velocities[i3 + 1] * delta * animationSpeed;
      positions[i3 + 2] += velocities[i3 + 2] * delta * animationSpeed;
      
      // Add turbulence
      positions[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
      positions[i3 + 2] += Math.cos(time * 0.3 + i * 0.1) * 0.01;
      
      // Fade with height and distance
      const height = positions[i3 + 1];
      const distanceFromSource = Math.sqrt(
        Math.pow(positions[i3], 2) + Math.pow(positions[i3 + 2], 2)
      );
      
      const alpha = Math.max(0, 1 - (height / 15) - (distanceFromSource / 20));
      colors[i3] *= alpha > 0.1 ? 1 : 0.95; // Fade color
      colors[i3 + 1] *= alpha > 0.1 ? 1 : 0.95;
      colors[i3 + 2] *= alpha > 0.1 ? 1 : 0.95;
      
      // Reset particle if it's too far or faded
      if (alpha <= 0.05 || height > 20 || distanceFromSource > 25) {
        const sourceIndex = Math.floor(Math.random() * emissionSources.length);
        const source = emissionSources[sourceIndex];
        
        positions[i3] = source.position[0] + (Math.random() - 0.5) * 2;
        positions[i3 + 1] = source.position[1] + Math.random() * 1;
        positions[i3 + 2] = source.position[2] + (Math.random() - 0.5) * 2;
        
        // Reset color
        const color = source.type === 'factory' ? [0.8, 0.2, 0.1] :
                     source.type === 'vehicle' ? [0.6, 0.3, 0.2] :
                     [0.4, 0.4, 0.4];
        
        colors[i3] = color[0];
        colors[i3 + 1] = color[1];
        colors[i3 + 2] = color[2];
      }
    }
    
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        opacity={0.6}
        size={0.05}
        sizeAttenuation={true}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default CarbonEmissionParticles;