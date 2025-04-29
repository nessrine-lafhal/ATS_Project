import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"

// Définir les types pour les résultats d'analyse
export interface EmotionData {
  joie: number
  tristesse: number
  colere: number
  surprise: number
  peur: number
  degout: number
  neutre: number
}

export interface MomentCle {
  timestamp: number
  emotion: string
  intensite: number
}

export interface VideoAnalysisResult {
  duree_totale: number
  emotion_dominante: string
  niveau_engagement: number
  variations_attention: number
  moments_cles: MomentCle[]
  score_global: number
  videoId?: string
  analyzedVideoUrl?: string
}

export class EnhancedVideoAnalysisService {
  private static instance: EnhancedVideoAnalysisService
  private apiUrl: string
  private uploadsDir: string = path.join(process.cwd(), "uploads")
  private outputsDir: string = path.join(process.cwd(), "outputs")

  private constructor() {
    this.apiUrl = process.env.VIDEO_ANALYSIS_API_URL || "http://localhost:5002"

    // S'assurer que les répertoires nécessaires existent
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true })
    }
    if (!fs.existsSync(this.outputsDir)) {
      fs.mkdirSync(this.outputsDir, { recursive: true })
    }
  }

  public static getInstance(): EnhancedVideoAnalysisService {
    if (!EnhancedVideoAnalysisService.instance) {
      EnhancedVideoAnalysisService.instance = new EnhancedVideoAnalysisService()
    }
    return EnhancedVideoAnalysisService.instance
  }

  /**
   * Sauvegarde une vidéo téléchargée
   */
  public async saveUploadedVideo(videoBuffer: Buffer): Promise<string> {
    const videoId = uuidv4()
    const videoPath = path.join(this.uploadsDir, `${videoId}.mp4`)

    return new Promise((resolve, reject) => {
      fs.writeFile(videoPath, videoBuffer, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(videoId)
        }
      })
    })
  }

  /**
   * Analyse une vidéo en utilisant le serveur Python
   */
  public async analyzeVideo(videoId: string): Promise<VideoAnalysisResult> {
    try {
      const videoPath = path.join(this.uploadsDir, `${videoId}.mp4`)

      // Si la vidéo existe, essayer de l'analyser
      if (fs.existsSync(videoPath)) {
        try {
          // Créer un FormData pour envoyer le fichier
          const formData = new FormData()
          const videoFile = new Blob([fs.readFileSync(videoPath)], { type: "video/mp4" })
          formData.append("video", videoFile, `${videoId}.mp4`)

          // Envoyer la vidéo au serveur d'analyse
          const response = await axios.post(`${this.apiUrl}/analyze`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

          if (response.data.success) {
            return response.data.results as VideoAnalysisResult
          }
        } catch (apiError) {
          console.error("Error calling video analysis API:", apiError)
          // Continue to fallback
        }
      }

      // En cas d'erreur ou si la vidéo n'existe pas, utiliser les résultats simulés
      console.log("Using mock results for video analysis")
      return this.generateMockResults(videoId)
    } catch (error) {
      console.error("Error in video analysis service:", error)
      // Toujours retourner des résultats simulés en cas d'erreur
      return this.generateMockResults(videoId)
    }
  }

  /**
   * Génère des résultats simulés pour la démo
   */
  private generateMockResults(videoId: string): VideoAnalysisResult {
    return {
      duree_totale: 120,
      emotion_dominante: "joie",
      niveau_engagement: 0.78,
      variations_attention: 0.15,
      moments_cles: [
        { timestamp: 15.5, emotion: "surprise", intensite: 0.85 },
        { timestamp: 42.3, emotion: "joie", intensite: 0.92 },
        { timestamp: 78.1, emotion: "neutre", intensite: 0.75 },
      ],
      score_global: 0.82,
      videoId: videoId,
      analyzedVideoUrl: `/api/video-analysis/stream?videoId=${videoId}`,
    }
  }

  /**
   * Récupère la vidéo analysée
   */
  public getAnalyzedVideoUrl(videoId: string): string {
    return `${this.apiUrl}/video/${videoId}`
  }

  /**
   * Récupère les résultats d'analyse
   */
  public async getAnalysisResults(videoId: string): Promise<VideoAnalysisResult> {
    try {
      const response = await axios.get(`${this.apiUrl}/results/${videoId}`)
      return response.data as VideoAnalysisResult
    } catch (error) {
      console.error("Error getting analysis results:", error)
      return this.generateMockResults(videoId)
    }
  }

  /**
   * Nettoie les fichiers temporaires
   */
  public cleanupFiles(videoId: string): void {
    const videoPath = path.join(this.uploadsDir, `${videoId}.mp4`)

    // Supprimer les fichiers s'ils existent
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath)
    }
  }
}

export default EnhancedVideoAnalysisService.getInstance()
