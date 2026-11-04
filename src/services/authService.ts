import http, { executarRequisicao } from "./http";

type Usuario = {
  id: string;
  email: string;
  role: string;
};

export type RespostaLogin = {
  mensagem: string;
  token: string;
  usuario: Usuario;
};

export function fazerLogin(
  email: string,
  password: string
): Promise<RespostaLogin> {
  return executarRequisicao(
    http.post<RespostaLogin>("/auth/login", { email, password }),
    "Erro ao realizar login."
  );
}
