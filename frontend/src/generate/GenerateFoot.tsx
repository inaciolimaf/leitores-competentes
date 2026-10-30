import { useRef } from "react";
import { Folio } from "@/book/Book";
import { Notice } from "@/book/Notice";

interface GenerateFootProps {
  hint: string;
  canGenerate: boolean;
  isLoading: boolean;
  error: string | null;
  onDismissError: () => void;
}

export function GenerateFoot({ hint, canGenerate, isLoading, error, onDismissError }: GenerateFootProps) {
  const submitRef = useRef<HTMLButtonElement>(null);
  const dismiss = () => {
    onDismissError();
    submitRef.current?.focus();
  };

  return (
    <Folio>
      <div className="generate-foot">
        {error && <Notice message={error} actionLabel="Fechar" onAction={dismiss} />}
        <div className="generate-note">
          <p role="status">{isLoading && "Isso pode levar alguns minutos. Deixe esta tela aberta."}</p>
          {!isLoading && (
            <>
              <p id="generate-hint">{hint}</p>
              <a href="#generate-options" className="generate-adjust">
                Ajustar opções
              </a>
            </>
          )}
        </div>
        {/* aria-disabled, not disabled: the button keeps focus while the questions are generated. */}
        <button
          ref={submitRef}
          type="submit"
          className="book-action book-action-solid generate-submit"
          disabled={!canGenerate}
          aria-disabled={isLoading || undefined}
          aria-describedby={isLoading ? undefined : "generate-hint"}
          data-busy={isLoading || undefined}
        >
          {isLoading ? "Gerando questões…" : "Gerar questões"}
        </button>
      </div>
    </Folio>
  );
}
