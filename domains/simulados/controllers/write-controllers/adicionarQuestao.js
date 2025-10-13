const { Questao, Opcao } = require('../../../../models');


module.exports = async (req, res) => {
            const {
                titulo,
                pergunta,
                areaId,
                correta,
                topicosSelecionados,
                respostasSelecionadas
            } = req.body;

            const tipo = req.params.tipo.toUpperCase()

            let arrayRespostas;

            const MIN_OPCOES = 1;
            const MAX_OPCOES = 5;

            const id_usuario = req.session.userId;

            const alternativas = ['A', 'B', 'C', 'D', 'E'];

            try {
                if (pergunta === undefined || pergunta === null || pergunta.trim() === '' || pergunta === 'undefined') {
                    throw new Error("Pergunta não pode ser vazio")
                }

                if (!respostasSelecionadas) {
                    throw new Error("Respostas não pode ser vazio")
                }
                if (!topicosSelecionados) {
                    throw new Error("Selecione pelo menos um topico");
                }

                try {
                    arrayRespostas = JSON.parse(respostasSelecionadas);
                    if (typeof arrayRespostas !== 'object' || arrayRespostas === null) {
                        throw new Error("Formato de respostas inválido");
                    }
                } catch (parseError) {
                    throw new Error("Erro ao processar respostas: formato JSON inválido");
                }

                const numOpcoes = Object.keys(arrayRespostas).length;
                if (numOpcoes < MIN_OPCOES || numOpcoes > MAX_OPCOES) {
                    throw new Error(`Número de opções deve ser entre ${MIN_OPCOES} e ${MAX_OPCOES}`);
                }

    
          

                if ((tipo === 'DISSERTATIVA' && numOpcoes !== 1) ||
                    (tipo === 'OBJETIVA' && (numOpcoes < 4 || numOpcoes > 5))) {
                    throw new Error(`Número de opções INVÁLIDO`);
                }

                const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
                    alternativa,
                    descricao: arrayRespostas[`#opcao${alternativa}`]  // Descrição padrão se não existir
                }));

                if (!topicosSelecionados) {
                    throw new Error("Selecione pelo menos um tópico")
                }

                const createQuestao = await Questao.create({
                    pergunta,
                    titulo,
                    id_area: areaId,
                    id_usuario,
                    tipo // Usa o novo ID do vestibular
                });

                if (!topicosSelecionados) {
                    throw new Error("Erro ao criar questao")
                }

                await createQuestao.addTopico(topicosSelecionados)

                for (let opcao of opcoes) {
                    let isTrue = correta === opcao.alternativa ? true : false;
                    await Opcao.create({
                        id_questao: createQuestao.id_questao,
                        descricao: JSON.stringify(opcao.descricao),
                        alternativa: opcao.alternativa,
                        correta: isTrue
                    })
                }

                res.status(201).redirect('/usuario/inicioLogado');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }