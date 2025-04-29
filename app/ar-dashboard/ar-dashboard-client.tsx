"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, Camera, Smartphone } from "lucide-react"
import { ARScene } from "@/components/ar-dashboard/ar-scene"
import { ARMarker } from "@/components/ar-dashboard/ar-marker"
import { ARVisualization } from "@/components/ar-dashboard/ar-visualization"
import { DataCharts } from "@/components/ar-dashboard/data-charts"
import { DataControls, type VisualizationSettings } from "@/components/ar-dashboard/data-controls"
import { getRecruitmentMetrics } from "@/lib/ar-dashboard-service"
import type { RecruitmentMetrics } from "@/lib/types"

export default function ARDashboardClient() {
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  const [metrics, setMetrics] = useState<RecruitmentMetrics | null>(null)
  const [visualizationSettings, setVisualizationSettings] = useState<VisualizationSettings | null>(null)
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false)
  const [isARSupported, setIsARSupported] = useState<boolean>(true)

  useEffect(() => {
    // Vérifier si l'appareil est mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    }

    // Vérifier si WebXR est supporté
    const checkARSupport = () => {
      return "xr" in navigator && "isSessionSupported" in (navigator as any).xr
    }

    setIsMobileDevice(checkMobile())
    setIsARSupported(checkARSupport())

    // Charger les métriques initiales
    const loadInitialMetrics = async () => {
      const data = await getRecruitmentMetrics("month")
      setMetrics(data)
    }

    loadInitialMetrics()
  }, [])

  const handleDataChange = (data: RecruitmentMetrics) => {
    setMetrics(data)
  }

  const handleVisualizationChange = (settings: VisualizationSettings) => {
    setVisualizationSettings(settings)
  }

  const getChartData = (type: string) => {
    if (!metrics) return { labels: [], datasets: [] }

    switch (type) {
      case "hiring":
        return {
          labels: metrics.hiringMetrics.map((item) => item.period),
          datasets: [
            {
              label: "Recrutements",
              data: metrics.hiringMetrics.map((item) => item.hired),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
            },
            {
              label: "Objectifs",
              data: metrics.hiringMetrics.map((item) => item.target),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
            },
          ],
        }
      case "candidates":
        return {
          labels: metrics.candidateMetrics.map((item) => item.period),
          datasets: [
            {
              label: "Candidatures",
              data: metrics.candidateMetrics.map((item) => item.applications),
              backgroundColor: "rgba(255, 159, 64, 0.6)",
              borderColor: "rgba(255, 159, 64, 1)",
            },
            {
              label: "Qualifiés",
              data: metrics.candidateMetrics.map((item) => item.qualified),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
            },
          ],
        }
      case "diversity":
        return {
          labels: metrics.diversityMetrics.map((item) => item.name),
          datasets: [
            {
              label: "Diversité",
              data: metrics.diversityMetrics.map((item) => item.value),
              backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
            },
          ],
        }
      default:
        return { labels: [], datasets: [] }
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord en réalité augmentée</h1>
          <p className="text-muted-foreground">Visualisez vos données de recrutement en réalité augmentée</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            Exporter
          </Button>
          <Button>Partager</Button>
        </div>
      </div>

      {!isARSupported && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Réalité augmentée non supportée</AlertTitle>
          <AlertDescription>
            Votre navigateur ne supporte pas la réalité augmentée. Veuillez utiliser un navigateur compatible comme
            Chrome ou Firefox sur un appareil récent.
          </AlertDescription>
        </Alert>
      )}

      {!isMobileDevice && (
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertTitle>Expérience optimale sur mobile</AlertTitle>
          <AlertDescription>
            Pour une meilleure expérience de réalité augmentée, nous vous recommandons d'utiliser un appareil mobile.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="ar">Réalité augmentée</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCharts onDataChange={handleDataChange} />
            <DataControls onVisualizationChange={handleVisualizationChange} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guide d'utilisation de la réalité augmentée</CardTitle>
              <CardDescription>Comment utiliser le tableau de bord en réalité augmentée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="mb-2 p-3 bg-primary/10 rounded-full">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">1. Imprimer les marqueurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Imprimez les marqueurs AR disponibles dans laction "Marqueurs" et placez-les sur une surface plane.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="mb-2 p-3 bg-primary/10 rounded-full">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">2. Scanner les marqueurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Ouvrez l'onglet "Réalité augmentée" et pointez votre caméra vers les marqueurs imprimés.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <div className="mb-2 p-3 bg-primary/10 rounded-full">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">3. Interagir avec les données</h3>
                  <p className="text-sm text-muted-foreground">
                    Interagissez avec les visualisations 3D en touchant les graphiques ou en déplaçant les marqueurs.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" className="mt-2">
                  Télécharger les marqueurs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar">
          <ARScene>
            {/* Marqueur pour les recrutements */}
            <ARMarker markerId="hiring" type="pattern" value="hiring">
              {metrics && (
                <ARVisualization type="bar" data={getChartData("hiring")} position={{ x: 0, y: 0.75, z: 0 }} />
              )}
            </ARMarker>

            {/* Marqueur pour les candidats */}
            <ARMarker markerId="candidates" type="pattern" value="candidates">
              {metrics && (
                <ARVisualization type="line" data={getChartData("candidates")} position={{ x: 0, y: 0.75, z: 0 }} />
              )}
            </ARMarker>

            {/* Marqueur pour la diversité */}
            <ARMarker markerId="diversity" type="pattern" value="diversity">
              {metrics && (
                <ARVisualization type="pie" data={getChartData("diversity")} position={{ x: 0, y: 0.75, z: 0 }} />
              )}
            </ARMarker>
          </ARScene>

          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marqueurs AR</CardTitle>
                <CardDescription>
                  Imprimez ces marqueurs et placez-les sur une surface plane pour visualiser les données en réalité
                  augmentée
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Marqueur Recrutements"
                    className="mb-2 border"
                    width={200}
                    height={200}
                  />
                  <p className="font-medium">Recrutements</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Marqueur Candidats"
                    className="mb-2 border"
                    width={200}
                    height={200}
                  />
                  <p className="font-medium">Candidats</p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-4">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Marqueur Diversité"
                    className="mb-2 border"
                    width={200}
                    height={200}
                  />
                  <p className="font-medium">Diversité</p>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Conseils pour une meilleure expérience</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Assurez-vous d'avoir un bon éclairage</li>
                  <li>Placez les marqueurs sur une surface plane et non réfléchissante</li>
                  <li>Maintenez une distance de 30 à 50 cm entre la caméra et les marqueurs</li>
                  <li>Évitez les mouvements brusques de la caméra</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
