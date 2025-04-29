"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Send, User, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ChatMessage {
  role: "user" | "bot"
  content: string
  timestamp: string
}

export function EnhancedChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initial bot message
  useEffect(() => {
    setMessages([
      {
        role: "bot",
        content: "Bonjour ! Je suis l'assistant de recrutement virtuel. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          sessionId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to get response")
      }

      // Save session ID if not already set
      if (!sessionId && data.data.sessionId) {
        setSessionId(data.data.sessionId)
        // Store in localStorage for persistence
        localStorage.setItem("chatbotSessionId", data.data.sessionId)
      }

      const botMessage: ChatMessage = {
        role: "bot",
        content: data.data.message,
        timestamp: data.data.timestamp,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleViewEvaluation = () => {
    if (sessionId) {
      router.push(`/chatbot/evaluation?sessionId=${sessionId}`)
    } else {
      toast({
        title: "Session not found",
        description: "Please complete the conversation first.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant de Recrutement Virtuel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[400px] overflow-y-auto p-4 rounded-md bg-muted/50">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <div
                  className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                    message.role === "user" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {messages.length > 3 && (
          <Button variant="outline" onClick={handleViewEvaluation} className="w-full">
            Voir l'évaluation
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
