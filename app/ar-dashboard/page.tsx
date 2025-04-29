import type { Metadata } from "next"
import ARDashboardClient from "./ar-dashboard-client"

export const metadata: Metadata = {
  title: "Tableau de bord en réalité augmentée | NextGen ATS",
  description: "Visualisation interactive des données de recrutement en réalité augmentée",
}

export default function ARDashboardPage() {
  return <ARDashboardClient />
}
