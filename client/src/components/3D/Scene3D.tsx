import React, { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Sky, Cloud } from "@react-three/drei";
import * as THREE from "three";
import InteractiveEnergyGrid3D from "./InteractiveEnergyGrid3D";
import ClimateHeatmap from "./ClimateHeatmap";
import ParticleSystem from "./ParticleSystem";
import { use3DScene } from "../../lib/stores/use3DScene";
import { useClimateData } from "../../lib/stores/useClimateData";
import { useEnergyData } from "../../lib/stores/useEnergyData";

const Scene3D: React.FC = () => {
  const sceneRef = useRef<THREE.Group>(null);
  const { sceneType, animationSpeed } = use3DScene();
  const { climateData } = useClimateData();
  const { energyData } = useEnergyData();

  // Disabled automatic scene rotation to prevent auto-zoom issues
  // useFrame((state) => {
  //   if (sceneRef.current) {
  //     sceneRef.current.rotation.y += animationSpeed * 0.001;
  //   }
  // });

  // Lighting setup
  const LightingSetup = () => (
    <>
      <ambientLight intensity={0.3} color="#b3d9ff" />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight
        position={[0, 20, 0]}
        intensity={0.5}
        color="#4facfe"
        distance={100}
        decay={2}
      />
      <spotLight
        position={[20, 30, 20]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.5}
        color="#43e97b"
        castShadow
      />
    </>
  );

  // Environment setup
  const EnvironmentSetup = () => (
    <>
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Atmospheric clouds - using safe properties */}
      <group>
        <mesh position={[20, 15, -30]}>
          <sphereGeometry args={[3, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            fog={true}
          />
        </mesh>
        <mesh position={[-25, 20, 25]}>
          <sphereGeometry args={[4, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            fog={true}
          />
        </mesh>
        <mesh position={[0, 25, -20]}>
          <sphereGeometry args={[5, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            fog={true}
          />
        </mesh>
      </group>
    </>
  );

  // Ground plane
  const GroundPlane = () => (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, 0]}
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial
        color="#1a1a2e"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        minDistance={5}
        maxDistance={100}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        autoRotateSpeed={0}
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
      
      <LightingSetup />
      <EnvironmentSetup />
      <GroundPlane />
      
      <group ref={sceneRef}>
        {/* Main content based on scene type */}
        {sceneType === 'overview' && (
          <>
            <group position={[-15, 0, 0]}>
              <InteractiveEnergyGrid3D data={energyData} interactive={false} />
            </group>
            <group position={[15, 0, 0]}>
              <ClimateHeatmap data={climateData} />
            </group>
          </>
        )}
        
        {sceneType === 'energy' && (
          <InteractiveEnergyGrid3D data={energyData} interactive={true} />
        )}
        
        {sceneType === 'climate' && (
          <ClimateHeatmap data={climateData} interactive={true} />
        )}
        
        {/* Particle systems - disabled to prevent auto-zoom issues */}
        {/* <ParticleSystem
          count={300}
          type="energy"
          bounds={[40, 20, 40]}
          intensity={0.8}
        />

        <ParticleSystem
          count={200}
          type="carbon"
          bounds={[30, 25, 30]}
          intensity={0.6}
        />

        <ParticleSystem
          count={150}
          type="climate"
          bounds={[50, 15, 50]}
          intensity={0.7}
        /> */}
        
        {/* Atmospheric effects - disabled to prevent auto-zoom issues */}
        {/* <group>
          <mesh position={[0, 8, 0]}>
            <sphereGeometry args={[30, 16, 16]} />
            <meshBasicMaterial
              color="#88ccff"
              transparent
              opacity={0.05}
              side={THREE.BackSide}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[25, 32, 32]} />
            <meshBasicMaterial
              color="#4facfe"
              transparent
              opacity={0.03}
              wireframe
            />
          </mesh>
        </group> */}
      </group>
      
      {/* Post-processing effects would go here */}
      <Environment preset="sunset" background={false} />
    </>
  );
};

export default Scene3D;
