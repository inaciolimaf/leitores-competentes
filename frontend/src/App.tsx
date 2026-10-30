import { useState } from "react";
import { QuestionForm } from "./components/QuestionForm";
import { QuizResults } from "./components/QuizResults";
import { SimuladoSelect } from "./components/SimuladoSelect";
import { QuizScreen } from "./quiz/QuizScreen";
import { Button } from "./components/ui/button";
import type { Question, GenerateRequest } from "./lib/api";
import { generateQuestions } from "./lib/api";

type AppView = "form" | "quiz" | "results" | "simulado_select" | "simulado_preview";

function App() {
  const [view, setView] = useState<AppView>("form");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    Record<number, { selected: string; correct: boolean; descriptor: string }>
  >({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async (params: GenerateRequest, mode: "interactive" | "simulado") => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateQuestions(params);
      setQuestions(result);
      setCurrentIndex(0);
      setAnswers({});
      if (mode === "interactive") {
        setView("quiz");
      } else {
        setView("simulado_select");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (
    questionId: number,
    selectedLetter: string,
    isCorrect: boolean
  ) => {
    const question = questions.find((q) => q.id === questionId);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selected: selectedLetter,
        correct: isCorrect,
        descriptor: question?.descriptor || "",
      },
    }));
  };

  const handleReset = () => {
    setView("form");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setError(null);
  };

  if (view === "quiz" && questions.length > 0) {
    return (
      <QuizScreen
        questions={questions}
        index={currentIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onGoTo={setCurrentIndex}
        onFinish={() => setView("results")}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Subtle professional background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-slate-200">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl">📘</span>
            <div>
              <h1 className="font-heading text-xl font-bold text-slate-800">
                Leitores Competentes
              </h1>
              <p className="text-xs text-slate-500">
                Gerador de Avaliações Diagnósticas
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {view !== "form" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                ← Nova Geração
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8 pb-16 relative z-10">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-3.5 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm animate-fade-in-up">
            <span>⚠️</span>
            <p className="flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-200 text-lg p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form View */}
        {view === "form" && (
          <div className="animate-fade-in-up">
            <QuestionForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        )}

        {/* Results View */}
        {view === "results" && (
          <div className="animate-fade-in-up">
            <QuizResults
              results={answers}
              totalQuestions={questions.length}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Simulado Views */}
        {view === "simulado_select" && (
          <SimuladoSelect 
            questions={questions}
            onCancel={handleReset}
            onGenerateSuccess={(url) => {
              setPdfUrl(url);
              setView("simulado_preview");
            }}
          />
        )}

        {view === "simulado_preview" && (
          <div className="max-w-2xl mx-auto flex flex-col items-center bg-white p-10 rounded-2xl border border-slate-200 shadow-xl animate-fade-in-up">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">Simulado Gerado!</h2>
            <p className="text-slate-500 text-center mb-8">
              O PDF foi gerado com sucesso e está pronto para impressão. As imagens foram processadas e incluídas no arquivo.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleReset}>Voltar ao Início</Button>
              <a href={pdfUrl || "#"} target="_blank" rel="noreferrer">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">
                  📥 Baixar / Ver PDF
                </Button>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 font-medium border-t border-slate-200 relative z-10 bg-white/50 backdrop-blur-sm">
        Sistema de Avaliação Diagnóstica — Leitores Competentes © 2026
      </footer>
    </div>
  );
}

export default App;
