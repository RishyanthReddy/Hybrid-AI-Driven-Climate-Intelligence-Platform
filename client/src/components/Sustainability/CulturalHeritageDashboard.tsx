import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Globe, 
  Users, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Video, 
  FileText, 
  Music,
  Palette,
  Heart,
  MapPin,
  Calendar,
  TrendingDown,
  TrendingUp,
  Shield
} from 'lucide-react';

interface CulturalPractice {
  id: number;
  name: string;
  originRegion: string;
  culturalSignificance: string;
  preservationStatus: 'thriving' | 'stable' | 'vulnerable' | 'endangered' | 'extinct';
  associatedSkills: string[];
  knowledgeHolders: {
    name: string;
    age: number;
    location: string;
    expertise: string;
  }[];
  documentation: {
    images: number;
    videos: number;
    texts: number;
    audio: number;
  };
  threatLevel: number; // 0-100
  urgencyScore: number;
  timeToExtinction: number; // years
  conservationEfforts: {
    organization: string;
    effort: string;
    status: string;
    funding: number;
  }[];
}

const CulturalHeritageDashboard: React.FC = () => {
  const [practices, setPractices] = useState<CulturalPractice[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<CulturalPractice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockPractices: CulturalPractice[] = [
      {
        id: 1,
        name: 'Traditional Bamboo Weaving',
        originRegion: 'Southeast Asia',
        culturalSignificance: 'Ancient craft passed down through generations, essential for community identity',
        preservationStatus: 'vulnerable',
        associatedSkills: ['Bamboo harvesting', 'Pattern design', 'Natural dyeing', 'Tool making'],
        knowledgeHolders: [
          { name: 'Master Chen Wei', age: 78, location: 'Rural Vietnam', expertise: 'Master weaver' },
          { name: 'Grandmother Liu', age: 82, location: 'Southern China', expertise: 'Pattern keeper' },
          { name: 'Artisan Nguyen', age: 65, location: 'Northern Thailand', expertise: 'Tool maker' }
        ],
        documentation: {
          images: 45,
          videos: 8,
          texts: 12,
          audio: 15
        },
        threatLevel: 75,
        urgencyScore: 82,
        timeToExtinction: 15,
        conservationEfforts: [
          {
            organization: 'UNESCO Heritage Foundation',
            effort: 'Documentation Project',
            status: 'active',
            funding: 50000
          },
          {
            organization: 'Local Cultural Center',
            effort: 'Youth Training Program',
            status: 'planning',
            funding: 25000
          }
        ]
      },
      {
        id: 2,
        name: 'Indigenous Storytelling Traditions',
        originRegion: 'North America',
        culturalSignificance: 'Oral tradition preserving history, values, and ecological knowledge',
        preservationStatus: 'endangered',
        associatedSkills: ['Oral narration', 'Memory techniques', 'Cultural interpretation', 'Language preservation'],
        knowledgeHolders: [
          { name: 'Elder Sarah Crow Feather', age: 89, location: 'Montana, USA', expertise: 'Story keeper' },
          { name: 'Joseph Running Bear', age: 71, location: 'Alberta, Canada', expertise: 'Language teacher' }
        ],
        documentation: {
          images: 23,
          videos: 15,
          texts: 8,
          audio: 45
        },
        threatLevel: 90,
        urgencyScore: 95,
        timeToExtinction: 8,
        conservationEfforts: [
          {
            organization: 'First Nations Cultural Society',
            effort: 'Digital Archive Creation',
            status: 'active',
            funding: 75000
          }
        ]
      },
      {
        id: 3,
        name: 'Traditional Pottery Techniques',
        originRegion: 'Mediterranean',
        culturalSignificance: 'Ancient ceramic traditions with unique firing and glazing methods',
        preservationStatus: 'stable',
        associatedSkills: ['Clay preparation', 'Wheel throwing', 'Natural glazing', 'Kiln firing'],
        knowledgeHolders: [
          { name: 'Master Dimitri Kostas', age: 67, location: 'Crete, Greece', expertise: 'Master potter' },
          { name: 'Maria Santos', age: 59, location: 'Valencia, Spain', expertise: 'Glaze specialist' },
          { name: 'Antonio Rossi', age: 72, location: 'Tuscany, Italy', expertise: 'Kiln master' }
        ],
        documentation: {
          images: 67,
          videos: 22,
          texts: 18,
          audio: 12
        },
        threatLevel: 45,
        urgencyScore: 38,
        timeToExtinction: 35,
        conservationEfforts: [
          {
            organization: 'Mediterranean Craft Alliance',
            effort: 'Apprenticeship Program',
            status: 'active',
            funding: 40000
          },
          {
            organization: 'European Heritage Fund',
            effort: 'Workshop Documentation',
            status: 'completed',
            funding: 30000
          }
        ]
      }
    ];

    setTimeout(() => {
      setPractices(mockPractices);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'bg-green-100 text-green-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      case 'vulnerable': return 'bg-yellow-100 text-yellow-800';
      case 'endangered': return 'bg-red-100 text-red-800';
      case 'extinct': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getThreatIcon = (level: number) => {
    if (level >= 80) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (level >= 60) return <TrendingDown className="h-5 w-5 text-orange-500" />;
    if (level >= 40) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Shield className="h-5 w-5 text-green-500" />;
  };

  const filteredPractices = practices.filter(practice => 
    filterStatus === 'all' || practice.preservationStatus === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cultural Heritage Preservation
          </h1>
          <p className="text-lg text-gray-600">
            Protecting and preserving cultural practices for future generations
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Practices</p>
                  <p className="text-2xl font-bold text-gray-900">{practices.length}</p>
                </div>
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Knowledge Holders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {practices.reduce((sum, p) => sum + p.knowledgeHolders.length, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Endangered</p>
                  <p className="text-2xl font-bold text-red-600">
                    {practices.filter(p => p.preservationStatus === 'endangered').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Documentation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(practices.reduce((sum, p) => 
                      sum + p.documentation.images + p.documentation.videos + 
                      p.documentation.texts + p.documentation.audio, 0) / practices.length)}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {['all', 'thriving', 'stable', 'vulnerable', 'endangered'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status === 'all' ? 'All Practices' : status}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Practices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPractices.map((practice, index) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedPractice(practice)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{practice.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{practice.originRegion}</span>
                      </div>
                    </div>
                    {getThreatIcon(practice.threatLevel)}
                  </div>
                  <Badge className={getStatusColor(practice.preservationStatus)}>
                    {practice.preservationStatus}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Urgency Score */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Urgency Score</span>
                        <span className={`text-sm font-bold ${getUrgencyColor(practice.urgencyScore)}`}>
                          {practice.urgencyScore}%
                        </span>
                      </div>
                      <Progress value={practice.urgencyScore} className="h-2" />
                    </div>

                    {/* Time to Extinction */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Est. Time to Extinction</span>
                      <span className="text-sm font-medium">
                        {practice.timeToExtinction} years
                      </span>
                    </div>

                    {/* Knowledge Holders */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Knowledge Holders</span>
                      <span className="text-sm font-medium">
                        {practice.knowledgeHolders.length} people
                      </span>
                    </div>

                    {/* Documentation Status */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <Camera className="h-4 w-4 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">{practice.documentation.images}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Video className="h-4 w-4 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">{practice.documentation.videos}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <FileText className="h-4 w-4 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">{practice.documentation.texts}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Music className="h-4 w-4 text-gray-500 mb-1" />
                        <span className="text-xs text-gray-600">{practice.documentation.audio}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Associated Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {practice.associatedSkills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {practice.associatedSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{practice.associatedSkills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Conservation Efforts */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Active Efforts:</p>
                      <p className="text-sm font-medium">
                        {practice.conservationEfforts.length} conservation project{practice.conservationEfforts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed View Modal */}
        {selectedPractice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPractice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPractice.name}
                    </h2>
                    <p className="text-gray-600">{selectedPractice.culturalSignificance}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedPractice(null)}>
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Knowledge Holders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Knowledge Holders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPractice.knowledgeHolders.map((holder, index) => (
                          <div key={index} className="border-l-4 border-purple-500 pl-3">
                            <p className="font-medium">{holder.name}</p>
                            <p className="text-sm text-gray-600">Age: {holder.age}</p>
                            <p className="text-sm text-gray-600">{holder.location}</p>
                            <p className="text-sm text-purple-600">{holder.expertise}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conservation Efforts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Conservation Efforts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPractice.conservationEfforts.map((effort, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-3">
                            <p className="font-medium">{effort.effort}</p>
                            <p className="text-sm text-gray-600">{effort.organization}</p>
                            <div className="flex items-center justify-between mt-1">
                              <Badge className={effort.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {effort.status}
                              </Badge>
                              <span className="text-sm font-medium">${effort.funding.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button className="flex-1">
                    Support This Practice
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Additional Content Sections for Scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-12"
        >
          {/* Cultural Impact Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cultural Impact & Preservation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">🎭 Traditional Arts</h3>
                <p className="text-gray-700 mb-4">
                  Preserving ancient artistic traditions through digital documentation and community workshops.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documentation Progress</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">🗣️ Language Heritage</h3>
                <p className="text-gray-700 mb-4">
                  Protecting endangered languages through immersive learning programs and digital archives.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Languages Documented</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🌿 Traditional Knowledge</h3>
                <p className="text-gray-700 mb-4">
                  Safeguarding indigenous knowledge systems and sustainable practices for future generations.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Knowledge Systems</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Initiatives Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Preservation Initiatives</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-3">🌍 UNESCO Partnership</h3>
                  <p className="text-gray-700 mb-4">
                    Collaborating with UNESCO to identify and protect intangible cultural heritage worldwide.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">247</div>
                      <div className="text-sm text-gray-600">Sites Protected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">89</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">🤝 Community Engagement</h3>
                  <p className="text-gray-700 mb-4">
                    Empowering local communities to lead preservation efforts and share their cultural wealth.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12,450</div>
                      <div className="text-sm text-gray-600">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">1,890</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Preservation Impact</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Cultural Practices Documented</span>
                      <span className="text-sm text-gray-600">2,847</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Digital Archives Created</span>
                      <span className="text-sm text-gray-600">1,456</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Community Workshops</span>
                      <span className="text-sm text-gray-600">3,291</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Cultural Preservation Movement</h2>
            <p className="text-xl mb-6 opacity-90">
              Help us protect and preserve cultural heritage for future generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Become a Volunteer
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Support a Project
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

export default CulturalHeritageDashboard;
