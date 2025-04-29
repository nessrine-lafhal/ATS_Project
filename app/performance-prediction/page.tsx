"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformancePredictor } from "@/components/performance-prediction/performance-predictor"
import { PerformanceFactors } from "@/components/performance-prediction/performance-factors"
import { ModelTraining } from "@/components/performance-prediction/model-training"

export default function PerformancePredictionPage() {
  const [activeTab, setActiveTab] = useState("predictor")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse prédictive de la performance en poste</h1>
        <p className="text-muted-foreground">
          Prévision de la performance des candidats après leur embauche en utilisant des modèles avancés de machine
          learning
        </p>
      </div>

      <Tabs defaultValue="predictor" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictor">Prédiction de performance</TabsTrigger>
          <TabsTrigger value="factors">Facteurs de performance</TabsTrigger>
          <TabsTrigger value="training">Entraînement du modèle</TabsTrigger>
          <TabsTrigger value="technology">Technologies</TabsTrigger>
        </TabsList>

        <TabsContent value="predictor" className="space-y-4">
          <PerformancePredictor />
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <PerformanceFactors />
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <ModelTraining />
        </TabsContent>

        <TabsContent value="technology" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">scikit-learn</h3>
                <p className="text-muted-foreground">
                  Bibliothèque open-source pour l'apprentissage automatique en Python.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Modèles de régression (SVR, Random Forest, Gradient Boosting)</li>
                  <li>Prétraitement des données (normalisation, encodage)</li>
                  <li>Sélection de caractéristiques et réduction de dimensionnalité</li>
                  <li>Métriques d'évaluation (MSE, MAE, R²)</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">TensorFlow/Keras</h3>
                <p className="text-muted-foreground">
                  Bibliothèques open-source pour la création et l'entraînement de réseaux de neurones.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Réseaux de neurones profonds pour la régression</li>
                  <li>Couches denses avec activation ReLU</li>
                  <li>Couches de dropout pour éviter le surapprentissage</li>
                  <li>Normalisation par lots pour améliorer la convergence</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Modèles de prédiction</h3>
                <p className="text-muted-foreground">
                  Techniques et modèles utilisés pour prédire la performance des candidats.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Régression pour prédire les scores de performance</li>
                  <li>Analyse des facteurs contributifs</li>
                  <li>Prédiction de performance par domaine</li>
                  <li>Identification des axes de développement</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Avantages de l'analyse prédictive</h3>
                <p className="text-muted-foreground">
                  Bénéfices de l'utilisation de l'analyse prédictive dans le processus de recrutement.
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  <li>Réduction des erreurs de recrutement coûteuses</li>
                  <li>Identification des candidats à haut potentiel</li>
                  <li>Planification proactive du développement des compétences</li>
                  <li>Amélioration continue du processus de recrutement</li>
                  <li>Prise de décision basée sur les données plutôt que l'intuition</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
