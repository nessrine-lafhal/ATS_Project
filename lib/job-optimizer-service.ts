import type { JobOptimizationResult, JobGenerationResult, JobAnalysisResult, JobSuggestionResult } from "./types"

const API_BASE_URL = process.env.JOB_OPTIMIZER_SERVER_URL || "http://localhost:5004"

/**
 * Service pour l'optimisation des descriptions de postes
 */
export const JobOptimizerService = {
  /**
   * Analyse une description de poste existante
   */
  async analyzeJobDescription(jobDescription: string): Promise<JobAnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_description: jobDescription }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'analyse de la description de poste: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de l'analyse de la description de poste:", error)

      // Mode dégradé: retourner une analyse simulée
      return {
        word_count: jobDescription.split(" ").length,
        attractive_keywords_found: 3,
        structure_score: 70,
        clarity_score: 80,
        attractiveness_score: 65,
        overall_score: 72,
        has_responsibilities: true,
        has_requirements: true,
        has_benefits: false,
        improvement_areas: ["Ajouter une section sur les avantages et bénéfices offerts"],
      }
    }
  },

  /**
   * Optimise une description de poste existante
   */
  async optimizeJobDescription(
    jobDescription: string,
    jobCategory = "tech",
    optimizationLevel = "medium",
  ): Promise<JobOptimizationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
          job_category: jobCategory,
          optimization_level: optimizationLevel,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'optimisation de la description de poste: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de l'optimisation de la description de poste:", error)

      // Mode dégradé: retourner une optimisation simulée
      const optimizedDescription =
        jobDescription +
        "\n\nCe que nous offrons:\n- Un environnement de travail dynamique et collaboratif\n- Des opportunités de développement professionnel\n- Un équilibre vie professionnelle/vie personnelle\n- Une rémunération compétitive\n- Des avantages sociaux attractifs"

      return {
        original_description: jobDescription,
        optimized_description: optimizedDescription,
        original_analysis: {
          word_count: jobDescription.split(" ").length,
          attractive_keywords_found: 3,
          structure_score: 70,
          clarity_score: 80,
          attractiveness_score: 65,
          overall_score: 72,
          has_responsibilities: true,
          has_requirements: true,
          has_benefits: false,
          improvement_areas: ["Ajouter une section sur les avantages et bénéfices offerts"],
        },
        optimized_analysis: {
          word_count: optimizedDescription.split(" ").length,
          attractive_keywords_found: 8,
          structure_score: 100,
          clarity_score: 85,
          attractiveness_score: 80,
          overall_score: 88,
          has_responsibilities: true,
          has_requirements: true,
          has_benefits: true,
          improvement_areas: [],
        },
        improvement_percentage: 22.2,
        optimization_level: optimizationLevel,
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Génère une description de poste à partir de zéro
   */
  async generateJobDescription(
    jobTitle: string,
    jobCategory = "tech",
    skillsRequired: string[] = [],
    companyInfo: Record<string, string> = {},
  ): Promise<JobGenerationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_title: jobTitle,
          job_category: jobCategory,
          skills_required: skillsRequired,
          company_info: companyInfo,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération de la description de poste: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de la génération de la description de poste:", error)

      // Mode dégradé: retourner une génération simulée
      const description = `# ${jobTitle}\n\n## À propos de ${companyInfo.name || "notre entreprise"}\n\n${companyInfo.description || "Une entreprise innovante dans son domaine."}\n\n## Description du poste\n\nNous recherchons un(e) ${jobTitle} talentueux(se) pour rejoindre notre équipe dynamique. Ce poste offre une opportunité unique de contribuer à des projets innovants et impactants.\n\n## Responsabilités\n\n- Développer et maintenir des solutions de haute qualité\n- Collaborer avec les équipes transversales pour atteindre les objectifs\n- Participer à l'amélioration continue des processus\n- Résoudre des problèmes complexes de manière créative\n- Contribuer à l'innovation et à la croissance de l'entreprise\n\n## Profil recherché\n\n${skillsRequired.map((skill) => `- ${skill}`).join("\n")}\n- Excellentes compétences en communication\n- Capacité à travailler en équipe\n- Autonomie et sens de l'initiative\n\n## Ce que nous offrons\n\n- Un environnement de travail dynamique et collaboratif\n- Des opportunités de développement professionnel\n- Un équilibre vie professionnelle/vie personnelle\n- Une rémunération compétitive\n- Des avantages sociaux attractifs\n\n## Comment postuler\n\nEnvoyez votre CV et une lettre de motivation à ${companyInfo.contact_email || "careers@company.com"}.`

      return {
        job_title: jobTitle,
        job_category: jobCategory,
        skills_required: skillsRequired,
        company_info: companyInfo,
        generated_description: description,
        analysis: {
          word_count: description.split(" ").length,
          attractive_keywords_found: 8,
          structure_score: 100,
          clarity_score: 90,
          attractiveness_score: 85,
          overall_score: 92,
          has_responsibilities: true,
          has_requirements: true,
          has_benefits: true,
          improvement_areas: [],
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Suggère des améliorations pour une description de poste
   */
  async suggestImprovements(jobDescription: string): Promise<JobSuggestionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_description: jobDescription }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la suggestion d'améliorations: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de la suggestion d'améliorations:", error)

      // Mode dégradé: retourner des suggestions simulées
      return {
        analysis: {
          word_count: jobDescription.split(" ").length,
          attractive_keywords_found: 3,
          structure_score: 70,
          clarity_score: 80,
          attractiveness_score: 65,
          overall_score: 72,
          has_responsibilities: true,
          has_requirements: true,
          has_benefits: false,
          improvement_areas: ["Ajouter une section sur les avantages et bénéfices offerts"],
        },
        suggestions: [
          "Ajouter une section sur les avantages et bénéfices offerts",
          "Utiliser plus de termes attractifs comme 'innovant', 'collaboratif', 'opportunité'",
          "Améliorer la clarté en utilisant des phrases plus courtes et directes",
          "Ajouter des exemples concrets de projets ou réalisations",
        ],
        timestamp: new Date().toISOString(),
      }
    }
  },
}
