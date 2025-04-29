"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, BarChart3, Brain, Database } from "lucide-react"
import type { ModelTrainingMetrics } from "@/lib/performance-prediction-service"

export function ModelTraining() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trainingResults, setTrainingResults] = useState<ModelTrainingMetrics | null>(null)

  const handleTrainModel = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simuler des données d'entraînement
      const mockTrainingData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
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
        leadership_potential: Math.random() * 5,
        communication_skills: Math.random() * 5,
        problem_solving: Math.random() * 5,
        teamwork: Math.random() * 5,
        motivation: Math.random() * 5,
        work_ethic: Math.random() * 5,
        performance_score: Math.random() * 5, // Variable cible
      }))

      const response = await fetch("/api/performance-prediction/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mockTrainingData }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to train model")
      }

      setTrainingResults(result.data)
    } catch (err) {
      console.error("Error training model:", err)
      setError(err instanceof Error ? err.message : "An error occurred during training")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Entraînement du modèle de prédiction
          </CardTitle>
          <CardDescription>Entraînez le modèle de prédiction de performance avec vos propres données</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil vous permet d'entraîner le modèle de prédiction de performance avec vos propres données
              historiques pour améliorer la précision des prédictions.
            </p>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleTrainModel} disabled={isLoading}>
                {isLoading ? "Entraînement en cours..." : "Entraîner le modèle"}
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

      {trainingResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Métriques d'évaluation
              </CardTitle>
              <CardDescription>Performances du modèle entraîné</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Erreur quadratique moyenne (MSE)</p>
                    <p className="text-2xl font-bold">{trainingResults.mse.toFixed(3)}</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Erreur absolue moyenne (MAE)</p>
                    <p className="text-2xl font-bold">{trainingResults.mae.toFixed(3)}</p>
                  </div>
                  <div className="p-4 rounded-lg border md:col-span-2">
                    <p className="text-sm text-muted-foreground">Coefficient de détermination (R²)</p>
                    <p className="text-2xl font-bold">{trainingResults.r2.toFixed(3)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Le R² mesure la proportion de la variance expliquée par le modèle. Une valeur proche de 1 indique
                      un bon ajustement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Importance des caractéristiques
              </CardTitle>
              <CardDescription>Influence de chaque caractéristique sur les prédictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(trainingResults.feature_importance)
                  .sort((a, b) => b[1] - a[1])
                  .map(([feature, importance]) => (
                    <div key={feature} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {feature === "technical_skills_score"
                            ? "Compétences techniques"
                            : feature === "soft_skills_score"
                              ? "Compétences interpersonnelles"
                              : feature === "interview_score"
                                ? "Entretien"
                                : feature === "test_score"
                                  ? "Tests techniques"
                                  : feature === "previous_performance_score"
                                    ? "Performance précédente"
                                    : feature === "cultural_fit_score"
                                      ? "Adéquation culturelle"
                                      : feature === "learning_agility"
                                        ? "Agilité d'apprentissage"
                                        : feature === "adaptability"
                                          ? "Adaptabilité"
                                          : feature === "leadership_potential"
                                            ? "Potentiel de leadership"
                                            : feature === "communication_skills"
                                              ? "Communication"
                                              : feature === "problem_solving"
                                                ? "Résolution de problèmes"
                                                : feature === "teamwork"
                                                  ? "Travail d'équipe"
                                                  : feature === "motivation"
                                                    ? "Motivation"
                                                    : feature === "work_ethic"
                                                      ? "Éthique de travail"
                                                      : feature}
                        </span>
                        <span className="text-sm font-medium">{Math.round(importance * 100)}%</span>
                      </div>
                      <Progress value={importance * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Technologies utilisées</CardTitle>
          <CardDescription>Outils et bibliothèques utilisés pour la prédiction de performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">scikit-learn</h3>
                <p className="text-muted-foreground">
                  Bibliothèque open-source pour l'apprentissage automatique en Python.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Modèles de régression (SVR, Random Forest, Gradient Boosting)</li>
                  <li>Prétraitement des données (normalisation, encodage)</li>
                  <li>Sélection de caractéristiques et réduction de dimensionnalité</li>
                  <li>Métriques d'évaluation (MSE, MAE, R²)</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">TensorFlow/Keras</h3>
                <p className="text-muted-foreground">
                  Bibliothèques open-source pour la création et l'entraînement de réseaux de neurones.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Réseaux de neurones profonds pour la régression</li>
                  <li>Couches denses avec activation ReLU</li>
                  <li>Couches de dropout pour éviter le surapprentissage</li>
                  <li>Normalisation par lots pour améliorer la convergence</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Modèles de prédiction</h3>
                <p className="text-muted-foreground">
                  Techniques et modèles utilisés pour prédire la performance des candidats.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Régression pour prédire les scores de performance</li>
                  <li>Analyse des facteurs contributifs</li>
                  <li>Prédiction de performance par domaine</li>
                  <li>Identification des axes de développement</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Visualisation et interprétation</h3>
                <p className="text-muted-foreground">
                  Outils et techniques pour visualiser et interpréter les résultats des modèles.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Importance des caractéristiques pour comprendre les facteurs clés</li>
                  <li>Visualisation des prédictions par département</li>
                  <li>Analyse des corrélations entre facteurs</li>
                  <li>Recommandations de développement personnalisées</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
