const tokenAdmin = sessionStorage.getItem("admin_token");

async function protegerPaginaAdmin() {
  if (!tokenAdmin) {
    window.location.href = "validacaoAdmin.html";

    return false;
  }

  const autorizado = await verificarSessaoAdmin(tokenAdmin);

  if (!autorizado) {
    sessionStorage.removeItem("admin_token");

    window.location.href = "validacaoAdmin.html";

    return false;
  }

  return true;
}

let statusAtual = null;

const statusSistema = document.getElementById("statusSistema");

const campoData = document.getElementById("dataDivulgacao");

const btnSalvarData = document.getElementById("btnSalvarData");

const btnLiberar = document.getElementById("btnLiberar");

const btnFechar = document.getElementById("btnFechar");

document.getElementById("voltarSistema").addEventListener("click", () => {
  sessionStorage.removeItem("admin_token");
});

async function carregarStatusAdmin() {
  try {
    statusAtual = await obterStatusDivulgacao();

    atualizarTela();
  } catch (erro) {
    console.error(erro);

    statusSistema.innerHTML = `

            <div class="status-erro">

                ⚠️ Não foi possível carregar
                o status do sistema.

            </div>

        `;
  }
}

function atualizarTela() {
  const liberado = Boolean(statusAtual.mostrar_resultado);

  if (liberado) {
    statusSistema.innerHTML = `

            <div class="status-aberto">

                <span class="icone-status">
                    🟢
                </span>

                <div>

                    <strong>
                        RESULTADOS DIVULGADOS
                    </strong>

                    <p>
                        🔒 Novas avaliações estão bloqueadas.
                    </p>

                </div>

            </div>

        `;

    btnLiberar.disabled = true;
    btnFechar.disabled = false;
  } else {
    statusSistema.innerHTML = `

            <div class="status-fechado">

                <span class="icone-status">
                    🔴
                </span>

                <div>

                    <strong>
                        RESULTADOS FECHADOS
                    </strong>

                    <p>
                        📝 As avaliações estão abertas.
                    </p>

                </div>

            </div>

        `;

    btnLiberar.disabled = false;
    btnFechar.disabled = true;
  }

  if (statusAtual.data_divulgacao) {
    campoData.value = converterParaDatetimeLocal(statusAtual.data_divulgacao);
  }
}

btnSalvarData.addEventListener("click", async () => {
  if (!campoData.value) {
    alert("Informe a data e o horário da divulgação.");

    return;
  }

  try {
    const dataISO = new Date(campoData.value).toISOString();

    await definirDivulgacao(Boolean(statusAtual.mostrar_resultado), dataISO);

    alert("Data da divulgação salva com sucesso!");

    await carregarStatusAdmin();
  } catch (erro) {
    alert(erro.message);
  }
});

btnLiberar.addEventListener("click", async () => {
  const confirmar = confirm(
    "Deseja realmente liberar os resultados?\n\n" +
      "O ranking será registrado e novas avaliações " +
      "ficarão bloqueadas.",
  );

  if (!confirmar) {
    return;
  }

  try {
    let dataISO;

    if (campoData.value) {
      dataISO = new Date(campoData.value).toISOString();
    } else {
      dataISO = new Date().toISOString();
    }

    await definirDivulgacao(true, dataISO);

    alert("Resultados liberados com sucesso!");

    await carregarStatusAdmin();
  } catch (erro) {
    alert(erro.message);
  }
});

btnFechar.addEventListener("click", async () => {
  const confirmar = confirm(
    "Deseja fechar os resultados?\n\n" +
      "As avaliações voltarão a ser permitidas.",
  );

  if (!confirmar) {
    return;
  }

  try {
    let dataISO = null;

    if (campoData.value) {
      dataISO = new Date(campoData.value).toISOString();
    }

    await definirDivulgacao(false, dataISO);

    alert("Resultados fechados com sucesso!");

    await carregarStatusAdmin();
  } catch (erro) {
    alert(erro.message);
  }
});

function converterParaDatetimeLocal(data) {
  const objetoData = new Date(data);

  const ano = objetoData.getFullYear();

  const mes = String(objetoData.getMonth() + 1).padStart(2, "0");

  const dia = String(objetoData.getDate()).padStart(2, "0");

  const hora = String(objetoData.getHours()).padStart(2, "0");

  const minuto = String(objetoData.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

async function iniciarAdmin() {
  let autorizado;
  try {
    autorizado = await protegerPaginaAdmin();
  } catch (erro) {
    console.error("Erro ao verificar sessão administrativa:", erro);
    alert(erro.message || "Não foi possível verificar a sessão administrativa.");
    return;
  }

  if (!autorizado) {
    return;
  }

  await carregarStatusAdmin();
}

iniciarAdmin();
