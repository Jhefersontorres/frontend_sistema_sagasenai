const parametros =
    new URLSearchParams(
        window.location.search
    );


let idEscuderia =
    parametros.get("id");


// FALLBACK:
// se o Railway retirar o parâmetro da URL,
// recupera o ID salvo anteriormente

if (!idEscuderia) {

    idEscuderia =
        sessionStorage.getItem(
            "id_escuderia_detalhes"
        );

}


// Se recebeu pela URL,
// mantém também salvo na sessão

if (idEscuderia) {

    sessionStorage.setItem(
        "id_escuderia_detalhes",
        idEscuderia
    );

}


if (!idEscuderia) {

    alert(
        "Escuderia não identificada."
    );

    window.location.href =
        "escuderias.html";
}

if (!idEscuderia) {
  alert("Escuderia não identificada.");

  window.location.href = "escuderias.html";
}

async function carregarDetalhesEscuderia() {
  try {
    const escuderias = await listarEscuderias();

    const escuderia = escuderias.find(
      (e) => Number(e.id_escuderia) === Number(idEscuderia),
    );

    if (!escuderia) {
      document.getElementById("nomeEscuderia").textContent =
        "Escuderia não encontrada";

      return;
    }

    document.getElementById("nomeEscuderia").textContent =
      escuderia.nome_escuderia;

    document.getElementById("turmaEscuderia").textContent = escuderia.turma;

    document.getElementById("mentorEscuderia").textContent =
      escuderia.nome_mentor;
    document.getElementById("cursoEscuderia").textContent =
      escuderia.curso || "—";
    document.getElementById("etapaEscuderia").textContent =
      escuderia.etapa || "—";
    document.getElementById("periodoEscuderia").textContent =
      escuderia.periodo || "—";
    document.getElementById("escolaEscuderia").textContent =
      escuderia.escola || "—";

    await verificarResultado();
  } catch (erro) {
    console.error("Erro ao carregar escuderia:", erro);
  }
}

async function verificarResultado() {
  const area = document.getElementById("areaResultado");

  try {
    const status = await obterStatusDivulgacao();

    if (status.mostrar_resultado) {
      await carregarDesempenho();

      return;
    }

    if (!status.data_divulgacao) {
      area.innerHTML = `

                <div class="mensagem-resultado">

                    <p class="icone-status">
                        🏁
                    </p>

                    <p>
                        Resultado ainda não disponível.
                    </p>

                </div>

            `;

      return;
    }

    const agora = new Date();

    const dataDivulgacao = new Date(status.data_divulgacao);

    if (agora >= dataDivulgacao) {
      area.innerHTML = `

                <div class="mensagem-resultado">

                    <p class="icone-status">
                        ⏳
                    </p>

                    <p>
                        Aguardando divulgação oficial...
                    </p>

                </div>

            `;

      return;
    }

    area.innerHTML = `

            <div class="mensagem-resultado">

                <p class="icone-status">
                    🏁
                </p>

                <p>
                    Resultado ainda não divulgado.
                </p>

            </div>

        `;
  } catch (erro) {
    console.error("Erro ao verificar divulgação:", erro);

    area.innerHTML = `

            <p>
                Não foi possível carregar
                as informações do resultado.
            </p>

        `;
  }
}

async function carregarDesempenho() {
  const area = document.getElementById("areaResultado");

  try {
    const desempenho = await obterDesempenhoEscuderia(idEscuderia);

    montarResultado(desempenho);
  } catch (erro) {
    console.error("Erro ao carregar desempenho:", erro);

    area.innerHTML = `

            <p>
                Não foi possível carregar
                o desempenho desta escuderia.
            </p>

        `;
  }
}

function montarResultado(desempenho) {
  const area = document.getElementById("areaResultado");

  let medalha = "🏁";

  if (desempenho.posicao === 1) {
    medalha = "🥇";
  } else if (desempenho.posicao === 2) {
    medalha = "🥈";
  } else if (desempenho.posicao === 3) {
    medalha = "🥉";
  }

  const criteriosHTML = desempenho.criterios
    .map((criterio) => {
      const porcentagem = Math.min(criterio.media * 10, 100);

      return `

                    <div class="criterio-card">

                        <div class="criterio-topo">

                            <span class="criterio-descricao">
                                ${escapeHtml(criterio.descricao)}
                            </span>

                            <strong class="criterio-nota">
                                ${formatarNota(criterio.media)}
                            </strong>

                        </div>


                        <div class="barra-fundo">

                            <div
                                class="barra-progresso"
                                style="width: ${porcentagem}%;">
                            </div>

                        </div>

                    </div>

                `;
    })
    .join("");

  let comentariosHTML = `

        <p class="sem-comentarios">
            Nenhum comentário registrado.
        </p>

    `;

  if (desempenho.comentarios && desempenho.comentarios.length > 0) {
    comentariosHTML = desempenho.comentarios
      .map((comentario) => {
        return `

                        <div class="comentario-card">

                            <span class="icone-comentario">
                                💬
                            </span>

                            <p>
                                ${escapeHtml(comentario)}
                            </p>

                        </div>

                    `;
      })
      .join("");
  }

  area.innerHTML = `

        <section class="resumo-resultado">

            <div class="colocacao">

                <span class="medalha">
                    ${medalha}
                </span>

                <strong>
                    ${desempenho.posicao}º LUGAR
                </strong>

            </div>


            <div class="nota-final">

                <span>
                    NOTA FINAL
                </span>

                <strong>
                    ${formatarNota(desempenho.nota_final)}
                </strong>

            </div>

        </section>


        <section class="secao-desempenho">

            <h2>
                Desempenho por Critério
            </h2>

            <div class="lista-criterios">

                ${criteriosHTML}

            </div>

        </section>


        <section class="secao-comentarios">

            <h2>
                Comentários dos Avaliadores
            </h2>

            <p class="aviso-anonimo">
                Os comentários são apresentados
                de forma anônima.
            </p>

            <div class="lista-comentarios">

                ${comentariosHTML}

            </div>

        </section>

    `;
}

function formatarNota(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

carregarDetalhesEscuderia();
