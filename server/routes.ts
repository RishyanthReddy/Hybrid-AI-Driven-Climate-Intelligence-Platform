import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // ===== SUSTAINABILITY API ROUTES =====

  // Sustainable Jobs API
  app.get("/api/sustainability/jobs", async (req, res) => {
    try {
      const { sector, location, salaryMin, salaryMax, sustainabilityMin } = req.query;

      // Mock data - in production, this would query the database
      const jobs = [
        {
          id: 1,
          title: "Senior Renewable Energy Engineer",
          company: "GreenTech Solutions",
          location: "San Francisco, CA",
          salaryRange: { min: 90000, max: 130000 },
          jobType: "hybrid",
          sustainabilityScore: 0.95,
          skills: ["Solar Power", "Wind Energy", "Project Management", "Python"],
          sector: "Renewable Energy",
          description: "Lead the development of innovative renewable energy solutions...",
          postedDate: "2024-01-15",
          applicants: 45,
          matchScore: 0.92
        },
        {
          id: 2,
          title: "Sustainability Data Analyst",
          company: "EcoMetrics Inc",
          location: "Remote",
          salaryRange: { min: 65000, max: 85000 },
          jobType: "remote",
          sustainabilityScore: 0.88,
          skills: ["Data Analysis", "Python", "Sustainability Reporting", "SQL"],
          sector: "Environmental Consulting",
          description: "Analyze environmental data to drive sustainability initiatives...",
          postedDate: "2024-01-14",
          applicants: 32,
          matchScore: 0.87
        }
      ];

      // Apply filters
      let filteredJobs = jobs;
      if (sector) filteredJobs = filteredJobs.filter(job => job.sector.toLowerCase().includes((sector as string).toLowerCase()));
      if (location) filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes((location as string).toLowerCase()));
      if (salaryMin) filteredJobs = filteredJobs.filter(job => job.salaryRange.max >= parseInt(salaryMin as string));
      if (salaryMax) filteredJobs = filteredJobs.filter(job => job.salaryRange.min <= parseInt(salaryMax as string));
      if (sustainabilityMin) filteredJobs = filteredJobs.filter(job => job.sustainabilityScore >= parseFloat(sustainabilityMin as string) / 100);

      res.json({ jobs: filteredJobs, total: filteredJobs.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/sustainability/jobs", async (req, res) => {
    try {
      const jobData = req.body;
      // In production, this would insert into the database
      const newJob = {
        id: Date.now(),
        ...jobData,
        postedDate: new Date().toISOString(),
        applicants: 0
      };

      res.status(201).json({ job: newJob });
    } catch (error) {
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  // Job Matching API
  app.post("/api/sustainability/jobs/match", async (req, res) => {
    try {
      const { workerId, criteria } = req.body;

      // Mock matching results - in production, this would use the SustainableLivelihoodMatcher
      const matches = [
        {
          jobId: 1,
          workerId,
          compatibilityScore: 0.92,
          skillsMatch: 0.88,
          locationMatch: 0.95,
          salaryMatch: 0.90,
          sustainabilityMatch: 0.95,
          recommendationReason: "Excellent match! Your skills and sustainability interests align perfectly."
        }
      ];

      res.json({ matches });
    } catch (error) {
      res.status(500).json({ error: "Failed to find job matches" });
    }
  });

  // Cultural Practices API
  app.get("/api/sustainability/cultural-practices", async (req, res) => {
    try {
      const { status, region, urgencyMin } = req.query;

      // Mock data
      const practices = [
        {
          id: 1,
          name: "Traditional Bamboo Weaving",
          originRegion: "Southeast Asia",
          culturalSignificance: "Ancient craft passed down through generations",
          preservationStatus: "vulnerable",
          associatedSkills: ["Bamboo harvesting", "Pattern design", "Natural dyeing"],
          knowledgeHolders: [
            { name: "Master Chen Wei", age: 78, location: "Rural Vietnam", expertise: "Master weaver" }
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
              organization: "UNESCO Heritage Foundation",
              effort: "Documentation Project",
              status: "active",
              funding: 50000
            }
          ]
        }
      ];

      // Apply filters
      let filteredPractices = practices;
      if (status) filteredPractices = filteredPractices.filter(p => p.preservationStatus === status);
      if (region) filteredPractices = filteredPractices.filter(p => p.originRegion.toLowerCase().includes((region as string).toLowerCase()));
      if (urgencyMin) filteredPractices = filteredPractices.filter(p => p.urgencyScore >= parseInt(urgencyMin as string));

      res.json({ practices: filteredPractices, total: filteredPractices.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cultural practices" });
    }
  });

  app.post("/api/sustainability/cultural-practices/:id/assess-risk", async (req, res) => {
    try {
      const practiceId = parseInt(req.params.id);

      // Mock risk assessment - in production, this would use CulturalPreservationEngine
      const riskAssessment = {
        practiceId,
        riskLevel: "high",
        riskFactors: {
          knowledgeHolderAge: 78,
          practitionerCount: 3,
          documentationLevel: 0.4,
          modernizationPressure: 0.8,
          economicViability: 0.3,
          communitySupport: 0.6
        },
        urgencyScore: 82,
        timeToExtinction: 15,
        preservationCost: 75000,
        preservationComplexity: "high"
      };

      res.json({ riskAssessment });
    } catch (error) {
      res.status(500).json({ error: "Failed to assess cultural risk" });
    }
  });

  // Supply Chain Equity API
  app.get("/api/sustainability/supply-chains", async (req, res) => {
    try {
      const { industry, transparencyMin } = req.query;

      // Mock data
      const supplyChains = [
        {
          id: 1,
          name: "Sustainable Electronics Supply Chain",
          industry: "Electronics",
          complexityScore: 0.75,
          participatingEntities: [
            {
              id: "1",
              name: "GreenTech Manufacturing",
              role: "manufacturer",
              location: "Vietnam",
              size: "large"
            }
          ],
          transparencyLevel: 0.78,
          auditFrequency: "quarterly",
          sustainabilityMetrics: {
            carbonFootprint: 1500,
            waterUsage: 2000,
            wasteGeneration: 500,
            energyConsumption: 3000
          }
        }
      ];

      // Apply filters
      let filteredChains = supplyChains;
      if (industry) filteredChains = filteredChains.filter(sc => sc.industry.toLowerCase().includes((industry as string).toLowerCase()));
      if (transparencyMin) filteredChains = filteredChains.filter(sc => sc.transparencyLevel >= parseFloat(transparencyMin as string) / 100);

      res.json({ supplyChains: filteredChains, total: filteredChains.length });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply chains" });
    }
  });

  app.post("/api/sustainability/supply-chains/:id/optimize-distribution", async (req, res) => {
    try {
      const supplyChainId = parseInt(req.params.id);
      const { totalProfit, constraints } = req.body;

      // Mock optimization results - in production, this would use EquitableDistributionEngine
      const optimization = {
        totalProfit,
        currentDistribution: {
          employees: totalProfit * 0.35,
          suppliers: totalProfit * 0.25,
          shareholders: totalProfit * 0.30,
          community: totalProfit * 0.05,
          environment: totalProfit * 0.05
        },
        optimizedDistribution: {
          employees: totalProfit * 0.40,
          suppliers: totalProfit * 0.27,
          shareholders: totalProfit * 0.25,
          community: totalProfit * 0.05,
          environment: totalProfit * 0.03
        },
        equityScore: 78,
        socialImpactScore: 85,
        sustainabilityScore: 82,
        implementationComplexity: "medium",
        expectedResistance: 35,
        timeToImplement: 8
      };

      res.json({ optimization });
    } catch (error) {
      res.status(500).json({ error: "Failed to optimize profit distribution" });
    }
  });

  // Sustainability Impact Metrics API
  app.get("/api/sustainability/impact-metrics", async (req, res) => {
    try {
      const metrics = {
        jobsCreated: 1247,
        culturalPracticesDocumented: 89,
        supplyChainTransparencyImproved: 156,
        communitiesSupported: 67,
        carbonFootprintReduced: 2340,
        wageGapReduced: 8.5,
        localSuppliersSupported: 234
      };

      res.json({ metrics });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch impact metrics" });
    }
  });

  // Sustainability Reports API
  app.post("/api/sustainability/reports/generate", async (req, res) => {
    try {
      const { timeframe, includeDetails } = req.body;

      const report = {
        id: Date.now(),
        timeframe,
        generatedAt: new Date().toISOString(),
        impactMetrics: {
          jobsCreated: 1247,
          culturalPracticesDocumented: 89,
          supplyChainTransparencyImproved: 156,
          communitiesSupported: 67
        },
        recommendations: [
          {
            category: "Job Matching",
            priority: "high",
            recommendation: "Expand skills training programs in renewable energy sector",
            expectedImpact: "Increase job placement rate by 15%"
          }
        ],
        downloadUrl: `/api/sustainability/reports/${Date.now()}/download`
      };

      res.json({ report });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
