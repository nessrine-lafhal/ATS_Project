"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle,
  Video,
  Upload,
  Play,
  Pause,
  SkipForward,
  Clock,
  Smile,
  Frown,
  Meh,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { VideoAnalysisResult, MomentCle } from "@/lib/video-analysis-enhanced-service"

interface EnhancedVideoAnalysisProps {
  candidateId?: string
  jobId?: string
}

export function EnhancedVideoAnalysis({ candidateId = "demo", jobId = "demo" }: EnhancedVideoAnalysisProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<VideoAnalysisResult | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Simuler une progression pendant l'analyse
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAnalyzing && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 3
          const newProgress = Math.min(prev + increment, 100)

          if (newProgress === 100) {
            setIsAnalyzing(false)
            clearInterval(interval)
          }

          return newProgress
        })
      }, 300)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAnalyzing, progress])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner une vidéo à analyser",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("video", file)
      formData.append("candidateId", candidateId)
      formData.append("jobId", jobId)

      const response = await fetch("/api/video-analysis", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setIsUploading(false)
        setIsAnalyzing(true)
        setProgress(10)

        // Simuler l'analyse (dans un environnement réel, on suivrait la progression réelle)
        setTimeout(() => {
          setResults(data.data)
          setVideoUrl(data.data.analyzedVideoUrl || null)
          setProgress(100)
          setIsAnalyzing(false)

          toast({
            title: "Analyse terminée",
            description: "L'analyse de la vidéo a été complétée avec succès",
          })
        }, 5000)
      } else {
        throw new Error(data.error || "Erreur inconnue")
      }
    } catch (error) {
      console.error("Error uploading video:", error)
      setIsUploading(false)
      setIsAnalyzing(false)
      setProgress(0)

      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'analyse vidéo",
        variant: "destructive",
      })
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp
      if (!isPlaying) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "joie":
        return <Smile className="h-4 w-4 text-green-500" />
      case "tristesse":
        return <Frown className="h-4 w-4 text-blue-500" />
      case "colere":
        return <Frown className="h-4 w-4 text-red-500" />
      case "surprise":
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      case "peur":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "degout":
        return <Frown className="h-4 w-4 text-yellow-500" />
      default:
        return <Meh className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-blue-500"
    if (score >= 0.4) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analyse Vidéo d&apos;Entretien</CardTitle>
          <CardDescription>
            Téléchargez une vidéo d&apos;entretien pour analyser les émotions, l&apos;engagement et les indices non
            verbaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!results ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors">
                <label className="flex flex-col items-center cursor-pointer">
                  <Video className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Sélectionnez une vidéo ou glissez-déposez</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isUploading || isAnalyzing}
                  />
                  {file && <span className="mt-2 text-sm font-medium text-blue-600">{file.name}</span>}
                </label>
              </div>

              <Button onClick={handleUpload} disabled={!file || isUploading || isAnalyzing} className="w-full">
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Téléchargement...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Télécharger et Analyser
                  </>
                )}
              </Button>

              {(isUploading || isAnalyzing) && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {isUploading ? "Téléchargement de la vidéo..." : `Analyse en cours: ${Math.round(progress)}%`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Tabs defaultValue="video">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video">Vidéo Analysée</TabsTrigger>
                <TabsTrigger value="results">Résultats</TabsTrigger>
                <TabsTrigger value="moments">Moments Clés</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-4 mt-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-white">Vidéo non disponible</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handlePlayPause} disabled={!videoUrl}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Score Global</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreColor(results.score_global)}`}
                        >
                          <span className="text-2xl font-bold text-white">
                            {Math.round(results.score_global * 100)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Émotion Dominante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center space-x-2">
                        {getEmotionIcon(results.emotion_dominante)}
                        <span className="text-xl font-medium capitalize">{results.emotion_dominante}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Progress value={results.niveau_engagement * 100} className="h-2" />
                        <p className="text-center font-medium">{Math.round(results.niveau_engagement * 100)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Analyse Détaillée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Durée Totale</p>
                          <p className="text-lg font-medium">{formatTime(results.duree_totale)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Variations d&apos;Attention</p>
                          <p className="text-lg font-medium">{Math.round(results.variations_attention * 100)}%</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Recommandations</h4>
                        <ul className="space-y-2">
                          {results.niveau_engagement < 0.6 && (
                            <li className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>Améliorer l&apos;engagement pendant l&apos;entretien</span>
                            </li>
                          )}
                          {results.variations_attention > 0.3 && (
                            <li className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>Maintenir une attention plus constante</span>
                            </li>
                          )}
                          {["tristesse", "peur", "colere"].includes(results.emotion_dominante.toLowerCase()) && (
                            <li className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>Travailler sur la gestion des émotions</span>
                            </li>
                          )}
                          {results.score_global >= 0.7 && (
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span>Excellente performance globale</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="moments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Moments Clés</CardTitle>
                    <CardDescription>Moments significatifs détectés pendant l&apos;entretien</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.moments_cles && results.moments_cles.length > 0 ? (
                      <div className="space-y-4">
                        {results.moments_cles.map((moment: MomentCle, index: number) => (
                          <div
                            key={index}
                            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleSeek(moment.timestamp)}
                          >
                            <div className="mr-4 flex-shrink-0">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(moment.timestamp)}
                              </Badge>
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center">
                                {getEmotionIcon(moment.emotion)}
                                <span className="ml-1 font-medium capitalize">{moment.emotion}</span>
                              </div>
                              <p className="text-sm text-gray-500">Intensité: {Math.round(moment.intensite * 100)}%</p>
                            </div>
                            <div className="ml-2">
                              <SkipForward className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Meh className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Aucun moment clé détecté</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {results && (
            <Button
              variant="outline"
              onClick={() => {
                setResults(null)
                setVideoUrl(null)
                setFile(null)
                setProgress(0)
              }}
            >
              Nouvelle Analyse
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default EnhancedVideoAnalysis
