"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Maximize, Minimize } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ARSceneProps {
  children: React.ReactNode
  width?: string
  height?: string
}

export function ARScene({ children, width = "100%", height = "600px" }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Dynamically import AR.js script
    const script = document.createElement("script")
    script.src = "https://aframe.io/releases/1.3.0/aframe.min.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const arScript = document.createElement("script")
      arScript.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
      arScript.async = true
      document.body.appendChild(arScript)

      arScript.onload = () => {
        setIsLoading(false)
      }
    }

    return () => {
      // Clean up scripts when component unmounts
      const scripts = document.querySelectorAll("script")
      scripts.forEach((script) => {
        if (script.src.includes("aframe.min.js") || script.src.includes("aframe-ar.js")) {
          document.body.removeChild(script)
        }
      })
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        toast({
          title: "Erreur",
          description: `Impossible de passer en plein écran: ${err.message}`,
          variant: "destructive",
        })
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const takeScreenshot = () => {
    const scene = document.querySelector("a-scene")
    if (scene) {
      const screenshot = scene.components.screenshot.getCanvas("perspective")
      const link = document.createElement("a")
      link.href = screenshot.toDataURL("image/png")
      link.download = `ar-dashboard-${new Date().toISOString()}.png`
      link.click()

      toast({
        title: "Capture d'écran",
        description: "La capture d'écran a été téléchargée",
      })
    }
  }

  const refreshScene = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative" ref={containerRef} style={{ width, height }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Chargement de la réalité augmentée...</p>
              </div>
            </div>
          ) : null}

          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button variant="secondary" size="icon" onClick={takeScreenshot} title="Prendre une capture d'écran">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={refreshScene} title="Rafraîchir la scène">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>

          {!isLoading && (
            <a-scene
              embedded
              arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
              renderer="logarithmicDepthBuffer: true;"
              vr-mode-ui="enabled: false"
            >
              {children}
              <a-entity camera></a-entity>
            </a-scene>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
