import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building, 
  PieChart, 
  BarChart3,
  Eye,
  Shield,
  Target,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Equal
} from 'lucide-react';

interface SupplyChainEntity {
  id: string;
  name: string;
  role: string;
  location: string;
  size: string;
  currentShare: number;
  fairShare: number;
  transparencyScore: number;
}

interface EquityMetrics {
  overallEquityScore: number;
  wageTransparencyScore: number;
  profitDistributionScore: number;
  communityImpactScore: number;
  genderPayGap: number;
  diversityIndex: number;
  localSupplierPercentage: number;
}

interface ProfitDistribution {
  stakeholder: string;
  currentAmount: number;
  optimizedAmount: number;
  percentage: number;
  change: number;
}

const EconomicEquityDashboard: React.FC = () => {
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainEntity[]>([]);
  const [equityMetrics, setEquityMetrics] = useState<EquityMetrics | null>(null);
  const [profitDistribution, setProfitDistribution] = useState<ProfitDistribution[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'transparency' | 'distribution' | 'impact'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockSupplyChain: SupplyChainEntity[] = [
      {
        id: '1',
        name: 'GreenTech Manufacturing',
        role: 'Primary Manufacturer',
        location: 'Vietnam',
        size: 'Large',
        currentShare: 35,
        fairShare: 42,
        transparencyScore: 78
      },
      {
        id: '2',
        name: 'EcoMaterials Supplier',
        role: 'Raw Materials',
        location: 'Indonesia',
        size: 'Medium',
        currentShare: 20,
        fairShare: 25,
        transparencyScore: 65
      },
      {
        id: '3',
        name: 'Sustainable Logistics',
        role: 'Distribution',
        location: 'Thailand',
        size: 'Medium',
        currentShare: 15,
        fairShare: 18,
        transparencyScore: 82
      },
      {
        id: '4',
        name: 'Local Community Coop',
        role: 'Local Supplier',
        location: 'Philippines',
        size: 'Small',
        currentShare: 8,
        fairShare: 12,
        transparencyScore: 45
      }
    ];

    const mockEquityMetrics: EquityMetrics = {
      overallEquityScore: 72,
      wageTransparencyScore: 68,
      profitDistributionScore: 75,
      communityImpactScore: 82,
      genderPayGap: 12, // percentage
      diversityIndex: 0.78,
      localSupplierPercentage: 35
    };

    const mockProfitDistribution: ProfitDistribution[] = [
      {
        stakeholder: 'Employees',
        currentAmount: 2800000,
        optimizedAmount: 3200000,
        percentage: 40,
        change: 14.3
      },
      {
        stakeholder: 'Suppliers',
        currentAmount: 2000000,
        optimizedAmount: 2200000,
        percentage: 27.5,
        change: 10.0
      },
      {
        stakeholder: 'Shareholders',
        currentAmount: 2400000,
        optimizedAmount: 2000000,
        percentage: 25,
        change: -16.7
      },
      {
        stakeholder: 'Community',
        currentAmount: 400000,
        optimizedAmount: 600000,
        percentage: 7.5,
        change: 50.0
      }
    ];

    setTimeout(() => {
      setSupplyChainData(mockSupplyChain);
      setEquityMetrics(mockEquityMetrics);
      setProfitDistribution(mockProfitDistribution);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[200vh] bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Economic Equity Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Promoting fair profit distribution and transparent supply chains
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'transparency', label: 'Transparency', icon: Eye },
              { key: 'distribution', label: 'Profit Distribution', icon: PieChart },
              { key: 'impact', label: 'Community Impact', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={selectedView === key ? 'default' : 'outline'}
                onClick={() => setSelectedView(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Overview Section */}
        {selectedView === 'overview' && equityMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Equity Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(equityMetrics.overallEquityScore)}`}>
                        {equityMetrics.overallEquityScore}%
                      </p>
                    </div>
                    <Equal className="h-8 w-8 text-blue-600" />
                  </div>
                  <Progress value={equityMetrics.overallEquityScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Wage Transparency</p>
                      <p className={`text-2xl font-bold ${getScoreColor(equityMetrics.wageTransparencyScore)}`}>
                        {equityMetrics.wageTransparencyScore}%
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <Progress value={equityMetrics.wageTransparencyScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gender Pay Gap</p>
                      <p className={`text-2xl font-bold ${equityMetrics.genderPayGap <= 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {equityMetrics.genderPayGap}%
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: ≤5%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Local Suppliers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {equityMetrics.localSupplierPercentage}%
                      </p>
                    </div>
                    <Globe className="h-8 w-8 text-orange-600" />
                  </div>
                  <Progress value={equityMetrics.localSupplierPercentage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Supply Chain Equity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Supply Chain Equity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplyChainData.map((entity, index) => (
                    <motion.div
                      key={entity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{entity.name}</h4>
                          <p className="text-sm text-gray-600">{entity.role} • {entity.location}</p>
                        </div>
                        <Badge variant="outline" className={entity.size === 'Large' ? 'border-blue-500' : entity.size === 'Medium' ? 'border-yellow-500' : 'border-green-500'}>
                          {entity.size}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Current Share</p>
                          <div className="flex items-center gap-2">
                            <Progress value={entity.currentShare} className="flex-1" />
                            <span className="text-sm font-medium">{entity.currentShare}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Fair Share Target</p>
                          <div className="flex items-center gap-2">
                            <Progress value={entity.fairShare} className="flex-1" />
                            <span className="text-sm font-medium">{entity.fairShare}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Transparency Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={entity.transparencyScore} className="flex-1" />
                            <span className={`text-sm font-medium ${getScoreColor(entity.transparencyScore)}`}>
                              {entity.transparencyScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        {entity.currentShare < entity.fairShare ? (
                          <>
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">
                              Recommended increase: +{(entity.fairShare - entity.currentShare).toFixed(1)}%
                            </span>
                          </>
                        ) : entity.currentShare > entity.fairShare ? (
                          <>
                            <ArrowDownRight className="h-4 w-4 text-orange-600" />
                            <span className="text-sm text-orange-600">
                              Potential adjustment: {(entity.fairShare - entity.currentShare).toFixed(1)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Optimal distribution achieved</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Profit Distribution Section */}
        {selectedView === 'distribution' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Optimized Profit Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current vs Optimized */}
                  <div className="space-y-4">
                    {profitDistribution.map((item, index) => (
                      <motion.div
                        key={item.stakeholder}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.stakeholder}</h4>
                          <div className="flex items-center gap-2">
                            {item.change > 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : item.change < 0 ? (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            ) : (
                              <Target className="h-4 w-4 text-gray-600" />
                            )}
                            <span className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                              {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Current</span>
                            <span className="font-medium">{formatCurrency(item.currentAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Optimized</span>
                            <span className="font-medium text-blue-600">{formatCurrency(item.optimizedAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Share</span>
                            <span className="font-medium">{item.percentage}%</span>
                          </div>
                        </div>

                        <Progress value={item.percentage} className="mt-3" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Impact Summary */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Expected Impact</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Jobs Created</span>
                          <span className="font-medium text-green-600">+125 positions</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Average Wage Increase</span>
                          <span className="font-medium text-green-600">+14.3%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Community Investment</span>
                          <span className="font-medium text-green-600">+$200,000</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Local Supplier Support</span>
                          <span className="font-medium text-green-600">+15 businesses</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Implementation Time</span>
                          <span className="font-medium text-blue-600">6-8 months</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Low Implementation Risk</p>
                            <p className="text-xs text-gray-600">Gradual transition plan available</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="text-sm font-medium">Moderate Stakeholder Resistance</p>
                            <p className="text-xs text-gray-600">Shareholder engagement required</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">High Long-term Benefits</p>
                            <p className="text-xs text-gray-600">Improved sustainability and retention</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button className="flex-1">
                    Implement Distribution Plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Button size="lg" className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Equity Targets
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transparency Report
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </Button>
        </motion.div>

        {/* Additional Content Sections for Scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-12"
        >
          {/* Economic Impact Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Economic Impact & Sustainability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">💰 Fair Wage Initiative</h3>
                <p className="text-gray-700 mb-4">
                  Implementing living wage standards across all supply chain partners and stakeholders.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Implementation Progress</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🤝 Supplier Equity</h3>
                <p className="text-gray-700 mb-4">
                  Supporting small and local suppliers through fair payment terms and capacity building.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Local Suppliers</span>
                    <span className="text-sm font-medium">127</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">🌍 Community Investment</h3>
                <p className="text-gray-700 mb-4">
                  Reinvesting profits into local communities through education, infrastructure, and development.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Investment Amount</span>
                    <span className="text-sm font-medium">$2.4M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices & Guidelines</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-3">📊 Transparency Standards</h3>
                  <p className="text-gray-700 mb-4">
                    Implementing comprehensive reporting and disclosure practices for all financial distributions.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">95%</div>
                      <div className="text-sm text-gray-600">Disclosure Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-600">Data Access</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">⚖️ Equity Metrics</h3>
                  <p className="text-gray-700 mb-4">
                    Tracking and measuring fairness across all stakeholder relationships and transactions.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">8.2</div>
                      <div className="text-sm text-gray-600">Equity Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">+15%</div>
                      <div className="text-sm text-gray-600">Improvement</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Key Performance Indicators</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Stakeholder Satisfaction</span>
                      <span className="text-sm text-gray-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Payment Timeliness</span>
                      <span className="text-sm text-gray-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Diversity & Inclusion</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Environmental Impact</span>
                      <span className="text-sm text-gray-600">91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Transform Your Economic Impact</h2>
            <p className="text-xl mb-6 opacity-90">
              Join the movement towards equitable profit distribution and transparent business practices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Start Assessment
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </motion.div>

        {/* Extra spacing for scrolling */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default EconomicEquityDashboard;
