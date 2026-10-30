import { Link } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Book, Spread } from "./Book";
import { Notice } from "./Notice";
import { ScreenTitle } from "./ScreenTitle";

export function NotFoundScreen() {
  return (
    <Book section="Página não encontrada">
      <Spread
        rightLabel="Página não encontrada"
        right={
          <>
            <ScreenTitle>Esta página não está no livro</ScreenTitle>
            <Link to="/" className="book-action book-action-quiet">
              Voltar ao início
            </Link>
          </>
        }
      />
    </Book>
  );
}

export function RouteErrorScreen({ reset }: ErrorComponentProps) {
  return (
    <Book section="Algo deu errado">
      <Spread
        rightLabel="Algo deu errado"
        right={
          <>
            <ScreenTitle>Não foi possível abrir esta página</ScreenTitle>
            <Notice message="Algo falhou ao abrir a página." actionLabel="Tentar de novo" onAction={reset} />
          </>
        }
      />
    </Book>
  );
}
