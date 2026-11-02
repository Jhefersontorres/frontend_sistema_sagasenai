const tokenEvento = sessionStorage.getItem("avaliador_event_token");
const selectAvaliador = document.getElementById("selectAvaliador");
const botaoConfirmar = document.getElementById("btnConfirmar");

if (!tokenEvento) {
  window.location.href = "validacaoAvaliador.html";
}

async function carregarAvaliadores() {
  botaoConfirmar.disabled = true;

  try {
    const avaliadores = await obterAvaliadores();
    if (!Array.isArray(avaliadores)) {
      throw new Error("A resposta da lista de avaliadores é inválida.");
    }

    selectAvaliador.replaceChildren();
    for (const avaliador of avaliadores) {
      const opcao = document.createElement("option");
      opcao.value = avaliador.id_usuario;
      opcao.textContent = avaliador.nome;
      selectAvaliador.appendChild(opcao);
    }

    botaoConfirmar.disabled = avaliadores.length === 0;
  } catch (erro) {
    alert(erro.message || "Não foi possível carregar os avaliadores.");
    sessionStorage.removeItem("avaliador_event_token");
    window.location.href = "validacaoAvaliador.html";
  }
}

botaoConfirmar.addEventListener("click", async () => {
  if (!selectAvaliador.value) {
    alert("Selecione um avaliador.");
    return;
  }

  botaoConfirmar.disabled = true;
  try {
    const sessao = await criarSessaoAvaliador(selectAvaliador.value);
    sessionStorage.setItem("avaliador_token", sessao.token);
    sessionStorage.setItem("id_avaliador", String(sessao.id_avaliador));
    sessionStorage.setItem("nome_avaliador", sessao.nome);
    sessionStorage.removeItem("avaliador_event_token");
    window.location.href = "escuderiasAvaliadas.html";
  } catch (erro) {
    alert(erro.message || "Não foi possível iniciar a sessão do avaliador.");
    botaoConfirmar.disabled = false;
  }
});

carregarAvaliadores();
