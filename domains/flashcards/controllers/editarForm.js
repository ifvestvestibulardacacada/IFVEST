const {Area, Topico, Dificuldade, Flashcard} = require('../../../models');

module.exports = async (req, res) => {
  try {
      const { id } = req.params;
      const nomeUsuario = req.session.nomeUsuario;
      const perfilUsuario = req.session.perfil;
      const imagemPerfil = req.session.imagemPerfil;
      
      // Captura mensagens da sessão
      const successMessage = req.session.successMessage;
      const errorMessage = req.session.errorMessage;
      delete req.session.successMessage;
      delete req.session.errorMessage;
      
      const [flashcard, areas, topicos, dificuldades] = await Promise.all([
          Flashcard.findByPk(id),
          Area.findAll(),
          Topico.findAll(),
          Dificuldade.findAll(),
      ]);
      if (!flashcard) return res.status(404).send('Flashcard não encontrado');
      res.render('editar', { 
          flashcard, 
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
      res.status(500).send('Erro ao carregar formulário de edição de flashcard.');
  }
}