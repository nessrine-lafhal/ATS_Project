import { type NextRequest, NextResponse } from "next/server"
import { analyzeRecruitmentChannels } from "@/lib/cost-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { channelData } = await req.json()

    // Appel au service d'analyse
    const analysisResult = await analyzeRecruitmentChannels(channelData)

    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error("Error analyzing recruitment channels:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze recruitment channels" }, { status: 500 })
  }
}
