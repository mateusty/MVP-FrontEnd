
import { useEffect, useState } from "react";
import { buscarTrilhas } from "../../services/Api";

import styles from "./Parques.module.css";
import montanhasTere from "../../assets/montanhastere.jpg";
import trilhaPedraAlpina from "../../assets/trilhaPedraAlpina.jpeg";
import trilhaJacu from "../../assets/trilhaJacu.jpeg";
import trilhaTangara from "../../assets/trilhaTangara.jpeg";

type Trilha = {
  id: string;
  nome: string;
  descricao: string | null;
  dificuldade: string;
  distancia_km: string | number;
  duracao_minutos: number;
  localizacao: string;
  imagem_url: string | null;
  parque: string | null;
};

export const MontanhasTere = () => {

  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {

    let ativo = true;

    async function carregarTrilhas() {
      try {
        const dados: Trilha[] = await buscarTrilhas();

        if (ativo) {
          setTrilhas(dados);
        }

      } catch (erro) {
        console.error("Erro ao carregar trilhas:", erro);

        if (ativo) {
          setErro("Não foi possível carregar as trilhas.");
        }

      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarTrilhas();

    return () => {
      ativo = false;
    };

  }, []);

  const trilhasMontanhas = trilhas.filter(
    (trilha) => trilha.parque === "montanhas-tere"
  );

  return (
    <>
      <main>
        <div
          id={styles.imgTopo}
          data-content="Parque Natural Municipal Montanhas de Teresópolis"
          style={{ backgroundImage: `url(${montanhasTere})` }}
        ></div>

        <section>
          <div className={styles.sobre}>
            <h2>Sobre</h2>
          </div>

          <div className={styles.corpoSobre}>
            <p>
              O Parque Natural Municipal Montanhas de Teresópolis (PNMMT) é uma área de conservação localizada em Teresópolis, Rio de Janeiro, abrangendo aproximadamente 4.397 hectares de Mata Atlântica. O parque possui três núcleos principais: Santa Rita, Pedra da Tartaruga e Iconha.
              <br />
              O Núcleo Santa Rita, sede principal do parque, está situado no bairro de Santa Rita e conta com trilhas como a Trilha Pedra Alpina e a Trilha do Jacu, além de áreas de lazer, acampamento e um parquinho infantil. O Núcleo Pedra da Tartaruga, localizado no bairro Granja Florestal, é acessível a partir da área urbana de Teresópolis. Este núcleo é conhecido por suas formações rochosas como a Pedra da Tartaruga e a Pedra do Camelo, e oferece trilhas de fácil acesso, áreas para acampar e escalar. Já o Núcleo Iconha é dedicado à pesquisa e também possui trilhas que atraem muitos visitantes.
            </p>
          </div>
        </section>

        <section id={styles.about}>
          <div className={styles.sobre}>
            <h2>Trilhas de Santa Rita</h2>
          </div>

          <div className={styles.trilha}>
            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo}>
                Trilha da Pedra Alpina
              </h3>

              <p>
                Para os mais aventureiros e adeptos de esportes regulares, a Trilha Pedra Alpina oferece uma experiência desafiadora com uma distância de 2.000 metros e um ganho significativo de elevação.
                <br />
                Classificada como Classe II, esta trilha leva aproximadamente 2 horas para ser concluída, proporcionando uma vista panorâmica da região, podendo visualizar o Parque Estadual dos Três picos e a Serra dos Órgãos, além de uma sensação de realização ao atingir uma altitude final de 1.280 metros.
                <br />
                Certifique-se de estar preparado com água, protetor solar e roupas confortáveis para esta jornada emocionante.
              </p>
            </div>

            <img
              alt="Trilha da Pedra Alpina"
              className={styles.trilhaImagem}
              src={trilhaPedraAlpina}
              width="350"
              height="350"
            />
          </div>

          <div className={styles.trilha}>
            <img
              alt="Trilha do Jacu"
              className={styles.trilhaImagem}
              src={trilhaJacu}
              width="350"
              height="350"
            />

            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo2}>
                Trilha do Jacu
              </h3>

              <p className={styles.pJacu}>
                Desfrute de um percurso de 890 metros, caracterizado por terreno plano com trechos curtos de aclive e declive, oferecendo uma experiência ideal para todas as idades e aqueles que procuram uma caminhada tranquila. Aproxime-se da natureza e admire a avifauna local durante esta caminhada de 30 a 40 minutos. Não se esqueça de levar repelente e vestimentas confortáveis para uma experiência agradável.
              </p>
            </div>
          </div>

          <div className={styles.trilha}>
            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo}>
                Trilha do Tangará
              </h3>

              <p>
                Com uma extensão de 1.100 metros, esta trilha oferece um desafio moderado, classificado como Classe III, perfeito para aqueles que praticam regularmente atividades físicas. Prepare-se para uma caminhada de aproximadamente 40 minutos, enquanto desfruta das vistas deslumbrantes da natureza. Não se esqueça de trazer água, protetor solar e roupas confortáveis para garantir uma aventura segura e agradável.
              </p>
            </div>

            <img
              alt="Trilha do Tangará"
              className={styles.trilhaImagem}
              src={trilhaTangara}
              width="350"
              height="350"
            />
          </div>
        </section>

        <section>
          <div className={styles.sobre}>
            <h2>Outras trilhas do parque</h2>
          </div>

          {carregando && (
            <p>Carregando trilhas...</p>
          )}

          {erro && (
            <p role="alert">{erro}</p>
          )}

          {!carregando && !erro && trilhasMontanhas.length === 0 && (
            <p>Nenhuma trilha adicional cadastrada.</p>
          )}

          {!carregando && !erro && trilhasMontanhas.map((trilha) => (

            <div
              className={`${styles.trilha} ${styles.trilhaDinamica}`}
              key={trilha.id}
            >

              <div className={styles.informacoesTrilha}>

                <h3>{trilha.nome}</h3>

                <p>{trilha.descricao}</p>

                <p>
                  <strong>Dificuldade:</strong> {trilha.dificuldade}
                </p>

                <p>
                  <strong>Distância:</strong> {trilha.distancia_km} km
                </p>

                <p>
                  <strong>Duração:</strong> {trilha.duracao_minutos} minutos
                </p>

                <p>
                  <strong>Localização:</strong> {trilha.localizacao}
                </p>

              </div>

              <div className={styles.imagemTrilhaDinamica}>
                {trilha.imagem_url ? (
                  <img
                    src={trilha.imagem_url}
                    alt={trilha.nome}
                  />
                ) : (
                  <span>Imagem não disponível</span>
                )}
              </div>

            </div>

          ))}

        </section>

        <section id={styles.objective}>
          <div className={styles.objetivo}>
            <h2>Nosso Objetivo</h2>
          </div>

          <div className={styles.corpoObjetivo}>
            <div>
              Assegurar a preservação dos remanescentes da Mata Atlântica da porção fluminense da Serra do Mar, bem como recuperar as áreas degradadas ali existentes
            </div>

            <div>
              Proteger espécies raras, endêmicas e ameaçadas de extinção ou insuficientemente conhecidas da fauna e da flora nativas
            </div>

            <div>
              Integrar o Mosaico de Áreas Protegidas da Mata Atlântica Central Fluminense, Estado do Rio de Janeiro, contribuindo para a conectividade
            </div>

            <div>
              Contribuir com a melhoria da qualidade de vida da população por meio do fornecimento, indireto, de serviços e produtos ambientais
            </div>
          </div>
        </section>

        <h2 className={styles.local}>
          Localização
        </h2>

        <div className={styles.mapa}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.332349929952!2d-43.020520724360225!3d-22.341076379657267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9852943523b39d%3A0x23e53306f310fd47!2sParque%20Natural%20Municipal%20Montanhas%20de%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1764205341597!5m2!1spt-BR!2sbr"
            width="600"
            height="450"
            title="Localização do Parque Natural Municipal Montanhas de Teresópolis"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <section id={styles.conclusion}>
          <div className={styles.conclusaoTitulo}>
            <h2>Conclusão</h2>
          </div>

          <div className={styles.conclusao}>
            <p>
              Hoje, o Parque Natural Municipal Montanhas de Teresópolis é muito mais do que uma reserva natural; é um símbolo do compromisso contínuo da comunidade em preservar e valorizar o rico patrimônio ambiental da região, garantindo um futuro sustentável para as gerações futuras. Venha explorar e descobrir as maravilhas deste tesouro natural.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};
