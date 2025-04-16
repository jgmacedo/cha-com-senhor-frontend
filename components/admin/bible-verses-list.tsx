"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2 } from "lucide-react"
import { api } from "@/lib/api"
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

// Atualizar a interface BibleVerse para corresponder à entidade do backend
interface BibleVerse {
  id: number
  reference: string
  text: string
}

export function BibleVersesList() {
  const [verses, setVerses] = useState<BibleVerse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [verseToDelete, setVerseToDelete] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchVerses()
  }, [])

  const fetchVerses = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/admin/get_all_bible_verses")
      setVerses(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar versículos",
        description: "Não foi possível carregar a lista de versículos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVerse = async () => {
    if (!verseToDelete) return

    try {
      await api.delete(`/admin/delete_bible_verse/${verseToDelete}`)
      setVerses(verses.filter((verse) => verse.id !== verseToDelete))
      toast({
        title: "Versículo excluído",
        description: "O versículo foi excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir versículo",
        description: "Não foi possível excluir o versículo",
        variant: "destructive",
      })
    } finally {
      setVerseToDelete(null)
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
            <TableHead>Referência</TableHead>
            <TableHead>Texto</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                Nenhum versículo encontrado
              </TableCell>
            </TableRow>
          ) : (
            verses.map((verse) => (
              <TableRow key={verse.id}>
                <TableCell className="font-medium">{verse.reference}</TableCell>
                <TableCell className="max-w-md truncate">{verse.text}</TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setVerseToDelete(verse.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir versículo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o versículo {verse.reference}? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteVerse} className="bg-red-500 hover:bg-red-600">
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
