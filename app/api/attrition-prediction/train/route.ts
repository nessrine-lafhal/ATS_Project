import { type NextRequest, NextResponse } from "next/server"
import { trainAttritionModel } from "@/lib/attrition-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { data, targetColumn } = await req.json()

    if (!data) {
      return NextResponse.json({ success: false, error: "No training data provided" }, { status: 400 })
    }

    const result = await trainAttritionModel(data, targetColumn)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error training attrition model:", error)
    return NextResponse.json({ success: false, error: "Failed to train attrition model" }, { status: 500 })
  }
}
