const {Area, Topico, Dificuldade} = require('../../../models');

module.exports = async (req, res) => {
    try {
        const nomeUsuario = req.session.nomeUsuario;
        const perfilUsuario = req.session.perfil;
        const imagemPerfil = req.session.imagemPerfil;
        const [areas, topicos, dificuldades] = await Promise.all([
            Area.findAll(),
            Topico.findAll(),
            Dificuldade.findAll(),
        ]);
        res.render('criar', { areas, topicos, dificuldades, nomeUsuario, perfilUsuario, imagemPerfil });
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de criação de flashcard.');
    }
}