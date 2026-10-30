import { createLazyRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { QuizScreen } from "@/quiz/QuizScreen";
import { useSession } from "@/session/SessionContext";

export const Route = createLazyRoute("/questao/$numero")({ component: QuestionRoute });

function QuestionRoute() {
  const { numero } = Route.useParams();
  const navigate = useNavigate();
  const { questions, answers, answer } = useSession();

  if (questions.length === 0) return <Navigate to="/" replace />;

  const firstOpen = questions.findIndex((q) => !answers[q.id]);
  const lastReachable = firstOpen === -1 ? questions.length - 1 : firstOpen;
  const index = Number(numero) - 1;
  if (!Number.isInteger(index) || index < 0 || index > lastReachable) {
    return <Navigate to="/questao/$numero" params={{ numero: String(lastReachable + 1) }} replace />;
  }

  return (
    <QuizScreen
      questions={questions}
      index={index}
      answers={answers}
      onAnswer={answer}
      onGoTo={(i) => navigate({ to: "/questao/$numero", params: { numero: String(i + 1) } })}
      onFinish={() => navigate({ to: "/resultado" })}
    />
  );
}
