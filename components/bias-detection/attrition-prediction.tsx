"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Users, Briefcase, Heart } from "lucide-react"
import type { AttritionPredictionResult } from "@/lib/bias-detection-service"

export function AttritionPrediction() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictionResults, setPredictionResults] = useState<AttritionPredictionResult | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simuler des données d'employés pour la prédiction
      const mockEmployeeData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        department: ["engineering", "sales", "marketing", "customer_support", "hr"][Math.floor(Math.random() * 5)],
        tenure: Math.floor(Math.random() * 10),
        salary: 50000 + Math.floor(Math.random() * 50000),
        performance: Math.random() * 5,
        satisfaction: Math.random() * 5,
        workLifeBalance: Math.random() * 5,
        relationshipWithManager: Math.random() * 5,
        promotionLast3Years: Math.random() > 0.7,
        trainingHours: Math.floor(Math.random() * 100),
      }))

      const response = await fetch("/api/bias-detection/attrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mockEmployeeData }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to predict attrition")
      }

      setPredictionResults(result.data)
    } catch (err) {
      console.error("Error predicting attrition:", err)
      setError(err instanceof Error ? err.message : "An error occurred during prediction")
    } finally {
      setIsLoading(false)
    }
  }

  const getAttritionRiskColor = (risk: number) => {
    if (risk < 0.1) return "text-green-600"
    if (risk < 0.2) return "text-emerald-600"
    if (risk < 0.3) return "text-amber-600"
    return "text-red-600"
  }

  const getRetentionScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Prévision de l'attrition et de la rétention
          </CardTitle>
          <CardDescription>
            Analysez les risques d'attrition et identifiez les stratégies de rétention efficaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil utilise des modèles prédictifs pour estimer les risques d'attrition et identifier les facteurs
              clés influençant la rétention des employés.
            </p>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handlePredict} disabled={isLoading}>
                {isLoading ? "Analyse en cours..." : "Analyser les données d'attrition"}
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
                Risque d'attrition global
              </CardTitle>
              <CardDescription>Évaluation du risque d'attrition pour l'ensemble de l'organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    <span className={getAttritionRiskColor(predictionResults.overall_attrition_risk)}>
                      {Math.round(predictionResults.overall_attrition_risk * 100)}%
                    </span>
                  </span>
                  <span className="text-lg font-medium">
                    Score de rétention:{" "}
                    <span className={getRetentionScoreColor(predictionResults.retention_score)}>
                      {predictionResults.retention_score}/100
                    </span>
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Facteurs de risque d'attrition</p>
                  {Object.entries(predictionResults.attrition_risk_factors).map(([factor, value]) => (
                    <div key={factor} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>
                          {factor === "compensation"
                            ? "Rémunération"
                            : factor === "work_life_balance"
                              ? "Équilibre vie pro/perso"
                              : factor === "career_growth"
                                ? "Évolution de carrière"
                                : factor === "job_satisfaction"
                                  ? "Satisfaction au travail"
                                  : factor === "relationship_with_manager"
                                    ? "Relation avec le manager"
                                    : factor}
                        </span>
                        <span className={getAttritionRiskColor(value)}>{Math.round(value * 100)}%</span>
                      </div>
                      <Progress value={value * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Attrition par département
              </CardTitle>
              <CardDescription>Analyse des risques d'attrition par département</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(predictionResults.department_attrition).map(([department, value]) => (
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
                      <span className={getAttritionRiskColor(value)}>{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Stratégies de rétention recommandées
              </CardTitle>
              <CardDescription>Recommandations pour améliorer la rétention des employés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictionResults.retention_strategies.map((strategy, index) => (
                  <div key={index} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <p>{strategy}</p>
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
