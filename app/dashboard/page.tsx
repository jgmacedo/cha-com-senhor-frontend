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

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function DashboardPage() {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await api.get("/devotionals/dates");
        console.log("Resposta do backend:", response.data);

        const dates = response.data.data.map((dateStr: string) => {
          const parsedDate = new Date(dateStr);
          return isValid(parsedDate)
            ? new Date(
                parsedDate.getFullYear(),
                parsedDate.getMonth(),
                parsedDate.getDate()
              )
            : null;
        });

        console.log("Datas normalizadas:", dates);
        setAvailableDates(dates);
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

        const normalized = normalizeDate(date);
        const isAvailable = availableDates.some(
          (d) => d.getTime() === normalized.getTime()
        );

        if (!isAvailable) {
          setDevotional(null);
          return;
        }

        const formattedDate = format(normalized, "yyyy-MM-dd");
        const response = await api.get(
          `/devotionals/check_date?date=${formattedDate}`
        );
        setDevotional(response.data);
      } catch (error) {
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
                        const normalized = normalizeDate(newDate);
                        setDate(normalized);
                      }
                    }}
                    locale={ptBR}
                    modifiers={{
                      available: availableDates,
                    }}
                    modifiersClassNames={{
                      available: "font-bold text-[#A68B6E]",
                    }}
                    className="rounded-md border-primary-100"
                    disabled={(day) => {
                      const dayStr = day.toDateString();
                      return !availableDates.some(
                        (d) => d.toDateString() === dayStr
                      );
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
                <div className="space-y-6">
                  {devotional.bibleVerse && (
                    <div className="bg-bg-100/50 p-4 rounded-md border border-primary-100 shadow-inner-soft">
                      <p className="font-semibold text-primary-300">
                        {devotional.bibleVerse.reference}
                      </p>
                      <p className="italic mt-2 text-text-100">
                        {devotional.bibleVerse.text}
                      </p>
                    </div>
                  )}

                  <Separator className="bg-primary-100" />

                  <div className="prose max-w-none">
                    {devotional.reflection && (
                      <>
                        <h3 className="text-xl font-semibold text-primary-300 mt-6">
                          Reflexão
                        </h3>
                        <div
                          className="text-text-100"
                          dangerouslySetInnerHTML={{
                            __html: devotional.reflection,
                          }}
                        />
                      </>
                    )}

                    {devotional.prayer && (
                      <>
                        <h3 className="text-xl font-semibold text-primary-300 mt-6">
                          Oração
                        </h3>
                        <div
                          className="text-text-100"
                          dangerouslySetInnerHTML={{
                            __html: devotional.prayer,
                          }}
                        />
                      </>
                    )}

                    {devotional.practicalApplication && (
                      <>
                        <h3 className="text-xl font-semibold text-primary-300 mt-6">
                          Aplicação Prática
                        </h3>
                        <div
                          className="text-text-100"
                          dangerouslySetInnerHTML={{
                            __html: devotional.practicalApplication,
                          }}
                        />
                      </>
                    )}

                    {devotional.supportingVerses && (
                      <>
                        <h3 className="text-xl font-semibold text-primary-300 mt-6">
                          Versículos de Apoio
                        </h3>
                        <p className="text-text-100">
                          {devotional.supportingVerses}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-200">
                    Não há devocional disponível para esta data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
