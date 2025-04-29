"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import type { JobAnalysisResult } from "@/lib/types"

interface JobDescriptionAnalyzerProps {
  onAnalysisComplete?: (analysis: JobAnalysisResult) => void
}

export function JobDescriptionAnalyzer({ onAnalysisComplete }: JobDescriptionAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Veuillez entrer une description de poste à analyser")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/job-optimizer/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_description: jobDescription }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse de la description de poste")
      }

      const result = await response.json()
      setAnalysis(result.data)

      if (onAnalysisComplete) {
        onAnalysisComplete(result.data)
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse:", err)
      setError("Une erreur est survenue lors de l'analyse de la description de poste")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-amber-100 text-amber-800">Moyen</Badge>
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Analyseur de description de poste</CardTitle>
          <CardDescription>
            Entrez une description de poste pour analyser sa qualité et identifier les points d'amélioration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Collez votre description de poste ici..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px]"
            />

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !jobDescription.trim()}>
              {isAnalyzing ? "Analyse en cours..." : "Analyser la description"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats de l'analyse</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  {Math.round(analysis.overall_score)}
                </span>
                {getScoreBadge(analysis.overall_score)}
              </div>
            </CardTitle>
            <CardDescription>Analyse détaillée de la qualité de votre description de poste</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Structure</span>
                    <span className={getScoreColor(analysis.structure_score)}>
                      {Math.round(analysis.structure_score)}%
                    </span>
                  </div>
                  <Progress value={analysis.structure_score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Clarté</span>
                    <span className={getScoreColor(analysis.clarity_score)}>{Math.round(analysis.clarity_score)}%</span>
                  </div>
                  <Progress value={analysis.clarity_score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Attractivité</span>
                    <span className={getScoreColor(analysis.attractiveness_score)}>
                      {Math.round(analysis.attractiveness_score)}%
                    </span>
                  </div>
                  <Progress value={analysis.attractiveness_score} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mots-clés attractifs</span>
                    <span>{analysis.attractive_keywords_found} trouvés</span>
                  </div>
                  <Progress value={Math.min(100, (analysis.attractive_keywords_found / 10) * 100)} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Sections présentes</h3>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    {analysis.has_responsibilities ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Responsabilités</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    {analysis.has_requirements ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Profil recherché</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    {analysis.has_benefits ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Avantages</span>
                  </div>
                </div>
              </div>

              {analysis.improvement_areas && analysis.improvement_areas.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Points d'amélioration</h3>
                  <div className="space-y-2">
                    {analysis.improvement_areas.map((area, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 rounded-md bg-amber-50">
                        <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span className="text-amber-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Nombre de mots: {analysis.word_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
