import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Html, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingData {
  id: string;
  position: [number, number, number];
  height: number;
  energyConsumption: number;
  efficiency: number;
  type: 'residential' | 'commercial' | 'industrial';
  status: 'active' | 'inactive' | 'critical';
}

interface InteractiveCityGridProps {
  buildings: BuildingData[];
  onBuildingClick?: (building: BuildingData) => void;
  showEnergyFlow?: boolean;
  animationSpeed?: number;
}

const Building: React.FC<{
  building: BuildingData;
  onClick?: () => void;
  showFlow: boolean;
}> = ({ building, onClick, showFlow }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const { scale, color } = useSpring({
    scale: hovered ? 1.1 : 1,
    color: building.status === 'critical' ? '#ff4444' : 
           building.status === 'inactive' ? '#666666' : '#44ff44',
    config: { tension: 200, friction: 20 }
  });

  useFrame((state) => {
    if (meshRef.current && showFlow) {
      const time = state.clock.getElapsedTime();
      meshRef.current.material.emissive.setHSL(
        0.3, 
        0.5, 
        0.1 + Math.sin(time * 2 + building.position[0]) * 0.1
      );
    }
  });

  const buildingColor = useMemo(() => {
    switch (building.type) {
      case 'residential': return '#4facfe';
      case 'commercial': return '#00f2fe';
      case 'industrial': return '#fa709a';
      default: return '#ffffff';
    }
  }, [building.type]);

  return (
    <group position={building.position}>
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, building.height, 1]} />
        <meshPhongMaterial 
          color={buildingColor}
          emissive={new THREE.Color(0x112233)}
          transparent
          opacity={0.8}
        />
      </animated.mesh>
      
      {/* Energy Efficiency Indicator */}
      <Billboard position={[0, building.height + 0.5, 0]}>
        <Text
          fontSize={0.3}
          color={building.efficiency > 80 ? '#00ff00' : 
                building.efficiency > 60 ? '#ffff00' : '#ff0000'}
        >
          {building.efficiency.toFixed(0)}%
        </Text>
      </Billboard>
      
      {/* Hover Info */}
      {hovered && (
        <Html position={[0, building.height + 1, 0]} center>
          <div className="glass p-2 rounded text-white text-xs min-w-32">
            <div className="font-bold">{building.type}</div>
            <div>Energy: {building.energyConsumption}kW</div>
            <div>Efficiency: {building.efficiency}%</div>
            <div>Status: {building.status}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const EnergyFlowLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  intensity: number;
}> = ({ start, end, intensity }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.getElapsedTime();
      const opacity = 0.3 + Math.sin(time * 3) * 0.2;
      lineRef.current.material.opacity = opacity * intensity;
    }
  });

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        Math.max(start[1], end[1]) + 2,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    ]);
    return curve.getPoints(50);
  }, [start, end]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={0.5}
        linewidth={2}
      />
    </line>
  );
};

const InteractiveCityGrid: React.FC<InteractiveCityGridProps> = ({ 
  buildings, 
  onBuildingClick,
  showEnergyFlow = true,
  animationSpeed = 1
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 * animationSpeed;
    }
  });

  // Generate energy flow connections
  const energyConnections = useMemo(() => {
    const connections: Array<{
      start: [number, number, number];
      end: [number, number, number];
      intensity: number;
    }> = [];
    
    buildings.forEach((building, i) => {
      if (building.status === 'active' && i < buildings.length - 1) {
        const nextBuilding = buildings[i + 1];
        if (nextBuilding.status === 'active') {
          connections.push({
            start: [building.position[0], building.height / 2, building.position[2]],
            end: [nextBuilding.position[0], nextBuilding.height / 2, nextBuilding.position[2]],
            intensity: (building.efficiency + nextBuilding.efficiency) / 200
          });
        }
      }
    });
    
    return connections;
  }, [buildings]);

  return (
    <group ref={groupRef}>
      {/* Grid Base */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshPhongMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Grid Lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <React.Fragment key={i}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  -10, 0, -10 + i,
                  10, 0, -10 + i,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#333366" transparent opacity={0.2} />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  -10 + i, 0, -10,
                  -10 + i, 0, 10,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#333366" transparent opacity={0.2} />
          </line>
        </React.Fragment>
      ))}
      
      {/* Buildings */}
      {buildings.map((building) => (
        <Building
          key={building.id}
          building={building}
          onClick={() => onBuildingClick?.(building)}
          showFlow={showEnergyFlow}
        />
      ))}
      
      {/* Energy Flow Lines */}
      {showEnergyFlow && energyConnections.map((connection, index) => (
        <EnergyFlowLine
          key={index}
          start={connection.start}
          end={connection.end}
          intensity={connection.intensity}
        />
      ))}
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#4facfe" />
    </group>
  );
};

export default InteractiveCityGrid;