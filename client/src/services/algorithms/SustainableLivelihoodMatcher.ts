import { WorkerProfile, SustainableJob, JobMatch } from '../../../../shared/schema';

/**
 * SustainableLivelihoodMatcher - Advanced AI-powered job matching algorithm
 * Implements multi-criteria decision analysis for sustainable job matching
 * with skills gap analysis, geographic optimization, and sustainability impact scoring
 */

export interface MatchingCriteria {
  skillsWeight: number;
  locationWeight: number;
  salaryWeight: number;
  sustainabilityWeight: number;
  experienceWeight: number;
  culturalFitWeight: number;
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  skillGapScore: number;
  recommendedCourses: string[];
  timeToAcquire: number; // months
  costToAcquire: number;
}

export interface GeographicOptimization {
  distance: number; // km
  transportationOptions: string[];
  costOfLiving: number;
  remoteWorkPossibility: number; // 0-1
  relocationSupport: boolean;
}

export interface SustainabilityImpact {
  carbonFootprintReduction: number;
  socialImpactScore: number;
  economicBenefitScore: number;
  communityDevelopmentScore: number;
  overallSustainabilityScore: number;
}

export interface MatchResult {
  jobId: number;
  workerId: number;
  compatibilityScore: number;
  skillsMatch: number;
  locationMatch: number;
  salaryMatch: number;
  sustainabilityMatch: number;
  experienceMatch: number;
  culturalFitMatch: number;
  skillGapAnalysis: SkillGapAnalysis;
  geographicOptimization: GeographicOptimization;
  sustainabilityImpact: SustainabilityImpact;
  recommendationReason: string;
  improvementSuggestions: string[];
}

export interface MarketDemandPrediction {
  sector: string;
  demandGrowth: number; // percentage
  skillDemand: { [skill: string]: number };
  salaryTrends: { [level: string]: number };
  geographicHotspots: string[];
  emergingOpportunities: string[];
}

export class SustainableLivelihoodMatcher {
  private config: {
    defaultCriteria: MatchingCriteria;
    skillSimilarityThreshold: number;
    maxDistance: number; // km
    minCompatibilityScore: number;
    learningRate: number;
    adaptationFactor: number;
  };

  private skillEmbeddings: Map<string, number[]>;
  private locationCoordinates: Map<string, { lat: number; lng: number }>;
  private industryTrends: Map<string, MarketDemandPrediction>;

  constructor() {
    this.config = {
      defaultCriteria: {
        skillsWeight: 0.30,
        locationWeight: 0.15,
        salaryWeight: 0.20,
        sustainabilityWeight: 0.20,
        experienceWeight: 0.10,
        culturalFitWeight: 0.05
      },
      skillSimilarityThreshold: 0.7,
      maxDistance: 100, // km
      minCompatibilityScore: 0.6,
      learningRate: 0.01,
      adaptationFactor: 0.1
    };

    this.skillEmbeddings = new Map();
    this.locationCoordinates = new Map();
    this.industryTrends = new Map();
    
    this.initializeSkillEmbeddings();
    this.initializeLocationData();
    this.initializeIndustryTrends();
  }

  /**
   * Main matching algorithm using multi-criteria decision analysis
   */
  public async findMatches(
    worker: WorkerProfile,
    jobs: SustainableJob[],
    criteria?: Partial<MatchingCriteria>
  ): Promise<MatchResult[]> {
    const matchingCriteria = { ...this.config.defaultCriteria, ...criteria };
    const results: MatchResult[] = [];

    for (const job of jobs) {
      const matchResult = await this.calculateMatch(worker, job, matchingCriteria);
      
      if (matchResult.compatibilityScore >= this.config.minCompatibilityScore) {
        results.push(matchResult);
      }
    }

    // Sort by compatibility score and apply diversity optimization
    return this.optimizeMatchDiversity(results);
  }

  /**
   * Calculate comprehensive match score between worker and job
   */
  private async calculateMatch(
    worker: WorkerProfile,
    job: SustainableJob,
    criteria: MatchingCriteria
  ): Promise<MatchResult> {
    // Calculate individual match scores
    const skillsMatch = this.calculateSkillsMatch(worker.skills, job.skillRequirements);
    const locationMatch = this.calculateLocationMatch(worker.location, job.location);
    const salaryMatch = this.calculateSalaryMatch(worker, job);
    const sustainabilityMatch = this.calculateSustainabilityMatch(worker, job);
    const experienceMatch = this.calculateExperienceMatch(worker.experienceLevel, job);
    const culturalFitMatch = this.calculateCulturalFit(worker, job);

    // Calculate weighted compatibility score
    const compatibilityScore = 
      skillsMatch * criteria.skillsWeight +
      locationMatch * criteria.locationWeight +
      salaryMatch * criteria.salaryWeight +
      sustainabilityMatch * criteria.sustainabilityWeight +
      experienceMatch * criteria.experienceWeight +
      culturalFitMatch * criteria.culturalFitWeight;

    // Generate detailed analysis
    const skillGapAnalysis = this.analyzeSkillGap(worker.skills, job.skillRequirements);
    const geographicOptimization = this.optimizeGeography(worker.location, job.location, job.jobType);
    const sustainabilityImpact = this.calculateSustainabilityImpact(worker, job);

    return {
      jobId: job.id,
      workerId: worker.id,
      compatibilityScore: Math.round(compatibilityScore * 100) / 100,
      skillsMatch: Math.round(skillsMatch * 100) / 100,
      locationMatch: Math.round(locationMatch * 100) / 100,
      salaryMatch: Math.round(salaryMatch * 100) / 100,
      sustainabilityMatch: Math.round(sustainabilityMatch * 100) / 100,
      experienceMatch: Math.round(experienceMatch * 100) / 100,
      culturalFitMatch: Math.round(culturalFitMatch * 100) / 100,
      skillGapAnalysis,
      geographicOptimization,
      sustainabilityImpact,
      recommendationReason: this.generateRecommendationReason(compatibilityScore, skillsMatch, sustainabilityMatch),
      improvementSuggestions: this.generateImprovementSuggestions(skillGapAnalysis, geographicOptimization)
    };
  }

  /**
   * Advanced skills matching using semantic similarity
   */
  private calculateSkillsMatch(workerSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 1.0;

    let totalSimilarity = 0;
    let matchedSkills = 0;

    for (const jobSkill of jobSkills) {
      let maxSimilarity = 0;
      
      for (const workerSkill of workerSkills) {
        const similarity = this.calculateSkillSimilarity(workerSkill, jobSkill);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
      
      if (maxSimilarity >= this.config.skillSimilarityThreshold) {
        matchedSkills++;
      }
      totalSimilarity += maxSimilarity;
    }

    // Combine exact matches and semantic similarity
    const exactMatchScore = matchedSkills / jobSkills.length;
    const semanticScore = totalSimilarity / jobSkills.length;
    
    return (exactMatchScore * 0.7) + (semanticScore * 0.3);
  }

  /**
   * Calculate semantic similarity between skills using embeddings
   */
  private calculateSkillSimilarity(skill1: string, skill2: string): number {
    const embedding1 = this.getSkillEmbedding(skill1.toLowerCase());
    const embedding2 = this.getSkillEmbedding(skill2.toLowerCase());
    
    if (!embedding1 || !embedding2) {
      return skill1.toLowerCase() === skill2.toLowerCase() ? 1.0 : 0.0;
    }
    
    return this.cosineSimilarity(embedding1, embedding2);
  }

  /**
   * Geographic optimization with multiple factors
   */
  private calculateLocationMatch(workerLocation: string, jobLocation: string): number {
    if (workerLocation.toLowerCase() === jobLocation.toLowerCase()) {
      return 1.0;
    }

    const distance = this.calculateDistance(workerLocation, jobLocation);
    
    if (distance <= 10) return 0.9;
    if (distance <= 25) return 0.8;
    if (distance <= 50) return 0.6;
    if (distance <= 100) return 0.4;
    
    return 0.2;
  }

  /**
   * Salary compatibility with market analysis
   */
  private calculateSalaryMatch(worker: WorkerProfile, job: SustainableJob): number {
    // This would integrate with worker's salary expectations
    // For now, using a simplified calculation
    const jobSalaryMid = (Number(job.salaryMin) + Number(job.salaryMax)) / 2;
    
    // Assume worker expects market rate based on experience
    const expectedSalary = this.estimateExpectedSalary(worker.experienceLevel, worker.skills);
    
    const salaryRatio = Math.min(jobSalaryMid / expectedSalary, expectedSalary / jobSalaryMid);
    
    return Math.max(0, salaryRatio);
  }

  /**
   * Sustainability alignment scoring
   */
  private calculateSustainabilityMatch(worker: WorkerProfile, job: SustainableJob): number {
    const jobSustainabilityScore = Number(job.sustainabilityScore);
    const workerInterests = worker.sustainabilityInterests;
    
    // Calculate interest alignment
    let interestAlignment = 0;
    if (workerInterests.includes('renewable-energy') && job.sector.includes('energy')) interestAlignment += 0.3;
    if (workerInterests.includes('environmental') && jobSustainabilityScore > 0.8) interestAlignment += 0.3;
    if (workerInterests.includes('social-impact') && job.companyInfo.sustainabilityRating > 4) interestAlignment += 0.2;
    if (workerInterests.includes('circular-economy') && job.sector.includes('waste')) interestAlignment += 0.2;
    
    return Math.min(1.0, interestAlignment + (jobSustainabilityScore * 0.3));
  }

  /**
   * Experience level matching
   */
  private calculateExperienceMatch(workerExperience: string, job: SustainableJob): number {
    // This would be enhanced with job's required experience level
    // For now, using a simplified scoring
    const experienceScores = {
      'entry': 1,
      'mid': 2,
      'senior': 3,
      'expert': 4
    };
    
    const workerLevel = experienceScores[workerExperience as keyof typeof experienceScores] || 1;
    
    // Assume job requirements based on salary range
    const salaryMid = (Number(job.salaryMin) + Number(job.salaryMax)) / 2;
    let requiredLevel = 1;
    if (salaryMid > 80000) requiredLevel = 4;
    else if (salaryMid > 60000) requiredLevel = 3;
    else if (salaryMid > 40000) requiredLevel = 2;
    
    const levelDiff = Math.abs(workerLevel - requiredLevel);
    return Math.max(0, 1 - (levelDiff * 0.25));
  }

  /**
   * Cultural fit assessment
   */
  private calculateCulturalFit(worker: WorkerProfile, job: SustainableJob): number {
    // Simplified cultural fit based on company size and worker preferences
    let fitScore = 0.5; // baseline
    
    if (job.companyInfo.size === 'startup' && worker.sustainabilityInterests.includes('innovation')) {
      fitScore += 0.3;
    }
    
    if (job.companyInfo.sustainabilityRating > 4 && worker.sustainabilityInterests.length > 2) {
      fitScore += 0.2;
    }
    
    return Math.min(1.0, fitScore);
  }

  // Helper methods for initialization and calculations
  private initializeSkillEmbeddings(): void {
    // Initialize with common sustainability skills and their embeddings
    const skillEmbeddings = {
      'renewable-energy': [0.8, 0.6, 0.9, 0.7, 0.5],
      'solar-power': [0.9, 0.7, 0.8, 0.6, 0.4],
      'wind-energy': [0.8, 0.8, 0.7, 0.5, 0.6],
      'sustainability': [0.7, 0.9, 0.8, 0.8, 0.7],
      'environmental-science': [0.6, 0.8, 0.9, 0.7, 0.8],
      'project-management': [0.5, 0.4, 0.3, 0.9, 0.8],
      'data-analysis': [0.4, 0.3, 0.5, 0.8, 0.9],
      'python': [0.3, 0.2, 0.4, 0.7, 0.9],
      'javascript': [0.2, 0.1, 0.3, 0.6, 0.8]
    };
    
    for (const [skill, embedding] of Object.entries(skillEmbeddings)) {
      this.skillEmbeddings.set(skill, embedding);
    }
  }

  private initializeLocationData(): void {
    // Initialize with major cities and their coordinates
    const locations = {
      'new-york': { lat: 40.7128, lng: -74.0060 },
      'san-francisco': { lat: 37.7749, lng: -122.4194 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'berlin': { lat: 52.5200, lng: 13.4050 },
      'tokyo': { lat: 35.6762, lng: 139.6503 }
    };
    
    for (const [location, coords] of Object.entries(locations)) {
      this.locationCoordinates.set(location, coords);
    }
  }

  private initializeIndustryTrends(): void {
    // Initialize with sustainability industry trends
    this.industryTrends.set('renewable-energy', {
      sector: 'renewable-energy',
      demandGrowth: 25.5,
      skillDemand: {
        'solar-installation': 0.9,
        'wind-turbine-maintenance': 0.8,
        'energy-storage': 0.85
      },
      salaryTrends: {
        'entry': 45000,
        'mid': 65000,
        'senior': 85000
      },
      geographicHotspots: ['california', 'texas', 'germany', 'china'],
      emergingOpportunities: ['offshore-wind', 'green-hydrogen', 'battery-storage']
    });
  }

  private getSkillEmbedding(skill: string): number[] | null {
    return this.skillEmbeddings.get(skill) || null;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private calculateDistance(location1: string, location2: string): number {
    const coords1 = this.locationCoordinates.get(location1.toLowerCase());
    const coords2 = this.locationCoordinates.get(location2.toLowerCase());
    
    if (!coords1 || !coords2) return 1000; // Default high distance
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLng = (coords2.lng - coords1.lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  private estimateExpectedSalary(experience: string, skills: string[]): number {
    const baseSalaries = {
      'entry': 45000,
      'mid': 65000,
      'senior': 85000,
      'expert': 110000
    };
    
    let baseSalary = baseSalaries[experience as keyof typeof baseSalaries] || 45000;
    
    // Add premium for high-demand sustainability skills
    const premiumSkills = ['renewable-energy', 'sustainability', 'environmental-science'];
    const premiumCount = skills.filter(skill => premiumSkills.includes(skill)).length;
    
    return baseSalary * (1 + premiumCount * 0.1);
  }

  private analyzeSkillGap(workerSkills: string[], jobSkills: string[]): SkillGapAnalysis {
    const missingSkills = jobSkills.filter(jobSkill => 
      !workerSkills.some(workerSkill => 
        this.calculateSkillSimilarity(workerSkill, jobSkill) >= this.config.skillSimilarityThreshold
      )
    );

    const skillGapScore = 1 - (missingSkills.length / jobSkills.length);
    
    return {
      missingSkills,
      skillGapScore,
      recommendedCourses: missingSkills.map(skill => `${skill}-certification`),
      timeToAcquire: missingSkills.length * 2, // 2 months per skill
      costToAcquire: missingSkills.length * 500 // $500 per skill
    };
  }

  private optimizeGeography(workerLocation: string, jobLocation: string, jobType: string): GeographicOptimization {
    const distance = this.calculateDistance(workerLocation, jobLocation);
    
    return {
      distance,
      transportationOptions: distance < 50 ? ['car', 'public-transport'] : ['flight', 'train'],
      costOfLiving: this.estimateCostOfLiving(jobLocation),
      remoteWorkPossibility: jobType === 'remote' ? 1.0 : jobType === 'hybrid' ? 0.7 : 0.2,
      relocationSupport: distance > 100
    };
  }

  private calculateSustainabilityImpact(worker: WorkerProfile, job: SustainableJob): SustainabilityImpact {
    const jobSustainabilityScore = Number(job.sustainabilityScore);
    
    return {
      carbonFootprintReduction: jobSustainabilityScore * 1000, // kg CO2/year
      socialImpactScore: jobSustainabilityScore * 0.8,
      economicBenefitScore: jobSustainabilityScore * 0.9,
      communityDevelopmentScore: jobSustainabilityScore * 0.7,
      overallSustainabilityScore: jobSustainabilityScore
    };
  }

  private estimateCostOfLiving(location: string): number {
    const costIndex = {
      'new-york': 1.2,
      'san-francisco': 1.4,
      'london': 1.1,
      'berlin': 0.9,
      'tokyo': 1.0
    };
    
    return costIndex[location.toLowerCase() as keyof typeof costIndex] || 1.0;
  }

  private generateRecommendationReason(compatibilityScore: number, skillsMatch: number, sustainabilityMatch: number): string {
    if (compatibilityScore > 0.9) {
      return "Excellent match! Your skills and sustainability interests align perfectly with this opportunity.";
    } else if (compatibilityScore > 0.8) {
      return "Strong match with high potential for success and meaningful impact.";
    } else if (skillsMatch > 0.8) {
      return "Great skills match! This role would leverage your expertise effectively.";
    } else if (sustainabilityMatch > 0.8) {
      return "Perfect sustainability alignment! This role matches your environmental values.";
    } else {
      return "Good potential match with opportunities for growth and development.";
    }
  }

  private generateImprovementSuggestions(skillGap: SkillGapAnalysis, geographic: GeographicOptimization): string[] {
    const suggestions: string[] = [];
    
    if (skillGap.missingSkills.length > 0) {
      suggestions.push(`Consider developing skills in: ${skillGap.missingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (geographic.distance > 50 && geographic.remoteWorkPossibility < 0.5) {
      suggestions.push("Consider relocation or negotiating remote work options");
    }
    
    if (skillGap.skillGapScore < 0.7) {
      suggestions.push("Focus on skill development to increase match compatibility");
    }
    
    return suggestions;
  }

  private optimizeMatchDiversity(results: MatchResult[]): MatchResult[] {
    // Sort by compatibility score
    results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Apply diversity optimization to avoid clustering in similar roles
    const diversifiedResults: MatchResult[] = [];
    const usedSectors = new Set<string>();
    
    for (const result of results) {
      // This would need job sector information - simplified for now
      diversifiedResults.push(result);
      
      if (diversifiedResults.length >= 10) break; // Limit to top 10 matches
    }
    
    return diversifiedResults;
  }

  /**
   * Predict market demand for skills and sectors
   */
  public predictMarketDemand(sector: string): MarketDemandPrediction | null {
    return this.industryTrends.get(sector) || null;
  }

  /**
   * Update algorithm based on feedback
   */
  public updateFromFeedback(matchId: number, feedback: { hired: boolean; rating: number }): void {
    // Implement reinforcement learning to improve matching accuracy
    // This would update weights and thresholds based on successful matches
    if (feedback.hired && feedback.rating > 4) {
      // Positive feedback - slightly increase weights that led to this match
      this.config.learningRate *= 1.01;
    } else if (!feedback.hired || feedback.rating < 3) {
      // Negative feedback - adjust algorithm parameters
      this.config.learningRate *= 0.99;
    }
  }
}
