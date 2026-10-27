import { useState, useEffect } from "react";
import styles from "./Eventos.module.css";

interface Evento {
  id?: string;
  titulo: string;
  descricao: string;
  local: string;
  tema: string;
  data_horario: string;
  limite_pessoas: number;
}

export const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);

  // Estados dos campos exigidos pelo Back-end
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [tema, setTema] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [limitePessoas, setLimitePessoas] = useState<number | "">("");

  // Obter permissão e token do usuário logado
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Ex: 'admin' ou 'gestor'
  const isGestor = userRole === "admin" || userRole === "gestor";

  // URL base da sua API Back-End
  const API_URL = "http://localhost:3000/eventos"; // Ajuste a porta se necessário

  // 1. Buscar lista de eventos do Back-end (GET /)
  const carregarEventos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos do back-end:", error);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  // 2. Enviar novo evento com token e validações para o Back-end (POST /)
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
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Passa no autenticarToken
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Evento criado com sucesso!");
        // Limpar formulário
        setTitulo("");
        setDescricao("");
        setLocal("");
        setTema("");
        setDataHorario("");
        setLimitePessoas("");
        setMostrarForm(false);
        carregarEventos(); // Recarrega a lista
      } else {
        const errData = await response.json();
        alert(errData.mensagem || errData.error || "Erro ao criar evento.");
      }
    } catch (error) {
      console.error("Erro na comunicação com a API:", error);
      alert("Não foi possível conectar ao servidor.");
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
                onClick={() => setMostrarForm(!mostrarForm)}
              >
                {mostrarForm ? "Cancelar" : "+ Criar Evento"}
              </button>
            )}
          </div>

          {/* FORMULÁRIO COM TODOS OS CAMPOS DO MIDDLEWARE DE VALIDAÇÃO */}
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

              <button type="submit" className={styles.btnSubmit}>
                Salvar Evento
              </button>
            </form>
          )}

          {/* LISTAGEM DOS CARDS */}
          <div className={styles.menu_trilhas}>
            {eventos.map((evento, index) => (
              <article key={evento.id || index} className={styles.menu_cards}>
                <div className={styles.texto_trilhas}>
                  <h3>{evento.titulo}</h3>
                  <p><strong>Local:</strong> {evento.local}</p>
                  <p><strong>Tema:</strong> {evento.tema}</p>
                  <p>{evento.descricao}</p>
                  <p><small>Vagas: {evento.limite_pessoas}</small></p>
                  <button
                    className={styles.btnPresenca}
                    onClick={() => alert(`Presença solicitada para: ${evento.titulo}`)}
                  >
                    Marcar Presença
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};