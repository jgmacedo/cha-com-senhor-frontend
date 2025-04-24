"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api"; // Ensure this is correctly configured
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
import { BibleVersesList as ImportedBibleVersesList } from "@/components/admin/bible-verses-list";
import { DevotionalsList } from "@/components/admin/devotionals-list";
import { CreateBibleVerseForm } from "@/components/admin/create-bible-verse-form";
import { CreateDevotionalForm } from "@/components/admin/create-devotional-form";

type User = {
  id: number;
  name: string;
  email: string;
  role: Array<string>;
};

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

type Verse = {
  id: number;
  text: string;
  reference: string;
};

export function LocalBibleVersesList({ verses }: { verses?: Verse[] }) {
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [bibleVerses, setBibleVerses] = useState([]);
  const [devotionals, setDevotionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for loading to complete

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
  }, [isAuthenticated, authLoading, router, toast, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, versesResponse, devotionalsResponse] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/get_all_bible_verses"),
          api.get("/admin/get_all_devotionals"),
        ]);

        setUsers(usersResponse.data.data);
        setBibleVerses(versesResponse.data.data);
        setDevotionals(devotionalsResponse.data.data);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (authLoading || isLoading || !isAuthenticated || !user?.roles.includes("ROLE_ADMIN")) {
    return <p>Carregando...</p>;
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
              <UsersTable users={users} />
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
                  <ImportedBibleVersesList verses={bibleVerses} />
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
                  <DevotionalsList devotionals={devotionals} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
