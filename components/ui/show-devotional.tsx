import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "./separator";

interface BibleVerse {
    id: number;
    reference: string;
    text: string;
}

interface DevotionalProps {
    title?: string;
    date: string;
    reflection?: string;
    prayer?: string;
    practicalApplication?: string;
    supportingVerses?: string;
    bibleVerse?: BibleVerse;
}

export function ShowDevotional({
    title,
    date,
    reflection,
    prayer,
    practicalApplication,
    supportingVerses,
    bibleVerse,
}: DevotionalProps) {
    console.log('ShowDevotional received props:', {
        title,
        date,
        reflection,
        prayer,
        practicalApplication,
        supportingVerses,
        bibleVerse
    });
    
    return (
        <div className="space-y-6">
            {bibleVerse && (
                <div className="bg-bg-100/50 p-6 rounded-md border border-primary-100 shadow-inner-soft">
                    <p className="font-semibold text-primary-300 text-lg">
                        {bibleVerse.reference}
                    </p>
                    <p className="italic mt-3 text-text-100 leading-relaxed">
                        {bibleVerse.text}
                    </p>
                </div>
            )}

            <Separator className="bg-primary-100" />

            <div className="prose max-w-none space-y-8">
                {reflection && (
                    <section>
                        <h3 className="text-xl font-semibold text-primary-300">Reflexão</h3>
                        <div
                            className="text-text-100 leading-relaxed mt-3"
                            dangerouslySetInnerHTML={{
                                __html: reflection,
                            }}
                        />
                    </section>
                )}

                {prayer && (
                    <section>
                        <h3 className="text-xl font-semibold text-primary-300">Oração</h3>
                        <div
                            className="text-text-100 leading-relaxed mt-3"
                            dangerouslySetInnerHTML={{
                                __html: prayer,
                            }}
                        />
                    </section>
                )}

                {practicalApplication && (
                    <section>
                        <h3 className="text-xl font-semibold text-primary-300">
                            Aplicação Prática
                        </h3>
                        <div
                            className="text-text-100 leading-relaxed mt-3"
                            dangerouslySetInnerHTML={{
                                __html: practicalApplication,
                            }}
                        />
                    </section>
                )}

                {supportingVerses && (
                    <section>
                        <h3 className="text-xl font-semibold text-primary-300">
                            Versículos de Apoio
                        </h3>
                        <div
                            className="text-text-100 leading-relaxed mt-3"
                            dangerouslySetInnerHTML={{
                                __html: supportingVerses,
                            }}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}