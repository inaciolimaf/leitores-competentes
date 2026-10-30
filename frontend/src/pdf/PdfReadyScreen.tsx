import { Book, Folio, Spread } from "@/book/Book";
import { ScreenTitle } from "@/book/ScreenTitle";

interface PdfReadyScreenProps {
  pdfUrl: string;
  onReset: () => void;
}

export function PdfReadyScreen({ pdfUrl, onReset }: PdfReadyScreenProps) {
  return (
    <Book section="Simulado de leitura">
      <Spread
        rightLabel="Simulado pronto"
        right={
          <div className="pdf-closing">
            <ScreenTitle>Simulado pronto</ScreenTitle>
            <p>O PDF está com as questões escolhidas e pode ser impresso.</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="book-action book-action-solid pdf-link"
            >
              Abrir o PDF
              <span className="sr-only"> (abre em outra aba)</span>
            </a>
          </div>
        }
      />
      <Folio>
        <button type="button" className="book-action book-action-quiet" onClick={onReset}>
          Voltar ao início
        </button>
      </Folio>
    </Book>
  );
}
