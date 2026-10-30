import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { NotFoundScreen, RouteErrorScreen } from "@/book/RouteStates";

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundScreen,
  errorComponent: RouteErrorScreen,
});

const generateRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" }).lazy(() =>
  import("./routes/generate.lazy").then((m) => m.Route),
);

const questionRoute = createRoute({ getParentRoute: () => rootRoute, path: "/questao/$numero" }).lazy(() =>
  import("./routes/question.lazy").then((m) => m.Route),
);

const resultRoute = createRoute({ getParentRoute: () => rootRoute, path: "/resultado" }).lazy(() =>
  import("./routes/result.lazy").then((m) => m.Route),
);

const selectRoute = createRoute({ getParentRoute: () => rootRoute, path: "/simulado" }).lazy(() =>
  import("./routes/select.lazy").then((m) => m.Route),
);

const pdfReadyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/simulado/pronto" }).lazy(() =>
  import("./routes/pdf-ready.lazy").then((m) => m.Route),
);

const routeTree = rootRoute.addChildren([
  generateRoute,
  questionRoute,
  resultRoute,
  selectRoute,
  pdfReadyRoute,
]);

export function createAppRouter(history?: RouterHistory) {
  return createRouter({ routeTree, history, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
