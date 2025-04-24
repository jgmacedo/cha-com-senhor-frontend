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

export function BibleVersesList({ verses }: { verses: Array<{ id: number; text: string; reference: string }> }) {
  if (!verses || verses.length === 0) {
    return <p>Nenhum versículo encontrado.</p>;
  }

  return (
    <ul>
      {verses.map((verse) => (
        <li key={verse.id}>
          {verse.reference}: {verse.text}
        </li>
      ))}
    </ul>
  );
}
