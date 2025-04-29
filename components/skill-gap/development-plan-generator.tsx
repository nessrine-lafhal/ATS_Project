"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { InfoIcon, AlertCircleIcon, CalendarIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DevelopmentPlanGenerator() {
  const [candidateResume, setCandidateResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [timeframeWeeks, setTimeframeWeeks] = useState(12)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateDevelopmentPlan = async () => {
    if (!candidateResume || !jobDescription) {
      setError("Veuillez fournir à la fois le CV du candidat et la description du poste.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/skill-gap/development-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateResume,
          jobDescription,
          timeframeWeeks,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération du plan: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(`Une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Générer les données pour le diagramme de Gantt
  const generateGanttData = () => {
    if (!result || !result.development_plan) return []

    // Créer un tableau pour chaque semaine
    const weeks = Array.from({ length: timeframeWeeks }, (_, i) => i + 1)

    // Pour chaque semaine, déterminer quelles compétences sont en cours d'apprentissage
    return weeks.map((week) => {
      const skillsInProgress = result.development_plan.filter(
        (plan: any) => plan.start_week <= week && plan.end_week >= week,
      )

      return {
        week: `Semaine ${week}`,
        skills: skillsInProgress.map((plan: any) => plan.skill).join(", ") || "Aucune activité",
        count: skillsInProgress.length,
      }
    })
  }

  const ganttData = result ? generateGanttData() : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de plan de développement</CardTitle>
          <CardDescription>
            Créez un plan de développement personnalisé pour combler les écarts de compétences
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="timeframeWeeks">Période de développement (semaines)</Label>
              <span className="text-sm font-medium">{timeframeWeeks} semaines</span>
            </div>
            <Slider
              id="timeframeWeeks"
              min={4}
              max={52}
              step={4}
              value={[timeframeWeeks]}
              onValueChange={(value) => setTimeframeWeeks(value[0])}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateDevelopmentPlan} disabled={loading}>
            {loading ? "Génération en cours..." : "Générer le plan de développement"}
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
            <CardTitle>Plan de développement des compétences</CardTitle>
            <CardDescription>
              Plan personnalisé sur {timeframeWeeks} semaines pour combler les écarts de compétences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Avant la formation</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-3xl font-bold text-red-500">{result.skill_gap_score_before}%</div>
                  <p className="text-sm text-muted-foreground">Score d'écart de compétences</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Après la formation</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-3xl font-bold text-green-500">{result.estimated_skill_gap_score_after}%</div>
                  <p className="text-sm text-muted-foreground">Score d'écart estimé</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Couverture</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-3xl font-bold">
                    {result.skills_covered}/{result.total_missing_skills}
                  </div>
                  <p className="text-sm text-muted-foreground">Compétences couvertes</p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Calendrier de développement</h3>
                <Badge variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {timeframeWeeks} semaines
                </Badge>
              </div>

              <div className="space-y-2">
                {ganttData.map((week, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{week.week}</span>
                      <span>{week.count} activité(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={week.count > 0 ? 100 : 0} className="h-8" />
                      <div className="absolute ml-4 text-xs text-white truncate max-w-[80%]">{week.skills}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Plan détaillé</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {result.development_plan.map((plan: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {plan.skill}
                            {plan.is_critical && (
                              <Badge variant="destructive" className="ml-2">
                                Critique
                              </Badge>
                            )}
                            {plan.is_partial_training && (
                              <Badge variant="outline" className="ml-2">
                                Formation partielle
                              </Badge>
                            )}
                          </CardTitle>
                          <Badge variant="outline">
                            Semaines {plan.start_week}-{plan.end_week}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Durée: {plan.duration_weeks} semaine(s)</span>
                          </div>

                          {plan.resources && (
                            <div className="space-y-2">
                              {plan.resources.courses && (
                                <div>
                                  <h4 className="text-sm font-medium">Cours recommandés:</h4>
                                  <ul className="list-disc list-inside text-sm">
                                    {plan.resources.courses.map((course: string, i: number) => (
                                      <li key={i}>{course}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {plan.resources.platforms && (
                                <div>
                                  <h4 className="text-sm font-medium">Plateformes:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {plan.resources.platforms.map((platform: string, i: number) => (
                                      <Badge key={i} variant="outline">
                                        {platform}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {plan.resources.books && (
                                <div>
                                  <h4 className="text-sm font-medium">Livres:</h4>
                                  <ul className="list-disc list-inside text-sm">
                                    {plan.resources.books.map((book: string, i: number) => (
                                      <li key={i}>{book}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {plan.resources.projects && (
                                <div>
                                  <h4 className="text-sm font-medium">Projets pratiques:</h4>
                                  <ul className="list-disc list-inside text-sm">
                                    {plan.resources.projects.map((project: string, i: number) => (
                                      <li key={i}>{project}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {plan.resources.suggestion && (
                                <div>
                                  <h4 className="text-sm font-medium">Suggestion:</h4>
                                  <p className="text-sm">{plan.resources.suggestion}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Résumé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Compétences critiques</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">Couvertes</span>
                    <Badge variant="outline" className="bg-green-50">
                      {result.critical_skills_covered}/
                      {result.critical_skills_covered + result.critical_skills_not_covered}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Temps d'apprentissage</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">Requis vs. Disponible</span>
                    <Badge variant="outline">
                      {Math.round(result.total_learning_time_required)} vs. {result.timeframe_available} semaines
                    </Badge>
                  </div>
                </div>
              </div>

              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Recommandation</AlertTitle>
                <AlertDescription>
                  {result.skills_not_covered > 0 ? (
                    <>
                      Ce plan ne couvre pas toutes les compétences manquantes. Envisagez d'étendre la période de
                      développement ou de prioriser davantage les compétences critiques.
                    </>
                  ) : (
                    <>
                      Ce plan couvre toutes les compétences manquantes dans le délai imparti. Suivez le calendrier
                      proposé pour maximiser votre progression.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
