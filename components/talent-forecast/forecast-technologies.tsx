"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export function ForecastTechnologies() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Technologies de deep learning utilisées
        </CardTitle>
        <CardDescription>Modèles et bibliothèques open-source utilisés pour les prévisions de talents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-2">Prophet</h3>
            <p className="text-muted-foreground">
              Bibliothèque open-source de Facebook pour les prévisions temporelles, particulièrement efficace pour
              détecter les tendances saisonnières et les changements de tendance dans les besoins en recrutement.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">TensorFlow/Keras</h3>
            <p className="text-muted-foreground">
              Réseaux de neurones temporels (LSTM, GRU) pour l'analyse des séries temporelles complexes et la prédiction
              des tendances futures du marché du travail.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">scikit-learn</h3>
            <p className="text-muted-foreground">
              Modèles de régression et de classification pour l'analyse prédictive des risques d'attrition et des
              besoins en compétences spécifiques.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">BERT (Hugging Face)</h3>
            <p className="text-muted-foreground">
              Analyse sémantique des descriptions de postes et des tendances du marché pour identifier l'évolution des
              compétences recherchées et anticiper les besoins futurs.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
