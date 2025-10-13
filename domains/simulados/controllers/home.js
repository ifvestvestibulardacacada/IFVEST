

module.exports = async (req, res) => {
    const { nomeUsuario, perfil, imagemPerfil } = req.session;

    res.render('home', {
        nomeUsuario, 
        perfilUsuario: perfil, 
        imagemPerfil
    })
}