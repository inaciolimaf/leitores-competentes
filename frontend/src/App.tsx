import { useState, useRef, useEffect } from "react";
import { QuestionForm } from "./components/QuestionForm";
import { QuestionCard } from "./components/QuestionCard";
import { QuizResults } from "./components/QuizResults";
import { SimuladoSelect } from "./components/SimuladoSelect";
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
  const quizRef = useRef<HTMLDivElement>(null);

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

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setView("results");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setView("form");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setError(null);
  };

  // Scroll to top when question changes
  useEffect(() => {
    quizRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIndex]);

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
      <main ref={quizRef} className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8 pb-16 relative z-10">
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

        {/* Quiz View */}
        {view === "quiz" && questions.length > 0 && (
          <div className="max-w-[800px] mx-auto animate-fade-in-up">
            {/* Progress bar */}
            <div className="mb-7">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium">Progresso da Avaliação: {Object.keys(answers).length} de {questions.length}</span>
                <span className="font-medium text-primary">{Math.round((Object.keys(answers).length / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-[width] duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <QuestionCard
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-7 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="w-28 text-slate-600 border-slate-300"
              >
                ← Voltar
              </Button>
              
              <div className="flex justify-center gap-1.5 flex-wrap px-4">
                {questions.map((q, i) => {
                  const isActive = i === currentIndex;
                  const answer = answers[q.id];
                  let dotClasses =
                    "w-7 h-7 rounded-full text-[0.65rem] font-semibold flex items-center justify-center transition-all duration-200 border-2 cursor-pointer";

                  if (isActive) {
                    dotClasses += " border-primary bg-primary text-white shadow-sm";
                  } else if (answer?.correct) {
                    dotClasses += " border-emerald-500 bg-emerald-50 text-emerald-600";
                  } else if (answer && !answer.correct) {
                    dotClasses += " border-red-500 bg-red-50 text-red-600";
                  } else {
                    dotClasses += " border-slate-200 bg-slate-50 text-slate-400";
                  }

                  return (
                    <button
                      key={q.id}
                      className={dotClasses}
                      onClick={() => {
                        if (answers[q.id] || i === currentIndex) setCurrentIndex(i);
                      }}
                      disabled={!answers[q.id] && i !== currentIndex}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <Button 
                onClick={handleNext} 
                disabled={!answers[questions[currentIndex].id]}
                className="w-28 bg-primary hover:bg-primary/90 text-white shadow-sm"
              >
                {currentIndex === questions.length - 1 ? "Finalizar" : "Avançar →"}
              </Button>
            </div>
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
