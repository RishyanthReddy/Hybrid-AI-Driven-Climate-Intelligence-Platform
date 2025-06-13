import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Plane, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface ClimateHeatmapProps {
  data: any;
  interactive?: boolean;
}

const ClimateHeatmap: React.FC<ClimateHeatmapProps> = ({ data, interactive = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();
  
  // Generate climate data grid
  const climateData = useMemo(() => {
    const gridSize = 32;
    const heightData = new Float32Array(gridSize * gridSize);
    const temperatureData = new Float32Array(gridSize * gridSize);
    const emissionData = new Float32Array(gridSize * gridSize);
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const index = i * gridSize + j;
        const x = (i / gridSize - 0.5) * 2;
        const y = (j / gridSize - 0.5) * 2;
        
        // Generate climate patterns
        const temp = Math.sin(x * 3) * Math.cos(y * 3) * 0.5 + 0.5;
        const emission = Math.random() * 0.8 + 0.2;
        const height = temp * emission * 2;
        
        heightData[index] = height;
        temperatureData[index] = temp;
        emissionData[index] = emission;
      }
    }
    
    return { gridSize, heightData, temperatureData, emissionData };
  }, [data]);

  // Create heatmap geometry
  const heatmapGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(
      20, 20, 
      climateData.gridSize - 1, 
      climateData.gridSize - 1
    );
    
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);
    
    for (let i = 0; i < positions.length; i += 3) {
      const index = Math.floor(i / 3);
      const height = climateData.heightData[index] || 0;
      const temp = climateData.temperatureData[index] || 0;
      const emission = climateData.emissionData[index] || 0;
      
      // Modify height
      positions[i + 2] = height;
      
      // Set colors based on temperature and emissions
      const color = new THREE.Color();
      if (temp > 0.7) {
        color.setRGB(1, 0.2, 0.2); // Hot - Red
      } else if (temp > 0.4) {
        color.setRGB(1, 0.7, 0.2); // Warm - Orange
      } else {
        color.setRGB(0.2, 0.7, 1); // Cool - Blue
      }
      
      // Adjust intensity based on emissions
      color.multiplyScalar(emission);
      
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    
    return geometry;
  }, [climateData]);

  // Climate data points
  const dataPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 18;
      const y = Math.random() * 3 + 0.5;
      
      points.push({
        position: [x, y, z],
        temperature: 15 + Math.random() * 20,
        co2Level: 300 + Math.random() * 100,
        airQuality: Math.random() * 100,
        type: Math.random() > 0.5 ? 'sensor' : 'station'
      });
    }
    return points;
  }, []);

  // Animation - disabled to prevent auto-zoom issues
  // useFrame((state) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.001;
  //   }
  // });

  // Data Point Component
  const ClimateDataPoint: React.FC<{ point: any; index: number }> = ({ point, index }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = React.useState(false);
    
    // Disabled data point animation to prevent auto-zoom issues
    // useFrame((state) => {
    //   if (meshRef.current) {
    //     meshRef.current.position.y = point.position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    //   }
    // });

    const pointColor = useMemo(() => {
      const temp = point.temperature;
      if (temp > 25) return new THREE.Color(0xff4444); // Hot
      if (temp > 15) return new THREE.Color(0xffaa44); // Warm
      return new THREE.Color(0x4444ff); // Cool
    }, [point.temperature]);

    return (
      <group position={point.position}>
        <Sphere
          ref={meshRef}
          args={[0.15, 8, 8]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={pointColor}
            emissive={pointColor}
            emissiveIntensity={hovered ? 0.5 : 0.3}
            transparent
            opacity={0.8}
          />
        </Sphere>
        
        {hovered && (
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {`${point.temperature.toFixed(1)}°C\nCO₂: ${point.co2Level.toFixed(0)}ppm\nAQI: ${point.airQuality.toFixed(0)}`}
          </Text>
        )}
      </group>
    );
  };

  // Emission Particles
  const EmissionParticles: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 300;
    
    const particles = useMemo(() => {
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Start from various emission points
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = Math.random() * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        // Upward motion with slight drift
        velocities[i3] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 1] = Math.random() * 0.02 + 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
        
        // Emission colors (gray to red)
        const intensity = Math.random();
        colors[i3] = 0.5 + intensity * 0.5;
        colors[i3 + 1] = 0.3 + intensity * 0.2;
        colors[i3 + 2] = 0.3 + intensity * 0.2;
        
        sizes[i] = Math.random() * 0.05 + 0.02;
      }
      
      return { positions, velocities, colors, sizes };
    }, []);

    // Disabled particle animation to prevent auto-zoom issues
    // useFrame(() => {
    //   if (particlesRef.current) {
    //     const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    //
    //     for (let i = 0; i < particleCount; i++) {
    //       const i3 = i * 3;
    //
    //       // Update positions
    //       positions[i3] += particles.velocities[i3];
    //       positions[i3 + 1] += particles.velocities[i3 + 1];
    //       positions[i3 + 2] += particles.velocities[i3 + 2];
    //
    //       // Reset particles that go too high
    //       if (positions[i3 + 1] > 10) {
    //         positions[i3] = (Math.random() - 0.5) * 20;
    //         positions[i3 + 1] = 0;
    //         positions[i3 + 2] = (Math.random() - 0.5) * 20;
    //       }
    //
    //       // Wrap around horizontally
    //       if (Math.abs(positions[i3]) > 12) {
    //         positions[i3] = -positions[i3] * 0.5;
    //       }
    //       if (Math.abs(positions[i3 + 2]) > 12) {
    //         positions[i3 + 2] = -positions[i3 + 2] * 0.5;
    //       }
    //     }
    //
    //     particlesRef.current.geometry.attributes.position.needsUpdate = true;
    //   }
    // });

    return (
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.6}
          size={0.05}
          sizeAttenuation
        />
      </points>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={0xffffff}
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color={0x88ccff}
        distance={20}
      />
      
      {/* Heatmap surface */}
      <mesh geometry={heatmapGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial
          vertexColors
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh geometry={heatmapGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <meshBasicMaterial
          color={0x44aaff}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Climate data points */}
      {dataPoints.map((point, index) => (
        <ClimateDataPoint key={index} point={point} index={index} />
      ))}
      
      {/* Emission particles */}
      <EmissionParticles />
      
      {/* Legend */}
      <group position={[-12, 3, 0]}>
        <Text
          fontSize={0.6}
          color="white"
          anchorX="left"
          anchorY="top"
        >
          Climate Impact Heatmap
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.3}
          color="rgba(255,255,255,0.7)"
          anchorX="left"
          anchorY="top"
        >
          Red: High Temperature/Emissions{'\n'}
          Orange: Moderate Levels{'\n'}
          Blue: Low Temperature/Emissions
        </Text>
      </group>
      
      {/* Temperature scale */}
      <group position={[12, 3, 0]}>
        {[
          { color: 0xff4444, label: '>25°C', y: 0 },
          { color: 0xffaa44, label: '15-25°C', y: -0.5 },
          { color: 0x4444ff, label: '<15°C', y: -1 }
        ].map((item, index) => (
          <group key={index} position={[0, item.y, 0]}>
            <Sphere args={[0.1, 8, 8]}>
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={0.3}
              />
            </Sphere>
            <Text
              position={[0.5, 0, 0]}
              fontSize={0.3}
              color="white"
              anchorX="left"
              anchorY="middle"
            >
              {item.label}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
};

export default ClimateHeatmap;
