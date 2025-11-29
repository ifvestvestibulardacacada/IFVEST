const {Flashcard} = require('../../../models');

module.exports = async (req, res) => {
  try {
    const { pergunta, resposta, id_area, id_topico, id_dificuldade } = req.body;

    const created = await Flashcard.create({ 
      pergunta, resposta, id_area, id_topico, id_dificuldade 
    });
    if (!created) throw new Error('Flashcard não foi criado');
    
    // Mensagem de sucesso
    if (req.session) {
      req.session.successMessage = 'Flashcard criado com sucesso!';
      try {
        await new Promise((resolve, reject) =>
          req.session.save(err => (err ? reject(err) : resolve()))
        );
      } catch (_) {}
    }
    
    return res.redirect('/flashcards');
  } catch (error) {
    console.error(error);
    if (req.session) {
      req.session.errorMessage = error.message || 'Erro ao criar flashcard';
      try {
        await new Promise((resolve, reject) =>
          req.session.save(err => (err ? reject(err) : resolve()))
        );
      } catch (_) {}
    }
    return res.status(400).redirect(req.get('Referrer') || '/flashcards');
  }
}