import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectPath, heading, makeQuestion, openBook } from "@/test/book";
import { expectOneBook } from "@/test/expectOneBook";
import { fail, ok } from "@/test/fakeApi";

const QUESTIONS = [makeQuestion(1), makeQuestion(2), makeQuestion(3, { text: "" })];
const EXPORT = "POST /api/export/pdf";
const PDF_URL = "/files/simulado.pdf";

const openSelection = (routes = {}) => openBook(QUESTIONS, { mode: "simulado", routes });
const generate = () => screen.getByRole("button", { name: "Gerar PDF" });

describe("SelectScreen", () => {
  it("starts with every question kept and marks the right answer", async () => {
    await openSelection();

    expectOneBook();
    expect(screen.getByRole("status")).toHaveTextContent("3 de 3 selecionadas");
    expect(screen.getAllByRole("checkbox", { checked: true })).toHaveLength(3);
    expect(screen.getAllByText("certa")).toHaveLength(3);
  });

  it("counts the selection as it changes", async () => {
    const { user } = await openSelection();

    await user.click(screen.getByRole("checkbox", { name: /Questão 2/ }));

    expect(screen.getByRole("status")).toHaveTextContent("2 de 3 selecionadas");
  });

  it("selects and clears everything, and needs one question to export", async () => {
    const { user } = await openSelection();

    await user.click(screen.getByRole("button", { name: "Desmarcar todas" }));
    expect(screen.getByRole("status")).toHaveTextContent("0 de 3 selecionadas");
    expect(generate()).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Selecionar todas" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 de 3 selecionadas");
    expect(generate()).toBeEnabled();
  });

  it("exports only the kept questions and reaches the ready page", async () => {
    const { user, router, api } = await openSelection({ [EXPORT]: ok({ url: PDF_URL }) });

    await user.click(screen.getByRole("checkbox", { name: /Questão 2/ }));
    await user.click(generate());

    await heading("Simulado pronto");
    await expectPath(router, "/simulado/pronto");
    expect(api.bodiesOf(EXPORT)).toEqual([
      { title: "Simulado de Leitura", questions: [QUESTIONS[0], QUESTIONS[2]] },
    ]);
    expectOneBook();
  });

  it("links to the PDF in another tab", async () => {
    const { user } = await openSelection({ [EXPORT]: ok({ url: PDF_URL }) });

    await user.click(generate());
    await heading("Simulado pronto");

    const link = screen.getByRole("link", { name: /Abrir o PDF/ });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", PDF_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("shows an export failure with a retry that recovers", async () => {
    const { user, router, api } = await openSelection({ [EXPORT]: fail(500, "O PDF falhou.") });

    await user.click(generate());

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("O PDF falhou.");
    expect(screen.getByRole("status")).toHaveTextContent("3 de 3 selecionadas");
    expectOneBook();

    api.routes[EXPORT] = ok({ url: PDF_URL });
    await user.click(within(alert).getByRole("button", { name: "Tentar de novo" }));

    await heading("Simulado pronto");
    await expectPath(router, "/simulado/pronto");
  });

  it("does not show the browser's English message on a network failure", async () => {
    const { user } = await openSelection({
      [EXPORT]: () => {
        throw new TypeError("Failed to fetch");
      },
    });

    await user.click(generate());

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível gerar o PDF.");
  });

  it("leaves to the start on Sair", async () => {
    const { user, router } = await openSelection();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    await heading("Gerar avaliação");
    await expectPath(router, "/");
  });

  it("returns to the start from the ready page", async () => {
    const { user, router } = await openSelection({ [EXPORT]: ok({ url: PDF_URL }) });
    await user.click(generate());
    await heading("Simulado pronto");

    await user.click(screen.getByRole("button", { name: "Voltar ao início" }));

    await heading("Gerar avaliação");
    await expectPath(router, "/");
    expectOneBook();
  });
});
