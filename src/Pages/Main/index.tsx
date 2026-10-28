
import tresPicos from '../../assets/trespicos.jpg'
import parnaso from '../../assets/parquenacional.jpg'
import montanhasTere from '../../assets/montanhastere.jpg'
import styles from './Main.module.css'
import { useNavigate } from 'react-router-dom'

export const Main = () => {
    const navigate = useNavigate();

  return (
    <>
    <main className={styles.main}>
        <section id="parnaso" className={styles.local}>
            <div className={styles.container}>
                <figure>
                    <figcaption>Parque Nacional Serra dos Órgãos</figcaption>
                    <img src={parnaso} alt="Panorama Parque Nacional Serra dos Órgãos" height="400px" width="600px"></img>
                </figure>
                <div className={styles.info}>
                    <h2>Informações</h2>
                    <p>Unidade de conservação situada no maciço da Serra dos Órgãos, abrangendo os municípios de Guapimirim, Magé, Petrópolis e Teresópolis, com uma área de 20 030 ha. É aberto para visitação permanente. É administrado pelo Instituto Chico Mendes de Conservação da Biodiversidade.</p>
                    <button className={styles.btn} onClick={() => navigate("/parnaso")}>Saiba mais</button>
                </div>
            </div>
        </section>


        <section id="tresPicos" className={styles.local}>
            <div className={styles.container + ' ' + styles.reverse}>
                <figure>
                    <figcaption>Parque Estadual dos Três Picos</figcaption>
                    <img src={tresPicos} alt="Panorama Parque Estadual dos Três Picos" height="400px" width="600px"></img>
                </figure>
                <div className={styles.info}>
                    <h2>Informações</h2>
                    <p>Esse conjunto de montanhas localizado no Parque Estadual dos Três Picos forma a silhueta de uma mulher deitada. O seu seio, a 2.040 metros de altitude, é o ponto mais alto do conjunto.</p>
                    <button className={styles.btn} onClick={() => navigate("/tres-picos")}>Saiba mais</button>
                </div>
            </div>
        </section>


        <section id="montanhasTere" className={styles.local}>
            <div className={styles.container}>
                <figure>
                    <figcaption>Montanhas de Teresópolis</figcaption>
                    <img src={montanhasTere} alt="Panorama Montanhas de Teresópolis" height="400px" width="600px"></img>
                </figure>
                <div className={styles.info}>
                    <h2>Informações</h2>
                    <p>Criado por meio do Decreto Municipal nº 3.693, de 6 de junho de 2009, tendo como principal objetivo a preservação dos ecossistemas naturais de grande importância ecológica e beleza cênica, possibilitando a pesquisa e educação científica, recreação em contato com a natureza e ecoturismo</p>
                    <button className={styles.btn} onClick={() => navigate("/montanhas-tere")}>Saiba mais</button>
                </div>
            </div>
        </section>
    </main>
    </>
  )
}
