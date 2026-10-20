import { type FormEvent } from "react";
import styles from "./Login.module.css";

export const Login = () => {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

          <button className={styles.cadastrar} type="submit">
            Entrar
          </button>
        </form>
      </main>
    </div>
  );
};
