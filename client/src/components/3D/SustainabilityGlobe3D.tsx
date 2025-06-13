import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface SustainabilityDataPoint {
  id: string;
  position: [number, number, number];
  type: 'job' | 'culture' | 'supply-chain' | 'community';
  value: number;
  label: string;
  impact: number;
}

interface SustainabilityGlobe3DProps {
  data?: SustainabilityDataPoint[];
  className?: string;
}

const Globe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={globeRef} args={[2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#1e40af"
        transparent
        opacity={0.3}
        wireframe
      />
    </Sphere>
  );
};

const DataPoint: React.FC<{ 
  point: SustainabilityDataPoint; 
  onClick?: (point: SustainabilityDataPoint) => void;
}> = ({ point, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      // Pulsing effect based on impact
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2 * (point.impact / 100);
      meshRef.current.scale.setScalar(scale);
    }
  });

  const getColor = () => {
    switch (point.type) {
      case 'job': return '#10b981'; // green
      case 'culture': return '#8b5cf6'; // purple
      case 'supply-chain': return '#3b82f6'; // blue
      case 'community': return '#f59e0b'; // orange
      default: return '#6b7280'; // gray
    }
  };

  const getSize = () => {
    return Math.max(0.05, Math.min(0.2, point.value / 1000));
  };

  return (
    <group position={point.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick?.(point)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[getSize(), 16, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white p-2 rounded text-xs whitespace-nowrap">
            <div className="font-semibold">{point.label}</div>
            <div className="text-gray-300">Value: {point.value.toLocaleString()}</div>
            <div className="text-gray-300">Impact: {point.impact}%</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const ConnectionLines: React.FC<{ data: SustainabilityDataPoint[] }> = ({ data }) => {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const lines: Array<{ start: [number, number, number]; end: [number, number, number]; strength: number }> = [];
    
    // Create connections between related data points
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const point1 = data[i];
        const point2 = data[j];
        
        // Connect points with similar impact levels or complementary types
        const impactDiff = Math.abs(point1.impact - point2.impact);
        const isComplementary = 
          (point1.type === 'job' && point2.type === 'community') ||
          (point1.type === 'culture' && point2.type === 'community') ||
          (point1.type === 'supply-chain' && point2.type === 'job');
        
        if (impactDiff < 20 || isComplementary) {
          lines.push({
            start: point1.position,
            end: point2.position,
            strength: Math.max(0.1, 1 - impactDiff / 100)
          });
        }
      }
    }
    
    return lines;
  }, [data]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, index) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial;
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime + index) * 0.2;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((connection, index) => {
        const points = [
          new THREE.Vector3(...connection.start),
          new THREE.Vector3(...connection.end)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={connection.strength * 0.5}
            />
          </line>
        );
      })}
    </group>
  );
};

const FloatingText: React.FC<{ 
  text: string; 
  position: [number, number, number];
  color?: string;
}> = ({ text, position, color = "#ffffff" }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position);
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.2}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

const SustainabilityGlobe3D: React.FC<SustainabilityGlobe3DProps> = ({ 
  data = [], 
  className = "" 
}) => {
  const [selectedPoint, setSelectedPoint] = React.useState<SustainabilityDataPoint | null>(null);

  // Generate mock data if none provided
  const sustainabilityData = useMemo(() => {
    if (data.length > 0) return data;

    return [
      {
        id: '1',
        position: [1.5, 1, 1] as [number, number, number],
        type: 'job' as const,
        value: 1247,
        label: 'Sustainable Jobs Created',
        impact: 85
      },
      {
        id: '2',
        position: [-1.2, 0.8, 1.5] as [number, number, number],
        type: 'culture' as const,
        value: 89,
        label: 'Cultural Practices Preserved',
        impact: 92
      },
      {
        id: '3',
        position: [0.8, -1.3, 1.2] as [number, number, number],
        type: 'supply-chain' as const,
        value: 156,
        label: 'Supply Chains Improved',
        impact: 78
      },
      {
        id: '4',
        position: [-1.5, -0.5, -1] as [number, number, number],
        type: 'community' as const,
        value: 67,
        label: 'Communities Supported',
        impact: 88
      },
      {
        id: '5',
        position: [0.5, 1.8, -0.8] as [number, number, number],
        type: 'job' as const,
        value: 2340,
        label: 'Carbon Reduced (tons)',
        impact: 95
      },
      {
        id: '6',
        position: [1.8, -0.2, 0.5] as [number, number, number],
        type: 'supply-chain' as const,
        value: 234,
        label: 'Local Suppliers Supported',
        impact: 82
      }
    ];
  }, [data]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
        
        <Globe />
        
        {sustainabilityData.map((point) => (
          <DataPoint
            key={point.id}
            point={point}
            onClick={setSelectedPoint}
          />
        ))}
        
        <ConnectionLines data={sustainabilityData} />
        
        <FloatingText
          text="Global Sustainability Impact"
          position={[0, 3, 0]}
          color="#10b981"
        />
        
        <FloatingText
          text="Real-time Data Visualization"
          position={[0, -3, 0]}
          color="#3b82f6"
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxDistance={15}
          minDistance={3}
        />
      </Canvas>
      
      {selectedPoint && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm">
          <h3 className="font-bold text-lg mb-2">{selectedPoint.label}</h3>
          <div className="space-y-1 text-sm">
            <div>Type: <span className="capitalize">{selectedPoint.type.replace('-', ' ')}</span></div>
            <div>Value: {selectedPoint.value.toLocaleString()}</div>
            <div>Impact Score: {selectedPoint.impact}%</div>
          </div>
          <button
            onClick={() => setSelectedPoint(null)}
            className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            Close
          </button>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Sustainable Jobs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Cultural Heritage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Supply Chains</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Communities</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityGlobe3D;
