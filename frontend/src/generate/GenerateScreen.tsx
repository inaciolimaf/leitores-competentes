import { useState } from "react";
import type { FormEvent } from "react";
import type { GenerateRequest } from "@/lib/api";
import { Book, Spread } from "@/book/Book";
import { Contents } from "./Contents";
import { GenerateFoot } from "./GenerateFoot";
import { Margin } from "./Margin";
import type { GenerateMode } from "./options";
import { QUANTITY, summarize } from "./options";
import { useDescriptors } from "./useDescriptors";
import type { DescriptorsState } from "./useDescriptors";
import { useIsOpenBook } from "./useIsOpenBook";

interface GenerateScreenProps {
  onSubmit: (params: GenerateRequest, mode: GenerateMode) => void;
  isLoading: boolean;
  error: string | null;
  onDismissError: () => void;
}

function missingReason(state: DescriptorsState) {
  if (state.status === "loading") return "Carregando os descritores…";
  if (state.status === "failed") return "Sem os descritores não é possível gerar.";
  return "Escolha ao menos um descritor para gerar.";
}

export function GenerateScreen({ onSubmit, isLoading, error, onDismissError }: GenerateScreenProps) {
  const { state, retry } = useDescriptors();
  const isOpenBook = useIsOpenBook();
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<GenerateMode>("interactive");
  const [difficulty, setDifficulty] = useState("médio");
  const [quantity, setQuantity] = useState(QUANTITY.initial);

  const toggle = (code: string) =>
    setSelected((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading || selected.length === 0) return;
    onSubmit({ quantity, difficulty, descriptors: selected }, mode);
  };

  const count = selected.length;
  const contents = <Contents state={state} selected={selected} onToggle={toggle} onRetry={retry} />;
  const margin = (
    <Margin
      mode={mode}
      difficulty={difficulty}
      quantity={quantity}
      onMode={setMode}
      onDifficulty={setDifficulty}
      onQuantity={setQuantity}
    />
  );

  // The phone gets the descriptors first in the DOM, not through CSS order, so that
  // reading and tab order stay the same as what is on screen.
  return (
    <Book section="Leitores Competentes" sectionDetail="Sumário">
      <form className="generate-form contents" onSubmit={submit}>
        <Spread
          left={isOpenBook ? margin : contents}
          leftLabel={isOpenBook ? "Opções da avaliação" : "Descritores"}
          right={isOpenBook ? contents : margin}
          rightLabel={isOpenBook ? "Descritores" : "Opções da avaliação"}
        />
        <GenerateFoot
          hint={count > 0 ? summarize({ count, quantity, difficulty, mode }) : missingReason(state)}
          canGenerate={count > 0}
          isLoading={isLoading}
          error={error}
          onDismissError={onDismissError}
        />
      </form>
    </Book>
  );
}
