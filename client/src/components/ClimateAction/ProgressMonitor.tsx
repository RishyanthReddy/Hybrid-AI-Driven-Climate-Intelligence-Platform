import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { useClimateData } from "../../lib/stores/useClimateData";
import { useAlgorithms } from "../../lib/hooks/useAlgorithms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";

const ProgressMonitor: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "6M" | "1Y" | "ALL">("6M");
  const [selectedMetric, setSelectedMetric] = useState<"emissions" | "energy" | "finance" | "social">("emissions");
  const [comparisonMode, setComparisonMode] = useState<"target" | "baseline" | "peer">("target");

  const { climateData, isLoading } = useClimateData();
  const { climateScoreResults, isProcessing } = useAlgorithms();

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

  // Generate progress data
  const progressData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 11 + i);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    });

    const emissionsData = months.map((month, i) => ({
      month,
      actual: 1000 - (i * 50) + (Math.random() - 0.5) * 100,
      target: 1000 - (i * 60),
      baseline: 1000,
      reduction: ((1000 - (1000 - (i * 50))) / 1000) * 100
    }));

    const energyData = months.map((month, i) => ({
      month,
      renewable: 20 + (i * 5) + (Math.random() - 0.5) * 10,
      efficiency: 60 + (i * 3) + (Math.random() - 0.5) * 5,
      consumption: 1000 - (i * 20) + (Math.random() - 0.5) * 50
    }));

    const financeData = months.map((month, i) => ({
      month,
      allocated: 100 + (i * 50),
      spent: 80 + (i * 40) + (Math.random() - 0.5) * 20,
      savings: 10 + (i * 5) + (Math.random() - 0.5) * 5
    }));

    const socialData = months.map((month, i) => ({
      month,
      beneficiaries: 1000 + (i * 200) + (Math.random() - 0.5) * 100,
      jobs: 50 + (i * 10) + (Math.random() - 0.5) * 10,
      engagement: 60 + (i * 2) + (Math.random() - 0.5) * 10
    }));

    return { emissionsData, energyData, financeData, socialData };
  }, [timeRange]);

  // SDG Progress Data
  const sdgProgress = [
    { name: "Clean Energy", progress: 78, target: 85, color: "#FFD700" },
    { name: "Climate Action", progress: 65, target: 80, color: "#32CD32" },
    { name: "Sustainable Cities", progress: 52, target: 70, color: "#FF6347" },
    { name: "Responsible Consumption", progress: 69, target: 75, color: "#4169E1" },
    { name: "Life on Land", progress: 44, target: 60, color: "#228B22" },
    { name: "Partnerships", progress: 83, target: 90, color: "#FF69B4" }
  ];

  // Key Performance Indicators
  const kpis = [
    {
      title: "CO₂ Emissions Reduced",
      current: 2340,
      target: 3000,
      unit: "MT",
      trend: "+12%",
      status: "on-track"
    },
    {
      title: "Renewable Energy Share",
      current: 68,
      target: 80,
      unit: "%",
      trend: "+8%",
      status: "on-track"
    },
    {
      title: "Energy Efficiency Improvement",
      current: 23,
      target: 30,
      unit: "%",
      trend: "+5%",
      status: "behind"
    },
    {
      title: "Green Jobs Created",
      current: 450,
      target: 500,
      unit: "jobs",
      trend: "+15%",
      status: "ahead"
    }
  ];

  // Sector Performance
  const sectorData = [
    { name: "Energy", progress: 75, budget: 45, impact: 85 },
    { name: "Transport", progress: 60, budget: 30, impact: 70 },
    { name: "Buildings", progress: 85, budget: 25, impact: 65 },
    { name: "Industry", progress: 55, budget: 40, impact: 80 },
    { name: "Agriculture", progress: 45, budget: 20, impact: 60 },
    { name: "Waste", progress: 90, budget: 15, impact: 75 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-400';
      case 'on-track': return 'text-blue-400';
      case 'behind': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ahead': return 'default';
      case 'on-track': return 'default';
      case 'behind': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <span className="text-white/80">Loading progress data...</span>
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
              <i className="fas fa-chart-line text-blue-400 mr-3"></i>
              Progress Monitor
            </h1>
            <p className="text-white/70">
              Real-time tracking of climate action progress and impact metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {isProcessing && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Updating...</span>
              </div>
            )}
            
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="ALL">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-blue-500 hover:bg-blue-600">
              <i className="fas fa-download mr-2"></i>
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <Card key={index} className="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm">{kpi.title}</span>
                  <Badge variant={getStatusBadge(kpi.status)}>
                    {kpi.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">
                    {kpi.current.toLocaleString()}
                  </span>
                  <span className="text-sm text-white/60">{kpi.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Target: {kpi.target.toLocaleString()}</span>
                  <span className={`text-sm font-medium ${getStatusColor(kpi.status)}`}>
                    {kpi.trend}
                  </span>
                </div>
                <Progress value={(kpi.current / kpi.target) * 100} className="w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div variants={itemVariants} className="col-span-2">
            <Card className="glass h-96">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Progress Trends</CardTitle>
                  <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emissions">Emissions</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  {selectedMetric === 'emissions' && (
                    <AreaChart data={progressData.emissionsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="actual" 
                        stackId="1" 
                        stroke="#8884d8" 
                        fill="rgba(136, 132, 216, 0.3)" 
                        name="Actual Emissions"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        stroke="#82ca9d" 
                        strokeDasharray="5 5"
                        name="Target"
                      />
                    </AreaChart>
                  )}
                  
                  {selectedMetric === 'energy' && (
                    <LineChart data={progressData.energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="renewable" stroke="#82ca9d" name="Renewable %" />
                      <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency %" />
                    </LineChart>
                  )}
                  
                  {selectedMetric === 'finance' && (
                    <BarChart data={progressData.financeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="allocated" fill="#8884d8" name="Allocated ($M)" />
                      <Bar dataKey="spent" fill="#82ca9d" name="Spent ($M)" />
                    </BarChart>
                  )}
                  
                  {selectedMetric === 'social' && (
                    <AreaChart data={progressData.socialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area type="monotone" dataKey="beneficiaries" stroke="#8884d8" fill="rgba(136, 132, 216, 0.3)" name="Beneficiaries" />
                      <Area type="monotone" dataKey="jobs" stroke="#82ca9d" fill="rgba(130, 202, 157, 0.3)" name="Jobs Created" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* SDG Progress */}
          <motion.div variants={itemVariants}>
            <Card className="glass h-96">
              <CardHeader>
                <CardTitle className="text-white">SDG Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sdgProgress.map((sdg, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/80 text-sm">{sdg.name}</span>
                        <span className="text-white text-sm">{sdg.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${sdg.progress}%`,
                            backgroundColor: sdg.color
                          }}
                        />
                      </div>
                      <div className="text-xs text-white/60">Target: {sdg.target}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sector Performance */}
          <motion.div variants={itemVariants} className="col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                      <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="progress" fill="#8884d8" name="Progress %" />
                      <Bar dataKey="budget" fill="#82ca9d" name="Budget Utilization %" />
                      <Bar dataKey="impact" fill="#ffc658" name="Impact Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Climate Score Gauge */}
          <motion.div variants={itemVariants}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Climate Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#43e97b"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.73)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">73</span>
                      <span className="text-sm text-white/60">Score</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-green-400 font-medium">Good Progress</div>
                    <div className="text-white/60 text-sm">+5 points this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Metrics Table */}
        <motion.div variants={itemVariants} className="mt-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-white">Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="targets">Targets</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/70 p-2">Metric</th>
                          <th className="text-right text-white/70 p-2">Current</th>
                          <th className="text-right text-white/70 p-2">Target</th>
                          <th className="text-right text-white/70 p-2">Progress</th>
                          <th className="text-right text-white/70 p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kpis.map((metric, index) => (
                          <tr key={index} className="border-b border-white/5">
                            <td className="text-white p-2">{metric.title}</td>
                            <td className="text-right text-white p-2">{metric.current.toLocaleString()} {metric.unit}</td>
                            <td className="text-right text-white/70 p-2">{metric.target.toLocaleString()} {metric.unit}</td>
                            <td className="text-right text-white p-2">{Math.round((metric.current / metric.target) * 100)}%</td>
                            <td className="text-right p-2">
                              <Badge variant={getStatusBadge(metric.status)}>
                                {metric.status.replace('-', ' ')}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="targets" className="mt-4">
                  <div className="text-white/60 text-center py-8">
                    <i className="fas fa-bullseye text-3xl mb-4"></i>
                    <p>Detailed target analysis and projections would be displayed here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="milestones" className="mt-4">
                  <div className="text-white/60 text-center py-8">
                    <i className="fas fa-flag-checkered text-3xl mb-4"></i>
                    <p>Milestone tracking and completion status would be displayed here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="risks" className="mt-4">
                  <div className="text-white/60 text-center py-8">
                    <i className="fas fa-exclamation-triangle text-3xl mb-4"></i>
                    <p>Risk assessment and mitigation strategies would be displayed here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressMonitor;
