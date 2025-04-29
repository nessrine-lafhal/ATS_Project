"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LineChart } from "lucide-react"

export function ForecastEmptyState() {
  return (
    <Card className="bg-muted/40">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <LineChart className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium">Aucune prévision générée</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Configurez les paramètres ci-dessus et cliquez sur "Générer les prévisions" pour visualiser les tendances
          futures du marché du travail et vos besoins en recrutement
        </p>
      </CardContent>
    </Card>
  )
}
