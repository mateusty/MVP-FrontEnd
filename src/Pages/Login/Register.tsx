import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fazerCadastro } from "../../services/authService";
import styles from "./Login.module.css";

export const Register = () => {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    const formulario = new FormData(event.currentTarget);
    const nome = String(formulario.get("nome")).trim();
    const email = String(formulario.get("email")).trim();
    const password = String(formulario.get("password"));

    try {
      await fazerCadastro(nome, email, password);
      setSucesso("Cadastro realizado com sucesso. Você já pode entrar.");
    } catch (erro) {
      setErro(
        erro instanceof Error ? erro.message : "Erro ao realizar cadastro."
      );
    } finally {
      setCarregando(false);
      navigate("/login")
    }
  };

  return (
    <div className={styles.body}>
      <main className={styles.main}>
        <h1>Criar conta</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              required
            />
          </div>

          <div className={styles.input}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.input}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          {erro && (
            <p className={styles.erro} role="alert">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className={styles.sucesso} role="status">
              {sucesso}
            </p>
          )}

          <button
            className={styles.cadastrar}
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className={styles.alternativa}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </main>
    </div>
  );
};
