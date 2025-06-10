import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface AIInsightsPanelProps {
  isProcessing: boolean;
  insights: {
    energyEfficiency: number;
    climateImpact: number;
    vulnerabilityLevel: number;
  };
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'energy' | 'climate' | 'resilience';
  confidence: number;
  timeframe: string;
  implementation: string[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ isProcessing, insights }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateAIRecommendations();
  }, [insights]);

  const generateAIRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newRecommendations: AIRecommendation[] = [
      {
        id: '1',
        title: 'Optimize Energy Distribution Network',
        description: 'Analysis shows 23% efficiency improvement possible through smart grid reconfiguration.',
        impact: 'high',
        category: 'energy',
        confidence: 92,
        timeframe: '3-6 months',
        implementation: [
          'Install smart meters in high-consumption areas',
          'Implement dynamic load balancing algorithms',
          'Upgrade transmission infrastructure'
        ]
      },
      {
        id: '2',
        title: 'Enhance Climate Resilience Infrastructure',
        description: 'Vulnerability assessment indicates critical infrastructure gaps in flood-prone areas.',
        impact: 'high',
        category: 'resilience',
        confidence: 87,
        timeframe: '6-12 months',
        implementation: [
          'Elevate critical energy substations',
          'Install flood barriers around key facilities',
          'Develop emergency backup systems'
        ]
      },
      {
        id: '3',
        title: 'Accelerate Renewable Energy Transition',
        description: 'Carbon reduction model shows 40% emission decrease with solar/wind expansion.',
        impact: 'medium',
        category: 'climate',
        confidence: 78,
        timeframe: '1-2 years',
        implementation: [
          'Identify optimal locations for solar farms',
          'Negotiate power purchase agreements',
          'Update grid integration capabilities'
        ]
      },
      {
        id: '4',
        title: 'Community Energy Storage Program',
        description: 'Distributed battery systems could reduce peak demand by 35% and improve reliability.',
        impact: 'medium',
        category: 'energy',
        confidence: 83,
        timeframe: '8-15 months',
        implementation: [
          'Deploy residential battery systems',
          'Create community energy sharing networks',
          'Implement demand response programs'
        ]
      }
    ];
    
    setRecommendations(newRecommendations);
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy': return 'fas fa-bolt';
      case 'climate': return 'fas fa-leaf';
      case 'resilience': return 'fas fa-shield-alt';
      default: return 'fas fa-lightbulb';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* AI Insights Header */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-brain text-purple-400"></i>
            AI Insights
          </h2>
          {(isProcessing || isGenerating) && (
            <div className="flex items-center gap-2 text-purple-400">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {insights.energyEfficiency.toFixed(0)}%
            </div>
            <div className="text-xs text-white/60">Energy Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {insights.climateImpact.toFixed(0)}%
            </div>
            <div className="text-xs text-white/60">Climate Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {insights.vulnerabilityLevel.toFixed(0)}%
            </div>
            <div className="text-xs text-white/60">Risk Level</div>
          </div>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Smart Recommendations</h3>
          <Button
            onClick={generateAIRecommendations}
            disabled={isGenerating}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <i className="fas fa-sync fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-refresh mr-2"></i>
            )}
            Refresh
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="glass p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setCurrentInsight(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`${getCategoryIcon(rec.category)} text-sm`}></i>
                    <h4 className="font-medium text-white text-sm">{rec.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(rec.impact)} bg-current/20`}>
                      {rec.impact}
                    </span>
                    <span className="text-xs text-white/60">{rec.confidence}%</span>
                  </div>
                </div>
                
                <p className="text-white/70 text-xs mb-2 leading-relaxed">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Timeline: {rec.timeframe}</span>
                  <i className="fas fa-chevron-right text-white/30"></i>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Implementation Details */}
      {recommendations[currentInsight] && (
        <motion.div
          variants={itemVariants}
          className="glass p-4 rounded-xl"
          key={currentInsight}
        >
          <h3 className="text-lg font-semibold text-white mb-3">Implementation Plan</h3>
          <div className="space-y-2">
            {recommendations[currentInsight].implementation.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-white/80 text-sm flex-1">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Predictive Analytics */}
      <motion.div variants={itemVariants} className="glass p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Predictive Outlook</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Energy Efficiency Trend</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, insights.energyEfficiency + 15)}%` }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
              <span className="text-green-400 text-xs">↗ +15%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Carbon Reduction Potential</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
              <span className="text-green-400 text-xs">-40%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Climate Resilience Score</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - insights.vulnerabilityLevel + 25}%` }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
              </div>
              <span className="text-yellow-400 text-xs">↗ +25%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIInsightsPanel;