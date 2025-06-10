import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AIInsightsPanelProps {
  isProcessing: boolean;
  insights: {
    energyEfficiency: number;
    climateImpact: number;
    vulnerabilityLevel: number;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ isProcessing, insights }) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsights = () => {
    const { energyEfficiency, climateImpact, vulnerabilityLevel } = insights;
    
    const insightsList = [
      {
        type: "optimization",
        title: "Energy Optimization Opportunity",
        message: `Current efficiency at ${energyEfficiency.toFixed(1)}%. AI suggests optimizing distribution patterns in sectors 3-7 for potential 12% improvement.`,
        priority: "high",
        icon: "fas fa-lightbulb",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20"
      },
      {
        type: "climate",
        title: "Climate Action Recommendation",
        message: `Climate impact score: ${climateImpact.toFixed(1)}. Implementing renewable energy solutions in vulnerable areas could reduce emissions by 18%.`,
        priority: "medium",
        icon: "fas fa-globe-americas",
        color: "text-green-400",
        bgColor: "bg-green-500/20"
      },
      {
        type: "vulnerability",
        title: "Vulnerability Alert",
        message: `${vulnerabilityLevel.toFixed(1)}% of communities show high energy poverty risk. Prioritize grid expansion in identified regions.`,
        priority: vulnerabilityLevel > 40 ? "high" : "medium",
        icon: "fas fa-exclamation-triangle",
        color: vulnerabilityLevel > 40 ? "text-red-400" : "text-orange-400",
        bgColor: vulnerabilityLevel > 40 ? "bg-red-500/20" : "bg-orange-500/20"
      },
      {
        type: "prediction",
        title: "Predictive Analysis",
        message: "AI models predict 23% increase in energy demand over next 6 months. Recommend proactive capacity planning.",
        priority: "medium",
        icon: "fas fa-chart-line",
        color: "text-blue-400",
        bgColor: "bg-blue-500/20"
      },
      {
        type: "efficiency",
        title: "Cost Optimization",
        message: "Current operational costs could be reduced by 15% through smart load balancing. Estimated savings: $2.3M annually.",
        priority: "high",
        icon: "fas fa-dollar-sign",
        color: "text-purple-400",
        bgColor: "bg-purple-500/20"
      }
    ];

    return insightsList;
  };

  const [aiInsights, setAiInsights] = useState(generateInsights());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % aiInsights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [aiInsights.length]);

  useEffect(() => {
    setAiInsights(generateInsights());
  }, [insights]);

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAiInsights(generateInsights());
    setIsGenerating(false);
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">AI Insights</h2>
            <p className="text-white/60 text-sm">Intelligent recommendations</p>
          </div>
          <div className="flex items-center space-x-2">
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-xs">Processing</span>
              </div>
            )}
            <button
              onClick={handleGenerateNew}
              disabled={isGenerating}
              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt text-white/70 ${isGenerating ? 'animate-spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Current Insight */}
      <motion.div
        variants={itemVariants}
        key={currentInsight}
        className="glass p-4 rounded-xl"
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${aiInsights[currentInsight].bgColor}`}>
            <i className={`${aiInsights[currentInsight].icon} ${aiInsights[currentInsight].color}`}></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-white font-semibold">{aiInsights[currentInsight].title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                aiInsights[currentInsight].priority === 'high' 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {aiInsights[currentInsight].priority}
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {aiInsights[currentInsight].message}
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex space-x-1 mt-4">
          {aiInsights.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index === currentInsight ? 'bg-blue-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Insight Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
        {[
          { label: "Optimization", count: 3, color: "text-blue-400" },
          { label: "Alerts", count: 2, color: "text-red-400" },
          { label: "Predictions", count: 5, color: "text-green-400" },
          { label: "Savings", count: 4, color: "text-purple-400" }
        ].map((category) => (
          <div
            key={category.label}
            className="glass p-3 rounded-lg text-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div className={`text-lg font-bold ${category.color}`}>{category.count}</div>
            <div className="text-white/70 text-xs">{category.label}</div>
          </div>
        ))}
      </motion.div>

      {/* AI Processing Status */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">AI Processing Status</h3>
        <div className="space-y-3">
          {[
            { 
              name: "EnergyFlow AI", 
              status: "active", 
              accuracy: 94.2,
              lastUpdate: "2 min ago"
            },
            { 
              name: "ClimateScore Engine", 
              status: "active", 
              accuracy: 91.7,
              lastUpdate: "1 min ago"
            },
            { 
              name: "VulnerabilityMap", 
              status: isProcessing ? "processing" : "active", 
              accuracy: 88.9,
              lastUpdate: "5 min ago"
            },
            { 
              name: "CarbonTrack Predictor", 
              status: "active", 
              accuracy: 92.3,
              lastUpdate: "3 min ago"
            }
          ].map((algorithm) => (
            <div key={algorithm.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  algorithm.status === 'active' ? 'bg-green-400 animate-pulse' :
                  algorithm.status === 'processing' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></div>
                <span className="text-white/80 text-sm">{algorithm.name}</span>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{algorithm.accuracy}%</div>
                <div className="text-white/50 text-xs">{algorithm.lastUpdate}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
            <i className="fas fa-download"></i>
            <span>Export AI Report</span>
          </button>
          <button className="w-full p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
            <i className="fas fa-cog"></i>
            <span>Optimize Settings</span>
          </button>
          <button className="w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-sm flex items-center justify-center space-x-2">
            <i className="fas fa-bell"></i>
            <span>Set Alerts</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIInsightsPanel;
