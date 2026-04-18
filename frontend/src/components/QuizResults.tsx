import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizResultsProps {
  results: Record<number, { selected: string; correct: boolean; descriptor: string }>;
  totalQuestions: number;
  onReset: () => void;
}

export function QuizResults({ results, totalQuestions, onReset }: QuizResultsProps) {
  const answered = Object.values(results);
  const correctCount = answered.filter((r) => r.correct).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Group by descriptor
  const byDescriptor: Record<string, { correct: number; total: number }> = {};
  answered.forEach((r) => {
    if (!byDescriptor[r.descriptor]) {
      byDescriptor[r.descriptor] = { correct: 0, total: 0 };
    }
    byDescriptor[r.descriptor].total++;
    if (r.correct) byDescriptor[r.descriptor].correct++;
  });

  const getEmoji = () => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "👏";
    if (percentage >= 40) return "💪";
    return "📖";
  };

  const getMessage = () => {
    if (percentage >= 80) return "Excelente! Você domina os descritores!";
    if (percentage >= 60) return "Muito bem! Continue praticando!";
    if (percentage >= 40) return "Bom trabalho! Ainda há espaço para melhorar.";
    return "Continue estudando! A prática leva à perfeição.";
  };

  return (
    <Card className="border-slate-200 bg-white shadow-lg rounded-2xl overflow-hidden max-w-lg mx-auto">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="text-6xl animate-bounce-in mb-2">{getEmoji()}</div>
        <CardTitle className="font-heading text-2xl text-slate-800">
          Desempenho da Matriz
        </CardTitle>
        <p className="text-slate-500 mt-1">{getMessage()}</p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Score circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={percentage >= 60 ? "#10b981" : "#ef4444"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 327} 327`}
                transform="rotate(-90 60 60)"
                className="transition-[stroke-dasharray] duration-[1.5s] ease-[cubic-bezier(0.4,0,0.2,1)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-4xl font-extrabold text-slate-800 leading-none">
                {correctCount}
              </span>
              <span className="text-[0.65rem] text-slate-500">de</span>
              <span className="font-heading text-xl font-semibold text-slate-500 leading-none">
                {totalQuestions}
              </span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground font-medium mt-2">{percentage}%</span>
        </div>

        {/* By descriptor */}
        <div>
          <h3 className="font-heading font-semibold text-sm text-slate-500 uppercase tracking-wider mb-4 text-center">
            Desempenho por Descritor
          </h3>
          <div className="space-y-3">
            {Object.entries(byDescriptor).map(([code, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100);
              return (
                <div
                  key={code}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline" className="font-heading font-bold text-primary border-primary/30 bg-blue-50">
                      {code}
                    </Badge>
                    <span className="text-xs text-slate-600 font-medium bg-white px-2 py-1 rounded-md border border-slate-200">
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          pct >= 60 ? "#10b981" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset button */}
        <Button
          onClick={onReset}
          className="w-full h-13 text-base font-semibold bg-primary hover:bg-primary/90 text-white
            shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        >
          📝 Gerar Nova Matriz
        </Button>
      </CardContent>
    </Card>
  );
}
