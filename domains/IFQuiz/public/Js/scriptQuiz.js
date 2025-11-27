document.addEventListener('DOMContentLoaded', () => {

    const botaoIniciar = document.getElementById('btn-iniciar');
    const elementoMateria = document.getElementById('select-materia');
    const elementoNumero = document.getElementById('input-numero');
    const elementoPergunta = document.getElementById('quiz-pergunta');
    const elementoOpcoes = document.getElementById('quiz-opcoes');
    const elementoResposta = document.getElementById('quiz-resposta');
    const botaoTentarNovamente = document.getElementById('btn-tentar-novamente');
    const botaoVoltarMenu = document.getElementById('btn-voltar-menu');
    const elementoTituloQuestao = document.getElementById('quiz-titulo-questao');



    let totalQuestoes = 0;
    let questaoAtual = 0;
    let acertos = 0;
    let materiaAtual = null;

    const RANGES_DAS_MATERIAS = {
        'Matemática': { min: 136, max: 180 }
    };

    function getRangeParaMateriaEAno(materia, ano) {
        if (ano <= 2017) {
            if (materia === 'Ciências Humanas') {
                console.log(`[Range Dinâmico] Ano ${ano}: Natureza`);
                return { min: 1, max: 45 };
            }
            if (materia === 'Linguagens') {
                console.log(`[Range Dinâmico] Ano ${ano}: Linguagens `);
                return { min: 91, max: 135 };
            }
            if (materia === 'Ciências da Natureza') {
                console.log(`[Range Dinâmico] Ano ${ano}: Natureza`);
                return { min: 46, max: 90 };
            }
        }

        if (ano >= 2018) {
            if (materia === 'Linguagens') {
                console.log(`[Range Dinâmico] Ano ${ano}: Linguagens (Novo) 1-45`);
                return { min: 1, max: 45 };
            }
            if (materia === 'Ciências Humanas') {
                console.log(`[Range Dinâmico] Ano ${ano}: Natureza (Novo) 46-90`);
                return { min: 46, max: 90 };
            }
            if (materia === 'Ciências da Natureza') {
                console.log(`[Range Dinâmico] Ano ${ano}: Natureza`);
                return { min: 91, max: 135 };
            }
        }
        const rangeFixo = RANGES_DAS_MATERIAS[materia];
        if (rangeFixo) {
            console.log(`[Range Fixo] Matéria ${materia}: Range ${rangeFixo.min}-${rangeFixo.max}`);
            return rangeFixo;
        }

        console.warn(`Matéria "${materia}" não reconhecida. Usando range 1-180.`);
        return { min: 1, max: 180 };
    }

    function getNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function buscarUmaQuestaoAleatoria(materia) {
        const anoAleatorio = getNumeroAleatorio(2009, 2023);
        const rangeDinamico = getRangeParaMateriaEAno(materia, anoAleatorio);
        const questaoAleatoria = getNumeroAleatorio(rangeDinamico.min, rangeDinamico.max);
        const urlSorteada = `https://api.enem.dev/v1/exams/${anoAleatorio}/questions/${questaoAleatoria}`;

        console.log(`Tentando buscar na URL: ${urlSorteada} (Materia: ${materia})`);
        try {
            const response = await fetch(urlSorteada);
            if (!response.ok) {
                console.warn(`Falha: ${response.status}. A combinação ${anoAleatorio}/${questaoAleatoria} não existe. Tentando outra...`);
                return null;
            }
            const questaoEncontrada = await response.json();
            console.log("SUCESSO! Questão encontrada:", questaoEncontrada);
            return questaoEncontrada;
        } catch (error) {
            console.error("Erro de rede ao tentar buscar a questão:", error.message);
            return null;
        }
    }

    function carregarProximaQuestao() {
        questaoAtual++;

        if (questaoAtual > totalQuestoes) {
            exibirResultadoFinal();
        } else {
            if (elementoTituloQuestao) {
                elementoTituloQuestao.textContent = `Questão ${questaoAtual} de ${totalQuestoes}`;
            }

            if (botaoTentarNovamente) {
                if (questaoAtual === totalQuestoes) {
                    botaoTentarNovamente.textContent = 'Ver Resultado';
                } else {
                    botaoTentarNovamente.textContent = 'Próxima Questão';
                }
            }
            carregarEExibirQuiz(materiaAtual);
        }
    }
    function exibirResultadoFinal() {
        console.log("Quiz finalizado. Acertos:", acertos);

        if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
        if (botaoVoltarMenu) botaoVoltarMenu.style.display = 'block';
        if (elementoOpcoes) elementoOpcoes.innerHTML = '';
        if (elementoResposta) elementoResposta.textContent = '';
        if (elementoResposta) elementoResposta.style.cssText = '';
        if (elementoTituloQuestao) elementoTituloQuestao.textContent = 'Resultado Final';
        if (elementoPergunta) {
            let porcentagem = ((acertos / totalQuestoes) * 100).toFixed(0);
            elementoPergunta.innerHTML = `
                <h2>Quiz Finalizado!</h2>
                <p style="font-size: 1.2rem;">
                    Você acertou <strong>${acertos}</strong> de <strong>${totalQuestoes}</strong> questões.
                </p>
                <p style="font-size: 1.5rem; font-weight: bold;">
                    Seu aproveitamento: ${porcentagem}%
                </p>
            `;
            salvarPlacarNoBanco(acertos, totalQuestoes, porcentagem);
        }

    }
    async function salvarPlacarNoBanco(acertos, totalQuestoes, porcentagem) {
    try {
        const dados = {
            acertos: acertos,
            totalQuestoes: totalQuestoes,
            porcentagem: parseFloat(porcentagem)
        };

        const response = await fetch('/quiz/api/placar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            const resultado = await response.json();
            console.log('Placar salvo com sucesso! Usuário:', resultado.nome);
        } else {
            console.error('Falha ao salvar placar.');
        }
    } catch (error) {
        console.error('Erro de rede ao salvar placar:', error);
    }
}
    async function carregarEExibirQuiz(materia) {
        console.log(`Iniciando busca pela questão ${questaoAtual}...`);
        if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
        if (botaoVoltarMenu) botaoVoltarMenu.style.display = 'none';
        if (elementoPergunta) elementoPergunta.textContent = 'Procurando uma questão (pode demorar)...';
        if (elementoOpcoes) elementoOpcoes.innerHTML = '';
        if (elementoResposta) elementoResposta.textContent = '';
        if (elementoResposta) elementoResposta.style.cssText = '';

        let questaoParaExibir = null;
        let tentativas = 0;
        const maxTentativas = 15;

        while (questaoParaExibir === null && tentativas < maxTentativas) {
            tentativas++;
            console.log(`Tentativa ${tentativas} de ${maxTentativas}...`);
            questaoParaExibir = await buscarUmaQuestaoAleatoria(materia);
        }

        if (questaoParaExibir) {
            exibirQuestaoNaTela(questaoParaExibir);
        } else {
            console.error(`Não foi possível encontrar uma questão após ${maxTentativas} tentativas.`);
            if (elementoPergunta) elementoPergunta.textContent = `Não foi possível encontrar uma questão aleatória para esta matéria. A API pode estar fora do ar ou sobrecarregada. Tente novamente.`;
            if (botaoVoltarMenu) botaoVoltarMenu.style.display = 'block';
        }
    }
    function exibirQuestaoNaTela(questaoParaExibir) {
        const menu = document.querySelector('.menuJogo');
        if (menu) menu.classList.add('escondido');
        const containerQuiz = document.getElementById('quiz-container');
        if (containerQuiz) containerQuiz.style.display = 'block';


        if (elementoPergunta) {
            const ano = questaoParaExibir.year || (questaoParaExibir.exam ? questaoParaExibir.exam.year : "Ano Desconhecido");
            const disciplina = questaoParaExibir.discipline || "";
            let textContext = questaoParaExibir.context || "";
            const introducao = questaoParaExibir.alternativesIntroduction || "";
            const arrayDeImagens = questaoParaExibir.files;
            const urlImagemSingular = questaoParaExibir.file;
            const regex = /\s*\[!?\]\s*\([^)]+\.(jpg|png|gif|jpeg)\)/gi;
            const regexExclamacao = /^\s*!\s*/;

            textContext = textContext.replace(regex, '');
            textContext = textContext.replace(regexExclamacao, '');

            let htmlImagens = "";

            if (arrayDeImagens && Array.isArray(arrayDeImagens) && arrayDeImagens.length > 0) {
                htmlImagens = arrayDeImagens.map(imgObj => {
                    const url = imgObj.file || imgObj;
                    const altText = imgObj.name || "Imagem da questão";
                    if (url && url !== 'null') {
                        return `
                            <br>
                            <img src="${url}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px;">
                        `;
                    }
                    return '';
                }).join('');
            }
            else if (urlImagemSingular && urlImagemSingular !== 'null') {
                htmlImagens = `
                    <br> <img src="${urlImagemSingular}" alt="Imagem da questão" style="max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px;"> <br>
                `;
            }
            elementoPergunta.innerHTML = `<strong>[ENEM ${ano}]</strong> <em>${disciplina}</em><br>${textContext} ${htmlImagens} <br>${introducao}`;
        }

        if (elementoOpcoes) {
            elementoOpcoes.innerHTML = '';
            if (!questaoParaExibir.alternatives || questaoParaExibir.alternatives.length === 0) {
                if (elementoPergunta) elementoPergunta.textContent = "Erro: A questão encontrada não possui alternativas.";
                return;
            }

            questaoParaExibir.alternatives.forEach(alternativa => {
                const itemLista = document.createElement('li');
                const botaoOpcao = document.createElement('button');
                const letra = alternativa.letter || alternativa.key || alternativa.value || '?';
                const urlImagemAlternativa = alternativa.file;
                const texto = alternativa.description || alternativa.text || '[Texto da alternativa em falta]';

                botaoOpcao.setAttribute('data-value', letra);

                if (urlImagemAlternativa && urlImagemAlternativa !== 'null') {
                    botaoOpcao.innerHTML = `${letra} ) <img src="${urlImagemAlternativa}" alt="Alternativa ${letra}" style="max-width: 90%; height: auto; vertical-align: middle;">`;
                } else {
                    botaoOpcao.textContent = `${letra} ) ${texto}`;
                }

                botaoOpcao.onclick = () => {
                    const valorSelecionado = botaoOpcao.getAttribute('data-value');
                    const respostaCorretaLetra = questaoParaExibir.correctAlternative;
                    const alternativaCorretaObj = questaoParaExibir.alternatives.find(alt => (alt.letter || alt.key || alt.value) === respostaCorretaLetra);
                    let htmlRespostaCorreta = `(Letra: ${respostaCorretaLetra})`;

                    if (alternativaCorretaObj) {
                        const letraCorreta = alternativaCorretaObj.letter || alternativaCorretaObj.key || alternativaCorretaObj.value;
                        if (alternativaCorretaObj.file && alternativaCorretaObj.file !== 'null') {
                            htmlRespostaCorreta = `${letraCorreta} ) <img src="${alternativaCorretaObj.file}" alt="Resposta Correta" style="max-height: 60px; height: auto; vertical-align: middle;">`;
                        } else {
                            const textoCorreto = alternativaCorretaObj.description || alternativaCorretaObj.text || '[Texto em falta]';
                            htmlRespostaCorreta = `${letraCorreta} ) ${textoCorreto}`;
                        }
                    }

                    if (valorSelecionado === respostaCorretaLetra) {
                        if (elementoResposta) elementoResposta.textContent = "✅ Resposta Correta!";
                        if (elementoResposta) elementoResposta.style.color = 'green';

                        acertos++;
                        console.log('Acertou! Total de acertos:', acertos);

                    } else {
                        if (elementoResposta) elementoResposta.innerHTML = `❌ Incorreto. A resposta certa é: ${htmlRespostaCorreta}`;
                        if (elementoResposta) elementoResposta.style.color = 'red';
                    }
                    elementoOpcoes.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'block';
                    if (botaoVoltarMenu) botaoVoltarMenu.style.display = 'block';
                };
                itemLista.appendChild(botaoOpcao);
                elementoOpcoes.appendChild(itemLista);
            });
        }
    }

    if (botaoIniciar) {
        botaoIniciar.addEventListener('click', (event) => {
            event.preventDefault();
            const materiaSelecionada = elementoMateria.value;
            const numeroSelecionado = parseInt(elementoNumero.value, 10);
            totalQuestoes = (numeroSelecionado > 0) ? numeroSelecionado : 1;
            materiaAtual = materiaSelecionada;

            questaoAtual = 0;
            acertos = 0;
            carregarProximaQuestao();
        });
    }

    if (botaoTentarNovamente) {
        botaoTentarNovamente.addEventListener('click', () => {
            carregarProximaQuestao();
        });
    }

    if (botaoVoltarMenu) {
        botaoVoltarMenu.addEventListener('click', () => {
            window.location.href = '/quiz/MenuQuiz';
            if (menu) menu.classList.remove('escondido');
            const containerQuiz = document.getElementById('quiz-container');
            if (containerQuiz) containerQuiz.style.display = 'none';
            if (elementoPergunta) elementoPergunta.innerHTML = 'Clique em "Iniciar Jogo" para carregar uma pergunta.';
            if (elementoOpcoes) elementoOpcoes.innerHTML = '';
            if (elementoResposta) elementoResposta.textContent = '';
            if (elementoResposta) elementoResposta.style.cssText = '';
            if (botaoTentarNovamente) botaoTentarNovamente.style.display = 'none';
            if (botaoVoltarMenu) botaoVoltarMenu.style.display = 'none';
            if (elementoTituloQuestao) elementoTituloQuestao.textContent = 'Questão:';
            totalQuestoes = 0;
            questaoAtual = 0;
            acertos = 0;
            materiaAtual = null;
            if (botaoTentarNovamente) {
                botaoTentarNovamente.textContent = 'Carregar Outra Pergunta';
            }
        });
    }
    console.log('Script carregado (Modo Simulado). Aguardando clique em "Iniciar Jogo".');

});