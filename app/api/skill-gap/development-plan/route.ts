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

    // Générer le plan de développement
    const result = await skillGapService.generateDevelopmentPlan(
      body.candidateResume,
      body.jobDescription,
      body.timeframeWeeks,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la génération du plan de développement:", error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la génération du plan de développement." },
      { status: 500 },
    )
  }
}
