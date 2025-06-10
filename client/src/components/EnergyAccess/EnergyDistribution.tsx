import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import InteractiveEnergyGrid3D from "../3D/InteractiveEnergyGrid3D";
import { useEnergyData } from "../../lib/stores/useEnergyData";
import { useAlgorithms } from "../../lib/hooks/useAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

const EnergyDistribution: React.FC = () => {
  const [simulationMode, setSimulationMode] = useState<"current" | "optimized" | "predictive">("current");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [optimizationLevel, setOptimizationLevel] = useState([75]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { energyData, isLoading, updateEnergyData } = useEnergyData();
  const { energyFlowResults, isProcessing } = useAlgorithms();

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

  // Generate distribution data
  const distributionData = React.useMemo(() => {
    if (!energyData || !energyFlowResults) return null;

    const nodes = Array.from({ length: 20 }, (_, i) => ({
      id: `node-${i + 1}`,
      name: `Distribution Node ${i + 1}`,
      type: Math.random() > 0.3 ? 'distribution' : 'generation',
      capacity: 100 + Math.floor(Math.random() * 500),
      currentLoad: Math.floor(Math.random() * 100),
      efficiency: 85 + Math.floor(Math.random() * 15),
      status: Math.random() > 0.1 ? 'online' : 'maintenance',
      location: {
        x: (Math.random() - 0.5) * 100,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 100
      },
      connections: []
    }));

    // Create connections between nodes
    nodes.forEach(node => {
      const connectionCount = Math.floor(Math.random() * 4) + 1;
      const availableNodes = nodes.filter(n => n.id !== node.id);
      
      for (let i = 0; i < connectionCount && i < availableNodes.length; i++) {
        const targetNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
        if (!node.connections.find(c => c.targetId === targetNode.id)) {
          node.connections.push({
            targetId: targetNode.id,
            flowRate: Math.floor(Math.random() * 50),
            efficiency: 0.9 + Math.random() * 0.1,
            status: Math.random() > 0.05 ? 'active' : 'congested'
          });
        }
      }
    });

    return { nodes };
  }, [energyData, energyFlowResults, simulationMode]);

  const systemStats = React.useMemo(() => {
    if (!distributionData) return null;

    const totalCapacity = distributionData.nodes.reduce((sum, node) => sum + node.capacity, 0);
    const totalLoad = distributionData.nodes.reduce((sum, node) => sum + node.currentLoad, 0);
    const avgEfficiency = distributionData.nodes.reduce((sum, node) => sum + node.efficiency, 0) / distributionData.nodes.length;
    const onlineNodes = distributionData.nodes.filter(node => node.status === 'online').length;

    return {
      totalCapacity,
      totalLoad,
      utilization: Math.round((totalLoad / totalCapacity) * 100),
      avgEfficiency: Math.round(avgEfficiency),
      onlineNodes,
      totalNodes: distributionData.nodes.length,
      gridReliability: Math.round((onlineNodes / distributionData.nodes.length) * 100)
    };
  }, [distributionData]);

  const handleOptimize = async () => {
    if (!distributionData) return;
    
    // Simulate optimization process
    const optimizedNodes = distributionData.nodes.map(node => ({
      ...node,
      efficiency: Math.min(100, node.efficiency + Math.floor(Math.random() * 10)),
      currentLoad: Math.max(0, node.currentLoad - Math.floor(Math.random() * 20))
    }));

    await updateEnergyData({ ...energyData, distributionNodes: optimizedNodes });
  };

  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        if (distributionData) {
          const updatedNodes = distributionData.nodes.map(node => ({
            ...node,
            currentLoad: Math.max(0, Math.min(node.capacity, 
              node.currentLoad + (Math.random() - 0.5) * 10
            ))
          }));
          // Update would happen here in real implementation
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates, distributionData]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="text-white/80">Loading energy distribution data...</span>
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
      {/* Header */}
      <motion.div variants={itemVariants} className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <i className="fas fa-bolt text-blue-400 mr-3"></i>
              Energy Distribution Planner
            </h1>
            <p className="text-white/70">
              AI-powered optimization of energy grid distribution patterns
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isProcessing && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Optimizing...</span>
              </div>
            )}
            
            <Button
              onClick={handleOptimize}
              disabled={isProcessing}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <i className="fas fa-magic mr-2"></i>
              Optimize Grid
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-white/70 text-sm">Mode:</label>
            <Select value={simulationMode} onValueChange={(value: any) => setSimulationMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="optimized">Optimized</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-white/70 text-sm">Time Range:</label>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-white/70 text-sm">Optimization Level:</label>
            <div className="w-32">
              <Slider
                value={optimizationLevel}
                onValueChange={setOptimizationLevel}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <span className="text-white text-sm w-8">{optimizationLevel[0]}%</span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-white/70 text-sm">Real-time Updates:</label>
            <Switch
              checked={realTimeUpdates}
              onCheckedChange={setRealTimeUpdates}
            />
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Control Panel */}
        <motion.div variants={itemVariants} className="w-80 border-r border-white/10 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* System Overview */}
            {systemStats && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-white">System Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{systemStats.totalCapacity}</div>
                      <div className="text-sm text-white/60">Total Capacity (MW)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{systemStats.totalLoad}</div>
                      <div className="text-sm text-white/60">Current Load (MW)</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/70">Grid Utilization</span>
                        <span className="text-white font-semibold">{systemStats.utilization}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            systemStats.utilization > 80 ? 'bg-red-500' : 
                            systemStats.utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${systemStats.utilization}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/70">Average Efficiency</span>
                        <span className="text-white font-semibold">{systemStats.avgEfficiency}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${systemStats.avgEfficiency}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/70">Grid Reliability</span>
                        <span className="text-white font-semibold">{systemStats.gridReliability}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${systemStats.gridReliability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Node Status */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Distribution Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {distributionData?.nodes.slice(0, 10).map((node) => (
                    <div
                      key={node.id}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedNode === node.id ? 'bg-blue-500/30' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/90 text-sm font-medium">{node.name}</span>
                        <Badge variant={node.status === 'online' ? 'default' : 'secondary'}>
                          {node.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Load: {node.currentLoad}/{node.capacity} MW</span>
                        <span className="text-white/60">Eff: {node.efficiency}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            (node.currentLoad / node.capacity) > 0.8 ? 'bg-red-400' : 
                            (node.currentLoad / node.capacity) > 0.6 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${(node.currentLoad / node.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimization Recommendations */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Load Balancing",
                    description: "Redistribute 45MW from Node-3 to Node-7",
                    impact: "+12% efficiency",
                    priority: "high"
                  },
                  {
                    title: "Peak Shaving",
                    description: "Activate storage systems during peak hours",
                    impact: "-8% peak load",
                    priority: "medium"
                  },
                  {
                    title: "Predictive Maintenance",
                    description: "Schedule maintenance for Node-15",
                    impact: "+5% reliability",
                    priority: "low"
                  }
                ].map((rec, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/90 font-medium text-sm">{rec.title}</span>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'outline'}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-xs mb-2">{rec.description}</p>
                    <div className="text-green-400 text-xs font-medium">{rec.impact}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div variants={itemVariants} className="flex-1 relative">
          <div className="h-full">
            <Canvas
              camera={{ position: [0, 15, 25], fov: 60 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <pointLight position={[0, 10, 0]} intensity={0.5} color="#4facfe" />
                
                {distributionData && (
                  <InteractiveEnergyGrid3D 
                    data={distributionData} 
                    interactive={true}
                    selectedNode={selectedNode}
                    onNodeSelect={setSelectedNode}
                  />
                )}
              </Suspense>
            </Canvas>
          </div>

          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button className="glass p-3" size="sm">
              <i className="fas fa-expand"></i>
            </Button>
            <Button className="glass p-3" size="sm">
              <i className="fas fa-camera"></i>
            </Button>
            <Button className="glass p-3" size="sm">
              <i className="fas fa-download"></i>
            </Button>
          </div>

          {/* Node Details Panel */}
          {selectedNode && distributionData && (
            <div className="absolute bottom-4 left-4 glass p-4 rounded-xl max-w-sm">
              {(() => {
                const node = distributionData.nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{node.name}</h3>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedNode(null)}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Type:</span>
                        <span className="text-white capitalize">{node.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Capacity:</span>
                        <span className="text-white">{node.capacity} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Current Load:</span>
                        <span className="text-white">{node.currentLoad} MW</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Efficiency:</span>
                        <span className="text-white">{node.efficiency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Status:</span>
                        <Badge variant={node.status === 'online' ? 'default' : 'secondary'}>
                          {node.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Connections:</span>
                        <span className="text-white">{node.connections.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnergyDistribution;
