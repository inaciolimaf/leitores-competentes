import { act, screen, waitFor, within } from "@testing-library/react";
import { expect } from "vitest";
import type { Descriptor, Question } from "@/lib/api";
import type { createAppRouter } from "@/router";
import { fakeApi, ok } from "./fakeApi";
import { renderScreen } from "./renderScreen";

type AppRouter = ReturnType<typeof createAppRouter>;

export const DESCRIPTORS: Descriptor[] = [
  { code: "D1", name: "Localizar informações", description: "Localizar", needs_image: false },
  { code: "D4", name: "Inferir uma informação", description: "Inferir", needs_image: true },
];

export function makeQuestion(id: number, overrides: Partial<Question> = {}): Question {
  return {
    id,
    descriptor: "D1",
    descriptor_description: "Localizar informações",
    text: `Texto da questão ${id}`,
    support_image_url: null,
    statement: `Enunciado ${id}`,
    alternatives: [
      { letter: "A", text: `Primeira ${id}` },
      { letter: "B", text: `Segunda ${id}` },
      { letter: "C", text: `Terceira ${id}` },
    ],
    correct_answer: "B",
    explanation: `Explicação ${id}`,
    ...overrides,
  };
}

export const heading = (name: string | RegExp) => screen.findByRole("heading", { level: 1, name });

export const expectPath = (router: AppRouter, path: string) =>
  waitFor(() => expect(router.state.location.pathname).toBe(path));

export const answerButton = (letter: string) =>
  within(screen.getByRole("group", { name: "Alternativas" })).getByRole("button", {
    name: new RegExp(`^${letter}`),
  });

export const goTo = (router: AppRouter, href: string) => act(() => router.navigate({ href }));

interface OpenBookOptions {
  mode?: "interactive" | "simulado";
  routes?: Parameters<typeof fakeApi>[0];
}

// Sessions live only in memory (spec 01 §8), so a book is opened the way a teacher opens it.
export async function openBook(questions: Question[], { mode = "interactive", routes }: OpenBookOptions = {}) {
  const api = fakeApi({
    "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }),
    "POST /api/generate": ok({ questions }),
    ...routes,
  });
  const rendered = renderScreen("/");
  const { user } = rendered;

  await user.click(await screen.findByRole("checkbox", { name: /Localizar informações/ }));
  if (mode === "simulado") await user.click(screen.getByRole("radio", { name: /PDF/ }));
  await user.click(screen.getByRole("button", { name: "Gerar questões" }));
  await heading(mode === "simulado" ? "Escolher questões para imprimir" : /^Questão 1 de/);

  return { ...rendered, api };
}
