import { useState } from "react";
import type { Question } from "@/lib/api";
import { exportPdf } from "@/lib/api";
import { QuestionText } from "./QuestionText";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SimuladoSelectProps {
  questions: Question[];
  onGenerateSuccess: (pdfUrl: string) => void;
  onCancel: () => void;
}

export function SimuladoSelect({ questions, onGenerateSuccess, onCancel }: SimuladoSelectProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>(questions.map(q => q.id));
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedIds.length === 0) return;
    setIsExporting(true);
    setError(null);
    try {
      const selectedQuestions = questions.filter(q => selectedIds.includes(q.id));
      const res = await exportPdf({
        title: "Simulado de Leitura",
        questions: selectedQuestions
      });
      onGenerateSuccess(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-slate-200 bg-white shadow-lg rounded-2xl overflow-hidden max-w-2xl mx-auto animate-slide-up">
      <CardHeader className="text-center pb-4 pt-8 bg-slate-50 border-b border-slate-100">
        <div className="text-4xl mb-3">📄</div>
        <CardTitle className="font-heading text-2xl text-slate-800">
          Selecione as Questões
        </CardTitle>
        <CardDescription className="text-slate-500">
          Escolha quais questões recém-geradas irão constar no seu arquivo PDF impresso.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center px-2 pb-2">
            <span className="text-sm font-semibold text-slate-600">
              {selectedIds.length} selecionadas de {questions.length}
            </span>
            <button 
              className="text-xs text-primary font-medium hover:underline"
              onClick={() => setSelectedIds(selectedIds.length === questions.length ? [] : questions.map(q => q.id))}
            >
              {selectedIds.length === questions.length ? "Desmarcar todas" : "Selecionar todas"}
            </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {questions.map((q, i) => {
            const isSelected = selectedIds.includes(q.id);
            return (
              <div 
                key={q.id} 
                className={`flex gap-4 p-5 border-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? "border-primary bg-blue-50/20" : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50"
                }`}
                onClick={() => toggleSelect(q.id)}
              >
                <div className="pt-1 shrink-0">
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-800 text-sm">Questão {i + 1}</span>
                    </div>
                    <span className="text-xs font-bold text-primary px-2 py-1 bg-blue-50 border border-blue-100 rounded-md shrink-0">
                      {q.descriptor}
                    </span>
                  </div>

                  <QuestionText 
                    text={q.text} 
                    className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100" 
                  />

                  {q.support_image_url && (
                    <div className="w-full flex justify-center py-2 bg-slate-50 border border-slate-100 rounded">
                      <img 
                        src={q.support_image_url} 
                        alt="Imagem da questão" 
                        className="max-h-64 object-contain rounded-md"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}

                  <p className="text-sm font-semibold text-slate-800">{q.statement}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.alternatives.map((alt) => (
                      <div 
                        key={alt.letter} 
                        className={`text-xs p-2 rounded border ${
                          alt.letter === q.correct_answer 
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium" 
                            : "border-slate-100 bg-white text-slate-600"
                        }`}
                      >
                        <span className="font-bold mr-1.5">{alt.letter})</span>
                        {alt.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isExporting}
            className="flex-1 border-slate-200"
          >
            Sair
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting || selectedIds.length === 0}
            className="flex-1 bg-primary text-white shadow-md hover:shadow-lg"
          >
            {isExporting ? <span className="animate-spin-slow">⏳</span> : "📄"} 
            {isExporting ? " Gerando PDF..." : " Gerar PDF do Simulado"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
