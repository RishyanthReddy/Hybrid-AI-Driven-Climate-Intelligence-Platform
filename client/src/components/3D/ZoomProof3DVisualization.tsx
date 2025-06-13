import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ZoomProof3DVisualizationProps {
  type: 'energy' | 'climate' | 'city';
  data?: any;
  className?: string;
  showParticles?: boolean;
  emissionSources?: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'factory' | 'vehicle' | 'building';
  }>;
}

// Particle system for emissions
const EmissionParticles: React.FC<{
  emissionSources: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'factory' | 'vehicle' | 'building';
  }>;
  visible: boolean;
}> = ({ emissionSources, visible }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const { positions, colors } = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const sourceIndex = Math.floor(Math.random() * emissionSources.length);
      const source = emissionSources[sourceIndex] || { position: [0, 0, 0], intensity: 0.5, type: 'factory' };

      // Position particles around emission sources
      positions[i * 3] = source.position[0] + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = source.position[1] + Math.random() * 3;
      positions[i * 3 + 2] = source.position[2] + (Math.random() - 0.5) * 2;

      // Color based on emission type
      const color = source.type === 'factory' ? new THREE.Color(0xff4444) :
                   source.type === 'vehicle' ? new THREE.Color(0xffaa44) :
                   new THREE.Color(0xff8844);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [emissionSources]);

  if (!visible || emissionSources.length === 0) return null;

  return (
    <points ref={pointsRef}>
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
        size={0.05}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Completely static 3D scene with locked camera
const StaticScene: React.FC<{
  type: string;
  showParticles?: boolean;
  emissionSources?: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'factory' | 'vehicle' | 'building';
  }>;
}> = ({ type, showParticles = false, emissionSources = [] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create static geometry based on type
  const createGeometry = () => {
    const geometry = [];
    
    if (type === 'energy') {
      // Energy grid nodes
      for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        const y = Math.random() * 2;
        
        geometry.push(
          <mesh key={`energy-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial 
              color={Math.random() > 0.5 ? '#4facfe' : '#43e97b'} 
              emissive={Math.random() > 0.5 ? '#4facfe' : '#43e97b'}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      }
    } else if (type === 'climate') {
      // Climate heatmap
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const x = (i - 7) * 0.5;
          const z = (j - 7) * 0.5;
          const height = Math.sin(i * 0.5) * Math.cos(j * 0.5) * 0.5 + 0.5;
          
          geometry.push(
            <mesh key={`climate-${i}-${j}`} position={[x, height, z]}>
              <boxGeometry args={[0.4, height * 2, 0.4]} />
              <meshStandardMaterial 
                color={new THREE.Color().setHSL(0.6 - height * 0.6, 0.8, 0.5)}
              />
            </mesh>
          );
        }
      }
    } else if (type === 'city') {
      // City buildings
      for (let i = 0; i < 25; i++) {
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        const height = 0.5 + Math.random() * 3;
        
        geometry.push(
          <mesh key={`building-${i}`} position={[x, height / 2, z]}>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshStandardMaterial 
              color={Math.random() > 0.7 ? '#feca57' : '#74b9ff'}
            />
          </mesh>
        );
      }
    }
    
    return geometry;
  };

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      
      {/* Static geometry */}
      {createGeometry()}

      {/* Emission particles for climate type */}
      {type === 'climate' && (
        <EmissionParticles
          emissionSources={emissionSources}
          visible={showParticles || false}
        />
      )}
    </group>
  );
};

// Completely locked orbit controls
const LockedOrbitControls: React.FC = () => {
  return (
    <OrbitControls
      enabled={false}
      enablePan={false}
      enableZoom={false}
      enableRotate={false}
      autoRotate={false}
      autoRotateSpeed={0}
      enableDamping={false}
      dampingFactor={0}
      minDistance={10}
      maxDistance={10}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 4}
      minAzimuthAngle={0}
      maxAzimuthAngle={0}
      target={[0, 0, 0]}
      // Disable all mouse and touch events
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
    />
  );
};

const ZoomProof3DVisualization: React.FC<ZoomProof3DVisualizationProps> = ({
  type,
  data,
  className = "",
  showParticles = false,
  emissionSources = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Prevent all events on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventEvent = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Add event listeners to prevent all interactions
    const events = [
      'wheel', 'mousedown', 'mouseup', 'mousemove', 'click', 'dblclick',
      'touchstart', 'touchend', 'touchmove', 'touchcancel',
      'pointerdown', 'pointerup', 'pointermove', 'pointercancel',
      'contextmenu', 'selectstart', 'dragstart'
    ];

    events.forEach(event => {
      canvas.addEventListener(event, preventEvent, { passive: false, capture: true });
    });

    return () => {
      events.forEach(event => {
        canvas.removeEventListener(event, preventEvent, { capture: true });
      });
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Canvas
        ref={canvasRef}
        camera={{ 
          position: [8, 6, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ 
          pointerEvents: 'none',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
        onCreated={({ gl, camera }) => {
          // Lock camera position
          camera.position.set(8, 6, 8);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          
          // Disable canvas interactions
          gl.domElement.style.pointerEvents = 'none';
          gl.domElement.style.touchAction = 'none';
        }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
      >
        <StaticScene
          type={type}
          showParticles={showParticles}
          emissionSources={emissionSources}
        />
        <LockedOrbitControls />
      </Canvas>
      
      {/* Overlay to block any remaining interactions */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'transparent',
          zIndex: 10
        }}
      />
    </div>
  );
};

export default ZoomProof3DVisualization;
