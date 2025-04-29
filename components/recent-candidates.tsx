import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, ArrowUpRight } from "lucide-react"

export default function RecentCandidates() {
  const candidates = [
    {
      id: 1,
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      position: "Développeur Full Stack",
      matchScore: 92,
      status: "Entretien",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    {
      id: 2,
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      position: "Data Scientist",
      matchScore: 87,
      status: "Présélection",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TD",
    },
    {
      id: 3,
      name: "Emma Bernard",
      email: "emma.bernard@example.com",
      position: "UX Designer",
      matchScore: 78,
      status: "Nouveau",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EB",
    },
    {
      id: 4,
      name: "Lucas Moreau",
      email: "lucas.moreau@example.com",
      position: "DevOps Engineer",
      matchScore: 95,
      status: "Offre",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LM",
    },
    {
      id: 5,
      name: "Camille Petit",
      email: "camille.petit@example.com",
      position: "Product Manager",
      matchScore: 82,
      status: "Entretien",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CP",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouveau":
        return "bg-blue-500"
      case "Présélection":
        return "bg-yellow-500"
      case "Entretien":
        return "bg-purple-500"
      case "Offre":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-emerald-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Candidats récents</CardTitle>
          <CardDescription>5 nouveaux candidats cette semaine</CardDescription>
        </div>
        <Button className="ml-auto" size="sm">
          Voir tous
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{candidate.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{candidate.name}</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm">{candidate.position}</p>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getMatchScoreColor(candidate.matchScore)}`}>
                      {candidate.matchScore}% match
                    </span>
                    <Progress value={candidate.matchScore} className="h-2 w-24 ml-2" />
                  </div>
                </div>
                <Badge variant="outline" className={`${getStatusColor(candidate.status)} text-white`}>
                  {candidate.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem>Planifier un entretien</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                    <DropdownMenuItem>Rejeter</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
