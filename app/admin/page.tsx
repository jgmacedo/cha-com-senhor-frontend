"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BibleVersesList } from "@/components/admin/bible-verses-list";
import { DevotionalsList } from "@/components/admin/devotionals-list";
import { CreateBibleVerseForm } from "@/components/admin/create-bible-verse-form";
import { CreateDevotionalForm } from "@/components/admin/create-devotional-form";

export function UsersTable({ users }: { users?: User[] }) {
  if (!users || users.length === 0) {
    return <p>Nenhum usuário encontrado.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Função</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function BibleVersesList({ verses }: { verses?: Verse[] }) {
  if (!verses || verses.length === 0) {
    return <p>Nenhum versículo encontrado.</p>;
  }

  return (
    <ul>
      {verses.map((verse) => (
        <li key={verse.id}>
          {verse.text} - {verse.reference}
        </li>
      ))}
    </ul>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (isLoading) return; // Wait for loading to complete

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!user?.roles.includes("ROLE_ADMIN")) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router, toast, user]);

  if (isLoading || !isAuthenticated || !user?.roles.includes("ROLE_ADMIN")) {
    return null;
  }

  return (
    <DashboardLayout>
      <Card className="gradient-card border-none shadow-soft">
        <CardHeader>
          <CardTitle className="text-primary-300">
            Painel Administrativo
          </CardTitle>
          <CardDescription className="text-text-200">
            Gerencie usuários, versículos bíblicos e devocionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 bg-bg-200">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-accent-100 data-[state=active]:text-white"
              >
                Usuários
              </TabsTrigger>
              <TabsTrigger
                value="verses"
                className="data-[state=active]:bg-accent-100 data-[state=active]:text-white"
              >
                Versículos
              </TabsTrigger>
              <TabsTrigger
                value="devotionals"
                className="data-[state=active]:bg-accent-100 data-[state=active]:text-white"
              >
                Devocionais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <UsersTable />
            </TabsContent>

            <TabsContent value="verses" className="space-y-8">
              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">
                    Adicionar Novo Versículo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateBibleVerseForm />
                </CardContent>
              </Card>

              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">
                    Versículos Cadastrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BibleVersesList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devotionals" className="space-y-8">
              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">
                    Criar Novo Devocional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateDevotionalForm />
                </CardContent>
              </Card>

              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">
                    Devocionais Cadastrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DevotionalsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
