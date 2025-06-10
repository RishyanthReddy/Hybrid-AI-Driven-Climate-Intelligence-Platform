import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
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

  // Generate terrain geometry based on climate data
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const positions = geometry.attributes.position;
    
    // Create height map based on climate data
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Calculate height based on temperature, precipitation, and risk level
      const height = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2 + 
                   Math.random() * 0.5 - 0.25;
      
      positions.setY(i, height);
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, [data]);

  // Generate terrain material with gradient colors
  const terrainMaterial = useMemo(() => {
    const material = new THREE.MeshLambertMaterial({
      vertexColors: true,
      wireframe: false
    });

    // Add colors based on elevation and risk levels
    const colors = [];
    const positions = terrainGeometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const height = positions.getY(i);
      const normalizedHeight = (height + 3) / 6; // Normalize to 0-1
      
      // Color gradient from blue (low) to red (high)
      const r = Math.min(1, normalizedHeight * 1.5);
      const g = Math.max(0, 1 - Math.abs(normalizedHeight - 0.5) * 2);
      const b = Math.max(0, 1 - normalizedHeight * 1.5);
      
      colors.push(r, g, b);
    }
    
    terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return material;
  }, [terrainGeometry]);

  // Generate data points on terrain
  const dataPoints = useMemo(() => {
    return data.climateData.map((point, index) => ({
      position: [
        (Math.random() - 0.5) * 16,
        Math.sin(index * 0.5) * 2 + 1,
        (Math.random() - 0.5) * 16
      ] as [number, number, number],
      data: point,
      energy: data.energyData[index % data.energyData.length]
    }));
  }, [data]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Main terrain mesh */}
      <mesh
        ref={meshRef}
        geometry={terrainGeometry}
        material={terrainMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      />
      
      {/* Wireframe overlay */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Data points */}
      {dataPoints.map((point, index) => (
        <group key={index} position={point.position}>
          {/* Data point marker */}
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={point.data.riskLevel > 0.7 ? '#ff4444' : 
                     point.data.riskLevel > 0.4 ? '#ffaa44' : '#44ff44'}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Data point label */}
          {interactive && (
            <Html position={[0, 0.5, 0]} center>
              <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                <div className="font-semibold">{point.data.region}</div>
                <div>Temp: {point.data.temperature.toFixed(1)}°C</div>
                <div>Risk: {(point.data.riskLevel * 100).toFixed(0)}%</div>
                <div>Energy: {point.energy.efficiency.toFixed(1)}%</div>
              </div>
            </Html>
          )}
          
          {/* Energy flow indicator */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, point.energy.efficiency * 0.01, 8]} />
            <meshBasicMaterial
              color="#4facfe"
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
      
      {/* Grid lines */}
      <group>
        {Array.from({ length: 21 }, (_, i) => (
          <React.Fragment key={i}>
            <line key={`h-${i}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([
                    -10, 0, -10 + i,
                    10, 0, -10 + i
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </line>
            <line key={`v-${i}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={new Float32Array([
                    -10 + i, 0, -10,
                    -10 + i, 0, 10
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </line>
          </React.Fragment>
        ))}
      </group>
      
      {/* Axis labels */}
      <Text
        position={[0, 0, -12]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Climate Risk Analysis
      </Text>
      
      <Text
        position={[-12, 0, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Energy Efficiency
      </Text>
      
      <Text
        position={[12, 0, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Temperature Impact
      </Text>
    </group>
  );
};

export default TerrainGraph;