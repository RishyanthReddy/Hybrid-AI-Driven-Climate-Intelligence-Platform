import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricsPanel from './MetricsPanel';
import AIInsightsPanel from './AIInsightsPanel';
import AdvancedDataVisualization from '../Analytics/AdvancedDataVisualization';
import ClimateImpactDashboard from '../ClimateAction/ClimateImpactDashboard';
import CinematicVisualization from '../3D/CinematicVisualization';
import SustainabilityGlobe3D from '../3D/SustainabilityGlobe3D';
import { useClimateData } from '../../lib/stores/useClimateData';
import { useEnergyData } from '../../lib/stores/useEnergyData';
import { useAlgorithms } from '../../lib/hooks/useAlgorithms';
import { sustainabilityService } from '../../services/SustainabilityService';
import { realTimeDataService, RealTimeMetrics } from '../../services/RealTimeDataService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Briefcase,
  Users,
  Building,
  TrendingUp,
  Leaf,
  Heart,
  DollarSign,
  Globe,
  AlertTriangle,
  Shield,
  Target
} from 'lucide-react';

const EnhancedMainDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'energy' | 'climate' | 'analytics' | '3d-city' | '3d-visualizations' | 'sustainability'>('overview');
  const [show3DParticles, setShow3DParticles] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [sustainabilityData, setSustainabilityData] = useState<any>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [realTimeData, setRealTimeData] = useState({
    efficiency: 98.7,
    load: 2.4,
    nodes: 50,
    response: 12,
    uptime: 99.2,
    generation: 2.8,
    consumption: 2.4,
    storage: 0.4
  });
  
  const { climateData } = useClimateData();
  const { energyData } = useEnergyData();
  const { 
    energyFlowResults, 
    climateScoreResults, 
    vulnerabilityResults, 
    resilienceResults,
    isProcessing 
  } = useAlgorithms();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Generate city buildings data
  const cityBuildings = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `building-${i}`,
      position: [
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      height: 1 + Math.random() * 4,
      energyConsumption: 50 + Math.random() * 200,
      efficiency: 60 + Math.random() * 40,
      type: ['residential', 'commercial', 'industrial'][Math.floor(Math.random() * 3)] as 'residential' | 'commercial' | 'industrial',
      status: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'inactive' : 'active' as 'active' | 'inactive' | 'critical'
    }));
  }, []);

  // Carbon emission sources for particle system
  const emissionSources = React.useMemo(() => {
    return cityBuildings
      .filter(building => building.type === 'industrial' || building.efficiency < 70)
      .map(building => ({
        position: [building.position[0], building.height + 1, building.position[2]] as [number, number, number],
        intensity: (100 - building.efficiency) / 100,
        type: building.type as 'factory' | 'vehicle' | 'building'
      }));
  }, [cityBuildings]);

  // Load sustainability data
  useEffect(() => {
    const loadSustainabilityData = async () => {
      try {
        const impactMetrics = await sustainabilityService.getSustainabilityImpactMetrics();
        const jobRecommendations = await sustainabilityService.getJobRecommendations(1, 5);
        const culturalPractices = await sustainabilityService.getCulturalPracticesData();
        const economicEquity = await sustainabilityService.getEconomicEquityData();

        setSustainabilityData({
          impactMetrics,
          jobRecommendations,
          culturalPractices: culturalPractices.slice(0, 3),
          economicEquity
        });
      } catch (error) {
        console.error('Error loading sustainability data:', error);
      }
    };

    loadSustainabilityData();
  }, []);

  // Set up real-time data subscription
  useEffect(() => {
    const subscriptionId = realTimeDataService.subscribe('sustainability', (metrics: RealTimeMetrics) => {
      setRealTimeMetrics(metrics);
    });

    return () => {
      realTimeDataService.unsubscribe(subscriptionId);
    };
  }, []);

  // Real-time data simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        efficiency: Math.max(95, Math.min(99.9, prev.efficiency + (Math.random() - 0.5) * 0.5)),
        load: Math.max(2.0, Math.min(3.5, prev.load + (Math.random() - 0.5) * 0.1)),
        nodes: Math.max(45, Math.min(55, prev.nodes + Math.floor((Math.random() - 0.5) * 2))),
        response: Math.max(8, Math.min(20, prev.response + (Math.random() - 0.5) * 2)),
        uptime: Math.max(98, Math.min(99.9, prev.uptime + (Math.random() - 0.5) * 0.1)),
        generation: Math.max(2.5, Math.min(3.2, prev.generation + (Math.random() - 0.5) * 0.1)),
        consumption: Math.max(2.0, Math.min(2.8, prev.consumption + (Math.random() - 0.5) * 0.1)),
        storage: Math.max(0.2, Math.min(0.6, prev.storage + (Math.random() - 0.5) * 0.05))
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const ViewSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: 'overview', label: 'Overview', icon: 'fas fa-home' },
        { key: 'energy', label: 'Energy Grid', icon: 'fas fa-bolt' },
        { key: 'climate', label: 'Climate Impact', icon: 'fas fa-leaf' },
        { key: 'sustainability', label: 'Sustainability', icon: 'fas fa-seedling' },
        { key: '3d-city', label: 'City Visualization', icon: 'fas fa-city' },
        { key: '3d-visualizations', label: '3D Models', icon: 'fas fa-cube' },
        { key: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' }
      ].map(view => (
        <Button
          key={view.key}
          onClick={() => setActiveView(view.key as any)}
          variant={activeView === view.key ? "default" : "outline"}
          className={`${
            activeView === view.key
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-white/10 hover:bg-white/20 border-white/20'
          } text-white`}
        >
          <i className={`${view.icon} mr-2`}></i>
          {view.label}
        </Button>
      ))}
    </div>
  );

  const RealTimeStatus = () => (
    <Card className="glass border-white/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">System Online</span>
            </div>
            <div className="text-white/60 text-sm">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-white/80">
              Processing: <span className="text-blue-400">{isProcessing ? 'Active' : 'Complete'}</span>
            </div>
            {activeView === 'climate' && (
              <Button
                onClick={() => setShow3DParticles(!show3DParticles)}
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <i className={`fas fa-${show3DParticles ? 'eye-slash' : 'eye'} mr-2`}></i>
                {show3DParticles ? 'Hide' : 'Show'} Emissions
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OverviewDashboard = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Metrics and AI Insights */}
      <div className="xl:col-span-1 space-y-6 overflow-y-auto max-h-screen">
        <MetricsPanel
          energyData={energyData}
          climateData={climateData}
          algorithmResults={{
            energyFlow: energyFlowResults,
            climateScore: climateScoreResults,
            vulnerability: vulnerabilityResults
          }}
        />

        <AIInsightsPanel
          isProcessing={isProcessing}
          insights={{
            energyEfficiency: energyFlowResults?.efficiency || 0,
            climateImpact: climateScoreResults?.overallScore || 0,
            vulnerabilityLevel: vulnerabilityResults?.averageVulnerability || 0
          }}
        />

        {/* Sustainability Impact Overview */}
        {sustainabilityData?.impactMetrics && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-400" />
                Sustainability Impact
                {realTimeMetrics && (
                  <div className="flex items-center gap-1 ml-auto">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">
                      {realTimeMetrics ?
                        (sustainabilityData.impactMetrics.jobsCreated + realTimeMetrics.jobsCreatedToday).toLocaleString() :
                        sustainabilityData.impactMetrics.jobsCreated.toLocaleString()
                      }
                    </div>
                    <div className="text-white/60">Jobs Created</div>
                    {realTimeMetrics && realTimeMetrics.jobsCreatedToday > 0 && (
                      <div className="text-xs text-green-400">+{realTimeMetrics.jobsCreatedToday} today</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">
                      {sustainabilityData.impactMetrics.culturalPracticesDocumented}
                    </div>
                    <div className="text-white/60">Cultures Preserved</div>
                    {realTimeMetrics && realTimeMetrics.culturalPracticesAtRisk > 0 && (
                      <div className="text-xs text-red-400">{realTimeMetrics.culturalPracticesAtRisk} at risk</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {sustainabilityData.impactMetrics.supplyChainTransparencyImproved}
                    </div>
                    <div className="text-white/60">Supply Chains</div>
                    {realTimeMetrics && (
                      <div className="text-xs text-blue-400">
                        {Math.round(realTimeMetrics.supplyChainTransparency)}% transparency
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-400">
                      {sustainabilityData.impactMetrics.communitiesSupported}
                    </div>
                    <div className="text-white/60">Communities</div>
                    {realTimeMetrics && (
                      <div className="text-xs text-orange-400">
                        {Math.round(realTimeMetrics.communityEngagement)}% engaged
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Carbon Reduced</span>
                    <span className="text-green-400 font-medium">
                      {realTimeMetrics ?
                        (sustainabilityData.impactMetrics.carbonFootprintReduced + realTimeMetrics.carbonFootprintReduction).toLocaleString() :
                        sustainabilityData.impactMetrics.carbonFootprintReduced.toLocaleString()
                      } tons CO₂
                    </span>
                  </div>
                  {realTimeMetrics && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-white/60">Overall Score</span>
                      <span className="text-blue-400 font-medium">
                        {Math.round(realTimeMetrics.sustainabilityScore)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resilience Index Display */}
        {resilienceResults && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <i className="fas fa-shield-alt text-green-400"></i>
                Climate Resilience Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-400">
                    {resilienceResults.overallScore.toFixed(1)}
                  </div>
                  <div className="text-white/60 text-sm">Overall Resilience Score</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">
                      {resilienceResults.infrastructureResilience.toFixed(1)}
                    </div>
                    <div className="text-white/60">Infrastructure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">
                      {resilienceResults.communityPreparedness.toFixed(1)}
                    </div>
                    <div className="text-white/60">Community</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-400">
                      {resilienceResults.economicStability.toFixed(1)}
                    </div>
                    <div className="text-white/60">Economic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-400">
                      {resilienceResults.adaptationCapacity.toFixed(1)}
                    </div>
                    <div className="text-white/60">Adaptation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 3D Visualization */}
      <div className="xl:col-span-2 bg-black/20 rounded-xl overflow-hidden relative">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <i className="fas fa-bolt text-blue-400"></i>
            Energy Grid 3D Overview
          </h3>
          <p className="text-white/60 text-sm">Real-time 3D energy distribution monitoring</p>
        </div>
        <div className="h-[500px] relative">
          <CinematicVisualization type="energy" className="w-full h-full" />

          {/* Stats overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                <div className="text-green-400 font-semibold">98.7%</div>
                <div className="text-white/70">Efficiency</div>
              </div>
              <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                <div className="text-blue-400 font-semibold">2.4 GW</div>
                <div className="text-white/70">Output</div>
              </div>
              <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                <div className="text-yellow-400 font-semibold">156</div>
                <div className="text-white/70">Nodes</div>
              </div>
              <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                <div className="text-purple-400 font-semibold">12ms</div>
                <div className="text-white/70">Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional 3D Preview Section */}
      <div className="mt-6 bg-black/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <i className="fas fa-cube text-purple-400"></i>
            3D Preview
          </h3>
          <p className="text-white/60 text-sm">Quick 3D visualization preview</p>
        </div>
        <div className="h-64">
          <CinematicVisualization type="energy" className="w-full h-full" />
        </div>
      </div>
    </div>
  );

  const CityVisualization = () => (
    <div className="h-full min-h-[700px] bg-black/20 rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <i className="fas fa-city text-green-400"></i>
          Smart City 3D Grid
        </h3>
        <p className="text-white/60 text-sm">Urban energy distribution network visualization</p>
      </div>

      <div className="h-[600px] relative">
        <CinematicVisualization type="city" className="w-full h-full" />

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
              <div className="text-green-400 font-semibold">247</div>
              <div className="text-white/70">Buildings</div>
            </div>
            <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
              <div className="text-blue-400 font-semibold">89%</div>
              <div className="text-white/70">Coverage</div>
            </div>
            <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
              <div className="text-yellow-400 font-semibold">1.8 GW</div>
              <div className="text-white/70">Consumption</div>
            </div>
            <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
              <div className="text-purple-400 font-semibold">24/7</div>
              <div className="text-white/70">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {selectedBuilding && (
        <div className="absolute top-20 right-4 glass p-4 rounded-xl max-w-sm z-10">
          <h3 className="text-white font-bold mb-2">Building Details</h3>
          <div className="text-white/80 text-sm space-y-1">
            <div>Type: {selectedBuilding.type}</div>
            <div>Consumption: {selectedBuilding.energyConsumption.toFixed(1)} kW</div>
            <div>Efficiency: {selectedBuilding.efficiency.toFixed(1)}%</div>
            <div>Status: <span className={`${
              selectedBuilding.status === 'active' ? 'text-green-400' :
              selectedBuilding.status === 'critical' ? 'text-red-400' :
              'text-yellow-400'
            }`}>{selectedBuilding.status}</span></div>
          </div>
          <Button
            onClick={() => setSelectedBuilding(null)}
            size="sm"
            className="mt-3 bg-red-600 hover:bg-red-700"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );

  const SustainabilityDashboard = () => (
    <div className="space-y-6">
      {/* Sustainability Overview Cards */}
      {sustainabilityData?.impactMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Sustainable Jobs</p>
                  <p className="text-2xl font-bold text-green-400">
                    {sustainabilityData.impactMetrics.jobsCreated.toLocaleString()}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-green-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800">+15% this month</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Cultural Practices</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {sustainabilityData.impactMetrics.culturalPracticesDocumented}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-purple-100 text-purple-800">12 urgent cases</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Supply Chains</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {sustainabilityData.impactMetrics.supplyChainTransparencyImproved}
                  </p>
                </div>
                <Building className="h-8 w-8 text-blue-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-blue-100 text-blue-800">78% transparency</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Communities</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {sustainabilityData.impactMetrics.communitiesSupported}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-orange-100 text-orange-800">Global reach</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3D Sustainability Visualization */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Global Sustainability Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 relative">
            <SustainabilityGlobe3D />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Opportunities Widget */}
        {sustainabilityData?.jobRecommendations && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-400" />
                Latest Sustainable Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sustainabilityData.jobRecommendations.map((job: any, index: number) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium text-sm">{job.title}</h4>
                        <p className="text-white/60 text-xs">{job.companyInfo.name}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {Math.round(parseFloat(job.sustainabilityScore) * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>{job.location}</span>
                      <span>{job.jobType}</span>
                      <span>${parseInt(job.salaryMin).toLocaleString()}+</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-3 bg-green-600 hover:bg-green-700">
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cultural Heritage Widget */}
        {sustainabilityData?.culturalPractices && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-400" />
                Cultural Heritage Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sustainabilityData.culturalPractices.map((practice: any, index: number) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium text-sm">{practice.name}</h4>
                        <p className="text-white/60 text-xs">{practice.originRegion}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {practice.preservationStatus === 'endangered' && (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                        {practice.preservationStatus === 'vulnerable' && (
                          <TrendingUp className="h-4 w-4 text-yellow-400" />
                        )}
                        {practice.preservationStatus === 'stable' && (
                          <Shield className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">
                        {practice.knowledgeHolders.length} knowledge holders
                      </span>
                      <Badge
                        className={`text-xs ${
                          practice.preservationStatus === 'endangered' ? 'bg-red-100 text-red-800' :
                          practice.preservationStatus === 'vulnerable' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {practice.preservationStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                  View Heritage Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Economic Equity Overview */}
      {sustainabilityData?.economicEquity && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              Economic Equity Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {sustainabilityData.economicEquity.equityMetrics.overallEquityScore}%
                </div>
                <div className="text-white/60 text-sm">Overall Equity Score</div>
                <Progress
                  value={sustainabilityData.economicEquity.equityMetrics.overallEquityScore}
                  className="mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {sustainabilityData.economicEquity.equityMetrics.wageTransparencyScore}%
                </div>
                <div className="text-white/60 text-sm">Wage Transparency</div>
                <Progress
                  value={sustainabilityData.economicEquity.equityMetrics.wageTransparencyScore}
                  className="mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {sustainabilityData.economicEquity.equityMetrics.localSupplierPercentage}%
                </div>
                <div className="text-white/60 text-sm">Local Suppliers</div>
                <Progress
                  value={sustainabilityData.economicEquity.equityMetrics.localSupplierPercentage}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                View Equity Dashboard
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Post Sustainable Job
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Document Culture
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Analyze Supply Chain
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col p-6 overflow-hidden"
    >
      <ViewSelector />
      <RealTimeStatus />
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'overview' && <OverviewDashboard />}

        {activeView === 'sustainability' && <SustainabilityDashboard />}

        {activeView === 'energy' && (
          <div className="h-full grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Energy Grid Metrics Panel */}
            <div className="xl:col-span-1 space-y-4 overflow-y-auto max-h-full">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <i className="fas fa-bolt text-blue-400"></i>
                    Grid Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{realTimeData.uptime.toFixed(1)}%</div>
                        <div className="text-white/60 text-sm">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{realTimeData.load.toFixed(1)} GW</div>
                        <div className="text-white/60 text-sm">Current Load</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-yellow-400">{realTimeData.nodes}</div>
                        <div className="text-white/60 text-xs">Active Nodes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">{realTimeData.response.toFixed(0)}ms</div>
                        <div className="text-white/60 text-xs">Response Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Energy Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Generation</span>
                        <span className="text-green-400">{realTimeData.generation.toFixed(1)} GW</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: `${(realTimeData.generation / 3.5) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Consumption</span>
                        <span className="text-blue-400">{realTimeData.consumption.toFixed(1)} GW</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${(realTimeData.consumption / 3.5) * 100}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">Storage</span>
                        <span className="text-purple-400">{realTimeData.storage.toFixed(1)} GW</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${(realTimeData.storage / 0.6) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Node Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'Generator Nodes', count: 12, status: 'online', color: 'text-green-400' },
                      { name: 'Consumer Nodes', count: 28, status: 'active', color: 'text-blue-400' },
                      { name: 'Storage Nodes', count: 8, status: 'charging', color: 'text-purple-400' },
                      { name: 'Maintenance', count: 2, status: 'offline', color: 'text-yellow-400' }
                    ].map((node, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${node.color.replace('text-', 'bg-')}`}></div>
                          <span className="text-white text-sm">{node.name}</span>
                        </div>
                        <div className="text-right">
                          <div className={`${node.color} font-semibold text-sm`}>{node.count}</div>
                          <div className="text-white/60 text-xs capitalize">{node.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3D Energy Grid Visualization */}
            <div className="xl:col-span-2 bg-black/20 rounded-xl overflow-hidden relative">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <i className="fas fa-project-diagram text-blue-400"></i>
                  Interactive Energy Grid 3D
                </h3>
                <p className="text-white/60 text-sm">Real-time energy distribution network visualization</p>
              </div>
              <div className="h-[600px] relative">
                <CinematicVisualization type="energy" className="w-full h-full" />

                {/* Grid Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <i className="fas fa-expand mr-2"></i>
                    Fullscreen
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Settings
                  </Button>
                </div>

                {/* Real-time Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                      <div className="text-green-400 font-semibold">{realTimeData.efficiency.toFixed(1)}%</div>
                      <div className="text-white/70">Efficiency</div>
                    </div>
                    <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                      <div className="text-blue-400 font-semibold">{realTimeData.load.toFixed(1)} GW</div>
                      <div className="text-white/70">Load</div>
                    </div>
                    <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                      <div className="text-yellow-400 font-semibold">{realTimeData.nodes}</div>
                      <div className="text-white/70">Nodes</div>
                    </div>
                    <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                      <div className="text-purple-400 font-semibold">{realTimeData.response.toFixed(0)}ms</div>
                      <div className="text-white/70">Response</div>
                    </div>
                    <div className="bg-black/80 p-2 rounded text-center backdrop-blur-sm">
                      <div className="text-orange-400 font-semibold">Live</div>
                      <div className="text-white/70">Status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'climate' && (
          <ClimateImpactDashboard
            climateData={climateData}
            emissionSources={emissionSources}
            show3DParticles={show3DParticles}
            onToggleParticles={setShow3DParticles}
          />
        )}
        
        {activeView === '3d-city' && <CityVisualization />}

        {activeView === '3d-visualizations' && (
          <div className="h-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-full">
              {/* Energy 3D Visualization */}
              <div className="bg-black/20 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <i className="fas fa-bolt text-blue-400"></i>
                    Energy Grid 3D
                  </h3>
                  <p className="text-white/60 text-sm">Interactive energy distribution network</p>
                </div>
                <div className="h-80">
                  <CinematicVisualization type="energy" className="w-full h-full" />
                </div>
              </div>

              {/* Climate 3D Visualization */}
              <div className="bg-black/20 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <i className="fas fa-thermometer-half text-red-400"></i>
                    Climate Heatmap 3D
                  </h3>
                  <p className="text-white/60 text-sm">Environmental impact visualization</p>
                </div>
                <div className="h-80">
                  <CinematicVisualization type="climate" className="w-full h-full" />
                </div>
              </div>

              {/* City 3D Visualization */}
              <div className="bg-black/20 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <i className="fas fa-city text-green-400"></i>
                    Smart City 3D
                  </h3>
                  <p className="text-white/60 text-sm">Urban infrastructure modeling</p>
                </div>
                <div className="h-80">
                  <CinematicVisualization type="city" className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Additional 3D Info Panel */}
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-400"></i>
                3D Visualization Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-500/20 p-3 rounded">
                  <div className="text-blue-400 font-semibold mb-1">Zoom-Proof Design</div>
                  <div className="text-white/70">Camera locked to prevent auto-zoom issues</div>
                </div>
                <div className="bg-green-500/20 p-3 rounded">
                  <div className="text-green-400 font-semibold mb-1">Static Rendering</div>
                  <div className="text-white/70">Optimized for stable viewing experience</div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded">
                  <div className="text-purple-400 font-semibold mb-1">Real-time Data</div>
                  <div className="text-white/70">Connected to live data streams</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <AdvancedDataVisualization
            energyData={energyData}
            climateData={climateData}
            algorithmResults={{
              energyFlow: energyFlowResults,
              climateScore: climateScoreResults,
              vulnerability: vulnerabilityResults
            }}
          />
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 mb-2"
        >
          <i className="fas fa-chevron-down text-white/70 text-lg"></i>
        </motion.div>
        <p className="text-white/60 text-sm">Scroll to explore more</p>
      </motion.div>

      {/* Extended content for scrolling */}
      <div className="h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl max-w-2xl mx-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🌍 Climate Action Hub</h3>
          <p className="text-white/80 mb-6">
            Explore comprehensive sustainability solutions, track environmental impact,
            and connect with green job opportunities in your area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <i className="fas fa-leaf text-green-400 text-2xl mb-2"></i>
              <h4 className="text-white font-semibold">Green Jobs</h4>
              <p className="text-white/70 text-sm">Find sustainable careers</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <i className="fas fa-globe text-blue-400 text-2xl mb-2"></i>
              <h4 className="text-white font-semibold">Climate Data</h4>
              <p className="text-white/70 text-sm">Real-time monitoring</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <i className="fas fa-users text-purple-400 text-2xl mb-2"></i>
              <h4 className="text-white font-semibold">Community</h4>
              <p className="text-white/70 text-sm">Connect & collaborate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-screen bg-gradient-to-b from-transparent via-blue-900/20 to-purple-900/20 rounded-xl mb-6 flex items-center justify-center">
        <div className="glass p-8 rounded-2xl max-w-2xl mx-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🚀 AI-Powered Insights</h3>
          <p className="text-white/80 mb-6">
            Our advanced AI algorithms analyze environmental data to provide
            personalized recommendations for sustainable living and climate action.
          </p>
          <div className="bg-white/10 p-6 rounded-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <i className="fas fa-brain text-white text-2xl"></i>
              </div>
            </div>
            <h4 className="text-white font-semibold mb-2">Smart Recommendations</h4>
            <p className="text-white/70">Get personalized climate action suggestions based on your location and lifestyle</p>
          </div>
        </div>
      </div>

      <div className="h-screen bg-gradient-to-b from-purple-900/20 via-pink-900/20 to-transparent rounded-xl mb-6 flex items-center justify-center">
        <div className="glass p-8 rounded-2xl max-w-2xl mx-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">📊 Impact Tracking</h3>
          <p className="text-white/80 mb-6">
            Monitor your environmental impact and see how your actions contribute
            to global sustainability goals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30">
              <h4 className="text-green-400 font-semibold text-lg">Carbon Saved</h4>
              <p className="text-white text-2xl font-bold">2.4 tons</p>
            </div>
            <div className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
              <h4 className="text-blue-400 font-semibold text-lg">Energy Saved</h4>
              <p className="text-white text-2xl font-bold">1,250 kWh</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-white/50">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <i className="fas fa-arrow-up text-2xl mb-2"></i>
          </motion.div>
          <p>Scroll up to return to dashboard</p>
          <p className="text-xs mt-2 text-white/30">Use the scrollbar on the right for quick navigation</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedMainDashboard;