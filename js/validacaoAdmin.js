const form =
    document.getElementById("formValidacaoAdmin");

const inputCodigo =
    document.getElementById("inputCodigoAdmin");

const btnVoltar =
    document.getElementById("btnVoltar");


btnVoltar.addEventListener("click", () => {

    window.location.href =
        "paginaInicial.html";

});


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const codigo =
        inputCodigo.value.trim();


    if (!codigo) {

        alert(
            "Informe o código administrativo."
        );

        inputCodigo.focus();

        return;
    }


    try {

        const resultado =
            await validarCodigoAdmin(codigo);


        sessionStorage.setItem(
            "admin_token",
            resultado.token
        );


        alert(
            "Acesso administrativo concedido!"
        );


        // VAI PARA O PAINEL
        window.location.href =
            "admin.html";


    } catch (erro) {

        alert(
            erro.message
        );


        inputCodigo.value = "";

        inputCodigo.focus();

    }

});