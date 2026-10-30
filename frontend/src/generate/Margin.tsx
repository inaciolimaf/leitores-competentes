import type { GenerateMode, Option } from "./options";
import { DIFFICULTIES, FORMATS, QUANTITY } from "./options";

interface MarginProps {
  mode: GenerateMode;
  difficulty: string;
  quantity: number;
  onMode: (mode: GenerateMode) => void;
  onDifficulty: (difficulty: string) => void;
  onQuantity: (quantity: number) => void;
}

export function Margin({ mode, difficulty, quantity, onMode, onDifficulty, onQuantity }: MarginProps) {
  return (
    <div id="generate-options" className="generate-margin">
      <Choice legend="Formato" name="mode" options={FORMATS} value={mode} onChange={onMode} />
      <Choice
        legend="Dificuldade"
        name="difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={onDifficulty}
      />
      <div>
        <div className="quantity-head">
          <label htmlFor="generate-quantity" className="generate-legend">
            Quantidade de questões
          </label>
          <span className="quantity-value">{quantity}</span>
        </div>
        <input
          id="generate-quantity"
          type="range"
          className="paper-range"
          min={QUANTITY.min}
          max={QUANTITY.max}
          value={quantity}
          aria-valuetext={`${quantity} ${quantity === 1 ? "questão" : "questões"}`}
          onChange={(e) => onQuantity(Number(e.target.value))}
        />
        <div className="quantity-scale" aria-hidden="true">
          <span>{QUANTITY.min}</span>
          <span>{QUANTITY.max}</span>
        </div>
      </div>
    </div>
  );
}

interface ChoiceProps<T extends string> {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

function Choice<T extends string>({ legend, name, options, value, onChange }: ChoiceProps<T>) {
  return (
    <fieldset>
      <legend className="generate-legend">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="choice" data-chosen={option.value === value}>
          <input
            type="radio"
            className="paper-radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span>
            <span className="choice-label">{option.label}</span>
            <span className="choice-hint">{option.hint}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
