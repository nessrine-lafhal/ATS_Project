"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  MapPin,
  Calendar,
  Award,
  Github,
  Linkedin,
  MessageSquare,
  Star,
  Code,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { getCandidateDetails, analyzeCandidateFit } from "@/lib/candidate-sourcing-service"

interface CandidateResultsProps {
  candidates: any[]
  jobDescription: string
  requiredSkills: string[]
  onReset: () => void
}

export function CandidateResults({ candidates, jobDescription, requiredSkills, onReset }: CandidateResultsProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [candidateDetails, setCandidateDetails] = useState<any>(null)
  const [candidateAnalysis, setCandidateAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const handleSelectCandidate = async (candidate: any) => {
    setIsLoading(true)
    setSelectedCandidate(candidate)
    setCandidateDetails(null)
    setCandidateAnalysis(null)
    setActiveTab("profile")

    try {
      // Récupérer les détails du candidat
      const detailsResponse = await getCandidateDetails(candidate.id, candidate.platform)
      if (detailsResponse.success) {
        setCandidateDetails(detailsResponse.candidate)

        // Analyser l'adéquation du candidat
        const analysisResponse = await analyzeCandidateFit({
          candidate: { ...candidate, ...detailsResponse.candidate },
          job_description: jobDescription,
          required_skills: requiredSkills,
        })

        if (analysisResponse.success) {
          setCandidateAnalysis(analysisResponse.analysis)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du candidat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      case "github":
        return <Github className="h-4 w-4" />
      case "stackoverflow":
        return <MessageSquare className="h-4 w-4" />
      default:
        return null
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Candidats trouvés ({candidates.length})</CardTitle>
          <CardDescription>Cliquez sur un candidat pour voir ses détails</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCandidate?.id === candidate.id ? "bg-gray-50" : ""
                }`}
                onClick={() => handleSelectCandidate(candidate)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{candidate.name}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getPlatformIcon(candidate.platform)}
                        <span className="capitalize">{candidate.platform}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{candidate.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span className="truncate">{candidate.company}</span>
                      </div>
                      {candidate.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={
                        candidate.match_score > 80 ? "success" : candidate.match_score > 60 ? "default" : "outline"
                      }
                    >
                      {candidate.match_score}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={onReset}>
              Nouvelle recherche
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {selectedCandidate ? (
          <>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl">{getInitials(selectedCandidate.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedCandidate.name}
                      <Badge variant="outline" className="flex items-center gap-1 ml-2">
                        {getPlatformIcon(selectedCandidate.platform)}
                        <span className="capitalize">{selectedCandidate.platform}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-base mt-1">{selectedCandidate.title}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{selectedCandidate.company}</span>
                      </div>
                      {selectedCandidate.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedCandidate.location}</span>
                        </div>
                      )}
                      {selectedCandidate.experience_years && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{selectedCandidate.experience_years} ans d'expérience</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Badge
                    variant={
                      selectedCandidate.match_score > 80
                        ? "success"
                        : selectedCandidate.match_score > 60
                          ? "default"
                          : "outline"
                    }
                    className="text-lg px-3 py-1"
                  >
                    {selectedCandidate.match_score}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm text-gray-500">Chargement des détails...</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="skills">Compétences</TabsTrigger>
                    <TabsTrigger value="analysis" disabled={!candidateAnalysis}>
                      Analyse
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">À propos</h3>
                      <p className="text-gray-700">{selectedCandidate.bio}</p>
                    </div>

                    {candidateDetails && (
                      <>
                        {candidateDetails.profile_details.experiences?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Expérience professionnelle</h3>
                            <div className="space-y-4">
                              {candidateDetails.profile_details.experiences.map((exp: any, index: number) => (
                                <div key={index} className="flex gap-3">
                                  <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">{exp.title}</h4>
                                    <p className="text-sm text-gray-600">{exp.company}</p>
                                    <p className="text-sm text-gray-500">
                                      {exp.start_year} - {exp.current ? "Présent" : exp.end_year} · {exp.duration}{" "}
                                      {exp.duration > 1 ? "ans" : "an"}
                                    </p>
                                    {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidateDetails.profile_details.education?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Formation</h3>
                            <div className="space-y-4">
                              {candidateDetails.profile_details.education.map((edu: any, index: number) => (
                                <div key={index} className="flex gap-3">
                                  <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">
                                      {edu.degree} en {edu.field}
                                    </h4>
                                    <p className="text-sm text-gray-600">{edu.school}</p>
                                    <p className="text-sm text-gray-500">
                                      {edu.start_year} - {edu.end_year}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidateDetails.profile_details.projects?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Projets</h3>
                            <div className="space-y-4">
                              {candidateDetails.profile_details.projects.map((project: any, index: number) => (
                                <div key={index} className="flex gap-3">
                                  <Code className="h-5 w-5 text-gray-400 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">{project.name}</h4>
                                    <p className="text-sm text-gray-700">{project.description}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <Badge variant="outline">{project.language}</Badge>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Star className="h-3 w-3 mr-1" />
                                        <span>{project.stars}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidateDetails.profile_details.certifications?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Certifications</h3>
                            <div className="flex flex-wrap gap-2">
                              {candidateDetails.profile_details.certifications.map((cert: string, index: number) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  <Award className="h-3 w-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {candidateDetails.profile_details.languages?.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Langues</h3>
                            <div className="flex flex-wrap gap-2">
                              {candidateDetails.profile_details.languages.map((lang: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => window.open(selectedCandidate.profile_url, "_blank")}
                      >
                        {getPlatformIcon(selectedCandidate.platform)}
                        <span>Voir le profil complet</span>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Compétences</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant={requiredSkills.includes(skill) ? "default" : "secondary"}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {requiredSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Compétences requises</h3>
                        <div className="flex flex-wrap gap-2">
                          {requiredSkills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant={selectedCandidate.skills.includes(skill) ? "default" : "outline"}
                              className={!selectedCandidate.skills.includes(skill) ? "opacity-60" : ""}
                            >
                              {selectedCandidate.skills.includes(skill) ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-3">Correspondance des compétences</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Score global</span>
                            <span className="text-sm font-medium">{selectedCandidate.match_score}%</span>
                          </div>
                          <Progress value={selectedCandidate.match_score} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-6">
                    {candidateAnalysis && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="py-4">
                              <CardTitle className="text-base">Score global</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{candidateAnalysis.overall_score}%</div>
                              <Progress value={candidateAnalysis.overall_score} className="h-2 mt-2" />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="py-4">
                              <CardTitle className="text-base">Compétences</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{candidateAnalysis.skills_match}%</div>
                              <Progress value={candidateAnalysis.skills_match} className="h-2 mt-2" />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="py-4">
                              <CardTitle className="text-base">Correspondance sémantique</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{candidateAnalysis.semantic_match}%</div>
                              <Progress value={candidateAnalysis.semantic_match} className="h-2 mt-2" />
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-3">Forces</h3>
                            {candidateAnalysis.strengths.length > 0 ? (
                              <ul className="space-y-2">
                                {candidateAnalysis.strengths.map((strength: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">Aucune force spécifique identifiée</p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-3">Points à améliorer</h3>
                            {candidateAnalysis.weaknesses.length > 0 ? (
                              <ul className="space-y-2">
                                {candidateAnalysis.weaknesses.map((weakness: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500">Aucun point faible majeur identifié</p>
                            )}
                          </div>
                        </div>

                        {candidateAnalysis.recommendations.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Recommandations</h3>
                            <ul className="space-y-2">
                              {candidateAnalysis.recommendations.map((rec: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {candidateAnalysis.potential_roles.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">Rôles alternatifs potentiels</h3>
                            <div className="flex flex-wrap gap-2">
                              {candidateAnalysis.potential_roles.map((role: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Sélectionnez un candidat</h3>
              <p className="text-gray-500">
                Cliquez sur un candidat dans la liste pour voir ses détails et son analyse
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
