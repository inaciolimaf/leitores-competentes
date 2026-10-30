import { vi } from "vitest";

export type Reply = { status: number; body: unknown };
type Handler = Reply | (() => Reply);

export const ok = (body: unknown): Reply => ({ status: 200, body });
export const fail = (status: number, detail: string): Reply => ({ status, body: { detail } });

// A route is "METHOD /path". Tests replace entries in `routes` to change an answer midway.
export function fakeApi(routes: Record<string, Handler>) {
  const calls: { route: string; body: unknown }[] = [];

  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    const route = `${init?.method ?? "GET"} ${url}`;
    calls.push({ route, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    const handler = routes[route];
    const reply = typeof handler === "function" ? handler() : handler;
    const { status, body } = reply ?? fail(404, `fakeApi: no route for ${route}`);
    return new Response(JSON.stringify(body), { status });
  });

  return {
    routes,
    calls,
    bodiesOf: (route: string) => calls.filter((call) => call.route === route).map((call) => call.body),
  };
}
