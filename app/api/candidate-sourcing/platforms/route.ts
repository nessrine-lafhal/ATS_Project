import { type NextRequest, NextResponse } from "next/server"
import { getPlatformStatus, updatePlatformStatus } from "@/lib/candidate-sourcing-service"

export async function GET() {
  try {
    const result = await getPlatformStatus()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la récupération des plateformes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des plateformes" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, enabled } = body

    if (!platform) {
      return NextResponse.json({ error: "Plateforme non spécifiée" }, { status: 400 })
    }

    const result = await updatePlatformStatus(platform, enabled)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la plateforme:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la plateforme" }, { status: 500 })
  }
}
