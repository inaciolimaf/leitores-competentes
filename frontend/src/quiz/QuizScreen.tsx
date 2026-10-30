import type { Question } from "@/lib/api";
import { Book, Folio, Spread } from "@/book/Book";
import { ScreenTitle } from "@/book/ScreenTitle";
import { QuestionText } from "@/components/QuestionText";
import { Answers } from "./Answers";

export type QuizAnswer = { selected: string; correct: boolean; descriptor: string };

interface QuizScreenProps {
  questions: Question[];
  index: number;
  answers: Record<number, QuizAnswer>;
  onAnswer: (questionId: number, letter: string, correct: boolean) => void;
  onGoTo: (index: number) => void;
  onFinish: () => void;
}

export function QuizScreen({ questions, index, answers, onAnswer, onGoTo, onFinish }: QuizScreenProps) {
  const question = questions[index];
  const answer = answers[question.id];
  const isLast = index === questions.length - 1;
  const hasReading = Boolean(question.text?.trim() || question.support_image_url);

  return (
    <Book section={`Descritor ${question.descriptor}`} sectionDetail={question.descriptor_description}>
      <Spread
        pageKey={question.id}
        left={hasReading ? <Reading question={question} /> : undefined}
        leftLabel="Texto para leitura"
        rightLabel="Pergunta"
        right={
          <>
            <ScreenTitle>{`Questão ${index + 1} de ${questions.length}`}</ScreenTitle>
            <p className="question-statement">{question.statement}</p>
            <Answers
              question={question}
              chosen={answer?.selected ?? null}
              onChoose={(letter) => onAnswer(question.id, letter, letter === question.correct_answer)}
            />
          </>
        }
      />
      <Folio>
        <button
          type="button"
          className="book-action book-action-quiet"
          onClick={() => onGoTo(index - 1)}
          disabled={index === 0}
        >
          Voltar
        </button>
        <nav className="folio-pages" aria-label="Páginas do livro">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className="folio-page"
              aria-label={`Questão ${i + 1}`}
              aria-current={i === index ? "page" : undefined}
              disabled={!answers[q.id] && i !== index}
              onClick={() => onGoTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="book-action book-action-solid"
          disabled={!answer}
          onClick={() => (isLast ? onFinish() : onGoTo(index + 1))}
        >
          {isLast ? "Terminar" : "Avançar"}
        </button>
      </Folio>
    </Book>
  );
}

function Reading({ question }: { question: Question }) {
  return (
    <>
      <QuestionText text={question.text} />
      {question.support_image_url && (
        <img
          src={question.support_image_url}
          alt="Imagem de apoio da questão"
          className="reading-figure"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </>
  );
}
