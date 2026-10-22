import { useState } from "react";
import styles from "./Eventos.module.css";

interface Evento {
  id: string;
  nome: string;
  descricao: string;
}

const EVENTOS_INICIAIS: Evento[] = [
  {
    id: "1",
    nome: "Caminhada Ecológica",
    descricao: "Participe da nossa caminhada pelos Parques de Teresópolis. Um evento para toda a família com guia especializado.",
  },
  {
    id: "2",
    nome: "Mutirão de Plantio",
    descricao: "Ação voluntária de reflorestamento e preservação das espécies nativas da Mata Atlântica.",
  },
];

export const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIAIS);
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [userRole] = useState<"gestor" | "user">("gestor"); 

  const handleCriarEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !descricao) return;

    const novoEvento: Evento = {
      id: Date.now().toString(),
      nome,
      descricao,
    };

    setEventos([novoEvento, ...eventos]);
    setNome("");
    setDescricao("");
    setMostrarForm(false);
  };

  const handleMarcarPresenca = (nomeEvento: string) => {
    alert(`Presença confirmada no evento: ${nomeEvento}`);
  };

  return (
    <main className={styles.principal}>
      {/* Banner Superior */}
      <div className={styles.banner}>
        <div className={styles.sobre}>
          <h2>Eventos nos Parques</h2>
        </div>
      </div>

      <div className={styles.caixa}>
        <section className={styles.trilhas}>
          
          {/* CABEÇALHO DA SEÇÃO CENTRALIZADO */}
          <div className={styles.headerSecao}>
            <div className={styles.tituloGroup}>
              <h2>Confira a Programação</h2>
              <p className={styles.subtituloSecao}>
                Fique por dentro das atividades e participe dos nossos encontros nos parques.
              </p>
            </div>

            {userRole === "gestor" && (
              <button
                className={styles.btnCriar}
                onClick={() => setMostrarForm(!mostrarForm)}
              >
                {mostrarForm ? "Cancelar" : "+ Criar Evento"}
              </button>
            )}
          </div>

          {/* Formulário do Gestor */}
          {userRole === "gestor" && mostrarForm && (
            <form className={styles.formulario} onSubmit={handleCriarEvento}>
              <h3>Cadastrar Novo Evento</h3>
              <input
                type="text"
                placeholder="Nome do Evento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição do Evento"
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
              <button type="submit" className={styles.btnSubmit}>
                Salvar Evento
              </button>
            </form>
          )}

          {/* Cards dos Eventos */}
          <div className={styles.menu_trilhas}>
            {eventos.map((evento) => (
              <article key={evento.id} className={styles.menu_cards}>
                <div className={styles.texto_trilhas}>
                  <h3>{evento.nome}</h3>
                  <p>{evento.descricao}</p>
                  <button
                    className={styles.btnPresenca}
                    onClick={() => handleMarcarPresenca(evento.nome)}
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