"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, BarChart3, CheckCircle, Scale } from "lucide-react"
import type { AuditResult } from "@/lib/bias-detection-service"

export function RecruitmentAudit() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditResults, setAuditResults] = useState<AuditResult | null>(null)

  const handleAudit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simuler des données de recrutement pour l'audit
      const mockRecruitmentData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        gender: ["male", "female", "non-binary"][Math.floor(Math.random() * 3)],
        age: 20 + Math.floor(Math.random() * 40),
        ethnicity: ["white", "black", "asian", "hispanic", "other"][Math.floor(Math.random() * 5)],
        education: ["high_school", "bachelor", "master", "phd"][Math.floor(Math.random() * 4)],
        experience: Math.floor(Math.random() * 20),
        interview_score: Math.random() * 10,
        technical_score: Math.random() * 10,
        hired: Math.random() > 0.7,
      }))

      const response = await fetch("/api/bias-detection/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: mockRecruitmentData,
          protectedAttributes: ["gender", "age", "ethnicity"],
          outcomeColumn: "hired",
        }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to audit recruitment data")
      }

      setAuditResults(result.data)
    } catch (err) {
      console.error("Error auditing recruitment data:", err)
      setError(err instanceof Error ? err.message : "An error occurred during audit")
    } finally {
      setIsLoading(false)
    }
  }

  const getFairnessColor = (value: number) => {
    if (value >= 0.9) return "text-green-600"
    if (value >= 0.8) return "text-emerald-600"
    if (value >= 0.7) return "text-amber-600"
    return "text-red-600"
  }

  const getParityDifferenceColor = (value: number) => {
    if (value <= 0.05) return "text-green-600"
    if (value <= 0.1) return "text-emerald-600"
    if (value <= 0.2) return "text-amber-600"
    return "text-red-600"
  }

  const getFairnessScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getRiskLevelColor = (level: string) => {
    if (level === "low") return "text-green-600"
    if (level === "medium") return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="mr-2 h-5 w-5" />
            Audit de biais dans le recrutement
          </CardTitle>
          <CardDescription>Analysez les biais potentiels dans votre processus de recrutement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Cet outil analyse vos données de recrutement pour détecter les biais potentiels et vous aider à mettre en
              place un processus plus équitable.
            </p>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleAudit} disabled={isLoading}>
                {isLoading ? "Audit en cours..." : "Auditer les données de recrutement"}
              </Button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-800">
                <p className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {auditResults && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Parité démographique</CardTitle>
              <CardDescription>Mesure si les taux de sélection sont similaires entre les groupes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(auditResults.demographic_parity).map(([attribute, value]) => (
                  <div key={attribute} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>
                        {attribute === "gender"
                          ? "Genre"
                          : attribute === "age"
                            ? "Âge"
                            : attribute === "ethnicity"
                              ? "Origine ethnique"
                              : attribute}
                      </span>
                      <span className={getFairnessColor(value)}>{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Égalité des chances</CardTitle>
              <CardDescription>Mesure si les taux d'erreur sont similaires entre les groupes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(auditResults.equalized_odds).map(([attribute, value]) => (
                  <div key={attribute} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>
                        {attribute === "gender"
                          ? "Genre"
                          : attribute === "age"
                            ? "Âge"
                            : attribute === "ethnicity"
                              ? "Origine ethnique"
                              : attribute}
                      </span>
                      <span className={getFairnessColor(value)}>{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact disparate</CardTitle>
              <CardDescription>Mesure l'impact disproportionné sur les groupes protégés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(auditResults.disparate_impact).map(([attribute, value]) => (
                  <div key={attribute} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>
                        {attribute === "gender"
                          ? "Genre"
                          : attribute === "age"
                            ? "Âge"
                            : attribute === "ethnicity"
                              ? "Origine ethnique"
                              : attribute}
                      </span>
                      <span className={getFairnessColor(value)}>{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Différence de parité statistique</CardTitle>
              <CardDescription>Mesure la différence absolue entre les taux de sélection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(auditResults.statistical_parity_difference).map(([attribute, value]) => (
                  <div key={attribute} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>
                        {attribute === "gender"
                          ? "Genre"
                          : attribute === "age"
                            ? "Âge"
                            : attribute === "ethnicity"
                              ? "Origine ethnique"
                              : attribute}
                      </span>
                      <span className={getParityDifferenceColor(value)}>{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Métriques globales de biais
              </CardTitle>
              <CardDescription>Évaluation globale de l'équité dans votre processus de recrutement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">Score d'équité</p>
                    <p className="text-3xl font-bold">
                      <span className={getFairnessScoreColor(auditResults.overall_bias_metrics.fairness_score)}>
                        {auditResults.overall_bias_metrics.fairness_score}/100
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Niveau de risque</p>
                    <p className="text-3xl font-bold">
                      <span className={getRiskLevelColor(auditResults.overall_bias_metrics.bias_risk_level)}>
                        {auditResults.overall_bias_metrics.bias_risk_level === "low"
                          ? "Faible"
                          : auditResults.overall_bias_metrics.bias_risk_level === "medium"
                            ? "Moyen"
                            : "Élevé"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Recommandations</p>
                  <div className="space-y-2">
                    {auditResults.overall_bias_metrics.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <p>{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
