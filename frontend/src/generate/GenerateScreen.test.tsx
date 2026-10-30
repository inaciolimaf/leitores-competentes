import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DESCRIPTORS, expectPath, heading, makeQuestion, openBook } from "@/test/book";
import { expectOneBook } from "@/test/expectOneBook";
import { fail, fakeApi, ok } from "@/test/fakeApi";
import { renderScreen } from "@/test/renderScreen";

const submitButton = () => screen.getByRole("button", { name: /Gerar questões|Gerando questões/ });
const descriptor = (name: RegExp) => screen.findByRole("checkbox", { name });

describe("GenerateScreen", () => {
  it("lists the descriptors as the table of contents", async () => {
    fakeApi({ "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }) });
    renderScreen("/");

    await heading("Gerar avaliação");
    await descriptor(/Localizar informações/);
    expectOneBook();
    const contents = screen.getByRole("group", { name: "Escolha os descritores" });
    expect(within(contents).getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByRole("checkbox", { name: /Inferir uma informação/ })).toHaveAccessibleName(/precisa de imagem/);
  });

  it("offers a retry when the descriptors fail and recovers", async () => {
    const api = fakeApi({ "GET /api/descriptors": fail(500, "fora do ar") });
    const { user } = renderScreen("/");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Não foi possível carregar os descritores.");
    expect(screen.getByText("Sem os descritores não é possível gerar.")).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
    expectOneBook();

    api.routes["GET /api/descriptors"] = ok({ descriptors: DESCRIPTORS });
    await user.click(within(alert).getByRole("button", { name: "Tentar de novo" }));

    await descriptor(/Localizar informações/);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Escolha os descritores" })).toHaveFocus();
    expectOneBook();
  });

  it("says when no descriptor is available", async () => {
    fakeApi({ "GET /api/descriptors": ok({ descriptors: [] }) });
    renderScreen("/");

    expect(await screen.findByText("Nenhum descritor disponível no momento.")).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it("keeps submit disabled without a chosen descriptor", async () => {
    fakeApi({ "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }) });
    const { user } = renderScreen("/");

    const line = await descriptor(/Localizar informações/);
    expect(submitButton()).toBeDisabled();
    expect(screen.getByText("Escolha ao menos um descritor para gerar.")).toBeInTheDocument();

    await user.click(line);
    expect(submitButton()).toBeEnabled();
    expect(screen.getByText("1 descritor · 5 questões · médio · interativo")).toBeInTheDocument();

    await user.click(line);
    expect(submitButton()).toBeDisabled();
  });

  it("opens the first question in the interactive format", async () => {
    const { router, api } = await openBook([makeQuestion(1)]);

    await expectPath(router, "/questao/1");
    expect(api.bodiesOf("POST /api/generate")).toEqual([
      { quantity: 5, difficulty: "médio", descriptors: ["D1"] },
    ]);
    expectOneBook();
  });

  it("opens the selection in the PDF format", async () => {
    const { router } = await openBook([makeQuestion(1)], { mode: "simulado" });

    await expectPath(router, "/simulado");
    expectOneBook();
  });

  it("sends the chosen difficulty", async () => {
    const api = fakeApi({
      "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }),
      "POST /api/generate": ok({ questions: [makeQuestion(1)] }),
    });
    const { user } = renderScreen("/");

    await user.click(await descriptor(/Inferir uma informação/));
    await user.click(screen.getByRole("radio", { name: /Difícil/ }));
    await user.click(submitButton());

    await heading(/^Questão 1 de/);
    expect(api.bodiesOf("POST /api/generate")).toEqual([
      { quantity: 5, difficulty: "difícil", descriptors: ["D4"] },
    ]);
  });

  it("shows the API's detail and lets the teacher dismiss it", async () => {
    fakeApi({
      "GET /api/descriptors": ok({ descriptors: DESCRIPTORS }),
      "POST /api/generate": fail(502, "O gerador está indisponível."),
    });
    const { user, router } = renderScreen("/");

    await user.click(await descriptor(/Localizar informações/));
    await user.click(submitButton());

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("O gerador está indisponível.");
    expect(router.state.location.pathname).toBe("/");
    expectOneBook();

    await user.click(within(alert).getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(submitButton()).toHaveFocus();
  });
});
