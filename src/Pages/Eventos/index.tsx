import { useState, useEffect } from "react";
import styles from "./Eventos.module.css";
import {
  atualizarEvento,
  buscarEventos,
  criarEvento,
  excluirEvento
} from "../../services/eventosService";
import { desmarcarPresenca, marcarPresenca } from "../../services/presencasService";

interface Evento {
  id?: string | number;
  titulo?: string;
  atividade?: string;
  descricao: string;
  local?: string;
  localizacao?: string;
  parque?: string;
  data_horario?: string;
  data_evento?: string;
  capacidade_maxima?: number;
  limite_pessoas?: number;
  google_maps_url?: string;
  participantes?: any[];
}

export const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [limitePessoas, setLimitePessoas] = useState<number | "">("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const [modoAcao, setModoAcao] = useState<{ [key: string]: "marcar" | "desmarcar" | null }>({});
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");
  const [emailDesmarcar, setEmailDesmarcar] = useState("");

  const [isGestor, setIsGestor] = useState<boolean>(false);

  const verificarAutenticacao = () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const userRole = sessionStorage.getItem("userRole") || localStorage.getItem("userRole");
    setIsGestor(!!token && (userRole === "admin" || userRole === "gestor"));
  };

  const carregarEventos = async () => {
    try {
      const data = await buscarEventos();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  useEffect(() => {
    verificarAutenticacao();
    carregarEventos();

    window.addEventListener("storage", verificarAutenticacao);
    return () => {
      window.removeEventListener("storage", verificarAutenticacao);
    };
  }, []);

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setLocal("");
    setDataHorario("");
    setLimitePessoas("");
    setGoogleMapsUrl("");
    setEventoEmEdicao(null);
  };

  const handleIniciarEdicao = (evento: Evento) => {
    setEventoEmEdicao(evento);
    setTitulo(evento.titulo || evento.atividade || "");
    setDescricao(evento.descricao || "");
    setLocal(evento.localizacao || evento.local || evento.parque || "");
    
    const dataBruta = evento.data_evento || evento.data_horario || "";
    const dataFormatada = dataBruta ? dataBruta.replace(" ", "T").slice(0, 16) : "";
    setDataHorario(dataFormatada);

    setLimitePessoas(evento.capacidade_maxima || evento.limite_pessoas || "");
    setGoogleMapsUrl(evento.google_maps_url || "");
    setMostrarForm(true);
  };

  const handleExcluirEvento = async (eventoId?: string | number) => {
    if (!eventoId) return;

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await excluirEvento(eventoId);
      alert("Evento excluído com sucesso!");
      carregarEventos();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      alert(error instanceof Error ? error.message : "Não foi possível conectar ao servidor.");
    }
  };

  const handleSalvarEvento = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const payload = {
      atividade: titulo,
      descricao,
      capacidade_maxima: Number(limitePessoas),
      data_evento: dataHorario,
      localizacao: local,
      google_maps_url: googleMapsUrl.trim() === "" ? null : googleMapsUrl,
      parque: local
    };

    const isEdit = !!eventoEmEdicao;

    try {
      if (eventoEmEdicao) {
        if (eventoEmEdicao.id == null) {
          throw new Error("Não foi possível identificar o evento.");
        }

        await atualizarEvento(eventoEmEdicao.id, payload);
      } else {
        await criarEvento(payload);
      }

      alert(isEdit ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!");
      limparFormulario();
      setMostrarForm(false);
      carregarEventos();
    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
      alert(error instanceof Error ? error.message : "Não foi possível conectar ao servidor.");
    }
  };

  const handleConfirmarPresenca = async (e: React.FormEvent, eventoId?: string | number) => {
    e.preventDefault();
    if (!eventoId) return;

    try {
      await marcarPresenca(String(eventoId), nomeParticipante, emailParticipante);
      alert("Presença confirmada com sucesso!");
      setNomeParticipante("");
      setEmailParticipante("");
      setModoAcao({ ...modoAcao, [String(eventoId)]: null });
      carregarEventos();
    } catch (error: any) {
      alert(error.message || "Erro ao marcar presença.");
    }
  };

  const handleConfirmarDesmarcar = async (e: React.FormEvent, eventoId?: string | number) => {
    e.preventDefault();
    if (!eventoId) return;

    try {
      await desmarcarPresenca(String(eventoId), emailDesmarcar);
      alert("Presença desmarcada com sucesso!");
      setEmailDesmarcar("");
      setModoAcao({ ...modoAcao, [String(eventoId)]: null });
      carregarEventos();
    } catch (error: any) {
      alert(error.message || "Erro ao desmarcar presença.");
    }
  };

  return (
    <main className={styles.principal}>
      <div className={styles.banner}>
        <div className={styles.sobre}>
          <h2>Eventos nos Parques</h2>
        </div>
      </div>

      <div className={styles.caixa}>
        <section className={styles.trilhas}>
          <div className={styles.headerSecao}>
            <div className={styles.tituloGroup}>
              <h2>Confira a Programação</h2>
              <p className={styles.subtituloSecao}>
                Fique por dentro das atividades e participe dos nossos encontros nos parques.
              </p>
            </div>

            {isGestor && (
              <button
                className={styles.btnCriar}
                onClick={() => {
                  if (mostrarForm) limparFormulario();
                  setMostrarForm(!mostrarForm);
                }}
              >
                {mostrarForm ? "Cancelar" : "+ Criar Evento"}
              </button>
            )}
          </div>

          {isGestor && mostrarForm && (
            <form className={styles.formulario} onSubmit={handleSalvarEvento}>
              <h3>{eventoEmEdicao ? "Editar Evento" : "Cadastrar Novo Evento"}</h3>

              <input
                type="text"
                placeholder="Título do Evento"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <textarea
                placeholder="Descrição"
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Local (ex: Parnaso, Três Picos)"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                required
              />

              <input
                type="datetime-local"
                value={dataHorario}
                onChange={(e) => setDataHorario(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Limite de Pessoas"
                value={limitePessoas}
                onChange={(e) => setLimitePessoas(e.target.value ? Number(e.target.value) : "")}
                required
              />

              <input
                type="url"
                placeholder="Link do Google Maps (Opcional)"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
              />

              <button type="submit" className={styles.btnSubmit}>
                {eventoEmEdicao ? "Atualizar Evento" : "Salvar Evento"}
              </button>
            </form>
          )}

          <div className={styles.menu_trilhas}>
            {eventos.map((evento, index) => {
              const eventoId = String(evento.id || index);
              const limite = evento.capacidade_maxima || evento.limite_pessoas || 0;
              const tituloEvento = evento.titulo || evento.atividade || "Evento";
              const localEvento = evento.localizacao || evento.local || evento.parque || "Parque";
              const descricaoEvento = evento.descricao || "";
              const totalParticipantes = evento.participantes?.length || 0;
              const vagasRestantes = limite - totalParticipantes;
              const acaoAtual = modoAcao[eventoId];

              return (
                <article key={eventoId} className={styles.menu_cards}>
                  <div className={styles.texto_trilhas}>
                    <div className={styles.cardHeaderTop}>
                      <h3>{tituloEvento}</h3>
                      
                      {isGestor && (
                        <div className={styles.cardAcoesGestor}>
                          <button
                            type="button"
                            onClick={() => handleIniciarEdicao(evento)}
                            className={styles.btnEditar}
                            title="Editar Evento"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExcluirEvento(evento.id)}
                            className={styles.btnExcluir}
                            title="Excluir Evento"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    <p className={styles.cardInfoItem}><strong>Local:</strong> {localEvento}</p>
                    
                    {(evento.data_evento || evento.data_horario) && (
                      <p className={styles.cardInfoItem}>
                        <strong>Data/Horário:</strong> {new Date(evento.data_evento || evento.data_horario!).toLocaleString("pt-BR")}
                      </p>
                    )}
                    
                    <div className={styles.cardDescricaoContainer}>
                      <span className={styles.cardDescricaoTexto}>
                        {descricaoEvento}
                      </span>
                    </div>

                    <p className={styles.cardVagas}>
                      <small>
                        Vagas preenchidas: <strong>{totalParticipantes}</strong> / {limite}
                        {vagasRestantes <= 0 ? " (Lotado)" : ` (${vagasRestantes} disponíveis)`}
                      </small>
                    </p>

                    {evento.google_maps_url && (
                      <p className={styles.cardInfoItem}>
                        <a 
                          href={evento.google_maps_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.linkMapa}
                        >
                          📍 Ver localização no Google Maps
                        </a>
                      </p>
                    )}

                    {acaoAtual === "marcar" ? (
                      <form onSubmit={(e) => handleConfirmarPresenca(e, evento.id)} className={styles.formAcaoCard}>
                        <input
                          type="text"
                          placeholder="Seu Nome"
                          value={nomeParticipante}
                          onChange={(e) => setNomeParticipante(e.target.value)}
                          required
                          className={styles.inputAcaoCard}
                        />
                        <input
                          type="email"
                          placeholder="Seu E-mail"
                          value={emailParticipante}
                          onChange={(e) => setEmailParticipante(e.target.value)}
                          required
                          className={styles.inputAcaoCard}
                        />
                        <div className={styles.formAcaoBotoes}>
                          <button type="submit" className={styles.btnPresencaConfirmar}>
                            Confirmar Inscrição
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setModoAcao({ ...modoAcao, [eventoId]: null })}
                            className={styles.btnAcaoCancelar}
                          >
                            X
                          </button>
                        </div>
                      </form>
                    ) : acaoAtual === "desmarcar" ? (
                      <form onSubmit={(e) => handleConfirmarDesmarcar(e, evento.id)} className={styles.formAcaoCard}>
                        <input
                          type="email"
                          placeholder="Digite o e-mail cadastrado"
                          value={emailDesmarcar}
                          onChange={(e) => setEmailDesmarcar(e.target.value)}
                          required
                          className={styles.inputAcaoCard}
                        />
                        <div className={styles.formAcaoBotoes}>
                          <button type="submit" className={styles.btnDesmarcarConfirmar}>
                            Confirmar Desmarcação
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setModoAcao({ ...modoAcao, [eventoId]: null })}
                            className={styles.btnAcaoCancelar}
                          >
                            X
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className={styles.containerBotoesAcao}>
                        <button
                          className={styles.btnPresencaMarcar}
                          onClick={() => setModoAcao({ ...modoAcao, [eventoId]: "marcar" })}
                        >
                          Marcar Presença
                        </button>
                        <button
                          className={styles.btnPresencaDesmarcar}
                          onClick={() => setModoAcao({ ...modoAcao, [eventoId]: "desmarcar" })}
                        >
                          Desmarcar
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};