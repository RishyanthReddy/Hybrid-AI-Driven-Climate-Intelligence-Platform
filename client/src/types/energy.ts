export type EnergySource = 'solar' | 'wind' | 'hydro' | 'nuclear' | 'coal' | 'gas' | 'oil' | 'biomass' | 'geothermal';
export type VulnerabilityLevel = 'low' | 'medium' | 'high' | 'critical';
export type GridStability = 'stable' | 'moderate' | 'unstable' | 'critical';
export type InfrastructureStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface EnergyData {
  totalCapacity: number; // MW
  totalGeneration: number; // MWh
  totalConsumption: number; // MWh
  renewableShare: number; // percentage
  gridStability: GridStability;
  averagePrice: number; // $/MWh
  carbonIntensity: number; // gCO2/kWh
  accessRate: number; // percentage of population
  reliabilityIndex: number; // 0-100
  distributionLosses: number; // percentage
  peakDemand: number; // MW
  sources: EnergySourceData[];
  regions: EnergyRegionData[];
  distributionNodes: DistributionNode[];
  timeSeries: EnergyTimeSeriesData[];
  lastUpdated: Date;
}

export interface EnergySourceData {
  source: EnergySource;
  capacity: number; // MW
  generation: number; // MWh
  share: number; // percentage
  efficiency: number; // percentage
  cost: number; // $/MWh
  carbonIntensity: number; // gCO2/kWh
  availability: number; // capacity factor
}

export interface EnergyRegionData {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  energyAccess: number; // percentage
  consumption: number; // MWh per capita
  generation: number; // MWh
  renewableShare: number; // percentage
  gridConnection: boolean;
  vulnerabilityLevel: VulnerabilityLevel;
  infrastructureStatus: InfrastructureStatus;
  socioeconomicIndex: number; // 0-100
  electricityPrice: number; // $/kWh
  outageFrequency: number; // outages per year
  outagesDuration: number; // hours per outage
}

export interface DistributionNode {
  id: string;
  name: string;
  type: 'generation' | 'transmission' | 'distribution' | 'substation';
  capacity: number; // MW
  currentLoad: number; // MW
  efficiency: number; // percentage
  status: 'online' | 'offline' | 'maintenance' | 'overloaded';
  location: {
    x: number;
    y: number;
    z: number;
  };
  connections: NodeConnection[];
  voltage: number; // kV
  lastMaintenance: Date;
  nextMaintenance: Date;
}

export interface NodeConnection {
  targetId: string;
  flowRate: number; // MW
  efficiency: number; // 0-1
  status: 'active' | 'congested' | 'offline';
  capacity: number; // MW
  distance: number; // km
  lossRate: number; // percentage per km
}

export interface EnergyTimeSeriesData {
  timestamp: Date;
  generation: number;
  consumption: number;
  renewableShare: number;
  gridFrequency: number; // Hz
  voltage: number; // kV
  demand: number; // MW
  price: number; // $/MWh
}

export interface EnergyAccessMetrics {
  population: number;
  householdsWithElectricity: number;
  accessRate: number; // percentage
  reliableAccessRate: number; // percentage
  affordabilityIndex: number; // 0-100
  qualityIndex: number; // 0-100
  ruralAccessRate: number; // percentage
  urbanAccessRate: number; // percentage
  genderParity: number; // 0-100
  businessConnections: number;
  publicFacilitiesConnected: number;
}

export interface EnergyPovertyIndicators {
  energyPovertyRate: number; // percentage
  householdsUnderThreshold: number;
  averageEnergyBurden: number; // percentage of income
  cookingFuelAccess: {
    clean: number; // percentage
    traditional: number; // percentage
  };
  lightingAccess: {
    electric: number; // percentage
    kerosene: number; // percentage
    solar: number; // percentage
    other: number; // percentage
  };
  refrigerationAccess: number; // percentage
  communicationAccess: number; // percentage
}

export interface GridResilience {
  redundancy: number; // 0-100
  flexibility: number; // 0-100
  robustness: number; // 0-100
  resourceAdequacy: number; // 0-100
  operationalResilience: number; // 0-100
  infrastructureResilience: number; // 0-100
  climateresilience: number; // 0-100
  cyberResilience: number; // 0-100
  overallScore: number; // 0-100
}

export interface EnergyTransition {
  renewableCapacity: {
    current: number; // MW
    target2030: number;
    target2050: number;
  };
  fossilFuelPhaseOut: {
    coal: Date;
    gas: Date;
    oil: Date;
  };
  electricVehicles: {
    current: number;
    target2030: number;
  };
  energyStorage: {
    current: number; // MWh
    target2030: number;
  };
  gridModernization: {
    smartGridDeployment: number; // percentage
    digitalInfrastructure: number; // 0-100
    demandResponse: number; // MW capacity
  };
  energyEfficiency: {
    current: number; // energy intensity
    target2030: number;
    savings: number; // MWh per year
  };
  investmentNeeds: {
    generation: number; // billion USD
    transmission: number;
    distribution: number;
    storage: number;
    efficiency: number;
  };
}

export interface MicrogridData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity: number; // kW
  generation: EnergySourceData[];
  storage: {
    capacity: number; // kWh
    currentCharge: number; // percentage
    efficiency: number; // percentage
  };
  load: {
    residential: number; // kW
    commercial: number;
    industrial: number;
    public: number;
  };
  islandMode: boolean;
  gridConnected: boolean;
  reliability: number; // 0-100
  customers: number;
  operatingMode: 'grid-tied' | 'islanded' | 'hybrid';
}

export interface EnergyFlowPattern {
  sourceNode: string;
  targetNode: string;
  flow: number; // MW
  direction: 'bidirectional' | 'unidirectional';
  congestionLevel: number; // 0-100
  lossRate: number; // percentage
  reliability: number; // 0-100
  utilizationRate: number; // percentage
  peakFlow: number; // MW
  averageFlow: number; // MW
  variability: number; // coefficient of variation
}

export interface LoadForecast {
  horizon: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  forecasts: {
    timestamp: Date;
    load: number; // MW
    confidence: number; // 0-100
    uncertainty: number; // +/- MW
  }[];
  accuracy: number; // percentage
  methodology: string;
  weatherDependency: number; // 0-100
  economicSensitivity: number; // elasticity
}

export interface DemandResponse {
  program: string;
  participants: number;
  capacity: number; // MW
  activationFrequency: number; // times per year
  averageDuration: number; // hours
  participation: number; // percentage
  incentive: number; // $/kWh
  technology: string[];
  effectiveness: number; // 0-100
}
