"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Search, X, Sun, Moon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import EnhancedSidebar from "./enhanced-sidebar"
import { useTheme } from "next-themes"

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <EnhancedSidebar className="w-full border-none" />
        </SheetContent>
      </Sheet>

      {showSearch ? (
        <div className="flex-1 flex items-center">
          <Input
            type="search"
            placeholder="Rechercher..."
            className="flex-1 md:w-[300px] lg:w-[400px] h-9 bg-muted/40"
            autoFocus
          />
          <Button variant="ghost" size="icon" className="ml-2" onClick={() => setShowSearch(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer la recherche</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1" />
          <Button variant="outline" size="icon" className="ml-auto rounded-full" onClick={() => setShowSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Rechercher</span>
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Changer de thème</span>
      </Button>

      <Button variant="outline" size="icon" className="rounded-full relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Déconnexion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
