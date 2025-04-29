"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar, TrendingUp } from "lucide-react"
import type { CostForecastResult } from "@/lib/types"

interface CostForecastProps {
  onForecast: (periods: number, freq: string) => Promise<CostForecastResult>
  isLoading?: boolean
}

export function CostForecast({ onForecast, isLoading = false }: CostForecastProps) {
  const [periods, setPeriods] = useState("12")
  const [freq, setFreq] = useState("M")
  const [forecast, setForecast] = useState<CostForecastResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleForecast = async () => {
    try {
      setError(null)
      const result = await onForecast(Number.parseInt(periods), freq)
      setForecast(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la prévision")
      setForecast(null)
    }
  }

  // Formatage des données pour le graphique
  const chartData = forecast?.forecast.map((item) => ({
    date: item.ds,
    cost: item.yhat,
    lower: item.yhat_lower,
    upper: item.yhat_upper,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Prévision des coûts de recrutement
        </CardTitle>
        <CardDescription>Prévision des coûts de recrutement pour les périodes futures</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="periods">Horizon de prévision</Label>
            <Select value={periods} onValueChange={setPeriods}>
              <SelectTrigger id="periods">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 périodes</SelectItem>
                <SelectItem value="6">6 périodes</SelectItem>
                <SelectItem value="12">12 périodes</SelectItem>
                <SelectItem value="24">24 périodes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="freq">Fréquence</Label>
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger id="freq">
                <SelectValue placeholder="Sélectionner une fréquence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="D">Jour</SelectItem>
                <SelectItem value="W">Semaine</SelectItem>
                <SelectItem value="M">Mois</SelectItem>
                <SelectItem value="Q">Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {forecast && (
          <div className="space-y-6">
            <div className="rounded-lg bg-muted p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Coût total prévu</h3>
                  <div className="mt-1 text-2xl font-bold">
                    {forecast.total_cost.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Coût moyen</h3>
                  <div className="mt-1 text-2xl font-bold">
                    {forecast.average_cost.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Période de prévision</h3>
                  <div className="mt-1 text-2xl font-bold">
                    {forecast.forecast_period.periods}{" "}
                    {forecast.forecast_period.frequency === "M"
                      ? "mois"
                      : forecast.forecast_period.frequency === "W"
                        ? "semaines"
                        : forecast.forecast_period.frequency === "D"
                          ? "jours"
                          : "trimestres"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Prévision des coûts</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString("fr-FR")} €`, "Coût"]} />
                    <Legend />
                    <Line type="monotone" dataKey="cost" name="Coût prévu" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line
                      type="monotone"
                      dataKey="lower"
                      name="Limite inférieure"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="upper"
                      name="Limite supérieure"
                      stroke="#ff8042"
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-base font-medium">Analyse de la prévision</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                La prévision indique une tendance{" "}
                {forecast.forecast[forecast.forecast.length - 1].yhat > forecast.forecast[0].yhat
                  ? "à la hausse"
                  : "à la baisse"}{" "}
                des coûts de recrutement sur la période analysée.
                {forecast.forecast[forecast.forecast.length - 1].yhat > forecast.forecast[0].yhat
                  ? " Cette augmentation peut être liée à l'inflation, à la compétition accrue sur le marché du travail ou à l'évolution des canaux de recrutement utilisés."
                  : " Cette diminution peut être liée à une optimisation des processus de recrutement, à un changement dans les canaux utilisés ou à une baisse de la demande sur le marché du travail."}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Il est recommandé de{" "}
                {forecast.forecast[forecast.forecast.length - 1].yhat > forecast.forecast[0].yhat
                  ? "prévoir un budget supplémentaire pour les recrutements futurs et d'optimiser l'utilisation des canaux les plus rentables."
                  : "maintenir cette tendance en continuant à optimiser les processus et en privilégiant les canaux les plus efficaces."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <h3 className="font-medium">Erreur</h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleForecast} disabled={isLoading} className="ml-auto">
          {isLoading ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Générer la prévision
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
