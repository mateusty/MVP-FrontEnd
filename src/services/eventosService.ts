import http, { executarRequisicao } from "./http";

export type DadosEvento = {
  atividade: string;
  descricao: string;
  capacidade_maxima: number;
  data_evento: string;
  localizacao: string;
  google_maps_url?: string | null;
  parque: string;
};

export function buscarEventos() {
  return executarRequisicao(
    http.get("/eventos"),
    "Erro ao buscar eventos."
  );
}

export function criarEvento(dados: DadosEvento) {
  return executarRequisicao(
    http.post("/eventos", dados),
    "Erro ao salvar evento."
  );
}

export function atualizarEvento(id: string | number, dados: DadosEvento) {
  return executarRequisicao(
    http.put(`/eventos/${id}`, dados),
    "Erro ao salvar evento."
  );
}

export function excluirEvento(id: string | number) {
  return executarRequisicao(
    http.delete(`/eventos/${id}`),
    "Erro ao excluir evento."
  );
}
