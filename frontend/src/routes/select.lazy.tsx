import { createLazyRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { SelectScreen } from "@/pdf/SelectScreen";
import { useSession } from "@/session/SessionContext";

export const Route = createLazyRoute("/simulado")({ component: SelectRoute });

function SelectRoute() {
  const navigate = useNavigate();
  const { questions, setPdfUrl, reset } = useSession();

  if (questions.length === 0) return <Navigate to="/" replace />;

  return (
    <SelectScreen
      questions={questions}
      onGenerateSuccess={(url) => {
        setPdfUrl(url);
        navigate({ to: "/simulado/pronto" });
      }}
      onCancel={() => {
        reset();
        navigate({ to: "/" });
      }}
    />
  );
}
