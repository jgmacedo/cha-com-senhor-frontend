"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Coffee } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login: loginUser, isAdmin, isAuthenticated, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginUser(login, password);

      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado",
      });

      // Use user.roles directly to avoid race conditions
      if (user?.roles.includes("ROLE_ADMIN")) {
        console.log("Redirecting to /admin");
        router.push("/admin");
      } else {
        console.log("Redirecting to /dashboard");
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 relative transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md gradient-card border-none card-shadow transition-all duration-300">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full gradient-primary shadow-md">
              <Coffee className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-primary-300 transition-colors duration-300">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-text-200 transition-colors duration-300">
            Entre na sua conta para acessar os devocionais
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-text-100 transition-colors duration-300">
                Nome de usuário
              </Label>
              <Input
                id="login"
                placeholder="Usuário"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100 transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-text-100 transition-colors duration-300">
                  Senha
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-accent-100 hover:text-accent-200 hover:underline transition-colors duration-300"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100 transition-colors duration-300"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full gradient-accent shadow-md hover:shadow-lg transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-center text-text-200 transition-colors duration-300">
              Não tem uma conta?{" "}
              <Link
                href="/auth/register"
                className="text-accent-100 hover:text-accent-200 hover:underline transition-colors duration-300"
              >
                Registre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}