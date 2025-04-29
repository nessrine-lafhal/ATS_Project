"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BiasTextAnalyzer } from "@/components/bias-detection/bias-text-analyzer"
import { RecruitmentAudit } from "@/components/bias-detection/recruitment-audit"
import { AttritionPrediction } from "@/components/bias-detection/attrition-prediction"

export default function BiasDetectionPage() {
  const [activeTab, setActiveTab] = useState("text-analysis")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Détection des biais et promotion de la diversité</h1>
        <p className="text-muted-foreground">
          Détection des biais dans le processus de recrutement et mise en place de mécanismes pour favoriser la
          diversité
        </p>
      </div>

      <Tabs defaultValue="text-analysis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="text-analysis">Analyse de texte</TabsTrigger>
          <TabsTrigger value="recruitment-audit">Audit de recrutement</TabsTrigger>
          <TabsTrigger value="attrition-prediction">Prévision d'attrition</TabsTrigger>
          <TabsTrigger value="technology">Technologies</TabsTrigger>
        </TabsList>

        <TabsContent value="text-analysis" className="space-y-4">
          <BiasTextAnalyzer />
        </TabsContent>

        <TabsContent value="recruitment-audit" className="space-y-4">
          <RecruitmentAudit />
        </TabsContent>

        <TabsContent value="attrition-prediction" className="space-y-4">
          <AttritionPrediction />
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">AIF360 (AI Fairness 360)</h3>
                <p className="text-muted-foreground">
                  Bibliothèque open-source d'IBM pour la détection et l'atténuation des biais dans les modèles de
                  machine learning.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Métriques de biais pré-traitement, en cours de traitement et post-traitement</li>
                  <li>Algorithmes d'atténuation des biais</li>
                  <li>Visualisations interactives pour l'analyse des biais</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Fairlearn</h3>
                <p className="text-muted-foreground">
                  Bibliothèque open-source de Microsoft pour l'évaluation et l'amélioration de l'équité des modèles de
                  ML.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Métriques d'équité pour les modèles de classification et de régression</li>
                  <li>Algorithmes de réduction des disparités</li>
                  <li>Tableaux de bord interactifs pour l'analyse des biais</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">NLP pour l'analyse de texte</h3>
                <p className="text-muted-foreground">
                  Utilisation de modèles de traitement du langage naturel comme BERT et RoBERTa pour détecter les biais
                  linguistiques.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Analyse sémantique des offres d'emploi</li>
                  <li>Détection des termes potentiellement biaisés</li>
                  <li>Suggestions d'alternatives inclusives</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Modèles prédictifs pour l'attrition</h3>
                <p className="text-muted-foreground">
                  Utilisation de modèles de machine learning pour prédire l'attrition et identifier les facteurs de
                  rétention.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Réseaux de neurones récurrents (LSTM, GRU)</li>
                  <li>Modèles de régression et de classification</li>
                  <li>Analyse des facteurs de risque d'attrition</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
