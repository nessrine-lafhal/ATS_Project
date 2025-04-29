"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Languages, Brain, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function MultilingualPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sourceText, setSourceText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("fr")
  const [targetLanguages, setTargetLanguages] = useState<string[]>(["en", "es", "de"])
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleAnalyze = () => {
    if (!sourceText) return

    setIsAnalyzing(true)

    // Simuler un délai d'analyse
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResults({
        translations: {
          en: "We are looking for a Full Stack Developer with experience in React, Node.js, and cloud technologies. The ideal candidate should have strong problem-solving skills and be able to work in an agile environment.",
          es: "Buscamos un Desarrollador Full Stack con experiencia en React, Node.js y tecnologías cloud. El candidato ideal debe tener fuertes habilidades para resolver problemas y poder trabajar en un entorno ágil.",
          de: "Wir suchen einen Full-Stack-Entwickler mit Erfahrung in React, Node.js und Cloud-Technologien. Der ideale Kandidat sollte starke Problemlösungsfähigkeiten haben und in einer agilen Umgebung arbeiten können.",
          ja: "React、Node.js、クラウドテクノロジーの経験を持つフルスタック開発者を探しています。理想的な候補者は、強力な問題解決能力を持ち、アジャイル環境で働くことができる必要があります。",
        },
        keyTerms: [
          { term: "Full Stack", relevance: 95 },
          { term: "React", relevance: 90 },
          { term: "Node.js", relevance: 88 },
          { term: "Cloud", relevance: 82 },
          { term: "Agile", relevance: 75 },
        ],
        matchScores: [
          { language: "en", score: 92 },
          { language: "es", score: 88 },
          { language: "de", score: 85 },
          { language: "ja", score: 78 },
        ],
        semanticAnalysis: {
          tone: "Professional",
          complexity: "Medium",
          clarity: "High",
          inclusivity: "Medium",
          technicalLevel: "Advanced",
        },
        candidates: [
          {
            id: 1,
            name: "Sophie Martin",
            languages: ["French", "English", "Spanish"],
            matchScore: 92,
            skills: ["React", "Node.js", "AWS", "TypeScript"],
          },
          {
            id: 2,
            name: "Thomas Schmidt",
            languages: ["German", "English"],
            matchScore: 88,
            skills: ["React", "Node.js", "Docker", "MongoDB"],
          },
          {
            id: 3,
            name: "Elena Rodriguez",
            languages: ["Spanish", "English", "Portuguese"],
            matchScore: 85,
            skills: ["React", "Vue.js", "Node.js", "Azure"],
          },
          {
            id: 4,
            name: "Hiroshi Tanaka",
            languages: ["Japanese", "English"],
            matchScore: 82,
            skills: ["React", "Node.js", "GraphQL", "AWS"],
          },
        ],
      })
    }, 2500)
  }

  const demoText =
    "Nous recherchons un Développeur Full Stack avec expérience en React, Node.js et technologies cloud. Le candidat idéal doit avoir de solides compétences en résolution de problèmes et être capable de travailler dans un environnement agile."

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-emerald-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Matching sémantique multilingue</h1>
        <p className="text-muted-foreground">
          Matching entre les descriptions de postes et les profils de candidats dans plusieurs langues
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Texte source
          </CardTitle>
          <CardDescription>
            Entrez une description de poste ou un profil de candidat pour l'analyse multilingue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Textarea
                  placeholder="Entrez votre texte ici..."
                  className="min-h-[200px]"
                  value={sourceText || demoText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
              </div>
              <div className="md:w-64 space-y-4">
                <div>
                  <Label htmlFor="source-language" className="text-sm font-medium mb-1 block">
                    Langue source
                  </Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger id="source-language">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">Anglais</SelectItem>
                      <SelectItem value="es">Espagnol</SelectItem>
                      <SelectItem value="de">Allemand</SelectItem>
                      <SelectItem value="ja">Japonais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-1 block">Langues cibles</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lang-en"
                        checked={targetLanguages.includes("en")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetLanguages([...targetLanguages, "en"])
                          } else {
                            setTargetLanguages(targetLanguages.filter((lang) => lang !== "en"))
                          }
                        }}
                      />
                      <label htmlFor="lang-en">Anglais</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lang-es"
                        checked={targetLanguages.includes("es")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetLanguages([...targetLanguages, "es"])
                          } else {
                            setTargetLanguages(targetLanguages.filter((lang) => lang !== "es"))
                          }
                        }}
                      />
                      <label htmlFor="lang-es">Espagnol</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lang-de"
                        checked={targetLanguages.includes("de")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetLanguages([...targetLanguages, "de"])
                          } else {
                            setTargetLanguages(targetLanguages.filter((lang) => lang !== "de"))
                          }
                        }}
                      />
                      <label htmlFor="lang-de">Allemand</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lang-ja"
                        checked={targetLanguages.includes("ja")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTargetLanguages([...targetLanguages, "ja"])
                          } else {
                            setTargetLanguages(targetLanguages.filter((lang) => lang !== "ja"))
                          }
                        }}
                      />
                      <label htmlFor="lang-ja">Japonais</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAnalyze} disabled={isAnalyzing || (!sourceText && !demoText)}>
                {isAnalyzing ? "Analyse en cours..." : "Analyser le texte"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSourceText("")
                  setAnalysisResults(null)
                }}
              >
                Effacer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <Tabs defaultValue="translations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="translations">Traductions</TabsTrigger>
            <TabsTrigger value="analysis">Analyse sémantique</TabsTrigger>
            <TabsTrigger value="matching">Matching de candidats</TabsTrigger>
          </TabsList>

          <TabsContent value="translations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Languages className="mr-2 h-5 w-5" />
                  Traductions
                </CardTitle>
                <CardDescription>Traductions du texte source dans les langues cibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(analysisResults.translations)
                    .filter(([lang]) => targetLanguages.includes(lang))
                    .map(([lang, translation]) => (
                      <div key={lang} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {lang === "en"
                              ? "Anglais"
                              : lang === "es"
                                ? "Espagnol"
                                : lang === "de"
                                  ? "Allemand"
                                  : "Japonais"}
                          </Badge>
                          <div className="flex-1 h-px bg-border"></div>
                          <span
                            className={getMatchScoreColor(
                              analysisResults.matchScores.find((s: any) => s.language === lang).score,
                            )}
                          >
                            Score: {analysisResults.matchScores.find((s: any) => s.language === lang).score}%
                          </span>
                        </div>
                        <div className="p-4 rounded-md bg-muted/50">
                          <p>{translation}</p>
                        </div>
                      </div>
                    ))}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Analyse de qualité de traduction</p>
                      <p className="mt-2 text-blue-700">
                        Les traductions préservent bien le sens et le contexte du texte original. Les termes techniques
                        comme "Full Stack", "React" et "Node.js" sont correctement maintenus dans toutes les langues.
                        Les nuances concernant les compétences en résolution de problèmes et l'environnement agile sont
                        également bien transmises.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Termes clés</CardTitle>
                  <CardDescription>Termes importants identifiés dans le texte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResults.keyTerms.map((term: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>{term.term}</span>
                          <span className="font-medium">{term.relevance}%</span>
                        </div>
                        <Progress value={term.relevance} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse sémantique</CardTitle>
                  <CardDescription>Caractéristiques sémantiques du texte</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Ton</span>
                      <Badge variant="outline">{analysisResults.semanticAnalysis.tone}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Complexité</span>
                      <Badge variant="outline">{analysisResults.semanticAnalysis.complexity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clarté</span>
                      <Badge variant="outline">{analysisResults.semanticAnalysis.clarity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Inclusivité</span>
                      <Badge variant="outline">{analysisResults.semanticAnalysis.inclusivity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Niveau technique</span>
                      <Badge variant="outline">{analysisResults.semanticAnalysis.technicalLevel}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scores de matching par langue</CardTitle>
                <CardDescription>Qualité du matching sémantique dans chaque langue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResults.matchScores
                    .filter((score: any) => targetLanguages.includes(score.language))
                    .map((score: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>
                            {score.language === "en"
                              ? "Anglais"
                              : score.language === "es"
                                ? "Espagnol"
                                : score.language === "de"
                                  ? "Allemand"
                                  : "Japonais"}
                          </span>
                          <span className={getMatchScoreColor(score.score)}>{score.score}%</span>
                        </div>
                        <Progress value={score.score} className="h-2" />
                      </div>
                    ))}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Analyse</h4>
                    <p className="mt-1 text-blue-700">
                      Le matching sémantique est excellent en anglais (92%) et très bon en espagnol (88%) et en allemand
                      (85%). Le japonais présente un score légèrement inférieur (78%), ce qui est typique pour les
                      langues asiatiques en raison des différences structurelles avec les langues européennes. Ces
                      scores indiquent une bonne préservation du sens à travers les différentes langues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matching" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Candidats compatibles multilingues</CardTitle>
                <CardDescription>
                  Candidats correspondant au profil recherché avec compétences linguistiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analysisResults.candidates.map((candidate: any) => (
                    <div key={candidate.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{candidate.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.languages.map((language: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800">
                              {language}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.map((skill: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                            {candidate.matchScore}% match
                          </span>
                          <Progress value={candidate.matchScore} className="h-2 w-24" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm">Voir profil</Button>
                          <Button size="sm" variant="outline">
                            Contacter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800">Analyse du matching</h4>
                    <p className="mt-1 text-blue-700">
                      Les candidats ont été matchés en fonction de leurs compétences techniques et linguistiques. Sophie
                      Martin présente le meilleur score (92%) grâce à sa maîtrise des technologies requises et de trois
                      langues pertinentes. Thomas Schmidt et Elena Rodriguez ont également de bons scores grâce à leurs
                      compétences techniques, bien qu'ils maîtrisent moins de langues.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Technologies de matching multilingue
          </CardTitle>
          <CardDescription>Modèles et bibliothèques utilisés pour le matching sémantique multilingue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">mBERT (Multilingual BERT)</h3>
              <p className="text-muted-foreground">
                Version multilingue de BERT, entraînée sur 104 langues, permettant de générer des embeddings sémantiques
                comparables entre différentes langues.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">XLM-R (XLM-RoBERTa)</h3>
              <p className="text-muted-foreground">
                Modèle multilingue basé sur RoBERTa, entraîné sur 100 langues avec 2,5 TB de données filtrées du Common
                Crawl, offrant des performances état-de-l'art pour le traitement multilingue.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Hugging Face Transformers</h3>
              <p className="text-muted-foreground">
                Bibliothèque open-source fournissant des implémentations de modèles de pointe pour le NLP, utilisée pour
                charger et inférer avec mBERT et XLM-R.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Sentence Transformers</h3>
              <p className="text-muted-foreground">
                Framework pour générer des embeddings de phrases denses, permettant de comparer sémantiquement des
                textes dans différentes langues via des mesures de similarité cosinus.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
