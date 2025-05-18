const { Area } = require('../models');
const { Simulado } = require('../models');
const { Topico } = require('../models');
const { Questao } = require('../models');
const { Opcao } = require('../models');
const { Usuario } = require('../models');
const { Resposta } = require('../models');
const { Op } = require('sequelize');

// const { Database } = require('./Database') // Inativo momentâneamente

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
                const questao = await Questao.findByPk(id, {
                    include: [{
                        model: Opcao,
                        as: 'Opcao' // Certifique-se de que este alias corresponda ao definido na associação
                    }, {
                        model: Topico,
                        as: 'Topico'
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
            const limit = 10; // Número de Questao por página
            const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
            const offset = (page - 1) * limit;

            try {
                let questoes = await Questao.findAll({
                    where: {
                        id_usuario: usuarioId,
                    },
                    include: [{
                        model: Area,
                        as: 'Area'
                    }, {
                        model: Topico,
                        as: 'Topico'
                    }],
                    limit: limit,
                    offset: offset,
                });


                const questoesCount = await Questao.count({
                    where: {
                        id_usuario: usuarioId,
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

                // Filtrar Questao usando JavaScript
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


                // Mapeamento dos tipos de Questao aos tipos de simulados
                const tipoSimuladoMap = {
                    "objetiva": ['ALEATORIO', 'OBJETIVO'],
                    "dissertativa": ['DISSERTATIVO', 'ALEATORIO']
                };

                // Verifica se o tipo de questão é válido
                if (!tipoSimuladoMap[tipo]) {
                    throw new Error('Tipo de questão inválido');
                }

                // Consulta todos os simulados do usuário, filtrando por tipo
                const simulados = await Simulado.findAll({
                    where: {
                        id_usuario: usuarioId,
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
        adicionarQuestoes: async (req, res) => {
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

                const questoesJaAssociadas = simulado.Questao.map(q => q.id);
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
                        const topicos = Array.isArray(questao.Topico) ? questao.Topico : [];
                        return topicos.some(topico => topicosIds.includes(topico.id));
                    });
                }

                const questoes = questoesFiltradas.slice(offset, offset + limit);

                const totalQuestoes = questoesFiltradas.length;
                const totalPages = Math.ceil(totalQuestoes / limit);

                const questoesPorArea = {};

                simulado.Questao.forEach(q => {
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
        criarSimulado: async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            let errorMessage = req.session.errorMessage;
            if (errorMessage === null) {
                errorMessage = " ";
            }

            req.session.errorMessage = null;

            res.render('simulado/criar-simulado', { errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
        },
        editarSimulado: async (req, res) => {
            const simuladoId = req.params.id
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            try {
                const simulado = await Simulado.findOne({
                    where: { id_simulado: simuladoId },
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado ');
                }
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }
                req.session.errorMessage = null;

                res.render('simulado/editar-simulado', { simulado, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
        },
        fazerSimulado: async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                let errorMessage = req.session.errorMessage;

                const simulado = await Simulado.findByPk(simuladoId, {
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

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;



                res.render('prova/prova', { simulado, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
                //  res.send(simulado)
            } catch (error) {
                console.error('Erro ao buscar perguntas da prova:', error);
                res.status(500).send('Erro ao buscar perguntas da prova.');
            }
        },
         gabarito: async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const userId = req.session.userId;
            const simuladoId = req.params.simuladoId;
            let respostasDissertativas = [];

            try {
                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao',
                        include: [{
                            model: Opcao,
                            as: 'Opcao',
                            // Inclui apenas as opções corretas
                        },
                        ]
                    }],
                })


                const questoesComOpcoesCorretas = simulado.Questao;

              
                const respostasDoUsuario = await Resposta.findAll({
                    where: {
                        id_usuario: userId,
                        id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id) }
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
                            id_questao: { [Op.in]: questoesComOpcoesCorretas.map(q => q.id) },
                            resposta: { [Op.ne]: null }
                        },
                        order: [['createdAt', 'DESC']],
                    });
                }


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
        },
        imprimirSimulado: async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const simuladoId = req.params.simuladoId;
                // Verifique se simuladoId é um número
                if (isNaN(simuladoId) || simuladoId <= 0) {
                    return res.status(400).send('ID de simulado inválido');
                }

                const simulado = await Simulado.findByPk(simuladoId, {
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

                res.render('prova/template-prova', { simulado, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                res.status(500).send('Erro ao gerar o PDF');
            }
        },
        meusSimulados: async (req, res) => {
            try {
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
                const { titulo } = req.query;
                const idUsuario = req.session.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const offset = (page - 1) * limit;

                let allSimulados = await Simulado.findAll({
                    where: { id_usuario: idUsuario },
                    order: [['createdAt', 'DESC']]
                });

                if (titulo) {
                    const simulados = allSimulados.filter(s => s.titulo.toLowerCase().includes(titulo.toLowerCase()));
                    allSimulados = simulados
                }

                const totalPages = Math.ceil(allSimulados.length / limit);
                const startIndex = offset;
                const endIndex = offset + limit;
                const simuladosPaginated = allSimulados.slice(startIndex, endIndex);

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }
                req.session.errorMessage = null;

                res.render('simulado/meus-simulados', { simulados: simuladosPaginated, currentPage: page, totalPages, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
            }
        },
        removerQuestoes: async (req, res) => {
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
                    throw new Error('Simulado não encontrado');
                }

                const questaoIds = simulado.Questao && simulado.Questao.length > 0 ? simulado.Questao.map(questao => questao.id) : [];

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

                res.render('simulado/remover-questoes', { simulado: simulado, questoes: questoes, page: page, totalPages: totalPages, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error('Erro ao carregar o formulário de edição do simulado:', error);
                res.status(500).send('Erro ao carregar o formulário de edição do simulado.');
            }
        },
        visualizarSimulado: async (req, res) => {
            try {
                let simulados;
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;

                const todosSimulados = await Simulado.findAll({
                    where: {
                        '$Questao.id$': {
                            [Op.not]: null
                        },
                        '$Usuario.perfil$': 'PROFESSOR'
                    },
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }, {
                        model: Usuario,
                        as: 'Usuario',
                        attributes: ['perfil'],
                        where: {
                            perfil: 'PROFESSOR'
                        }
                    }
                    ]
                });

                if (!todosSimulados) {
                    throw new Error('Simulados não encontrados');
                }
                simulados = todosSimulados;

                const tituloBusca = req.query.titulo;
                if (tituloBusca) {
                    simulados = todosSimulados.filter(s => s.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
                }

                const tipo = req.query.tipo;
                if (tipo) {
                    simulados = todosSimulados.filter(s => s.tipo.includes(tipo));
                }

                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;

                res.render('simulado/simulados', { simulados, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (error) {
                console.error(error);
                res.status(500).send('Ocorreu um erro ao recuperar os questionários.');
            }
        },
    }
    static topicos = {
        meusTopicos: async (req, res) => {
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const usuarioId = req.session.userId;
            const limit = 10; // Número de Questao por página
            const { materia } = req.query;
            const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
            const offset = (page - 1) * limit;
            let topicos;
            try {

                // Dentro do bloco try da rota '/questoes'
                const topicosCount = await Topico.count({
                    where: {
                        id_usuario: usuarioId,
                    },
                });

                const totalPages = Math.ceil(topicosCount / limit);

                const topicosSemFiltro = await Topico.findAll({
                    where: {
                        id_usuario: usuarioId,
                    },
                    limit: limit,
                    offset: offset,
                });

                if (materia) {
                    topicos = topicosSemFiltro.filter(topico => topico.materia.toLowerCase().includes(materia.toLowerCase()));
                    console.log(topicos)
                } else {
                    topicos = topicosSemFiltro
                }
                let errorMessage = req.session.errorMessage;

                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;
                res.status(200).render('professor/meus-topicos', { topicos, totalPages, page, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil });

            } catch (err) {
                console.error(err.message)
                req.sesssion.destroy();
                res.status(500).redirect('/usuario/inicioLogado');
            };
        }
    }
    static usuarios = {
        editarUsuario: async (req, res) => {
            try {
                let errorMessage = req.session.errorMessage;
                const perfilUsuario = req.session.perfil;
                const nomeUsuario = req.session.nomeUsuario;
                const imagemPerfil = req.session.imagemPerfil;
        
                if (!req.session.userId) {
                    throw new Error('Você precisa estar logado para acessar esta página.');
                }
                const usuario = await Usuario.findByPk(req.session.userId);
        
                if (!usuario) {
                    throw new Error('Usuário não encontrado.');
                }
        
        
                if (errorMessage === null) {
                    errorMessage = " ";
                }
        
                req.session.errorMessage = null;
                res.render('usuario/editar-usuario', { usuario, errorMessage, nomeUsuario, perfilUsuario, imagemPerfil  });
            } catch (err) {
                console.error(err)
                res.redirect('/login');
            }
        },
        inicioLogado: async (req, res) => {
            res.locals.currentPage = "inicio"
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const id = req.session.userId;
            try {
                const usuario = await Usuario.findByPk(id);

                if (!usuario) {
                    throw new Error("Usuario nao encontrado")
                }
                res.status(200).render('usuario/inicio-logado', { nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (err) {
                console.error(err)
                req.session.destroy();
                res.redirect('/login');
            }
        },
        perfilUsuario: async (req, res) => {
            res.locals.currentPage = "perfil"
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            const id = req.session.userId;
            try {
                const usuario = await Usuario.findByPk(id);

                if (!usuario) {
                    throw new Error("Usuario não encontrado")
                }
                res.status(200).render('usuario/perfil_usuario', { usuario, nomeUsuario, perfilUsuario, imagemPerfil });
            } catch (err) {
                console.error(err)
                res.redirect('/perfil');
            }
        },
        sobreNos: async (req, res) => {
            res.locals.currentPage = "sobreNos"
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;
            res.status(200).render('desenvolvedores/sobreNos', {nomeUsuario, perfilUsuario, imagemPerfil});
        }
    }
}

// Render.auth.cadastro(req, res)

exports.Render = Render