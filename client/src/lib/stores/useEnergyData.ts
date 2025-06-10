import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { EnergyData, EnergyRegionData, DistributionNode } from '../../types/energy';
import { dataService } from '../../services/DataService';

interface EnergyDataState {
  // Data
  energyData: EnergyData | null;
  gridStatus: {
    status: 'normal' | 'warning' | 'critical';
    load: number;
    generation: number;
    frequency: number;
    voltage: number;
    alerts: string[];
  } | null;
  weatherData: any | null;
  
  // Loading states
  isLoading: boolean;
  isGridStatusLoading: boolean;
  isWeatherLoading: boolean;
  
  // Error states
  error: string | null;
  gridError: string | null;
  weatherError: string | null;
  
  // Filters and settings
  selectedRegion: string | null;
  selectedTimeRange: '1h' | '24h' | '7d' | '30d';
  selectedMetrics: string[];
  
  // Auto-refresh settings
  autoRefresh: boolean;
  refreshInterval: number;
  lastUpdated: Date | null;
  
  // Real-time monitoring
  realTimeMonitoring: boolean;
  realtimeInterval: number;
  
  // Actions
  initializeEnergyData: () => Promise<void>;
  refreshEnergyData: () => Promise<void>;
  updateEnergyData: (updates: Partial<EnergyData>) => Promise<void>;
  setSelectedRegion: (region: string | null) => void;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
  setSelectedMetrics: (metrics: string[]) => void;
  
  // Grid operations
  loadGridStatus: () => Promise<void>;
  optimizeGrid: () => Promise<void>;
  
  // Weather integration
  loadWeatherData: (coordinates?: { lat: number; lng: number }) => Promise<void>;
  
  // Settings
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setRealTimeMonitoring: (enabled: boolean) => void;
  
  // Node operations
  updateNode: (nodeId: string, updates: Partial<DistributionNode>) => void;
  addNode: (node: Omit<DistributionNode, 'id'>) => void;
  removeNode: (nodeId: string) => void;
  
  // Utilities
  clearError: () => void;
  exportData: (format: 'json' | 'csv' | 'xlsx') => Promise<void>;
  calculateSystemEfficiency: () => number;
  getRegionMetrics: (regionId: string) => EnergyRegionData | null;
}

export const useEnergyData = create<EnergyDataState>()(
  subscribeWithSelector((set, get) => {
    let refreshTimer: NodeJS.Timeout | null = null;
    let realtimeTimer: NodeJS.Timeout | null = null;

    const startAutoRefresh = () => {
      const { autoRefresh, refreshInterval } = get();
      
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      
      if (autoRefresh && refreshInterval > 0) {
        refreshTimer = setInterval(async () => {
          try {
            await get().refreshEnergyData();
          } catch (error) {
            console.error('Auto-refresh failed:', error);
          }
        }, refreshInterval);
      }
    };

    const startRealTimeMonitoring = () => {
      const { realTimeMonitoring, realtimeInterval } = get();
      
      if (realtimeTimer) {
        clearInterval(realtimeTimer);
      }
      
      if (realTimeMonitoring && realtimeInterval > 0) {
        realtimeTimer = setInterval(async () => {
          try {
            await get().loadGridStatus();
          } catch (error) {
            console.error('Real-time monitoring failed:', error);
          }
        }, realtimeInterval);
      }
    };

    const stopTimers = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
      if (realtimeTimer) {
        clearInterval(realtimeTimer);
        realtimeTimer = null;
      }
    };

    return {
      // Initial state
      energyData: null,
      gridStatus: null,
      weatherData: null,
      isLoading: false,
      isGridStatusLoading: false,
      isWeatherLoading: false,
      error: null,
      gridError: null,
      weatherError: null,
      selectedRegion: null,
      selectedTimeRange: '24h',
      selectedMetrics: ['generation', 'consumption', 'renewableShare'],
      autoRefresh: true,
      refreshInterval: 60000, // 1 minute
      lastUpdated: null,
      realTimeMonitoring: true,
      realtimeInterval: 10000, // 10 seconds

      // Initialize energy data
      initializeEnergyData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await dataService.getEnergyData(get().selectedRegion || undefined);
          
          set({
            energyData: data,
            isLoading: false,
            lastUpdated: new Date(),
            error: null
          });

          // Start monitoring
          startAutoRefresh();
          startRealTimeMonitoring();
          
          // Load grid status and weather data
          await Promise.all([
            get().loadGridStatus(),
            get().loadWeatherData()
          ]);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load energy data';
          set({
            error: errorMessage,
            isLoading: false
          });
          console.error('Energy data initialization failed:', error);
        }
      },

      // Refresh energy data
      refreshEnergyData: async () => {
        const { selectedRegion } = get();
        
        try {
          const data = await dataService.getEnergyData(selectedRegion || undefined);
          
          set({
            energyData: data,
            lastUpdated: new Date(),
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to refresh energy data';
          set({ error: errorMessage });
          console.error('Energy data refresh failed:', error);
        }
      },

      // Update energy data
      updateEnergyData: async (updates) => {
        const { energyData } = get();
        
        if (!energyData) {
          throw new Error('No energy data to update');
        }

        try {
          // In real implementation, this would sync with backend
          const updatedData = { ...energyData, ...updates };
          
          set({
            energyData: updatedData,
            lastUpdated: new Date()
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update energy data';
          set({ error: errorMessage });
          console.error('Energy data update failed:', error);
        }
      },

      // Set selected region
      setSelectedRegion: (region) => {
        set({ selectedRegion: region });
        
        // Refresh data for new region
        get().refreshEnergyData();
        
        // Update weather data for region
        if (region) {
          const regionData = get().energyData?.regions.find(r => r.id === region);
          if (regionData) {
            get().loadWeatherData(regionData.coordinates);
          }
        }
      },

      // Set time range
      setTimeRange: (range) => {
        set({ selectedTimeRange: range });
        
        // Refresh data with new time range
        get().refreshEnergyData();
      },

      // Set selected metrics
      setSelectedMetrics: (metrics) => {
        set({ selectedMetrics: metrics });
      },

      // Load grid status
      loadGridStatus: async () => {
        set({ isGridStatusLoading: true, gridError: null });
        
        try {
          const status = await dataService.getGridStatus();
          
          set({
            gridStatus: status,
            isGridStatusLoading: false,
            gridError: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load grid status';
          set({
            gridError: errorMessage,
            isGridStatusLoading: false
          });
          console.error('Grid status loading failed:', error);
        }
      },

      // Optimize grid
      optimizeGrid: async () => {
        const { energyData } = get();
        
        if (!energyData) {
          throw new Error('No energy data available for optimization');
        }

        try {
          // Simulate grid optimization
          const optimizedNodes = energyData.distributionNodes.map(node => ({
            ...node,
            efficiency: Math.min(100, node.efficiency + Math.random() * 5),
            currentLoad: Math.max(0, node.currentLoad - Math.random() * 10)
          }));

          await get().updateEnergyData({
            distributionNodes: optimizedNodes,
            reliabilityIndex: Math.min(100, energyData.reliabilityIndex + 2)
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to optimize grid';
          set({ error: errorMessage });
          console.error('Grid optimization failed:', error);
          throw error;
        }
      },

      // Load weather data
      loadWeatherData: async (coordinates) => {
        set({ isWeatherLoading: true, weatherError: null });
        
        try {
          const coords = coordinates || { lat: 40.7128, lng: -74.0060 }; // Default to NYC
          const weather = await dataService.getWeatherData(coords);
          
          set({
            weatherData: weather,
            isWeatherLoading: false,
            weatherError: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load weather data';
          set({
            weatherError: errorMessage,
            isWeatherLoading: false
          });
          console.error('Weather data loading failed:', error);
        }
      },

      // Set auto-refresh
      setAutoRefresh: (enabled) => {
        set({ autoRefresh: enabled });
        
        if (enabled) {
          startAutoRefresh();
        } else if (refreshTimer) {
          clearInterval(refreshTimer);
          refreshTimer = null;
        }
      },

      // Set refresh interval
      setRefreshInterval: (interval) => {
        set({ refreshInterval: interval });
        
        if (get().autoRefresh) {
          startAutoRefresh();
        }
      },

      // Set real-time monitoring
      setRealTimeMonitoring: (enabled) => {
        set({ realTimeMonitoring: enabled });
        
        if (enabled) {
          startRealTimeMonitoring();
        } else if (realtimeTimer) {
          clearInterval(realtimeTimer);
          realtimeTimer = null;
        }
      },

      // Update node
      updateNode: (nodeId, updates) => {
        const { energyData } = get();
        
        if (!energyData) return;

        const updatedNodes = energyData.distributionNodes.map(node =>
          node.id === nodeId ? { ...node, ...updates } : node
        );

        set({
          energyData: {
            ...energyData,
            distributionNodes: updatedNodes
          }
        });
      },

      // Add node
      addNode: (nodeData) => {
        const { energyData } = get();
        
        if (!energyData) return;

        const newNode: DistributionNode = {
          ...nodeData,
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        set({
          energyData: {
            ...energyData,
            distributionNodes: [...energyData.distributionNodes, newNode]
          }
        });
      },

      // Remove node
      removeNode: (nodeId) => {
        const { energyData } = get();
        
        if (!energyData) return;

        const filteredNodes = energyData.distributionNodes.filter(node => node.id !== nodeId);

        set({
          energyData: {
            ...energyData,
            distributionNodes: filteredNodes
          }
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null, gridError: null, weatherError: null });
      },

      // Export data
      exportData: async (format) => {
        try {
          const { energyData, gridStatus, weatherData, selectedRegion, selectedTimeRange } = get();
          
          if (!energyData) {
            throw new Error('No energy data available for export');
          }

          const exportData = {
            energyData,
            gridStatus,
            weatherData,
            exportTimestamp: new Date().toISOString(),
            filters: {
              region: selectedRegion,
              timeRange: selectedTimeRange
            }
          };

          const blob = await dataService.exportData('energy', format, exportData);
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `energy-data-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
          set({ error: errorMessage });
          console.error('Data export failed:', error);
        }
      },

      // Calculate system efficiency
      calculateSystemEfficiency: () => {
        const { energyData } = get();
        
        if (!energyData) return 0;

        const efficiency = (energyData.totalGeneration > 0) 
          ? ((energyData.totalConsumption / energyData.totalGeneration) * 
             (100 - energyData.distributionLosses) / 100) * 100
          : 0;

        return Math.min(100, Math.max(0, efficiency));
      },

      // Get region metrics
      getRegionMetrics: (regionId) => {
        const { energyData } = get();
        
        if (!energyData) return null;

        return energyData.regions.find(region => region.id === regionId) || null;
      }
    };
  })
);

// Subscribe to monitoring changes
useEnergyData.subscribe(
  (state) => state.realTimeMonitoring,
  (monitoring) => {
    console.log('Real-time monitoring changed:', monitoring);
  }
);

// Subscribe to region changes
useEnergyData.subscribe(
  (state) => state.selectedRegion,
  (region) => {
    console.log('Selected energy region changed:', region);
  }
);

// Export helper functions
export const getEnergyMetrics = () => {
  const state = useEnergyData.getState();
  
  if (!state.energyData) return null;
  
  return {
    totalCapacity: state.energyData.totalCapacity,
    totalGeneration: state.energyData.totalGeneration,
    totalConsumption: state.energyData.totalConsumption,
    renewableShare: state.energyData.renewableShare,
    gridStability: state.energyData.gridStability,
    reliabilityIndex: state.energyData.reliabilityIndex,
    efficiency: state.calculateSystemEfficiency()
  };
};

export const getGridHealthScore = () => {
  const state = useEnergyData.getState();
  
  if (!state.energyData) return 0;
  
  const { energyData } = state;
  
  // Calculate health score based on multiple factors
  const reliabilityScore = energyData.reliabilityIndex;
  const efficiencyScore = state.calculateSystemEfficiency();
  const stabilityScore = {
    'stable': 100,
    'moderate': 75,
    'unstable': 50,
    'critical': 25
  }[energyData.gridStability] || 50;
  
  const renewableScore = Math.min(100, energyData.renewableShare * 2); // Cap at 50% renewable
  
  return Math.round(
    (reliabilityScore * 0.3 + 
     efficiencyScore * 0.25 + 
     stabilityScore * 0.25 + 
     renewableScore * 0.2)
  );
};

export const getNodesByStatus = () => {
  const state = useEnergyData.getState();
  
  if (!state.energyData) return {};
  
  return state.energyData.distributionNodes.reduce((acc, node) => {
    acc[node.status] = (acc[node.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getEnergySourceBreakdown = () => {
  const state = useEnergyData.getState();
  
  if (!state.energyData) return [];
  
  return state.energyData.sources.map(source => ({
    name: source.source,
    value: source.share,
    capacity: source.capacity,
    generation: source.generation,
    carbonIntensity: source.carbonIntensity
  }));
};
