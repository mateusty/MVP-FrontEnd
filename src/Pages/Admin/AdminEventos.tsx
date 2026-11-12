import { useEffect, useState } from "react";
import {
  atualizarEvento,
  buscarEventos,
  criarEvento,
  excluirEvento
} from "../../services/eventosService";
import { removerPresenca } from "../../services/presencasService";
import styles from "./AdminEventos.module.css";

type Participante = {
  id: string;
  nome: string;
  email: string;
};

type Evento = {
  id: string;
  atividade: string;
  descricao: string | null;
  localizacao: string;
  parque: string;
  capacidade_maxima: number;
  data_evento: string;
  google_maps_url: string | null;
  participantes?: Participante[];
};

export function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoEmEdicaoId, setEventoEmEdicaoId] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [limitePessoas, setLimitePessoas] = useState<number | "">("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarEventos = async () => {
    try {
      const data = await buscarEventos();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const iniciarEdicao = (evento: Evento) => {
    setEventoEmEdicaoId(evento.id);
    setTitulo(evento.atividade);
    setDescricao(evento.descricao || "");
    setLocal(evento.localizacao);
    if (evento.data_evento) {
      setDataHorario(evento.data_evento.slice(0, 16).replace(" ", "T"));
    }
    setLimitePessoas(evento.capacidade_maxima);
    setGoogleMapsUrl(evento.google_maps_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => {
    setEventoEmEdicaoId(null);
    setTitulo("");
    setDescricao("");
    setLocal("");
    setDataHorario("");
    setLimitePessoas("");
    setGoogleMapsUrl("");
    setMensagem("");
  };

  const handleExcluir = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await excluirEvento(id);
      alert("Evento excluído com sucesso!");
      carregarEventos();
    } catch (error) {
      console.error("Erro na exclusão:", error);
      alert(error instanceof Error ? error.message : "Erro ao excluir o evento.");
    }
  };

  const handleRemoverPresenca = async (presencaId: string) => {
    if (!window.confirm("Deseja realmente remover a presença deste participante?")) return;

    try {
      await removerPresenca(presencaId);
      alert("Presença removida com sucesso!");
      carregarEventos();
    } catch (error) {
      console.error("Erro ao remover presença:", error);
      alert(error instanceof Error ? error.message : "Erro ao remover a presença.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    const payload = {
      atividade: titulo,
      descricao,
      localizacao: local,
      parque: local,
      capacidade_maxima: Number(limitePessoas),
      data_evento: dataHorario,
      google_maps_url: googleMapsUrl || ""
    };

    try {
      if (eventoEmEdicaoId) {
        await atualizarEvento(eventoEmEdicaoId, payload);
      } else {
        await criarEvento(payload);
      }

      alert(eventoEmEdicaoId ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!");
      cancelarEdicao();
      carregarEventos();
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMensagem(error instanceof Error ? error.message : "Erro de conexão com o servidor.");
    }
  };

  return (
    <main className={styles.principal}>
      <div className={styles.banner}>
        <div className={styles.sobre}>
          <h2>Painel Administrativo - Gerenciar Eventos</h2>
        </div>
      </div>

      <div className={styles.caixa}>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h3>{eventoEmEdicaoId ? "Editar Evento" : "Novo Evento nos Parques"}</h3>

          {mensagem && <p style={{ color: "red", textAlign: "center" }}>{mensagem}</p>}

          <input
            type="text"
            placeholder="Título do Evento (Atividade)"
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
            placeholder="Local / Parque (ex: Parnaso)"
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
            {eventoEmEdicaoId ? "Salvar Alterações" : "Cadastrar Evento"}
          </button>

          {eventoEmEdicaoId && (
            <button type="button" onClick={cancelarEdicao} className={styles.btnCancelar}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className={styles.caixa}>
        <div className={styles.headerSecao}>
          <div className={styles.tituloGroup}>
            <h2>Eventos Cadastrados ({eventos.length})</h2>
          </div>
        </div>

        {eventos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>Nenhum evento cadastrado.</p>
        ) : (
          <div className={styles.menu_trilhas}>
            {eventos.map((evento) => {
              const totalInscritos = evento.participantes?.length || 0;
              return (
                <div key={evento.id} className={styles.menu_cards}>
                  <div className={styles.texto_trilhas}>
                    <div className={styles.cardHeaderTop}>
                      <h3>{evento.atividade}</h3>
                      <div className={styles.cardAcoesGestor}>
                        <button 
                          className={styles.btnEditar} 
                          onClick={() => iniciarEdicao(evento)}
                          title="Editar Evento"
                        >
                          ✎
                        </button>
                        <button 
                          className={styles.btnExcluir} 
                          onClick={() => handleExcluir(evento.id)}
                          title="Excluir Evento"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className={styles.cardDescricaoContainer}>
                      <p className={styles.cardDescricaoTexto}>{evento.descricao}</p>
                    </div>

                    <p className={styles.cardInfoItem}><strong>Local:</strong> {evento.localizacao}</p>
                    <p className={styles.cardInfoItem}><strong>Data/Horário:</strong> {new Date(evento.data_evento).toLocaleString("pt-BR")}</p>
                    <p className={styles.cardInfoItem}><strong>Vagas Preenchidas:</strong> {totalInscritos} / {evento.capacidade_maxima}</p>

                    {evento.google_maps_url && (
                      <a href={evento.google_maps_url} target="_blank" rel="noreferrer" className={styles.linkMapa}>
                        Ver no Google Maps
                      </a>
                    )}

                    <div className={styles.containerParticipantes}>
                      <span className={styles.tituloParticipantes}>Participantes Inscritos:</span>
                      {(!evento.participantes || evento.participantes.length === 0) ? (
                        <p className={styles.semParticipantes}>Nenhum participante inscrito ainda.</p>
                      ) : (
                        <ul className={styles.listaParticipantes}>
                          {evento.participantes.map((p) => (
                            <li key={p.id} className={styles.itemParticipante}>
                              <span>{p.nome} ({p.email})</span>
                              <button 
                                type="button"
                                onClick={() => handleRemoverPresenca(p.id)}
                                className={styles.btnRemoverPresenca}
                              >
                                Remover
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}