"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"

interface BibleVerse {
  id: number
  reference: string
  text: string
}

interface ApiResponseDTO<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

interface DevotionalCreatorDTO {
  id: number;
  title: string;
  reflection: string;
  prayer: string;
  practicalApplication: string;
  supportingVerses: string;
  date: string;
  bibleVerse: BibleVerse;
}

export function CreateDevotionalForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { isAdmin } = useAuth()
  const [title, setTitle] = useState("")
  const [reflection, setReflection] = useState("")
  const [prayer, setPrayer] = useState("")
  const [practicalApplication, setPracticalApplication] = useState("")
  const [supportingVerses, setSupportingVerses] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedVerseId, setSelectedVerseId] = useState("")
  const [verses, setVerses] = useState<BibleVerse[]>([])
  const [isLoadingVerses, setIsLoadingVerses] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchVerses()
  }, [])

  const fetchVerses = async () => {
    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você precisa ser um administrador para acessar esta função",
        variant: "destructive",
      })
      return
    }

    setIsLoadingVerses(true)
    try {
      const response = await api.get<ApiResponseDTO<BibleVerse[]>>("/admin/get_all_bible_verses")

      if (!response.data) {
        throw new Error("No response received from API")
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch verses")
      }

      if (!response.data.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid data format received from API")
      }

      setVerses(response.data.data);
    } catch (error) {
      console.error("Error fetching verses:", error);
      toast({
        title: "Erro ao carregar versículos",
        description: error instanceof Error
          ? error.message
          : "Não foi possível carregar a lista de versículos",
        variant: "destructive",
      });
      setVerses([]);
    } finally {
      setIsLoadingVerses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      toast({
        title: "Acesso negado",
        description: "Você precisa ser um administrador para criar devocionais",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVerseId || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione um versículo e uma data",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = date.toISOString().split('T')[0];

      // Ensure JWT is included explicitly
      const token = localStorage.getItem('token');
      // Call new endpoint with path variables for verseId and date
      // Send no body and clear default Content-Type, include only Authorization
      const response = await api.post<ApiResponseDTO<DevotionalCreatorDTO>>(
        `/admin/create_devotional/${selectedVerseId}/${formattedDate}`,
        null,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': undefined,
          },
        }
      );

      console.debug('Response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Falha ao criar devocional. tente novamente.");
      }

      toast({
        title: "Sucesso",
        description: "Devocional criado com sucesso.",
      });

      // Reset form
      setSelectedVerseId("");
      setDate(new Date());

      if (onSubmit && response.data.data) {
        onSubmit(response.data.data);
      }

    } catch (error: any) {
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);

      const errorMessage = error.response?.data?.message
        || error.message
        || "Não foi possível criar o devocional";

      toast({
        title: "Erro ao criar devocional",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-text-100">
          Data
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal border-primary-100", !date && "text-text-200")}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-accent-100" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border-primary-100"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verse" className="text-text-100">
          Versículo
        </Label>
        {isLoadingVerses ? (
          <div className="flex items-center gap-2 h-10 px-3 py-2 border border-primary-100 rounded-md">
            <Loader2 className="h-4 w-4 animate-spin text-accent-100" />
            <span className="text-text-200">Carregando versículos...</span>
          </div>
        ) : (
          <Select value={selectedVerseId} onValueChange={setSelectedVerseId}>
            <SelectTrigger id="verse" className="border-primary-100">
              <SelectValue placeholder="Selecione um versículo" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(verses) && verses.length > 0 ? (
                verses.map((verse) => (
                  <SelectItem key={verse.id} value={verse.id.toString()}>
                    {verse.reference}
                  </SelectItem>
                ))
              ) : (
                <p className="text-text-200">Nenhum versículo disponível</p>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      <Button
        type="submit"
        className="gradient-accent shadow-md hover:shadow-lg transition-shadow"
        disabled={isSubmitting || isLoadingVerses}
      >
        {isSubmitting ? "Criando..." : "Criar Devocional"}
      </Button>
    </form>
  )
}
