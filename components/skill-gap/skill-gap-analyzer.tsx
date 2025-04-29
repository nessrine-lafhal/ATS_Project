"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircleIcon, CheckCircleIcon, BookOpenIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function SkillGapAnalyzer() {
  const [candidateResume, setCandidateResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeSkillGap = async () => {
    if (!candidateResume || !jobDescription) {
      setError("Veuillez fournir à la fois le CV du candidat et la description du poste.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/skill-gap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateResume,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'analyse: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(`Une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Préparer les données pour le graphique des domaines de compétences
  const domainChartData = result?.skill_gap_by_domain
    ? Object.entries(result.skill_gap_by_domain).map(([domain, data]: [string, any]) => ({
        domain: domain.charAt(0).toUpperCase() + domain.slice(1).replace("_", " "),
        matchScore: data.match_score,
        gapScore: data.gap_score,
      }))
    : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse des écarts de compétences</CardTitle>
          <CardDescription>
            Identifiez les écarts entre les compétences du candidat et les exigences du poste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="candidateResume" className="block text-sm font-medium mb-1">
              CV du candidat
            </label>
            <Textarea
              id="candidateResume"
              placeholder="Collez le CV du candidat ici..."
              value={candidateResume}
              onChange={(e) => setCandidateResume(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium mb-1">
              Description du poste
            </label>
            <Textarea
              id="jobDescription"
              placeholder="Collez la description du poste ici..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={analyzeSkillGap} disabled={loading}>
            {loading ? "Analyse en cours..." : "Analyser les écarts de compétences"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse</CardTitle>
            <CardDescription>Analyse des écarts de compétences entre le candidat et le poste</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Score de correspondance</h3>
                <div className="flex items-center space-x-2">
                  <Progress value={result.overall_match_score} className="h-2" />
                  <span className="text-sm font-medium">{result.overall_match_score}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Score d'écart de compétences</h3>
                <div className="flex items-center space-x-2">
                  <Progress value={result.skill_gap_score} className="h-2" />
                  <span className="text-sm font-medium">{result.skill_gap_score}%</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="matched">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="matched">Compétences correspondantes ({result.matched_skills.length})</TabsTrigger>
                <TabsTrigger value="missing">Compétences manquantes ({result.missing_skills.length})</TabsTrigger>
                <TabsTrigger value="additional">
                  Compétences supplémentaires ({result.additional_skills.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="matched" className="space-y-4">
                {result.matched_skills.length > 0 ? (
                  <div className="space-y-2">
                    {result.matched_skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          <span>{skill.job_skill}</span>
                          {skill.job_skill !== skill.candidate_skill && (
                            <span className="text-sm text-muted-foreground">
                              (correspondance: {skill.candidate_skill})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={skill.importance > 0.7 ? "default" : "outline"}>
                            {Math.round(skill.importance * 100)}% importance
                          </Badge>
                          <Badge variant="outline" className="bg-green-50">
                            {Math.round(skill.similarity * 100)}% similarité
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Aucune compétence correspondante</AlertTitle>
                    <AlertDescription>
                      Aucune correspondance n'a été trouvée entre les compétences du candidat et les exigences du poste.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="missing" className="space-y-4">
                {result.missing_skills.length > 0 ? (
                  <div className="space-y-2">
                    {result.missing_skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <AlertCircleIcon className="h-4 w-4 text-red-500" />
                          <span>{skill.skill}</span>
                          {skill.is_critical && (
                            <Badge variant="destructive" className="ml-2">
                              Critique
                            </Badge>
                          )}
                        </div>
                        <Badge variant={skill.importance > 0.7 ? "default" : "outline"}>
                          {Math.round(skill.importance * 100)}% importance
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Aucune compétence manquante</AlertTitle>
                    <AlertDescription>
                      Le candidat possède toutes les compétences requises pour ce poste.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                {result.additional_skills.length > 0 ? (
                  <div className="space-y-2">
                    {result.additional_skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <InfoIcon className="h-4 w-4 text-blue-500" />
                          <span>{skill.skill}</span>
                          {skill.best_related_job_skill && (
                            <span className="text-sm text-muted-foreground">
                              (lié à: {skill.best_related_job_skill})
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          {Math.round(skill.relevance * 100)}% pertinence
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Aucune compétence supplémentaire</AlertTitle>
                    <AlertDescription>
                      Le candidat ne possède pas de compétences supplémentaires par rapport aux exigences du poste.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Écart de compétences par domaine</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={domainChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="domain" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="matchScore" name="Score de correspondance (%)" fill="#4ade80" />
                    <Bar dataKey="gapScore" name="Score d'écart (%)" fill="#f87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {result.training_recommendations && result.training_recommendations.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommandations de formation</h3>
                  <div className="space-y-4">
                    {result.training_recommendations.map((recommendation: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {recommendation.skill}
                              {recommendation.is_critical && (
                                <Badge variant="destructive" className="ml-2">
                                  Critique
                                </Badge>
                              )}
                            </CardTitle>
                            <Badge variant={recommendation.importance > 0.7 ? "default" : "outline"}>
                              {Math.round(recommendation.importance * 100)}% importance
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-2">
                            {recommendation.resources.courses && (
                              <div>
                                <h4 className="text-sm font-medium">Cours recommandés:</h4>
                                <ul className="list-disc list-inside text-sm">
                                  {recommendation.resources.courses.map((course: string, i: number) => (
                                    <li key={i}>{course}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {recommendation.resources.platforms && (
                              <div>
                                <h4 className="text-sm font-medium">Plateformes:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {recommendation.resources.platforms.map((platform: string, i: number) => (
                                    <Badge key={i} variant="outline">
                                      {platform}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {recommendation.resources.estimated_time && (
                              <div className="flex items-center space-x-2 text-sm">
                                <BookOpenIcon className="h-4 w-4" />
                                <span>Temps estimé: {recommendation.resources.estimated_time}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
