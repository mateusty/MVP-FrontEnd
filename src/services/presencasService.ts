import http, { executarRequisicao } from "./http";

export function marcarPresenca(eventId: string, nome: string, email: string) {
  return executarRequisicao(
    http.post(`/presencas/${eventId}/presenca`, { nome, email }),
    "Erro ao marcar presença."
  );
}

export function desmarcarPresenca(eventId: string, email: string) {
  return executarRequisicao(
    http.delete(`/presencas/${eventId}/presenca`, { data: { email } }),
    "Erro ao desmarcar presença."
  );
}

export function removerPresenca(presencaId: string) {
  return executarRequisicao(
    http.delete(`/presencas/admin/${presencaId}`),
    "Erro ao remover a presença."
  );
}
