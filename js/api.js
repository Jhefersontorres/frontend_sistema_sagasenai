const API_URL = (
  window.SISTEMA_GP_API_URL ??
  document.querySelector('meta[name="api-base-url"]')?.content ??
  (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://127.0.0.1:8000"
    : "")
).replace(/\/+$/, "");

async function lerRespostaApi(
  resposta,
  mensagemPadrao = "Não foi possível concluir a solicitação.",
) {
  const texto = await resposta.text();
  let dados = null;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      if (resposta.ok) {
        throw new Error("A API retornou uma resposta em formato inválido.");
      }
      dados = texto;
    }
  }

  if (!resposta.ok) {
    const detalhe =
      dados && typeof dados === "object"
        ? dados.detail || dados.message
        : dados;
    const mensagem =
      typeof detalhe === "string" ? detalhe : mensagemPadrao;
    throw new Error(mensagem || mensagemPadrao);
  }

  return dados;
}

function escapeHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, (caractere) => {
    const entidades = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entidades[caractere];
  });
}

async function cadastrarEscuderia(
  nome,
  turma,
  nome_mentor,
  curso,
  etapa,
  periodo,
  escola,
) {
  const resposta = await fetch(`${API_URL}/escuderias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      turma,
      nome_mentor,
      curso,
      etapa,
      periodo,
      escola,
    }),
  });
  return lerRespostaApi(resposta, "Não foi possível cadastrar a escuderia.");
}

async function listarEscuderias() {
  const resposta = await fetch(`${API_URL}/escuderias`);
  return lerRespostaApi(resposta, "Não foi possível carregar as escuderias.");
}

async function obterCriterios() {
  const resposta = await fetch(`${API_URL}/criterios`);
  return lerRespostaApi(resposta, "Não foi possível carregar os critérios.");
}

async function obterAvaliadores() {
  const token = sessionStorage.getItem("avaliador_event_token");
  const resposta = await fetch(`${API_URL}/avaliadores`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return lerRespostaApi(resposta, "Não foi possível carregar os avaliadores.");
}

async function validarCodigoAvaliador(codigo) {
  const resposta = await fetch(`${API_URL}/avaliadores/validar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo }),
  });
  return lerRespostaApi(resposta, "Não foi possível validar o código.");
}

async function criarSessaoAvaliador(idAvaliador) {
  const token = sessionStorage.getItem("avaliador_event_token");
  const resposta = await fetch(`${API_URL}/avaliadores/sessao`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id_avaliador: Number(idAvaliador) }),
  });
  return lerRespostaApi(resposta, "Não foi possível iniciar a sessão.");
}

async function cadastrarAvaliacao(
  id_escuderia,
  id_criterio,
  nota,
  comentario,
) {
  const token = sessionStorage.getItem("avaliador_token");
  const resposta = await fetch(`${API_URL}/avaliacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_escuderia,
      id_criterio,
      nota,
      comentario,
    }),
  });
  return lerRespostaApi(resposta, "Não foi possível cadastrar a avaliação.");
}

async function obterStatusDivulgacao() {
  const resposta = await fetch(`${API_URL}/divulgacao`);
  return lerRespostaApi(resposta, "Não foi possível carregar o status da divulgação.");
}

async function obterDesempenhoEscuderia(idEscuderia) {
  const resposta = await fetch(
    `${API_URL}/escuderias/${idEscuderia}/desempenho`,
  );

  return lerRespostaApi(resposta, "Não foi possível carregar o desempenho da escuderia.");
}

async function obterRanking() {
  const resposta = await fetch(`${API_URL}/ranking`);

  return lerRespostaApi(resposta, "Não foi possível carregar o ranking.");
}

async function definirDivulgacao(
    mostrarResultado,
    dataDivulgacao
) {

    const token =
        sessionStorage.getItem(
            "admin_token"
        );


    const resposta =
        await fetch(
            `${API_URL}/divulgacao`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    mostrar_resultado:
                        mostrarResultado,

                    data_divulgacao:
                        dataDivulgacao
                })
            }
        );


    return lerRespostaApi(
        resposta,
        "Não foi possível atualizar a divulgação."
    );
}

async function validarCodigoAdmin(codigo) {

    const resposta = await fetch(
        `${API_URL}/admin/validar`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                codigo: codigo
            })
        }
    );


    return lerRespostaApi(
        resposta,
        "Código administrativo inválido."
    );
}


async function verificarSessaoAdmin(token) {

    const resposta = await fetch(
        `${API_URL}/admin/verificar`,
        {
            headers: {
                "Authorization":
                    `Bearer ${token}`
            }
        }
    );


    return resposta.ok;
}

function abrirDetalhesEscuderia(idEscuderia) {

    sessionStorage.setItem(
        "id_escuderia_detalhes",
        String(idEscuderia)
    );

    const id =
        encodeURIComponent(idEscuderia);

    // Railway trabalha com URL limpa
    if (
        window.location.hostname
            .includes("railway.app")
    ) {

        window.location.href =
            `detalhesEscuderia?id=${id}`;

    } else {

        // Live Server local
        window.location.href =
            `detalhesEscuderia.html?id=${id}`;

    }
}