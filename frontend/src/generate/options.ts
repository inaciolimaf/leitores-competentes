export type GenerateMode = "interactive" | "simulado";

export interface Option<T extends string> {
  value: T;
  label: string;
  hint: string;
}

export const FORMATS: Option<GenerateMode>[] = [
  { value: "interactive", label: "Interativo", hint: "A turma responde na tela" },
  { value: "simulado", label: "PDF", hint: "Simulado para imprimir" },
];

export const DIFFICULTIES: Option<string>[] = [
  { value: "fácil", label: "Fácil", hint: "Textos curtos, perguntas diretas" },
  { value: "médio", label: "Médio", hint: "Textos moderados, mais atenção" },
  { value: "difícil", label: "Difícil", hint: "Textos complexos, distratores sutis" },
];

export const QUANTITY = { min: 1, max: 30, initial: 5 };

interface Choices {
  count: number;
  quantity: number;
  difficulty: string;
  mode: GenerateMode;
}

export function summarize({ count, quantity, difficulty, mode }: Choices) {
  const descriptors = count === 1 ? "1 descritor" : `${count} descritores`;
  const questions = quantity === 1 ? "1 questão" : `${quantity} questões`;
  const format = mode === "simulado" ? "PDF" : "interativo";
  return `${descriptors} · ${questions} · ${difficulty} · ${format}`;
}
