import type { ForecastResult, ForecastData } from "@/lib/types"

const API_BASE_URL = process.env.TALENT_FORECAST_SERVER_URL || "http://localhost:5006"

export async function generateTalentForecast(
  timeframe = 12,
  department = "all",
  growthFactor = 15,
): Promise<ForecastResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeframe,
        department,
        growthFactor,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la génération de la prévision: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de la génération de la prévision")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service de prévision de talents:", error)
    throw error
  }
}

export async function generateForecastData(timeframe = 12, department = "all"): Promise<ForecastData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forecast/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeframe,
        department,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la génération des données de prévision: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de la génération des données de prévision")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service de prévision de talents (données):", error)
    throw error
  }
}

export async function trainForecastModels(historicalData: any[]): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forecast/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        historicalData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'entraînement des modèles: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de l'entraînement des modèles")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service de prévision de talents (entraînement):", error)
    throw error
  }
}
