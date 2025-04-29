"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Copy, Download } from "lucide-react"
import type { JobAnalysisResult, JobOptimizationResult } from "@/lib/types"
import { JobDescriptionAnalyzer } from "./job-description-analyzer"

export function JobDescriptionOptimizer() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobCategory, setJobCategory] = useState("tech")
  const [optimizationLevel, setOptimizationLevel] = useState("medium")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<JobOptimizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null)

  const handleAnalysisComplete = (result: JobAnalysisResult) => {
    setAnalysis(result)
  }

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError("Veuillez entrer une description de poste à optimiser")
      return
    }

    setIsOptimizing(true)
    setError(null)

    try {
      const response = await fetch("/api/job-optimizer/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
          job_category: jobCategory,
          optimization_level: optimizationLevel,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'optimisation de la description de poste")
      }

      const result = await response.json()
      setOptimizationResult(result.data)
      setActiveTab("result")
    } catch (err) {
      console.error("Erreur lors de l'optimisation:", err)
      setError("Une erreur est survenue lors de l'optimisation de la description de poste")
    } finally {
      setIsOptimizing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Texte copié dans le presse-papiers")
      })
      .catch((err) => {
        console.error("Erreur lors de la copie:", err)
      })
  }

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-amber-100 text-amber-800">Moyen</Badge>
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Description de poste</TabsTrigger>
          <TabsTrigger value="result" disabled={!optimizationResult}>
            Résultat optimisé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimiseur de description de poste</CardTitle>
              <CardDescription>
                Entrez une description de poste pour l'optimiser et la rendre plus attractive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Catégorie du poste</label>
                    <Select value={jobCategory} onValueChange={setJobCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technologie</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Ventes</SelectItem>
                        <SelectItem value="hr">Ressources Humaines</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau d'optimisation</label>
                    <Select value={optimizationLevel} onValueChange={setOptimizationLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Léger (corrections mineures)</SelectItem>
                        <SelectItem value="medium">Moyen (améliorations significatives)</SelectItem>
                        <SelectItem value="full">Complet (réécriture complète)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description de poste</label>
                  <Textarea
                    placeholder="Collez votre description de poste ici..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setJobDescription("")}>
                    Effacer
                  </Button>
                  <Button onClick={handleOptimize} disabled={isOptimizing || !jobDescription.trim()}>
                    {isOptimizing ? "Optimisation en cours..." : "Optimiser la description"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <JobDescriptionAnalyzer onAnalysisComplete={handleAnalysisComplete} />
        </TabsContent>

        <TabsContent value="result" className="space-y-4">
          {optimizationResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Description de poste optimisée</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(optimizationResult.optimized_analysis.overall_score)}`}
                      >
                        {Math.round(optimizationResult.optimized_analysis.overall_score)}
                      </span>
                      {getScoreBadge(optimizationResult.optimized_analysis.overall_score)}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Amélioration de {Math.round(optimizationResult.improvement_percentage)}% par rapport à la version
                    originale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap p-4 border rounded-md bg-muted/30">
                      {optimizationResult.optimized_description}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(optimizationResult.optimized_description)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadAsText(
                            optimizationResult.optimized_description,
                            `description-poste-optimisee-${new Date().toISOString().split("T")[0]}.txt`,
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des scores</CardTitle>
                  <CardDescription>Comparaison des métriques avant et après optimisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Structure</span>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(optimizationResult.original_analysis.structure_score)}>
                              {Math.round(optimizationResult.original_analysis.structure_score)}%
                            </span>
                            <ArrowRight className="h-4 w-4" />
                            <span className={getScoreColor(optimizationResult.optimized_analysis.structure_score)}>
                              {Math.round(optimizationResult.optimized_analysis.structure_score)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={optimizationResult.optimized_analysis.structure_score} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Clarté</span>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(optimizationResult.original_analysis.clarity_score)}>
                              {Math.round(optimizationResult.original_analysis.clarity_score)}%
                            </span>
                            <ArrowRight className="h-4 w-4" />
                            <span className={getScoreColor(optimizationResult.optimized_analysis.clarity_score)}>
                              {Math.round(optimizationResult.optimized_analysis.clarity_score)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={optimizationResult.optimized_analysis.clarity_score} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Attractivité</span>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(optimizationResult.original_analysis.attractiveness_score)}>
                              {Math.round(optimizationResult.original_analysis.attractiveness_score)}%
                            </span>
                            <ArrowRight className="h-4 w-4" />
                            <span className={getScoreColor(optimizationResult.optimized_analysis.attractiveness_score)}>
                              {Math.round(optimizationResult.optimized_analysis.attractiveness_score)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={optimizationResult.optimized_analysis.attractiveness_score} className="h-2" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium mb-2">Avant optimisation</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.original_analysis.has_responsibilities ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Responsabilités</span>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.original_analysis.has_requirements ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Profil recherché</span>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.original_analysis.has_benefits ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Avantages</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Après optimisation</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.optimized_analysis.has_responsibilities ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Responsabilités</span>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.optimized_analysis.has_requirements ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Profil recherché</span>
                          </div>

                          <div className="flex items-center gap-2 p-2 rounded-md border">
                            {optimizationResult.optimized_analysis.has_benefits ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>Avantages</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <span>Mots avant: {optimizationResult.original_analysis.word_count}</span>
                  <span>Mots après: {optimizationResult.optimized_analysis.word_count}</span>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
