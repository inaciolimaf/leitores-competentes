import { useState } from "react";
import { exportPdf } from "@/lib/api";
import type { Question } from "@/lib/api";
import { Book, Folio, Spread } from "@/book/Book";
import { Notice } from "@/book/Notice";
import { ScreenTitle } from "@/book/ScreenTitle";
import { Proof } from "./Proof";

interface SelectScreenProps {
  questions: Question[];
  onGenerateSuccess: (pdfUrl: string) => void;
  onCancel: () => void;
}

// exportPdf throws a plain Error with the API's detail; anything else is an English browser message.
function failureMessage(err: unknown) {
  const fromApi = err instanceof Error && err.name === "Error";
  return fromApi ? err.message : "Não foi possível gerar o PDF.";
}

export function SelectScreen({ questions, onGenerateSuccess, onCancel }: SelectScreenProps) {
  const [keptIds, setKeptIds] = useState(() => questions.map((q) => q.id));
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const allKept = keptIds.length === questions.length;

  const toggle = (id: number) =>
    setKeptIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const generate = async () => {
    if (isExporting || keptIds.length === 0) return;
    setIsExporting(true);
    setError(null);
    try {
      const kept = questions.filter((q) => keptIds.includes(q.id));
      const { url } = await exportPdf({ title: "Simulado de Leitura", questions: kept });
      onGenerateSuccess(url);
    } catch (err) {
      setError(failureMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Book section="Simulado de leitura">
      <Spread
        rightLabel="Questões do simulado"
        right={
          <div className="proof-sheet">
            <ScreenTitle>Escolher questões para imprimir</ScreenTitle>
            <div className="proof-tools">
              <button
                type="button"
                className="book-action book-action-quiet"
                disabled={isExporting}
                onClick={() => setKeptIds(allKept ? [] : questions.map((q) => q.id))}
              >
                {allKept ? "Desmarcar todas" : "Selecionar todas"}
              </button>
            </div>
            <ol className="proof-list" aria-label="Questões">
              {questions.map((q, i) => (
                <Proof
                  key={q.id}
                  question={q}
                  number={i + 1}
                  kept={keptIds.includes(q.id)}
                  disabled={isExporting}
                  onToggle={() => toggle(q.id)}
                />
              ))}
            </ol>
          </div>
        }
      />
      {/* Sticky, so a failure shows up beside the button however far the list has scrolled. */}
      <div className="proof-foot">
        {error && <Notice message={error} actionLabel="Tentar de novo" onAction={generate} />}
        <Folio>
          <button type="button" className="book-action book-action-quiet" disabled={isExporting} onClick={onCancel}>
            Sair
          </button>
          <div role="status" className="proof-count" data-pending={isExporting}>
            {isExporting ? "Gerando PDF…" : `${keptIds.length} de ${questions.length} selecionadas`}
          </div>
          <button
            type="button"
            className="book-action book-action-solid"
            disabled={keptIds.length === 0}
            aria-disabled={isExporting}
            onClick={generate}
          >
            Gerar PDF
          </button>
        </Folio>
      </div>
    </Book>
  );
}
