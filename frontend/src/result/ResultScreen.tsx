import { Book, Folio, Spread } from "@/book/Book";
import { ScreenTitle } from "@/book/ScreenTitle";
import type { QuizAnswer } from "@/quiz/QuizScreen";
import { countCorrect, scoreByDescriptor, scoreMessage } from "./score";
import type { DescriptorScore } from "./score";

interface ResultScreenProps {
  results: Record<number, QuizAnswer>;
  totalQuestions: number;
  onReset: () => void;
}

export function ResultScreen({ results, totalQuestions, onReset }: ResultScreenProps) {
  const correct = countCorrect(results);

  return (
    <Book section="Última página">
      <Spread
        leftLabel="Seu resultado"
        left={
          <>
            <ScreenTitle>Você leu até o fim!</ScreenTitle>
            <p className="result-score">
              <span className="result-score-label">Você acertou</span>{" "}
              <span className="result-figure">{`${correct} de ${totalQuestions}`}</span>
            </p>
            <p className="result-message">{scoreMessage(correct, totalQuestions)}</p>
          </>
        }
        rightLabel="O que você leu"
        right={<ReadingList scores={scoreByDescriptor(results)} />}
      />
      <Folio>
        <button type="button" className="book-action book-action-solid result-action" onClick={onReset}>
          Voltar ao início
        </button>
      </Folio>
    </Book>
  );
}

function ReadingList({ scores }: { scores: DescriptorScore[] }) {
  return (
    <>
      <h2 className="result-list-title">O que você leu</h2>
      <ul>
        {scores.map(({ code, correct, total }) => (
          <li key={code} className="result-line">
            <span>{`Descritor ${code}`}</span>
            <span className="result-count">{`${correct} de ${total} certas`}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
