document.getElementById("btnAlunoMentor").addEventListener("click", () => {
  window.location.href = "escuderias.html";
});

document.getElementById("btnAvaliador").addEventListener("click", () => {
  window.location.href = "validacaoAvaliador.html";
});

document.getElementById("btnResultado").addEventListener("click", () => {
  window.location.href = "resultado.html";
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "g") {
    event.preventDefault();

    window.location.href = "validacaoAdmin.html";
  }
});
