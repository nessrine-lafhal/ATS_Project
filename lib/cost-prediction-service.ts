import type { CostPredictionResult, CostForecastResult, ChannelAnalysisResult, RecruitmentData } from "@/lib/types"

const API_BASE_URL = process.env.COST_PREDICTION_SERVER_URL || "http://localhost:5007"

export async function predictRecruitmentCost(
  recruitmentData: RecruitmentData,
  modelType = "random_forest",
): Promise<CostPredictionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recruitment_data: recruitmentData,
        model_type: modelType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la prédiction du coût: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de la prédiction du coût")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service de prédiction des coûts:", error)
    throw error
  }
}

export async function forecastRecruitmentCosts(
  historicalData?: any[],
  periods = 12,
  freq = "M",
): Promise<CostForecastResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forecast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        historical_data: historicalData,
        periods,
        freq,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la génération des prévisions: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de la génération des prévisions")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service de prévision des coûts:", error)
    throw error
  }
}

export async function analyzeRecruitmentChannels(channelData?: any[]): Promise<ChannelAnalysisResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_data: channelData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'analyse des canaux: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de l'analyse des canaux")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service d'analyse des canaux:", error)
    throw error
  }
}

export async function trainRegressionModel(trainingData: any[], modelType = "random_forest"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/train/regression`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        training_data: trainingData,
        model_type: modelType,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'entraînement du modèle: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de l'entraînement du modèle")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service d'entraînement du modèle:", error)
    throw error
  }
}

export async function trainProphetModel(timeSeriesData: any[]): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/train/prophet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time_series_data: timeSeriesData,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'entraînement du modèle Prophet: ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Échec de l'entraînement du modèle Prophet")
    }

    return result.data
  } catch (error) {
    console.error("Erreur dans le service d'entraînement du modèle Prophet:", error)
    throw error
  }
}
