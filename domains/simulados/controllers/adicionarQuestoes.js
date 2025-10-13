const { Simulado, Questao, Topico, Area } = require('../../../models');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                const { titulo, areaId, topicosSelecionados } = req.query;
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const offset = (page - 1) * limit;

                const simulado = await Simulado.findOne({
                    where: { id_simulado: simuladoId },
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }]
                });

                if (!simulado) {
                    return res.status(400).send('Simulado não encontrado.');
                }


                const topicos = await Topico.findAll();
                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico'
                    }]
                });


                let todasQuestoes;
                const tipoQuestao = simulado.tipo === "OBJETIVO" ? 'OBJETIVA' :
                    simulado.tipo === "DISSERTATIVO" ? 'DISSERTATIVA' :
                        null;

                const whereClause = tipoQuestao ? { tipo: { [Op.eq]: tipoQuestao } } : {};

                todasQuestoes = await Questao.findAll({
                    include: [
                        {
                            model: Topico,
                            as: 'Topico',
                            through: { attributes: [] },
                        },
                    ],
                    where: whereClause,
                });

                const questoesJaAssociadas = simulado.Questao.map(q => q.id_questao);
                //
                const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id_questao));

                //filtros
                let questoesFiltradas = questoesDisponiveis;

                // filtro de titulo
                if (titulo) {
                    questoesFiltradas = questoesFiltradas.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }
                // filtro de area
                if (areaId && areaId !== "") {
                    questoesFiltradas = questoesFiltradas.filter(questao => questao.id_area === Number(areaId));
                }
                // filtro de topicos
                if (topicosSelecionados && topicosSelecionados !== "") {
                    const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
                    questoesFiltradas = questoesFiltradas.filter(questao => {
                        const topicos = Array.isArray(questao.Topico) ? questao.Topico : [];
                        return topicos.some(topico => topicosIds.includes(topico.id_topico));
                    });
                }

                const questoes = questoesFiltradas.slice(offset, offset + limit);

                const totalQuestoes = questoesFiltradas.length;
                const totalPages = Math.ceil(totalQuestoes / limit);

                const questoesPorArea = {};

                simulado.Questao.forEach(q => {
                    const areaId = q.id_area;
                    if (!questoesPorArea[areaId]) {
                        questoesPorArea[areaId] = 0;
                    }
                    questoesPorArea[areaId]++;
                });
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                res.render('simulado/associar_pergunta_simulado', { simulado, questoes, page, totalPages, Areas, topicos, questoesPorArea, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Erro ao carregar formulário de associação de pergunta');
            }
        }