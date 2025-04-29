"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Brain,
  MessageSquare,
  Video,
  Scale,
  TrendingUp,
  Lightbulb,
  LineChart,
  FileText,
  Search,
  Mic,
  Code,
  UserCog,
  AlertTriangle,
  DollarSign,
  Globe,
  BarChart4,
  Settings,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-64 border-r hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">NextGen ATS</h2>
          <div className="space-y-1">
            <Button variant={pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
            <Button
              variant={pathname === "/candidates" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/candidates">
                <Users className="mr-2 h-4 w-4" />
                Candidats
              </Link>
            </Button>
            <Button variant={pathname === "/jobs" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
              <Link href="/jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Postes
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Fonctionnalités IA</h2>
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              <Button
                variant={pathname === "/resume-analysis" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/resume-analysis">
                  <Brain className="mr-2 h-4 w-4" />
                  Analyse de CV
                </Link>
              </Button>
              <Button
                variant={pathname === "/matching" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/matching">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Matching contextuel
                </Link>
              </Button>
              <Button
                variant={pathname === "/ranking" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/ranking">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Classement prédictif
                </Link>
              </Button>
              <Button
                variant={pathname === "/chatbot" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/chatbot">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chatbot de présélection
                </Link>
              </Button>
              <Button
                variant={pathname === "/video-analysis" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/video-analysis">
                  <Video className="mr-2 h-4 w-4" />
                  Analyse vidéo
                </Link>
              </Button>
              <Button
                variant={pathname === "/bias-detection" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/bias-detection">
                  <Scale className="mr-2 h-4 w-4" />
                  Détection des biais
                </Link>
              </Button>
              <Button
                variant={pathname === "/attrition" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/attrition">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Prévision d'attrition
                </Link>
              </Button>
              <Button
                variant={pathname === "/skill-gap" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/skill-gap">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Analyse des compétences
                </Link>
              </Button>
              <Button
                variant={pathname === "/job-optimization" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/job-optimization">
                  <FileText className="mr-2 h-4 w-4" />
                  Optimisation des offres
                </Link>
              </Button>
              <Button
                variant={pathname === "/talent-forecast" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/talent-forecast">
                  <LineChart className="mr-2 h-4 w-4" />
                  Prévision des talents
                </Link>
              </Button>
              <Button
                variant={pathname === "/interview-scenarios" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/interview-scenarios">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Scénarios d'entretien
                </Link>
              </Button>
              <Button
                variant={pathname === "/performance-prediction" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/performance-prediction">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Prédiction de performance
                </Link>
              </Button>
              <Button
                variant={pathname === "/candidate-sourcing" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/candidate-sourcing">
                  <Search className="mr-2 h-4 w-4" />
                  Sourcing automatisé
                </Link>
              </Button>
              <Button
                variant={pathname === "/voice-analysis" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/voice-analysis">
                  <Mic className="mr-2 h-4 w-4" />
                  Analyse vocale
                </Link>
              </Button>
              <Button
                variant={pathname === "/code-evaluation" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/code-evaluation">
                  <Code className="mr-2 h-4 w-4" />
                  Évaluation de code
                </Link>
              </Button>
              <Button
                variant={pathname === "/personalization" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/personalization">
                  <UserCog className="mr-2 h-4 w-4" />
                  Personnalisation
                </Link>
              </Button>
              <Button
                variant={pathname === "/anomaly-detection" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/anomaly-detection">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Détection d'anomalies
                </Link>
              </Button>
              <Button
                variant={pathname === "/cost-prediction" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/cost-prediction">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Prédiction des coûts
                </Link>
              </Button>
              <Button
                variant={pathname === "/multilingual" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/multilingual">
                  <Globe className="mr-2 h-4 w-4" />
                  Matching multilingue
                </Link>
              </Button>
            </div>
          </ScrollArea>
        </div>
        <div className="px-4 py-2">
          <Button variant={pathname === "/settings" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
