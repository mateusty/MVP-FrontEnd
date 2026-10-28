
import { useEffect, useState } from "react";
import { buscarTrilhas } from "../../services/Api";

import styles from "./Parques.module.css";
import cartaoPostal from "../../assets/cartão_postal.jpg";
import miranteMozart from "../../assets/mirante-da-trilha-mozart.jpg";
import trilhaSuspensa from "../../assets/trilha_suspensa.jpg";

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

export const Parnaso = () => {

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
        console.error("Erro ao buscar trilhas:", erro);

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

  const trilhasParnaso = trilhas.filter(
    (trilha) => trilha.parque === "parnaso"
  );

  return (
    <>
      <main>

        <div
          id={styles.imgsdo}
          data-content="Parque Nacional Serra dos Órgãos"
        ></div>

        <section>
          <div className={styles.sobre}>
            <h2>Sobre</h2>
          </div>

          <div className={styles.corpoSobre}>
            <p>
              Criado em 30 de novembro de 1939, o PARNASO é o terceiro parque mais antigo do país (Itatiaia em 1937 e Iguaçu, também em 1939, o antecederam). Esta primeira geração de parques brasileiros reflete a chegada ao Brasil de uma preocupação mundial com a degradação dos ambientes naturais.
              <br />
              O nome do parque deriva da semelhança dos picos da serra com os tubos de órgãos de igreja, derivando daí o nome Serra dos Órgãos.
              <br />
              O Parque Nacional da Serra dos Órgãos foi criado em 30 de novembro de 1939 como o terceiro parque nacional do Brasil. O objetivo do parque era proteger as cabeceiras dos rios que correm para a bacia fluminense e proteger as montanhas espetaculares. O parque foi criado pelo governo de Getúlio Vargas pelo decreto lei 1822 de 30 de novembro de 1939 com uma área de cerca de 9.000 hectares. Abrangia partes dos municípios de Magé, Petrópolis e Teresópolis.
              <br />
              Na década de 1990, o município de Guapimirim foi separado de Magé e também passou a conter parte do parque.
            </p>
          </div>
        </section>

        <section id={styles.about}>

          <div className={styles.sobre}>
            <h2>Nossas trilhas</h2>
          </div>

          <div className={styles.trilha}>
            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo}>
                Mirante Cartão Postal
              </h3>

              <p>
                A trilha Cartão Postal está localizada no Parque Nacional da Serra dos Órgãos, criado em Novembro de 1939. A entrada da trilha é pela sede Teresópolis. Grande parte do trajeto é percorrido em meio a Mata Atlântica, cercado por grandes árvores, rica vegetação e bastante umidade. A trilha é bem definida, e o nível de dificuldade é considerado fácil a moderado, com um tempo de duração de aproximadamente 2 horas ida e volta.
              </p>
            </div>

            <img
              alt="Cartão Postal"
              src={cartaoPostal}
              width="350"
              height="350"
              className={styles.trilhaImagem}
            />
          </div>

          <div className={styles.trilha}>
            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo2}>
                Mirante Mozart Catão
              </h3>

              <p className={styles.pJacu}>
                A Trilha 360 está localizada no Parque Nacional da Serra dos Órgãos, criado em Novembro de 1939. A caminhada para o Mirante Mozart Catão não é longa mas apresentas algumas subidas. Do topo uma vista incrível da cidade de Teresópolis. Grande parte do trajeto é percorrido em meio a Mata Atlântica, cercado por grandes árvores, rica vegetação e bastante umidade. A trilha é bem definida, e o nível de dificuldade é considerado fácil a moderado.
              </p>
            </div>

            <img
              alt="Mozart Catão"
              src={miranteMozart}
              width="350"
              height="350"
              className={styles.trilhaImagem}
            />
          </div>

          <div className={styles.trilha}>
            <div className={styles.textoTrilha}>
              <h3 className={styles.titulo}>
                Trilha Suspensa
              </h3>

              <p>
                A Trilha Suspensa é uma caminhada leve de 1.300 metros, com duração aproximada de 1 hora, ideal para todas as idades e inclusive acessível a cadeirantes. O percurso começa na Praça da Barragem e possui piso de madeira e corrimão, proporcionando segurança e conforto. Construída sobre um aqueduto do início do século XX, a trilha corta um trecho de Mata Atlântica em nível elevado, permitindo observação próxima da copa das árvores e vistas panorâmicas da floresta e dos paredões do PARNASO. A trilha é circular, retornando para a Estrada da Barragem por escadarias, e no trecho final atinge alturas de até 8 metros em relação ao solo. Uma escada dá acesso aos poços do rio Paquequer, ótima opção de banho em dias quentes. Também é possível iniciar o percurso em outros trechos, como a entrada próxima à ponte sobre o Rio Paquequer até a escada que leva à Cachoeira Ceci-Peri, ou pela Praça da Barragem até o mirante do Beija-Flor.
              </p>
            </div>

            <img
              alt="Trilha Suspensa"
              src={trilhaSuspensa}
              width="350"
              height="350"
              className={styles.trilhaImagem}
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

          {!carregando && !erro && trilhasParnaso.length === 0 && (
            <p>Nenhuma trilha adicional cadastrada.</p>
          )}

          {!carregando && !erro && trilhasParnaso.map((trilha) => (

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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117988.96187098397!2d-43.05119318140586!3d-22.460806699700704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99b2fc4e7ae71d%3A0xa560f33c6b47710e!2sParque%20Nacional%20da%20Serra%20dos%20%C3%93rg%C3%A3os%20-%20PARNASO%20-%20Sede%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr"
            width="600"
            height="450"
            title="Localização do Parque Nacional da Serra dos Órgãos"
            loading="lazy"
          />
        </div>

        <section id={styles.conclusion}>

          <div className={styles.conclusaoTitulo}>
            <h2>Conclusão</h2>
          </div>

          <div className={styles.conclusao}>
            <p>
              Hoje, o Parque Nacional da Serra dos Órgãos é muito mais do que uma reserva natural; é um símbolo do compromisso contínuo da comunidade em preservar e valorizar o rico patrimônio ambiental da região, garantindo um futuro sustentável para as gerações futuras. Venha explorar e descobrir as maravilhas deste tesouro natural.
            </p>
          </div>

        </section>

      </main>
    </>
  );
};
