import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CinematicVisualizationProps {
  type: 'energy' | 'climate' | 'city';
  className?: string;
}

const CinematicVisualization: React.FC<CinematicVisualizationProps> = ({
  type,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000011, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x0a0a2e, 0.15);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 0);
    pointLight1.position.set(20, 20, 20);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 2.5, 0);
    pointLight2.position.set(-25, -15, -25);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x4ecdc4, 2, 0);
    pointLight3.position.set(0, 30, 0);
    scene.add(pointLight3);

    // Create visualization based on type
    createVisualization(scene, type);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Animate scene objects
      scene.traverse((object) => {
        if (object.userData.animate) {
          object.userData.animate(time);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;

      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Sci-Fi UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top HUD */}
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-3 text-white text-sm backdrop-blur-sm border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
            <div className="font-semibold capitalize flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              {type.toUpperCase()} GRID
            </div>
            <div className="text-cyan-300/80 text-xs">NEURAL NETWORK ACTIVE</div>
            <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              REAL-TIME SYNC
            </div>
          </div>
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60"></div>

        {/* Scanning Lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

// Enhanced Three.js visualization creation function
const createVisualization = (scene: THREE.Scene, type: string) => {
  // Enhanced particle system with multiple layers
  createAdvancedParticleSystem(scene);

  // Create atmospheric background
  createAtmosphericBackground(scene);

  // Create enhanced HUD elements
  createEnhancedHUD(scene);

  // Type-specific visualizations
  if (type === 'energy') {
    createRealisticEnergyGrid(scene);
  } else if (type === 'climate') {
    createRealisticTerrain(scene);
  } else if (type === 'city') {
    createRealisticSmartCity(scene);
  }
};

// Advanced multi-layer particle system
const createAdvancedParticleSystem = (scene: THREE.Scene) => {
  // Layer 1: Distant stars
  const starCount = 3000;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const radius = 50 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);

    // Varied star colors
    const color = new THREE.Color();
    const hue = Math.random() * 0.3 + 0.5; // Blue to cyan range
    color.setHSL(hue, 0.8, 0.7 + Math.random() * 0.3);
    starColors[i * 3] = color.r;
    starColors[i * 3 + 1] = color.g;
    starColors[i * 3 + 2] = color.b;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.userData.animate = (time: number) => {
    stars.rotation.y = time * 0.01;
    stars.rotation.x = Math.sin(time * 0.1) * 0.02;
  };
  scene.add(stars);

  // Layer 2: Energy particles
  const energyCount = 1500;
  const energyPositions = new Float32Array(energyCount * 3);

  for (let i = 0; i < energyCount; i++) {
    const radius = 15 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    energyPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    energyPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    energyPositions[i * 3 + 2] = radius * Math.cos(phi);
  }

  const energyGeometry = new THREE.BufferGeometry();
  energyGeometry.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));

  const energyMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.4,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const energyParticles = new THREE.Points(energyGeometry, energyMaterial);
  energyParticles.userData.animate = (time: number) => {
    energyParticles.rotation.y = time * 0.08;
    energyParticles.rotation.x = Math.sin(time * 0.4) * 0.15;

    // Animate individual particles
    const positions = energyParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < energyCount; i++) {
      const i3 = i * 3;
      const originalY = energyPositions[i3 + 1];
      positions[i3 + 1] = originalY + Math.sin(time * 3 + i * 0.02) * 0.8;
    }
    energyParticles.geometry.attributes.position.needsUpdate = true;
  };
  scene.add(energyParticles);
};







// Create atmospheric background with nebula effect
const createAtmosphericBackground = (scene: THREE.Scene) => {
  // Create nebula-like background sphere
  const nebulaGeometry = new THREE.SphereGeometry(200, 32, 32);
  const nebulaMaterial = new THREE.MeshBasicMaterial({
    color: 0x0a0a2e,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    fog: false
  });

  const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  nebula.userData.animate = (time: number) => {
    nebula.rotation.y = time * 0.005;
    nebula.rotation.x = time * 0.003;
  };
  scene.add(nebula);

  // Add gradient planes for depth
  for (let i = 0; i < 5; i++) {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.6 + i * 0.1, 0.5, 0.1),
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -50 - i * 20;
    plane.rotation.x = Math.random() * Math.PI;
    plane.rotation.y = Math.random() * Math.PI;

    plane.userData.animate = (time: number) => {
      plane.rotation.z = time * (0.01 + i * 0.005);
    };
    scene.add(plane);
  }
};

// Enhanced HUD with scanning effects
const createEnhancedHUD = (scene: THREE.Scene) => {
  // Main scanning rings with enhanced materials
  const createScanRing = (radius: number, color: number, opacity: number, z: number, speed: number) => {
    const ringGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = z;
    ring.userData.animate = (time: number) => {
      ring.rotation.z = time * speed;
      // Pulsing effect
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;
      ring.scale.setScalar(pulse);
      (ring.material as THREE.MeshBasicMaterial).opacity = opacity * pulse;
    };
    scene.add(ring);
  };

  createScanRing(15, 0x00ffff, 0.4, -10, 0.15);
  createScanRing(12, 0xff6b6b, 0.6, -8, -0.12);
  createScanRing(9, 0x4ecdc4, 0.8, -6, 0.18);
  createScanRing(6, 0xfeca57, 0.5, -4, -0.2);

  // Holographic grid
  const gridSize = 40;
  const gridDivisions = 20;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ffff, 0x004444);
  gridHelper.position.y = -15;
  (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
  (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.3;
  gridHelper.userData.animate = (time: number) => {
    (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.2 + Math.sin(time * 2) * 0.1;
  };
  scene.add(gridHelper);
};

// Realistic Energy Grid inspired by reference image
const createRealisticEnergyGrid = (scene: THREE.Scene) => {
  const gridWidth = 8;
  const gridHeight = 6;
  const nodeSpacing = 3;
  const nodes: Array<{position: THREE.Vector3, type: string, connections: number[]}> = [];

  // Create structured grid layout like in reference
  for (let x = 0; x < gridWidth; x++) {
    for (let z = 0; z < gridHeight; z++) {
      const position = new THREE.Vector3(
        (x - gridWidth / 2) * nodeSpacing,
        Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2,
        (z - gridHeight / 2) * nodeSpacing
      );

      // Determine node type based on position
      let nodeType = 'standard';
      if (x === 0 || x === gridWidth - 1 || z === 0 || z === gridHeight - 1) {
        nodeType = 'edge';
      } else if (Math.random() > 0.7) {
        nodeType = 'hub';
      }

      nodes.push({
        position,
        type: nodeType,
        connections: []
      });
    }
  }

  // Create connections between adjacent nodes
  const connections: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = nodes[i].position.distanceTo(nodes[j].position);
      if (distance < nodeSpacing * 1.5) {
        nodes[i].connections.push(j);
        nodes[j].connections.push(i);

        connections.push(
          nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
          nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
        );
      }
    }
  }

  // Create enhanced connection lines with glow effect
  if (connections.length > 0) {
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connections), 3));

    // Main connection lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.userData.animate = (time: number) => {
      lines.rotation.y = time * 0.01;
      // Pulsing connections
      (lines.material as THREE.LineBasicMaterial).opacity = 0.6 + Math.sin(time * 4) * 0.2;
    };
    scene.add(lines);

    // Glow effect lines
    const glowMaterial = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      linewidth: 3
    });

    const glowLines = new THREE.LineSegments(lineGeometry.clone(), glowMaterial);
    glowLines.scale.setScalar(1.02);
    glowLines.userData.animate = (time: number) => {
      glowLines.rotation.y = time * 0.01;
    };
    scene.add(glowLines);
  }

  // Create enhanced nodes with different types
  nodes.forEach((node, i) => {
    let nodeGeometry: THREE.BufferGeometry;
    let nodeMaterial: THREE.Material;
    let nodeSize = 0.2;

    switch (node.type) {
      case 'hub':
        nodeGeometry = new THREE.OctahedronGeometry(0.3);
        nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4444,
          emissive: 0xff2222,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.9
        });
        nodeSize = 0.3;
        break;
      case 'edge':
        nodeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0x44ff44,
          emissive: 0x22ff22,
          emissiveIntensity: 0.6,
          transparent: true,
          opacity: 0.8
        });
        nodeSize = 0.25;
        break;
      default:
        nodeGeometry = new THREE.SphereGeometry(0.2, 12, 12);
        nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0x4444ff,
          emissive: 0x2222ff,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.7
        });
    }

    const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    nodeMesh.position.copy(node.position);

    nodeMesh.userData.animate = (time: number) => {
      const pulse = Math.sin(time * 3 + i * 0.3) * 0.4 + 1;
      nodeMesh.scale.setScalar(pulse);

      // Floating animation
      nodeMesh.position.y = node.position.y + Math.sin(time * 2 + i * 0.5) * 0.3;
    };

    scene.add(nodeMesh);

    // Add node glow effect
    const glowGeometry = nodeGeometry.clone();
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: (nodeMaterial as THREE.MeshBasicMaterial).color,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(node.position);
    glow.scale.setScalar(1.5);

    glow.userData.animate = (time: number) => {
      const pulse = Math.sin(time * 2 + i * 0.4) * 0.3 + 1.2;
      glow.scale.setScalar(pulse);
      glow.position.y = node.position.y + Math.sin(time * 2 + i * 0.5) * 0.3;
    };

    scene.add(glow);
  });
};

// Realistic Terrain inspired by reference topographic visualization
const createRealisticTerrain = (scene: THREE.Scene) => {
  const terrainSize = 64;
  const terrainScale = 30;
  const heightScale = 8;

  // Generate realistic height map using multiple noise layers
  const generateHeightMap = (size: number) => {
    const heights: number[] = [];

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        // Multiple octaves of noise for realistic terrain
        let height = 0;
        let amplitude = 1;
        let frequency = 0.02;

        // Add multiple noise layers
        for (let i = 0; i < 6; i++) {
          height += Math.sin(x * frequency) * Math.cos(z * frequency) * amplitude;
          height += Math.sin(x * frequency * 2.1) * Math.cos(z * frequency * 1.9) * amplitude * 0.5;
          amplitude *= 0.5;
          frequency *= 2;
        }

        // Add some mountain peaks
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - size / 2, 2) + Math.pow(z - size / 2, 2)
        );
        const mountainFactor = Math.max(0, 1 - distanceFromCenter / (size * 0.3));
        height += mountainFactor * mountainFactor * 4;

        heights.push(Math.max(0, height));
      }
    }

    return heights;
  };

  const heights = generateHeightMap(terrainSize);

  // Create terrain geometry
  const terrainGeometry = new THREE.PlaneGeometry(
    terrainScale,
    terrainScale,
    terrainSize - 1,
    terrainSize - 1
  );

  // Apply height map to vertices
  const vertices = terrainGeometry.attributes.position.array as Float32Array;
  for (let i = 0; i < heights.length; i++) {
    vertices[i * 3 + 2] = heights[i] * heightScale;
  }

  // Recalculate normals for proper lighting
  terrainGeometry.computeVertexNormals();

  // Create realistic terrain material with height-based coloring
  const terrainMaterial = new THREE.MeshLambertMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  });

  // Add vertex colors based on height
  const colors: number[] = [];
  for (let i = 0; i < heights.length; i++) {
    const height = heights[i];
    const color = new THREE.Color();

    if (height < 1) {
      // Water/low areas - blue
      color.setHSL(0.6, 0.8, 0.3);
    } else if (height < 2) {
      // Shore/beach - cyan
      color.setHSL(0.5, 0.7, 0.5);
    } else if (height < 4) {
      // Forest/vegetation - green
      color.setHSL(0.3, 0.6, 0.4);
    } else if (height < 6) {
      // Hills - yellow/brown
      color.setHSL(0.15, 0.7, 0.5);
    } else {
      // Mountains/peaks - white/gray
      color.setHSL(0, 0, 0.7 + height * 0.05);
    }

    colors.push(color.r, color.g, color.b);
  }

  terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.y = -5;

  terrain.userData.animate = (time: number) => {
    terrain.rotation.z = time * 0.005;

    // Animate vertex colors for dynamic effect
    const colorAttribute = terrain.geometry.attributes.color;
    const colorArray = colorAttribute.array as Float32Array;

    for (let i = 0; i < heights.length; i++) {
      const height = heights[i];
      const pulse = Math.sin(time * 2 + i * 0.01) * 0.1 + 0.9;

      colorArray[i * 3] *= pulse;     // R
      colorArray[i * 3 + 1] *= pulse; // G
      colorArray[i * 3 + 2] *= pulse; // B
    }

    colorAttribute.needsUpdate = true;
  };

  scene.add(terrain);

  // Add wireframe overlay for technical look
  const wireframeGeometry = terrainGeometry.clone();
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });

  const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  wireframe.rotation.x = -Math.PI / 2;
  wireframe.position.y = -4.9;

  wireframe.userData.animate = (time: number) => {
    wireframe.rotation.z = time * 0.005;
    (wireframe.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time * 3) * 0.1;
  };

  scene.add(wireframe);

  // Add contour lines for topographic effect
  for (let level = 1; level <= 6; level++) {
    const contourGeometry = new THREE.RingGeometry(level * 3, level * 3 + 0.1, 64);
    const contourMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const contour = new THREE.Mesh(contourGeometry, contourMaterial);
    contour.rotation.x = -Math.PI / 2;
    contour.position.y = level * 1.2 - 4;

    contour.userData.animate = (time: number) => {
      const pulse = Math.sin(time * 2 + level * 0.5) * 0.2 + 0.8;
      (contour.material as THREE.MeshBasicMaterial).opacity = 0.2 * pulse;
    };

    scene.add(contour);
  }
};

// Realistic Smart City with floating data cubes inspired by reference
const createRealisticSmartCity = (scene: THREE.Scene) => {
  const dataPoints = [
    { position: [8, 6, 5], value: 92, label: "EFFICIENCY", color: 0x00ffff },
    { position: [-6, 4, 8], value: 78, label: "ENERGY", color: 0x4ecdc4 },
    { position: [4, 8, -3], value: 85, label: "NETWORK", color: 0xff6b6b },
    { position: [-8, 5, -6], value: 74, label: "TRAFFIC", color: 0xfeca57 },
    { position: [2, 7, 9], value: 96, label: "SECURITY", color: 0xff9ff3 },
    { position: [-4, 9, 2], value: 81, label: "CLIMATE", color: 0x54a0ff },
    { position: [6, 3, -8], value: 67, label: "WASTE", color: 0x26de81 },
    { position: [-9, 6, 4], value: 89, label: "WATER", color: 0xa55eea }
  ];

  // Create floating data cubes with percentages
  dataPoints.forEach((dataPoint, i) => {
    const [x, y, z] = dataPoint.position;

    // Main data cube
    const cubeSize = 0.8 + (dataPoint.value / 100) * 0.6;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: dataPoint.color,
      emissive: dataPoint.color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.8
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(x, y, z);

    cube.userData.animate = (time: number) => {
      // Floating animation
      cube.position.y = y + Math.sin(time * 2 + i * 0.5) * 0.5;
      cube.rotation.x = time * 0.3 + i;
      cube.rotation.y = time * 0.2 + i * 0.7;

      // Pulsing based on value
      const pulse = Math.sin(time * 3 + i * 0.8) * 0.2 + 1;
      cube.scale.setScalar(pulse);

      // Dynamic emissive intensity
      const intensity = 0.3 + Math.sin(time * 4 + i * 0.3) * 0.2;
      (cube.material as THREE.MeshLambertMaterial).emissiveIntensity = intensity;
    };

    scene.add(cube);

    // Glow effect around cube
    const glowGeometry = new THREE.BoxGeometry(cubeSize * 1.3, cubeSize * 1.3, cubeSize * 1.3);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: dataPoint.color,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(x, y, z);

    glow.userData.animate = (time: number) => {
      glow.position.y = y + Math.sin(time * 2 + i * 0.5) * 0.5;
      glow.rotation.x = time * 0.15 + i;
      glow.rotation.y = time * 0.1 + i * 0.7;

      const glowPulse = Math.sin(time * 2 + i * 0.6) * 0.4 + 1.2;
      glow.scale.setScalar(glowPulse);
    };

    scene.add(glow);

    // Data connection lines to center
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
      x, y, z,
      0, 0, 0
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: dataPoint.color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.userData.animate = (time: number) => {
      const positions = line.geometry.attributes.position.array as Float32Array;
      positions[1] = y + Math.sin(time * 2 + i * 0.5) * 0.5; // Update Y position
      line.geometry.attributes.position.needsUpdate = true;

      const opacity = 0.3 + Math.sin(time * 3 + i * 0.4) * 0.2;
      (line.material as THREE.LineBasicMaterial).opacity = opacity;
    };

    scene.add(line);

    // Particle trail effect
    const trailCount = 20;
    const trailPositions = new Float32Array(trailCount * 3);

    for (let j = 0; j < trailCount; j++) {
      const t = j / trailCount;
      trailPositions[j * 3] = x * (1 - t);
      trailPositions[j * 3 + 1] = (y + Math.sin(j * 0.5) * 0.3) * (1 - t);
      trailPositions[j * 3 + 2] = z * (1 - t);
    }

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMaterial = new THREE.PointsMaterial({
      color: dataPoint.color,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);
    trail.userData.animate = (time: number) => {
      const positions = trail.geometry.attributes.position.array as Float32Array;

      for (let j = 0; j < trailCount; j++) {
        const t = j / trailCount;
        const offset = Math.sin(time * 4 + j * 0.3) * 0.2;
        positions[j * 3] = x * (1 - t) + offset;
        positions[j * 3 + 1] = (y + Math.sin(time * 2 + i * 0.5) * 0.5 + Math.sin(j * 0.5) * 0.3) * (1 - t);
        positions[j * 3 + 2] = z * (1 - t) + offset;
      }

      trail.geometry.attributes.position.needsUpdate = true;
    };

    scene.add(trail);
  });

  // Central hub
  const hubGeometry = new THREE.SphereGeometry(1, 16, 16);
  const hubMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    emissive: 0x4444ff,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.9
  });

  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  hub.position.set(0, 0, 0);

  hub.userData.animate = (time: number) => {
    hub.rotation.x = time * 0.5;
    hub.rotation.y = time * 0.3;

    const pulse = Math.sin(time * 4) * 0.3 + 1;
    hub.scale.setScalar(pulse);

    const intensity = 0.4 + Math.sin(time * 6) * 0.3;
    (hub.material as THREE.MeshLambertMaterial).emissiveIntensity = intensity;
  };

  scene.add(hub);

  // Hub glow
  const hubGlowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
  const hubGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x4444ff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });

  const hubGlow = new THREE.Mesh(hubGlowGeometry, hubGlowMaterial);
  hubGlow.position.set(0, 0, 0);

  hubGlow.userData.animate = (time: number) => {
    const glowPulse = Math.sin(time * 3) * 0.5 + 1.5;
    hubGlow.scale.setScalar(glowPulse);

    const opacity = 0.1 + Math.sin(time * 5) * 0.1;
    (hubGlow.material as THREE.MeshBasicMaterial).opacity = opacity;
  };

  scene.add(hubGlow);
};



export default CinematicVisualization;
