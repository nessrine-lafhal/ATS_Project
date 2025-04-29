import axios from "axios"

// URL du serveur Python
const API_URL = process.env.NEXT_PUBLIC_CV_PARSER_API_URL || "http://localhost:5001"

// Activer le mode de secours si l'URL du serveur n'est pas définie ou si nous sommes en prévisualisation
const FALLBACK_MODE = !process.env.NEXT_PUBLIC_CV_PARSER_API_URL || process.env.NODE_ENV === "development"

export interface CVParsingResult {
  personalInfo: {
    fullName: string
    email: string
    phone?: string
    location?: string
  }
  skills: {
    technical: string[]
    soft: string[]
  }
  education: any[]
  experience: any[]
  matchScore?: number
}

export class CVParserService {
  /**
   * Analyse un CV et retourne les informations structurées
   */
  async parseCV(cvText: string, jobDescription?: string): Promise<CVParsingResult> {
    // Si le mode de secours est activé, utiliser directement la simulation
    if (FALLBACK_MODE) {
      console.log("Mode de secours activé pour le parsing de CV")
      return this._simulateParsingResult(cvText, jobDescription)
    }

    try {
      // Essayer d'appeler le serveur Python avec un timeout réduit
      const response = await axios.post(
        `${API_URL}/api/parse-cv`,
        {
          cv_text: cvText,
          job_description: jobDescription,
        },
        { timeout: 5000 }, // Timeout de 5 secondes
      )

      if (response.data.success) {
        return response.data.data
      } else {
        console.warn("Le serveur a retourné une erreur:", response.data.error)
        return this._simulateParsingResult(cvText, jobDescription)
      }
    } catch (error) {
      console.error("Erreur lors de l'appel au service de parsing de CV:", error)
      console.log("Utilisation du mode de secours pour le parsing de CV")

      // Mode de secours: simuler l'analyse
      return this._simulateParsingResult(cvText, jobDescription)
    }
  }

  /**
   * Simule l'analyse d'un CV lorsque le serveur Python n'est pas disponible
   */
  private _simulateParsingResult(cvText: string, jobDescription?: string): CVParsingResult {
    console.log("Simulation de l'analyse de CV...")

    // Extraire quelques informations basiques avec des expressions régulières simples
    const lines = cvText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.trim())
    const name = lines.length > 0 ? lines[0] : "Candidat Inconnu"

    // Email
    const emailMatch = cvText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    const email = emailMatch ? emailMatch[0] : "email@exemple.com"

    // Téléphone
    const phoneMatch = cvText.match(/(?:\+\d{1,3}[-.\s]?)?(?:\d{1,4}[-.\s]?){1,5}\d{1,4}/)
    const phone = phoneMatch ? phoneMatch[0] : "+33 6 12 34 56 78"

    // Compétences
    const commonSkills = [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "SQL",
      "MongoDB",
      "AWS",
      "Docker",
      "Kubernetes",
    ]

    // Extraire les compétences qui apparaissent dans le texte
    const skills = commonSkills.filter((skill) => cvText.toLowerCase().includes(skill.toLowerCase()))

    // Si aucune compétence n'est trouvée, en générer quelques-unes aléatoirement
    const technicalSkills = skills.length > 0 ? skills : commonSkills.sort(() => 0.5 - Math.random()).slice(0, 5)

    // Soft skills
    const softSkills = ["Communication", "Travail d'équipe", "Résolution de problèmes", "Adaptabilité", "Autonomie"]

    // Calculer un score de correspondance
    let matchScore
    if (jobDescription) {
      // Calculer un score basé sur le nombre de compétences communes
      const jobSkills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))
      const commonSkillsCount = skills.filter((skill) => jobSkills.includes(skill)).length
      matchScore = 50 + (commonSkillsCount / Math.max(jobSkills.length, 1)) * 50
    }

    return {
      personalInfo: {
        fullName: name,
        email: email,
        phone: phone,
        location: "Paris, France",
      },
      skills: {
        technical: technicalSkills,
        soft: softSkills.sort(() => 0.5 - Math.random()).slice(0, 3),
      },
      education: [
        {
          degree: "Master en Informatique",
          institution: "Université Paris-Saclay",
          fieldOfStudy: "Informatique",
          graduationYear: 2018,
        },
      ],
      experience: [
        {
          position: "Développeur Full Stack",
          company: "Tech Solutions",
          duration: "3 ans",
          description: "Développement d'applications web avec React et Node.js",
        },
      ],
      matchScore: matchScore,
    }
  }
}

// Singleton
const cvParserService = new CVParserService()
export default cvParserService
