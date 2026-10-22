import styles from './Header.module.css'
import loginIcon from '../../assets/loginicon.png'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();

  return (
    <header className={styles.header}>
        {/* Redireciona para a página inicial ao clicar na logo */}
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
                {/* Adicionado o onClick com o caminho /eventos */}
                <li><button onClick={() => navigate("/eventos")}>Eventos</button></li>
                <li><button onClick={() => navigate("/parnaso")}>Serra dos Órgãos</button></li>
                <li><button onClick={() => navigate("/tres-picos")}>Três Picos</button></li>
                <li><button onClick={() => navigate("/montanhas-tere")}>Montanhas de Teresópolis</button></li>
                <li>
                    <img 
                        className={styles.loginIcon}
                        src={loginIcon}
                        alt="Login"
                        height="30px"
                        width="30px"
                        id="login"
                        onClick={() => navigate("/login")}
                    />
                </li>
            </ul>
        </nav>
    </header>
  )
}