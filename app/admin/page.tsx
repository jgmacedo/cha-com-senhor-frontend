"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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
import { UsersTable } from "@/components/admin/users-table";
import { BibleVersesList } from "@/components/admin/bible-verses-list";
import { DevotionalsList } from "@/components/admin/devotionals-list";
import { CreateBibleVerseForm } from "@/components/admin/create-bible-verse-form";
import { CreateDevotionalForm } from "@/components/admin/create-devotional-form";
import { User } from "@/components/admin/users-table";
import { BibleVerse } from "@/components/admin/bible-verses-list";
import { Devotional } from "@/components/admin/devotionals-list";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [bibleVerses, setBibleVerses] = useState<BibleVerse[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

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

        console.log("Bible Verses:", versesResponse.data.data);
        console.log("Devotionals:", devotionalsResponse.data.data);

        setUsers(usersResponse.data.data);
        setBibleVerses(versesResponse.data.data);
        setDevotionals(devotionalsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
          <CardTitle className="text-primary-300">Painel Administrativo</CardTitle>
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
              <UsersTable
                users={users}
                onDelete={(id: string) => {
                  setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                  toast({
                    title: "Usuário removido",
                    description: `O usuário com ID ${id} foi removido com sucesso.`,
                    variant: "default",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="verses" className="space-y-8">
              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">Adicionar Novo Versículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateBibleVerseForm />
                </CardContent>
              </Card>

              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">Versículos Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <BibleVersesList
                    verses={bibleVerses}
                    onDelete={async (id: number) => {
                      try {
                        await api.delete(`/admin/delete_bible_verse/${id}`);
                        setBibleVerses(bibleVerses.filter((verse) => verse.id !== id));
                        toast({
                          title: "Versículo excluído",
                          description: "O versículo foi excluído com sucesso",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro ao excluir versículo",
                          description: "Não foi possível excluir o versículo",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devotionals" className="space-y-8">
              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">Criar Novo Devocional</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateDevotionalForm />
                </CardContent>
              </Card>

              <Card className="gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="text-primary-300">Devocionais Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <DevotionalsList
                    devotionals={devotionals}
                    onDelete={async (id) => {
                      try {
                        await api.delete(`/admin/delete_devotional/${id}`);
                        setDevotionals(devotionals.filter((devotional) => devotional.id !== id));
                        toast({
                          title: "Devocional excluído",
                          description: "O devocional foi excluído com sucesso",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro ao excluir devocional",
                          description: "Não foi possível excluir o devocional",
                          variant: "destructive",
                        });
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
