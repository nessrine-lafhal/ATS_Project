import { type NextRequest, NextResponse } from "next/server"
import { generateForecastData } from "@/lib/talent-forecast-service"

export async function POST(req: NextRequest) {
  try {
    const { timeframe, department } = await req.json()

    // Validation des paramètres
    const validatedTimeframe = Number.parseInt(timeframe) || 12
    const validatedDepartment = department || "all"

    // Appel au service de prévision pour les données
    const forecastData = await generateForecastData(validatedTimeframe, validatedDepartment)

    return NextResponse.json({ success: true, data: forecastData })
  } catch (error) {
    console.error("Error generating forecast data:", error)
    return NextResponse.json({ success: false, error: "Failed to generate forecast data" }, { status: 500 })
  }
}
