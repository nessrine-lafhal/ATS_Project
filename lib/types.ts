export interface RecruitmentMetrics {
  hiringMetrics: { period: string; hired: number; target: number }[]
  candidateMetrics: { period: string; applications: number; qualified: number }[]
  interviewMetrics: { period: string; scheduled: number; completed: number }[]
  diversityMetrics: { name: string; value: number }[]
  performanceMetrics: { period: string; rating: number; retention: number }[]
}

export interface CandidateSearchParams {
  job_description: string
  skills: string[]
  location?: string
  experience_level?: string
  platforms?: string[]
  max_results?: number
}

export interface CandidateAnalysisParams {
  candidate: any
  job_description: string
  required_skills: string[]
}

export interface CostPredictionResult {
  predicted_cost: number
  confidence_interval: {
    lower: number
    upper: number
  }
  influence_factors: Record<string, any>
  error?: string
}

export interface CostForecastResult {
  forecast: { ds: string; yhat: number; yhat_lower: number; yhat_upper: number }[]
  total_cost: number
  average_cost: number
  forecast_period: {
    periods: number
    frequency: string
  }
  error?: string
}

export interface ChannelAnalysisResult {
  channel_metrics: any[]
  recommendations: any[]
  budget_optimization: any
  error?: string
}

export interface RecruitmentData {
  channel: string
  source: string
  location: string
  position_level: string
  department: string
}

export interface InterviewScenarioResult {
  job_category: string
  key_skills: string[]
  key_responsibilities: string[]
  scenarios: Record<string, any>
  timestamp: string
}

export interface InterviewScriptResult {
  script: string
}

export interface JobOptimizationResult {
  original_description: string
  optimized_description: string
  original_analysis: JobAnalysisResult
  optimized_analysis: JobAnalysisResult
  improvement_percentage: number
  optimization_level: string
  timestamp: string
}

export interface JobGenerationResult {
  job_title: string
  job_category: string
  skills_required: string[]
  company_info: Record<string, string>
  generated_description: string
  analysis: JobAnalysisResult
  timestamp: string
}

export interface JobAnalysisResult {
  word_count: number
  attractive_keywords_found: number
  structure_score: number
  clarity_score: number
  attractiveness_score: number
  overall_score: number
  has_responsibilities: boolean
  has_requirements: boolean
  has_benefits: boolean
  improvement_areas: string[]
}

export interface JobSuggestionResult {
  analysis: JobAnalysisResult
  suggestions: string[]
  timestamp: string
}

export interface ForecastResult {
  hiringNeeds: { name: string; besoins: number }[]
  departmentDistribution: { name: string; value: number }[]
  skillsGap: { skill: string; actuel: number; requis: number }[]
  marketTrends: { skill: string; demande: number; offre: number; z: number }[]
  attritionRisk: { name: string; risque: number }[]
}

export interface ForecastData {
  hiringNeeds: any[]
  departmentDistribution: any[]
  skillsGap: any[]
  marketTrends: any[]
  attritionRisk: any[]
}
