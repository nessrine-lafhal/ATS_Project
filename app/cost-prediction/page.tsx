"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostPredictor } from "@/components/cost-prediction/cost-predictor"
import { ChannelAnalysis } from "@/components/cost-prediction/channel-analysis"
import { CostForecast } from "@/components/cost-prediction/cost-forecast"
import type { CostPredictionResult, CostForecastResult, ChannelAnalysisResult, RecruitmentData } from "@/lib/types"

export default function CostPredictionPage() {
  const [isLoading, setIsLoading] = useState({
    prediction: false,
    forecast: false,
    channels: false,
  })
  const [channelData, setChannelData] = useState<ChannelAnalysisResult | null>(null)

  const handlePredict = async (recruitmentData: RecruitmentData): Promise<CostPredictionResult> => {
    setIsLoading((prev) => ({ ...prev, prediction: true }))
    try {
      const response = await fetch("/api/cost-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recruitmentData }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la prédiction du coût")
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Échec de la prédiction du coût")
      }

      return result.data
    } finally {
      setIsLoading((prev) => ({ ...prev, prediction: false }))
    }
  }

  const handleForecast = async (periods: number, freq: string): Promise<CostForecastResult> => {
    setIsLoading((prev) => ({ ...prev, forecast: true }))
    try {
      const response = await fetch("/api/cost-prediction/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ periods, freq }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des prévisions")
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Échec de la génération des prévisions")
      }

      return result.data
    } finally {
      setIsLoading((prev) => ({ ...prev, forecast: false }))
    }
  }

  const loadChannelAnalysis = async () => {
    if (channelData) return

    setIsLoading((prev) => ({ ...prev, channels: true }))
    try {
      const response = await fetch("/api/cost-prediction/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse des canaux")
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Échec de l'analyse des canaux")
      }

      setChannelData(result.data)
    } catch (error) {
      console.error("Erreur lors de l'analyse des canaux:", error)
    } finally {
      setIsLoading((prev) => ({ ...prev, channels: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prédiction dynamique des coûts de recrutement</h1>
        <p className="text-muted-foreground">
          Estimation dynamique des coûts de recrutement basés sur les différentes sources et canaux utilisés
        </p>
      </div>

      <Tabs
        defaultValue="predictor"
        className="w-full"
        onValueChange={(value) => {
          if (value === "channels") {
            loadChannelAnalysis()
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictor">Prédiction des coûts</TabsTrigger>
          <TabsTrigger value="forecast">Prévisions temporelles</TabsTrigger>
          <TabsTrigger value="channels">Analyse des canaux</TabsTrigger>
        </TabsList>
        <TabsContent value="predictor">
          <CostPredictor onPredict={handlePredict} isLoading={isLoading.prediction} />
        </TabsContent>
        <TabsContent value="forecast">
          <CostForecast onForecast={handleForecast} isLoading={isLoading.forecast} />
        </TabsContent>
        <TabsContent value="channels">
          {channelData ? (
            <ChannelAnalysis data={channelData} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                {isLoading.channels ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Chargement de l'analyse des canaux...</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">Aucune donnée d'analyse disponible</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
