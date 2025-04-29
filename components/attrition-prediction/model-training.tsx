"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Brain, CheckCircle } from "lucide-react"
import type { ModelTrainingMetrics } from "@/lib/attrition-prediction-service"

export function ModelTraining() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trainingMetrics, setTrainingMetrics] = useState<ModelTrainingMetrics | null>(null)
  const [trainingProgress, setTrainingProgress] = useState(0)

  const handleTrainModel = async () => {
    setIsLoading(true)
    setError(null)
    setTrainingProgress(0)

    try {
      // Simuler la progression de l'entraînement
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 500)

      // Simuler des données d'entraînement
      const mockTrainingData = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        department: ["engineering", "sales", "marketing", "customer_support", "hr"][Math.floor(Math.random() * 5)],
        tenure: Math.floor(Math.random() * 10),
        salary: 50000 + Math.floor(Math.random() * 50000),
        performance_score: Math.random() * 5,
        satisfaction_score: Math.random() * 5,
        work_life_balance: Math.random() * 5,
        relationship_with_manager: Math.random() * 5,
        promotion_last_3_years: Math.random() > 0.7,
        training_hours_last_year: Math.floor(Math.random() * 100),
        attrition: Math.random() > 0.8, // Target variable
      }))

      // Attendre un peu pour simuler l'entraînement
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await fetch("/api/attrition-prediction/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: mockTrainingData,
          targetColumn: "attrition",
        }),
      })

      clearInterval(progressInterval)
      setTrainingProgress(100)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to train model")
      }

      setTrainingMetrics(result.data)
    } catch (err) {
      console.error("Error training model:", err)
      setError(err instanceof Error ? err.message : "An error occurred during training")
    } finally {
      setIsLoading(false)
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 0.85) return "text-green-600"
    if (value >= 0.75) return "text-emerald-600"
    if (value >= 0.65) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Entraînement du modèle de prédiction d'attrition
          </CardTitle>
          <CardDescription>Entraînez et évaluez le modèle de prédiction d'attrition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil permet d'entraîner un modèle de machine learning pour prédire l'attrition des employés. Le
              modèle utilise des réseaux de neurones récurrents (LSTM/GRU) et des algorithmes de scikit-learn.
            </p>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleTrainModel} disabled={isLoading}>
                {isLoading ? "Entraînement en cours..." : "Entraîner le modèle"}
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Progression de l'entraînement</span>
                  <span>{Math.round(trainingProgress)}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            )}

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

      {trainingMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Résultats de l'entraînement
            </CardTitle>
            <CardDescription>Métriques d'évaluation du modèle de prédiction d'attrition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Précision (Accuracy)</span>
                  <span className={getMetricColor(trainingMetrics.accuracy)}>
                    {(trainingMetrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingMetrics.accuracy * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Précision (Precision)</span>
                  <span className={getMetricColor(trainingMetrics.precision)}>
                    {(trainingMetrics.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingMetrics.precision * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Rappel (Recall)</span>
                  <span className={getMetricColor(trainingMetrics.recall)}>
                    {(trainingMetrics.recall * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingMetrics.recall * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Score F1</span>
                  <span className={getMetricColor(trainingMetrics.f1_score)}>
                    {(trainingMetrics.f1_score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingMetrics.f1_score * 100} className="h-2" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <span>AUC-ROC</span>
                  <span className={getMetricColor(trainingMetrics.roc_auc)}>
                    {(trainingMetrics.roc_auc * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingMetrics.roc_auc * 100} className="h-2" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="flex items-center text-green-800 font-medium">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Modèle entraîné avec succès
              </p>
              <p className="mt-2 text-sm text-green-700">
                Le modèle a été entraîné avec succès et est prêt à être utilisé pour prédire l'attrition des employés.
                Les métriques d'évaluation indiquent une bonne performance du modèle.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
