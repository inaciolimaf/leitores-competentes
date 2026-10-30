import type { Page } from "@playwright/test";
import {
  answer,
  expect,
  expectScreen,
  generate,
  h1,
  MANY_QUESTIONS,
  openGeneration,
  openQuestion,
  openSelection,
  PDF_URL,
  QUESTIONS,
  settle,
  test,
} from "./fixtures";

const PHONE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

async function expectFocusOnH1(page: Page, title: string) {
  await expectScreen(page, title);
  await expect(h1(page)).toBeFocused();
}

// A focused control either lives in the sticky foot, or stands clear of it.
async function expectFocusClearOfFolio(page: Page) {
  const clash = await page.evaluate(() => {
    const focused = document.activeElement;
    const foot = document.querySelector(".proof-foot") ?? document.querySelector(".folio");
    if (!focused || focused === document.body || !foot || foot.contains(focused)) return null;
    const box = focused.getBoundingClientRect();
    const top = foot.getBoundingClientRect().top;
    return box.bottom > top ? `${focused.outerHTML.slice(0, 80)} ends at ${box.bottom}, foot starts at ${top}` : null;
  });
  expect(clash).toBeNull();
}

function focusedName(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return (el?.getAttribute("aria-label") ?? el?.closest("label")?.textContent ?? el?.textContent ?? "").trim();
  });
}

// Presses Tab as a person would, until the wanted control has focus.
async function tabTo(page: Page, name: RegExp, key = "Tab") {
  for (let i = 0; i < 60; i++) {
    if (name.test(await focusedName(page))) return;
    await page.keyboard.press(key);
    await expectFocusClearOfFolio(page);
  }
  throw new Error(`${key} never reached ${name}`);
}

async function tabThroughEverything(page: Page) {
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press("Tab");
    await settle(page);
    await expectFocusClearOfFolio(page);
  }
}

test.describe("interactive path", () => {
  test("reaches the result with the score of what was answered", async ({ page, api }) => {
    await generate(page, "interactive");
    await expectScreen(page, "Questão 1 de 3");
    expect(api.generated).toEqual([{ quantity: 5, difficulty: "médio", descriptors: ["D1", "D2"] }]);

    await expect(page.getByRole("button", { name: "Avançar" })).toBeDisabled();
    await answer(page, "B");
    await expect(page.getByText("Isso mesmo!")).toBeVisible();
    await page.getByRole("button", { name: "Avançar" }).click();

    await expectScreen(page, "Questão 2 de 3");
    await expect(page.getByRole("img", { name: "Imagem de apoio da questão" })).toBeVisible();
    await answer(page, "A");
    await expect(page.getByText("Quase! A resposta é a letra B.")).toBeVisible();
    await page.getByRole("button", { name: "Avançar" }).click();

    await expectScreen(page, "Questão 3 de 3");
    await answer(page, "B");
    await page.getByRole("button", { name: "Terminar" }).click();

    await expectScreen(page, "Você leu até o fim!");
    await expect(page.getByText("2 de 3", { exact: true })).toBeVisible();
    await expect(page.getByText("Descritor D2")).toBeVisible();

    await page.getByRole("button", { name: "Voltar ao início" }).click();
    await expectScreen(page, "Gerar avaliação");
  });

  test("a reload mid-quiz returns to Generation", async ({ page }) => {
    await openQuestion(page, 2);
    await page.reload();
    await expectScreen(page, "Gerar avaliação");
    await expect(page).toHaveURL("/");
  });
});

test.describe("pdf path", () => {
  test("reaches the ready link with the questions that were kept", async ({ page, api }) => {
    await openSelection(page);
    await page.getByRole("checkbox", { name: /Questão 2/ }).uncheck();
    await expect(page.getByText("2 de 3 selecionadas")).toBeVisible();

    await page.getByRole("button", { name: "Gerar PDF" }).click();
    await expectScreen(page, "Simulado pronto");

    expect(api.exported).toHaveLength(1);
    expect(api.exported[0].questions.map((q) => q.id)).toEqual([1, 3]);
    await expect(page.getByRole("link", { name: /Abrir o PDF/ })).toHaveAttribute("href", PDF_URL);
  });

  test("retries after a failed export", async ({ page, api }) => {
    api.fail("export");
    await openSelection(page);
    await page.getByRole("button", { name: "Gerar PDF" }).click();
    await expect(page.getByRole("alert")).toBeVisible();

    api.restore("export");
    await page.getByRole("button", { name: "Tentar de novo" }).click();
    await expectScreen(page, "Simulado pronto");
  });
});

for (const viewport of [PHONE, DESKTOP]) {
  test.describe(`keyboard at ${viewport.width}px`, () => {
    test.use({ viewport });

    test("the whole interactive path, with no pointer", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("checkbox").first()).toBeVisible();
      await expectFocusOnH1(page, "Gerar avaliação");

      await tabTo(page, /^Ir para o conteúdo$/, "Shift+Tab");
      await expect(page.getByRole("link", { name: "Ir para o conteúdo" })).toBeInViewport({ ratio: 1 });
      await page.keyboard.press("Enter");
      await page.keyboard.press("Tab");
      const inMain = await page.evaluate(() => document.activeElement?.closest("main") != null);
      expect(inMain, "the skip link jumps past the running head").toBe(true);

      await tabTo(page, /^D1\D/);
      await page.keyboard.press("Space");
      await expect(page.getByRole("checkbox").first()).toBeChecked();
      await tabTo(page, /^Gerar questões$/);
      await page.keyboard.press("Enter");

      for (let n = 1; n <= QUESTIONS.length; n++) {
        const isLast = n === QUESTIONS.length;
        await expectFocusOnH1(page, `Questão ${n} de ${QUESTIONS.length}`);
        await tabTo(page, /^B\s*Alternativa/);
        await page.keyboard.press("Enter");
        await expect(page.getByText("Isso mesmo!")).toBeVisible();
        await tabTo(page, isLast ? /^Terminar$/ : /^Avançar$/);
        await page.keyboard.press("Enter");
      }

      await expectFocusOnH1(page, "Você leu até o fim!");
      await expect(page.getByText("3 de 3", { exact: true })).toBeVisible();
      await tabTo(page, /^Voltar ao início$/);
      await page.keyboard.press("Enter");
      await expectFocusOnH1(page, "Gerar avaliação");
    });

    test("focus never hides under the foot of Generation", async ({ page }) => {
      await openGeneration(page);
      await tabThroughEverything(page);
    });

    test("focus never hides under the foot of the selection", async ({ page, api }) => {
      api.questions = MANY_QUESTIONS;
      await openSelection(page);
      await tabThroughEverything(page);
    });
  });
}

test.describe("reduced motion", () => {
  async function runningMotion(page: Page) {
    return page.evaluate(() =>
      [...document.querySelectorAll("*")].flatMap((el) =>
        [undefined, "::before", "::after"].flatMap((pseudo) => {
          const style = getComputedStyle(el, pseudo);
          const durations = [style.animationDuration, style.transitionDuration].join(",").split(",");
          const animated = style.animationName !== "none" || style.transitionDuration !== "0s";
          return animated && durations.some((d) => parseFloat(d) !== 0)
            ? [`${el.tagName}.${el.className}${pseudo ?? ""} ${style.animationName} ${durations}`]
            : [];
        }),
      ),
    );
  }

  test.describe("with the preference on", () => {
    test.use({ reducedMotion: "reduce" });

    test("no animation has a duration, in any state", async ({ page, api }) => {
      const releaseDescriptors = api.hold("descriptors");
      await page.goto("/");
      await expect(page.locator(".toc-waiting").first()).toBeVisible();
      expect(await runningMotion(page)).toEqual([]);
      releaseDescriptors();

      await expect(page.getByRole("checkbox").first()).toBeVisible();
      const releaseGenerate = api.hold("generate");
      await page.getByRole("checkbox").first().check();
      expect(await runningMotion(page)).toEqual([]);
      await page.getByRole("button", { name: "Gerar questões" }).click();
      await expect(page.getByRole("button", { name: "Gerando questões…" })).toBeVisible();
      expect(await runningMotion(page)).toEqual([]);
      releaseGenerate();

      await expectScreen(page, "Questão 1 de 3");
      await answer(page, "B");
      expect(await runningMotion(page)).toEqual([]);
    });

    test("so does the pending export", async ({ page, api }) => {
      await openSelection(page);
      const release = api.hold("export");
      await page.getByRole("button", { name: "Gerar PDF" }).click();
      await expect(page.getByText("Gerando PDF…")).toBeVisible();
      expect(await runningMotion(page)).toEqual([]);
      release();
      await expectScreen(page, "Simulado pronto");
    });
  });

  // Proves that the probe above can fail: the same screen does move without the preference.
  test("without the preference the same probe sees motion", async ({ page }) => {
    await openQuestion(page, 1);
    expect(await runningMotion(page)).not.toEqual([]);
  });
});
