import { useState, useEffect } from "react";
import type { Descriptor, GenerateRequest } from "@/lib/api";
import { fetchDescriptors } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuestionFormProps {
  onSubmit: (params: GenerateRequest, mode: "interactive" | "simulado") => void;
  isLoading: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: "fácil", label: "Fácil", emoji: "🟢", desc: "Textos curtos, perguntas diretas" },
  { value: "médio", label: "Médio", emoji: "🟡", desc: "Textos moderados, mais atenção" },
  { value: "difícil", label: "Difícil", emoji: "🔴", desc: "Textos complexos, distratores sutis" },
];

export function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [difficulty, setDifficulty] = useState("médio");
  const [mode, setMode] = useState<"interactive" | "simulado">("interactive");
  const [loadingDescriptors, setLoadingDescriptors] = useState(true);

  useEffect(() => {
    fetchDescriptors()
      .then((d) => {
        setDescriptors(d);
        setSelectedDescriptors([]);
      })
      .catch(console.error)
      .finally(() => setLoadingDescriptors(false));
  }, []);

  const toggleDescriptor = (code: string) => {
    setSelectedDescriptors((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDescriptors.length === 0) return;
    onSubmit({ quantity, difficulty, descriptors: selectedDescriptors }, mode);
  };

  return (
    <Card className="border-slate-200 bg-white shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="text-5xl mb-3">📚</div>
        <CardTitle className="font-heading text-2xl text-slate-800">
          Gerar Avaliação Diagnóstica
        </CardTitle>
        <CardDescription className="text-slate-500">
          Configure os parâmetros para gerar questões alinhadas a matriz de referência - Língua Portuguesa
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖥️</span>
              <Label className="text-sm font-semibold">Formato da Avaliação</Label>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-xl h-14">
              <button 
                type="button"
                className={`flex-1 flex justify-center items-center text-sm font-semibold rounded-lg transition-all ${mode === "interactive" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => setMode("interactive")}
              >
                Modo Interativo (Web)
              </button>
              <button 
                type="button"
                className={`flex-1 flex justify-center items-center text-sm font-semibold rounded-lg transition-all ${mode === "simulado" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => setMode("simulado")}
              >
                PDF Simulado (Impressão)
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <Label className="text-sm font-semibold">Quantidade de Questões</Label>
              <Badge className="ml-auto bg-primary/90 text-primary-foreground">{quantity}</Badge>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
                bg-slate-200
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200
                [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>30</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <Label className="text-sm font-semibold">Nível de Dificuldade</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    ${difficulty === opt.value
                      ? "border-primary bg-blue-50/50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50"
                    }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-sm font-semibold text-slate-800">{opt.label}</span>
                  <span className="text-[0.68rem] text-slate-500 leading-tight text-center">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Descriptors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <Label className="text-sm font-semibold">Descritores</Label>
              <Badge variant="secondary" className="ml-auto">
                {selectedDescriptors.length} selecionado(s)
              </Badge>
            </div>

            {loadingDescriptors ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded-xl animate-shimmer" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {descriptors.map((desc) => {
                  const isSelected = selectedDescriptors.includes(desc.code);
                  return (
                    <button
                      key={desc.code}
                      type="button"
                      onClick={() => toggleDescriptor(desc.code)}
                      className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                        hover:-translate-y-0.5
                        ${isSelected
                          ? "border-primary bg-blue-50/50"
                          : "border-slate-200 bg-white hover:border-primary/40 focus:ring-2 focus:ring-primary/20"
                        }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`font-heading font-bold text-sm ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                          {desc.code}
                        </span>
                        <Checkbox
                          checked={isSelected}
                          className="pointer-events-none"
                          tabIndex={-1}
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc.name}</p>
                      {desc.needs_image && (
                        <Badge variant="outline" className="w-fit text-[0.65rem] border-blue-200 text-blue-700 bg-blue-50">
                          🖼️ Requer imagem
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || selectedDescriptors.length === 0}
            className="w-full h-13 text-base font-semibold bg-primary hover:bg-primary/90 text-white
              shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin-slow" />
                Gerando questões com IA...
              </>
            ) : (
              <>
                <span>✨</span>
                Gerar Questões
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
