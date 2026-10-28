
export const API_URL = "http://localhost:8080";

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

type Usuario = {
  id: string;
  email: string;
  role: string;
};

type RespostaLogin = {
  mensagem: string;
  token: string;
  usuario: Usuario;
};

function obterToken() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    throw new Error("Faça login novamente.");
  }

  return token;
}

export async function buscarTrilhas() {
  const resposta = await fetch(`${API_URL}/trilhas`);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar trilhas.");
  }

  return await resposta.json();
}

export async function fazerLogin(
  email: string,
  password: string
): Promise<RespostaLogin> {

  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.mensagem || "Erro ao realizar login."
    );
  }

  return dados;
}

export async function enviarImagemTrilha(
  arquivo: File
): Promise<string> {

  const formulario = new FormData();

  formulario.append("imagem", arquivo);

  const resposta = await fetch(`${API_URL}/trilhas/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${obterToken()}`
    },
    body: formulario
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Erro ao enviar imagem."
    );
  }

  return resultado.imagem_url;
}

export async function criarTrilha(dados: DadosTrilha) {

  const resposta = await fetch(`${API_URL}/trilhas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obterToken()}`
    },
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Erro ao cadastrar trilha."
    );
  }

  return resultado.trilha;
}

export async function atualizarTrilha(
  id: string,
  dados: Partial<DadosTrilha>
) {

  const resposta = await fetch(`${API_URL}/trilhas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obterToken()}`
    },
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Erro ao atualizar trilha."
    );
  }

  return resultado.trilha;
}

export async function excluirTrilha(id: string) {

  const resposta = await fetch(`${API_URL}/trilhas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${obterToken()}`
    }
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Erro ao excluir trilha."
    );
  }

  return resultado;
}
