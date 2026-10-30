import { describe, expect, it } from "vitest";
import { countCorrect, scoreByDescriptor, scoreMessage } from "./score";

const results = {
  1: { selected: "A", correct: true, descriptor: "D1" },
  2: { selected: "B", correct: false, descriptor: "D3" },
  3: { selected: "C", correct: true, descriptor: "D1" },
  4: { selected: "D", correct: false, descriptor: "D1" },
};

describe("score", () => {
  it("counts the right answers", () => {
    expect(countCorrect(results)).toBe(2);
    expect(countCorrect({})).toBe(0);
  });

  it("groups the answers by descriptor, in reading order", () => {
    expect(scoreByDescriptor(results)).toEqual([
      { code: "D1", correct: 2, total: 3 },
      { code: "D3", correct: 0, total: 1 },
    ]);
  });

  it.each([
    [5, 5, "Que ótima leitura! Parabéns."],
    [4, 5, "Que ótima leitura! Parabéns."],
    [3, 5, "Muito bem! Continue lendo assim."],
    [2, 5, "Bom trabalho! Cada leitura ensina mais."],
    [1, 5, "Errar faz parte de aprender. Vamos ler mais?"],
    [0, 0, "Errar faz parte de aprender. Vamos ler mais?"],
  ])("picks the message for %i of %i", (correct, total, message) => {
    expect(scoreMessage(correct, total)).toBe(message);
  });
});
