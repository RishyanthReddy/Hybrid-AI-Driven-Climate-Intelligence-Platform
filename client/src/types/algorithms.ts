import { EnergyData, EnergyRegionData, DistributionNode } from './energy';
import { ClimateData, ClimateScore } from './climate';

// EnergyFlow AI Algorithm Types
export interface EnergyFlowAnalysis {
  efficiency: number; // 0-100
  optimization: {
    currentFlow: number; // MW
    optimizedFlow: number; // MW
    improvement: number; // percentage
  };
  bottlenecks: FlowBottleneck[];
  recommendations: FlowRecommendation[];
  loadBalancing: LoadBalancingResult;
  demandPrediction: DemandPrediction;
  gridStability: GridStabilityAnalysis;
  lastCalculated: Date;
}

export interface FlowBottleneck {
  nodeId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  capacity: number; // MW
  currentLoad: number; // MW
  utilizationRate: number; // percentage
  impact: number; // 0-100
  estimatedCost: number; // USD
  recommendedActions: string[];
}

export interface FlowRecommendation {
  id: string;
  type: 'capacity_upgrade' | 'load_redistribution' | 'demand_response' | 'storage_deployment';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedImpact: number; // percentage improvement
  cost: number; // USD
  implementationTime: number; // months
  feasibility: number; // 0-100
}

export interface LoadBalancingResult {
  currentImbalance: number; // MW
  optimizedBalance: number; // MW
  balancingActions: BalancingAction[];
  stabilityIndex: number; // 0-100
  frequency: number; // Hz
  voltageProfile: VoltageProfile[];
}

export interface BalancingAction {
  nodeId: string;
  action: 'increase_generation' | 'decrease_generation' | 'shed_load' | 'activate_storage';
  amount: number; // MW
  duration: number; // minutes
  cost: number; // USD/MWh
}

export interface VoltageProfile {
  nodeId: string;
  voltage: number; // kV
  targetVoltage: number; // kV
  deviation: number; // percentage
  status: 'normal' | 'warning' | 'critical';
}

export interface DemandPrediction {
  horizon: '1h' | '24h' | '7d' | '30d';
  predictions: {
    timestamp: Date;
    demand: number; // MW
    confidence: number; // 0-100
    uncertainty: number; // +/- MW
  }[];
  accuracy: number; // percentage
  methodology: string;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  importance: number; // 0-100
  correlation: number; // -1 to 1
  impact: number; // MW per unit change
}

export interface GridStabilityAnalysis {
  overall: number; // 0-100
  frequency: {
    current: number; // Hz
    target: number; // Hz
    deviation: number; // Hz
    stability: number; // 0-100
  };
  voltage: {
    average: number; // kV
    variability: number; // coefficient of variation
    violations: number; // count
    stability: number; // 0-100
  };
  powerQuality: {
    harmonics: number; // THD percentage
    flickering: number; // 0-100
    interruptions: number; // count per year
    quality: number; // 0-100
  };
  resilience: number; // 0-100
}

// ClimateScore Engine Types
export interface ClimateScoreAnalysis {
  overallScore: number; // 0-100
  componentScores: {
    mitigation: number;
    adaptation: number;
    finance: number;
    transparency: number;
    technology: number;
  };
  trends: {
    historical: ClimateScoreTrend[];
    projected: ClimateScoreTrend[];
  };
  benchmarks: {
    global: number;
    regional: number;
    sectorAverage: number;
    bestPractice: number;
  };
  improvement: ClimateScoreImprovement;
  risks: ClimateScoreRisk[];
  opportunities: ClimateScoreOpportunity[];
  lastCalculated: Date;
}

export interface ClimateScoreTrend {
  date: Date;
  score: number;
  change: number; // compared to previous
  drivers: string[];
}

export interface ClimateScoreImprovement {
  potential: number; // maximum achievable score
  quickWins: {
    action: string;
    impact: number; // score points
    effort: 'low' | 'medium' | 'high';
    timeframe: number; // months
  }[];
  longTermActions: {
    action: string;
    impact: number;
    investment: number; // USD
    timeframe: number; // months
  }[];
}

export interface ClimateScoreRisk {
  category: string;
  description: string;
  probability: number; // 0-100
  impact: number; // negative score points
  mitigation: string[];
}

export interface ClimateScoreOpportunity {
  category: string;
  description: string;
  potential: number; // score points
  investment: number; // USD
  timeframe: number; // months
  feasibility: number; // 0-100
}

// VulnerabilityMap Algorithm Types
export interface VulnerabilityAssessment {
  overallVulnerability: number; // 0-100
  averageVulnerability: number; // 0-100
  regions: RegionVulnerability[];
  factors: VulnerabilityFactor[];
  hotspots: VulnerabilityHotspot[];
  trends: VulnerabilityTrend[];
  interventions: VulnerabilityIntervention[];
  lastAssessed: Date;
}

export interface RegionVulnerability {
  regionId: string;
  name: string;
  vulnerabilityScore: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'critical';
  population: number;
  components: {
    energyAccess: number; // 0-100
    infrastructure: number; // 0-100
    socioeconomic: number; // 0-100
    environmental: number; // 0-100
    governance: number; // 0-100
  };
  risks: RegionRisk[];
  adaptiveCapacity: number; // 0-100
  exposure: number; // 0-100
  sensitivity: number; // 0-100
}

export interface VulnerabilityFactor {
  name: string;
  weight: number; // 0-1
  value: number; // normalized 0-100
  impact: number; // contribution to overall vulnerability
  dataQuality: number; // 0-100
  confidence: number; // 0-100
}

export interface VulnerabilityHotspot {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  vulnerabilityScore: number;
  population: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  mainChallenges: string[];
  recommendedActions: string[];
  estimatedCost: number; // USD for interventions
}

export interface VulnerabilityTrend {
  date: Date;
  vulnerability: number;
  change: number;
  drivers: string[];
  forecast: number; // projected vulnerability in 5 years
}

export interface VulnerabilityIntervention {
  id: string;
  name: string;
  type: 'infrastructure' | 'policy' | 'technology' | 'capacity_building' | 'finance';
  targetRegions: string[];
  impact: number; // reduction in vulnerability score
  cost: number; // USD
  timeframe: number; // months
  feasibility: number; // 0-100
  cobenefits: string[];
  prerequisites: string[];
}

export interface RegionRisk {
  type: string;
  probability: number; // 0-100
  impact: number; // 0-100
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  mitigation: string[];
}

// CarbonTrack Predictor Types
export interface CarbonEmissionAnalysis {
  currentEmissions: number; // MT CO2 equivalent
  projectedEmissions: EmissionProjection[];
  reductionPotential: ReductionPotential;
  trajectories: EmissionTrajectory[];
  sectors: SectorEmissions[];
  interventions: CarbonIntervention[];
  targets: EmissionTarget[];
  lastCalculated: Date;
}

export interface EmissionProjection {
  year: number;
  baselineEmissions: number; // MT CO2
  projectedEmissions: number; // MT CO2
  uncertainty: number; // +/- MT CO2
  confidence: number; // 0-100
  assumptions: string[];
}

export interface ReductionPotential {
  technical: number; // MT CO2 per year
  economic: number; // MT CO2 per year at <$100/tCO2
  maximum: number; // MT CO2 per year theoretical
  byCost: {
    cost: number; // $/tCO2
    potential: number; // MT CO2 per year
  }[];
  byTimeframe: {
    short: number; // 1-5 years
    medium: number; // 5-15 years
    long: number; // 15-30 years
  };
}

export interface EmissionTrajectory {
  scenario: string;
  description: string;
  emissions: {
    year: number;
    value: number; // MT CO2
  }[];
  peakYear: number;
  netZeroYear: number | null;
  cumulativeEmissions: number; // MT CO2
  temperature: number; // degrees warming
  probability: number; // 0-100
}

export interface SectorEmissions {
  sector: string;
  currentEmissions: number; // MT CO2
  share: number; // percentage
  trend: number; // annual change percentage
  intensity: number; // tCO2 per unit activity
  reductionPotential: number; // MT CO2
  abatementCost: number; // $/tCO2
  mainSources: string[];
}

export interface CarbonIntervention {
  id: string;
  name: string;
  type: 'energy' | 'transport' | 'industry' | 'buildings' | 'agriculture' | 'forestry' | 'waste';
  sector: string;
  emissionReduction: number; // MT CO2 per year
  cost: number; // $/tCO2
  investment: number; // total USD required
  timeframe: number; // years to full implementation
  readiness: number; // 0-100
  barriers: string[];
  enablers: string[];
  cobenefits: string[];
}

export interface EmissionTarget {
  name: string;
  baseYear: number;
  targetYear: number;
  reduction: number; // percentage
  absoluteTarget: number; // MT CO2
  scope: 'economy_wide' | 'energy' | 'specific_sector';
  type: 'absolute' | 'intensity' | 'baseline_scenario';
  progress: number; // percentage towards target
  onTrack: boolean;
  gap: number; // MT CO2
}

// ResilienceIndex Calculator Types
export interface ResilienceAnalysis {
  overallIndex: number; // 0-100
  components: {
    adaptive: number; // adaptive capacity
    absorptive: number; // ability to absorb shocks
    transformative: number; // ability to transform
  };
  dimensions: {
    infrastructure: number;
    social: number;
    economic: number;
    environmental: number;
    institutional: number;
  };
  indicators: ResilienceIndicator[];
  stressTests: StressTestResult[];
  scenarios: ResilienceScenario[];
  recommendations: ResilienceRecommendation[];
  lastCalculated: Date;
}

export interface ResilienceIndicator {
  name: string;
  category: string;
  value: number;
  normalizedValue: number; // 0-100
  weight: number; // 0-1
  trend: 'improving' | 'stable' | 'declining';
  benchmark: number;
  dataQuality: number; // 0-100
}

export interface StressTestResult {
  scenario: string;
  stress: {
    type: string;
    magnitude: number;
    duration: number; // months
  };
  impact: {
    immediate: number; // 0-100
    shortTerm: number; // 6 months
    longTerm: number; // 2 years
  };
  recovery: {
    time: number; // months to full recovery
    cost: number; // USD
    probability: number; // 0-100
  };
  vulnerabilities: string[];
  strengths: string[];
}

export interface ResilienceScenario {
  name: string;
  description: string;
  timeframe: number; // years
  assumptions: string[];
  resilience: {
    current: number;
    projected: number;
  };
  interventions: {
    name: string;
    impact: number; // change in resilience index
    cost: number; // USD
  }[];
  risks: {
    name: string;
    probability: number;
    impact: number;
  }[];
}

export interface ResilienceRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  impact: number; // improvement in resilience index
  cost: number; // USD
  timeframe: number; // months
  feasibility: number; // 0-100
  dependencies: string[];
  metrics: string[];
}

// Algorithm Configuration Types
export interface AlgorithmConfig {
  energyFlow: {
    updateInterval: number; // minutes
    optimizationHorizon: number; // hours
    constraints: {
      maxLoadFactor: number;
      minReserve: number; // percentage
      voltageRange: [number, number]; // min, max kV
    };
    weights: {
      efficiency: number;
      reliability: number;
      cost: number;
      emissions: number;
    };
  };
  climateScore: {
    updateInterval: number; // hours
    benchmarkRegions: string[];
    weights: {
      mitigation: number;
      adaptation: number;
      finance: number;
      transparency: number;
      technology: number;
    };
    dataQualityThreshold: number; // 0-100
  };
  vulnerability: {
    updateInterval: number; // days
    riskThreshold: number; // 0-100
    factors: {
      energyAccess: number;
      infrastructure: number;
      socioeconomic: number;
      environmental: number;
      governance: number;
    };
    aggregationMethod: 'weighted_average' | 'geometric_mean' | 'minimum';
  };
  carbonTrack: {
    updateInterval: number; // days
    projectionHorizon: number; // years
    scenarios: string[];
    uncertaintyBounds: number; // percentage
    discountRate: number; // percentage
  };
  resilience: {
    updateInterval: number; // months
    stressTestScenarios: string[];
    recoveryTimeThreshold: number; // months
    components: {
      adaptive: number;
      absorptive: number;
      transformative: number;
    };
  };
}

export interface AlgorithmPerformance {
  algorithm: string;
  accuracy: number; // 0-100
  precision: number; // 0-100
  recall: number; // 0-100
  f1Score: number; // 0-100
  processingTime: number; // milliseconds
  dataQuality: number; // 0-100
  confidence: number; // 0-100
  lastBenchmark: Date;
  trends: {
    accuracy: 'improving' | 'stable' | 'declining';
    speed: 'improving' | 'stable' | 'declining';
  };
}
