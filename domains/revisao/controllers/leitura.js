const { Conteudo } = require('../../../models')

module.exports = async (req, res) => {
    const { nomeUsuario, perfil, imagemPerfil } = req.session;

    const { id_conteudo } = req.params

    const conteudo = await Conteudo.findByPk(id_conteudo) || null



    res.render('leitura', {
        conteudo,
        nomeUsuario, 
        perfilUsuario: perfil, 
        imagemPerfil
    })
}