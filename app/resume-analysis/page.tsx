"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, FileText, Upload, CheckCircle, AlertTriangle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { CVParsingResult } from "@/lib/cv-parser-service"

export default function ResumeAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [analysisResults, setAnalysisResults] = useState<CVParsingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setError(null) // Réinitialiser l'erreur lorsqu'un nouveau fichier est sélectionné
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()

      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      if (jobDescription) {
        formData.append("jobDescription", jobDescription)
      }

      const response = await fetch("/api/resume-analysis", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setAnalysisResults(data.data)
        toast({
          title: "Analyse terminée",
          description: "L'analyse du CV a été effectuée avec succès.",
        })
      } else {
        throw new Error(data.error || "Une erreur est survenue lors de l'analyse")
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error)
      setError("Une erreur est survenue lors de l'analyse du CV. Mode de secours activé.")

      toast({
        title: "Mode de secours activé",
        description: "L'analyse est effectuée en mode de secours avec des données simulées.",
        variant: "warning",
      })

      // Simuler une analyse réussie pour l'interface utilisateur
      const demoResult: CVParsingResult = {
        personalInfo: {
          fullName: "Sophie Martin",
          email: "sophie.martin@example.com",
          phone: "+33 6 12 34 56 78",
          location: "Paris, France",
        },
        skills: {
          technical: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"],
          soft: ["Communication", "Travail d'équipe", "Résolution de problèmes"],
        },
        education: [
          {
            degree: "Master en Informatique",
            institution: "Université Paris-Saclay",
            fieldOfStudy: "Informatique",
            graduationYear: 2018,
          },
        ],
        experience: [
          {
            position: "Développeur Full Stack",
            company: "Tech Solutions",
            duration: "3 ans",
            description: "Développement d'applications web avec React et Node.js",
          },
        ],
        matchScore: jobDescription ? 85 : undefined,
      }

      setAnalysisResults(demoResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse sémantique des CV</h1>
        <p className="text-muted-foreground">Extraction d'informations contextuelles des CV et lettres de motivation</p>
      </div>

      {error && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Importer un CV
            </CardTitle>
            <CardDescription>Importez un CV pour analyse sémantique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Glissez-déposez votre CV ici"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Formats supportés: PDF, DOCX, TXT (max 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Sélectionner un fichier
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="job-description" className="text-sm font-medium">
                  Description du poste (optionnel)
                </label>
                <Textarea
                  id="job-description"
                  placeholder="Entrez la description du poste pour calculer un score de correspondance..."
                  className="min-h-[100px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyse en cours..." : "Analyser le CV"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Vous pouvez également utiliser le CV de démonstration en cliquant directement sur "Analyser le CV".
              </p>
            </div>
          </CardContent>
        </Card>

        {analysisResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Résultats de l'analyse
              </CardTitle>
              <CardDescription>Informations extraites du CV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisResults.matchScore && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Score de correspondance</h3>
                      <p className="text-sm text-muted-foreground">Compatibilité avec la description du poste</p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center text-xl font-bold">
                        {Math.round(analysisResults.matchScore)}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nom complet</span>
                      <span className="font-medium">{analysisResults.personalInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{analysisResults.personalInfo.email}</span>
                    </div>
                    {analysisResults.personalInfo.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone</span>
                        <span className="font-medium">{analysisResults.personalInfo.phone}</span>
                      </div>
                    )}
                    {analysisResults.personalInfo.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Localisation</span>
                        <span className="font-medium">{analysisResults.personalInfo.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Compétences techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.skills.technical.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Soft skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.skills.soft.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {analysisResults.education && analysisResults.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Formation</h3>
                    <div className="space-y-2">
                      {analysisResults.education.map((edu, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.institution} • {edu.fieldOfStudy} • {edu.graduationYear}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResults.experience && analysisResults.experience.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Expérience professionnelle</h3>
                    <div className="space-y-2">
                      {analysisResults.experience.map((exp, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <p className="font-medium">{exp.position}</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.company} • {exp.duration}
                          </p>
                          {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="extraction" className="space-y-4">
        <TabsList>
          <TabsTrigger value="extraction">Extraction d'informations</TabsTrigger>
          <TabsTrigger value="semantic">Analyse sémantique</TabsTrigger>
          <TabsTrigger value="skills">Détection de compétences</TabsTrigger>
          <TabsTrigger value="technology">Technologies utilisées</TabsTrigger>
        </TabsList>

        <TabsContent value="extraction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comment fonctionne l'extraction d'informations</CardTitle>
              <CardDescription>Techniques utilisées pour extraire les informations des CV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Notre système utilise des modèles de deep learning pour extraire automatiquement les informations clés
                  des CV. Voici les principales techniques utilisées :
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">1. Reconnaissance d'entités nommées (NER)</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous utilisons des modèles spécialisés pour identifier les entités comme les noms, emails, numéros
                    de téléphone, entreprises, et dates dans le texte du CV.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Classification de sections</h4>
                  <p className="text-sm text-muted-foreground">
                    Le système identifie automatiquement les différentes sections du CV (expérience, formation,
                    compétences) pour extraire les informations de manière structurée.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">3. Extraction de relations</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous analysons les relations entre les entités pour comprendre, par exemple, quelle formation a été
                    suivie à quelle institution et pendant quelle période.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Avantages</p>
                    <p className="mt-1 text-blue-700">
                      Cette approche permet d'extraire rapidement et avec précision les informations clés des CV, même
                      lorsqu'ils ont des formats très différents. Le système s'améliore continuellement grâce à
                      l'apprentissage automatique.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse sémantique</CardTitle>
              <CardDescription>Comprendre le contexte et le sens du contenu des CV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  L'analyse sémantique va au-delà de la simple extraction d'informations en comprenant le contexte et le
                  sens du contenu des CV.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">1. Embeddings contextuels</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous utilisons des modèles comme CamemBERT (pour le français) qui génèrent des représentations
                    vectorielles contextuelles du texte, capturant ainsi les nuances sémantiques.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Analyse de similarité</h4>
                  <p className="text-sm text-muted-foreground">
                    Le système calcule la similarité sémantique entre le CV et la description du poste pour déterminer
                    la pertinence du candidat.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">3. Détection de thèmes</h4>
                  <p className="text-sm text-muted-foreground">
                    L'analyse identifie les thèmes principaux abordés dans le CV, comme les domaines d'expertise ou les
                    secteurs d'activité.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Limitations</p>
                    <p className="mt-1 text-amber-700">
                      L'analyse sémantique peut être influencée par le style d'écriture et la terminologie utilisée. Des
                      termes techniques très spécifiques ou des formulations inhabituelles peuvent parfois être mal
                      interprétés.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Détection de compétences</CardTitle>
              <CardDescription>Identification automatique des compétences techniques et soft skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Notre système utilise des techniques avancées pour identifier et catégoriser les compétences
                  mentionnées dans les CV.
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">1. Base de connaissances de compétences</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous disposons d'une base de données complète de compétences techniques et soft skills,
                    régulièrement mise à jour pour inclure les technologies émergentes.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Détection contextuelle</h4>
                  <p className="text-sm text-muted-foreground">
                    Le système ne se contente pas de repérer des mots-clés, mais comprend le contexte dans lequel les
                    compétences sont mentionnées (par exemple, distinguer une compétence maîtrisée d'une compétence
                    simplement mentionnée).
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">3. Inférence de compétences</h4>
                  <p className="text-sm text-muted-foreground">
                    Grâce à l'apprentissage automatique, le système peut inférer des compétences non explicitement
                    mentionnées mais fortement corrélées avec l'expérience décrite.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Applications</p>
                    <p className="mt-1 text-blue-700">
                      La détection précise des compétences permet non seulement d'évaluer l'adéquation avec un poste
                      spécifique, mais aussi d'identifier des candidats pour des postes auxquels ils n'auraient pas
                      pensé postuler.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technologies de deep learning utilisées</CardTitle>
              <CardDescription>Modèles et bibliothèques pour l'analyse de CV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">Hugging Face Transformers</h3>
                    <p className="text-sm text-muted-foreground">
                      Bibliothèque open-source fournissant des modèles de pointe pour le traitement du langage naturel,
                      comme BERT et RoBERTa, que nous utilisons pour l'analyse sémantique des CV.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">spaCy</h3>
                    <p className="text-sm text-muted-foreground">
                      Bibliothèque Python pour le traitement du langage naturel, utilisée pour la reconnaissance
                      d'entités nommées et l'analyse syntaxique des CV.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">CamemBERT</h3>
                    <p className="text-sm text-muted-foreground">
                      Modèle de langage basé sur RoBERTa, spécifiquement entraîné sur des textes en français, utilisé
                      pour l'analyse sémantique des CV en français.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">scikit-learn</h3>
                    <p className="text-sm text-muted-foreground">
                      Bibliothèque Python pour l'apprentissage automatique, utilisée pour la classification et le calcul
                      de similarité entre CV et descriptions de poste.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Avantages de notre approche</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Utilisation de modèles open-source de pointe, régulièrement mis à jour</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Support multilingue avec des modèles spécifiques pour le français</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Combinaison de plusieurs techniques pour une analyse complète et précise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Architecture modulaire permettant d'intégrer facilement de nouveaux modèles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
