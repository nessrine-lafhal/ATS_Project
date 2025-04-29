/**
 * Service pour communiquer avec le backend de sourcing de candidats
 */

import type { CandidateSearchParams, CandidateAnalysisParams } from "@/lib/types"

const API_BASE_URL = process.env.CANDIDATE_SOURCING_SERVER_URL || "http://localhost:5006"

/**
 * Recherche des candidats en fonction des critères spécifiés
 */
export async function searchCandidates(params: CandidateSearchParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche de candidats: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la recherche de candidats:", error)
    throw error
  }
}

/**
 * Récupère les détails d'un candidat
 */
export async function getCandidateDetails(candidateId: string, platform: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/candidate/${platform}/${candidateId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des détails du candidat: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du candidat:", error)
    throw error
  }
}

/**
 * Analyse l'adéquation d'un candidat pour un poste
 */
export async function analyzeCandidateFit(params: CandidateAnalysisParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de l'analyse du candidat: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de l'analyse du candidat:", error)
    throw error
  }
}

/**
 * Récupère le statut des plateformes de sourcing
 */
export async function getPlatformStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/platforms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des plateformes: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des plateformes:", error)
    throw error
  }
}

/**
 * Met à jour le statut d'une plateforme
 */
export async function updatePlatformStatus(platform: string, enabled: boolean) {
  try {
    const response = await fetch(`${API_BASE_URL}/platforms/${platform}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de la plateforme: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la plateforme:", error)
    throw error
  }
}

/**
 * Récupère des statistiques sur le sourcing
 */
export async function getSourcingStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    throw error
  }
}
