const { Questao, Opcao } = require('../../../../models');


module.exports = async (req, res) => {
         const {
                titulo,
                pergunta,
                area,
                correta,
                topicos,
                respostas
            } = req.body;

            const tipo = req.params.tipo.toUpperCase();
            const transaction = await sequelize.transaction();
            const id_usuario = req.session.userId;
            const alternativas = ['A', 'B', 'C', 'D', 'E'];
            const MIN_OPCOES = 1;
            const MAX_OPCOES = 5;

            try {
                // Input validations
                if (!pergunta?.trim()) {
                    throw new Error("Pergunta não pode ser vazio");
                }
                if (!respostas) {
                    throw new Error("Respostas não pode ser vazio");
                }
                if (!topicos) {
                    throw new Error("Selecione pelo menos um topico");
                }

                // Parse and validate respostas
                let arrayRespostas;
                try {
                    arrayRespostas = JSON.parse(respostas);
                    if (typeof arrayRespostas !== 'object' || arrayRespostas === null) {
                        throw new Error("Formato de respostas inválido");
                    }
                } catch (parseError) {
                    throw new Error("Erro ao processar respostas: formato JSON inválido");
                }

                const numOpcoes = Object.keys(arrayRespostas).length;
                if (numOpcoes < MIN_OPCOES || numOpcoes > MAX_OPCOES) {
                    const mensagemDeErro = tipo === 'DISSERTATIVA'
                        ? "O campo de resposta não pode estar vazio"
                        : `Número de resposta deve ser entre 4 e ${MAX_OPCOES}`;
                    throw new Error(mensagemDeErro);
                }

                if ((tipo === 'DISSERTATIVA' && numOpcoes !== 1) ||
                    (tipo === 'OBJETIVA' && (numOpcoes < 4 || numOpcoes > 5))) {
                    throw new Error("Número de opções INVÁLIDO");
                }

                // Prepare opcoes array
                const opcoes = tipo === 'DISSERTATIVA'
                    ? [{ descricao: arrayRespostas['#resposta'] }]
                    : alternativas.slice(0, numOpcoes).map(alternativa => ({
                        alternativa,
                        descricao: arrayRespostas[`#opcao${alternativa}`]
                    }));

                // Create questao first (sequential because addTopico depends on it)
                const createQuestao = await Questao.create({
                    pergunta,
                    titulo,
                    id_area: area,
                    id_usuario,
                    tipo
                }, { transaction });

                // Add topicos after questao is created
                await createQuestao.addTopico(topicos, { transaction });

                // Create opcoes concurrently
                const opcaoPromises = opcoes.map(opcao => {
                    const opcaoData = {
                        id_questao: createQuestao.id_questao,
                        descricao: JSON.stringify(opcao.descricao)
                    };

                    if (tipo === 'OBJETIVA' && opcao.alternativa?.trim()) {
                        opcaoData.alternativa = opcao.alternativa;
                        opcaoData.correta = correta === opcao.alternativa;
                    } else {
                        opcaoData.correta = true;
                    }

                    return Opcao.create(opcaoData, { transaction });
                });

                // Execute all opcao creations concurrently
                await Promise.all(opcaoPromises);

                await transaction.commit();
                return res.status(201).redirect('/professor/questoes');

            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await transaction.rollback();

                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }