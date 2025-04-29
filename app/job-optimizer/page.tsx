"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobDescriptionAnalyzer } from "@/components/job-optimizer/job-description-analyzer"
import { JobDescriptionOptimizer } from "@/components/job-optimizer/job-description-optimizer"
import { JobDescriptionGenerator } from "@/components/job-optimizer/job-description-generator"
import { FileText, Wand, PenTool, Brain } from "lucide-react"

export default function JobOptimizerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Optimisation automatisée des offres d'emploi</h1>
        <p className="text-muted-foreground">
          Génération automatique de descriptions de postes optimisées pour attirer les bons profils
        </p>
      </div>

      <Tabs defaultValue="optimize" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="optimize">
            <Wand className="h-4 w-4 mr-2" />
            Optimiser
          </TabsTrigger>
          <TabsTrigger value="generate">
            <PenTool className="h-4 w-4 mr-2" />
            Générer
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <FileText className="h-4 w-4 mr-2" />
            Analyser
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimize">
          <JobDescriptionOptimizer />
        </TabsContent>

        <TabsContent value="generate">
          <JobDescriptionGenerator />
        </TabsContent>

        <TabsContent value="analyze">
          <JobDescriptionAnalyzer />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Technologies utilisées
          </CardTitle>
          <CardDescription>
            Modèles et bibliothèques utilisés pour l'optimisation des descriptions de postes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">GPT-2 (Hugging Face)</h3>
              <p className="text-muted-foreground">
                Modèle de génération de texte utilisé pour créer et améliorer les descriptions de postes en se basant
                sur des exemples de haute qualité et les spécifications fournies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">T5</h3>
              <p className="text-muted-foreground">
                Modèle de traitement du langage naturel utilisé pour le résumé et la réécriture de texte, permettant de
                simplifier et de structurer les descriptions de postes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Analyse sémantique</h3>
              <p className="text-muted-foreground">
                Techniques d'analyse de texte pour évaluer la structure, la clarté et l'attractivité des descriptions de
                postes, et identifier les points d'amélioration.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Optimisation contextuelle</h3>
              <p className="text-muted-foreground">
                Algorithmes d'optimisation qui adaptent le contenu en fonction du secteur d'activité, du type de poste
                et des compétences requises pour maximiser l'attractivité.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
