"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { CandidateSearchParams } from "@/lib/types"

interface SourcingFormProps {
  onSearch: (params: CandidateSearchParams) => void
  isLoading: boolean
}

export function SourcingForm({ onSearch, isLoading }: SourcingFormProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [maxResults, setMaxResults] = useState(20)
  const [platforms, setPlatforms] = useState({
    linkedin: true,
    github: true,
    stackoverflow: true,
  })

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const enabledPlatforms = Object.entries(platforms)
      .filter(([_, enabled]) => enabled)
      .map(([platform]) => platform)

    onSearch({
      job_description: jobDescription,
      skills,
      location: location || undefined,
      experience_level: experienceLevel || undefined,
      platforms: enabledPlatforms,
      max_results: maxResults,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recherche de candidats</CardTitle>
        <CardDescription>
          Définissez vos critères pour trouver des candidats qualifiés sur différentes plateformes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-description">Description du poste</Label>
            <Textarea
              id="job-description"
              placeholder="Décrivez le poste pour lequel vous recherchez des candidats..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Compétences requises</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="Ajouter une compétence..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={handleAddSkill} variant="outline">
                Ajouter
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Ville, pays..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Niveau d'expérience</Label>
              <Input
                id="experience"
                placeholder="Junior, Senior, 5+ ans..."
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nombre maximum de résultats: {maxResults}</Label>
            <Slider value={[maxResults]} min={5} max={50} step={5} onValueChange={(value) => setMaxResults(value[0])} />
          </div>

          <div className="space-y-2">
            <Label>Plateformes</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkedin"
                  checked={platforms.linkedin}
                  onCheckedChange={(checked) => setPlatforms({ ...platforms, linkedin: checked as boolean })}
                />
                <Label htmlFor="linkedin">LinkedIn</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="github"
                  checked={platforms.github}
                  onCheckedChange={(checked) => setPlatforms({ ...platforms, github: checked as boolean })}
                />
                <Label htmlFor="github">GitHub</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stackoverflow"
                  checked={platforms.stackoverflow}
                  onCheckedChange={(checked) => setPlatforms({ ...platforms, stackoverflow: checked as boolean })}
                />
                <Label htmlFor="stackoverflow">Stack Overflow</Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading || skills.length === 0} className="w-full">
          {isLoading ? "Recherche en cours..." : "Rechercher des candidats"}
        </Button>
      </CardFooter>
    </Card>
  )
}
