import type { QuizAnswer } from "@/quiz/QuizScreen";

export type DescriptorScore = { code: string; correct: number; total: number };

export function countCorrect(results: Record<number, QuizAnswer>): number {
  return Object.values(results).filter((answer) => answer.correct).length;
}

export function scoreByDescriptor(results: Record<number, QuizAnswer>): DescriptorScore[] {
  const scores = new Map<string, DescriptorScore>();
  for (const { descriptor, correct } of Object.values(results)) {
    const score = scores.get(descriptor) ?? { code: descriptor, correct: 0, total: 0 };
    score.total += 1;
    if (correct) score.correct += 1;
    scores.set(descriptor, score);
  }
  return [...scores.values()];
}

export function scoreMessage(correct: number, total: number): string {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  if (percentage >= 80) return "Que ótima leitura! Parabéns.";
  if (percentage >= 60) return "Muito bem! Continue lendo assim.";
  if (percentage >= 40) return "Bom trabalho! Cada leitura ensina mais.";
  return "Errar faz parte de aprender. Vamos ler mais?";
}
