import type { Metadata } from "next"
import VideoAnalysisClientPage from "./VideoAnalysisClientPage"

export const metadata: Metadata = {
  title: "Analyse Vidéo d'Entretien | NextGen ATS",
  description: "Analysez les vidéos d'entretien pour détecter les émotions, l'engagement et les indices non verbaux",
}

export default function VideoAnalysisPage() {
  return <VideoAnalysisClientPage />
}
