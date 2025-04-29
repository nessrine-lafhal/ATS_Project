"use client"

import { useState } from "react"
import { ForecastParameters } from "@/components/talent-forecast/forecast-parameters"
import { ForecastCharts } from "@/components/talent-forecast/forecast-charts"
import { ForecastTechnologies } from "@/components/talent-forecast/forecast-technologies"
import { ForecastEmptyState } from "@/components/talent-forecast/forecast-empty-state"
import type { ForecastData } from "@/lib/types"

export default function TalentForecastPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)

  const handleGenerate = async (params: {
    timeframe: string
    department: string
    growthFactor: number
    includeMarketTrends: boolean
    includeAttrition: boolean
  }) => {
    setIsGenerating(true)

    try {
      // Appel à l'API pour générer les données de prévision
      const response = await fetch("/api/talent-forecast/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeframe: params.timeframe,
          department: params.department,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des prévisions")
      }

      const result = await response.json()

      if (result.success) {
        setForecastData(result.data)
      } else {
        console.error("Erreur:", result.error)
      }
    } catch (error) {
      console.error("Erreur lors de la génération des prévisions:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forecasting de la réserve de talents</h1>
        <p className="text-muted-foreground">
          Prévision des besoins futurs en recrutement et estimation des tendances du marché du travail
        </p>
      </div>

      <ForecastParameters onGenerate={handleGenerate} isGenerating={isGenerating} />

      {forecastData ? <ForecastCharts data={forecastData} /> : <ForecastEmptyState />}

      <ForecastTechnologies />
    </div>
  )
}
