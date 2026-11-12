import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fazerLogin } from "../../services/authService";
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

      sessionStorage.setItem("token", dados.token);
      sessionStorage.setItem("usuario", JSON.stringify(dados.usuario));
      
      // Guarda o role para desbloquear as permissões de gestão
      sessionStorage.setItem("userRole", dados.usuario.role);

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
              minLength={6}
              required
            />
          </div>

          {erro && (
            <p className={styles.erro} role="alert">
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

        <p className={styles.alternativa}>
          Ainda não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </main>
    </div>
  );
};