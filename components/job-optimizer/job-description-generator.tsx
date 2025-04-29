"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Copy, Download, Plus, X } from "lucide-react"
import type { JobGenerationResult } from "@/lib/types"

export function JobDescriptionGenerator() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobCategory, setJobCategory] = useState("tech")
  const [companyName, setCompanyName] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<JobGenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError("Le titre du poste est requis")
      return
    }

    if (skills.length === 0) {
      setError("Veuillez ajouter au moins une compétence requise")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/job-optimizer/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_title: jobTitle,
          job_category: jobCategory,
          skills_required: skills,
          company_info: {
            name: companyName,
            description: companyDescription,
            contact_email: contactEmail,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération de la description de poste")
      }

      const result = await response.json()
      setGenerationResult(result.data)
    } catch (err) {
      console.error("Erreur lors de la génération:", err)
      setError("Une erreur est survenue lors de la génération de la description de poste")
    } finally {
      setIsGenerating(false)
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
      <Card>
        <CardHeader>
          <CardTitle>Générateur de description de poste</CardTitle>
          <CardDescription>
            Générez une description de poste complète et attractive à partir de quelques informations de base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre du poste *</label>
                <Input
                  placeholder="Ex: Développeur Full Stack"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Compétences requises *</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une compétence"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Informations sur l'entreprise</label>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Nom de l'entreprise"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  placeholder="Email de contact"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Description de l'entreprise"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? "Génération en cours..." : "Générer la description"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {generationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Description de poste générée</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getScoreColor(generationResult.analysis.overall_score)}`}>
                  {Math.round(generationResult.analysis.overall_score)}
                </span>
                {getScoreBadge(generationResult.analysis.overall_score)}
              </div>
            </CardTitle>
            <CardDescription>Description de poste générée pour {generationResult.job_title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="whitespace-pre-wrap p-4 border rounded-md bg-muted/30">
                {generationResult.generated_description}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generationResult.generated_description)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadAsText(
                      generationResult.generated_description,
                      `description-poste-${generationResult.job_title.toLowerCase().replace(/\s+/g, "-")}.txt`,
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <span>Nombre de mots: {generationResult.analysis.word_count}</span>
            <span>Généré le: {new Date(generationResult.timestamp).toLocaleString()}</span>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
