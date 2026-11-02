
const mensagemResultado = document.getElementById("mensagemResultado");

const conteudoResultado = document.getElementById("conteudoResultado");

const podio = document.getElementById("podio");

const listaRanking = document.getElementById("listaRanking");

async function carregarResultados() {
  try {
    
    const status = await obterStatusDivulgacao();

    if (!status.mostrar_resultado) {
      mensagemResultado.innerHTML = `

                <div class="resultado-indisponivel">

                    <span>
                        ⏳
                    </span>

                    <h3>
                        Resultados ainda não disponíveis
                    </h3>

                    <p>
                        Aguarde a divulgação oficial
                        do Grand Prix 2026.
                    </p>

                </div>

            `;

      return;
    }

    const ranking = await obterRanking();

    if (!ranking || ranking.length === 0) {
      mensagemResultado.innerHTML = `

                <div class="resultado-indisponivel">

                    <span>
                        🏁
                    </span>

                    <h3>
                        Nenhum resultado encontrado
                    </h3>

                </div>

            `;

      return;
    }

    ranking.sort((a, b) => Number(b.nota_final) - Number(a.nota_final));

    montarPodio(ranking);

    montarRanking(ranking);

    mensagemResultado.style.display = "none";

    conteudoResultado.style.display = "block";
  } catch (erro) {
    console.error("Erro ao carregar resultados:", erro);

    mensagemResultado.innerHTML = `

            <div class="resultado-indisponivel">

                <span>
                    ⚠️
                </span>

                <h3>
                    Não foi possível carregar
                    os resultados.
                </h3>

                <p>
                    Tente novamente em alguns instantes.
                </p>

            </div>

        `;
  }
}

function montarPodio(ranking) {
  podio.innerHTML = "";

  const primeiro = ranking[0];

  const segundo = ranking[1];

  const terceiro = ranking[2];

  if (segundo) {
    podio.appendChild(criarCardPodio(segundo, 2));
  }

  if (primeiro) {
    podio.appendChild(criarCardPodio(primeiro, 1));
  }

  if (terceiro) {
    podio.appendChild(criarCardPodio(terceiro, 3));
  }
}

function criarCardPodio(escuderia, posicao) {
  const card = document.createElement("div");

  card.classList.add("card-podio", `podio-${posicao}`);

  let medalha = "🏆";

  if (posicao === 1) {
    medalha = "🥇";
  } else if (posicao === 2) {
    medalha = "🥈";
  } else if (posicao === 3) {
    medalha = "🥉";
  }

  card.innerHTML = `

        <div class="medalha-podio">
            ${medalha}
        </div>

        <div class="posicao-podio">
            ${posicao}º LUGAR
        </div>

        <h4>
            ${escapeHtml(escuderia.nome_escuderia)}
        </h4>

        <div class="nota-podio">
            ${formatarNota(escuderia.nota_final)}
        </div>

        <span class="ver-detalhes">
            Ver desempenho →
        </span>

    `;

  card.addEventListener("click", () => abrirEscuderia(escuderia.id_escuderia));

  return card;
}

function montarRanking(ranking) {
  listaRanking.innerHTML = "";

  ranking.forEach((escuderia, indice) => {
    const posicao = indice + 1;

    const card = document.createElement("div");

    card.classList.add("card-ranking");

    let simbolo = `${posicao}º`;

    if (posicao === 1) {
      simbolo = "🥇";
    } else if (posicao === 2) {
      simbolo = "🥈";
    } else if (posicao === 3) {
      simbolo = "🥉";
    }

    card.innerHTML = `

                <div class="ranking-posicao">
                    ${simbolo}
                </div>

                <div class="ranking-escuderia">

                    <strong>
                        ${escapeHtml(escuderia.nome_escuderia)}
                    </strong>

                    <span>
                        Ver desempenho
                    </span>

                </div>

                <div class="ranking-nota">

                    ${formatarNota(escuderia.nota_final)}

                </div>

                <div class="ranking-seta">
                    ›
                </div>

            `;

    card.addEventListener("click", () =>
      abrirEscuderia(escuderia.id_escuderia),
    );

    listaRanking.appendChild(card);
  });
}

function abrirEscuderia(idEscuderia) {

    abrirDetalhesEscuderia(
        idEscuderia
    );

}

function formatarNota(nota) {
  return Number(nota).toFixed(2).replace(".", ",");
}

carregarResultados();
