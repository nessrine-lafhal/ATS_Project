"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InterviewScenarioGenerator } from "@/components/interview-generator/interview-scenario-generator"
import { Brain, MessageSquare, Users, Check } from "lucide-react"

export default function InterviewGeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Génération de scénarios d'entretien personnalisés</h1>
        <p className="text-muted-foreground">
          Création automatique de scénarios d'entretien adaptés au poste et au profil du candidat
        </p>
      </div>

      <InterviewScenarioGenerator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Technologies utilisées
          </CardTitle>
          <CardDescription>
            Modèles et bibliothèques utilisés pour la génération de scénarios d'entretien personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">GPT-2 (Hugging Face)</h3>
              <p className="text-muted-foreground">
                Modèle de génération de texte utilisé pour créer des questions d'entretien pertinentes et
                contextualisées en fonction de la description du poste et du profil du candidat.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Rasa</h3>
              <p className="text-muted-foreground">
                Framework open-source pour la création de chatbots, utilisé pour structurer les scénarios d'entretien et
                simuler des interactions réalistes entre le recruteur et le candidat.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Analyse sémantique</h3>
              <p className="text-muted-foreground">
                Techniques d'analyse de texte pour extraire les compétences clés et les responsabilités à partir de la
                description du poste, permettant de générer des questions ciblées et pertinentes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Personnalisation contextuelle</h3>
              <p className="text-muted-foreground">
                Algorithmes qui adaptent les scénarios d'entretien en fonction du secteur d'activité, du type de poste
                et du profil du candidat pour une évaluation plus précise et pertinente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Avantages pour les recruteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500 h-5 w-5 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Gain de temps dans la préparation des entretiens</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500 h-5 w-5 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Questions pertinentes et adaptées au poste</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500 h-5 w-5 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Standardisation du processus d'entretien</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500 h-5 w-5 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Réduction des biais dans l'évaluation des candidats</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-500 h-5 w-5 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span>Amélioration de l'expérience candidat</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Types de scénarios disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Technique
                </Badge>
                <span>Évaluation des compétences techniques et connaissances spécifiques au poste</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Comportemental
                </Badge>
                <span>Analyse des comportements passés pour prédire les performances futures</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Situationnel
                </Badge>
                <span>Évaluation des réactions face à des situations hypothétiques</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Jeu de rôle
                </Badge>
                <span>Mise en situation pour observer les compétences en action</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Culturel
                </Badge>
                <span>Évaluation de l'adéquation avec la culture de l'entreprise</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  Motivation
                </Badge>
                <span>Évaluation des motivations et aspirations professionnelles du candidat</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Fonctionnalités avancées
          </CardTitle>
          <CardDescription>Capacités supplémentaires pour optimiser le processus d'entretien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Génération de scripts complets</h3>
              <p className="text-muted-foreground">
                Création automatique de scripts d'entretien structurés incluant introduction, questions, et conclusion,
                prêts à être utilisés par les recruteurs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Adaptation au profil du candidat</h3>
              <p className="text-muted-foreground">
                Personnalisation des questions en fonction des compétences et de l'expérience spécifiques du candidat
                pour une évaluation plus pertinente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Critères d'évaluation intégrés</h3>
              <p className="text-muted-foreground">
                Suggestions de critères d'évaluation pour chaque scénario, facilitant une notation objective et
                cohérente des candidats.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Export et partage</h3>
              <p className="text-muted-foreground">
                Possibilité d'exporter les scénarios générés au format texte ou de les partager directement avec les
                membres de l'équipe de recrutement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comment utiliser cet outil</CardTitle>
          <CardDescription>Guide rapide pour générer des scénarios d'entretien personnalisés</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 list-decimal pl-5">
            <li>
              <span className="font-medium">Entrez les informations sur le poste</span>
              <p className="text-muted-foreground">
                Renseignez le titre du poste et collez la description complète pour permettre à l'outil d'analyser les
                compétences et responsabilités requises.
              </p>
            </li>
            <li>
              <span className="font-medium">Ajoutez des informations sur l'entreprise (optionnel)</span>
              <p className="text-muted-foreground">
                Pour contextualiser davantage les scénarios, vous pouvez ajouter le nom et une brève description de
                l'entreprise.
              </p>
            </li>
            <li>
              <span className="font-medium">Personnalisez pour le candidat (optionnel)</span>
              <p className="text-muted-foreground">
                Pour des scénarios encore plus pertinents, ajoutez les compétences et l'expérience spécifiques du
                candidat.
              </p>
            </li>
            <li>
              <span className="font-medium">Sélectionnez les types de scénarios</span>
              <p className="text-muted-foreground">
                Choisissez les catégories de questions qui correspondent le mieux à vos besoins d'évaluation.
              </p>
            </li>
            <li>
              <span className="font-medium">Générez et utilisez les scénarios</span>
              <p className="text-muted-foreground">
                Après génération, vous pouvez créer un script d'entretien complet, copier ou télécharger les scénarios
                pour les utiliser lors de vos entretiens.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
