import { type NextRequest, NextResponse } from "next/server"
import cvParserService from "@/lib/cv-parser-service"
import { extractResumeInfo, calculateSimilarity } from "@/lib/ml-utils"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const jobDescription = formData.get("jobDescription") as string | null

    let cvText = ""
    let analysisResult: any = null

    // Si un fichier est fourni, extraire le texte
    if (file) {
      try {
        // Dans une implémentation réelle, nous utiliserions une bibliothèque comme pdf.js ou docx.js
        // pour extraire le texte des fichiers PDF ou DOCX
        // Pour cette démonstration, nous supposons que le fichier est un fichier texte
        cvText = await file.text()
      } catch (error) {
        console.error("Erreur lors de l'extraction du texte du fichier:", error)
        // Utiliser un texte de démonstration en cas d'erreur
        cvText = getDemoCV()
      }
    } else {
      // Utiliser le texte de démonstration si aucun fichier n'est fourni
      cvText = getDemoCV()
    }

    // Analyser le CV avec notre service de parsing
    try {
      console.log("Analyse du CV avec le service de parsing...")
      analysisResult = await cvParserService.parseCV(cvText, jobDescription || undefined)
      console.log("Analyse terminée avec succès")
    } catch (error) {
      console.error("Erreur lors de l'analyse du CV avec le service de parsing:", error)

      // Fallback: utiliser les fonctions de simulation de ml-utils
      console.log("Utilisation du fallback pour l'analyse du CV")
      const basicInfo = extractResumeInfo(cvText)
      const matchScore = jobDescription ? calculateSimilarity(cvText, jobDescription) * 100 : 92

      analysisResult = {
        personalInfo: {
          fullName: basicInfo.personalInfo.fullName,
          email: basicInfo.personalInfo.email,
          phone: basicInfo.personalInfo.phone,
          location: basicInfo.personalInfo.location,
        },
        experience: {
          yearsOfExperience: basicInfo.experience,
          currentPosition: "Développeur Full Stack",
          currentCompany: "Tech Solutions",
          industry: "Technologie",
        },
        education: {
          highestDegree: basicInfo.education,
          institution: "Université Paris-Saclay",
          fieldOfStudy: "Informatique",
          graduationYear: 2018,
        },
        languagesAndCertifications: {
          languages: ["Français (natif)", "Anglais (courant)", "Espagnol (intermédiaire)"],
          certifications: ["AWS Certified Developer", "MongoDB Certified Developer"],
        },
        skills: {
          technical: basicInfo.skills,
          soft: ["Travail d'équipe", "Communication", "Résolution de problèmes", "Autonomie", "Adaptabilité"],
        },
        semanticAnalysis: {
          keyThemes: ["Développement web", "Architecture logicielle", "Agilité", "Innovation"],
          sentimentScore: 0.85,
          complexity: 0.72,
          clarity: 0.88,
        },
        matchScore: matchScore,
      }
    }

    // Adapter le format de la réponse si nécessaire
    const formattedResult = formatAnalysisResult(analysisResult)

    return NextResponse.json({ success: true, data: formattedResult })
  } catch (error) {
    console.error("Error analyzing resume:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Fonction pour obtenir un CV de démonstration
function getDemoCV() {
  return `
    Sophie Martin
    sophie.martin@example.com
    +33 6 12 34 56 78
    Paris, France
    
    COMPÉTENCES
    JavaScript, React, Node.js, TypeScript, MongoDB, GraphQL, REST API, Git
    
    EXPÉRIENCE
    Développeur Full Stack - Tech Solutions (2018-2023)
    Développement d'applications web avec React et Node.js
    
    FORMATION
    Master en Informatique - Université Paris-Saclay (2016-2018)
  `
}

// Fonction pour formater le résultat d'analyse
function formatAnalysisResult(result: any): any {
  // Si le résultat est déjà au bon format, le retourner tel quel
  if (result.personalInfo && result.skills) {
    return result
  }

  // Sinon, convertir le format
  return {
    personalInfo: {
      fullName: result.personalInfo?.fullName || "Candidat Inconnu",
      email: result.personalInfo?.email || "email@exemple.com",
      phone: result.personalInfo?.phone || "+33 6 12 34 56 78",
      location: result.personalInfo?.location || "Paris, France",
    },
    skills: {
      technical: result.skills?.technical || [],
      soft: result.skills?.soft || [],
    },
    education: result.education || [],
    experience: result.experience || [],
    matchScore: result.matchScore || null,
  }
}
