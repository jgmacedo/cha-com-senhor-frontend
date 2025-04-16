"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Atualizar a interface Devotional para corresponder à entidade do backend
interface Devotional {
  id: number
  date: string
  title: string
  reflection: string
  prayer: string
  practicalApplication: string
  supportingVerses: string
  bibleVerse: {
    id: number
    reference: string
  }
}

export function DevotionalsList() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [devotionalToDelete, setDevotionalToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDevotionals()
  }, [])

  const fetchDevotionals = async () => {
    setIsLoading(true)
    try {
      // Normalmente teríamos um endpoint para listar todos os devocionais
      // Como não temos, vamos simular com o endpoint de datas disponíveis
      const datesResponse = await api.get("/devotionals/dates")
      const dates = datesResponse.data

      // Para cada data, buscamos o devocional
      const devotionalsPromises = dates.map(async (date: string) => {
        const response = await api.get(`/devotionals/check_date?date=${date}`)
        return response.data
      })

      const devotionalsData = await Promise.all(devotionalsPromises)
      setDevotionals(devotionalsData)
    } catch (error) {
      toast({
        title: "Erro ao carregar devocionais",
        description: "Não foi possível carregar a lista de devocionais",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDevotional = async () => {
    if (!devotionalToDelete) return

    try {
      await api.delete(`/admin/delete_devotional/${devotionalToDelete}`)
      setDevotionals(devotionals.filter((dev) => dev.id !== devotionalToDelete))
      toast({
        title: "Devocional excluído",
        description: "O devocional foi excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir devocional",
        description: "Não foi possível excluir o devocional",
        variant: "destructive",
      })
    } finally {
      setDevotionalToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-700" />
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Versículo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devotionals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Nenhum devocional encontrado
              </TableCell>
            </TableRow>
          ) : (
            devotionals.map((devotional) => (
              <TableRow key={devotional.id}>
                <TableCell>{format(new Date(devotional.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell className="font-medium">{devotional.title}</TableCell>
                <TableCell>{devotional.bibleVerse.reference}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setDevotionalToDelete(String(devotional.id))}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir devocional</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o devocional de{" "}
                          {format(new Date(devotional.date), "dd/MM/yyyy", { locale: ptBR })}? Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDevotional} className="bg-red-500 hover:bg-red-600">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
