import styles from "./Header.module.css";
import loginIcon from "../../assets/loginicon.png";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const rotaAtual = useLocation().pathname;

  const token = sessionStorage.getItem("token");

  let admin = false;

  try {
    const usuario = JSON.parse(
      sessionStorage.getItem("usuario") || "null"
    );

    admin = Boolean(token && usuario?.role === "admin");
  } catch {
    admin = false;
  }

  function sair() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    navigate("/login", { replace: true });
  }

  return (
    <header className={styles.header}>
      <img
        className={styles.logo}
        src={logo}
        alt="Logo Terê Verde"
        height="100px"
        width="100px"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      />

      <nav>
        <ul>
          <li>
            <button onClick={() => navigate("/eventos")}>
              Eventos
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/parnaso")}>
              Serra dos Órgãos
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/tres-picos")}>
              Três Picos
            </button>
          </li>

          <li>
            <button onClick={() => navigate("/montanhas-tere")}>
              Montanhas de Teresópolis
            </button>
          </li>

          {admin && (
            <>
              <li>
                <button
                  onClick={() => navigate("/admin/trilhas")}
                  aria-current={
                    rotaAtual === "/admin/trilhas"
                      ? "page"
                      : undefined
                  }
                >
                  Painel Admin
                </button>
              </li>

              {/* Novo botão integrado para criar eventos */}
              <li>
                <button
                  onClick={() => navigate("/admin/criar-evento")}
                  aria-current={
                    rotaAtual === "/admin/criar-evento"
                      ? "page"
                      : undefined
                  }
                >
                  + Novo Evento
                </button>
              </li>
            </>
          )}

          {token ? (
            <li>
              <button onClick={sair}>
                Sair
              </button>
            </li>
          ) : (
            <li>
              <img
                className={styles.loginIcon}
                src={loginIcon}
                alt="Login"
                height="30px"
                width="30px"
                id="login"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};