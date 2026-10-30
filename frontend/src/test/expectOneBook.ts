import { screen } from "@testing-library/react";
import { expect } from "vitest";

export function expectOneBook() {
  expect(document.querySelectorAll("[data-book]")).toHaveLength(1);
  expect(screen.getAllByRole("main")).toHaveLength(1);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
}
