document
  .getElementById("formCadastroEscuderia")
  .addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nomeEscuderia = document.getElementById("inputNomeEscuderia").value;

    const turma = document.getElementById("inputTurma").value;

    const nomeMentor = document
      .getElementById("inputMentor")
      .value.toUpperCase();
    const curso = document.getElementById("inputCurso").value;
    const etapa = document.getElementById("inputEtapa").value;
    const periodo = document.getElementById("inputPeriodo").value;
    const escola = document.getElementById("inputEscola").value;

    try {
      const resultado = await cadastrarEscuderia(
        nomeEscuderia,
        turma,
        nomeMentor,
        curso,
        etapa,
        periodo,
        escola,
      );

      alert(resultado.message || "Escuderia cadastrada com sucesso!");
      document.getElementById("formCadastroEscuderia").reset();
    } catch (erro) {
      console.error("Erro ao cadastrar escuderia:", erro);
      alert(erro.message || "Não foi possível cadastrar a escuderia.");
    }
  });

const inputBusca = document.getElementById("inputBusca");

const lista = document.getElementById("listaEscuderias");

const btnBuscar = document.getElementById("btnBuscar");

let escuderiaSelecionada = null;

inputBusca.addEventListener("input", () => {
  const termo = inputBusca.value.toLowerCase().trim();

  escuderiaSelecionada = null;

  if (termo === "") {
    lista.style.display = "none";

    lista.innerHTML = "";

    return;
  }

  lista.style.display = "block";

  carregarEscuderias(termo);
});

btnBuscar.addEventListener("click", () => {
  if (!escuderiaSelecionada) {
    alert("Selecione uma escuderia na lista de resultados.");

    inputBusca.focus();

    return;
  }
  
  abrirDetalhesEscuderia(
    escuderiaSelecionada.id_escuderia
);
});

inputBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    evento.preventDefault();

    btnBuscar.click();
  }
});

document.addEventListener("click", (evento) => {
  if (!inputBusca.contains(evento.target) && !lista.contains(evento.target)) {
    lista.style.display = "none";
  }
});

inputBusca.addEventListener("focus", () => {
  if (escuderiaSelecionada) {
    return;
  }

  if (inputBusca.value.trim() !== "") {
    lista.style.display = "block";

    carregarEscuderias(inputBusca.value.toLowerCase().trim());
  }
});

async function carregarEscuderias(termoBusca = "") {
  let escuderias;
  try {
    escuderias = await listarEscuderias();
  } catch (erro) {
    console.error("Erro ao carregar escuderias:", erro);
    lista.replaceChildren();
    const itemErro = document.createElement("li");
    itemErro.textContent = erro.message || "Não foi possível carregar as escuderias.";
    lista.appendChild(itemErro);
    return;
  }

  lista.innerHTML = "";

  const termo = termoBusca.toLowerCase().trim();

  const filtradas = escuderias.filter((e) => {
    const nome = e.nome_escuderia?.toLowerCase() || "";

    const turma = e.turma?.toLowerCase() || "";

    const mentor = e.nome_mentor?.toLowerCase() || "";
    const curso = e.curso?.toLowerCase() || "";
    const etapa = e.etapa?.toLowerCase() || "";
    const periodo = e.periodo?.toLowerCase() || "";
    const escola = e.escola?.toLowerCase() || "";

    return (
      nome.includes(termo) ||
      turma.includes(termo) ||
      mentor.includes(termo) ||
      curso.includes(termo) ||
      etapa.includes(termo) ||
      periodo.includes(termo) ||
      escola.includes(termo)
    );
  });

  if (filtradas.length === 0) {
    const itemVazio = document.createElement("li");

    itemVazio.textContent = "Nenhum resultado encontrado";

    itemVazio.style.color = "#999";

    lista.appendChild(itemVazio);

    return;
  }

  filtradas.forEach((e) => {
    const item = document.createElement("li");

    const nome = document.createElement("strong");
    nome.textContent = e.nome_escuderia || "";
    item.append(
      nome,
      document.createTextNode(
        ` — Turma: ${e.turma || ""} | Mentor: ${e.nome_mentor || ""}`,
      ),
    );

    item.addEventListener("click", () => {
      escuderiaSelecionada = e;

      inputBusca.value = e.nome_escuderia;

      lista.innerHTML = "";

      lista.style.display = "none";
    });

    lista.appendChild(item);
  });
}

async function verificarDivulgacao() {
  const bloco = document.getElementById("blocoDivulgacao");
  let status;
  try {
    status = await obterStatusDivulgacao();
  } catch (erro) {
    console.error("Erro ao carregar divulgação:", erro);
    bloco.textContent = erro.message || "Não foi possível carregar o status da divulgação.";
    return;
  }

  if (status.mostrar_resultado) {
    bloco.innerHTML = `
            <a href="resultado.html">
                <button>
                    Ver Resultados 🏆
                </button>
            </a>
        `;

    bloco.style.backgroundColor = "transparent";

    bloco.style.backdropFilter = "";

    bloco.style.webkitBackdropFilter = "";

    bloco.style.border = "";

    bloco.style.boxShadow = "";

    return;
  }

  if (!status.data_divulgacao) {
    bloco.innerHTML = "";

    bloco.style.backgroundColor = "transparent";

    bloco.style.border = "";

    bloco.style.boxShadow = "";

    return;
  }

  bloco.style.backgroundColor = "#ffff";

  bloco.style.backdropFilter = "blur(8px)";

  bloco.style.webkitBackdropFilter = "blur(8px)";

  bloco.style.border = "1px solid rgba(255, 255, 255, 0.4)";

  bloco.style.boxShadow = "0 10px 40px rgba(16, 44, 117, 0.15)";

  const dataAlvo = new Date(status.data_divulgacao);

  function atualizarContagem() {
    const agora = new Date();

    const diferenca = dataAlvo - agora;

    if (diferenca <= 0) {
      bloco.innerHTML = `
                <p class="statusDivulgacao">
                    Aguardando divulgação...
                </p>
            `;

      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);

    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);

    bloco.innerHTML = `

            <p class="statusDivulgacao">
                <strong>
                    Divulgação dos resultados em:
                </strong>
            </p>

            <p id="contagem">
                ${dias} dia(s),
                ${horas} hora(s) e
                ${minutos} minuto(s)...
            </p>

            <p class="statusDivulgacao">
                Boa sorte!
            </p>

        `;
  }

  atualizarContagem();

  setInterval(atualizarContagem, 60000);
}

verificarDivulgacao();
