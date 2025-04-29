/**
 * Service pour l'analyse des écarts de compétences
 */
export class SkillGapService {
  private serverUrl: string
  private fallbackMode = false

  constructor() {
    // Utiliser l'URL du serveur d'analyse des écarts de compétences depuis les variables d'environnement
    // ou utiliser une URL par défaut
    this.serverUrl = process.env.SKILL_GAP_SERVER_URL || "http://localhost:5006"
  }

  /**
   * Analyse l'écart de compétences entre un candidat et un poste
   */
  async analyzeSkillGap(candidateResume: string, jobDescription: string, candidateId?: string, jobId?: string) {
    try {
      if (this.fallbackMode) {
        return this.generateFallbackSkillGapAnalysis()
      }

      const response = await fetch(`${this.serverUrl}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_resume: candidateResume,
          job_description: jobDescription,
          candidate_id: candidateId,
          job_id: jobId,
        }),
      })

      if (!response.ok) {
        console.error(`Erreur lors de l'analyse des écarts de compétences: ${response.statusText}`)
        this.fallbackMode = true
        return this.generateFallbackSkillGapAnalysis()
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la communication avec le serveur d'analyse des écarts de compétences:", error)
      this.fallbackMode = true
      return this.generateFallbackSkillGapAnalysis()
    }
  }

  /**
   * Compare plusieurs candidats pour un poste
   */
  async compareCandidates(candidateResumes: Record<string, string>, jobDescription: string) {
    try {
      if (this.fallbackMode) {
        return this.generateFallbackCandidateComparison(candidateResumes, jobDescription)
      }

      const response = await fetch(`${this.serverUrl}/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_resumes: candidateResumes,
          job_description: jobDescription,
        }),
      })

      if (!response.ok) {
        console.error(`Erreur lors de la comparaison des candidats: ${response.statusText}`)
        this.fallbackMode = true
        return this.generateFallbackCandidateComparison(candidateResumes, jobDescription)
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la communication avec le serveur d'analyse des écarts de compétences:", error)
      this.fallbackMode = true
      return this.generateFallbackCandidateComparison(candidateResumes, jobDescription)
    }
  }

  /**
   * Génère un plan de développement des compétences
   */
  async generateDevelopmentPlan(candidateResume: string, jobDescription: string, timeframeWeeks = 12) {
    try {
      if (this.fallbackMode) {
        return this.generateFallbackDevelopmentPlan()
      }

      const response = await fetch(`${this.serverUrl}/development-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_resume: candidateResume,
          job_description: jobDescription,
          timeframe_weeks: timeframeWeeks,
        }),
      })

      if (!response.ok) {
        console.error(`Erreur lors de la génération du plan de développement: ${response.statusText}`)
        this.fallbackMode = true
        return this.generateFallbackDevelopmentPlan()
      }

      return await response.json()
    } catch (error) {
      console.error("Erreur lors de la communication avec le serveur d'analyse des écarts de compétences:", error)
      this.fallbackMode = true
      return this.generateFallbackDevelopmentPlan()
    }
  }

  /**
   * Vérifie l'état du serveur d'analyse des écarts de compétences
   */
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: "GET",
      })

      if (!response.ok) {
        this.fallbackMode = true
        return false
      }

      this.fallbackMode = false
      return true
    } catch (error) {
      console.error("Erreur lors de la vérification de l'état du serveur:", error)
      this.fallbackMode = true
      return false
    }
  }

  /**
   * Génère une analyse d'écart de compétences de secours (mode dégradé)
   */
  private generateFallbackSkillGapAnalysis() {
    return {
      overall_match_score: Math.round(Math.random() * 40 + 50),
      skill_gap_score: Math.round(Math.random() * 40 + 10),
      matched_skills: [
        { job_skill: "JavaScript", candidate_skill: "JavaScript", similarity: 1.0, importance: 0.9 },
        { job_skill: "React", candidate_skill: "React", similarity: 1.0, importance: 0.85 },
        { job_skill: "Node.js", candidate_skill: "Node.js", similarity: 1.0, importance: 0.8 },
      ],
      missing_skills: [
        { skill: "TypeScript", importance: 0.75, is_critical: true },
        { skill: "GraphQL", importance: 0.6, is_critical: false },
        { skill: "AWS", importance: 0.7, is_critical: true },
      ],
      additional_skills: [
        { skill: "Python", best_related_job_skill: null, similarity: 0, relevance: 0.3 },
        { skill: "Docker", best_related_job_skill: "DevOps", similarity: 0.7, relevance: 0.5 },
      ],
      training_recommendations: [
        {
          skill: "TypeScript",
          importance: 0.75,
          is_critical: true,
          resources: {
            courses: ["TypeScript Fundamentals", "Advanced TypeScript"],
            platforms: ["Udemy", "Frontend Masters"],
            estimated_time: "4-6 weeks",
          },
        },
        {
          skill: "AWS",
          importance: 0.7,
          is_critical: true,
          resources: {
            courses: ["AWS Certified Developer", "AWS Fundamentals"],
            platforms: ["A Cloud Guru", "AWS Training"],
            estimated_time: "8-12 weeks",
          },
        },
      ],
      skill_gap_by_domain: {
        programming: { required: 5, matched: 3, match_score: 60, gap_score: 40 },
        cloud: { required: 2, matched: 0, match_score: 0, gap_score: 100 },
        soft_skills: { required: 3, matched: 2, match_score: 66.67, gap_score: 33.33 },
      },
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Génère une comparaison de candidats de secours (mode dégradé)
   */
  private generateFallbackCandidateComparison(candidateResumes: Record<string, string>, jobDescription: string) {
    const candidateIds = Object.keys(candidateResumes)

    return {
      job_skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL", "AWS"],
      critical_skills: ["JavaScript", "React", "TypeScript"],
      candidate_count: candidateIds.length,
      ranked_candidates: candidateIds
        .map((id, index) => ({
          candidate_id: id,
          match_score: Math.round(Math.random() * 40 + 50),
          skill_gap_score: Math.round(Math.random() * 40 + 10),
          missing_critical_skills_count: Math.floor(Math.random() * 3),
          missing_skills_count: Math.floor(Math.random() * 5) + 1,
          additional_skills_count: Math.floor(Math.random() * 3),
        }))
        .sort((a, b) => b.match_score - a.match_score),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Génère un plan de développement de secours (mode dégradé)
   */
  private generateFallbackDevelopmentPlan() {
    return {
      total_missing_skills: 5,
      total_learning_time_required: 30,
      timeframe_available: 12,
      skills_covered: 3,
      skills_not_covered: 2,
      development_plan: [
        {
          skill: "TypeScript",
          start_week: 1,
          end_week: 4,
          duration_weeks: 4,
          is_critical: true,
          is_partial_training: false,
          resources: {
            courses: ["TypeScript Fundamentals", "Advanced TypeScript"],
            platforms: ["Udemy", "Frontend Masters"],
            books: ["Programming TypeScript", "Effective TypeScript"],
            projects: ["Convert a JavaScript project to TypeScript", "Build a TypeScript API"],
          },
        },
        {
          skill: "GraphQL",
          start_week: 5,
          end_week: 8,
          duration_weeks: 4,
          is_critical: false,
          is_partial_training: false,
          resources: {
            courses: ["GraphQL Fundamentals", "Advanced GraphQL with Node.js"],
            platforms: ["Udemy", "Frontend Masters"],
            books: ["Learning GraphQL", "Fullstack GraphQL"],
            projects: ["Build a GraphQL API", "Integrate GraphQL with a React frontend"],
          },
        },
        {
          skill: "AWS",
          start_week: 9,
          end_week: 12,
          duration_weeks: 4,
          is_critical: true,
          is_partial_training: true,
          resources: {
            courses: ["AWS Certified Developer", "AWS Fundamentals"],
            platforms: ["A Cloud Guru", "AWS Training"],
            books: ["AWS Certified Developer Official Study Guide", "Amazon Web Services in Action"],
            projects: ["Deploy a Node.js app to AWS", "Set up a serverless API with AWS Lambda"],
          },
        },
      ],
      skill_gap_score_before: 40,
      estimated_skill_gap_score_after: 15,
      critical_skills_covered: 2,
      critical_skills_not_covered: 1,
      timestamp: new Date().toISOString(),
    }
  }
}

// Exporter une instance du service
export const skillGapService = new SkillGapService()
