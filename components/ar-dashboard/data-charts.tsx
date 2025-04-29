"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getRecruitmentMetrics } from "@/lib/ar-dashboard-service"
import type { RecruitmentMetrics } from "@/lib/types"

interface DataChartsProps {
  onDataChange?: (data: any) => void
}

export function DataCharts({ onDataChange }: DataChartsProps) {
  const [metrics, setMetrics] = useState<RecruitmentMetrics | null>(null)
  const [timeRange, setTimeRange] = useState<string>("month")
  const [chartType, setChartType] = useState<string>("hiring")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getRecruitmentMetrics(timeRange)
        setMetrics(data)
        if (onDataChange) {
          onDataChange(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des métriques:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, onDataChange])

  const getChartData = () => {
    if (!metrics) return []

    switch (chartType) {
      case "hiring":
        return metrics.hiringMetrics
      case "candidates":
        return metrics.candidateMetrics
      case "interviews":
        return metrics.interviewMetrics
      case "diversity":
        return metrics.diversityMetrics
      case "performance":
        return metrics.performanceMetrics
      default:
        return metrics.hiringMetrics
    }
  }

  const getChartColors = () => {
    switch (chartType) {
      case "hiring":
        return {
          hired: "hsl(var(--chart-1))",
          target: "hsl(var(--chart-2))",
        }
      case "candidates":
        return {
          applications: "hsl(var(--chart-3))",
          qualified: "hsl(var(--chart-4))",
        }
      case "interviews":
        return {
          scheduled: "hsl(var(--chart-5))",
          completed: "hsl(var(--chart-6))",
        }
      case "diversity":
        return {
          gender: "hsl(var(--chart-7))",
          ethnicity: "hsl(var(--chart-8))",
        }
      case "performance":
        return {
          rating: "hsl(var(--chart-9))",
          retention: "hsl(var(--chart-10))",
        }
      default:
        return {
          primary: "hsl(var(--chart-1))",
          secondary: "hsl(var(--chart-2))",
        }
    }
  }

  const renderChart = () => {
    const data = getChartData()
    const colors = getChartColors()

    if (chartType === "diversity") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "candidates" || chartType === "hiring") {
      return (
        <ChartContainer config={colors} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {Object.keys(colors).map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  stackId={chartType === "hiring" ? "a" : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )
    }

    return (
      <ChartContainer config={colors} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {Object.keys(colors).map((key) => (
              <Line key={key} type="monotone" dataKey={key} stroke={`var(--color-${key})`} activeDot={{ r: 8 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Métriques de recrutement</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="time-range">Période</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range" className="w-[180px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="hiring">Recrutements</TabsTrigger>
            <TabsTrigger value="candidates">Candidats</TabsTrigger>
            <TabsTrigger value="interviews">Entretiens</TabsTrigger>
            <TabsTrigger value="diversity">Diversité</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="hiring" className="mt-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              renderChart()
            )}
          </TabsContent>
          <TabsContent value="candidates" className="mt-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              renderChart()
            )}
          </TabsContent>
          <TabsContent value="interviews" className="mt-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              renderChart()
            )}
          </TabsContent>
          <TabsContent value="diversity" className="mt-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              renderChart()
            )}
          </TabsContent>
          <TabsContent value="performance" className="mt-0">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              renderChart()
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
