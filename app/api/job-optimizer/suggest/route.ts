import { type NextRequest, NextResponse } from "next/server"
import { JobOptimizerService } from "@/lib/job-optimizer-service"

export async function POST(req: NextRequest) {
  try {
    const { job_description } = await req.json()

    if (!job_description) {
      return NextResponse.json({ error: "La description de poste est requise" }, { status: 400 })
    }

    const result = await JobOptimizerService.suggestImprovements(job_description)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Erreur lors de la suggestion d'améliorations:", error)
    return NextResponse.json({ error: "Erreur lors de la suggestion d'améliorations" }, { status: 500 })
  }
}
