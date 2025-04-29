"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, BarChart3, Brain, Network } from "lucide-react"
import type { PerformanceFactorsResult } from "@/lib/performance-prediction-service"

export function PerformanceFactors() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [factorsData, setFactorsData] = useState<PerformanceFactorsResult | null>(null)

  useEffect(() => {
    const fetchFactors = async () => {
      try {
        const response = await fetch("/api/performance-prediction/factors")

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to get performance factors")
        }

        setFactorsData(result.data)
      } catch (err) {
        console.error("Error getting performance factors:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFactors()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-2 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-800">
        <p className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </p>
      </div>
    )
  }

  if (!factorsData) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 text-amber-800">
        <p className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Aucune donnée disponible
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="factors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="factors">Facteurs de performance</TabsTrigger>
          <TabsTrigger value="correlations">Corrélations</TabsTrigger>
          <TabsTrigger value="details">Détails des facteurs</TabsTrigger>
        </TabsList>

        <TabsContent value="factors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Importance des facteurs de performance
              </CardTitle>
              <CardDescription>Facteurs qui influencent le plus la performance des employés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Précision du modèle: <span className="font-medium">{factorsData.model_accuracy * 100}%</span>
                </p>

                <div className="space-y-3">
                  {Object.entries(factorsData.factors)
                    .sort((a, b) => b[1].importance - a[1].importance)
                    .map(([factor, data]) => (
                      <div key={factor} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
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
                          <span>{Math.round(data.importance * 100)}%</span>
                        </div>
                        <Progress value={data.importance * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">{data.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="mr-2 h-5 w-5" />
                Corrélations entre facteurs
              </CardTitle>
              <CardDescription>Relations entre les différents facteurs de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Les corrélations indiquent comment les facteurs sont liés entre eux. Une corrélation élevée signifie
                  que les facteurs évoluent souvent ensemble.
                </p>

                <div className="space-y-3">
                  {factorsData.correlations
                    .sort((a, b) => b.correlation - a.correlation)
                    .map((correlation, index) => (
                      <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {correlation.factor1 === "technical_skills"
                                  ? "Compétences techniques"
                                  : correlation.factor1 === "soft_skills"
                                    ? "Compétences interpersonnelles"
                                    : correlation.factor1 === "experience"
                                      ? "Expérience"
                                      : correlation.factor1 === "education"
                                        ? "Formation"
                                        : correlation.factor1 === "cultural_fit"
                                          ? "Adéquation culturelle"
                                          : correlation.factor1 === "learning_agility"
                                            ? "Agilité d'apprentissage"
                                            : correlation.factor1 === "motivation"
                                              ? "Motivation"
                                              : correlation.factor1 === "problem_solving"
                                                ? "Résolution de problèmes"
                                                : correlation.factor1 === "leadership"
                                                  ? "Leadership"
                                                  : correlation.factor1 === "work_ethic"
                                                    ? "Éthique de travail"
                                                    : correlation.factor1}
                              </span>
                              <span className="text-muted-foreground">et</span>
                              <span className="font-medium">
                                {correlation.factor2 === "technical_skills"
                                  ? "Compétences techniques"
                                  : correlation.factor2 === "soft_skills"
                                    ? "Compétences interpersonnelles"
                                    : correlation.factor2 === "experience"
                                      ? "Expérience"
                                      : correlation.factor2 === "education"
                                        ? "Formation"
                                        : correlation.factor2 === "cultural_fit"
                                          ? "Adéquation culturelle"
                                          : correlation.factor2 === "learning_agility"
                                            ? "Agilité d'apprentissage"
                                            : correlation.factor2 === "motivation"
                                              ? "Motivation"
                                              : correlation.factor2 === "problem_solving"
                                                ? "Résolution de problèmes"
                                                : correlation.factor2 === "leadership"
                                                  ? "Leadership"
                                                  : correlation.factor2 === "work_ethic"
                                                    ? "Éthique de travail"
                                                    : correlation.factor2}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={
                                correlation.correlation >= 0.7
                                  ? "text-green-600 font-medium"
                                  : correlation.correlation >= 0.5
                                    ? "text-blue-600 font-medium"
                                    : "text-amber-600 font-medium"
                              }
                            >
                              {Math.round(correlation.correlation * 100)}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={correlation.correlation * 100}
                          className="h-2 mt-2"
                          indicatorClassName={
                            correlation.correlation >= 0.7
                              ? "bg-green-600"
                              : correlation.correlation >= 0.5
                                ? "bg-blue-600"
                                : "bg-amber-600"
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Détails des facteurs de performance
              </CardTitle>
              <CardDescription>Composantes détaillées de chaque facteur de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(factorsData.factors)
                  .sort((a, b) => b[1].importance - a[1].importance)
                  .map(([factor, data]) => (
                    <div key={factor} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
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
                        </h3>
                        <span className="text-sm font-medium">Importance: {Math.round(data.importance * 100)}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{data.description}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Composantes:</p>
                        <ul className="mt-1 space-y-1">
                          {data.sub_factors.map((subFactor, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="mr-2">•</span>
                              {subFactor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
