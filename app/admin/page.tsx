"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersTable } from "@/components/admin/users-table"
import { BibleVersesList } from "@/components/admin/bible-verses-list"
import { DevotionalsList } from "@/components/admin/devotionals-list"
import { CreateBibleVerseForm } from "@/components/admin/create-bible-verse-form"
import { CreateDevotionalForm } from "@/components/admin/create-devotional-form"

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user?.role !== "ADMIN") {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, toast, user])

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
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
              <TabsTrigger value="users" className="data-[state=active]:bg-accent-100 data-[state=active]:text-white">
                Usuários
              </TabsTrigger>
              <TabsTrigger value="verses" className="data-[state=active]:bg-accent-100 data-[state=active]:text-white">
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
                  <BibleVersesList />
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
                  <DevotionalsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
