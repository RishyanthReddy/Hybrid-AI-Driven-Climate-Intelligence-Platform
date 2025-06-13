import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleSystemProps {
  count?: number;
  type?: 'energy' | 'carbon' | 'climate';
  bounds?: [number, number, number];
  intensity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 1000, 
  type = 'energy', 
  bounds = [20, 10, 20],
  intensity = 1 
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const { gl } = useThree();
  
  // Create particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const ages = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random initial positions
      positions[i3] = (Math.random() - 0.5) * bounds[0];
      positions[i3 + 1] = (Math.random() - 0.5) * bounds[1];
      positions[i3 + 2] = (Math.random() - 0.5) * bounds[2];
      
      // Different behavior based on type
      switch (type) {
        case 'energy':
          // Energy particles flow in patterns
          velocities[i3] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 1] = Math.random() * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
          
          // Blue-cyan energy colors
          const energyHue = 0.5 + Math.random() * 0.2;
          const energyColor = new THREE.Color().setHSL(energyHue, 0.8, 0.6);
          colors[i3] = energyColor.r;
          colors[i3 + 1] = energyColor.g;
          colors[i3 + 2] = energyColor.b;
          break;
          
        case 'carbon':
          // Carbon particles rise and disperse
          velocities[i3] = (Math.random() - 0.5) * 0.005;
          velocities[i3 + 1] = Math.random() * 0.03 + 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;
          
          // Gray to red carbon colors
          const carbonIntensity = Math.random();
          colors[i3] = 0.3 + carbonIntensity * 0.7;
          colors[i3 + 1] = 0.2 + carbonIntensity * 0.3;
          colors[i3 + 2] = 0.2 + carbonIntensity * 0.3;
          break;
          
        case 'climate':
          // Climate particles swirl and flow
          velocities[i3] = Math.sin(i * 0.1) * 0.01;
          velocities[i3 + 1] = Math.cos(i * 0.1) * 0.005;
          velocities[i3 + 2] = Math.sin(i * 0.15) * 0.01;
          
          // Green-blue climate colors
          const climateHue = 0.3 + Math.random() * 0.4;
          const climateColor = new THREE.Color().setHSL(climateHue, 0.7, 0.5);
          colors[i3] = climateColor.r;
          colors[i3 + 1] = climateColor.g;
          colors[i3 + 2] = climateColor.b;
          break;
      }
      
      sizes[i] = Math.random() * 0.05 + 0.02;
      lifetimes[i] = 5 + Math.random() * 10; // 5-15 seconds
      ages[i] = Math.random() * lifetimes[i];
    }
    
    return { positions, velocities, colors, sizes, lifetimes, ages };
  }, [count, type, bounds]);

  // Create custom shader material for enhanced visual effects
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity }
      },
      vertexShader: `
        uniform float time;
        uniform float intensity;
        attribute float size;
        attribute float age;
        attribute float lifetime;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Calculate alpha based on age
          float normalizedAge = age / lifetime;
          vAlpha = sin(normalizedAge * 3.14159) * intensity;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Create circular particles
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Smooth edges
          float alpha = vAlpha * (1.0 - smoothstep(0.3, 0.5, dist));
          
          // Add some shimmer effect
          alpha *= 0.8 + 0.2 * sin(time * 5.0);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [intensity]);

  // Animation loop - disabled to prevent auto-zoom issues
  // useFrame((state) => {
  //   if (particlesRef.current) {
  //     const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
  //     const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
  //     const ages = particleData.ages;
  //     const lifetimes = particleData.lifetimes;
  //     const deltaTime = state.clock.getDelta();
  //
  //     // Update particle material time uniform
  //     if (particleMaterial.uniforms.time) {
  //       particleMaterial.uniforms.time.value = state.clock.elapsedTime;
  //     }
  //
  //     for (let i = 0; i < count; i++) {
  //       const i3 = i * 3;
  //
  //       // Update age
  //       ages[i] += deltaTime;
  //
  //       // Reset particle if it's too old
  //       if (ages[i] > lifetimes[i]) {
  //         ages[i] = 0;
  //
  //         // Reset position
  //         positions[i3] = (Math.random() - 0.5) * bounds[0];
  //         positions[i3 + 1] = (Math.random() - 0.5) * bounds[1];
  //         positions[i3 + 2] = (Math.random() - 0.5) * bounds[2];
  //       } else {
  //         // Update positions
  //         positions[i3] += particleData.velocities[i3];
  //         positions[i3 + 1] += particleData.velocities[i3 + 1];
  //         positions[i3 + 2] += particleData.velocities[i3 + 2];
  //
  //         // Add some physics based on type
  //         if (type === 'energy') {
  //           // Energy particles are attracted to grid points
  //           const centerForce = 0.0001;
  //           positions[i3] += -positions[i3] * centerForce;
  //           positions[i3 + 2] += -positions[i3 + 2] * centerForce;
  //         } else if (type === 'carbon') {
  //           // Carbon particles rise and spread
  //           particleData.velocities[i3] += (Math.random() - 0.5) * 0.0001;
  //           particleData.velocities[i3 + 2] += (Math.random() - 0.5) * 0.0001;
  //         } else if (type === 'climate') {
  //           // Climate particles follow wind patterns
  //           const windForce = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.0002;
  //           particleData.velocities[i3] += windForce;
  //           particleData.velocities[i3 + 2] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.0002;
  //         }
  //
  //         // Update color intensity based on age
  //         const ageRatio = ages[i] / lifetimes[i];
  //         const colorIntensity = Math.sin(ageRatio * Math.PI);
  //
  //         colors[i3] = particleData.colors[i3] * colorIntensity;
  //         colors[i3 + 1] = particleData.colors[i3 + 1] * colorIntensity;
  //         colors[i3 + 2] = particleData.colors[i3 + 2] * colorIntensity;
  //       }
  //
  //       // Boundary checks
  //       if (Math.abs(positions[i3]) > bounds[0] / 2) {
  //         particleData.velocities[i3] *= -0.5;
  //       }
  //       if (Math.abs(positions[i3 + 1]) > bounds[1] / 2) {
  //         particleData.velocities[i3 + 1] *= -0.5;
  //       }
  //       if (Math.abs(positions[i3 + 2]) > bounds[2] / 2) {
  //         particleData.velocities[i3 + 2] *= -0.5;
  //       }
  //     }
  //
  //     // Mark attributes for update
  //     particlesRef.current.geometry.attributes.position.needsUpdate = true;
  //     particlesRef.current.geometry.attributes.color.needsUpdate = true;
  //     particlesRef.current.geometry.attributes.age.needsUpdate = true;
  //   }
  // });

  return (
    <points ref={particlesRef} material={particleMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particleData.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-age"
          count={count}
          array={particleData.ages}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-lifetime"
          count={count}
          array={particleData.lifetimes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
};

export default ParticleSystem;
