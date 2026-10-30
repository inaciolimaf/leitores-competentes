import type { Question } from "@/lib/api";
import { QuestionText } from "@/components/QuestionText";

interface ProofProps {
  question: Question;
  number: number;
  kept: boolean;
  disabled: boolean;
  onToggle: () => void;
}

// One page of the proofs. The label stays short: the checkbox is named by the question's number.
export function Proof({ question, number, kept, disabled, onToggle }: ProofProps) {
  const hasReading = Boolean(question.text?.trim() || question.support_image_url);

  return (
    <li className="proof" data-kept={kept}>
      <label className="proof-keep">
        <input type="checkbox" checked={kept} disabled={disabled} onChange={onToggle} />
        <span className="proof-number">Questão {number}</span>
        <span className="proof-descriptor">{question.descriptor}</span>
      </label>
      <div className="proof-body" data-reading={hasReading}>
        {hasReading && (
          <div>
            <QuestionText text={question.text} className="proof-text" />
            {question.support_image_url && (
              <img
                src={question.support_image_url}
                alt={`Imagem de apoio da questão ${number}`}
                className="proof-figure"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        )}
        <div>
          <p className="proof-statement">{question.statement}</p>
          <ul className="proof-answers">
            {question.alternatives.map((alt) => {
              const isCorrect = alt.letter === question.correct_answer;
              return (
                <li key={alt.letter} className="proof-answer" data-correct={isCorrect}>
                  <span className="proof-letter">{alt.letter})</span>
                  <span>{alt.text}</span>
                  {isCorrect && (
                    <span className="proof-right">
                      <span aria-hidden="true">✓ </span>certa
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
