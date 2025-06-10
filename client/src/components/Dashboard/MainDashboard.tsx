import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import MetricsPanel from "./MetricsPanel";
import AIInsightsPanel from "./AIInsightsPanel";
import InteractiveEnergyGrid3D from "../3D/InteractiveEnergyGrid3D";
import ClimateHeatmap from "../3D/ClimateHeatmap";
import DataVisualization from "../Visualization/DataVisualization";
import { useClimateData } from "../../lib/stores/useClimateData";
import { useEnergyData } from "../../lib/stores/useEnergyData";
import { useAlgorithms } from "../../lib/hooks/useAlgorithms";

const MainDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'energy' | 'climate'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  const { climateData, isLoading: climateLoading } = useClimateData();
  const { energyData, isLoading: energyLoading } = useEnergyData();
  const { 
    energyFlowResults, 
    climateScoreResults, 
    vulnerabilityResults,
    isProcessing 
  } = useAlgorithms();

  useEffect(() => {
    if (!climateLoading && !energyLoading) {
      setIsLoading(false);
    }
  }, [climateLoading, energyLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="text-white/80">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full overflow-hidden"
    >
      {/* Dashboard Header */}
      <motion.div variants={itemVariants} className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Climate AI Dashboard
            </h1>
            <p className="text-white/70">
              Real-time energy distribution and climate action monitoring
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex space-x-2">
            {[
              { key: 'overview', label: 'Overview', icon: 'fas fa-th-large' },
              { key: 'energy', label: 'Energy Grid', icon: 'fas fa-bolt' },
              { key: 'climate', label: 'Climate Map', icon: 'fas fa-globe-americas' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  activeView === key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'glass text-white/80 hover:bg-white/10'
                }`}
              >
                <i className={icon}></i>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Metrics and Insights */}
        <motion.div variants={itemVariants} className="w-80 border-r border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
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
          </div>
        </motion.div>

        {/* Center Panel - 3D Visualization */}
        <motion.div variants={itemVariants} className="flex-1 relative">
          {activeView === 'overview' && (
            <div className="h-full grid grid-cols-2 gap-4 p-4">
              <div className="glass rounded-xl overflow-hidden">
                <div className="h-full">
                  <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <EnergyGrid3D data={energyData} />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
              
              <div className="glass rounded-xl overflow-hidden">
                <div className="h-full">
                  <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <ClimateHeatmap data={climateData} />
                    </Suspense>
                  </Canvas>
                </div>
              </div>
              
              <div className="col-span-2 glass rounded-xl p-4">
                <DataVisualization 
                  energyData={energyData}
                  climateData={climateData}
                />
              </div>
            </div>
          )}

          {activeView === 'energy' && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[0, 10, 0]} intensity={0.5} color="#4facfe" />
                  <InteractiveEnergyGrid3D data={energyData} interactive={true} />
                </Suspense>
              </Canvas>
            </div>
          )}

          {activeView === 'climate' && (
            <div className="h-full">
              <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[0, 10, 0]} intensity={0.5} color="#43e97b" />
                  <ClimateHeatmap data={climateData} interactive={true} />
                </Suspense>
              </Canvas>
            </div>
          )}

          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="glass p-3 rounded-lg text-white/80 hover:text-white transition-colors">
              <i className="fas fa-expand"></i>
            </button>
            <button className="glass p-3 rounded-lg text-white/80 hover:text-white transition-colors">
              <i className="fas fa-cog"></i>
            </button>
            <button className="glass p-3 rounded-lg text-white/80 hover:text-white transition-colors">
              <i className="fas fa-download"></i>
            </button>
          </div>
        </motion.div>

        {/* Right Panel - Additional Info */}
        <motion.div variants={itemVariants} className="w-64 border-l border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Real-time Status */}
            <div className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Energy Grid</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Climate Data</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">AI Processing</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                    }`}></div>
                    <span className={`text-sm ${
                      isProcessing ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {isProcessing ? 'Processing' : 'Ready'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm">
                  Generate Report
                </button>
                <button className="w-full p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm">
                  Export Data
                </button>
                <button className="w-full p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm">
                  Schedule Analysis
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white/80">Energy distribution optimized</p>
                    <p className="text-white/50 text-xs">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white/80">Climate score updated</p>
                    <p className="text-white/50 text-xs">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-white/80">Vulnerability assessment complete</p>
                    <p className="text-white/50 text-xs">8 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainDashboard;
