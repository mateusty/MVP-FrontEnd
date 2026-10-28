
import { useEffect, useState } from "react";
import { buscarTrilhas } from "../../services/Api";

import styles from "./Parques.module.css";
import tresPicosBanner from "../../assets/trespicos.jpg";
import caixaDeFosforos from "../../assets/zmochileiro-caixa-de-fosforos1.jpg";
import cabecaDoDragao from "../../assets/cabeca-de-dragao-1024x578.jpg";
import doisBicos from "../../assets/dois_bicos.jpg";
import brancaDeNeve from "../../assets/branca de neve.jpg";
import torresDeBonsucesso from "../../assets/bonsucesso_torres1-MM-1024x683.jpg";
import dedoDeDeus from "../../assets/dedo-de-deus.jpg";

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

export const TresPicos = () => {

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

  const trilhasTresPicos = trilhas.filter(
    (trilha) => trilha.parque === "tres-picos"
  );

  return (
    <>
      <main className={styles.principal}>

        <div
          id={styles.imgtres_picos}
          data-content="Parque Estadual Três Picos"
          style={{ backgroundImage: `url(${tresPicosBanner})` }}
        ></div>

        <div className={styles.sobre}>
          <h2>Sobre</h2>
        </div>

        <div className={styles.caixa}>
          <section className={styles.card}>
            <div className={styles.itens}>
              <p>
                O Parque Estadual dos Três Picos (PETP) localiza-se na Região Serrana do Estado do Rio de Janeiro, no Brasil.
                O seu nome evoca os Três Picos de Teresópolis-Friburgo, imponente conjunto de montanhas graníticas cuja altitude chega a 2 366 metros[1]
                acima do nível do mar e é o ponto culminante de toda a Serra do Mar. O Parque Estadual dos Três Picos, criado em 2002, é o maior
                do Rio de Janeiro e tem sua história ligada à preservação da Mata Atlântica fluminense. Sua fundação buscou formar um corredor ecológico para garantir a biodiversidade,
                interligando áreas protegidas do estado. O nome deriva das montanhas imponentes que o compõem, com destaque para o Pico Maior, o ponto mais alto da Serra do Mar.
              </p>

              <a href="#explore" className={styles.btn}>
                EXPLORE
              </a>
            </div>
          </section>
        </div>

        <div>
          <section className={`${styles.trilhas} ${styles.caixa}`}>

            <div
              className={styles.sobre}
              style={{ marginBottom: "2em" }}
            >
              <h2>Nossas trilhas</h2>
            </div>

            <div className={styles.menu_trilhas} id="explore">

              <article className={styles.menu_cards}>
                <img
                  className={styles.img_trilhas}
                  src={caixaDeFosforos}
                  alt="Caixa de Fósforos"
                />

                <div className={styles.texto_trilhas}>
                  <h3>Pedra Caixa de Fósforo</h3>

                  <p>
                    A Caixa (ou Caixinha) de Fósforos, que também já foi conhecida como “Pedra dos Milagres”
                    justamente por conta das características acima, é mais uma impressionante formação rochosa
                    localizada em Teresópolis e que atrai os olhares de montanhistas e curiosos de todo o mundo para o município.
                  </p>
                </div>
              </article>

              <article className={styles.menu_cards}>
                <img
                  className={styles.img_trilhas}
                  src={cabecaDoDragao}
                  alt="Cabeça do Dragão"
                />

                <div className={styles.texto_trilhas}>
                  <h3>Cabeça do Dragão</h3>

                  <p>
                    A primeira parte é bem marcada e com vegetação mais alta, cobrindo do sol, e há placas.
                    Em pouco tempo a trilha passa para um aclive constante, mas não muito pesado.
                    Segue assim até um mirante que já está em altitude suficiente para uma vista espetacular do Capacete e dos Três Picos.
                  </p>
                </div>
              </article>

              <article className={styles.menu_cards}>
                <img
                  className={styles.img_trilhas}
                  src={doisBicos}
                  alt="Dois Bicos"
                />

                <div className={styles.texto_trilhas}>
                  <h3> Dois Bicos</h3>

                  <p>
                    Dois Bicos é um conjunto rochoso localizado no vale das Sebastianas, já dentro da área do parque dos Três Picos. O acesso é pela estrada Teresópolis-Friburgo, a cerca de 20 km de Teresópolis.
                    Tomar a estradinha de terra à direita.
                  </p>
                </div>
              </article>

            </div>

            <a
              className={`${styles.btn} ${styles.section_btn}`}
              href="#ver_mais"
            >
              Ver mais trilhas
            </a>

          </section>
        </div>

        <article className={styles.trilha_picos} id="ver_mais">
          <div>
            <img
              className={styles.img_sessao_trilhas}
              src={brancaDeNeve}
              alt="Pico Branca de Neve"
            />
          </div>

          <h3>Pico Branca de Neve </h3>

          <div className={styles.texto_trilhas_ver_mais}>
            <p>
              A trilha para a Branca de Neve está localizada no município de Teresópolis dentro do local conhecido como Vale dos Frades.
              Vale único e oferece opções de lazer para todos os públicos. É a montanha mais alta do conjunto das Pedras dos Frades, a sudeste do alinhamento formado pelo Morro dos Cabritos e Pedra das Antas.
              Fica ao fundo do vale do Rio das Antas.
            </p>
          </div>
        </article>

        <article className={styles.trilha_picos}>
          <div className={styles.texto_trilhas_ver_mais}>
            <p>
              A trilha é bastante íngreme, com desnível de aproximadamente 800 metros se o caminhante seguir até a Torre Central e cerca de 1000 metros de diferença entre saída e chegada se o destino for a Torre Maior.
            </p>
          </div>

          <h3>Torres de Bonsucesso</h3>

          <img
            className={styles.img_sessao_trilhas}
            src={torresDeBonsucesso}
            alt="Torres de Bonsucesso"
          />
        </article>

        <article className={styles.trilha_picos}>
          <img
            className={styles.img_sessao_trilhas}
            src={dedoDeDeus}
            alt="Mirante Soberbo"
          />

          <h3>Trilha do Mirante do Soberbo</h3>

          <div className={styles.texto_trilhas_ver_mais}>
            <p>
              Trilha saindo ao sul de Teresópolis, na divisa do Parque da Serra dos Órgãos. O Mirante do Soberbo fica
              logo na saída da Rodovia Santos Dumont. O local é acessível a todas as idades e há um pequeno estacionamento no local
              Ótimo local para apreciar o nascer do sol. A vista do parque é belíssima.
            </p>
          </div>
        </article>

        <section className={`${styles.trilhas} ${styles.caixa}`}>

          <div
            className={styles.sobre}
            style={{ marginBottom: "2em" }}
          >
            <h2>Outras trilhas do parque</h2>
          </div>

          {carregando && (
            <p>Carregando trilhas...</p>
          )}

          {erro && (
            <p role="alert">{erro}</p>
          )}

          {!carregando && !erro && trilhasTresPicos.length === 0 && (
            <p>Nenhuma trilha adicional cadastrada.</p>
          )}

          {!carregando && !erro && (
            <div className={styles.menu_trilhas}>

              {trilhasTresPicos.map((trilha) => (

                <article
                  className={styles.menu_cards}
                  key={trilha.id}
                >

                  {trilha.imagem_url ? (
                    <img
                      className={styles.img_trilhas}
                      src={trilha.imagem_url}
                      alt={trilha.nome}
                    />
                  ) : (
                    <div className={styles.imagemTrilhaDinamica}>
                      <span>Imagem não disponível</span>
                    </div>
                  )}

                  <div className={styles.texto_trilhas}>

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

                </article>

              ))}

            </div>
          )}

        </section>

        <div className={styles.caixa}>

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
                Integrar o Mosaico de Áreas Protegidas da Mata Atlântica Central Fluminense, no Estado do Rio de Janeiro, contribuindo para a conectividade
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59006.88269812957!2d-43.0057115290339!3d-22.431654015383938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99b310d913be2d%3A0x197b3c3a77b54fb4!2sParque%20Estadual%20dos%20Tr%C3%AAs%20Picos%20-%20Sede%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1763842321562!5m2!1spt-BR!2sbr"
              width="600"
              height="450"
              title="Localização do Parque Estadual dos Três Picos"
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
                Hoje o Parque Estadual dos Três Picos é muito mais do que uma reserva natural;
                é um símbolo do compromisso contínuo da comunidade em preservar e valorizar o rico patrimônio ambiental da região,
                garantindo um futuro sustentável para as gerações futuras. Venha explorar e descobrir as maravilhas deste tesouro natural.
              </p>
            </div>
          </section>

        </div>

      </main>
    </>
  );
};
