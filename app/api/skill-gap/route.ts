import { type NextRequest, NextResponse } from "next/server"
import { skillGapService } from "@/lib/skill-gap-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Vérifier les données requises
    if (!body.candidateResume || !body.jobDescription) {
      return NextResponse.json(
        { error: "Les données requises sont manquantes. Veuillez fournir candidateResume et jobDescription." },
        { status: 400 },
      )
    }

    // Analyser l'écart de compétences
    const result = await skillGapService.analyzeSkillGap(
      body.candidateResume,
      body.jobDescription,
      body.candidateId,
      body.jobId,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de l'analyse des écarts de compétences:", error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'analyse des écarts de compétences." },
      { status: 500 },
    )
  }
}
