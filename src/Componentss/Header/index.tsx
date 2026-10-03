import styles from './Header.module.css'
import loginIcon from '../../assets/loginicon.png'
import logo from '../../assets/logo.png'

export const Header = () => {
  return (
    <header className={styles.header}>
            <img className={styles.logo} src={logo} alt="Logo Terê Verde" height="100px" width="100px"></img> {/* Adicionar link para a página inicial */}
        <nav>
            <ul>
                <li><button>Eventos</button></li>
                <li><button>Serra dos órgãos</button></li>
                <li><button>Três Picos</button></li>
                <li><button>Montanhas de Teresópolis</button></li>
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
