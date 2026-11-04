import axios, { type AxiosResponse } from "axios";

export const API_URL = "http://localhost:8080";

const http = axios.create({
  baseURL: API_URL
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type ErroApi = {
  mensagem?: string;
};

export async function executarRequisicao<T>(
  requisicao: Promise<AxiosResponse<T>>,
  mensagemPadrao: string
): Promise<T> {
  try {
    const resposta = await requisicao;
    return resposta.data;
  } catch (erro) {
    if (axios.isAxiosError<ErroApi>(erro)) {
      throw new Error(erro.response?.data?.mensagem || mensagemPadrao);
    }

    throw erro;
  }
}

export default http;
