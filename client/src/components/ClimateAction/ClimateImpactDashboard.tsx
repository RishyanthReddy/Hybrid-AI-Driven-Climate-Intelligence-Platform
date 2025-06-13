import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ZoomProof3DVisualization from '../3D/ZoomProof3DVisualization';
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
  onToggleParticles?: (show: boolean) => void;
}

const ClimateImpactDashboard: React.FC<ClimateImpactDashboardProps> = ({
  climateData,
  emissionSources,
  show3DParticles,
  onToggleParticles
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

              {/* Emission Sources Chart */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Emission Sources Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Pie Chart Representation */}
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-80"></div>
                      <div className="absolute inset-2 rounded-full bg-black/80 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-semibold text-sm">{emissionSources.length}</div>
                          <div className="text-white/60 text-xs">Sources</div>
                        </div>
                      </div>
                    </div>

                    {/* Source Breakdown */}
                    <div className="space-y-2">
                      {['factory', 'building', 'vehicle'].map((type) => {
                        const count = emissionSources.filter(s => s.type === type).length;
                        const percentage = emissionSources.length > 0 ? (count / emissionSources.length) * 100 : 0;
                        const color = type === 'factory' ? 'bg-red-400' :
                                     type === 'building' ? 'bg-orange-400' : 'bg-yellow-400';

                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${color}`}></div>
                              <span className="text-white/80 capitalize text-sm">{type}s</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold text-sm">{count}</div>
                              <div className="text-white/60 text-xs">{percentage.toFixed(0)}%</div>
                            </div>
                          </div>
                        );
                      })}
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

                    {/* Temperature Trend Chart */}
                    <div className="bg-white/5 p-3 rounded">
                      <div className="text-white/80 text-sm mb-2">Temperature Trend (Last 10 Years)</div>
                      <div className="flex items-end justify-between h-16 gap-1">
                        {Array.from({ length: 10 }, (_, i) => {
                          const height = 20 + (i * 3) + Math.random() * 10;
                          const year = 2014 + i;
                          const isCurrentYear = year === 2023;
                          return (
                            <div key={i} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-full ${isCurrentYear ? 'bg-red-400' : 'bg-orange-400/70'} rounded-t`}
                                style={{ height: `${height}px` }}
                              ></div>
                              <div className="text-xs text-white/60 mt-1">{year}</div>
                            </div>
                          );
                        })}
                      </div>
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

              {/* CO2 Concentration Chart */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">CO₂ Concentration Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {climateMetrics.co2Level.toFixed(0)} ppm
                      </div>
                      <div className="text-white/60 text-sm">Current Level</div>
                    </div>

                    {/* CO2 Trend Chart */}
                    <div className="bg-white/5 p-3 rounded">
                      <div className="flex items-end justify-between h-12 gap-1">
                        {Array.from({ length: 12 }, (_, i) => {
                          const baseHeight = 15 + (i * 1.5);
                          const height = baseHeight + Math.sin(i * 0.5) * 3;
                          return (
                            <div
                              key={i}
                              className="bg-orange-400/70 rounded-t flex-1"
                              style={{ height: `${height}px` }}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-white/60 mt-1 text-center">Monthly readings</div>
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
          {/* Climate Visualization with Particle Control */}
          <div className="h-full relative">
            {/* Header with Controls */}
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <i className="fas fa-globe-americas text-red-400"></i>
                  Climate Impact Heatmap
                </h3>
                <p className="text-white/60 text-sm">Global environmental monitoring with emission tracking</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={show3DParticles ? "default" : "outline"}
                  className={`${
                    show3DParticles
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  } text-white text-xs px-3 py-1 whitespace-nowrap`}
                  onClick={() => {
                    onToggleParticles?.(!show3DParticles);
                  }}
                >
                  <i className={`fas fa-${show3DParticles ? 'eye-slash' : 'eye'} mr-1`}></i>
                  {show3DParticles ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {/* 3D Climate Visualization */}
            <div className="h-[500px] bg-gradient-to-br from-red-900/20 to-orange-900/20">
              <ZoomProof3DVisualization
                type="climate"
                showParticles={show3DParticles}
                emissionSources={emissionSources}
                className="w-full h-full"
              />
            </div>

            {/* Climate Data Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                  <div className={`font-semibold ${getRiskColor(climateMetrics.riskLevel).split(' ')[0]}`}>
                    {climateMetrics.riskLevel.toUpperCase()}
                  </div>
                  <div className="text-white/70">Risk Level</div>
                </div>
                <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                  <div className="text-orange-400 font-semibold">{climateMetrics.co2Level.toFixed(0)} ppm</div>
                  <div className="text-white/70">CO₂ Level</div>
                </div>
                <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                  <div className="text-blue-400 font-semibold">{climateMetrics.seaLevelRise.toFixed(1)} cm</div>
                  <div className="text-white/70">Sea Level Rise</div>
                </div>
                <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                  <div className="text-purple-400 font-semibold">{climateMetrics.carbonBudgetUsed.toFixed(1)}%</div>
                  <div className="text-white/70">Carbon Budget</div>
                </div>
              </div>
            </div>

            {/* Emission Sources Indicator */}
            {show3DParticles && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-24 right-4 glass p-3 rounded-lg max-w-xs z-20"
              >
                <div className="text-white text-sm">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    Active Emission Sources
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/70">Factories:</span>
                      <span className="text-red-400 font-semibold">{emissionSources.filter(s => s.type === 'factory').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Buildings:</span>
                      <span className="text-orange-400 font-semibold">{emissionSources.filter(s => s.type === 'building').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Vehicles:</span>
                      <span className="text-yellow-400 font-semibold">{emissionSources.filter(s => s.type === 'vehicle').length}</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <div className="text-white/60 text-xs">
                      Total Particles: <span className="text-white font-semibold">500</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* No Emissions Message */}
            {!show3DParticles && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-24 right-4 glass p-3 rounded-lg max-w-xs z-20"
              >
                <div className="text-white text-sm">
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Emissions Hidden
                  </div>
                  <div className="text-white/60 text-xs">
                    Particle visualization disabled for cleaner view
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Overlay Information */}
          <div className="absolute bottom-20 left-4 glass p-3 rounded-lg max-w-xs z-10">
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
