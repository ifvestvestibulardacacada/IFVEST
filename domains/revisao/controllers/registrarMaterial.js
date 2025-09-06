const { Conteudo, MaterialExterno, PalavraChave, sequelize } = require('../../../models');


module.exports = async (req, res) => {

    const { titulo, assuntoId, palavrasChave, conteudo, linksExternos } = req.body;

    const userId = req.session.userId;

    const transaction = await sequelize.transaction(); // Inicia a transação
    try {

        if (!titulo || !assuntoId || !conteudo) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        if (!palavrasChave || !Array.isArray(palavrasChave)) {
            return res.status(400).json({ message: 'Palavras-chave devem ser um array.' });
        }
        if (palavrasChave.length === 0 && linksExternos.length === 0) {
            return res.status(400).json({ message: 'Pelo menos uma palavra-chave e um link externo deve ser fornecida.' });
        }


        const ConteudoCriado = await Conteudo.create(
            {
                nome: titulo,
                id_usuario: userId,
                id_assunto: assuntoId,
                conteudo_markdown: conteudo,
                contagem_leitura: 0,
            },
            { transaction }
        );

        const idsPalavrasChave = [];
        const idsMaterialExterno = [];

        // Processa palavras-chave
        for (const palavra of palavrasChave) {
            let palavraChave = await PalavraChave.findOne({
                where: { palavrachave: palavra },
                transaction,
            });

            if (palavraChave) {
                idsPalavrasChave.push(palavraChave.id_palavrachave);
            } else {
                palavraChave = await PalavraChave.create(
                    { palavrachave: palavra },
                    { transaction }
                );
                idsPalavrasChave.push(palavraChave.id_palavrachave);
            }
        }

        // Processa links externos
        for (const link of linksExternos) {
            let linkExterno = await MaterialExterno.findOne({
                where: { material: link },
                transaction,
            });

            if (linkExterno) {
                idsMaterialExterno.push(linkExterno.id_material_externo);
            } else {
                linkExterno = await MaterialExterno.create(
                    { material: link },
                    { transaction }
                );
                idsMaterialExterno.push(linkExterno.id_material_externo);
            }
        }

        await ConteudoCriado.setPalavraChave(idsPalavrasChave, { transaction });
        await ConteudoCriado.setMaterialExterno(idsMaterialExterno, { transaction });

        // Confirma a transação
        await transaction.commit();
        res.status(201).json({
            conteudo: ConteudoCriado,
            palavrasChave: idsPalavrasChave,
            linksExternos: idsMaterialExterno,
        });
    } catch (error) {
        // Desfaz a transação em caso de erro
        await transaction.rollback();
        console.error('Erro ao criar conteúdo:', error);
        res.status(500).json({ error: 'Falha ao criar conteúdo' });
    }
}