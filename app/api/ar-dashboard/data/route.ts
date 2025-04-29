import { type NextRequest, NextResponse } from "next/server"
import type { RecruitmentMetrics } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const timeRange = searchParams.get("timeRange") || "month"

  try {
    // Ici, vous pourriez récupérer les données depuis une base de données
    // Pour l'exemple, nous générons des données fictives
    const data = generateMockData(timeRange)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 })
  }
}

function generateMockData(timeRange: string): RecruitmentMetrics {
  const periods = generatePeriods(timeRange)

  return {
    hiringMetrics: periods.map((period) => ({
      period,
      hired: Math.floor(Math.random() * 20) + 5,
      target: Math.floor(Math.random() * 25) + 10,
    })),
    candidateMetrics: periods.map((period) => ({
      period,
      applications: Math.floor(Math.random() * 100) + 50,
      qualified: Math.floor(Math.random() * 50) + 10,
    })),
    interviewMetrics: periods.map((period) => ({
      period,
      scheduled: Math.floor(Math.random() * 40) + 20,
      completed: Math.floor(Math.random() * 35) + 15,
    })),
    diversityMetrics: [
      { name: "Hommes", value: Math.floor(Math.random() * 60) + 40 },
      { name: "Femmes", value: Math.floor(Math.random() * 50) + 30 },
      { name: "Non-binaire", value: Math.floor(Math.random() * 10) + 5 },
    ],
    performanceMetrics: periods.map((period) => ({
      period,
      rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)), // Rating entre 3 et 5
      retention: Math.floor(Math.random() * 30) + 70, // Pourcentage entre 70 et 100
    })),
  }
}

function generatePeriods(timeRange: string): string[] {
  const now = new Date()
  const periods: string[] = []

  switch (timeRange) {
    case "week":
      // Générer les 7 derniers jours
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        periods.push(date.toLocaleDateString("fr-FR", { weekday: "short" }))
      }
      break
    case "month":
      // Générer les 4 dernières semaines
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i * 7)
        periods.push(`Sem ${Math.floor((date.getDate() - 1) / 7) + 1}`)
      }
      break
    case "quarter":
      // Générer les 3 derniers mois
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        periods.push(date.toLocaleDateString("fr-FR", { month: "short" }))
      }
      break
    case "year":
      // Générer les 4 derniers trimestres
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i * 3)
        const quarter = Math.floor(date.getMonth() / 3) + 1
        periods.push(`T${quarter}`)
      }
      break
    default:
      // Par défaut, générer les 4 dernières semaines
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i * 7)
        periods.push(`Sem ${Math.floor((date.getDate() - 1) / 7) + 1}`)
      }
  }

  return periods
}
