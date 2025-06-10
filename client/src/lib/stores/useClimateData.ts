import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ClimateData, ClimateAction } from '../../types/climate';
import { dataService } from '../../services/DataService';

interface ClimateDataState {
  // Data
  climateData: ClimateData | null;
  actions: ClimateAction[];
  
  // Loading states
  isLoading: boolean;
  isActionsLoading: boolean;
  
  // Error states
  error: string | null;
  actionsError: string | null;
  
  // Filters and settings
  selectedRegion: string | null;
  actionFilters: {
    category?: string;
    status?: string;
    priority?: string;
  };
  
  // Auto-refresh settings
  autoRefresh: boolean;
  refreshInterval: number; // milliseconds
  lastUpdated: Date | null;
  
  // Actions
  initializeClimateData: () => Promise<void>;
  refreshClimateData: () => Promise<void>;
  setSelectedRegion: (region: string | null) => void;
  
  // Climate actions
  loadActions: (filters?: any) => Promise<void>;
  addAction: (action: Omit<ClimateAction, 'id'>) => Promise<void>;
  updateAction: (id: string, updates: Partial<ClimateAction>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  setActionFilters: (filters: any) => void;
  
  // Settings
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  
  // Utilities
  clearError: () => void;
  exportData: (format: 'json' | 'csv' | 'xlsx') => Promise<void>;
}

export const useClimateData = create<ClimateDataState>()(
  subscribeWithSelector((set, get) => {
    let refreshTimer: NodeJS.Timeout | null = null;

    const startAutoRefresh = () => {
      const { autoRefresh, refreshInterval } = get();
      
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      
      if (autoRefresh && refreshInterval > 0) {
        refreshTimer = setInterval(async () => {
          try {
            await get().refreshClimateData();
          } catch (error) {
            console.error('Auto-refresh failed:', error);
          }
        }, refreshInterval);
      }
    };

    const stopAutoRefresh = () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    };

    return {
      // Initial state
      climateData: null,
      actions: [],
      isLoading: false,
      isActionsLoading: false,
      error: null,
      actionsError: null,
      selectedRegion: null,
      actionFilters: {},
      autoRefresh: true,
      refreshInterval: 300000, // 5 minutes
      lastUpdated: null,

      // Initialize climate data
      initializeClimateData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await dataService.getClimateData(get().selectedRegion || undefined);
          
          set({
            climateData: data,
            isLoading: false,
            lastUpdated: new Date(),
            error: null
          });

          // Start auto-refresh after successful initialization
          startAutoRefresh();
          
          // Also load actions
          await get().loadActions();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load climate data';
          set({
            error: errorMessage,
            isLoading: false
          });
          console.error('Climate data initialization failed:', error);
        }
      },

      // Refresh climate data
      refreshClimateData: async () => {
        const { selectedRegion } = get();
        
        try {
          const data = await dataService.getClimateData(selectedRegion || undefined);
          
          set({
            climateData: data,
            lastUpdated: new Date(),
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to refresh climate data';
          set({ error: errorMessage });
          console.error('Climate data refresh failed:', error);
        }
      },

      // Set selected region
      setSelectedRegion: (region) => {
        set({ selectedRegion: region });
        
        // Refresh data for new region
        get().refreshClimateData();
      },

      // Load climate actions
      loadActions: async (filters) => {
        set({ isActionsLoading: true, actionsError: null });
        
        try {
          const filtersToUse = filters || get().actionFilters;
          const actions = await dataService.getClimateActions(filtersToUse);
          
          set({
            actions,
            isActionsLoading: false,
            actionsError: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load climate actions';
          set({
            actionsError: errorMessage,
            isActionsLoading: false
          });
          console.error('Climate actions loading failed:', error);
        }
      },

      // Add new action
      addAction: async (actionData) => {
        try {
          const newAction = await dataService.submitClimateAction(actionData);
          
          set(state => ({
            actions: [...state.actions, newAction]
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add climate action';
          set({ actionsError: errorMessage });
          console.error('Add action failed:', error);
          throw error;
        }
      },

      // Update existing action
      updateAction: async (id, updates) => {
        try {
          const updatedAction = await dataService.updateClimateAction(id, updates);
          
          set(state => ({
            actions: state.actions.map(action => 
              action.id === id ? { ...action, ...updatedAction } : action
            )
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update climate action';
          set({ actionsError: errorMessage });
          console.error('Update action failed:', error);
          throw error;
        }
      },

      // Delete action
      deleteAction: async (id) => {
        try {
          // In real implementation, this would call API
          set(state => ({
            actions: state.actions.filter(action => action.id !== id)
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete climate action';
          set({ actionsError: errorMessage });
          console.error('Delete action failed:', error);
          throw error;
        }
      },

      // Set action filters
      setActionFilters: (filters) => {
        set({ actionFilters: filters });
        
        // Reload actions with new filters
        get().loadActions(filters);
      },

      // Set auto-refresh
      setAutoRefresh: (enabled) => {
        set({ autoRefresh: enabled });
        
        if (enabled) {
          startAutoRefresh();
        } else {
          stopAutoRefresh();
        }
      },

      // Set refresh interval
      setRefreshInterval: (interval) => {
        set({ refreshInterval: interval });
        
        // Restart auto-refresh with new interval
        if (get().autoRefresh) {
          startAutoRefresh();
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null, actionsError: null });
      },

      // Export data
      exportData: async (format) => {
        try {
          const { climateData, actions, actionFilters } = get();
          
          if (!climateData) {
            throw new Error('No climate data available for export');
          }

          // Prepare export data
          const exportData = {
            climateData,
            actions: actions.length > 0 ? actions : await dataService.getClimateActions(actionFilters),
            exportTimestamp: new Date().toISOString(),
            filters: {
              region: get().selectedRegion,
              actionFilters
            }
          };

          const blob = await dataService.exportData('climate', format, exportData);
          
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `climate-data-${new Date().toISOString().split('T')[0]}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
          set({ error: errorMessage });
          console.error('Data export failed:', error);
        }
      }
    };
  })
);

// Subscribe to auto-refresh changes
useClimateData.subscribe(
  (state) => state.autoRefresh,
  (autoRefresh) => {
    console.log('Auto-refresh changed:', autoRefresh);
  }
);

// Subscribe to region changes
useClimateData.subscribe(
  (state) => state.selectedRegion,
  (region) => {
    console.log('Selected region changed:', region);
  }
);

// Export helper functions
export const getClimateMetrics = () => {
  const state = useClimateData.getState();
  
  if (!state.climateData) return null;
  
  return {
    temperature: state.climateData.globalTemperature,
    co2Concentration: state.climateData.co2Concentration,
    emissionReduction: state.climateData.emissions.reduction,
    renewableShare: state.climateData.renewableShare,
    carbonBudgetRemaining: state.climateData.carbonBudget.remaining
  };
};

export const getActionStats = () => {
  const state = useClimateData.getState();
  
  const total = state.actions.length;
  const completed = state.actions.filter(a => a.status === 'completed').length;
  const inProgress = state.actions.filter(a => a.status === 'in_progress').length;
  const planned = state.actions.filter(a => a.status === 'planned').length;
  
  const totalBudget = state.actions.reduce((sum, a) => sum + a.budget, 0);
  const totalSpent = state.actions.reduce((sum, a) => sum + a.spent, 0);
  const totalCO2Reduction = state.actions.reduce((sum, a) => sum + a.co2Reduction, 0);
  
  return {
    total,
    completed,
    inProgress,
    planned,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    totalBudget,
    totalSpent,
    budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    totalCO2Reduction,
    avgProgress: total > 0 ? state.actions.reduce((sum, a) => sum + a.progress, 0) / total : 0
  };
};

export const getRegionalData = (regionId?: string) => {
  const state = useClimateData.getState();
  
  if (!state.climateData) return null;
  
  if (regionId) {
    return state.climateData.regions.find(r => r.id === regionId);
  }
  
  return state.climateData.regions;
};
