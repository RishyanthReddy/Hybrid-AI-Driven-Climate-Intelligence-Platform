import { ClimateData, ClimateScore, ClimateAction } from '../../types/climate';
import { ClimateScoreAnalysis, ClimateScoreTrend, ClimateScoreImprovement } from '../../types/algorithms';

/**
 * ClimateScore Engine - Proprietary algorithm for real-time climate action effectiveness scoring
 * Implements multi-dimensional assessment framework with ML-based trend analysis
 */
export class ClimateScoreEngine {
  private config: {
    updateInterval: number; // hours
    benchmarkRegions: string[];
    weights: {
      mitigation: number;
      adaptation: number;
      finance: number;
      transparency: number;
      technology: number;
    };
    dataQualityThreshold: number;
    historicalWindow: number; // months
  };

  private historicalScores: Map<string, ClimateScoreTrend[]> = new Map();
  private benchmarkData: Map<string, number> = new Map();
  private mlModel: ClimateMLModel;

  constructor(config?: Partial<typeof this.config>) {
    this.config = {
      updateInterval: 6,
      benchmarkRegions: ['EU', 'US', 'CN', 'IN', 'BR'],
      weights: {
        mitigation: 0.35,
        adaptation: 0.25,
        finance: 0.20,
        transparency: 0.10,
        technology: 0.10
      },
      dataQualityThreshold: 70,
      historicalWindow: 36,
      ...config
    };

    this.mlModel = new ClimateMLModel();
    this.initializeBenchmarks();
  }

  /**
   * Main analysis function - calculates comprehensive climate score
   */
  async analyzeClimateScore(
    climateData: ClimateData,
    actions: ClimateAction[]
  ): Promise<ClimateScoreAnalysis> {
    try {
      // Calculate component scores
      const componentScores = await this.calculateComponentScores(climateData, actions);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(componentScores);
      
      // Analyze trends
      const trends = await this.analyzeTrends(overallScore, componentScores);
      
      // Get benchmarks
      const benchmarks = this.getBenchmarks(overallScore);
      
      // Identify improvement opportunities
      const improvement = await this.identifyImprovements(componentScores, actions);
      
      // Assess risks and opportunities
      const risks = this.assessRisks(componentScores, trends);
      const opportunities = this.identifyOpportunities(componentScores, actions);

      // Update historical data
      this.updateHistoricalData(overallScore, componentScores);

      return {
        overallScore,
        componentScores,
        trends,
        benchmarks,
        improvement,
        risks,
        opportunities,
        lastCalculated: new Date()
      };
    } catch (error) {
      console.error('ClimateScore Engine analysis failed:', error);
      throw new Error(`ClimateScore Engine analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate scores for each component
   */
  private async calculateComponentScores(
    climateData: ClimateData,
    actions: ClimateAction[]
  ) {
    const mitigation = await this.calculateMitigationScore(climateData, actions);
    const adaptation = await this.calculateAdaptationScore(climateData, actions);
    const finance = await this.calculateFinanceScore(actions);
    const transparency = await this.calculateTransparencyScore(climateData, actions);
    const technology = await this.calculateTechnologyScore(actions);

    return {
      mitigation,
      adaptation,
      finance,
      transparency,
      technology
    };
  }

  /**
   * Calculate mitigation score based on emission reductions and targets
   */
  private async calculateMitigationScore(
    climateData: ClimateData,
    actions: ClimateAction[]
  ): Promise<number> {
    const targetScore = this.assessEmissionTargets(climateData);
    const policyScore = this.assessMitigationPolicies(actions);
    const performanceScore = this.assessEmissionPerformance(climateData);
    const renewableScore = this.assessRenewableTransition(climateData);
    
    // Weighted combination
    return Math.min(100, Math.max(0,
      targetScore * 0.25 +
      policyScore * 0.25 +
      performanceScore * 0.30 +
      renewableScore * 0.20
    ));
  }

  /**
   * Calculate adaptation score based on resilience and preparedness
   */
  private async calculateAdaptationScore(
    climateData: ClimateData,
    actions: ClimateAction[]
  ): Promise<number> {
    const riskAssessmentScore = this.assessClimateRiskManagement(actions);
    const adaptationPlanningScore = this.assessAdaptationPlanning(actions);
    const implementationScore = this.assessAdaptationImplementation(actions);
    const monitoringScore = this.assessAdaptationMonitoring(actions);
    
    return Math.min(100, Math.max(0,
      riskAssessmentScore * 0.25 +
      adaptationPlanningScore * 0.30 +
      implementationScore * 0.30 +
      monitoringScore * 0.15
    ));
  }

  /**
   * Calculate finance score based on funding and investment
   */
  private async calculateFinanceScore(actions: ClimateAction[]): Promise<number> {
    const mobilizationScore = this.assessClimateMobilization(actions);
    const allocationScore = this.assessFundAllocation(actions);
    const effectivenessScore = this.assessFundingEffectiveness(actions);
    const innovationScore = this.assessFinancialInnovation(actions);
    
    return Math.min(100, Math.max(0,
      mobilizationScore * 0.30 +
      allocationScore * 0.25 +
      effectivenessScore * 0.30 +
      innovationScore * 0.15
    ));
  }

  /**
   * Calculate transparency score based on reporting and disclosure
   */
  private async calculateTransparencyScore(
    climateData: ClimateData,
    actions: ClimateAction[]
  ): Promise<number> {
    const reportingScore = this.assessClimateReporting(climateData, actions);
    const dataQualityScore = this.assessDataQuality(climateData);
    const stakeholderScore = this.assessStakeholderEngagement(actions);
    const accessibilityScore = this.assessInformationAccessibility(actions);
    
    return Math.min(100, Math.max(0,
      reportingScore * 0.35 +
      dataQualityScore * 0.25 +
      stakeholderScore * 0.25 +
      accessibilityScore * 0.15
    ));
  }

  /**
   * Calculate technology score based on innovation and deployment
   */
  private async calculateTechnologyScore(actions: ClimateAction[]): Promise<number> {
    const innovationScore = this.assessTechnologyInnovation(actions);
    const deploymentScore = this.assessTechnologyDeployment(actions);
    const transferScore = this.assessTechnologyTransfer(actions);
    const capacityScore = this.assessTechnicalCapacity(actions);
    
    return Math.min(100, Math.max(0,
      innovationScore * 0.30 +
      deploymentScore * 0.30 +
      transferScore * 0.20 +
      capacityScore * 0.20
    ));
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(componentScores: any): number {
    return Math.min(100, Math.max(0,
      componentScores.mitigation * this.config.weights.mitigation +
      componentScores.adaptation * this.config.weights.adaptation +
      componentScores.finance * this.config.weights.finance +
      componentScores.transparency * this.config.weights.transparency +
      componentScores.technology * this.config.weights.technology
    ));
  }

  /**
   * Analyze historical trends and make projections
   */
  private async analyzeTrends(overallScore: number, componentScores: any) {
    const regionId = 'current'; // In production, this would be dynamic
    const historical = this.getHistoricalTrends(regionId);
    const projected = await this.mlModel.projectTrends(historical, componentScores);

    return {
      historical,
      projected
    };
  }

  /**
   * Get benchmark comparisons
   */
  private getBenchmarks(overallScore: number) {
    return {
      global: this.benchmarkData.get('global') || 65,
      regional: this.benchmarkData.get('regional') || 68,
      sectorAverage: this.benchmarkData.get('sector') || 62,
      bestPractice: this.benchmarkData.get('best_practice') || 85
    };
  }

  /**
   * Identify improvement opportunities
   */
  private async identifyImprovements(
    componentScores: any,
    actions: ClimateAction[]
  ): Promise<ClimateScoreImprovement> {
    const potential = this.calculateMaxPotential(componentScores);
    const quickWins = this.identifyQuickWins(componentScores, actions);
    const longTermActions = this.identifyLongTermActions(componentScores, actions);

    return {
      potential,
      quickWins,
      longTermActions
    };
  }

  // Detailed scoring methods
  private assessEmissionTargets(climateData: ClimateData): number {
    const targetAmbition = Math.min(100, (climateData.emissions.reduction / 50) * 100);
    const targetCoverage = 85; // Simulated - scope of targets
    const targetTimeline = 75; // Simulated - timeline adequacy
    
    return (targetAmbition * 0.5 + targetCoverage * 0.3 + targetTimeline * 0.2);
  }

  private assessMitigationPolicies(actions: ClimateAction[]): number {
    const mitigationActions = actions.filter(a => a.category === 'mitigation');
    const policyCount = mitigationActions.length;
    const policyQuality = mitigationActions.reduce((sum, action) => sum + action.progress, 0) / Math.max(1, policyCount);
    const sectorCoverage = Math.min(100, (new Set(mitigationActions.map(a => a.category)).size / 5) * 100);
    
    return Math.min(100, (policyCount * 2 + policyQuality * 0.6 + sectorCoverage * 0.4));
  }

  private assessEmissionPerformance(climateData: ClimateData): number {
    const emissionTrend = -5; // Simulated downward trend
    const targetProgress = Math.min(100, (climateData.emissions.reduction / 30) * 100);
    const intensityImprovement = 15; // Simulated
    
    return Math.min(100, Math.max(0,
      50 + emissionTrend * 2 + targetProgress * 0.3 + intensityImprovement * 2
    ));
  }

  private assessRenewableTransition(climateData: ClimateData): number {
    const renewableShare = climateData.renewableShare;
    const growthRate = 8; // Simulated annual growth rate
    const gridIntegration = 70; // Simulated
    
    return Math.min(100,
      renewableShare * 0.8 + growthRate * 2 + gridIntegration * 0.2
    );
  }

  private assessClimateRiskManagement(actions: ClimateAction[]): number {
    const adaptationActions = actions.filter(a => a.category === 'adaptation');
    const riskAssessmentCount = adaptationActions.filter(a => 
      a.description.toLowerCase().includes('risk') || 
      a.description.toLowerCase().includes('assessment')
    ).length;
    
    return Math.min(100, riskAssessmentCount * 15 + adaptationActions.length * 5);
  }

  private assessAdaptationPlanning(actions: ClimateAction[]): number {
    const adaptationActions = actions.filter(a => a.category === 'adaptation');
    const planningActions = adaptationActions.filter(a => 
      a.status === 'planned' || a.status === 'in_progress'
    );
    
    const comprehensiveness = Math.min(100, (planningActions.length / 10) * 100);
    const integration = 75; // Simulated integration score
    
    return (comprehensiveness * 0.6 + integration * 0.4);
  }

  private assessAdaptationImplementation(actions: ClimateAction[]): number {
    const adaptationActions = actions.filter(a => a.category === 'adaptation');
    const implementedActions = adaptationActions.filter(a => a.status === 'completed');
    const avgProgress = adaptationActions.reduce((sum, a) => sum + a.progress, 0) / Math.max(1, adaptationActions.length);
    
    return Math.min(100, (implementedActions.length * 10 + avgProgress * 0.5));
  }

  private assessAdaptationMonitoring(actions: ClimateAction[]): number {
    const adaptationActions = actions.filter(a => a.category === 'adaptation');
    const monitoredActions = adaptationActions.filter(a => a.milestones.length > 0);
    
    return Math.min(100, (monitoredActions.length / Math.max(1, adaptationActions.length)) * 100);
  }

  private assessClimateMobilization(actions: ClimateAction[]): number {
    const financeActions = actions.filter(a => a.category === 'finance');
    const totalBudget = actions.reduce((sum, a) => sum + a.budget, 0);
    const mobilizationRate = Math.min(100, (totalBudget / 10000000) * 100); // Normalized by $10M
    
    return Math.min(100, mobilizationRate * 0.7 + financeActions.length * 5);
  }

  private assessFundAllocation(actions: ClimateAction[]): number {
    const mitigationBudget = actions.filter(a => a.category === 'mitigation').reduce((sum, a) => sum + a.budget, 0);
    const adaptationBudget = actions.filter(a => a.category === 'adaptation').reduce((sum, a) => sum + a.budget, 0);
    const totalBudget = actions.reduce((sum, a) => sum + a.budget, 0);
    
    if (totalBudget === 0) return 0;
    
    const balance = Math.min(mitigationBudget, adaptationBudget) / Math.max(mitigationBudget, adaptationBudget);
    return Math.min(100, balance * 100);
  }

  private assessFundingEffectiveness(actions: ClimateAction[]): number {
    const totalSpent = actions.reduce((sum, a) => sum + a.spent, 0);
    const totalBudget = actions.reduce((sum, a) => sum + a.budget, 0);
    const avgProgress = actions.reduce((sum, a) => sum + a.progress, 0) / Math.max(1, actions.length);
    
    if (totalBudget === 0) return 0;
    
    const utilizationRate = (totalSpent / totalBudget) * 100;
    return Math.min(100, (utilizationRate * 0.4 + avgProgress * 0.6));
  }

  private assessFinancialInnovation(actions: ClimateAction[]): number {
    const innovativeFinance = actions.filter(a => 
      a.category === 'finance' && 
      (a.description.toLowerCase().includes('innovative') || 
       a.description.toLowerCase().includes('green bond') ||
       a.description.toLowerCase().includes('carbon'))
    ).length;
    
    return Math.min(100, innovativeFinance * 20);
  }

  private assessClimateReporting(climateData: ClimateData, actions: ClimateAction[]): number {
    const dataFreshness = this.calculateDataFreshness(climateData.lastUpdated);
    const reportingScope = 85; // Simulated comprehensive scope
    const standardCompliance = 90; // Simulated standards compliance
    
    return (dataFreshness * 0.3 + reportingScope * 0.4 + standardCompliance * 0.3);
  }

  private assessDataQuality(climateData: ClimateData): number {
    const completeness = 88; // Simulated data completeness
    const accuracy = 92; // Simulated data accuracy
    const timeliness = this.calculateDataFreshness(climateData.lastUpdated);
    const consistency = 85; // Simulated data consistency
    
    return (completeness * 0.25 + accuracy * 0.35 + timeliness * 0.25 + consistency * 0.15);
  }

  private assessStakeholderEngagement(actions: ClimateAction[]): number {
    const totalStakeholders = actions.reduce((sum, a) => sum + a.stakeholders.length, 0);
    const diversityScore = Math.min(100, (totalStakeholders / actions.length / 3) * 100);
    
    return diversityScore;
  }

  private assessInformationAccessibility(actions: ClimateAction[]): number {
    // Simulated accessibility score based on action transparency
    const publicActions = actions.filter(a => a.stakeholders.includes('Community Groups')).length;
    return Math.min(100, (publicActions / actions.length) * 100);
  }

  private assessTechnologyInnovation(actions: ClimateAction[]): number {
    const techActions = actions.filter(a => a.category === 'technology');
    const innovationCount = techActions.filter(a => 
      a.description.toLowerCase().includes('innovative') || 
      a.description.toLowerCase().includes('research')
    ).length;
    
    return Math.min(100, innovationCount * 15 + techActions.length * 5);
  }

  private assessTechnologyDeployment(actions: ClimateAction[]): number {
    const techActions = actions.filter(a => a.category === 'technology');
    const deployedTech = techActions.filter(a => a.status === 'completed' || a.progress > 70);
    
    return Math.min(100, (deployedTech.length / Math.max(1, techActions.length)) * 100);
  }

  private assessTechnologyTransfer(actions: ClimateAction[]): number {
    const transferActions = actions.filter(a => 
      a.category === 'technology' && 
      a.stakeholders.some(s => s.includes('International') || s.includes('Partnership'))
    );
    
    return Math.min(100, transferActions.length * 20);
  }

  private assessTechnicalCapacity(actions: ClimateAction[]): number {
    const capacityActions = actions.filter(a => 
      a.description.toLowerCase().includes('training') || 
      a.description.toLowerCase().includes('capacity')
    );
    
    return Math.min(100, capacityActions.length * 15);
  }

  // Helper methods
  private calculateDataFreshness(lastUpdated: Date): number {
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate < 24) return 100;
    if (hoursSinceUpdate < 72) return 90;
    if (hoursSinceUpdate < 168) return 75; // 1 week
    if (hoursSinceUpdate < 720) return 60; // 1 month
    return 40;
  }

  private initializeBenchmarks(): void {
    // Initialize with global benchmark data
    this.benchmarkData.set('global', 65);
    this.benchmarkData.set('regional', 68);
    this.benchmarkData.set('sector', 62);
    this.benchmarkData.set('best_practice', 85);
  }

  private updateHistoricalData(overallScore: number, componentScores: any): void {
    const regionId = 'current';
    const trend: ClimateScoreTrend = {
      date: new Date(),
      score: overallScore,
      change: 0, // Will be calculated based on previous data
      drivers: this.identifyScoreDrivers(componentScores)
    };

    if (!this.historicalScores.has(regionId)) {
      this.historicalScores.set(regionId, []);
    }

    const history = this.historicalScores.get(regionId)!;
    if (history.length > 0) {
      trend.change = overallScore - history[history.length - 1].score;
    }

    history.push(trend);

    // Keep only data within the historical window
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - this.config.historicalWindow);
    
    this.historicalScores.set(regionId, 
      history.filter(t => t.date >= cutoffDate)
    );
  }

  private getHistoricalTrends(regionId: string): ClimateScoreTrend[] {
    return this.historicalScores.get(regionId) || [];
  }

  private identifyScoreDrivers(componentScores: any): string[] {
    const drivers = [];
    const scores = Object.entries(componentScores) as [string, number][];
    
    // Identify highest and lowest scoring components
    scores.sort((a, b) => b[1] - a[1]);
    
    if (scores[0][1] > 80) drivers.push(`Strong ${scores[0][0]} performance`);
    if (scores[scores.length - 1][1] < 40) drivers.push(`Weak ${scores[scores.length - 1][0]} performance`);
    
    return drivers;
  }

  private calculateMaxPotential(componentScores: any): number {
    // Calculate theoretical maximum score with perfect performance
    const maxScores = Object.keys(componentScores).reduce((max, component) => {
      max[component] = 100;
      return max;
    }, {} as any);
    
    return this.calculateOverallScore(maxScores);
  }

  private identifyQuickWins(componentScores: any, actions: ClimateAction[]) {
    const quickWins = [];
    
    // Identify components with scores below 70 that could be improved quickly
    if (componentScores.transparency < 70) {
      quickWins.push({
        action: 'Improve climate data reporting and disclosure',
        impact: Math.min(15, 70 - componentScores.transparency),
        effort: 'low' as const,
        timeframe: 6
      });
    }
    
    if (componentScores.finance < 60) {
      quickWins.push({
        action: 'Establish climate finance tracking and allocation framework',
        impact: Math.min(20, 60 - componentScores.finance),
        effort: 'medium' as const,
        timeframe: 9
      });
    }
    
    return quickWins;
  }

  private identifyLongTermActions(componentScores: any, actions: ClimateAction[]) {
    const longTermActions = [];
    
    if (componentScores.mitigation < 80) {
      longTermActions.push({
        action: 'Implement comprehensive mitigation strategy with sectoral targets',
        impact: Math.min(25, 80 - componentScores.mitigation),
        investment: 5000000,
        timeframe: 36
      });
    }
    
    if (componentScores.adaptation < 70) {
      longTermActions.push({
        action: 'Develop and implement national adaptation plan',
        impact: Math.min(20, 70 - componentScores.adaptation),
        investment: 3000000,
        timeframe: 24
      });
    }
    
    return longTermActions;
  }

  private assessRisks(componentScores: any, trends: any) {
    const risks = [];
    
    // Check for declining trends
    const recentTrends = trends.historical.slice(-3);
    if (recentTrends.length >= 2) {
      const avgChange = recentTrends.reduce((sum, t) => sum + t.change, 0) / recentTrends.length;
      if (avgChange < -2) {
        risks.push({
          category: 'Performance Decline',
          description: 'Climate score showing consistent downward trend',
          probability: 75,
          impact: Math.abs(avgChange),
          mitigation: ['Implement corrective measures', 'Increase monitoring frequency']
        });
      }
    }
    
    // Check for low component scores
    Object.entries(componentScores).forEach(([component, score]) => {
      if (score < 40) {
        risks.push({
          category: `${component.charAt(0).toUpperCase() + component.slice(1)} Risk`,
          description: `Critically low ${component} score indicates systemic weakness`,
          probability: 90,
          impact: 60 - score,
          mitigation: [`Prioritize ${component} improvements`, 'Allocate additional resources']
        });
      }
    });
    
    return risks;
  }

  private identifyOpportunities(componentScores: any, actions: ClimateAction[]) {
    const opportunities = [];
    
    // Technology opportunities
    if (componentScores.technology < 80) {
      opportunities.push({
        category: 'Technology Innovation',
        description: 'Leverage emerging technologies for enhanced climate action',
        potential: Math.min(20, 80 - componentScores.technology),
        investment: 2000000,
        timeframe: 18,
        feasibility: 75
      });
    }
    
    // Finance opportunities
    const financeActions = actions.filter(a => a.category === 'finance');
    if (financeActions.length < 5) {
      opportunities.push({
        category: 'Climate Finance',
        description: 'Expand climate finance mechanisms and partnerships',
        potential: 15,
        investment: 1000000,
        timeframe: 12,
        feasibility: 85
      });
    }
    
    return opportunities;
  }
}

// Machine Learning Model for trend projection
class ClimateMLModel {
  async projectTrends(historical: ClimateScoreTrend[], componentScores: any): Promise<ClimateScoreTrend[]> {
    // Simplified trend projection using linear regression
    // In production, this would use a sophisticated ML model
    
    if (historical.length < 3) {
      // Not enough historical data, return simple projection
      return this.generateSimpleProjection(componentScores);
    }
    
    // Calculate trend slope
    const xValues = historical.map((_, i) => i);
    const yValues = historical.map(t => t.score);
    const slope = this.calculateLinearSlope(xValues, yValues);
    
    // Project future trends
    const projections = [];
    const lastScore = historical[historical.length - 1].score;
    
    for (let i = 1; i <= 12; i++) { // 12 months projection
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + i);
      
      const projectedScore = Math.max(0, Math.min(100, lastScore + slope * i));
      
      projections.push({
        date: projectedDate,
        score: projectedScore,
        change: i === 1 ? slope : slope,
        drivers: this.projectDrivers(componentScores, slope)
      });
    }
    
    return projections;
  }

  private calculateLinearSlope(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private generateSimpleProjection(componentScores: any): ClimateScoreTrend[] {
    const baseScore = Object.values(componentScores).reduce((sum: number, score) => sum + score, 0) / Object.keys(componentScores).length;
    const projections = [];
    
    for (let i = 1; i <= 12; i++) {
      const projectedDate = new Date();
      projectedDate.setMonth(projectedDate.getMonth() + i);
      
      projections.push({
        date: projectedDate,
        score: Math.min(100, baseScore + i * 0.5), // Modest improvement assumption
        change: 0.5,
        drivers: ['Projected steady improvement']
      });
    }
    
    return projections;
  }

  private projectDrivers(componentScores: any, slope: number): string[] {
    const drivers = [];
    
    if (slope > 0) {
      drivers.push('Continued policy implementation');
      drivers.push('Technology advancement');
    } else {
      drivers.push('Implementation challenges');
      drivers.push('Resource constraints');
    }
    
    return drivers;
  }
}
