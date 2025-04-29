"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts"
import type { ForecastData } from "@/lib/types"

interface ForecastChartsProps {
  data: ForecastData
}

export function ForecastCharts({ data }: ForecastChartsProps) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <Tabs defaultValue="hiring" className="space-y-4">
      <TabsList className="grid grid-cols-5 w-full md:w-auto">
        <TabsTrigger value="hiring">Besoins en recrutement</TabsTrigger>
        <TabsTrigger value="departments">Départements</TabsTrigger>
        <TabsTrigger value="skills">Écarts de compétences</TabsTrigger>
        <TabsTrigger value="market">Tendances du marché</TabsTrigger>
        <TabsTrigger value="attrition">Risques d'attrition</TabsTrigger>
      </TabsList>

      <TabsContent value="hiring" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Prévision des besoins en recrutement</CardTitle>
            <CardDescription>
              Estimation du nombre de recrutements nécessaires pour les 12 prochains mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.hiringNeeds}
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
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="besoins"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Recrutements prévus"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Analyse</h4>
              <p className="mt-1 text-blue-700">
                Les besoins en recrutement augmentent progressivement tout au long de l'année, avec un pic prévu en
                octobre. Cette tendance est liée à l'expansion prévue et aux projets stratégiques planifiés pour le
                quatrième trimestre.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="departments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribution par département</CardTitle>
            <CardDescription>Répartition des besoins en recrutement par département</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} postes`, "Nombre"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Analyse</h4>
              <p className="mt-1 text-blue-700">
                L'ingénierie représente la plus grande part des besoins en recrutement (42%), suivie par le marketing et
                les ventes. Cette distribution reflète la stratégie de croissance axée sur le développement de produits
                et l'expansion commerciale.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analyse des écarts de compétences</CardTitle>
            <CardDescription>Comparaison entre les compétences actuelles et les besoins futurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.skillsGap}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actuel" fill="#82ca9d" name="Niveau actuel" />
                  <Bar dataKey="requis" fill="#8884d8" name="Niveau requis" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Analyse</h4>
              <p className="mt-1 text-blue-700">
                Les écarts de compétences les plus importants concernent Data Science, DevOps et Python. Des programmes
                de formation ciblés et une stratégie de recrutement axée sur ces compétences sont recommandés pour
                combler ces lacunes.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="market" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tendances du marché du travail</CardTitle>
            <CardDescription>
              Analyse de l'offre et de la demande pour les compétences clés (taille = importance)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="offre" name="Offre" domain={[0, 100]} />
                  <YAxis type="number" dataKey="demande" name="Demande" domain={[0, 100]} />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Importance" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Compétences" data={data.marketTrends} fill="#8884d8">
                    {data.marketTrends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Analyse</h4>
              <p className="mt-1 text-blue-700">
                Data Science et Python présentent un déséquilibre important entre une forte demande et une offre
                limitée, ce qui indique un marché compétitif pour ces compétences. Une stratégie de recrutement
                proactive et des packages attractifs seront nécessaires.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attrition" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Risques d'attrition par département</CardTitle>
            <CardDescription>Prévision des risques de départ par département</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.attritionRisk}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 30]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="risque" name="Risque d'attrition (%)" fill="#ff8042" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Analyse</h4>
              <p className="mt-1 text-blue-700">
                L'ingénierie présente le risque d'attrition le plus élevé (28%), suivi du support et des ventes. Des
                programmes de rétention ciblés, incluant des plans de développement de carrière et des ajustements de
                rémunération, sont recommandés pour ces départements.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
