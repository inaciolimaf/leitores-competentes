import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { answerButton, expectPath, goTo, heading, makeQuestion, openBook } from "@/test/book";
import { expectOneBook } from "@/test/expectOneBook";

const threeQuestions = () => [makeQuestion(1), makeQuestion(2), makeQuestion(3)];
const advance = () => screen.getByRole("button", { name: "Avançar" });

describe("QuizScreen", () => {
  it("opens as two pages, with no mark before answering", async () => {
    await openBook(threeQuestions());

    expectOneBook();
    expect(screen.getByRole("region", { name: "Texto para leitura" })).toHaveTextContent("Texto da questão 1");
    expect(screen.getByRole("region", { name: "Pergunta" })).toHaveTextContent("Enunciado 1");
    expect(screen.queryByLabelText("resposta certa")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("marks a right answer and says so", async () => {
    const { user } = await openBook(threeQuestions());

    await user.click(answerButton("B"));

    expect(within(answerButton("B")).getByLabelText("resposta certa")).toBeInTheDocument();
    expect(screen.queryByLabelText("sua resposta, não é esta")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Isso mesmo!");
    expect(screen.getByRole("status")).toHaveTextContent("Explicação 1");
    expectOneBook();
  });

  it("marks a wrong answer and names the right letter", async () => {
    const { user } = await openBook(threeQuestions());

    await user.click(answerButton("A"));

    expect(within(answerButton("A")).getByLabelText("sua resposta, não é esta")).toBeInTheDocument();
    expect(within(answerButton("B")).getByLabelText("resposta certa")).toBeInTheDocument();
    expect(answerButton("C")).toHaveAttribute("data-state", "other");
    expect(screen.getByRole("status")).toHaveTextContent("Quase! A resposta é a letra B.");
    expect(screen.getByRole("status")).toHaveTextContent("Explicação 1");
  });

  it("keeps Avançar disabled until the question is answered", async () => {
    const { user } = await openBook(threeQuestions());

    expect(advance()).toBeDisabled();
    await user.click(answerButton("A"));
    expect(advance()).toBeEnabled();

    await user.click(advance());
    await heading("Questão 2 de 3");
    expectOneBook();
    expect(advance()).toBeDisabled();
  });

  it("keeps the answer when going back and refuses a second one", async () => {
    const { user } = await openBook(threeQuestions());

    await user.click(answerButton("A"));
    await user.click(advance());
    await heading("Questão 2 de 3");
    await user.click(screen.getByRole("button", { name: "Voltar" }));
    await heading("Questão 1 de 3");

    expect(answerButton("A")).toHaveAttribute("data-chosen", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Quase! A resposta é a letra B.");
    for (const letter of ["A", "B", "C"]) expect(answerButton(letter)).toHaveAttribute("aria-disabled", "true");

    await user.click(answerButton("B"));
    expect(answerButton("A")).toHaveAttribute("data-chosen", "true");
    expect(answerButton("B")).toHaveAttribute("data-chosen", "false");
    expect(advance()).toBeEnabled();
  });

  it.each([
    ["no text", { text: "" }],
    ["blank text", { text: "  \n " }],
  ])("renders one page for a question with %s", async (_, overrides) => {
    await openBook([makeQuestion(1, overrides)]);

    expectOneBook();
    expect(screen.getAllByRole("region")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Pergunta" })).toBeInTheDocument();
  });

  it("keeps the reading page for a question with only an image", async () => {
    await openBook([makeQuestion(1, { text: "", support_image_url: "/img/1.png" })]);

    expect(screen.getAllByRole("region")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Imagem de apoio da questão" })).toHaveAttribute("src", "/img/1.png");
  });

  it("keeps unread pages closed in the folio", async () => {
    await openBook(threeQuestions());

    expect(screen.getByRole("button", { name: "Questão 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Questão 2" })).toBeDisabled();
  });

  it("redirects a URL beyond the first open question to it", async () => {
    const { user, router } = await openBook(threeQuestions());

    await goTo(router, "/questao/3");
    await expectPath(router, "/questao/1");

    await user.click(answerButton("B"));
    await goTo(router, "/questao/3");
    await expectPath(router, "/questao/2");
    await heading("Questão 2 de 3");
    expectOneBook();
  });

  it.each(["0", "abc", "1.5"])("redirects the invalid question %s to the open one", async (numero) => {
    const { router } = await openBook(threeQuestions());

    await goTo(router, `/questao/${numero}`);

    await expectPath(router, "/questao/1");
  });

  it("finishes on the result after the last question", async () => {
    const { user, router } = await openBook([makeQuestion(1)]);

    await user.click(answerButton("B"));
    await user.click(screen.getByRole("button", { name: "Terminar" }));

    await expectPath(router, "/resultado");
  });
});
