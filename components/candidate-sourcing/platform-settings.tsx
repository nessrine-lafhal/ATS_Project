"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Github, Linkedin, MessageSquare, RefreshCw } from "lucide-react"
import { getPlatformStatus, updatePlatformStatus, getSourcingStatistics } from "@/lib/candidate-sourcing-service"

export function PlatformSettings() {
  const [platforms, setPlatforms] = useState({
    linkedin: true,
    github: true,
    stackoverflow: true,
  })
  const [statistics, setStatistics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlatformStatus()
    fetchStatistics()
  }, [])

  const fetchPlatformStatus = async () => {
    try {
      setIsLoading(true)
      const response = await getPlatformStatus()

      if (response.success && response.platforms) {
        setPlatforms(
          Object.entries(response.platforms).reduce(
            (acc, [key, value]: [string, any]) => {
              acc[key as keyof typeof acc] = value.enabled
              return acc
            },
            { ...platforms },
          ),
        )
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des plateformes:", error)
      setError("Impossible de récupérer le statut des plateformes")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await getSourcingStatistics()

      if (response.success && response.statistics) {
        setStatistics(response.statistics)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
    }
  }

  const handleTogglePlatform = async (platform: string, enabled: boolean) => {
    try {
      setIsLoading(true)
      const response = await updatePlatformStatus(platform, enabled)

      if (response.success) {
        setPlatforms((prev) => ({
          ...prev,
          [platform]: enabled,
        }))
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la plateforme ${platform}:`, error)
      setError(`Impossible de mettre à jour la plateforme ${platform}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "stackoverflow":
        return <MessageSquare className="h-5 w-5" />
      default:
        return null
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn"
      case "github":
        return "GitHub"
      case "stackoverflow":
        return "Stack Overflow"
      default:
        return platform
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Plateformes de sourcing</CardTitle>
          <CardDescription>
            Activez ou désactivez les plateformes utilisées pour le sourcing de candidats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(platforms).map(([platform, enabled]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPlatformIcon(platform)}
                  <Label htmlFor={`${platform}-toggle`} className="font-medium">
                    {getPlatformName(platform)}
                  </Label>
                </div>
                <Switch
                  id={`${platform}-toggle`}
                  checked={enabled}
                  onCheckedChange={(checked) => handleTogglePlatform(platform, checked)}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={fetchPlatformStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de sourcing</CardTitle>
            <CardDescription>Aperçu des performances du sourcing de candidats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Candidats trouvés</p>
                <p className="text-2xl font-bold">{statistics.total_candidates_found}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500">Score moyen</p>
                <p className="text-2xl font-bold">{statistics.average_match_score}%</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-gray-500">Candidats par requête</p>
                <p className="text-2xl font-bold">{statistics.sourcing_efficiency.candidates_per_query.toFixed(1)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Candidats par plateforme</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(statistics.candidates_by_platform).map(([platform, count]: [string, any]) => (
                  <div key={platform} className="flex items-center gap-2">
                    {getPlatformIcon(platform)}
                    <div>
                      <p className="text-sm font-medium">{getPlatformName(platform)}</p>
                      <p className="text-lg">{count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Compétences les plus recherchées</h4>
              <div className="flex flex-wrap gap-2">
                {statistics.top_skills_found.map((skill: string, index: number) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
