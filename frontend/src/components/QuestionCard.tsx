import { useState } from "react";
import { QuestionText } from "./QuestionText";
import type { Question } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: number, selectedLetter: string, isCorrect: boolean) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (letter: string) => {
    if (hasAnswered) return;
    setSelectedAnswer(letter);
    setHasAnswered(true);
    onAnswer(question.id, letter, letter === question.correct_answer);
  };

  const getAlternativeClasses = (letter: string) => {
    const base =
      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full text-left text-sm font-medium";

    if (!hasAnswered) {
      return `${base} border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50 hover:translate-x-1`;
    }
    if (letter === question.correct_answer) {
      return `${base} border-emerald-500 bg-emerald-50 text-emerald-800 animate-pulse-scale`;
    }
    if (letter === selectedAnswer && letter !== question.correct_answer) {
      return `${base} border-red-500 bg-red-50 text-red-800 animate-shake`;
    }
    return `${base} border-slate-100 bg-slate-50 opacity-50 cursor-default`;
  };

  const getLetterClasses = (letter: string) => {
    const base =
      "flex items-center justify-center w-9 h-9 rounded-full font-heading font-bold text-sm shrink-0 transition-all duration-200 border-2";

    if (!hasAnswered) {
      return `${base} border-slate-200 bg-slate-50 text-slate-500`;
    }
    if (letter === question.correct_answer) {
      return `${base} border-emerald-500 bg-emerald-500 text-white`;
    }
    if (letter === selectedAnswer && letter !== question.correct_answer) {
      return `${base} border-red-500 bg-red-500 text-white`;
    }
    return `${base} border-slate-200 bg-white text-slate-400`;
  };

  return (
    <Card className="border-slate-200 bg-white shadow-lg rounded-2xl animate-slide-up overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
              Questão {questionNumber} / {totalQuestions}
            </span>
            <p className="text-xs text-slate-600 font-medium">
              {question.descriptor_description}
            </p>
          </div>
          <Badge className="bg-primary text-white shrink-0 shadow-sm border-0 font-heading font-bold">
            {question.descriptor}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        {/* Text */}
        <QuestionText 
          text={question.text} 
          className="bg-slate-50 border border-slate-200 border-l-4 border-l-primary rounded-lg p-6" 
        />

        {/* Support Image */}
        {question.support_image_url && (
          <div className="flex justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={question.support_image_url}
              alt="Imagem de suporte da questão"
              className="max-w-full lg:max-w-3xl max-h-[700px] rounded-lg object-contain shadow-sm lg:shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Statement */}
        <p className="text-[1.05rem] font-bold text-slate-900">{question.statement}</p>

        {/* Alternatives */}
        <div className="flex flex-col gap-2.5">
          {question.alternatives.map((alt) => (
            <button
              key={alt.letter}
              className={getAlternativeClasses(alt.letter)}
              onClick={() => handleSelect(alt.letter)}
              disabled={hasAnswered}
            >
              <span className={getLetterClasses(alt.letter)}>{alt.letter}</span>
              <span className="flex-1 text-slate-700">{alt.text}</span>
              {hasAnswered && alt.letter === question.correct_answer && (
                <span className="text-lg font-bold text-emerald-500">✓</span>
              )}
              {hasAnswered &&
                alt.letter === selectedAnswer &&
                alt.letter !== question.correct_answer && (
                  <span className="text-lg font-bold text-red-500">✗</span>
                )}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {hasAnswered && (
          <Alert
            className={`animate-fade-in-up border-l-4 rounded-xl shadow-sm ${
              selectedAnswer === question.correct_answer
                ? "border-l-emerald-500 bg-emerald-50 border-emerald-200"
                : "border-l-red-500 bg-red-50 border-red-200"
            }`}
          >
            <AlertTitle className={`font-bold ${
              selectedAnswer === question.correct_answer
                ? "text-emerald-700"
                : "text-red-700"
            }`}>
              {selectedAnswer === question.correct_answer
                ? "🎉 Resposta Correta!"
                : `❌ Resposta Incorreta. A correta é a letra ${question.correct_answer}.`}
            </AlertTitle>
            <AlertDescription className="text-sm text-slate-700 mt-2 leading-relaxed">
              {question.explanation}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
