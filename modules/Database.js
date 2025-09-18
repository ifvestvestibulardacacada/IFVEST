const { Usuario, Questao, Opcao, Simulado, Resposta, Topico } = require('../models');
const { removeFileFromUploads } = require('../utils/removeImage')
const { atualizarRelacaoTopicos } = require('../utils/AreaTopicoUtil')
const bcrypt = require('bcrypt');

class Database {
    static flashcards = {
            getAll: async (req, res) => {
                const { id_area, id_topico, id_dificuldade, onlyUnseen } = req.query;
                const where = {};
                if (id_area) where.id_area = id_area;
                if (id_topico) where.id_topico = id_topico;
                if (id_dificuldade) where.id_dificuldade = id_dificuldade;
                try {
                    const { Flashcard, Area, Topico, Dificuldade, FlashcardUsuario } = require('../models');
                    let flashcards = await Flashcard.findAll({
                        where,
                        include: [Area, Topico, Dificuldade]
                    });
                    // If onlyUnseen is set, filter flashcards that have not been seen by the user
                    if (onlyUnseen && req.session && req.session.userId) {
                        const id_usuario = req.session.userId;
                        const seenIds = await FlashcardUsuario.findAll({
                            where: { id_usuario },
                            attributes: ['id_flashcards']
                        }); 
                        const seenFlashcardIds = seenIds.map(fu => fu.id_flashcards);
                        flashcards = flashcards.filter(card => !seenFlashcardIds.includes(card.id_flashcards));
                    }
                    res.status(200).json(flashcards);
                } catch (error) {
                    res.status(500).json({ message: 'Erro ao buscar flashcards', error: error.message });
                }
            },
        create: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;
                const novoFlashcard = await Flashcard.create({
                    pergunta,
                    resposta,
                    id_area,
                    id_topico,
                    id_dificuldade
                });
                res.status(201).json(novoFlashcard);
            } catch (error) {
                res.status(400).json({ message: 'Erro ao criar flashcard', error: error.message });
            }
        },
        createUi: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;
                await Flashcard.create({ pergunta, resposta, id_area, id_topico, id_dificuldade });
                return res.redirect('/flashcards');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
                return res.status(400).redirect(req.get('Referrer') || '/flashcards');
            }
        },
        update: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { id } = req.params;
                const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;
                const [updated] = await Flashcard.update({
                    pergunta,
                    resposta,
                    id_area,
                    id_topico,
                    id_dificuldade
                }, {
                    where: { id_flashcards: id }
                });
                if (updated) {
                    const updatedFlashcard = await Flashcard.findByPk(id);
                    res.status(200).json(updatedFlashcard);
                } else {
                    res.status(404).json({ message: 'Flashcard não encontrado' });
                }
            } catch (error) {
                res.status(400).json({ message: 'Erro ao atualizar flashcard', error: error.message });
            }
        },
        updateUi: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { id } = req.params;
                const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;
                const [updated] = await Flashcard.update({ pergunta, resposta, id_area, id_topico, id_dificuldade }, { where: { id_flashcards: id } });
                if (!updated) throw new Error('Flashcard não encontrado');
                return res.redirect('/flashcards');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
                return res.status(400).redirect(req.get('Referrer') || '/flashcards');
            }
        },
        delete: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { id } = req.params;
                const deleted = await Flashcard.destroy({
                    where: { id_flashcards: id }
                });
                if (deleted) {
                    res.status(204).send();
                } else {
                    res.status(404).json({ message: 'Flashcard não encontrado' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Erro ao deletar flashcard', error: error.message });
            }
        }
        ,
        deleteUi: async (req, res) => {
            try {
                const { Flashcard } = require('../models');
                const { id } = req.params;
                const deleted = await Flashcard.destroy({ where: { id_flashcards: id } });
                if (!deleted) throw new Error('Flashcard não encontrado');
                return res.redirect('/flashcards');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
                return res.status(400).redirect(req.get('Referrer') || '/flashcards');
            }
        }
            ,
            updateVistoPorUltimo: async (req, res) => {
                const { id_flashcards } = req.params;
                const id_usuario = req.user?.id_usuario || req.body.id_usuario;
                if (!id_usuario) {
                    return res.status(400).json({ message: 'Usuário não autenticado.' });
                }
                try {
                    const { FlashcardUsuario } = require('../models');
                    // Get Brazil time (BRT, UTC-3)
                    const now = new Date();
                    const brtDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
                    const [record, created] = await FlashcardUsuario.findOrCreate({
                        where: { id_usuario, id_flashcards },
                        defaults: { visto_por_ultimo: brtDate }
                    });
                    if (!created) {
                        record.visto_por_ultimo = brtDate;
                        await record.save();
                    }
                    return res.status(200).json({ visto_por_ultimo: record.visto_por_ultimo });
                } catch (error) {
                    return res.status(500).json({ message: 'Erro ao atualizar visto_por_ultimo', error: error.message });
                }
            }
    }

    static dificuldades = {
        getAll: async (req, res) => {
            try {
                const { Dificuldade } = require('../models');
                const dificuldades = await Dificuldade.findAll();
                res.status(200).json(dificuldades);
            } catch (error) {
                res.status(500).json({ message: 'Erro interno ao buscar dificuldades', error: error.message });
            }
        },
        create: async (req, res) => {
            try {
                const { Dificuldade } = require('../models');
                const { nivel } = req.body;
                if (!nivel) {
                    return res.status(400).json({ message: 'O nível da dificuldade é obrigatório.' });
                }
                const novaDificuldade = await Dificuldade.create({ nivel });
                res.status(201).json(novaDificuldade);
            } catch (error) {
                res.status(400).json({ message: 'Erro ao criar dificuldade', error: error.message });
            }
        },
        update: async (req, res) => {
            try {
                const { Dificuldade } = require('../models');
                const { id } = req.params;
                const { nivel } = req.body;
                const [updated] = await Dificuldade.update({ nivel }, { where: { id_dificuldade: id } });
                if (updated) {
                    const updatedDificuldade = await Dificuldade.findByPk(id);
                    res.status(200).json(updatedDificuldade);
                } else {
                    res.status(404).json({ message: 'Dificuldade não encontrada' });
                }
            } catch (error) {
                res.status(400).json({ message: 'Erro ao atualizar dificuldade', error: error.message });
            }
        },
        delete: async (req, res) => {
            try {
                const { Dificuldade } = require('../models');
                const { id } = req.params;
                const deleted = await Dificuldade.destroy({ where: { id_dificuldade: id } });
                if (deleted) {
                    res.status(204).send();
                } else {
                    res.status(404).json({ message: 'Dificuldade não encontrada' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Erro ao deletar dificuldade', error: error.message });
            }
        }
    }
    
    static questoes = {
        delete: async (req, res) => {
            try {
                const { id } = req.params;

                const questao = await Questao.findByPk(id);

                if (!questao) {
                    throw new Error("Questão nao encontrada");
                }

                await Opcao.destroy({
                    where: { id_questao: questao.id_questao }
                });

                await questao.destroy();

                res.status(200).redirect('/professor/questoes')
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
        },
        register: async (req, res) => {
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
        },
        edit: async (req, res) => { // ! Antigo UpdateQuestaoController
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
        },
        addImage: async (req, res) => { // ? Antigo uploads/editorImageUploadController.js
            try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                const url = `/uploads/${req.file.filename}`;

                if (!url) {
                    throw new Error('Erro no upload da imagem');
                }

                res.status(200).json(url);

            } catch (error) {

                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect( req.get("Referrer") || "/");
            }
        }
    }

    static simulados = {
        addQuestion: async (req, res) => {
            const { simuladoId } = req.params;
            const { selectedQuestionIds } = req.body;

            try {
                const idsInteiros = selectedQuestionIds.split(',').map(Number);

                const simulado = await Simulado.findByPk(simuladoId);

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }
                if (!idsInteiros) {
                    throw new Error('Questões não selecionadas.');
                }

                await simulado.addQuestao(idsInteiros);

                res.redirect(`/simulados/meus-simulados`);
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
        },
        edit: async (req, res) => {
            const { simuladoId } = req.params;
            const { titulo, descricao, tipo } = req.body;

            try {
                if (!titulo || !descricao || !tipo) {
                    throw new Error("Dados Invalidos !!! ")
                }

                const [updated] = await Simulado.update({
                    titulo: titulo,
                    descricao: descricao,
                    tipo: tipo
                }, {
                    where: {
                        id_simulado: simuladoId
                    }
                });

                if (!updated) {
                    throw new Error('Simulado não encontrado ou não atualizado');
                }
                res.redirect("/simulados/meus-simulados")
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
        },
        register: async (req, res) => {
            const { titulo, descricao, tipo, modo, selectedQuestionIds } = req.body;
            const usuarioId = req.session.userId;
            try {

                if (!titulo || !descricao || !tipo ) {
                    return res.status(400).json({ message: 'Dados inválidos: título, descrição, tipo e modo são obrigatórios.' });
                }


                if (!usuarioId) {
                    return res.status(401).json({ message: 'Usuário não autenticado.' });
                }

                if (!selectedQuestionIds || !Array.isArray(selectedQuestionIds) || selectedQuestionIds.length === 0) {
                    return res.status(400).json({ message: 'Nenhuma questão selecionada.' });
                }

                // Format tipo to uppercase
                const tipoFormatado = tipo.toUpperCase();

                // Convert selectedQuestionIds to integers and filter out invalid IDs
                const idsInteiros = selectedQuestionIds
                    .map(id => parseInt(id, 10))
                    .filter(id => !isNaN(id));

                if (idsInteiros.length === 0) {
                    return res.status(400).json({ message: 'IDs de questões inválidos.' });
                }

                // Create simulado
                const simulado = await Simulado.create({
                    titulo,
                    descricao,
                    id_usuario: usuarioId,
                    tipo: tipoFormatado,
                    modo, // Include modo if your model supports it
                });

                if (!simulado) {
                    return res.status(500).json({ message: 'Erro ao criar simulado.' });
                }

                // Associate questions with simulado
                await simulado.addQuestao(idsInteiros);

                // Send success response
                return res.status(201).json({ message: 'Simulado criado com sucesso!' });

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
        },
        removeQuestion: async (req, res) => {
            const { simuladoId } = req.params;
            const { questoesSelecionadas } = req.body;

            try {
                // Primeiro, verifique se o simulado existe
                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }]
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }
                if (!questoesSelecionadas || questoesSelecionadas.length === 0) {
                    throw new Error('Questões não selecionadas.');
                }

                await simulado.removeQuestao(questoesSelecionadas);

                res.redirect(`/simulados/meus-simulados`);
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
        },
        delete: async (req, res) => {
            const { simuladoId } = req.params;

            try {
                const simulado = await Simulado.findByPk(simuladoId, {
                    include: [{
                        model: Questao,
                        as: 'Questao'
                    }]
                });

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }

                await simulado.destroy()

                res.redirect(`/simulados/meus-simulados`);
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
        },
        submit: async (req, res) => {
            const { questoes, respostas } = req.body;
            const { userId } = req.session;
            const { simuladoId } = req.params;
            const respostasDissertativas = respostas;

            try {
                const simulado = await Simulado.findByPk(simuladoId)

                if (!simulado) {
                    throw new Error('Simulado nao encontrado.');
                }

                if (questoes && Object.keys(questoes).length > 0) {

                    const questoesObj = questoes.reduce((acc, item) => {
                        const [questaoId, opcaoId] = item.split('-');
                        acc[questaoId] = opcaoId;
                        return acc;
                    }, {});



                    for (let questaoId in questoesObj) {
                        const opcaoId = questoesObj[questaoId];

                        await Resposta.create({
                            resposta: "", // O ID da opção é salvo no campo resposta
                            tipo: 'OBJETIVA',
                            id_opcao: opcaoId,
                            id_usuario: userId, // Ajuste conforme necessário
                            id_simulado: simuladoId, // Ajuste conforme necessário
                            id_questao: questaoId,
                        });
                    }
                }

                // Processa as respostas dissertativas, se houver
                if (respostasDissertativas && Object.keys(respostasDissertativas).length > 0) {
                    for (let key in respostasDissertativas) {
                        const questaoId = key.replace('questao_', '');
                        const resposta = respostasDissertativas[key];

                        await Resposta.create({
                            resposta: resposta,
                            tipo: 'DISSERTATIVA',
                            id_usuario: userId, // Ajuste conforme necessário
                            id_simulado: simuladoId, // Ajuste conforme necessário
                            id_questao: questaoId,
                        });
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 1000));


                res.status(200).redirect(`/simulados/${simulado.id_simulado}/gabarito`)


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
        },
    }

    static topicos = {
        edit: async (req, res) => {
            const { id, nome } = req.body;
            try {
                // Encontre o tópico pelo ID
                const topico = await Topico.findByPk(id);

                if (!topico) {
                    throw new Error('Tópico não encontrado.');
                }

                if (!nome) {
                    throw new Error('Nome não pode ser vazio.');
                }

                await topico.update({ nome });

                res.redirect('/professor/topicos');
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
        },
        register: async (req, res) => {
            const { topico, areaIdTopico } = req.body;
            const usuarioId = req.session.userId;
            const referer = req.headers.referer || '';

            try {

                // Verifica se os campos obrigatórios estão preenchidos
                if (!topico || !areaIdTopico || !usuarioId) {
                    throw new Error('Os campos tópico e areaId são obrigatórios.');
                }

                const novoTopico = await Topico.create({
                    nome: topico,
                    id_area: areaIdTopico,
                    id_usuario: usuarioId
                });

                // Verifica a URL de origem e responde adequadamente
                if (referer.includes('/professor/topicos/criar')) {
                    return res.redirect('/professor/topicos');
                } else if (referer.includes('/professor/questoes')) {
                    return res.status(201).json(novoTopico);
                }

                // Fallback para qualquer outra origem
                return res.status(201).json(novoTopico);

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
        },
        getAll: async (req, res) => {
            const { id } = req.params;

            try {

                const topics = await Topico.findAll({
                    where: { id_area: id },
                });

                res.status(200).json(topics);
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
        },
    }

    static usuarios = {
        changeImg: async (req, res) => { // ? Antigo uploads/profileImageUploadControllers.js
            try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                const idUsuario = req.session.userId;
                const caminhoImagem = `/uploads/${req.file.filename}`;

                // Obtém o usuário atual
                const usuario = await Usuario.findByPk(idUsuario);

                // Remove a imagem antiga se existir
                if (usuario.imagem_perfil) {
                    removeFileFromUploads(usuario.imagem_perfil);
                }

                // Verifica se uma nova imagem foi recebida
                if (!caminhoImagem) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                // Atualiza o banco de dados com a nova imagem
                await Usuario.update({ imagem_perfil: caminhoImagem }, { where: { id_usuario: idUsuario } });

                // Atualiza a sessão com a nova imagem
                req.session.imagemPerfil = caminhoImagem;

                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Redireciona para a página de perfil
                res.status(200).redirect(`/usuario/perfil`);
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
        },
        delete: async (req, res) => {
            const id = req.session.userId;
            try {
                if (id != req.params.id) {
                    throw new Error("Erro ao excluir usuario")
                }

                await Usuario.destroy({
                    where: {
                        id_usuario: req.params.id
                    }
                }
                );
                req.session.destroy();
                res.status(200).redirect('/usuario/login');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect( req.get("Referrer") || "/");
            }
        },
        edit: async (req, res) => {
            const id = req.session.userId;
            const idUsuarioParaEditar = Number(req.params.id);
            try {

                // Verifica se o usuário está tentando editar seu próprio perfil
                if (id !== idUsuarioParaEditar) {
                    req.session.destroy();
                    return res.redirect('/usuario/login');
                }

                const { senha, nome, usuario, email, novasenha } = req.body;

                // Verifica se pelo menos um campo foi preenchido
                if (!nome && !usuario && !email && !senha && !novasenha) {
                    throw new Error('Pelo menos um campo deve ser preenchido.');
                }

                // Objeto para armazenar os campos a serem atualizados
                const updateFields = {};

                // Flag para verificar se a senha foi alterada
                let senhaAlterada = false;


                if (senha && novasenha) {
                    const usuarioAtual = await Usuario.findByPk(idUsuarioParaEditar);

                    if (!usuarioAtual) {
                        throw new Error('Usuario não encontrado.');
                    }

                    const senhaCorreta = await bcrypt.compare(senha, usuarioAtual.senha);

                    if (!senhaCorreta) {
                        throw new Error('A senha atual está incorreta.');
                    }

                    updateFields.senha = await bcrypt.hash(novasenha, 10);

                    if (!updateFields.senha) {
                        throw new Error('Erro ao processar nova senha.');
                    }

                    senhaAlterada = true;
                }

                // Adiciona campos não vazios ao objeto de atualização
                if (nome) updateFields.nome = nome;
                if (usuario) updateFields.usuario = usuario;
                if (email) updateFields.email = email;

                // Realiza a atualização em uma única chamada se houver campos para atualizar
                if (Object.keys(updateFields).length > 0) {
                    await Usuario.update(updateFields, {
                        where: { id_usuario: idUsuarioParaEditar }
                    });

                    // Atualiza a sessão com os novos dados
                    if (nome) {
                        req.session.nomeUsuario = nome;
                    }
                    if (usuario) {
                        req.session.nomeUsuario = usuario;
                    }
                    // Força a sessão a salvar as alterações
                    await new Promise((resolve) => req.session.save(resolve));
                }

                // Se a senha foi alterada, desloga o usuário
                if (senhaAlterada) {
                    req.session.destroy();
                    return res.status(200).redirect('/usuario/login');
                }

                res.status(200).redirect(`/usuario/perfil`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect( req.get("Referrer") || "/");
            }
        }
    }

    static moduloRevisao = {
        buscarArea: async (req, res) => {
            /*
            Objetivo: Realizar a busca de áreas e retornar a área mais provavel
            Recebe: Query de busca
            Retorna: Lista de resultados mais provaveis
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
        buscarTopico: async (req, res) => {
            /*
            Objetivo: 
            Recebe: 
            Retorna: 
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
        buscarMaterial: async (req, res) => {
            /*
            Objetivo: 
            Recebe: 
            Retorna: 
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
        criarMaterial: async (req, res) => {
            /*
            Objetivo: Guardar um material novo no banco de dados
            Recebe: Dados de um novo material
            Retorna: Nada ou redireciona pra alguma pagina
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
        editarMaterial: async (req, res) => {
            /*
            Objetivo: Editar um material já existente
            Recebe: 
            Retorna: 
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
        removerMaterial: async (req, res) => {
            /*
            Objetivo: 
            Recebe: 
            Retorna: 
            */
            /*
            ! Fluxo esperado
            * Passo 1 // ? Pendente
            * Passo 2 // ? Pendente
            * Passo 3 // ? Pendente
            */
        },
    }
}

exports.Database = Database;


