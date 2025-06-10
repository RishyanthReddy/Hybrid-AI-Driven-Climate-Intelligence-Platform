import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MetricsPanelProps {
  energyData: any;
  climateData: any;
  algorithmResults: {
    energyFlow: any;
    climateScore: any;
    vulnerability: any;
  };
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ 
  energyData, 
  climateData, 
  algorithmResults 
}) => {
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

  // Generate sample trend data
  const energyTrend = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10
  }));

  const climateTrend = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: 65 + Math.sin(i * 0.8) * 15 + Math.random() * 8
  }));

  const metrics = [
    {
      title: "Energy Efficiency",
      value: algorithmResults.energyFlow?.efficiency || 87.5,
      unit: "%",
      trend: "+2.3%",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      icon: "fas fa-bolt"
    },
    {
      title: "Climate Score",
      value: algorithmResults.climateScore?.overallScore || 72.8,
      unit: "/100",
      trend: "+1.8%",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      icon: "fas fa-leaf"
    },
    {
      title: "Vulnerability Index",
      value: algorithmResults.vulnerability?.averageVulnerability || 34.2,
      unit: "%",
      trend: "-3.1%",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      icon: "fas fa-shield-alt"
    },
    {
      title: "Carbon Reduction",
      value: 15.7,
      unit: "Mt CO₂",
      trend: "+5.2%",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      icon: "fas fa-seedling"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-2">Key Metrics</h2>
        <p className="text-white/60 text-sm">Real-time performance indicators</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            className="glass p-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <i className={`${metric.icon} ${metric.color}`}></i>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
              <span className="text-sm text-white/60 ml-1">{metric.unit}</span>
            </div>
            <p className="text-white/60 text-xs">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Energy Trend Chart */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Energy Distribution (24h)</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyTrend}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff60', fontSize: 10 }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4facfe"
                strokeWidth={2}
                fill="url(#energyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Climate Trend Chart */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Climate Impact (12m)</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={climateTrend}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff60', fontSize: 10 }}
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#43e97b"
                strokeWidth={2}
                dot={{ fill: '#43e97b', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">System Health</h3>
        <div className="space-y-3">
          {[
            { label: "Processing Power", value: 94, color: "bg-blue-500" },
            { label: "Data Quality", value: 89, color: "bg-green-500" },
            { label: "Network Latency", value: 76, color: "bg-yellow-500" },
            { label: "Storage Usage", value: 68, color: "bg-purple-500" }
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/70 text-sm">{item.label}</span>
                <span className="text-white text-sm">{item.value}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MetricsPanel;
