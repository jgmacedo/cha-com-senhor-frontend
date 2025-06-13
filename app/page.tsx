"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Coffee, Users } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen gradient-bg transition-colors duration-300">
      <header className="container mx-auto py-6 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Coffee className="h-8 w-8 text-accent-200 transition-colors duration-300" />
        </div>
        <div className="flex items-center gap-6">
          {mounted && <ThemeToggle />}
          <Button
            variant="ghost"
            asChild
            className="text-primary-300 hover:text-accent-200 transition-colors duration-300"
          >
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button
            asChild
            className="gradient-accent shadow-md hover:shadow-lg transition-all duration-300 ml-2"
          >
            <Link href="/auth/register">Registrar</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-300 mb-4 transition-colors duration-300">
            Momentos diários com a Palavra
          </h2>
          <p className="text-lg text-text-100 mb-8 transition-colors duration-300">
            Comece seu dia com uma xícara de chá e uma reflexão espiritual que
            alimenta a alma.
          </p>
          <Button
            size="lg"
            className="gradient-accent shadow-md hover:shadow-lg transition-all duration-300"
            asChild
          >
            <Link href="/auth/register">Comece Agora</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="gradient-card border-none shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-accent-100 mb-2 transition-colors duration-300" />
              <CardTitle className="text-primary-300 transition-colors duration-300">
                Devocionais Diários
              </CardTitle>
              <CardDescription className="text-text-200 transition-colors duration-300">
                Reflexões baseadas na Bíblia para cada dia do ano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-100 transition-colors duration-300">
                Acesse devocionais cuidadosamente preparados para inspirar sua
                jornada espiritual diária.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-none shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <Coffee className="h-12 w-12 text-accent-100 mb-2 transition-colors duration-300" />
              <CardTitle className="text-primary-300 transition-colors duration-300">
                Momento de Reflexão
              </CardTitle>
              <CardDescription className="text-text-200 transition-colors duration-300">
                Um tempo de qualidade com Deus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-100 transition-colors duration-300">
                Reserve um momento do seu dia para refletir, orar e crescer
                espiritualmente.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-none shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <Users className="h-12 w-12 text-accent-100 mb-2 transition-colors duration-300" />
              <CardTitle className="text-primary-300 transition-colors duration-300">
                Comunidade
              </CardTitle>
              <CardDescription className="text-text-200 transition-colors duration-300">
                Cresça junto com outros fiéis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-100 transition-colors duration-300">
                Faça parte de uma comunidade que busca crescimento espiritual e
                compartilha experiências.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="gradient-header text-white py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Chá Com o Senhor. Todos os direitos
            reservados. João Gabriel Abreu Macedo.
          </p>
        </div>
      </footer>
    </div>
  );
}
