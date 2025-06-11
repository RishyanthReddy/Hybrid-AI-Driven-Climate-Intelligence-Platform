import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import CarbonEmissionParticles from '../3D/CarbonEmissionParticles';
import ClimateHeatmap from '../3D/ClimateHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ClimateData } from '../../types/climate';

interface ClimateImpactDashboardProps {
  climateData: ClimateData | null;
  emissionSources: Array<{
    position: [number, number, number];
    intensity: number;
    type: 'factory' | 'vehicle' | 'building';
  }>;
  show3DParticles: boolean;
}

const ClimateImpactDashboard: React.FC<ClimateImpactDashboardProps> = ({
  climateData,
  emissionSources,
  show3DParticles
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emissions' | 'temperature' | 'risks'>('overview');

  // Calculate climate metrics
  const climateMetrics = useMemo(() => {
    if (!climateData) return null;

    const temperatureChange = climateData.globalTemperature;
    const co2Level = climateData.co2Concentration;
    const emissionReduction = climateData.emissions.reduction;
    const renewableShare = climateData.renewableShare;

    // Calculate risk level based on temperature and CO2
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (temperatureChange > 2.0 || co2Level > 450) riskLevel = 'critical';
    else if (temperatureChange > 1.5 || co2Level > 420) riskLevel = 'high';
    else if (temperatureChange > 1.0 || co2Level > 400) riskLevel = 'medium';

    return {
      temperatureChange,
      co2Level,
      emissionReduction,
      renewableShare,
      riskLevel,
      carbonBudgetUsed: (climateData.carbonBudget.consumed / climateData.carbonBudget.allocated) * 100,
      extremeEvents: climateData.extremeWeatherEvents,
      seaLevelRise: climateData.seaLevelRise
    };
  }, [climateData]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: string }) => (
    <Button
      onClick={() => setActiveTab(id as any)}
      variant={activeTab === id ? "default" : "outline"}
      className={`${
        activeTab === id
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-white/10 hover:bg-white/20 border-white/20'
      } text-white`}
    >
      <i className={`${icon} mr-2`}></i>
      {label}
    </Button>
  );

  if (!climateData || !climateMetrics) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="glass p-8 rounded-xl text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
          <p className="text-white text-lg">Loading Climate Impact Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        <TabButton id="overview" label="Overview" icon="fas fa-globe" />
        <TabButton id="emissions" label="Emissions" icon="fas fa-smog" />
        <TabButton id="temperature" label="Temperature" icon="fas fa-thermometer-half" />
        <TabButton id="risks" label="Climate Risks" icon="fas fa-exclamation-triangle" />
      </div>

      {/* Content Area */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel - Metrics and Data */}
        <div className="xl:col-span-1 space-y-4 overflow-y-auto max-h-full">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Climate Risk Level */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-orange-400"></i>
                    Climate Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge className={`text-lg px-4 py-2 ${getRiskColor(climateMetrics.riskLevel)}`}>
                      {climateMetrics.riskLevel.toUpperCase()}
                    </Badge>
                    <p className="text-white/60 text-sm mt-2">
                      Based on current temperature and CO₂ levels
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Key Climate Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        +{climateMetrics.temperatureChange.toFixed(1)}°C
                      </div>
                      <div className="text-white/60 text-sm">Temperature Rise</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {climateMetrics.co2Level.toFixed(0)} ppm
                      </div>
                      <div className="text-white/60 text-sm">CO₂ Concentration</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Carbon Budget Used</span>
                        <span className="text-white">{climateMetrics.carbonBudgetUsed.toFixed(1)}%</span>
                      </div>
                      <Progress value={climateMetrics.carbonBudgetUsed} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Renewable Energy Share</span>
                        <span className="text-green-400">{climateMetrics.renewableShare.toFixed(1)}%</span>
                      </div>
                      <Progress value={climateMetrics.renewableShare} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Climate Impacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Sea Level Rise</span>
                      <span className="text-blue-400 font-semibold">
                        {climateMetrics.seaLevelRise.toFixed(1)} cm
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Extreme Weather Events</span>
                      <span className="text-red-400 font-semibold">
                        {climateMetrics.extremeEvents}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Emission Reduction Target</span>
                      <span className="text-green-400 font-semibold">
                        {climateMetrics.emissionReduction.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'emissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Global Emissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">
                        {climateData?.emissions.annual.toFixed(1)} Gt
                      </div>
                      <div className="text-white/60 text-sm">Annual CO₂ Emissions</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-400">
                          {climateData?.emissions.target} Gt
                        </div>
                        <div className="text-white/60 text-xs">2030 Target</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-400">
                          -{climateData?.emissions.reduction.toFixed(1)}%
                        </div>
                        <div className="text-white/60 text-xs">Required Reduction</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Emission Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emissionSources.map((source, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <i className={`fas fa-${
                            source.type === 'factory' ? 'industry' :
                            source.type === 'vehicle' ? 'car' : 'building'
                          } text-orange-400`}></i>
                          <span className="text-white capitalize">{source.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-semibold">
                            {(source.intensity * 100).toFixed(1)}%
                          </div>
                          <div className="text-white/60 text-xs">Intensity</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Carbon Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Budget Consumed</span>
                        <span className="text-red-400">{climateMetrics.carbonBudgetUsed.toFixed(1)}%</span>
                      </div>
                      <Progress value={climateMetrics.carbonBudgetUsed} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-white/60">Remaining</div>
                        <div className="text-green-400 font-semibold">
                          {climateData?.carbonBudget.remaining.toFixed(0)} Gt
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60">Consumed</div>
                        <div className="text-red-400 font-semibold">
                          {climateData?.carbonBudget.consumed.toFixed(0)} Gt
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'temperature' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Temperature Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-400 mb-2">
                        +{climateMetrics.temperatureChange.toFixed(2)}°C
                      </div>
                      <p className="text-white/60">Above pre-industrial levels</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/80">1.5°C Target</span>
                        <span className={climateMetrics.temperatureChange > 1.5 ? 'text-red-400' : 'text-green-400'}>
                          {climateMetrics.temperatureChange > 1.5 ? 'Exceeded' : 'Within Target'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">2.0°C Limit</span>
                        <span className={climateMetrics.temperatureChange > 2.0 ? 'text-red-400' : 'text-yellow-400'}>
                          {climateMetrics.temperatureChange > 2.0 ? 'Exceeded' : 'Approaching'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'risks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Climate Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Physical Risks', level: 'High', icon: 'fas fa-mountain' },
                      { name: 'Transition Risks', level: 'Medium', icon: 'fas fa-exchange-alt' },
                      { name: 'Economic Impact', level: 'High', icon: 'fas fa-chart-line' },
                      { name: 'Social Vulnerability', level: 'Medium', icon: 'fas fa-users' }
                    ].map((risk, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <i className={`${risk.icon} text-blue-400`}></i>
                          <span className="text-white">{risk.name}</span>
                        </div>
                        <Badge className={getRiskColor(risk.level.toLowerCase())}>
                          {risk.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Panel - 3D Visualization */}
        <div className="xl:col-span-2 bg-black/20 rounded-xl overflow-hidden relative">
          {/* Visualization Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {/* Toggle view mode */}}
            >
              <i className="fas fa-eye mr-2"></i>
              {activeTab === 'overview' ? 'Heatmap' : activeTab}
            </Button>
          </div>

          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
            <Suspense fallback={
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#4facfe" wireframe />
              </mesh>
            }>
              <ClimateHeatmap data={climateData} interactive={true} />
              {show3DParticles && (
                <CarbonEmissionParticles
                  emissionSources={emissionSources}
                  animationSpeed={1.5}
                />
              )}
            </Suspense>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[0, 15, 0]} intensity={0.5} color="#ff6b6b" />
            <fog attach="fog" args={['#1a1a2e', 10, 50]} />
          </Canvas>

          {/* Overlay Information */}
          <div className="absolute bottom-4 left-4 glass p-3 rounded-lg max-w-xs">
            <div className="text-white text-sm">
              <div className="font-semibold mb-1">Climate Visualization</div>
              <div className="text-white/70 text-xs">
                Interactive 3D climate impact heatmap showing temperature patterns,
                emission sources, and environmental data points.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateImpactDashboard;
