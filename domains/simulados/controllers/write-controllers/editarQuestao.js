const { Questao, Opcao, Topico, Area, QuestaoTopico , sequelize } = require('../../../../models');

module.exports = async (req, res) => { // ! Antigo UpdateQuestaoController
                  const { id, titulo, pergunta, correta, respostas, area, topicos } = req.body;
            const transaction = await sequelize.transaction();
            const alternativas = ['A', 'B', 'C', 'D', 'E'];
            const MIN_OPCOES = 1;
            const MAX_OPCOES = 5;

            try {
                if (!id || isNaN(id)) {
                    throw new Error('ID da questão é inválido ou não fornecido');
                }
                // Validate respostas early
                if (!respostas) {
                    throw new Error("Respostas selecionadas não podem estar vazias");
                }

                let arrayRespostas;
                try {
                    arrayRespostas = JSON.parse(respostas);
                    if (!arrayRespostas || typeof arrayRespostas !== 'object') {
                        throw new Error("Formato de respostas inválido");
                    }
                } catch (parseError) {
                    throw new Error("Erro ao processar respostas: formato JSON inválido");
                }

                const numOpcoes = Object.keys(arrayRespostas).length;

                // Fetch only necessary data and reduce includes
                const questao = await Questao.findByPk(id, {
                    include: [
                        { model: Opcao, as: 'Opcao', attributes: ['id_opcao', 'alternativa'] },

                    ],
                    transaction, // Include transaction to lock rows early
                });

                if (!questao) {
                    throw new Error('Questão não encontrada');
                }

                // Validate number of options
                if (numOpcoes < MIN_OPCOES || numOpcoes > MAX_OPCOES) {
                    throw new Error(
                        questao.tipo === 'DISSERTATIVA'
                            ? 'O campo de resposta não pode estar vazio'
                            : 'Os campos de alternativas não podem estar vazios'
                    );
                }

                if (
                    (questao.tipo === 'DISSERTATIVA' && numOpcoes !== 1) ||
                    (questao.tipo === 'OBJETIVA' && (numOpcoes < 4 || numOpcoes > 5))
                ) {
                    throw new Error('Número de opções INVÁLIDO');
                }

                // Prepare options
                const opcoes = questao.tipo === 'OBJETIVA'
                    ? alternativas.slice(0, numOpcoes).map(alternativa => ({
                        id: arrayRespostas[`#opcao${alternativa}`]?.id,
                        alternativa,
                        descricao: arrayRespostas[`#opcao${alternativa}`]?.content || '',
                        correta: correta === alternativa,
                    }))
                    : [{
                        id: arrayRespostas['#resposta']?.id,
                        alternativa: '',
                        descricao: arrayRespostas['#resposta']?.content || '',
                        correta: true,
                    }];

                if (!opcoes.length) {
                    throw new Error('Opções selecionadas não podem ser vazias');
                }

                // Filter valid topic IDs
                const idTopicos = topicos.filter(item => !isNaN(item) && item !== '');

                // Perform all updates in a single transaction
                await Promise.all([
                    // Update Questao

                    Questao.update(
                        { titulo, pergunta, id_area: area },
                        { where: { id_questao: id }, transaction }
                    ),
                    // Update Topico associations
                    questao.setTopico(idTopicos, { transaction }),
                    // Bulk update Opcao records
                    Opcao.bulkCreate(
                        opcoes.map(opcao => ({
                            id_opcao: opcao.id,
                            id_questao: id,
                            descricao: JSON.stringify(opcao.descricao),
                            alternativa: opcao.alternativa || 'A',
                            correta: opcao.correta,
                        })),
                        {
                            updateOnDuplicate: ['descricao', 'alternativa', 'correta'],
                            transaction,
                        }
                    ),
                ]);

                await transaction.commit();
                return res.status(201).redirect('/professor/questoes');
            } catch (error) {
                console.error('Transaction error:', error);
                await transaction.rollback();
                req.session.errorMessage = error.message;
                // Save session asynchronously but don't block response
                req.session.save(error => {
                    if (error) console.error('Session save error:', error);
                });
                return res.status(400).redirect(req.get('Referrer') || '/');
            }

        }