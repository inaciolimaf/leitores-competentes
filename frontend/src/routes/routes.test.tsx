import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { answerButton, DESCRIPTORS, expectPath, heading, makeQuestion, openBook } from "@/test/book";
import { expectOneBook } from "@/test/expectOneBook";
import { fakeApi, ok } from "@/test/fakeApi";
import { renderScreen } from "@/test/renderScreen";

const descriptorsOnly = () => fakeApi({ "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }) });
const expectTitle = (title: string) =>
  waitFor(() => expect(document.title).toBe(`${title} — Leitores Competentes`));

describe("routes", () => {
  it.each(["/resultado", "/simulado", "/simulado/pronto", "/questao/1"])(
    "sends %s back to Generation without a session",
    async (path) => {
      descriptorsOnly();
      const { router } = renderScreen(path);

      await heading("Gerar avaliação");
      await expectPath(router, "/");
      expectOneBook();
    },
  );

  it("shows the not-found screen for an unknown URL", async () => {
    descriptorsOnly();
    const { user, router } = renderScreen("/pagina-que-nao-existe");

    await heading("Esta página não está no livro");
    expectOneBook();

    await user.click(screen.getByRole("link", { name: "Voltar ao início" }));
    await heading("Gerar avaliação");
    await expectPath(router, "/");
  });

  it("sets the title and focuses the h1 on the first screen", async () => {
    descriptorsOnly();
    renderScreen("/");

    const title = await heading("Gerar avaliação");
    await expectTitle("Gerar avaliação");
    await waitFor(() => expect(title).toHaveFocus());
  });

  it("sets the title and focuses the h1 on every route change", async () => {
    const { user } = await openBook([makeQuestion(1), makeQuestion(2)]);

    await expectTitle("Questão 1 de 2");
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 })).toHaveFocus());

    await user.click(answerButton("B"));
    await user.click(screen.getByRole("button", { name: "Avançar" }));
    const second = await heading("Questão 2 de 2");
    await expectTitle("Questão 2 de 2");
    await waitFor(() => expect(second).toHaveFocus());

    await user.click(answerButton("B"));
    await user.click(screen.getByRole("button", { name: "Terminar" }));
    const last = await heading("Você leu até o fim!");
    await expectTitle("Você leu até o fim!");
    await waitFor(() => expect(last).toHaveFocus());
  });
});
