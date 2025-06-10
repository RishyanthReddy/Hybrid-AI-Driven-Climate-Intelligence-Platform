import { useState, useEffect } from 'react';
import { useClimateData } from '../stores/useClimateData';
import { useEnergyData } from '../stores/useEnergyData';
import { resilienceCalculator, ResilienceMetrics } from '../algorithms/ResilienceIndex';

interface EnergyFlowResult {
  efficiency: number;
  bottlenecks: Array<{
    nodeId: string;
    severity: 'low' | 'medium' | 'high';
    impact: number;
  }>;
  optimization: {
    potentialSavings: number;
    recommendations: string[];
  };
}

interface ClimateScoreResult {
  overallScore: number;
  categories: {
    mitigation: number;
    adaptation: number;
    vulnerability: number;
    resilience: number;
  };
  trends: {
    improving: string[];
    declining: string[];
  };
}

interface VulnerabilityResult {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  averageVulnerability: number;
  affectedRegions: Array<{
    regionId: string;
    vulnerabilityScore: number;
    primaryThreats: string[];
  }>;
  recommendations: string[];
}

export function useAlgorithms() {
  const { climateData } = useClimateData();
  const { energyData } = useEnergyData();
  
  const [energyFlowResults, setEnergyFlowResults] = useState<EnergyFlowResult | null>(null);
  const [climateScoreResults, setClimateScoreResults] = useState<ClimateScoreResult | null>(null);
  const [vulnerabilityResults, setVulnerabilityResults] = useState<VulnerabilityResult | null>(null);
  const [resilienceResults, setResilienceResults] = useState<ResilienceMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (energyData || climateData) {
      runAlgorithms();
    }
  }, [energyData, climateData]);

  const runAlgorithms = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate algorithm processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // EnergyFlow AI Algorithm
      if (energyData) {
        const efficiency = calculateSystemEfficiency(energyData);
        const bottlenecks = identifyBottlenecks(energyData);
        
        setEnergyFlowResults({
          efficiency,
          bottlenecks,
          optimization: {
            potentialSavings: efficiency < 80 ? (80 - efficiency) * 1000 : 0,
            recommendations: generateEnergyRecommendations(efficiency, bottlenecks)
          }
        });
      }

      // ClimateScore Engine
      if (climateData) {
        const overallScore = calculateClimateScore(climateData);
        
        setClimateScoreResults({
          overallScore,
          categories: {
            mitigation: Math.min(100, overallScore + Math.random() * 20 - 10),
            adaptation: Math.min(100, overallScore + Math.random() * 20 - 10),
            vulnerability: Math.max(0, 100 - overallScore + Math.random() * 20 - 10),
            resilience: Math.min(100, overallScore + Math.random() * 15 - 7.5)
          },
          trends: {
            improving: ['renewable energy adoption', 'carbon intensity reduction'],
            declining: ['emissions per capita', 'energy waste']
          }
        });
      }

      // Vulnerability Assessment
      if (climateData && energyData) {
        const riskLevel = assessVulnerabilityLevel(climateData, energyData);
        
        const avgVulnerability = climateData.regions.reduce((sum, region) => sum + region.vulnerabilityIndex, 0) / climateData.regions.length;
        
        setVulnerabilityResults({
          riskLevel,
          averageVulnerability: avgVulnerability,
          affectedRegions: climateData.regions.slice(0, 3).map(region => ({
            regionId: region.id,
            vulnerabilityScore: region.vulnerabilityIndex,
            primaryThreats: ['extreme weather', 'temperature rise', 'infrastructure stress']
          })),
          recommendations: generateVulnerabilityRecommendations(riskLevel)
        });

        // ResilienceIndex Calculation
        const resilienceFactors = {
          infrastructure: {
            energyGridStability: calculateSystemEfficiency(energyData),
            transportationResilience: 75 + Math.random() * 20,
            buildingStandards: 65 + Math.random() * 25,
            waterManagement: 70 + Math.random() * 20
          },
          community: {
            emergencyPreparedness: 60 + Math.random() * 30,
            socialNetworks: 70 + Math.random() * 25,
            localKnowledge: 65 + Math.random() * 30,
            institutionalCapacity: 55 + Math.random() * 35
          },
          economic: {
            diversification: 60 + Math.random() * 30,
            financialReserves: 45 + Math.random() * 40,
            insuranceCoverage: 50 + Math.random() * 35,
            recoveryCapacity: 55 + Math.random() * 30
          },
          environmental: {
            ecosystemHealth: 70 + Math.random() * 25,
            naturalBuffers: 65 + Math.random() * 30,
            biodiversityIndex: 60 + Math.random() * 35,
            resourceAvailability: 75 + Math.random() * 20
          }
        };

        const resilienceMetrics = resilienceCalculator.calculateResilienceIndex(resilienceFactors);
        setResilienceResults(resilienceMetrics);
      }
      
    } catch (error) {
      console.error('Algorithm processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSystemEfficiency = (energyData: any): number => {
    if (!energyData) return 0;
    
    const generation = energyData.totalGeneration;
    const consumption = energyData.totalConsumption;
    const losses = energyData.distributionLosses;
    
    const efficiency = generation > 0 
      ? ((consumption / generation) * (100 - losses) / 100) * 100
      : 0;
    
    return Math.min(100, Math.max(0, efficiency));
  };

  const identifyBottlenecks = (energyData: any) => {
    if (!energyData?.distributionNodes) return [];
    
    return energyData.distributionNodes
      .filter((node: any) => node.efficiency < 85 || node.currentLoad > node.capacity * 0.9)
      .map((node: any) => ({
        nodeId: node.id,
        severity: node.efficiency < 70 ? 'high' : node.efficiency < 85 ? 'medium' : 'low' as any,
        impact: Math.max(0, 100 - node.efficiency)
      }))
      .slice(0, 5);
  };

  const generateEnergyRecommendations = (efficiency: number, bottlenecks: any[]): string[] => {
    const recommendations = [];
    
    if (efficiency < 80) {
      recommendations.push('Upgrade distribution infrastructure to reduce losses');
    }
    
    if (bottlenecks.length > 3) {
      recommendations.push('Implement load balancing across distribution nodes');
    }
    
    recommendations.push('Increase renewable energy integration');
    recommendations.push('Deploy smart grid technologies for real-time optimization');
    
    return recommendations;
  };

  const calculateClimateScore = (climateData: any): number => {
    if (!climateData) return 0;
    
    const renewableWeight = Math.min(100, climateData.renewableShare * 2);
    const emissionWeight = Math.max(0, 100 - (climateData.emissions.annual / 50) * 100);
    const temperatureWeight = Math.max(0, 100 - (climateData.globalTemperature - 1) * 50);
    
    return Math.round((renewableWeight * 0.4 + emissionWeight * 0.4 + temperatureWeight * 0.2));
  };

  const assessVulnerabilityLevel = (climateData: any, energyData: any) => {
    const tempRisk = climateData.globalTemperature > 1.5 ? 2 : 1;
    const gridRisk = energyData.gridStability === 'critical' ? 3 : energyData.gridStability === 'unstable' ? 2 : 1;
    const renewableRisk = energyData.renewableShare < 30 ? 2 : 1;
    
    const totalRisk = tempRisk + gridRisk + renewableRisk;
    
    if (totalRisk >= 6) return 'critical';
    if (totalRisk >= 4) return 'high';
    if (totalRisk >= 3) return 'medium';
    return 'low';
  };

  const generateVulnerabilityRecommendations = (riskLevel: string): string[] => {
    const baseRecommendations = [
      'Strengthen infrastructure resilience',
      'Develop emergency response protocols',
      'Increase renewable energy capacity'
    ];
    
    if (riskLevel === 'critical' || riskLevel === 'high') {
      return [
        'Immediate infrastructure hardening required',
        'Deploy emergency backup systems',
        'Accelerate clean energy transition',
        ...baseRecommendations
      ];
    }
    
    return baseRecommendations;
  };

  return {
    energyFlowResults,
    climateScoreResults,
    vulnerabilityResults,
    resilienceResults,
    isProcessing,
    runAlgorithms
  };
};