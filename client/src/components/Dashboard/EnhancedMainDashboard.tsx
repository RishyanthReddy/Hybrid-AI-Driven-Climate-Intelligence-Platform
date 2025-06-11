import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import MetricsPanel from './MetricsPanel';
import AIInsightsPanel from './AIInsightsPanel';
import InteractiveEnergyGrid3D from '../3D/InteractiveEnergyGrid3D';
import InteractiveCityGrid from '../3D/InteractiveCityGrid';
import CarbonEmissionParticles from '../3D/CarbonEmissionParticles';
import AdvancedDataVisualization from '../Analytics/AdvancedDataVisualization';

import ClimateImpactDashboard from '../ClimateAction/ClimateImpactDashboard';
import { useClimateData } from '../../lib/stores/useClimateData';
import { useEnergyData } from '../../lib/stores/useEnergyData';
import { useAlgorithms } from '../../lib/hooks/useAlgorithms';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EnhancedMainDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'energy' | 'climate' | 'analytics' | '3d-city'>('overview');
  const [show3DParticles, setShow3DParticles] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  
  const { climateData } = useClimateData();
  const { energyData } = useEnergyData();
  const { 
    energyFlowResults, 
    climateScoreResults, 
    vulnerabilityResults, 
    resilienceResults,
    isProcessing 
  } = useAlgorithms();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Generate city buildings data
  const cityBuildings = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `building-${i}`,
      position: [
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      height: 1 + Math.random() * 4,
      energyConsumption: 50 + Math.random() * 200,
      efficiency: 60 + Math.random() * 40,
      type: ['residential', 'commercial', 'industrial'][Math.floor(Math.random() * 3)] as 'residential' | 'commercial' | 'industrial',
      status: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'inactive' : 'active' as 'active' | 'inactive' | 'critical'
    }));
  }, []);

  // Carbon emission sources for particle system
  const emissionSources = React.useMemo(() => {
    return cityBuildings
      .filter(building => building.type === 'industrial' || building.efficiency < 70)
      .map(building => ({
        position: [building.position[0], building.height + 1, building.position[2]] as [number, number, number],
        intensity: (100 - building.efficiency) / 100,
        type: building.type as 'factory' | 'vehicle' | 'building'
      }));
  }, [cityBuildings]);

  const ViewSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: 'overview', label: 'Overview', icon: 'fas fa-home' },
        { key: 'energy', label: 'Energy Grid', icon: 'fas fa-bolt' },
        { key: 'climate', label: 'Climate Impact', icon: 'fas fa-leaf' },
        { key: '3d-city', label: 'City Visualization', icon: 'fas fa-city' },
        { key: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' }
      ].map(view => (
        <Button
          key={view.key}
          onClick={() => setActiveView(view.key as any)}
          variant={activeView === view.key ? "default" : "outline"}
          className={`${
            activeView === view.key
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-white/10 hover:bg-white/20 border-white/20'
          } text-white`}
        >
          <i className={`${view.icon} mr-2`}></i>
          {view.label}
        </Button>
      ))}
    </div>
  );

  const RealTimeStatus = () => (
    <Card className="glass border-white/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">System Online</span>
            </div>
            <div className="text-white/60 text-sm">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-white/80">
              Processing: <span className="text-blue-400">{isProcessing ? 'Active' : 'Complete'}</span>
            </div>
            <Button
              onClick={() => setShow3DParticles(!show3DParticles)}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <i className={`fas fa-${show3DParticles ? 'eye-slash' : 'eye'} mr-2`}></i>
              {show3DParticles ? 'Hide' : 'Show'} Emissions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OverviewDashboard = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Metrics and AI Insights */}
      <div className="xl:col-span-1 space-y-6 overflow-y-auto max-h-screen">
        <MetricsPanel 
          energyData={energyData}
          climateData={climateData}
          algorithmResults={{
            energyFlow: energyFlowResults,
            climateScore: climateScoreResults,
            vulnerability: vulnerabilityResults
          }}
        />
        
        <AIInsightsPanel 
          isProcessing={isProcessing}
          insights={{
            energyEfficiency: energyFlowResults?.efficiency || 0,
            climateImpact: climateScoreResults?.overallScore || 0,
            vulnerabilityLevel: vulnerabilityResults?.averageVulnerability || 0
          }}
        />

        {/* Resilience Index Display */}
        {resilienceResults && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-400"></i>
                Climate Resilience Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-400">
                    {resilienceResults.overallScore.toFixed(1)}
                  </div>
                  <div className="text-white/60 text-sm">Overall Resilience Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {resilienceResults.infrastructureResilience.toFixed(1)}
                    </div>
                    <div className="text-white/60">Infrastructure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">
                      {resilienceResults.communityPreparedness.toFixed(1)}
                    </div>
                    <div className="text-white/60">Community</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-400">
                      {resilienceResults.economicStability.toFixed(1)}
                    </div>
                    <div className="text-white/60">Economic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-400">
                      {resilienceResults.adaptationCapacity.toFixed(1)}
                    </div>
                    <div className="text-white/60">Adaptation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="xl:col-span-2 bg-black/20 rounded-xl overflow-hidden">
        <div className="h-full min-h-[600px]">
          <Canvas
            camera={{ position: [0, 8, 12], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <InteractiveEnergyGrid3D 
                data={energyData} 
                interactive={true}
                selectedNode={null}
                onNodeSelect={(node) => console.log('Selected node:', node)}
              />
              {show3DParticles && (
                <CarbonEmissionParticles 
                  emissionSources={emissionSources}
                  animationSpeed={1}
                />
              )}
            </Suspense>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[0, 10, 0]} intensity={0.3} color="#4facfe" />
          </Canvas>
        </div>
      </div>
    </div>
  );

  const CityVisualization = () => (
    <div className="h-full min-h-[700px] bg-black/20 rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <InteractiveCityGrid
            buildings={cityBuildings}
            onBuildingClick={setSelectedBuilding}
            showEnergyFlow={true}
            animationSpeed={1}
          />
          {show3DParticles && (
            <CarbonEmissionParticles 
              emissionSources={emissionSources}
              animationSpeed={0.8}
            />
          )}
        </Suspense>
      </Canvas>
      
      {selectedBuilding && (
        <div className="absolute top-4 right-4 glass p-4 rounded-xl max-w-sm">
          <h3 className="text-white font-bold mb-2">Building Details</h3>
          <div className="text-white/80 text-sm space-y-1">
            <div>Type: {selectedBuilding.type}</div>
            <div>Consumption: {selectedBuilding.energyConsumption.toFixed(1)} kW</div>
            <div>Efficiency: {selectedBuilding.efficiency.toFixed(1)}%</div>
            <div>Status: <span className={`${
              selectedBuilding.status === 'active' ? 'text-green-400' :
              selectedBuilding.status === 'critical' ? 'text-red-400' :
              'text-yellow-400'
            }`}>{selectedBuilding.status}</span></div>
          </div>
          <Button
            onClick={() => setSelectedBuilding(null)}
            size="sm"
            className="mt-3 bg-red-600 hover:bg-red-700"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-6 overflow-hidden"
    >
      <ViewSelector />
      <RealTimeStatus />
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'overview' && <OverviewDashboard />}
        
        {activeView === 'energy' && (
          <div className="h-full bg-black/20 rounded-xl overflow-hidden">
            <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
              <Suspense fallback={null}>
                <InteractiveEnergyGrid3D 
                  data={energyData} 
                  interactive={true}
                  selectedNode={null}
                  onNodeSelect={(node) => console.log('Selected node:', node)}
                />
              </Suspense>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
            </Canvas>
          </div>
        )}
        
        {activeView === 'climate' && (
          <ClimateImpactDashboard
            climateData={climateData}
            emissionSources={emissionSources}
            show3DParticles={show3DParticles}
          />
        )}
        
        {activeView === '3d-city' && <CityVisualization />}
        

        
        {activeView === 'analytics' && (
          <AdvancedDataVisualization
            energyData={energyData}
            climateData={climateData}
            algorithmResults={{
              energyFlow: energyFlowResults,
              climateScore: climateScoreResults,
              vulnerability: vulnerabilityResults
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedMainDashboard;