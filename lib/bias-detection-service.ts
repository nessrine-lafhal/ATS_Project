/**
 * Service pour communiquer avec le serveur de détection des biais
 */

// Types pour les résultats de détection de biais
export interface BiasedTerm {
  term: string
  category: "gender" | "age" | "cultural" | "language"
  suggestion: string
  severity: "low" | "medium" | "high"
}

export interface BiasDetectionResult {
  genderBias: number
  ageBias: number
  culturalBias: number
  languageBias: number
  overallBias: number
  biasedTerms: BiasedTerm[]
  diversityScore: number
  recommendations: string[]
  improvedText: string
}

export interface AuditResult {
  demographic_parity: Record<string, number>
  equalized_odds: Record<string, number>
  disparate_impact: Record<string, number>
  statistical_parity_difference: Record<string, number>
  overall_bias_metrics: {
    fairness_score: number
    bias_risk_level: "low" | "medium" | "high"
    recommendations: string[]
  }
}

export interface AttritionPredictionResult {
  overall_attrition_risk: number
  attrition_risk_factors: Record<string, number>
  department_attrition: Record<string, number>
  retention_strategies: string[]
  retention_score: number
}

// URL du serveur de détection des biais
const BIAS_DETECTION_SERVER_URL = process.env.BIAS_DETECTION_SERVER_URL || "http://localhost:5004"

/**
 * Détecte les biais dans un texte
 * @param text Texte à analyser
 * @returns Résultats de la détection de biais
 */
export async function detectBiasInText(text: string): Promise<BiasDetectionResult> {
  try {
    const response = await fetch(`${BIAS_DETECTION_SERVER_URL}/detect-bias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Failed to detect bias")
    }

    return result.data
  } catch (error) {
    console.error("Error detecting bias:", error)

    // Fallback: retourner des résultats simulés en cas d'erreur
    return {
      genderBias: 0.32,
      ageBias: 0.18,
      culturalBias: 0.09,
      languageBias: 0.24,
      overallBias: 0.21,
      biasedTerms: [
        { term: "ninja", category: "gender", suggestion: "expert", severity: "medium" },
        { term: "jeune et dynamique", category: "age", suggestion: "motivé et dynamique", severity: "high" },
        { term: "maîtriser", category: "language", suggestion: "avoir une bonne connaissance de", severity: "low" },
        { term: "5+ ans d'expérience", category: "age", suggestion: "expérience significative", severity: "medium" },
      ],
      recommendations: [
        "Remplacer les termes genrés par des alternatives neutres",
        "Éviter les références à l'âge ou à l'expérience spécifique",
        "Utiliser un langage inclusif et accessible",
        "Se concentrer sur les compétences plutôt que sur les attributs personnels",
      ],
      diversityScore: 68,
      improvedText:
        "Nous recherchons un expert du code, motivé et dynamique, pour rejoindre notre équipe talentueuse. Le candidat idéal doit avoir une bonne connaissance de JavaScript et une expérience significative dans le développement web. Vous devez être capable de travailler efficacement en équipe et dans un environnement collaboratif. Une bonne adaptation à notre culture d'entreprise est appréciée.",
    }
  }
}

/**
 * Audite les données de recrutement pour détecter les biais
 * @param data Données de recrutement
 * @param protectedAttributes Attributs protégés
 * @param outcomeColumn Colonne de résultat
 * @returns Résultats de l'audit
 */
export async function auditRecruitmentData(
  data: any[],
  protectedAttributes: string[],
  outcomeColumn: string,
): Promise<AuditResult> {
  try {
    const response = await fetch(`${BIAS_DETECTION_SERVER_URL}/audit-recruitment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        protected_attributes: protectedAttributes,
        outcome_column: outcomeColumn,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Failed to audit recruitment data")
    }

    return result.data
  } catch (error) {
    console.error("Error auditing recruitment data:", error)

    // Fallback: retourner des résultats simulés en cas d'erreur
    return {
      demographic_parity: {
        gender: 0.85,
        age: 0.78,
        ethnicity: 0.82,
      },
      equalized_odds: {
        gender: 0.82,
        age: 0.75,
        ethnicity: 0.8,
      },
      disparate_impact: {
        gender: 0.88,
        age: 0.82,
        ethnicity: 0.85,
      },
      statistical_parity_difference: {
        gender: 0.12,
        age: 0.18,
        ethnicity: 0.15,
      },
      overall_bias_metrics: {
        fairness_score: 75,
        bias_risk_level: "medium",
        recommendations: [
          "Mettre en place des comités de recrutement diversifiés",
          "Standardiser les questions d'entretien pour tous les candidats",
          "Utiliser des tests techniques anonymisés",
          "Former les recruteurs à la reconnaissance des biais inconscients",
        ],
      },
    }
  }
}

/**
 * Prédit l'attrition et la rétention des employés
 * @param employeeData Données des employés
 * @returns Prédictions d'attrition et de rétention
 */
export async function predictAttritionRetention(employeeData: any[]): Promise<AttritionPredictionResult> {
  try {
    const response = await fetch(`${BIAS_DETECTION_SERVER_URL}/predict-attrition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: employeeData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Failed to predict attrition")
    }

    return result.data
  } catch (error) {
    console.error("Error predicting attrition:", error)

    // Fallback: retourner des résultats simulés en cas d'erreur
    return {
      overall_attrition_risk: 0.18,
      attrition_risk_factors: {
        compensation: 0.35,
        work_life_balance: 0.42,
        career_growth: 0.28,
        job_satisfaction: 0.22,
        relationship_with_manager: 0.31,
      },
      department_attrition: {
        engineering: 0.15,
        sales: 0.22,
        marketing: 0.12,
        customer_support: 0.25,
        hr: 0.08,
      },
      retention_strategies: [
        "Mettre en place des programmes de développement de carrière",
        "Revoir la politique de rémunération et d'avantages sociaux",
        "Améliorer l'équilibre vie professionnelle/personnelle",
        "Renforcer la culture d'entreprise et la reconnaissance",
        "Former les managers aux techniques de leadership inclusif",
      ],
      retention_score: 78,
    }
  }
}
