"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Check, TrendingDown, TrendingUp } from "lucide-react"
import type { ChannelAnalysisResult } from "@/lib/types"

interface ChannelAnalysisProps {
  data: ChannelAnalysisResult
}

export function ChannelAnalysis({ data }: ChannelAnalysisProps) {
  const [activeTab, setActiveTab] = useState("metrics")

  // Préparation des données pour les graphiques
  const costData = data.channel_metrics.map((channel) => ({
    name: channel.channel,
    cost: channel.avg_cost,
  }))

  const timeData = data.channel_metrics
    .filter((channel) => channel.avg_time_to_hire !== null)
    .map((channel) => ({
      name: channel.channel,
      time: channel.avg_time_to_hire,
    }))

  const successData = data.channel_metrics
    .filter((channel) => channel.success_rate !== null)
    .map((channel) => ({
      name: channel.channel,
      rate: channel.success_rate ? channel.success_rate * 100 : 0,
    }))

  const roiData = data.channel_metrics
    .filter((channel) => channel.roi !== null)
    .map((channel) => ({
      name: channel.channel,
      roi: channel.roi ? channel.roi * 100 : 0,
    }))

  const budgetData = data.budget_optimization.channel_allocation.map((channel) => ({
    name: channel.channel,
    current: channel.current_budget,
    optimized: channel.optimized_budget,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse des canaux de recrutement</CardTitle>
        <CardDescription>
          Comparaison des performances et des coûts des différents canaux de recrutement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="budget">Optimisation du budget</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Coût moyen par canal</h3>
              <p className="text-sm text-muted-foreground">Comparaison du coût moyen de recrutement par canal</p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString("fr-FR")} €`, "Coût moyen"]} />
                    <Legend />
                    <Bar dataKey="cost" name="Coût moyen (€)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-medium">Temps moyen de recrutement</h3>
              <p className="text-sm text-muted-foreground">
                Comparaison du temps moyen de recrutement par canal (en jours)
              </p>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} jours`, "Temps moyen"]} />
                    <Legend />
                    <Bar dataKey="time" name="Temps moyen (jours)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Taux de succès</h3>
                <p className="text-sm text-muted-foreground">Pourcentage de recrutements réussis par canal</p>
                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={successData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Taux de succès"]} />
                      <Legend />
                      <Bar dataKey="rate" name="Taux de succès (%)" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-medium">Retour sur investissement (ROI)</h3>
                <p className="text-sm text-muted-foreground">ROI par canal de recrutement (en %)</p>
                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "ROI"]} />
                      <Legend />
                      <Bar dataKey="roi" name="ROI (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Recommandations</h3>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      {rec.type === "increase_investment" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Augmenter l'investissement
                        </Badge>
                      )}
                      {rec.type === "cost_effective" && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Économique
                        </Badge>
                      )}
                      {rec.type === "time_effective" && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Check className="mr-1 h-3 w-3" />
                          Rapide
                        </Badge>
                      )}
                      {rec.type === "most_successful" && (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          <Check className="mr-1 h-3 w-3" />
                          Efficace
                        </Badge>
                      )}
                    </div>
                    <h4 className="mt-2 text-base font-medium">{rec.channel}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Optimisation du budget</h3>
                <p className="text-sm text-muted-foreground">
                  Comparaison entre le budget actuel et le budget optimisé par canal
                </p>
                <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString("fr-FR")} €`, "Budget"]} />
                      <Legend />
                      <Bar dataKey="current" name="Budget actuel (€)" fill="#8884d8" />
                      <Bar dataKey="optimized" name="Budget optimisé (€)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Détails de l'optimisation</h3>
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">
                    Budget total: {data.budget_optimization.total_budget.toLocaleString("fr-FR")} €
                  </p>
                  <div className="mt-4 space-y-3">
                    {data.budget_optimization.channel_allocation.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{channel.channel}</span>
                          <div className="text-xs text-muted-foreground">
                            {channel.budget_change > 0 ? (
                              <span className="text-green-600">
                                +{channel.budget_change.toLocaleString("fr-FR")} € (
                                {channel.budget_change_pct.toFixed(1)}%)
                              </span>
                            ) : (
                              <span className="text-red-600">
                                {channel.budget_change.toLocaleString("fr-FR")} € (
                                {channel.budget_change_pct.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{channel.optimized_budget.toLocaleString("fr-FR")} €</div>
                          <div className="text-xs text-muted-foreground">
                            Actuel: {channel.current_budget.toLocaleString("fr-FR")} €
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
