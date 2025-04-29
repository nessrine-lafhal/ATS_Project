"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, Download, Filter, Calendar, LineChart } from "lucide-react"
import { EnhancedChart } from "@/components/enhanced-chart"
import { StatCard } from "@/components/stat-card"

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("year")
  const [department, setDepartment] = useState("all")

  // Données pour les graphiques
  const recruitmentData = [
    { name: "Jan", candidats: 120, entretiens: 45, embauches: 12 },
    { name: "Fév", candidats: 140, entretiens: 52, embauches: 15 },
    { name: "Mar", candidats: 160, entretiens: 60, embauches: 18 },
    { name: "Avr", candidats: 180, entretiens: 68, embauches: 20 },
    { name: "Mai", candidats: 200, entretiens: 75, embauches: 22 },
    { name: "Juin", candidats: 220, entretiens: 82, embauches: 25 },
    { name: "Juil", candidats: 240, entretiens: 90, embauches: 28 },
    { name: "Août", candidats: 260, entretiens: 98, embauches: 30 },
    { name: "Sep", candidats: 280, entretiens: 105, embauches: 32 },
    { name: "Oct", candidats: 300, entretiens: 112, embauches: 35 },
    { name: "Nov", candidats: 320, entretiens: 120, embauches: 38 },
    { name: "Déc", candidats: 340, entretiens: 128, embauches: 40 },
  ]

  const conversionData = [
    { name: "CV → Présélection", taux: 35 },
    { name: "Présélection → Entretien", taux: 60 },
    { name: "Entretien → Test technique", taux: 75 },
    { name: "Test technique → Offre", taux: 80 },
    { name: "Offre → Embauche", taux: 90 },
  ]

  const sourcingData = [
    { name: "LinkedIn", value: 35 },
    { name: "Site carrière", value: 25 },
    { name: "Recommandations", value: 20 },
    { name: "Job boards", value: 15 },
    { name: "Événements", value: 5 },
  ]

  const timeToHireData = [
    { name: "Ingénierie", temps: 28 },
    { name: "Marketing", temps: 21 },
    { name: "Ventes", temps: 18 },
    { name: "Produit", temps: 25 },
    { name: "Design", temps: 22 },
    { name: "Support", temps: 15 },
  ]

  const diversityData = [
    { name: "Genre", actuel: 38, objectif: 50 },
    { name: "Âge", actuel: 42, objectif: 50 },
    { name: "Origine", actuel: 35, objectif: 40 },
    { name: "Handicap", actuel: 15, objectif: 20 },
    { name: "Formation", actuel: 45, objectif: 50 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord analytique</h1>
          <p className="text-muted-foreground">
            Visualisations avancées des données de recrutement et des performances IA
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois en cours</SelectItem>
              <SelectItem value="quarter">Trimestre en cours</SelectItem>
              <SelectItem value="year">Année en cours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="engineering">Ingénierie</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Ventes</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Candidats totaux"
          value="2,548"
          trend={{ value: "+15.8%", isPositive: true }}
          description="vs période précédente"
          icon={Users}
        />
        <StatCard
          title="Taux de conversion"
          value="24.5%"
          trend={{ value: "+2.3%", isPositive: true }}
          description="vs période précédente"
          icon={BarChart3}
        />
        <StatCard
          title="Temps moyen d'embauche"
          value="18 jours"
          trend={{ value: "-3.5 jours", isPositive: true }}
          description="vs période précédente"
          icon={Clock}
        />
        <StatCard
          title="Précision IA"
          value="92.7%"
          trend={{ value: "+1.2%", isPositive: true }}
          description="vs période précédente"
          icon={CheckCircle}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="overview" className="rounded-md">
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="conversion" className="rounded-md">
            Conversion
          </TabsTrigger>
          <TabsTrigger value="sourcing" className="rounded-md">
            Sourcing
          </TabsTrigger>
          <TabsTrigger value="diversity" className="rounded-md">
            Diversité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <EnhancedChart
            title="Activité de recrutement"
            description="Vue d'ensemble de l'activité de recrutement sur l'année"
            data={recruitmentData}
            type="line"
            dataKeys={["candidats", "entretiens", "embauches"]}
            height={350}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <EnhancedChart
              title="Temps moyen d'embauche par département"
              description="Nombre de jours entre la candidature et l'embauche"
              data={timeToHireData}
              type="bar"
              dataKeys={["temps"]}
              height={350}
            />

            <EnhancedChart
              title="Sources de candidatures"
              description="Répartition des candidatures par source"
              data={sourcingData}
              type="pie"
              dataKeys={["value"]}
              height={350}
            />
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4 animate-fade-in">
          <EnhancedChart
            title="Taux de conversion par étape"
            description="Pourcentage de candidats passant à l'étape suivante"
            data={conversionData}
            type="bar"
            dataKeys={["taux"]}
            height={350}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <EnhancedChart
              title="Évolution du taux de conversion"
              description="Tendance du taux de conversion global sur 12 mois"
              data={recruitmentData}
              type="area"
              dataKeys={["embauches", "entretiens", "candidats"]}
              stacked={true}
              height={350}
            />

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Analyse de conversion</CardTitle>
                <CardDescription>Points clés et recommandations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <h4 className="font-medium text-primary-800 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Points forts
                    </h4>
                    <ul className="mt-2 space-y-1 text-primary-700 text-sm">
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span>Taux de conversion offre → embauche excellent (90%)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span>Amélioration constante du taux global (+2.3%)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-warning-50 rounded-lg border border-warning-100">
                    <h4 className="font-medium text-warning-800 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Points d'amélioration
                    </h4>
                    <ul className="mt-2 space-y-1 text-warning-700 text-sm">
                      <li className="flex items-start">
                        <span className="text-warning-500 mr-2">•</span>
                        <span>Taux CV → Présélection faible (35%)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-warning-500 mr-2">•</span>
                        <span>Optimiser le processus de filtrage initial</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sourcing" className="space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <EnhancedChart
              title="Efficacité des sources de recrutement"
              description="Taux de conversion par source de candidature"
              data={[
                { name: "LinkedIn", taux: 28, cout: 450 },
                { name: "Site carrière", taux: 32, cout: 150 },
                { name: "Recommandations", taux: 45, cout: 200 },
                { name: "Job boards", taux: 22, cout: 350 },
                { name: "Événements", taux: 35, cout: 500 },
              ]}
              type="bar"
              dataKeys={["taux"]}
              height={350}
            />

            <EnhancedChart
              title="Qualité des candidatures par source"
              description="Score moyen de matching par source"
              data={[
                { name: "LinkedIn", score: 72 },
                { name: "Site carrière", score: 78 },
                { name: "Recommandations", score: 85 },
                { name: "Job boards", score: 68 },
                { name: "Événements", score: 75 },
              ]}
              type="bar"
              dataKeys={["score"]}
              height={350}
            />
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Recommandations de sourcing</CardTitle>
              <CardDescription>Stratégies pour optimiser vos canaux de recrutement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Privilégier les recommandations</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les candidats recommandés ont le meilleur taux de conversion (45%) et la meilleure qualité (85%).
                      Mettez en place un programme de recommandation interne avec des incitations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Optimiser les événements</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Malgré leur coût élevé, les événements offrent un bon taux de conversion (35%). Ciblez des
                      événements spécifiques à votre secteur pour maximiser le retour sur investissement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <div className="bg-primary-100 p-2 rounded-full text-primary-600">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Améliorer la stratégie LinkedIn</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      LinkedIn a un coût élevé pour un taux de conversion moyen. Affinez votre ciblage et optimisez vos
                      annonces pour attirer des candidats plus qualifiés.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4 animate-fade-in">
          <EnhancedChart
            title="Indicateurs de diversité"
            description="Comparaison entre les niveaux actuels et les objectifs"
            data={diversityData}
            type="bar"
            dataKeys={["actuel", "objectif"]}
            height={350}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <EnhancedChart
              title="Évolution de la diversité"
              description="Tendance sur 12 mois des indicateurs de diversité"
              data={[
                { name: "Jan", genre: 30, age: 35, origine: 28, handicap: 10, formation: 38 },
                { name: "Fév", genre: 31, age: 36, origine: 29, handicap: 11, formation: 39 },
                { name: "Mar", genre: 32, age: 37, origine: 30, handicap: 11, formation: 40 },
                { name: "Avr", genre: 33, age: 38, origine: 31, handicap: 12, formation: 41 },
                { name: "Mai", genre: 34, age: 39, origine: 32, handicap: 12, formation: 42 },
                { name: "Juin", genre: 35, age: 40, origine: 33, handicap: 13, formation: 43 },
                { name: "Juil", genre: 36, age: 40, origine: 33, handicap: 13, formation: 43 },
                { name: "Août", genre: 36, age: 41, origine: 34, handicap: 14, formation: 44 },
                { name: "Sep", genre: 37, age: 41, origine: 34, handicap: 14, formation: 44 },
                { name: "Oct", genre: 37, age: 42, origine: 35, handicap: 15, formation: 45 },
                { name: "Nov", genre: 38, age: 42, origine: 35, handicap: 15, formation: 45 },
                { name: "Déc", genre: 38, age: 42, origine: 35, handicap: 15, formation: 45 },
              ]}
              type="line"
              dataKeys={["genre", "age", "origine", "handicap", "formation"]}
              height={350}
            />

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Impact de la détection des biais</CardTitle>
                <CardDescription>Amélioration des indicateurs après implémentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success-50 rounded-lg border border-success-100">
                    <h4 className="font-medium text-success-800">Résultats</h4>
                    <p className="mt-2 text-success-700 text-sm">
                      L'utilisation de l'IA pour la détection des biais dans les offres d'emploi et le processus de
                      recrutement a permis d'améliorer ces indicateurs de 12% en moyenne sur l'année.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary-600">+52%</div>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        Amélioration de la diversité de genre
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary-600">+87%</div>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        Amélioration de l'inclusion des personnes en situation de handicap
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
