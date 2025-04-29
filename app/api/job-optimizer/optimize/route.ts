import { type NextRequest, NextResponse } from "next/server"
import { JobOptimizerService } from "@/lib/job-optimizer-service"

export async function POST(req: NextRequest) {
  try {
    const { job_description, job_category, optimization_level } = await req.json()

    if (!job_description) {
      return NextResponse.json({ error: "La description de poste est requise" }, { status: 400 })
    }

    const result = await JobOptimizerService.optimizeJobDescription(
      job_description,
      job_category || "tech",
      optimization_level || "medium",
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erreur lors de l'optimisation de la description de poste:", error)
    return NextResponse.json({ error: "Erreur lors de l'optimisation de la description de poste" }, { status: 500 })
  }
}
