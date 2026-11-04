import http, { executarRequisicao } from "./http";

export type DadosTrilha = {
  nome: string;
  descricao: string;
  dificuldade: string;
  distancia_km: number;
  duracao_minutos: number;
  localizacao: string;
  imagem_url?: string;
  parque: string;
};

export function buscarTrilhas() {
  return executarRequisicao(
    http.get("/trilhas"),
    "Erro ao buscar trilhas."
  );
}

export async function enviarImagemTrilha(arquivo: File): Promise<string> {
  const formulario = new FormData();
  formulario.append("imagem", arquivo);

  const resultado = await executarRequisicao<{ imagem_url: string }>(
    http.post("/trilhas/upload", formulario),
    "Erro ao enviar imagem."
  );

  return resultado.imagem_url;
}

export async function criarTrilha(dados: DadosTrilha) {
  const resultado = await executarRequisicao<{ trilha: unknown }>(
    http.post("/trilhas", dados),
    "Erro ao cadastrar trilha."
  );

  return resultado.trilha;
}

export async function atualizarTrilha(
  id: string,
  dados: Partial<DadosTrilha>
) {
  const resultado = await executarRequisicao<{ trilha: unknown }>(
    http.put(`/trilhas/${id}`, dados),
    "Erro ao atualizar trilha."
  );

  return resultado.trilha;
}

export function excluirTrilha(id: string) {
  return executarRequisicao(
    http.delete(`/trilhas/${id}`),
    "Erro ao excluir trilha."
  );
}
