"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Adiciona uma classe temporária para a animação
    document.documentElement.classList.add("theme-transition")
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 500)
  }

  if (!mounted) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-primary-100/20 relative overflow-hidden border-primary-100 dark:border-primary-200"
            aria-label={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
          >
            <Sun
              className={`h-[1.2rem] w-[1.2rem] text-accent-100 absolute transition-all duration-300 ${
                theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <Moon
              className={`h-[1.2rem] w-[1.2rem] text-accent-100 absolute transition-all duration-300 ${
                theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
              }`}
            />
            <span className="sr-only">Alternar para modo {theme === "dark" ? "claro" : "escuro"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground border-border">
          <p>Alternar para modo {theme === "dark" ? "claro" : "escuro"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ThemeToggleWithLabel() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Adiciona uma classe temporária para a animação
    document.documentElement.classList.add("theme-transition")
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 500)
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors w-full justify-start"
      aria-label={`Alternar para modo ${theme === "dark" ? "claro" : "escuro"}`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
      <span className="transition-opacity duration-200">Modo {theme === "dark" ? "Claro" : "Escuro"}</span>
    </Button>
  )
}
