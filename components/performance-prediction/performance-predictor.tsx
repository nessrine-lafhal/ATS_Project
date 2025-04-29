"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, BarChart3, Users, Briefcase, Brain } from "lucide-react"
import type { PerformancePredictionResult } from "@/lib/performance-prediction-service"

export function PerformancePredictor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictionResults, setPredictionResults] = useState<PerformancePredictionResult | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simuler des données de candidats pour la prédiction
      const mockCandidateData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        department: ["engineering", "sales", "marketing", "customer_support", "hr"][Math.floor(Math.random() * 5)],
        education_level: Math.floor(Math.random() * 5) + 1,
        years_experience: Math.floor(Math.random() * 10) + 1,
        technical_skills_score: Math.random() * 5,
        soft_skills_score: Math.random() * 5,
        interview_score: Math.random() * 5,
        test_score: Math.random() * 5,
        previous_performance_score: Math.random() * 5,
        cultural_fit_score: Math.random() * 5,
        learning_agility: Math.random() * 5,
        adaptability: Math.random() * 5,
      }))

      const response = await fetch("/api/performance-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mockCandidateData }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to predict performance")
      }

      setPredictionResults(result.data)
    } catch (err) {
      console.error("Error predicting performance:", err)
      setError(err instanceof Error ? err.message : "An error occurred during prediction")
    } finally {
      setIsLoading(false)
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 4.0) return "text-emerald-600"
    if (score >= 3.5) return "text-blue-600"
    if (score >= 3.0) return "text-amber-600"
    if (score >= 2.5) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 4.5) return "bg-green-600"
    if (score >= 4.0) return "bg-emerald-600"
    if (score >= 3.5) return "bg-blue-600"
    if (score >= 3.0) return "bg-amber-600"
    if (score >= 2.5) return "bg-orange-600"
    return "bg-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Prédiction de performance
          </CardTitle>
          <CardDescription>Prédisez la performance future des candidats après leur embauche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil utilise des modèles prédictifs pour estimer la performance future des candidats après leur
              embauche, en se basant sur leurs compétences, expérience et résultats d'entretien.
            </p>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handlePredict} disabled={isLoading}>
                {isLoading ? "Analyse en cours..." : "Analyser les candidats"}
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

      {predictionResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Performance moyenne
              </CardTitle>
              <CardDescription>Évaluation de la performance moyenne des candidats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    <span className={getPerformanceColor(predictionResults.average_performance_score)}>
                      {predictionResults.average_performance_score}/5
                    </span>
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Performance par département</p>
                  {Object.entries(predictionResults.department_performance).map(([department, value]) => (
                    <div key={department} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>
                          {department === "engineering"
                            ? "Ingénierie"
                            : department === "sales"
                              ? "Ventes"
                              : department === "marketing"
                                ? "Marketing"
                                : department === "customer_support"
                                  ? "Support client"
                                  : department === "hr"
                                    ? "Ressources humaines"
                                    : department}
                        </span>
                        <span className={getPerformanceColor(value)}>{value}/5</span>
                      </div>
                      <Progress
                        value={(value / 5) * 100}
                        className="h-2"
                        indicatorClassName={getProgressColor(value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Facteurs de performance
              </CardTitle>
              <CardDescription>Principaux facteurs influençant la performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictionResults.individual_predictions.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium">Facteurs contributifs moyens</p>
                    {Object.entries(
                      predictionResults.individual_predictions.reduce(
                        (acc, curr) => {
                          Object.entries(curr.contributing_factors).forEach(([key, value]) => {
                            acc[key] = (acc[key] || 0) + value / predictionResults.individual_predictions.length
                          })
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    )
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([factor, value]) => (
                        <div key={factor} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span>
                              {factor === "technical_skills"
                                ? "Compétences techniques"
                                : factor === "soft_skills"
                                  ? "Compétences interpersonnelles"
                                  : factor === "experience"
                                    ? "Expérience"
                                    : factor === "education"
                                      ? "Formation"
                                      : factor === "cultural_fit"
                                        ? "Adéquation culturelle"
                                        : factor === "learning_agility"
                                          ? "Agilité d'apprentissage"
                                          : factor === "motivation"
                                            ? "Motivation"
                                            : factor === "problem_solving"
                                              ? "Résolution de problèmes"
                                              : factor === "leadership"
                                                ? "Leadership"
                                                : factor === "work_ethic"
                                                  ? "Éthique de travail"
                                                  : factor}
                            </span>
                            <span>{Math.round(value * 100)}%</span>
                          </div>
                          <Progress value={value * 100} className="h-2" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Candidats à haut potentiel
              </CardTitle>
              <CardDescription>Liste des candidats avec les meilleures prédictions de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictionResults.individual_predictions
                  .sort((a, b) => b.performance_score - a.performance_score)
                  .slice(0, 5)
                  .map((prediction) => (
                    <div
                      key={prediction.candidate_id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Candidat #{prediction.candidate_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Catégorie:{" "}
                            <span className={getPerformanceColor(prediction.performance_score)}>
                              {prediction.performance_category}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Score:{" "}
                            <span className={getPerformanceColor(prediction.performance_score)}>
                              {prediction.performance_score}/5
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Confiance: {Math.round(prediction.confidence_score * 100)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Points forts:</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Object.entries(prediction.domain_performance)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 2)
                            .map(([domain, score]) => (
                              <span key={domain} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {domain === "technical"
                                  ? "Technique"
                                  : domain === "communication"
                                    ? "Communication"
                                    : domain === "teamwork"
                                      ? "Travail d'équipe"
                                      : domain === "leadership"
                                        ? "Leadership"
                                        : domain === "problem_solving"
                                          ? "Résolution de problèmes"
                                          : domain}{" "}
                                ({score}/5)
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Axes d'amélioration:</p>
                        <div className="mt-1">
                          {prediction.development_recommendations.map((recommendation, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              • {recommendation}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
