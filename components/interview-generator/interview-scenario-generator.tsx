"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Copy, Download, Info, User, Briefcase, Building } from "lucide-react"
import type { InterviewScenarioResult } from "@/lib/types"

export function InterviewScenarioGenerator() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
  const [candidateSkills, setCandidateSkills] = useState("")
  const [candidateExperience, setCandidateExperience] = useState("")
  const [scenarioTypes, setScenarioTypes] = useState<string[]>(["technical", "behavioral", "situational", "roleplay"])
  const [numQuestions, setNumQuestions] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<InterviewScenarioResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")
  const [scriptContent, setScriptContent] = useState<string | null>(null)
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)

  const handleScenarioTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setScenarioTypes([...scenarioTypes, type])
    } else {
      setScenarioTypes(scenarioTypes.filter((t) => t !== type))
    }
  }

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("La description de poste est requise")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/interview-generator/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobDescription,
          candidate_profile: {
            job_title: jobTitle,
            skills: candidateSkills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),
            experience: candidateExperience
              .split(",")
              .map((e) => e.trim())
              .filter((e) => e),
          },
          company_info: {
            name: companyName,
            description: companyDescription,
          },
          scenario_types: scenarioTypes,
          num_questions: numQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération des scénarios d'entretien")
      }

      const result = await response.json()
      setGenerationResult(result.data)
      setActiveTab("result")
    } catch (err) {
      console.error("Erreur lors de la génération:", err)
      setError("Une erreur est survenue lors de la génération des scénarios d'entretien")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateScript = async () => {
    if (!generationResult) {
      return
    }

    setIsGeneratingScript(true)

    try {
      const response = await fetch("/api/interview-generator/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_title: jobTitle || "ce poste",
          scenarios: generationResult.scenarios,
          company_info: {
            name: companyName,
            description: companyDescription,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du script d'entretien")
      }

      const result = await response.json()
      setScriptContent(result.data.script)
      setActiveTab("script")
    } catch (err) {
      console.error("Erreur lors de la génération du script:", err)
      setError("Une erreur est survenue lors de la génération du script d'entretien")
    } finally {
      setIsGeneratingScript(false)
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Informations</TabsTrigger>
          <TabsTrigger value="result" disabled={!generationResult}>
            Scénarios générés
          </TabsTrigger>
          <TabsTrigger value="script" disabled={!scriptContent}>
            Script d'entretien
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Informations sur le poste
              </CardTitle>
              <CardDescription>
                Entrez les informations sur le poste pour générer des scénarios d'entretien personnalisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Titre du poste</Label>
                  <Input
                    id="job-title"
                    placeholder="Ex: Développeur Full Stack"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description">Description du poste *</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Collez la description complète du poste ici..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Informations sur l'entreprise
              </CardTitle>
              <CardDescription>Ces informations aideront à contextualiser les scénarios d'entretien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input
                    id="company-name"
                    placeholder="Ex: Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Description de l'entreprise</Label>
                  <Textarea
                    id="company-description"
                    placeholder="Décrivez brièvement l'entreprise, sa mission, ses valeurs..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations sur le candidat (optionnel)
              </CardTitle>
              <CardDescription>
                Ces informations permettront de personnaliser davantage les scénarios d'entretien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-skills">Compétences du candidat</Label>
                  <Input
                    id="candidate-skills"
                    placeholder="Ex: JavaScript, React, Node.js (séparées par des virgules)"
                    value={candidateSkills}
                    onChange={(e) => setCandidateSkills(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidate-experience">Expérience du candidat</Label>
                  <Input
                    id="candidate-experience"
                    placeholder="Ex: 3 ans développeur frontend, 2 ans chef de projet (séparées par des virgules)"
                    value={candidateExperience}
                    onChange={(e) => setCandidateExperience(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options de génération</CardTitle>
              <CardDescription>Personnalisez les types de scénarios à générer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Types de scénarios</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="technical"
                        checked={scenarioTypes.includes("technical")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("technical", checked as boolean)}
                      />
                      <label
                        htmlFor="technical"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Questions techniques
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="behavioral"
                        checked={scenarioTypes.includes("behavioral")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("behavioral", checked as boolean)}
                      />
                      <label
                        htmlFor="behavioral"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Questions comportementales
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="situational"
                        checked={scenarioTypes.includes("situational")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("situational", checked as boolean)}
                      />
                      <label
                        htmlFor="situational"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Questions situationnelles
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="roleplay"
                        checked={scenarioTypes.includes("roleplay")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("roleplay", checked as boolean)}
                      />
                      <label
                        htmlFor="roleplay"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Jeux de rôle
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cultural_fit"
                        checked={scenarioTypes.includes("cultural_fit")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("cultural_fit", checked as boolean)}
                      />
                      <label
                        htmlFor="cultural_fit"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Adéquation culturelle
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="motivation"
                        checked={scenarioTypes.includes("motivation")}
                        onCheckedChange={(checked) => handleScenarioTypeChange("motivation", checked as boolean)}
                      />
                      <label
                        htmlFor="motivation"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Motivation
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="num-questions">Nombre de questions par type</Label>
                  <Input
                    id="num-questions"
                    type="number"
                    min={1}
                    max={10}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number.parseInt(e.target.value) || 5)}
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
                  <Button onClick={handleGenerate} disabled={isGenerating || !jobDescription.trim()}>
                    {isGenerating ? "Génération en cours..." : "Générer les scénarios d'entretien"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-4">
          {generationResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Scénarios d'entretien générés</CardTitle>
                  <CardDescription>
                    Scénarios personnalisés pour le poste de {jobTitle || "ce poste"} (Catégorie:{" "}
                    {generationResult.job_category})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Compétences clés identifiées</h3>
                      <div className="flex flex-wrap gap-2">
                        {generationResult.key_skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Responsabilités clés identifiées</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {generationResult.key_responsibilities.map((responsibility, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {Object.entries(generationResult.scenarios).map(([type, questions]) => {
                      if (type === "roleplay") {
                        return (
                          <div key={type} className="space-y-3">
                            <h3 className="font-medium">Jeux de rôle</h3>
                            <div className="space-y-4">
                              {Array.isArray(questions) &&
                                questions.map((scenario: any, index: number) => (
                                  <Card key={index} className="bg-muted/40">
                                    <CardHeader className="py-3">
                                      <CardTitle className="text-base">{scenario.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-2">
                                      <p className="text-sm">{scenario.description}</p>
                                      {scenario.evaluation_criteria && (
                                        <div className="mt-2 flex items-start gap-2">
                                          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                                          <p className="text-xs text-muted-foreground">
                                            <span className="font-medium">Critères d'évaluation:</span>{" "}
                                            {scenario.evaluation_criteria}
                                          </p>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>
                        )
                      } else {
                        let title = "Questions"
                        switch (type) {
                          case "technical":
                            title = "Questions techniques"
                            break
                          case "behavioral":
                            title = "Questions comportementales"
                            break
                          case "situational":
                            title = "Questions situationnelles"
                            break
                          case "cultural_fit":
                            title = "Questions d'adéquation culturelle"
                            break
                          case "motivation":
                            title = "Questions de motivation"
                            break
                        }

                        return (
                          <div key={type} className="space-y-3">
                            <h3 className="font-medium">{title}</h3>
                            <ul className="space-y-2">
                              {Array.isArray(questions) &&
                                questions.map((question, index) => (
                                  <li key={index} className="bg-muted/40 p-3 rounded-md">
                                    {question}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )
                      }
                    })}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("input")}>
                    Modifier les informations
                  </Button>
                  <Button onClick={handleGenerateScript} disabled={isGeneratingScript}>
                    {isGeneratingScript ? "Génération en cours..." : "Générer un script d'entretien complet"}
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="script" className="space-y-4">
          {scriptContent && (
            <Card>
              <CardHeader>
                <CardTitle>Script d'entretien complet</CardTitle>
                <CardDescription>
                  Script d'entretien structuré pour le poste de {jobTitle || "ce poste"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap p-4 border rounded-md bg-muted/30 max-h-[600px] overflow-y-auto">
                    {scriptContent}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(scriptContent)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        downloadAsText(
                          scriptContent,
                          `script-entretien-${jobTitle.toLowerCase().replace(/\s+/g, "-") || "poste"}.md`,
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700">Conseil d'utilisation</AlertTitle>
                    <AlertDescription className="text-blue-600">
                      Ce script est un guide pour structurer votre entretien. N'hésitez pas à l'adapter en fonction du
                      déroulement de la conversation et des réponses du candidat.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("result")}>
                  Retour aux scénarios
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("input")}>
                  Modifier les informations
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
