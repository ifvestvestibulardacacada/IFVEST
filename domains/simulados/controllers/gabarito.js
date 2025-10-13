const { Op } = require("sequelize");
const { Simulado, Questao, Opcao, Resposta } = require('../../../models');


module.exports = async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const userId = req.session.userId;
            const id_simulado = req.params.simuladoId;
            let respostasDissertativas = [];


            if (isNaN(id_simulado) || id_simulado <= 0) {

                return res.status(400).send('ID de simulado inválido');
            }

            try {
                const simulado = await Simulado.findByPk(id_simulado, {
                    include: [{
                        model: Questao,
                        as: 'Questao', // Certifique-se de que este alias corresponda ao definido na associação
                        include: [{
                            model: Opcao,
                            as: 'Opcao' // Certifique-se de que este alias corresponda ao definido na associação
                        },
                        ]
                    }],
                });


                const questoesComOpcoesCorretas = simulado.Questao;

                if (!questoesComOpcoesCorretas) {
                    return res.status(400).send('Nenhuma questão encontrada');
                }


                const respostasDoUsuario = await Resposta.findAll({
                    where: {
                        id_usuario: userId,
                        id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id_questao) }
                    },
                    include: [{
                        model: Opcao,
                        as: 'Opcao',
                        required: true
                    }],
                    order: [['createdAt', 'DESC']],
                });

                if (simulado.tipo !== 'OBJETIVO') {
                    respostasDissertativas = await Resposta.findAll({
                        where: {
                            id_usuario: userId,
                            id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id_questao) },
                            resposta: { [Op.ne]: null }
                        },
                        order: [['createdAt', 'DESC']],
                    });
                } else {
                    respostasDissertativas = [];
                }

                questoesComOpcoesCorretas.forEach(questao => {
                    questao.Opcao.sort((a, b) => a.id_opcao - b.id_opcao);
                });

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;


                res.render('prova/gabarito', {
                    questoes: questoesComOpcoesCorretas,
                    respostasUsuario: respostasDoUsuario,
                    respostasDissertativas: respostasDissertativas,
                    simulado: simulado, errorMessage,
                    nomeUsuario, perfilUsuario, imagemPerfil
                });


            } catch (error) {
                console.error('Erro ao buscar o gabarito da prova:', error);
                res.status(500).send('Erro ao buscar o gabarito da prova.');
            }
        }