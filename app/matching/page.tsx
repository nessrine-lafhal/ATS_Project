"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Search, Users, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function MatchingPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [cvText, setCvText] = useState("")
  const [isMatching, setIsMatching] = useState(false)
  const [matchedCandidates, setMatchedCandidates] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const jobs = [
    {
      id: 1,
      title: "Développeur Full Stack",
      department: "Ingénierie",
      location: "Paris",
      description:
        "Nous recherchons un développeur Full Stack expérimenté avec des compétences en React, Node.js et technologies cloud. Le candidat idéal doit avoir de solides compétences en résolution de problèmes et être capable de travailler dans un environnement agile.",
    },
    {
      id: 2,
      title: "Data Scientist",
      department: "Data",
      location: "Lyon",
      description:
        "Nous recherchons un Data Scientist avec une expérience en Python, TensorFlow et analyse de données. Le candidat idéal doit avoir une solide formation en statistiques et en apprentissage automatique.",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      description:
        "Nous recherchons un UX Designer créatif avec une expérience en Figma, recherche utilisateur et prototypage. Le candidat idéal doit avoir un bon sens de l'esthétique et une compréhension approfondie de l'expérience utilisateur.",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Bordeaux",
      description:
        "Nous recherchons un DevOps Engineer avec une expérience en Docker, Kubernetes, AWS et CI/CD. Le candidat idéal doit avoir une solide compréhension des principes DevOps et être capable de mettre en place des pipelines d'intégration continue.",
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Produit",
      location: "Paris",
      description:
        "Nous recherchons un Product Manager avec une expérience en gestion de produits numériques. Le candidat idéal doit avoir une bonne compréhension des méthodologies agiles, des user stories et de la roadmap produit.",
    },
  ]

  const handleSelectJob = (job: any) => {
    setSelectedJob(job.id)
    setJobDescription(job.description)
  }

  const handleMatch = async () => {
    if (!selectedJob || !cvText) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un poste et fournir un CV",
        variant: "destructive",
      })
      return
    }

    setIsMatching(true)
    setError(null)

    try {
      const response = await fetch("/api/semantic-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvText,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Simuler des candidats avec le score de matching
        const matchScore = data.data.matchScore * 100

        // Générer des candidats fictifs avec des scores proches du score calculé
        const candidates = [
          {
            id: 1,
            name: "Sophie Martin",
            position: "Développeur Full Stack",
            matchScore: Math.round(matchScore),
            skills: ["React", "Node.js", "TypeScript", "MongoDB"],
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "SM",
          },
          {
            id: 2,
            name: "Thomas Dubois",
            position: "Data Scientist",
            matchScore: Math.round(matchScore * 0.95),
            skills: ["Python", "TensorFlow", "SQL", "Data Visualization"],
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "TD",
          },
          {
            id: 3,
            name: "Emma Bernard",
            position: "UX Designer",
            matchScore: Math.round(matchScore * 0.9),
            skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "EB",
          },
          {
            id: 4,
            name: "Lucas Moreau",
            position: "DevOps Engineer",
            matchScore: Math.round(matchScore * 0.85),
            skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "LM",
          },
          {
            id: 5,
            name: "Camille Petit",
            position: "Product Manager",
            matchScore: Math.round(matchScore * 0.8),
            skills: ["Agile", "Product Strategy", "User Stories", "Roadmapping"],
            avatar: "/placeholder.svg?height=40&width=40",
            initials: "CP",
          },
        ]

        setMatchedCandidates(candidates)

        toast({
          title: "Matching réussi",
          description: `Score de matching: ${Math.round(matchScore)}%`,
        })
      } else {
        throw new Error(data.error || "Une erreur est survenue lors du matching")
      }
    } catch (error) {
      console.error("Erreur lors du matching:", error)
      setError("Une erreur est survenue lors du matching sémantique. Veuillez réessayer.")

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du matching sémantique",
        variant: "destructive",
      })
    } finally {
      setIsMatching(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-emerald-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Matching contextuel poste-candidat</h1>
        <p className="text-muted-foreground">
          Évaluation de la compatibilité entre les candidats et les postes à pourvoir
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Sélectionner un poste
            </CardTitle>
            <CardDescription>Choisissez un poste pour trouver les candidats les plus compatibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un poste..."
                  className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`flex items-center p-2 rounded-md hover:bg-muted cursor-pointer ${
                      selectedJob === job.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectJob(job)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.department} · {job.location}
                      </p>
                    </div>
                    {selectedJob === job.id && <Badge>Sélectionné</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              CV du candidat
            </CardTitle>
            <CardDescription>Entrez le texte du CV pour évaluer la compatibilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Collez le texte du CV ici..."
                className="min-h-[200px]"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />

              <Button className="w-full" onClick={handleMatch} disabled={isMatching || !selectedJob || !cvText}>
                {isMatching ? "Matching en cours..." : "Lancer le matching"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {matchedCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Candidats compatibles</CardTitle>
            <CardDescription>Candidats classés par ordre de compatibilité avec le poste sélectionné</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {matchedCandidates.map((candidate) => (
                <div key={candidate.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{candidate.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}% match
                      </span>
                      <Progress value={candidate.matchScore} className="h-2 flex-1" />
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 self-center">
                    <Button size="sm">Voir profil</Button>
                    <Button size="sm" variant="outline">
                      Contacter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
