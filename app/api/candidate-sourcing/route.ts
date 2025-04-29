import { type NextRequest, NextResponse } from "next/server"
import { searchCandidates } from "@/lib/candidate-sourcing-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = await searchCandidates(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erreur lors de la recherche de candidats:", error)
    return NextResponse.json({ error: "Erreur lors de la recherche de candidats" }, { status: 500 })
  }
}
