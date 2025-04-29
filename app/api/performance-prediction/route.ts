import { type NextRequest, NextResponse } from "next/server"
import { predictPerformance } from "@/lib/performance-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json()

    if (!data) {
      return NextResponse.json({ success: false, error: "No candidate data provided" }, { status: 400 })
    }

    const result = await predictPerformance(data)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error predicting performance:", error)
    return NextResponse.json({ success: false, error: "Failed to predict performance" }, { status: 500 })
  }
}
