"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import type { CostPredictionResult, RecruitmentData } from "@/lib/types"

interface CostPredictorProps {
  onPredict: (data: RecruitmentData) => Promise<CostPredictionResult>
  isLoading?: boolean
}

export function CostPredictor({ onPredict, isLoading = false }: CostPredictorProps) {
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentData>({
    channel: "",
    source: "",
    location: "",
    position_level: "",
    department: "",
  })
  const [prediction, setPrediction] = useState<CostPredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setRecruitmentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePredict = async () => {
    try {
      setError(null)
      const result = await onPredict(recruitmentData)
      setPrediction(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la prédiction")
      setPrediction(null)
    }
  }

  const isFormValid = () => {
    return recruitmentData.channel && recruitmentData.position_level && recruitmentData.department
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Prédiction des coûts de recrutement
        </CardTitle>
        <CardDescription>
          Estimez le coût d'un recrutement en fonction des caractéristiques du poste et du canal utilisé
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Paramètres</TabsTrigger>
            <TabsTrigger value="results" disabled={!prediction}>
              Résultats
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="channel">Canal de recrutement</Label>
                  <Select
                    value={recruitmentData.channel}
                    onValueChange={(value) => handleInputChange("channel", value)}
                  >
                    <SelectTrigger id="channel">
                      <SelectValue placeholder="Sélectionner un canal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Indeed">Indeed</SelectItem>
                      <SelectItem value="Référencement">Référencement</SelectItem>
                      <SelectItem value="Site carrière">Site carrière</SelectItem>
                      <SelectItem value="Agence de recrutement">Agence de recrutement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={recruitmentData.source} onValueChange={(value) => handleInputChange("source", value)}>
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Sélectionner une source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recherche active">Recherche active</SelectItem>
                      <SelectItem value="Application spontanée">Application spontanée</SelectItem>
                      <SelectItem value="Recommandation">Recommandation</SelectItem>
                      <SelectItem value="Chasseur de têtes">Chasseur de têtes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Select
                    value={recruitmentData.location}
                    onValueChange={(value) => handleInputChange("location", value)}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Sélectionner une localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paris">Paris</SelectItem>
                      <SelectItem value="Lyon">Lyon</SelectItem>
                      <SelectItem value="Marseille">Marseille</SelectItem>
                      <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                      <SelectItem value="Lille">Lille</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position_level">Niveau de poste</Label>
                  <Select
                    value={recruitmentData.position_level}
                    onValueChange={(value) => handleInputChange("position_level", value)}
                  >
                    <SelectTrigger id="position_level">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Directeur">Directeur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select
                  value={recruitmentData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ingénierie">Ingénierie</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Ventes">Ventes</SelectItem>
                    <SelectItem value="Produit">Produit</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="results">
            {prediction && (
              <div className="space-y-6">
                <div className="rounded-lg bg-muted p-6">
                  <h3 className="text-lg font-medium">Coût prévu</h3>
                  <div className="mt-2 text-3xl font-bold">
                    {prediction.predicted_cost.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Intervalle de confiance:{" "}
                    {prediction.confidence_interval.lower.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    -{" "}
                    {prediction.confidence_interval.upper.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Facteurs d'influence</h3>
                  <div className="space-y-4">
                    {Object.entries(prediction.influence_factors).map(([factor, data]) => (
                      <div key={factor}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{factor}</span>
                          <span className="text-sm text-muted-foreground">
                            {(data.impact * 100).toFixed(0)}% d'impact
                          </span>
                        </div>
                        <Progress value={data.impact * 100} className="mt-1" />
                        <p className="mt-1 text-xs text-muted-foreground">{data.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setRecruitmentData({
              channel: "",
              source: "",
              location: "",
              position_level: "",
              department: "",
            })
            setPrediction(null)
            setError(null)
          }}
        >
          Réinitialiser
        </Button>
        <Button onClick={handlePredict} disabled={!isFormValid() || isLoading}>
          {isLoading ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
              Prédiction en cours...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Prédire le coût
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
