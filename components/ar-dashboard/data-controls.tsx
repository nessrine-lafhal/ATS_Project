"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, RotateCw, Download, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DataControlsProps {
  onVisualizationChange?: (settings: VisualizationSettings) => void
}

export interface VisualizationSettings {
  chartTypes: {
    bar: boolean
    line: boolean
    pie: boolean
    radar: boolean
  }
  dataFilters: {
    hiring: boolean
    candidates: boolean
    interviews: boolean
    diversity: boolean
    performance: boolean
  }
  displayOptions: {
    showLabels: boolean
    showLegend: boolean
    showGrid: boolean
    show3D: boolean
    rotationSpeed: number
  }
}

const defaultSettings: VisualizationSettings = {
  chartTypes: {
    bar: true,
    line: true,
    pie: true,
    radar: false,
  },
  dataFilters: {
    hiring: true,
    candidates: true,
    interviews: true,
    diversity: true,
    performance: true,
  },
  displayOptions: {
    showLabels: true,
    showLegend: true,
    showGrid: true,
    show3D: true,
    rotationSpeed: 0,
  },
}

export function DataControls({ onVisualizationChange }: DataControlsProps) {
  const [settings, setSettings] = useState<VisualizationSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState<string>("types")
  const { toast } = useToast()

  const handleSettingChange = <T extends keyof VisualizationSettings>(
    category: T,
    setting: keyof VisualizationSettings[T],
    value: any,
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value,
      },
    }

    setSettings(newSettings)

    if (onVisualizationChange) {
      onVisualizationChange(newSettings)
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)

    if (onVisualizationChange) {
      onVisualizationChange(defaultSettings)
    }

    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres de visualisation ont été réinitialisés",
    })
  }

  const exportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "ar-dashboard-settings.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    toast({
      title: "Paramètres exportés",
      description: "Les paramètres de visualisation ont été exportés",
    })
  }

  const shareSettings = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Paramètres du tableau de bord AR",
          text: "Voici mes paramètres de visualisation pour le tableau de bord AR",
          url: window.location.href,
        })
        .then(() => {
          toast({
            title: "Paramètres partagés",
            description: "Les paramètres ont été partagés avec succès",
          })
        })
        .catch((error) => {
          toast({
            title: "Erreur de partage",
            description: `Une erreur s'est produite: ${error}`,
            variant: "destructive",
          })
        })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "URL copiée",
          description: "L'URL a été copiée dans le presse-papiers",
        })
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contrôles de visualisation</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={resetSettings} title="Réinitialiser">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={exportSettings} title="Exporter">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={shareSettings} title="Partager">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="types">Types de graphiques</TabsTrigger>
            <TabsTrigger value="filters">Filtres de données</TabsTrigger>
            <TabsTrigger value="display">Options d'affichage</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chart-bar"
                  checked={settings.chartTypes.bar}
                  onCheckedChange={(checked) => handleSettingChange("chartTypes", "bar", checked)}
                />
                <Label htmlFor="chart-bar">Graphique à barres</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chart-line"
                  checked={settings.chartTypes.line}
                  onCheckedChange={(checked) => handleSettingChange("chartTypes", "line", checked)}
                />
                <Label htmlFor="chart-line">Graphique linéaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chart-pie"
                  checked={settings.chartTypes.pie}
                  onCheckedChange={(checked) => handleSettingChange("chartTypes", "pie", checked)}
                />
                <Label htmlFor="chart-pie">Graphique circulaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chart-radar"
                  checked={settings.chartTypes.radar}
                  onCheckedChange={(checked) => handleSettingChange("chartTypes", "radar", checked)}
                />
                <Label htmlFor="chart-radar">Graphique radar</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-hiring"
                  checked={settings.dataFilters.hiring}
                  onCheckedChange={(checked) => handleSettingChange("dataFilters", "hiring", checked)}
                />
                <Label htmlFor="filter-hiring">Recrutements</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-candidates"
                  checked={settings.dataFilters.candidates}
                  onCheckedChange={(checked) => handleSettingChange("dataFilters", "candidates", checked)}
                />
                <Label htmlFor="filter-candidates">Candidats</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-interviews"
                  checked={settings.dataFilters.interviews}
                  onCheckedChange={(checked) => handleSettingChange("dataFilters", "interviews", checked)}
                />
                <Label htmlFor="filter-interviews">Entretiens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-diversity"
                  checked={settings.dataFilters.diversity}
                  onCheckedChange={(checked) => handleSettingChange("dataFilters", "diversity", checked)}
                />
                <Label htmlFor="filter-diversity">Diversité</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-performance"
                  checked={settings.dataFilters.performance}
                  onCheckedChange={(checked) => handleSettingChange("dataFilters", "performance", checked)}
                />
                <Label htmlFor="filter-performance">Performance</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels" className="flex items-center gap-2">
                  {settings.displayOptions.showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Afficher les étiquettes
                </Label>
                <Switch
                  id="show-labels"
                  checked={settings.displayOptions.showLabels}
                  onCheckedChange={(checked) => handleSettingChange("displayOptions", "showLabels", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-legend" className="flex items-center gap-2">
                  {settings.displayOptions.showLegend ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Afficher la légende
                </Label>
                <Switch
                  id="show-legend"
                  checked={settings.displayOptions.showLegend}
                  onCheckedChange={(checked) => handleSettingChange("displayOptions", "showLegend", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-grid" className="flex items-center gap-2">
                  {settings.displayOptions.showGrid ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Afficher la grille
                </Label>
                <Switch
                  id="show-grid"
                  checked={settings.displayOptions.showGrid}
                  onCheckedChange={(checked) => handleSettingChange("displayOptions", "showGrid", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-3d" className="flex items-center gap-2">
                  {settings.displayOptions.show3D ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  Affichage 3D
                </Label>
                <Switch
                  id="show-3d"
                  checked={settings.displayOptions.show3D}
                  onCheckedChange={(checked) => handleSettingChange("displayOptions", "show3D", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rotation-speed">Vitesse de rotation</Label>
                <Slider
                  id="rotation-speed"
                  min={0}
                  max={10}
                  step={1}
                  value={[settings.displayOptions.rotationSpeed]}
                  onValueChange={([value]) => handleSettingChange("displayOptions", "rotationSpeed", value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Aucune</span>
                  <span>Moyenne</span>
                  <span>Rapide</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
