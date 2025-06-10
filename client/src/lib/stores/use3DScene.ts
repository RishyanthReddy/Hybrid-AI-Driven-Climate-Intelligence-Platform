import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as THREE from 'three';

interface Camera3DState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

interface Lighting3DState {
  ambientIntensity: number;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
  pointLights: Array<{
    position: [number, number, number];
    intensity: number;
    color: string;
    distance?: number;
  }>;
}

interface Scene3DState {
  // Scene management
  show3D: boolean;
  sceneType: 'overview' | 'energy' | 'climate' | 'custom';
  isLoading: boolean;
  
  // Performance settings
  enablePostProcessing: boolean;
  shadowsEnabled: boolean;
  antialiasingLevel: 0 | 2 | 4 | 8;
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  maxParticles: number;
  lodEnabled: boolean;
  
  // Animation settings
  animationSpeed: number;
  pauseAnimations: boolean;
  particleAnimations: boolean;
  cameraAnimations: boolean;
  
  // Camera state
  camera: Camera3DState;
  
  // Lighting state
  lighting: Lighting3DState;
  
  // Object visibility
  objectVisibility: {
    energyGrid: boolean;
    climateHeatmap: boolean;
    particles: boolean;
    annotations: boolean;
    grid: boolean;
    skybox: boolean;
  };
  
  // Interaction state
  orbitControls: {
    enabled: boolean;
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    minDistance: number;
    maxDistance: number;
  };
  
  // Debug and development
  showStats: boolean;
  showHelper: boolean;
  wireframeMode: boolean;
  debugMode: boolean;
  
  // Actions
  toggle3D: () => void;
  setSceneType: (type: typeof Scene3DState.prototype.sceneType) => void;
  updateCamera: (updates: Partial<Camera3DState>) => void;
  updateLighting: (updates: Partial<Lighting3DState>) => void;
  setObjectVisibility: (object: keyof typeof Scene3DState.prototype.objectVisibility, visible: boolean) => void;
  setRenderQuality: (quality: typeof Scene3DState.prototype.renderQuality) => void;
  setAnimationSpeed: (speed: number) => void;
  resetScene: () => void;
  
  // Presets
  applyQualityPreset: (preset: 'performance' | 'balanced' | 'quality') => void;
  applyCameraPreset: (preset: 'overview' | 'closeup' | 'birds_eye' | 'ground_level') => void;
  applyLightingPreset: (preset: 'natural' | 'dramatic' | 'studio' | 'night') => void;
  
  // Utilities
  exportSceneConfig: () => string;
  importSceneConfig: (config: string) => void;
  captureScreenshot: () => Promise<string>;
}

export const use3DScene = create<Scene3DState>()(
  subscribeWithSelector((set, get) => {
    return {
      // Initial state
      show3D: false,
      sceneType: 'overview',
      isLoading: false,
      
      // Performance settings
      enablePostProcessing: true,
      shadowsEnabled: true,
      antialiasingLevel: 4,
      renderQuality: 'high',
      maxParticles: 1000,
      lodEnabled: true,
      
      // Animation settings
      animationSpeed: 1.0,
      pauseAnimations: false,
      particleAnimations: true,
      cameraAnimations: true,
      
      // Camera state
      camera: {
        position: [0, 15, 25],
        target: [0, 0, 0],
        fov: 60,
        near: 0.1,
        far: 1000
      },
      
      // Lighting state
      lighting: {
        ambientIntensity: 0.4,
        directionalIntensity: 0.8,
        directionalPosition: [10, 10, 5],
        pointLights: [
          {
            position: [0, 10, 0],
            intensity: 0.5,
            color: '#4facfe',
            distance: 100
          },
          {
            position: [20, 15, 10],
            intensity: 0.3,
            color: '#43e97b',
            distance: 80
          }
        ]
      },
      
      // Object visibility
      objectVisibility: {
        energyGrid: true,
        climateHeatmap: true,
        particles: true,
        annotations: true,
        grid: true,
        skybox: true
      },
      
      // Interaction state
      orbitControls: {
        enabled: true,
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        autoRotate: false,
        autoRotateSpeed: 0.5,
        minDistance: 5,
        maxDistance: 100
      },
      
      // Debug and development
      showStats: import.meta.env.DEV,
      showHelper: false,
      wireframeMode: false,
      debugMode: false,

      // Toggle 3D view
      toggle3D: () => {
        set(state => ({ show3D: !state.show3D }));
      },

      // Set scene type
      setSceneType: (type) => {
        set({ sceneType: type });
        
        // Apply scene-specific settings
        switch (type) {
          case 'energy':
            get().setObjectVisibility('energyGrid', true);
            get().setObjectVisibility('climateHeatmap', false);
            get().updateLighting({ 
              pointLights: [
                { position: [0, 10, 0], intensity: 0.7, color: '#4facfe', distance: 100 }
              ]
            });
            break;
            
          case 'climate':
            get().setObjectVisibility('energyGrid', false);
            get().setObjectVisibility('climateHeatmap', true);
            get().updateLighting({
              pointLights: [
                { position: [0, 10, 0], intensity: 0.7, color: '#43e97b', distance: 100 }
              ]
            });
            break;
            
          case 'overview':
          default:
            get().setObjectVisibility('energyGrid', true);
            get().setObjectVisibility('climateHeatmap', true);
            break;
        }
      },

      // Update camera
      updateCamera: (updates) => {
        set(state => ({
          camera: { ...state.camera, ...updates }
        }));
      },

      // Update lighting
      updateLighting: (updates) => {
        set(state => ({
          lighting: { ...state.lighting, ...updates }
        }));
      },

      // Set object visibility
      setObjectVisibility: (object, visible) => {
        set(state => ({
          objectVisibility: {
            ...state.objectVisibility,
            [object]: visible
          }
        }));
      },

      // Set render quality
      setRenderQuality: (quality) => {
        set({ renderQuality: quality });
        
        // Apply quality-specific settings
        switch (quality) {
          case 'low':
            set({
              enablePostProcessing: false,
              shadowsEnabled: false,
              antialiasingLevel: 0,
              maxParticles: 200,
              lodEnabled: true
            });
            break;
            
          case 'medium':
            set({
              enablePostProcessing: false,
              shadowsEnabled: true,
              antialiasingLevel: 2,
              maxParticles: 500,
              lodEnabled: true
            });
            break;
            
          case 'high':
            set({
              enablePostProcessing: true,
              shadowsEnabled: true,
              antialiasingLevel: 4,
              maxParticles: 1000,
              lodEnabled: false
            });
            break;
            
          case 'ultra':
            set({
              enablePostProcessing: true,
              shadowsEnabled: true,
              antialiasingLevel: 8,
              maxParticles: 2000,
              lodEnabled: false
            });
            break;
        }
      },

      // Set animation speed
      setAnimationSpeed: (speed) => {
        set({ animationSpeed: Math.max(0, Math.min(3, speed)) });
      },

      // Reset scene
      resetScene: () => {
        set({
          camera: {
            position: [0, 15, 25],
            target: [0, 0, 0],
            fov: 60,
            near: 0.1,
            far: 1000
          },
          animationSpeed: 1.0,
          pauseAnimations: false,
          sceneType: 'overview',
          objectVisibility: {
            energyGrid: true,
            climateHeatmap: true,
            particles: true,
            annotations: true,
            grid: true,
            skybox: true
          }
        });
      },

      // Apply quality preset
      applyQualityPreset: (preset) => {
        switch (preset) {
          case 'performance':
            get().setRenderQuality('low');
            set({
              particleAnimations: false,
              cameraAnimations: false,
              maxParticles: 100
            });
            break;
            
          case 'balanced':
            get().setRenderQuality('medium');
            set({
              particleAnimations: true,
              cameraAnimations: true,
              maxParticles: 500
            });
            break;
            
          case 'quality':
            get().setRenderQuality('ultra');
            set({
              particleAnimations: true,
              cameraAnimations: true,
              maxParticles: 2000
            });
            break;
        }
      },

      // Apply camera preset
      applyCameraPreset: (preset) => {
        switch (preset) {
          case 'overview':
            get().updateCamera({
              position: [0, 15, 25],
              target: [0, 0, 0],
              fov: 60
            });
            break;
            
          case 'closeup':
            get().updateCamera({
              position: [5, 8, 12],
              target: [0, 0, 0],
              fov: 45
            });
            break;
            
          case 'birds_eye':
            get().updateCamera({
              position: [0, 50, 0],
              target: [0, 0, 0],
              fov: 75
            });
            break;
            
          case 'ground_level':
            get().updateCamera({
              position: [0, 2, 8],
              target: [0, 0, 0],
              fov: 80
            });
            break;
        }
      },

      // Apply lighting preset
      applyLightingPreset: (preset) => {
        switch (preset) {
          case 'natural':
            get().updateLighting({
              ambientIntensity: 0.6,
              directionalIntensity: 1.0,
              directionalPosition: [10, 10, 5],
              pointLights: []
            });
            break;
            
          case 'dramatic':
            get().updateLighting({
              ambientIntensity: 0.2,
              directionalIntensity: 1.5,
              directionalPosition: [20, 30, 10],
              pointLights: [
                { position: [-20, 15, -10], intensity: 0.8, color: '#ff6b6b' }
              ]
            });
            break;
            
          case 'studio':
            get().updateLighting({
              ambientIntensity: 0.4,
              directionalIntensity: 0.8,
              directionalPosition: [10, 10, 5],
              pointLights: [
                { position: [10, 20, 10], intensity: 0.6, color: '#ffffff' },
                { position: [-10, 20, 10], intensity: 0.4, color: '#ffffff' },
                { position: [0, 5, -15], intensity: 0.3, color: '#ffffff' }
              ]
            });
            break;
            
          case 'night':
            get().updateLighting({
              ambientIntensity: 0.1,
              directionalIntensity: 0.3,
              directionalPosition: [5, 20, 5],
              pointLights: [
                { position: [0, 10, 0], intensity: 1.0, color: '#4facfe', distance: 50 },
                { position: [15, 8, 15], intensity: 0.8, color: '#43e97b', distance: 40 },
                { position: [-15, 8, -15], intensity: 0.6, color: '#feca57', distance: 30 }
              ]
            });
            break;
        }
      },

      // Export scene configuration
      exportSceneConfig: () => {
        const state = get();
        const config = {
          camera: state.camera,
          lighting: state.lighting,
          objectVisibility: state.objectVisibility,
          orbitControls: state.orbitControls,
          renderQuality: state.renderQuality,
          animationSpeed: state.animationSpeed
        };
        
        return JSON.stringify(config, null, 2);
      },

      // Import scene configuration
      importSceneConfig: (configString) => {
        try {
          const config = JSON.parse(configString);
          
          set({
            camera: config.camera || get().camera,
            lighting: config.lighting || get().lighting,
            objectVisibility: config.objectVisibility || get().objectVisibility,
            orbitControls: config.orbitControls || get().orbitControls,
            renderQuality: config.renderQuality || get().renderQuality,
            animationSpeed: config.animationSpeed || get().animationSpeed
          });
        } catch (error) {
          console.error('Failed to import scene configuration:', error);
        }
      },

      // Capture screenshot
      captureScreenshot: async () => {
        try {
          // This would need to be implemented with the actual Three.js renderer
          // For now, return a placeholder
          return 'data:image/png;base64,placeholder';
        } catch (error) {
          console.error('Failed to capture screenshot:', error);
          throw error;
        }
      }
    };
  })
);

// Subscribe to scene type changes
use3DScene.subscribe(
  (state) => state.sceneType,
  (sceneType) => {
    console.log('Scene type changed:', sceneType);
  }
);

// Subscribe to render quality changes
use3DScene.subscribe(
  (state) => state.renderQuality,
  (quality) => {
    console.log('Render quality changed:', quality);
  }
);

// Export helper functions
export const getCameraConfiguration = () => {
  const state = use3DScene.getState();
  return {
    ...state.camera,
    aspect: window.innerWidth / window.innerHeight
  };
};

export const getLightingConfiguration = () => {
  const state = use3DScene.getState();
  return state.lighting;
};

export const getPerformanceSettings = () => {
  const state = use3DScene.getState();
  return {
    enablePostProcessing: state.enablePostProcessing,
    shadowsEnabled: state.shadowsEnabled,
    antialiasingLevel: state.antialiasingLevel,
    renderQuality: state.renderQuality,
    maxParticles: state.maxParticles,
    lodEnabled: state.lodEnabled
  };
};

export const getAnimationSettings = () => {
  const state = use3DScene.getState();
  return {
    animationSpeed: state.animationSpeed,
    pauseAnimations: state.pauseAnimations,
    particleAnimations: state.particleAnimations,
    cameraAnimations: state.cameraAnimations
  };
};

// Performance monitoring helper
export const getPerformanceMetrics = () => {
  const settings = getPerformanceSettings();
  
  // Calculate estimated performance impact
  let performanceScore = 100;
  
  if (settings.enablePostProcessing) performanceScore -= 20;
  if (settings.shadowsEnabled) performanceScore -= 15;
  performanceScore -= settings.antialiasingLevel * 5;
  performanceScore -= Math.max(0, (settings.maxParticles - 500) / 50);
  
  return {
    estimatedPerformance: Math.max(0, performanceScore),
    memoryUsageEstimate: `${Math.round(settings.maxParticles * 0.01 + (settings.shadowsEnabled ? 50 : 20))}MB`,
    recommendations: performanceScore < 60 ? [
      'Consider reducing particle count',
      'Disable post-processing effects',
      'Lower anti-aliasing level',
      'Enable LOD optimization'
    ] : []
  };
};
