"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Adiciona um listener para detectar mudanças de tema e aplicar animações
  React.useEffect(() => {
    const handleThemeChange = () => {
      document.documentElement.classList.add("theme-transition")
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition")
      }, 500)
    }

    // Verifica se o tema está armazenado no localStorage
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme) {
      document.documentElement.classList.add(storedTheme)
    }

    // Adiciona um listener para o evento de mudança de tema
    window.addEventListener("themeChange", handleThemeChange)

    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  return (
    <NextThemesProvider {...props} storageKey="theme" enableColorScheme enableSystem disableTransitionOnChange={false}>
      {children}
    </NextThemesProvider>
  )
}
