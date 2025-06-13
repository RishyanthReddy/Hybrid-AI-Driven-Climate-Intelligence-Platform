import React, { useRef, useState, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface EnergyNode {
  id: string;
  position: [number, number, number];
  energyLevel: number;
  nodeType: 'generator' | 'consumer' | 'storage';
  capacity: number;
  status: 'online' | 'offline' | 'maintenance';
}

interface EnergyConnection {
  from: EnergyNode;
  to: EnergyNode;
  energyFlow: number;
  efficiency: number;
}

interface InteractiveEnergyGrid3DProps {
  data?: any;
  interactive?: boolean;
  selectedNode?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
}

const InteractiveEnergyGrid3D: React.FC<InteractiveEnergyGrid3DProps> = ({ 
  data, 
  interactive = true, 
  selectedNode, 
  onNodeSelect 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Generate optimized grid data
  const gridData = useMemo(() => {
    const nodes: EnergyNode[] = [];
    const connections: EnergyConnection[] = [];
    const gridSize = 6; // Reduced for better performance
    
    // Create energy nodes
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * 3;
        const z = (j - gridSize / 2) * 3;
        const y = Math.sin(i * 0.5 + j * 0.3) * 0.3;
        
        const nodeType = i === 0 || i === gridSize - 1 ? 'generator' : 
                        j === 0 || j === gridSize - 1 ? 'storage' : 'consumer';
        
        nodes.push({
          id: `node-${i}-${j}`,
          position: [x, y, z],
          energyLevel: 60 + Math.random() * 40,
          nodeType,
          capacity: 50 + Math.random() * 50,
          status: Math.random() > 0.1 ? 'online' : 'maintenance'
        });
      }
    }
    
    // Create connections between adjacent nodes
    nodes.forEach((node) => {
      const [x1, , z1] = node.position;
      nodes.forEach((otherNode) => {
        if (node.id !== otherNode.id) {
          const [x2, , z2] = otherNode.position;
          const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
          
          if (distance < 4 && Math.random() > 0.3) {
            connections.push({
              from: node,
              to: otherNode,
              energyFlow: 20 + Math.random() * 30,
              efficiency: 0.8 + Math.random() * 0.2
            });
          }
        }
      });
    });
    
    return { nodes, connections };
  }, [data]);

  // Energy Node Component
  const EnergyNode: React.FC<{ node: EnergyNode; index: number }> = ({ node, index }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;
    
    const nodeColor = useMemo(() => {
      switch (node.nodeType) {
        case 'generator': return '#43e97b';
        case 'storage': return '#feca57';
        default: return '#4facfe';
      }
    }, [node.nodeType]);

    // Disabled animation to prevent auto-zoom issues
    // useFrame((state) => {
    //   if (meshRef.current && node.status === 'online') {
    //     const baseScale = isSelected ? 1.3 : (isHovered ? 1.1 : 1);
    //     const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5 + index * 0.5) * 0.05;
    //     meshRef.current.scale.setScalar(baseScale * pulse);
    //     meshRef.current.rotation.y += 0.005;
    //   }
    // });

    const handlePointerOver = useCallback((e: any) => {
      e.stopPropagation();
      setHoveredNode(node.id);
      if (interactive) {
        document.body.style.cursor = 'pointer';
      }
    }, [node.id, interactive]);

    const handlePointerOut = useCallback((e: any) => {
      e.stopPropagation();
      setHoveredNode(null);
      document.body.style.cursor = 'default';
    }, []);

    const handleClick = useCallback((e: any) => {
      e.stopPropagation();
      if (interactive && onNodeSelect) {
        onNodeSelect(isSelected ? null : node.id);
      }
    }, [node.id, isSelected, interactive, onNodeSelect]);

    const statusColor = node.status === 'online' ? nodeColor : 
                       node.status === 'maintenance' ? '#ff6b6b' : '#666666';

    return (
      <group position={node.position}>
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={isSelected ? 0.4 : (isHovered ? 0.2 : 0.1)}
            transparent
            opacity={node.status === 'offline' ? 0.3 : 0.9}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {/* Energy level indicator */}
        {node.status === 'online' && (
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, node.energyLevel / 100]} />
            <meshStandardMaterial
              color={node.energyLevel > 70 ? '#43e97b' : node.energyLevel > 30 ? '#feca57' : '#ff6b6b'}
              emissive={node.energyLevel > 70 ? '#43e97b' : node.energyLevel > 30 ? '#feca57' : '#ff6b6b'}
              emissiveIntensity={0.3}
            />
          </mesh>
        )}
        
        {/* Selection ring */}
        {isSelected && (
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.03, 8, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        )}
        
        {/* Node info display */}
        {(isHovered || isSelected) && (
          <Text
            position={[0, 2, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {`${node.nodeType.toUpperCase()}\n${node.energyLevel.toFixed(1)}%\n${node.capacity.toFixed(0)}MW\n${node.status.toUpperCase()}`}
          </Text>
        )}
      </group>
    );
  };

  // Energy Flow Line Component
  const EnergyFlow: React.FC<{ connection: EnergyConnection; index: number }> = ({ 
    connection, 
    index 
  }) => {
    const materialRef = useRef<THREE.LineBasicMaterial>(null);
    
    const points = useMemo(() => {
      const start = new THREE.Vector3(...connection.from.position);
      const end = new THREE.Vector3(...connection.to.position);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 0.3; // Subtle arc
      
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return curve.getPoints(16);
    }, [connection]);

    useFrame((state) => {
      if (materialRef.current) {
        const flow = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index * 0.3) * 0.3;
        materialRef.current.opacity = flow * connection.efficiency;
      }
    });

    const flowColor = `hsl(${180 + connection.efficiency * 80}, 70%, 60%)`;

    return (
      <Line
        points={points}
        color={flowColor}
        lineWidth={1 + connection.energyFlow / 30}
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

  // Particle system for energy visualization
  const EnergyParticles: React.FC = () => {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 100; // Reduced for performance
    
    const [positions, colors] = useMemo(() => {
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = Math.random() * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      
      return [positions, colors];
    }, [particleCount]);

    // Disabled animation to prevent auto-zoom issues
    // useFrame((state) => {
    //   if (particlesRef.current) {
    //     const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    //
    //     for (let i = 0; i < particleCount; i++) {
    //       const i3 = i * 3;
    //       positions[i3 + 1] += 0.01;
    //
    //       if (positions[i3 + 1] > 10) {
    //         positions[i3 + 1] = 0;
    //         positions[i3] = (Math.random() - 0.5) * 20;
    //         positions[i3 + 2] = (Math.random() - 0.5) * 20;
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
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          transparent
          opacity={0.6}
          vertexColors
          sizeAttenuation
        />
      </points>
    );
  };

  return (
    <>
      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          minDistance={8}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
          dampingFactor={0}
          enableDamping={false}
          domElement={undefined}
          listenToKeyEvents={undefined}
          touches={{
            ONE: 0, // Disable touch rotate
            TWO: 0  // Disable two-finger gestures
          }}
          mouseButtons={{
            LEFT: 0,   // Disable mouse rotate
            MIDDLE: 0, // Disable middle mouse
            RIGHT: 0   // Disable right mouse
          }}
        />
      )}
      
      {/* Optimized lighting */}
      <ambientLight intensity={0.4} color="#b3d9ff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <pointLight
        position={[0, 15, 0]}
        intensity={0.3}
        color="#4facfe"
        distance={30}
      />
      
      <group ref={groupRef}>
        {/* Grid base */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.3}
            roughness={0.8}
          />
        </mesh>
        
        {/* Grid lines */}
        <group>
          {Array.from({ length: 6 }, (_, i) => {
            const pos = (i - 2.5) * 3;
            return (
              <React.Fragment key={i}>
                <Line
                  points={[[-12, 0, pos], [12, 0, pos]]}
                  color="#ffffff"
                  lineWidth={1}
                  transparent
                  opacity={0.1}
                />
                <Line
                  points={[[pos, 0, -12], [pos, 0, 12]]}
                  color="#ffffff"
                  lineWidth={1}
                  transparent
                  opacity={0.1}
                />
              </React.Fragment>
            );
          })}
        </group>
        
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
          position={[0, 8, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Interactive Energy Grid
        </Text>
        
        {/* Statistics */}
        <Text
          position={[0, -3, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`${gridData.nodes.filter(n => n.status === 'online').length}/${gridData.nodes.length} Nodes Online | ${gridData.connections.length} Connections`}
        </Text>
        
        {/* Instructions */}
        {interactive && (
          <Text
            position={[0, -4, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Click nodes to select • Drag to rotate • Scroll to zoom
          </Text>
        )}
      </group>
    </>
  );
};

export default InteractiveEnergyGrid3D;