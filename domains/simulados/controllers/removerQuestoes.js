const { Op } = require("sequelize");
const { Simulado, Questao } = require('../../../models');


module.exports = async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                const { titulo } = req.query;
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const offset = (page - 1) * limit;

                const simulado = await Simulado.findOne({
                    where: { id_simulado: simuladoId },
                    include: [
                        {
                            model: Questao,
                            as: 'Questao', through: { attributes: [] }
                        }
                    ]
                });

                if (!simulado) {
                    return res.status(400).send('Simulado não encontrado');
                }

                const questaoIds = simulado.Questao && simulado.Questao.length > 0 ? simulado.Questao.map(questao => questao.id_questao) : [];

                const todasQuestoes = await Questao.findAll({
                    where: { id_questao: { [Op.in]: questaoIds } },
                    include: [{
                        model: Simulado,
                        as: 'Simulado',
                        where: { id_simulado: simuladoId },
                        through: { attributes: [] }
                    }],
                    limit: limit,
                    offset: offset
                });

                let questoes = todasQuestoes;

                if (titulo) {
                    questoes = todasQuestoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }
                const totalQuestoes = await Questao.count({
                    where: { id_questao: { [Op.in]: questaoIds } },
                    include: [{
                        model: Simulado,
                        as: 'Simulado',
                        where: { id_simulado: simuladoId },
                        through: { attributes: [] }
                    }]
                });
                const totalPages = Math.ceil(totalQuestoes / limit);

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                res.render('simulado/remover_questoes', { simulado: simulado, questoes: questoes, page: page, totalPages: totalPages, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error('Erro ao carregar o formulário de edição do simulado:', error);
                res.status(500).send('Erro ao carregar o formulário de edição do simulado.');
            }
        }