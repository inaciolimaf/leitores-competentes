import { createLazyRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { PdfReadyScreen } from "@/pdf/PdfReadyScreen";
import { useSession } from "@/session/SessionContext";

export const Route = createLazyRoute("/simulado/pronto")({ component: PdfReadyRoute });

function PdfReadyRoute() {
  const navigate = useNavigate();
  const { pdfUrl, reset } = useSession();

  if (!pdfUrl) return <Navigate to="/" replace />;

  return (
    <PdfReadyScreen
      pdfUrl={pdfUrl}
      onReset={() => {
        reset();
        navigate({ to: "/" });
      }}
    />
  );
}
