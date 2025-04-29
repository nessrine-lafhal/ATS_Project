"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calendar, TrendingUp, LineChart } from "lucide-react"

interface ForecastParametersProps {
  onGenerate: (params: {
    timeframe: string
    department: string
    growthFactor: number
    includeMarketTrends: boolean
    includeAttrition: boolean
  }) => void
  isGenerating: boolean
}

export function ForecastParameters({ onGenerate, isGenerating }: ForecastParametersProps) {
  const [timeframe, setTimeframe] = useState("12")
  const [department, setDepartment] = useState("all")
  const [growthFactor, setGrowthFactor] = useState([15])
  const [includeMarketTrends, setIncludeMarketTrends] = useState(true)
  const [includeAttrition, setIncludeAttrition] = useState(true)

  const handleGenerate = () => {
    onGenerate({
      timeframe,
      department,
      growthFactor: growthFactor[0],
      includeMarketTrends,
      includeAttrition,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Paramètres de prévision
        </CardTitle>
        <CardDescription>Configurez les paramètres pour générer des prévisions personnalisées</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="timeframe">Horizon de prévision</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 mois</SelectItem>
                <SelectItem value="6">6 mois</SelectItem>
                <SelectItem value="12">12 mois</SelectItem>
                <SelectItem value="24">24 mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="engineering">Ingénierie</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Ventes</SelectItem>
                <SelectItem value="product">Produit</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Facteurs de croissance</Label>
            <div className="pt-2">
              <Slider value={growthFactor} onValueChange={setGrowthFactor} max={50} step={1} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{growthFactor[0]}%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="market-trends">Inclure les tendances du marché</Label>
              <Switch id="market-trends" checked={includeMarketTrends} onCheckedChange={setIncludeMarketTrends} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="attrition">Inclure les prévisions d'attrition</Label>
              <Switch id="attrition" checked={includeAttrition} onCheckedChange={setIncludeAttrition} />
            </div>
          </div>

          <div className="col-span-3">
            <Button className="w-full" size="lg" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <LineChart className="mr-2 h-4 w-4 animate-spin" />
                  Génération des prévisions...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Générer les prévisions
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
