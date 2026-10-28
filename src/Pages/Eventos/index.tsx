import { useState, useEffect } from "react";
import styles from "./Eventos.module.css";

interface Participante {
  nome: string;
  email: string;
}

interface Evento {
  id?: string;
  titulo: string;
  descricao: string;
  local: string;
  tema: string;
  data_horario: string;
  limite_pessoas: number;
  google_maps_url?: string;
  participantes?: Participante[];
}

export const Eventos = () => {
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);

 
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [tema, setTema] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [limitePessoas, setLimitePessoas] = useState<number | "">("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  
  const [eventoAtivoPresenca, setEventoAtivoPresenca] = useState<string | null>(null);
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");

  
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); 
  const isGestor = userRole === "admin" || userRole === "gestor";


  const API_URL = "http://localhost:3000/eventos";

  
  const carregarEventos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        // Garante que cada evento traga o array de participantes inicializado
        const eventosComParticipantes = data.map((ev: Evento) => ({
          ...ev,
          participantes: ev.participantes || []
        }));
        setEventos(eventosComParticipantes);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos do back-end:", error);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  
  const handleCriarEvento = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const payload = {
      titulo,
      descricao,
      local,
      tema,
      data_horario: dataHorario,
      limite_pessoas: Number(limitePessoas),
      google_maps_url: googleMapsUrl || undefined,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Evento criado com sucesso!");
        setTitulo("");
        setDescricao("");
        setLocal("");
        setTema("");
        setDataHorario("");
        setLimitePessoas("");
        setGoogleMapsUrl("");
        setMostrarForm(false);
        carregarEventos(); 
      } else {
        const errData = await response.json();
        alert(errData.mensagem || errData.error || "Erro ao criar evento.");
      }
    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

 
  const handleConfirmarPresenca = (e: React.FormEvent, eventoId?: string) => {
    e.preventDefault();

    if (!nomeParticipante || !emailParticipante) {
      alert("Por favor, preencha o seu nome e e-mail.");
      return;
    }

    setEventos((prevEventos) =>
      prevEventos.map((ev, idx) => {
        const idAtual = ev.id || String(idx);
        if (idAtual === eventoId) {
          const listaAtual = ev.participantes || [];
          
          if (listaAtual.length >= ev.limite_pessoas) {
            alert("Desculpe, este evento já atingiu o limite máximo de vagas!");
            return ev;
          }

          return {
            ...ev,
            participantes: [...listaAtual, { nome: nomeParticipante, email: emailParticipante }]
          };
        }
        return ev;
      })
    );

    alert(`Presença confirmada com sucesso, ${nomeParticipante}!`);
    setNomeParticipante("");
    setEmailParticipante("");
    setEventoAtivoPresenca(null);
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
                onClick={() => setMostrarForm(!mostrarForm)}
              >
                {mostrarForm ? "Cancelar" : "+ Criar Evento"}
              </button>
            )}
          </div>

          
          {isGestor && mostrarForm && (
            <form className={styles.formulario} onSubmit={handleCriarEvento}>
              <h3>Cadastrar Novo Evento</h3>

              <input
                type="text"
                placeholder="Título do Evento"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />

              <textarea
                placeholder="Descrição"
                rows={3}
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
                type="text"
                placeholder="Tema (ex: Botânica, Caminhada)"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
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
                Salvar Evento
              </button>
            </form>
          )}

   
          <div className={styles.menu_trilhas}>
            {eventos.map((evento, index) => {
              const eventoId = evento.id || String(index);
              const totalParticipantes = evento.participantes?.length || 0;
              const vagasRestantes = evento.limite_pessoas - totalParticipantes;
              const isFormularioAberto = eventoAtivoPresenca === eventoId;

              return (
                <article key={eventoId} className={styles.menu_cards}>
                  <div className={styles.texto_trilhas}>
                    <h3>{evento.titulo}</h3>
                    <p><strong>Local:</strong> {evento.local}</p>
                    <p><strong>Tema:</strong> {evento.tema}</p>
                    <p>{evento.descricao}</p>
                    
                    
                    <p>
                      <small>
                        Vagas preenchidas: <strong>{totalParticipantes}</strong> / {evento.limite_pessoas} 
                        {vagasRestantes <= 0 ? " (Lotado)" : ` (${vagasRestantes} disponíveis)`}
                      </small>
                    </p>

                   
                    {evento.google_maps_url && (
                      <p>
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

                   
                    {isFormularioAberto ? (
                      <form onSubmit={(e) => handleConfirmarPresenca(e, eventoId)} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <input
                          type="text"
                          placeholder="Seu Nome"
                          value={nomeParticipante}
                          onChange={(e) => setNomeParticipante(e.target.value)}
                          required
                          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.9rem" }}
                        />
                        <input
                          type="email"
                          placeholder="Seu E-mail"
                          value={emailParticipante}
                          onChange={(e) => setEmailParticipante(e.target.value)}
                          required
                          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.9rem" }}
                        />
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button type="submit" className={styles.btnPresenca} style={{ margin: 0, flex: 1, backgroundColor: "#2e7d32" }}>
                            Confirmar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEventoAtivoPresenca(null)}
                            style={{ padding: "8px", background: "#ccc", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                          >
                            X
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        className={styles.btnPresenca}
                        onClick={() => setEventoAtivoPresenca(eventoId)}
                      >
                        Marcar Presença
                      </button>
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