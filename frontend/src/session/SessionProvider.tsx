import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Question } from "@/lib/api";
import type { QuizAnswer } from "@/quiz/QuizScreen";
import { SessionContext } from "./SessionContext";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, QuizAnswer>>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const session = useMemo(
    () => ({
      questions,
      answers,
      pdfUrl,
      setPdfUrl,
      start: (generated: Question[]) => {
        // Ids come from the model and may repeat; answers are keyed by them.
        setQuestions(generated.map((q, i) => ({ ...q, id: i + 1 })));
        setAnswers({});
        setPdfUrl(null);
      },
      answer: (questionId: number, selected: string, correct: boolean) => {
        const descriptor = questions.find((q) => q.id === questionId)?.descriptor ?? "";
        setAnswers((prev) => ({ ...prev, [questionId]: { selected, correct, descriptor } }));
      },
      reset: () => {
        setQuestions([]);
        setAnswers({});
        setPdfUrl(null);
      },
    }),
    [questions, answers, pdfUrl],
  );

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
