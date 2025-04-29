import { type NextRequest, NextResponse } from "next/server"
import { predictRecruitmentCost } from "@/lib/cost-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { recruitmentData, modelType } = await req.json()

    // Validation des données
    if (
      !recruitmentData ||
      !recruitmentData.channel ||
      !recruitmentData.position_level ||
      !recruitmentData.department
    ) {
      return NextResponse.json({ success: false, error: "Données de recrutement incomplètes" }, { status: 400 })
    }

    // Appel au service de prédiction
    const predictionResult = await predictRecruitmentCost(recruitmentData, modelType)

    return NextResponse.json({ success: true, data: predictionResult })
  } catch (error) {
    console.error("Error predicting recruitment cost:", error)
    return NextResponse.json({ success: false, error: "Failed to predict recruitment cost" }, { status: 500 })
  }
}
