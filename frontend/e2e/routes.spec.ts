import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import {
  answer,
  expect,
  expectNoAxeViolations,
  expectNoOverflow,
  expectScreen,
  generate,
  h1,
  openGeneration,
  openPdfReady,
  openQuestion,
  openResult,
  openSelection,
  settle,
  test,
} from "./fixtures";
import type { ApiMock } from "./fixtures";

interface Screen {
  name: string;
  // The router path it renders; null when no path owns it, as with not-found.
  path: string | null;
  open: (page: Page, api: ApiMock) => Promise<void>;
  // A forced failure makes the browser and the error boundary log it. Nothing else may.
  expectedConsole?: RegExp;
}

const FAILED_REQUEST = /Failed to load resource/;

const SCREENS: Screen[] = [
  { name: "generation", path: "/", open: (page) => openGeneration(page) },
  {
    name: "generation, descriptors failed",
    path: "/",
    expectedConsole: FAILED_REQUEST,
    open: async (page, api) => {
      api.fail("descriptors");
      await page.goto("/");
      await expect(page.getByRole("alert")).toContainText("Não foi possível carregar os descritores.");
    },
  },
  {
    name: "generation, generate failed",
    path: "/",
    expectedConsole: FAILED_REQUEST,
    open: async (page, api) => {
      api.fail("generate");
      await generate(page, "interactive");
      await expect(page.getByRole("alert")).toContainText("O servidor falhou de propósito.");
    },
  },
  { name: "question with text", path: "/questao/$numero", open: (page) => openQuestion(page, 1) },
  {
    name: "question with image",
    path: "/questao/$numero",
    open: async (page) => {
      await openQuestion(page, 2);
      await expect(page.getByRole("img", { name: "Imagem de apoio da questão" })).toBeVisible();
    },
  },
  { name: "question without reading", path: "/questao/$numero", open: (page) => openQuestion(page, 3) },
  {
    name: "question answered right",
    path: "/questao/$numero",
    open: async (page) => {
      await openQuestion(page, 1);
      await answer(page, "B");
    },
  },
  {
    name: "question answered wrong",
    path: "/questao/$numero",
    open: async (page) => {
      await openQuestion(page, 1);
      await answer(page, "A");
    },
  },
  { name: "result", path: "/resultado", open: (page) => openResult(page) },
  { name: "selection", path: "/simulado", open: (page) => openSelection(page) },
  {
    name: "selection, export failed",
    path: "/simulado",
    expectedConsole: FAILED_REQUEST,
    open: async (page, api) => {
      api.fail("export");
      await openSelection(page);
      await page.getByRole("button", { name: "Gerar PDF" }).click();
      await expect(page.getByRole("alert")).toContainText("O servidor falhou de propósito.");
    },
  },
  { name: "pdf ready", path: "/simulado/pronto", open: (page) => openPdfReady(page) },
  {
    name: "not found",
    path: null,
    open: async (page) => {
      await page.goto("/esta-pagina-nao-existe");
      await expectScreen(page, "Esta página não está no livro");
    },
  },
  {
    name: "route failed to open",
    path: null,
    expectedConsole: /chunk de teste/,
    open: async (page) => {
      await page.route(/result\.lazy.*\.js$/, (route) =>
        route.fulfill({ contentType: "text/javascript", body: 'throw new Error("chunk de teste");' }),
      );
      await page.goto("/resultado");
      await expectScreen(page, "Não foi possível abrir esta página");
    },
  },
];

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

const SYSTEM_THEMES = [
  { colorScheme: "light", theme: "claro", other: "escuro", toggle: "Leitura à noite" },
  { colorScheme: "dark", theme: "escuro", other: "claro", toggle: "Leitura de dia" },
] as const;

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function expectSoundScreen(page: Page) {
  await settle(page);
  await expect(h1(page)).toHaveCount(1);
  await expectNoOverflow(page);
  await expectNoAxeViolations(page);
}

test("every route of the router is listed here", () => {
  const router = readFileSync("src/router.tsx", "utf8");
  const declared = [...router.matchAll(/\bpath: "([^"]+)"/g)].map((m) => m[1]);
  const listed = new Set(SCREENS.flatMap((screen) => screen.path ?? []));
  expect(declared.length).toBeGreaterThan(0);
  expect([...listed].sort()).toEqual([...declared].sort());
});

for (const viewport of VIEWPORTS) {
  for (const { colorScheme, theme, other, toggle } of SYSTEM_THEMES) {
    test.describe(`${viewport.width}x${viewport.height}, system ${colorScheme}`, () => {
      test.use({ viewport, colorScheme });

      for (const screen of SCREENS) {
        test(screen.name, async ({ page, api }) => {
          const errors = collectConsoleErrors(page);
          await screen.open(page, api);

          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await expectSoundScreen(page);

          await page.getByRole("button", { name: toggle }).click();
          await expect(page.locator("html")).toHaveAttribute("data-theme", other);
          await expectSoundScreen(page);

          const unexpected = errors.filter((text) => !screen.expectedConsole?.test(text));
          expect(unexpected).toEqual([]);
        });
      }
    });
  }
}
