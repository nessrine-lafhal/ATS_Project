import { type NextRequest, NextResponse } from "next/server"
import { InterviewGeneratorService } from "@/lib/interview-generator-service"

export async function POST(req: NextRequest) {
  try {
    const { job_description, candidate_profile, company_info, scenario_types, num_questions } = await req.json()

    if (!job_description) {
      return NextResponse.json({ error: "La description de poste est requise" }, { status: 400 })
    }

    const result = await InterviewGeneratorService.generateInterviewScenarios(
      job_description,
      candidate_profile || {},
      company_info || {},
      scenario_types || ["technical", "behavioral", "situational", "roleplay"],
      num_questions || 5,
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erreur lors de la génération des scénarios d'entretien:", error)
    return NextResponse.json({ error: "Erreur lors de la génération des scénarios d'entretien" }, { status: 500 })
  }
}
