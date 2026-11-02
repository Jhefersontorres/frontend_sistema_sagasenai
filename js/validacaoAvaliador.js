const form = document.getElementById("formValidacao");
const inputCodigo = document.getElementById("inputCodigo");
const btnVoltar = document.getElementById("btnVoltar");

btnVoltar.addEventListener("click", () => {
  window.location.href = "paginaInicial.html";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const sessao = await validarCodigoAvaliador(inputCodigo.value);
    sessionStorage.setItem("avaliador_event_token", sessao.token);
    sessionStorage.removeItem("avaliador_token");
    sessionStorage.removeItem("id_avaliador");
    sessionStorage.removeItem("nome_avaliador");
    window.location.href = "identificacaoAvaliador.html";
  } catch (erro) {
    alert(erro.message);
    inputCodigo.value = "";
    inputCodigo.focus();
  } finally {
    submitButton.disabled = false;
  }
});
