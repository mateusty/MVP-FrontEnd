
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fazerLogin } from "../../services/Api";
import styles from "./Login.module.css";

export const Login = () => {

  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    setErro("");
    setCarregando(true);

    const formulario = new FormData(event.currentTarget);

    const email = String(formulario.get("email")).trim();
    const password = String(formulario.get("password"));

    try {

      const dados = await fazerLogin(email, password);

      // Armazena os dados da sessão
      sessionStorage.setItem("token", dados.token);

      sessionStorage.setItem(
        "usuario",
        JSON.stringify(dados.usuario)
      );

      console.log("Login realizado:", dados.usuario);

      // Redireciona para a página inicial
      navigate("/");

    } catch (erro) {

      if (erro instanceof Error) {
        setErro(erro.message);
      } else {
        setErro("Erro ao realizar login.");
      }

    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.body}>
      <main className={styles.main}>

        <h1>Entrar</h1>

        <form onSubmit={handleSubmit}>

          <div className={styles.input}>
            <label htmlFor="email">E-mail</label>

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
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>

          {erro && (
            <p role="alert" style={{ color: "red" }}>
              {erro}
            </p>
          )}

          <button
            className={styles.cadastrar}
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </main>
    </div>
  );
};
