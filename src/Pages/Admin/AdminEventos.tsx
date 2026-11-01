import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminEventos.module.css";

export function AdminEventos() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [limitePessoas, setLimitePessoas] = useState<number | "">("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

   const payload = {
      atividade: titulo,
      descricao: descricao,
      localizacao: local,
      parque: local,
      capacidade_maxima: Number(limitePessoas),
      data_evento: dataHorario,
      google_maps_url: googleMapsUrl || "" 
    };

    try {

      const response = await fetch("http://localhost:3000/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Evento criado com sucesso!");
        navigate("/eventos");
      } else {
        setMensagem(data.mensagem || "Erro ao criar evento.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  return (
    <main className={styles.principal}>
      <div className={styles.banner}>
        <div className={styles.sobre}>
          <h2>Painel Administrativo - Cadastrar Evento</h2>
        </div>
      </div>

      <div className={styles.caixa}>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h3>Novo Evento nos Parques</h3>

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
            Salvar Evento
          </button>
        </form>
      </div>
    </main>
  );
}