const idAvaliador =
  sessionStorage.getItem("id_avaliador");

const nomeAvaliador =
  sessionStorage.getItem("nome_avaliador");

const tokenAvaliador =
  sessionStorage.getItem("avaliador_token");


if (!idAvaliador || !tokenAvaliador) {
  window.location.href = "validacaoAvaliador.html";
}


document.getElementById(
  "avaliadorLogado"
).textContent =
  `Avaliando como: ${nomeAvaliador}`;

let escuderiasAvaliadas = [];

function abrirAvaliacaoEscuderia(idEscuderia) {

  if (!idEscuderia) {

    alert(
      "Não foi possível identificar a escuderia."
    );

    return;

  sessionStorage.setItem(
    "id_escuderia_avaliacao",
    String(idEscuderia)
  );
  }

  console.log(
    "Escuderia selecionada para avaliação:",
    idEscuderia
  );


  const id =
    encodeURIComponent(idEscuderia);

  if (
    window.location.hostname.includes(
      "railway.app"
    )
  ) {

    window.location.href =
      `avaliacaoEscuderia?id=${id}`;

  } else {

    window.location.href =
      `avaliacaoEscuderia.html?id=${id}`;

  }

}

async function carregarMinhasAvaliacoes() {

  const container =
    document.getElementById(
      "minhasAvaliacoes"
    );


  try {

    const resposta =
      await fetch(
        `${API_URL}/avaliadores/${encodeURIComponent(idAvaliador)}/escuderias-avaliadas`,
        {
          headers: {
            Authorization: `Bearer ${tokenAvaliador}`,
          },
        }
      );


    escuderiasAvaliadas = await lerRespostaApi(
      resposta,
      "Não foi possível carregar as avaliações.",
    );


    exibirMinhasAvaliacoes();


  } catch (erro) {

    console.error(
      "Erro ao carregar avaliações:",
      erro
    );


    container.innerHTML = `
      <p>
        Não foi possível carregar suas avaliações.
      </p>
    `;

  }

}

function exibirMinhasAvaliacoes() {

  const container =
    document.getElementById(
      "minhasAvaliacoes"
    );


  container.innerHTML = "";


  if (
    escuderiasAvaliadas.length === 0
  ) {

    container.innerHTML = `
      <p>
        Nenhuma avaliação realizada ainda.
      </p>
    `;

    return;
  }


  escuderiasAvaliadas.forEach(
    (escuderia) => {

      const card =
        document.createElement("div");


      card.classList.add(
        "card-avaliacao"
      );

      if (
        escuderia.status === "concluida"
      ) {

        card.classList.add(
          "avaliacao-concluida"
        );


        card.innerHTML = `

          <strong>
            ✅ ${escapeHtml(escuderia.nome_escuderia)}
          </strong>

          <p>
            Turma: ${escapeHtml(escuderia.turma)}
          </p>

          <p>
            Mentor: ${escapeHtml(escuderia.mentor)}
          </p>

          <small>
            Avaliação concluída
          </small>

        `;

      }

      else {

        card.classList.add(
          "avaliacao-andamento"
        );


        card.innerHTML = `

          <strong>
            🟡 ${escapeHtml(escuderia.nome_escuderia)}
          </strong>

          <p>
            Turma: ${escapeHtml(escuderia.turma)}
          </p>

          <p>
            Mentor: ${escapeHtml(escuderia.mentor)}
          </p>

          <small>

            ${escapeHtml(escuderia.criterios_avaliados)}

            de

            ${escapeHtml(escuderia.total_criterios)}

            critérios avaliados

          </small>

        `;


        card.style.cursor =
          "pointer";


        card.addEventListener(
          "click",
          () => {

            abrirAvaliacaoEscuderia(
              escuderia.id_escuderia
            );

          }
        );

      }


      container.appendChild(card);

    }
  );

}

document
  .getElementById("btnBuscar")
  .addEventListener(
    "click",
    () => {

      const termo =
        document
          .getElementById(
            "inputBusca"
          )
          .value
          .toLowerCase()
          .trim();


      carregarEscuderias(
        termo
      );

    }
  );

document
  .getElementById("inputBusca")
  .addEventListener(
    "input",
    () => {

      const campoBusca =
        document.getElementById(
          "inputBusca"
        );

      const lista =
        document.getElementById(
          "listaEscuderias"
        );


      if (
        campoBusca.value.trim() === ""
      ) {

        lista.innerHTML = "";

        lista.style.display =
          "none";

      }

    }
  );

document
  .getElementById("inputBusca")
  .addEventListener(
    "keydown",
    (evento) => {

      if (
        evento.key === "Enter"
      ) {

        evento.preventDefault();

        document
          .getElementById(
            "btnBuscar"
          )
          .click();

      }

    }
  );

async function carregarEscuderias(
  termoBusca = ""
) {

  console.log(
    "Buscando escuderias:",
    termoBusca
  );


  let escuderias;
  try {
    escuderias = await listarEscuderias();
  } catch (erro) {
    console.error("Erro ao carregar escuderias:", erro);
    const lista = document.getElementById("listaEscuderias");
    const itemErro = document.createElement("li");
    itemErro.textContent =
      erro.message || "Não foi possível carregar as escuderias.";
    lista.replaceChildren(itemErro);
    lista.style.display = "block";
    return;
  }


  const lista =
    document.getElementById(
      "listaEscuderias"
    );


  lista.innerHTML = "";


  if (
    termoBusca === ""
  ) {

    lista.style.display =
      "none";

    return;
  }


  lista.style.display =
    "block";


  const filtradas =
    escuderias.filter(
      (e) => {

        const nomeEscuderia =
          e.nome_escuderia
            ?.toLowerCase() || "";

        const turma =
          e.turma
            ?.toLowerCase() || "";

        const mentor =
          e.nome_mentor
            ?.toLowerCase() || "";


        return (

          nomeEscuderia.includes(
            termoBusca
          ) ||

          turma.includes(
            termoBusca
          ) ||

          mentor.includes(
            termoBusca
          )

        );

      }
    );

  if (
    filtradas.length === 0
  ) {

    const item =
      document.createElement("li");


    item.textContent =
      "Nenhuma escuderia encontrada.";


    lista.appendChild(item);

    return;
  }

  filtradas.forEach(
    (e) => {

      const item =
        document.createElement("li");


      const avaliacaoExistente =
        escuderiasAvaliadas.find(
          (avaliada) =>
            Number(
              avaliada.id_escuderia
            ) ===
            Number(
              e.id_escuderia
            )
        );

      if (
        avaliacaoExistente &&
        avaliacaoExistente.status ===
          "concluida"
      ) {

        item.classList.add(
          "escuderia-concluida"
        );


        item.innerHTML = `

          <strong>
            ${escapeHtml(e.nome_escuderia)}
          </strong>

          <br>

          Turma: ${escapeHtml(e.turma)}

          <br>

          Mentor: ${escapeHtml(e.nome_mentor)}

          <br>

          <span>
            ✅ Avaliação concluída
          </span>

        `;


        item.style.cursor =
          "default";

      }

      else if (
        avaliacaoExistente &&
        avaliacaoExistente.status ===
          "em_andamento"
      ) {

        item.classList.add(
          "escuderia-andamento"
        );


        item.innerHTML = `

          <strong>
            ${escapeHtml(e.nome_escuderia)}
          </strong>

          <br>

          Turma: ${escapeHtml(e.turma)}

          <br>

          Mentor: ${escapeHtml(e.nome_mentor)}

          <br>

          <span>
            🟡 Avaliação em andamento
          </span>

          <br>

          <small>

            ${escapeHtml(avaliacaoExistente.criterios_avaliados)}

            de

            ${escapeHtml(avaliacaoExistente.total_criterios)}

            critérios avaliados

          </small>

        `;


        item.style.cursor =
          "pointer";


        item.addEventListener(
          "click",
          () => {

            abrirAvaliacaoEscuderia(
              e.id_escuderia
            );

          }
        );

      }

      else {

        item.classList.add(
          "escuderia-nao-avaliada"
        );


        item.innerHTML = `

          <strong>
            ${escapeHtml(e.nome_escuderia)}
          </strong>

          <br>

          Turma: ${escapeHtml(e.turma)}

          <br>

          Mentor: ${escapeHtml(e.nome_mentor)}

          <br>

          <span>
            📝 Avaliar escuderia
          </span>

        `;


        item.style.cursor =
          "pointer";


        item.addEventListener(
          "click",
          () => {

            abrirAvaliacaoEscuderia(
              e.id_escuderia
            );

          }
        );

      }


      lista.appendChild(
        item
      );

    }
  );

}

carregarMinhasAvaliacoes();