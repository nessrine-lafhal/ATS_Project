import { type NextRequest, NextResponse } from "next/server"
import enhancedVideoAnalysisService from "@/lib/video-analysis-enhanced-service"

export async function POST(req: NextRequest) {
  try {
    // Vérifier si la requête est multipart/form-data
    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Traiter le téléchargement de fichier
      const formData = await req.formData()
      const videoFile = formData.get("video") as File

      if (!videoFile) {
        return NextResponse.json({ success: false, error: "No video file provided" }, { status: 400 })
      }

      // Convertir le fichier en buffer
      const buffer = Buffer.from(await videoFile.arrayBuffer())

      // Sauvegarder la vidéo
      const videoId = await enhancedVideoAnalysisService.saveUploadedVideo(buffer)

      // Analyser la vidéo
      const analysisResult = await enhancedVideoAnalysisService.analyzeVideo(videoId)

      // Retourner les résultats
      return NextResponse.json({
        success: true,
        data: {
          videoId,
          ...analysisResult,
        },
      })
    } else {
      // Pour les requêtes non-multipart, utiliser une approche plus sûre
      let videoId = "demo"

      // Essayer de parser le JSON seulement si le content-type est application/json
      if (contentType.includes("application/json")) {
        try {
          const body = await req.json()
          videoId = body.videoId || "demo"
        } catch (jsonError) {
          console.warn("Failed to parse JSON body, using default videoId:", jsonError)
          // Continue with default videoId
        }
      }

      // Analyser la vidéo (ou simuler l'analyse)
      const analysisResult = await enhancedVideoAnalysisService.analyzeVideo(videoId)

      return NextResponse.json({ success: true, data: analysisResult })
    }
  } catch (error) {
    console.error("Error analyzing video:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze video" }, { status: 500 })
  }
}

// Route pour récupérer une vidéo analysée
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const videoId = url.searchParams.get("videoId")

    if (!videoId) {
      return NextResponse.json({ success: false, error: "No videoId provided" }, { status: 400 })
    }

    const videoUrl = enhancedVideoAnalysisService.getAnalyzedVideoUrl(videoId)

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        videoUrl,
      },
    })
  } catch (error) {
    console.error("Error retrieving analyzed video:", error)
    return NextResponse.json({ success: false, error: "Failed to retrieve analyzed video" }, { status: 500 })
  }
}
