import { type NextRequest, NextResponse } from "next/server"
import { trainPerformanceModel } from "@/lib/performance-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { data, target_column } = await req.json()

    if (!data) {
      return NextResponse.json({ success: false, error: "No training data provided" }, { status: 400 })
    }

    const result = await trainPerformanceModel(data, target_column)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error training performance model:", error)
    return NextResponse.json({ success: false, error: "Failed to train performance model" }, { status: 500 })
  }
}
