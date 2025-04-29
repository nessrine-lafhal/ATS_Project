import { type NextRequest, NextResponse } from "next/server"
import { trainForecastModels } from "@/lib/talent-forecast-service"

export async function POST(req: NextRequest) {
  try {
    const { historicalData } = await req.json()

    // Validation des données
    if (!Array.isArray(historicalData) || historicalData.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid historical data provided" }, { status: 400 })
    }

    // Appel au service d'entraînement
    const trainingResult = await trainForecastModels(historicalData)

    return NextResponse.json({ success: true, data: trainingResult })
  } catch (error) {
    console.error("Error training forecast models:", error)
    return NextResponse.json({ success: false, error: "Failed to train forecast models" }, { status: 500 })
  }
}
