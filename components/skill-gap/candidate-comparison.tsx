"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon, AlertCircleIcon, PlusCircleIcon, XCircleIcon, UserIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CandidateComparison() {
  const [jobDescription, setJobDescription] = useState("")
  const [candidates, setCandidates] = useState<{ id: string; name: string; resume: string }[]>([
    { id: "1", name: "Candidat 1", resume: "" },
    { id: "2", name: "Candidat 2", resume: "" },
  ])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const addCandidate = () => {
    setCandidates([
      ...candidates,
      { id: `${candidates.length + 1}`, name: `Candidat ${candidates.length + 1}`, resume: "" },
    ])
  }

  const removeCandidate = (id: string) => {
    if (candidates.length <= 2) {
      setError("Vous devez avoir au moins deux candidats pour la comparaison.")
      return
    }
    setCandidates(candidates.filter((c) => c.id !== id))
  }

  const updateCandidate = (id: string, field: "name" | "resume", value: string) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const compareSkillGaps = async () => {
    // Vérifier que tous les champs sont remplis
    if (!jobDescription) {
      setError("Veuillez fournir la description du poste.")
      return
    }

    const emptyResumes = candidates.filter((c) => !c.resume)
    if (emptyResumes.length > 0) {
      setError(`Veuillez fournir le CV pour ${emptyResumes.map((c) => c.name).join(", ")}.`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Préparer les données pour l'API
      const candidateResumes: Record<string, string> = {}
      candidates.forEach((c) => {
        candidateResumes[c.id] = c.resume
      })

      const response = await fetch("/api/skill-gap/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateResumes,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de la comparaison: ${response.statusText}`)
      }

      const data = await response.json()

      // Ajouter les noms des candidats au résultat
      if (data.ranked_candidates) {
        data.ranked_candidates = data.ranked_candidates.map((rc: any) => {
          const candidate = candidates.find((c) => c.id === rc.candidate_id)
          return {
            ...rc,
            name: candidate ? candidate.name : `Candidat ${rc.candidate_id}`,
          }
        })
      }

      setResult(data)
    } catch (err) {
      setError(`Une erreur s'est produite: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des candidats</CardTitle>
          <CardDescription>
            Comparez plusieurs candidats pour un poste en fonction de leurs écarts de compétences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Candidats</h3>
              <Button variant="outline" size="sm" onClick={addCandidate}>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Ajouter un candidat
              </Button>
            </div>

            {candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <Input
                        value={candidate.name}
                        onChange={(e) => updateCandidate(candidate.id, "name", e.target.value)}
                        className="h-8 w-40"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCandidate(candidate.id)}
                      disabled={candidates.length <= 2}
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <Textarea
                    placeholder={`Collez le CV de ${candidate.name} ici...`}
                    value={candidate.resume}
                    onChange={(e) => updateCandidate(candidate.id, "resume", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={compareSkillGaps} disabled={loading}>
            {loading ? "Comparaison en cours..." : "Comparer les candidats"}
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
            <CardTitle>Résultats de la comparaison</CardTitle>
            <CardDescription>Classement des candidats en fonction de leurs écarts de compétences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Compétences requises pour le poste</h3>
              <div className="flex flex-wrap gap-2">
                {result.job_skills.map((skill: string, index: number) => (
                  <Badge key={index} variant={result.critical_skills.includes(skill) ? "default" : "outline"}>
                    {skill}
                    {result.critical_skills.includes(skill) && <span className="ml-1 text-xs">*</span>}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">* Compétences critiques</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Classement des candidats</h3>
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Rang</TableHead>
                      <TableHead>Candidat</TableHead>
                      <TableHead className="text-right">Score de correspondance</TableHead>
                      <TableHead className="text-right">Écart de compétences</TableHead>
                      <TableHead className="text-right">Compétences critiques manquantes</TableHead>
                      <TableHead className="text-right">Compétences manquantes</TableHead>
                      <TableHead className="text-right">Compétences supplémentaires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.ranked_candidates.map((candidate: any, index: number) => (
                      <TableRow key={candidate.candidate_id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{candidate.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-green-50">
                            {candidate.match_score}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-red-50">
                            {candidate.skill_gap_score}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{candidate.missing_critical_skills_count}</TableCell>
                        <TableCell className="text-right">{candidate.missing_skills_count}</TableCell>
                        <TableCell className="text-right">{candidate.additional_skills_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Analyse détaillée</AlertTitle>
              <AlertDescription>
                Pour voir une analyse détaillée des écarts de compétences pour chaque candidat, utilisez l'outil
                d'analyse individuelle.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
