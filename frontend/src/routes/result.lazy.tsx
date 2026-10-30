import { createLazyRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { ResultScreen } from "@/result/ResultScreen";
import { useSession } from "@/session/SessionContext";

export const Route = createLazyRoute("/resultado")({ component: ResultRoute });

function ResultRoute() {
  const navigate = useNavigate();
  const { questions, answers, reset } = useSession();

  if (questions.length === 0) return <Navigate to="/" replace />;

  return (
    <ResultScreen
      results={answers}
      totalQuestions={questions.length}
      onReset={() => {
        reset();
        navigate({ to: "/" });
      }}
    />
  );
}
