const {Area, Topico, Dificuldade} = require('../../../models');

module.exports = async (req, res) => {
    try {
        const nomeUsuario = req.session.nomeUsuario;
        const perfilUsuario = req.session.perfil;
        const imagemPerfil = req.session.imagemPerfil;
        
        // Captura mensagens da sessão
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        delete req.session.successMessage;
        delete req.session.errorMessage;
        
        const [areas, topicos, dificuldades] = await Promise.all([
            Area.findAll(),
            Topico.findAll(),
            Dificuldade.findAll(),
        ]);
        res.render('criar', { 
            areas, 
            topicos, 
            dificuldades, 
            nomeUsuario, 
            perfilUsuario, 
            imagemPerfil,
            successMessage,
            errorMessage
        });
    } catch (error) {
        res.status(500).send('Erro ao carregar formulário de criação de flashcard.');
    }
}