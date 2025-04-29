"use client"

import { useEffect, useRef, useState } from "react"
import type { ChartData, ChartOptions } from "chart.js"

interface ARVisualizationProps {
  type: "bar" | "pie" | "line" | "radar" | "doughnut" | "scatter" | "bubble"
  data: ChartData
  options?: ChartOptions
  width?: number
  height?: number
  depth?: number
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
}

export function ARVisualization({
  type,
  data,
  options,
  width = 2,
  height = 1.5,
  depth = 0.05,
  position = { x: 0, y: 0.75, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
}: ARVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const entityRef = useRef<HTMLElement>(null)
  const [chartTexture, setChartTexture] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const renderChart = async () => {
      const { Chart } = await import("chart.js/auto")

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      // Set canvas dimensions
      canvas.width = 1024
      canvas.height = 768

      // Clear canvas
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create chart
      const chart = new Chart(ctx, {
        type,
        data,
        options: {
          ...options,
          animation: false,
          responsive: false,
          maintainAspectRatio: false,
        },
      })

      // Render chart and get data URL
      chart.render()
      const dataUrl = canvas.toDataURL("image/png")
      setChartTexture(dataUrl)

      // Destroy chart to prevent memory leaks
      chart.destroy()
    }

    renderChart()
  }, [type, data, options])

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {chartTexture && (
        <a-entity
          ref={entityRef}
          position={`${position.x} ${position.y} ${position.z}`}
          rotation={`${rotation.x} ${rotation.y} ${rotation.z}`}
          class="clickable"
        >
          <a-box
            width={width}
            height={height}
            depth={depth}
            material={`shader: flat; src: ${chartTexture}; transparent: true; opacity: 0.9; side: double;`}
          ></a-box>

          {/* Add a title above the chart */}
          <a-text
            value={data.datasets?.[0]?.label || "Données"}
            align="center"
            position={`0 ${height / 2 + 0.1} 0`}
            color="#000000"
            width={width * 2}
          ></a-text>
        </a-entity>
      )}
    </>
  )
}
