const { Questao, Opcao, Topico, Area, QuestaoTopico } = require('../../../../models');

module.exports = async (req, res) => { // ! Antigo UpdateQuestaoController
            const { id,
                titulo,
                pergunta,
                correta,
                respostasSelecionadas,
                areaId,
                topicosSelecionados
            } = req.body;

            let arrayRespostas;

            const alternativas = ['A', 'B', 'C', 'D', 'E'];

            const MIN_OPCOES = 1;
            const MAX_OPCOES = 5;
            console.log(topicosSelecionados)

            try {

                if (!respostasSelecionadas) {
                    throw new Error("Respostas selecionadas não podem estar vazias");
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

                const questao = await Questao.findByPk(id, {
                    include: [{
                        model: Opcao,
                        as: 'Opcao'
                    }
                    ]
                });

                if (numOpcoes < MIN_OPCOES || numOpcoes > MAX_OPCOES) {
                    throw new Error(`Número de opções deve ser entre ${MIN_OPCOES} e ${MAX_OPCOES}`);
                }


                if ((questao.tipo === 'DISSERTATIVA' && numOpcoes !== 1) ||
                    (questao.tipo === 'OBJETIVA' && (numOpcoes < 4 || numOpcoes > 5))) {
                    throw new Error(`Número de opções INVÁLIDO`);
                }


                const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
                    alternativa,
                    descricao: arrayRespostas[`#opcao${alternativa}`].content,
                    id: arrayRespostas[`#opcao${alternativa}`].id// Descrição padrão se não existir
                }));

                if (!questao) {
                    throw new Error('Questão não encontrada');
                }

                await atualizarRelacaoTopicos(id, topicosSelecionados, areaId);

                await Questao.update({
                    titulo: titulo,
                    pergunta: pergunta,
                }, {
                    where: { id_questao: id }
                });

                if (!opcoes) {
                    throw new Error("Opcoes selecionadas não pode ser vazia");
                }

                for (let opcao of opcoes) {
                    const updateData = {
                        descricao: JSON.stringify(opcao.descricao),
                        alternativa: opcao.alternativa,
                    };
                    if (correta) {
                        updateData.correta = correta === opcao.alternativa;
                    }
                    await Opcao.update(updateData, {
                        where: { id_opcao: opcao.id }
                    });
                }

                res.redirect('/professor/questoes');

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