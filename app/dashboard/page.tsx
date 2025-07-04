"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import Link from "next/link";
import { ShowDevotional } from "@/components/ui/show-devotional";

interface Devotional {
  id: number;
  date: string;
  title?: string;
  reflection?: string;
  prayer?: string;
  practicalApplication?: string;
  supportingVerses?: string;
  bibleVerse?: {
    id: number;
    reference: string;
    text: string;
  };
}

// Formata a data como yyyy-MM-dd (para evitar problemas de fuso)
const formatToDateKey = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export default function DashboardPage() {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin } = useAuth(); // Assuming `isAdmin` is added to the auth context
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await api.get("/devotionals/dates");
        const dates = response.data.data
          .map((dateStr: string) => {
            const parsedDate = new Date(dateStr);
            return isValid(parsedDate) ? formatToDateKey(parsedDate) : null;
          })
          .filter((d: string | null) => d !== null);
        setAvailableDates(dates as string[]);
      } catch (error) {
        console.error("Erro ao buscar datas disponíveis:", error);
      }
    };

    if (isAuthenticated) {
      fetchAvailableDates();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchDevotional = async () => {
      setIsLoading(true);
      try {
        if (!date || !isValid(date)) return;

        const key = formatToDateKey(date);
        const isAvailable = availableDates.includes(key);

        if (!isAvailable) {
          setDevotional(null);
          return;
        }

        const response = await api.get(`/devotionals/check_date?date=${key}`);
        // Update this line to handle the nested data structure
        setDevotional(response.data.data);
      } catch (error) {
        console.error('Error fetching devotional:', error);
        toast({
          title: "Erro ao carregar devocional",
          description: "Não foi possível carregar o devocional para esta data",
          variant: "destructive",
        });
        setDevotional(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && availableDates.length > 0) {
      fetchDevotional();
    }
  }, [date, isAuthenticated, availableDates]);

  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="gradient-card border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary-300">Calendário</CardTitle>
              <CardDescription className="text-text-200">
                Selecione uma data para ver o devocional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mb-4 border-primary-100"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-accent-100" />
                    {date && isValid(date)
                      ? format(date, "PPP", { locale: ptBR })
                      : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                      }
                    }}
                    locale={ptBR}
                    modifiers={{
                      available: availableDates.map((d) => new Date(d)),
                    }}
                    modifiersClassNames={{
                      available: "font-bold text-[#A68B6E]",
                    }}
                    className="rounded-md border-primary-100"
                    disabled={(day) => {
                      const key = formatToDateKey(day);
                      return !availableDates.includes(key);
                    }}
                  />
                </PopoverContent>
              </Popover>

              <div className="text-sm text-text-200 mt-4">
                <p>
                  Datas em <strong className="text-accent-100">destaque</strong>{" "}
                  possuem devocionais disponíveis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="h-full gradient-card border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary-300">
                {isLoading
                  ? "Carregando..."
                  : devotional
                    ? devotional.title
                    : "Nenhum devocional disponível"}
              </CardTitle>
              <CardDescription className="text-text-200">
                {devotional?.date && isValid(new Date(devotional.date))
                  ? format(new Date(devotional.date), "PPP", {
                    locale: ptBR,
                  })
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-accent-100" />
                </div>
              ) : devotional ? (
                <ShowDevotional {...devotional} />
              ) : (
                <div className="flex justify-center items-center h-64 text-text-200">
                  Nenhum devocional encontrado para a data selecionada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <div className="mt-6">
          <Link href="/admin">
            <Button variant="default" className="w-full md:w-auto">
              Ir para a página de administração
            </Button>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
