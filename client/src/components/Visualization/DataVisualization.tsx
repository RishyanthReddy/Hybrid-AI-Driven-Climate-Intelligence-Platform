import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, RadialBarChart, RadialBar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface DataVisualizationProps {
  energyData: any;
  climateData: any;
  height?: number;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  energyData, 
  climateData, 
  height = 400 
}) => {
  const [selectedVisualization, setSelectedVisualization] = useState<string>("overview");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [activeMetric, setActiveMetric] = useState<string>("energy");

  // Generate visualization data based on input
  const visualizationData = useMemo(() => {
    if (!energyData || !climateData) return null;

    // Energy consumption trends
    const energyTrends = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      consumption: 800 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
      generation: 850 + Math.sin(i * 0.5 + 1) * 180 + Math.random() * 80,
      renewableShare: 40 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
      efficiency: 85 + Math.sin(i * 0.4) * 10 + Math.random() * 5
    }));

    // Climate impact data
    const climateImpacts = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
      emissions: 1000 - (i * 40) + Math.random() * 50,
      temperature: 15 + Math.sin(i * 0.5) * 8 + Math.random() * 3,
      precipitation: 50 + Math.sin(i * 0.8) * 30 + Math.random() * 20,
      airQuality: 60 + Math.sin(i * 0.6) * 20 + Math.random() * 15
    }));

    // Energy sources distribution
    const energySources = [
      { name: 'Solar', value: 28, color: '#FFD700' },
      { name: 'Wind', value: 24, color: '#87CEEB' },
      { name: 'Hydro', value: 18, color: '#4169E1' },
      { name: 'Nuclear', value: 15, color: '#32CD32' },
      { name: 'Gas', value: 10, color: '#FF6347' },
      { name: 'Coal', value: 5, color: '#696969' }
    ];

    // Regional performance
    const regionalData = [
      { region: 'North', energy: 85, climate: 72, vulnerability: 25, population: 2500000 },
      { region: 'South', energy: 78, climate: 68, vulnerability: 35, population: 3200000 },
      { region: 'East', energy: 92, climate: 85, vulnerability: 15, population: 1800000 },
      { region: 'West', energy: 80, climate: 75, vulnerability: 30, population: 2100000 },
      { region: 'Central', energy: 88, climate: 80, vulnerability: 20, population: 2800000 }
    ];

    // Correlation data for scatter plots
    const correlationData = regionalData.map(region => ({
      name: region.region,
      x: region.energy,
      y: region.climate,
      z: region.vulnerability,
      population: region.population
    }));

    return {
      energyTrends,
      climateImpacts,
      energySources,
      regionalData,
      correlationData
    };
  }, [energyData, climateData, timeRange]);

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

  if (!visualizationData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white/60">
          <i className="fas fa-chart-bar text-3xl mb-4"></i>
          <p>Loading visualization data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Controls */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedVisualization} onValueChange={setSelectedVisualization}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select visualization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview Dashboard</SelectItem>
              <SelectItem value="energy">Energy Analysis</SelectItem>
              <SelectItem value="climate">Climate Metrics</SelectItem>
              <SelectItem value="regional">Regional Comparison</SelectItem>
              <SelectItem value="correlation">Correlation Analysis</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
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
          <Button variant="outline" size="sm">
            <i className="fas fa-download mr-2"></i>
            Export
          </Button>
          <Button variant="outline" size="sm">
            <i className="fas fa-expand mr-2"></i>
            Fullscreen
          </Button>
        </div>
      </motion.div>

      {/* Main Visualization Area */}
      <motion.div variants={itemVariants}>
        {selectedVisualization === "overview" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Energy Trends */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-bolt text-blue-400 mr-2"></i>
                  Energy Trends (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={visualizationData.energyTrends}>
                    <defs>
                      <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="rgba(255,255,255,0.7)" 
                      fontSize={12}
                    />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="consumption"
                      stroke="#4facfe"
                      strokeWidth={2}
                      fill="url(#energyGradient)"
                      name="Consumption (MW)"
                    />
                    <Line
                      type="monotone"
                      dataKey="generation"
                      stroke="#43e97b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Generation (MW)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Sources */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-chart-pie text-green-400 mr-2"></i>
                  Energy Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={visualizationData.energySources}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {visualizationData.energySources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ color: 'white', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Climate Impact */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-globe-americas text-orange-400 mr-2"></i>
                  Climate Impact (12m)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={visualizationData.climateImpacts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="rgba(255,255,255,0.7)" 
                      fontSize={12}
                    />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey="emissions"
                      stroke="#ff6b6b"
                      strokeWidth={2}
                      name="Emissions (MT CO₂)"
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#feca57"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <i className="fas fa-map text-purple-400 mr-2"></i>
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={visualizationData.regionalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="region" 
                      stroke="rgba(255,255,255,0.7)" 
                      fontSize={12}
                    />
                    <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: 'white', fontSize: '12px' }} />
                    <Bar dataKey="energy" fill="#4facfe" name="Energy Score" />
                    <Bar dataKey="climate" fill="#43e97b" name="Climate Score" />
                    <Bar dataKey="vulnerability" fill="#ff6b6b" name="Vulnerability" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedVisualization === "energy" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Energy System Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trends" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trends" className="mt-4">
                  <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={visualizationData.energyTrends}>
                      <defs>
                        <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#43e97b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#43e97b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'white' }} />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stackId="1"
                        stroke="#4facfe"
                        fill="url(#consumptionGradient)"
                        name="Consumption (MW)"
                      />
                      <Area
                        type="monotone"
                        dataKey="generation"
                        stackId="2"
                        stroke="#43e97b"
                        fill="url(#generationGradient)"
                        name="Generation (MW)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="efficiency" className="mt-4">
                  <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={visualizationData.energyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'white' }} />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#feca57"
                        strokeWidth={3}
                        name="System Efficiency (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="renewableShare"
                        stroke="#48cae4"
                        strokeWidth={2}
                        name="Renewable Share (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="sources" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <ResponsiveContainer width="100%" height={height / 2}>
                      <PieChart>
                        <Pie
                          data={visualizationData.energySources}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={1}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {visualizationData.energySources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-3">
                      {visualizationData.energySources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: source.color }}
                            />
                            <span className="text-white font-medium">{source.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{source.value}%</div>
                            <div className="text-white/60 text-sm">
                              {(source.value * 10).toFixed(0)} MW
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {selectedVisualization === "climate" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Climate Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={height}>
                <LineChart data={visualizationData.climateImpacts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.7)" />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="emissions"
                    stroke="#ff6b6b"
                    strokeWidth={3}
                    name="CO₂ Emissions (MT)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#feca57"
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="precipitation"
                    stroke="#48cae4"
                    strokeWidth={2}
                    name="Precipitation (mm)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="airQuality"
                    stroke="#a8e6cf"
                    strokeWidth={2}
                    name="Air Quality Index"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {selectedVisualization === "regional" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Regional Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={height}>
                <BarChart data={visualizationData.regionalData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                  <YAxis dataKey="region" type="category" stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Bar dataKey="energy" fill="#4facfe" name="Energy Access Score" />
                  <Bar dataKey="climate" fill="#43e97b" name="Climate Action Score" />
                  <Bar dataKey="vulnerability" fill="#ff6b6b" name="Vulnerability Index" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {selectedVisualization === "correlation" && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Correlation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={height}>
                <ScatterChart data={visualizationData.correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="x" 
                    name="Energy Score" 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Energy Access Score', position: 'insideBottom', offset: -5, style: { fill: 'white' } }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Climate Score" 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Climate Action Score', angle: -90, position: 'insideLeft', style: { fill: 'white' } }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value, name, props) => [
                      value,
                      name === 'x' ? 'Energy Score' : name === 'y' ? 'Climate Score' : name
                    ]}
                    labelFormatter={(label) => `Region: ${label}`}
                  />
                  <Scatter 
                    dataKey="y" 
                    fill="#8884d8" 
                    name="Regions"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Summary Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg Energy Efficiency</p>
                <p className="text-2xl font-bold text-blue-400">
                  {visualizationData.energyTrends.reduce((sum, d) => sum + d.efficiency, 0) / visualizationData.energyTrends.length | 0}%
                </p>
              </div>
              <i className="fas fa-bolt text-blue-400 text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Renewable Share</p>
                <p className="text-2xl font-bold text-green-400">
                  {visualizationData.energyTrends.reduce((sum, d) => sum + d.renewableShare, 0) / visualizationData.energyTrends.length | 0}%
                </p>
              </div>
              <i className="fas fa-leaf text-green-400 text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-orange-400">
                  {((visualizationData.climateImpacts[0].emissions - visualizationData.climateImpacts[visualizationData.climateImpacts.length - 1].emissions) / visualizationData.climateImpacts[0].emissions * 100) | 0}%
                </p>
              </div>
              <i className="fas fa-globe-americas text-orange-400 text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Population</p>
                <p className="text-2xl font-bold text-purple-400">
                  {(visualizationData.regionalData.reduce((sum, d) => sum + d.population, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <i className="fas fa-users text-purple-400 text-2xl"></i>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DataVisualization;
