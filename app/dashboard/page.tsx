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
        const dates = response.data
          .map((dateStr: string) => {
            const date = new Date(dateStr);
            return isValid(date) ? date : null;
          })
          .filter((date: Date | null): date is Date => date !== null);
        setAvailableDates(dates);
      } catch (error) {
        toast({
          title: "Erro ao carregar datas",
          description: "Não foi possível carregar as datas disponíveis",
          variant: "destructive",
        });
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
        if (!date || !isValid(date)) {
          throw new Error("Data inválida");
        }

        const formattedDate = format(date, "yyyy-MM-dd");
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

    if (isAuthenticated) {
      fetchDevotional();
    }
  }, [date, isAuthenticated]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

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
                    onSelect={(newDate) => setDate(newDate || undefined)} // Add explicit undefined handling
                    locale={ptBR}
                    modifiers={{
                      available: availableDates,
                    }}
                    modifiersStyles={{
                      available: {
                        fontWeight: "bold",
                        color: "#A68B6E",
                      },
                    }}
                    className="rounded-md border-primary-100"
                    disabled={(date) =>
                      !availableDates.some(
                        (availableDate) =>
                          availableDate.getDate() === date.getDate() &&
                          availableDate.getMonth() === date.getMonth() &&
                          availableDate.getFullYear() === date.getFullYear()
                      )
                    }
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
                {devotional &&
                devotional.date &&
                isValid(new Date(devotional.date))
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
