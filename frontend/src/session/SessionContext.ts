import { createContext, useContext } from "react";
import type { Question } from "@/lib/api";
import type { QuizAnswer } from "@/quiz/QuizScreen";

// One generated book, held only in memory: a reload returns to Generation (spec 01 §8).
export interface Session {
  questions: Question[];
  answers: Record<number, QuizAnswer>;
  pdfUrl: string | null;
  start: (questions: Question[]) => void;
  answer: (questionId: number, letter: string, correct: boolean) => void;
  setPdfUrl: (url: string) => void;
  reset: () => void;
}

export const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession outside SessionProvider");
  return session;
}
