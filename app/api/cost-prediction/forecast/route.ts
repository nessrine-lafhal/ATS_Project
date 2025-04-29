import { type NextRequest, NextResponse } from "next/server"
import { forecastRecruitmentCosts } from "@/lib/cost-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { historicalData, periods, freq } = await req.json()

    // Validation des paramètres
    const validatedPeriods = Number.parseInt(periods) || 12
    const validatedFreq = freq || "M"

    // Appel au service de prévision
    const forecastResult = await forecastRecruitmentCosts(historicalData, validatedPeriods, validatedFreq)

    return NextResponse.json({ success: true, data: forecastResult })
  } catch (error) {
    console.error("Error forecasting recruitment costs:", error)
    return NextResponse.json({ success: false, error: "Failed to forecast recruitment costs" }, { status: 500 })
  }
}
