/**
 * ResilienceIndex Calculator - Climate adaptation readiness assessment
 * Proprietary algorithm for measuring community resilience to climate impacts
 */

export interface ResilienceMetrics {
  overallScore: number;
  infrastructureResilience: number;
  communityPreparedness: number;
  adaptationCapacity: number;
  economicStability: number;
  socialCohesion: number;
}

export interface ResilienceFactors {
  infrastructure: {
    energyGridStability: number;
    transportationResilience: number;
    buildingStandards: number;
    waterManagement: number;
  };
  community: {
    emergencyPreparedness: number;
    socialNetworks: number;
    localKnowledge: number;
    institutionalCapacity: number;
  };
  economic: {
    diversification: number;
    financialReserves: number;
    insuranceCoverage: number;
    recoveryCapacity: number;
  };
  environmental: {
    ecosystemHealth: number;
    naturalBuffers: number;
    biodiversityIndex: number;
    resourceAvailability: number;
  };
}

export class ResilienceIndexCalculator {
  private weights = {
    infrastructure: 0.3,
    community: 0.25,
    economic: 0.25,
    environmental: 0.2
  };

  calculateResilienceIndex(factors: ResilienceFactors): ResilienceMetrics {
    const infrastructureScore = this.calculateInfrastructureResilience(factors.infrastructure);
    const communityScore = this.calculateCommunityPreparedness(factors.community);
    const economicScore = this.calculateEconomicStability(factors.economic);
    const environmentalScore = this.calculateEnvironmentalResilience(factors.environmental);

    const overallScore = 
      infrastructureScore * this.weights.infrastructure +
      communityScore * this.weights.community +
      economicScore * this.weights.economic +
      environmentalScore * this.weights.environmental;

    return {
      overallScore: Math.round(overallScore * 100) / 100,
      infrastructureResilience: Math.round(infrastructureScore * 100) / 100,
      communityPreparedness: Math.round(communityScore * 100) / 100,
      adaptationCapacity: Math.round((communityScore + environmentalScore) / 2 * 100) / 100,
      economicStability: Math.round(economicScore * 100) / 100,
      socialCohesion: Math.round(communityScore * 100) / 100
    };
  }

  private calculateInfrastructureResilience(infrastructure: ResilienceFactors['infrastructure']): number {
    const values = Object.values(infrastructure);
    const weightedSum = values.reduce((sum, value, index) => {
      const weights = [0.3, 0.25, 0.25, 0.2]; // energy, transport, buildings, water
      return sum + value * weights[index];
    }, 0);
    return Math.min(100, Math.max(0, weightedSum));
  }

  private calculateCommunityPreparedness(community: ResilienceFactors['community']): number {
    const values = Object.values(community);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.min(100, Math.max(0, average));
  }

  private calculateEconomicStability(economic: ResilienceFactors['economic']): number {
    const values = Object.values(economic);
    const weightedSum = values.reduce((sum, value, index) => {
      const weights = [0.3, 0.3, 0.2, 0.2]; // diversification, reserves, insurance, recovery
      return sum + value * weights[index];
    }, 0);
    return Math.min(100, Math.max(0, weightedSum));
  }

  private calculateEnvironmentalResilience(environmental: ResilienceFactors['environmental']): number {
    const values = Object.values(environmental);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.min(100, Math.max(0, average));
  }

  generateRecommendations(metrics: ResilienceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.infrastructureResilience < 70) {
      recommendations.push("Strengthen critical infrastructure systems");
      recommendations.push("Implement redundant energy distribution networks");
    }

    if (metrics.communityPreparedness < 60) {
      recommendations.push("Develop community emergency response programs");
      recommendations.push("Enhance local knowledge sharing networks");
    }

    if (metrics.economicStability < 65) {
      recommendations.push("Diversify local economic base");
      recommendations.push("Establish climate adaptation fund");
    }

    if (metrics.adaptationCapacity < 75) {
      recommendations.push("Invest in nature-based solutions");
      recommendations.push("Build adaptive management capacity");
    }

    return recommendations;
  }
}

export const resilienceCalculator = new ResilienceIndexCalculator();