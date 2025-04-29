"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface ARMarkerProps {
  markerId: string
  children: React.ReactNode
  type?: "pattern" | "barcode" | "custom"
  value?: string
  size?: number
}

export function ARMarker({ markerId, children, type = "pattern", value, size = 1 }: ARMarkerProps) {
  const markerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Add any marker-specific initialization here
    return () => {
      // Cleanup
    }
  }, [markerId])

  const getMarkerAttribute = () => {
    switch (type) {
      case "pattern":
        return `type: pattern; url: /ar-markers/${value || markerId}.patt;`
      case "barcode":
        return `type: barcode; value: ${value || markerId};`
      case "custom":
        return value || ""
      default:
        return `type: pattern; url: /ar-markers/${markerId}.patt;`
    }
  }

  return (
    <a-marker
      ref={markerRef}
      id={`marker-${markerId}`}
      preset={type === "custom" ? undefined : type}
      markerhandler=""
      emitevents="true"
      cursor="rayOrigin: mouse"
      raycaster="objects: .clickable"
      {...(type === "custom" ? { [type]: value } : {})}
      {...(type !== "custom" ? { [type]: getMarkerAttribute() } : {})}
    >
      <a-entity position="0 0 0" rotation="-90 0 0" scale={`${size} ${size} ${size}`}>
        {children}
      </a-entity>
    </a-marker>
  )
}
