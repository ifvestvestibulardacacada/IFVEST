 

            const { Conteudo, PalavraChave, sequelize } = require('../../../models');


module.exports = async (req, res) => {

const { id_conteudo } = req.params;
            const transaction = await sequelize.transaction();
            try {
                const conteudo = await Conteudo.findByPk(id_conteudo, {
                    transaction
                });
                if (!conteudo) {
                    return res.status(404).json({ message: 'Conteúdo não encontrado.' });
                }
                await conteudo.setPalavraChave([], { transaction });

                // Exclui o Conteudo
                await conteudo.destroy({ transaction });

                await transaction.commit();
                return res.status(200).redirect('/revisao/meus_materiais');
         



            } catch (error) {
                await transaction.rollback();
                console.error('Erro ao buscar conteúdo:', error);
                return res.status(500).json({ message: 'Erro interno do servidor.' });
            }
}