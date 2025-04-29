import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "http://localhost:5000"
// Enable fallback mode if chatbot API URL is not defined or if we're in preview
const FALLBACK_MODE = !process.env.NEXT_PUBLIC_CHATBOT_API_URL || process.env.NODE_ENV === "development"

export interface ChatbotResponse {
  message: string
  timestamp: string
  intent?: string
  confidence?: number
}

export interface ChatMessage {
  role: "user" | "bot"
  content: string
  timestamp: string
}

export class ChatbotService {
  private sessionId: string
  private conversationHistory: ChatMessage[] = []

  constructor(sessionId?: string) {
    this.sessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  async sendMessage(message: string): Promise<ChatbotResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    })

    try {
      // If fallback mode is enabled, use simulation
      if (FALLBACK_MODE) {
        return this.simulateResponse(message)
      }

      const response = await axios.post(`${API_URL}/webhook`, {
        sender: this.sessionId,
        message,
      })

      if (response.data && response.data.length > 0) {
        const botResponse = {
          message: response.data[0].text,
          timestamp: new Date().toISOString(),
          intent: response.data[0].intent || "unknown",
          confidence: response.data[0].confidence || 0,
        }

        // Add bot response to history
        this.conversationHistory.push({
          role: "bot",
          content: botResponse.message,
          timestamp: botResponse.timestamp,
        })

        return botResponse
      }

      throw new Error("Invalid response from chatbot")
    } catch (error) {
      console.error("Error sending message to chatbot:", error)

      // In case of error, use simulation
      return this.simulateResponse(message)
    }
  }

  private simulateResponse(message: string): ChatbotResponse {
    console.log("Using fallback mode for chatbot responses")

    // Simple logic to simulate responses based on keywords
    let response = ""
    const lowerMessage = message.toLowerCase()

    if (this.conversationHistory.length <= 1) {
      response = "Bonjour ! Je suis l'assistant de recrutement virtuel. Comment vous appelez-vous ?"
    } else if (this.conversationHistory.length === 3) {
      response = "Ravi de vous rencontrer. Combien d'années d'expérience avez-vous dans ce domaine ?"
    } else if (lowerMessage.includes("expérience") || /\d+\s*(an|année)/.test(lowerMessage)) {
      response = "Très bien. Quelles sont vos principales compétences techniques ?"
    } else if (
      lowerMessage.includes("compétence") ||
      lowerMessage.includes("javascript") ||
      lowerMessage.includes("python")
    ) {
      response = "Impressionnant ! Pouvez-vous me parler de votre formation ?"
    } else if (
      lowerMessage.includes("formation") ||
      lowerMessage.includes("diplôme") ||
      lowerMessage.includes("master")
    ) {
      response = "Qu'est-ce qui vous motive à postuler pour ce poste ?"
    } else if (lowerMessage.includes("motiv") || lowerMessage.includes("intéress")) {
      response = "Merci pour toutes ces informations. Avez-vous des questions concernant le poste ou l'entreprise ?"
    } else if (lowerMessage.includes("salaire") || lowerMessage.includes("rémunération")) {
      response = "La fourchette de salaire pour ce poste est entre 45000 et 60000 euros selon l'expérience."
    } else if (
      lowerMessage.includes("question") ||
      lowerMessage.includes("entreprise") ||
      lowerMessage.includes("poste")
    ) {
      response =
        "Merci pour cet échange ! J'ai enregistré vos réponses et notre équipe de recrutement les analysera. Nous vous recontacterons prochainement pour la suite du processus."
    } else {
      response =
        "Merci pour cette information. Pourriez-vous me parler de vos motivations pour rejoindre notre entreprise et ce qui vous intéresse dans ce poste en particulier ?"
    }

    // Add simulated response to history
    const timestamp = new Date().toISOString()
    this.conversationHistory.push({
      role: "bot",
      content: response,
      timestamp,
    })

    return {
      message: response,
      timestamp,
      intent: "simulated_response",
      confidence: 0.9,
    }
  }

  async getEvaluation(): Promise<any | null> {
    try {
      // If fallback mode is enabled, generate a simulated evaluation
      if (FALLBACK_MODE) {
        return this.simulateEvaluation()
      }

      const response = await axios.get(`${API_URL}/evaluation/${this.sessionId}`)
      return response.data
    } catch (error) {
      console.error("Error getting evaluation:", error)

      // In case of error, generate a simulated evaluation
      return this.simulateEvaluation()
    }
  }

  async getConversationHistory(): Promise<ChatMessage[]> {
    try {
      // If fallback mode is enabled or we already have the history in memory, return it
      if (FALLBACK_MODE || this.conversationHistory.length > 0) {
        return this.conversationHistory
      }

      // Otherwise, fetch from the server
      const response = await axios.get(`${API_URL}/conversations/${this.sessionId}`)
      this.conversationHistory = response.data.map((msg: any) => ({
        role: msg.speaker,
        content: msg.text,
        timestamp: msg.timestamp,
      }))

      return this.conversationHistory
    } catch (error) {
      console.error("Error getting conversation history:", error)
      return this.conversationHistory
    }
  }

  private simulateEvaluation(): any {
    // Generate a simulated evaluation based on conversation history
    const userMessages = this.conversationHistory.filter((msg) => msg.role === "user")
    const totalWords = userMessages.reduce((count, msg) => count + msg.content.split(" ").length, 0)
    const avgWordsPerMessage = userMessages.length > 0 ? totalWords / userMessages.length : 0

    // Calculate a score based on response length (more detailed is better)
    const baseScore = Math.min(75 + (avgWordsPerMessage > 10 ? 15 : 5), 95)

    // Extract potential skills from messages
    const skillKeywords = ["javascript", "python", "react", "node", "express", "mongodb", "sql", "git", "agile"]
    const skills: string[] = []

    userMessages.forEach((msg) => {
      const lowerMsg = msg.content.toLowerCase()
      skillKeywords.forEach((skill) => {
        if (lowerMsg.includes(skill) && !skills.includes(skill)) {
          skills.push(skill)
        }
      })
    })

    return {
      technicalSkills: Math.round(baseScore * 0.9),
      softSkills: Math.round(baseScore * 1.1),
      jobFit: Math.round(baseScore * 0.95),
      cultureFit: Math.round(baseScore),
      overallScore: Math.round(baseScore),
      skills: skills,
      strengths: skills.length > 0 ? skills.slice(0, 3) : ["Communication", "Résolution de problèmes", "Adaptabilité"],
      weaknesses: ["Expérience limitée", "Connaissances techniques spécifiques"],
      recommendation: baseScore >= 80 ? "proceed" : baseScore >= 60 ? "further_evaluation" : "reject",
    }
  }

  getSessionId(): string {
    return this.sessionId
  }
}

// Singleton instance for the current session
let chatbotServiceInstance: ChatbotService | null = null

export const getChatbotService = (sessionId?: string): ChatbotService => {
  if (!chatbotServiceInstance || sessionId) {
    chatbotServiceInstance = new ChatbotService(sessionId)
  }
  return chatbotServiceInstance
}
