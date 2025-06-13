import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Leaf,
  Star,
  Filter,
  Heart,
  Share2
} from 'lucide-react';

interface SustainableJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salaryRange: { min: number; max: number };
  jobType: 'remote' | 'hybrid' | 'onsite';
  sustainabilityScore: number;
  skills: string[];
  sector: string;
  description: string;
  postedDate: string;
  applicants: number;
  matchScore?: number;
}

interface JobFilters {
  location: string;
  salaryMin: number;
  salaryMax: number;
  jobType: string;
  sector: string;
  sustainabilityMin: number;
}

const JobMarketplaceDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<SustainableJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SustainableJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<JobFilters>({
    location: '',
    salaryMin: 0,
    salaryMax: 200000,
    jobType: '',
    sector: '',
    sustainabilityMin: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockJobs: SustainableJob[] = [
      {
        id: 1,
        title: 'Senior Renewable Energy Engineer',
        company: 'GreenTech Solutions',
        location: 'San Francisco, CA',
        salaryRange: { min: 90000, max: 130000 },
        jobType: 'hybrid',
        sustainabilityScore: 0.95,
        skills: ['Solar Power', 'Wind Energy', 'Project Management', 'Python'],
        sector: 'Renewable Energy',
        description: 'Lead the development of innovative renewable energy solutions...',
        postedDate: '2024-01-15',
        applicants: 45,
        matchScore: 0.92
      },
      {
        id: 2,
        title: 'Sustainability Data Analyst',
        company: 'EcoMetrics Inc',
        location: 'Remote',
        salaryRange: { min: 65000, max: 85000 },
        jobType: 'remote',
        sustainabilityScore: 0.88,
        skills: ['Data Analysis', 'Python', 'Sustainability Reporting', 'SQL'],
        sector: 'Environmental Consulting',
        description: 'Analyze environmental data to drive sustainability initiatives...',
        postedDate: '2024-01-14',
        applicants: 32,
        matchScore: 0.87
      },
      {
        id: 3,
        title: 'Green Building Architect',
        company: 'Sustainable Structures',
        location: 'Seattle, WA',
        salaryRange: { min: 75000, max: 110000 },
        jobType: 'onsite',
        sustainabilityScore: 0.91,
        skills: ['LEED Certification', 'AutoCAD', 'Sustainable Design', 'Project Management'],
        sector: 'Green Construction',
        description: 'Design environmentally responsible and resource-efficient buildings...',
        postedDate: '2024-01-13',
        applicants: 28,
        matchScore: 0.79
      }
    ];

    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = !filters.location || 
                             job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesSalary = job.salaryRange.max >= filters.salaryMin && 
                           job.salaryRange.min <= filters.salaryMax;
      
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
      
      const matchesSector = !filters.sector || job.sector === filters.sector;
      
      const matchesSustainability = job.sustainabilityScore >= filters.sustainabilityMin / 100;

      return matchesSearch && matchesLocation && matchesSalary && 
             matchesJobType && matchesSector && matchesSustainability;
    });

    // Sort by match score if available, then by sustainability score
    filtered.sort((a, b) => {
      if (a.matchScore && b.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.sustainabilityScore - a.sustainabilityScore;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filters]);

  const handleSaveJob = (jobId: number) => {
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getJobTypeIcon = (type: string) => {
    switch (type) {
      case 'remote': return '🏠';
      case 'hybrid': return '🔄';
      case 'onsite': return '🏢';
      default: return '💼';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[200vh] bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sustainable Jobs Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Find meaningful work that creates positive impact for people and planet
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  <Input
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Min Salary"
                    value={filters.salaryMin || ''}
                    onChange={(e) => setFilters({...filters, salaryMin: Number(e.target.value)})}
                  />
                  <Input
                    type="number"
                    placeholder="Max Salary"
                    value={filters.salaryMax || ''}
                    onChange={(e) => setFilters({...filters, salaryMax: Number(e.target.value)})}
                  />
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={filters.jobType}
                    onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                  >
                    <option value="">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={filters.sector}
                    onChange={(e) => setFilters({...filters, sector: e.target.value})}
                  >
                    <option value="">All Sectors</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Environmental Consulting">Environmental Consulting</option>
                    <option value="Green Construction">Green Construction</option>
                  </select>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Min Sustainability</label>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.sustainabilityMin}
                      onChange={(e) => setFilters({...filters, sustainabilityMin: Number(e.target.value)})}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{filters.sustainabilityMin}%</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found {filteredJobs.length} sustainable job{filteredJobs.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                Sustainability Focused
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                AI Matched
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-lg text-gray-700 font-medium">
                            {job.company}
                          </p>
                        </div>
                        {job.matchScore && (
                          <Badge className="bg-green-100 text-green-800">
                            {Math.round(job.matchScore * 100)}% Match
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salaryRange.min, job.salaryRange.max)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {getJobTypeIcon(job.jobType)} {job.jobType}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.applicants} applicants
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Sustainability Score</span>
                          <span className={`text-sm font-bold ${getSustainabilityColor(job.sustainabilityScore)}`}>
                            {Math.round(job.sustainabilityScore * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={job.sustainabilityScore * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.skills.slice(0, 4).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 4 && (
                          <Badge variant="outline">
                            +{job.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-6">
                      <Button className="w-full lg:w-auto">
                        Apply Now
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          className={savedJobs.has(job.id) ? 'text-red-600' : ''}
                        >
                          <Heart className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Briefcase className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}

        {/* Additional Content Sections for Scrolling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-12"
        >
          {/* Career Development Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Career Development & Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">🌱 Green Skills Training</h3>
                <p className="text-gray-700 mb-4">
                  Develop expertise in renewable energy, sustainable agriculture, and environmental management.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Courses Available</span>
                    <span className="text-sm font-medium">247</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">💼 Career Coaching</h3>
                <p className="text-gray-700 mb-4">
                  Get personalized guidance from sustainability professionals and industry experts.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Mentors</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">🎯 Impact Tracking</h3>
                <p className="text-gray-700 mb-4">
                  Monitor your career's environmental and social impact with detailed analytics.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Impact Score</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Insights Section */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Industry Insights & Trends</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">📈 Market Growth</h3>
                  <p className="text-gray-700 mb-4">
                    The green economy is expanding rapidly, with sustainable jobs growing 3x faster than traditional roles.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.4M</div>
                      <div className="text-sm text-gray-600">New Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+34%</div>
                      <div className="text-sm text-gray-600">Growth Rate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">💰 Salary Trends</h3>
                  <p className="text-gray-700 mb-4">
                    Sustainable roles offer competitive compensation with strong growth potential.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$78K</div>
                      <div className="text-sm text-gray-600">Avg. Salary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+12%</div>
                      <div className="text-sm text-gray-600">YoY Increase</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">🔥 Hot Skills in Demand</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Renewable Energy Systems</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Environmental Data Analysis</span>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Sustainable Supply Chain</span>
                      <span className="text-sm text-gray-600">82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Carbon Footprint Management</span>
                      <span className="text-sm text-gray-600">76%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Sustainable Career?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of professionals making a positive impact through meaningful work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Create Job Alert
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Upload Resume
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

export default JobMarketplaceDashboard;
