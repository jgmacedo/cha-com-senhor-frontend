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

export function DevotionalsList({ devotionals }: { devotionals: Array<{ id: number; title: string; date: string }> }) {
  if (!devotionals || devotionals.length === 0) {
    return <p>Nenhum devocional encontrado.</p>;
  }

  return (
    <ul>
      {devotionals.map((devotional) => (
        <li key={devotional.id}>
          {devotional.date}: {devotional.title}
        </li>
      ))}
    </ul>
  );
}
