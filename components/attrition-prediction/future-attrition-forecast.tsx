"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { FutureAttritionPredictionResult } from "@/lib/attrition-prediction-service"

export function FutureAttritionForecast() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictionResults, setPredictionResults] = useState<FutureAttritionPredictionResult | null>(null)
  const [predictionPeriod, setPredictionPeriod] = useState("12")

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
        performance_score: Math.random() * 5,
        satisfaction_score: Math.random() * 5,
        work_life_balance: Math.random() * 5,
        relationship_with_manager: Math.random() * 5,
        promotion_last_3_years: Math.random() > 0.7,
        training_hours_last_year: Math.floor(Math.random() * 100),
      }))

      const response = await fetch("/api/attrition-prediction/future", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: mockEmployeeData,
          months: Number.parseInt(predictionPeriod),
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to predict future attrition")
      }

      setPredictionResults(result.data)
    } catch (err) {
      console.error("Error predicting future attrition:", err)
      setError(err instanceof Error ? err.message : "An error occurred during prediction")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Prévision d'attrition future
          </CardTitle>
          <CardDescription>Prévoyez l'attrition future et estimez son impact financier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil utilise des modèles prédictifs pour estimer l'attrition future et son impact sur l'organisation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <label htmlFor="prediction-period" className="block text-sm font-medium text-gray-700 mb-1">
                  Période de prévision
                </label>
                <Select value={predictionPeriod} onValueChange={setPredictionPeriod}>
                  <SelectTrigger id="prediction-period">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 mois</SelectItem>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="12">12 mois</SelectItem>
                    <SelectItem value="24">24 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-2/3">
                <Button className="w-full mt-6" onClick={handlePredict} disabled={isLoading}>
                  {isLoading ? "Prévision en cours..." : "Prévoir l'attrition future"}
                </Button>
              </div>
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
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taux d'attrition prévu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{predictionResults.attrition_percentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Sur {predictionResults.prediction_period_months} mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Départs prévus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{predictionResults.total_predicted_leavers}</div>
                <p className="text-xs text-muted-foreground">Employés susceptibles de partir</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Coût estimé
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(predictionResults.estimated_cost)}</div>
                <p className="text-xs text-muted-foreground">Impact financier total</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Évolution de l'attrition
              </CardTitle>
              <CardDescription>
                Prévision mensuelle de l'attrition sur {predictionResults.prediction_period_months} mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    attrition_rate: {
                      label: "Taux d'attrition",
                      color: "hsl(var(--chart-1))",
                    },
                    remaining_employees: {
                      label: "Employés restants",
                      color: "hsl(var(--chart-2))",
                    },
                    leavers: {
                      label: "Départs",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionResults.monthly_predictions}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="attrition_rate"
                        stroke="var(--color-attrition_rate)"
                        name="Taux d'attrition"
                        formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="remaining_employees"
                        stroke="var(--color-remaining_employees)"
                        name="Employés restants"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="leavers"
                        stroke="var(--color-leavers)"
                        name="Départs"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations pour réduire l'attrition</CardTitle>
              <CardDescription>Stratégies pour minimiser l'impact de l'attrition future</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="font-medium">Mettre en place des programmes de développement de carrière</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Offrir des opportunités de croissance professionnelle et des parcours de carrière clairs pour les
                    employés.
                  </p>
                </div>

                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="font-medium">Revoir la politique de rémunération et d'avantages sociaux</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    S'assurer que les salaires et avantages sont compétitifs par rapport au marché.
                  </p>
                </div>

                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="font-medium">Améliorer l'équilibre vie professionnelle/personnelle</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mettre en place des politiques de flexibilité et de télétravail pour améliorer la qualité de vie des
                    employés.
                  </p>
                </div>

                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="font-medium">Renforcer la culture d'entreprise et la reconnaissance</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Créer un environnement de travail positif et reconnaître régulièrement les contributions des
                    employés.
                  </p>
                </div>

                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <p className="font-medium">Former les managers aux techniques de leadership inclusif</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Développer les compétences des managers en matière de communication, de feedback et de gestion
                    d'équipe.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
