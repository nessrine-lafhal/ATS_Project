"use client"
import EnhancedVideoAnalysis from "@/components/enhanced-video-analysis"

export default function VideoAnalysisClientPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analyse Vidéo d&apos;Entretien</h1>
        <p className="text-gray-500">
          Utilisez l&apos;intelligence artificielle pour analyser les vidéos d&apos;entretien et obtenir des insights
          sur les émotions, l&apos;engagement et les indices non verbaux des candidats.
        </p>
      </div>

      <EnhancedVideoAnalysis />
    </div>
  )
}
