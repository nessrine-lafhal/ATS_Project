"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, Pause, Upload, AudioWaveformIcon as Waveform, Clock, Smile, Frown, Meh } from "lucide-react"

export default function VoiceAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleAnalyze = () => {
    setIsAnalyzing(true)

    // Simuler un délai d'analyse
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResults({
        emotions: {
          confidence: 0.72,
          enthusiasm: 0.65,
          anxiety: 0.28,
          hesitation: 0.35,
        },
        speech: {
          clarity: 0.85,
          pace: 0.68,
          volume: 0.75,
          articulation: 0.82,
        },
        content: {
          relevance: 0.78,
          coherence: 0.81,
          vocabulary: 0.76,
          technicality: 0.83,
        },
        keyMoments: [
          { time: 35, label: "Enthousiasme sur l'expérience passée", emotion: "positive", confidence: 0.88 },
          { time: 72, label: "Hésitation sur question technique", emotion: "hesitation", confidence: 0.82 },
          { time: 118, label: "Confiance en expliquant un projet", emotion: "confidence", confidence: 0.91 },
          { time: 145, label: "Anxiété sur question de gestion de stress", emotion: "anxiety", confidence: 0.76 },
        ],
        overallScore: 78,
        duration: 180, // 3 minutes en secondes
        wordsPerMinute: 142,
      })
    }, 3000)
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "positive":
        return <Smile className="h-4 w-4" />
      case "anxiety":
      case "hesitation":
        return <Frown className="h-4 w-4" />
      default:
        return <Meh className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse vocale avancée</h1>
        <p className="text-muted-foreground">
          Analyse des éléments vocaux tels que la tonalité et le rythme pendant les entretiens pour détecter des
          émotions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5" />
            Audio d'entretien
          </CardTitle>
          <CardDescription>Importez ou enregistrez un audio d'entretien pour analyse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!analysisResults ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                <Mic className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Importez un fichier audio d'entretien</h3>
                <p className="text-sm text-muted-foreground mb-4">Formats supportés: MP3, WAV, OGG (max 50MB)</p>
                <div className="flex gap-2">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer un fichier
                  </Button>
                  <Button variant="outline">
                    <Mic className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="ml-2 text-sm">entretien_demo.mp3</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">3:00</span>
                    </div>
                  </div>

                  <div className="h-16 bg-black/5 rounded-md flex items-center justify-center">
                    <Waveform className="h-8 w-full text-primary/60" />
                  </div>
                </div>
              </div>
            )}

            {!analysisResults && (
              <Button className="w-full mt-4" onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyse en cours..." : "Analyser l'audio de démonstration"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {analysisResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Analyse émotionnelle</CardTitle>
              <CardDescription>Détection des émotions à travers la voix</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Confiance</span>
                    <span>{Math.round(analysisResults.emotions.confidence * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.emotions.confidence * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Enthousiasme</span>
                    <span>{Math.round(analysisResults.emotions.enthusiasm * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.emotions.enthusiasm * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Anxiété</span>
                    <span>{Math.round(analysisResults.emotions.anxiety * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.emotions.anxiety * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Hésitation</span>
                    <span>{Math.round(analysisResults.emotions.hesitation * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.emotions.hesitation * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Qualité de parole</CardTitle>
              <CardDescription>Analyse des caractéristiques vocales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Clarté</span>
                    <span>{Math.round(analysisResults.speech.clarity * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.speech.clarity * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Rythme</span>
                    <span>{Math.round(analysisResults.speech.pace * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.speech.pace * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Volume</span>
                    <span>{Math.round(analysisResults.speech.volume * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.speech.volume * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Articulation</span>
                    <span>{Math.round(analysisResults.speech.articulation * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.speech.articulation * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyse du contenu</CardTitle>
              <CardDescription>Évaluation du contenu verbal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Pertinence</span>
                    <span>{Math.round(analysisResults.content.relevance * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.content.relevance * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Cohérence</span>
                    <span>{Math.round(analysisResults.content.coherence * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.content.coherence * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Vocabulaire</span>
                    <span>{Math.round(analysisResults.content.vocabulary * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.content.vocabulary * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Technicité</span>
                    <span>{Math.round(analysisResults.content.technicality * 100)}%</span>
                  </div>
                  <Progress value={analysisResults.content.technicality * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métriques globales</CardTitle>
              <CardDescription>Statistiques et score global</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {analysisResults.overallScore}
                  </div>
                  <div>
                    <p className="font-medium">Score global</p>
                    <p className="text-sm text-muted-foreground">
                      Basé sur l'analyse émotionnelle, la qualité de parole et le contenu
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="text-xl font-medium">
                      {Math.floor(analysisResults.duration / 60)}:
                      {(analysisResults.duration % 60).toString().padStart(2, "0")}
                    </p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Mots par minute</p>
                    <p className="text-xl font-medium">{analysisResults.wordsPerMinute}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Recommandations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Bonne clarté et articulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">!</span>
                      <span>Réduire les hésitations lors des questions techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">!</span>
                      <span>Améliorer la gestion du stress sur certains sujets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Bon niveau de vocabulaire technique</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Moments clés</CardTitle>
              <CardDescription>Points importants détectés pendant l'entretien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  {analysisResults.keyMoments.map((moment: any, index: number) => (
                    <div
                      key={index}
                      className="absolute top-0 h-1 w-1 rounded-full bg-blue-500 cursor-pointer hover:scale-150 transition-transform"
                      style={{ left: `${(moment.time / analysisResults.duration) * 100}%` }}
                      title={moment.label}
                    />
                  ))}
                </div>
                <div className="pt-6">
                  <div className="space-y-4">
                    {analysisResults.keyMoments.map((moment: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <Button variant="outline" size="sm">
                            {Math.floor(moment.time / 60)}:{(moment.time % 60).toString().padStart(2, "0")}
                          </Button>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{moment.label}</p>
                          <div className="flex items-center mt-1">
                            {getEmotionIcon(moment.emotion)}
                            <span className="text-sm text-muted-foreground ml-1">
                              Confiance: {Math.round(moment.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            moment.emotion === "positive"
                              ? "bg-green-100 text-green-800"
                              : moment.emotion === "anxiety"
                                ? "bg-amber-100 text-amber-800"
                                : moment.emotion === "hesitation"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                          }
                        >
                          {moment.emotion === "positive"
                            ? "Positif"
                            : moment.emotion === "anxiety"
                              ? "Anxiété"
                              : moment.emotion === "hesitation"
                                ? "Hésitation"
                                : moment.emotion === "confidence"
                                  ? "Confiance"
                                  : moment.emotion}
                        </Badge>
                      </div>
                    ))}
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
          <TabsTrigger value="settings">Paramètres d'analyse</TabsTrigger>
          <TabsTrigger value="history">Historique d'analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="technology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technologies d'analyse vocale</CardTitle>
              <CardDescription>Modèles et bibliothèques utilisés pour l'analyse vocale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Vosk</h3>
                  <p className="text-muted-foreground">
                    Toolkit open-source pour la reconnaissance vocale, permettant la transcription et l'analyse du
                    discours.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">DeepSpeech</h3>
                  <p className="text-muted-foreground">
                    Modèle de reconnaissance vocale open-source de Mozilla, basé sur le papier de recherche de Baidu.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Librosa</h3>
                  <p className="text-muted-foreground">
                    Bibliothèque Python pour l'analyse audio et musicale, utilisée pour extraire des caractéristiques
                    vocales.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Modèles de détection d'émotions</h3>
                  <p className="text-muted-foreground">
                    Réseaux de neurones convolutifs et récurrents entraînés pour détecter les émotions à partir des
                    caractéristiques vocales comme le ton, le rythme et l'intonation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'analyse</CardTitle>
              <CardDescription>Configurez les paramètres d'analyse vocale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Détection d'émotions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="emotion-confidence" checked />
                        <label htmlFor="emotion-confidence">Confiance</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="emotion-enthusiasm" checked />
                        <label htmlFor="emotion-enthusiasm">Enthousiasme</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="emotion-anxiety" checked />
                        <label htmlFor="emotion-anxiety">Anxiété</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="emotion-hesitation" checked />
                        <label htmlFor="emotion-hesitation">Hésitation</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Analyse de parole</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="speech-clarity" checked />
                        <label htmlFor="speech-clarity">Clarté</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="speech-pace" checked />
                        <label htmlFor="speech-pace">Rythme</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="speech-volume" checked />
                        <label htmlFor="speech-volume">Volume</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="speech-articulation" checked />
                        <label htmlFor="speech-articulation">Articulation</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Sensibilité de détection</h3>
                  <div className="space-y-2">
                    <label htmlFor="sensitivity" className="text-sm text-muted-foreground">
                      Seuil de confiance (0.5 - 0.95)
                    </label>
                    <input
                      type="range"
                      id="sensitivity"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      defaultValue="0.75"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Plus sensible</span>
                      <span>Plus précis</span>
                    </div>
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
              <CardTitle>Historique d'analyses</CardTitle>
              <CardDescription>Analyses vocales précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground italic">Aucune analyse précédente disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
