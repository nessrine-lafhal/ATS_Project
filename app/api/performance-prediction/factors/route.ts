import { NextResponse } from "next/server"
import { getPerformanceFactors } from "@/lib/performance-prediction-service"

export async function GET() {
  try {
    const result = await getPerformanceFactors()

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error getting performance factors:", error)
    return NextResponse.json({ success: false, error: "Failed to get performance factors" }, { status: 500 })
  }
}
