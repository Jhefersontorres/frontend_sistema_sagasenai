const idAvaliador = sessionStorage.getItem("id_avaliador");

if (!idAvaliador) {
    window.location.href = "validacaoAvaliador.html";
}

const parametros = new URLSearchParams(
    window.location.search
);

let idEscuderia = parametros.get("id");

if (!idEscuderia) {

    idEscuderia = sessionStorage.getItem(
        "id_escuderia_avaliacao"
    );

}

if (idEscuderia) {

    sessionStorage.setItem(
        "id_escuderia_avaliacao",
        String(idEscuderia)
    );

}

idEscuderia = Number(idEscuderia);

console.log("ID da escuderia:", idEscuderia);
console.log("ID do avaliador:", idAvaliador);

if (
    !idEscuderia ||
    Number.isNaN(idEscuderia)
) {

    alert(
        "Escuderia não identificada. Selecione novamente a escuderia."
    );

    window.location.href =
        "escuderiasAvaliadas.html";
}

function obterComentarioPadrao(idCriterio, nota) {

    nota = Number(nota);

    const comentarios = {

        // CRITÉRIO 9
        // Apresentação do Elevator Pitch
        9: {

            nota10:
                "A equipe apresentou uma excelente postura, vendendo a ideia de forma convincente.",

            nota6a9:
                "A equipe apresentou com uma boa postura e vendendo bem a ideia.",

            nota1a5:
                "A equipe apresentou razoavelmente, vendendo pouco a ideia.",

            nota0:
                "A equipe não apresentou."
        },


        // CRITÉRIO 10
        // Caráter inovador e potencial de mercado
        10: {

            nota10:
                "O Pitch reforçou de forma excelente o caráter inovador e o potencial de mercado do projeto perante possíveis concorrentes.",

            nota6a9:
                "O Pitch reforçou bem o caráter inovador e o potencial de mercado do projeto perante possíveis concorrentes.",

            nota1a5:
                "O Pitch reforçou pouco o caráter inovador e o potencial de mercado do projeto perante possíveis concorrentes.",

            nota0:
                "O Pitch não apresentou essas informações."
        },


        // CRITÉRIO 11
        // Abrangência do Projeto
        11: {

            nota10:
                "A inovação do projeto possui abrangência mundial.",

            nota6a9:
                "A inovação do projeto possui abrangência nacional.",

            nota1a5:
                "A inovação do projeto possui abrangência regional.",

            nota0:
                "O projeto não é inovador."
        },


        // CRITÉRIO 12
        // Grau de Inovação do Projeto
        12: {

            nota10:
                "As características/funcionalidades do projeto inovador não possuem soluções similares no mercado ou apresentam elevado grau de diferenciação.",

            nota6a9:
                "As características/funcionalidades do projeto inovador apresentam intermediário grau de diferenciação em relação às soluções existentes no mercado.",

            nota1a5:
                "As características/funcionalidades do projeto inovador apresentam baixo grau de diferenciação em relação às soluções existentes no mercado.",

            nota0:
                "O projeto não apresenta essas informações."
        }

    };


    const criterio = comentarios[idCriterio];

    if (!criterio) {
        return "";
    }


    if (nota === 10) {
        return criterio.nota10;
    }


    if (nota >= 6 && nota < 10) {
        return criterio.nota6a9;
    }


    if (nota >= 1 && nota < 6) {
        return criterio.nota1a5;
    }


    if (nota === 0) {
        return criterio.nota0;
    }


    return "";
}

async function carregarDadosEscuderia() {

    try {

        const escuderias =
            await listarEscuderias();


        const escuderia =
            escuderias.find(
                (e) =>
                    Number(e.id_escuderia) ===
                    Number(idEscuderia)
            );


        if (!escuderia) {

            alert(
                "Escuderia não encontrada. Selecione novamente."
            );

            window.location.href =
                "escuderiasAvaliadas.html";

            return false;
        }


        document.getElementById(
            "nomeEscuderia"
        ).innerHTML = `

            ${escapeHtml(escuderia.nome_escuderia)}

            <br>

            <span id="infoEscuderia">

                ${escapeHtml(escuderia.nome_mentor)}
                -
                ${escapeHtml(escuderia.turma)}

                <br>

                Curso: ${escapeHtml(escuderia.curso || "—")}
                · Etapa: ${escapeHtml(escuderia.etapa || "—")}
                · Período: ${escapeHtml(escuderia.periodo || "—")}
                · Escola: ${escapeHtml(escuderia.escola || "—")}

            </span>

        `;


        return true;


    } catch (erro) {

        console.error(
            "Erro ao carregar a escuderia:",
            erro
        );


        alert(
            "Não foi possível carregar os dados da escuderia."
        );


        return false;
    }

}

async function montarFormulario() {

    const criterios =
        await obterCriterios();


    const form =
        document.getElementById(
            "formAvaliacao"
        );

    form.innerHTML = "";


    criterios.forEach((c) => {

        const bloco =
            document.createElement("div");


        bloco.classList.add(
            "bloco-criterio"
        );


        bloco.innerHTML = `

            <strong>
                ${escapeHtml(c.descricao)}
            </strong>

            <br>

            <label>

                Nota (0 a 10):

                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    id="nota_${c.id_criterio}"
                    required
                >

            </label>

            <br>

            <textarea
                id="comentario_${c.id_criterio}"
                placeholder="O comentário padrão aparecerá automaticamente..."
                style="width: 100%; margin-top: 5px;"
            ></textarea>

        `;


        form.appendChild(bloco);


        const inputNota =
            document.getElementById(
                `nota_${c.id_criterio}`
            );


        const campoComentario =
            document.getElementById(
                `comentario_${c.id_criterio}`
            );

        inputNota.addEventListener(
            "input",
            () => {

                const valor =
                    inputNota.value;


                if (valor === "") {

                    campoComentario.value = "";

                    return;
                }


                const nota =
                    parseFloat(valor);


                if (
                    Number.isNaN(nota) ||
                    nota < 0 ||
                    nota > 10
                ) {

                    campoComentario.value = "";

                    return;
                }


                campoComentario.value =
                    obterComentarioPadrao(
                        Number(c.id_criterio),
                        nota
                    );

            }
        );

    });

}

document
    .getElementById("btnEnviar")
    .addEventListener(
        "click",
        async () => {
            try {

            if (
                !idEscuderia ||
                Number.isNaN(idEscuderia)
            ) {

                alert(
                    "Escuderia não identificada. Volte e selecione novamente."
                );

                return;
            }


            const criterios =
                await obterCriterios();

            for (const c of criterios) {

                const campoNota =
                    document.getElementById(
                        `nota_${c.id_criterio}`
                    );


                const nota =
                    campoNota.value;


                if (nota === "") {

                    alert(
                        `Informe a nota do critério "${c.descricao}".`
                    );

                    campoNota.focus();

                    return;
                }


                const notaNumerica =
                    parseFloat(nota);


                if (
                    Number.isNaN(notaNumerica) ||
                    notaNumerica < 0 ||
                    notaNumerica > 10
                ) {

                    alert(
                        `A nota do critério "${c.descricao}" deve estar entre 0 e 10.`
                    );

                    campoNota.focus();

                    return;
                }

            }

            for (const c of criterios) {

                const nota =
                    document.getElementById(
                        `nota_${c.id_criterio}`
                    ).value;


                const comentario =
                    document.getElementById(
                        `comentario_${c.id_criterio}`
                    ).value;


                console.log(
                    "Enviando avaliação:",
                    {
                        id_escuderia:
                            Number(idEscuderia),

                        id_criterio:
                            Number(c.id_criterio),

                        nota:
                            parseFloat(nota),

                        comentario:
                            comentario
                    }
                );


                await cadastrarAvaliacao(

                        Number(idEscuderia),

                        Number(c.id_criterio),

                        parseFloat(nota),

                        comentario
                    );

            }


            alert(
                "Avaliação enviada com sucesso!"
            );

            sessionStorage.removeItem(
                "id_escuderia_avaliacao"
            );


            window.location.href =
                "escuderiasAvaliadas.html";

            } catch (erro) {
                console.error("Erro ao enviar avaliação:", erro);
                alert(erro.message || "Não foi possível enviar a avaliação.");
            }

        }
    );

async function iniciarPagina() {

    const escuderiaValida =
        await carregarDadosEscuderia();


    if (!escuderiaValida) {
        return;
    }


    try {
        await montarFormulario();
    } catch (erro) {
        console.error("Erro ao carregar critérios:", erro);
        alert(erro.message || "Não foi possível carregar os critérios.");
    }

}


iniciarPagina();