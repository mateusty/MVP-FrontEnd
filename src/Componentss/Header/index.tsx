import styles from './Header.module.css'
import loginIcon from '../../assets/loginicon.png'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();

  return (
    <header className={styles.header}>
            <img className={styles.logo} src={logo} alt="Logo Terê Verde" height="100px" width="100px"></img> {/* Adicionar link para a página inicial */}
        <nav>
            <ul>
                <li><button>Eventos</button></li>
                <li><button onClick={() => navigate("/parnaso")}>Serra dos órgãos</button></li>
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
                    >
                    </img> {/* Adicionar link para a página de login */}
                    </li>
            </ul>
        </nav>
    </header>
  )
}
