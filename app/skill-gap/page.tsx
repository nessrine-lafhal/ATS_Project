import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillGapAnalyzer } from "@/components/skill-gap/skill-gap-analyzer"
import { CandidateComparison } from "@/components/skill-gap/candidate-comparison"
import { DevelopmentPlanGenerator } from "@/components/skill-gap/development-plan-generator"

export default function SkillGapPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analyse des lacunes de compétences</h1>
        <p className="text-muted-foreground">
          Identifiez les écarts entre les compétences des candidats et les besoins des postes
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>À propos de l'analyse des lacunes de compétences</CardTitle>
          <CardDescription>Comment cette fonctionnalité peut améliorer votre processus de recrutement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Identification précise des écarts</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez BERT et Gensim pour analyser sémantiquement les compétences des candidats et les exigences des
                postes, identifiant ainsi les écarts avec une précision inégalée.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Comparaison objective des candidats</h3>
              <p className="text-sm text-muted-foreground">
                Comparez plusieurs candidats pour un même poste en fonction de leurs écarts de compétences, facilitant
                ainsi la prise de décision basée sur des données objectives.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Plans de développement personnalisés</h3>
              <p className="text-sm text-muted-foreground">
                Générez des plans de développement sur mesure pour combler les écarts de compétences, accélérant
                l'intégration et la montée en compétences des nouveaux employés.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analyzer" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="analyzer">Analyseur d'écarts</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison de candidats</TabsTrigger>
          <TabsTrigger value="development">Plan de développement</TabsTrigger>
        </TabsList>
        <TabsContent value="analyzer" className="space-y-4">
          <SkillGapAnalyzer />
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <CandidateComparison />
        </TabsContent>
        <TabsContent value="development" className="space-y-4">
          <DevelopmentPlanGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
