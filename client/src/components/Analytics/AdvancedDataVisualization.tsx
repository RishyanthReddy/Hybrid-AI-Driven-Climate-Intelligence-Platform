import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface AdvancedDataVisualizationProps {
  energyData: any;
  climateData: any;
  algorithmResults: any;
}

const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({
  energyData,
  climateData,
  algorithmResults
}) => {
  const [activeChart, setActiveChart] = useState('energy-flow');
  const [timeRange, setTimeRange] = useState('24h');

  // Generate comprehensive energy flow data
  const energyFlowData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      consumption: 800 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
      generation: 600 + Math.sin(i * 0.3 + 1) * 150 + Math.random() * 80,
      storage: 200 + Math.sin(i * 0.7) * 100 + Math.random() * 50,
      efficiency: 75 + Math.sin(i * 0.4) * 15 + Math.random() * 10,
      renewable: 300 + Math.sin(i * 0.6) * 100 + Math.random() * 60,
      carbon: 150 - Math.sin(i * 0.5) * 50 - Math.random() * 30
    }));
  }, [timeRange]);

  // Climate impact correlation data
  const climateImpactData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      temperature: 15 + Math.sin(i * 0.5) * 10 + Math.random() * 5,
      emissions: 200 - i * 5 + Math.random() * 20,
      energyDemand: 1000 + Math.sin(i * 0.6) * 200 + Math.random() * 100,
      vulnerability: 30 + Math.sin(i * 0.4) * 15 + Math.random() * 10,
      resilience: 70 + Math.sin(i * 0.3) * 10 + Math.random() * 8
    }));
  }, []);

  // Energy source distribution
  const energySourceData = [
    { name: 'Solar', value: 35, color: '#FFD700' },
    { name: 'Wind', value: 28, color: '#87CEEB' },
    { name: 'Hydro', value: 15, color: '#4682B4' },
    { name: 'Nuclear', value: 12, color: '#9370DB' },
    { name: 'Natural Gas', value: 8, color: '#FFA500' },
    { name: 'Coal', value: 2, color: '#696969' }
  ];

  // Regional vulnerability scatter plot
  const vulnerabilityScatterData = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100, // Economic stability
      y: Math.random() * 100, // Climate resilience
      z: Math.random() * 100, // Population density
      region: `Region ${i + 1}`,
      risk: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
    }));
  }, []);

  // Prediction model results
  const predictionData = useMemo(() => {
    const baseDate = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        predicted: 85 + Math.sin(i * 0.2) * 10 + Math.random() * 5,
        actual: i < 20 ? 82 + Math.sin(i * 0.2) * 10 + Math.random() * 8 : null,
        confidence: 95 - i * 0.5 + Math.random() * 5
      };
    });
  }, []);

  const chartConfigs = {
    'energy-flow': {
      title: 'Real-time Energy Flow Analysis',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={energyFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 60, 0.9)', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stackId="1" 
              stroke="#ff6b6b" 
              fill="#ff6b6b" 
              fillOpacity={0.6}
              name="Consumption (MW)"
            />
            <Area 
              type="monotone" 
              dataKey="generation" 
              stackId="1" 
              stroke="#4ecdc4" 
              fill="#4ecdc4" 
              fillOpacity={0.6}
              name="Generation (MW)"
            />
            <Area 
              type="monotone" 
              dataKey="renewable" 
              stackId="1" 
              stroke="#45b7d1" 
              fill="#45b7d1" 
              fillOpacity={0.6}
              name="Renewable (MW)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    'climate-impact': {
      title: 'Climate Impact Correlation Matrix',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={climateImpactData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis yAxisId="left" stroke="#fff" />
            <YAxis yAxisId="right" orientation="right" stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 60, 0.9)', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperature" 
              stroke="#ff7979" 
              strokeWidth={3}
              name="Temperature (°C)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="emissions" 
              stroke="#6c5ce7" 
              strokeWidth={3}
              name="Emissions (tCO2)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="vulnerability" 
              stroke="#fd79a8" 
              strokeWidth={3}
              name="Vulnerability Index"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="resilience" 
              stroke="#00b894" 
              strokeWidth={3}
              name="Resilience Score"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    'energy-sources': {
      title: 'Energy Source Distribution',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={energySourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {energySourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 60, 0.9)', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    'vulnerability-analysis': {
      title: 'Regional Vulnerability Assessment',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={vulnerabilityScatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Economic Stability" 
              stroke="#fff"
              domain={[0, 100]}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Climate Resilience" 
              stroke="#fff"
              domain={[0, 100]}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 60, 0.9)', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name, props) => [
                `${value.toFixed(1)}`, 
                name === 'x' ? 'Economic Stability' : 'Climate Resilience'
              ]}
            />
            <Scatter 
              dataKey="z" 
              fill="#8884d8"
              fillOpacity={0.6}
              stroke="#8884d8"
            />
          </ScatterChart>
        </ResponsiveContainer>
      )
    },
    'predictions': {
      title: 'AI Prediction Model Results',
      component: (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 60, 0.9)', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#00b894" 
              strokeWidth={3}
              name="Actual Values"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#0984e3" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Values"
            />
            <Line 
              type="monotone" 
              dataKey="confidence" 
              stroke="#fdcb6e" 
              strokeWidth={1}
              name="Confidence Level (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Chart Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(chartConfigs).map((chartKey) => (
          <Button
            key={chartKey}
            onClick={() => setActiveChart(chartKey)}
            variant={activeChart === chartKey ? "default" : "outline"}
            size="sm"
            className={`${
              activeChart === chartKey
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-white/10 hover:bg-white/20 border-white/20'
            } text-white`}
          >
            {chartConfigs[chartKey].title}
          </Button>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-4">
        {['1h', '24h', '7d', '30d'].map((range) => (
          <Button
            key={range}
            onClick={() => setTimeRange(range)}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            className={`${
              timeRange === range
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-white/10 hover:bg-white/20 border-white/20'
            } text-white`}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Main Chart Display */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            {chartConfigs[activeChart].title}
            <div className="flex items-center gap-2 text-sm text-white/60">
              <i className="fas fa-chart-line"></i>
              Live Data
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartConfigs[activeChart].component}
        </CardContent>
      </Card>

      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {algorithmResults?.energyFlow?.efficiency?.toFixed(1) || '87.5'}%
              </div>
              <div className="text-sm text-white/60">System Efficiency</div>
              <div className="text-xs text-green-400 mt-1">↗ +2.3% from last period</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {algorithmResults?.climateScore?.overallScore?.toFixed(1) || '72.8'}
              </div>
              <div className="text-sm text-white/60">Climate Score</div>
              <div className="text-xs text-green-400 mt-1">↗ +1.8% improvement</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {algorithmResults?.vulnerability?.averageVulnerability?.toFixed(1) || '34.2'}%
              </div>
              <div className="text-sm text-white/60">Risk Level</div>
              <div className="text-xs text-yellow-400 mt-1">↘ -3.1% reduced risk</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Energy Flow Optimization', value: 94, color: 'bg-blue-500' },
                { label: 'Carbon Footprint Reduction', value: 78, color: 'bg-green-500' },
                { label: 'Grid Stability Index', value: 89, color: 'bg-purple-500' },
                { label: 'Renewable Integration', value: 82, color: 'bg-yellow-500' }
              ].map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">{metric.label}</span>
                    <span className="text-white font-semibold">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Real-time Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { 
                  type: 'warning', 
                  message: 'High energy demand detected in Sector 7',
                  time: '2 min ago',
                  icon: 'fas fa-exclamation-triangle',
                  color: 'text-yellow-400'
                },
                { 
                  type: 'info', 
                  message: 'Solar generation exceeding forecast by 15%',
                  time: '5 min ago',
                  icon: 'fas fa-sun',
                  color: 'text-blue-400'
                },
                { 
                  type: 'success', 
                  message: 'Grid stability improved to 94%',
                  time: '8 min ago',
                  icon: 'fas fa-check-circle',
                  color: 'text-green-400'
                }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <i className={`${alert.icon} ${alert.color} text-sm mt-0.5`}></i>
                  <div className="flex-1">
                    <p className="text-white/90 text-sm">{alert.message}</p>
                    <p className="text-white/50 text-xs mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdvancedDataVisualization;