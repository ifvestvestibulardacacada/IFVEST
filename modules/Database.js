const { Usuario } = require('../models');
const { Questões } = require('../models');
const { Opcao } = require('../models');
const { Simulados } = require('../models');
const { Resposta } = require('../models');
const { Topico } = require('../models');
const { removeFileFromUploads } = require('../utils/removeImage')
const { atualizarRelacaoTopicos } = require('../utils/AreaTopicoUtil')
const bcrypt = require('bcrypt');

class Database {
    static questoes = {
        delete: async (req, res) => {
            try {
                const { id } = req.params;

                // Busca a questão pelo ID
                const questao = await Questões.findByPk(id);

                if (!questao) {
                    return res.status(404).send('Questão não encontrada');
                }

                // Exclui as opções da questão
                await Opcao.destroy({
                    where: { questao_id: questao.id }
                });

                // Exclui a questão
                await questao.destroy();

                res.status(200).redirect('/usuario/inicioLogado')
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back')
            }
        },
        register: async (req, res) => {
            try {
                const { titulo, pergunta, areaId, correta, topicosSelecionados, respostasSelecionadas } = req.body;
                const tipo = req.params.tipo.toUpperCase()

                if (!respostasSelecionadas) {
                    throw new Error("Respostas não pode ser vazio")
                }


                const ArrayRespostas = JSON.parse(respostasSelecionadas);

                const numOpcoes = Object.keys(ArrayRespostas).length;

                const alternativas = ['A', 'B', 'C', 'D', 'E'];

                const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
                    alternativa,
                    descricao: ArrayRespostas[`#opcao${alternativa}`]  // Descrição padrão se não existir
                }));

                const usuarioId = req.session.userId;

                if (!topicosSelecionados) {
                    throw new Error("Selecione pelo menos um tópico")
                }


                const createQuestao = await Questões.create({
                    pergunta: pergunta,
                    titulo,
                    areaId,
                    usuarioId,
                    tipo // Usa o novo ID do vestibular
                });


                await createQuestao.addTopicos(topicosSelecionados)

                for (let opcao of opcoes) {
                    let isTrue = correta === opcao.alternativa ? true : false;
                    await Opcao.create({
                        questao_id: createQuestao.id,
                        descricao: JSON.stringify(opcao.descricao),
                        alternativa: opcao.alternativa,
                        correta: isTrue

                    })
                }

                res.status(201).redirect('/usuario/inicioLogado');
            } catch (err) {
                console.error(err);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        edit: async (req, res) => { // ! Antigo UpdateQuestaoController
            try {
                const { id, titulo, pergunta, correta, respostasSelecionadas } = req.body;
                const { areaId, topicosSelecionados } = req.body;

                const ArrayRespostas = JSON.parse(respostasSelecionadas)


                const numOpcoes = Object.keys(ArrayRespostas).length;

                const alternativas = ['A', 'B', 'C', 'D', 'E'];

                const opcoes = alternativas.slice(0, numOpcoes).map(alternativa => ({
                    alternativa,
                    descricao: ArrayRespostas[`#opcao${alternativa}`].content,
                    id: ArrayRespostas[`#opcao${alternativa}`].id// Descrição padrão se não existir
                }));


                await atualizarRelacaoTopicos(id, topicosSelecionados, areaId);

                const questao = await Questões.findByPk(id, {
                    include: [{
                        model: Opcao,
                        as: 'Opcoes'
                    }
                    ]
                });

                if (!questao) {
                    return res.status(404).send('Questão não encontrada');
                }

                await Questões.update({
                    titulo: titulo,
                    pergunta: pergunta,


                }, {
                    where: { id: id }
                });

                if (!opcoes) {
                    throw new Error("Selected answers cannot be empty");
                }
                for (let opcao of opcoes) {
                    // Inicializa o objeto de atualização
                    const updateData = {
                        descricao: JSON.stringify(opcao.descricao),
                        alternativa: opcao.alternativa,
                    };


                    if (correta) {
                        updateData.correta = correta === opcao.alternativa;
                    }

                    await Opcao.update(updateData, {
                        where: { id: opcao.id }
                    });
                }
                res.redirect('/professor/questoes');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back')
            }
        },
        addImage: async (req, res) => { // ? Antigo uploads/editorImageUploadController.js
            try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                const url = `/uploads/${req.file.filename}`;

                // Retorna a URL da imagem como JSON
                res.status(200).json(url);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back');
            }
        }
    }
    static simulados = {
        addQuestion: async (req, res) => {
            try {
                const { simuladoId } = req.params;
                const { selectedQuestionIds } = req.body;

                const idsInteiros = selectedQuestionIds.split(',').map(Number);

                const simulado = await Simulados.findByPk(simuladoId);

                if (!simulado) {
                    throw new Error('Simulado não encontrado.');
                }
                if (!idsInteiros) {
                    throw new Error('Questões não selecionadas.');
                }

                await simulado.addQuestões(idsInteiros);

                res.redirect(`/simulados/meus-simulados`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        edit: async (req, res) => {
            try {
                const { simuladoId } = req.params;
                const { titulo, descricao, tipo } = req.body;

                const [updated] = await Simulados.update({
                    titulo: titulo,
                    descricao: descricao,
                    tipo: tipo
                }, {
                    where: {
                        id: simuladoId
                    }
                });

                if (!updated) {
                    throw new Error('Simulado não encontrado ou não atualizado');
                }
                res.redirect("/simulados/meus-simulados")
            } catch (error) {
                console.error(error);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        register: async (req, res) => {
            const { titulo, descricao, tipo } = req.body;
            const usuarioId = req.session.userId;
            const tipoformatado = tipo.toUpperCase()

            if (!titulo || !descricao || !tipo) {
                throw new Error("Dados Invalidos !!! ")
            }

            try {
                const simulado = await Simulados.create({
                    titulo,
                    descricao,
                    usuarioId: usuarioId,
                    tipo: tipoformatado
                });

                if (!simulado) {
                    throw new Error("Simulado não criado!!! ")
                }

                res.redirect(`/simulados/${simulado.id}/adicionar-questoes`);
            } catch (err) {
                console.error(err);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        removeQuestion: async (req, res) => {
            try {
                const { simuladoId } = req.params;
                const { questoesSelecionadas } = req.body;

                // Primeiro, verifique se o simulado existe
                const simulado = await Simulados.findByPk(simuladoId, {
                    include: [{
                        model: Questões,
                        as: 'Questões'
                    }]
                });

                if (!simulado) {
                    return res.status(404).send('Simulado não encontrado.');
                }
                if (!questoesSelecionadas || questoesSelecionadas.length === 0) {
                    return res.status(404).send('Questões não selecionadas.');
                }

                // Agora, remova as questões do simulado usando o método removeQuestoes
                // Este método é fornecido pelo Sequelize para associações belongsToMany
                await simulado.removeQuestões(questoesSelecionadas);

                res.redirect(`/simulados/`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        submit: async (req, res) => {
            const { questoes, respostas } = req.body;
            const { userId } = req.session;
            const { simuladoId } = req.params;
            const respostasDissertativas = respostas;

            console.log(`
                
                    SESSAO NA SUBMISSAO DE SIMULADO

                    ${JSON.stringify(req.session)}
                
                `)

            const simulado = await Simulados.findByPk(simuladoId)
            try {
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
                            opcaoId: opcaoId,
                            usuarioId: userId, // Ajuste conforme necessário
                            simuladoId: simuladoId, // Ajuste conforme necessário
                            questaoId: questaoId,
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
                            usuarioId: userId, // Ajuste conforme necessário
                            simuladoId: simuladoId, // Ajuste conforme necessário
                            questaoId: questaoId,
                        });
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000));


                res.status(200).redirect(`/simulados/${simulado.id}/gabarito`)

                
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back')
            }
        },
    }
    static topicos = {
        edit: async (req, res) => {
            try {
                const { id, materia } = req.body;
                // Encontre o tópico pelo ID
                const topico = await Topico.findByPk(id);
                if (!topico) {
                    return res.status(404).send('Tópico não encontrado.');
                }
                // Atualize o tópico com a nova matéria
                await topico.update({ materia });
                res.redirect('/professor/topicos');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back')
            }
        },
        register: async (req, res) => {
            try {
                const { topico, areaIdTopico } = req.body;
                const usuarioId = req.session.userId;

                // Verifica se os campos obrigatórios estão preenchidos
                if (!topico || !areaIdTopico || !usuarioId) {
                    throw new Error('Os campos tópico e areaId são obrigatórios.');
                }

                // Cria um novo tópico
                const novoTopico = await Topico.create({
                    materia: topico, // Supondo que cada tópico seja uma string
                    areaId: areaIdTopico, // Corrigido para usar areaIdTopico
                    usuarioId: usuarioId
                });

                // Retorna o novo tópico criado como resposta JSON
                return res.status(201).json(novoTopico); // Status 201 para criação bem-sucedida

            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back')
            }
        },
        getAll: async (req, res) => {
            const { id } = req.params;

            try {
                const topics = await Topico.findAll({
                    where: { areaId: id },
                    // Selecione apenas os atributos necessários
                });

                res.status(200).json(topics);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erro ao buscar tópicos' });
            }
        },
    }
    // static uploads = { // ! Inutilizado

    // }
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
                if (usuario.imagemPerfil) {
                    removeFileFromUploads(usuario.imagemPerfil);
                }

                // Verifica se uma nova imagem foi recebida
                if (!caminhoImagem) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                // Atualiza o banco de dados com a nova imagem
                await Usuario.update({ imagemPerfil: caminhoImagem }, { where: { id: idUsuario } });

                // Atualiza a sessão com a nova imagem
                req.session.imagemPerfil = caminhoImagem;

                // Redireciona para a página de perfil
                res.status(200).redirect(`/usuario/perfil`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                res.redirect('back');
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
                        id: req.params.id
                    }
                }
                );
                req.session.destroy();
                res.status(200).redirect('/usuario/login');
            } catch (err) {
                console.log(err)
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        },
        edit: async (req, res) => {
            try {
                const id = req.session.userId;
                const idUsuarioParaEditar = Number(req.params.id);

                if (id !== idUsuarioParaEditar) {
                    req.session.destroy();
                }

                const { senha, nome, usuario, email, novasenha } = req.body;

                if (!nome & !usuario & !email) {
                    throw new Error('Um dos campos deve ser preenchido.');
                }

                if (senha && novasenha) {
                    const usuarioAtual = await Usuario.findByPk(idUsuarioParaEditar);

                    if (!usuarioAtual) {
                        throw new Error('Usuario não encontrado.');
                    }

                    const senhaCorreta = await bcrypt.compare(senha, usuarioAtual.senha);

                    if (!senhaCorreta) {
                        throw new Error('A senha ou usuario atual está incorreto.');
                    }

                    const novaSenhaHash = await bcrypt.hash(novasenha, 10); // Hash da nova senha

                    if (!novaSenhaHash) {
                        throw new Error('Senha não alterada.');
                    }

                    await Usuario.update({ senha: novaSenhaHash }, { where: { id: idUsuarioParaEditar } });
                }


                nome ? await Usuario.update({ nome: nome }, { where: { id: idUsuarioParaEditar } }) : "";
                usuario ? await Usuario.update({ usuario: usuario }, { where: { id: idUsuarioParaEditar } }) : "";
                email ? await Usuario.update({ email: email }, { where: { id: idUsuarioParaEditar } }) : "";


                res.status(200).redirect(`/usuario/perfil`);
            } catch (err) {
                console.error(err);
                req.session.errorMessage = err.message;
                res.redirect('back')
            }
        }
    }
}

exports.Database = Database