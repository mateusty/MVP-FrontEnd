import http, { executarRequisicao } from "./http";

export function marcarPresenca(eventId: string) {
  return executarRequisicao(
    http.post(`/presencas/${eventId}/presenca`),
    "Erro ao marcar presença."
  );
}

export function desmarcarPresenca(eventId: string) {
  return executarRequisicao(
    http.delete(`/presencas/${eventId}/presenca`),
    "Erro ao desmarcar presença."
  );
}

export function removerPresenca(presencaId: string) {
  return executarRequisicao(
    http.delete(`/presencas/admin/${presencaId}`),
    "Erro ao remover a presença."
  );
}