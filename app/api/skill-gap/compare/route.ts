import { type NextRequest, NextResponse } from "next/server"
import { skillGapService } from "@/lib/skill-gap-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Vérifier les données requises
    if (!body.candidateResumes || !body.jobDescription) {
      return NextResponse.json(
        { error: "Les données requises sont manquantes. Veuillez fournir candidateResumes et jobDescription." },
        { status: 400 },
      )
    }

    // Comparer les candidats
    const result = await skillGapService.compareCandidates(body.candidateResumes, body.jobDescription)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la comparaison des candidats:", error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la comparaison des candidats." },
      { status: 500 },
    )
  }
}
