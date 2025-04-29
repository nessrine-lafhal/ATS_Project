import { type NextRequest, NextResponse } from "next/server"
import { auditRecruitmentData } from "@/lib/bias-detection-service"

export async function POST(req: NextRequest) {
  try {
    const { data, protectedAttributes, outcomeColumn } = await req.json()

    if (!data || !protectedAttributes) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    const result = await auditRecruitmentData(data, protectedAttributes, outcomeColumn)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error auditing recruitment data:", error)
    return NextResponse.json({ success: false, error: "Failed to audit recruitment data" }, { status: 500 })
  }
}
