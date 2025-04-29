"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"
import EnhancedSidebar from "@/components/enhanced-sidebar"
import Header from "@/components/header"
import { useMediaQuery } from "@/hooks/use-media-query"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Set initial state based on screen size
  useEffect(() => {
    setSidebarCollapsed(!isDesktop)
  }, [isDesktop])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <EnhancedSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
