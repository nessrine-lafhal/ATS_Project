"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Code, FileCode, Upload, CheckCircle, XCircle, AlertTriangle, GitBranch, GitCommit } from "lucide-react"

export default function CodeEvaluationPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleAnalyze = () => {
    setIsAnalyzing(true)

    // Simuler un délai d'analyse
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResults({
        quality: {
          correctness: 0.85,
          efficiency: 0.72,
          maintainability: 0.78,
          readability: 0.81,
        },
        metrics: {
          complexity: 18,
          linesOfCode: 142,
          functions: 8,
          classes: 2,
          commentRatio: 0.15,
        },
        issues: [
          {
            type: "error",
            message: "Fuite de mémoire potentielle dans la fonction handleData",
            line: 45,
            severity: "high",
          },
          {
            type: "warning",
            message: "Complexité cyclomatique élevée dans la fonction processInput",
            line: 78,
            severity: "medium",
          },
          { type: "warning", message: "Variable non utilisée 'tempData'", line: 92, severity: "low" },
          {
            type: "info",
            message: "Considérer l'utilisation de destructuration pour simplifier",
            line: 103,
            severity: "low",
          },
        ],
        bestPractices: {
          followed: ["Nommage descriptif", "Gestion des erreurs", "Tests unitaires"],
          missing: ["Documentation complète", "Optimisation des performances"],
        },
        overallScore: 76,
      })
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Évaluation automatisée des travaux pratiques</h1>
        <p className="text-muted-foreground">Évaluation automatisée des projets techniques soumis par les candidats</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCode className="mr-2 h-5 w-5" />
            Soumission de code
          </CardTitle>
          <CardDescription>Importez du code ou fournissez un lien vers un dépôt pour évaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!analysisResults ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                <Code className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Importez votre code pour évaluation</h3>
                <p className="text-sm text-muted-foreground mb-4">Formats supportés: ZIP, TAR.GZ ou lien GitHub</p>
                <div className="flex gap-2">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer des fichiers
                  </Button>
                  <Button variant="outline">
                    <GitBranch className="mr-2 h-4 w-4" />
                    Lien GitHub
                  </Button>
                </div>

                <div className="mt-6 w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://github.com/username/repository"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <GitBranch className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">projet-demo-candidat</p>
                      <p className="text-sm text-muted-foreground">
                        <GitCommit className="h-3 w-3 inline mr-1" />
                        Dernier commit: <span className="font-mono">a7d3f2e</span>
                      </p>
                    </div>
                  </div>
                  <Badge>JavaScript</Badge>
                </div>
              </div>
            )}

            {!analysisResults && (
              <Button className="w-full mt-4" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyse en cours..." : "Analyser le code de démonstration"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Qualité du code</CardTitle>
              <CardDescription>Évaluation de la qualité globale du code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Exactitude</span>
                    <span>{Math.round(analysisResults.quality.correctness * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.quality.correctness * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Efficacité</span>
                    <span>{Math.round(analysisResults.quality.efficiency * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.quality.efficiency * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Maintenabilité</span>
                    <span>{Math.round(analysisResults.quality.maintainability * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.quality.maintainability * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Lisibilité</span>
                    <span>{Math.round(analysisResults.quality.readability * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.quality.readability * 100} className="h-2" />
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Score global</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                      {analysisResults.overallScore}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Score basé sur la qualité, les métriques et le respect des bonnes pratiques
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métriques de code</CardTitle>
              <CardDescription>Statistiques et mesures du code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Complexité cyclomatique</p>
                    <p className="text-xl font-medium">{analysisResults.metrics.complexity}</p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Lignes de code</p>
                    <p className="text-xl font-medium">{analysisResults.metrics.linesOfCode}</p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fonctions</p>
                    <p className="text-xl font-medium">{analysisResults.metrics.functions}</p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Classes</p>
                    <p className="text-xl font-medium">{analysisResults.metrics.classes}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Ratio de commentaires</h3>
                  <div className="flex items-center gap-2">
                    <Progress value={analysisResults.metrics.commentRatio * 100} className="h-2 flex-1" />
                    <span>{Math.round(analysisResults.metrics.commentRatio * 100)}%</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Bonnes pratiques</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Suivies:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisResults.bestPractices.followed.map((practice: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                            {practice}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Manquantes:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysisResults.bestPractices.missing.map((practice: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-amber-50 text-amber-800">
                            {practice}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Problèmes détectés</CardTitle>
              <CardDescription>Erreurs, avertissements et suggestions d'amélioration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.issues.map((issue: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="font-medium">{issue.message}</p>
                      <p className="text-sm text-muted-foreground">Ligne {issue.line}</p>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity === "high" ? "Élevé" : issue.severity === "medium" ? "Moyen" : "Faible"}
                    </Badge>
                  </div>
                ))}

                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Recommandations d'amélioration</p>
                    <ul className="mt-2 text-blue-700 space-y-1">
                      <li>• Corriger la fuite de mémoire potentielle dans la fonction handleData</li>
                      <li>• Réduire la complexité de la fonction processInput en la divisant en sous-fonctions</li>
                      <li>• Supprimer ou utiliser la variable non utilisée 'tempData'</li>
                      <li>• Améliorer la documentation du code, particulièrement pour les fonctions complexes</li>
                      <li>• Optimiser les performances des opérations de traitement de données</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="technology" className="space-y-4">
        <TabsList>
          <TabsTrigger value="technology">Technologies utilisées</TabsTrigger>
          <TabsTrigger value="settings">Paramètres d'évaluation</TabsTrigger>
          <TabsTrigger value="history">Historique d'évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technologies d'évaluation de code</CardTitle>
              <CardDescription>Modèles et bibliothèques utilisés pour l'évaluation automatisée de code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Siamese Networks</h3>
                  <p className="text-muted-foreground">
                    Réseaux neuronaux siamois pour la comparaison de documents et de code, permettant d'évaluer la
                    similarité entre différentes solutions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">CodeBERT</h3>
                  <p className="text-muted-foreground">
                    Modèle pré-entraîné basé sur BERT spécifiquement pour la compréhension et l'évaluation de code
                    source dans différents langages de programmation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Analyseurs statiques</h3>
                  <p className="text-muted-foreground">
                    Outils d'analyse statique de code pour détecter les erreurs, les vulnérabilités et les problèmes de
                    qualité sans exécuter le code.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Métriques de complexité</h3>
                  <p className="text-muted-foreground">
                    Algorithmes pour calculer diverses métriques de complexité du code, comme la complexité
                    cyclomatique, la profondeur d'imbrication, etc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'évaluation</CardTitle>
              <CardDescription>Configurez les paramètres d'évaluation de code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Langages supportés</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="lang-js" checked />
                        <label htmlFor="lang-js">JavaScript/TypeScript</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="lang-python" checked />
                        <label htmlFor="lang-python">Python</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="lang-java" checked />
                        <label htmlFor="lang-java">Java</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="lang-cpp" />
                        <label htmlFor="lang-cpp">C/C++</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Critères d'évaluation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="criteria-correctness" checked />
                        <label htmlFor="criteria-correctness">Exactitude</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="criteria-efficiency" checked />
                        <label htmlFor="criteria-efficiency">Efficacité</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="criteria-maintainability" checked />
                        <label htmlFor="criteria-maintainability">Maintenabilité</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="criteria-readability" checked />
                        <label htmlFor="criteria-readability">Lisibilité</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Seuils d'alerte</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="complexity-threshold" className="text-sm">
                        Seuil de complexité cyclomatique
                      </label>
                      <span className="text-sm font-medium">15</span>
                    </div>
                    <input
                      type="range"
                      id="complexity-threshold"
                      min="5"
                      max="30"
                      step="1"
                      defaultValue="15"
                      className="w-full"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <label htmlFor="comment-ratio" className="text-sm">
                        Ratio minimum de commentaires
                      </label>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <input
                      type="range"
                      id="comment-ratio"
                      min="0"
                      max="30"
                      step="1"
                      defaultValue="10"
                      className="w-full"
                    />
                  </div>
                </div>

                <Button>Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'évaluations</CardTitle>
              <CardDescription>Évaluations de code précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground italic">Aucune évaluation précédente disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
