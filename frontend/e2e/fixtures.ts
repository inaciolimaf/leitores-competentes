import AxeBuilder from "@axe-core/playwright";
import { expect, test as base } from "@playwright/test";
import type { Page, Request, Route } from "@playwright/test";
import type { Descriptor, ExportRequest, GenerateRequest, Question } from "../src/lib/api";

export const PDF_URL = "/api/static/simulado-teste.pdf";
const IMAGE_URL = "/api/static/apoio.svg";
// Wider than a phone on purpose: the figure has to fit the page, not the other way round.
const IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#c9b78f"/></svg>`;

const DESCRIPTOR_NAMES = [
  "Localizar informações explícitas em um texto",
  "Inferir o sentido de uma palavra ou expressão",
  "Inferir uma informação implícita em um texto",
  "Identificar o tema de um texto",
  "Interpretar texto com auxílio de material gráfico diverso",
  "Identificar o conflito gerador do enredo",
  "Estabelecer relações entre partes de um texto",
  "Reconhecer efeito de humor ou de ironia",
  "Identificar a finalidade de textos de diferentes gêneros",
  "Distinguir um fato da opinião relativa a esse fato",
  "Reconhecer efeito de sentido da pontuação",
  "Comparar textos que tratam do mesmo tema",
];

export const DESCRIPTORS: Descriptor[] = DESCRIPTOR_NAMES.map((name, i) => ({
  code: `D${i + 1}`,
  name,
  description: name,
  needs_image: i === 4,
}));

function question(id: number, reading: Pick<Question, "text" | "support_image_url">): Question {
  return {
    id,
    descriptor: `D${id}`,
    descriptor_description: DESCRIPTOR_NAMES[id - 1],
    ...reading,
    statement: `Qual é a resposta certa da pergunta ${id}?`,
    alternatives: ["A", "B", "C", "D"].map((letter) => ({ letter, text: `Alternativa ${letter} da pergunta ${id}` })),
    correct_answer: "B",
    explanation: `A letra B responde à pergunta ${id}, como mostra o texto.`,
  };
}

// The three layouts of the question screen: text, image, and neither (a single page).
export const QUESTIONS: Question[] = [
  question(1, { text: "### O sabiá\n\nO sabiá cantou no quintal.\nTodo mundo parou para ouvir.", support_image_url: null }),
  question(2, { text: "", support_image_url: IMAGE_URL }),
  question(3, { text: "", support_image_url: null }),
];

// Long enough for the proofs to scroll under the sticky foot of the selection.
export const MANY_QUESTIONS: Question[] = DESCRIPTOR_NAMES.map((_, i) =>
  question(i + 1, { text: "", support_image_url: null }),
);

export type ApiCall = "descriptors" | "generate" | "export";

// Reached through page.route; the app has no backend under test.
export class ApiMock {
  generated: GenerateRequest[] = [];
  exported: ExportRequest[] = [];
  unmocked: string[] = [];
  questions = QUESTIONS;
  private failing = new Set<ApiCall>();
  private held = new Map<ApiCall, Promise<void>>();

  fail(call: ApiCall) {
    this.failing.add(call);
  }

  restore(call: ApiCall) {
    this.failing.delete(call);
  }

  // Keeps the call pending, for loading states. The returned function lets it answer.
  hold(call: ApiCall) {
    let release = () => {};
    this.held.set(call, new Promise((resolve) => (release = resolve)));
    return () => release();
  }

  async install(page: Page) {
    await page.route("**/api/**", (route, request) => this.answer(route, request));
  }

  private async answer(route: Route, request: Request) {
    const path = new URL(request.url()).pathname;
    if (path === "/api/descriptors") return this.reply(route, "descriptors", { descriptors: DESCRIPTORS });
    if (path === "/api/generate" && request.method() === "POST") {
      this.generated.push(request.postDataJSON());
      return this.reply(route, "generate", { questions: this.questions });
    }
    if (path === "/api/export/pdf" && request.method() === "POST") {
      this.exported.push(request.postDataJSON());
      return this.reply(route, "export", { url: PDF_URL });
    }
    if (path === IMAGE_URL) return route.fulfill({ contentType: "image/svg+xml", body: IMAGE_SVG });
    this.unmocked.push(`${request.method()} ${path}`);
    return route.fulfill({ status: 501, json: { detail: `No mock for ${path}` } });
  }

  private async reply(route: Route, call: ApiCall, body: unknown) {
    await this.held.get(call);
    if (this.failing.has(call)) {
      return route.fulfill({ status: 500, json: { detail: "O servidor falhou de propósito." } });
    }
    return route.fulfill({ json: body });
  }
}

export const test = base.extend<{ api: ApiMock }>({
  // `provide` and not `use`: eslint reads `use` as React's hook.
  api: [
    async ({ page }, provide) => {
      const api = new ApiMock();
      await api.install(page);
      await provide(api);
      expect(api.unmocked, "calls without a mock").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const h1 = (page: Page) => page.locator("h1");

export async function expectScreen(page: Page, title: string | RegExp) {
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
}

// A direct URL has no session and redirects to "/", so every screen is reached by using the app.
export async function openGeneration(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("checkbox").first()).toBeVisible();
}

export async function generate(page: Page, mode: "interactive" | "pdf") {
  await openGeneration(page);
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  if (mode === "pdf") await page.getByRole("radio", { name: /^PDF/ }).check();
  await page.getByRole("button", { name: "Gerar questões" }).click();
}

export async function answer(page: Page, letter: string) {
  const alternatives = page.getByRole("group", { name: "Alternativas" });
  await alternatives.getByRole("button", { name: new RegExp(`^${letter}\\s*Alternativa`) }).click();
  await expect(page.getByRole("status").filter({ hasText: /Isso mesmo!|Quase!/ })).toBeVisible();
}

export async function openQuestion(page: Page, number: number) {
  await generate(page, "interactive");
  for (let n = 1; n < number; n++) {
    await expectScreen(page, `Questão ${n} de ${QUESTIONS.length}`);
    await answer(page, "B");
    await page.getByRole("button", { name: "Avançar" }).click();
  }
  await expectScreen(page, `Questão ${number} de ${QUESTIONS.length}`);
}

export async function openResult(page: Page) {
  await openQuestion(page, QUESTIONS.length);
  await answer(page, "A");
  await page.getByRole("button", { name: "Terminar" }).click();
  await expectScreen(page, "Você leu até o fim!");
}

export async function openSelection(page: Page) {
  await generate(page, "pdf");
  await expectScreen(page, "Escolher questões para imprimir");
}

export async function openPdfReady(page: Page) {
  await openSelection(page);
  await page.getByRole("button", { name: "Gerar PDF" }).click();
  await expectScreen(page, "Simulado pronto");
}

// Colours and positions are only final once the one-shot animations end. Loading loops never do.
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
    await Promise.allSettled(finite.map((a) => a.finished));
  });
}

export async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  const found = violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target.join(" ")) }));
  expect(found).toEqual([]);
}

// `.book` clips sideways overflow, which hides it from scrollWidth; so each box is measured too.
export async function expectNoOverflow(page: Page) {
  const measured = await page.evaluate(() => {
    const past = [...document.querySelectorAll(".book *")].filter(
      (el) => el.getBoundingClientRect().right > window.innerWidth + 0.5 && el.closest(".sr-only") === null,
    );
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      past: past.map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
    };
  });
  expect(measured.scrollWidth).toBeLessThanOrEqual(measured.innerWidth);
  expect(measured.past).toEqual([]);
}
