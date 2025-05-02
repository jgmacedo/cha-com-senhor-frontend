"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { register } = useAuth();

  useEffect(() => {
    if (email) {
      const suggestedLogin = email.split("@")[0];
      setLogin(suggestedLogin);
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas são iguais",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Pass the correct arguments to the register function
      await register(name, login, email, password);
      toast({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para o login",
      });
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Verifique seus dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md gradient-card border-none shadow-soft">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full gradient-primary shadow-md">
              <Coffee className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-primary-300">
            Crie sua conta
          </CardTitle>
          <CardDescription className="text-text-200">
            Registre-se para acessar os devocionais diários
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-100">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login" className="text-text-100">
                Nome de usuário
              </Label>
              <Input
                id="login"
                placeholder="seu_usuario"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100"
              />
              <p className="text-xs text-text-200">
                Este será seu nome de usuário para login. Sugerimos usar a parte
                do email antes do @.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-100">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-text-100">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/50 dark:bg-bg-200/30 border-primary-100 focus:border-accent-100"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full gradient-accent shadow-md hover:shadow-lg transition-shadow"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
            <p className="text-sm text-center text-text-200">
              Já tem uma conta?{" "}
              <Link
                href="/auth/login"
                className="text-accent-100 hover:text-accent-200 hover:underline"
              >
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
