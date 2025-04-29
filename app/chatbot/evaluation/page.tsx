"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, User, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ChatMessage {
  role: "user" | "bot"
  content: string
  timestamp: string
}

interface Evaluation {
  technicalSkills: number
  softSkills: number
  motivation?: number
  jobFit?: number
  cultureFit?: number
  overallScore: number
  skills?: string[]
  strengths?: string[]
  weaknesses?: string[]
  recommendation: "proceed" | "further_evaluation" | "reject"
  generated?: boolean
}

export default function EvaluationPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Session ID manquant",
        description: "Impossible de charger l'évaluation sans identifiant de session.",
        variant: "destructive",
      })
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch evaluation
        const evalResponse = await fetch(`/api/chatbot?sessionId=${sessionId}`)
        const evalData = await evalResponse.json()

        if (evalData.success && evalData.data) {
          setEvaluation(evalData.data)
        } else {
          toast({
            title: "Erreur",
            description: evalData.error || "Impossible de charger l'évaluation.",
            variant: "destructive",
          })
        }

        // Fetch conversation history
        const historyResponse = await fetch(`/api/chatbot?sessionId=${sessionId}&type=history`)
        const historyData = await historyResponse.json()

        if (historyData.success && historyData.data) {
          setHistory(historyData.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sessionId, toast])

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "proceed":
        return "bg-green-500"
      case "further_evaluation":
        return "bg-yellow-500"
      case "reject":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "proceed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "further_evaluation":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "reject":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "proceed":
        return "Candidat recommandé"
      case "further_evaluation":
        return "Évaluation supplémentaire recommandée"
      case "reject":
        return "Candidat non recommandé"
      default:
        return "Indéterminé"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Chargement de l'évaluation...</p>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Évaluation non disponible</h2>
        <p className="mt-2 text-muted-foreground">L'évaluation n'a pas pu être chargée ou n'existe pas encore.</p>
        <Button asChild className="mt-4">
          <Link href="/chatbot">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au chatbot
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Évaluation du candidat</h1>
        <Button asChild variant="outline">
          <Link href="/chatbot">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au chatbot
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Résumé de l'évaluation</CardTitle>
            <CardDescription>
              {evaluation.generated
                ? "Évaluation générée automatiquement basée sur l'entretien"
                : "Évaluation complète du candidat"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Score global</span>
                <span className="text-sm font-medium">{evaluation.overallScore}%</span>
              </div>
              <Progress value={evaluation.overallScore} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compétences techniques</span>
                  <span className="text-sm font-medium">{evaluation.technicalSkills}%</span>
                </div>
                <Progress value={evaluation.technicalSkills} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compétences relationnelles</span>
                  <span className="text-sm font-medium">{evaluation.softSkills}%</span>
                </div>
                <Progress value={evaluation.softSkills} className="h-2" />
              </div>

              {evaluation.motivation && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Motivation</span>
                    <span className="text-sm font-medium">{evaluation.motivation}%</span>
                  </div>
                  <Progress value={evaluation.motivation} className="h-2" />
                </div>
              )}

              {evaluation.jobFit && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Adéquation au poste</span>
                    <span className="text-sm font-medium">{evaluation.jobFit}%</span>
                  </div>
                  <Progress value={evaluation.jobFit} className="h-2" />
                </div>
              )}

              {evaluation.cultureFit && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Adéquation culturelle</span>
                    <span className="text-sm font-medium">{evaluation.cultureFit}%</span>
                  </div>
                  <Progress value={evaluation.cultureFit} className="h-2" />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Compétences identifiées</h3>
              <div className="flex flex-wrap gap-2">
                {evaluation.skills && evaluation.skills.length > 0 ? (
                  evaluation.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune compétence spécifique identifiée</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Points forts</h3>
                {evaluation.strengths && evaluation.strengths.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun point fort spécifique identifié</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Points à améliorer</h3>
                {evaluation.weaknesses && evaluation.weaknesses.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {evaluation.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun point faible spécifique identifié</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`flex items-center justify-center p-6 rounded-lg ${getRecommendationColor(
                evaluation.recommendation,
              )} bg-opacity-10`}
            >
              <div className="flex flex-col items-center text-center">
                {getRecommendationIcon(evaluation.recommendation)}
                <span className="mt-2 text-lg font-medium">{getRecommendationText(evaluation.recommendation)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Actions recommandées</h3>
              <ul className="list-disc pl-5 space-y-1">
                {evaluation.recommendation === "proceed" && (
                  <>
                    <li className="text-sm">Planifier un entretien avec un recruteur</li>
                    <li className="text-sm">Préparer une offre potentielle</li>
                    <li className="text-sm">Vérifier les références</li>
                  </>
                )}
                {evaluation.recommendation === "further_evaluation" && (
                  <>
                    <li className="text-sm">Planifier un test technique</li>
                    <li className="text-sm">Organiser un second entretien</li>
                    <li className="text-sm">Demander des exemples de travaux précédents</li>
                  </>
                )}
                {evaluation.recommendation === "reject" && (
                  <>
                    <li className="text-sm">Envoyer un email de refus courtois</li>
                    <li className="text-sm">Suggérer des postes plus adaptés si disponibles</li>
                    <li className="text-sm">Conserver le profil pour de futures opportunités</li>
                  </>
                )}
              </ul>
            </div>

            <div className="pt-4">
              <Button className="w-full">Exporter l'évaluation</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversation">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="analysis">Analyse détaillée</TabsTrigger>
        </TabsList>
        <TabsContent value="conversation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique de la conversation</CardTitle>
              <CardDescription>Transcription complète de l'entretien avec le chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto p-4">
                {history.length > 0 ? (
                  history.map((message, index) => (
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
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
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Aucun historique de conversation disponible</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analysis" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée</CardTitle>
              <CardDescription>Analyse approfondie des réponses du candidat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Analyse linguistique</h3>
                  <p className="text-sm text-muted-foreground">
                    L'analyse linguistique des réponses du candidat révèle un niveau de communication{" "}
                    {evaluation.softSkills > 70 ? "élevé" : evaluation.softSkills > 50 ? "moyen" : "basique"}.
                    {evaluation.softSkills > 70
                      ? " Le candidat s'exprime clairement et de manière structurée."
                      : evaluation.softSkills > 50
                        ? " Le candidat communique de façon adéquate mais pourrait améliorer la clarté de ses réponses."
                        : " Le candidat présente des difficultés à communiquer clairement ses idées."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Adéquation au poste</h3>
                  <p className="text-sm text-muted-foreground">
                    Basé sur les compétences techniques identifiées et l'expérience mentionnée, le candidat présente
                    {evaluation.technicalSkills > 70
                      ? " une excellente adéquation avec les exigences du poste."
                      : evaluation.technicalSkills > 50
                        ? " une adéquation satisfaisante avec les exigences du poste, avec quelques lacunes."
                        : " une adéquation limitée avec les exigences du poste."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Motivation et engagement</h3>
                  <p className="text-sm text-muted-foreground">
                    {evaluation.motivation
                      ? evaluation.motivation > 70
                        ? "Le candidat démontre une forte motivation et un intérêt sincère pour le poste et l'entreprise."
                        : evaluation.motivation > 50
                          ? "Le candidat montre un niveau de motivation acceptable, mais pourrait être plus enthousiaste."
                          : "Le candidat ne démontre pas clairement sa motivation pour le poste."
                      : "La motivation du candidat n'a pas pu être évaluée précisément."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Recommandations pour l'entretien suivant</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-sm">
                      Approfondir les connaissances techniques en{" "}
                      {evaluation.skills ? evaluation.skills[0] || "développement" : "développement"}
                    </li>
                    <li className="text-sm">Vérifier l'expérience pratique sur des projets similaires</li>
                    <li className="text-sm">Explorer davantage les motivations à long terme du candidat</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
