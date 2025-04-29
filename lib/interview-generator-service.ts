import type { InterviewScenarioResult, InterviewScriptResult } from "./types"

const API_BASE_URL = process.env.INTERVIEW_GENERATOR_SERVER_URL || "http://localhost:5005"

/**
 * Service pour la génération de scénarios d'entretien personnalisés
 */
export const InterviewGeneratorService = {
  /**
   * Génère des scénarios d'entretien personnalisés
   */
  async generateInterviewScenarios(
    jobDescription: string,
    candidateProfile: Record<string, any> = {},
    companyInfo: Record<string, string> = {},
    scenarioTypes: string[] = ["technical", "behavioral", "situational", "roleplay"],
    numQuestions = 5,
  ): Promise<InterviewScenarioResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
          candidate_profile: candidateProfile,
          company_info: companyInfo,
          scenario_types: scenarioTypes,
          num_questions: numQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération des scénarios d'entretien: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de la génération des scénarios d'entretien:", error)

      // Mode dégradé: retourner des scénarios simulés
      const jobCategory = jobDescription.toLowerCase().includes("développeur") ? "tech" : "general"
      const keySkills =
        jobCategory === "tech"
          ? ["JavaScript", "React", "Node.js", "SQL", "Git"]
          : ["Communication", "Analyse", "Gestion de projet", "Travail d'équipe"]

      return {
        job_category: jobCategory,
        key_skills: keySkills,
        key_responsibilities: [
          "Développer et maintenir des applications",
          "Collaborer avec les équipes produit",
          "Participer à l'amélioration continue",
        ],
        scenarios: {
          technical: [
            "Décrivez votre expérience avec JavaScript et React.",
            "Comment optimiseriez-vous les performances d'une application web?",
            "Quelle est votre approche pour assurer la sécurité des données?",
            "Expliquez comment vous utilisez Git dans votre workflow.",
            "Comment déboguez-vous une application qui ne fonctionne pas correctement?",
          ],
          behavioral: [
            "Décrivez une situation où vous avez dû résoudre un conflit au sein d'une équipe.",
            "Parlez-moi d'un moment où vous avez fait preuve d'initiative.",
            "Comment gérez-vous les délais serrés et la pression?",
            "Donnez un exemple de situation où vous avez dû apprendre rapidement une nouvelle technologie.",
            "Racontez une expérience où vous avez dû vous adapter à un changement inattendu.",
          ],
          situational: [
            "Comment réagiriez-vous si vous découvriez un bug critique juste avant une mise en production?",
            "Que feriez-vous si un membre clé de l'équipe quittait le projet en plein développement?",
            "Comment procéderiez-vous si vous deviez reprendre un projet mal documenté?",
            "Quelle serait votre approche si vous étiez en désaccord avec la direction technique prise par votre équipe?",
            "Comment géreriez-vous une situation où les exigences du projet changent significativement en cours de route?",
          ],
          roleplay: [
            {
              title: "Explication technique à un client non technique",
              description:
                "Vous devez expliquer un problème technique complexe à un client qui n'a pas de connaissances techniques. Comment procédez-vous pour vous assurer qu'il comprend les enjeux?",
              evaluation_criteria:
                "Clarté de la communication, capacité à vulgariser, empathie, vérification de la compréhension",
            },
            {
              title: "Résolution de problème en équipe",
              description:
                "Votre équipe est bloquée sur un bug critique qui affecte la production. Comment organisez-vous la résolution du problème?",
              evaluation_criteria:
                "Méthodologie de résolution de problèmes, collaboration, gestion du stress, communication",
            },
            {
              title: "Revue de code avec un développeur junior",
              description:
                "Vous devez faire une revue de code avec un développeur junior qui a commis plusieurs erreurs. Comment abordez-vous cette situation?",
              evaluation_criteria: "Pédagogie, feedback constructif, patience, capacité à mentorer",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Génère un script d'entretien complet
   */
  async generateInterviewScript(
    jobTitle: string,
    scenarios: Record<string, any>,
    companyInfo: Record<string, string> = {},
  ): Promise<InterviewScriptResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_title: jobTitle,
          scenarios: scenarios,
          company_info: companyInfo,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du script d'entretien: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Erreur lors de la génération du script d'entretien:", error)

      // Mode dégradé: retourner un script simulé
      const script =
        `# Script d'entretien pour le poste de ${jobTitle}\n\n` +
        `## Introduction\n\n` +
        `Bonjour et bienvenue chez ${companyInfo.name || "notre entreprise"}. ` +
        `Je m'appelle [Nom de l'intervieweur] et je suis [Poste de l'intervieweur]. ` +
        `Nous sommes ravis de vous rencontrer aujourd'hui pour discuter du poste de ${jobTitle}.\n\n` +
        `## Questions techniques\n\n` +
        `1. Pouvez-vous décrire votre expérience avec les technologies requises pour ce poste?\n` +
        `   - [Noter les points clés de la réponse]\n` +
        `   - [Points à approfondir si nécessaire]\n\n` +
        `2. Comment abordez-vous [tâche technique spécifique au poste]?\n` +
        `   - [Noter les points clés de la réponse]\n` +
        `   - [Points à approfondir si nécessaire]\n\n` +
        `## Questions comportementales\n\n` +
        `1. Décrivez une situation où vous avez dû résoudre un problème complexe.\n` +
        `   - [Noter les points clés de la réponse]\n` +
        `   - [Points à approfondir si nécessaire]\n\n` +
        `2. Comment gérez-vous les délais serrés et la pression?\n` +
        `   - [Noter les points clés de la réponse]\n` +
        `   - [Points à approfondir si nécessaire]\n\n` +
        `## Conclusion\n\n` +
        `Merci pour cet entretien. Nous vous recontacterons prochainement pour vous informer de la suite du processus.\n`

      return { script }
    }
  },
}
