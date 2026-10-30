import { screen, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { answerButton, expectPath, goTo, heading, makeQuestion, openBook } from "@/test/book";
import { expectOneBook } from "@/test/expectOneBook";

const QUESTIONS = [makeQuestion(1), makeQuestion(2), makeQuestion(3, { descriptor: "D4" })];

async function answerAll(user: UserEvent, letters: string[]) {
  for (const [i, letter] of letters.entries()) {
    await heading(`Questão ${i + 1} de ${letters.length}`);
    await user.click(answerButton(letter));
    const isLast = i === letters.length - 1;
    await user.click(screen.getByRole("button", { name: isLast ? "Terminar" : "Avançar" }));
  }
  await heading("Você leu até o fim!");
}

describe("ResultScreen", () => {
  it("shows the figure and a line per descriptor", async () => {
    const { user, router } = await openBook(QUESTIONS);

    await answerAll(user, ["B", "A", "A"]);

    await expectPath(router, "/resultado");
    expectOneBook();
    expect(screen.getByText("1 de 3")).toBeInTheDocument();
    expect(screen.getByText("Errar faz parte de aprender. Vamos ler mais?")).toBeInTheDocument();

    const lines = within(screen.getByRole("region", { name: "O que você leu" })).getAllByRole("listitem");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent("Descritor D1");
    expect(lines[0]).toHaveTextContent("1 de 2 certas");
    expect(lines[1]).toHaveTextContent("Descritor D4");
    expect(lines[1]).toHaveTextContent("0 de 1 certas");
  });

  it("praises a full score", async () => {
    const { user } = await openBook(QUESTIONS);

    await answerAll(user, ["B", "B", "B"]);

    expect(screen.getByText("3 de 3")).toBeInTheDocument();
    expect(screen.getByText("Que ótima leitura! Parabéns.")).toBeInTheDocument();
  });

  it("resets the session and returns to the start", async () => {
    const { user, router } = await openBook(QUESTIONS);
    await answerAll(user, ["B", "B", "B"]);

    await user.click(screen.getByRole("button", { name: "Voltar ao início" }));

    await heading("Gerar avaliação");
    await expectPath(router, "/");
    expectOneBook();

    await goTo(router, "/resultado");
    await expectPath(router, "/");
  });
});
