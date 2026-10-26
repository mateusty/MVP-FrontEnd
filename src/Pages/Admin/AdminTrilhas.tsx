
import { useEffect, useState, type FormEvent } from "react";

import {
  buscarTrilhas,
  criarTrilha,
  atualizarTrilha,
  excluirTrilha,
  type DadosTrilha
} from "../../services/Api";

type Trilha = {
  id: string;
  nome: string;
  descricao: string;
  dificuldade: string;
  distancia_km: number | string;
  duracao_minutos: number;
  localizacao: string;
  imagem_url: string | null;
  parque: string | null;
};

const formularioVazio: DadosTrilha = {
  nome: "",
  descricao: "",
  dificuldade: "facil",
  distancia_km: 0,
  duracao_minutos: 0,
  localizacao: "",
  imagem_url: "",
  parque: ""
};

const nomesParques: Record<string, string> = {
  parnaso: "Serra dos Órgãos",
  "tres-picos": "Três Picos",
  "montanhas-tere": "Montanhas de Teresópolis"
};

export const AdminTrilhas = () => {

  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [formulario, setFormulario] = useState<DadosTrilha>({
    ...formularioVazio
  });

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const usuario = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("usuario") || "null");
    } catch {
      return null;
    }
  })();

  const admin = usuario?.role === "admin";
  const token = sessionStorage.getItem("token");

  async function carregarTrilhas() {
    const dados: Trilha[] = await buscarTrilhas();
    setTrilhas(dados);
  }

  useEffect(() => {
    if (!admin || !token) return;

    buscarTrilhas()
      .then(setTrilhas)
      .catch(() => setErro("Erro ao carregar trilhas."));
  }, [admin, token]);

  function alterarCampo(
    campo: keyof DadosTrilha,
    valor: string | number
  ) {
    setFormulario(anterior => ({
      ...anterior,
      [campo]: valor
    }));
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario({ ...formularioVazio });
    setErro("");
  }

  function editar(trilha: Trilha) {
    setEditandoId(trilha.id);

    setFormulario({
      nome: trilha.nome,
      descricao: trilha.descricao || "",
      dificuldade: trilha.dificuldade,
      distancia_km: Number(trilha.distancia_km),
      duracao_minutos: trilha.duracao_minutos,
      localizacao: trilha.localizacao,
      imagem_url: trilha.imagem_url || "",
      parque: trilha.parque || ""
    });

    setMensagem("");
    setErro("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!formulario.parque) {
      setErro("Selecione o parque da trilha.");
      return;
    }

    setSalvando(true);

    try {
      if (editandoId) {
        await atualizarTrilha(editandoId, formulario);
        setMensagem("Trilha atualizada com sucesso!");
      } else {
        await criarTrilha(formulario);
        setMensagem("Trilha cadastrada com sucesso!");
      }

      await carregarTrilhas();

      setEditandoId(null);
      setFormulario({ ...formularioVazio });

    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao salvar trilha."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: string) {
    const confirmado = window.confirm(
      "Tem certeza que deseja excluir esta trilha?"
    );

    if (!confirmado) return;

    setMensagem("");
    setErro("");

    try {
      await excluirTrilha(id);
      await carregarTrilhas();

      if (editandoId === id) {
        cancelarEdicao();
      }

      setMensagem("Trilha excluída com sucesso!");

    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao excluir trilha."
      );
    }
  }

  if (!admin || !token) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Acesso restrito</h2>
        <p>Somente administradores podem acessar esta página.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20
      }}
    >
      <h1>Painel Administrativo</h1>

      <h2>
        {editandoId ? "Editar trilha" : "Cadastrar trilha"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12 }}
      >

        <label>
          Nome
          <input
            type="text"
            required
            value={formulario.nome}
            onChange={e => alterarCampo("nome", e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Descrição
          <textarea
            rows={4}
            value={formulario.descricao}
            onChange={e => alterarCampo("descricao", e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Parque
          <select
            required
            value={formulario.parque}
            onChange={e => alterarCampo("parque", e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Selecione um parque</option>
            <option value="parnaso">Serra dos Órgãos</option>
            <option value="tres-picos">Três Picos</option>
            <option value="montanhas-tere">
              Montanhas de Teresópolis
            </option>
          </select>
        </label>

        <label>
          Dificuldade
          <select
            value={formulario.dificuldade}
            onChange={e => alterarCampo("dificuldade", e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>

        <label>
          Distância (km)
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={formulario.distancia_km || ""}
            onChange={e =>
              alterarCampo("distancia_km", Number(e.target.value))
            }
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Duração (minutos)
          <input
            type="number"
            min="1"
            step="1"
            required
            value={formulario.duracao_minutos || ""}
            onChange={e =>
              alterarCampo("duracao_minutos", Number(e.target.value))
            }
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Localização
          <input
            type="text"
            required
            value={formulario.localizacao}
            onChange={e =>
              alterarCampo("localizacao", e.target.value)
            }
            style={{ width: "100%" }}
          />
        </label>

        <label>
          Caminho da imagem
          <input
            type="text"
            placeholder="/trilhas/nomeDaImagem.jpg"
            value={formulario.imagem_url || ""}
            onChange={e =>
              alterarCampo("imagem_url", e.target.value)
            }
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit" disabled={salvando}>
          {salvando
            ? "Salvando..."
            : editandoId
              ? "Salvar alterações"
              : "Cadastrar trilha"}
        </button>

        {editandoId && (
          <button
            type="button"
            onClick={cancelarEdicao}
          >
            Cancelar edição
          </button>
        )}

      </form>

      {mensagem && <p role="status">{mensagem}</p>}

      {erro && (
        <p role="alert" style={{ color: "red" }}>
          {erro}
        </p>
      )}

      <h2>Trilhas cadastradas</h2>

      {trilhas.map(trilha => (
        <div
          key={trilha.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 16,
            marginBottom: 12
          }}
        >
          <h3>{trilha.nome}</h3>

          <p>{trilha.descricao}</p>

          <p>
            Parque: {nomesParques[trilha.parque || ""] || "Não definido"}
          </p>

          <p>Dificuldade: {trilha.dificuldade}</p>

          <p>Distância: {trilha.distancia_km} km</p>

          <p>Duração: {trilha.duracao_minutos} minutos</p>

          <p>Localização: {trilha.localizacao}</p>

          {trilha.imagem_url && (
            <img
              src={trilha.imagem_url}
              alt={trilha.nome}
              width={200}
              style={{
                display: "block",
                marginBottom: 12,
                borderRadius: 8
              }}
            />
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => editar(trilha)}
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => remover(trilha.id)}
              style={{
                backgroundColor: "#a52a2a",
                color: "white"
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </main>
  );
};
