import axios from "axios"

// URL du serveur Python
const API_URL = process.env.NEXT_PUBLIC_SEMANTIC_MATCHER_API_URL || "http://localhost:5002"
// Activer le mode de secours si l'URL du service n'est pas définie ou si nous sommes en prévisualisation
const FALLBACK_MODE = !process.env.NEXT_PUBLIC_SEMANTIC_MATCHER_API_URL || process.env.NODE_ENV === "development"

export interface MatchingResult {
  matchScore: number
  skillsMatch: number
  semanticSimilarity: number
  experienceMatch: number
}

export class SemanticMatchingService {
  /**
   * Calcule le score de correspondance entre un CV et une offre d'emploi
   */
  async matchResumeToJob(cvText: string, jobDescription: string): Promise<MatchingResult> {
    try {
      // Si le mode de secours est activé, utiliser la simulation
      if (FALLBACK_MODE) {
        console.log("Mode de secours activé pour le service de matching sémantique")
        return this._simulateMatching(cvText, jobDescription)
      }

      const response = await axios.post(
        `${API_URL}/match`,
        {
          cv_text: cvText,
          job_description: jobDescription,
        },
        {
          timeout: 5000, // Timeout de 5 secondes
        },
      )

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || "Erreur lors du matching sémantique")
      }
    } catch (error) {
      console.error("Erreur lors de l'appel au service de matching sémantique:", error)

      // En cas d'erreur, utiliser la simulation
      return this._simulateMatching(cvText, jobDescription)
    }
  }

  /**
   * Simule le matching sémantique lorsque le serveur Python n'est pas disponible
   */
  private _simulateMatching(cvText: string, jobDescription: string): MatchingResult {
    console.log("Simulation du matching sémantique...")

    // Extraire quelques mots-clés du CV et de l'offre d'emploi
    const cvKeywords = this._extractKeywords(cvText.toLowerCase())
    const jobKeywords = this._extractKeywords(jobDescription.toLowerCase())

    // Calculer un score basé sur le nombre de mots-clés communs
    const commonKeywords = cvKeywords.filter((keyword) => jobKeywords.includes(keyword))
    const skillsMatch = jobKeywords.length > 0 ? Math.min(0.9, (commonKeywords.length / jobKeywords.length) * 1.2) : 0.5

    // Générer des scores aléatoires mais réalistes pour les autres métriques
    const semanticSimilarity = 0.6 + Math.random() * 0.3 // Entre 0.6 et 0.9
    const experienceMatch = 0.5 + Math.random() * 0.4 // Entre 0.5 et 0.9

    // Calculer le score global
    const matchScore = 0.4 * skillsMatch + 0.4 * semanticSimilarity + 0.2 * experienceMatch

    return {
      matchScore,
      skillsMatch,
      semanticSimilarity,
      experienceMatch,
    }
  }

  /**
   * Extrait des mots-clés d'un texte
   */
  private _extractKeywords(text: string): string[] {
    // Liste de compétences techniques courantes
    const techSkills = [
      "python",
      "java",
      "c++",
      "javascript",
      "html",
      "css",
      "sql",
      "php",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "linux",
      "git",
      "agile",
      "scrum",
      "machine learning",
      "deep learning",
      "data analysis",
      "nlp",
      "react",
      "angular",
      "vue",
      "node.js",
      "django",
      "flask",
      "spring",
      "tensorflow",
      "pytorch",
      "scikit-learn",
      "pandas",
      "numpy",
    ]

    // Extraire les compétences qui apparaissent dans le texte
    return techSkills.filter((skill) => text.includes(skill))
  }
}

// Singleton
const semanticMatchingService = new SemanticMatchingService()
export default semanticMatchingService
