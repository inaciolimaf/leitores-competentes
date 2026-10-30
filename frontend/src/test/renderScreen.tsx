import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createAppRouter } from "@/router";
import { SessionProvider } from "@/session/SessionProvider";

export function renderScreen(path = "/") {
  // No wait between retries, or the descriptors' single retry stalls each failure by a second.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }));

  render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </QueryClientProvider>
    </StrictMode>,
  );

  return { router, user: userEvent.setup() };
}
