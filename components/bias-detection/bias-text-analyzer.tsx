"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import type { BiasedTerm, BiasDetectionResult } from "@/lib/bias-detection-service"

interface BiasTextAnalyzerProps {
  onAnalysisComplete?: (results: BiasDetectionResult) => void
}

export function BiasTextAnalyzer({ onAnalysisComplete }: BiasTextAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [analysisResults, setAnalysisResults] = useState<BiasDetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const demoText = `Nous recherchons un ninja du code, jeune et dynamique, pour rejoindre notre équipe de rock stars. Le candidat idéal doit maîtriser JavaScript et avoir 5+ ans d'expérience dans le développement web. Vous devez être capable de travailler de longues heures sous pression et être un joueur d'équipe. Une forte culture startup est essentielle.`

  const handleAnalyze = async () => {
    if (!jobDescription && !demoText) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/bias-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: jobDescription || demoText }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to analyze text")
      }

      setAnalysisResults(result.data)

      if (onAnalysisComplete) {
        onAnalysisComplete(result.data)
      }
    } catch (err) {
      console.error("Error analyzing text:", err)
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBiasScoreColor = (score: number) => {
    if (score < 0.1) return "text-green-600"
    if (score < 0.2) return "text-emerald-600"
    if (score < 0.3) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Analyse de texte
          </CardTitle>
          <CardDescription>
            Analysez les offres d'emploi et descriptions de postes pour détecter les biais potentiels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Collez votre description de poste ici pour analyse..."
              className="min-h-[200px]"
              value={jobDescription || demoText}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!jobDescription && !demoText)}
              >
                {isAnalyzing ? "Analyse en cours..." : "Analyser le texte"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setJobDescription("")
                  setAnalysisResults(null)
                  setError(null)
                }}
              >
                Effacer
              </Button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-800">
                <p className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Scores de biais</CardTitle>
              <CardDescription>Évaluation des différents types de biais détectés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Biais de genre</span>
                    <span className={getBiasScoreColor(analysisResults.genderBias)}>
                      {Math.round(analysisResults.genderBias * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResults.genderBias * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Biais d'âge</span>
                    <span className={getBiasScoreColor(analysisResults.ageBias)}>
                      {Math.round(analysisResults.ageBias * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResults.ageBias * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Biais culturel</span>
                    <span className={getBiasScoreColor(analysisResults.culturalBias)}>
                      {Math.round(analysisResults.culturalBias * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResults.culturalBias * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Biais linguistique</span>
                    <span className={getBiasScoreColor(analysisResults.languageBias)}>
                      {Math.round(analysisResults.languageBias * 100)}%
                    </span>
                  </div>
                  <Progress value={analysisResults.languageBias * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Score global de biais</span>
                    <span className={`font-medium ${getBiasScoreColor(analysisResults.overallBias)}`}>
                      {Math.round(analysisResults.overallBias * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={analysisResults.overallBias * 100} className="h-3" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Score de diversité</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                      {analysisResults.diversityScore}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Score basé sur l'inclusivité du langage et l'absence de biais discriminatoires
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termes biaisés détectés</CardTitle>
              <CardDescription>Termes potentiellement problématiques et suggestions d'alternatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.biasedTerms.length > 0 ? (
                  analysisResults.biasedTerms.map((term: BiasedTerm, index: number) => (
                    <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{term.term}</p>
                          <p className="text-sm text-muted-foreground">
                            Catégorie:{" "}
                            {term.category === "gender"
                              ? "Genre"
                              : term.category === "age"
                                ? "Âge"
                                : term.category === "cultural"
                                  ? "Culture"
                                  : term.category === "language"
                                    ? "Langage"
                                    : term.category}
                          </p>
                        </div>
                        <Badge variant="outline" className={getSeverityColor(term.severity)}>
                          {term.severity === "high" ? "Élevé" : term.severity === "medium" ? "Moyen" : "Faible"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <p className="text-sm">
                          Suggestion: <span className="font-medium">{term.suggestion}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground italic">Aucun terme biaisé détecté</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Suggestions pour améliorer l'inclusivité et réduire les biais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.recommendations.map((recommendation: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <p>{recommendation}</p>
                  </div>
                ))}

                {analysisResults.improvedText && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Texte optimisé suggéré</p>
                      <p className="mt-2 text-blue-700">{analysisResults.improvedText}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
