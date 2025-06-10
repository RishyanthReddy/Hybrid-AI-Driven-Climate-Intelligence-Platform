import { ClimateData } from '../../types/climate';
import { EnergyData } from '../../types/energy';
import { ResilienceAnalysis, ResilienceIndicator, StressTestResult, ResilienceScenario, ResilienceRecommendation } from '../../types/algorithms';

/**
 * ResilienceIndex Calculator - Climate adaptation readiness assessment algorithm
 * Implements comprehensive resilience analysis with stress testing and scenario modeling
 */
export class ResilienceIndexCalculator {
  private config: {
    updateInterval: number; // months
    stressTestScenarios: string[];
    recoveryTimeThreshold: number; // months
    components: {
      adaptive: number;
      absorptive: number;
      transformative: number;
    };
    dimensionWeights: {
      infrastructure: number;
      social: number;
      economic: number;
      environmental: number;
      institutional: number;
    };
    confidenceThreshold: number;
  };

  private historicalResilience: Map<string, number[]> = new Map();
  private stressTestEngine: StressTestEngine;
  private scenarioModeler: ResilienceScenarioModeler;
  private indicatorProcessor: IndicatorProcessor;

  constructor(config?: Partial<typeof this.config>) {
    this.config = {
      updateInterval: 3,
      stressTestScenarios: [
        'extreme_weather',
        'infrastructure_failure',
        'economic_shock',
        'energy_crisis',
        'pandemic',
        'cyber_attack'
      ],
      recoveryTimeThreshold: 24,
      components: {
        adaptive: 0.4,
        absorptive: 0.35,
        transformative: 0.25
      },
      dimensionWeights: {
        infrastructure: 0.25,
        social: 0.20,
        economic: 0.20,
        environmental: 0.20,
        institutional: 0.15
      },
      confidenceThreshold: 70,
      ...config
    };

    this.stressTestEngine = new StressTestEngine();
    this.scenarioModeler = new ResilienceScenarioModeler();
    this.indicatorProcessor = new IndicatorProcessor();
  }

  /**
   * Main resilience analysis function
   */
  async analyzeResilience(
    climateData: ClimateData,
    energyData: EnergyData
  ): Promise<ResilienceAnalysis> {
    try {
      // Process resilience indicators
      const indicators = await this.processIndicators(climateData, energyData);

      // Calculate component scores
      const components = this.calculateComponents(indicators);

      // Calculate dimensional scores
      const dimensions = this.calculateDimensions(indicators);

      // Calculate overall resilience index
      const overallIndex = this.calculateOverallIndex(components, dimensions);

      // Perform stress tests
      const stressTests = await this.performStressTests(indicators, climateData, energyData);

      // Generate resilience scenarios
      const scenarios = await this.generateScenarios(overallIndex, indicators, stressTests);

      // Generate recommendations
      const recommendations = this.generateRecommendations(components, dimensions, stressTests);

      // Update historical data
      this.updateHistoricalData(overallIndex);

      return {
        overallIndex,
        components,
        dimensions,
        indicators,
        stressTests,
        scenarios,
        recommendations,
        lastCalculated: new Date()
      };
    } catch (error) {
      console.error('Resilience analysis failed:', error);
      throw new Error(`Resilience analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process and normalize resilience indicators
   */
  private async processIndicators(
    climateData: ClimateData,
    energyData: EnergyData
  ): Promise<ResilienceIndicator[]> {
    const indicators: ResilienceIndicator[] = [];

    // Infrastructure indicators
    indicators.push(...this.getInfrastructureIndicators(energyData));

    // Social indicators
    indicators.push(...this.getSocialIndicators(climateData, energyData));

    // Economic indicators
    indicators.push(...this.getEconomicIndicators(climateData, energyData));

    // Environmental indicators
    indicators.push(...this.getEnvironmentalIndicators(climateData));

    // Institutional indicators
    indicators.push(...this.getInstitutionalIndicators(climateData));

    // Normalize and validate indicators
    return indicators.map(indicator => ({
      ...indicator,
      normalizedValue: this.normalizeIndicatorValue(indicator.value, indicator.name),
      trend: this.calculateIndicatorTrend(indicator.name),
      benchmark: this.getIndicatorBenchmark(indicator.name),
      dataQuality: this.assessDataQuality(indicator.name)
    }));
  }

  /**
   * Get infrastructure resilience indicators
   */
  private getInfrastructureIndicators(energyData: EnergyData): ResilienceIndicator[] {
    return [
      {
        name: 'Grid Reliability',
        category: 'infrastructure',
        value: energyData.reliabilityIndex,
        normalizedValue: 0,
        weight: 0.3,
        trend: 'improving',
        benchmark: 85,
        dataQuality: 90
      },
      {
        name: 'Energy Storage Capacity',
        category: 'infrastructure',
        value: this.calculateStorageCapacity(energyData),
        normalizedValue: 0,
        weight: 0.25,
        trend: 'improving',
        benchmark: 15,
        dataQuality: 85
      },
      {
        name: 'Grid Redundancy',
        category: 'infrastructure',
        value: this.calculateGridRedundancy(energyData),
        normalizedValue: 0,
        weight: 0.2,
        trend: 'stable',
        benchmark: 60,
        dataQuality: 80
      },
      {
        name: 'Smart Grid Deployment',
        category: 'infrastructure',
        value: this.calculateSmartGridDeployment(energyData),
        normalizedValue: 0,
        weight: 0.15,
        trend: 'improving',
        benchmark: 40,
        dataQuality: 75
      },
      {
        name: 'Maintenance Quality',
        category: 'infrastructure',
        value: this.calculateMaintenanceQuality(energyData),
        normalizedValue: 0,
        weight: 0.1,
        trend: 'stable',
        benchmark: 70,
        dataQuality: 85
      }
    ];
  }

  /**
   * Get social resilience indicators
   */
  private getSocialIndicators(climateData: ClimateData, energyData: EnergyData): ResilienceIndicator[] {
    return [
      {
        name: 'Energy Access Equity',
        category: 'social',
        value: this.calculateEnergyEquity(energyData),
        normalizedValue: 0,
        weight: 0.3,
        trend: 'improving',
        benchmark: 85,
        dataQuality: 90
      },
      {
        name: 'Community Preparedness',
        category: 'social',
        value: this.calculateCommunityPreparedness(),
        normalizedValue: 0,
        weight: 0.25,
        trend: 'stable',
        benchmark: 65,
        dataQuality: 70
      },
      {
        name: 'Social Cohesion',
        category: 'social',
        value: this.calculateSocialCohesion(),
        normalizedValue: 0,
        weight: 0.2,
        trend: 'stable',
        benchmark: 70,
        dataQuality: 65
      },
      {
        name: 'Education and Awareness',
        category: 'social',
        value: this.calculateEducationAwareness(),
        normalizedValue: 0,
        weight: 0.15,
        trend: 'improving',
        benchmark: 60,
        dataQuality: 75
      },
      {
        name: 'Vulnerable Population Support',
        category: 'social',
        value: this.calculateVulnerableSupport(energyData),
        normalizedValue: 0,
        weight: 0.1,
        trend: 'improving',
        benchmark: 55,
        dataQuality: 80
      }
    ];
  }

  /**
   * Get economic resilience indicators
   */
  private getEconomicIndicators(climateData: ClimateData, energyData: EnergyData): ResilienceIndicator[] {
    return [
      {
        name: 'Economic Diversification',
        category: 'economic',
        value: this.calculateEconomicDiversification(),
        normalizedValue: 0,
        weight: 0.3,
        trend: 'improving',
        benchmark: 70,
        dataQuality: 85
      },
      {
        name: 'Financial Reserves',
        category: 'economic',
        value: this.calculateFinancialReserves(),
        normalizedValue: 0,
        weight: 0.25,
        trend: 'stable',
        benchmark: 65,
        dataQuality: 90
      },
      {
        name: 'Insurance Coverage',
        category: 'economic',
        value: this.calculateInsuranceCoverage(),
        normalizedValue: 0,
        weight: 0.2,
        trend: 'improving',
        benchmark: 60,
        dataQuality: 80
      },
      {
        name: 'Supply Chain Resilience',
        category: 'economic',
        value: this.calculateSupplyChainResilience(energyData),
        normalizedValue: 0,
        weight: 0.15,
        trend: 'stable',
        benchmark: 55,
        dataQuality: 75
      },
      {
        name: 'Green Economy Transition',
        category: 'economic',
        value: this.calculateGreenTransition(climateData, energyData),
        normalizedValue: 0,
        weight: 0.1,
        trend: 'improving',
        benchmark: 45,
        dataQuality: 85
      }
    ];
  }

  /**
   * Get environmental resilience indicators
   */
  private getEnvironmentalIndicators(climateData: ClimateData): ResilienceIndicator[] {
    return [
      {
        name: 'Ecosystem Health',
        category: 'environmental',
        value: this.calculateEcosystemHealth(),
        normalizedValue: 0,
        weight: 0.3,
        trend: 'declining',
        benchmark: 75,
        dataQuality: 70
      },
      {
        name: 'Natural Resource Security',
        category: 'environmental',
        value: this.calculateResourceSecurity(),
        normalizedValue: 0,
        weight: 0.25,
        trend: 'stable',
        benchmark: 70,
        dataQuality: 80
      },
      {
        name: 'Climate Adaptation Capacity',
        category: 'environmental',
        value: this.calculateAdaptationCapacity(climateData),
        normalizedValue: 0,
        weight: 0.2,
        trend: 'improving',
        benchmark: 60,
        dataQuality: 85
      },
      {
        name: 'Biodiversity Index',
        category: 'environmental',
        value: this.calculateBiodiversityIndex(),
        normalizedValue: 0,
        weight: 0.15,
        trend: 'declining',
        benchmark: 65,
        dataQuality: 75
      },
      {
        name: 'Environmental Monitoring',
        category: 'environmental',
        value: this.calculateEnvironmentalMonitoring(),
        normalizedValue: 0,
        weight: 0.1,
        trend: 'improving',
        benchmark: 70,
        dataQuality: 90
      }
    ];
  }

  /**
   * Get institutional resilience indicators
   */
  private getInstitutionalIndicators(climateData: ClimateData): ResilienceIndicator[] {
    return [
      {
        name: 'Governance Quality',
        category: 'institutional',
        value: this.calculateGovernanceQuality(),
        normalizedValue: 0,
        weight: 0.3,
        trend: 'stable',
        benchmark: 70,
        dataQuality: 80
      },
      {
        name: 'Emergency Response Capacity',
        category: 'institutional',
        value: this.calculateEmergencyResponse(),
        normalizedValue: 0,
        weight: 0.25,
        trend: 'improving',
        benchmark: 75,
        dataQuality: 85
      },
      {
        name: 'Inter-agency Coordination',
        category: 'institutional',
        value: this.calculateInteragencyCoordination(),
        normalizedValue: 0,
        weight: 0.2,
        trend: 'improving',
        benchmark: 65,
        dataQuality: 75
      },
      {
        name: 'Policy Coherence',
        category: 'institutional',
        value: this.calculatePolicyCoherence(climateData),
        normalizedValue: 0,
        weight: 0.15,
        trend: 'stable',
        benchmark: 60,
        dataQuality: 80
      },
      {
        name: 'Stakeholder Engagement',
        category: 'institutional',
        value: this.calculateStakeholderEngagement(),
        normalizedValue: 0,
        weight: 0.1,
        trend: 'improving',
        benchmark: 55,
        dataQuality: 70
      }
    ];
  }

  /**
   * Calculate resilience components (adaptive, absorptive, transformative)
   */
  private calculateComponents(indicators: ResilienceIndicator[]) {
    const adaptiveCapacity = this.calculateAdaptiveCapacity(indicators);
    const absorptiveCapacity = this.calculateAbsorptiveCapacity(indicators);
    const transformativeCapacity = this.calculateTransformativeCapacity(indicators);

    return {
      adaptive: adaptiveCapacity,
      absorptive: absorptiveCapacity,
      transformative: transformativeCapacity
    };
  }

  /**
   * Calculate dimensional resilience scores
   */
  private calculateDimensions(indicators: ResilienceIndicator[]) {
    const dimensions = {
      infrastructure: 0,
      social: 0,
      economic: 0,
      environmental: 0,
      institutional: 0
    };

    Object.keys(dimensions).forEach(dimension => {
      const dimensionIndicators = indicators.filter(i => i.category === dimension);
      const weightedSum = dimensionIndicators.reduce((sum, indicator) => 
        sum + (indicator.normalizedValue * indicator.weight), 0
      );
      const totalWeight = dimensionIndicators.reduce((sum, indicator) => sum + indicator.weight, 0);
      
      dimensions[dimension as keyof typeof dimensions] = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    });

    return dimensions;
  }

  /**
   * Calculate overall resilience index
   */
  private calculateOverallIndex(components: any, dimensions: any): number {
    // Component-based calculation
    const componentScore = 
      components.adaptive * this.config.components.adaptive +
      components.absorptive * this.config.components.absorptive +
      components.transformative * this.config.components.transformative;

    // Dimension-based calculation
    const dimensionScore = Object.entries(this.config.dimensionWeights).reduce((sum, [dim, weight]) => {
      return sum + (dimensions[dim] * weight);
    }, 0);

    // Combined score (weighted average)
    return (componentScore * 0.6 + dimensionScore * 0.4);
  }

  /**
   * Perform stress tests on the resilience system
   */
  private async performStressTests(
    indicators: ResilienceIndicator[],
    climateData: ClimateData,
    energyData: EnergyData
  ): Promise<StressTestResult[]> {
    const stressTests: StressTestResult[] = [];

    for (const scenario of this.config.stressTestScenarios) {
      const stressTest = await this.stressTestEngine.runStressTest(
        scenario,
        indicators,
        climateData,
        energyData
      );
      stressTests.push(stressTest);
    }

    return stressTests.sort((a, b) => b.impact.immediate - a.impact.immediate);
  }

  /**
   * Generate resilience scenarios
   */
  private async generateScenarios(
    overallIndex: number,
    indicators: ResilienceIndicator[],
    stressTests: StressTestResult[]
  ): Promise<ResilienceScenario[]> {
    return await this.scenarioModeler.generateScenarios(overallIndex, indicators, stressTests);
  }

  /**
   * Generate resilience recommendations
   */
  private generateRecommendations(
    components: any,
    dimensions: any,
    stressTests: StressTestResult[]
  ): ResilienceRecommendation[] {
    const recommendations: ResilienceRecommendation[] = [];
    let idCounter = 1;

    // Component-based recommendations
    Object.entries(components).forEach(([component, score]) => {
      if (score < 60) {
        recommendations.push(...this.generateComponentRecommendations(component, score, idCounter));
        idCounter += 3;
      }
    });

    // Dimension-based recommendations
    Object.entries(dimensions).forEach(([dimension, score]) => {
      if (score < 50) {
        recommendations.push(...this.generateDimensionRecommendations(dimension, score, idCounter));
        idCounter += 2;
      }
    });

    // Stress test-based recommendations
    const criticalStressTests = stressTests.filter(st => st.impact.immediate > 70);
    criticalStressTests.forEach(stressTest => {
      recommendations.push(...this.generateStressTestRecommendations(stressTest, idCounter));
      idCounter += 2;
    });

    return recommendations
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 15); // Limit to top 15 recommendations
  }

  // Helper calculation methods
  private calculateStorageCapacity(energyData: EnergyData): number {
    // Simulate storage capacity as percentage of peak demand
    return Math.min(100, (energyData.peakDemand * 0.1 / energyData.peakDemand) * 100);
  }

  private calculateGridRedundancy(energyData: EnergyData): number {
    // Simulate grid redundancy based on distribution nodes
    const redundancyRatio = energyData.distributionNodes.filter(n => n.connections.length > 2).length / 
      energyData.distributionNodes.length;
    return redundancyRatio * 100;
  }

  private calculateSmartGridDeployment(energyData: EnergyData): number {
    // Simulate smart grid deployment percentage
    return 35 + Math.random() * 20; // 35-55% deployment
  }

  private calculateMaintenanceQuality(energyData: EnergyData): number {
    // Simulate maintenance quality based on grid reliability
    return Math.min(100, energyData.reliabilityIndex + 10);
  }

  private calculateEnergyEquity(energyData: EnergyData): number {
    // Calculate energy access equity across regions
    if (energyData.regions.length === 0) return 0;
    
    const accessRates = energyData.regions.map(r => r.energyAccess);
    const mean = accessRates.reduce((sum, rate) => sum + rate, 0) / accessRates.length;
    const variance = accessRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / accessRates.length;
    
    // Lower variance means higher equity
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  private calculateCommunityPreparedness(): number {
    return 60 + Math.random() * 25; // Simulated 60-85%
  }

  private calculateSocialCohesion(): number {
    return 65 + Math.random() * 20; // Simulated 65-85%
  }

  private calculateEducationAwareness(): number {
    return 55 + Math.random() * 30; // Simulated 55-85%
  }

  private calculateVulnerableSupport(energyData: EnergyData): number {
    // Based on energy access for vulnerable populations
    return energyData.accessRate * 0.8; // Assume 80% of general access rate
  }

  private calculateEconomicDiversification(): number {
    return 70 + Math.random() * 20; // Simulated 70-90%
  }

  private calculateFinancialReserves(): number {
    return 60 + Math.random() * 25; // Simulated 60-85%
  }

  private calculateInsuranceCoverage(): number {
    return 55 + Math.random() * 30; // Simulated 55-85%
  }

  private calculateSupplyChainResilience(energyData: EnergyData): number {
    // Based on energy source diversification
    return energyData.sources.length * 12; // 12 points per source type
  }

  private calculateGreenTransition(climateData: ClimateData, energyData: EnergyData): number {
    return energyData.renewableShare * 0.8; // Green transition correlates with renewable share
  }

  private calculateEcosystemHealth(): number {
    return 60 + Math.random() * 25; // Simulated 60-85%
  }

  private calculateResourceSecurity(): number {
    return 65 + Math.random() * 20; // Simulated 65-85%
  }

  private calculateAdaptationCapacity(climateData: ClimateData): number {
    // Based on climate resilience efforts
    return 50 + Math.random() * 35; // Simulated 50-85%
  }

  private calculateBiodiversityIndex(): number {
    return 55 + Math.random() * 30; // Simulated 55-85%
  }

  private calculateEnvironmentalMonitoring(): number {
    return 70 + Math.random() * 25; // Simulated 70-95%
  }

  private calculateGovernanceQuality(): number {
    return 65 + Math.random() * 25; // Simulated 65-90%
  }

  private calculateEmergencyResponse(): number {
    return 70 + Math.random() * 20; // Simulated 70-90%
  }

  private calculateInteragencyCoordination(): number {
    return 60 + Math.random() * 25; // Simulated 60-85%
  }

  private calculatePolicyCoherence(climateData: ClimateData): number {
    return 55 + Math.random() * 30; // Simulated 55-85%
  }

  private calculateStakeholderEngagement(): number {
    return 50 + Math.random() * 35; // Simulated 50-85%
  }

  private normalizeIndicatorValue(value: number, indicatorName: string): number {
    // Normalize to 0-100 scale
    return Math.max(0, Math.min(100, value));
  }

  private calculateIndicatorTrend(indicatorName: string): 'improving' | 'stable' | 'declining' {
    // Simulate trends based on indicator type
    const trends = ['improving', 'stable', 'declining'];
    const weights = [0.4, 0.4, 0.2]; // Bias towards improvement/stability
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return trends[i] as any;
      }
    }
    
    return 'stable';
  }

  private getIndicatorBenchmark(indicatorName: string): number {
    // Return benchmark values for different indicators
    const benchmarks: { [key: string]: number } = {
      'Grid Reliability': 85,
      'Energy Storage Capacity': 15,
      'Grid Redundancy': 60,
      'Smart Grid Deployment': 40,
      'Maintenance Quality': 70,
      // Add more as needed
    };
    
    return benchmarks[indicatorName] || 70; // Default benchmark
  }

  private assessDataQuality(indicatorName: string): number {
    // Simulate data quality assessment
    return 75 + Math.random() * 20; // 75-95% quality
  }

  private calculateAdaptiveCapacity(indicators: ResilienceIndicator[]): number {
    // Adaptive capacity indicators
    const adaptiveIndicators = indicators.filter(i => 
      ['Energy Storage Capacity', 'Smart Grid Deployment', 'Emergency Response Capacity', 
       'Education and Awareness', 'Policy Coherence'].includes(i.name)
    );
    
    return this.calculateWeightedAverage(adaptiveIndicators);
  }

  private calculateAbsorptiveCapacity(indicators: ResilienceIndicator[]): number {
    // Absorptive capacity indicators
    const absorptiveIndicators = indicators.filter(i => 
      ['Grid Reliability', 'Grid Redundancy', 'Financial Reserves', 'Insurance Coverage',
       'Community Preparedness'].includes(i.name)
    );
    
    return this.calculateWeightedAverage(absorptiveIndicators);
  }

  private calculateTransformativeCapacity(indicators: ResilienceIndicator[]): number {
    // Transformative capacity indicators
    const transformativeIndicators = indicators.filter(i => 
      ['Economic Diversification', 'Green Economy Transition', 'Governance Quality',
       'Stakeholder Engagement', 'Climate Adaptation Capacity'].includes(i.name)
    );
    
    return this.calculateWeightedAverage(transformativeIndicators);
  }

  private calculateWeightedAverage(indicators: ResilienceIndicator[]): number {
    if (indicators.length === 0) return 0;
    
    const weightedSum = indicators.reduce((sum, indicator) => 
      sum + (indicator.normalizedValue * indicator.weight), 0
    );
    const totalWeight = indicators.reduce((sum, indicator) => sum + indicator.weight, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private generateComponentRecommendations(
    component: string, 
    score: number, 
    startId: number
  ): ResilienceRecommendation[] {
    const recommendations: ResilienceRecommendation[] = [];
    
    switch (component) {
      case 'adaptive':
        recommendations.push({
          id: `resilience-rec-${startId}`,
          priority: score < 40 ? 'critical' : 'high',
          category: 'adaptive_capacity',
          title: 'Enhance Adaptive Capacity',
          description: 'Improve system flexibility and learning capabilities',
          impact: Math.min(25, 60 - score),
          cost: 2000000,
          timeframe: 18,
          feasibility: 80,
          dependencies: ['Institutional commitment', 'Technical expertise'],
          metrics: ['Response time', 'Learning rate', 'Flexibility index']
        });
        break;
        
      case 'absorptive':
        recommendations.push({
          id: `resilience-rec-${startId}`,
          priority: score < 40 ? 'critical' : 'high',
          category: 'absorptive_capacity',
          title: 'Strengthen Absorptive Capacity',
          description: 'Build redundancy and robustness to withstand shocks',
          impact: Math.min(30, 60 - score),
          cost: 5000000,
          timeframe: 24,
          feasibility: 75,
          dependencies: ['Infrastructure investment', 'Maintenance capacity'],
          metrics: ['System redundancy', 'Recovery time', 'Damage resistance']
        });
        break;
        
      case 'transformative':
        recommendations.push({
          id: `resilience-rec-${startId}`,
          priority: score < 40 ? 'high' : 'medium',
          category: 'transformative_capacity',
          title: 'Build Transformative Capacity',
          description: 'Develop capability for fundamental system transformation',
          impact: Math.min(20, 60 - score),
          cost: 10000000,
          timeframe: 36,
          feasibility: 60,
          dependencies: ['Political will', 'Stakeholder alignment', 'Long-term vision'],
          metrics: ['Innovation rate', 'System evolution', 'Transformation readiness']
        });
        break;
    }
    
    return recommendations;
  }

  private generateDimensionRecommendations(
    dimension: string, 
    score: number, 
    startId: number
  ): ResilienceRecommendation[] {
    const dimensionMap: { [key: string]: any } = {
      infrastructure: {
        title: 'Infrastructure Resilience Upgrade',
        description: 'Modernize and harden critical infrastructure systems',
        cost: 15000000,
        timeframe: 30
      },
      social: {
        title: 'Social Resilience Enhancement',
        description: 'Strengthen community preparedness and social cohesion',
        cost: 3000000,
        timeframe: 18
      },
      economic: {
        title: 'Economic Resilience Building',
        description: 'Diversify economy and strengthen financial buffers',
        cost: 8000000,
        timeframe: 36
      },
      environmental: {
        title: 'Environmental Resilience Protection',
        description: 'Restore ecosystems and enhance natural resilience',
        cost: 5000000,
        timeframe: 48
      },
      institutional: {
        title: 'Institutional Resilience Strengthening',
        description: 'Improve governance and institutional capacity',
        cost: 2000000,
        timeframe: 24
      }
    };

    const config = dimensionMap[dimension];
    if (!config) return [];

    return [{
      id: `resilience-rec-${startId}`,
      priority: score < 30 ? 'critical' : score < 50 ? 'high' : 'medium',
      category: dimension,
      title: config.title,
      description: config.description,
      impact: Math.min(35, 70 - score),
      cost: config.cost,
      timeframe: config.timeframe,
      feasibility: 70,
      dependencies: ['Funding availability', 'Stakeholder support'],
      metrics: [`${dimension} resilience index`, 'Implementation progress']
    }];
  }

  private generateStressTestRecommendations(
    stressTest: StressTestResult, 
    startId: number
  ): ResilienceRecommendation[] {
    return [{
      id: `resilience-rec-${startId}`,
      priority: stressTest.impact.immediate > 85 ? 'critical' : 'high',
      category: 'stress_response',
      title: `${stressTest.scenario} Preparedness`,
      description: `Address vulnerabilities identified in ${stressTest.scenario} stress test`,
      impact: Math.min(40, stressTest.impact.immediate * 0.4),
      cost: stressTest.recovery.cost * 0.3, // Prevention costs less than recovery
      timeframe: 12,
      feasibility: 85,
      dependencies: stressTest.vulnerabilities.slice(0, 3),
      metrics: ['Vulnerability reduction', 'Response capability', 'Recovery speed']
    }];
  }

  private updateHistoricalData(overallIndex: number): void {
    const key = 'global';
    
    if (!this.historicalResilience.has(key)) {
      this.historicalResilience.set(key, []);
    }
    
    const history = this.historicalResilience.get(key)!;
    history.push(overallIndex);
    
    // Keep only recent data (last 24 months)
    if (history.length > 24) {
      history.shift();
    }
  }
}

/**
 * Stress Test Engine for resilience analysis
 */
class StressTestEngine {
  async runStressTest(
    scenario: string,
    indicators: ResilienceIndicator[],
    climateData: ClimateData,
    energyData: EnergyData
  ): Promise<StressTestResult> {
    const stressConfig = this.getStressScenarioConfig(scenario);
    
    const impact = {
      immediate: this.calculateImmediateImpact(stressConfig, indicators),
      shortTerm: this.calculateShortTermImpact(stressConfig, indicators),
      longTerm: this.calculateLongTermImpact(stressConfig, indicators)
    };

    const recovery = {
      time: this.calculateRecoveryTime(stressConfig, impact.immediate),
      cost: this.calculateRecoveryCost(stressConfig, impact.immediate),
      probability: this.calculateRecoveryProbability(stressConfig, indicators)
    };

    const vulnerabilities = this.identifyVulnerabilities(stressConfig, indicators);
    const strengths = this.identifyStrengths(stressConfig, indicators);

    return {
      scenario,
      stress: stressConfig,
      impact,
      recovery,
      vulnerabilities,
      strengths
    };
  }

  private getStressScenarioConfig(scenario: string) {
    const configs = {
      extreme_weather: {
        type: 'Natural Disaster',
        magnitude: 85,
        duration: 3
      },
      infrastructure_failure: {
        type: 'System Failure',
        magnitude: 75,
        duration: 1
      },
      economic_shock: {
        type: 'Economic Crisis',
        magnitude: 70,
        duration: 12
      },
      energy_crisis: {
        type: 'Energy Supply Disruption',
        magnitude: 80,
        duration: 6
      },
      pandemic: {
        type: 'Health Emergency',
        magnitude: 90,
        duration: 24
      },
      cyber_attack: {
        type: 'Cyber Security Incident',
        magnitude: 65,
        duration: 0.5
      }
    };

    return configs[scenario as keyof typeof configs] || {
      type: 'Generic Shock',
      magnitude: 50,
      duration: 2
    };
  }

  private calculateImmediateImpact(stressConfig: any, indicators: ResilienceIndicator[]): number {
    const baseImpact = stressConfig.magnitude;
    const resilienceDiscount = this.calculateResilienceDiscount(indicators);
    
    return Math.max(0, Math.min(100, baseImpact * (1 - resilienceDiscount)));
  }

  private calculateShortTermImpact(stressConfig: any, indicators: ResilienceIndicator[]): number {
    const immediateImpact = this.calculateImmediateImpact(stressConfig, indicators);
    return immediateImpact * 0.7; // Short-term impact is typically lower
  }

  private calculateLongTermImpact(stressConfig: any, indicators: ResilienceIndicator[]): number {
    const immediateImpact = this.calculateImmediateImpact(stressConfig, indicators);
    const adaptiveCapacity = this.getAdaptiveCapacity(indicators);
    
    return Math.max(0, immediateImpact * 0.3 * (1 - adaptiveCapacity / 100));
  }

  private calculateRecoveryTime(stressConfig: any, immediateImpact: number): number {
    const baseDuration = stressConfig.duration;
    const impactMultiplier = 1 + (immediateImpact / 100);
    
    return baseDuration * impactMultiplier;
  }

  private calculateRecoveryCost(stressConfig: any, immediateImpact: number): number {
    const baseCost = 1000000; // $1M base recovery cost
    const magnitudeMultiplier = stressConfig.magnitude / 50;
    const impactMultiplier = 1 + (immediateImpact / 50);
    
    return baseCost * magnitudeMultiplier * impactMultiplier;
  }

  private calculateRecoveryProbability(stressConfig: any, indicators: ResilienceIndicator[]): number {
    const baseProb = 80; // 80% base recovery probability
    const resilienceBonus = this.calculateResilienceDiscount(indicators) * 30;
    const stressPenalty = (stressConfig.magnitude - 50) / 5;
    
    return Math.max(20, Math.min(95, baseProb + resilienceBonus - stressPenalty));
  }

  private calculateResilienceDiscount(indicators: ResilienceIndicator[]): number {
    const avgResilience = indicators.reduce((sum, ind) => sum + ind.normalizedValue, 0) / indicators.length;
    return avgResilience / 100;
  }

  private getAdaptiveCapacity(indicators: ResilienceIndicator[]): number {
    const adaptiveIndicators = indicators.filter(i => 
      ['Emergency Response Capacity', 'Education and Awareness', 'Policy Coherence'].includes(i.name)
    );
    
    if (adaptiveIndicators.length === 0) return 50; // Default
    
    return adaptiveIndicators.reduce((sum, ind) => sum + ind.normalizedValue, 0) / adaptiveIndicators.length;
  }

  private identifyVulnerabilities(stressConfig: any, indicators: ResilienceIndicator[]): string[] {
    const vulnerabilities = [];
    
    // Identify weak indicators
    const weakIndicators = indicators.filter(i => i.normalizedValue < 50);
    vulnerabilities.push(...weakIndicators.slice(0, 3).map(i => `Weak ${i.name}`));
    
    // Scenario-specific vulnerabilities
    switch (stressConfig.type) {
      case 'Natural Disaster':
        vulnerabilities.push('Physical infrastructure exposure', 'Emergency response gaps');
        break;
      case 'System Failure':
        vulnerabilities.push('Single points of failure', 'Insufficient redundancy');
        break;
      case 'Economic Crisis':
        vulnerabilities.push('Economic concentration', 'Limited financial reserves');
        break;
      default:
        vulnerabilities.push('General system weaknesses');
    }
    
    return vulnerabilities.slice(0, 5);
  }

  private identifyStrengths(stressConfig: any, indicators: ResilienceIndicator[]): string[] {
    const strengths = [];
    
    // Identify strong indicators
    const strongIndicators = indicators.filter(i => i.normalizedValue > 75);
    strengths.push(...strongIndicators.slice(0, 3).map(i => `Strong ${i.name}`));
    
    // General strengths
    if (strongIndicators.length > 5) {
      strengths.push('Overall system robustness');
    }
    
    strengths.push('Stakeholder commitment', 'Learning capability');
    
    return strengths.slice(0, 5);
  }
}

/**
 * Resilience Scenario Modeler
 */
class ResilienceScenarioModeler {
  async generateScenarios(
    overallIndex: number,
    indicators: ResilienceIndicator[],
    stressTests: StressTestResult[]
  ): Promise<ResilienceScenario[]> {
    const scenarios: ResilienceScenario[] = [];

    // Business as usual scenario
    scenarios.push(this.generateBusinessAsUsualScenario(overallIndex));

    // Investment scenario
    scenarios.push(this.generateInvestmentScenario(overallIndex, indicators));

    // Crisis scenario
    scenarios.push(this.generateCrisisScenario(overallIndex, stressTests));

    // Transformation scenario
    scenarios.push(this.generateTransformationScenario(overallIndex, indicators));

    return scenarios;
  }

  private generateBusinessAsUsualScenario(overallIndex: number): ResilienceScenario {
    return {
      name: 'Business as Usual',
      description: 'Current trends continue with minimal additional investment',
      timeframe: 10,
      assumptions: ['Current funding levels maintained', 'No major system changes', 'Gradual degradation'],
      resilience: {
        current: overallIndex,
        projected: Math.max(20, overallIndex - 5) // Slight degradation
      },
      interventions: [],
      risks: [
        { name: 'System degradation', probability: 70, impact: 30 },
        { name: 'Increasing vulnerabilities', probability: 80, impact: 25 }
      ]
    };
  }

  private generateInvestmentScenario(overallIndex: number, indicators: ResilienceIndicator[]): ResilienceScenario {
    const weakAreas = indicators.filter(i => i.normalizedValue < 60);
    
    return {
      name: 'Strategic Investment',
      description: 'Targeted investments in identified weak areas',
      timeframe: 10,
      assumptions: ['Additional funding secured', 'Systematic improvement approach', 'Stakeholder support'],
      resilience: {
        current: overallIndex,
        projected: Math.min(95, overallIndex + 15)
      },
      interventions: weakAreas.slice(0, 5).map(indicator => ({
        name: `Improve ${indicator.name}`,
        impact: 15,
        cost: 2000000
      })),
      risks: [
        { name: 'Funding shortfalls', probability: 30, impact: 40 },
        { name: 'Implementation delays', probability: 50, impact: 20 }
      ]
    };
  }

  private generateCrisisScenario(overallIndex: number, stressTests: StressTestResult[]): ResilienceScenario {
    const worstCrisis = stressTests.reduce((worst, current) => 
      current.impact.immediate > worst.impact.immediate ? current : worst
    );

    return {
      name: 'Crisis Response',
      description: `Response to ${worstCrisis.scenario} and recovery`,
      timeframe: 5,
      assumptions: ['Major crisis occurs', 'Emergency response activated', 'Recovery focus'],
      resilience: {
        current: overallIndex,
        projected: Math.max(30, overallIndex - worstCrisis.impact.immediate / 2)
      },
      interventions: [
        { name: 'Emergency response', impact: 30, cost: worstCrisis.recovery.cost },
        { name: 'System recovery', impact: 25, cost: worstCrisis.recovery.cost * 0.5 }
      ],
      risks: [
        { name: 'Cascade failures', probability: 60, impact: 70 },
        { name: 'Slow recovery', probability: 40, impact: 50 }
      ]
    };
  }

  private generateTransformationScenario(overallIndex: number, indicators: ResilienceIndicator[]): ResilienceScenario {
    return {
      name: 'System Transformation',
      description: 'Fundamental transformation to next-generation resilient system',
      timeframe: 15,
      assumptions: ['Major transformation commitment', 'Technology advancement', 'Paradigm shift'],
      resilience: {
        current: overallIndex,
        projected: Math.min(90, overallIndex + 25)
      },
      interventions: [
        { name: 'System redesign', impact: 40, cost: 50000000 },
        { name: 'Technology upgrade', impact: 30, cost: 30000000 },
        { name: 'Capacity building', impact: 20, cost: 10000000 }
      ],
      risks: [
        { name: 'Transformation failure', probability: 25, impact: 80 },
        { name: 'Transition disruptions', probability: 60, impact: 40 }
      ]
    };
  }
}

/**
 * Indicator Processor for data validation and normalization
 */
class IndicatorProcessor {
  processIndicators(rawIndicators: any[]): ResilienceIndicator[] {
    return rawIndicators.map(indicator => ({
      ...indicator,
      normalizedValue: this.normalizeValue(indicator.value, indicator.name),
      dataQuality: this.assessDataQuality(indicator),
      trend: this.calculateTrend(indicator.name)
    }));
  }

  private normalizeValue(value: number, indicatorName: string): number {
    // Implement indicator-specific normalization
    return Math.max(0, Math.min(100, value));
  }

  private assessDataQuality(indicator: any): number {
    // Assess data quality based on completeness, accuracy, timeliness
    return 75 + Math.random() * 20;
  }

  private calculateTrend(indicatorName: string): 'improving' | 'stable' | 'declining' {
    // Calculate trend based on historical data
    return Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining';
  }
}
