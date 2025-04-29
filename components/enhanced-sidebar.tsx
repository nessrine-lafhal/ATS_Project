"use client"

import type React from "react"

import { useState } from "react"
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
  ChevronRight,
  ChevronLeft,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onToggle?: () => void
}

export default function EnhancedSidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const mainNavItems = [
    { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/candidates", label: "Candidats", icon: Users },
    { href: "/jobs", label: "Postes", icon: Briefcase },
    { href: "/talent-forecast", label: "Prévision des talents", icon: TrendingUp },
  ]

  const aiFeatures = [
    { href: "/resume-analysis", label: "Analyse de CV", icon: Brain, category: "analysis" },
    { href: "/matching", label: "Matching contextuel", icon: Briefcase, category: "matching" },
    { href: "/ranking", label: "Classement prédictif", icon: BarChart4, category: "analysis" },
    { href: "/chatbot", label: "Chatbot de présélection", icon: MessageSquare, category: "interview" },
    { href: "/video-analysis", label: "Analyse vidéo", icon: Video, category: "interview" },
    { href: "/bias-detection", label: "Détection des biais", icon: Scale, category: "diversity" },
    { href: "/attrition", label: "Prévision d'attrition", icon: TrendingUp, category: "prediction" },
    { href: "/skill-gap", label: "Analyse des compétences", icon: Lightbulb, category: "analysis" },
    { href: "/job-optimization", label: "Optimisation des offres", icon: FileText, category: "optimization" },
    { href: "/talent-forecast", label: "Prévision des talents", icon: LineChart, category: "prediction" },
    { href: "/interview-scenarios", label: "Scénarios d'entretien", icon: MessageSquare, category: "interview" },
    { href: "/performance-prediction", label: "Prédiction de performance", icon: BarChart4, category: "prediction" },
    { href: "/candidate-sourcing", label: "Sourcing automatisé", icon: Search, category: "sourcing" },
    { href: "/voice-analysis", label: "Analyse vocale", icon: Mic, category: "interview" },
    { href: "/code-evaluation", label: "Évaluation de code", icon: Code, category: "evaluation" },
    { href: "/personalization", label: "Personnalisation", icon: UserCog, category: "optimization" },
    { href: "/anomaly-detection", label: "Détection d'anomalies", icon: AlertTriangle, category: "analysis" },
    { href: "/cost-prediction", label: "Prédiction des coûts", icon: DollarSign, category: "prediction" },
    { href: "/multilingual", label: "Matching multilingue", icon: Globe, category: "matching" },
    { href: "/dashboard", label: "Tableau de bord analytique", icon: BarChart4, category: "analysis" },
    { href: "/job-optimizer", label: "Optimisation des offres d'emploi", icon: Wand2, category: "optimization" },
    { href: "/interview-generator", label: "Scénarios d'entretien", icon: MessageSquare, category: "interview" },
  ]

  const categories = [
    { id: "analysis", label: "Analyse" },
    { id: "matching", label: "Matching" },
    { id: "interview", label: "Entretien" },
    { id: "prediction", label: "Prédiction" },
    { id: "optimization", label: "Optimisation" },
    { id: "diversity", label: "Diversité" },
    { id: "sourcing", label: "Sourcing" },
    { id: "evaluation", label: "Évaluation" },
  ]

  const getCategoryItems = (categoryId: string) => {
    return aiFeatures.filter((item) => item.category === categoryId)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64",
        className,
      )}
    >
      <div className="flex h-14 items-center px-3 border-b">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-semibold text-lg tracking-tight"
          >
            NextGen ATS
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("justify-start", collapsed && "justify-center px-2")}
                asChild
              >
                <Link href={item.href}>
                  <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="mt-4">
          {!collapsed && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Fonctionnalités IA</h2>}

          <div className="grid gap-1 px-2">
            {categories.map((category) => {
              const items = getCategoryItems(category.id)
              const hasActiveItem = items.some((item) => pathname === item.href)

              return (
                <div key={category.id} className="relative">
                  {!collapsed ? (
                    <div
                      className={cn(
                        "mb-1 mt-2 px-2 text-xs font-medium text-muted-foreground",
                        hasActiveItem && "text-foreground",
                      )}
                    >
                      {category.label}
                    </div>
                  ) : (
                    <div
                      className="mb-1 mt-2 flex justify-center"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div className="h-1 w-4 rounded-full bg-muted-foreground/50" />

                      {hoveredCategory === category.id && (
                        <div className="absolute left-full ml-2 z-50 p-2 rounded-md bg-popover text-popover-foreground shadow-md text-xs whitespace-nowrap">
                          {category.label}
                        </div>
                      )}
                    </div>
                  )}

                  {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn("justify-start", collapsed && "justify-center px-2")}
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
                          {!collapsed && <span>{item.label}</span>}

                          {collapsed && (
                            <div
                              className="absolute left-full ml-2 z-50 p-2 rounded-md bg-popover text-popover-foreground shadow-md hidden group-hover:block whitespace-nowrap"
                              style={{ display: "none" }}
                            >
                              {item.label}
                            </div>
                          )}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-2">
        <Button
          variant={pathname === "/settings" ? "secondary" : "ghost"}
          className={cn("w-full justify-start", collapsed && "justify-center px-2")}
          asChild
        >
          <Link href="/settings">
            <Settings className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-2")} />
            {!collapsed && <span>Paramètres</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}
