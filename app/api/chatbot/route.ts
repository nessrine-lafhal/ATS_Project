import { type NextRequest, NextResponse } from "next/server"
import { ChatbotService, getChatbotService } from "@/lib/chatbot-service"

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Use the chatbot service
    const chatbotService = sessionId ? new ChatbotService(sessionId) : getChatbotService()

    const response = await chatbotService.sendMessage(message)

    return NextResponse.json({
      success: true,
      data: {
        message: response.message,
        timestamp: response.timestamp,
        intent: response.intent,
        confidence: response.confidence,
        sessionId: chatbotService.getSessionId(),
      },
    })
  } catch (error) {
    console.error("Error processing chatbot message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")
    const type = searchParams.get("type") || "evaluation"

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    const chatbotService = new ChatbotService(sessionId)

    if (type === "history") {
      const history = await chatbotService.getConversationHistory()
      return NextResponse.json({
        success: true,
        data: history,
      })
    } else {
      const evaluation = await chatbotService.getEvaluation()

      if (!evaluation) {
        return NextResponse.json(
          {
            success: false,
            error: "Evaluation not found",
            fallback: true,
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        data: evaluation,
      })
    }
  } catch (error) {
    console.error("Error getting chatbot data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
