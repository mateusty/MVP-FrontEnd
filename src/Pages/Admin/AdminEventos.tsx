import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminTrilhas.module.css"; 

export function AdminEventos() { // <-- Alterado para export function AdminEventos
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    local: "",
    tema: "",
    data_horario: "",
    limite_pessoas: "",
    google_maps_url: "" // Opcional para o Google Maps
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
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
    <div className={styles.container || "p-6 max-w-xl mx-auto"}>
      <h2 className="text-2xl font-bold mb-4 text-green-900">Cadastrar Novo Evento</h2>
      
      {mensagem && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{mensagem}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Título</label>
          <input 
            type="text" 
            name="titulo" 
            required 
            value={formData.titulo} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Descrição</label>
          <textarea 
            name="descricao" 
            value={formData.descricao} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Local</label>
          <input 
            type="text" 
            name="local" 
            required 
            value={formData.local} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Tema</label>
          <input 
            type="text" 
            name="tema" 
            required 
            value={formData.tema} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Data e Horário</label>
          <input 
            type="datetime-local" 
            name="data_horario" 
            required 
            value={formData.data_horario} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Limite de Pessoas</label>
          <input 
            type="number" 
            name="limite_pessoas" 
            required 
            min="1"
            value={formData.limite_pessoas} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Link do Google Maps (Opcional)</label>
          <input 
            type="url" 
            name="google_maps_url" 
            placeholder="https://maps.app.goo.gl/..."
            value={formData.google_maps_url} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 transition"
        >
          Salvar Evento
        </button>
      </form>
    </div>
  );
}