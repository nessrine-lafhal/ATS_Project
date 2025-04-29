"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SourcingForm } from "@/components/candidate-sourcing/sourcing-form"
import { CandidateResults } from "@/components/candidate-sourcing/candidate-results"
import { PlatformSettings } from "@/components/candidate-sourcing/platform-settings"
import { searchCandidates } from "@/lib/candidate-sourcing-service"
import type { CandidateSearchParams } from "@/lib/types"

export default function CandidateSourcingPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<CandidateSearchParams | null>(null)
  const [activeTab, setActiveTab] = useState("search")

  const handleSearch = async (params: CandidateSearchParams) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await searchCandidates(params)

      if (response.success) {
        setCandidates(response.candidates || [])
        setSearchParams(params)

        if (response.candidates?.length > 0) {
          setActiveTab("results")
        }
      } else {
        setError(response.error || "Une erreur est survenue lors de la recherche")
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de candidats:", error)
      setError("Une erreur est survenue lors de la recherche")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCandidates([])
    setSearchParams(null)
    setActiveTab("search")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recrutement proactif</h1>
        <p className="text-gray-500 mt-2">
          Recherchez automatiquement des talents sur différentes plateformes comme LinkedIn, GitHub et Stack Overflow
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Recherche</TabsTrigger>
          <TabsTrigger value="results" disabled={candidates.length === 0}>
            Résultats ({candidates.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <SourcingForm onSearch={handleSearch} isLoading={isLoading} />

          {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {candidates.length > 0 && searchParams && (
            <CandidateResults
              candidates={candidates}
              jobDescription={searchParams.job_description || ""}
              requiredSkills={searchParams.skills || []}
              onReset={handleReset}
            />
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <PlatformSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
