import { type NextRequest, NextResponse } from "next/server"
import { InterviewGeneratorService } from "@/lib/interview-generator-service"

export async function POST(req: NextRequest) {
  try {
    const { job_title, scenarios, company_info } = await req.json()

    if (!job_title) {
      return NextResponse.json({ error: "Le titre du poste est requis" }, { status: 400 })
    }

    if (!scenarios) {
      return NextResponse.json({ error: "Les scénarios d'entretien sont requis" }, { status: 400 })
    }

    const result = await InterviewGeneratorService.generateInterviewScript(job_title, scenarios, company_info || {})

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erreur lors de la génération du script d'entretien:", error)
    return NextResponse.json({ error: "Erreur lors de la génération du script d'entretien" }, { status: 500 })
  }
}
