import { createLazyRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { GenerateScreen } from "@/generate/GenerateScreen";
import type { GenerateMode } from "@/generate/options";
import type { GenerateRequest } from "@/lib/api";
import { generateQuestions } from "@/lib/api";
import { useSession } from "@/session/SessionContext";

export const Route = createLazyRoute("/")({ component: GenerateRoute });

function GenerateRoute() {
  const navigate = useNavigate();
  const { start } = useSession();
  const generation = useMutation({ mutationFn: generateQuestions });

  const submit = (params: GenerateRequest, mode: GenerateMode) =>
    generation.mutate(params, {
      onSuccess: (questions) => {
        start(questions);
        if (mode === "interactive") navigate({ to: "/questao/$numero", params: { numero: "1" } });
        else navigate({ to: "/simulado" });
      },
    });

  return (
    <GenerateScreen
      onSubmit={submit}
      isLoading={generation.isPending}
      error={generation.error?.message ?? null}
      onDismissError={generation.reset}
    />
  );
}
