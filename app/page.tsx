import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Briefcase,
  Brain,
  MessageSquare,
  Video,
  Scale,
  TrendingUp,
  FileText,
  DollarSign,
  Wand2,
  ArrowRight,
} from "lucide-react"
import DashboardMetrics from "@/components/dashboard-metrics"
import RecentCandidates from "@/components/recent-candidates"
import JobPostings from "@/components/job-postings"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre système de suivi des candidatures IA</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Importer des CV
          </Button>
          <Button variant="outline">
            <Briefcase className="mr-2 h-4 w-4" />
            Ajouter un poste
          </Button>
        </div>
      </div>

      <DashboardMetrics />

      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">Candidats récents</TabsTrigger>
          <TabsTrigger value="jobs">Postes ouverts</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>
        <TabsContent value="candidates" className="space-y-4">
          <RecentCandidates />
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4">
          <JobPostings />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">+5.1% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps moyen de recrutement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 jours</div>
                <p className="text-xs text-muted-foreground">-3 jours par rapport au trimestre précédent</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coût par embauche</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250 €</div>
                <p className="text-xs text-muted-foreground">-15% grâce à l'automatisation IA</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Fonctionnalités IA</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Brain className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Analyse sémantique des CV</CardTitle>
              <CardDescription>Extraction d'informations contextuelles des CV et lettres de motivation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Analyser des CV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Briefcase className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Matching contextuel</CardTitle>
              <CardDescription>Évaluation de la compatibilité entre candidats et postes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Lancer un matching
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Classement prédictif</CardTitle>
              <CardDescription>Classement des candidats selon leur adéquation au poste</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Générer un classement
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Chatbot de présélection</CardTitle>
              <CardDescription>Entretiens automatisés pour la présélection des candidats</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurer le chatbot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Video className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Analyse vidéo</CardTitle>
              <CardDescription>Analyse des entretiens vidéo pour détecter les émotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Analyser des entretiens
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Scale className="h-5 w-5 mb-2 text-primary" />
              <CardTitle>Détection des biais</CardTitle>
              <CardDescription>Promotion de la diversité dans le recrutement</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Audit de biais
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="mr-2 h-5 w-5" />
                Optimisation des offres d'emploi
              </CardTitle>
              <CardDescription>
                Génération automatique de descriptions de postes optimisées pour attirer les bons profils
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Utilisez GPT-2 et T5 pour créer, analyser et optimiser des descriptions de postes attractives et
                efficaces.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/job-optimizer">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Accéder
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Scénarios d'entretien personnalisés
              </CardTitle>
              <CardDescription>
                Création automatique de scénarios d'entretien adaptés au poste et au profil du candidat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Générez des questions techniques, comportementales et des jeux de rôle personnalisés pour vos
                entretiens.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/interview-generator">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Accéder
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
