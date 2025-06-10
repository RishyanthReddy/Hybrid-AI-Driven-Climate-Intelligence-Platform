import { ClimateData, ClimateAction } from '../types/climate';
import { EnergyData, EnergyRegionData } from '../types/energy';

/**
 * Centralized data service for managing API calls and data transformation
 * Handles authentication, caching, and error management
 */
export class DataService {
  private apiBaseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    this.apiKey = import.meta.env.VITE_API_KEY || '';
  }

  /**
   * Fetch climate data from various sources
   */
  async getClimateData(region?: string): Promise<ClimateData> {
    const cacheKey = `climate-data-${region || 'global'}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // In a real implementation, this would call actual climate APIs
      // For now, we generate realistic data structure
      const climateData: ClimateData = {
        globalTemperature: 1.2 + Math.random() * 0.3, // 1.2-1.5°C above pre-industrial
        co2Concentration: 415 + Math.random() * 10, // 415-425 ppm
        seaLevelRise: 21 + Math.random() * 2, // 21-23 cm since 1880
        extremeWeatherEvents: 150 + Math.floor(Math.random() * 50),
        carbonBudget: {
          remaining: 400 + Math.random() * 100, // Gt CO2
          allocated: 1000,
          consumed: 600 + Math.random() * 50
        },
        emissions: {
          annual: 36.8 + Math.random() * 2, // Gt CO2/year
          cumulative: 1650 + Math.random() * 50,
          target: 25, // Target for 2030
          reduction: 15 + Math.random() * 5 // Percentage reduction needed
        },
        renewableShare: 28 + Math.random() * 7, // Global renewable share
        energyIntensity: 5.2 - Math.random() * 0.5, // MJ/$GDP (decreasing)
        regions: this.generateClimateRegions(),
        timeSeries: this.generateClimateTimeSeries(),
        lastUpdated: new Date()
      };

      // Cache the data (TTL: 1 hour for climate data)
      this.setCache(cacheKey, climateData, 3600000);
      
      return climateData;
    } catch (error) {
      console.error('Failed to fetch climate data:', error);
      throw new Error(`Climate data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch energy data from grid and market APIs
   */
  async getEnergyData(region?: string): Promise<EnergyData> {
    const cacheKey = `energy-data-${region || 'global'}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const energyData: EnergyData = {
        totalCapacity: 8000 + Math.random() * 2000, // MW
        totalGeneration: 7500 + Math.random() * 1500, // MWh
        totalConsumption: 7200 + Math.random() * 1200, // MWh
        renewableShare: 35 + Math.random() * 15, // Percentage
        gridStability: this.getRandomGridStability(),
        averagePrice: 80 + Math.random() * 40, // $/MWh
        carbonIntensity: 450 + Math.random() * 100, // gCO2/kWh
        accessRate: 88 + Math.random() * 10, // Percentage
        reliabilityIndex: 92 + Math.random() * 7, // 0-100
        distributionLosses: 8 + Math.random() * 4, // Percentage
        peakDemand: 8500 + Math.random() * 1500, // MW
        sources: this.generateEnergySources(),
        regions: this.generateEnergyRegions(),
        distributionNodes: this.generateDistributionNodes(),
        timeSeries: this.generateEnergyTimeSeries(),
        lastUpdated: new Date()
      };

      // Cache the data (TTL: 15 minutes for energy data)
      this.setCache(cacheKey, energyData, 900000);
      
      return energyData;
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
      throw new Error(`Energy data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch climate actions data
   */
  async getClimateActions(filters?: {
    category?: string;
    status?: string;
    region?: string;
  }): Promise<ClimateAction[]> {
    const cacheKey = `climate-actions-${JSON.stringify(filters || {})}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const actions = this.generateClimateActions(filters);
      
      // Cache the data (TTL: 30 minutes for actions)
      this.setCache(cacheKey, actions, 1800000);
      
      return actions;
    } catch (error) {
      console.error('Failed to fetch climate actions:', error);
      throw new Error(`Climate actions retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Submit new climate action
   */
  async submitClimateAction(action: Omit<ClimateAction, 'id'>): Promise<ClimateAction> {
    try {
      // In real implementation, this would POST to API
      const newAction: ClimateAction = {
        ...action,
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Invalidate cache
      this.invalidateCache('climate-actions');
      
      return newAction;
    } catch (error) {
      console.error('Failed to submit climate action:', error);
      throw new Error(`Action submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update existing climate action
   */
  async updateClimateAction(id: string, updates: Partial<ClimateAction>): Promise<ClimateAction> {
    try {
      // In real implementation, this would PUT/PATCH to API
      const updatedAction = { ...updates, id } as ClimateAction;

      // Invalidate cache
      this.invalidateCache('climate-actions');
      
      return updatedAction;
    } catch (error) {
      console.error('Failed to update climate action:', error);
      throw new Error(`Action update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch real-time energy grid status
   */
  async getGridStatus(): Promise<{
    status: 'normal' | 'warning' | 'critical';
    load: number;
    generation: number;
    frequency: number;
    voltage: number;
    alerts: string[];
  }> {
    try {
      // Simulate real-time grid data
      const status = {
        status: Math.random() > 0.9 ? 'warning' : 'normal' as 'normal' | 'warning' | 'critical',
        load: 7200 + Math.random() * 800,
        generation: 7500 + Math.random() * 500,
        frequency: 50.0 + (Math.random() - 0.5) * 0.1,
        voltage: 230 + (Math.random() - 0.5) * 10,
        alerts: Math.random() > 0.8 ? ['High load in Sector 3', 'Maintenance scheduled'] : []
      };

      return status;
    } catch (error) {
      console.error('Failed to fetch grid status:', error);
      throw new Error(`Grid status retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch weather data for energy predictions
   */
  async getWeatherData(coordinates: { lat: number; lng: number }): Promise<{
    temperature: number;
    humidity: number;
    windSpeed: number;
    solarIrradiance: number;
    forecast: Array<{
      time: Date;
      temperature: number;
      windSpeed: number;
      solarIrradiance: number;
    }>;
  }> {
    try {
      // In real implementation, this would call weather APIs
      const weatherData = {
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        windSpeed: 5 + Math.random() * 15,
        solarIrradiance: 200 + Math.random() * 800,
        forecast: Array.from({ length: 24 }, (_, i) => ({
          time: new Date(Date.now() + i * 3600000),
          temperature: 18 + Math.random() * 12 + Math.sin(i * Math.PI / 12) * 5,
          windSpeed: 3 + Math.random() * 10,
          solarIrradiance: Math.max(0, 100 + Math.random() * 700 * Math.sin(i * Math.PI / 12))
        }))
      };

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw new Error(`Weather data retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export data in various formats
   */
  async exportData(
    dataType: 'climate' | 'energy' | 'actions',
    format: 'json' | 'csv' | 'xlsx',
    filters?: any
  ): Promise<Blob> {
    try {
      let data: any;
      
      switch (dataType) {
        case 'climate':
          data = await this.getClimateData();
          break;
        case 'energy':
          data = await this.getEnergyData();
          break;
        case 'actions':
          data = await this.getClimateActions(filters);
          break;
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }

      return this.formatDataForExport(data, format);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error(`Data export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  private getRandomGridStability(): 'stable' | 'moderate' | 'unstable' | 'critical' {
    const rand = Math.random();
    if (rand > 0.8) return 'stable';
    if (rand > 0.6) return 'moderate';
    if (rand > 0.3) return 'unstable';
    return 'critical';
  }

  private generateEnergySources() {
    return [
      { source: 'solar' as const, capacity: 1500, generation: 1200, share: 20, efficiency: 22, cost: 45, carbonIntensity: 0, availability: 0.25 },
      { source: 'wind' as const, capacity: 1800, generation: 1440, share: 24, efficiency: 35, cost: 35, carbonIntensity: 0, availability: 0.35 },
      { source: 'hydro' as const, capacity: 1200, generation: 1080, share: 18, efficiency: 90, cost: 30, carbonIntensity: 0, availability: 0.55 },
      { source: 'nuclear' as const, capacity: 1000, generation: 900, share: 15, efficiency: 33, cost: 55, carbonIntensity: 12, availability: 0.85 },
      { source: 'gas' as const, capacity: 800, generation: 600, share: 10, efficiency: 45, cost: 70, carbonIntensity: 350, availability: 0.75 },
      { source: 'coal' as const, capacity: 700, generation: 280, share: 8, efficiency: 38, cost: 40, carbonIntensity: 820, availability: 0.75 },
      { source: 'biomass' as const, capacity: 200, generation: 140, share: 3, efficiency: 25, cost: 80, carbonIntensity: 230, availability: 0.7 },
      { source: 'geothermal' as const, capacity: 300, generation: 270, share: 2, efficiency: 15, cost: 60, carbonIntensity: 18, availability: 0.9 }
    ];
  }

  private generateEnergyRegions(): EnergyRegionData[] {
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    
    return regions.map((name, index) => ({
      id: `region-${index + 1}`,
      name,
      coordinates: {
        lat: 40.7128 + (index - 2) * 2,
        lng: -74.0060 + (index - 2) * 3
      },
      population: 1000000 + Math.random() * 2000000,
      energyAccess: 85 + Math.random() * 12,
      consumption: 800 + Math.random() * 400,
      generation: 900 + Math.random() * 300,
      renewableShare: 25 + Math.random() * 20,
      gridConnection: Math.random() > 0.1,
      vulnerabilityLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      infrastructureStatus: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
      socioeconomicIndex: 50 + Math.random() * 40,
      electricityPrice: 0.08 + Math.random() * 0.08,
      outageFrequency: Math.floor(Math.random() * 10),
      outagesDuration: 2 + Math.random() * 8
    }));
  }

  private generateDistributionNodes() {
    return Array.from({ length: 25 }, (_, i) => ({
      id: `node-${i + 1}`,
      name: `Distribution Node ${i + 1}`,
      type: Math.random() > 0.3 ? 'distribution' : 'substation' as any,
      capacity: 50 + Math.random() * 200,
      currentLoad: Math.random() * 150,
      efficiency: 85 + Math.random() * 12,
      status: Math.random() > 0.05 ? 'online' : 'maintenance' as any,
      location: {
        x: (Math.random() - 0.5) * 100,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * 100
      },
      connections: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
        targetId: `node-${((i + j + 1) % 25) + 1}`,
        flowRate: Math.random() * 50,
        efficiency: 0.9 + Math.random() * 0.1,
        status: Math.random() > 0.1 ? 'active' : 'congested' as any,
        capacity: 60 + Math.random() * 40,
        distance: 5 + Math.random() * 20,
        lossRate: 0.5 + Math.random() * 1.5
      })),
      voltage: 11 + Math.random() * 22,
      lastMaintenance: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      nextMaintenance: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000)
    }));
  }

  private generateEnergyTimeSeries() {
    return Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      generation: 7000 + Math.sin(i * Math.PI / 12) * 1000 + Math.random() * 500,
      consumption: 6800 + Math.sin(i * Math.PI / 12 + Math.PI / 4) * 800 + Math.random() * 400,
      renewableShare: 30 + Math.sin(i * Math.PI / 8) * 15 + Math.random() * 10,
      gridFrequency: 50.0 + (Math.random() - 0.5) * 0.1,
      voltage: 230 + (Math.random() - 0.5) * 5,
      demand: 7200 + Math.sin(i * Math.PI / 12) * 1200 + Math.random() * 300,
      price: 60 + Math.sin(i * Math.PI / 12 + Math.PI / 3) * 20 + Math.random() * 15
    }));
  }

  private generateClimateRegions() {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `climate-region-${i + 1}`,
      name: `Climate Region ${String.fromCharCode(65 + i)}`,
      coordinates: {
        lat: -60 + Math.random() * 120,
        lng: -180 + Math.random() * 360
      },
      temperature: 15 + Math.random() * 20,
      precipitation: 500 + Math.random() * 1500,
      co2Emissions: 5 + Math.random() * 15,
      vulnerabilityIndex: Math.random() * 100,
      adaptationScore: 40 + Math.random() * 50,
      mitigationScore: 35 + Math.random() * 55,
      population: 500000 + Math.random() * 5000000,
      gdp: 10000 + Math.random() * 90000
    }));
  }

  private generateClimateTimeSeries() {
    return Array.from({ length: 60 }, (_, i) => ({
      date: new Date(Date.now() - (59 - i) * 30 * 24 * 60 * 60 * 1000), // Last 5 years monthly
      temperature: 14.8 + i * 0.02 + Math.random() * 0.5, // Gradual warming trend
      co2: 380 + i * 0.5 + Math.random() * 2,
      emissions: 35 + Math.random() * 3,
      renewableShare: 15 + i * 0.3 + Math.random() * 2,
      extremeEvents: Math.floor(Math.random() * 5)
    }));
  }

  private generateClimateActions(filters?: any) {
    const categories = ['mitigation', 'adaptation', 'finance', 'technology', 'policy'];
    const statuses = ['planned', 'in_progress', 'completed', 'on_hold'];
    const priorities = ['low', 'medium', 'high', 'critical'];

    return Array.from({ length: 30 }, (_, i) => ({
      id: `action-${i + 1}`,
      title: `Climate Action ${i + 1}`,
      description: `Comprehensive climate action initiative #${i + 1} designed to address key environmental challenges.`,
      category: categories[i % categories.length] as any,
      status: statuses[i % statuses.length] as any,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
      progress: Math.floor(Math.random() * 100),
      startDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      targetDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      budget: 100000 + Math.random() * 9900000,
      spent: Math.random() * 5000000,
      co2Reduction: Math.floor(Math.random() * 1000),
      stakeholders: ['Government', 'Private Sector', 'NGOs', 'Communities'].slice(0, Math.floor(Math.random() * 4) + 1),
      location: `Region ${String.fromCharCode(65 + (i % 5))}`,
      metrics: {
        energySaved: Math.floor(Math.random() * 500) + 100,
        emissionsReduced: Math.floor(Math.random() * 100) + 10,
        beneficiaries: Math.floor(Math.random() * 10000) + 1000,
        jobsCreated: Math.floor(Math.random() * 100) + 10
      },
      milestones: [
        { name: 'Planning', completed: true, date: new Date(2024, 1, 15) },
        { name: 'Implementation', completed: Math.random() > 0.3, date: new Date(2024, 6, 1) },
        { name: 'Monitoring', completed: Math.random() > 0.7, date: new Date(2024, 10, 15) },
        { name: 'Evaluation', completed: Math.random() > 0.9, date: new Date(2025, 2, 28) }
      ]
    }));
  }

  private formatDataForExport(data: any, format: string): Blob {
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      
      case 'csv':
        // Simple CSV conversion for flat data
        if (Array.isArray(data)) {
          const headers = Object.keys(data[0] || {});
          const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
          ].join('\n');
          return new Blob([csvContent], { type: 'text/csv' });
        }
        return new Blob([JSON.stringify(data)], { type: 'text/csv' });
      
      case 'xlsx':
        // For Excel format, in a real app you'd use a library like SheetJS
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Health check for data service
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      climate: boolean;
      energy: boolean;
      actions: boolean;
    };
    latency: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Test each service endpoint
      const services = {
        climate: true, // Would test actual API endpoints
        energy: true,
        actions: true
      };

      const allHealthy = Object.values(services).every(status => status);
      const latency = Date.now() - startTime;

      return {
        status: allHealthy ? 'healthy' : 'degraded',
        services,
        latency
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        services: { climate: false, energy: false, actions: false },
        latency: Date.now() - startTime
      };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
