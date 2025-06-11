import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface TerrainGraphProps {
  data: {
    climateData: Array<{
      region: string;
      temperature: number;
      precipitation: number;
      elevation: number;
      riskLevel: number;
    }>;
    energyData: Array<{
      region: string;
      consumption: number;
      production: number;
      efficiency: number;
    }>;
  };
  interactive?: boolean;
}

const TerrainGraph: React.FC<TerrainGraphProps> = ({ data, interactive = true }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const { camera } = useThree();

  // Debug logging
  console.log('TerrainGraph data:', data);
  console.log('Climate data length:', data.climateData?.length);
  console.log('Energy data length:', data.energyData?.length);

  // Ensure we have data to work with
  if (!data.climateData || data.climateData.length === 0) {
    console.warn('No climate data provided to TerrainGraph');
    return (
      <group>
        <Text
          position={[0, 0, 0]}
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Loading Terrain Data...
        </Text>
      </group>
    );
  }

  // Generate 3D wireframe terrain like the reference image
  const terrainGeometry = useMemo(() => {
    console.log('Generating 3D wireframe terrain...');

    const width = 30;
    const height = 30;
    const widthSegments = 50;
    const heightSegments = 50;

    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);

    // Create dramatic 3D terrain with significant elevation changes
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];

      // Normalize coordinates
      const nx = x / width;
      const nz = z / height;

      // Create dramatic terrain features
      let elevation = 0;

      // Large mountain ranges
      elevation += Math.sin(nx * Math.PI * 2) * Math.cos(nz * Math.PI * 2) * 6;

      // Secondary ridges
      elevation += Math.sin(nx * Math.PI * 4 + 1) * Math.cos(nz * Math.PI * 4 + 1) * 3;

      // Valleys and peaks
      elevation += Math.sin(nx * Math.PI * 8) * Math.cos(nz * Math.PI * 8) * 2;

      // Fine detail
      elevation += Math.sin(nx * Math.PI * 16) * Math.cos(nz * Math.PI * 16) * 1;

      // Add some noise for natural variation
      elevation += (Math.random() - 0.5) * 0.5;

      // Apply elevation (Y coordinate is at index i+1 for PlaneGeometry)
      positions[i + 1] = elevation;

      // Color based on elevation with vibrant colors like the reference
      const normalizedElevation = (elevation + 10) / 20; // Normalize to 0-1

      if (normalizedElevation < 0.2) {
        // Deep valleys - blue
        colors[i] = 0.2;
        colors[i + 1] = 0.4;
        colors[i + 2] = 0.9;
      } else if (normalizedElevation < 0.4) {
        // Low areas - cyan/teal
        colors[i] = 0.0;
        colors[i + 1] = 0.8;
        colors[i + 2] = 0.8;
      } else if (normalizedElevation < 0.6) {
        // Mid elevation - yellow/orange
        colors[i] = 1.0;
        colors[i + 1] = 0.8;
        colors[i + 2] = 0.2;
      } else if (normalizedElevation < 0.8) {
        // High areas - orange/red
        colors[i] = 1.0;
        colors[i + 1] = 0.4;
        colors[i + 2] = 0.2;
      } else {
        // Peaks - bright red/pink
        colors[i] = 1.0;
        colors[i + 1] = 0.2;
        colors[i + 2] = 0.4;
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    console.log('3D wireframe terrain generated successfully');
    return geometry;
  }, [data]);

  // Terrain material - wireframe with colors
  const terrainMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      vertexColors: true,
      wireframe: true,
      wireframeLinewidth: 2,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
  }, []);

  // Solid terrain material for depth
  const solidTerrainMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      vertexColors: true,
      wireframe: false,
      roughness: 0.8,
      metalness: 0.0,
      transparent: true,
      opacity: 0.3,
    });
  }, []);

  // Generate simple data points
  const dataPoints = useMemo(() => {
    console.log('Generating data points...');

    return data.climateData.slice(0, 6).map((point, index) => {
      // Simple grid positioning
      const gridX = (index % 3) - 1;
      const gridZ = Math.floor(index / 3) - 1;
      const x = gridX * 8;
      const z = gridZ * 8;
      const y = 5 + point.riskLevel * 4; // Higher positioning

      console.log(`Data point ${index}:`, { x, y, z, region: point.region });

      return {
        position: [x, y, z] as [number, number, number],
        data: point,
        energy: data.energyData[index % data.energyData.length] || data.energyData[0],
        index
      };
    });
  }, [data]);

  // Simple energy connections
  const energyConnections = useMemo(() => {
    console.log('Generating energy connections...');

    if (dataPoints.length < 2) return [];

    const connections = [];
    for (let i = 0; i < dataPoints.length - 1; i++) {
      connections.push({
        start: dataPoints[i].position,
        end: dataPoints[i + 1].position,
        color: '#4facfe'
      });
    }

    console.log(`Generated ${connections.length} connections`);
    return connections;
  }, [dataPoints]);

  // Generate floating particles
  const particles = useMemo(() => {
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        position: [
          (Math.random() - 0.5) * 40,
          Math.random() * 20 + 5,
          (Math.random() - 0.5) * 40
        ] as [number, number, number],
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 0.3 + 0.2
      });
    }

    return particles;
  }, []);

  // Animated particle component
  const AnimatedParticle: React.FC<{ particle: any; index: number }> = ({ particle, index }) => {
    const particleRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
      if (particleRef.current) {
        particleRef.current.position.y = particle.position[1] + Math.sin(state.clock.elapsedTime * particle.speed + index) * 2;
        particleRef.current.position.x = particle.position[0] + Math.cos(state.clock.elapsedTime * particle.speed * 0.5 + index) * 1;
      }
    });

    return (
      <Sphere
        ref={particleRef}
        position={particle.position}
        args={[particle.size, 8, 8]}
      >
        <meshStandardMaterial
          color={particle.color}
          emissive={particle.color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </Sphere>
    );
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  // Simplified Data Point Component
  const DataPoint: React.FC<{ point: any; index: number }> = ({ point, index }) => {
    const [hovered, setHovered] = useState(false);
    const sphereRef = useRef<THREE.Mesh>(null);

    const riskColor = point.data.riskLevel > 0.7 ? '#ff4444' :
                     point.data.riskLevel > 0.4 ? '#ffaa44' : '#44ff44';

    useFrame((state) => {
      if (sphereRef.current) {
        sphereRef.current.position.y = point.position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        sphereRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      }
    });

    return (
      <group position={point.position}>
        {/* Main data sphere */}
        <Sphere
          ref={sphereRef}
          args={[1.0, 16, 16]}
          onPointerEnter={() => {
            setHovered(true);
            setHoveredPoint(index);
          }}
          onPointerLeave={() => {
            setHovered(false);
            setHoveredPoint(null);
          }}
        >
          <meshStandardMaterial
            color={riskColor}
            emissive={riskColor}
            emissiveIntensity={hovered ? 0.8 : 0.5}
          />
        </Sphere>

        {/* Simple label */}
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {point.data.region}
        </Text>

        {/* Hover tooltip */}
        {hovered && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/90 text-white px-2 py-1 rounded text-xs">
              <div>{point.data.region}</div>
              <div>Risk: {(point.data.riskLevel * 100).toFixed(0)}%</div>
              <div>Temp: {point.data.temperature.toFixed(1)}°C</div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      {/* Debug: Always visible test spheres */}
      <Sphere args={[1, 16, 16]} position={[0, 10, 0]}>
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff4444"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Additional test spheres to verify positioning */}
      <Sphere args={[0.8, 16, 16]} position={[-8, 6, -8]}>
        <meshStandardMaterial
          color="#44ff44"
          emissive="#44ff44"
          emissiveIntensity={0.5}
        />
      </Sphere>

      <Sphere args={[0.8, 16, 16]} position={[8, 6, 8]}>
        <meshStandardMaterial
          color="#4444ff"
          emissive="#4444ff"
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Solid terrain base for depth */}
      <mesh
        geometry={terrainGeometry}
        material={solidTerrainMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Wireframe terrain overlay */}
      <mesh
        ref={meshRef}
        geometry={terrainGeometry}
        material={terrainMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />

      {/* Base plane for reference */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#1a1a3a"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Debug info */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
      >
        Data Points: {dataPoints.length}
      </Text>

      {/* Floating particles */}
      {particles.map((particle, index) => (
        <AnimatedParticle
          key={`particle-${index}`}
          particle={particle}
          index={index}
        />
      ))}

      {/* Data points */}
      {dataPoints.map((point, index) => {
        console.log(`Rendering data point ${index}:`, point);
        return <DataPoint key={index} point={point} index={index} />;
      })}

      {/* Simple energy connections */}
      {energyConnections.map((connection, index) => (
        <group key={`connection-${index}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([
                  ...connection.start,
                  ...connection.end
                ])}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={connection.color}
              transparent
              opacity={0.5}
            />
          </line>
        </group>
      ))}

      {/* Simple title */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Climate Terrain Analysis
      </Text>

      {/* Simple legend */}
      <group position={[-12, 6, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="left"
        >
          Risk Levels:
        </Text>

        <group position={[0, -1, 0]}>
          <Sphere args={[0.2, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#44ff44" />
          </Sphere>
          <Text position={[0.5, 0, 0]} fontSize={0.3} color="#ffffff" anchorX="left">Low</Text>
        </group>

        <group position={[0, -1.8, 0]}>
          <Sphere args={[0.2, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffaa44" />
          </Sphere>
          <Text position={[0.5, 0, 0]} fontSize={0.3} color="#ffffff" anchorX="left">Medium</Text>
        </group>

        <group position={[0, -2.6, 0]}>
          <Sphere args={[0.2, 8, 8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ff4444" />
          </Sphere>
          <Text position={[0.5, 0, 0]} fontSize={0.3} color="#ffffff" anchorX="left">High</Text>
        </group>
      </group>
    </group>
  );
};

export default TerrainGraph;