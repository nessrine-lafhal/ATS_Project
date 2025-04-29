import { type NextRequest, NextResponse } from "next/server"
import semanticMatchingService from "@/lib/semantic-matching-service"

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobDescription } = await req.json()

    if (!cvText || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Le texte du CV et la description du poste sont requis" },
        { status: 400 },
      )
    }

    // Calculer le score de correspondance
    const matchingResult = await semanticMatchingService.matchResumeToJob(cvText, jobDescription)

    return NextResponse.json({
      success: true,
      data: matchingResult,
    })
  } catch (error) {
    console.error("Error in semantic matching:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform semantic matching",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
