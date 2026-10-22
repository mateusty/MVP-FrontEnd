export const API_URL = "http://localhost:8080";


export async function buscarTrilhas() {

    const resposta = await fetch(`${API_URL}/trilhas`);

    if (!resposta.ok) {
        throw new Error("Erro ao buscar trilhas");
    }

    const trilhas = await resposta.json();

    return trilhas;
}