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
import { ArrowUpRight, MoreHorizontal, Users } from "lucide-react"

export default function JobPostings() {
  const jobs = [
    {
      id: 1,
      title: "Développeur Full Stack",
      department: "Ingénierie",
      location: "Paris, France",
      type: "CDI",
      applicants: 48,
      posted: "Il y a 5 jours",
    },
    {
      id: 2,
      title: "Data Scientist",
      department: "Data",
      location: "Lyon, France",
      type: "CDI",
      applicants: 32,
      posted: "Il y a 1 semaine",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "CDI",
      applicants: 27,
      posted: "Il y a 3 jours",
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Bordeaux, France",
      type: "CDI",
      applicants: 15,
      posted: "Il y a 2 jours",
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Produit",
      location: "Paris, France",
      type: "CDI",
      applicants: 38,
      posted: "Il y a 1 jour",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Postes ouverts</CardTitle>
          <CardDescription>5 postes actifs en ce moment</CardDescription>
        </div>
        <Button className="ml-auto" size="sm">
          Voir tous
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium leading-none">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {job.department} · {job.location}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{job.applicants}</span>
                </div>
                <Badge variant="outline">{job.type}</Badge>
                <span className="text-sm text-muted-foreground hidden md:inline">{job.posted}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                    <DropdownMenuItem>Modifier le poste</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Voir les candidats</DropdownMenuItem>
                    <DropdownMenuItem>Clôturer le poste</DropdownMenuItem>
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
