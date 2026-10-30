import { useRef } from "react";
import type { Question } from "@/lib/api";

interface AnswersProps {
  question: Question;
  chosen: string | null;
  onChoose: (letter: string) => void;
}

function stateOf(letter: string, chosen: string | null, correct: string) {
  if (!chosen) return "open";
  if (letter === correct) return "correct";
  return letter === chosen ? "miss" : "other";
}

export function Answers({ question, chosen, onChoose }: AnswersProps) {
  const isCorrect = chosen === question.correct_answer;
  const statusRef = useRef<HTMLDivElement>(null);
  const choose = (letter: string) => {
    onChoose(letter);
    requestAnimationFrame(() => statusRef.current?.scrollIntoView({ block: "nearest" }));
  };
  return (
    <>
      <div className="answer-list" role="group" aria-label="Alternativas">
        {question.alternatives.map((alt) => {
          const state = stateOf(alt.letter, chosen, question.correct_answer);
          return (
            <button
              key={alt.letter}
              type="button"
              className="answer"
              data-state={state}
              data-chosen={alt.letter === chosen}
              disabled={chosen !== null}
              onClick={() => choose(alt.letter)}
            >
              <span className="answer-letter">{alt.letter}</span>
              <span>{alt.text}</span>
              {state === "correct" && <span aria-label="resposta certa">✓</span>}
              {state === "miss" && <span aria-label="sua resposta, não é esta">✕</span>}
            </button>
          );
        })}
      </div>
      <div role="status">
        {chosen && (
          <div ref={statusRef} className="answer-note" data-result={isCorrect ? "correct" : "miss"}>
            <strong>
              {isCorrect ? "Isso mesmo!" : `Quase! A resposta é a letra ${question.correct_answer}.`}
            </strong>
            {question.explanation}
          </div>
        )}
      </div>
    </>
  );
}
