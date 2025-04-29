import { type NextRequest, NextResponse } from "next/server"
import { detectBiasInText } from "@/lib/bias-detection-service"

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ success: false, error: "No text provided" }, { status: 400 })
    }

    const analysisResult = await detectBiasInText(text)

    return NextResponse.json({ success: true, data: analysisResult })
  } catch (error) {
    console.error("Error detecting bias:", error)
    return NextResponse.json({ success: false, error: "Failed to detect bias" }, { status: 500 })
  }
}
