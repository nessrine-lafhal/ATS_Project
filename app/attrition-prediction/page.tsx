"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttritionRiskAnalysis } from "@/components/attrition-prediction/attrition-risk-analysis"
import { FutureAttritionForecast } from "@/components/attrition-prediction/future-attrition-forecast"
import { ModelTraining } from "@/components/attrition-prediction/model-training"

export default function AttritionPredictionPage() {
  const [activeTab, setActiveTab] = useState("risk-analysis")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prévision de l'attrition et de la rétention</h1>
        <p className="text-muted-foreground">
          Modèle prédictif pour estimer le taux de rotation des candidats après embauche et identifier les stratégies de
          rétention efficaces
        </p>
      </div>

      <Tabs defaultValue="risk-analysis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="risk-analysis">Analyse des risques</TabsTrigger>
          <TabsTrigger value="future-forecast">Prévision future</TabsTrigger>
          <TabsTrigger value="model-training">Entraînement du modèle</TabsTrigger>
          <TabsTrigger value="technology">Technologies</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-analysis" className="space-y-4">
          <AttritionRiskAnalysis />
        </TabsContent>

        <TabsContent value="future-forecast" className="space-y-4">
          <FutureAttritionForecast />
        </TabsContent>

        <TabsContent value="model-training" className="space-y-4">
          <ModelTraining />
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">TensorFlow/Keras</h3>
                <p className="text-muted-foreground">
                  Bibliothèques open-source pour la création et l'entraînement de réseaux de neurones profonds.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Réseaux de neurones récurrents (LSTM, GRU)</li>
                  <li>Modèles séquentiels pour l'analyse de séries temporelles</li>
                  <li>Couches de dropout et de normalisation par lots</li>
                  <li>Callbacks pour l'arrêt précoce et la sauvegarde des modèles</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">scikit-learn</h3>
                <p className="text-muted-foreground">
                  Bibliothèque open-source pour l'apprentissage automatique en Python.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Algorithmes de classification (Random Forest, Gradient Boosting)</li>
                  <li>Prétraitement des données (normalisation, encodage)</li>
                  <li>Sélection de caractéristiques et réduction de dimensionnalité</li>
                  <li>Métriques d'évaluation (précision, rappel, F1-score, AUC-ROC)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Modèles de prédiction d'attrition</h3>
                <p className="text-muted-foreground">
                  Techniques et modèles utilisés pour prédire l'attrition des employés.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Analyse des facteurs de risque d'attrition</li>
                  <li>Prédiction de la probabilité de départ</li>
                  <li>Estimation du temps avant départ</li>
                  <li>Identification des stratégies de rétention personnalisées</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Visualisation et interprétation</h3>
                <p className="text-muted-foreground">
                  Outils et techniques pour visualiser et interpréter les résultats des modèles.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Graphiques d'évolution de l'attrition</li>
                  <li>Analyse des facteurs de risque par département</li>
                  <li>Estimation des coûts liés à l'attrition</li>
                  <li>Recommandations de stratégies de rétention basées sur les données</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
