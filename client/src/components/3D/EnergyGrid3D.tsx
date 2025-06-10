import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Sphere, Box } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion-3d";

interface EnergyGrid3DProps {
  data: any;
  interactive?: boolean;
}

const EnergyGrid3D: React.FC<EnergyGrid3DProps> = ({ data, interactive = false }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  
  // Generate grid data
  const gridData = useMemo(() => {
    const nodes = [];
    const connections = [];
    const gridSize = 8;
    
    // Create energy nodes
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * 4;
        const z = (j - gridSize / 2) * 4;
        const y = Math.sin(i * 0.5 + j * 0.3) * 0.5;
        
        nodes.push({
          id: `${i}-${j}`,
          position: [x, y, z],
          energyLevel: Math.random() * 100,
          nodeType: Math.random() > 0.7 ? 'generator' : 'consumer',
          capacity: 50 + Math.random() * 50
        });
      }
    }
    
    // Create connections between nearby nodes
    nodes.forEach((node, index) => {
      const [x1, , z1] = node.position;
      nodes.forEach((otherNode, otherIndex) => {
        if (index !== otherIndex) {
          const [x2, , z2] = otherNode.position;
          const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
          
          if (distance < 6 && Math.random() > 0.4) {
            connections.push({
              from: node,
              to: otherNode,
              energyFlow: Math.random() * 50,
              efficiency: 0.8 + Math.random() * 0.2
            });
          }
        }
      });
    });
    
    return { nodes, connections };
  }, [data]);

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Energy Node Component
  const EnergyNode: React.FC<{ node: any; index: number }> = ({ node, index }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = React.useState(false);
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        
        // Pulsing effect based on energy level
        const scale = 1 + (node.energyLevel / 100) * 0.5;
        meshRef.current.scale.setScalar(scale);
      }
    });

    const nodeColor = useMemo(() => {
      if (node.nodeType === 'generator') {
        return new THREE.Color(0x00ff88); // Green for generators
      } else {
        return new THREE.Color().setHSL(0.6 - (node.energyLevel / 100) * 0.6, 0.8, 0.6);
      }
    }, [node.nodeType, node.energyLevel]);

    return (
      <group position={node.position}>
        <Sphere
          ref={meshRef}
          args={[0.3, 16, 16]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            transparent
            opacity={0.8}
          />
        </Sphere>
        
        {/* Energy level indicator */}
        <Box
          position={[0, 1, 0]}
          args={[0.1, node.energyLevel / 50, 0.1]}
        >
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={0.3}
          />
        </Box>
        
        {hovered && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {`${node.nodeType}\n${node.energyLevel.toFixed(1)}%`}
          </Text>
        )}
      </group>
    );
  };

  // Energy Flow Component
  const EnergyFlow: React.FC<{ connection: any; index: number }> = ({ connection, index }) => {
    const lineRef = useRef<THREE.BufferGeometry>(null);
    const materialRef = useRef<THREE.LineBasicMaterial>(null);
    
    const points = useMemo(() => {
      const start = new THREE.Vector3(...connection.from.position);
      const end = new THREE.Vector3(...connection.to.position);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 0.5; // Arc effect
      
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return curve.getPoints(20);
    }, [connection]);

    useFrame((state) => {
      if (materialRef.current) {
        const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
        materialRef.current.opacity = intensity;
      }
    });

    return (
      <Line
        ref={lineRef}
        points={points}
        color={`hsl(${200 + connection.efficiency * 60}, 70%, 60%)`}
        lineWidth={2 + connection.energyFlow / 25}
        transparent
      >
        <lineBasicMaterial
          ref={materialRef}
          transparent
          opacity={0.6}
        />
      </Line>
    );
  };

  // Particle System for Energy Flow
  const EnergyParticles: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 200;
    
    const particles = useMemo(() => {
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions within grid bounds
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = Math.random() * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        // Random velocities
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        
        // Energy colors
        const hue = Math.random() * 0.3 + 0.5; // Blue to cyan
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      return { positions, velocities, colors };
    }, []);

    useFrame(() => {
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Update positions
          positions[i3] += particles.velocities[i3];
          positions[i3 + 1] += particles.velocities[i3 + 1];
          positions[i3 + 2] += particles.velocities[i3 + 2];
          
          // Wrap around boundaries
          if (Math.abs(positions[i3]) > 15) particles.velocities[i3] *= -1;
          if (positions[i3 + 1] > 8 || positions[i3 + 1] < -2) particles.velocities[i3 + 1] *= -1;
          if (Math.abs(positions[i3 + 2]) > 15) particles.velocities[i3 + 2] *= -1;
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }
    });

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
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Grid base */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40, 20, 20]} />
        <meshStandardMaterial
          color={0x1a1a2e}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Energy nodes */}
      {gridData.nodes.map((node, index) => (
        <EnergyNode key={node.id} node={node} index={index} />
      ))}
      
      {/* Energy connections */}
      {gridData.connections.map((connection, index) => (
        <EnergyFlow key={index} connection={connection} index={index} />
      ))}
      
      {/* Energy particles */}
      <EnergyParticles />
      
      {/* Title */}
      <Text
        position={[0, 6, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Energy Distribution Grid
      </Text>
      
      {/* Statistics */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.4}
        color="rgba(255,255,255,0.7)"
        anchorX="center"
        anchorY="middle"
      >
        {`Nodes: ${gridData.nodes.length} | Connections: ${gridData.connections.length}`}
      </Text>
    </group>
  );
};

export default EnergyGrid3D;
