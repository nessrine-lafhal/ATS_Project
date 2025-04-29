import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Définir les types pour les résultats d'analyse
export interface VideoAnalysisResult {
  emotions: Record<string, number>
  eyeContact: number
  headMovements: number
  gestures: number
  confidenceScore: number
  overallScore: number
  keyMoments?: Array<{
    time: number
    label: string
    emotion: string
    confidence: number
  }>
}

export class VideoAnalysisService {
  private static instance: VideoAnalysisService
  private pythonPath = "python" // Chemin vers l'exécutable Python
  private scriptPath: string = path.join(process.cwd(), "python", "video_analysis.py")
  private uploadsDir: string = path.join(process.cwd(), "uploads")
  private outputsDir: string = path.join(process.cwd(), "outputs")

  private constructor() {
    // S'assurer que les répertoires nécessaires existent
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true })
    }
    if (!fs.existsSync(this.outputsDir)) {
      fs.mkdirSync(this.outputsDir, { recursive: true })
    }
  }

  public static getInstance(): VideoAnalysisService {
    if (!VideoAnalysisService.instance) {
      VideoAnalysisService.instance = new VideoAnalysisService()
    }
    return VideoAnalysisService.instance
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
   * Analyse une vidéo en utilisant le script Python
   */
  public async analyzeVideo(videoId: string): Promise<VideoAnalysisResult> {
    const videoPath = path.join(this.uploadsDir, `${videoId}.mp4`)
    const outputPath = path.join(this.outputsDir, `${videoId}_analyzed.mp4`)
    const reportPath = path.join(this.outputsDir, `${videoId}_report.json`)

    // Vérifier que la vidéo existe
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`)
    }

    // En production, nous exécuterions le script Python ici
    // Pour l'instant, nous simulons les résultats

    // Simuler un délai d'analyse
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Retourner des résultats simulés
    return {
      emotions: {
        happy: 0.45,
        neutral: 0.32,
        anxious: 0.15,
        confused: 0.08,
      },
      eyeContact: 0.78,
      headMovements: 0.25,
      gestures: 0.42,
      confidenceScore: 0.75,
      overallScore: 82,
      keyMoments: [
        { time: 35, label: "Sourire lors de la présentation", emotion: "happy", confidence: 0.92 },
        { time: 72, label: "Hésitation sur question technique", emotion: "anxious", confidence: 0.85 },
        { time: 118, label: "Enthousiasme sur projet passé", emotion: "happy", confidence: 0.88 },
        { time: 145, label: "Réflexion sur question complexe", emotion: "neutral", confidence: 0.79 },
      ],
    }

    /* 
    // Code pour exécuter réellement le script Python (à décommenter en production)
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn(this.pythonPath, [
        this.scriptPath,
        '--video', videoPath,
        '--output', outputPath,
        '--report', reportPath
      ]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorData}`));
          return;
        }

        // Lire le rapport JSON généré
        fs.readFile(reportPath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
            return;
          }

          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
    */
  }

  /**
   * Récupère la vidéo analysée
   */
  public getAnalyzedVideoPath(videoId: string): string {
    return path.join(this.outputsDir, `${videoId}_analyzed.mp4`)
  }

  /**
   * Nettoie les fichiers temporaires
   */
  public cleanupFiles(videoId: string): void {
    const videoPath = path.join(this.uploadsDir, `${videoId}.mp4`)
    const outputPath = path.join(this.outputsDir, `${videoId}_analyzed.mp4`)
    const reportPath = path.join(this.outputsDir, `${videoId}_report.json`)

    // Supprimer les fichiers s'ils existent
    ;[videoPath, outputPath, reportPath].forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    })
  }
}

export default VideoAnalysisService.getInstance()
