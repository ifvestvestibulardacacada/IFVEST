const { Conteudo, MaterialExterno, PalavraChave } = require('../../../models')

module.exports = async (req, res) => {
    try {

        const { nomeUsuario, imagemPerfil, perfil, userId } = req.session;
        const limit = 10; // Número de Questao por página

        const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
        const offset = (page - 1) * limit;
        const conteudoCount = await Conteudo.count({
            where: {
                id_usuario: userId,
            },
        });

        const totalPages = Math.ceil(conteudoCount / limit);

        const Conteudos = await Conteudo.findAll({
            include: [{
                model: MaterialExterno,
                as: 'MaterialExterno',
                through: { attributes: [] }
            },
            {
                model: PalavraChave,
                as: 'PalavraChave',
                through: { attributes: [] }
            }],
            where: {
                id_usuario: userId,
            },
            limit: limit,
            offset: offset

        });

        res.render('meus_materiais', { totalPages, page, nomeUsuario, perfilUsuario: perfil, imagemPerfil, Conteudos });


    } catch (error) {
        console.error(error)
        res.redirect(req.get("Referrer") || "/");
    }
}