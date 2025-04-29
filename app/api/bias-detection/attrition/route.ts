import { type NextRequest, NextResponse } from "next/server"
import { predictAttritionRetention } from "@/lib/bias-detection-service"

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json()

    if (!data) {
      return NextResponse.json({ success: false, error: "No employee data provided" }, { status: 400 })
    }

    const result = await predictAttritionRetention(data)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error predicting attrition:", error)
    return NextResponse.json({ success: false, error: "Failed to predict attrition" }, { status: 500 })
  }
}
