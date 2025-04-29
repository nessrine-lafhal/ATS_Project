import type { Metadata } from "next"
import { Chatbot } from "@/components/chatbot"

export const metadata: Metadata = {
  title: "Chatbot de présélection intelligent",
  description: "Assistant virtuel pour mener des entretiens automatisés et effectuer une présélection des candidats",
}

export default function ChatbotPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Chatbot de présélection intelligent</h1>
        <p className="text-muted-foreground">
          Assistant virtuel pour mener des entretiens automatisés et effectuer une présélection des candidats
        </p>
      </div>

      <Chatbot />

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Comment ça fonctionne</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Le chatbot pose des questions pour évaluer vos compétences et votre expérience</li>
          <li>Vos réponses sont analysées en temps réel grâce à des algorithmes de NLP</li>
          <li>Une évaluation complète est générée à la fin de l'entretien</li>
          <li>Les recruteurs reçoivent un rapport détaillé pour prendre des décisions éclairées</li>
        </ol>
      </div>
    </div>
  )
}
