import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ===== SUSTAINABILITY FEATURES SCHEMA =====

// 1. SUSTAINABLE LIVELIHOODS TABLES
export const sustainableJobs = pgTable("sustainable_jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sector: text("sector").notNull(),
  location: text("location").notNull(),
  salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
  salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
  skillRequirements: jsonb("skill_requirements").$type<string[]>().notNull(),
  sustainabilityScore: decimal("sustainability_score", { precision: 3, scale: 2 }).notNull(),
  companyInfo: jsonb("company_info").$type<{
    name: string;
    size: string;
    industry: string;
    sustainabilityRating: number;
  }>().notNull(),
  jobType: text("job_type").notNull(), // remote/hybrid/onsite
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiryDate: timestamp("expiry_date"),
  status: text("status").notNull().default("active"), // active/paused/expired/filled
});

export const workerProfiles = pgTable("worker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  skills: jsonb("skills").$type<string[]>().notNull(),
  experienceLevel: text("experience_level").notNull(), // entry/mid/senior/expert
  education: jsonb("education").$type<{
    degree: string;
    institution: string;
    year: number;
  }[]>().notNull(),
  certifications: jsonb("certifications").$type<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }[]>().notNull(),
  sustainabilityInterests: jsonb("sustainability_interests").$type<string[]>().notNull(),
  availability: text("availability").notNull(), // immediate/1month/3months/6months
  portfolioLinks: jsonb("portfolio_links").$type<string[]>(),
  references: jsonb("references").$type<{
    name: string;
    company: string;
    email: string;
    phone: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skillDevelopment = pgTable("skill_development", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  duration: integer("duration").notNull(), // in hours
  difficultyLevel: text("difficulty_level").notNull(), // beginner/intermediate/advanced
  cost: decimal("cost", { precision: 8, scale: 2 }).notNull(),
  sustainabilityFocus: text("sustainability_focus").notNull(),
  completionRate: decimal("completion_rate", { precision: 3, scale: 2 }).notNull(),
  prerequisites: jsonb("prerequisites").$type<string[]>(),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobMatches = pgTable("job_matches", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => workerProfiles.id).notNull(),
  jobId: integer("job_id").references(() => sustainableJobs.id).notNull(),
  compatibilityScore: decimal("compatibility_score", { precision: 3, scale: 2 }).notNull(),
  algorithmVersion: text("algorithm_version").notNull(),
  matchDate: timestamp("match_date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending/applied/interviewed/hired/rejected
  feedbackScore: decimal("feedback_score", { precision: 3, scale: 2 }),
  successMetrics: jsonb("success_metrics").$type<{
    applicationResponse: boolean;
    interviewInvite: boolean;
    jobOffer: boolean;
    hired: boolean;
  }>(),
});

// 2. CULTURAL SUSTAINABILITY TABLES
export const culturalPractices = pgTable("cultural_practices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  originRegion: text("origin_region").notNull(),
  culturalSignificance: text("cultural_significance").notNull(),
  preservationStatus: text("preservation_status").notNull(), // thriving/stable/vulnerable/endangered/extinct
  associatedSkills: jsonb("associated_skills").$type<string[]>().notNull(),
  knowledgeHolders: jsonb("knowledge_holders").$type<{
    name: string;
    age: number;
    location: string;
    expertise: string;
  }[]>().notNull(),
  documentation: jsonb("documentation").$type<{
    images: string[];
    videos: string[];
    texts: string[];
    audio: string[];
  }>(),
  threatLevel: decimal("threat_level", { precision: 3, scale: 2 }).notNull(),
  conservationEfforts: jsonb("conservation_efforts").$type<{
    organization: string;
    effort: string;
    status: string;
    funding: number;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const indigenousKnowledge = pgTable("indigenous_knowledge", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceCommunity: text("source_community").notNull(),
  knowledgeCategory: text("knowledge_category").notNull(), // agriculture/medicine/crafts/environmental/spiritual
  applicationAreas: jsonb("application_areas").$type<string[]>().notNull(),
  validationStatus: text("validation_status").notNull(), // pending/validated/disputed/rejected
  scientificBacking: jsonb("scientific_backing").$type<{
    studies: string[];
    evidence: string;
    confidence: number;
  }>(),
  integrationOpportunities: jsonb("integration_opportunities").$type<{
    industry: string;
    application: string;
    potential: number;
  }[]>(),
  successStories: jsonb("success_stories").$type<{
    title: string;
    description: string;
    impact: string;
    date: string;
  }[]>(),
  accessPermissions: jsonb("access_permissions").$type<{
    level: string; // public/restricted/private
    conditions: string[];
    approvers: string[];
  }>().notNull(),
  sharingProtocols: jsonb("sharing_protocols").$type<{
    attribution: string;
    commercialUse: boolean;
    modifications: boolean;
    benefitSharing: string;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const artisanProfiles = pgTable("artisan_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  specialization: text("specialization").notNull(),
  culturalBackground: text("cultural_background").notNull(),
  experienceLevel: text("experience_level").notNull(), // apprentice/journeyman/master
  productCatalog: jsonb("product_catalog").$type<{
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    availability: boolean;
  }[]>().notNull(),
  pricing: jsonb("pricing").$type<{
    currency: string;
    priceRange: { min: number; max: number };
    customOrders: boolean;
    bulkDiscounts: boolean;
  }>().notNull(),
  availability: jsonb("availability").$type<{
    status: string; // available/busy/unavailable
    leadTime: number; // days
    capacity: number; // orders per month
  }>().notNull(),
  certificationStatus: text("certification_status").notNull(), // verified/pending/unverified
  qualityRatings: jsonb("quality_ratings").$type<{
    averageRating: number;
    totalReviews: number;
    categories: {
      craftsmanship: number;
      authenticity: number;
      communication: number;
      delivery: number;
    };
  }>(),
  marketReach: jsonb("market_reach").$type<{
    local: boolean;
    national: boolean;
    international: boolean;
    onlinePresence: string[];
  }>().notNull(),
  salesHistory: jsonb("sales_history").$type<{
    totalSales: number;
    monthlyRevenue: number[];
    topProducts: string[];
    customerRetention: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const culturalBusinesses = pgTable("cultural_businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // artisan/cultural-tourism/traditional-food/heritage-crafts
  culturalFocus: text("cultural_focus").notNull(),
  productsServices: jsonb("products_services").$type<{
    category: string;
    items: string[];
    pricing: { min: number; max: number };
  }[]>().notNull(),
  targetMarkets: jsonb("target_markets").$type<string[]>().notNull(),
  revenueStreams: jsonb("revenue_streams").$type<{
    source: string;
    percentage: number;
    growth: number;
  }[]>().notNull(),
  growthMetrics: jsonb("growth_metrics").$type<{
    monthlyRevenue: number[];
    customerGrowth: number[];
    marketExpansion: string[];
  }>(),
  culturalAuthenticityScore: decimal("cultural_authenticity_score", { precision: 3, scale: 2 }).notNull(),
  communityImpactAssessment: jsonb("community_impact_assessment").$type<{
    jobsCreated: number;
    localSuppliers: number;
    culturalPreservation: string;
    economicImpact: number;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. EQUITABLE ECONOMICS TABLES
export const supplyChains = pgTable("supply_chains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  complexityScore: decimal("complexity_score", { precision: 3, scale: 2 }).notNull(),
  participatingEntities: jsonb("participating_entities").$type<{
    id: string;
    name: string;
    role: string; // supplier/manufacturer/distributor/retailer
    location: string;
    size: string;
  }[]>().notNull(),
  relationships: jsonb("relationships").$type<{
    from: string;
    to: string;
    type: string; // supplies/manufactures/distributes
    volume: number;
    value: number;
  }[]>().notNull(),
  transparencyLevel: decimal("transparency_level", { precision: 3, scale: 2 }).notNull(),
  auditFrequency: text("audit_frequency").notNull(), // monthly/quarterly/annually
  sustainabilityMetrics: jsonb("sustainability_metrics").$type<{
    carbonFootprint: number;
    waterUsage: number;
    wasteGeneration: number;
    energyConsumption: number;
  }>().notNull(),
  certifications: jsonb("certifications").$type<{
    name: string;
    issuer: string;
    validUntil: string;
    scope: string;
  }[]>(),
  riskAssessment: jsonb("risk_assessment").$type<{
    category: string;
    level: string; // low/medium/high/critical
    description: string;
    mitigation: string;
  }[]>().notNull(),
  improvementAreas: jsonb("improvement_areas").$type<{
    area: string;
    priority: string;
    timeline: string;
    resources: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profitSharingModels = pgTable("profit_sharing_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  distributionFormula: jsonb("distribution_formula").$type<{
    stakeholder: string;
    weight: number;
    criteria: string[];
    calculation: string;
  }[]>().notNull(),
  stakeholderWeights: jsonb("stakeholder_weights").$type<{
    employees: number;
    suppliers: number;
    community: number;
    environment: number;
    shareholders: number;
  }>().notNull(),
  implementationComplexity: text("implementation_complexity").notNull(), // low/medium/high
  successRate: decimal("success_rate", { precision: 3, scale: 2 }).notNull(),
  legalRequirements: jsonb("legal_requirements").$type<{
    jurisdiction: string;
    requirements: string[];
    compliance: boolean;
  }[]>().notNull(),
  complianceStatus: text("compliance_status").notNull(), // compliant/partial/non-compliant
  performanceMetrics: jsonb("performance_metrics").$type<{
    metric: string;
    value: number;
    trend: string;
    benchmark: number;
  }[]>().notNull(),
  caseStudies: jsonb("case_studies").$type<{
    company: string;
    implementation: string;
    results: string;
    lessons: string[];
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wageTransparency = pgTable("wage_transparency", {
  id: serial("id").primaryKey(),
  companyId: text("company_id").notNull(),
  position: text("position").notNull(),
  location: text("location").notNull(),
  wageRange: jsonb("wage_range").$type<{
    min: number;
    max: number;
    currency: string;
    period: string; // hourly/monthly/annually
  }>().notNull(),
  benefitsPackage: jsonb("benefits_package").$type<{
    health: boolean;
    dental: boolean;
    vision: boolean;
    retirement: boolean;
    vacation: number;
    other: string[];
  }>().notNull(),
  totalCompensation: jsonb("total_compensation").$type<{
    base: number;
    bonus: number;
    equity: number;
    benefits: number;
    total: number;
  }>().notNull(),
  genderPayGap: jsonb("gender_pay_gap").$type<{
    male: number;
    female: number;
    nonBinary: number;
    gap: number;
  }>(),
  equityMetrics: jsonb("equity_metrics").$type<{
    diversityIndex: number;
    inclusionScore: number;
    promotionRate: { [key: string]: number };
    retentionRate: { [key: string]: number };
  }>().notNull(),
  industryBenchmarks: jsonb("industry_benchmarks").$type<{
    percentile: number;
    median: number;
    comparison: string;
  }>(),
  adjustmentHistory: jsonb("adjustment_history").$type<{
    date: string;
    oldRange: { min: number; max: number };
    newRange: { min: number; max: number };
    reason: string;
  }[]>(),
  transparencyScore: decimal("transparency_score", { precision: 3, scale: 2 }).notNull(),
  reportingFrequency: text("reporting_frequency").notNull(), // monthly/quarterly/annually
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CREATE INSERT SCHEMAS FOR ALL NEW TABLES
export const insertSustainableJobSchema = createInsertSchema(sustainableJobs);
export const insertWorkerProfileSchema = createInsertSchema(workerProfiles);
export const insertSkillDevelopmentSchema = createInsertSchema(skillDevelopment);
export const insertJobMatchSchema = createInsertSchema(jobMatches);
export const insertCulturalPracticeSchema = createInsertSchema(culturalPractices);
export const insertIndigenousKnowledgeSchema = createInsertSchema(indigenousKnowledge);
export const insertArtisanProfileSchema = createInsertSchema(artisanProfiles);
export const insertCulturalBusinessSchema = createInsertSchema(culturalBusinesses);
export const insertSupplyChainSchema = createInsertSchema(supplyChains);
export const insertProfitSharingModelSchema = createInsertSchema(profitSharingModels);
export const insertWageTransparencySchema = createInsertSchema(wageTransparency);

// EXPORT TYPES
export type SustainableJob = typeof sustainableJobs.$inferSelect;
export type InsertSustainableJob = z.infer<typeof insertSustainableJobSchema>;
export type WorkerProfile = typeof workerProfiles.$inferSelect;
export type InsertWorkerProfile = z.infer<typeof insertWorkerProfileSchema>;
export type SkillDevelopment = typeof skillDevelopment.$inferSelect;
export type InsertSkillDevelopment = z.infer<typeof insertSkillDevelopmentSchema>;
export type JobMatch = typeof jobMatches.$inferSelect;
export type InsertJobMatch = z.infer<typeof insertJobMatchSchema>;
export type CulturalPractice = typeof culturalPractices.$inferSelect;
export type InsertCulturalPractice = z.infer<typeof insertCulturalPracticeSchema>;
export type IndigenousKnowledge = typeof indigenousKnowledge.$inferSelect;
export type InsertIndigenousKnowledge = z.infer<typeof insertIndigenousKnowledgeSchema>;
export type ArtisanProfile = typeof artisanProfiles.$inferSelect;
export type InsertArtisanProfile = z.infer<typeof insertArtisanProfileSchema>;
export type CulturalBusiness = typeof culturalBusinesses.$inferSelect;
export type InsertCulturalBusiness = z.infer<typeof insertCulturalBusinessSchema>;
export type SupplyChain = typeof supplyChains.$inferSelect;
export type InsertSupplyChain = z.infer<typeof insertSupplyChainSchema>;
export type ProfitSharingModel = typeof profitSharingModels.$inferSelect;
export type InsertProfitSharingModel = z.infer<typeof insertProfitSharingModelSchema>;
export type WageTransparency = typeof wageTransparency.$inferSelect;
export type InsertWageTransparency = z.infer<typeof insertWageTransparencySchema>;
