const { Area } = require('../models');
const { Simulados } = require('../models');
const { Topico } = require('../models');
const { Op } = require('sequelize');
const { Questões } = require('../models');
const { Opcao } = require('../../../models');

class Render {
    static auth = {
        cadastro: async (req, res) => {
            let errorMessage = req.session.errorMessage;
            console.log(errorMessage);
            if (errorMessage === null) {
                errorMessage = " ";
            }
            req.session.errorMessage = null;
            res.status(200).render('usuario/cadastro', { errorMessage });
        },
        home: async (req, res) => {
            res.status(200).render('usuario/inicio');
        },
        login: async (req, res) => {
            let errorMessage = req.session.errorMessage;
            console.log(errorMessage);
            if (errorMessage === null) {
                errorMessage = " ";
            }
            req.session.errorMessage = null; // Limpa a mensagem de erro após exibi-la
            res.status(200).render('usuario/login', { errorMessage });
        }
    }
    static questoes = {
        editar: async (req, res) => {
            const { id } = req.params;
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            try {

                const Topicos = await Topico.findAll()

                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
                    }]

                })
                const questao = await Questões.findByPk(id, {
                    include: [{
                        model: Opcao,
                        as: 'Opcoes' // Certifique-se de que este alias corresponda ao definido na associação
                    }, {
                        model: Topico,
                        as: 'Topicos'
                    }]
                });

                if (!questao) {
                    throw new Error('Questão não encontrada');
                }

                const Opcoes = await Opcao.findAll({
                    where: {
                        questao_id: questao.id
                    },
                    order: [['alternativa', 'ASC']] // Ordena as opções pela coluna 'alternativa' em ordem ascendente
                });
                const correta = Opcoes.filter(opcao => opcao.correta === true);



                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                // res.send(JSON.stringify(questao))
                res.render('professor/editar-questao', { questao, Topicos, Areas, errorMessage, Opcoes, correta, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Erro ao buscar questão');
            }
        },
        manutencao: async (req, res) => {
            res.status(200).render('professor/manutencao');
        },
        minhasQuestoes: async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const usuarioId = req.session.userId;
            const { titulo, areaId, topicosSelecionados, pergunta } = req.query; // Adiciona 'pergunta' aos parâmetros recuperados
            const limit = 10; // Número de questões por página
            const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
            const offset = (page - 1) * limit;

            try {
                let questoes = await Questões.findAll({
                    where: {
                        usuarioId: usuarioId,
                    },
                    include: [{
                        model: Area,
                        as: 'Area'
                    }, {
                        model: Topico,
                        as: 'Topicos'
                    }],
                    limit: limit,
                    offset: offset,
                });


                const questoesCount = await Questões.count({
                    where: {
                        usuarioId: usuarioId,
                    },
                });

                const totalPages = Math.ceil(questoesCount / limit);

                // Buscar todas as áreas para o filtro
                const topicos = await Topico.findAll();
                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
                    }]
                });

                // Filtrar questões usando JavaScript
                let questoesFiltradas = questoes; // Use 'questoes' em vez de 'questoesDisponiveis'
                if (titulo) {
                    questoesFiltradas = questoes.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }
                if (areaId && areaId !== "") {
                    questoesFiltradas = questoes.filter(questao => questao.areaId === Number(areaId));
                }
                if (topicosSelecionados && topicosSelecionados !== "") {
                    // Conversão de topicosSelecionados para Array de IDs
                    const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
                    questoesFiltradas = questoes.filter(questao => {
                        // Garante que questao.topicos seja um array
                        const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
                        return topicos.some(topico => topicosIds.includes(topico.id));
                    });
                }
                if (pergunta) {
                    questoesFiltradas = questoes.filter(questao => questao.pergunta.toLowerCase().includes(pergunta.toLowerCase()));
                }

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;
                res.status(200).render('professor/minhas-questoes', { questoes: questoesFiltradas, totalPages, page, Areas, topicos, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (err) {
                console.error(err.message)
                req.session.destroy();
                res.status(500).redirect('/usuario/inicioLogado');
            };
        },
        registrarQuestao: async (req, res) => {
            try {
                if (!req.session.login) {
                    return res.status(401).redirect('/usuario/login');
                }
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;

                const tipo = req.params.tipo.toLowerCase();
                const usuarioId = req.session.userId;
                //req.session.tipoQuestao = tipo; // Armazena o tipo de questão na sessão

                const Areas = await Area.findAll({
                    include: [{
                        model: Topico,
                        as: 'Topico' // Ajuste conforme necessário, dependendo de como você configurou a associação
                    }]
                })


                // Mapeamento dos tipos de questões aos tipos de simulados
                const tipoSimuladoMap = {
                    "objetiva": ['ALEATORIO', 'OBJETIVO'],
                    "dissertativa": ['DISSERTATIVO', 'ALEATORIO']
                };

                // Verifica se o tipo de questão é válido
                if (!tipoSimuladoMap[tipo]) {
                    throw new Error('Tipo de questão inválido');
                }

                // Consulta todos os simulados do usuário, filtrando por tipo
                const simulados = await Simulados.findAll({
                    where: {
                        usuarioId: usuarioId,
                        tipo: {
                            [Op.in]: tipoSimuladoMap[tipo]
                        }
                    }
                });
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                // Retorna os simulados filtrados
                res.status(200).render('professor/criar-questao', { Areas, tipo, simulados, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error)

                res.status(500).redirect('/usuario/inicioLogado');
            }
        }

    }
    static simulados = {
        addQuestoes: async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                const { titulo, areaId, topicosSelecionados } = req.query;
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const offset = (page - 1) * limit;

                const simulado = await Simulados.findOne({
                    where: { id: simuladoId },
                    include: [{
                        model: Questões,
                        as: 'Questões'
                    }]
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
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

                todasQuestoes = await Questões.findAll({
                    include: [
                        {
                            model: Topico,
                            as: 'Topicos',
                            through: { attributes: [] },
                        },
                    ],
                    where: whereClause,
                });

                const questoesJaAssociadas = simulado.Questões.map(q => q.id);
                //
                const questoesDisponiveis = todasQuestoes.filter(q => !questoesJaAssociadas.includes(q.id));

                //filtros
                let questoesFiltradas = questoesDisponiveis;

                // filtro de titulo
                if (titulo) {
                    questoesFiltradas = questoesFiltradas.filter(questao => questao.titulo.toLowerCase().includes(titulo.toLowerCase()));
                }
                // filtro de area
                if (areaId && areaId !== "") {
                    questoesFiltradas = questoesFiltradas.filter(questao => questao.areaId === Number(areaId));
                }
                // filtro de topicos
                if (topicosSelecionados && topicosSelecionados !== "") {
                    const topicosIds = Array.isArray(topicosSelecionados) ? topicosSelecionados : topicosSelecionados.split(',').map(id => parseInt(id));
                    questoesFiltradas = questoesFiltradas.filter(questao => {
                        const topicos = Array.isArray(questao.Topicos) ? questao.Topicos : [];
                        return topicos.some(topico => topicosIds.includes(topico.id));
                    });
                }

                const questoes = questoesFiltradas.slice(offset, offset + limit);

                const totalQuestoes = questoesFiltradas.length;
                const totalPages = Math.ceil(totalQuestoes / limit);

                const questoesPorArea = {};

                simulado.Questões.forEach(q => {
                    const areaId = q.areaId;
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

                res.render('simulado/associar-pergunta-simulado', { simulado, questoes, page, totalPages, Areas, topicos, questoesPorArea, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Erro ao carregar formulário de associação de pergunta');
            }
        },
        criarSimulado: async (req, res) => { },
        editarSimulado: async (req, res) => { },
        fazerSimulado: async (req, res) => { },
        gabarito: async (req, res) => { },
        imprimirSimulado: async (req, res) => { },
        meusSimulados: async () => { req, res },
        removerQuestoes: async (req, res) => { },
        visualizarQuestoes: async (req, res) => { },
    }
    static topicos = {}
    static usuarios = {}
}

// Render.auth.cadastro(req, res)

exports.Render = Render