"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { themeConfig } from "@/lib/theme-config"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useTheme } from "next-themes"

interface EnhancedChartProps {
  title: string
  description?: string
  data: any[]
  type: "line" | "bar" | "pie" | "area"
  dataKeys: string[]
  xAxisKey?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  stacked?: boolean
  className?: string
}

export function EnhancedChart({
  title,
  description,
  data,
  type,
  dataKeys,
  xAxisKey = "name",
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  stacked = false,
  className,
}: EnhancedChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = theme === "dark"

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ height }}></div>
  }

  const colors = themeConfig.charts.colors
  const gridColor = isDark ? themeConfig.charts.grid.dark : themeConfig.charts.grid.light

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
              <XAxis dataKey={xAxisKey} tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              {showTooltip && (
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", borderColor: gridColor }} />
              )}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
              <XAxis dataKey={xAxisKey} tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              {showTooltip && (
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", borderColor: gridColor }} />
              )}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  stackId={stacked ? "stack" : undefined}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {showTooltip && (
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", borderColor: gridColor }} />
              )}
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
              <XAxis dataKey={xAxisKey} tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b" }} />
              {showTooltip && (
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", borderColor: gridColor }} />
              )}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId={stacked ? "stack" : undefined}
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="px-6 pb-6">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
