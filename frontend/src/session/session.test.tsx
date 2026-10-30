import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, it } from "vitest";
import { makeQuestion } from "@/test/book";
import { useSession } from "./SessionContext";
import { SessionProvider } from "./SessionProvider";

const wrapper = ({ children }: { children: ReactNode }) => <SessionProvider>{children}</SessionProvider>;

it("gives repeated model ids a unique id, so answers do not merge", () => {
  const { result } = renderHook(useSession, { wrapper });
  act(() => result.current.start([makeQuestion(7), makeQuestion(7)]));
  expect(result.current.questions.map((q) => q.id)).toEqual([1, 2]);
});
