import type { RecruitmentMetrics } from "./types"

// Fonction pour récupérer les métriques de recrutement
export async function getRecruitmentMetrics(timeRange = "month"): Promise<RecruitmentMetrics> {
  try {
    const response = await fetch(`/api/ar-dashboard/data?timeRange=${timeRange}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des métriques:", error)
    // Retourner des données fictives en cas d'erreur
    return generateMockData(timeRange)
  }
}

// Fonction pour récupérer des métriques spécifiques
export async function getSpecificMetrics(metricType: string, timeRange = "month"): Promise<any> {
  try {
    const response = await fetch(`/api/ar-dashboard/metrics?type=${metricType}&timeRange=${timeRange}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération des métriques ${metricType}:`, error)
    // Retourner des données fictives en cas d'erreur
    return generateMockMetricData(metricType, timeRange)
  }
}

// Fonction pour générer des données fictives
function generateMockData(timeRange: string): RecruitmentMetrics {
  const periods = generatePeriods(timeRange)

  return {
    hiringMetrics: periods.map((period, index) => ({
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
      rating: Math.random() * 2 + 3, // Rating entre 3 et 5
      retention: Math.floor(Math.random() * 30) + 70, // Pourcentage entre 70 et 100
    })),
  }
}

// Fonction pour générer des données fictives pour un type de métrique spécifique
function generateMockMetricData(metricType: string, timeRange: string): any {
  const periods = generatePeriods(timeRange)

  switch (metricType) {
    case "hiring":
      return periods.map((period) => ({
        period,
        hired: Math.floor(Math.random() * 20) + 5,
        target: Math.floor(Math.random() * 25) + 10,
      }))
    case "candidates":
      return periods.map((period) => ({
        period,
        applications: Math.floor(Math.random() * 100) + 50,
        qualified: Math.floor(Math.random() * 50) + 10,
        rejected: Math.floor(Math.random() * 30) + 5,
      }))
    case "interviews":
      return periods.map((period) => ({
        period,
        scheduled: Math.floor(Math.random() * 40) + 20,
        completed: Math.floor(Math.random() * 35) + 15,
        passed: Math.floor(Math.random() * 25) + 5,
      }))
    case "diversity":
      return [
        { name: "Hommes", value: Math.floor(Math.random() * 60) + 40 },
        { name: "Femmes", value: Math.floor(Math.random() * 50) + 30 },
        { name: "Non-binaire", value: Math.floor(Math.random() * 10) + 5 },
      ]
    case "performance":
      return periods.map((period) => ({
        period,
        rating: Math.random() * 2 + 3,
        retention: Math.floor(Math.random() * 30) + 70,
        productivity: Math.floor(Math.random() * 40) + 60,
      }))
    default:
      return []
  }
}

// Fonction pour générer des périodes en fonction de la plage de temps
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
