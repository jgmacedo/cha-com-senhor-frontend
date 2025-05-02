"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
} from "@/components/ui/alert-dialog";

interface Devotional {
  id: number;
  date: string;
  title: string;
  reflection: string;
  prayer: string;
  practicalApplication: string;
  supportingVerses: string;
  bibleVerse: {
    id: number;
    reference: string;
  };
}

export function DevotionalsList({ devotionals, onDelete }: { devotionals: Devotional[]; onDelete: (id: number) => void }) {
  if (!devotionals || devotionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum devocional encontrado.
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Versículo Base</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devotionals.map((devotional) => (
            <TableRow key={devotional.id}>
              <TableCell className="font-medium">{devotional.id}</TableCell>
              <TableCell>{devotional.date}</TableCell>
              <TableCell>{devotional.title}</TableCell>
              <TableCell>{devotional.bibleVerse.reference}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir devocional</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o devocional "{devotional.title}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(devotional.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
