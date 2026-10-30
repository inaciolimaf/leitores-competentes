import { useRef } from "react";
import type { Descriptor } from "@/lib/api";
import { Notice } from "@/book/Notice";
import { ScreenTitle } from "@/book/ScreenTitle";
import type { DescriptorsState } from "./useDescriptors";

interface ContentsProps {
  state: DescriptorsState;
  selected: string[];
  onToggle: (code: string) => void;
  onRetry: () => void;
}

const PLACEHOLDER_LINES = Array.from({ length: 8 }, (_, i) => i);

export function Contents({ state, selected, onToggle, onRetry }: ContentsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const retry = () => {
    onRetry();
    headingRef.current?.focus();
  };

  return (
    <>
      <ScreenTitle>Gerar avaliação</ScreenTitle>
      <h2 ref={headingRef} id="generate-descriptors" tabIndex={-1} className="generate-heading">
        Escolha os descritores
      </h2>
      <div role="status" className="sr-only">
        {state.status === "loading" && "Carregando os descritores…"}
      </div>
      {state.status === "loading" && <Placeholder />}
      {state.status === "failed" && (
        <Notice
          message="Não foi possível carregar os descritores."
          actionLabel="Tentar de novo"
          onAction={retry}
        />
      )}
      {state.status === "ready" && state.descriptors.length === 0 && (
        <p>Nenhum descritor disponível no momento.</p>
      )}
      {state.status === "ready" && state.descriptors.length > 0 && (
        <fieldset aria-labelledby="generate-descriptors">
          <ul>
            {state.descriptors.map((descriptor) => (
              <DescriptorLine
                key={descriptor.code}
                descriptor={descriptor}
                chosen={selected.includes(descriptor.code)}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </fieldset>
      )}
    </>
  );
}

interface DescriptorLineProps {
  descriptor: Descriptor;
  chosen: boolean;
  onToggle: (code: string) => void;
}

function DescriptorLine({ descriptor, chosen, onToggle }: DescriptorLineProps) {
  return (
    <li>
      <label className="toc-line" data-chosen={chosen}>
        <span className="toc-code">{descriptor.code}</span>
        <span className="toc-body">
          <span className="toc-name">{descriptor.name}</span>
          <span className="toc-leader" aria-hidden="true" />
          {descriptor.needs_image && <span className="toc-note">precisa de imagem</span>}
        </span>
        <input
          type="checkbox"
          className="paper-check"
          checked={chosen}
          onChange={() => onToggle(descriptor.code)}
        />
      </label>
    </li>
  );
}

function Placeholder() {
  return (
    <div aria-hidden="true">
      {PLACEHOLDER_LINES.map((line) => (
        <div key={line} className="toc-line toc-waiting">
          <span className="toc-bar" />
          <span className="toc-bar" />
          <span className="toc-bar toc-bar-box" />
        </div>
      ))}
    </div>
  );
}
