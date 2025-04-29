import { type NextRequest, NextResponse } from "next/server"
import { generateTalentForecast } from "@/lib/talent-forecast-service"

export async function POST(req: NextRequest) {
  try {
    const { timeframe, department, growthFactor } = await req.json()

    // Validation des paramètres
    const validatedTimeframe = Number.parseInt(timeframe) || 12
    const validatedGrowthFactor = Number.parseInt(growthFactor) || 15
    const validatedDepartment = department || "all"

    // Appel au service de prévision
    const forecastResult = await generateTalentForecast(validatedTimeframe, validatedDepartment, validatedGrowthFactor)

    return NextResponse.json({ success: true, data: forecastResult })
  } catch (error) {
    console.error("Error generating talent forecast:", error)
    return NextResponse.json({ success: false, error: "Failed to generate talent forecast" }, { status: 500 })
  }
}
