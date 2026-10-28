
import { useEffect, useState, type FormEvent } from "react";

import {
  buscarTrilhas,
  criarTrilha,
  atualizarTrilha,
  excluirTrilha,
  enviarImagemTrilha,
  type DadosTrilha
} from "../../services/Api";

import styles from "./AdminTrilhas.module.css";

type Trilha = {
  id: string;
  nome: string;
  descricao: string | null;
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

  const [arquivoImagem, setArquivoImagem] = useState<File | null>(
    null
  );

  const [versaoInput, setVersaoInput] = useState(0);

  const [editandoId, setEditandoId] = useState<string | null>(
    null
  );

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [excluindoId, setExcluindoId] = useState<string | null>(
    null
  );

  let usuario = null;

  try {
    usuario = JSON.parse(
      sessionStorage.getItem("usuario") || "null"
    );
  } catch {
    usuario = null;
  }

  const token = sessionStorage.getItem("token");

  const admin = Boolean(
    token && usuario?.role === "admin"
  );

  async function carregarTrilhas() {
    const dados: Trilha[] = await buscarTrilhas();

    setTrilhas(dados);
  }

  useEffect(() => {
    if (!admin) return;

    let ativo = true;

    buscarTrilhas()
      .then((dados: Trilha[]) => {
        if (ativo) {
          setTrilhas(dados);
        }
      })
      .catch(() => {
        if (ativo) {
          setErro("Erro ao carregar trilhas.");
        }
      });

    return () => {
      ativo = false;
    };
  }, [admin]);

  function alterarCampo(
    campo: keyof DadosTrilha,
    valor: string | number
  ) {
    setFormulario(anterior => ({
      ...anterior,
      [campo]: valor
    }));
  }

  function limparImagemSelecionada() {
    setArquivoImagem(null);
    setVersaoInput(anterior => anterior + 1);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormulario({ ...formularioVazio });
    limparImagemSelecionada();
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

    limparImagemSelecionada();

    setMensagem("");
    setErro("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!formulario.parque) {
      setErro("Selecione o parque da trilha.");
      return;
    }

    if (
      arquivoImagem &&
      arquivoImagem.size > 5 * 1024 * 1024
    ) {
      setErro("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setSalvando(true);

    try {

      const dadosParaSalvar: DadosTrilha = {
        ...formulario
      };

      if (arquivoImagem) {
        const enderecoImagem = await enviarImagemTrilha(
          arquivoImagem
        );

        dadosParaSalvar.imagem_url = enderecoImagem;
      }

      if (editandoId) {

        await atualizarTrilha(
          editandoId,
          dadosParaSalvar
        );

        setMensagem("Trilha atualizada com sucesso!");

      } else {

        await criarTrilha(dadosParaSalvar);

        setMensagem("Trilha cadastrada com sucesso!");

      }

      await carregarTrilhas();

      setEditandoId(null);
      setFormulario({ ...formularioVazio });
      limparImagemSelecionada();

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

    setErro("");
    setMensagem("");
    setExcluindoId(id);

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

    } finally {
      setExcluindoId(null);
    }
  }

  if (!admin) {
    return (
      <main className={styles.painel}>
        <h2>Acesso restrito</h2>
        <p>
          Somente administradores podem acessar esta página.
        </p>
      </main>
    );
  }

  return (
    <main className={styles.painel}>

      <div className={styles.cabecalho}>
        <h1>Painel Administrativo</h1>
        <p>
          Gerencie as trilhas dos parques do Terê Verde.
        </p>
      </div>

      <section className={styles.cardFormulario}>

        <h2>
          {editandoId
            ? "Editar trilha"
            : "Cadastrar nova trilha"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className={styles.formulario}
        >

          <label className={styles.campo}>
            Nome da trilha

            <input
              type="text"
              required
              value={formulario.nome}
              onChange={e =>
                alterarCampo("nome", e.target.value)
              }
            />
          </label>

          <label className={styles.campo}>
            Parque

            <select
              required
              value={formulario.parque}
              onChange={e =>
                alterarCampo("parque", e.target.value)
              }
            >
              <option value="">
                Selecione um parque
              </option>

              <option value="parnaso">
                Serra dos Órgãos
              </option>

              <option value="tres-picos">
                Três Picos
              </option>

              <option value="montanhas-tere">
                Montanhas de Teresópolis
              </option>
            </select>
          </label>

          <label
            className={`${styles.campo} ${styles.campoGrande}`}
          >
            Descrição

            <textarea
              rows={4}
              value={formulario.descricao}
              onChange={e =>
                alterarCampo("descricao", e.target.value)
              }
            />
          </label>

          <label className={styles.campo}>
            Dificuldade

            <select
              value={formulario.dificuldade}
              onChange={e =>
                alterarCampo("dificuldade", e.target.value)
              }
            >
              <option value="facil">
                Fácil
              </option>

              <option value="medio">
                Médio
              </option>

              <option value="dificil">
                Difícil
              </option>
            </select>
          </label>

          <label className={styles.campo}>
            Localização

            <input
              type="text"
              required
              value={formulario.localizacao}
              onChange={e =>
                alterarCampo("localizacao", e.target.value)
              }
            />
          </label>

          <label className={styles.campo}>
            Distância (km)

            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={formulario.distancia_km || ""}
              onChange={e =>
                alterarCampo(
                  "distancia_km",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className={styles.campo}>
            Duração (minutos)

            <input
              type="number"
              min="1"
              step="1"
              required
              value={formulario.duracao_minutos || ""}
              onChange={e =>
                alterarCampo(
                  "duracao_minutos",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label
            className={`${styles.campo} ${styles.campoGrande}`}
          >
            Selecionar fotografia

            <input
              key={versaoInput}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={e =>
                setArquivoImagem(
                  e.target.files?.[0] || null
                )
              }
            />
          </label>

          <label
            className={`${styles.campo} ${styles.campoGrande}`}
          >
            Caminho da imagem (opcional)

            <input
              type="text"
              placeholder="/trilhas/nomeDaImagem.jpg"
              value={formulario.imagem_url || ""}
              onChange={e =>
                alterarCampo(
                  "imagem_url",
                  e.target.value
                )
              }
            />
          </label>

          <div className={styles.acoes}>

            <button
              type="submit"
              disabled={
                salvando || excluindoId !== null
              }
              className={styles.botaoPrincipal}
            >
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
                className={styles.botaoSecundario}
              >
                Cancelar edição
              </button>
            )}

          </div>

        </form>

        {mensagem && (
          <p
            className={styles.mensagem}
            role="status"
          >
            {mensagem}
          </p>
        )}

        {erro && (
          <p
            className={styles.erro}
            role="alert"
          >
            {erro}
          </p>
        )}

      </section>

      <h2 className={styles.tituloLista}>
        Trilhas cadastradas ({trilhas.length})
      </h2>

      <section className={styles.listaTrilhas}>

        {trilhas.map(trilha => (

          <article
            className={styles.cardTrilha}
            key={trilha.id}
          >

            {trilha.imagem_url ? (

              <img
                className={styles.imagemTrilha}
                src={trilha.imagem_url}
                alt={trilha.nome}
              />

            ) : (

              <div className={styles.semImagem}>
                Imagem não disponível
              </div>

            )}

            <div className={styles.conteudoTrilha}>

              <h3>{trilha.nome}</h3>

              <p>{trilha.descricao}</p>

              <p>
                <strong>Parque:</strong>{" "}
                {nomesParques[trilha.parque || ""] ||
                  "Não definido"}
              </p>

              <p>
                <strong>Dificuldade:</strong>{" "}
                {trilha.dificuldade}
              </p>

              <p>
                <strong>Distância:</strong>{" "}
                {trilha.distancia_km} km
              </p>

              <p>
                <strong>Duração:</strong>{" "}
                {trilha.duracao_minutos} minutos
              </p>

              <p>
                <strong>Localização:</strong>{" "}
                {trilha.localizacao}
              </p>

              <div className={styles.botoesTrilha}>

                <button
                  type="button"
                  className={styles.botaoEditar}
                  disabled={
                    salvando ||
                    excluindoId !== null
                  }
                  onClick={() => editar(trilha)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className={styles.botaoExcluir}
                  disabled={
                    salvando ||
                    excluindoId !== null
                  }
                  onClick={() => remover(trilha.id)}
                >
                  {excluindoId === trilha.id
                    ? "Excluindo..."
                    : "Excluir"}
                </button>

              </div>

            </div>

          </article>

        ))}

      </section>

    </main>
  );
};
