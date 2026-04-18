const API_BASE = "/api";

export interface Alternative {
  letter: string;
  text: string;
}

export interface Question {
  id: number;
  descriptor: string;
  descriptor_description: string;
  text: string;
  support_image_url: string | null;
  statement: string;
  alternatives: Alternative[];
  correct_answer: string;
  explanation: string;
}

export interface GenerateRequest {
  quantity: number;
  difficulty: string;
  descriptors: string[];
}

export interface GenerateResponse {
  questions: Question[];
}

export interface Descriptor {
  code: string;
  name: string;
  description: string;
  needs_image: boolean;
}

export async function fetchDescriptors(): Promise<Descriptor[]> {
  const res = await fetch(`${API_BASE}/descriptors`);
  if (!res.ok) {
    throw new Error(`Erro ao buscar descritores: ${res.statusText}`);
  }
  const data = await res.json();
  return data.descriptors;
}

export async function generateQuestions(
  params: GenerateRequest
): Promise<Question[]> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Erro ao gerar questões");
  }

  const data: GenerateResponse = await res.json();
  return data.questions;
}

export interface ExportRequest {
  title: string;
  questions: Question[];
}

export async function exportPdf(params: ExportRequest): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Erro ao gerar PDF");
  }

  return res.json();
}
