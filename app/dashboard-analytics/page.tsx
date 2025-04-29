"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, Download, Filter } from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function DashboardAnalyticsPage() {
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

  const skillsRadarData = [
    { subject: "JavaScript", A: 85, fullMark: 100 },
    { subject: "Python", A: 65, fullMark: 100 },
    { subject: "React", A: 90, fullMark: 100 },
    { subject: "DevOps", A: 70, fullMark: 100 },
    { subject: "Data Science", A: 60, fullMark: 100 },
    { subject: "UX Design", A: 75, fullMark: 100 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidats totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,548</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+15.8%</p>
              <p className="text-xs text-muted-foreground ml-1">vs période précédente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+2.3%</p>
              <p className="text-xs text-muted-foreground ml-1">vs période précédente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen d'embauche</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 jours</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">-3.5 jours</p>
              <p className="text-xs text-muted-foreground ml-1">vs période précédente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Précision IA</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.7%</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <p className="text-xs text-green-600">+1.2%</p>
              <p className="text-xs text-muted-foreground ml-1">vs période précédente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
          <TabsTrigger value="diversity">Diversité</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité de recrutement</CardTitle>
              <CardDescription>Vue d'ensemble de l'activité de recrutement sur l'année</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={recruitmentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="candidats" stroke="#8884d8" activeDot={{ r: 8 }} name="Candidats" />
                    <Line type="monotone" dataKey="entretiens" stroke="#82ca9d" name="Entretiens" />
                    <Line type="monotone" dataKey="embauches" stroke="#ffc658" name="Embauches" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Temps moyen d'embauche par département</CardTitle>
                <CardDescription>Nombre de jours entre la candidature et l'embauche</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={timeToHireData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="temps" name="Jours" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sources de candidatures</CardTitle>
                <CardDescription>Répartition des candidatures par source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcingData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sourcingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Pourcentage"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion par étape</CardTitle>
              <CardDescription>Pourcentage de candidats passant à l'étape suivante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="taux" name="Taux de conversion (%)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Analyse</h4>
                <p className="mt-1 text-blue-700">
                  Le taux de conversion le plus faible se situe entre le CV et la présélection (35%), ce qui suggère un
                  besoin d'optim se situe entre le CV et la présélection (35%), ce qui suggère un besoin d'optimisation
                  du processus de filtrage initial. L'utilisation de l'IA pour la présélection pourrait améliorer ce
                  taux en identifiant plus efficacement les candidats qualifiés.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du taux de conversion</CardTitle>
                <CardDescription>Tendance du taux de conversion global sur 12 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={recruitmentData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="embauches"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Embauches"
                      />
                      <Area
                        type="monotone"
                        dataKey="entretiens"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Entretiens"
                      />
                      <Area
                        type="monotone"
                        dataKey="candidats"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                        name="Candidats"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact de l'IA sur la conversion</CardTitle>
                <CardDescription>Comparaison des taux avant et après l'implémentation de l'IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "CV → Présélection", avant: 22, apres: 35 },
                        { name: "Présélection → Entretien", avant: 45, apres: 60 },
                        { name: "Entretien → Test", avant: 65, apres: 75 },
                        { name: "Test → Offre", avant: 70, apres: 80 },
                        { name: "Offre → Embauche", avant: 85, apres: 90 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avant" name="Avant IA (%)" fill="#82ca9d" />
                      <Bar dataKey="apres" name="Après IA (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sourcing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Efficacité des sources de recrutement</CardTitle>
                <CardDescription>Taux de conversion par source de candidature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "LinkedIn", taux: 28, cout: 450 },
                        { name: "Site carrière", taux: 32, cout: 150 },
                        { name: "Recommandations", taux: 45, cout: 200 },
                        { name: "Job boards", taux: 22, cout: 350 },
                        { name: "Événements", taux: 35, cout: 500 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="taux" name="Taux de conversion (%)" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="cout" name="Coût par embauche (€)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualité des candidatures par source</CardTitle>
                <CardDescription>Score moyen de matching par source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "LinkedIn", score: 72 },
                        { name: "Site carrière", score: 78 },
                        { name: "Recommandations", score: 85 },
                        { name: "Job boards", score: 68 },
                        { name: "Événements", score: 75 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Score de matching (%)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution des sources de candidatures</CardTitle>
              <CardDescription>Tendance sur 12 mois par source de recrutement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: "Jan", linkedin: 45, site: 30, recommandations: 25, jobboards: 20, evenements: 10 },
                      { name: "Fév", linkedin: 50, site: 35, recommandations: 28, jobboards: 22, evenements: 12 },
                      { name: "Mar", linkedin: 55, site: 40, recommandations: 30, jobboards: 25, evenements: 15 },
                      { name: "Avr", linkedin: 60, site: 45, recommandations: 35, jobboards: 28, evenements: 18 },
                      { name: "Mai", linkedin: 65, site: 50, recommandations: 38, jobboards: 30, evenements: 20 },
                      { name: "Juin", linkedin: 70, site: 55, recommandations: 40, jobboards: 32, evenements: 22 },
                      { name: "Juil", linkedin: 75, site: 60, recommandations: 42, jobboards: 35, evenements: 25 },
                      { name: "Août", linkedin: 80, site: 65, recommandations: 45, jobboards: 38, evenements: 28 },
                      { name: "Sep", linkedin: 85, site: 70, recommandations: 48, jobboards: 40, evenements: 30 },
                      { name: "Oct", linkedin: 90, site: 75, recommandations: 50, jobboards: 42, evenements: 32 },
                      { name: "Nov", linkedin: 95, site: 80, recommandations: 52, jobboards: 45, evenements: 35 },
                      { name: "Déc", linkedin: 100, site: 85, recommandations: 55, jobboards: 48, evenements: 38 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="linkedin" stroke="#8884d8" name="LinkedIn" />
                    <Line type="monotone" dataKey="site" stroke="#82ca9d" name="Site carrière" />
                    <Line type="monotone" dataKey="recommandations" stroke="#ffc658" name="Recommandations" />
                    <Line type="monotone" dataKey="jobboards" stroke="#ff8042" name="Job boards" />
                    <Line type="monotone" dataKey="evenements" stroke="#0088fe" name="Événements" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de diversité</CardTitle>
              <CardDescription>Comparaison entre les niveaux actuels et les objectifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={diversityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actuel" name="Niveau actuel (%)" fill="#82ca9d" />
                    <Bar dataKey="objectif" name="Objectif (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Analyse</h4>
                <p className="mt-1 text-blue-700">
                  Les écarts les plus importants concernent la diversité de genre et l'inclusion des personnes en
                  situation de handicap. L'utilisation de l'IA pour la détection des biais dans les offres d'emploi et
                  le processus de recrutement a permis d'améliorer ces indicateurs de 12% en moyenne sur l'année.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la diversité</CardTitle>
                <CardDescription>Tendance sur 12 mois des indicateurs de diversité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="genre" stroke="#8884d8" name="Genre" />
                      <Line type="monotone" dataKey="age" stroke="#82ca9d" name="Âge" />
                      <Line type="monotone" dataKey="origine" stroke="#ffc658" name="Origine" />
                      <Line type="monotone" dataKey="handicap" stroke="#ff8042" name="Handicap" />
                      <Line type="monotone" dataKey="formation" stroke="#0088fe" name="Formation" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact de la détection des biais</CardTitle>
                <CardDescription>Amélioration des indicateurs après implémentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Genre", avant: 25, apres: 38 },
                        { name: "Âge", avant: 30, apres: 42 },
                        { name: "Origine", avant: 22, apres: 35 },
                        { name: "Handicap", avant: 8, apres: 15 },
                        { name: "Formation", avant: 32, apres: 45 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avant" name="Avant détection (%)" fill="#82ca9d" />
                      <Bar dataKey="apres" name="Après détection (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compétences les plus demandées</CardTitle>
                <CardDescription>Top des compétences recherchées dans les offres d'emploi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "JavaScript", value: 85 },
                        { name: "Python", value: 75 },
                        { name: "React", value: 70 },
                        { name: "DevOps", value: 65 },
                        { name: "Data Science", value: 60 },
                        { name: "UX Design", value: 55 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Demande (%)" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse des compétences</CardTitle>
                <CardDescription>Répartition des compétences dans l'entreprise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Niveau de compétence"
                        dataKey="A"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Écarts de compétences</CardTitle>
              <CardDescription>Comparaison entre les compétences disponibles et les besoins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "JavaScript", disponible: 85, requis: 85 },
                      { name: "Python", disponible: 65, requis: 75 },
                      { name: "React", disponible: 90, requis: 70 },
                      { name: "DevOps", disponible: 45, requis: 65 },
                      { name: "Data Science", disponible: 35, requis: 60 },
                      { name: "UX Design", disponible: 60, requis: 55 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="disponible" name="Niveau disponible (%)" fill="#82ca9d" />
                    <Bar dataKey="requis" name="Niveau requis (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Analyse</h4>
                <p className="mt-1 text-blue-700">
                  Les écarts de compétences les plus importants concernent DevOps et Data Science. Ces domaines
                  devraient être prioritaires dans la stratégie de recrutement et de formation. À l'inverse,
                  l'entreprise dispose d'une expertise supérieure aux besoins actuels en React, ce qui pourrait être
                  valorisé dans de nouveaux projets.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
