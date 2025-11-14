const { sequelize } = require("../../../models");
const { Conteudo, PalavraChave } = require('../../../models');
const MarkdownSolver = require('../utils/MarkdownSolver')

module.exports = async (req, res) => {
            const { id_conteudo } = req.params;
            let { titulo, assuntoId, palavrasChave, conteudo, linksExternos } = req.body;
            const userId = req.session.userId;

            const transaction = await sequelize.transaction();
            try {


                if (!titulo || !assuntoId || !conteudo) {
                    return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
                }

                if (!Array.isArray(palavrasChave) || !Array.isArray(linksExternos)) {
                    return res.status(400).json({ message: 'Palavras-chave e links externos devem ser arrays.' });
                }

                if (palavrasChave.length === 0 && linksExternos.length === 0) {
                    return res.status(400).json({ message: 'Pelo menos uma palavra-chave ou um link externo deve ser fornecido.' });
                }

                // Processa links externos se fornecidos
                if (linksExternos && Array.isArray(linksExternos) && linksExternos.length > 0) {
                    conteudo = MarkdownSolver.mergeReference(
                        conteudo,
                        linksExternos
                    )
                }

                const conteudoEditado = await Conteudo.findOne({
                    where: { id_conteudo: id_conteudo, id_usuario: userId },
                    transaction
                });

                if (!conteudoEditado) {
                    await transaction.rollback();
                    return res.status(404).json({
                        message: conteudo ? 'Você não tem permissão para editar este conteúdo.' : 'Conteúdo não encontrado.'
                    });
                }

                const updates = {};
                if (titulo && titulo !== conteudoEditado.nome) updates.nome = titulo;
                if (conteudo && conteudo !== conteudoEditado.conteudo_markdown) updates.conteudo_markdown = conteudo;
                if (assuntoId && assuntoId !== conteudoEditado.id_assunto) updates.id_assunto = assuntoId;


                if (Object.keys(updates).length > 0) {
                    await conteudoEditado.update(updates, { transaction });
                }

                const idsPalavrasChave = await Promise.all(palavrasChave.map(async (palavra) => {
                    const [palavraChave, created] = await PalavraChave.findOrCreate({
                        where: { palavrachave: palavra },
                        defaults: { palavrachave: palavra },
                        transaction
                    });
                    return palavraChave.id_palavrachave;
                }));

                

                // Atualiza associações
                await conteudoEditado.setPalavraChave(idsPalavrasChave, { transaction });

                await transaction.commit();
                return res.status(200).json({
                    message: 'Conteúdo atualizado com sucesso.',
                    conteudo: {
                        id: conteudoEditado.id_conteudo,
                        nome: conteudoEditado.nome,

                        assuntoId: conteudoEditado.id_assunto,
                        palavrasChave: idsPalavrasChave,
                    }
                });

            } catch (error) {
                await transaction.rollback();
                console.error('Erro ao editar material:', error);
                return res.status(500).json({ message: 'Erro interno do servidor.' });
            }
        }