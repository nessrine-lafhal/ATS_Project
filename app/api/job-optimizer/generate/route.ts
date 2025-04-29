import { type NextRequest, NextResponse } from "next/server"
import { JobOptimizerService } from "@/lib/job-optimizer-service"

export async function POST(req: NextRequest) {
  try {
    const { job_title, job_category, skills_required, company_info } = await req.json()

    if (!job_title) {
      return NextResponse.json({ error: "Le titre du poste est requis" }, { status: 400 })
    }

    const result = await JobOptimizerService.generateJobDescription(
      job_title,
      job_category || "tech",
      skills_required || [],
      company_info || {},
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erreur lors de la génération de la description de poste:", error)
    return NextResponse.json({ error: "Erreur lors de la génération de la description de poste" }, { status: 500 })
  }
}
