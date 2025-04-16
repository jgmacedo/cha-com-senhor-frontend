"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

// Atualizar o tipo BibleVerse para corresponder à entidade do backend
interface BibleVerse {
  id: number
  reference: string
  text: string
}

export function CreateBibleVerseForm() {
  const [reference, setReference] = useState("")
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post("/admin/create_bible_verse", {
        reference,
        text,
      })

      toast({
        title: "Versículo criado",
        description: "O versículo foi criado com sucesso",
      })

      // Limpar o formulário
      setReference("")
      setText("")
    } catch (error) {
      toast({
        title: "Erro ao criar versículo",
        description: "Não foi possível criar o versículo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reference">Referência</Label>
        <Input
          id="reference"
          placeholder="Ex: João 3:16"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          placeholder="Digite o texto do versículo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
        />
      </div>

      <Button type="submit" className="bg-amber-700 hover:bg-amber-800" disabled={isLoading}>
        {isLoading ? "Criando..." : "Criar Versículo"}
      </Button>
    </form>
  )
}
