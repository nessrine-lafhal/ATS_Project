import { type NextRequest, NextResponse } from "next/server"
import { predictFutureAttrition } from "@/lib/attrition-prediction-service"

export async function POST(req: NextRequest) {
  try {
    const { data, months } = await req.json()

    if (!data) {
      return NextResponse.json({ success: false, error: "No employee data provided" }, { status: 400 })
    }

    const result = await predictFutureAttrition(data, months || 12)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error predicting future attrition:", error)
    return NextResponse.json({ success: false, error: "Failed to predict future attrition" }, { status: 500 })
  }
}
