export type ActionCategory = 'mitigation' | 'adaptation' | 'finance' | 'technology' | 'policy';
export type ActionStatus = 'planned' | 'in_progress' | 'completed' | 'on_hold';
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ClimateAction {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  status: ActionStatus;
  priority: ActionPriority;
  progress: number; // 0-100
  startDate: Date;
  targetDate: Date;
  budget: number;
  spent: number;
  co2Reduction: number; // MT CO2 equivalent
  stakeholders: string[];
  location: string;
  metrics: {
    energySaved: number; // MWh
    emissionsReduced: number; // MT CO2
    beneficiaries: number;
    jobsCreated: number;
  };
  milestones: ClimateActionMilestone[];
}

export interface ClimateActionMilestone {
  name: string;
  completed: boolean;
  date: Date;
  description?: string;
}

export interface ClimateData {
  globalTemperature: number;
  co2Concentration: number; // ppm
  seaLevelRise: number; // mm
  extremeWeatherEvents: number;
  carbonBudget: {
    remaining: number; // GT CO2
    allocated: number;
    consumed: number;
  };
  emissions: {
    annual: number; // GT CO2
    cumulative: number;
    target: number;
    reduction: number; // percentage
  };
  renewableShare: number; // percentage
  energyIntensity: number; // MJ/$GDP
  regions: ClimateRegionData[];
  timeSeries: ClimateTimeSeriesData[];
  lastUpdated: Date;
}

export interface ClimateRegionData {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  temperature: number;
  precipitation: number;
  co2Emissions: number;
  vulnerabilityIndex: number;
  adaptationScore: number;
  mitigationScore: number;
  population: number;
  gdp: number;
}

export interface ClimateTimeSeriesData {
  date: Date;
  temperature: number;
  co2: number;
  emissions: number;
  renewableShare: number;
  extremeEvents: number;
}

export interface ClimateScore {
  overallScore: number; // 0-100
  mitigationScore: number;
  adaptationScore: number;
  financeScore: number;
  transparencyScore: number;
  components: {
    emissionReduction: number;
    renewableTransition: number;
    energyEfficiency: number;
    carbonPricing: number;
    climateFinance: number;
    adaptation: number;
    transparency: number;
  };
  trends: {
    current: number;
    previous: number;
    change: number;
    direction: 'improving' | 'stable' | 'declining';
  };
  benchmarks: {
    global: number;
    regional: number;
    sector: number;
  };
  lastCalculated: Date;
}

export interface ClimateImpactAssessment {
  physicalRisks: {
    acute: ClimateRisk[];
    chronic: ClimateRisk[];
  };
  transitionRisks: {
    policy: ClimateRisk[];
    technology: ClimateRisk[];
    market: ClimateRisk[];
    reputation: ClimateRisk[];
  };
  opportunities: ClimateOpportunity[];
  adaptation: {
    measures: AdaptationMeasure[];
    effectiveness: number;
    cost: number;
  };
  mitigation: {
    measures: MitigationMeasure[];
    potential: number; // MT CO2 reduction
    cost: number;
  };
}

export interface ClimateRisk {
  id: string;
  name: string;
  description: string;
  probability: number; // 0-1
  impact: number; // 0-100
  timeframe: 'short' | 'medium' | 'long';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedSectors: string[];
  mitigationStrategies: string[];
}

export interface ClimateOpportunity {
  id: string;
  name: string;
  description: string;
  potential: number; // Economic value
  timeframe: 'short' | 'medium' | 'long';
  requiredInvestment: number;
  sectors: string[];
  technologies: string[];
}

export interface AdaptationMeasure {
  id: string;
  name: string;
  description: string;
  sector: string;
  cost: number;
  effectiveness: number; // 0-100
  cobenefits: string[];
  barriers: string[];
  status: 'proposed' | 'planned' | 'implementing' | 'completed';
}

export interface MitigationMeasure {
  id: string;
  name: string;
  description: string;
  sector: string;
  emissionReduction: number; // MT CO2 per year
  cost: number; // USD per MT CO2
  feasibility: number; // 0-100
  cobenefit: string[];
  barriers: string[];
  status: 'proposed' | 'planned' | 'implementing' | 'completed';
}

export interface ClimateScenario {
  name: string;
  warming: number; // degrees Celsius
  co2Concentration: number; // ppm
  emissions: {
    2030: number;
    2050: number;
    2100: number;
  };
  impacts: {
    seaLevelRise: number;
    precipitationChange: number;
    extremeHeatDays: number;
    droughtFrequency: number;
  };
  economicImpact: number; // % GDP loss
  adaptationCost: number;
  mitigationCost: number;
}

export interface SDGProgress {
  goal: number; // 1-17
  name: string;
  progress: number; // 0-100
  target: number;
  indicators: SDGIndicator[];
  climateRelevance: 'high' | 'medium' | 'low';
}

export interface SDGIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'improving' | 'stable' | 'deteriorating';
}
